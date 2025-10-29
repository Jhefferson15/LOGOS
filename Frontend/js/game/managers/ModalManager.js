export class ModalManager {
    constructor() {
        this.conceptPromptModal = document.getElementById('concept-prompt-modal');
        this.notificationModal = document.getElementById('notification-modal');
        this.gameOverModal = document.getElementById('game-over-modal');
        this.conceptPromptPhilosopherEl = document.getElementById('concept-prompt-philosopher');
        this.notificationMessageEl = document.getElementById('notification-message');
        this.winnerMessageEl = document.getElementById('winner-message');
    }

    showConceptPrompt(playedCard) {
        this.conceptPromptPhilosopherEl.textContent = `Você jogou ${playedCard.name}`;
        this.conceptPromptModal.style.display = 'flex';
    }

    hideConceptPrompt() {
        this.conceptPromptModal.style.display = 'none';
    }

    showNotification(message, duration) {
        this.notificationMessageEl.innerHTML = message;
        this.notificationModal.style.display = 'flex';
        setTimeout(() => {
            this.notificationModal.style.display = 'none';
        }, duration);
    }

    showGameOver(winner) {
        this.winnerMessageEl.textContent = `${winner.name} venceu!`;
        this.gameOverModal.style.display = 'flex';
    }
}