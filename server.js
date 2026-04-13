import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

import Database from "better-sqlite3";
import dotenv from "dotenv";
import express from "express";
import nodemailer from "nodemailer";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const PORT = Number(process.env.PORT || 4185);
const APP_BASE_URL = process.env.APP_BASE_URL || `http://127.0.0.1:${PORT}`;
const PASS_THRESHOLD = 85;
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "app.db");
const KEY_FILE = path.join(DATA_DIR, "encryption.key");
const TRAINING_SOURCE = path.join(__dirname, "app.js");
const MICROSOFT_SCOPES = ["openid", "profile", "email", "offline_access", "User.Read", "Mail.Send"];

const DEFAULT_MAIL_SUBJECT = "Keynius Security Awareness Training";
const DEFAULT_MAIL_BODY = `
<div style="font-family: Inter, Arial, sans-serif; color: #232323; line-height: 1.6;">
  <h2 style="margin-bottom: 8px;">Keynius Security Awareness Training</h2>
  <p>You have been invited to complete the training.</p>
  <p>
    <a href="{{invite_link}}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#0044CE;color:#ffffff;text-decoration:none;font-weight:700;">
      Open training
    </a>
  </p>
  <p><strong>Access code:</strong> {{code}}</p>
  <p>You must complete all sections. A score of at least {{pass_threshold}}% is required to pass.</p>
  <p>If you have questions, contact the Security Officer.</p>
</div>
`.trim();

app.use(express.json({ limit: "1mb" }));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "public")));

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(KEY_FILE) && !process.env.APP_ENCRYPTION_KEY) {
    fs.writeFileSync(KEY_FILE, crypto.randomBytes(32).toString("base64"), { mode: 0o600 });
  }
}

function getEncryptionKey() {
  ensureStorage();

  if (process.env.APP_ENCRYPTION_KEY) {
    return crypto.createHash("sha256").update(process.env.APP_ENCRYPTION_KEY).digest();
  }

  return Buffer.from(fs.readFileSync(KEY_FILE, "utf8").trim(), "base64");
}

function encryptText(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `v1:${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
}

function decryptText(payload) {
  if (!payload) {
    return null;
  }

  const [version, iv, tag, encrypted] = String(payload).split(":");
  if (version !== "v1") {
    throw new Error("Unsupported encryption payload version.");
  }

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(iv, "base64")
  );
  decipher.setAuthTag(Buffer.from(tag, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64")),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
}

ensureStorage();
const sqlite = new Database(DB_FILE);
sqlite.pragma("journal_mode = WAL");
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS invites (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    token TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at TEXT NOT NULL,
    last_sent_at TEXT NOT NULL,
    passed_at TEXT
  );

  CREATE TABLE IF NOT EXISTS attempts (
    id TEXT PRIMARY KEY,
    invite_id TEXT NOT NULL,
    access_token TEXT NOT NULL,
    attempt_number INTEGER NOT NULL,
    status TEXT NOT NULL,
    current_topic_index INTEGER NOT NULL,
    started_at TEXT NOT NULL,
    submitted_at TEXT,
    topic_submissions_json TEXT NOT NULL,
    correct_answers INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    score_percent REAL NOT NULL,
    passed INTEGER NOT NULL,
    FOREIGN KEY(invite_id) REFERENCES invites(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    encrypted INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY,
    invite_id TEXT NOT NULL,
    attempt_id TEXT,
    event_type TEXT NOT NULL,
    topic_index INTEGER,
    question_index INTEGER,
    choice_index INTEGER,
    metadata_json TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY(invite_id) REFERENCES invites(id),
    FOREIGN KEY(attempt_id) REFERENCES attempts(id)
  );
`);

const upsertInviteStmt = sqlite.prepare(`
  INSERT INTO invites (id, email, token, code, created_at, last_sent_at, passed_at)
  VALUES (@id, @email, @token, @code, @created_at, @last_sent_at, @passed_at)
  ON CONFLICT(id) DO UPDATE SET
    email = excluded.email,
    token = excluded.token,
    code = excluded.code,
    created_at = excluded.created_at,
    last_sent_at = excluded.last_sent_at,
    passed_at = excluded.passed_at
`);

const upsertAttemptStmt = sqlite.prepare(`
  INSERT INTO attempts (
    id, invite_id, access_token, attempt_number, status, current_topic_index, started_at,
    submitted_at, topic_submissions_json, correct_answers, total_questions, score_percent, passed
  )
  VALUES (
    @id, @invite_id, @access_token, @attempt_number, @status, @current_topic_index, @started_at,
    @submitted_at, @topic_submissions_json, @correct_answers, @total_questions, @score_percent, @passed
  )
  ON CONFLICT(id) DO UPDATE SET
    invite_id = excluded.invite_id,
    access_token = excluded.access_token,
    attempt_number = excluded.attempt_number,
    status = excluded.status,
    current_topic_index = excluded.current_topic_index,
    started_at = excluded.started_at,
    submitted_at = excluded.submitted_at,
    topic_submissions_json = excluded.topic_submissions_json,
    correct_answers = excluded.correct_answers,
    total_questions = excluded.total_questions,
    score_percent = excluded.score_percent,
    passed = excluded.passed
`);

