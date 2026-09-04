function initHomeProductCarousel() {
  const carousel = document.querySelector('[data-product-carousel]');
  const track = carousel?.querySelector('[data-carousel-track]');
  const dots = carousel?.querySelector('[data-carousel-dots]');
  const previous = carousel?.querySelector('[data-carousel-prev]');
  const next = carousel?.querySelector('[data-carousel-next]');
  const products = Array.isArray(window.products) ? window.products.filter((product) => product.featured) : [];

  if (!carousel || !track || !dots || !products.length) return;

  let activeIndex = 0;
  let timer;

  track.innerHTML = products.map((product) => `
    <article class="carousel-slide">
      <img class="carousel-slide-image" src="${product.image}" alt="${product.name}" width="900" height="700" loading="eager" />
      <div class="carousel-slide-content">
        <div class="carousel-slide-meta">
          <span>${product.category}</span>
          <span>${product.type}</span>
        </div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="carousel-slide-specs">
          <span><strong>Origin:</strong> ${product.origin}</span>
          <span><strong>Packaging:</strong> ${product.packaging}</span>
        </div>
        <div class="btn-row">
          <a class="btn btn-primary" href="product-details.html?id=${product.id}">View details</a>
          <a class="btn btn-outline" href="contact.html?product=${product.id}">Request a Quote</a>
        </div>
      </div>
    </article>
  `).join('');

  dots.innerHTML = products.map((product, index) => `
    <button class="carousel-dot${index === 0 ? ' active' : ''}" type="button" data-carousel-dot="${index}" aria-label="Show ${product.name}"></button>
  `).join('');

  function render(index) {
    activeIndex = (index + products.length) % products.length;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    dots.querySelectorAll('.carousel-dot').forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === activeIndex);
    });
  }

  function restartTimer() {
    window.clearInterval(timer);
    timer = window.setInterval(() => render(activeIndex + 1), 6500);
  }

  previous.addEventListener('click', () => {
    render(activeIndex - 1);
    restartTimer();
  });
  next.addEventListener('click', () => {
    render(activeIndex + 1);
    restartTimer();
  });
  dots.querySelectorAll('.carousel-dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      render(Number(dot.dataset.carouselDot));
      restartTimer();
    });
  });

  carousel.addEventListener('mouseenter', () => window.clearInterval(timer));
  carousel.addEventListener('mouseleave', restartTimer);
  render(0);
  restartTimer();
}

document.addEventListener('DOMContentLoaded', initHomeProductCarousel);
