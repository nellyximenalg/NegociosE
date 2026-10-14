// Lógica compartida de CUPONES (simulada, guardada en localStorage).
// Se usa en: inicio.html (sección Promos), carrito.html (aplicar cupón) y admin.html (sección Cupones).
// Requiere que auth.js y products.js ya estén cargados.
//
// Los cupones NO cambian el precio de los productos (eso lo hace la sección "Promociones"
// del admin). Un cupón es un código que el cliente aplica en el carrito, y solo afecta a
// los productos seleccionados que cumplan con lo que el cupón cubre.
//
// Forma de un cupón:
// {
//   id, code, title, description,
//   type: 'percent' | 'amount',      // % de descuento o monto fijo en pesos
//   value: number,
//   scope: 'all' | 'category' | 'products',
//   category: 'mujer' | 'hombre' | 'accesorios' (si scope = 'category'),
//   productIds: [ids] (si scope = 'products'),
//   minPurchase: number,             // compra mínima (sobre los productos a los que aplica)
//   start, end: 'YYYY-MM-DD' o '',
//   active: true | false
// }

const COUPONS_KEY = 'dahlia_coupons';

const COUPON_CATEGORY_LABELS = { mujer: 'Mujer', hombre: 'Hombre', accesorios: 'Accesorios' };

// Cupones de ejemplo: solo se cargan la primera vez, para que la tienda no se vea vacía.
const DEFAULT_COUPONS = [
  { id: 'cp_1', code: 'ACCESORIOS10', title: '10% en Accesorios', description: 'Descuento en toda la línea de accesorios.', type: 'percent', value: 10, scope: 'category', category: 'accesorios', productIds: [], minPurchase: 0, start: '', end: '', active: true },
  { id: 'cp_2', code: 'MUJER15', title: '15% en ropa de Mujer', description: 'Vestidos, blusas y más de la línea de mujer.', type: 'percent', value: 15, scope: 'category', category: 'mujer', productIds: [], minPurchase: 0, start: '', end: '', active: true },
  { id: 'cp_3', code: 'COMPRA20', title: '20% en compras mayores a $500', description: 'Aplica a los productos que elijas si suman más de $500.', type: 'percent', value: 20, scope: 'all', category: '', productIds: [], minPurchase: 500, start: '', end: '', active: true },
  { id: 'cp_4', code: 'BIENVENIDA100', title: '$100 de descuento', description: 'En compras mayores a $800.', type: 'amount', value: 100, scope: 'all', category: '', productIds: [], minPurchase: 800, start: '', end: '', active: true }
];

function escHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

