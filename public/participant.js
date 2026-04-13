const inviteToken = window.location.pathname.split("/invite/")[1];
const ATTEMPT_STORAGE_KEY = `training-attempt-${inviteToken}`;
const LANGUAGE_STORAGE_KEY = "training-language";

const translations = {
  nl: {
    pageTitleText: "Awarenesstraining informatiebeveiliging",
    pageEyebrow: "Deelnemerstoegang",
    gateEyebrow: "Open je uitnodiging",
    gateTitle: "Voer je toegangscode in",
    accessCodeLabel: "Toegangscode",
    accessCodePlaceholder: "6 cijfers",
    openTrainingButton: "Open training",
    progressEyebrow: "Voortgang",
    subjectHeading: "Onderwerp en uitleg",
    rulesHeading: "Beleidsregels",
    risksHeading: "Grootste risico's",
    questionsEyebrow: "Vragen",
    questionsTitle: "Beantwoord dit onderwerp",
    answersLockLabel: "Antwoorden worden vastgezet na verzenden",
    submitTopic: "Verzend dit onderwerp",
    resultEyebrow: "Resultaat",
    retryButton: "Start opnieuw",
    inviteFor: (email) => `Uitnodiging voor ${email}`,
    progressTitle: (current, total) => `Onderwerp ${current} van ${total}`,
    attemptPill: (attemptNumber) => `Poging ${attemptNumber}`,
    topicStateCompleted: "Voltooid",
    topicStateCurrent: "Huidig onderwerp",
    topicStateLocked: "Vergrendeld",
    resultAlreadyCompleted: "Training al afgerond",
    resultPassed: "Je bent geslaagd",
    resultRetry: "Opnieuw nodig",
    resultAlreadyCompletedSummary: "Deze uitnodiging is al als geslaagd geregistreerd.",
    resultSummary: (score, correct, total, threshold) =>
      `Score: ${score}% (${correct}/${total}). Je hebt minimaal ${threshold}% nodig om te slagen.`,
    resultBadgePassed: "Geslaagd",
    resultBadgeFailed: "Nog niet geslaagd",
    questionCorrect: "Goed.",
    questionIncorrect: (label) => `Fout. Het juiste antwoord is ${label}.`,
    unexpectedResponse: "De trainingsservice gaf een onverwachte reactie terug.",
    genericError: "Er ging iets mis.",
    htmlLang: "nl"
  },
  en: {
    pageTitleText: "Security Awareness Training",
    pageEyebrow: "Participant access",
    gateEyebrow: "Open your invite",
    gateTitle: "Enter your access code",
    accessCodeLabel: "Access code",
    accessCodePlaceholder: "6 digits",
    openTrainingButton: "Open training",
    progressEyebrow: "Progress",
    subjectHeading: "Subject and explanation",
    rulesHeading: "Policy rules",
    risksHeading: "Biggest risks",
    questionsEyebrow: "Questions",
    questionsTitle: "Answer this topic",
    answersLockLabel: "Answers lock after submit",
    submitTopic: "Submit this topic",
    resultEyebrow: "Result",
    retryButton: "Start retry",
    inviteFor: (email) => `Invite for ${email}`,
    progressTitle: (current, total) => `Topic ${current} of ${total}`,
    attemptPill: (attemptNumber) => `Attempt ${attemptNumber}`,
    topicStateCompleted: "Completed",
    topicStateCurrent: "Current topic",
    topicStateLocked: "Locked",
    resultAlreadyCompleted: "Training already passed",
    resultPassed: "You passed",
    resultRetry: "Retry required",
    resultAlreadyCompletedSummary: "This invite is already marked as passed.",
    resultSummary: (score, correct, total, threshold) =>
      `Score: ${score}% (${correct}/${total}). You need at least ${threshold}% to pass.`,
    resultBadgePassed: "Passed",
    resultBadgeFailed: "Not passed yet",
    questionCorrect: "Correct.",
    questionIncorrect: (label) => `Incorrect. The correct answer is ${label}.`,
    unexpectedResponse: "The training service returned an unexpected response.",
    genericError: "Something went wrong.",
    htmlLang: "en"
  }
};

const gateView = document.getElementById("gateView");
const trainingView = document.getElementById("trainingView");
const resultView = document.getElementById("resultView");

const langNl = document.getElementById("langNl");
const langEn = document.getElementById("langEn");
const pageEyebrow = document.getElementById("pageEyebrow");
const pageTitle = document.getElementById("pageTitle");
const gateEyebrow = document.getElementById("gateEyebrow");
const gateTitle = document.getElementById("gateTitle");
const accessCodeLabel = document.getElementById("accessCodeLabel");
const openTrainingButton = document.getElementById("openTrainingButton");

