const configMessage = document.getElementById("configMessage");
const mailConnection = document.getElementById("mailConnection");
const connectMicrosoft = document.getElementById("connectMicrosoft");
const disconnectMicrosoft = document.getElementById("disconnectMicrosoft");
const settingsForm = document.getElementById("settingsForm");
const tenantId = document.getElementById("tenantId");
const clientId = document.getElementById("clientId");
const clientSecret = document.getElementById("clientSecret");
const clearClientSecret = document.getElementById("clearClientSecret");
const clientSecretState = document.getElementById("clientSecretState");
const redirectUri = document.getElementById("redirectUri");
const mailSubject = document.getElementById("mailSubject");
const mailBody = document.getElementById("mailBody");
const mailPreviewSubject = document.getElementById("mailPreviewSubject");
const mailPreviewBody = document.getElementById("mailPreviewBody");
const settingsResult = document.getElementById("settingsResult");
const shareLink = document.getElementById("shareLink");
const copyShareLink = document.getElementById("copyShareLink");
const shareLinkResult = document.getElementById("shareLinkResult");
const inviteForm = document.getElementById("inviteForm");
const employeeEmail = document.getElementById("employeeEmail");
const inviteResult = document.getElementById("inviteResult");
const inviteRows = document.getElementById("inviteRows");
const attemptRows = document.getElementById("attemptRows");
const refreshOverviewButton = document.getElementById("refreshOverview");

function setMessage(element, type, html) {
  element.className = `callout ${type}`;
  element.innerHTML = html;
}

function formatDate(value) {
  if (!value) {
    return "—";
  }
  return new Date(value).toLocaleString("en-GB");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function applyTemplate(template, values) {
  return String(template).replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, key) => values[key] ?? "");
}

function renderMailPreview() {
  const values = {
    invite_link: "https://training.keynius.example/invite/demo-token",
    code: "482913",
    recipient_email: "employee@keynius.com",
    pass_threshold: "85"
  };

  mailPreviewSubject.textContent = applyTemplate(mailSubject.value || "Invite subject preview", values);
  mailPreviewBody.innerHTML = applyTemplate(
    mailBody.value || "<p>Your email preview appears here.</p>",
    values
  );
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }
  return data;
}

function renderInviteRows(rows) {
  inviteRows.innerHTML = "";
  if (!rows.length) {
    inviteRows.innerHTML = `<tr><td colspan="5">No learners invited yet.</td></tr>`;
    return;
  }

  rows.forEach((row) => {
    inviteRows.insertAdjacentHTML(
      "beforeend",
      `<tr>
        <td>${row.email}</td>
        <td>${row.status}</td>
        <td>${row.attempts}</td>
        <td>${formatDate(row.lastSentAt)}</td>
        <td>${row.latestScore === null ? "—" : `${row.latestScore}%`}</td>
      </tr>`
    );
  });
}

function renderAttemptRows(rows) {
  attemptRows.innerHTML = "";
  if (!rows.length) {
    attemptRows.innerHTML = `<tr><td colspan="5">No completed attempts yet.</td></tr>`;
    return;
  }

  rows
    .filter((row) => row.submittedAt)
    .forEach((row) => {
      attemptRows.insertAdjacentHTML(
        "beforeend",
        `<tr>
          <td>${row.email}</td>
          <td>#${row.attemptNumber}</td>
          <td>${formatDate(row.submittedAt)}</td>
          <td>${row.scorePercent}% (${row.correctAnswers}/${row.totalQuestions})</td>
          <td>${row.passed ? "Passed" : "Retry required"}</td>
        </tr>`
      );
    });

  if (!attemptRows.children.length) {
    attemptRows.innerHTML = `<tr><td colspan="5">No completed attempts yet.</td></tr>`;
  }
}