const insertActivityLogStmt = sqlite.prepare(`
  INSERT INTO activity_logs (
    id, invite_id, attempt_id, event_type, topic_index, question_index, choice_index, metadata_json, created_at
  )
  VALUES (
    @id, @invite_id, @attempt_id, @event_type, @topic_index, @question_index, @choice_index, @metadata_json, @created_at
  )
`);

function setSetting(key, value, { encrypted = false } = {}) {
  if (value === null || value === undefined || value === "") {
    sqlite.prepare("DELETE FROM settings WHERE key = ?").run(key);
    return;
  }

  const storedValue = encrypted ? encryptText(value) : String(value);
  sqlite
    .prepare(`
      INSERT INTO settings (key, value, encrypted, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        encrypted = excluded.encrypted,
        updated_at = excluded.updated_at
    `)
    .run(key, storedValue, encrypted ? 1 : 0, new Date().toISOString());
}

function getSetting(key, { decrypt = false, fallback = null } = {}) {
  const row = sqlite.prepare("SELECT value, encrypted FROM settings WHERE key = ?").get(key);
  if (!row || row.value === null || row.value === undefined) {
    return fallback;
  }

  if (decrypt) {
    return row.encrypted ? decryptText(row.value) : row.value;
  }

  return row.value;
}

function getBooleanSetting(key) {
  return getSetting(key) === "true";
}

function loadTopics() {
  const source = fs.readFileSync(TRAINING_SOURCE, "utf8");
  const match = source.match(/const topics = (\[[\s\S]*?\n\]);\n\nlet currentTopicIndex/);

  if (!match) {
    throw new Error("Could not load training topics from app.js.");
  }

  return vm.runInNewContext(match[1]);
}

