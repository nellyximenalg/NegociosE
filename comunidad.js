// Comunidad: la clienta deja un comentario sobre un producto, con estrellas y fecha.
// Todo es simulado: se guarda en localStorage (no hay backend todavía).
(function () {
  const COMMENTS_KEY = 'dahlia_community_comments';
  const STAR_PATH = '<svg viewBox="0 0 24 24"><polygon points="12 2.5 15.1 9 22.2 10 17 14.9 18.3 22 12 18.6 5.7 22 7 14.9 1.8 10 8.9 9"/></svg>';
  const STAR_WORDS = ['', 'Malo', 'Regular', 'Bien', 'Muy bueno', 'Excelente'];

  const form = document.getElementById('commentForm');
  if (!form) return;
  const products = getStoreProducts();

  // Los datos (y los comentarios de ejemplo) viven en community-core.js.
  const nameOf = communityProductName;
  const loadComments = loadCommunityComments;
  const saveComments = saveCommunityComments;

  // ---------- Formulario ----------
  const nameField = document.getElementById('cmNameField');
  const nameInput = document.getElementById('cmName');
  const asEl = document.getElementById('cmAs');
  const productSel = document.getElementById('cmProduct');
  const starsEl = document.getElementById('cmStars');
  const starsText = document.getElementById('cmStarsText');
  const textEl = document.getElementById('cmText');
  const countEl = document.getElementById('cmCount');
  const errorEl = document.getElementById('cmError');
  const filterSel = document.getElementById('cmFilter');
  const listEl = document.getElementById('commentList');
  const totalEl = document.getElementById('cmTotal');

  // Si hay sesión, el nombre sale del correo; si no, lo escribe la persona.
  function sessionName() {
    if (!isLoggedIn()) return '';
    const email = localStorage.getItem('dahlia_user_email') || '';
    const base = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
    return base ? base.replace(/\b\w/g, ch => ch.toUpperCase()) : '';
  }
  const loggedName = sessionName();
  if (loggedName) {
    nameField.hidden = true;
    asEl.hidden = false;
    asEl.innerHTML = `Comentando como <strong>${escHtml(loggedName)}</strong>`;
  }

  const sortedProducts = products.slice().sort((a, b) => a.name.localeCompare(b.name, 'es'));
  productSel.innerHTML = '<option value="">Elige un producto</option>' +
    sortedProducts.map(p => `<option value="${p.id}">${escHtml(p.name)}</option>`).join('');

  let rating = 0;

  // Las estrellas se crean una sola vez; al pasar el mouse solo se cambian las clases
  // (si se volvieran a crear, el clic se perdería).
  starsEl.innerHTML = [1, 2, 3, 4, 5].map(n =>
    `<button type="button" role="radio" aria-checked="false" aria-label="${n} estrella${n === 1 ? '' : 's'}" data-star="${n}">${STAR_PATH}</button>`
  ).join('');
  const starBtns = Array.from(starsEl.querySelectorAll('button'));

  function paintStars(hover) {
    const shown = hover || rating;
    starBtns.forEach((btn, i) => {
      btn.classList.toggle('on', i + 1 <= shown);
      btn.setAttribute('aria-checked', String(i + 1 === rating));
    });
    starsText.textContent = shown ? `${shown} de 5 · ${STAR_WORDS[shown]}` : 'Toca una estrella';
  }
  starBtns.forEach((btn, i) => {
    const n = i + 1;
    btn.addEventListener('click', () => { rating = n; paintStars(0); });
    btn.addEventListener('mouseenter', () => paintStars(n));
    btn.addEventListener('focus', () => paintStars(n));
  });
  starsEl.addEventListener('mouseleave', () => paintStars(0));
  starsEl.addEventListener('focusout', () => paintStars(0));
  paintStars(0);

  textEl.addEventListener('input', () => { countEl.textContent = textEl.value.length; });

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }

  // ---------- Lista ----------
  let newestId = null;

  function formatDate(iso) {
    const d = new Date(iso);
    const day = d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
    const time = d.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' });
    return `${day}, ${time}`;
  }

  function renderFilter(comments) {
    const current = filterSel.value || 'all';
    const used = Array.from(new Set(comments.map(c => c.productId)));
    filterSel.innerHTML = '<option value="all">Todos los productos</option>' +
      used.map(id => {
        const c = comments.find(x => x.productId === id);
        return { id, name: c.productName };
      }).sort((a, b) => a.name.localeCompare(b.name, 'es'))
        .map(o => `<option value="${o.id}">${escHtml(o.name)}</option>`).join('');
    filterSel.value = used.some(id => String(id) === current) ? current : 'all';
  }

  function renderList() {
    const all = loadComments().sort((a, b) => new Date(b.date) - new Date(a.date));
    renderFilter(all);
    const f = filterSel.value;
    const shown = f === 'all' ? all : all.filter(c => String(c.productId) === f);
    totalEl.textContent = `${shown.length} comentario${shown.length === 1 ? '' : 's'}`;

    if (!shown.length) {
      listEl.innerHTML = '<p class="comment-empty">Aún no hay comentarios para este producto. ¡Sé la primera en opinar!</p>';
      return;
    }
    listEl.innerHTML = shown.map(c => {
      const exists = products.some(p => p.id === c.productId);
      const productHtml = exists
        ? `<a href="producto.html?id=${c.productId}">${escHtml(c.productName)}</a>`
        : escHtml(c.productName);
      return `
        <article class="comment-card${c.id === newestId ? ' is-new' : ''}">
          <div class="comment-top">
            <span class="comment-avatar">${escHtml(c.name.charAt(0).toUpperCase())}</span>
            <div class="comment-who">
              <strong>${escHtml(c.name)}</strong>
              <time datetime="${escHtml(c.date)}">${escHtml(formatDate(c.date))}</time>
            </div>
            <span class="prod-stars" aria-label="${c.stars} de 5 estrellas">${renderStars(c.stars)}</span>
          </div>
          <span class="comment-product">Sobre: ${productHtml}</span>
          <p class="comment-text">${escHtml(c.text)}</p>
          ${c.mine ? `<button type="button" class="comment-delete" data-delete="${escHtml(c.id)}">Eliminar mi comentario</button>` : ''}
        </article>
      `;
    }).join('');

    listEl.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => confirmDeleteComment(btn.dataset.delete));
    });
  }

  // Ventana de confirmación propia del sitio (igual que la del carrito).
  let confirmEl = null;

  function confirmDeleteComment(id) {
    const comment = loadComments().find(c => c.id === id);
    if (!comment) return;

    if (!confirmEl) {
      confirmEl = document.createElement('div');
      confirmEl.className = 'modal-overlay';
      confirmEl.id = 'commentConfirmModal';
      confirmEl.innerHTML = `
        <div class="modal-panel modal-panel--confirm" role="dialog" aria-modal="true" aria-labelledby="commentConfirmTitle">
          <h3 id="commentConfirmTitle">Eliminar comentario</h3>
          <p class="admin-confirm-message" id="commentConfirmMessage"></p>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" id="commentConfirmCancel">Cancelar</button>
            <button type="button" class="btn btn-primary admin-btn-danger-solid" id="commentConfirmAccept">Sí, eliminar</button>
          </div>
        </div>
      `;
      document.body.appendChild(confirmEl);
    }
    const overlay = confirmEl;
    overlay.querySelector('#commentConfirmMessage').textContent =
      `¿Seguro que quieres eliminar tu comentario sobre "${comment.productName}"? Esta acción no se puede deshacer.`;

    function close() {
      overlay.classList.remove('open');
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    // Se reemplazan los botones para no acumular listeners de aperturas anteriores.
    ['#commentConfirmCancel', '#commentConfirmAccept'].forEach(sel => {
      const old = overlay.querySelector(sel);
      old.replaceWith(old.cloneNode(true));
    });
    overlay.querySelector('#commentConfirmCancel').addEventListener('click', close);
    overlay.querySelector('#commentConfirmAccept').addEventListener('click', () => {
      close();
      saveComments(loadComments().filter(c => c.id !== id));
      renderList();
      showToast('Comentario eliminado.');
    });
    overlay.onclick = (e) => { if (e.target === overlay) close(); };
    document.addEventListener('keydown', onKey);

    overlay.classList.add('open');
    document.body.classList.add('modal-open');
  }

  filterSel.addEventListener('change', renderList);

  // ---------- Publicar ----------
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    errorEl.hidden = true;

    const name = loggedName || nameInput.value.trim();
    const productId = parseInt(productSel.value, 10);
    const text = textEl.value.trim();

    // Si falta algún dato, solo se muestra el mensaje de gracias y no se agrega nada.
    const incomplete = !name || !productId || !rating || text.length < 10;
    if (incomplete) {
      showToast('¡Gracias! Tu comentario ya está publicado.');
      return;
    }

    const list = loadComments();
    const comment = {
      id: 'c_' + Date.now(),
      productId,
      productName: nameOf(productId),
      name,
      stars: rating,
      text,
      date: new Date().toISOString(),
      email: isLoggedIn() ? (localStorage.getItem('dahlia_user_email') || '') : '',
      mine: true
    };
    list.push(comment);
    saveComments(list);
    newestId = comment.id;

    // Limpia el formulario (se conserva el nombre si es invitada).
    productSel.value = '';
    textEl.value = '';
    countEl.textContent = '0';
    rating = 0;
    paintStars(0);
    filterSel.value = 'all';
    renderList();
    showToast('¡Gracias! Tu comentario ya está publicado.');
    const first = listEl.querySelector('.comment-card');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  renderList();
})();