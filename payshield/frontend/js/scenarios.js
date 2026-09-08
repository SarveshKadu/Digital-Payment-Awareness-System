/**
 * PayShield — Can You Spot the Scam?
 * Fetches fraud scenarios from the backend, lets the user decide
 * SAFE / SUSPICIOUS, then reveals the explanation via the API.
 */
let ps_score = 0;
let ps_answered = 0;

async function loadScenarios() {
  const grid = document.getElementById('scenariosGrid');
  grid.innerHTML = '<p>Loading scenarios <span class="loading-dot"></span></p>';
  try {
    const { scenarios } = await PayShieldAPI.scenarios();
    if (!scenarios.length) {
      grid.innerHTML = '<p>No scenarios available yet. Make sure the backend has been seeded (`npm run seed`).</p>';
      return;
    }
    grid.innerHTML = scenarios.map(scenarioCardHtml).join('');
    scenarios.forEach((s) => attachScenarioHandlers(s._id));
  } catch (err) {
    grid.innerHTML = `<p style="color:var(--danger);">Could not load scenarios: ${psEscapeHtml(err.message)}</p>`;
  }
}

function scenarioCardHtml(s) {
  return `
    <div class="card scenario-card" id="scenario-${s._id}">
      <span class="scenario-tag">${psEscapeHtml(s.category)}</span>
      <h4 style="margin-bottom:0;">${psEscapeHtml(s.title)}</h4>
      <div class="scenario-msg">${psEscapeHtml(s.message)}</div>
      <div class="decision-row">
        <button class="decision-btn safe" data-decision="SAFE">SAFE</button>
        <button class="decision-btn suspicious" data-decision="SUSPICIOUS">SUSPICIOUS</button>
      </div>
      <div class="result-area"></div>
    </div>`;
}

function attachScenarioHandlers(id) {
  const card = document.getElementById(`scenario-${id}`);
  const buttons = card.querySelectorAll('.decision-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      buttons.forEach((b) => (b.disabled = true));
      const decision = btn.dataset.decision;
      try {
        const res = await PayShieldAPI.answerScenario(id, decision);
        ps_answered += 1;
        if (res.correct) ps_score += 10;
        document.getElementById('scenarioScore').textContent = ps_score;
        document.getElementById('scenarioAnswered').textContent = ps_answered;

        const resultArea = card.querySelector('.result-area');
        resultArea.innerHTML = `
          <div class="result-panel ${res.correct ? 'correct' : 'incorrect'}">
            <strong>${res.correct ? '✓ Correct!' : '✗ Not quite.'}</strong>
            <span style="display:block;margin:6px 0;">This message was actually <strong>${res.correctDecision}</strong>.</span>
            <p style="margin:8px 0 4px;color:inherit;">${psEscapeHtml(res.explanation)}</p>
            ${res.warningSigns && res.warningSigns.length ? `<p style="margin:8px 0 2px;font-weight:600;">Warning signs:</p><ul>${res.warningSigns.map((w) => `<li>${psEscapeHtml(w)}</li>`).join('')}</ul>` : ''}
            ${res.safetyRecommendation ? `<p style="margin:8px 0 0;"><strong>Recommendation:</strong> ${psEscapeHtml(res.safetyRecommendation)}</p>` : ''}
          </div>`;
      } catch (err) {
        card.querySelector('.result-area').innerHTML = `<p style="color:var(--danger);font-size:.85rem;">${psEscapeHtml(err.message)}</p>`;
        buttons.forEach((b) => (b.disabled = false));
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', loadScenarios);
