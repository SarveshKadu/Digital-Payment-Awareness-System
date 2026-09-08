const MYTHS = [
  { myth: 'Scanning a QR code always means you will receive money.', fact: 'QR codes can also be used to initiate a payment out of your account, so always check what you are being asked to do before scanning.' },
  { myth: 'Bank employees can ask for your OTP.', fact: 'Never share OTPs or PINs with anyone claiming to help, including people claiming to be from your bank.' },
  { myth: 'You need to enter your PIN to receive money on UPI.', fact: 'Receiving money never requires a PIN. A PIN is only needed to authorize an outgoing payment.' },
  { myth: 'If a message has your bank\'s logo, it must be genuine.', fact: 'Logos and sender names can be easily copied. Always verify through the bank\'s official app or website.' },
  { myth: 'Only old people fall for online payment scams.', fact: 'Scammers target people of all ages using tactics like urgency, fake offers and social engineering.' },
  { myth: 'A payment screenshot is proof that money was received.', fact: 'Screenshots can be faked or edited. Always confirm the credit directly in your own bank app or statement.' },
  { myth: 'Public Wi-Fi is safe for making payments if the app has a lock icon.', fact: 'Public Wi-Fi can still expose your data to interception. Use mobile data or a trusted network for financial transactions.' },
  { myth: 'Contactless/tap-to-pay is always risk-free since no PIN is needed.', fact: 'Small contactless payments may skip a PIN, so a lost or stolen card still carries some risk until it is blocked.' },
  { myth: 'Cashback offers received by SMS are usually genuine if they mention a real bank.', fact: 'Unsolicited cashback messages with links are a common phishing tactic. Verify offers only within the official app.' },
  { myth: 'Installing a remote-access app to let "support" fix an issue is normal practice.', fact: 'Legitimate banks and payment apps never ask you to install remote-access software to resolve an issue.' },
  { myth: 'If the caller already knows your name and some account details, they must be legitimate.', fact: 'Scammers often gather partial personal information beforehand to sound convincing. Verify independently regardless.' },
  { myth: 'Once you enter your UPI PIN, you can always reverse a mistaken payment instantly.', fact: 'UPI payments are usually instant and irreversible. Verify every detail carefully before confirming.' },
];

function renderMyths() {
  const list = document.getElementById('mythsList');
  if (!list) return;
  list.innerHTML = MYTHS.map(
    (m) => `
    <div class="myth-fact-card">
      <div class="myth"><div class="label">MYTH</div><p style="color:var(--text);margin:0;">${psEscapeHtml(m.myth)}</p></div>
      <div class="fact"><div class="label">FACT</div><p style="color:var(--text);margin:0;">${psEscapeHtml(m.fact)}</p></div>
    </div>`
  ).join('');
}

document.addEventListener('DOMContentLoaded', renderMyths);
