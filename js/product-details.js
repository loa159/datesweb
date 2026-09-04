const catalogProducts = Array.isArray(window.products) ? window.products : [];

function getProductById(id) {
  return catalogProducts.find((product) => product.id === id) || null;
}

function getRelatedProducts(product) {
  return catalogProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
}

function renderProductDetails() {
  const container = document.getElementById('product-detail');
  const related = document.getElementById('related-products');

  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const product = getProductById(id);

  if (!product) {
    container.innerHTML = '<div class="empty-state"><h2>Product not found.</h2><p>Sorry, this product could not be found.</p><a class="btn btn-primary" href="products.html">Back to Products</a></div>';
    return;
  }

  const whatsappLink = generateWhatsAppLink(product.name);

  container.innerHTML = `
    <div class="product-detail-image reveal fade-up">
      <img src="${product.image}" alt="${product.name}" loading="eager" width="1000" height="800" />
    </div>
    <div class="product-detail-info reveal fade-up">
      <div class="detail-meta">
        <span>${product.category}</span>
        <span>${product.type}</span>
      </div>
      <h1>${product.name}</h1>
      <p>${product.description}</p>
      <ul class="spec-list">
        <li><strong>Origin:</strong> ${product.origin}</li>
        <li><strong>Packaging:</strong> ${product.packaging}</li>
        <li><strong>Specifications:</strong> Available according to customer requirements</li>
        <li><strong>Product features:</strong> Export-ready, quality-controlled and suitable for professional distribution</li>
      </ul>
      <div class="card-actions">
        <a class="btn btn-primary" href="contact.html?product=${product.id}">Request a Quote</a>
        <a class="btn btn-secondary" href="${whatsappLink}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>
      <p>Interested in this product?</p>
    </div>
  `;

  const relatedProducts = getRelatedProducts(product);
  if (related && relatedProducts.length) {
    related.innerHTML = relatedProducts.map((item) => `
      <article class="product-card reveal fade-up">
        <img src="${item.image}" alt="${item.name}" loading="lazy" width="800" height="700" />
        <div class="product-card-content">
          <div class="product-meta">
            <span>${item.category}</span>
            <span>${item.type}</span>
          </div>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <div class="card-actions">
            <a href="product-details.html?id=${item.id}" class="btn btn-outline">View details</a>
            <a href="contact.html?product=${item.id}" class="btn btn-primary">Request a Quote</a>
          </div>
        </div>
      </article>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', renderProductDetails);
