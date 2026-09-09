function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id'), 10);
}

const product = PRODUCTS.find(p => p.id === getProductId());

if (!product) {
  document.getElementById('productRoot').innerHTML =
    '<p class="placeholder-text">No encontramos ese producto. <a href="catalogo.html">Volver al catálogo</a>.</p>';
} else {
  document.title = `Dahlia — ${product.name}`;

  document.getElementById('productImage').style.background = product.gradient;
  document.getElementById('productSku').textContent = product.sku;
  document.getElementById('productName').textContent = product.name;
  document.getElementById('productPrice').textContent = `$${product.price} MXN`;
  document.getElementById('productDesc').textContent = product.description;

  // Tallas
  const sizeContainer = document.getElementById('sizeOptions');
  let selectedSize = product.sizes[0];
  product.sizes.forEach((size, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-pill' + (i === 0 ? ' active' : '');
    btn.textContent = size;
    btn.addEventListener('click', () => {
      selectedSize = size;
      sizeContainer.querySelectorAll('.option-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
    sizeContainer.appendChild(btn);
  });

  // Colores
  const colorContainer = document.getElementById('colorOptions');
  const selectedColorName = document.getElementById('selectedColorName');
  let selectedColor = product.colors[0].name;
  selectedColorName.textContent = `· ${selectedColor}`;

  product.colors.forEach((color, i) => {
    const swatch = document.createElement('button');
    swatch.type = 'button';
    swatch.className = 'option-swatch' + (i === 0 ? ' active' : '');
    swatch.style.background = color.hex;
    swatch.setAttribute('aria-label', color.name);
    swatch.title = color.name;
    swatch.addEventListener('click', () => {
      selectedColor = color.name;
      selectedColorName.textContent = `· ${color.name}`;
      colorContainer.querySelectorAll('.option-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
    });
    colorContainer.appendChild(swatch);
  });

  // Agregar al carrito: simulado. Si no hay sesión, primero pide iniciar sesión.
  const addBtn = document.getElementById('addToCartBtn');
  const productMsg = document.getElementById('productMsg');

  addBtn.addEventListener('click', () => {
    if (!isLoggedIn()) {
      const redirect = encodeURIComponent(`producto.html?id=${product.id}`);
      window.location.href = `login.html?redirect=${redirect}`;
      return;
    }
    productMsg.textContent = `Agregado al carrito (talla ${selectedSize}, color ${selectedColor}).`;
    productMsg.hidden = false;
  });
}