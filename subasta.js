
(function () {
  const CFG = getAuctionConfig();
  const BIDS_KEY = AUCTION_KEYS.bids;
  const END_KEY = AUCTION_KEYS.end;
  const START_PRICE = CFG.startPrice;
  const INCREMENT = CFG.increment;
  const ITEM = { name: CFG.name, description: CFG.description, details: CFG.details, images: CFG.images };

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const $ = (id) => document.getElementById(id);
  if (!$('auctionMain')) return;

  // ---------- Guardado ----------
  function loadBids() { return getAuctionBids(CFG); }
  function saveBids(list) { saveAuctionBids(list); }
  function getEnd() { return getAuctionEnd(CFG); }

  function sessionEmail() { return isLoggedIn() ? (localStorage.getItem('dahlia_user_email') || '') : ''; }
  function bidderName() {
    const n = getDisplayName();
    return n === 'Invitada/o' ? 'Cliente Dahlia' : n;
  }
  const money = (n) => '$' + formatPrice(n);

  function timeAgo(iso) {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return 'Justo ahora';
    if (mins < 60) return `Hace ${mins} min`;
    const h = Math.floor(mins / 60);
    if (h < 24) return `Hace ${h} h`;
    const d = Math.floor(h / 24);
    return `Hace ${d} día${d === 1 ? '' : 's'}`;
  }

  // ---------- Producto ----------
  let current = 0;
  function renderGallery() {
    const src = ITEM.images[current];
    $('auctionMain').innerHTML = `
      <span class="auction-tag">Subasta</span>
      <span class="auction-ph">${esc(ITEM.name.charAt(0))}</span>
      ${ITEM.images.length > 1 ? imgArrowsCustom() : ''}
      ${src ? `<img src="${esc(src)}" alt="${esc(ITEM.name)}" onload="this.parentNode.classList.add('has-img')" onerror="this.remove()">` : ''}`;
    $('auctionMain').querySelectorAll('.img-arrow').forEach(b => b.addEventListener('click', () => {
      current = (current + parseInt(b.dataset.dir, 10) + ITEM.images.length) % ITEM.images.length;
      renderGallery();
    }));
    $('auctionThumbs').innerHTML = ITEM.images.map((s, i) =>
      `<button type="button" class="auction-thumb${i === current ? ' active' : ''}" data-i="${i}" aria-label="Foto ${i + 1}"><img src="${esc(s)}" alt="" onload="this.parentNode.classList.add('has-img')" onerror="this.remove()"></button>`).join('');
    $('auctionThumbs').querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => { current = parseInt(b.dataset.i, 10); renderGallery(); }));
  }
  $('auctionName').textContent = ITEM.name;
  $('auctionDesc').textContent = ITEM.description;
  $('auctionDetails').innerHTML = ITEM.details.map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${esc(v)}</li>`).join('');
  renderGallery();

  // ---------- Ofertas ----------
  let newestId = null;
  const topBid = (list) => list.reduce((m, b) => (!m || b.amount > m.amount ? b : m), null);
  const isMine = (b) => !!b.email && b.email === sessionEmail();

  function isOver() { return Date.now() >= getEnd(); }

  function renderBids() {
    const list = loadBids().sort((a, b) => b.amount - a.amount || new Date(b.date) - new Date(a.date));
    const top = topBid(list);
    const min = (top ? top.amount : START_PRICE) + INCREMENT;
    const over = isOver();

    $('auctionStats').innerHTML = `
      <div>
        <span class="auction-label">${top ? 'Oferta más alta' : 'Precio inicial'}</span>
        <span class="auction-big">${money(top ? top.amount : START_PRICE)}</span>
        <small class="${top && isMine(top) ? 'auction-leading' : ''}">${top ? (isMine(top) ? '¡Vas ganando!' : 'de ' + esc(top.name)) : 'Sé la primera en ofertar'}</small>
      </div>
      <div>
        <span class="auction-label">Ofertas</span>
        <span class="auction-big">${list.length}</span>
        <small>Incremento mínimo ${money(INCREMENT)}</small>
      </div>`;

    $('bidCount').textContent = `${list.length} oferta${list.length === 1 ? '' : 's'}`;
    $('bidList').innerHTML = list.map((b, i) => `
      <div class="bid-row${i === 0 ? ' is-top' : ''}${isMine(b) ? ' is-mine' : ''}${b.id === newestId ? ' is-new' : ''}">
        <span class="comment-avatar">${esc(b.name.charAt(0).toUpperCase())}</span>
        <div><span class="bid-name">${esc(b.name)}</span><span class="bid-time">${esc(timeAgo(b.date))}</span></div>
        <div>${i === 0 ? '<span class="bid-crown">Más alta</span>' : ''}<span class="bid-amount">${money(b.amount)}</span></div>
      </div>`).join('');

    const form = $('bidForm'), ended = $('auctionEnded');
    if (over) {
      form.hidden = true;
      ended.hidden = false;
      ended.innerHTML = (top
        ? `<strong>Subasta finalizada.</strong><br>${isMine(top)
            ? `¡Felicidades, ganaste con <strong>${money(top.amount)}</strong>!`
            : `Ganó ${esc(top.name)} con <strong>${money(top.amount)}</strong>.`}`
        : '<strong>Subasta finalizada</strong> sin ofertas.')
        + '<br><button type="button" class="btn btn-ghost btn-sm" id="auctionReset">Reiniciar subasta de demostración</button>';
      const reset = $('auctionReset');
      if (reset) reset.addEventListener('click', () => {
        localStorage.removeItem(END_KEY);
        localStorage.removeItem(BIDS_KEY);
        newestId = null;
        renderBids();
        tick();
      });
    } else {
      form.hidden = false;
      ended.hidden = true;
      const input = $('bidAmount');
      input.min = min;
      if (!input.value || parseInt(input.value, 10) < min) input.value = min;
      $('bidHint').textContent = `Tu oferta debe ser de al menos ${money(min)}.`;
    }
  }

  $('bidForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const err = $('bidError');
    err.hidden = true;

    if (isOver()) { renderBids(); return; }
    if (!isLoggedIn()) {
      window.location.href = 'login.html?redirect=subasta.html';
      return;
    }
    const list = loadBids();
    const top = topBid(list);
    const min = (top ? top.amount : START_PRICE) + INCREMENT;
    const amount = Math.round(parseFloat($('bidAmount').value));

    if (!amount || amount < min) {
      err.textContent = `Tu oferta debe ser de al menos ${money(min)}.`;
      err.hidden = false;
      return;
    }
    if (amount > 1000000) {
      err.textContent = 'Esa oferta es demasiado alta. Intenta con un monto menor.';
      err.hidden = false;
      return;
    }
    const bid = { id: 'b_' + Date.now(), name: bidderName(), email: sessionEmail(), amount, date: new Date().toISOString() };
    list.push(bid);
    saveBids(list);
    newestId = bid.id;
    $('bidAmount').value = '';
    renderBids();
    showToast(`Oferta registrada: ${money(amount)} MXN.`);
  });

  // ---------- Cuenta regresiva ----------
  const pad = (n) => String(n).padStart(2, '0');
  let wasOver = isOver();

  function tick() {
    const ms = Math.max(0, getEnd() - Date.now());
    const s = Math.floor(ms / 1000);
    const parts = [
      [Math.floor(s / 86400), 'Días'],
      [Math.floor(s % 86400 / 3600), 'Horas'],
      [Math.floor(s % 3600 / 60), 'Min'],
      [s % 60, 'Seg']
    ];
    $('auctionTimer').innerHTML = parts.map(([v, l]) => `<div class="auction-timer-box"><strong>${pad(v)}</strong><span>${l}</span></div>`).join('');
    $('auctionTimer').classList.toggle('is-urgent', ms > 0 && ms < 3600000);
    $('auctionTimerLabel').textContent = ms > 0 ? 'Termina en' : 'Subasta finalizada';
    const over = ms <= 0;
    if (over !== wasOver) { wasOver = over; renderBids(); }
  }

  renderBids();
  tick();
  setInterval(tick, 1000);
})();