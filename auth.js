// Funciones compartidas de "sesión" simulada 

function isLoggedIn() {
  return localStorage.getItem('dahlia_logged_in') === 'true';
}

// ---------- Rol de administrador (simulado) ----------
const ADMIN_EMAIL = 'admin@dahlia.com';

function isAdmin() {
  return isLoggedIn() && localStorage.getItem('dahlia_user_role') === 'admin';
}

// Una promoción solo cuenta si el producto está marcado "Oferta" Y, si tiene
// fechas de vigencia, hoy cae dentro de ese rango (sin fechas = siempre activa).
function isPromoActive(product) {
  if (!product.onSale) return false;
  const today = new Date().toISOString().slice(0, 10);
  if (product.saleStart && today < product.saleStart) return false;
  if (product.saleEnd && today > product.saleEnd) return false;
  return true;
}

// Precio a usar: si el producto está en oferta vigente, el precio con descuento.
function getEffectivePrice(product) {
  if (isPromoActive(product) && product.discountPrice) return product.discountPrice;
  return product.price;
}

// ---------- Catálogo con los cambios del admin (simulado, guardado en localStorage) ----------
function getAdminOverrides() {
  try {
    const raw = JSON.parse(localStorage.getItem('dahlia_admin_overrides'));
    return Object.assign({ edits: {}, deletes: [], added: [] }, raw || {});
  } catch (e) {
    return { edits: {}, deletes: [], added: [] };
  }
}

function saveAdminOverrides(overrides) {
  localStorage.setItem('dahlia_admin_overrides', JSON.stringify(overrides));
}

// Devuelve el catálogo completo tal como debe verse en la tienda: los
// productos originales (con las ediciones del admin aplicadas y sin los
// que haya eliminado) más los productos nuevos que el admin haya agregado.
function getStoreProducts() {
  if (typeof PRODUCTS === 'undefined') return [];
  const ov = getAdminOverrides();
  const base = PRODUCTS
    .filter(p => !ov.deletes.includes(p.id))
    .map(p => (ov.edits[p.id] ? Object.assign({}, p, ov.edits[p.id]) : p));
  return base.concat(ov.added);
}

// ---------- Carrito real (guardado en localStorage, ligado a la cuenta) ----------
function formatPrice(n) {
  return n.toLocaleString('es-MX');
}

function getCartKey() {
  const email = localStorage.getItem('dahlia_user_email') || 'invitada';
  return `dahlia_cart_${email}`;
}

function getCart() {
  if (!isLoggedIn()) return [];
  try {
    return JSON.parse(localStorage.getItem(getCartKey())) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
  updateCartBadge();
}

// Agrega un producto al carrito (o suma la cantidad si ya estaba esa combinación
// exacta de talla y color).
function addToCart(product, size, color, quantity) {
  const cart = getCart();
  const lineId = `${product.id}__${size.label}__${color.name}`;
  const existing = cart.find(item => item.lineId === lineId);
  if (existing) {
    existing.qty = Math.min(20, existing.qty + quantity);
  } else {
    cart.push({
      lineId,
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: getEffectivePrice(product),
      size: size.label,
      color: color.name,
      image: (color.images && color.images[0]) || '',
      gradient: product.gradient,
      qty: quantity
    });
  }
  saveCart(cart);
}

function updateCartItemQty(lineId, qty) {
  const cart = getCart();
  const item = cart.find(i => i.lineId === lineId);
  if (!item) return;
  item.qty = Math.max(1, Math.min(20, qty));
  saveCart(cart);
}

function removeCartItem(lineId) {
  const cart = getCart().filter(i => i.lineId !== lineId);
  saveCart(cart);
}

function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function getCartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  return { subtotal, total: subtotal };
}

// Actualiza la insignia numérica del carrito en el header, en todas las páginas.
function updateCartBadge() {
  document.querySelectorAll('#cartCount').forEach(el => {
    el.textContent = getCartCount();
  });
}


function getDisplayName() {
  const email = localStorage.getItem('dahlia_user_email');
  if (!email) return 'Invitada/o';
  const accounts = JSON.parse(localStorage.getItem('dahlia_accounts') || '{}');
  if (accounts[email] && accounts[email].name) return accounts[email].name;
  return email.split('@')[0];
}