function sanitizeTopicsForLearner(topics) {
  return topics.map((topic) => ({
    kicker: topic.kicker,
    title: topic.title,
    duration: topic.duration,
    summary: topic.summary,
    explanation: topic.explanation,
    rules: topic.rules,
    risks: topic.risks,
    image: topic.image,
    questions: topic.questions.map((question) => ({
      prompt: question.prompt,
      choices: question.choices.map((choice) => choice.text)
    }))
  }));
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function createPublicInviteEmail(sessionToken) {
  const hash = crypto.createHash("sha256").update(sessionToken).digest("hex").slice(0, 24);
  return `public-${hash}@awareness.local`;
}

function createCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function createCodeVerifier() {
  return crypto.randomBytes(32).toString("base64url");
}

function createCodeChallenge(codeVerifier) {
  return crypto.createHash("sha256").update(codeVerifier).digest("base64url");
}

function readDb() {
  const invites = sqlite
    .prepare("SELECT * FROM invites ORDER BY datetime(last_sent_at) DESC")
    .all()
    .map((row) => ({
      id: row.id,
      email: row.email,
      token: row.token,
      code: row.code,
      createdAt: row.created_at,
      lastSentAt: row.last_sent_at,
      passedAt: row.passed_at || null
    }));

  const attempts = sqlite
    .prepare("SELECT * FROM attempts ORDER BY datetime(started_at) DESC")
    .all()
    .map((row) => ({
      id: row.id,
      inviteId: row.invite_id,
      accessToken: row.access_token,
      attemptNumber: row.attempt_number,
      status: row.status,
      currentTopicIndex: row.current_topic_index,
      startedAt: row.started_at,
      submittedAt: row.submitted_at || null,
      topicSubmissions: JSON.parse(row.topic_submissions_json || "[]"),
      correctAnswers: row.correct_answers,
      totalQuestions: row.total_questions,
      scorePercent: row.score_percent,
      passed: Boolean(row.passed)
    }));

  return { invites, attempts };
}

function writeDb(db) {
  const transaction = sqlite.transaction(() => {
    const inviteIds = db.invites.map((invite) => invite.id);
    if (inviteIds.length) {
      sqlite
        .prepare(`DELETE FROM invites WHERE id NOT IN (${inviteIds.map(() => "?").join(",")})`)
        .run(...inviteIds);
    } else {
      sqlite.prepare("DELETE FROM invites").run();
    }

    db.invites.forEach((invite) => {
      upsertInviteStmt.run({
        id: invite.id,
        email: invite.email,
        token: invite.token,
        code: invite.code,
        created_at: invite.createdAt,
        last_sent_at: invite.lastSentAt,
        passed_at: invite.passedAt
      });
    });

    const attemptIds = db.attempts.map((attempt) => attempt.id);
    if (attemptIds.length) {
      sqlite
        .prepare(`DELETE FROM attempts WHERE id NOT IN (${attemptIds.map(() => "?").join(",")})`)
        .run(...attemptIds);
    } else {
      sqlite.prepare("DELETE FROM attempts").run();
    }

    db.attempts.forEach((attempt) => {
      upsertAttemptStmt.run({
        id: attempt.id,
        invite_id: attempt.inviteId,
        access_token: attempt.accessToken,
        attempt_number: attempt.attemptNumber,
        status: attempt.status,
        current_topic_index: attempt.currentTopicIndex,
        started_at: attempt.startedAt,
        submitted_at: attempt.submittedAt,
        topic_submissions_json: JSON.stringify(attempt.topicSubmissions || []),
        correct_answers: attempt.correctAnswers,
        total_questions: attempt.totalQuestions,
        score_percent: attempt.scorePercent,
        passed: attempt.passed ? 1 : 0
      });
    });
  });

  transaction();
}

function getInviteMailTemplate() {
  return {
    subject: getSetting("invite_mail_subject", { fallback: DEFAULT_MAIL_SUBJECT }),
    body: getSetting("invite_mail_body", { fallback: DEFAULT_MAIL_BODY })
  };
}

function saveInviteMailTemplate({ subject, body }) {
  setSetting("invite_mail_subject", subject || DEFAULT_MAIL_SUBJECT);
  setSetting("invite_mail_body", body || DEFAULT_MAIL_BODY);
}

function getMicrosoftOAuthConfig() {
  return {
    tenantId: getSetting("ms_tenant_id", { decrypt: true, fallback: process.env.MS_TENANT_ID || "organizations" }),
    clientId: getSetting("ms_client_id", { decrypt: true, fallback: process.env.MS_CLIENT_ID || "" }),
    clientSecret: getSetting("ms_client_secret", { decrypt: true, fallback: process.env.MS_CLIENT_SECRET || "" }),
    redirectUri: getSetting("ms_redirect_uri", { decrypt: true, fallback: process.env.MS_REDIRECT_URI || `${APP_BASE_URL}/auth/microsoft/callback` })
  };
}

function saveMicrosoftOAuthConfig({
  tenantId,
  clientId,
  clientSecret,
  redirectUri,
  clearClientSecret = false
}) {
  setSetting("ms_tenant_id", tenantId, { encrypted: true });
  setSetting("ms_client_id", clientId, { encrypted: true });
  if (clearClientSecret) {
    setSetting("ms_client_secret", null);
  } else if (clientSecret) {
    setSetting("ms_client_secret", clientSecret, { encrypted: true });
  }
  setSetting("ms_redirect_uri", redirectUri, { encrypted: true });
}

function hasMicrosoftClientSecret() {
  return Boolean(getSetting("ms_client_secret", { decrypt: true, fallback: process.env.MS_CLIENT_SECRET || "" }));
}

function clearMicrosoftOAuthConfig() {
  setSetting("ms_tenant_id", null);
  setSetting("ms_client_id", null);
  setSetting("ms_client_secret", null);
  setSetting("ms_redirect_uri", null);
}

function isMicrosoftOAuthConfigured() {
  const oauth = getMicrosoftOAuthConfig();
  return Boolean(oauth.tenantId && oauth.clientId && oauth.redirectUri);
}

function getMicrosoftConnection() {
  const email = getSetting("ms_connected_email", { decrypt: true });
  if (!email) {
    return null;
  }

  return {
    email,
    displayName: getSetting("ms_connected_display_name", { decrypt: true, fallback: "" }),
    accessToken: getSetting("ms_access_token", { decrypt: true }),
    refreshToken: getSetting("ms_refresh_token", { decrypt: true }),
    expiresAt: getSetting("ms_token_expires_at"),
    connectedAt: getSetting("ms_connected_at")
  };
}

function saveMicrosoftConnection(connection) {
  setSetting("ms_connected_email", connection.email, { encrypted: true });
  setSetting("ms_connected_display_name", connection.displayName || "", { encrypted: true });
  setSetting("ms_access_token", connection.accessToken, { encrypted: true });
  setSetting("ms_refresh_token", connection.refreshToken, { encrypted: true });
  setSetting("ms_token_expires_at", connection.expiresAt);
  setSetting("ms_connected_at", connection.connectedAt || new Date().toISOString());
}

function clearMicrosoftConnection() {
  setSetting("ms_connected_email", null);
  setSetting("ms_connected_display_name", null);
  setSetting("ms_access_token", null);
  setSetting("ms_refresh_token", null);
  setSetting("ms_token_expires_at", null);
  setSetting("ms_connected_at", null);
}

function saveMicrosoftAuthSession({ state, codeVerifier }) {
  setSetting("ms_oauth_state", state, { encrypted: true });
  setSetting("ms_oauth_code_verifier", codeVerifier, { encrypted: true });
}

function getMicrosoftAuthSession() {
  return {
    state: getSetting("ms_oauth_state", { decrypt: true }),
    codeVerifier: getSetting("ms_oauth_code_verifier", { decrypt: true })
  };
}

function clearMicrosoftAuthSession() {
  setSetting("ms_oauth_state", null);
  setSetting("ms_oauth_code_verifier", null);
}

function findInviteByToken(db, token) {
  return db.invites.find((invite) => invite.token === token);
}

function getAttemptsForInvite(db, inviteId) {
  return db.attempts.filter((attempt) => attempt.inviteId === inviteId);
}

function logActivity({
  inviteId,
  attemptId = null,
  eventType,
  topicIndex = null,
  questionIndex = null,
  choiceIndex = null,
  metadata = null
}) {
  insertActivityLogStmt.run({
    id: crypto.randomUUID(),
    invite_id: inviteId,
    attempt_id: attemptId,
    event_type: eventType,
    topic_index: Number.isInteger(topicIndex) ? topicIndex : null,
    question_index: Number.isInteger(questionIndex) ? questionIndex : null,
    choice_index: Number.isInteger(choiceIndex) ? choiceIndex : null,
    metadata_json: metadata ? JSON.stringify(metadata) : null,
    created_at: new Date().toISOString()
  });
}

function getLatestAttempt(db, inviteId) {
  return getAttemptsForInvite(db, inviteId)
    .slice()
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))[0];
}

