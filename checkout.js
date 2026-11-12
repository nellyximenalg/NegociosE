// Checkout simulado (se abre desde el carrito, después de aceptar los términos):
// Paso 1 Dirección · Paso 2 Método de pago · Paso 3 Confirmación y "Pagar".
// Al pagar se crea el pedido (con folio), se vacía el carrito y se muestra "Pago aprobado".
// Nunca se guarda el número completo de la tarjeta ni el CVV: solo los últimos 4 dígitos.
let co = null;

function startCheckout() {
  const cart = getCart();
  if (!cart.length) { renderCart(); return; }
  const email = ordersEmail();
  const acc = getAccount(email) || {};
  const addr = acc.address || {};
  co = {
    step: 1,
    folio: newOrderFolio(),
    address: {
      name: acc.name || getDisplayName(),
      phone: acc.phone || '',
      street: addr.street || '', colonia: addr.colonia || '', city: addr.city || '',
      state: addr.state || '', zip: addr.zip || '', country: addr.country || 'México'
    },
    method: 'card',
    card: { name: (acc.payment && acc.payment.name) || '', number: '', expiry: '', cvv: '' },
    processing: false
  };
  renderCheckout();
}

const CO_STEPS = ['Dirección', 'Pago', 'Confirmación'];

function coSummaryHtml(pricing, cart) {
  return `
    <aside class="co-summary">
      <h3>Tu pedido</h3>
      <div class="co-items">
        ${cart.map(i => {
          const disc = pricing.lineDiscounts[i.lineId] || 0;
          return `<div class="co-item"><div><strong>${orEsc(i.name)}</strong><span>Talla ${orEsc(i.size)} · ${orEsc(i.color)} · x${i.qty}</span></div><span>${orMoney(i.price * i.qty - disc)}</span></div>`;
        }).join('')}
      </div>
      <div class="co-totals">
        <div><span>Subtotal</span><span>${orMoney(pricing.subtotal)}</span></div>
        ${pricing.coupon ? `<div class="co-discount"><span>Descuento (${orEsc(pricing.coupon.code)})</span><span>−${orMoney(pricing.discount)}</span></div>` : ''}
        <div><span>Envío</span><span>Gratis</span></div>
        <div class="co-total"><span>Total</span><span>${orMoney(pricing.total)} MXN</span></div>
      </div>
    </aside>`;
}

