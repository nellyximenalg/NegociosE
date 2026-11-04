// Comentarios de la Comunidad: datos compartidos por Comunidad, Campaña y Mis comentarios.
// Se guardan en localStorage; la primera vez se cargan comentarios de ejemplo de otras personas.
const COMMUNITY_KEY = 'dahlia_community_comments';

// ---------- Comentarios de ejemplo (de otras personas, con distintos productos) ----------
const COMMUNITY_SEED = [
  { productId: 1,  name: 'Daniela R.',  stars: 5, daysAgo: 2,  text: 'Me encantó el vestido, la tela cae muy bonito y no se arruga. Pedí mi talla habitual y quedó perfecto.' },
  { productId: 17, name: 'Carlos M.',   stars: 5, daysAgo: 4,  text: 'La chamarra bomber está padrísima, se siente resistente y el corte es muy actual. La uso casi diario.' },
  { productId: 25, name: 'Luis Á.',     stars: 4, daysAgo: 6,  text: 'Buen cinturón de piel, se nota la calidad. Solo le daría una estrella más si trajera una caja para regalo.' },
  { productId: 44, name: 'Mariana G.',  stars: 5, daysAgo: 8,  text: 'Lo compré para una boda y recibí muchos cumplidos. El satín es elegante sin ser pesado.' },
  { productId: 13, name: 'Jorge T.',    stars: 4, daysAgo: 11, text: 'La camisa Oxford queda bien en el hombro y la manga. Recomiendo lavarla del revés para que dure más.' },
  { productId: 31, name: 'Sofía A.',    stars: 5, daysAgo: 14, text: 'El reloj minimalista combina con todo y es muy ligero. Me llegó en tres días a Aguascalientes.' },
  { productId: 7,  name: 'Paola M.',    stars: 5, daysAgo: 17, text: 'Mi cárdigan favorito para el frío de la mañana. Es oversize de verdad, yo me fui con una talla menos.' },
  { productId: 29, name: 'Ricardo H.',  stars: 3, daysAgo: 21, text: 'La mochila se ve bien y cabe la laptop, pero esperaba bolsillos laterales más profundos.' },
  { productId: 4,  name: 'Fernanda L.', stars: 5, daysAgo: 25, text: 'La chamarra de mezclilla tiene un lavado hermoso. Va con vestidos y con jeans, súper versátil.' },
  { productId: 35, name: 'Andrea V.',   stars: 5, daysAgo: 30, text: 'La pulsera artesanal es preciosa, se nota el trabajo a mano. Ya compré otra para mi mamá.' },
  { productId: 19, name: 'Diego S.',    stars: 4, daysAgo: 36, text: 'La sudadera es calientita y la capucha queda bien. Se encoge un poquito la primera vez que la lavas.' },
  { productId: 42, name: 'Valeria C.',  stars: 5, daysAgo: 42, text: 'El blazer estructurado le da un toque formal a cualquier outfit. Excelente caída y acabados.' }
];

function communityProductName(id) {
  const p = getStoreProducts().find(x => x.id === id);
  return p ? p.name : 'Producto';
}

