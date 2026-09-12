// A qué página regresar después de iniciar sesión.
// Por default manda a Perfil; si vienes del carrito o de un producto, regresa ahí.
function getRedirectTarget() {
  const params = new URLSearchParams(window.location.search);
  const target = params.get('redirect');
  if (!target) return 'perfil.html';

  const allowed = ['inicio.html', 'carrito.html', 'perfil.html'];
  if (allowed.includes(target)) return target;
  if (/^producto\.html\?id=\d+$/.test(target)) return target;
  return 'perfil.html';
}

// Pestañas: Iniciar sesión / Crear cuenta
const tabLogin = document.getElementById('tabLogin');
const tabSignup = document.getElementById('tabSignup');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

function showLogin() {
  tabLogin.classList.add('active');
  tabSignup.classList.remove('active');
  loginForm.classList.add('active');
  signupForm.classList.remove('active');
}

function showSignup() {
  tabSignup.classList.add('active');
  tabLogin.classList.remove('active');
  signupForm.classList.add('active');
  loginForm.classList.remove('active');
}

tabLogin.addEventListener('click', showLogin);
tabSignup.addEventListener('click', showSignup);

// Login simulado: ningún campo es obligatorio. Si escribes un correo, se
// revisa que tenga formato válido; si lo dejas vacío, entra de todos modos.
// Siempre muestra el mensaje de "sesión iniciada" al entrar.
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const emailInput = document.getElementById('loginEmail');
  const email = emailInput.value.trim();

  if (email && !isValidEmail(email)) {
    setFieldError(emailInput, 'Ingresa un correo válido, ej: tu@correo.com');
    return;
  }
  clearFieldError(emailInput);

  localStorage.setItem('dahlia_logged_in', 'true');
  localStorage.setItem('dahlia_user_email', email);
  localStorage.setItem('dahlia_just_logged_in', 'true');

  window.location.href = getRedirectTarget();
});

// Registro simulado: ningún campo es obligatorio. No inicia sesión
// automáticamente. Solo confirma el registro y te regresa a la pestaña

const signupMsg = document.getElementById('signupMsg');

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const nameInput = document.getElementById('signupName');
  const emailInput = document.getElementById('signupEmail');
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (email && !isValidEmail(email)) {
    setFieldError(emailInput, 'Ingresa un correo válido, ej: tu@correo.com');
    return;
  }
  clearFieldError(emailInput);

  // Guardamos el nombre para poder mostrarlo después en el perfil (simulado)
  if (email) {
    const accounts = JSON.parse(localStorage.getItem('dahlia_accounts') || '{}');
    accounts[email] = { name };
    localStorage.setItem('dahlia_accounts', JSON.stringify(accounts));
  }

  signupForm.reset();
  signupMsg.textContent = 'Cuenta creada correctamente (simulado).';
  signupMsg.hidden = false;

  setTimeout(() => {
    signupMsg.hidden = true;
    showLogin();
    if (email) {
      document.getElementById('loginEmail').value = email;
    }
  }, 1400);
});