// ---------- Guardado ----------
function getCoupons() {
  try {
    const raw = localStorage.getItem(COUPONS_KEY);
    if (raw === null) {
      localStorage.setItem(COUPONS_KEY, JSON.stringify(DEFAULT_COUPONS));
      return DEFAULT_COUPONS.map(c => Object.assign({}, c));
    }
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

function saveCoupons(list) {
  localStorage.setItem(COUPONS_KEY, JSON.stringify(list));
}

function findCouponByCode(code) {
  const c = String(code || '').trim().toUpperCase();
  if (!c) return null;
  return getCoupons().find(cp => cp.code.toUpperCase() === c) || null;
}

// ---------- Estado y textos ----------
// 'activa' | 'programada' | 'expirada' | 'pausada'
function couponState(c) {
  if (!c.active) return 'pausada';
  const today = getTodayLocal();
  if (c.start && today < c.start) return 'programada';
  if (c.end && today > c.end) return 'expirada';
  return 'activa';
}

function isCouponUsable(c) {
  return couponState(c) === 'activa';
}

function couponValueLabel(c) {
  return c.type === 'amount' ? `$${formatPrice(c.value)}` : `${c.value}%`;
}

function couponScopeLabel(c) {
  if (c.scope === 'category') return `Línea de ${COUPON_CATEGORY_LABELS[c.category] || c.category}`;
  if (c.scope === 'products') {
    const names = getStoreProducts().filter(p => (c.productIds || []).includes(p.id)).map(p => p.name);
    if (!names.length) return 'Productos seleccionados';
    return names.length <= 2 ? names.join(', ') : `${names.length} productos seleccionados`;
  }
  return 'Todos los productos';
}

function formatDateEsShort(d) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

// ---------- Qué productos del carrito cubre un cupón ----------
function couponCoversItem(c, item) {
  if (c.scope === 'all') return true;
  if (c.scope === 'products') return (c.productIds || []).includes(item.productId);
  if (c.scope === 'category') {
    const product = getStoreProducts().find(p => p.id === item.productId);
    return !!product && product.category === c.category;
  }
  return false;
}

// Revisa un cupón contra un conjunto de líneas del carrito.
// Devuelve { ok, eligible, base, discount, reason }.
function checkCoupon(c, lines) {
  const eligible = lines.filter(l => couponCoversItem(c, l));
  const base = eligible.reduce((s, l) => s + l.price * l.qty, 0);
  if (!isCouponUsable(c)) return { ok: false, eligible, base, discount: 0, reason: 'Este cupón no está vigente.' };
  if (!eligible.length) return { ok: false, eligible, base, discount: 0, reason: 'Ningún producto seleccionado aplica para este cupón.' };
  if (c.minPurchase && base < c.minPurchase) {
    return { ok: false, eligible, base, discount: 0, reason: `Requiere una compra mínima de $${formatPrice(c.minPurchase)} en los productos que aplican.` };
  }
  return { ok: true, eligible, base, discount: calcCouponDiscount(c, base), reason: '' };
}

function calcCouponDiscount(c, base) {
  if (c.type === 'amount') return Math.min(c.value, base);
  return Math.round(base * c.value / 100);
}

// Reparte el descuento entre las líneas elegibles (para mostrar el precio final de cada producto).
function splitDiscount(c, eligible, totalDiscount) {
  const out = {};
  const base = eligible.reduce((s, l) => s + l.price * l.qty, 0);
  let left = totalDiscount;
  eligible.forEach((l, i) => {
    const isLast = i === eligible.length - 1;
    const share = isLast ? left : Math.min(left, Math.round(totalDiscount * (l.price * l.qty) / base));
    out[l.lineId] = share;
    left -= share;
  });
  return out;
}

// Cupones que se pueden usar con las líneas seleccionadas (solo los aplicables).
function getApplicableCoupons(lines) {
  return getCoupons()
    .map(c => ({ coupon: c, result: checkCoupon(c, lines) }))
    .filter(x => x.result.ok);
}

// ---------- Cupón aplicado al carrito (uno a la vez, guardado por cuenta) ----------
function getAppliedKey() {
  const email = localStorage.getItem('dahlia_user_email') || 'invitada';
  return `dahlia_coupon_applied_${email}`;
}

function getAppliedCoupon() {
  try {
    return JSON.parse(localStorage.getItem(getAppliedKey())) || null;
  } catch (e) {
    return null;
  }
}

function clearAppliedCoupon() {
  localStorage.removeItem(getAppliedKey());
}

// Aplica un cupón a las líneas indicadas (solo se guardan las que realmente cubre).
function applyCouponToLines(c, lineIds) {
  const lines = getCart().filter(l => lineIds.includes(l.lineId));
  const res = checkCoupon(c, lines);
  if (!res.ok) return res;
  localStorage.setItem(getAppliedKey(), JSON.stringify({ code: c.code, lineIds: res.eligible.map(l => l.lineId) }));
  return res;
}

// Calcula subtotal, descuento y total del carrito con el cupón aplicado (si sigue siendo válido).
// Si ya no es válido (se quitó un producto, bajó de la compra mínima, expiró...), lo quita
// y lo avisa en "removed".
function computeCartPricing() {
  const cart = getCart();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const pricing = { subtotal, discount: 0, total: subtotal, coupon: null, lineDiscounts: {}, removed: null };

  const applied = getAppliedCoupon();
  if (!applied) return pricing;

  const coupon = findCouponByCode(applied.code);
  const lines = cart.filter(l => (applied.lineIds || []).includes(l.lineId));
  const res = coupon ? checkCoupon(coupon, lines) : { ok: false, reason: 'El cupón ya no existe.' };

  if (!res.ok) {
    clearAppliedCoupon();
    pricing.removed = { code: applied.code, reason: res.reason };
    return pricing;
  }

  pricing.coupon = coupon;
  pricing.discount = res.discount;
  pricing.total = subtotal - res.discount;
  pricing.lineDiscounts = splitDiscount(coupon, res.eligible, res.discount);
  return pricing;
}