const inviteEmail = document.getElementById("inviteEmail");
const codeForm = document.getElementById("codeForm");
const accessCode = document.getElementById("accessCode");
const gateMessage = document.getElementById("gateMessage");

const progressEyebrow = document.getElementById("progressEyebrow");
const subjectHeading = document.getElementById("subjectHeading");
const rulesHeading = document.getElementById("rulesHeading");
const risksHeading = document.getElementById("risksHeading");
const questionsEyebrow = document.getElementById("questionsEyebrow");
const questionsTitle = document.getElementById("questionsTitle");
const answersLockLabel = document.getElementById("answersLockLabel");
const resultEyebrow = document.getElementById("resultEyebrow");

const topicList = document.getElementById("topicList");
const progressTitle = document.getElementById("progressTitle");
const attemptPill = document.getElementById("attemptPill");
const topicKicker = document.getElementById("topicKicker");
const topicTitle = document.getElementById("topicTitle");
const topicSummary = document.getElementById("topicSummary");
const topicImage = document.getElementById("topicImage");
const topicExplanation = document.getElementById("topicExplanation");
const topicRules = document.getElementById("topicRules");
const topicRisks = document.getElementById("topicRisks");
const topicForm = document.getElementById("topicForm");
const topicMessage = document.getElementById("topicMessage");
const submitTopicButton = document.getElementById("submitTopic");

const resultTitle = document.getElementById("resultTitle");
const resultSummary = document.getElementById("resultSummary");
const resultBadge = document.getElementById("resultBadge");
const retryButton = document.getElementById("retryButton");

const memoryStore = new Map();

const state = {
  invite: null,
  attempt: null,
  training: null,
  language: "nl"
};

function normalizeLanguage(lang) {
  return String(lang || "").trim().toLowerCase() === "en" ? "en" : "nl";
}

function t() {
  return translations[state.language];
}

function setCallout(element, type, text) {
  element.className = `callout ${type}`;
  element.textContent = text;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(t().unexpectedResponse);
  }

  if (!response.ok) {
    throw new Error(data.error || t().genericError);
  }
  return data;
}

function safeGet(key) {
  try {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
  } catch {
    return memoryStore.get(key) || null;
  }
}

function safeSet(key, value, storage = "session") {
  try {
    if (storage === "local") {
      localStorage.setItem(key, value);
    } else {
      sessionStorage.setItem(key, value);
    }
  } catch {
    memoryStore.set(key, value);
  }
}

function safeRemove(key) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    memoryStore.delete(key);
  }
}

function getPreferredLanguage() {
  const params = new URLSearchParams(window.location.search);
  return normalizeLanguage(params.get("lang") || safeGet(LANGUAGE_STORAGE_KEY) || "nl");
}

function updateLanguageInUrl(language) {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", language);
  window.location.href = url.toString();
}

function applyStaticText() {
  document.documentElement.lang = t().htmlLang;
  document.title = t().pageTitleText;
  pageEyebrow.textContent = t().pageEyebrow;
  pageTitle.textContent = t().pageTitleText;
  gateEyebrow.textContent = t().gateEyebrow;
  gateTitle.textContent = t().gateTitle;
  accessCodeLabel.textContent = t().accessCodeLabel;
  accessCode.placeholder = t().accessCodePlaceholder;
  openTrainingButton.textContent = t().openTrainingButton;
  progressEyebrow.textContent = t().progressEyebrow;
  subjectHeading.textContent = t().subjectHeading;
  rulesHeading.textContent = t().rulesHeading;
  risksHeading.textContent = t().risksHeading;
  questionsEyebrow.textContent = t().questionsEyebrow;
  questionsTitle.textContent = t().questionsTitle;
  answersLockLabel.textContent = t().answersLockLabel;
  submitTopicButton.textContent = t().submitTopic;
  resultEyebrow.textContent = t().resultEyebrow;
  retryButton.textContent = t().retryButton;
  if (state.invite?.email) {
    inviteEmail.textContent = t().inviteFor(state.invite.email);
  }
  langNl.classList.toggle("active", state.language === "nl");
  langEn.classList.toggle("active", state.language === "en");
}

