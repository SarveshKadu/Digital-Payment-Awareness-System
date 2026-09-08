/**
 * PayShield Payment Safety Map — Sender → Payment App → Bank → Receiver
 */
const JOURNEY_STAGES = [
  {
    name: 'Sender',
    icon: '🧍',
    happens: 'You initiate a payment by entering an amount and choosing a receiver in your payment app.',
    info: 'Receiver identifier (UPI ID/phone), amount, purpose note.',
    check: 'Confirm the receiver name shown matches who you intend to pay, and that the amount is correct.',
    risks: 'Typing the wrong UPI ID, scanning a tampered QR code, or being pressured to pay quickly.',
  },
  {
    name: 'Payment App',
    icon: '📱',
    happens: 'The app verifies your identity (PIN/biometric) and forwards the request to the payment network.',
    info: 'App login session, device identity, transaction PIN (entered locally, never sent as plain text).',
    check: 'Ensure you\'re using the official app, downloaded from an official app store, with app-lock enabled.',
    risks: 'Fake look-alike apps, malware capturing screen taps, unlocked/shared devices.',
  },
  {
    name: 'Bank',
    icon: '🏦',
    happens: 'Your bank validates the request, checks your balance, and debits your account.',
    info: 'Account number, IFSC, available balance, transaction authorization.',
    check: 'Check your bank\'s SMS/notification alerts are enabled so you\'re notified of every debit.',
    risks: 'Fraudulent standing instructions, SIM-swap attacks intercepting bank OTPs.',
  },
  {
    name: 'Receiver',
    icon: '🏪',
    happens: 'The receiving bank credits the payee\'s account, and both parties get a confirmation.',
    info: 'Receiver\'s account details and the confirmation notification.',
    check: 'The receiver should independently confirm the credit landed — never trust a forwarded screenshot alone.',
    risks: 'Fake "payment sent" screenshots used to pressure early release of goods or services.',
  },
];

function renderJourney() {
  const mapEl = document.getElementById('journeyMap');
  const detailEl = document.getElementById('journeyDetail');
  if (!mapEl) return;

  mapEl.innerHTML = JOURNEY_STAGES.map(
    (s, i) => `
    <div class="journey-node ${i === 0 ? 'active' : ''}" data-idx="${i}">
      <div class="num">STAGE 0${i + 1}</div>
      <div style="font-size:1.6rem;margin:8px 0;">${s.icon}</div>
      <strong>${s.name}</strong>
    </div>`
  ).join('');

  const showDetail = (idx) => {
    const s = JOURNEY_STAGES[idx];
    detailEl.innerHTML = `
      <h3>${s.icon} ${s.name}</h3>
      <p><strong>What happens:</strong> ${s.happens}</p>
      <p><strong>Information involved:</strong> ${s.info}</p>
      <p><strong>What to check:</strong> ${s.check}</p>
      <p><strong>Possible risks:</strong> ${s.risks}</p>`;
  };

  mapEl.querySelectorAll('.journey-node').forEach((node) => {
    node.addEventListener('click', () => {
      mapEl.querySelectorAll('.journey-node').forEach((n) => n.classList.remove('active'));
      node.classList.add('active');
      showDetail(Number(node.dataset.idx));
    });
  });

  showDetail(0);
}

document.addEventListener('DOMContentLoaded', renderJourney);
