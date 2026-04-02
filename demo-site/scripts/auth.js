// Вход
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[login];

    if (!user) {
        alert('Пользователь не найден!');
        return;
    }

    if (user.password !== password) {
        alert('Неверный пароль!');
        return;
    }

    localStorage.setItem('user', JSON.stringify(user));
    window.location.href = 'courses.html';
});

// Регистрация
document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[login]) {
        alert('Пользователь с таким логином уже существует!');
        return;
    }

    const newUser = { email, login, password, role };
    users[login] = newUser;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(newUser));

    if (role === 'student') {
        localStorage.setItem(`progress_${login}`, JSON.stringify({}));
    }

    window.location.href = 'courses.html';
});

// Выход
function logout() {
    if (confirm("Вы действительно хотите выйти?")) {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
}

// Привязка обработчиков
document.addEventListener('DOMContentLoaded', () => {
    const logoutButtons = document.querySelectorAll('#logoutBtn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', logout);
    });
});