const productData = Array.isArray(window.products) ? window.products : [];
const PRODUCTS_PER_PAGE = 6;
let currentPage = 1;

function getPageFromURL() {
  const page = Number.parseInt(new URLSearchParams(window.location.search).get('page'), 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function getFilteredProducts() {
  const searchInput = document.getElementById('product-search');
  const selectedFilter = document.querySelector('.filter-btn.active');
  const selectedType = selectedFilter?.dataset.type || 'all';
  const selectedCategory = selectedFilter?.dataset.category || 'all';
  const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const sortValue = document.getElementById('product-sort')?.value || 'featured';

  const filtered = productData.filter((product) => {
    const typeMatch = selectedType === 'all' || product.type === selectedType;
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const searchMatch = !searchValue || product.name.toLowerCase().includes(searchValue) || product.description.toLowerCase().includes(searchValue);
    return typeMatch && categoryMatch && searchMatch;
  });

  filtered.sort((first, second) => {
    if (sortValue === 'az') return first.name.localeCompare(second.name);
    if (sortValue === 'za') return second.name.localeCompare(first.name);
    return Number(second.featured) - Number(first.featured);
  });

  return filtered;
}

function getTotalPages(products) {
  return Math.ceil(products.length / PRODUCTS_PER_PAGE);
}

function getCurrentPageProducts(products) {
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  return products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
}

function updateResultCount(totalResults) {
  const count = document.getElementById('product-count');
  if (!count) return;

  if (!totalResults) {
    count.textContent = typeof translateText === 'function' ? translateText('No products found.') : 'No products found.';
    return;
  }

  const start = (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const end = Math.min(currentPage * PRODUCTS_PER_PAGE, totalResults);
  const label = typeof translateText === 'function'
    ? translateText(totalResults === 1 ? 'Product' : 'Products').toLowerCase()
    : (totalResults === 1 ? 'product' : 'products');
  const prefix = typeof translateText === 'function' ? translateText('Showing') : 'Showing';
  count.textContent = `${prefix} ${start}-${end} / ${totalResults} ${label}`;
}

function renderProducts(products) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  if (!products.length) {
    grid.innerHTML = '<div class="empty-state"><h3>No products found.</h3><p>Try another search term or select a different category.</p><button class="btn btn-outline" type="button" data-reset-products>Reset filters</button></div>';
    grid.querySelector('[data-reset-products]')?.addEventListener('click', resetFilters);
    return;
  }

  grid.innerHTML = products.map((product) => renderProductCard(product, { showSpecs: true })).join('');
  grid.querySelectorAll('.reveal').forEach((node) => node.classList.add('visible'));
}

function getPaginationItems(totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  if (start > 2) pages.push('ellipsis-start');
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < totalPages - 1) pages.push('ellipsis-end');
  pages.push(totalPages);
  return pages;
}

function renderPagination(totalPages) {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;
  pagination.innerHTML = '';
  if (totalPages <= 1) return;

  const previous = document.createElement('button');
  previous.className = 'pagination-button pagination-arrow';
  previous.type = 'button';
  previous.textContent = '←';
  previous.setAttribute('aria-label', typeof translateText === 'function' ? translateText('Previous page') : 'Previous page');
  previous.disabled = currentPage === 1;
  previous.addEventListener('click', () => goToPage(currentPage - 1));
  pagination.appendChild(previous);

  getPaginationItems(totalPages).forEach((item) => {
    if (typeof item === 'string') {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'pagination-ellipsis';
      ellipsis.textContent = '...';
      pagination.appendChild(ellipsis);
      return;
    }

    const button = document.createElement('button');
    button.className = `pagination-button${item === currentPage ? ' active' : ''}`;
    button.type = 'button';
    button.textContent = String(item);
    button.setAttribute('aria-label', `${typeof translateText === 'function' ? translateText('Go to page') : 'Go to page'} ${item}`);
    if (item === currentPage) button.setAttribute('aria-current', 'page');
    button.addEventListener('click', () => goToPage(item));
    pagination.appendChild(button);
  });

  const next = document.createElement('button');
  next.className = 'pagination-button pagination-arrow';
  next.type = 'button';
  next.textContent = '→';
  next.setAttribute('aria-label', typeof translateText === 'function' ? translateText('Next page') : 'Next page');
  next.disabled = currentPage === totalPages;
  next.addEventListener('click', () => goToPage(currentPage + 1));
  pagination.appendChild(next);
}

function updateURL(push = false) {
  const url = new URL(window.location.href);
  if (currentPage === 1) url.searchParams.delete('page');
  else url.searchParams.set('page', String(currentPage));
  const method = push ? 'pushState' : 'replaceState';
  window.history[method]({}, '', url);
}

function scrollToProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  const top = grid.getBoundingClientRect().top + window.scrollY - 120;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

function updateProducts({ pushURL = false, shouldScroll = false } = {}) {
  const filteredProducts = getFilteredProducts();
  const totalPages = getTotalPages(filteredProducts);
  currentPage = totalPages ? Math.min(currentPage, totalPages) : 1;
  renderProducts(getCurrentPageProducts(filteredProducts));
  updateResultCount(filteredProducts.length);
  renderPagination(totalPages);
  updateURL(pushURL);
  if (shouldScroll) scrollToProducts();
}

function goToPage(page) {
  const totalPages = getTotalPages(getFilteredProducts());
  if (page < 1 || page > totalPages || page === currentPage) return;
  currentPage = page;
  updateProducts({ pushURL: true, shouldScroll: true });
}

function resetFilters() {
  const searchInput = document.getElementById('product-search');
  const sortSelect = document.getElementById('product-sort');
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (searchInput) searchInput.value = '';
  if (sortSelect) sortSelect.value = 'featured';
  filterButtons.forEach((button, index) => {
    const active = index === 0;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  currentPage = 1;
  updateProducts();
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('product-search');
  const clearButton = document.getElementById('clear-search');
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (!searchInput || !filterButtons.length) return;

  currentPage = getPageFromURL();
  searchInput.addEventListener('input', () => {
    currentPage = 1;
    updateProducts();
  });
  clearButton?.addEventListener('click', resetFilters);
  document.getElementById('product-sort')?.addEventListener('change', () => {
    currentPage = 1;
    updateProducts();
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      filterButtons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn === button)));
      currentPage = 1;
      updateProducts();
    });
  });

  const queryType = new URLSearchParams(window.location.search).get('type');
  const matchingButton = [...filterButtons].find((button) => button.dataset.type === queryType);
  if (matchingButton) {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    matchingButton.classList.add('active');
    filterButtons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn === matchingButton)));
  }

  window.addEventListener('popstate', () => {
    currentPage = getPageFromURL();
    updateProducts();
  });
  document.addEventListener('languagechange', () => updateProducts());
  updateProducts();
});
