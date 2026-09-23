// Funciones compartidas de "sesión" simulada 

function isLoggedIn() {
  return localStorage.getItem('dahlia_logged_in') === 'true';
}


function getDisplayName() {
  const email = localStorage.getItem('dahlia_user_email');
  if (!email) return 'Invitada/o';
  const accounts = JSON.parse(localStorage.getItem('dahlia_accounts') || '{}');
  if (accounts[email] && accounts[email].name) return accounts[email].name;
  return email.split('@')[0];
}

// Validación simple de correo (formato básico: algo@algo.algo)
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Muestra un mensaje de error debajo de un campo de formulario
function setFieldError(inputEl, message) {
  clearFieldError(inputEl);
  if (!message) return;
  inputEl.classList.add('field-invalid');
  const err = document.createElement('span');
  err.className = 'field-error';
  err.textContent = message;
  inputEl.insertAdjacentElement('afterend', err);
}

function clearFieldError(inputEl) {
  inputEl.classList.remove('field-invalid');
  const next = inputEl.nextElementSibling;
  if (next && next.classList.contains('field-error')) {
    next.remove();
  }
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;

  
  toast.classList.remove('show');
  void toast.offsetWidth;
  toast.classList.add('show');

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Prueba si la primera foto real del producto (primer color) existe y, si
// carga bien, la pone como fondo de la tarjeta. Si no existe todavía o falla,
// se queda con el degradado que ya estaba puesto como respaldo.
function setCardImage(el, product) {
  const firstColor = product.colors && product.colors[0];
  const firstImg = firstColor && firstColor.images && firstColor.images[0];
  if (!firstImg) return;

  const test = new Image();
  test.onload = () => {
    el.style.backgroundImage = `url('${firstImg}')`;
    el.style.backgroundColor = '#211d17';
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.backgroundPosition = 'center';
  };
  test.src = firstImg;
}

// Aplica setCardImage a todas las tarjetas de un contenedor de catálogo,
// usando el atributo data-product-id que cada tarjeta debe traer.
function applyCardImages(container) {
  if (!container || typeof PRODUCTS === 'undefined') return;
  container.querySelectorAll('[data-product-id]').forEach(el => {
    const id = parseInt(el.dataset.productId, 10);
    const product = PRODUCTS.find(p => p.id === id);
    if (product) setCardImage(el, product);
  });
}