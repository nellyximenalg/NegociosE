

function isLoggedIn() {
  return localStorage.getItem('dahlia_logged_in') === 'true';
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