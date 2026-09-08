/**
 * PayShield shared components: navbar, footer, emergency FAB.
 * Injected into any page containing <div id="navbar-root"></div> etc.
 */
const PayShieldComponents = {
  shieldMark(size = 34) {
    return `<svg class="brand-mark" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stop-color="#2F6FED"/><stop offset="1" stop-color="#22D3C6"/>
        </linearGradient>
      </defs>
      <path d="M24 3 L42 10 V22 C42 33 35 41 24 45 C13 41 6 33 6 22 V10 Z" fill="url(#shieldGrad)"/>
      <path d="M16 24 L21.5 29.5 L33 17" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>`;
  },

  navLinks: [
    { href: 'index.html', page: 'home', key: 'nav_home', label: 'Home' },
    { href: 'scenarios.html', page: 'scenarios', key: 'nav_spot', label: 'Spot the Scam' },
    { href: 'simulator.html', page: 'simulator', key: 'nav_simulator', label: 'Simulator' },
    { href: 'fraud-radar.html', page: 'radar', key: 'nav_radar', label: 'Fraud Radar' },
    { href: 'safety-map.html', page: 'map', key: 'nav_map', label: 'Safety Map' },
    { href: 'checklist.html', page: 'checklist', key: 'nav_checklist', label: 'Checklist' },
    { href: 'learn.html', page: 'learn', key: 'nav_learn', label: 'Learn' },
    { href: 'myths.html', page: 'myths', key: 'nav_myths', label: 'Myths vs Facts' },
    { href: 'quiz.html', page: 'quiz', key: 'nav_quiz', label: 'Quiz Arena' },
  ],

  renderNavbar(activePage) {
    const root = document.getElementById('navbar-root');
    if (!root) return;

    const links = this.navLinks
      .map(
        (l) =>
          `<a href="${l.href}" data-i18n="${l.key}" class="${activePage === l.page ? 'active' : ''}">${l.label}</a>`
      )
      .join('');

    root.innerHTML = `
      <nav class="navbar">
        <div class="navbar-inner">
          <a href="index.html" class="brand">${this.shieldMark(32)} PayShield</a>
          <div class="nav-links" id="navLinksList">
            ${links}
          </div>
          <div class="nav-actions">
            <select class="lang-select" id="langSelect" aria-label="Language">
              <option value="en">EN</option>
              <option value="mr">मराठी</option>
            </select>
            <button class="icon-btn" id="themeToggle" title="Toggle theme" aria-label="Toggle theme">🌓</button>
            <button class="icon-btn nav-toggle" id="navToggle" aria-label="Menu">☰</button>
          </div>
        </div>
      </nav>`;

    const toggle = document.getElementById('navToggle');
    const list = document.getElementById('navLinksList');
    if (toggle) toggle.addEventListener('click', () => list.classList.toggle('open'));

    const langSelect = document.getElementById('langSelect');
    langSelect.value = PayShieldI18N.current();
    langSelect.addEventListener('change', (e) => PayShieldI18N.setLang(e.target.value));
  },

  renderFooter() {
    const root = document.getElementById('footer-root');
    if (!root) return;
    root.innerHTML = `
      <footer>
        <div class="container footer-inner">
          <div>
            <a href="index.html" class="brand">${this.shieldMark(26)} PayShield</a>
            <p class="footer-note" style="margin-top:10px;">
              PayShield is an educational college project (CEP). It is a fictional simulator only —
              it never processes real payments and never requests or stores real banking credentials,
              OTPs, PINs or CVVs.
            </p>
          </div>
          <div class="footer-links">
            <a href="learn.html">Learn</a>
            <a href="quiz.html">Quiz Arena</a>
            <a href="myths.html">Myths vs Facts</a>
            <a href="feedback.html">Feedback</a>
            <a href="emergency.html">Emergency Help</a>
          </div>
        </div>
      </footer>`;
  },

  renderEmergencyFab() {
    if (document.body.dataset.page === 'emergency') return;
    const fab = document.createElement('a');
    fab.href = 'emergency.html';
    fab.className = 'emergency-fab';
    fab.innerHTML = '🚨 <span data-i18n="emergency">I Think I\'ve Been Scammed</span>';
    document.body.appendChild(fab);
  },

  mount(activePage) {
    this.renderNavbar(activePage);
    this.renderFooter();
    this.renderEmergencyFab();
    PayShieldI18N.apply();
  },
};
