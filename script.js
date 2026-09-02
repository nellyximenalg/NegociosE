// Menú hamburguesa (móvil) — solo aplica en páginas que tengan header con nav
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  // Cierra el menú al hacer clic en un link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Animación de aparición al hacer scroll
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
 
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
}

// guardamos los correos en localStorage como si fuera una lista de suscriptores.
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMsg = document.getElementById('newsletterMsg');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput.value.trim();
    if (!email) return;

    const emails = JSON.parse(localStorage.getItem('dahlia_newsletter_emails') || '[]');
    emails.push(email);
    localStorage.setItem('dahlia_newsletter_emails', JSON.stringify(emails));

    emailInput.value = '';
    newsletterMsg.textContent = '¡Gracias por unirte! Te avisaremos de nuestras novedades.';
    newsletterMsg.hidden = false;
  });
}

// Si ya iniciaste sesión
const newsletterClub = document.getElementById('newsletterClub');
if (newsletterClub && isLoggedIn()) {
  newsletterClub.style.display = 'none';
}

// Mensaje de bienvenida justo después de iniciar sesión (una sola vez)
if (localStorage.getItem('dahlia_just_logged_in') === 'true') {
  showToast('Sesión iniciada exitosamente');
  localStorage.removeItem('dahlia_just_logged_in');
}

// Carrito: si no has iniciado sesión, te pide hacerlo antes de ver tu carrito.

const cartBtn = document.getElementById('cartBtn');
if (cartBtn) {
  cartBtn.addEventListener('click', () => {
    if (!isLoggedIn()) {
      showToast('Inicia sesión para ver tu carrito');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1600);
    } else {
      window.location.href = 'carrito.html';
    }
  });
}

// Perfil: mismo comportamiento — requiere sesión iniciada.
const profileBtn = document.getElementById('profileBtn');
if (profileBtn) {
  profileBtn.addEventListener('click', () => {
    if (!isLoggedIn()) {
      showToast('Inicia sesión para ver tu perfil');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1600);
    } else {
      window.location.href = 'perfil.html';
    }
  });
}