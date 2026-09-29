const loggedIn = isLoggedIn();
const email = localStorage.getItem('dahlia_user_email') || '';
const account = loggedIn ? getAccount(email) : {};
const rawName = getDisplayName();
const displayName = loggedIn ? (rawName === 'Invitada/o' ? 'Cliente Dahlia' : rawName) : 'Invitada/o';

document.getElementById('profileGreeting').textContent = loggedIn ? `Hola, ${displayName}` : 'No hay sesión activa';
document.getElementById('profileEmailText').textContent = loggedIn
  ? (email ? `Sesión iniciada como: ${email}` : 'Sesión iniciada (sin correo registrado).')
  : 'Inicia sesión para ver tu perfil.';

document.getElementById('accountLayout').hidden = !loggedIn;
document.getElementById('loggedOutPanel').hidden = loggedIn;

if (loggedIn) {
  // ---------- Pestañas: Pedidos / Configuración de la cuenta ----------
  const navButtons = document.querySelectorAll('.account-nav-btn[data-panel]');
  const panels = document.querySelectorAll('.account-panel');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      panels.forEach(p => p.classList.toggle('active', p.id === `panel-${btn.dataset.panel}`));
    });
  });

  // ---------- Cerrar sesión ----------
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('dahlia_logged_in');
    localStorage.removeItem('dahlia_user_email');
    window.location.href = 'index.html';
  });

  // ---------- Editar mi información ----------
  document.getElementById('infoName').value = account.name || '';
  document.getElementById('infoEmail').value = email;
  document.getElementById('infoPhone').value = account.phone || '';
  document.getElementById('infoBirthdate').value = account.birthdate || '';

  const infoForm = document.getElementById('infoForm');
  const infoMsg = document.getElementById('infoMsg');
  infoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    saveAccount(email, {
      name: document.getElementById('infoName').value.trim(),
      phone: document.getElementById('infoPhone').value.trim(),
      birthdate: document.getElementById('infoBirthdate').value
    });
    document.getElementById('profileGreeting').textContent = `Hola, ${getDisplayName()}`;
    infoMsg.textContent = 'Información guardada.';
    infoMsg.hidden = false;
  });

  // ---------- Contraseña ----------
  const passwordForm = document.getElementById('passwordForm');
  const passwordMsg = document.getElementById('passwordMsg');
  passwordForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!newPassword || newPassword !== confirmPassword) {
      passwordMsg.textContent = 'Las contraseñas no coinciden.';
      passwordMsg.hidden = false;
      passwordMsg.classList.add('contact-msg--error');
      return;
    }

    passwordMsg.classList.remove('contact-msg--error');
    passwordForm.reset();
    passwordMsg.textContent = 'Contraseña actualizada.';
    passwordMsg.hidden = false;
  });

  // ---------- Dirección de envío ----------
  const address = account.address || {};
  document.getElementById('addrStreet').value = address.street || '';
  document.getElementById('addrColonia').value = address.colonia || '';
  document.getElementById('addrCity').value = address.city || '';
  document.getElementById('addrState').value = address.state || '';
  document.getElementById('addrZip').value = address.zip || '';
  document.getElementById('addrCountry').value = address.country || 'México';

  const addressForm = document.getElementById('addressForm');
  const addressMsg = document.getElementById('addressMsg');
  addressForm.addEventListener('submit', (event) => {
    event.preventDefault();
    saveAccount(email, {
      address: {
        street: document.getElementById('addrStreet').value.trim(),
        colonia: document.getElementById('addrColonia').value.trim(),
        city: document.getElementById('addrCity').value.trim(),
        state: document.getElementById('addrState').value.trim(),
        zip: document.getElementById('addrZip').value.trim(),
        country: document.getElementById('addrCountry').value.trim()
      }
    });
    addressMsg.textContent = 'Dirección guardada.';
    addressMsg.hidden = false;
  });

  // ---------- Método de pago ----------
  // Por seguridad (aunque todo sea simulado) solo guardamos los últimos 4
  // dígitos de la tarjeta, nunca el número completo ni el CVV.
  const savedCardInfo = document.getElementById('savedCardInfo');

  function renderSavedCard() {
    const payment = getAccount(email).payment;
    if (!payment) {
      savedCardInfo.hidden = true;
      return;
    }
    savedCardInfo.hidden = false;
    savedCardInfo.textContent = `Tarjeta guardada: ${payment.name} · terminada en ${payment.last4} · vence ${payment.expiry}`;
  }
  renderSavedCard();

  const paymentForm = document.getElementById('paymentForm');
  const paymentMsg = document.getElementById('paymentMsg');
  paymentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const cardName = document.getElementById('cardName').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s+/g, '');
    const cardExpiry = document.getElementById('cardExpiry').value.trim();

    saveAccount(email, {
      payment: {
        name: cardName,
        last4: cardNumber.slice(-4),
        expiry: cardExpiry
      }
    });

    paymentForm.reset();
    renderSavedCard();
    paymentMsg.textContent = 'Método de pago guardado.';
    paymentMsg.hidden = false;
  });
}