// Datos guardados de la cuenta (nombre, teléfono, fecha de nacimiento,
// dirección, método de pago), todo ligado al correo de la sesión actual.
function getAccount(email) {
  const accounts = JSON.parse(localStorage.getItem('dahlia_accounts') || '{}');
  return accounts[email] || {};
}

function saveAccount(email, patch) {
  if (!email) return;
  const accounts = JSON.parse(localStorage.getItem('dahlia_accounts') || '{}');
  accounts[email] = { ...(accounts[email] || {}), ...patch };
  localStorage.setItem('dahlia_accounts', JSON.stringify(accounts));
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
  const products = getStoreProducts();
  container.querySelectorAll('.prod-image[data-product-id]').forEach(el => {
    const id = parseInt(el.dataset.productId, 10);
    const product = products.find(p => p.id === id);
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

// Insignias "Nuevo" / "Oferta" sobre la imagen de la tarjeta.
function renderProductBadges(p) {
  const badges = [];
  if (p.isNew) badges.push('<span class="prod-badge prod-badge--new">Nuevo</span>');
  if (isPromoActive(p)) badges.push('<span class="prod-badge prod-badge--sale">Oferta</span>');
  return badges.length ? `<div class="prod-badges">${badges.join('')}</div>` : '';
}

// Precio de la tarjeta: si está en oferta vigente, muestra el precio original
// tachado junto con el precio con descuento.
function renderPriceTag(p) {
  if (isPromoActive(p) && p.discountPrice) {
    return `<span class="prod-price"><span class="prod-price-old">$${p.price}</span> $${p.discountPrice}</span>`;
  }
  return `<span class="prod-price">$${p.price}</span>`;
}

// HTML de una tarjeta de producto, usado en el catálogo, destacados y novedades.
function renderProductCard(p) {
  const { rating, reviews } = getProductRating(p);
  return `
    <div class="prod-card">
      <a href="producto.html?id=${p.id}" class="prod-image" data-product-id="${p.id}" style="background:${p.gradient};">${renderProductBadges(p)}</a>
      <div class="prod-tag">
        <div style="display:flex;align-items:center;">
          <span class="hole"></span>
          <div>
            <div class="prod-name">${p.name}</div>
            <div class="prod-sku">${p.sku}</div>
          </div>
        </div>
        ${renderPriceTag(p)}
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

  function renderPrice() {
    priceEl.textContent = `$${formatPrice(getEffectivePrice(product) * quantity)} MXN`;
    if (quantity > 1) {
      pricePerUnitEl.textContent = `$${formatPrice(getEffectivePrice(product))} MXN c/u × ${quantity}`;
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
    addToCart(product, selectedSize, selectedColor, quantity);
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

// ---------- Productos relacionados ("Nuestros clientes también vieron") ----------
// Selección determinista (no aleatoria) a partir del id del producto actual,
// para que la lista no cambie en cada recarga: primero busca en la misma
// categoría y, si no hay suficientes, completa con el resto del catálogo.
function getRelatedProducts(product, count = 4) {
  if (typeof PRODUCTS === 'undefined') return [];
  const allProducts = getStoreProducts();
  const rotate = (arr, id) => {
    if (arr.length === 0) return [];
    const start = id % arr.length;
    return arr.slice(start).concat(arr.slice(0, start));
  };
  const sameCategory = allProducts.filter(p => p.id !== product.id && p.category === product.category);
  const picked = rotate(sameCategory, product.id).slice(0, count);
  if (picked.length < count) {
    const rest = allProducts.filter(p => p.id !== product.id && p.category !== product.category);
    picked.push(...rotate(rest, product.id).slice(0, count - picked.length));
  }
  return picked;
}

function renderRelatedProducts(product, container, count = 4) {
  if (!container) return;
  const related = getRelatedProducts(product, count);
  container.innerHTML = related.map(renderProductCard).join('');
  applyCardImages(container);
  attachProductCardEvents(container);
}

// ---------- Ventana modal: términos y condiciones (antes de "Ir a pagar") ----------
let termsModalEl = null;

function buildTermsModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'termsModal';
  overlay.innerHTML = `
    <div class="modal-panel modal-panel--terms" role="dialog" aria-modal="true" aria-labelledby="termsTitle">
      <button type="button" class="modal-close" aria-label="Cerrar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>
      </button>
      <h3 id="termsTitle">Términos y condiciones</h3>
      <div class="terms-body">
        <p>Al crear una cuenta o realizar una compra en Dahlia, aceptas los siguientes términos y condiciones. Te recomendamos leerlos antes de continuar.</p>
        <p><strong>1. Productos y precios:</strong> todos los precios se muestran en pesos mexicanos (MXN) e incluyen IVA. Dahlia se reserva el derecho de modificar precios, promociones y disponibilidad de productos sin previo aviso. Las imágenes son ilustrativas; el color real puede variar ligeramente según tu pantalla.</p>
        <p><strong>2. Cuenta y registro:</strong> eres responsable de la veracidad de los datos que proporcionas (nombre, correo, dirección) y de mantener la confidencialidad de tu contraseña. Dahlia no comparte tus datos personales con terceros sin tu consentimiento, salvo cuando sea necesario para procesar tu pedido o por requerimiento legal.</p>
        <p><strong>3. Proceso de compra y pago:</strong> al confirmar un pedido generas una oferta de compra sujeta a disponibilidad de inventario. Aceptamos las formas de pago indicadas en el sitio; el cargo se procesa de forma segura y el pedido se confirma una vez validado el pago.</p>
        <p><strong>4. Envíos:</strong> los tiempos de entrega son estimados y pueden variar según tu ubicación y el servicio de paquetería. Dahlia no se hace responsable por retrasos ocasionados por la paquetería, desastres naturales o causas de fuerza mayor.</p>
        <p><strong>5. Cambios y devoluciones:</strong> cuentas con 30 días naturales a partir de la recepción del pedido para solicitar un cambio o devolución, siempre que el producto conserve sus etiquetas originales y no haya sido usado. Consulta la sección "Cambios y devoluciones" para más detalles.</p>
        <p><strong>6. Propiedad intelectual:</strong> el contenido de este sitio (logotipo, textos, fotografías y diseño) es propiedad de Dahlia y no puede reproducirse sin autorización.</p>
        <p><strong>7. Modificaciones:</strong> Dahlia puede actualizar estos términos en cualquier momento; los cambios entran en vigor al publicarse en el sitio.</p>
        <p>Si tienes dudas sobre estos términos, puedes contactarnos desde la sección "Contacto".</p>
      </div>
      <label class="checkbox-field">
        <input type="checkbox" id="termsCheckbox"> He leído y acepto los términos y condiciones.
      </label>
      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" id="termsCancel">Cancelar</button>
        <button type="button" class="btn btn-primary" id="termsAccept" disabled>Aceptar y continuar</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeTermsModal();
  });
  overlay.querySelector('.modal-close').addEventListener('click', closeTermsModal);
  overlay.querySelector('#termsCancel').addEventListener('click', closeTermsModal);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('open')) closeTermsModal();
  });

  return overlay;
}

function closeTermsModal() {
  if (!termsModalEl) return;
  termsModalEl.classList.remove('open');
  document.body.classList.remove('modal-open');
}

// Abre el modal de términos y condiciones; si la persona acepta, ejecuta onAccept.
function openTermsModal(onAccept) {
  const overlay = termsModalEl || (termsModalEl = buildTermsModal());
  const checkbox = overlay.querySelector('#termsCheckbox');
  const acceptBtn = overlay.querySelector('#termsAccept');

  checkbox.checked = false;
  acceptBtn.disabled = true;
  checkbox.onchange = () => { acceptBtn.disabled = !checkbox.checked; };

  acceptBtn.onclick = () => {
    closeTermsModal();
    if (onAccept) onAccept();
  };

  overlay.classList.add('open');
  document.body.classList.add('modal-open');
}

// Mantiene la insignia del carrito al día en cuanto carga cualquier página.
updateCartBadge();