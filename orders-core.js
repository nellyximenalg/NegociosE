// Pedidos, recibos y monedero: datos compartidos por el checkout (carrito.html),
// el historial del perfil (perfil.html) y el panel de administrador.
// Todo es simulado y se guarda en localStorage, ligado al correo de la sesión.

const ORDER_STATUS = {
  processing: { label: 'En proceso', badge: 'en-preparacion' },
  shipped: { label: 'Enviado', badge: 'enviado' },
  delivered: { label: 'Entregado', badge: 'entregado' },
  cancelled: { label: 'Cancelado', badge: 'cancelado' }
};
const ORDER_STEPS = ['processing', 'shipped', 'delivered'];

const PAYMENT_LABELS = { card: 'Tarjeta', transfer: 'Transferencia', wallet: 'Monedero Dahlia' };

const BUSINESS = {
  name: 'Dahlia',
  legal: 'Dahlia Moda S.A. de C.V.',
  rfc: 'DMO260101AB1',
  address: 'Aguascalientes, Ags., México',
  email: 'hola@dahlia.mx'
};

const orEsc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const orMoney = (n) => '$' + formatPrice(n);

function ordersEmail() {
  return isLoggedIn() ? (localStorage.getItem('dahlia_user_email') || '') : '';
}
function ordersKey(email) { return `dahlia_orders_${email}`; }

// ---------- Monedero (saldo simulado) ----------
function getWalletBalance(email) {
  const raw = localStorage.getItem(`dahlia_wallet_${email}`);
  if (raw === null) {
    localStorage.setItem(`dahlia_wallet_${email}`, '2000');
    return 2000;
  }
  return parseFloat(raw) || 0;
}
function setWalletBalance(email, amount) {
  localStorage.setItem(`dahlia_wallet_${email}`, String(Math.max(0, Math.round(amount))));
}

// ---------- Folio ----------
function newOrderFolio(date) {
  const d = date || new Date();
  const ymd = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  const rnd = String(Math.floor(1000 + Math.random() * 9000));
  return `DHL-${ymd}-${rnd}`;
}

// ---------- Pedidos ----------
function sampleOrderItem(productId, qty) {
  const p = getStoreProducts().find(x => x.id === productId);
  if (!p) return null;
  const color = (p.colors && p.colors[0]) || { name: 'Único' };
  const size = (p.sizes && p.sizes[0] && p.sizes[0].label) || 'M';
  const unit = getEffectivePrice(p);
  return { productId: p.id, name: p.name, sku: p.sku, size, color: color.name, qty, unitPrice: unit, lineTotal: unit * qty, discount: 0 };
}

// La primera vez se cargan pedidos anteriores de ejemplo para que el historial no esté vacío.
function buildSampleOrders(email) {
  const acc = getAccount(email);
  const customer = { name: acc.name || getDisplayName(), email, phone: acc.phone || '4491234567' };
  const address = Object.assign({ street: 'Av. Aguascalientes Sur 120', colonia: 'Centro', city: 'Aguascalientes', state: 'Aguascalientes', zip: '20000', country: 'México' }, acc.address || {});
  const day = 86400000, now = Date.now();
  const defs = [
    { id: 'DHL-260929-3156', days: 38, status: 'delivered', items: [[2, 1], [3, 1]], pay: { method: 'card', detail: 'Terminada en 4242' } },
    { id: 'DHL-261014-7721', days: 22, status: 'delivered', items: [[13, 1], [25, 1]], pay: { method: 'wallet', detail: 'Monedero Dahlia' } },
    { id: 'DHL-261101-4408', days: 5, status: 'shipped', items: [[4, 1]], pay: { method: 'transfer', detail: 'Transferencia SPEI' } },
    { id: 'DHL-261105-9035', days: 1, status: 'processing', items: [[1, 1]], pay: { method: 'card', detail: 'Terminada en 4242' } }
  ];
  return defs.map(d => {
    const items = d.items.map(([id, q]) => sampleOrderItem(id, q)).filter(Boolean);
    if (!items.length) return null;
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
    return {
      id: d.id, email, sample: true,
      date: new Date(now - d.days * day).toISOString(),
      status: d.status, items, subtotal, discount: 0, couponCode: '', shipping: 0, total: subtotal,
      customer, address, payment: d.pay
    };
  }).filter(Boolean);
}

function getOrders(email) {
  if (!email) return [];
  try {
    const raw = localStorage.getItem(ordersKey(email));
    if (raw === null) {
      const seeded = buildSampleOrders(email);
      localStorage.setItem(ordersKey(email), JSON.stringify(seeded));
      return seeded;
    }
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) { return []; }
}
function saveOrders(email, list) {
  try { localStorage.setItem(ordersKey(email), JSON.stringify(list)); return true; } catch (e) { return false; }
}
function addOrder(order) {
  const list = getOrders(order.email);
  list.push(order);
  return saveOrders(order.email, list);
}

