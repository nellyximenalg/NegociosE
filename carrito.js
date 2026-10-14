// Líneas del carrito marcadas por la clienta para usar un cupón.
let cartSelection = new Set();

// Pinta el contenido del carrito según el estado: sin sesión, vacío, o con productos.
function renderCart() {
  const root = document.getElementById('cartRoot');
  if (!root) return;

  if (!isLoggedIn()) {
    root.innerHTML = `
      <div class="cart-placeholder">
        <span class="eyebrow">Tu carrito</span>
        <h2 class="placeholder-title">Inicia sesión para ver tu carrito.</h2>
        <p class="placeholder-text">Lo que agregues se guarda junto con tu cuenta.</p>
        <a href="login.html?redirect=carrito.html" class="btn btn-primary">Iniciar sesión</a>
      </div>
    `;
    return;
  }

  const cart = getCart();

  if (cart.length === 0) {
    root.innerHTML = `
      <div class="cart-placeholder">
        <span class="eyebrow">Tu carrito</span>
        <h2 class="placeholder-title">Todavía no has agregado nada.</h2>
        <p class="placeholder-text">Aquí van a aparecer los productos que agregues desde el catálogo.</p>
        <a href="catalogo.html" class="btn btn-primary">Ver catálogo</a>
      </div>
    `;
    return;
  }

  const pricing = computeCartPricing();
  if (pricing.removed) {
    showToast(`Se quitó el cupón ${pricing.removed.code}: ${pricing.removed.reason}`);
  }
  cartSelection = new Set([...cartSelection].filter(id => cart.some(i => i.lineId === id)));

  const couponBlock = pricing.coupon ? `
    <div class="cart-coupon-applied">
      <div>
        <span class="cart-coupon-code">${escHtml(pricing.coupon.code)}</span>
        <p>${escHtml(pricing.coupon.title)}</p>
      </div>
      <button type="button" class="cart-coupon-remove" id="removeCouponBtn">Quitar</button>
    </div>
  ` : '';

  root.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">
        <div class="cart-select-bar">
          <label class="checkbox-field"><input type="checkbox" id="cartSelectAll"> Seleccionar todo</label>
          <span class="cart-select-hint">Marca los productos con los que quieras usar un cupón</span>
        </div>
        ${cart.map(item => renderCartItemRow(item, pricing)).join('')}
      </div>
      <div class="cart-summary">
        <h3>Resumen</h3>
        <div class="cart-coupon">
          <span class="cart-coupon-title">Cupón de descuento</span>
          ${couponBlock}
          <button type="button" class="btn btn-ghost btn-sm cart-coupon-btn" id="openCouponsBtn" disabled>Cargar cupones</button>
          <p class="cart-coupon-hint" id="couponSelectHint">Selecciona al menos un producto para ver los cupones que aplican.</p>
        </div>
        <div class="cart-summary-row"><span>Subtotal</span><span>$${formatPrice(pricing.subtotal)} MXN</span></div>
        ${pricing.coupon ? `<div class="cart-summary-row cart-summary-discount"><span>Descuento (${escHtml(pricing.coupon.code)})</span><span>−$${formatPrice(pricing.discount)} MXN</span></div>` : ''}
        <div class="cart-summary-row cart-summary-total"><span>Total</span><span>$${formatPrice(pricing.total)} MXN</span></div>
        <button type="button" class="btn btn-primary cart-checkout-btn" id="checkoutBtn">Ir a pagar</button>
        <a href="catalogo.html" class="cart-continue-link">Seguir comprando</a>
      </div>
    </div>
  `;

  // Restaura las casillas marcadas después de repintar.
  document.querySelectorAll('.cart-line-check').forEach(cb => { cb.checked = cartSelection.has(cb.dataset.lineId); });
  updateCouponControls();

  attachCartEvents();

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    openTermsModal(showCheckoutPlaceholder);
  });
}

// Busca la imagen más actual del producto/color (en vez de depender solo de
// la que se guardó cuando se agregó al carrito), para que si luego subes o
// corriges fotos, el carrito las muestre sin tener que volver a agregar el producto.
function getItemImage(item) {
  const product = (typeof PRODUCTS !== 'undefined') ? getStoreProducts().find(p => p.id === item.productId) : null;
  const color = product && product.colors ? product.colors.find(c => c.name === item.color) : null;
  const liveImage = color && color.images && color.images[0];
  return liveImage || item.image || '';
}

function renderCartItemRow(item, pricing) {
  const lineTotal = item.price * item.qty;
  const lineDiscount = (pricing && pricing.lineDiscounts[item.lineId]) || 0;
  const image = getItemImage(item);
  const priceHtml = lineDiscount
    ? `<span class="prod-price-old">$${formatPrice(lineTotal)}</span><br>$${formatPrice(lineTotal - lineDiscount)} MXN`
    : `$${formatPrice(lineTotal)} MXN`;
  const couponTag = lineDiscount
    ? `<span class="cart-item-coupon-tag">Cupón ${escHtml(pricing.coupon.code)} · −$${formatPrice(lineDiscount)}</span>`
    : '';
  return `
    <div class="cart-item${lineDiscount ? ' is-discounted' : ''}">
      <label class="cart-check" title="Seleccionar para usar un cupón">
        <input type="checkbox" class="cart-line-check" data-line-id="${item.lineId}" aria-label="Seleccionar ${escHtml(item.name)}">
      </label>
      <div class="cart-item-image" style="background:${item.gradient || 'var(--surface-alt)'}">
        ${image ? `<img src="${image}" alt="${item.name}" onerror="this.style.display='none'">` : ''}
      </div>
      <div class="cart-item-info">
        <p class="prod-sku">${item.sku}</p>
        <h3>${item.name}</h3>
        <p class="cart-item-variant">Talla ${item.size} · Color ${item.color}</p>
        ${couponTag}
        <button type="button" class="cart-item-remove" data-line-id="${item.lineId}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          Eliminar
        </button>
      </div>
      <div class="qty-stepper cart-item-qty">
        <button type="button" class="qty-btn" data-line-id="${item.lineId}" data-action="minus" aria-label="Restar cantidad">−</button>
        <input type="number" class="qty-input" data-line-id="${item.lineId}" value="${item.qty}" min="1" max="20" inputmode="numeric">
        <button type="button" class="qty-btn" data-line-id="${item.lineId}" data-action="plus" aria-label="Sumar cantidad">+</button>
      </div>
      <div class="cart-item-price">${priceHtml}</div>
    </div>
  `;
}

// ---------- Cupones en el carrito ----------
function getSelectedLines() {
  return getCart().filter(i => cartSelection.has(i.lineId));
}

function updateCouponControls() {
  const n = cartSelection.size;
  const btn = document.getElementById('openCouponsBtn');
  const hint = document.getElementById('couponSelectHint');
  const all = document.getElementById('cartSelectAll');
  if (btn) {
    btn.disabled = n === 0;
    btn.textContent = n ? `Cargar cupones (${n} seleccionado${n === 1 ? '' : 's'})` : 'Cargar cupones';
  }
  if (hint) hint.hidden = n > 0;
  if (all) all.checked = getCart().length > 0 && n === getCart().length;
}

function attachCouponEvents() {
  document.querySelectorAll('.cart-line-check').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) cartSelection.add(cb.dataset.lineId); else cartSelection.delete(cb.dataset.lineId);
      updateCouponControls();
    });
  });

  const all = document.getElementById('cartSelectAll');
  if (all) {
    all.addEventListener('change', () => {
      cartSelection = new Set(all.checked ? getCart().map(i => i.lineId) : []);
      document.querySelectorAll('.cart-line-check').forEach(cb => { cb.checked = all.checked; });
      updateCouponControls();
    });
  }

  const openBtn = document.getElementById('openCouponsBtn');
  if (openBtn) openBtn.addEventListener('click', openCouponsModal);

  const removeBtn = document.getElementById('removeCouponBtn');
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      clearAppliedCoupon();
      renderCart();
      showToast('Cupón quitado.');
    });
  }
}

// Modal con SOLO los cupones que aplican a los productos seleccionados.
let couponsModalEl = null;

function buildCouponsModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'couponsModal';
  overlay.innerHTML = `
    <div class="modal-panel modal-panel--coupons" role="dialog" aria-modal="true" aria-labelledby="couponsModalTitle">
      <button type="button" class="modal-close" aria-label="Cerrar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>
      </button>
      <h3 id="couponsModalTitle">Cupones disponibles</h3>
      <p class="coupon-modal-sub" id="couponsModalSub"></p>
      <div class="coupon-options" id="couponsModalList"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => {
    overlay.classList.remove('open');
    document.body.classList.remove('modal-open');
  };
  overlay._close = close;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  overlay.querySelector('.modal-close').addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });
  return overlay;
}