async function loadConfig() {
  const config = await fetchJson("/api/config");
  const params = new URLSearchParams(window.location.search);
  const oauthStatus = params.get("msoauth");
  const oauthMessage = params.get("message");

  if (config.microsoftConnected) {
    setMessage(
      mailConnection,
      "success",
      `Connected to Microsoft 365 as <strong>${config.connectedMailbox.displayName || config.connectedMailbox.email}</strong> (${config.connectedMailbox.email}). Invite emails will be sent from this account.`
    );
    disconnectMicrosoft.classList.remove("hidden");
  } else if (config.microsoftOAuthConfigured) {
    setMessage(
      mailConnection,
      "neutral",
      `Microsoft 365 OAuth is configured. Connect your own mailbox from this page to send training invites. ${
        config.microsoftUsesClientSecret ? "A client secret is stored for confidential app use." : "This setup can work without a client secret when your Entra app allows PKCE."
      }`
    );
    disconnectMicrosoft.classList.add("hidden");
  } else {
    setMessage(
      mailConnection,
      "neutral",
      `Microsoft 365 OAuth is not configured yet. Save your tenant ID, client ID and redirect URI below first.`
    );
    disconnectMicrosoft.classList.add("hidden");
  }

  if (oauthStatus === "connected") {
    setMessage(mailConnection, "success", `${mailConnection.innerHTML}<br />Microsoft 365 account connected successfully.`);
    window.history.replaceState({}, "", "/");
  } else if (oauthStatus === "error") {
    setMessage(mailConnection, "error", oauthMessage || "Microsoft 365 connection failed.");
    window.history.replaceState({}, "", "/");
  }

  if (config.mailConfigured) {
    setMessage(
      configMessage,
      "success",
      `Mail sending is configured. Invite links will be sent from your connected Microsoft 365 mailbox or your SMTP mailbox.`
    );
  } else {
    setMessage(
      configMessage,
      "neutral",
      `Mail sending is not configured yet. The app will still create a link and code, but real delivery starts after you connect Microsoft 365 or set up SMTP.`
    );
  }

  connectMicrosoft.classList.toggle("hidden", !config.microsoftOAuthConfigured || config.microsoftConnected);
  shareLink.value = config.shareLink || `${config.appBaseUrl}/share`;
}

async function loadSettings() {
  const settings = await fetchJson("/api/admin/settings");

  tenantId.value = settings.oauth.tenantId || "organizations";
  clientId.value = settings.oauth.clientId || "";
  redirectUri.value = settings.oauth.redirectUri || "";
  clientSecret.value = "";
  clearClientSecret.checked = false;

  if (settings.oauth.hasClientSecret) {
    setMessage(
      clientSecretState,
      "success",
      "A client secret is already stored in the database. Leave the field empty to keep it, or tick the box to remove it."
    );
    clientSecretState.classList.remove("hidden");
  } else {
    setMessage(
      clientSecretState,
      "neutral",
      "No client secret is stored. That is fine if your Microsoft app supports PKCE without a secret."
    );
    clientSecretState.classList.remove("hidden");
  }

  mailSubject.value = settings.mailTemplate.subject || "";
  mailBody.value = settings.mailTemplate.body || "";
  renderMailPreview();
}

async function loadOverview() {
  const overview = await fetchJson("/api/admin/overview");
  renderInviteRows(overview.invites);
  renderAttemptRows(overview.attempts);
}

inviteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  inviteResult.classList.add("hidden");

  try {
    const result = await fetchJson("/api/admin/send-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: employeeEmail.value })
    });

    setMessage(
      inviteResult,
      result.emailSent ? "success" : "neutral",
      `
        <strong>Invite ready for ${result.email}</strong><br />
        Link: <a href="${result.inviteLink}" target="_blank" rel="noreferrer">${result.inviteLink}</a><br />
        Code: <strong>${result.code}</strong><br />
        ${result.emailSent ? "The mail was sent successfully." : "Mail was not sent because SMTP is not configured yet. You can still copy the link and code manually."}
      `
    );
    employeeEmail.value = "";
    await loadOverview();
  } catch (error) {
    setMessage(inviteResult, "error", error.message);
  }
});

settingsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  settingsResult.classList.add("hidden");

  try {
    await fetchJson("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenantId: tenantId.value,
        clientId: clientId.value,
        clientSecret: clientSecret.value,
        clearClientSecret: clearClientSecret.checked,
        redirectUri: redirectUri.value,
        mailSubject: mailSubject.value,
        mailBody: mailBody.value
      })
    });

    setMessage(
      settingsResult,
      "success",
      "Settings saved. Your Microsoft OAuth values and invite mail template are now stored in SQLite."
    );
    await loadSettings();
    await loadConfig();
  } catch (error) {
    setMessage(settingsResult, "error", error.message);
  }
});

refreshOverviewButton.addEventListener("click", loadOverview);
disconnectMicrosoft.addEventListener("click", async () => {
  try {
    await fetchJson("/api/admin/microsoft/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    await loadConfig();
  } catch (error) {
    setMessage(mailConnection, "error", error.message);
  }
});

copyShareLink.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value);
    setMessage(shareLinkResult, "success", "Share link copied.");
  } catch {
    shareLink.select();
    document.execCommand("copy");
    setMessage(shareLinkResult, "success", "Share link copied.");
  }
});

mailSubject.addEventListener("input", renderMailPreview);
mailBody.addEventListener("input", renderMailPreview);

Promise.all([loadConfig(), loadSettings()])
  .catch((error) => setMessage(configMessage, "error", escapeHtml(error.message)));

loadOverview().catch(() => {
  inviteRows.innerHTML = `<tr><td colspan="5">Could not load overview.</td></tr>`;
  attemptRows.innerHTML = `<tr><td colspan="5">Could not load attempt history.</td></tr>`;
});
