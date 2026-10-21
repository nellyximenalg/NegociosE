// Sección "Promociones" del inicio: muestra los cupones vigentes y permite probar un código.
(function () {
  const grid = document.getElementById('promoGrid');
  if (!grid || typeof getCoupons !== 'function') return;

  const input = document.getElementById('promoCodeInput');
  const form = document.getElementById('promoCodeForm');
  const msg = document.getElementById('promoCodeMsg');

  const GIFT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>';

  function showMsg(html, kind) {
    msg.innerHTML = html;
    msg.className = `promo-code-msg promo-code-msg--${kind}`;
    msg.hidden = false;
  }

  function renderPromos() {
    const list = getCoupons().filter(isCouponUsable);
    if (!list.length) {
      grid.innerHTML = '<p class="promo-empty">Por ahora no hay promociones activas. ¡Vuelve pronto!</p>';
      return;
    }
    grid.innerHTML = list.map(c => {
      const meta = [
        couponScopeLabel(c),
        c.minPurchase ? `Compra mín. $${formatPrice(c.minPurchase)}` : '',
        c.end ? `Hasta ${formatDateEsShort(c.end)}` : ''
      ].filter(Boolean).join(' · ');
      return `
        <article class="promo-card">
          <div class="promo-card-top">
            <span class="promo-card-icon">${GIFT_ICON}</span>
            <h3>${escHtml(c.title)}</h3>
          </div>
          <p class="promo-desc">${escHtml(c.description || '')}</p>
          <p class="promo-meta">${escHtml(meta)}</p>
          <div class="promo-card-bottom">
            <button type="button" class="promo-code-chip" data-code="${escHtml(c.code)}" title="Usar este código">${escHtml(c.code)}</button>
            <span class="promo-value">${escHtml(couponValueLabel(c))}</span>
          </div>
        </article>
      `;
    }).join('');

    grid.querySelectorAll('.promo-code-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        input.value = btn.dataset.code;
        input.focus();
      });
    });
  }

  // "Aplicar": valida el código y, si hay sesión y productos en el carrito, lo aplica
  // a los productos que cubre y muestra el total ya actualizado.
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const code = input.value.trim();
    if (!code) { showMsg('Escribe un código de descuento.', 'error'); return; }

    const coupon = findCouponByCode(code);
    if (!coupon || !isCouponUsable(coupon)) {
      showMsg('Ese código no es válido o ya no está vigente.', 'error');
      return;
    }

    if (!isLoggedIn()) {
      showMsg(`El código <strong>${escHtml(coupon.code)}</strong> es válido. <a href="login.html?redirect=promos.html">Inicia sesión</a> para aplicarlo a tu carrito.`, 'ok');
      return;
    }

    const cart = getCart();
    if (!cart.length) {
      showMsg(`✓ El código <strong>${escHtml(coupon.code)}</strong> es válido (${escHtml(coupon.title)}). Agrega productos a tu carrito para usarlo.`, 'ok');
      return;
    }

    const res = applyCouponToLines(coupon, cart.map(l => l.lineId));
    if (!res.ok) {
      const reason = res.eligible.length ? res.reason : 'Ningún producto de tu carrito aplica para este cupón.';
      showMsg(escHtml(reason), 'error');
      return;
    }

    const p = computeCartPricing();
    showMsg(
      `✓ Descuento aplicado correctamente. Ahorras $${formatPrice(p.discount)} MXN. ` +
      `Total actualizado: <strong>$${formatPrice(p.total)} MXN</strong> (antes $${formatPrice(p.subtotal)}). ` +
      `<a href="carrito.html">Ver carrito</a>`,
      'ok'
    );
    input.value = '';
  });

  renderPromos();
})();