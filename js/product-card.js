function renderProductCard(product, options = {}) {
  const showSpecs = options.showSpecs === true;
  const specs = showSpecs ? `
        <p><strong>Origin:</strong> ${product.origin}</p>
        <p><strong>Packaging:</strong> ${product.packaging}</p>` : '';

  return `
    <article class="product-card reveal fade-up">
      <img class="product-card-image" src="${product.image}" alt="${product.name}" loading="lazy" width="800" height="700" />
      <div class="product-card-content">
        <div class="product-meta">
          <span>${product.category}</span>
          <span>${product.type}</span>
        </div>
        <h3 class="product-title">${product.name}</h3>
        <p>${product.description}</p>${specs}
        <div class="card-actions">
          <a href="product-details.html?id=${product.id}" class="btn btn-outline">View details</a>
          <a href="contact.html?product=${product.id}" class="btn btn-primary">Request a Quote</a>
        </div>
      </div>
    </article>
  `;
}
