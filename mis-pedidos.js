// Perfil > Mis compras: historial de pedidos (en proceso, enviados, entregados...),
// con detalle, recibo y opción de imprimir. Los pedidos nuevos vienen del checkout.
(function () {
  const list = document.getElementById('myOrders');
  const filtersBox = document.getElementById('myOrdersFilters');
  if (!list || !filtersBox || typeof getOrders !== 'function') return;

  const email = ordersEmail();
  if (!email) return;
  let filter = 'all';

  function render() {
    const all = getOrders(email).slice().sort((a, b) => new Date(b.date) - new Date(a.date));

    const counts = { all: all.length };
    Object.keys(ORDER_STATUS).forEach(k => { counts[k] = all.filter(o => o.status === k).length; });
    const chips = [['all', 'Todos']].concat(Object.keys(ORDER_STATUS).filter(k => k !== 'cancelled' || counts.cancelled).map(k => [k, ORDER_STATUS[k].label]));
    filtersBox.innerHTML = chips.map(([k, label]) =>
      `<button type="button" class="mk-chip${k === filter ? ' active' : ''}" data-filter="${k}">${label} (${counts[k] || 0})</button>`).join('');
    filtersBox.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => { filter = b.dataset.filter; render(); }));

    const shown = filter === 'all' ? all : all.filter(o => o.status === filter);
    if (!all.length) {
      list.innerHTML = `
        <div class="account-card">
          <p class="placeholder-text">Todavía no has hecho ninguna compra.</p>
          <a href="catalogo.html" class="btn btn-primary">Ver catálogo</a>
        </div>`;
      return;
    }
    if (!shown.length) {
      list.innerHTML = '<p class="comment-empty">No tienes pedidos con este estado.</p>';
      return;
    }
    list.innerHTML = shown.map(o => {
      const st = ORDER_STATUS[o.status] || ORDER_STATUS.processing;
      const names = o.items.map(i => `${i.name}${i.qty > 1 ? ' x' + i.qty : ''}`);
      const summary = names.length > 3 ? names.slice(0, 3).join(', ') + ` y ${names.length - 3} más` : names.join(', ');
      return `
        <article class="order-card">
          <div class="order-card-top">
            <div>
              <p class="order-folio">${orEsc(o.id)}</p>
              <p class="order-date">${orEsc(formatOrderDate(o.date))}</p>
            </div>
            <span class="admin-status admin-status--${st.badge}">${st.label}</span>
          </div>
          <p class="order-card-items">${orEsc(summary)}</p>
          <div class="order-card-bottom">
            <span class="order-card-total">${orMoney(o.total)} MXN</span>
            <div class="order-card-actions">
              <button type="button" class="btn btn-ghost btn-sm" data-detail="${orEsc(o.id)}">Ver detalle</button>
              <button type="button" class="btn btn-ghost btn-sm" data-receipt="${orEsc(o.id)}">Ver recibo</button>
              <button type="button" class="btn btn-primary btn-sm" data-print="${orEsc(o.id)}">Imprimir</button>
            </div>
          </div>
        </article>`;
    }).join('');

    const byId = (id) => all.find(o => o.id === id);
    list.querySelectorAll('[data-detail]').forEach(b => b.addEventListener('click', () => openOrderDetailModal(byId(b.dataset.detail))));
    list.querySelectorAll('[data-receipt]').forEach(b => b.addEventListener('click', () => openReceiptModal(byId(b.dataset.receipt))));
    list.querySelectorAll('[data-print]').forEach(b => b.addEventListener('click', () => printReceipt(byId(b.dataset.print))));
  }

  render();
})();