function getActiveAttempt(db, inviteId) {
  return getAttemptsForInvite(db, inviteId).find((attempt) => attempt.status === "in_progress");
}

function getOrCreateInvite(db, email, { touchLastSentAt = false } = {}) {
  const normalizedEmail = normalizeEmail(email);
  const now = new Date().toISOString();
  let invite = db.invites.find((entry) => entry.email === normalizedEmail);

  if (!invite) {
    invite = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      token: crypto.randomUUID(),
      code: createCode(),
      createdAt: now,
      lastSentAt: now,
      passedAt: null
    };
    db.invites.push(invite);
  } else if (touchLastSentAt) {
    invite.lastSentAt = now;
  }

  return invite;
}

function createAttempt(db, inviteId) {
  const attempts = getAttemptsForInvite(db, inviteId);
  const now = new Date().toISOString();
  const attempt = {
    id: crypto.randomUUID(),
    inviteId,
    accessToken: crypto.randomUUID(),
    attemptNumber: attempts.length + 1,
    status: "in_progress",
    currentTopicIndex: 0,
    startedAt: now,
    submittedAt: null,
    topicSubmissions: [],
    correctAnswers: 0,
    totalQuestions: 0,
    scorePercent: 0,
    passed: false
  };

  db.attempts.push(attempt);
  return attempt;
}

function getScoreForAttempt(attempt, topics) {
  let correctAnswers = 0;
  let totalQuestions = 0;

  topics.forEach((topic, topicIndex) => {
    const submission = attempt.topicSubmissions.find((entry) => entry.topicIndex === topicIndex);
    if (!submission) {
      return;
    }

    topic.questions.forEach((question, questionIndex) => {
      const correctIndex = question.choices.findIndex((choice) => choice.correct);
      totalQuestions += 1;
      if (submission.answers[questionIndex] === correctIndex) {
        correctAnswers += 1;
      }
    });
  });

  const scorePercent = totalQuestions === 0 ? 0 : Math.round((correctAnswers / totalQuestions) * 1000) / 10;
  return {
    correctAnswers,
    totalQuestions,
    scorePercent,
    passed: totalQuestions > 0 && scorePercent >= PASS_THRESHOLD
  };
}

function summarizeInvite(db, invite) {
  const latestAttempt = getLatestAttempt(db, invite.id);
  const activeAttempt = getActiveAttempt(db, invite.id);

  let status = "Invited";
  if (invite.passedAt) {
    status = "Passed";
  } else if (activeAttempt) {
    status = "In progress";
  } else if (latestAttempt && latestAttempt.status === "completed" && !latestAttempt.passed) {
    status = "Retry required";
  }

  return {
    id: invite.id,
    email: invite.email,
    status,
    createdAt: invite.createdAt,
    lastSentAt: invite.lastSentAt,
    passedAt: invite.passedAt || null,
    attempts: getAttemptsForInvite(db, invite.id).length,
    latestScore: latestAttempt?.scorePercent ?? null
  };
}

function summarizeAttempt(db, attempt) {
  const invite = db.invites.find((entry) => entry.id === attempt.inviteId);

  return {
    id: attempt.id,
    email: invite?.email || "Unknown",
    attemptNumber: attempt.attemptNumber,
    startedAt: attempt.startedAt,
    submittedAt: attempt.submittedAt,
    status: attempt.status,
    scorePercent: attempt.scorePercent,
    correctAnswers: attempt.correctAnswers,
    totalQuestions: attempt.totalQuestions,
    passed: attempt.passed
  };
}

function renderTemplate(template, values) {
  return String(template).replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, key) => values[key] ?? "");
}