function renderCheckout() {
  const root = document.getElementById('cartRoot');
  const cart = getCart();
  const pricing = computeCartPricing();
  root.innerHTML = `
    <div class="checkout">
      <div class="co-main">
        <ol class="co-steps">
          ${CO_STEPS.map((s, i) => `<li class="${i + 1 === co.step ? 'active' : i + 1 < co.step ? 'done' : ''}"><span>${i + 1 < co.step ? '✓' : i + 1}</span>${s}</li>`).join('')}
        </ol>
        <div id="coStep"></div>
      </div>
      ${coSummaryHtml(pricing, cart)}
    </div>`;
  if (co.step === 1) renderStepAddress();
  else if (co.step === 2) renderStepPayment(pricing);
  else renderStepConfirm(pricing, cart);
  root.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const coField = (id, label, value, attrs) => `
  <div class="login-field"><label for="${id}">${label}</label><input type="text" id="${id}" value="${orEsc(value)}" ${attrs || ''}></div>`;

function coError(msg) {
  const el = document.getElementById('coError');
  el.textContent = msg;
  el.hidden = !msg;
}
const onlyDigits = (el, max) => el.addEventListener('input', () => { el.value = el.value.replace(/\D/g, '').slice(0, max); });

// ---------- Paso 1: Dirección ----------
function readAddress() {
  const v = (id) => document.getElementById(id).value.trim();
  co.address = { name: v('coName'), phone: v('coPhone'), street: v('coStreet'), colonia: v('coColonia'), city: v('coCity'), state: v('coState'), zip: v('coZip'), country: v('coCountry') || 'México' };
}

function renderStepAddress() {
  const a = co.address;
  document.getElementById('coStep').innerHTML = `
    <form class="co-form" id="coAddressForm" novalidate>
      <h2>¿A dónde enviamos tu pedido?</h2>
      <div class="admin-form-row">
        ${coField('coName', 'Nombre completo', a.name, 'maxlength="60" autocomplete="name"')}
        ${coField('coPhone', 'Teléfono (10 dígitos)', a.phone, 'inputmode="numeric" autocomplete="tel"')}
      </div>
      ${coField('coStreet', 'Calle y número', a.street, 'maxlength="80" autocomplete="address-line1"')}
      <div class="admin-form-row">
        ${coField('coColonia', 'Colonia', a.colonia, 'maxlength="50"')}
        ${coField('coCity', 'Ciudad', a.city, 'maxlength="50"')}
      </div>
      <div class="admin-form-row admin-form-row--3">
        ${coField('coState', 'Estado', a.state, 'maxlength="40"')}
        ${coField('coZip', 'Código postal', a.zip, 'inputmode="numeric" autocomplete="postal-code"')}
        ${coField('coCountry', 'País', a.country, 'maxlength="40"')}
      </div>
      <p class="community-error" id="coError" role="alert" hidden></p>
      <div class="co-actions">
        <a href="carrito.html" class="btn btn-ghost">Volver al carrito</a>
        <button type="submit" class="btn btn-primary">Continuar al pago</button>
      </div>
    </form>`;
  onlyDigits(document.getElementById('coPhone'), 10);
  onlyDigits(document.getElementById('coZip'), 5);
  document.getElementById('coAddressForm').addEventListener('submit', (e) => {
    e.preventDefault();
    readAddress();
    const a = co.address;
    if (a.name.length < 3) return coError('Escribe tu nombre completo.');
    if (a.phone.length !== 10) return coError('El teléfono debe tener 10 dígitos.');
    if (a.street.length < 5) return coError('Escribe tu calle y número.');
    if (a.colonia.length < 2) return coError('Escribe tu colonia.');
    if (a.city.length < 2) return coError('Escribe tu ciudad.');
    if (a.state.length < 2) return coError('Escribe tu estado.');
    if (a.zip.length !== 5) return coError('El código postal debe tener 5 dígitos.');
    co.step = 2;
    renderCheckout();
  });
}

// ---------- Paso 2: Método de pago ----------
const TRANSFER = { bank: 'Banco Dahlia (simulado)', holder: 'Dahlia Moda S.A. de C.V.', clabe: '0121 8001 2345 6789 01' };

function renderStepPayment(pricing) {
  const email = ordersEmail();
  const balance = getWalletBalance(email);
  const methods = [
    ['card', 'Tarjeta de crédito o débito', 'Visa, Mastercard o American Express'],
    ['transfer', 'Transferencia', 'SPEI: te damos los datos para depositar'],
    ['wallet', 'Monedero Dahlia', `Saldo disponible: ${orMoney(balance)}`]
  ];
  document.getElementById('coStep').innerHTML = `
    <form class="co-form" id="coPayForm" novalidate>
      <h2>¿Cómo quieres pagar?</h2>
      <div class="co-methods">
        ${methods.map(([k, t, d]) => `
          <label class="co-method${co.method === k ? ' active' : ''}">
            <input type="radio" name="coMethod" value="${k}" ${co.method === k ? 'checked' : ''}>
            <span><strong>${t}</strong><small>${d}</small></span>
          </label>`).join('')}
      </div>
      <div id="coMethodPanel" class="co-method-panel"></div>
      <p class="community-error" id="coError" role="alert" hidden></p>
      <div class="co-actions">
        <button type="button" class="btn btn-ghost" id="coBack">Atrás</button>
        <button type="submit" class="btn btn-primary">Revisar pedido</button>
      </div>
    </form>`;

  const panel = document.getElementById('coMethodPanel');
  function paintPanel() {
    if (co.method === 'card') {
      panel.innerHTML = `
        <div class="login-field"><label for="coCardName">Nombre en la tarjeta</label><input type="text" id="coCardName" value="${orEsc(co.card.name)}" maxlength="50" autocomplete="cc-name"></div>
        <div class="login-field"><label for="coCardNumber">Número de tarjeta</label><input type="text" id="coCardNumber" value="${orEsc(co.card.number)}" inputmode="numeric" placeholder="0000 0000 0000 0000" autocomplete="cc-number"></div>
        <div class="admin-form-row">
          <div class="login-field"><label for="coCardExp">Vencimiento (MM/AA)</label><input type="text" id="coCardExp" value="${orEsc(co.card.expiry)}" inputmode="numeric" placeholder="MM/AA" autocomplete="cc-exp"></div>
          <div class="login-field"><label for="coCardCvv">CVV</label><input type="password" id="coCardCvv" value="${orEsc(co.card.cvv)}" inputmode="numeric" placeholder="•••" autocomplete="cc-csc"></div>
        </div>
        <p class="co-note">Es una simulación: no se hace ningún cargo real. Puedes usar una tarjeta de prueba, por ejemplo 4242 4242 4242 4242.</p>`;
      const num = document.getElementById('coCardNumber');
      num.addEventListener('input', () => { num.value = num.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); });
      const exp = document.getElementById('coCardExp');
      exp.addEventListener('input', () => {
        const d = exp.value.replace(/\D/g, '').slice(0, 4);
        exp.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
      });
      onlyDigits(document.getElementById('coCardCvv'), 4);
    } else if (co.method === 'transfer') {
      panel.innerHTML = `
        <div class="co-transfer">
          <p>Haz tu transferencia con estos datos y escribe el folio como referencia:</p>
          <dl>
            <div><dt>Banco</dt><dd>${TRANSFER.bank}</dd></div>
            <div><dt>Titular</dt><dd>${TRANSFER.holder}</dd></div>
            <div><dt>CLABE</dt><dd>${TRANSFER.clabe}</dd></div>
            <div><dt>Referencia</dt><dd>${orEsc(co.folio)}</dd></div>
            <div><dt>Monto exacto</dt><dd>${orMoney(pricing.total)} MXN</dd></div>
          </dl>
          <p class="co-note">Tu pedido quedará "En proceso" mientras validamos el depósito (simulado).</p>
        </div>`;
    } else {
      const short = balance < pricing.total;
      panel.innerHTML = `
        <div class="co-wallet">
          <div><span>Saldo disponible</span><strong>${orMoney(balance)}</strong></div>
          <div><span>Total a pagar</span><strong>${orMoney(pricing.total)}</strong></div>
          <div><span>Saldo después de pagar</span><strong>${short ? '—' : orMoney(balance - pricing.total)}</strong></div>
        </div>
        ${short ? '<p class="community-error">Tu saldo no alcanza para este pedido. Elige otro método de pago.</p>' : '<p class="co-note">El monto se descuenta de tu monedero (saldo simulado).</p>'}`;
    }
  }
  paintPanel();

  document.querySelectorAll('input[name=coMethod]').forEach(r => r.addEventListener('change', () => {
    saveCardFields(); // conserva lo escrito en la tarjeta si cambias de método y regresas
    co.method = r.value;
    document.querySelectorAll('.co-method').forEach(l => l.classList.toggle('active', l.querySelector('input').checked));
    coError('');
    paintPanel();
  }));
  document.getElementById('coBack').addEventListener('click', () => { saveCardFields(); co.step = 1; renderCheckout(); });

  document.getElementById('coPayForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (co.method === 'card') {
      saveCardFields();
      const c = co.card;
      const digits = c.number.replace(/\D/g, '');
      if (c.name.trim().length < 3) return coError('Escribe el nombre que aparece en la tarjeta.');
      if (digits.length < 15 || digits.length > 16) return coError('El número de tarjeta debe tener 15 o 16 dígitos.');
      const m = /^(\d{2})\/(\d{2})$/.exec(c.expiry);
      if (!m || +m[1] < 1 || +m[1] > 12) return coError('Escribe el vencimiento como MM/AA.');
      const now = new Date();
      const expYear = 2000 + +m[2];
      if (expYear < now.getFullYear() || (expYear === now.getFullYear() && +m[1] < now.getMonth() + 1)) return coError('La tarjeta está vencida.');
      if (c.cvv.length < 3) return coError('El CVV debe tener 3 o 4 dígitos.');
    }
    if (co.method === 'wallet' && getWalletBalance(email) < pricing.total) return coError('Tu saldo no alcanza para este pedido.');
    co.step = 3;
    renderCheckout();
  });
}

