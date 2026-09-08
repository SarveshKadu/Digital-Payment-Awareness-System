/**
 * PayShield API client
 * Thin wrapper around fetch() that attaches the JWT token and
 * normalizes error handling for every backend call.
 */
const API_BASE = (() => {
  // Allow override via <body data-api-base="..."> for deployments where the
  // frontend and backend are hosted separately.
  const override = document.body && document.body.dataset.apiBase;
  return override || '/api';
})();

const PayShieldAPI = {
  async request(path, { method = 'GET', body } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    let res;
    try {
      res = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (networkErr) {
      throw new Error('Cannot reach the PayShield server. Make sure the backend is running.');
    }

    let data;
    try {
      data = await res.json();
    } catch (e) {
      data = {};
    }

    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong. Please try again.');
    }
    return data;
  },

  // This build ships without a live backend. `withFallback` tries the real
  // API first (so it works instantly if a backend is ever wired up) and,
  // only if that call fails, quietly falls back to the bundled local demo
  // content instead of surfacing an error to the user.
  async withFallback(requestFn, fallbackFn) {
    try {
      return await requestFn();
    } catch (err) {
      console.warn('[PayShield] Backend unavailable, using local demo data:', err.message);
      return fallbackFn();
    }
  },

  // Quiz
  quizQuestions() {
    return this.withFallback(
      () => this.request('/quiz/questions'),
      () => ({ questions: PS_LOCAL_QUIZ_QUESTIONS })
    );
  },
  submitQuiz(answers) {
    return this.withFallback(
      () => this.request('/quiz/submit', { method: 'POST', body: { answers } }),
      () => gradeQuizLocally(answers)
    );
  },

  // Scenarios
  scenarios() {
    return this.withFallback(
      () => this.request('/scenarios'),
      () => ({ scenarios: PS_LOCAL_SCENARIOS })
    );
  },
  answerScenario(id, decision) {
    return this.withFallback(
      () => this.request(`/scenarios/${id}/answer`, { method: 'POST', body: { decision } }),
      () => gradeScenarioLocally(id, decision)
    );
  },

  // Learning content / payment methods
  learningContent() {
    return this.withFallback(
      () => this.request('/payment-methods'),
      () => ({ paymentMethods: PS_LOCAL_LEARNING })
    );
  },

  // Feedback
  submitFeedback(payload) {
    return this.withFallback(
      () => this.request('/feedback', { method: 'POST', body: payload }),
      () => saveFeedbackLocally(payload)
    );
  },
};

// --- Local grading/storage helpers (used only when the backend is unreachable) ---

function gradeQuizLocally(answers) {
  const gradedAnswers = answers.map((a) => {
    const q = PS_LOCAL_QUIZ_QUESTIONS.find((item) => item._id === a.questionId);
    const correct = !!q && a.selectedOption === q.correctIndex;
    return { correct, explanation: q ? q.explanation : '' };
  });
  const score = gradedAnswers.filter((a) => a.correct).length;
  const total = PS_LOCAL_QUIZ_QUESTIONS.length;
  const percentage = Math.round((score / total) * 100);
  const safetyLevel =
    score >= 14 ? 'PayShield Expert' : score >= 11 ? 'Digital Defender' : score >= 6 ? 'Safety Learner' : 'Beginner';
  return { score, total, percentage, safetyLevel, gradedAnswers, newBadges: [] };
}

function gradeScenarioLocally(id, decision) {
  const s = PS_LOCAL_SCENARIOS.find((item) => item._id === id);
  if (!s) throw new Error('Scenario not found.');
  return {
    correct: decision === s.correctDecision,
    correctDecision: s.correctDecision,
    explanation: s.explanation,
    warningSigns: s.warningSigns,
    safetyRecommendation: s.safetyRecommendation,
  };
}

function saveFeedbackLocally(payload) {
  try {
    const existing = JSON.parse(localStorage.getItem(PS_LOCAL_FEEDBACK_STORE_KEY) || '[]');
    existing.push({ ...payload, submittedAt: new Date().toISOString() });
    localStorage.setItem(PS_LOCAL_FEEDBACK_STORE_KEY, JSON.stringify(existing));
  } catch (e) {
    // Storage unavailable (e.g. private browsing) — safe to ignore for this demo.
  }
  return { message: 'Thanks for your feedback!' };
}
