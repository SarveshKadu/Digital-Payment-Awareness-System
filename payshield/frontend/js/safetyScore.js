/**
 * PayShield — Your Digital Safety Score
 * A 5-question snapshot quiz on the homepage that produces a fictional,
 * educational safety score with strengths / improvement areas.
 */
const SAFETY_SCORE_QUESTIONS = [
  {
    q: 'If someone calls asking for your UPI PIN to "receive" money, you would:',
    options: [
      { text: 'Share it, since they said it was needed to receive money', pts: 0, topic: 'UPI knowledge' },
      { text: 'Refuse — a PIN is never needed to receive money', pts: 20, topic: 'UPI knowledge' },
    ],
  },
  {
    q: 'A bank employee calls asking for your OTP to "verify" your account. You would:',
    options: [
      { text: 'Share the OTP since they claim to be from the bank', pts: 0, topic: 'OTP safety' },
      { text: 'Never share an OTP with anyone over a call', pts: 20, topic: 'OTP safety' },
    ],
  },
  {
    q: 'Before scanning a QR code at a shop, you usually:',
    options: [
      { text: 'Just scan and pay without checking anything', pts: 0, topic: 'QR-code awareness' },
      { text: 'Check the payee name shown after scanning', pts: 20, topic: 'QR-code awareness' },
    ],
  },
  {
    q: 'You get a call from "customer care" about a failed transaction, asking you to install a remote-access app. You would:',
    options: [
      { text: 'Install it since they sound helpful', pts: 0, topic: 'Fake customer-care scams' },
      { text: 'Decline and call the bank\'s official number instead', pts: 20, topic: 'Fake customer-care scams' },
    ],
  },
  {
    q: 'A message offers unexpected cashback with a link and a countdown timer. You would:',
    options: [
      { text: 'Click quickly before the offer expires', pts: 0, topic: 'Phishing awareness' },
      { text: 'Ignore it and check the official app for real offers', pts: 20, topic: 'Phishing awareness' },
    ],
  },
];

function renderSafetyScoreQuiz() {
  const container = document.getElementById('safetyScoreQuiz');
  if (!container) return;

  let currentQ = 0;
  const results = [];

  const renderQuestion = () => {
    const q = SAFETY_SCORE_QUESTIONS[currentQ];
    container.innerHTML = `
      <div class="progress-row"><span>Question ${currentQ + 1} of ${SAFETY_SCORE_QUESTIONS.length}</span><span></span></div>
      <div class="progress-track" style="margin-bottom:20px;"><div class="progress-fill" style="width:${(currentQ / SAFETY_SCORE_QUESTIONS.length) * 100}%"></div></div>
      <h4 style="margin-bottom:16px;">${psEscapeHtml(q.q)}</h4>
      <div class="stack">
        ${q.options.map((opt, i) => `<button class="decision-btn" data-idx="${i}" style="text-align:left;">${psEscapeHtml(opt.text)}</button>`).join('')}
      </div>`;

    container.querySelectorAll('.decision-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const opt = q.options[Number(btn.dataset.idx)];
        results.push(opt);
        currentQ += 1;
        if (currentQ < SAFETY_SCORE_QUESTIONS.length) {
          renderQuestion();
        } else {
          renderScore();
        }
      });
    });
  };

  const renderScore = async () => {
    const score = results.reduce((sum, r) => sum + r.pts, 0);
    const strengths = results.filter((r) => r.pts > 0).map((r) => r.topic);
    const improvements = [...new Set(results.filter((r) => r.pts === 0).map((r) => r.topic))];
    const uniqueStrengths = [...new Set(strengths)];

    container.innerHTML = `
      <div class="risk-meter">
        <div class="eyebrow" style="justify-content:center;">DIGITAL SAFETY SCORE</div>
        <div class="risk-score">${score}<span style="font-size:1.4rem;color:var(--text-faint);">/100</span></div>
      </div>
      <div class="grid grid-2" style="margin-top:10px;">
        <div>
          <h4 style="color:var(--success);font-size:.95rem;">Your strengths</h4>
          ${uniqueStrengths.length ? `<ul style="padding-left:18px;color:var(--text-dim);font-size:.9rem;">${uniqueStrengths.map((s) => `<li>✓ ${psEscapeHtml(s)}</li>`).join('')}</ul>` : '<p style="font-size:.85rem;">Keep practicing to build your strengths.</p>'}
        </div>
        <div>
          <h4 style="color:var(--warning);font-size:.95rem;">Areas to improve</h4>
          ${improvements.length ? `<ul style="padding-left:18px;color:var(--text-dim);font-size:.9rem;">${improvements.map((s) => `<li>⚠ ${psEscapeHtml(s)}</li>`).join('')}</ul>` : '<p style="font-size:.85rem;">Great work — no major gaps found!</p>'}
        </div>
      </div>
      <div class="divider"></div>
      <p style="font-size:.85rem;">Recommended next step: <a href="learn.html" style="color:var(--cyan);font-weight:600;">Learn Digital Payments</a> and <a href="scenarios.html" style="color:var(--cyan);font-weight:600;">Can You Spot the Scam?</a></p>
      <button class="btn btn-outline btn-sm" id="retakeScoreBtn">Retake</button>`;

    document.getElementById('retakeScoreBtn').addEventListener('click', () => {
      currentQ = 0;
      results.length = 0;
      renderQuestion();
    });
  };

  renderQuestion();
}

document.addEventListener('DOMContentLoaded', renderSafetyScoreQuiz);
