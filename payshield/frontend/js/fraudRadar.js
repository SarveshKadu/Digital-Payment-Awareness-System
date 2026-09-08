/**
 * PayShield Fraud Radar — fictional, educational risk score only.
 * Never claims to detect actual fraud.
 */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('radarCalcBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const sender = Number(document.getElementById('radarSender').value);
    const urgency = Number(document.getElementById('radarUrgency').value);
    const link = Number(document.getElementById('radarLink').value);
    const otp = Number(document.getElementById('radarOtp').value);

    let score = Math.min(100, sender + urgency + link + otp);

    const reasons = [];
    if (sender >= 30) reasons.push('⚠️ Unknown sender');
    else if (sender >= 15) reasons.push('ℹ️ Contact claims to be official — verify independently');
    if (urgency >= 10) reasons.push('⚠️ Urgent payment request');
    if (link === 25) reasons.push('⚠️ Suspicious or unfamiliar link');
    if (otp === 20) reasons.push('⚠️ OTP / PIN / CVV requested');
    if (reasons.length === 0) reasons.push('✓ No major red flags detected in this fictional scenario');

    let level = 'risk-low';
    let label = 'LOW RISK';
    let action = 'This situation shows few warning signs, but always stay alert and verify unfamiliar requests through official channels.';
    if (score >= 70) {
      level = 'risk-high';
      label = 'HIGH RISK';
      action = 'Do not click any links, share OTPs, or make a payment. Verify through an official channel before doing anything.';
    } else if (score >= 35) {
      level = 'risk-medium';
      label = 'MEDIUM RISK';
      action = 'Pause before acting. Independently verify the sender and the request through an official number or app.';
    }

    document.getElementById('radarResult').innerHTML = `
      <div class="eyebrow" style="justify-content:center;">FICTIONAL RISK SCORE — EDUCATIONAL ONLY</div>
      <div class="risk-score">${score}<span style="font-size:1.2rem;color:var(--text-faint);">/100</span></div>
      <span class="risk-label ${level}">${label}</span>
      <div class="divider"></div>
      <div style="text-align:left;">
        <h4 style="font-size:.95rem;">Reasons</h4>
        <ul style="padding-left:18px;color:var(--text-dim);font-size:.88rem;">
          ${reasons.map((r) => `<li>${r}</li>`).join('')}
        </ul>
        <h4 style="font-size:.95rem;margin-top:14px;">Recommended Action</h4>
        <p style="font-size:.88rem;">${action}</p>
      </div>`;
  });
});
