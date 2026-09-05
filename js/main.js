const isMobile = () => window.innerWidth <= 767;

function formatPhoneDisplay(value, fallback = '+216 95 542 200') {
  if (!value) return fallback;

  const digits = String(value).replace(/\D/g, '');
  if (!digits) return fallback;

  if (digits.startsWith('216') && digits.length >= 11) {
    return `+216 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 11)}`;
  }

  if (digits.length === 8) {
    return `+216 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }

  return fallback;
}

function normalizeTelLinks() {
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    const hrefValue = link.getAttribute('href') || '';
    const digits = hrefValue.replace(/^tel:/i, '').replace(/\D/g, '');
    if (!digits) return;

    const normalized = digits.startsWith('216')
      ? `tel:+216${digits.slice(3)}`
      : `tel:+216${digits}`;

    link.setAttribute('href', normalized);
    link.setAttribute('dir', 'ltr');
    link.style.direction = 'ltr';
    link.style.unicodeBidi = 'plaintext';

    const visibleText = link.textContent.trim();
    const formatted = formatPhoneDisplay(normalized, '+216 95 542 200');
    if (!visibleText || visibleText !== formatted) {
      link.textContent = formatted;
    }
  });

  const companyPhoneEl = document.getElementById('company-phone');
  if (companyPhoneEl) {
    companyPhoneEl.setAttribute('dir', 'ltr');
    companyPhoneEl.style.direction = 'ltr';
    companyPhoneEl.style.unicodeBidi = 'plaintext';
  }
}

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
  const rawPhone = window.company && window.company.whatsapp ? window.company.whatsapp : '+21695542200';
  const number = rawPhone.replace(/\D/g, '');
  const base = `https://wa.me/${number}`;
  const lang = window.languageState?.current || 'en';
  const messages = {
    en: productName
      ? `Hello BEN LARIBI DATTES, I am interested in ${productName}. I would like more information.`
      : 'Hello BEN LARIBI DATTES, I would like more information about your products.',
    fr: productName
      ? `Bonjour BEN LARIBI DATTES, je suis intéressé par ${productName}. Je souhaiterais recevoir plus d’informations.`
      : 'Bonjour BEN LARIBI DATTES, je souhaite obtenir des informations concernant vos produits.',
    ar: productName
      ? `مرحبًا BEN LARIBI DATTES، أنا مهتم بـ ${productName}. أود تلقي المزيد من المعلومات.`
      : 'مرحبًا BEN LARIBI DATTES، أود الحصول على معلومات حول منتجاتكم.'
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
  const websiteEl = document.getElementById('company-website');
  const hoursEl = document.getElementById('company-hours');

  const company = window.company || {};
  const address = company.address && typeof company.address === 'object'
    ? [company.address.location, company.address.city, company.address.country].filter(Boolean).join(', ')
    : (company.address || 'ElKlibya, Jersine, Kébili Sud, Kébili, Tunisie');

  if (phoneEl) phoneEl.textContent = formatPhoneDisplay(company.phone, '+216 95 542 200');
  if (emailEl) emailEl.textContent = company.email || 'CONTACT@BENLARIBIDATTES.COM';
  if (addressEl) addressEl.textContent = address;
  if (websiteEl) websiteEl.textContent = company.website || 'BENLARIBIDATTES.COM';
  if (hoursEl) hoursEl.textContent = company.businessHours || 'Contact for export and production requirements';
}

document.addEventListener('DOMContentLoaded', () => {
  setHeaderState();
  initMobileMenu();
  initActiveNav();
  initRevealAnimations();
  initBackToTop();
  initWhatsApp();
  initConfigValues();
  normalizeTelLinks();
  window.addEventListener('scroll', setHeaderState, { passive: true });
});