function htmlToText(html) {
  return String(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getInviteMessage(email, code, token) {
  const inviteLink = `${APP_BASE_URL}/invite/${token}`;
  const template = getInviteMailTemplate();
  const values = {
    invite_link: inviteLink,
    code,
    recipient_email: email,
    pass_threshold: String(PASS_THRESHOLD)
  };

  return {
    inviteLink,
    code,
    subject: renderTemplate(template.subject, values),
    html: renderTemplate(template.body, values),
    text: htmlToText(renderTemplate(template.body, values))
  };
}

function getMailTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

async function exchangeMicrosoftToken(params) {
  const oauth = getMicrosoftOAuthConfig();

  if (!isMicrosoftOAuthConfigured()) {
    throw new Error("Microsoft 365 OAuth is not configured yet.");
  }

  const form = new URLSearchParams({
    client_id: oauth.clientId,
    redirect_uri: oauth.redirectUri,
    ...params
  });

  if (oauth.clientSecret) {
    form.set("client_secret", oauth.clientSecret);
  }

  const response = await fetch(
    `https://login.microsoftonline.com/${oauth.tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || "Microsoft token exchange failed.");
  }

  return data;
}

async function fetchMicrosoftProfile(accessToken) {
  const response = await fetch("https://graph.microsoft.com/v1.0/me?$select=displayName,mail,userPrincipalName", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Could not load Microsoft account profile.");
  }

  return {
    displayName: data.displayName || "",
    email: data.mail || data.userPrincipalName || ""
  };
}

async function refreshMicrosoftAccessToken() {
  const connection = getMicrosoftConnection();
  if (!connection?.refreshToken) {
    throw new Error("No Microsoft refresh token is available.");
  }

  const tokenData = await exchangeMicrosoftToken({
    grant_type: "refresh_token",
    refresh_token: connection.refreshToken,
    scope: MICROSOFT_SCOPES.join(" ")
  });

  const updatedConnection = {
    ...connection,
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token || connection.refreshToken,
    expiresAt: new Date(Date.now() + (tokenData.expires_in - 120) * 1000).toISOString()
  };

  saveMicrosoftConnection(updatedConnection);
  return updatedConnection;
}

async function getMicrosoftAccessToken() {
  const connection = getMicrosoftConnection();
  if (!connection) {
    return null;
  }

  if (!connection.expiresAt || new Date(connection.expiresAt).getTime() <= Date.now()) {
    return refreshMicrosoftAccessToken();
  }

  return connection;
}

async function sendInviteEmailWithMicrosoft({ email, code, token }) {
  const connection = await getMicrosoftAccessToken();
  if (!connection) {
    return null;
  }

  const message = getInviteMessage(email, code, token);
  const response = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${connection.accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: {
        subject: message.subject,
        body: {
          contentType: "HTML",
          content: message.html
        },
        toRecipients: [
          {
            emailAddress: {
              address: email
            }
          }
        ]
      },
      saveToSentItems: true
    })
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error?.message || "Microsoft 365 could not send the invite email.");
  }

  return {
    emailSent: true,
    inviteLink: message.inviteLink,
    code: message.code,
    deliveryMethod: "microsoft-365"
  };
}

async function sendInviteEmailWithSmtp({ email, code, token }) {
  const transporter = getMailTransporter();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  if (!transporter || !from) {
    return null;
  }

  const message = getInviteMessage(email, code, token);
  await transporter.sendMail({
    from,
    to: email,
    subject: message.subject,
    text: message.text,
    html: message.html
  });

  return {
    emailSent: true,
    inviteLink: message.inviteLink,
    code: message.code,
    deliveryMethod: "smtp"
  };
}

async function sendInviteEmail({ email, code, token }) {
  const microsoft = getMicrosoftConnection();
  if (microsoft) {
    const delivery = await sendInviteEmailWithMicrosoft({ email, code, token });
    if (delivery) {
      return delivery;
    }
  }

  const smtp = await sendInviteEmailWithSmtp({ email, code, token });
  if (smtp) {
    return smtp;
  }

  const message = getInviteMessage(email, code, token);
  return {
    emailSent: false,
    inviteLink: message.inviteLink,
    code: message.code,
    deliveryMethod: "manual"
  };
}

function getAttemptOrThrow(db, attemptId, accessToken) {
  const attempt = db.attempts.find((entry) => entry.id === attemptId);

  if (!attempt || attempt.accessToken !== accessToken) {
    const error = new Error("Attempt not found or access denied.");
    error.statusCode = 403;
    throw error;
  }

  return attempt;
}

function learnerPayload(invite, attempt) {
  const topics = loadTopics();
  const safeTopics = sanitizeTopicsForLearner(topics);
  return {
    invite: {
      email: invite.email,
      token: invite.token,
      passedAt: invite.passedAt || null
    },
    attempt: {
      id: attempt.id,
      accessToken: attempt.accessToken,
      attemptNumber: attempt.attemptNumber,
      currentTopicIndex: attempt.currentTopicIndex,
      status: attempt.status,
      scorePercent: attempt.scorePercent,
      correctAnswers: attempt.correctAnswers,
      totalQuestions: attempt.totalQuestions,
      passed: attempt.passed
    },
    training: {
      passThreshold: PASS_THRESHOLD,
      totalTopics: safeTopics.length,
      totalQuestions: topics.reduce((sum, topic) => sum + topic.questions.length, 0),
      topics: safeTopics
    }
  };
}

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "share.html"));
});

app.get("/share", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "share.html"));
});

app.get("/admin", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.get("/invite/:token", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "participant.html"));
});

app.get("/api/config", (_req, res) => {
  const connection = getMicrosoftConnection();
  const smtpConfigured = Boolean(getMailTransporter() && (process.env.MAIL_FROM || process.env.SMTP_USER));
  const oauth = getMicrosoftOAuthConfig();
  res.json({
    appBaseUrl: APP_BASE_URL,
    shareLink: APP_BASE_URL,
    storage: "sqlite",
    smtpConfigured,
    microsoftOAuthConfigured: isMicrosoftOAuthConfigured(),
    microsoftUsesClientSecret: Boolean(oauth.clientSecret),
    microsoftConnected: Boolean(connection),
    connectedMailbox: connection
      ? {
          email: connection.email,
          displayName: connection.displayName
        }
      : null,
    mailConfigured: smtpConfigured || Boolean(connection),
    passThreshold: PASS_THRESHOLD
  });
});

app.get("/api/admin/settings", (_req, res) => {
  const oauth = getMicrosoftOAuthConfig();
  const template = getInviteMailTemplate();
  res.json({
    oauth: {
      tenantId: oauth.tenantId || "organizations",
      clientId: oauth.clientId || "",
      redirectUri: oauth.redirectUri || `${APP_BASE_URL}/auth/microsoft/callback`,
      hasClientSecret: hasMicrosoftClientSecret()
    },
    mailTemplate: {
      subject: template.subject,
      body: template.body
    }
  });
});

app.post("/api/admin/settings", (req, res) => {
  const tenantId = String(req.body.tenantId || "").trim() || "organizations";
  const clientId = String(req.body.clientId || "").trim();
  const clientSecret = String(req.body.clientSecret || "").trim();
  const clearClientSecret = Boolean(req.body.clearClientSecret);
  const redirectUri = String(req.body.redirectUri || "").trim() || `${APP_BASE_URL}/auth/microsoft/callback`;
  const mailSubject = String(req.body.mailSubject || "").trim() || DEFAULT_MAIL_SUBJECT;
  const mailBody = String(req.body.mailBody || "").trim() || DEFAULT_MAIL_BODY;

  saveMicrosoftOAuthConfig({
    tenantId,
    clientId,
    clientSecret,
    redirectUri,
    clearClientSecret
  });
  saveInviteMailTemplate({
    subject: mailSubject,
    body: mailBody
  });

  res.json({ ok: true });
});

app.get("/auth/microsoft/connect", (req, res) => {
  if (!isMicrosoftOAuthConfigured()) {
    return res.redirect("/admin?msoauth=error&message=Microsoft%20365%20OAuth%20settings%20are%20not%20filled%20in%20yet.");
  }

  const oauth = getMicrosoftOAuthConfig();
  const state = crypto.randomUUID();
  const codeVerifier = createCodeVerifier();
  const codeChallenge = createCodeChallenge(codeVerifier);
  saveMicrosoftAuthSession({ state, codeVerifier });

  const authUrl = new URL(`https://login.microsoftonline.com/${oauth.tenantId}/oauth2/v2.0/authorize`);
  authUrl.searchParams.set("client_id", oauth.clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", oauth.redirectUri);
  authUrl.searchParams.set("response_mode", "query");
  authUrl.searchParams.set("scope", MICROSOFT_SCOPES.join(" "));
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");
  authUrl.searchParams.set("code_challenge", codeChallenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  res.redirect(authUrl.toString());
});

app.get("/auth/microsoft/callback", async (req, res) => {
  try {
    const authSession = getMicrosoftAuthSession();
    const providedState = String(req.query.state || "");

    if (!authSession.state || authSession.state !== providedState) {
      clearMicrosoftAuthSession();
      return res.redirect("/admin?msoauth=error&message=The%20Microsoft%20365%20state%20check%20failed.");
    }

    if (req.query.error) {
      clearMicrosoftAuthSession();
      const message = encodeURIComponent(String(req.query.error_description || req.query.error));
      return res.redirect(`/admin?msoauth=error&message=${message}`);
    }

    const tokenData = await exchangeMicrosoftToken({
      grant_type: "authorization_code",
      code: String(req.query.code || ""),
      scope: MICROSOFT_SCOPES.join(" "),
      code_verifier: authSession.codeVerifier
    });

    const profile = await fetchMicrosoftProfile(tokenData.access_token);
    saveMicrosoftConnection({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: new Date(Date.now() + (tokenData.expires_in - 120) * 1000).toISOString(),
      displayName: profile.displayName,
      email: profile.email,
      connectedAt: new Date().toISOString()
    });
    clearMicrosoftAuthSession();

    res.redirect("/admin?msoauth=connected");
  } catch (error) {
    clearMicrosoftAuthSession();
    res.redirect(`/admin?msoauth=error&message=${encodeURIComponent(error.message)}`);
  }
});

app.post("/api/admin/microsoft/disconnect", (_req, res) => {
  clearMicrosoftConnection();
  clearMicrosoftAuthSession();
  res.json({ ok: true });
});

app.get("/api/admin/overview", (_req, res) => {
  const db = readDb();

  res.json({
    invites: db.invites
      .map((invite) => summarizeInvite(db, invite))
      .sort((a, b) => new Date(b.lastSentAt || b.createdAt) - new Date(a.lastSentAt || a.createdAt)),
    attempts: db.attempts
      .map((attempt) => summarizeAttempt(db, attempt))
      .sort((a, b) => new Date(b.submittedAt || b.startedAt) - new Date(a.submittedAt || a.startedAt))
  });
});

app.post("/api/admin/send-invite", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Enter a valid employee email address." });
    }

    const db = readDb();
    let invite = db.invites.find((entry) => entry.email === email);

    if (!invite) {
      invite = getOrCreateInvite(db, email, { touchLastSentAt: true });
    } else {
      invite.token = crypto.randomUUID();
      invite.code = createCode();
      invite.lastSentAt = new Date().toISOString();
    }

    const delivery = await sendInviteEmail(invite);
    writeDb(db);
    logActivity({
      inviteId: invite.id,
      eventType: "invite_sent",
      metadata: {
        email: invite.email,
        deliveryMethod: delivery.deliveryMethod,
        emailSent: delivery.emailSent
      }
    });

    res.json({
      ok: true,
      email: invite.email,
      inviteLink: delivery.inviteLink,
      code: delivery.code,
      emailSent: delivery.emailSent,
      deliveryMethod: delivery.deliveryMethod
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/share/start", (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Enter a valid work email address." });
    }

    const db = readDb();
    const invite = getOrCreateInvite(db, email);

    if (invite.passedAt) {
      const latestAttempt = getLatestAttempt(db, invite.id);
      logActivity({
        inviteId: invite.id,
        attemptId: latestAttempt?.id || null,
        eventType: "share_accessed_after_pass",
        metadata: { email }
      });

      return res.json({
        alreadyPassed: true,
        result: latestAttempt
          ? {
              scorePercent: latestAttempt.scorePercent,
              correctAnswers: latestAttempt.correctAnswers,
              totalQuestions: latestAttempt.totalQuestions,
              submittedAt: latestAttempt.submittedAt
            }
          : null
      });
    }

    let attempt = getActiveAttempt(db, invite.id);
    let eventType = "share_resumed_attempt";
    if (!attempt) {
      attempt = createAttempt(db, invite.id);
      eventType = "share_started_attempt";
      writeDb(db);
    }

    logActivity({
      inviteId: invite.id,
      attemptId: attempt.id,
      eventType,
      metadata: { email }
    });

    res.json(learnerPayload(invite, attempt));
  } catch (error) {
    next(error);
  }
});

