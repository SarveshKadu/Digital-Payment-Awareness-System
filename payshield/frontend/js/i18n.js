/**
 * PayShield i18n
 * Lightweight English/Marathi translation layer. Elements with
 * data-i18n="key" get their textContent replaced on language change.
 */
const PayShieldI18N = {
  dict: {
    nav_home: { en: 'Home', mr: 'मुख्यपृष्ठ' },
    nav_spot: { en: 'Spot the Scam', mr: 'फसवणूक ओळखा' },
    nav_simulator: { en: 'Payment Simulator', mr: 'पेमेंट सिम्युलेटर' },
    nav_radar: { en: 'Fraud Radar', mr: 'फसवणूक रडार' },
    nav_map: { en: 'Safety Map', mr: 'सुरक्षा नकाशा' },
    nav_checklist: { en: 'Checklist', mr: 'चेकलिस्ट' },
    nav_learn: { en: 'Learn', mr: 'शिका' },
    nav_myths: { en: 'Myths vs Facts', mr: 'गैरसमज विरुद्ध सत्य' },
    nav_quiz: { en: 'Quiz Arena', mr: 'क्विझ अरेना' },
    emergency: { en: "I Think I've Been Scammed", mr: 'मला वाटतं माझी फसवणूक झाली' },
    hero_headline: { en: 'One Tap Can Save You. One Tap Can Scam You.', mr: 'एक टॅप तुम्हाला वाचवू शकतो. एक टॅप फसवूही शकतो.' },
    hero_sub: {
      en: 'Learn how digital payments work, recognize fraud before it happens, and become a smarter digital citizen.',
      mr: 'डिजिटल पेमेंट कसे कार्य करते ते शिका, फसवणूक होण्यापूर्वी ती ओळखा आणि एक हुशार डिजिटल नागरिक बना.',
    },
    hero_cta1: { en: 'Start Your Safety Journey', mr: 'तुमचा सुरक्षा प्रवास सुरू करा' },
    hero_cta2: { en: 'Test Your Knowledge', mr: 'तुमचे ज्ञान तपासा' },
  },

  current() {
    return localStorage.getItem('payshield_lang') || 'en';
  },

  setLang(lang) {
    localStorage.setItem('payshield_lang', lang);
    this.apply();
  },

  apply() {
    const lang = this.current();
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const entry = this.dict[key];
      if (entry && entry[lang]) {
        el.textContent = entry[lang];
      }
    });
    document.querySelectorAll('.lang-select').forEach((sel) => {
      sel.value = lang;
    });
  },
};

document.addEventListener('DOMContentLoaded', () => PayShieldI18N.apply());
