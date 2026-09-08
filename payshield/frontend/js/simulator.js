/**
 * PayShield Payment Simulator — purely client-side, fictional only.
 * No data here is ever sent as a real payment.
 */
document.addEventListener('DOMContentLoaded', () => {
  const steps = ['simStep1', 'simStep2', 'simStep3', 'simStep4', 'simComplete'];
  const bars = ['simBar1', 'simBar2', 'simBar3', 'simBar4'];

  function goTo(stepId) {
    steps.forEach((id) => document.getElementById(id).classList.toggle('active', id === stepId));
    const idx = steps.indexOf(stepId);
    bars.forEach((id, i) => document.getElementById(id).classList.toggle('done', i < idx));
  }

  document.getElementById('simToStep2').addEventListener('click', () => {
    const receiver = document.getElementById('simReceiver').value.trim() || 'Unnamed receiver';
    const amount = document.getElementById('simAmount').value || '0';
    const purpose = document.getElementById('simPurpose').value.trim() || 'General payment';

    document.getElementById('simReceiverShow').textContent = receiver;
    document.getElementById('simAmountShow').textContent = `₹${amount}`;
    document.getElementById('simPurposeShow').textContent = purpose;
    document.getElementById('simSummaryReceiver').textContent = receiver;
    document.getElementById('simSummaryAmount').textContent = amount;
    document.getElementById('simSummaryPurpose').textContent = purpose;

    goTo('simStep2');
  });

  document.getElementById('simVerifiedYes').addEventListener('click', () => goTo('simStep3'));
  document.getElementById('simVerifiedNo').addEventListener('click', () => {
    psToast('Pause and verify the receiver\'s name before continuing in a real transaction.');
  });

  document.getElementById('simToStep4').addEventListener('click', () => goTo('simStep4'));
  document.getElementById('simToComplete').addEventListener('click', () => goTo('simComplete'));

  document.getElementById('simRestart').addEventListener('click', () => {
    document.getElementById('simReceiver').value = '';
    document.getElementById('simAmount').value = '';
    document.getElementById('simPurpose').value = '';
    goTo('simStep1');
  });
});