app.post("/api/public/start", (req, res, next) => {
  try {
    const sessionToken = String(req.body.sessionToken || "").trim();
    if (sessionToken.length < 12) {
      return res.status(400).json({ error: "Invalid public session." });
    }

    const db = readDb();
    const invite = getOrCreateInvite(db, createPublicInviteEmail(sessionToken));

    if (invite.passedAt) {
      const latestAttempt = getLatestAttempt(db, invite.id);
      logActivity({
        inviteId: invite.id,
        attemptId: latestAttempt?.id || null,
        eventType: "public_accessed_after_pass",
        metadata: { entry: "public" }
      });

      return res.json({
        alreadyPassed: true,
        result: latestAttempt
          ? {
              scorePercent: latestAttempt.scorePercent,
              correctAnswers: latestAttempt.correctAnswers,
              totalQuestions: latestAttempt.totalQuestions,
              submittedAt: latestAttempt.submittedAt
            }
          : null
      });
    }

    let attempt = getActiveAttempt(db, invite.id);
    let eventType = "public_resumed_attempt";
    if (!attempt) {
      attempt = createAttempt(db, invite.id);
      eventType = "public_started_attempt";
      writeDb(db);
    }

    logActivity({
      inviteId: invite.id,
      attemptId: attempt.id,
      eventType,
      metadata: { entry: "public" }
    });

    res.json(learnerPayload(invite, attempt));
  } catch (error) {
    next(error);
  }
});

