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

  document.getElementById('productSku').textContent = product.sku;
  document.getElementById('productName').textContent = product.name;
  document.getElementById('productDesc').textContent = product.description;

  // ---------- Precio y cantidad ----------
  const priceEl = document.getElementById('productPrice');
  const pricePerUnitEl = document.getElementById('pricePerUnit');
  const qtyInput = document.getElementById('qtyInput');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  let quantity = 1;

  function formatPrice(n) {
    return n.toLocaleString('es-MX');
  }

  function renderPrice() {
    const total = product.price * quantity;
    priceEl.textContent = `$${formatPrice(total)} MXN`;
    if (quantity > 1) {
      pricePerUnitEl.textContent = `$${formatPrice(product.price)} MXN c/u × ${quantity}`;
      pricePerUnitEl.hidden = false;
    } else {
      pricePerUnitEl.hidden = true;
    }
  }

  function setQuantity(n) {
    quantity = Math.min(20, Math.max(1, n || 1));
    qtyInput.value = quantity;
    renderPrice();
  }

  qtyMinus.addEventListener('click', () => setQuantity(quantity - 1));
  qtyPlus.addEventListener('click', () => setQuantity(quantity + 1));
  qtyInput.addEventListener('change', () => setQuantity(parseInt(qtyInput.value, 10)));
  qtyInput.addEventListener('input', () => {
    const n = parseInt(qtyInput.value, 10);
    if (!isNaN(n) && n >= 1 && n <= 20) {
      quantity = n;
      renderPrice();
    }
  });

  renderPrice();

  // Detalles del producto (tela, cuidado, origen, dimensiones si aplica)
  const detailsList = document.getElementById('productDetailsList');
  const detailLabels = { tela: 'Tela', cuidado: 'Cuidado', origen: 'Origen', dimensiones: 'Dimensiones' };
  Object.keys(detailLabels).forEach(key => {
    if (product.details && product.details[key]) {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${detailLabels[key]}:</strong> ${product.details[key]}`;
      detailsList.appendChild(li);
    }
  });

  // ---------- Galería de imágenes (depende del color seleccionado) ----------
  const mainImage = document.getElementById('productImage');
  const thumbsContainer = document.getElementById('productThumbs');
  let loadedImageOk = {}; // cache: ruta -> true/false, para no probar la misma imagen varias veces

  function showImageAt(images, index, colorHex) {
    const src = images[index];
    if (loadedImageOk[src] === false) {
      renderPlaceholder(colorHex);
      return;
    }
    const testImg = new Image();
    testImg.onload = () => {
      loadedImageOk[src] = true;
      mainImage.style.background = 'none';
      mainImage.innerHTML = `<img src="${src}" alt="${product.name}" class="product-main-photo">`;
    };
    testImg.onerror = () => {
      loadedImageOk[src] = false;
      renderPlaceholder(colorHex);
    };
    testImg.src = src;
  }

  function renderPlaceholder(colorHex) {
    // Mientras no se haya cargado la foto real, mostramos un fondo del color
    // seleccionado (en vez del degradado genérico) para simular el cambio.
    mainImage.innerHTML = '<span class="placeholder-note">Foto</span>';
    mainImage.style.background = `linear-gradient(160deg, ${colorHex}, #1c1a17 140%)`;
  }

  function renderThumbs(images, colorHex, activeIndex) {
    thumbsContainer.innerHTML = '';
    images.forEach((src, i) => {
      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = 'gallery-thumb' + (i === activeIndex ? ' active' : '');
      thumb.style.background = colorHex;
      thumb.setAttribute('aria-label', `Foto ${i + 1}`);
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.onerror = () => { img.remove(); };
      thumb.appendChild(img);
      thumb.addEventListener('click', () => {
        thumbsContainer.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        showImageAt(images, i, colorHex);
      });
      thumbsContainer.appendChild(thumb);
    });
  }

  function updateGalleryForColor(color) {
    renderThumbs(color.images, color.hex, 0);
    showImageAt(color.images, 0, color.hex);
  }

  // ---------- Tallas y medidas ----------
  const sizeContainer = document.getElementById('sizeOptions');
  const selectedSizeName = document.getElementById('selectedSizeName');
  const measurementsBox = document.getElementById('sizeMeasurements');
  let selectedSize = product.sizes[0].label;

  function renderMeasurements(size) {
    if (!size.measurements) {
      measurementsBox.hidden = true;
      measurementsBox.innerHTML = '';
      return;
    }
    measurementsBox.hidden = false;
    measurementsBox.innerHTML = Object.entries(size.measurements)
      .map(([label, value]) => `<div class="measurement-row"><span>${label}</span><strong>${value}</strong></div>`)
      .join('');
  }

  product.sizes.forEach((size, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-pill' + (i === 0 ? ' active' : '');
    btn.textContent = size.label;
    btn.addEventListener('click', () => {
      selectedSize = size.label;
      selectedSizeName.textContent = `· ${size.label}`;
      sizeContainer.querySelectorAll('.option-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMeasurements(size);
    });
    sizeContainer.appendChild(btn);
  });
  selectedSizeName.textContent = `· ${product.sizes[0].label}`;
  renderMeasurements(product.sizes[0]);

  // ---------- Colores ----------
  const colorContainer = document.getElementById('colorOptions');
  const selectedColorName = document.getElementById('selectedColorName');
  const colorNote = document.getElementById('colorNote');
  let selectedColor = product.colors[0].name;

  function selectColor(color) {
    selectedColor = color.name;
    selectedColorName.textContent = `· ${color.name}`;
    colorNote.textContent = color.note ? `En ${color.name.toLowerCase()}: ${color.note}` : '';
    updateGalleryForColor(color);
  }

  product.colors.forEach((color, i) => {
    const swatch = document.createElement('button');
    swatch.type = 'button';
    swatch.className = 'option-swatch' + (i === 0 ? ' active' : '');
    swatch.style.background = color.hex;
    swatch.setAttribute('aria-label', color.name);
    swatch.title = color.name;
    swatch.addEventListener('click', () => {
      colorContainer.querySelectorAll('.option-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      selectColor(color);
    });
    colorContainer.appendChild(swatch);
  });

  // Estado inicial: primer color y primera talla
  selectColor(product.colors[0]);

  // Agregar al carrito: simulado. Si no hay sesión, primero pide iniciar sesión.
  const addBtn = document.getElementById('addToCartBtn');
  const productMsg = document.getElementById('productMsg');

  addBtn.addEventListener('click', () => {
    if (!isLoggedIn()) {
      const redirect = encodeURIComponent(`producto.html?id=${product.id}`);
      window.location.href = `login.html?redirect=${redirect}`;
      return;
    }
    const totalTxt = `$${formatPrice(product.price * quantity)} MXN`;
    productMsg.textContent = `Agregado al carrito: ${quantity} x talla ${selectedSize}, color ${selectedColor} (${totalTxt}).`;
    productMsg.hidden = false;
  });
}