function loadCommunityComments() {
  try {
    const raw = localStorage.getItem(COMMUNITY_KEY);
    if (raw === null) {
      const now = Date.now();
      const seeded = COMMUNITY_SEED.map((s, i) => ({
        id: 'seed_' + (i + 1),
        productId: s.productId,
        productName: communityProductName(s.productId),
        name: s.name,
        stars: s.stars,
        text: s.text,
        date: new Date(now - s.daysAgo * 86400000 - i * 3600000).toISOString(),
        mine: false
      }));
      localStorage.setItem(COMMUNITY_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

function saveCommunityComments(list) {
  localStorage.setItem(COMMUNITY_KEY, JSON.stringify(list));
}

// ======================================================================
// Editar y eliminar comentarios propios (se usa en Comunidad, Campaña y Mis comentarios)
// ======================================================================
const CM_STAR = '<svg viewBox="0 0 24 24"><polygon points="12 2.5 15.1 9 22.2 10 17 14.9 18.3 22 12 18.6 5.7 22 7 14.9 1.8 10 8.9 9"/></svg>';
const CM_STAR_WORDS = ['', 'Malo', 'Regular', 'Bien', 'Muy bueno', 'Excelente'];
const cmEsc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

// Son "míos" los comentarios con el correo de esta cuenta; los publicados antes de guardar
// el correo (o sin sesión) cuentan como míos si se publicaron desde este navegador.
function isMyComment(c) {
  const email = isLoggedIn() ? (localStorage.getItem('dahlia_user_email') || '') : '';
  if (c.email) return !!email && c.email === email;
  return !!c.mine;
}

function commentEditedLabel(c) {
  return c.edited ? ' · editado' : '';
}

function communityActionsHtml(c) {
  const id = cmEsc(c.id);
  return `<div class="comment-actions">
    <button type="button" class="comment-delete" data-cm-edit="${id}">Editar</button>
    <button type="button" class="comment-delete" data-cm-delete="${id}">Eliminar</button>
  </div>`;
}

// Conecta los botones Editar / Eliminar dentro de un contenedor; onChange se llama al terminar.
function bindCommentActions(container, onChange) {
  container.querySelectorAll('[data-cm-edit]').forEach(b => b.addEventListener('click', () => openEditCommunityComment(b.dataset.cmEdit, onChange)));
  container.querySelectorAll('[data-cm-delete]').forEach(b => b.addEventListener('click', () => askDeleteCommunityComment(b.dataset.cmDelete, onChange)));
}

// ---------- Eliminar (con confirmación) ----------
let cmConfirmEl = null;
function askDeleteCommunityComment(id, onChange) {
  const comment = loadCommunityComments().find(c => c.id === id);
  if (!comment || !isMyComment(comment)) return;
  if (!cmConfirmEl) {
    cmConfirmEl = document.createElement('div');
    cmConfirmEl.className = 'modal-overlay';
    cmConfirmEl.innerHTML = `
      <div class="modal-panel modal-panel--confirm" role="dialog" aria-modal="true" aria-labelledby="cmConfirmTitle">
        <h3 id="cmConfirmTitle">Eliminar reseña</h3>
        <p class="admin-confirm-message" id="cmConfirmMsg"></p>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" data-act="cancel">Cancelar</button>
          <button type="button" class="btn btn-primary admin-btn-danger-solid" data-act="ok">Sí, eliminar</button>
        </div>
      </div>`;
    document.body.appendChild(cmConfirmEl);
  }
  const o = cmConfirmEl;
  o.querySelector('#cmConfirmMsg').textContent = `¿Seguro que quieres eliminar tu reseña sobre "${comment.productName}"? Esta acción no se puede deshacer.`;
  const close = () => { o.classList.remove('open'); document.body.classList.remove('modal-open'); document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  o.querySelector('[data-act=cancel]').onclick = close;
  o.querySelector('[data-act=ok]').onclick = () => {
    close();
    saveCommunityComments(loadCommunityComments().filter(c => c.id !== id));
    if (onChange) onChange();
    showToast('Reseña eliminada.');
  };
  o.onclick = (e) => { if (e.target === o) close(); };
  document.addEventListener('keydown', onKey);
  o.classList.add('open');
  document.body.classList.add('modal-open');
}

// ---------- Editar (estrellas y texto) ----------
let cmEditEl = null;
function openEditCommunityComment(id, onChange) {
  const comment = loadCommunityComments().find(c => c.id === id);
  if (!comment || !isMyComment(comment)) return;

  if (!cmEditEl) {
    cmEditEl = document.createElement('div');
    cmEditEl.className = 'modal-overlay';
    cmEditEl.innerHTML = `
      <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="cmEditTitle">
        <button type="button" class="modal-close" aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>
        </button>
        <h3 id="cmEditTitle">Editar reseña</h3>
        <form class="cm-edit" id="cmEditForm" novalidate>
          <p class="community-as" id="cmEditProduct"></p>
          <div class="login-field">
            <label>Tu calificación</label>
            <div class="star-picker" id="cmEditStars" role="radiogroup">
              ${[1, 2, 3, 4, 5].map(n => `<button type="button" role="radio" aria-checked="false" aria-label="${n} estrella${n === 1 ? '' : 's'}" data-star="${n}">${CM_STAR}</button>`).join('')}
            </div>
            <p class="star-picker-text" id="cmEditStarsText"></p>
          </div>
          <div class="login-field">
            <label for="cmEditText">Tu reseña</label>
            <textarea id="cmEditText" rows="4" maxlength="300"></textarea>
            <p class="community-counter"><span id="cmEditCount">0</span>/300</p>
          </div>
          <p class="community-error" id="cmEditError" role="alert" hidden></p>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" data-act="cancel">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar cambios</button>
          </div>
        </form>
      </div>`;
    document.body.appendChild(cmEditEl);
  }
  const o = cmEditEl;
  const q = (s) => o.querySelector(s);
  let rating = comment.stars;
  const starBtns = Array.from(o.querySelectorAll('#cmEditStars button'));
  const paint = (hover) => {
    const shown = hover || rating;
    starBtns.forEach((b, i) => { b.classList.toggle('on', i + 1 <= shown); b.setAttribute('aria-checked', String(i + 1 === rating)); });
    q('#cmEditStarsText').textContent = shown ? `${shown} de 5 · ${CM_STAR_WORDS[shown]}` : 'Toca una estrella';
  };
  starBtns.forEach((b, i) => {
    b.onclick = () => { rating = i + 1; paint(0); };
    b.onmouseenter = () => paint(i + 1);
    b.onfocus = () => paint(i + 1);
  });
  q('#cmEditStars').onmouseleave = () => paint(0);
  q('#cmEditStars').onfocusout = () => paint(0);

  const textEl = q('#cmEditText');
  textEl.value = comment.text;
  q('#cmEditCount').textContent = comment.text.length;
  textEl.oninput = () => { q('#cmEditCount').textContent = textEl.value.length; };
  q('#cmEditProduct').innerHTML = `Sobre: <strong>${cmEsc(comment.productName)}</strong>`;
  q('#cmEditError').hidden = true;
  paint(0);

  const close = () => { o.classList.remove('open'); document.body.classList.remove('modal-open'); document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  q('.modal-close').onclick = close;
  q('[data-act=cancel]').onclick = close;
  o.onclick = (e) => { if (e.target === o) close(); };
  document.addEventListener('keydown', onKey);

  q('#cmEditForm').onsubmit = (event) => {
    event.preventDefault();
    const text = textEl.value.trim();
    if (text.length < 10) {
      q('#cmEditError').textContent = 'Escribe una reseña de al menos 10 caracteres.';
      q('#cmEditError').hidden = false;
      return;
    }
    const list = loadCommunityComments();
    const i = list.findIndex(c => c.id === id);
    if (i < 0) { close(); return; }
    list[i] = Object.assign({}, list[i], { stars: rating, text, edited: new Date().toISOString() });
    saveCommunityComments(list);
    close();
    if (onChange) onChange();
    showToast('Reseña actualizada.');
  };

  o.classList.add('open');
  document.body.classList.add('modal-open');
}

// ======================================================================
// COMENTARIOS (conversación general de la comunidad: nombre + texto, sin producto ni estrellas)
// ======================================================================
const COMMUNITY_POSTS_KEY = 'dahlia_community_posts';

const COMMUNITY_POSTS_SEED = [
  { name: 'Laura P.',    daysAgo: 2,  text: '¿Saben si van a sacar más colores de la chamarra de mezclilla? Me encantó pero la quiero en negro.' },
  { name: 'Carlos M.',   daysAgo: 3,  text: 'Mi pedido llegó rapidísimo a Aguascalientes y la atención fue muy buena. ¡Gracias, Dahlia!' },
  { name: 'Daniela R.',  daysAgo: 5,  text: '¿Alguien me recomienda talla en los vestidos satinados? Mis medidas son 90-70-96.' },
  { name: 'Jorge T.',    daysAgo: 6,  text: 'Qué buena idea el Marketplace, ya subí una chamarra que no uso. Espero que se venda pronto.' },
  { name: 'Sofía A.',    daysAgo: 7,  text: 'La subasta del vestido de olanes está muy reñida, ¡mucha suerte a todas!' },
  { name: 'Paola M.',    daysAgo: 9,  text: 'Los cambios y devoluciones fueron muy fáciles, me cambiaron la talla en dos días.' },
  { name: 'Fernanda L.', daysAgo: 11, text: 'Me encantan las promociones con cupones, ya aproveché el de accesorios. ¡Ahorré bastante!' },
  { name: 'Ricardo H.',  daysAgo: 14, text: '¿Tendrán más modelos de botas pronto? Las del Marketplace están padrísimas.' }
];

function loadCommunityPosts() {
  try {
    const raw = localStorage.getItem(COMMUNITY_POSTS_KEY);
    if (raw === null) {
      const now = Date.now();
      const seeded = COMMUNITY_POSTS_SEED.map((s, i) => ({
        id: 'post_seed_' + (i + 1),
        name: s.name,
        text: s.text,
        date: new Date(now - s.daysAgo * 86400000 - i * 3600000).toISOString(),
        email: '',
        mine: false
      }));
      localStorage.setItem(COMMUNITY_POSTS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) { return []; }
}

function saveCommunityPosts(list) {
  try { localStorage.setItem(COMMUNITY_POSTS_KEY, JSON.stringify(list)); } catch (e) { /* sin espacio */ }
}

function postActionsHtml(p) {
  const id = cmEsc(p.id);
  return `<div class="comment-actions">
    <button type="button" class="comment-delete" data-post-edit="${id}">Editar</button>
    <button type="button" class="comment-delete" data-post-delete="${id}">Eliminar</button>
  </div>`;
}

function bindPostActions(container, onChange) {
  container.querySelectorAll('[data-post-edit]').forEach(b => b.addEventListener('click', () => openEditCommunityPost(b.dataset.postEdit, onChange)));
  container.querySelectorAll('[data-post-delete]').forEach(b => b.addEventListener('click', () => askDeleteCommunityPost(b.dataset.postDelete, onChange)));
}

let cmPostConfirmEl = null;
function askDeleteCommunityPost(id, onChange) {
  const post = loadCommunityPosts().find(p => p.id === id);
  if (!post || !isMyComment(post)) return;
  if (!cmPostConfirmEl) {
    cmPostConfirmEl = document.createElement('div');
    cmPostConfirmEl.className = 'modal-overlay';
    cmPostConfirmEl.innerHTML = `
      <div class="modal-panel modal-panel--confirm" role="dialog" aria-modal="true" aria-labelledby="cmPostConfirmTitle">
        <h3 id="cmPostConfirmTitle">Eliminar comentario</h3>
        <p class="admin-confirm-message">¿Seguro que quieres eliminar tu comentario? Esta acción no se puede deshacer.</p>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" data-act="cancel">Cancelar</button>
          <button type="button" class="btn btn-primary admin-btn-danger-solid" data-act="ok">Sí, eliminar</button>
        </div>
      </div>`;
    document.body.appendChild(cmPostConfirmEl);
  }
  const o = cmPostConfirmEl;
  const close = () => { o.classList.remove('open'); document.body.classList.remove('modal-open'); document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  o.querySelector('[data-act=cancel]').onclick = close;
  o.querySelector('[data-act=ok]').onclick = () => {
    close();
    saveCommunityPosts(loadCommunityPosts().filter(p => p.id !== id));
    if (onChange) onChange();
    showToast('Comentario eliminado.');
  };
  o.onclick = (e) => { if (e.target === o) close(); };
  document.addEventListener('keydown', onKey);
  o.classList.add('open');
  document.body.classList.add('modal-open');
}

let cmPostEditEl = null;
function openEditCommunityPost(id, onChange) {
  const post = loadCommunityPosts().find(p => p.id === id);
  if (!post || !isMyComment(post)) return;
  if (!cmPostEditEl) {
    cmPostEditEl = document.createElement('div');
    cmPostEditEl.className = 'modal-overlay';
    cmPostEditEl.innerHTML = `
      <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="cmPostEditTitle">
        <button type="button" class="modal-close" aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>
        </button>
        <h3 id="cmPostEditTitle">Editar comentario</h3>
        <form class="cm-edit" id="cmPostEditForm" novalidate>
          <div class="login-field">
            <label for="cmPostEditText">Comentario</label>
            <textarea id="cmPostEditText" rows="4" maxlength="300"></textarea>
            <p class="community-counter"><span id="cmPostEditCount">0</span>/300</p>
          </div>
          <p class="community-error" id="cmPostEditError" role="alert" hidden></p>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" data-act="cancel">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar cambios</button>
          </div>
        </form>
      </div>`;
    document.body.appendChild(cmPostEditEl);
  }
  const o = cmPostEditEl;
  const q = (s) => o.querySelector(s);
  const textEl = q('#cmPostEditText');
  textEl.value = post.text;
  q('#cmPostEditCount').textContent = post.text.length;
  textEl.oninput = () => { q('#cmPostEditCount').textContent = textEl.value.length; };
  q('#cmPostEditError').hidden = true;

  const close = () => { o.classList.remove('open'); document.body.classList.remove('modal-open'); document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  q('.modal-close').onclick = close;
  q('[data-act=cancel]').onclick = close;
  o.onclick = (e) => { if (e.target === o) close(); };
  document.addEventListener('keydown', onKey);

  q('#cmPostEditForm').onsubmit = (event) => {
    event.preventDefault();
    const text = textEl.value.trim();
    if (text.length < 5) {
      q('#cmPostEditError').textContent = 'Escribe un comentario de al menos 5 caracteres.';
      q('#cmPostEditError').hidden = false;
      return;
    }
    const list = loadCommunityPosts();
    const i = list.findIndex(p => p.id === id);
    if (i < 0) { close(); return; }
    list[i] = Object.assign({}, list[i], { text, edited: new Date().toISOString() });
    saveCommunityPosts(list);
    close();
    if (onChange) onChange();
    showToast('Comentario actualizado.');
  };

  o.classList.add('open');
  document.body.classList.add('modal-open');
  textEl.focus();
}