app.get("/api/invite/:token", (req, res) => {
  const db = readDb();
  const invite = findInviteByToken(db, req.params.token);

  if (!invite) {
    return res.status(404).json({ error: "Invite not found." });
  }

  const latestAttempt = getLatestAttempt(db, invite.id);

  res.json({
    email: invite.email,
    passedAt: invite.passedAt || null,
    latestAttempt: latestAttempt
      ? {
          status: latestAttempt.status,
          passed: latestAttempt.passed,
          scorePercent: latestAttempt.scorePercent,
          submittedAt: latestAttempt.submittedAt,
          correctAnswers: latestAttempt.correctAnswers,
          totalQuestions: latestAttempt.totalQuestions
        }
      : null
  });
});

app.post("/api/invite/:token/verify", (req, res) => {
  const db = readDb();
  const invite = findInviteByToken(db, req.params.token);

  if (!invite) {
    return res.status(404).json({ error: "Invite not found." });
  }

  const code = String(req.body.code || "").trim();
  if (code !== invite.code) {
    logActivity({
      inviteId: invite.id,
      eventType: "invite_code_failed",
      metadata: { codeLength: code.length }
    });
    return res.status(400).json({ error: "The access code is not correct." });
  }

  if (invite.passedAt) {
    const latestAttempt = getLatestAttempt(db, invite.id);
    logActivity({
      inviteId: invite.id,
      attemptId: latestAttempt?.id || null,
      eventType: "invite_opened_after_pass"
    });
    return res.json({
      alreadyPassed: true,
      result: latestAttempt
        ? {
            scorePercent: latestAttempt.scorePercent,
            correctAnswers: latestAttempt.correctAnswers,
            totalQuestions: latestAttempt.totalQuestions,
            submittedAt: latestAttempt.submittedAt
          }
        : null
    });
  }

  let attempt = getActiveAttempt(db, invite.id);
  if (!attempt) {
    attempt = createAttempt(db, invite.id);
    writeDb(db);
  }

  logActivity({
    inviteId: invite.id,
    attemptId: attempt.id,
    eventType: "invite_code_verified"
  });

  res.json(learnerPayload(invite, attempt));
});

