import { LogosGame } from './game/Game.js';

document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');
    const gameBoard = document.getElementById('game-board');
    const gameModeBtns = document.querySelectorAll('.game-mode-btn');
    const cardConnectionBtns = document.querySelectorAll('.card-connection-btn');

    let gameMode = 'offline';
    let cardConnectionMode = 'school';

    gameModeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            gameModeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameMode = btn.dataset.mode;
        });
    });

    cardConnectionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            cardConnectionBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            cardConnectionMode = btn.dataset.mode;
        });
    });

    startBtn.addEventListener('click', () => {
        startScreen.classList.add('fade-out');
        setTimeout(() => {
            startScreen.style.display = 'none';
            gameBoard.style.display = 'flex';
            new LogosGame(gameMode, cardConnectionMode);
        }, 500);
    });
});