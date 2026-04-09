const inviteToken = window.location.pathname.split("/invite/")[1];

const gateView = document.getElementById("gateView");
const trainingView = document.getElementById("trainingView");
const resultView = document.getElementById("resultView");

const inviteEmail = document.getElementById("inviteEmail");
const codeForm = document.getElementById("codeForm");
const accessCode = document.getElementById("accessCode");
const gateMessage = document.getElementById("gateMessage");

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

const state = {
  invite: null,
  attempt: null,
  training: null
};

function setCallout(element, type, text) {
  element.className = `callout ${type}`;
  element.textContent = text;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }
  return data;
}

function getStoredAttempt() {
  const raw = sessionStorage.getItem(`training-attempt-${inviteToken}`);
  return raw ? JSON.parse(raw) : null;
}

function storeAttempt(attempt) {
  sessionStorage.setItem(
    `training-attempt-${inviteToken}`,
    JSON.stringify({ attemptId: attempt.id, accessToken: attempt.accessToken })
  );
}

function clearStoredAttempt() {
  sessionStorage.removeItem(`training-attempt-${inviteToken}`);
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
        <p class="muted-copy">${completed ? "Completed" : current ? "Current topic" : "Locked"}</p>
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
      label.innerHTML = `
        <input id="${id}" type="radio" name="question-${questionIndex}" value="${choiceIndex}" />
        <span><strong>${labels[choiceIndex]}.</strong> ${choice}</span>
      `;
      choiceList.appendChild(label);
    });

    card.appendChild(choiceList);
    topicForm.appendChild(card);
  });
}

function showView(name) {
  gateView.classList.toggle("hidden", name !== "gate");
  trainingView.classList.toggle("hidden", name !== "training");
  resultView.classList.toggle("hidden", name !== "result");
}

function renderCurrentTopic() {
  const topic = state.training.topics[state.attempt.currentTopicIndex];

  progressTitle.textContent = `Topic ${state.attempt.currentTopicIndex + 1} of ${state.training.totalTopics}`;
  attemptPill.textContent = `Attempt ${state.attempt.attemptNumber}`;
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
    metadata: { title: topic.title }
  });
  showView("training");
}

function renderResult(result, alreadyPassed = false) {
  clearStoredAttempt();
  resultTitle.textContent = alreadyPassed ? "Training already passed" : result.passed ? "You passed" : "Retry required";
  resultSummary.textContent = alreadyPassed
    ? `This invite is already marked as passed.`
    : `Score: ${result.scorePercent}% (${result.correctAnswers}/${result.totalQuestions}). You need at least ${state.training?.passThreshold || 85}% to pass.`;

  resultBadge.className = `result-badge ${alreadyPassed || result.passed ? "pass" : "fail"}`;
  resultBadge.textContent = alreadyPassed || result.passed ? "Passed" : "Not passed yet";

  retryButton.classList.toggle("hidden", alreadyPassed || result.passed);
  logAttemptEvent("result_viewed", {
    metadata: {
      alreadyPassed,
      passed: alreadyPassed || result.passed,
      scorePercent: result.scorePercent ?? null
    }
  });
  showView("result");
}

async function loadInviteInfo() {
  const info = await fetchJson(`/api/invite/${inviteToken}`);
  inviteEmail.textContent = `Invite for ${info.email}`;

  if (info.passedAt && info.latestAttempt) {
    renderResult(info.latestAttempt, true);
  }
}

async function openAttempt(payload) {
  state.invite = payload.invite;
  state.attempt = payload.attempt;
  state.training = payload.training;
  storeAttempt(payload.attempt);
  renderCurrentTopic();
}

async function resumeAttemptIfPossible() {
  if (!resultView.classList.contains("hidden")) {
    return;
  }

  const stored = getStoredAttempt();
  if (!stored) {
    return;
  }

  try {
    const payload = await fetchJson(`/api/attempts/${stored.attemptId}?accessToken=${encodeURIComponent(stored.accessToken)}`);
    await openAttempt(payload);
  } catch {
    clearStoredAttempt();
  }
}

codeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  gateMessage.classList.add("hidden");

  try {
    const payload = await fetchJson(`/api/invite/${inviteToken}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: accessCode.value })
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
    choiceIndex
  });
});

submitTopicButton.addEventListener("click", async () => {
  const currentTopic = state.training.topics[state.attempt.currentTopicIndex];
  const answers = currentTopic.questions.map((_, questionIndex) => {
    const checked = topicForm.querySelector(`input[name="question-${questionIndex}"]:checked`);
    return checked ? Number(checked.value) : null;
  });

  if (answers.some((value) => value === null)) {
    setCallout(topicMessage, "error", "Answer every question in this topic before submitting.");
    return;
  }

  submitTopicButton.disabled = true;

  try {
    const result = await fetchJson(`/api/attempts/${state.attempt.id}/topics/${state.attempt.currentTopicIndex}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken: state.attempt.accessToken,
        answers
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
        accessToken: state.attempt.accessToken
      })
    });

    await openAttempt(payload);
  } catch (error) {
    resultSummary.textContent = error.message;
  }
});

loadInviteInfo()
  .then(resumeAttemptIfPossible)
  .catch((error) => {
    setCallout(gateMessage, "error", error.message);
  });
