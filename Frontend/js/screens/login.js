import { USERS } from '../data/login.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login-screen form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            const password = e.target.querySelector('input[type="password"]').value;

            const user = USERS.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'index.html';
            } else {
                alert('Credenciais inválidas!');
            }
        });
    }
});
