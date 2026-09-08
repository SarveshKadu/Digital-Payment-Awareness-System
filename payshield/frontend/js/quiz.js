/**
 * PayShield Quiz Arena — 15 questions, 30s timer per question, scored via backend.
 */
let ps_questions = [];
let ps_currentIndex = 0;
let ps_userAnswers = [];
let ps_timer = null;
let ps_timeLeft = 30;

function safetyLevelLabel(score) {
  if (score >= 14) return 'PayShield Expert';
  if (score >= 11) return 'Digital Defender';
  if (score >= 6) return 'Safety Learner';
  return 'Beginner';
}

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('quizStartBtn');
  startBtn.addEventListener('click', startQuiz);
});

async function startQuiz() {
  const intro = document.getElementById('quizIntro');
  intro.innerHTML = '<p>Loading questions <span class="loading-dot"></span></p>';
  try {
    const { questions } = await PayShieldAPI.quizQuestions();
    ps_questions = questions;
    ps_userAnswers = [];
    ps_currentIndex = 0;

    document.getElementById('quizIntro').style.display = 'none';
    document.getElementById('quizPlay').style.display = 'block';
    renderQuestion();
  } catch (err) {
    intro.innerHTML = `<p style="color:var(--danger);">${psEscapeHtml(err.message)}</p>`;
  }
}

function renderQuestion() {
  clearInterval(ps_timer);
  ps_timeLeft = 30;
  const play = document.getElementById('quizPlay');
  const q = ps_questions[ps_currentIndex];
  const progressPct = (ps_currentIndex / ps_questions.length) * 100;

  play.innerHTML = `
    <div class="progress-row">
      <span>Question ${ps_currentIndex + 1} of ${ps_questions.length}</span>
      <span class="timer-badge" id="quizTimer">⏱ 30s</span>
    </div>
    <div class="progress-track" style="margin-bottom:20px;"><div class="progress-fill" style="width:${progressPct}%"></div></div>
    <span class="tag-pill">${psEscapeHtml(q.category)}</span>
    <h4 style="margin:12px 0 16px;">${psEscapeHtml(q.question)}</h4>
    <div class="stack" id="quizOptions">
      ${q.options.map((opt, i) => `<button class="decision-btn" data-idx="${i}" style="text-align:left;">${psEscapeHtml(opt)}</button>`).join('')}
    </div>`;

  document.querySelectorAll('#quizOptions .decision-btn').forEach((btn) => {
    btn.addEventListener('click', () => selectAnswer(Number(btn.dataset.idx)));
  });

  ps_timer = setInterval(() => {
    ps_timeLeft -= 1;
    const timerEl = document.getElementById('quizTimer');
    if (timerEl) {
      timerEl.textContent = `⏱ ${ps_timeLeft}s`;
      timerEl.classList.toggle('low', ps_timeLeft <= 10);
    }
    if (ps_timeLeft <= 0) {
      clearInterval(ps_timer);
      selectAnswer(-1); // time's up, no answer selected
    }
  }, 1000);
}

function selectAnswer(idx) {
  clearInterval(ps_timer);
  ps_userAnswers.push({ questionId: ps_questions[ps_currentIndex]._id, selectedOption: idx });
  ps_currentIndex += 1;

  if (ps_currentIndex < ps_questions.length) {
    renderQuestion();
  } else {
    finishQuiz();
  }
}

async function finishQuiz() {
  const play = document.getElementById('quizPlay');
  play.innerHTML = '<p>Scoring your quiz <span class="loading-dot"></span></p>';

  try {
    const res = await PayShieldAPI.submitQuiz(ps_userAnswers);
    play.style.display = 'none';
    const resultView = document.getElementById('quizResultView');
    resultView.style.display = 'block';
    resultView.innerHTML = `
      <div class="center">
        <div class="eyebrow" style="justify-content:center;">QUIZ COMPLETE</div>
        <div class="risk-score">${res.score}<span style="font-size:1.3rem;color:var(--text-faint);">/${res.total}</span></div>
        <span class="risk-label risk-low" style="background:rgba(47,111,237,.14);color:var(--primary-soft);">${res.safetyLevel}</span>
        <p style="margin-top:14px;">You scored ${res.percentage}%.</p>
        ${res.newBadges && res.newBadges.length ? `<p style="color:var(--cyan);font-weight:600;">🏆 New badge unlocked: ${res.newBadges.join(', ')}</p>` : ''}
        <div style="display:flex;gap:10px;justify-content:center;margin-top:18px;flex-wrap:wrap;">
          <button class="btn btn-outline" id="quizRetry">Retake Quiz</button>
        </div>
      </div>
      <div class="divider"></div>
      <div class="stack">
        ${res.gradedAnswers.map((a, i) => `
          <div class="card" style="padding:14px;">
            <p style="margin:0;font-size:.88rem;"><strong>Q${i + 1}:</strong> ${a.correct ? '✓ Correct' : '✗ Incorrect'}</p>
            ${a.explanation ? `<p style="margin:6px 0 0;font-size:.82rem;color:var(--text-dim);">${psEscapeHtml(a.explanation)}</p>` : ''}
          </div>`).join('')}
      </div>`;

    document.getElementById('quizRetry').addEventListener('click', () => {
      resultView.style.display = 'none';
      document.getElementById('quizIntro').style.display = 'block';
      document.getElementById('quizIntro').innerHTML = `<p>You'll have 30 seconds per question. Ready?</p><button class="btn btn-primary" id="quizStartBtn">Start Quiz</button>`;
      document.getElementById('quizStartBtn').addEventListener('click', startQuiz);
    });
  } catch (err) {
    play.innerHTML = `<p style="color:var(--danger);">${psEscapeHtml(err.message)}</p>`;
  }
}