app.post("/api/invite/:token/retry", (req, res) => {
  const db = readDb();
  const invite = findInviteByToken(db, req.params.token);

  if (!invite) {
    return res.status(404).json({ error: "Invite not found." });
  }

  if (invite.passedAt) {
    return res.status(400).json({ error: "This learner has already passed." });
  }

  const previousAttempt = getAttemptOrThrow(db, req.body.attemptId, req.body.accessToken);
  if (previousAttempt.inviteId !== invite.id || previousAttempt.status !== "completed" || previousAttempt.passed) {
    return res.status(400).json({ error: "A retry can only start after a failed completed attempt." });
  }

  const attempt = createAttempt(db, invite.id);
  writeDb(db);
  logActivity({
    inviteId: invite.id,
    attemptId: attempt.id,
    eventType: "retry_started",
    metadata: { previousAttemptId: previousAttempt.id }
  });
  res.json(learnerPayload(invite, attempt));
});

app.get("/api/attempts/:attemptId", (req, res, next) => {
  try {
    const db = readDb();
    const attempt = getAttemptOrThrow(db, req.params.attemptId, req.query.accessToken);
    const invite = db.invites.find((entry) => entry.id === attempt.inviteId);

    if (!invite) {
      return res.status(404).json({ error: "Invite not found." });
    }

    logActivity({
      inviteId: invite.id,
      attemptId: attempt.id,
      eventType: "attempt_resumed"
    });

    res.json(learnerPayload(invite, attempt));
  } catch (error) {
    next(error);
  }
});

app.post("/api/attempts/:attemptId/log", (req, res, next) => {
  try {
    const db = readDb();
    const attempt = getAttemptOrThrow(db, req.params.attemptId, req.body.accessToken);
    const invite = db.invites.find((entry) => entry.id === attempt.inviteId);

    if (!invite) {
      return res.status(404).json({ error: "Invite not found." });
    }

    const eventType = String(req.body.eventType || "").trim();
    if (!eventType) {
      return res.status(400).json({ error: "Missing event type." });
    }

    logActivity({
      inviteId: invite.id,
      attemptId: attempt.id,
      eventType,
      topicIndex: Number.isInteger(req.body.topicIndex) ? req.body.topicIndex : null,
      questionIndex: Number.isInteger(req.body.questionIndex) ? req.body.questionIndex : null,
      choiceIndex: Number.isInteger(req.body.choiceIndex) ? req.body.choiceIndex : null,
      metadata: req.body.metadata && typeof req.body.metadata === "object" ? req.body.metadata : null
    });

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.post("/api/attempts/:attemptId/topics/:topicIndex", (req, res, next) => {
  try {
    const db = readDb();
    const attempt = getAttemptOrThrow(db, req.params.attemptId, req.body.accessToken);
    const invite = db.invites.find((entry) => entry.id === attempt.inviteId);
    const topics = loadTopics();
    const topicIndex = Number(req.params.topicIndex);

    if (!invite) {
      return res.status(404).json({ error: "Invite not found." });
    }

    if (attempt.status !== "in_progress") {
      return res.status(400).json({ error: "This attempt is already locked." });
    }

    if (topicIndex !== attempt.currentTopicIndex) {
      return res.status(400).json({ error: "This topic is locked or not yet available." });
    }

    const topic = topics[topicIndex];
    if (!topic) {
      return res.status(404).json({ error: "Topic not found." });
    }

    const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
    if (
      answers.length !== topic.questions.length ||
      answers.some((value) => !Number.isInteger(value) || value < 0 || value > 3)
    ) {
      return res.status(400).json({ error: "Submit one answer for each question in this topic." });
    }

    attempt.topicSubmissions.push({
      topicIndex,
      answers,
      submittedAt: new Date().toISOString()
    });

    answers.forEach((choiceIndex, questionIndex) => {
      logActivity({
        inviteId: invite.id,
        attemptId: attempt.id,
        eventType: "question_answer_finalized",
        topicIndex,
        questionIndex,
        choiceIndex
      });
    });
    logActivity({
      inviteId: invite.id,
      attemptId: attempt.id,
      eventType: "topic_submitted",
      topicIndex,
      metadata: { answerCount: answers.length }
    });

    attempt.currentTopicIndex += 1;

    if (attempt.currentTopicIndex >= topics.length) {
      const result = getScoreForAttempt(attempt, topics);
      attempt.status = "completed";
      attempt.submittedAt = new Date().toISOString();
      attempt.correctAnswers = result.correctAnswers;
      attempt.totalQuestions = result.totalQuestions;
      attempt.scorePercent = result.scorePercent;
      attempt.passed = result.passed;

      if (result.passed) {
        invite.passedAt = attempt.submittedAt;
      }

      writeDb(db);
      logActivity({
        inviteId: invite.id,
        attemptId: attempt.id,
        eventType: "attempt_completed",
        metadata: {
          scorePercent: result.scorePercent,
          correctAnswers: result.correctAnswers,
          totalQuestions: result.totalQuestions,
          passed: result.passed
        }
      });
      return res.json({
        completed: true,
        result: {
          ...result,
          passThreshold: PASS_THRESHOLD
        }
      });
    }

    writeDb(db);
    res.json({
      completed: false,
      nextTopicIndex: attempt.currentTopicIndex
    });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    error: error.message || "Something went wrong."
  });
});

app.listen(PORT, () => {
  console.log(`Security awareness app running on ${APP_BASE_URL}`);
});
