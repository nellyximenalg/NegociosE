// Lee la categoría inicial desde la URL (ej. catalogo.html?cat=mujer)
function getCategoryParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get('cat') || 'todos';
}

function renderProducts(category) {
  const grid = document.getElementById('catalogGrid');
  const list = category === 'todos'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === category);

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
      <a href="producto.html?id=${p.id}" class="btn btn-ghost prod-detail-btn">Ver detalle</a>
    </div>
  `).join('');
}

const filterButtons = document.querySelectorAll('.filter-tab');
const initialCat = getCategoryParam();

filterButtons.forEach(btn => {
  if (btn.dataset.cat === initialCat) {
    btn.classList.add('active');
  }
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(btn.dataset.cat);
 
    const url = new URL(window.location);
    url.searchParams.set('cat', btn.dataset.cat);
    window.history.replaceState({}, '', url);
  });
});

renderProducts(initialCat);