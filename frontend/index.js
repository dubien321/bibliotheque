
const STORAGE_KEY = 'biblioSession';
const STATIC_USER = {
    name: 'Admin',
    email: 'admin@biblio.cg',
    password: 'admin1234'
};

const modal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const heroLoginBtn = document.getElementById('openLoginFromHero');
const loggedStatus = document.getElementById('loggedStatus');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const closeModalBtn = document.getElementById('closeModal');

function getSession() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
        return null;
    }
}

function saveSession() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        isLoggedIn: true,
        user: STATIC_USER.name,
        email: STATIC_USER.email
    }));
}

function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
}

function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
}

function updateUi() {
    const session = getSession();
    const isLogged = !!session?.isLoggedIn;

    if (isLogged) {
        loginBtn.textContent = 'Admin';
        loginBtn.disabled = true;
        loginBtn.style.opacity = '0.9';
        loggedStatus.classList.add('visible');
        loggedStatus.querySelector('span').textContent = 'Connecté en tant qu’Admin';
    } else {
        loginBtn.textContent = 'Connexion';
        loginBtn.disabled = false;
        loginBtn.style.opacity = '1';
        loggedStatus.classList.remove('visible');
    }
}

loginBtn.addEventListener('click', openModal);
heroLoginBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
});

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (email === STATIC_USER.email && password === STATIC_USER.password) {
        saveSession();
        updateUi();
        loginMessage.className = 'form-message success';
        loginMessage.textContent = 'Connexion réussie. Redirection vers le dashboard...';

        setTimeout(() => {
            closeModal();
            window.location.href = 'pages/dashboards/dashbord.html';
        }, 800);
    } else {
        loginMessage.className = 'form-message error';
        loginMessage.textContent = 'Identifiants incorrects. Essayez admin@biblio.cg / admin123';
    }
});

updateUi();
