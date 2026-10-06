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

// Botones de "mostrar/ocultar contraseña"
document.querySelectorAll('.input-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.toggle);
    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    btn.classList.toggle('is-visible', !showing);
    btn.setAttribute('aria-label', showing ? 'Mostrar contraseña' : 'Ocultar contraseña');
  });
});

// Login simulado
// Siempre muestra el mensaje de "sesión iniciada" al entrar.
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();

  localStorage.setItem('dahlia_logged_in', 'true');
  localStorage.setItem('dahlia_user_email', email);
  localStorage.setItem('dahlia_user_role', 'cliente');
  localStorage.setItem('dahlia_just_logged_in', 'true');

  window.location.href = getRedirectTarget();
});

// ---------- Acceso de administrador (modal aparte) ----------
// Se abre con el enlace "¿Eres admin?" y, igual que el login normal, no
// valida ningún campo: con solo enviarlo ya entras como administrador.
const adminLoginLink = document.getElementById('adminLoginLink');
const adminLoginModal = document.getElementById('adminLoginModal');
const adminLoginForm = document.getElementById('adminLoginForm');

function openAdminLoginModal() {
  adminLoginModal.classList.add('open');
  document.body.classList.add('modal-open');
}

function closeAdminLoginModal() {
  adminLoginModal.classList.remove('open');
  document.body.classList.remove('modal-open');
}

adminLoginLink.addEventListener('click', (event) => {
  event.preventDefault();
  openAdminLoginModal();
});

document.getElementById('adminLoginClose').addEventListener('click', closeAdminLoginModal);
adminLoginModal.addEventListener('click', (event) => {
  if (event.target === adminLoginModal) closeAdminLoginModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && adminLoginModal.classList.contains('open')) closeAdminLoginModal();
});

adminLoginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.getElementById('adminLoginEmail').value.trim() || ADMIN_EMAIL;

  localStorage.setItem('dahlia_logged_in', 'true');
  localStorage.setItem('dahlia_user_email', email);
  localStorage.setItem('dahlia_user_role', 'admin');
  localStorage.setItem('dahlia_just_logged_in', 'true');

  window.location.href = 'admin.html';
});

// Registro simulado: ningún campo es obligatorio ni se valida. No inicia
// sesión automáticamente. Solo confirma el registro y te regresa a la
// pestaña de "Iniciar sesión"
const signupMsg = document.getElementById('signupMsg');

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const phone = document.getElementById('signupPhone').value.trim();
  const birthdate = document.getElementById('signupBirthdate').value;

  // Guardamos los datos para poder mostrarlos después en el perfil
  if (email) {
    const accounts = JSON.parse(localStorage.getItem('dahlia_accounts') || '{}');
    accounts[email] = { ...(accounts[email] || {}), name, phone, birthdate };
    localStorage.setItem('dahlia_accounts', JSON.stringify(accounts));
  }

  signupForm.reset();
  signupMsg.textContent = 'Cuenta creada correctamente.';
  signupMsg.hidden = false;

  setTimeout(() => {
    signupMsg.hidden = true;
    showLogin();
    if (email) {
      document.getElementById('loginEmail').value = email;
    }
  }, 1400);
});