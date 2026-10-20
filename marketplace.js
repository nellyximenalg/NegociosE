(function () {
  const KEY = 'dahlia_marketplace';
  const MAX_PHOTOS = 3;
  const CATS = { mujer: 'Mujer', hombre: 'Hombre', accesorios: 'Accesorios' };
  const GRADIENTS = {
    mujer: 'linear-gradient(150deg,#2a1f26,#b8587d)',
    hombre: 'linear-gradient(150deg,#1f2328,#4d6a7a)',
    accesorios: 'linear-gradient(150deg,#2a251d,#c9962c)'
  };

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // ---------- Publicaciones de ejemplo (productos que NO están en el catálogo) ----------
  // Las fotos van en img/marketplace/ con estos nombres. Si falta una, se ve un fondo de color.
  const SEED = [
    { n: 1, name: 'Chamarra de piel vintage', category: 'hombre', condition: 'usado', price: 1200, size: 'L', seller: 'Carlos M.', daysAgo: 1, description: 'Chamarra de piel genuina estilo motociclista, en muy buen estado. Forro interior completo y cierres que funcionan perfecto.' },
    { n: 2, name: 'Vestido floral de verano', category: 'mujer', condition: 'usado', price: 320, size: 'M', seller: 'Daniela R.', daysAgo: 2, description: 'Vestido ligero con estampado de flores, largo a la rodilla. Usado dos veces, sin manchas ni defectos.' },
    { n: 3, name: 'Bolsa tejida a mano', category: 'accesorios', condition: 'nuevo', price: 450, size: '', seller: 'Taller Zacatecas', daysAgo: 3, description: 'Bolsa de hilo tejida a mano por artesanas de Zacatecas. Asa larga ajustable y forro interior.' },
    { n: 4, name: 'Botas vaqueras de cuero', category: 'hombre', condition: 'usado', price: 950, size: '27 MX', seller: 'Ricardo H.', daysAgo: 4, description: 'Botas de cuero con detalles bordados. Suela renovada recientemente, muy cómodas para uso diario.' },
    { n: 5, name: 'Collar de plata artesanal', category: 'accesorios', condition: 'nuevo', price: 680, size: '', seller: 'Plata y Barro', daysAgo: 6, description: 'Collar de plata 925 con dije de flor grabado a mano. Incluye cadena de 45 cm y estuche.' },
    { n: 6, name: 'Jeans de talle alto', category: 'mujer', condition: 'usado', price: 280, size: '28', seller: 'Fernanda L.', daysAgo: 8, description: 'Jeans rectos de talle alto, color azul medio. Los usé poco; me quedaron chicos y busco que alguien más los disfrute.' },
    { n: 7, name: 'Sombrero de palma', category: 'accesorios', condition: 'nuevo', price: 220, size: 'Único', seller: 'Valeria C.', daysAgo: 10, description: 'Sombrero de palma natural con cinta de algodón. Ideal para el sol, ala de 8 cm.' },
    { n: 8, name: 'Camisa de lino', category: 'hombre', condition: 'nuevo', price: 390, size: 'M', seller: 'Jorge T.', daysAgo: 12, description: 'Camisa de lino color arena, nunca usada, con etiqueta. Fresca y perfecta para el calor.' }
  ].map(s => ({
    id: 'mk_seed_' + s.n,
    name: s.name, category: s.category, condition: s.condition, price: s.price, size: s.size,
    description: s.description,
    images: ['img/marketplace/mk-' + s.n + '-1.png'],
    seller: s.seller, sellerEmail: '',
    date: new Date(Date.now() - s.daysAgo * 86400000).toISOString()
  }));

  // ---------- Guardado ----------
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw === null) {
        localStorage.setItem(KEY, JSON.stringify(SEED));
        return SEED.map(x => Object.assign({}, x));
      }
      const list = JSON.parse(raw);
      if (!Array.isArray(list)) return [];
      // Los productos de ejemplo siempre toman sus fotos del código (así, si cambias
      // el nombre o la extensión de la imagen, se actualiza aunque ya estén guardados).
      list.forEach(item => {
        const seed = SEED.find(x => x.id === item.id);
        if (seed) item.images = seed.images.slice();
      });
      return list;
    } catch (e) { return []; }
  }

  function save(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      showToast('No se pudo guardar: las fotos pesan demasiado. Prueba con menos o más ligeras.');
      return false;
    }
  }

  function sessionEmail() { return isLoggedIn() ? (localStorage.getItem('dahlia_user_email') || '') : ''; }
  function sellerName() {
    const n = getDisplayName();
    return n === 'Invitada/o' ? 'Cliente Dahlia' : n;
  }
  function isMine(item) { const e = sessionEmail(); return !!e && item.sellerEmail === e; }
  function changed() { document.dispatchEvent(new CustomEvent('mk:changed')); }

  function timeAgo(iso) {
    const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (days <= 0) return 'Hoy';
    if (days === 1) return 'Hace 1 día';
    if (days < 7) return `Hace ${days} días`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `Hace ${weeks} semana${weeks === 1 ? '' : 's'}`;
    return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function imageHtml(item, index) {
    const src = (item.images || [])[index || 0];
    return `<div class="mk-img" style="background:${GRADIENTS[item.category] || GRADIENTS.mujer}">
      <span class="mk-img-ph">${esc(item.name.charAt(0).toUpperCase())}</span>
      ${src ? `<img src="${esc(src)}" alt="${esc(item.name)}" loading="lazy" onerror="this.remove()">` : ''}
    </div>`;
  }

  function requireLogin() {
    if (isLoggedIn()) return true;
    const page = window.location.pathname.split('/').pop() || 'marketplace.html';
    window.location.href = 'login.html?redirect=' + encodeURIComponent(page.startsWith('perfil') ? 'perfil.html' : 'marketplace.html?publicar=1');
    return false;
  }

  // ---------- Fotos: se reducen para que quepan en el almacenamiento del navegador ----------
  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const max = 800;
          const scale = Math.min(1, max / Math.max(img.width, img.height));
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

  // ---------- Formulario "Agrega tu producto" (mismo estilo que el del admin) ----------
  let formEl = null;
  let photos = [];
  let editingId = null;

  function buildForm() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'mkFormModal';
    overlay.innerHTML = `
      <div class="modal-panel modal-panel--wide" role="dialog" aria-modal="true" aria-labelledby="mkFormTitle">
        <button type="button" class="modal-close" aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>
        </button>
        <h3 id="mkFormTitle">Agrega tu producto</h3>
        <form id="mkForm" novalidate>
          <div class="login-field">
            <label for="mfName">Nombre</label>
            <input type="text" id="mfName" maxlength="60" placeholder="Ej. Chamarra de mezclilla">
          </div>
          <div class="admin-form-row">
            <div class="login-field">
              <label for="mfCategory">Categoría</label>
              <select id="mfCategory">
                <option value="mujer">Mujer</option>
                <option value="hombre">Hombre</option>
                <option value="accesorios">Accesorios</option>
              </select>
            </div>
            <div class="login-field">
              <label for="mfCondition">Condición</label>
              <select id="mfCondition">
                <option value="nuevo">Nuevo</option>
                <option value="usado">Usado</option>
              </select>
            </div>
          </div>
          <div class="admin-form-row">
            <div class="login-field">
              <label for="mfPrice">Precio (MXN)</label>
              <input type="number" id="mfPrice" min="1" placeholder="Ej. 350">
            </div>
            <div class="login-field">
              <label for="mfSize">Talla (opcional)</label>
              <input type="text" id="mfSize" maxlength="12" placeholder="Ej. M, 28, Única">
            </div>
          </div>
          <div class="login-field">
            <label for="mfDesc">Descripción</label>
            <textarea id="mfDesc" rows="3" maxlength="400" placeholder="Estado, medidas, material, motivo de venta..."></textarea>
          </div>
          <div class="login-field">
            <label>Fotos (hasta ${MAX_PHOTOS})</label>
            <div class="mk-photos" id="mfPhotos"></div>
            <input type="file" id="mfFile" accept="image/*" multiple hidden>
          </div>
          <p class="community-error" id="mfError" role="alert" hidden></p>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" id="mfCancel">Cancelar</button>
            <button type="submit" class="btn btn-primary" id="mfSubmit">Publicar</button>
          </div>
        </form>
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
    overlay.querySelector('#mfCancel').addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });

    const fileInput = overlay.querySelector('#mfFile');
    fileInput.addEventListener('change', async () => {
      const files = Array.from(fileInput.files).slice(0, MAX_PHOTOS - photos.length);
      for (const f of files) {
        try { photos.push(await compressImage(f)); } catch (e) { showToast('No se pudo leer una de las fotos.'); }
      }
      fileInput.value = '';
      renderPhotos();
    });

    overlay.querySelector('#mkForm').addEventListener('submit', submitForm);
    return overlay;
  }

  function renderPhotos() {
    const wrap = formEl.querySelector('#mfPhotos');
    wrap.innerHTML = photos.map((src, i) => `
      <div class="mk-photo">
        <img src="${esc(src)}" alt="Foto ${i + 1}" onerror="this.style.opacity=0.2">
        <button type="button" class="mk-photo-remove" data-remove="${i}" aria-label="Quitar foto ${i + 1}">×</button>
      </div>
    `).join('') + (photos.length < MAX_PHOTOS
      ? `<button type="button" class="mk-photo-add" id="mfAddPhoto"><span>+</span>Agregar foto</button>` : '');
    wrap.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => {
      photos.splice(parseInt(b.dataset.remove, 10), 1);
      renderPhotos();
    }));
    const add = wrap.querySelector('#mfAddPhoto');
    if (add) add.addEventListener('click', () => formEl.querySelector('#mfFile').click());
  }

  function openForm(editId) {
    if (!requireLogin()) return;
    formEl = formEl || buildForm();
    const q = (s) => formEl.querySelector(s);
    const item = editId ? load().find(x => x.id === editId) : null;
    if (editId && (!item || !isMine(item))) return;

    editingId = item ? item.id : null;
    photos = item ? (item.images || []).slice() : [];
    q('#mkFormTitle').textContent = item ? 'Editar publicación' : 'Agrega tu producto';
    q('#mfSubmit').textContent = item ? 'Guardar cambios' : 'Publicar';
    q('#mfName').value = item ? item.name : '';
    q('#mfCategory').value = item ? item.category : 'mujer';
    q('#mfCondition').value = item ? item.condition : 'nuevo';
    q('#mfPrice').value = item ? item.price : '';
    q('#mfSize').value = item ? (item.size || '') : '';
    q('#mfDesc').value = item ? item.description : '';
    q('#mfError').hidden = true;
    renderPhotos();

    formEl.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function submitForm(event) {
    event.preventDefault();
    const q = (s) => formEl.querySelector(s);
    const name = q('#mfName').value.trim();
    const price = parseFloat(q('#mfPrice').value);
    const description = q('#mfDesc').value.trim();

    // Si falta algún dato, solo se muestra el mensaje de éxito y no se guarda nada.
    if (!name || !price || price <= 0 || description.length < 10 || !photos.length) {
      q('#mfError').hidden = true;
      showToast(editingId ? 'Cambios guardados.' : 'Publicado correctamente.');
      return;
    }
    q('#mfError').hidden = true;

    const list = load();
    const data = {
      name, price: Math.round(price), description,
      category: q('#mfCategory').value,
      condition: q('#mfCondition').value,
      size: q('#mfSize').value.trim(),
      images: photos.slice()
    };

    if (editingId) {
      const i = list.findIndex(x => x.id === editingId);
      if (i < 0) return;
      list[i] = Object.assign({}, list[i], data);
    } else {
      list.push(Object.assign({
        id: 'mk_' + Date.now(),
        seller: sellerName(),
        sellerEmail: sessionEmail(),
        date: new Date().toISOString()
      }, data));
    }
    if (!save(list)) return;

    formEl._close();
    changed();
    showToast(editingId
      ? 'Cambios guardados.'
      : '¡Publicado correctamente! Ya aparece en el Marketplace y en Mis publicaciones de tu perfil.');
  }

  // ---------- Confirmar eliminación ----------
  let confirmEl = null;
  function confirmDelete(id) {
    const item = load().find(x => x.id === id);
    if (!item || !isMine(item)) return;
    if (!confirmEl) {
      confirmEl = document.createElement('div');
      confirmEl.className = 'modal-overlay';
      confirmEl.innerHTML = `
        <div class="modal-panel modal-panel--confirm" role="dialog" aria-modal="true" aria-labelledby="mkConfirmTitle">
          <h3 id="mkConfirmTitle">Eliminar publicación</h3>
          <p class="admin-confirm-message" id="mkConfirmMsg"></p>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" data-act="cancel">Cancelar</button>
            <button type="button" class="btn btn-primary admin-btn-danger-solid" data-act="ok">Sí, eliminar</button>
          </div>
        </div>`;
      document.body.appendChild(confirmEl);
    }
    const overlay = confirmEl;
    overlay.querySelector('#mkConfirmMsg').textContent = `¿Seguro que quieres eliminar "${item.name}"? Esta acción no se puede deshacer.`;
    const close = () => { overlay.classList.remove('open'); document.body.classList.remove('modal-open'); document.removeEventListener('keydown', onKey); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    overlay.querySelector('[data-act=cancel]').onclick = close;
    overlay.querySelector('[data-act=ok]').onclick = () => {
      close();
      save(load().filter(x => x.id !== id));
      changed();
      showToast('Publicación eliminada.');
    };
    overlay.onclick = (e) => { if (e.target === overlay) close(); };
    document.addEventListener('keydown', onKey);
    overlay.classList.add('open');
    document.body.classList.add('modal-open');
  }

  // ======================================================================
  // Página Marketplace
  // ======================================================================
  const grid = document.getElementById('mkGrid');
  if (grid) {
    let category = 'todos';
    const filters = document.getElementById('mkFilters');
    const countEl = document.getElementById('mkCount');

    function renderPage() {
      const all = load().sort((a, b) => new Date(b.date) - new Date(a.date));
      const list = category === 'todos' ? all : all.filter(x => x.category === category);

      filters.innerHTML = [['todos', 'Todos']].concat(Object.entries(CATS)).map(([k, label]) =>
        `<button type="button" class="mk-chip${k === category ? ' active' : ''}" data-cat="${k}">${label}</button>`).join('');
      filters.querySelectorAll('[data-cat]').forEach(b => b.addEventListener('click', () => { category = b.dataset.cat; renderPage(); }));
      countEl.textContent = `${list.length} ${list.length === 1 ? 'publicación' : 'publicaciones'}`;

      if (!list.length) {
        grid.innerHTML = '<p class="comment-empty">Todavía no hay publicaciones en esta categoría. ¡Sé la primera en publicar!</p>';
        return;
      }
      grid.innerHTML = list.map(x => `
        <article class="mk-card" data-open="${esc(x.id)}" tabindex="0" role="button" aria-label="Ver ${esc(x.name)}">
          ${imageHtml(x)}
          <span class="mk-badge mk-badge--${x.condition === 'nuevo' ? 'new' : 'used'}">${x.condition === 'nuevo' ? 'Nuevo' : 'Usado'}</span>
          ${isMine(x) ? '<span class="mk-badge mk-badge--mine">Tuyo</span>' : ''}
          <div class="mk-card-body">
            <p class="mk-card-cat">${esc(CATS[x.category] || x.category)}${x.size ? ' · Talla ' + esc(x.size) : ''}</p>
            <h3>${esc(x.name)}</h3>
            <p class="mk-card-price">$${formatPrice(x.price)} MXN</p>
            <p class="mk-card-seller">${esc(x.seller)} · ${esc(timeAgo(x.date))}</p>
          </div>
        </article>
      `).join('');
      grid.querySelectorAll('[data-open]').forEach(card => {
        const open = () => openDetail(card.dataset.open);
        card.addEventListener('click', open);
        card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
      });
    }

    // ----- Detalle de una publicación -----
    let detailEl = null;
    function openDetail(id) {
      const x = load().find(i => i.id === id);
      if (!x) return;
      if (!detailEl) {
        detailEl = document.createElement('div');
        detailEl.className = 'modal-overlay';
        detailEl.innerHTML = `
          <div class="modal-panel modal-panel--wide" role="dialog" aria-modal="true">
            <button type="button" class="modal-close" aria-label="Cerrar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>
            </button>
            <div id="mkDetailBody"></div>
          </div>`;
        document.body.appendChild(detailEl);
        const close = () => { detailEl.classList.remove('open'); document.body.classList.remove('modal-open'); };
        detailEl._close = close;
        detailEl.addEventListener('click', (e) => { if (e.target === detailEl) close(); });
        detailEl.querySelector('.modal-close').addEventListener('click', close);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && detailEl.classList.contains('open')) close(); });
      }
      let current = 0;
      const body = detailEl.querySelector('#mkDetailBody');
      const paint = () => {
        const imgs = x.images || [];
        body.innerHTML = `
          <div class="mk-detail">
            <div>
              <div class="mk-detail-main">${imageHtml(x, current)}</div>
              ${imgs.length > 1 ? `<div class="mk-detail-thumbs">${imgs.map((s, i) => `<button type="button" class="campaign-thumb${i === current ? ' active' : ''}" data-i="${i}" aria-label="Foto ${i + 1}"><img src="${esc(s)}" alt="" onerror="this.remove()"></button>`).join('')}</div>` : ''}
            </div>
            <div class="mk-detail-info">
              <p class="mk-card-cat">${esc(CATS[x.category] || x.category)} · ${x.condition === 'nuevo' ? 'Nuevo' : 'Usado'}${x.size ? ' · Talla ' + esc(x.size) : ''}</p>
              <h3>${esc(x.name)}</h3>
              <p class="mk-card-price mk-detail-price">$${formatPrice(x.price)} MXN</p>
              <p class="mk-detail-desc">${esc(x.description)}</p>
              <p class="mk-card-seller">Publicado por <strong>${esc(x.seller)}</strong> · ${esc(timeAgo(x.date))}</p>
              ${isMine(x)
                ? '<p class="mk-detail-mine">Esta es tu publicación. Puedes editarla o eliminarla desde tu perfil, en Mis publicaciones.</p>'
                : '<button type="button" class="btn btn-primary" id="mkContact">Contactar al vendedor</button>'}
            </div>
          </div>`;
        body.querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => { current = parseInt(b.dataset.i, 10); paint(); }));
        const contact = body.querySelector('#mkContact');
        if (contact) contact.addEventListener('click', () => {
          if (!isLoggedIn()) { requireLogin(); return; }
          detailEl._close();
          showToast(`Mensaje enviado a ${x.seller}. Te responderá pronto.`);
        });
      };
      paint();
      detailEl.classList.add('open');
      document.body.classList.add('modal-open');
    }

    document.getElementById('mkAddBtn').addEventListener('click', () => openForm(null));
    document.addEventListener('mk:changed', renderPage);
    renderPage();
    if (new URLSearchParams(window.location.search).get('publicar') === '1' && isLoggedIn()) openForm(null);
  }

  // ======================================================================
  // Perfil: Mis publicaciones
  // ======================================================================
  const mine = document.getElementById('myListings');
  if (mine) {
    function renderMine() {
      const list = load().filter(isMine).sort((a, b) => new Date(b.date) - new Date(a.date));
      if (!list.length) {
        mine.innerHTML = `
          <div class="account-card">
            <p class="placeholder-text">Todavía no has publicado ningún producto.</p>
            <button type="button" class="btn btn-primary" data-add>Publicar mi primer producto</button>
          </div>`;
      } else {
        mine.innerHTML = list.map(x => `
          <div class="mk-row">
            <div class="mk-row-thumb">${imageHtml(x)}</div>
            <div class="mk-row-info">
              <h3>${esc(x.name)}</h3>
              <p class="mk-card-price">$${formatPrice(x.price)} MXN</p>
              <p class="mk-card-seller">${esc(CATS[x.category] || x.category)} · ${x.condition === 'nuevo' ? 'Nuevo' : 'Usado'}${x.size ? ' · Talla ' + esc(x.size) : ''} · Publicado: ${esc(timeAgo(x.date))}</p>
            </div>
            <div class="mk-row-actions">
              <button type="button" class="btn btn-ghost btn-sm" data-edit="${esc(x.id)}">Editar</button>
              <button type="button" class="btn btn-ghost btn-sm admin-btn-danger" data-del="${esc(x.id)}">Eliminar</button>
            </div>
          </div>
        `).join('');
      }
      mine.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => openForm(null)));
      mine.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openForm(b.dataset.edit)));
      mine.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => confirmDelete(b.dataset.del)));
    }
    const addBtn = document.getElementById('myListingAdd');
    if (addBtn) addBtn.addEventListener('click', () => openForm(null));
    document.addEventListener('mk:changed', renderMine);
    renderMine();
  }
})();