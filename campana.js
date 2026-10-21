// Página de campaña (landing): producto destacado, llamado a la acción y reseñas simuladas.
// Para cambiar el producto destacado: campana.html?id=5, o cambia CAMPAIGN_PRODUCT_ID.
(function () {
  const CAMPAIGN_PRODUCT_ID = 1;

  const params = new URLSearchParams(window.location.search);
  const wantedId = parseInt(params.get('id'), 10) || CAMPAIGN_PRODUCT_ID;
  const products = getStoreProducts();
  const product = products.find(p => p.id === wantedId) || products.find(p => p.featured) || products[0];

  const hero = document.getElementById('campaignHero');
  if (!product || !hero) return;

  const price = getEffectivePrice(product);
  const onSale = isPromoActive(product) && product.discountPrice;
  const { rating, reviews } = getProductRating(product);
  const totalStock = getTotalStock(product);
  const soldOut = totalStock === 0;
  let color = product.colors[0];
  let imageIndex = 0;

  // Mejor cupón vigente para este producto (si hay), para mostrarlo como gancho.
  function bestCoupon() {
    const line = { lineId: 'campana', productId: product.id, price, qty: 1 };
    return getCoupons()
      .map(c => ({ c, r: checkCoupon(c, [line]) }))
      .filter(x => x.r.ok)
      .sort((a, b) => b.r.discount - a.r.discount)[0] || null;
  }
  const hint = bestCoupon();
  const hintHtml = hint
    ? `<span class="campaign-coupon-hint">Usa el código <code>${escHtml(hint.c.code)}</code> en tu carrito y ahorra $${formatPrice(hint.r.discount)}</span>`
    : '';

  function buyNow() {
    if (soldOut) return;
    if (!isLoggedIn()) {
      window.location.href = 'login.html?redirect=' + encodeURIComponent('campana.html' + window.location.search);
      return;
    }
    openAddToCartModal(product);
  }

  // ---------- Hero ----------
  function renderHero() {
    const images = color.images || [];
    const lowStock = !soldOut && totalStock <= 15;
    hero.innerHTML = `
      <div class="campaign-copy">
        <span class="eyebrow">Campaña Otoño 2026</span>
        <h1>Tu pieza de la <em>temporada</em>.</h1>
        <p class="campaign-product-name">${escHtml(product.name)}</p>
        <p class="campaign-lead">${escHtml(product.description || '')}</p>
        <div class="campaign-rating"><span class="prod-stars">${renderStars(rating)}</span> ${rating.toFixed(1)} · ${reviews} reseñas</div>
        <div class="campaign-price">
          <strong>$${formatPrice(price)} MXN</strong>
          ${onSale ? `<span class="prod-price-old">$${formatPrice(product.price)}</span>` : ''}
        </div>
        <div class="campaign-colors" id="campaignColors">
          ${product.colors.map(c => `<button type="button" class="option-swatch${c.name === color.name ? ' active' : ''}" style="background:${c.hex}" title="${escHtml(c.name)}" aria-label="${escHtml(c.name)}" data-color="${escHtml(c.name)}"></button>`).join('')}
          <span class="campaign-colors-name">${escHtml(color.name)}</span>
        </div>
        <p class="campaign-meta${lowStock ? ' campaign-meta--low' : ''}">${soldOut ? 'Agotado por ahora' : lowStock ? '¡Últimas piezas disponibles!' : 'Tallas ' + product.sizes.map(s => s.label).join(' · ')}</p>
        <div class="campaign-ctas">
          <button type="button" class="btn btn-primary" id="campaignBuy" ${soldOut ? 'disabled' : ''}>${soldOut ? 'Agotado' : 'Comprar ahora'}</button>
          <a href="producto.html?id=${product.id}" class="btn btn-ghost">Ver detalles</a>
        </div>
        ${hintHtml}
      </div>
      <div class="campaign-visual">
        <div class="campaign-main-image" id="campaignMain" style="background:${product.gradient}">
          ${images[imageIndex] ? `<img src="${images[imageIndex]}" alt="${escHtml(product.name)} en ${escHtml(color.name)}" onload="this.parentNode.classList.add('has-img')" onerror="this.remove()">` : ''}
          ${onSale ? '<span class="campaign-badge">Oferta</span>' : product.isNew ? '<span class="campaign-badge" style="background:var(--sage)">Nuevo</span>' : ''}
          ${images.length > 1 ? imgArrowsCustom() : ''}
        </div>
        ${images.length > 1 ? `<div class="campaign-thumbs">${images.map((src, i) => `<button type="button" class="campaign-thumb${i === imageIndex ? ' active' : ''}" data-index="${i}" aria-label="Foto ${i + 1}"><img src="${src}" alt="" onload="this.parentNode.classList.add('has-img')" onerror="this.remove()"></button>`).join('')}</div>` : ''}
      </div>
    `;

    document.getElementById('campaignBuy').addEventListener('click', buyNow);
    hero.querySelectorAll('[data-color]').forEach(btn => {
      btn.addEventListener('click', () => {
        color = product.colors.find(c => c.name === btn.dataset.color) || color;
        imageIndex = 0;
        renderHero();
      });
    });
    hero.querySelectorAll('.campaign-main-image .img-arrow').forEach(btn => {
      btn.addEventListener('click', () => {
        imageIndex = (imageIndex + parseInt(btn.dataset.dir, 10) + images.length) % images.length;
        renderHero();
      });
    });
    hero.querySelectorAll('.campaign-thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        imageIndex = parseInt(btn.dataset.index, 10);
        renderHero();
      });
    });
  }

  // ---------- Puntos fuertes ----------
  function renderFeatures() {
    const d = product.details || {};
    const items = [
      { n: '01', t: 'Hecha para durar', p: d.tela || 'Telas de calidad que se sienten bien y se ven mejor.' },
      { n: '02', t: product.colors.length === 1 ? '1 color' : product.colors.length + ' colores', p: product.colors.map(c => c.name).join(', ') + '.' },
      { n: '03', t: 'Hecho en Aguascalientes', p: d.origen || 'Diseñado en Aguascalientes por talleres locales aliados de Dahlia.' }
    ];
    document.getElementById('campaignFeaturesGrid').innerHTML = items.map(i => `
      <div class="campaign-feature">
        <span class="campaign-feature-num">${escHtml(i.n)}</span>
        <h3>${escHtml(i.t)}</h3>
        <p>${escHtml(i.p)}</p>
      </div>
    `).join('');
  }

  // ---------- Reseñas (simuladas) ----------
  const REVIEWS = [
    { name: 'Daniela R.', city: 'Aguascalientes', stars: 5, when: 'Hace 1 semana', text: 'Me llegó rapidísimo y la calidad es mejor de lo que esperaba. La tela se siente suave y la talla quedó perfecta.' },
    { name: 'Mariana G.', city: 'Guadalajara', stars: 5, when: 'Hace 2 semanas', text: 'Ya es de mis favoritas del clóset. La uso para la oficina y para salir y siempre me hacen cumplidos.' },
    { name: 'Fernanda L.', city: 'León', stars: 4, when: 'Hace 3 semanas', text: 'Muy bonita y cómoda. Pedí una talla más por si acaso y quedó justo; revisen la guía de tallas antes de comprar.' },
    { name: 'Paola M.', city: 'Ciudad de México', stars: 5, when: 'Hace 1 mes', text: 'El color es idéntico al de las fotos, cosa que casi nunca pasa. Totalmente recomendada.' },
    { name: 'Sofía A.', city: 'Querétaro', stars: 5, when: 'Hace 1 mes', text: 'Compré dos colores. La tela no se arruga fácil y se lava sin problema. Volvería a comprar sin dudar.' },
    { name: 'Andrea V.', city: 'Zacatecas', stars: 4, when: 'Hace 2 meses', text: 'Buen precio para la calidad. El empaque venía muy cuidado y me atendieron rápido cuando tuve una duda.' }
  ];
  const DISTRIBUTION = [[5, 74], [4, 18], [3, 5], [2, 2], [1, 1]];

  function renderReviews() {
    document.getElementById('reviewSummary').innerHTML = `
      <div class="review-summary-score">${rating.toFixed(1)}</div>
      <div class="prod-stars">${renderStars(rating)}</div>
      <p class="review-summary-count">Basado en ${reviews} reseñas</p>
      ${DISTRIBUTION.map(([s, pct]) => `
        <div class="review-bar"><span>${s}</span><span class="review-bar-track"><span class="review-bar-fill" style="width:${pct}%"></span></span><span>${pct}%</span></div>
      `).join('')}
    `;
    document.getElementById('reviewGrid').innerHTML = REVIEWS.map(r => `
      <article class="review-card">
        <div class="review-card-top">
          <span class="prod-stars">${renderStars(r.stars)}</span>
          <span class="review-verified">Compra verificada</span>
        </div>
        <p>“${escHtml(r.text)}”</p>
        <div class="review-author">
          <span class="review-avatar">${escHtml(r.name.charAt(0))}</span>
          <div><strong>${escHtml(r.name)}</strong><span>${escHtml(r.city)} · ${escHtml(r.when)}</span></div>
        </div>
      </article>
    `).join('');
  }

  // ---------- Cierre con llamado a la acción ----------
  function renderFinal() {
    document.getElementById('campaignFinal').innerHTML = `
      <h2>¿Lista para estrenar tu <em>${escHtml(product.name.toLowerCase())}</em>?</h2>
      <p>Elige tu color y tu talla; si no te queda, tienes cambios y devoluciones.</p>
      <div class="campaign-ctas">
        <button type="button" class="btn btn-primary" id="campaignBuyFinal" ${soldOut ? 'disabled' : ''}>${soldOut ? 'Agotado' : 'Comprar ahora'}</button>
        <a href="catalogo.html" class="btn btn-ghost">Seguir explorando</a>
      </div>
      ${hintHtml}
    `;
    document.getElementById('campaignBuyFinal').addEventListener('click', buyNow);
  }

  renderHero();
  renderFeatures();
  renderReviews();
  renderFinal();
})();