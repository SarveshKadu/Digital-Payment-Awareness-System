/**
 * PayShield Before You Pay Checklist — no real financial credentials collected.
 */
const CHECKLIST_ITEMS = [
  'Is the receiver correct?',
  'Is the amount correct?',
  'Do I know this person/business?',
  'Did I verify the QR code?',
  'Is the payment request genuine?',
  'Am I being pressured to pay quickly?',
];

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('checklistItems');
  const resultEl = document.getElementById('checklistResult');
  if (!container) return;

  const state = new Array(CHECKLIST_ITEMS.length).fill(false);

  const render = () => {
    container.innerHTML = CHECKLIST_ITEMS.map(
      (text, i) => `
      <div class="checklist-item ${state[i] ? 'done' : ''}" data-idx="${i}">
        <div class="checklist-box">${state[i] ? '✓' : ''}</div>
        <span>${text}</span>
      </div>`
    ).join('');

    container.querySelectorAll('.checklist-item').forEach((item) => {
      item.addEventListener('click', () => {
        const idx = Number(item.dataset.idx);
        state[idx] = !state[idx];
        render();
      });
    });

    const allDone = state.every(Boolean);
    resultEl.textContent = allDone ? "You're ready to pay safely." : `${state.filter(Boolean).length}/${CHECKLIST_ITEMS.length} checked`;
    resultEl.style.color = allDone ? 'var(--success)' : 'var(--text-dim)';
  };

  render();
});
