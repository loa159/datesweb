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

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get('product');
  if (productId) {
    const productInput = document.getElementById('product');
    const matchedProduct = (window.products || []).find((item) => item.id === productId);
    if (matchedProduct && productInput) productInput.value = matchedProduct.name;
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
      setFormStatus(localizedMessage('This demo form is not connected to a backend. Configure an API endpoint or email handler to enable live submissions.'), 'success');
      if (submitButton) submitButton.disabled = false;
      form.reset();
    }, 900);
  });
});
