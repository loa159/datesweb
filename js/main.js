const isMobile = () => window.innerWidth <= 767;

function setHeaderState() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  if (window.scrollY > 20) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
}

function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initActiveNav() {
  const page = document.body.dataset.page;
  const links = document.querySelectorAll('.nav-link');

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (page === 'home' && href.includes('index.html')) link.classList.add('active');
    if (page !== 'home' && href.includes(page + '.html')) link.classList.add('active');
  });
}

function initRevealAnimations() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((item) => observer.observe(item));
}

function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  const toggleVisibility = () => {
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  };

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  toggleVisibility();
  window.addEventListener('scroll', toggleVisibility, { passive: true });
}

function generateWhatsAppLink(productName = '') {
  const number = window.company && window.company.whatsapp ? window.company.whatsapp.replace(/\D/g, '') : '';
  const base = `https://wa.me/${number}`;
  const lang = window.languageState?.current || 'en';
  const messages = {
    en: productName
      ? `Hello Ben Laribi Dattes, I am interested in ${productName}. Please send me more information.`
      : 'Hello Ben Laribi Dattes, I would like information about your products.',
    fr: productName
      ? `Bonjour Ben Laribi Dattes, je suis intéressé par ${productName}. Merci de m’envoyer plus d’informations.`
      : 'Bonjour Ben Laribi Dattes, je souhaite obtenir des informations sur vos produits.',
    ar: productName
      ? `مرحبًا بن العريبي دقلة، أنا مهتم بمنتج ${productName}. يرجى إرسال المزيد من المعلومات.`
      : 'مرحبًا بن العريبي دقلة، أود الحصول على معلومات حول منتجاتكم.'
  };
  const message = messages[lang] || messages.en;
  return `${base}?text=${encodeURIComponent(message)}`;
}

function initWhatsApp() {
  document.querySelectorAll('.whatsapp-float').forEach((link) => {
    link.href = generateWhatsAppLink();
  });
}

function initConfigValues() {
  const phoneEl = document.getElementById('company-phone');
  const emailEl = document.getElementById('company-email');
  const addressEl = document.getElementById('company-address');
  const hoursEl = document.getElementById('company-hours');

  if (phoneEl) phoneEl.textContent = window.company && window.company.phone ? window.company.phone : 'YOUR_PHONE_HERE';
  if (emailEl) emailEl.textContent = window.company && window.company.email ? window.company.email : 'YOUR_EMAIL_HERE';
  if (addressEl) addressEl.textContent = window.company && window.company.address ? window.company.address : 'YOUR_ADDRESS_HERE';
  if (hoursEl) hoursEl.textContent = window.company && window.company.businessHours ? window.company.businessHours : 'YOUR_BUSINESS_HOURS';
}

document.addEventListener('DOMContentLoaded', () => {
  setHeaderState();
  initMobileMenu();
  initActiveNav();
  initRevealAnimations();
  initBackToTop();
  initWhatsApp();
  initConfigValues();
  window.addEventListener('scroll', setHeaderState, { passive: true });
});
