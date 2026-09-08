/**
 * PayShield — Feedback & Awareness Survey
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');
  if (!form) return;

  let selectedRating = null;
  const ratingButtons = document.querySelectorAll('#ratingRow .decision-btn');
  ratingButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedRating = Number(btn.dataset.rating);
      ratingButtons.forEach((b) => b.style.borderColor = '');
      btn.style.borderColor = 'var(--cyan)';
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errBox = document.getElementById('feedbackError');
    errBox.textContent = '';

    if (!selectedRating) {
      errBox.textContent = 'Please select a confidence rating.';
      return;
    }

    const payload = {
      name: document.getElementById('fName').value.trim(),
      email: document.getElementById('fEmail').value.trim(),
      rating: selectedRating,
      message: document.getElementById('fMessage').value.trim(),
    };

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Submitting...';

    try {
      await PayShieldAPI.submitFeedback(payload);
      form.style.display = 'none';
      document.getElementById('feedbackSuccess').style.display = 'block';
    } catch (err) {
      errBox.textContent = err.message;
      btn.disabled = false;
      btn.textContent = 'Submit Feedback';
    }
  });
});
