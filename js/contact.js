function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return !phone || /^[+\d\s()-]{7,20}$/.test(phone);
}

function setFormStatus(message, type) {
  const status = document.getElementById('form-status');
  if (!status) return;
  status.textContent = message;
  status.className = `form-status ${type}`;
}

function localizedMessage(key) {
  return typeof translateText === 'function' ? translateText(key) : key;
}

function renderProductOptions(lang = window.languageState?.current || 'fr') {
  const productSelect = document.getElementById('product');
  if (!productSelect) return;

  const currentValue = productSelect.value || '';
  const productNames = Array.isArray(window.products)
    ? [...new Set(window.products.map((product) => product && product.name).filter(Boolean))]
    : [];

  const defaultLabel = typeof translateText === 'function' ? translateText('Sélectionnez un produit', lang) : 'Sélectionnez un produit';

  productSelect.innerHTML = `<option value="">${defaultLabel}</option>` + productNames.map((name) => {
    const label = typeof translateText === 'function' ? translateText(name, lang) : name;
    return `<option value="${name}">${label}</option>`;
  }).join('');

  if (currentValue && [...productSelect.options].some((option) => option.value === currentValue)) {
    productSelect.value = currentValue;
  } else {
    productSelect.value = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const productSelect = document.getElementById('product');
  if (productSelect) {
    renderProductOptions(window.languageState?.current || 'fr');
  }

  document.addEventListener('languagechange', () => {
    renderProductOptions(window.languageState?.current || 'fr');
  });

  const params = new URLSearchParams(window.location.search);
  const productId = params.get('product');
  if (productId) {
    const matchedProduct = (window.products || []).find((item) => item.id === productId);
    if (matchedProduct && productSelect) {
      productSelect.value = matchedProduct.name;
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const firstName = (formData.get('firstName') || '').toString().trim();
    const lastName = (formData.get('lastName') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const phone = (formData.get('phone') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();

    if (!firstName || !lastName || !email || !message) {
      setFormStatus(localizedMessage('Please complete all required fields.'), 'error');
      return;
    }
    if (!validateEmail(email)) {
      setFormStatus(localizedMessage('Please provide a valid email address.'), 'error');
      return;
    }
    if (!validatePhone(phone)) {
      setFormStatus(localizedMessage('Please provide a valid phone number.'), 'error');
      return;
    }
    if (message.length < 10) {
      setFormStatus(localizedMessage('Message must be at least 10 characters long.'), 'error');
      return;
    }

    setFormStatus(localizedMessage('Submitting inquiry…'), 'loading');
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;

    setTimeout(() => {
      setFormStatus('This demo form is not connected to a backend. Configure an API endpoint or email handler to enable live submissions.', 'success');
      if (submitButton) submitButton.disabled = false;
      form.reset();
      if (productSelect) productSelect.selectedIndex = 0;
    }, 900);
  });
});
