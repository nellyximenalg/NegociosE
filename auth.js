// Funciones compartidas de "sesión" simulada 

function isLoggedIn() {
  return localStorage.getItem('dahlia_logged_in') === 'true';
}


function getDisplayName() {
  const email = localStorage.getItem('dahlia_user_email');
  if (!email) return 'Invitada/o';
  const accounts = JSON.parse(localStorage.getItem('dahlia_accounts') || '{}');
  if (accounts[email] && accounts[email].name) return accounts[email].name;
  return email.split('@')[0];
}

// Validación simple de correo (formato básico: algo@algo.algo)
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Muestra un mensaje de error debajo de un campo de formulario
function setFieldError(inputEl, message) {
  clearFieldError(inputEl);
  if (!message) return;
  inputEl.classList.add('field-invalid');
  const err = document.createElement('span');
  err.className = 'field-error';
  err.textContent = message;
  inputEl.insertAdjacentElement('afterend', err);
}

function clearFieldError(inputEl) {
  inputEl.classList.remove('field-invalid');
  const next = inputEl.nextElementSibling;
  if (next && next.classList.contains('field-error')) {
    next.remove();
  }
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;

  
  toast.classList.remove('show');
  void toast.offsetWidth;
  toast.classList.add('show');

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Prueba si la primera foto real del producto (primer color) existe y, si
// carga bien, la pone como fondo de la tarjeta. Si no existe todavía o falla,
// se queda con el degradado que ya estaba puesto como respaldo.
function setCardImage(el, product) {
  const firstColor = product.colors && product.colors[0];
  const firstImg = firstColor && firstColor.images && firstColor.images[0];
  if (!firstImg) return;

  const test = new Image();
  test.onload = () => {
    el.style.backgroundImage = `url('${firstImg}')`;
    el.style.backgroundColor = '#211d17';
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.backgroundPosition = 'center';
  };
  test.src = firstImg;
}

// Aplica setCardImage a todas las tarjetas de un contenedor de catálogo,
// usando el atributo data-product-id que cada tarjeta debe traer.
function applyCardImages(container) {
  if (!container || typeof PRODUCTS === 'undefined') return;
  container.querySelectorAll('.prod-image[data-product-id]').forEach(el => {
    const id = parseInt(el.dataset.productId, 10);
    const product = PRODUCTS.find(p => p.id === id);
    if (product) setCardImage(el, product);
  });
}

// Todavía no hay un sistema real de reseñas, así que generamos una
// calificación y un número de reseñas de forma determinista a partir del id
// del producto (el mismo producto siempre muestra la misma calificación).
function getProductRating(product) {
  const seed = product.id * 37;
  const rating = Math.round((4.2 + (seed % 9) * 0.1) * 10) / 10; // entre 4.2 y 5.0
  const reviews = 30 + (seed % 260);
  return { rating, reviews };
}

const STAR_ICON = '<svg viewBox="0 0 24 24"><polygon points="12 2.5 15.1 9 22.2 10 17 14.9 18.3 22 12 18.6 5.7 22 7 14.9 1.8 10 8.9 9"/></svg>';

function renderStars(rating) {
  const rounded = Math.round(rating);
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star${i <= rounded ? ' star-filled' : ''}">${STAR_ICON}</span>`;
  }
  return html;
}

// HTML de una tarjeta de producto, usado en el catálogo, destacados y novedades.
function renderProductCard(p) {
  const { rating, reviews } = getProductRating(p);
  return `
    <div class="prod-card">
      <a href="producto.html?id=${p.id}" class="prod-image" data-product-id="${p.id}" style="background:${p.gradient};"></a>
      <div class="prod-tag">
        <div style="display:flex;align-items:center;">
          <span class="hole"></span>
          <div>
            <div class="prod-name">${p.name}</div>
            <div class="prod-sku">${p.sku}</div>
          </div>
        </div>
        <span class="prod-price">$${p.price}</span>
      </div>
      <div class="prod-rating">
        <span class="prod-stars">${renderStars(rating)}</span>
        <span class="prod-rating-num">${rating.toFixed(1)}</span>
        <span class="prod-rating-count">(${reviews})</span>
      </div>
      <p class="prod-desc">${p.description || ''}</p>
      <div class="prod-actions">
        <a href="producto.html?id=${p.id}" class="btn btn-ghost prod-detail-btn">Ver detalles</a>
        <button type="button" class="prod-add-btn" data-product-id="${p.id}" aria-label="Agregar al carrito" title="Agregar al carrito">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </button>
      </div>
    </div>
  `;
}

// Botón de "agregar rápido" desde la tarjeta: misma regla que en el detalle
// del producto (simulado, y pide iniciar sesión si no hay sesión activa),
// usando la talla y el color por defecto (los primeros de la lista).
function quickAddToCart(product) {
  if (!isLoggedIn()) {
    const redirect = encodeURIComponent(`producto.html?id=${product.id}`);
    window.location.href = `login.html?redirect=${redirect}`;
    return;
  }
  const color = product.colors && product.colors[0];
  const size = product.sizes && product.sizes[0];
  const detail = [size ? `talla ${size.label}` : null, color ? `color ${color.name}` : null].filter(Boolean).join(', ');
  showToast(`Agregado al carrito: ${product.name}${detail ? ' (' + detail + ')' : ''} (simulado).`);
}

// Conecta los botones "agregar rápido" (ícono de bolsa) de las tarjetas de un contenedor.
function attachProductCardEvents(container) {
  if (!container || typeof PRODUCTS === 'undefined') return;
  container.querySelectorAll('.prod-add-btn').forEach(btn => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      const id = parseInt(btn.dataset.productId, 10);
      const product = PRODUCTS.find(p => p.id === id);
      if (product) quickAddToCart(product);
    });
  });
}