function saveCardFields() {
  const n = document.getElementById('coCardNumber');
  if (!n) return;
  co.card = {
    name: document.getElementById('coCardName').value,
    number: n.value,
    expiry: document.getElementById('coCardExp').value,
    cvv: document.getElementById('coCardCvv').value
  };
}

function coPaymentDetail() {
  if (co.method === 'card') return `Terminada en ${co.card.number.replace(/\D/g, '').slice(-4)}`;
  if (co.method === 'transfer') return `Transferencia SPEI · ref. ${co.folio}`;
  return 'Monedero Dahlia';
}

// ---------- Paso 3: Confirmación ----------
function renderStepConfirm(pricing, cart) {
  const a = co.address;
  document.getElementById('coStep').innerHTML = `
    <div class="co-form">
      <h2>Confirma tu pedido</h2>
      <div class="co-review">
        <div><h4>Enviar a</h4><p>${orEsc(a.name)} · ${orEsc(a.phone)}</p><p>${orEsc(a.street)}, ${orEsc(a.colonia)}</p><p>${orEsc(a.city)}, ${orEsc(a.state)}, C.P. ${orEsc(a.zip)}</p></div>
        <div><h4>Método de pago</h4><p>${orEsc(PAYMENT_LABELS[co.method])}</p><p>${orEsc(coPaymentDetail())}</p></div>
      </div>
      <p class="co-note">Folio de tu pedido: <strong>${orEsc(co.folio)}</strong></p>
      <div class="co-actions">
        <button type="button" class="btn btn-ghost" id="coBack3">Atrás</button>
        <button type="button" class="btn btn-primary" id="coPayBtn">Pagar ${orMoney(pricing.total)}</button>
      </div>
    </div>`;
  document.getElementById('coBack3').addEventListener('click', () => { co.step = 2; renderCheckout(); });
  document.getElementById('coPayBtn').addEventListener('click', () => payNow(pricing, cart));
}

