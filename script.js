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

// Newsletter simulado: no hay backend ni base de datos todavía,
// guardamos los correos en localStorage como si fuera una lista de suscriptores.
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMsg = document.getElementById('newsletterMsg');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput.value.trim();

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

// Nav: muestra "Iniciar sesión" o "Mi cuenta" según si hay sesión activa
const navAuthLink = document.getElementById('navAuthLink');
if (navAuthLink) {
  if (isLoggedIn()) {
    navAuthLink.textContent = 'Mi cuenta';
    navAuthLink.setAttribute('href', 'perfil.html');
  } else {
    navAuthLink.textContent = 'Iniciar sesión';
    navAuthLink.setAttribute('href', 'login.html');
  }
}

// Carrito: si no has iniciado sesión, te manda a la pantalla de login
// (y de ahí regresas directo al carrito). Si ya iniciaste sesión, te lleva
// a la página del carrito.
const cartBtn = document.getElementById('cartBtn');
if (cartBtn) {
  cartBtn.addEventListener('click', () => {
    if (!isLoggedIn()) {
      window.location.href = 'login.html?redirect=carrito.html';
    } else {
      window.location.href = 'carrito.html';
    }
  });
}

// Formulario de contacto simulado: no hay backend ni base de datos todavía.
const contactForm = document.getElementById('contactForm');
const contactMsg = document.getElementById('contactMsg');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    const messages = JSON.parse(localStorage.getItem('dahlia_contact_messages') || '[]');
    messages.push({ name, email, message, date: new Date().toISOString() });
    localStorage.setItem('dahlia_contact_messages', JSON.stringify(messages));

    contactForm.reset();
    contactMsg.textContent = 'Mensaje enviado.';
    contactMsg.hidden = false;
  });
}

// Destacados en Inicio: renderiza productos reales desde products.js
const featuredGrid = document.getElementById('featuredGrid');
if (featuredGrid && typeof PRODUCTS !== 'undefined') {
  const featured = PRODUCTS.filter(p => p.featured);
  featuredGrid.innerHTML = featured.map(p => `
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
      <a href="producto.html?id=${p.id}" class="btn btn-ghost prod-detail-btn">Ver detalles</a>
    </div>
  `).join('');
}

// "Recién llegado" en la landing: renderiza productos de la categoría novedades
const novedadesGrid = document.getElementById('novedadesGrid');
if (novedadesGrid && typeof PRODUCTS !== 'undefined') {
  const novedades = PRODUCTS.filter(p => p.category === 'novedades');
  novedadesGrid.innerHTML = novedades.map(p => `
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
      <a href="producto.html?id=${p.id}" class="btn btn-ghost prod-detail-btn">Ver detalles</a>
    </div>
  `).join('');
}