function getStoredAttempt() {
  const raw = safeGet(ATTEMPT_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

function storeAttempt(attempt) {
  safeSet(
    ATTEMPT_STORAGE_KEY,
    JSON.stringify({
      attemptId: attempt.id,
      accessToken: attempt.accessToken
    })
  );
}

function clearStoredAttempt() {
  safeRemove(ATTEMPT_STORAGE_KEY);
}

function logAttemptEvent(eventType, extra = {}) {
  if (!state.attempt?.id || !state.attempt?.accessToken) {
    return;
  }

  fetch(`/api/attempts/${state.attempt.id}/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      accessToken: state.attempt.accessToken,
      eventType,
      ...extra
    })
  }).catch(() => {});
}

function renderList(target, items) {
  target.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    target.appendChild(li);
  });
}

function renderTopicList() {
  topicList.innerHTML = "";
  state.training.topics.forEach((topic, index) => {
    const completed = index < state.attempt.currentTopicIndex;
    const current = index === state.attempt.currentTopicIndex;
    const cls = ["topic-item"];
    if (completed) cls.push("done");
    if (current) cls.push("current");

    topicList.insertAdjacentHTML(
      "beforeend",
      `<div class="${cls.join(" ")}">
        <h4>${topic.title}</h4>
        <p class="muted-copy">${
          completed ? t().topicStateCompleted : current ? t().topicStateCurrent : t().topicStateLocked
        }</p>
      </div>`
    );
  });
}

function renderQuestions(topic) {
  topicForm.innerHTML = "";
  const labels = ["A", "B", "C", "D"];

  topic.questions.forEach((question, questionIndex) => {
    const card = document.createElement("article");
    card.className = "question-card";
    card.innerHTML = `<h4>${questionIndex + 1}. ${question.prompt}</h4>`;

    const choiceList = document.createElement("div");
    choiceList.className = "choice-list";

    question.choices.forEach((choice, choiceIndex) => {
      const id = `q-${questionIndex}-c-${choiceIndex}`;
      const label = document.createElement("label");
      label.className = "choice-label";
      label.setAttribute("for", id);
      label.dataset.choiceIndex = String(choiceIndex);
      label.innerHTML = `
        <input id="${id}" type="radio" name="question-${questionIndex}" value="${choiceIndex}" />
        <span><strong>${labels[choiceIndex]}.</strong> ${choice}</span>
      `;
      choiceList.appendChild(label);
    });

    card.appendChild(choiceList);
    const feedback = document.createElement("div");
    feedback.className = "question-feedback hidden";
    feedback.dataset.role = "feedback";
    card.appendChild(feedback);
    topicForm.appendChild(card);
  });
}

function applyQuestionFeedback(questionIndex, selectedIndex) {
  const topic = state.training.topics[state.attempt.currentTopicIndex];
  const question = topic.questions[questionIndex];
  const card = topicForm.children[questionIndex];
  const feedback = card?.querySelector('[data-role="feedback"]');
  const labels = ["A", "B", "C", "D"];

  if (!question || !card || !feedback) {
    return;
  }

  card.querySelectorAll(".choice-label").forEach((label) => {
    const choiceIndex = Number(label.dataset.choiceIndex);
    const input = label.querySelector("input");
    label.classList.remove("correct", "wrong", "revealed");

    if (choiceIndex === question.correctChoiceIndex) {
      label.classList.add("correct", "revealed");
    }

    if (choiceIndex === selectedIndex && selectedIndex !== question.correctChoiceIndex) {
      label.classList.add("wrong", "revealed");
    }

    if (input) {
      input.disabled = true;
    }
  });

  feedback.className = `question-feedback ${selectedIndex === question.correctChoiceIndex ? "success" : "error"}`;
  feedback.textContent =
    selectedIndex === question.correctChoiceIndex
      ? t().questionCorrect
      : t().questionIncorrect(labels[question.correctChoiceIndex]);
}

function showView(name) {
  gateView.classList.toggle("hidden", name !== "gate");
  trainingView.classList.toggle("hidden", name !== "training");
  resultView.classList.toggle("hidden", name !== "result");
}

function renderCurrentTopic() {
  const topic = state.training.topics[state.attempt.currentTopicIndex];

  progressTitle.textContent = t().progressTitle(state.attempt.currentTopicIndex + 1, state.training.totalTopics);
  attemptPill.textContent = t().attemptPill(state.attempt.attemptNumber);
  topicKicker.textContent = topic.kicker;
  topicTitle.textContent = topic.title;
  topicSummary.textContent = topic.summary;
  topicImage.src = topic.image;
  topicImage.alt = `${topic.title} illustration`;
  topicExplanation.textContent = topic.explanation;
  renderList(topicRules, topic.rules);
  renderList(topicRisks, topic.risks);
  renderQuestions(topic);
  renderTopicList();
  topicMessage.classList.add("hidden");
  logAttemptEvent("topic_viewed", {
    topicIndex: state.attempt.currentTopicIndex,
    metadata: { title: topic.title, entry: "invite", language: state.language }
  });
  showView("training");
}

function renderResult(result, alreadyPassed = false) {
  clearStoredAttempt();
  resultTitle.textContent = alreadyPassed
    ? t().resultAlreadyCompleted
    : result.passed
      ? t().resultPassed
      : t().resultRetry;
  resultSummary.textContent = alreadyPassed
    ? t().resultAlreadyCompletedSummary
    : t().resultSummary(result.scorePercent, result.correctAnswers, result.totalQuestions, state.training?.passThreshold || 85);

  resultBadge.className = `result-badge ${alreadyPassed || result.passed ? "pass" : "fail"}`;
  resultBadge.textContent = alreadyPassed || result.passed ? t().resultBadgePassed : t().resultBadgeFailed;

  retryButton.classList.toggle("hidden", alreadyPassed || result.passed);
  logAttemptEvent("result_viewed", {
    metadata: {
      alreadyPassed,
      passed: alreadyPassed || result.passed,
      scorePercent: result.scorePercent ?? null,
      entry: "invite",
      language: state.language
    }
  });
  showView("result");
}

async function loadInviteInfo() {
  const info = await fetchJson(`/api/invite/${inviteToken}`);
  state.invite = info;
  applyStaticText();

  if (info.passedAt && info.latestAttempt) {
    renderResult(info.latestAttempt, true);
    return;
  }

  showView("gate");
}

async function openAttempt(payload) {
  state.invite = payload.invite;
  state.attempt = payload.attempt;
  state.training = payload.training;
  state.language = normalizeLanguage(payload.training.language || state.language);
  storeAttempt(payload.attempt);
  applyStaticText();
  renderCurrentTopic();
}

async function resumeAttemptIfPossible() {
  if (!resultView.classList.contains("hidden")) {
    return false;
  }

  const stored = getStoredAttempt();
  if (!stored) {
    return false;
  }

  try {
    const payload = await fetchJson(
      `/api/attempts/${stored.attemptId}?accessToken=${encodeURIComponent(stored.accessToken)}&lang=${state.language}`
    );
    await openAttempt(payload);
    return true;
  } catch {
    clearStoredAttempt();
    return false;
  }
}

codeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  gateMessage.classList.add("hidden");

  try {
    const payload = await fetchJson(`/api/invite/${inviteToken}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: accessCode.value,
        lang: state.language
      })
    });

    if (payload.alreadyPassed) {
      renderResult(payload.result, true);
      return;
    }

    await openAttempt(payload);
  } catch (error) {
    setCallout(gateMessage, "error", error.message);
  }
});

