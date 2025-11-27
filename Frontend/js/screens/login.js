/**
 * Login Screen Logic.
 * Handles the login form submission and user authentication.
 * @module Screens/Login
 */
import { USERS } from '../data/login.js';
import { loginWithGoogle } from '../services/auth-service.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login-screen form');

    // Select the Google login button (assuming it's the first one or identifying by icon)
    const googleBtn = document.querySelector('.social-login-btn:has(.fa-google)') || document.querySelector('.social-login-btn');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            const password = e.target.querySelector('input[type="password"]').value;

            const user = USERS.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('isDemoMode', 'true'); // Set demo mode flag
                window.location.href = 'index.html';
            } else {
                alert('Credenciais inválidas!');
            }
        });
    }

    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            try {
                const user = await loginWithGoogle();
                if (user) {
                    // Redirect to game on success
                    localStorage.removeItem('isDemoMode'); // Ensure demo mode is off for real users
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.error("Google Login Failed:", error);
                alert("Falha no login com Google. Verifique o console para mais detalhes.");
            }
        });
    }
});
