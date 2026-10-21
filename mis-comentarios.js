// Perfil > Mis comentarios: lista los comentarios que la persona publicó en Comunidad.
(function () {
  const KEY = 'dahlia_community_comments';
  const box = document.getElementById('myComments');
  if (!box) return;

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  function load() {
    try {
      const list = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(list) ? list : [];
    } catch (e) { return []; }
  }

  // Son "míos" los comentarios con el correo de esta cuenta; los que se publicaron
  // antes de guardar el correo (o sin sesión) se cuentan si se publicaron desde este navegador.
  function isMine(c) {
    const email = isLoggedIn() ? (localStorage.getItem('dahlia_user_email') || '') : '';
    if (c.email) return !!email && c.email === email;
    return !!c.mine;
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return `${d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' })}`;
  }

  function render() {
    const mine = load().filter(isMine).sort((a, b) => new Date(b.date) - new Date(a.date));
    if (!mine.length) {
      box.innerHTML = `
        <div class="account-card">
          <p class="placeholder-text">Todavía no has comentado ningún producto.</p>
          <a href="comunidad.html" class="btn btn-primary">Dejar mi primer comentario</a>
        </div>`;
      return;
    }
    box.innerHTML = mine.map(c => `
      <article class="comment-card">
        <div class="comment-top">
          <span class="comment-avatar">${esc(c.name.charAt(0).toUpperCase())}</span>
          <div class="comment-who">
            <strong>${esc(c.name)}</strong>
            <time datetime="${esc(c.date)}">${esc(formatDate(c.date))}</time>
          </div>
          <span class="prod-stars" aria-label="${c.stars} de 5 estrellas">${renderStars(c.stars)}</span>
        </div>
        <span class="comment-product">Sobre: <a href="producto.html?id=${c.productId}">${esc(c.productName)}</a></span>
        <p class="comment-text">${esc(c.text)}</p>
        <div class="my-comment-actions">
          <button type="button" class="comment-delete" data-delete="${esc(c.id)}">Eliminar mi comentario</button>
        </div>
      </article>
    `).join('');
    box.querySelectorAll('[data-delete]').forEach(b => b.addEventListener('click', () => confirmDelete(b.dataset.delete)));
  }

  // Ventana de confirmación (igual que en Comunidad)
  let confirmEl = null;
  function confirmDelete(id) {
    const comment = load().find(c => c.id === id);
    if (!comment) return;
    if (!confirmEl) {
      confirmEl = document.createElement('div');
      confirmEl.className = 'modal-overlay';
      confirmEl.innerHTML = `
        <div class="modal-panel modal-panel--confirm" role="dialog" aria-modal="true" aria-labelledby="myCommentConfirmTitle">
          <h3 id="myCommentConfirmTitle">Eliminar comentario</h3>
          <p class="admin-confirm-message" id="myCommentConfirmMsg"></p>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" data-act="cancel">Cancelar</button>
            <button type="button" class="btn btn-primary admin-btn-danger-solid" data-act="ok">Sí, eliminar</button>
          </div>
        </div>`;
      document.body.appendChild(confirmEl);
    }
    const overlay = confirmEl;
    overlay.querySelector('#myCommentConfirmMsg').textContent =
      `¿Seguro que quieres eliminar tu comentario sobre "${comment.productName}"? Esta acción no se puede deshacer.`;
    const close = () => { overlay.classList.remove('open'); document.body.classList.remove('modal-open'); document.removeEventListener('keydown', onKey); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    overlay.querySelector('[data-act=cancel]').onclick = close;
    overlay.querySelector('[data-act=ok]').onclick = () => {
      close();
      try { localStorage.setItem(KEY, JSON.stringify(load().filter(c => c.id !== id))); } catch (e) { /* sin espacio */ }
      render();
      showToast('Comentario eliminado.');
    };
    overlay.onclick = (e) => { if (e.target === overlay) close(); };
    document.addEventListener('keydown', onKey);
    overlay.classList.add('open');
    document.body.classList.add('modal-open');
  }

  render();
})();