topicForm.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.type !== "radio") {
    return;
  }

  const questionIndex = Number(target.name.replace("question-", ""));
  const choiceIndex = Number(target.value);
  if (!Number.isInteger(questionIndex) || !Number.isInteger(choiceIndex)) {
    return;
  }

  logAttemptEvent("question_answer_selected", {
    topicIndex: state.attempt.currentTopicIndex,
    questionIndex,
    choiceIndex,
    metadata: { entry: "invite", language: state.language }
  });
  applyQuestionFeedback(questionIndex, choiceIndex);
});

submitTopicButton.addEventListener("click", async () => {
  const currentTopic = state.training.topics[state.attempt.currentTopicIndex];
  const answers = currentTopic.questions.map((_, questionIndex) => {
    const checked = topicForm.querySelector(`input[name="question-${questionIndex}"]:checked`);
    return checked ? Number(checked.value) : null;
  });

  submitTopicButton.disabled = true;

  try {
    const result = await fetchJson(`/api/attempts/${state.attempt.id}/topics/${state.attempt.currentTopicIndex}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken: state.attempt.accessToken,
        answers,
        lang: state.language
      })
    });

    if (result.completed) {
      renderResult(result.result, false);
      return;
    }

    state.attempt.currentTopicIndex = result.nextTopicIndex;
    renderCurrentTopic();
  } catch (error) {
    setCallout(topicMessage, "error", error.message);
  } finally {
    submitTopicButton.disabled = false;
  }
});

retryButton.addEventListener("click", async () => {
  if (!state.invite || !state.attempt) {
    return;
  }

  try {
    const payload = await fetchJson(`/api/invite/${state.invite.token}/retry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attemptId: state.attempt.id,
        accessToken: state.attempt.accessToken,
        lang: state.language
      })
    });

    await openAttempt(payload);
  } catch (error) {
    resultSummary.textContent = error.message;
  }
});

langNl.addEventListener("click", () => {
  safeSet(LANGUAGE_STORAGE_KEY, "nl", "local");
  updateLanguageInUrl("nl");
});

langEn.addEventListener("click", () => {
  safeSet(LANGUAGE_STORAGE_KEY, "en", "local");
  updateLanguageInUrl("en");
});

(async () => {
  state.language = getPreferredLanguage();
  applyStaticText();

  try {
    await loadInviteInfo();
    const resumed = await resumeAttemptIfPossible();
    if (!resumed && !state.training && resultView.classList.contains("hidden")) {
      showView("gate");
    }
  } catch (error) {
    setCallout(gateMessage, "error", error.message);
    showView("gate");
  }
})();