// ---------- Recibo (ticket) ----------
function formatOrderDate(iso) {
  const d = new Date(iso);
  return `${d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}, ${d.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' })}`;
}

function renderReceiptHtml(o) {
  const st = ORDER_STATUS[o.status] || ORDER_STATUS.processing;
  return `
    <div class="receipt">
      <div class="receipt-head">
        <div class="receipt-brand">${orEsc(BUSINESS.name)}</div>
        <p>${orEsc(BUSINESS.legal)}</p>
        <p>RFC ${orEsc(BUSINESS.rfc)} · ${orEsc(BUSINESS.address)}</p>
        <p>${orEsc(BUSINESS.email)}</p>
      </div>
      <h3 class="receipt-title">Recibo de compra</h3>
      <div class="receipt-meta">
        <div><span>Folio</span><strong>${orEsc(o.id)}</strong></div>
        <div><span>Fecha</span><strong>${orEsc(formatOrderDate(o.date))}</strong></div>
        <div><span>Estado</span><strong>${orEsc(st.label)}</strong></div>
      </div>
      <div class="receipt-cols">
        <div>
          <h4>Cliente</h4>
          <p>${orEsc(o.customer.name)}</p>
          <p>${orEsc(o.customer.email)}</p>
          ${o.customer.phone ? `<p>Tel. ${orEsc(o.customer.phone)}</p>` : ''}
        </div>
        <div>
          <h4>Envío a</h4>
          <p>${orEsc(o.address.street)}</p>
          <p>${orEsc(o.address.colonia)}, ${orEsc(o.address.city)}</p>
          <p>${orEsc(o.address.state)}, C.P. ${orEsc(o.address.zip)}</p>
        </div>
        <div>
          <h4>Pago</h4>
          <p>${orEsc(PAYMENT_LABELS[o.payment.method] || o.payment.method)}</p>
          <p>${orEsc(o.payment.detail || '')}</p>
        </div>
      </div>
      <table class="receipt-table">
        <thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Importe</th></tr></thead>
        <tbody>
          ${o.items.map(i => `
            <tr>
              <td><strong>${orEsc(i.name)}</strong><span>${orEsc(i.sku)} · Talla ${orEsc(i.size)} · ${orEsc(i.color)}</span></td>
              <td>${i.qty}</td>
              <td>${orMoney(i.unitPrice)}</td>
              <td>${orMoney(i.lineTotal)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
      <div class="receipt-totals">
        <div><span>Subtotal</span><span>${orMoney(o.subtotal)}</span></div>
        ${o.discount ? `<div><span>Descuento${o.couponCode ? ' (' + orEsc(o.couponCode) + ')' : ''}</span><span>−${orMoney(o.discount)}</span></div>` : ''}
        <div><span>Envío</span><span>${o.shipping ? orMoney(o.shipping) : 'Gratis'}</span></div>
        <div class="receipt-total"><span>Total</span><span>${orMoney(o.total)} MXN</span></div>
      </div>
      <p class="receipt-foot">¡Gracias por tu compra! Este comprobante es una simulación y no tiene validez fiscal.</p>
    </div>`;
}

// Abre el recibo en una ventana con botones para imprimir / descargar PDF.
let receiptModalEl = null;
function openReceiptModal(order) {
  if (!receiptModalEl) {
    receiptModalEl = document.createElement('div');
    receiptModalEl.className = 'modal-overlay';
    receiptModalEl.innerHTML = `
      <div class="modal-panel modal-panel--receipt" role="dialog" aria-modal="true" aria-label="Recibo de compra">
        <button type="button" class="modal-close" aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>
        </button>
        <div id="receiptModalBody"></div>
        <div class="receipt-actions">
          <button type="button" class="btn btn-ghost" id="receiptPrintBtn">Imprimir</button>
          <button type="button" class="btn btn-primary" id="receiptPdfBtn">Descargar PDF</button>
        </div>
      </div>`;
    document.body.appendChild(receiptModalEl);
    const close = () => { receiptModalEl.classList.remove('open'); document.body.classList.remove('modal-open'); };
    receiptModalEl._close = close;
    receiptModalEl.addEventListener('click', (e) => { if (e.target === receiptModalEl) close(); });
    receiptModalEl.querySelector('.modal-close').addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && receiptModalEl.classList.contains('open')) close(); });
  }
  receiptModalEl.querySelector('#receiptModalBody').innerHTML = renderReceiptHtml(order);
  receiptModalEl.querySelector('#receiptPrintBtn').onclick = () => printReceipt(order);
  receiptModalEl.querySelector('#receiptPdfBtn').onclick = () => {
    showToast('En la ventana que se abre elige "Guardar como PDF" como destino.');
    printReceipt(order);
  };
  receiptModalEl.classList.add('open');
  document.body.classList.add('modal-open');
}

// Imprime solo el recibo (el resto de la página se oculta con estilos de impresión).
function printReceipt(order) {
  let root = document.getElementById('receiptPrint');
  if (!root) {
    root = document.createElement('div');
    root.id = 'receiptPrint';
    document.body.appendChild(root);
  }
  root.innerHTML = renderReceiptHtml(order);
  document.body.classList.add('printing-receipt');
  const cleanup = () => { document.body.classList.remove('printing-receipt'); window.removeEventListener('afterprint', cleanup); };
  window.addEventListener('afterprint', cleanup);
  window.print();
}

// ---------- Detalle del pedido (resumen + avance) ----------
let orderDetailEl = null;
function openOrderDetailModal(order) {
  if (!orderDetailEl) {
    orderDetailEl = document.createElement('div');
    orderDetailEl.className = 'modal-overlay';
    orderDetailEl.innerHTML = `
      <div class="modal-panel modal-panel--wide" role="dialog" aria-modal="true" aria-label="Detalle del pedido">
        <button type="button" class="modal-close" aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>
        </button>
        <div id="orderDetailBody"></div>
      </div>`;
    document.body.appendChild(orderDetailEl);
    const close = () => { orderDetailEl.classList.remove('open'); document.body.classList.remove('modal-open'); };
    orderDetailEl._close = close;
    orderDetailEl.addEventListener('click', (e) => { if (e.target === orderDetailEl) close(); });
    orderDetailEl.querySelector('.modal-close').addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && orderDetailEl.classList.contains('open')) close(); });
  }
  const st = ORDER_STATUS[order.status] || ORDER_STATUS.processing;
  const reached = ORDER_STEPS.indexOf(order.status);
  const timeline = order.status === 'cancelled'
    ? '<p class="order-cancelled">Este pedido fue cancelado.</p>'
    : `<ol class="order-timeline">${ORDER_STEPS.map((s, i) => `<li class="${i <= reached ? 'done' : ''}"><span></span>${ORDER_STATUS[s].label}</li>`).join('')}</ol>`;
  orderDetailEl.querySelector('#orderDetailBody').innerHTML = `
    <div class="order-detail">
      <div class="order-detail-head">
        <div>
          <p class="order-folio">${orEsc(order.id)}</p>
          <p class="order-date">${orEsc(formatOrderDate(order.date))}</p>
        </div>
        <span class="admin-status admin-status--${st.badge}">${st.label}</span>
      </div>
      ${timeline}
      <div class="order-detail-cols">
        <div><h4>Envío a</h4><p>${orEsc(order.customer.name)}</p><p>${orEsc(order.address.street)}, ${orEsc(order.address.colonia)}</p><p>${orEsc(order.address.city)}, ${orEsc(order.address.state)}, C.P. ${orEsc(order.address.zip)}</p></div>
        <div><h4>Pago</h4><p>${orEsc(PAYMENT_LABELS[order.payment.method] || '')}</p><p>${orEsc(order.payment.detail || '')}</p></div>
      </div>
      <div class="order-items">
        ${order.items.map(i => `<div class="order-item"><div><strong>${orEsc(i.name)}</strong><span>Talla ${orEsc(i.size)} · ${orEsc(i.color)} · x${i.qty}</span></div><span>${orMoney(i.lineTotal)}</span></div>`).join('')}
      </div>
      <div class="order-totals">
        <div><span>Subtotal</span><span>${orMoney(order.subtotal)}</span></div>
        ${order.discount ? `<div><span>Descuento${order.couponCode ? ' (' + orEsc(order.couponCode) + ')' : ''}</span><span>−${orMoney(order.discount)}</span></div>` : ''}
        <div><span>Envío</span><span>${order.shipping ? orMoney(order.shipping) : 'Gratis'}</span></div>
        <div class="order-total"><span>Total</span><span>${orMoney(order.total)} MXN</span></div>
      </div>
      <div class="order-detail-actions">
        <button type="button" class="btn btn-ghost" id="odReceipt">Ver recibo</button>
        <button type="button" class="btn btn-primary" id="odPrint">Imprimir recibo</button>
      </div>
    </div>`;
  orderDetailEl.querySelector('#odReceipt').onclick = () => { orderDetailEl._close(); openReceiptModal(order); };
  orderDetailEl.querySelector('#odPrint').onclick = () => printReceipt(order);
  orderDetailEl.classList.add('open');
  document.body.classList.add('modal-open');
}