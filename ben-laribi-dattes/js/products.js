const productData = Array.isArray(window.products) ? window.products : [];

function getProductCard(product) {
  return `
    <article class="product-card reveal fade-up">
      <img src="${product.image}" alt="${product.name}" loading="eager" width="800" height="700" />
      <div class="product-card-content">
        <div class="product-meta">
          <span>${product.category}</span>
          <span>${product.type}</span>
        </div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>Origin:</strong> ${product.origin}</p>
        <p><strong>Packaging:</strong> ${product.packaging}</p>
        <div class="card-actions">
          <a href="product-details.html?id=${product.id}" class="btn btn-outline">View details</a>
          <a href="contact.html?product=${product.id}" class="btn btn-primary">Request a Quote</a>
        </div>
      </div>
    </article>
  `;
}

function renderProducts(items) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  if (!items.length) {
    grid.innerHTML = '<div class="empty-state"><h3>No products found.</h3><p>Try another search term or select a different category.</p></div>';
    return;
  }

  grid.innerHTML = items.map(getProductCard).join('');
  grid.querySelectorAll('.reveal').forEach((node) => node.classList.add('visible'));
}

function filterProducts() {
  const searchInput = document.getElementById('product-search');
  const selectedType = document.querySelector('.filter-btn.active')?.dataset.type || 'all';
  const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';

  const filtered = productData.filter((product) => {
    const typeMatch = selectedType === 'all' || product.type === selectedType;
    const searchMatch = !searchValue || product.name.toLowerCase().includes(searchValue) || product.description.toLowerCase().includes(searchValue);
    return typeMatch && searchMatch;
  });

  renderProducts(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('product-search');
  const clearButton = document.getElementById('clear-search');
  const filterButtons = document.querySelectorAll('.filter-btn');

  if (!searchInput || !filterButtons.length) return;

  searchInput.addEventListener('input', filterProducts);
  clearButton?.addEventListener('click', () => {
    searchInput.value = '';
    filterProducts();
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      filterProducts();
    });
  });

  const queryType = new URLSearchParams(window.location.search).get('type');
  if (queryType) {
    const matchingButton = [...filterButtons].find((button) => button.dataset.type === queryType);
    if (matchingButton) {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      matchingButton.classList.add('active');
    }
  }

  renderProducts(productData);
});
