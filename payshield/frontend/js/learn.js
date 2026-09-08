/**
 * PayShield — Learn Digital Payments
 * Fetches learning content from the backend and renders expandable cards.
 */
const CATEGORY_ICONS = {
  UPI: '⚡',
  'QR Codes': '🔳',
  'Debit Cards': '💳',
  'Credit Cards': '💠',
  'Mobile Wallets': '👛',
  'Internet Banking': '🌐',
  'Contactless Payments': '📶',
};

let ps_learnItems = [];

async function loadLearningContent() {
  const grid = document.getElementById('learnGrid');
  grid.innerHTML = '<p>Loading content <span class="loading-dot"></span></p>';
  try {
    const { paymentMethods } = await PayShieldAPI.learningContent();
    ps_learnItems = paymentMethods;
    grid.innerHTML = paymentMethods
      .map(
        (item, i) => `
      <div class="card card-hover" data-idx="${i}" style="cursor:pointer;">
        <div style="font-size:1.8rem;">${CATEGORY_ICONS[item.category] || '💡'}</div>
        <h4>${psEscapeHtml(item.title)}</h4>
        <p style="font-size:.85rem;">${psEscapeHtml(item.description)}</p>
        <span class="tag-pill">Tap to explore →</span>
      </div>`
      )
      .join('');

    grid.querySelectorAll('[data-idx]').forEach((card) => {
      card.addEventListener('click', () => openLearnModal(Number(card.dataset.idx)));
    });
  } catch (err) {
    grid.innerHTML = `<p style="color:var(--danger);">Could not load content: ${psEscapeHtml(err.message)}</p>`;
  }
}

function openLearnModal(idx) {
  const item = ps_learnItems[idx];
  const backdrop = document.getElementById('learnModalBackdrop');
  const modal = document.getElementById('learnModal');

  modal.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
      <h3>${CATEGORY_ICONS[item.category] || '💡'} ${psEscapeHtml(item.title)}</h3>
      <button class="icon-btn" id="closeLearnModal">✕</button>
    </div>
    <p><strong>What is it?</strong><br/>${psEscapeHtml(item.description)}</p>
    ${item.howItWorks ? `<p><strong>How does it work?</strong><br/>${psEscapeHtml(item.howItWorks)}</p>` : ''}
    ${item.advantages && item.advantages.length ? `<p style="margin-bottom:4px;"><strong>Advantages</strong></p><ul style="padding-left:18px;color:var(--text-dim);">${item.advantages.map((a) => `<li>${psEscapeHtml(a)}</li>`).join('')}</ul>` : ''}
    ${item.risks && item.risks.length ? `<p style="margin-bottom:4px;"><strong>Risks</strong></p><ul style="padding-left:18px;color:var(--text-dim);">${item.risks.map((r) => `<li>${psEscapeHtml(r)}</li>`).join('')}</ul>` : ''}
    ${item.safetyTips && item.safetyTips.length ? `<p style="margin-bottom:4px;"><strong>Safety tips</strong></p><ul style="padding-left:18px;color:var(--text-dim);">${item.safetyTips.map((t) => `<li>✓ ${psEscapeHtml(t)}</li>`).join('')}</ul>` : ''}
  `;

  backdrop.style.display = 'flex';
  document.getElementById('closeLearnModal').addEventListener('click', closeLearnModal);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeLearnModal(); });
}

function closeLearnModal() {
  document.getElementById('learnModalBackdrop').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', loadLearningContent);
