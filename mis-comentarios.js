
(function () {
  const reviewsBox = document.getElementById('myReviews');
  const postsBox = document.getElementById('myPosts');
  if ((!reviewsBox && !postsBox) || typeof loadCommunityComments !== 'function') return;

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  function formatDate(iso) {
    const d = new Date(iso);
    return `${d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' })}`;
  }

  // Botones Editar / Eliminar con el mismo estilo que en "Mis publicaciones".
  function actionButtons(editAttr, deleteAttr, id) {
    return `<div class="comment-actions comment-actions--btns">
      <button type="button" class="btn btn-ghost btn-sm" ${editAttr}="${esc(id)}">Editar</button>
      <button type="button" class="btn btn-ghost btn-sm admin-btn-danger" ${deleteAttr}="${esc(id)}">Eliminar</button>
    </div>`;
  }

  function renderReviews() {
    if (!reviewsBox) return;
    const mine = loadCommunityComments().filter(isMyComment).sort((a, b) => new Date(b.date) - new Date(a.date));
    if (!mine.length) {
      reviewsBox.innerHTML = `
        <div class="account-card">
          <p class="placeholder-text">Todavía no has escrito ninguna reseña.</p>
          <a href="comunidad.html" class="btn btn-primary">Escribir mi primera reseña</a>
        </div>`;
      return;
    }
    reviewsBox.innerHTML = mine.map(c => `
      <article class="comment-card">
        <div class="comment-top">
          <span class="comment-avatar">${esc(c.name.charAt(0).toUpperCase())}</span>
          <div class="comment-who">
            <strong>${esc(c.name)}</strong>
            <time datetime="${esc(c.date)}">${esc(formatDate(c.date))}</time><span class="comment-edited">${commentEditedLabel(c)}</span>
          </div>
          <span class="prod-stars" aria-label="${c.stars} de 5 estrellas">${renderStars(c.stars)}</span>
        </div>
        <span class="comment-product">Sobre: <a href="producto.html?id=${c.productId}">${esc(c.productName)}</a></span>
        <p class="comment-text">${esc(c.text)}</p>
        ${actionButtons('data-cm-edit', 'data-cm-delete', c.id)}
      </article>
    `).join('');
    bindCommentActions(reviewsBox, renderReviews);
  }

  function renderPosts() {
    if (!postsBox) return;
    const mine = loadCommunityPosts().filter(isMyComment).sort((a, b) => new Date(b.date) - new Date(a.date));
    if (!mine.length) {
      postsBox.innerHTML = `
        <div class="account-card">
          <p class="placeholder-text">Todavía no has escrito ningún comentario.</p>
          <a href="comunidad.html#comentarios" class="btn btn-primary">Escribir mi primer comentario</a>
        </div>`;
      return;
    }
    postsBox.innerHTML = mine.map(p => `
      <article class="comment-card">
        <div class="comment-top">
          <span class="comment-avatar">${esc(p.name.charAt(0).toUpperCase())}</span>
          <div class="comment-who">
            <strong>${esc(p.name)}</strong>
            <time datetime="${esc(p.date)}">${esc(formatDate(p.date))}</time><span class="comment-edited">${commentEditedLabel(p)}</span>
          </div>
        </div>
        <p class="comment-text">${esc(p.text)}</p>
        ${actionButtons('data-post-edit', 'data-post-delete', p.id)}
      </article>
    `).join('');
    bindPostActions(postsBox, renderPosts);
  }

  // ---------- Formularios para agregar (ventanas) ----------
  const email = isLoggedIn() ? (localStorage.getItem('dahlia_user_email') || '') : '';
  const base = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
  const accountName = base ? base.replace(/\b\w/g, ch => ch.toUpperCase()) : '';

  function makeModal(id, title, bodyHtml) {
    const o = document.createElement('div');
    o.className = 'modal-overlay';
    o.id = id;
    o.innerHTML = `
      <div class="modal-panel" role="dialog" aria-modal="true" aria-label="${esc(title)}">
        <button type="button" class="modal-close" aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>
        </button>
        <h3>${esc(title)}</h3>
        ${bodyHtml}
      </div>`;
    document.body.appendChild(o);
    const close = () => { o.classList.remove('open'); document.body.classList.remove('modal-open'); };
    o._close = close;
    o.addEventListener('click', (e) => { if (e.target === o) close(); });
    o.querySelector('.modal-close').addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && o.classList.contains('open')) close(); });
    o._open = () => { o.classList.add('open'); document.body.classList.add('modal-open'); };
    return o;
  }

  // --- Agregar reseña (producto + estrellas + texto) ---
  let reviewModal = null;
  function openReviewForm() {
    if (!reviewModal) {
      const products = (typeof getStoreProducts === 'function' ? getStoreProducts() : []).slice().sort((a, b) => a.name.localeCompare(b.name, 'es'));
      reviewModal = makeModal('myReviewModal', 'Agregar reseña', `
        <form class="cm-edit" id="myReviewForm" novalidate>
          <p class="community-as">Reseñando como <strong>${esc(accountName || 'Cliente Dahlia')}</strong></p>
          <div class="login-field">
            <label for="mrProduct">Producto</label>
            <select id="mrProduct">
              <option value="">Elige un producto</option>
              ${products.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('')}
            </select>
          </div>
          <div class="login-field">
            <label>Tu calificación</label>
            <div class="star-picker" id="mrStars" role="radiogroup">
              ${[1, 2, 3, 4, 5].map(n => `<button type="button" role="radio" aria-checked="false" aria-label="${n} estrella${n === 1 ? '' : 's'}" data-star="${n}">${CM_STAR}</button>`).join('')}
            </div>
            <p class="star-picker-text" id="mrStarsText"></p>
          </div>
          <div class="login-field">
            <label for="mrText">Tu reseña</label>
            <textarea id="mrText" rows="4" maxlength="300" placeholder="¿Qué te pareció? Talla, tela, color, entrega..."></textarea>
            <p class="community-counter"><span id="mrCount">0</span>/300</p>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" data-act="cancel">Cancelar</button>
            <button type="submit" class="btn btn-primary">Publicar</button>
          </div>
        </form>`);
      let rating = 0;
      const btns = Array.from(reviewModal.querySelectorAll('#mrStars button'));
      const text = reviewModal.querySelector('#mrStarsText');
      const paint = (hover) => {
        const shown = hover || rating;
        btns.forEach((b, i) => { b.classList.toggle('on', i + 1 <= shown); b.setAttribute('aria-checked', String(i + 1 === rating)); });
        text.textContent = shown ? `${shown} de 5 · ${CM_STAR_WORDS[shown]}` : 'Toca una estrella';
      };
      btns.forEach((b, i) => {
        b.addEventListener('click', () => { rating = i + 1; paint(0); });
        b.addEventListener('mouseenter', () => paint(i + 1));
        b.addEventListener('focus', () => paint(i + 1));
      });
      reviewModal.querySelector('#mrStars').addEventListener('mouseleave', () => paint(0));
      reviewModal.querySelector('#mrStars').addEventListener('focusout', () => paint(0));
      const textEl = reviewModal.querySelector('#mrText');
      textEl.addEventListener('input', () => { reviewModal.querySelector('#mrCount').textContent = textEl.value.length; });
      reviewModal.querySelector('[data-act=cancel]').addEventListener('click', () => reviewModal._close());

      reviewModal.querySelector('#myReviewForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const productId = parseInt(reviewModal.querySelector('#mrProduct').value, 10);
        const body = textEl.value.trim();
        const name = accountName || 'Cliente Dahlia';

        // Si falta algún dato, solo se muestra el mensaje de gracias y no se agrega nada.
        if (!productId || !rating || body.length < 10) {
          showToast('¡Gracias! Tu reseña ya está publicada.');
          return;
        }
        const list = loadCommunityComments();
        list.push({
          id: 'c_' + Date.now(),
          productId,
          productName: communityProductName(productId),
          name,
          stars: rating,
          text: body,
          date: new Date().toISOString(),
          email,
          mine: true
        });
        saveCommunityComments(list);
        reviewModal._close();
        reviewModal.querySelector('#mrProduct').value = '';
        textEl.value = '';
        reviewModal.querySelector('#mrCount').textContent = '0';
        rating = 0;
        paint(0);
        renderReviews();
        showToast('¡Gracias! Tu reseña ya está publicada.');
      });
      paint(0);
    }
    reviewModal._open();
  }

  // --- Agregar comentario (nombre + texto) ---
  let postModal = null;
  function openPostForm() {
    if (!postModal) {
      postModal = makeModal('myPostModal', 'Agregar comentario', `
        <form class="cm-edit" id="myPostForm" novalidate>
          <div class="login-field">
            <label for="mpName">Tu nombre</label>
            <input type="text" id="mpName" maxlength="30" placeholder="Ej. Ana" autocomplete="name">
          </div>
          <div class="login-field">
            <label for="mpText">Comentario</label>
            <textarea id="mpText" rows="4" maxlength="300" placeholder="Escribe tu comentario..."></textarea>
            <p class="community-counter"><span id="mpCount">0</span>/300</p>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" data-act="cancel">Cancelar</button>
            <button type="submit" class="btn btn-primary">Publicar</button>
          </div>
        </form>`);
      const textEl = postModal.querySelector('#mpText');
      textEl.addEventListener('input', () => { postModal.querySelector('#mpCount').textContent = textEl.value.length; });
      postModal.querySelector('[data-act=cancel]').addEventListener('click', () => postModal._close());

      postModal.querySelector('#myPostForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const name = postModal.querySelector('#mpName').value.trim();
        const body = textEl.value.trim();

        // Si falta algún dato, solo se muestra el mensaje de gracias y no se agrega nada.
        if (!name || body.length < 5) {
          showToast('¡Gracias! Tu comentario ya está publicado.');
          return;
        }
        const list = loadCommunityPosts();
        list.push({ id: 'p_' + Date.now(), name, text: body, date: new Date().toISOString(), email, mine: true });
        saveCommunityPosts(list);
        postModal._close();
        textEl.value = '';
        postModal.querySelector('#mpCount').textContent = '0';
        renderPosts();
        showToast('¡Gracias! Tu comentario ya está publicado.');
      });
    }
    postModal.querySelector('#mpName').value = accountName;
    postModal._open();
  }

  const addReview = document.getElementById('myReviewAdd');
  if (addReview) addReview.addEventListener('click', openReviewForm);
  const addPost = document.getElementById('myPostAdd');
  if (addPost) addPost.addEventListener('click', openPostForm);

  renderReviews();
  renderPosts();
})();