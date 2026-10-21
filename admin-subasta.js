// Panel de administrador > Subasta: ver el estado, editar el producto y administrar las ofertas.
// Usa los datos compartidos de auction-core.js (la misma subasta que ven las clientas).
(function () {
  const root = document.getElementById('adminAuctionRoot');
  if (!root || typeof isAdmin !== 'function' || !isAdmin()) return;

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const money = (n) => '$' + formatPrice(n);
  const MAX_PHOTOS = 3;
  let photos = [];

  // ---------- Ventana de confirmación ----------
  let confirmEl = null;
  function askConfirm(title, message, okLabel, onOk) {
    if (!confirmEl) {
      confirmEl = document.createElement('div');
      confirmEl.className = 'modal-overlay';
      confirmEl.innerHTML = `
        <div class="modal-panel modal-panel--confirm" role="dialog" aria-modal="true" aria-labelledby="asConfirmTitle">
          <h3 id="asConfirmTitle"></h3>
          <p class="admin-confirm-message" id="asConfirmMsg"></p>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" data-act="cancel">Cancelar</button>
            <button type="button" class="btn btn-primary" data-act="ok"></button>
          </div>
        </div>`;
      document.body.appendChild(confirmEl);
    }
    const o = confirmEl;
    o.querySelector('#asConfirmTitle').textContent = title;
    o.querySelector('#asConfirmMsg').textContent = message;
    o.querySelector('[data-act=ok]').textContent = okLabel;
    const close = () => { o.classList.remove('open'); document.body.classList.remove('modal-open'); document.removeEventListener('keydown', onKey); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    o.querySelector('[data-act=cancel]').onclick = close;
    o.querySelector('[data-act=ok]').onclick = () => { close(); onOk(); };
    o.onclick = (e) => { if (e.target === o) close(); };
    document.addEventListener('keydown', onKey);
    o.classList.add('open');
    document.body.classList.add('modal-open');
  }

  // ---------- Fotos ----------
  function compressImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const scale = Math.min(1, 800 / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.78));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // ---------- Estado ----------
  function formatDate(iso) {
    const d = new Date(iso);
    return `${d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' })}`;
  }
  function remainingText(ms) {
    if (ms <= 0) return 'Finalizada';
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
    return `${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(sec).padStart(2, '0')}s`;
  }

  let wasOver = null;

  function renderStatus() {
    const cfg = getAuctionConfig();
    const bids = getAuctionBids(cfg).slice().sort((a, b) => b.amount - a.amount || new Date(b.date) - new Date(a.date));
    const top = bids[0] || null;
    const ms = getAuctionEnd(cfg) - Date.now();
    const over = ms <= 0;
    wasOver = over;

    const box = document.getElementById('asStatus');
    box.innerHTML = `
      <div class="as-head">
        <div>
          <h2>${esc(cfg.name)}</h2>
          <p class="admin-hint">Esto es lo que ven las clientas en la pantalla de Subasta.</p>
        </div>
        <span class="as-badge ${over ? 'as-badge--ended' : 'as-badge--live'}">${over ? 'Finalizada' : 'Activa'}</span>
      </div>

      <div class="admin-stats as-stats">
        <div class="admin-stat-card"><span class="admin-stat-value as-time" id="asTime">${remainingText(ms)}</span><span class="admin-stat-label">${over ? 'Estado' : 'Tiempo restante'}</span></div>
        <div class="admin-stat-card"><span class="admin-stat-value">${money(top ? top.amount : cfg.startPrice)}</span><span class="admin-stat-label">${top ? 'Oferta más alta' : 'Precio inicial'}</span></div>
        <div class="admin-stat-card"><span class="admin-stat-value">${bids.length}</span><span class="admin-stat-label">Ofertas</span></div>
        <div class="admin-stat-card"><span class="admin-stat-value">${money(cfg.startPrice)}</span><span class="admin-stat-label">Precio inicial</span></div>
        <div class="admin-stat-card"><span class="admin-stat-value">${money(cfg.increment)}</span><span class="admin-stat-label">Incremento mínimo</span></div>
      </div>

      ${top ? `<p class="as-winner">${over ? 'Ganó' : 'Va ganando'}: <strong>${esc(top.name)}</strong> con <strong>${money(top.amount)}</strong>.</p>` : '<p class="as-winner">Todavía no hay ofertas.</p>'}

      <div class="as-actions">
        <button type="button" class="btn btn-ghost btn-sm" id="asEnd" ${over ? 'disabled' : ''}>Finalizar ahora</button>
        <button type="button" class="btn btn-ghost btn-sm" id="asExtend">Extender 24 h</button>
        <button type="button" class="btn btn-ghost btn-sm" id="asRestartSample">Reiniciar con ofertas de ejemplo</button>
        <button type="button" class="btn btn-ghost btn-sm" id="asRestartEmpty">Reiniciar sin ofertas</button>
      </div>

      <h3 class="as-subtitle">Ofertas recibidas</h3>
      ${bids.length ? `
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead><tr><th>#</th><th>Persona</th><th>Oferta</th><th>Fecha</th><th></th></tr></thead>
          <tbody>
            ${bids.map((b, i) => `
              <tr>
                <td>${i === 0 ? 'Más alta' : i + 1}</td>
                <td>${esc(b.name)}${b.email ? ` <span class="as-email">${esc(b.email)}</span>` : ''}</td>
                <td>${money(b.amount)}</td>
                <td>${esc(formatDate(b.date))}</td>
                <td class="admin-table-actions"><button type="button" class="btn btn-ghost btn-sm admin-btn-danger" data-del-bid="${esc(b.id)}">Eliminar</button></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>` : '<p class="admin-hint">Sin ofertas por ahora.</p>'}
    `;

    box.querySelector('#asEnd').addEventListener('click', () => {
      askConfirm('Finalizar subasta', 'La subasta se cerrará ahora y las clientas ya no podrán ofertar. ¿Continuar?', 'Sí, finalizar', () => {
        setAuctionEnd(Date.now() - 1000);
        renderStatus();
        showToast('Subasta finalizada.');
      });
    });
    box.querySelector('#asExtend').addEventListener('click', () => {
      setAuctionEnd(Math.max(Date.now(), getAuctionEnd(cfg)) + 24 * 3600000);
      renderStatus();
      showToast('Se extendió la subasta 24 horas.');
    });
    box.querySelector('#asRestartSample').addEventListener('click', () => {
      askConfirm('Reiniciar subasta', 'Empieza de nuevo con el tiempo completo y se reemplazan las ofertas actuales por las de ejemplo. ¿Continuar?', 'Sí, reiniciar', () => {
        restartAuction(getAuctionConfig(), true);
        renderStatus();
        showToast('Subasta reiniciada con ofertas de ejemplo.');
      });
    });
    box.querySelector('#asRestartEmpty').addEventListener('click', () => {
      askConfirm('Reiniciar subasta', 'Empieza de nuevo con el tiempo completo y se borran todas las ofertas. ¿Continuar?', 'Sí, reiniciar', () => {
        restartAuction(getAuctionConfig(), false);
        renderStatus();
        showToast('Subasta reiniciada sin ofertas.');
      });
    });
    box.querySelectorAll('[data-del-bid]').forEach(btn => btn.addEventListener('click', () => {
      const bid = bids.find(b => b.id === btn.dataset.delBid);
      if (!bid) return;
      askConfirm('Eliminar oferta', `¿Eliminar la oferta de ${bid.name} por ${money(bid.amount)}?`, 'Sí, eliminar', () => {
        saveAuctionBids(getAuctionBids(cfg).filter(b => b.id !== bid.id));
        renderStatus();
        showToast('Oferta eliminada.');
      });
    }));
  }

  // ---------- Formulario del producto ----------
  function renderPhotos() {
    const wrap = document.getElementById('asPhotos');
    wrap.innerHTML = photos.map((src, i) => `
      <div class="mk-photo">
        <img src="${esc(src)}" alt="Foto ${i + 1}" onerror="this.style.opacity=0.2">
        <button type="button" class="mk-photo-remove" data-remove="${i}" aria-label="Quitar foto ${i + 1}">×</button>
      </div>`).join('') +
      (photos.length < MAX_PHOTOS ? '<button type="button" class="mk-photo-add" id="asAddPhoto"><span>+</span>Agregar foto</button>' : '');
    wrap.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => {
      photos.splice(parseInt(b.dataset.remove, 10), 1);
      renderPhotos();
    }));
    const add = wrap.querySelector('#asAddPhoto');
    if (add) add.addEventListener('click', () => document.getElementById('asFile').click());
  }

  function fillForm() {
    const cfg = getAuctionConfig();
    document.getElementById('asName').value = cfg.name;
    document.getElementById('asDesc').value = cfg.description;
    document.getElementById('asDetails').value = cfg.details.map(([k, v]) => `${k}: ${v}`).join('\n');
    document.getElementById('asStart').value = cfg.startPrice;
    document.getElementById('asInc').value = cfg.increment;
    document.getElementById('asHours').value = cfg.durationHours;
    photos = cfg.images.slice();
    renderPhotos();
  }

  function buildForm() {
    document.getElementById('asFormBox').innerHTML = `
      <h3 class="as-subtitle">Producto de la subasta</h3>
      <form id="asForm" class="as-form" novalidate>
        <div class="login-field">
          <label for="asName">Nombre del producto</label>
          <input type="text" id="asName" maxlength="70">
        </div>
        <div class="login-field">
          <label for="asDesc">Descripción</label>
          <textarea id="asDesc" rows="4" maxlength="600"></textarea>
        </div>
        <div class="login-field">
          <label for="asDetails">Detalles (uno por línea, con el formato "Etiqueta: valor")</label>
          <textarea id="asDetails" rows="5" placeholder="Color: Marfil&#10;Material: Gasa con encaje"></textarea>
        </div>
        <div class="login-field">
          <label>Fotos (hasta ${MAX_PHOTOS}; la primera es la principal)</label>
          <div class="mk-photos" id="asPhotos"></div>
          <input type="file" id="asFile" accept="image/*" multiple hidden>
        </div>
        <div class="admin-form-row admin-form-row--3">
          <div class="login-field">
            <label for="asStart">Precio inicial ($)</label>
            <input type="number" id="asStart" min="1">
          </div>
          <div class="login-field">
            <label for="asInc">Incremento mínimo ($)</label>
            <input type="number" id="asInc" min="1">
          </div>
          <div class="login-field">
            <label for="asHours">Duración al reiniciar (horas)</label>
            <input type="number" id="asHours" min="1">
          </div>
        </div>
        <p class="admin-hint">Los cambios se ven de inmediato en la pantalla de Subasta. Si cambias de producto, usa "Reiniciar" para empezar con el tiempo completo y sin las ofertas del producto anterior.</p>
        <p class="community-error" id="asError" role="alert" hidden></p>
        <button type="submit" class="btn btn-primary">Guardar cambios</button>
      </form>`;

    const fileInput = document.getElementById('asFile');
    fileInput.addEventListener('change', async () => {
      for (const f of Array.from(fileInput.files).slice(0, MAX_PHOTOS - photos.length)) {
        try { photos.push(await compressImageFile(f)); } catch (e) { showToast('No se pudo leer una de las fotos.'); }
      }
      fileInput.value = '';
      renderPhotos();
    });

    document.getElementById('asForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const err = document.getElementById('asError');
      const fail = (m) => { err.textContent = m; err.hidden = false; };
      err.hidden = true;

      const name = document.getElementById('asName').value.trim();
      const description = document.getElementById('asDesc').value.trim();
      const startPrice = Math.round(parseFloat(document.getElementById('asStart').value));
      const increment = Math.round(parseFloat(document.getElementById('asInc').value));
      const durationHours = parseFloat(document.getElementById('asHours').value);

      if (!name) return fail('Escribe el nombre del producto.');
      if (description.length < 10) return fail('Escribe una descripción de al menos 10 caracteres.');
      if (!photos.length) return fail('Agrega al menos una foto.');
      if (!startPrice || startPrice < 1) return fail('El precio inicial debe ser mayor a 0.');
      if (!increment || increment < 1) return fail('El incremento mínimo debe ser mayor a 0.');
      if (!durationHours || durationHours < 1) return fail('La duración debe ser de al menos 1 hora.');

      const details = document.getElementById('asDetails').value.split('\n')
        .map(l => l.trim()).filter(Boolean)
        .map(l => {
          const i = l.indexOf(':');
          return i > 0 ? [l.slice(0, i).trim(), l.slice(i + 1).trim()] : [l, ''];
        });

      const ok = saveAuctionConfig({ name, description, details, images: photos.slice(), startPrice, increment, durationHours });
      if (!ok) { fail('No se pudo guardar: las fotos pesan demasiado. Usa menos fotos o más ligeras.'); return; }
      renderStatus();
      showToast('Cambios guardados. Ya se ven en la subasta.');
    });

    fillForm();
  }

  root.innerHTML = `
    <div class="admin-view-head"><h1>Subasta</h1></div>
    <div id="asStatus"></div>
    <div id="asFormBox"></div>`;
  renderStatus();
  buildForm();

  // Cuenta regresiva en vivo (sin repintar todo el panel).
  setInterval(() => {
    const el = document.getElementById('asTime');
    if (!el) return;
    const ms = getAuctionEnd(getAuctionConfig()) - Date.now();
    const over = ms <= 0;
    if (over !== wasOver) { renderStatus(); return; }
    el.textContent = remainingText(ms);
  }, 1000);
})();