function payNow(pricing, cart) {
  if (co.processing) return;
  co.processing = true;
  const btn = document.getElementById('coPayBtn');
  btn.disabled = true;
  btn.textContent = 'Procesando pago...';

  setTimeout(() => {
    const email = ordersEmail();
    const items = cart.map(i => {
      const disc = pricing.lineDiscounts[i.lineId] || 0;
      return { productId: i.productId, name: i.name, sku: i.sku, size: i.size, color: i.color, qty: i.qty, unitPrice: i.price, lineTotal: i.price * i.qty, discount: disc };
    });
    const order = {
      id: co.folio, email, sample: false,
      date: new Date().toISOString(),
      status: 'processing',
      items,
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      couponCode: pricing.coupon ? pricing.coupon.code : '',
      shipping: 0,
      total: pricing.total,
      customer: { name: co.address.name, email, phone: co.address.phone },
      address: { street: co.address.street, colonia: co.address.colonia, city: co.address.city, state: co.address.state, zip: co.address.zip, country: co.address.country },
      payment: { method: co.method, detail: coPaymentDetail() }
    };
    addOrder(order);
    if (co.method === 'wallet') setWalletBalance(email, getWalletBalance(email) - pricing.total);

    // Guarda la dirección en la cuenta si todavía no tenía una.
    const acc = getAccount(email);
    if (!acc.address || !acc.address.street) {
      saveAccount(email, { address: order.address, phone: acc.phone || co.address.phone });
    }
    saveCart([]);
    clearAppliedCoupon();
    co.processing = false;
    renderSuccess(order);
  }, 1100);
}

function renderSuccess(order) {
  const root = document.getElementById('cartRoot');
  root.innerHTML = `
    <div class="co-success">
      <div class="co-success-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <h2>Pago aprobado</h2>
      <p class="co-success-sub">¡Gracias por tu compra, ${orEsc(order.customer.name.split(' ')[0])}! Tu pedido ya está en proceso.</p>
      <div class="co-order-number"><span>Número de pedido</span><strong>${orEsc(order.id)}</strong></div>

      <div class="co-success-summary">
        <h3>Resumen de compra</h3>
        ${order.items.map(i => `<div class="co-item"><div><strong>${orEsc(i.name)}</strong><span>Talla ${orEsc(i.size)} · ${orEsc(i.color)} · x${i.qty}</span></div><span>${orMoney(i.lineTotal)}</span></div>`).join('')}
        <div class="co-totals">
          <div><span>Subtotal</span><span>${orMoney(order.subtotal)}</span></div>
          ${order.discount ? `<div class="co-discount"><span>Descuento (${orEsc(order.couponCode)})</span><span>−${orMoney(order.discount)}</span></div>` : ''}
          <div><span>Envío</span><span>Gratis</span></div>
          <div class="co-total"><span>Total pagado</span><span>${orMoney(order.total)} MXN</span></div>
        </div>
        <p class="co-note">${orEsc(PAYMENT_LABELS[order.payment.method])} · ${orEsc(order.payment.detail)}</p>
      </div>

      <div class="co-success-actions">
        <button type="button" class="btn btn-primary" id="coViewReceipt">Ver recibo</button>
        <button type="button" class="btn btn-ghost" id="coPdf">Descargar PDF</button>
        <a href="perfil.html" class="btn btn-ghost">Ver mis compras</a>
        <a href="catalogo.html" class="btn btn-ghost">Seguir comprando</a>
      </div>
    </div>`;
  document.getElementById('coViewReceipt').addEventListener('click', () => openReceiptModal(order));
  document.getElementById('coPdf').addEventListener('click', () => {
    showToast('En la ventana que se abre elige "Guardar como PDF" como destino.');
    printReceipt(order);
  });
  root.scrollIntoView({ behavior: 'smooth', block: 'start' });
}