function openCouponsModal() {
  const lines = getSelectedLines();
  if (!lines.length) return;
  const overlay = couponsModalEl || (couponsModalEl = buildCouponsModal());

  const applicable = getApplicableCoupons(lines);
  const count = lines.length;
  overlay.querySelector('#couponsModalSub').textContent = applicable.length
    ? `Estos cupones aplican a los ${count} producto${count === 1 ? '' : 's'} que seleccionaste.`
    : '';

  const list = overlay.querySelector('#couponsModalList');
  if (!applicable.length) {
    list.innerHTML = `
      <div class="coupon-empty">
        <p>No hay cupones aplicables para los productos que seleccionaste.</p>
        <p class="coupon-empty-hint">Prueba con otra selección de productos.</p>
      </div>
    `;
  } else {
    list.innerHTML = applicable.map(({ coupon: c, result }) => `
      <div class="coupon-option">
        <div class="coupon-option-info">
          <span class="coupon-option-code">${escHtml(c.code)}</span>
          <h4>${escHtml(c.title)}</h4>
          <p>${escHtml(c.description || '')}</p>
          <p class="coupon-option-meta">${escHtml(couponScopeLabel(c))}${c.minPurchase ? ` · Compra mín. $${formatPrice(c.minPurchase)}` : ''}${c.end ? ` · Hasta ${formatDateEsShort(c.end)}` : ''}</p>
        </div>
        <div class="coupon-option-action">
          <span class="coupon-option-save">Ahorras $${formatPrice(result.discount)}</span>
          <button type="button" class="btn btn-primary btn-sm" data-apply-coupon="${escHtml(c.id)}">Aplicar</button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('[data-apply-coupon]').forEach(btn => {
      btn.addEventListener('click', () => {
        const coupon = getCoupons().find(c => c.id === btn.dataset.applyCoupon);
        if (!coupon) return;
        const res = applyCouponToLines(coupon, [...cartSelection]);
        overlay._close();
        if (!res.ok) { showToast(res.reason); return; }
        cartSelection = new Set();
        renderCart();
        showToast(`Cupón ${coupon.code} aplicado. Ahorraste $${formatPrice(res.discount)}.`);
      });
    });
  }

  overlay.classList.add('open');
  document.body.classList.add('modal-open');
}

// Modal de confirmación propio del sitio (en vez del confirm() del navegador).
let cartConfirmEl = null;

function showCartConfirm(item, onConfirm, onCancel) {
  if (!cartConfirmEl) {
    cartConfirmEl = document.createElement('div');
    cartConfirmEl.className = 'modal-overlay';
    cartConfirmEl.id = 'cartConfirmModal';
    cartConfirmEl.innerHTML = `
      <div class="modal-panel modal-panel--confirm" role="dialog" aria-modal="true" aria-labelledby="cartConfirmTitle">
        <h3 id="cartConfirmTitle">Eliminar producto</h3>
        <p class="admin-confirm-message" id="cartConfirmMessage"></p>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" id="cartConfirmCancel">Cancelar</button>
          <button type="button" class="btn btn-primary admin-btn-danger-solid" id="cartConfirmAccept">Sí, eliminar</button>
        </div>
      </div>
    `;
    document.body.appendChild(cartConfirmEl);
  }

  const overlay = cartConfirmEl;
  overlay.querySelector('#cartConfirmMessage').textContent =
    `¿Estás seguro de que quieres eliminar "${item.name}" (talla ${item.size}, color ${item.color}) de tu carrito?`;

  function close() {
    overlay.classList.remove('open');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onKey);
  }
  function cancel() { close(); if (onCancel) onCancel(); }
  function onKey(e) { if (e.key === 'Escape') cancel(); }

  // Se reemplazan los botones para no acumular listeners de aperturas anteriores.
  ['#cartConfirmCancel', '#cartConfirmAccept'].forEach(sel => {
    const old = overlay.querySelector(sel);
    old.replaceWith(old.cloneNode(true));
  });
  overlay.querySelector('#cartConfirmCancel').addEventListener('click', cancel);
  overlay.querySelector('#cartConfirmAccept').addEventListener('click', () => { close(); onConfirm(); });
  overlay.onclick = (e) => { if (e.target === overlay) cancel(); };
  document.addEventListener('keydown', onKey);

  overlay.classList.add('open');
  document.body.classList.add('modal-open');
}

// Pide confirmación antes de quitar una línea del carrito.
function confirmRemoveCartItem(lineId) {
  const item = getCart().find(i => i.lineId === lineId);
  if (!item) return;
  showCartConfirm(item, () => {
    removeCartItem(lineId);
    renderCart();
  }, () => renderCart());
}

function attachCartEvents() {
  attachCouponEvents();
  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => confirmRemoveCartItem(btn.dataset.lineId));
  });

  document.querySelectorAll('.cart-item-qty .qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cart = getCart();
      const item = cart.find(i => i.lineId === btn.dataset.lineId);
      if (!item) return;
      const newQty = item.qty + (btn.dataset.action === 'plus' ? 1 : -1);
      const max = getMaxQtyFor(item.productId, item.color, item.size);
      if (newQty > max) {
        showToast(`Solo hay ${max} disponible${max === 1 ? '' : 's'} de este producto en talla ${item.size}, color ${item.color}.`);
        return;
      }
      if (newQty < 1) {
        confirmRemoveCartItem(item.lineId);
        return;
      }
      updateCartItemQty(item.lineId, newQty);
      renderCart();
    });
  });

  document.querySelectorAll('.cart-item-qty .qty-input').forEach(input => {
    input.addEventListener('change', () => {
      const n = parseInt(input.value, 10);
      if (!isNaN(n) && n >= 1) {
        const item = getCart().find(i => i.lineId === input.dataset.lineId);
        const max = item ? getMaxQtyFor(item.productId, item.color, item.size) : 20;
        if (n > max) {
          showToast(`Solo hay ${max} disponible${max === 1 ? '' : 's'} de este producto en talla ${item.size}, color ${item.color}.`);
        }
        updateCartItemQty(input.dataset.lineId, n);
        renderCart();
      } else {
        confirmRemoveCartItem(input.dataset.lineId);
      }
    });
  });
}

// Después de aceptar los términos y condiciones: todavía no hay checkout real,
// así que mostramos un aviso de "próximo paso" en vez de cobrar nada.
function showCheckoutPlaceholder() {
  const root = document.getElementById('cartRoot');
  root.innerHTML = `
    <div class="checkout-placeholder">
      <span class="eyebrow">Paso siguiente</span>
      <h2>Estamos trabajando en el proceso de pago</h2>
      <p>Ya aceptaste los términos y condiciones. El pago y el envío todavía no están conectados — eso llega en la siguiente etapa del proyecto. ¡Gracias por tu paciencia!</p>
      <a href="catalogo.html" class="btn btn-primary">Seguir comprando</a>
    </div>
  `;
}

renderCart();