const AUTH_USER = 'apolline';
const AUTH_HASH = 'db8d37e39666a6e8af88524f47dd53d5997b0db77d8d85d8524a185de977460b';

function checkSession() {
  return sessionStorage.getItem('apo_auth') === '1' || localStorage.getItem('apo_auth') === '1';
}

function setSession(remember) {
  if (remember) localStorage.setItem('apo_auth', '1');
  else sessionStorage.setItem('apo_auth', '1');
}

function clearSession() {
  sessionStorage.removeItem('apo_auth');
  localStorage.removeItem('apo_auth');
}

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('');
}

async function handleLogin(e) {
  e.preventDefault();
  const user = document.getElementById('login-user').value.trim().toLowerCase();
  const pin  = document.getElementById('login-pin').value;
  const remember = document.getElementById('login-remember').checked;

  const hash = await sha256(pin);

  if (user !== AUTH_USER || hash !== AUTH_HASH) {
    const err  = document.getElementById('login-error');
    const card = document.getElementById('login-card');
    err.textContent = 'Identifiant ou code incorrect';
    err.hidden = false;
    card.classList.add('shake');
    setTimeout(() => card.classList.remove('shake'), 500);
    return;
  }

  setSession(remember);
  mountApp();
}

function mountApp() {
  document.getElementById('login-screen').hidden = true;
  document.getElementById('app').hidden = false;
  lucide.createIcons();
  initApp();
}

function logout() {
  clearSession();
  document.getElementById('app').hidden = true;
  document.getElementById('login-screen').hidden = false;
  document.getElementById('login-pin').value = '';
  document.getElementById('login-error').hidden = true;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  if (checkSession()) {
    mountApp();
  } else {
    lucide.createIcons();
  }
});
