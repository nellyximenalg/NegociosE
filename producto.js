function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id'), 10);
}

const product = getStoreProducts().find(p => p.id === getProductId());

if (!product) {
  document.getElementById('productRoot').innerHTML =
    '<p class="placeholder-text">No encontramos ese producto. <a href="catalogo.html">Volver al catálogo</a>.</p>';
} else {
  document.title = `Dahlia — ${product.name}`;

  document.getElementById('productSku').textContent = product.sku;
  document.getElementById('productName').textContent = product.name;
  document.getElementById('productDesc').textContent = product.description;
  document.getElementById('productBadges').innerHTML = renderProductBadges(product);

  // ---------- Precio y cantidad ----------
  const priceEl = document.getElementById('productPrice');
  const pricePerUnitEl = document.getElementById('pricePerUnit');
  const qtyInput = document.getElementById('qtyInput');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  let quantity = 1;
  let maxQty = 20;

  function formatPrice(n) {
    return n.toLocaleString('es-MX');
  }

  function renderPrice() {
    const unitPrice = getEffectivePrice(product);
    const total = unitPrice * quantity;
    if (isPromoActive(product) && product.discountPrice) {
      priceEl.innerHTML = `<span class="prod-price-old">$${formatPrice(product.price)} MXN</span> $${formatPrice(total)} MXN`;
    } else {
      priceEl.textContent = `$${formatPrice(total)} MXN`;
    }
    if (quantity > 1) {
      pricePerUnitEl.textContent = `$${formatPrice(unitPrice)} MXN c/u × ${quantity}`;
      pricePerUnitEl.hidden = false;
    } else {
      pricePerUnitEl.hidden = true;
    }
  }

  function setQuantity(n) {
    quantity = Math.min(maxQty || 1, Math.max(1, n || 1));
    qtyInput.value = quantity;
    renderPrice();
  }

  qtyMinus.addEventListener('click', () => setQuantity(quantity - 1));
  qtyPlus.addEventListener('click', () => setQuantity(quantity + 1));
  qtyInput.addEventListener('change', () => setQuantity(parseInt(qtyInput.value, 10)));
  qtyInput.addEventListener('input', () => {
    const n = parseInt(qtyInput.value, 10);
    if (!isNaN(n) && n >= 1 && n <= maxQty) {
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

  // Foto actual (para las flechas anterior / siguiente)
  let galleryImages = [], galleryIndex = 0, galleryHex = '';

  function syncGalleryUI() {
    thumbsContainer.querySelectorAll('.gallery-thumb').forEach((t, i) => t.classList.toggle('active', i === galleryIndex));
    document.querySelectorAll('#productGalleryWrap .img-arrow').forEach(b => { b.hidden = galleryImages.length < 2; });
  }

  function stepGallery(delta) {
    if (galleryImages.length < 2) return;
    showImageAt(galleryImages, (galleryIndex + delta + galleryImages.length) % galleryImages.length, galleryHex);
  }

  document.querySelectorAll('#productGalleryWrap .img-arrow').forEach(b => {
    b.addEventListener('click', () => stepGallery(parseInt(b.dataset.dir, 10)));
  });

  function showImageAt(images, index, colorHex) {
    galleryImages = images;
    galleryIndex = index;
    galleryHex = colorHex;
    syncGalleryUI();
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
    if (!size.measurements || Object.keys(size.measurements).length === 0) {
      measurementsBox.hidden = true;
      measurementsBox.innerHTML = '';
      return;
    }
    measurementsBox.hidden = false;
    measurementsBox.innerHTML = Object.entries(size.measurements)
      .map(([label, value]) => `<div class="measurement-row"><span>${label}</span><strong>${value}</strong></div>`)
      .join('');
  }

  // Muestra cuántas unidades quedan de la combinación color+talla elegida (si
  // el admin capturó stock para ese color) y bloquea la compra cuando es 0.
  function updateStockUI() {
    const stockNote = document.getElementById('sizeStockNote');
    const stock = getStockFor(product, selectedColor, selectedSize);
    const inCart = getCartQtyFor(product.id, selectedColor, selectedSize);
    const setEnabled = (on) => {
      qtyMinus.disabled = !on;
      qtyPlus.disabled = !on;
      qtyInput.disabled = !on;
      addBtn.disabled = !on;
    };

    if (stock == null) {
      stockNote.hidden = true;
      maxQty = 20;
      setEnabled(true);
      addBtn.textContent = 'Agregar al carrito';
      return;
    }

    // Lo que ya está en el carrito cuenta contra el stock.
    const available = Math.max(0, Math.min(20, stock) - inCart);
    stockNote.hidden = false;

    if (stock === 0) {
      stockNote.textContent = 'Agotado en este color y talla.';
      stockNote.classList.add('size-stock-note--out');
      maxQty = 0;
      setEnabled(false);
      addBtn.textContent = 'Agotado';
    } else if (available === 0) {
      stockNote.textContent = `Ya tienes en tu carrito todas las piezas disponibles (${inCart}).`;
      stockNote.classList.add('size-stock-note--out');
      maxQty = 0;
      setEnabled(false);
      addBtn.textContent = 'Sin más disponibles';
    } else {
      const base = stock <= 5 ? `¡Últimas ${stock} disponibles!` : `${stock} disponibles`;
      stockNote.textContent = inCart ? `${base} · ya tienes ${inCart} en tu carrito` : base;
      stockNote.classList.remove('size-stock-note--out');
      maxQty = available;
      setEnabled(true);
      addBtn.textContent = 'Agregar al carrito';
      if (quantity > maxQty) setQuantity(maxQty);
    }
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
      updateStockUI();
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
    updateStockUI();
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

  // Agregar al carrito: simulado. Si no hay sesión, primero pide iniciar sesión.
  const addBtn = document.getElementById('addToCartBtn');
  const productMsg = document.getElementById('productMsg');

  // Estado inicial: primer color y primera talla (ya con addBtn disponible)
  selectColor(product.colors[0]);

  addBtn.addEventListener('click', () => {
    if (!isLoggedIn()) {
      const redirect = encodeURIComponent(`producto.html?id=${product.id}`);
      window.location.href = `login.html?redirect=${redirect}`;
      return;
    }
    const sizeObj = product.sizes.find(s => s.label === selectedSize);
    const colorObj = product.colors.find(c => c.name === selectedColor);
    const added = addToCart(product, sizeObj, colorObj, quantity);
    if (added < 1) {
      productMsg.textContent = 'No hay más piezas disponibles de este color y talla.';
    } else {
      const totalTxt = `$${formatPrice(getEffectivePrice(product) * added)} MXN`;
      productMsg.textContent = `Agregado al carrito: ${added} x talla ${selectedSize}, color ${selectedColor} (${totalTxt}).`;
    }
    productMsg.hidden = false;
    updateStockUI();
  });

  // ---------- Productos relacionados ----------
  renderRelatedProducts(product, document.getElementById('relatedGrid'));
}