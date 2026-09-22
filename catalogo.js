// Lee la categoría y el término de búsqueda inicial desde la URL
// (ej. catalogo.html?cat=mujer&q=vestido)
function getCategoryParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get('cat') || 'todos';
}

function getSearchParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get('q') || '';
}

// Quita acentos y pasa a minúsculas, para que "pantalon" encuentre "Pantalón"
function normalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

let currentCategory = getCategoryParam();
let currentQuery = getSearchParam();

function getFilteredProducts() {
  let list;
  if (currentCategory === 'todos') {
    list = PRODUCTS;
  } else if (currentCategory === 'novedades') {
    list = PRODUCTS.filter(p => p.isNew);
  } else {
    list = PRODUCTS.filter(p => p.category === currentCategory);
  }

  const query = normalize(currentQuery.trim());
  if (query) {
    list = list.filter(p =>
      normalize(p.name).includes(query) ||
      normalize(p.sku).includes(query) ||
      normalize(p.category).includes(query)
    );
  }

  return list;
}

function renderProducts() {
  const grid = document.getElementById('catalogGrid');
  const emptyState = document.getElementById('catalogEmpty');
  const list = getFilteredProducts();

  if (list.length === 0) {
    grid.innerHTML = '';
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  grid.innerHTML = list.map(p => `
    <div class="prod-card">
      <a href="producto.html?id=${p.id}" class="prod-image" style="background:${p.gradient};"></a>
      <div class="prod-tag">
        <div style="display:flex;align-items:center;">
          <span class="hole"></span>
          <div>
            <div class="prod-name">${p.name}</div>
            <div class="prod-sku">${p.sku}</div>
          </div>
        </div>
        <span class="prod-price">$${p.price}</span>
      </div>
      <a href="producto.html?id=${p.id}" class="btn btn-ghost prod-detail-btn">Ver detalles</a>
    </div>
  `).join('');
}

// Actualiza la URL sin recargar la página, para poder compartir el link filtrado/buscado
function updateUrl() {
  const url = new URL(window.location);
  if (currentCategory === 'todos') {
    url.searchParams.delete('cat');
  } else {
    url.searchParams.set('cat', currentCategory);
  }
  if (currentQuery.trim()) {
    url.searchParams.set('q', currentQuery.trim());
  } else {
    url.searchParams.delete('q');
  }
  window.history.replaceState({}, '', url);
}

// Filtros por categoría
const filterButtons = document.querySelectorAll('.filter-tab');
filterButtons.forEach(btn => {
  if (btn.dataset.cat === currentCategory) {
    btn.classList.add('active');
  }
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.cat;
    renderProducts();
    updateUrl();
  });
});

// Buscador
const searchInput = document.getElementById('searchInput');
searchInput.value = currentQuery;
searchInput.addEventListener('input', () => {
  currentQuery = searchInput.value;
  renderProducts();
  updateUrl();
});

renderProducts();