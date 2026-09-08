/**
 * PayShield main.js
 * Theme management + generic helpers used across pages.
 */
const PayShieldTheme = {
  key: 'payshield_theme',
  init() {
    const saved = localStorage.getItem(this.key) || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(this.key, next);
  },
};
PayShieldTheme.init();

document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'themeToggle') PayShieldTheme.toggle();
});

function psToast(message, timeout = 3200) {
  document.querySelectorAll('.toast').forEach((t) => t.remove());
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), timeout);
}

function psEscapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}
