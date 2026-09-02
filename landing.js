// Muestra/oculta el panel de "Iniciar sesión"
const loginToggle = document.getElementById('loginToggle');
const loginForm = document.getElementById('loginForm');

loginToggle.addEventListener('click', () => {
  const isOpen = loginForm.classList.toggle('open');
  loginToggle.setAttribute('aria-expanded', isOpen);
  if (isOpen) {
    document.getElementById('loginEmail').focus();
  }
});


loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();

  localStorage.setItem('dahlia_logged_in', 'true');
  localStorage.setItem('dahlia_user_email', email);
  localStorage.setItem('dahlia_just_logged_in', 'true');

  window.location.href = 'inicio.html';
});