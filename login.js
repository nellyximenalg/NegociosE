// A qué página regresar después de iniciar sesión (viene del link que trajo al usuario aquí)
function getRedirectTarget() {
  const params = new URLSearchParams(window.location.search);
  const target = params.get('redirect');
  const allowed = ['inicio.html', 'carrito.html', 'perfil.html'];
  return allowed.includes(target) ? target : 'inicio.html';
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

// Autenticación simulada
// Tanto "Entrar" como "Crear cuenta" te dejan pasar guardando la sesión en localStorage.
function completeAuth(email) {
  localStorage.setItem('dahlia_logged_in', 'true');
  localStorage.setItem('dahlia_user_email', email);
  localStorage.setItem('dahlia_just_logged_in', 'true');
  window.location.href = getRedirectTarget();
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  completeAuth(email);
});

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('signupEmail').value.trim();
  completeAuth(email);
});