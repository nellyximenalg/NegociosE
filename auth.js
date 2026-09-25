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

// Botón de "agregar" desde la tarjeta: si no hay sesión, primero pide
// iniciar sesión (igual que en el detalle del producto); si ya hay sesión,
// abre una ventana para elegir color, talla y cantidad antes de agregar.
function attachProductCardEvents(container) {
  if (!container || typeof PRODUCTS === 'undefined') return;
  container.querySelectorAll('.prod-add-btn').forEach(btn => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      const id = parseInt(btn.dataset.productId, 10);
      const product = PRODUCTS.find(p => p.id === id);
      if (!product) return;
      if (!isLoggedIn()) {
        const redirect = encodeURIComponent(`producto.html?id=${product.id}`);
        window.location.href = `login.html?redirect=${redirect}`;
        return;
      }
      openAddToCartModal(product);
    });
  });
}

// ---------- Ventana modal: elegir color, talla y cantidad antes de agregar ----------
let addToCartModalEl = null;

function buildAddToCartModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'addToCartModal';
  overlay.innerHTML = `
    <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modalProductName">
      <button type="button" class="modal-close" aria-label="Cerrar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>
      </button>
      <div class="modal-product">
        <div class="modal-product-image" id="modalProductImage"></div>
        <div class="modal-product-info">
          <p class="prod-sku" id="modalProductSku"></p>
          <h3 id="modalProductName"></h3>
          <p class="modal-product-price" id="modalProductPrice"></p>
          <p class="price-per-unit" id="modalPricePerUnit" hidden></p>
        </div>
      </div>

      <div class="option-group">
        <span class="option-label">Color <span class="option-selected-name" id="modalColorName"></span></span>
        <div class="option-swatches" id="modalColorOptions"></div>
      </div>

      <div class="option-group">
        <span class="option-label">Talla <span class="option-selected-name" id="modalSizeName"></span></span>
        <div class="option-pills" id="modalSizeOptions"></div>
      </div>

      <div class="add-to-cart-row">
        <div class="qty-stepper">
          <button type="button" class="qty-btn" id="modalQtyMinus" aria-label="Restar cantidad">−</button>
          <input type="number" class="qty-input" id="modalQtyInput" value="1" min="1" max="20" inputmode="numeric">
          <button type="button" class="qty-btn" id="modalQtyPlus" aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="btn btn-primary product-add-btn" id="modalConfirmAdd">Agregar al carrito</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeAddToCartModal();
  });
  overlay.querySelector('.modal-close').addEventListener('click', closeAddToCartModal);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('open')) closeAddToCartModal();
  });

  return overlay;
}

function closeAddToCartModal() {
  if (!addToCartModalEl) return;
  addToCartModalEl.classList.remove('open');
  document.body.classList.remove('modal-open');
}

function openAddToCartModal(product) {
  const overlay = addToCartModalEl || (addToCartModalEl = buildAddToCartModal());

  let selectedColor = product.colors[0];
  let selectedSize = product.sizes[0];
  let quantity = 1;

  const imageEl = overlay.querySelector('#modalProductImage');
  const skuEl = overlay.querySelector('#modalProductSku');
  const nameEl = overlay.querySelector('#modalProductName');
  const priceEl = overlay.querySelector('#modalProductPrice');
  const pricePerUnitEl = overlay.querySelector('#modalPricePerUnit');
  const colorNameEl = overlay.querySelector('#modalColorName');
  const colorOptionsEl = overlay.querySelector('#modalColorOptions');
  const sizeNameEl = overlay.querySelector('#modalSizeName');
  const sizeOptionsEl = overlay.querySelector('#modalSizeOptions');
  const qtyInput = overlay.querySelector('#modalQtyInput');
  const qtyMinus = overlay.querySelector('#modalQtyMinus');
  const qtyPlus = overlay.querySelector('#modalQtyPlus');
  const confirmBtn = overlay.querySelector('#modalConfirmAdd');

  skuEl.textContent = product.sku;
  nameEl.textContent = product.name;

  function formatPrice(n) {
    return n.toLocaleString('es-MX');
  }

  function renderPrice() {
    priceEl.textContent = `$${formatPrice(product.price * quantity)} MXN`;
    if (quantity > 1) {
      pricePerUnitEl.textContent = `$${formatPrice(product.price)} MXN c/u × ${quantity}`;
      pricePerUnitEl.hidden = false;
    } else {
      pricePerUnitEl.hidden = true;
    }
  }

  function updateImage() {
    imageEl.style.background = selectedColor.hex ? `linear-gradient(160deg, ${selectedColor.hex}, #1c1a17 140%)` : product.gradient;
    imageEl.innerHTML = '';
    const src = selectedColor.images && selectedColor.images[0];
    if (!src) return;
    const test = new Image();
    test.onload = () => {
      imageEl.style.background = 'none';
      imageEl.innerHTML = `<img src="${src}" alt="${product.name}">`;
    };
    test.src = src;
  }

  function renderColors() {
    colorOptionsEl.innerHTML = '';
    product.colors.forEach(color => {
      const swatch = document.createElement('button');
      swatch.type = 'button';
      swatch.className = 'option-swatch' + (color.name === selectedColor.name ? ' active' : '');
      swatch.style.background = color.hex;
      swatch.title = color.name;
      swatch.setAttribute('aria-label', color.name);
      swatch.addEventListener('click', () => {
        selectedColor = color;
        renderColors();
        updateImage();
      });
      colorOptionsEl.appendChild(swatch);
    });
    colorNameEl.textContent = `· ${selectedColor.name}`;
  }

  function renderSizes() {
    sizeOptionsEl.innerHTML = '';
    product.sizes.forEach(size => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'option-pill' + (size.label === selectedSize.label ? ' active' : '');
      pill.textContent = size.label;
      pill.addEventListener('click', () => {
        selectedSize = size;
        renderSizes();
      });
      sizeOptionsEl.appendChild(pill);
    });
    sizeNameEl.textContent = `· ${selectedSize.label}`;
  }

  function setQuantity(n) {
    quantity = Math.min(20, Math.max(1, n || 1));
    qtyInput.value = quantity;
    renderPrice();
  }

  qtyMinus.onclick = () => setQuantity(quantity - 1);
  qtyPlus.onclick = () => setQuantity(quantity + 1);
  qtyInput.oninput = () => {
    const n = parseInt(qtyInput.value, 10);
    if (!isNaN(n)) setQuantity(n);
  };

  confirmBtn.onclick = () => {
    closeAddToCartModal();
    const totalTxt = `$${formatPrice(product.price * quantity)} MXN`;
    showToast(`Agregado al carrito: ${quantity} x ${product.name}, talla ${selectedSize.label}, color ${selectedColor.name} (${totalTxt}).`);
  };

  renderColors();
  renderSizes();
  setQuantity(1);
  updateImage();

  overlay.classList.add('open');
  document.body.classList.add('modal-open');
}