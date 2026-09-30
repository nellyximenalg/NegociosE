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

  const { subtotal, total } = getCartTotals();

  root.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">
        ${cart.map(renderCartItemRow).join('')}
      </div>
      <div class="cart-summary">
        <h3>Resumen</h3>
        <div class="cart-summary-row"><span>Subtotal</span><span>$${formatPrice(subtotal)} MXN</span></div>
        <div class="cart-summary-row cart-summary-total"><span>Total</span><span>$${formatPrice(total)} MXN</span></div>
        <button type="button" class="btn btn-primary cart-checkout-btn" id="checkoutBtn">Ir a pagar</button>
        <a href="catalogo.html" class="cart-continue-link">Seguir comprando</a>
      </div>
    </div>
  `;

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

function renderCartItemRow(item) {
  const lineTotal = item.price * item.qty;
  const image = getItemImage(item);
  return `
    <div class="cart-item">
      <div class="cart-item-image" style="background:${item.gradient || 'var(--surface-alt)'}">
        ${image ? `<img src="${image}" alt="${item.name}" onerror="this.style.display='none'">` : ''}
      </div>
      <div class="cart-item-info">
        <p class="prod-sku">${item.sku}</p>
        <h3>${item.name}</h3>
        <p class="cart-item-variant">Talla ${item.size} · Color ${item.color}</p>
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
      <div class="cart-item-price">$${formatPrice(lineTotal)} MXN</div>
    </div>
  `;
}

function attachCartEvents() {
  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      removeCartItem(btn.dataset.lineId);
      renderCart();
    });
  });

  document.querySelectorAll('.cart-item-qty .qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cart = getCart();
      const item = cart.find(i => i.lineId === btn.dataset.lineId);
      if (!item) return;
      const newQty = item.qty + (btn.dataset.action === 'plus' ? 1 : -1);
      if (newQty < 1) {
        removeCartItem(item.lineId);
      } else {
        updateCartItemQty(item.lineId, newQty);
      }
      renderCart();
    });
  });

  document.querySelectorAll('.cart-item-qty .qty-input').forEach(input => {
    input.addEventListener('change', () => {
      const n = parseInt(input.value, 10);
      if (!isNaN(n) && n >= 1) {
        updateCartItemQty(input.dataset.lineId, n);
      } else {
        removeCartItem(input.dataset.lineId);
      }
      renderCart();
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