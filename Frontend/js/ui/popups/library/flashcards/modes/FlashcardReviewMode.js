import { FlashcardState } from '../../study/FlashcardState.js';

export const FlashcardReviewMode = {
    render: (card, philosopherId) => {
        return `
            <div class="study-area" style="min-height:400px; background:transparent; border:none;">
                <div class="flashcard-scene" onclick="this.querySelector('.flashcard').classList.toggle('flipped')">
                    <div class="flashcard">
                        <div class="card-face front">
                            <p class="card-content">${card.front}</p>
                            <div style="margin-top:20px; font-size:0.8rem; color:var(--fc-secondary)">Toque para virar</div>
                        </div>
                        <div class="card-face back">
                            <p class="card-content">${card.back || card.answer}</p>
                        </div>
                    </div>
                </div>
                <div class="controls active" style="opacity:1; pointer-events:all;">
                    <button class="btn-rev btn-fail" onclick="document.dispatchEvent(new CustomEvent('rate', {detail:0}))">Errei</button>
                    <button class="btn-rev btn-hard" onclick="document.dispatchEvent(new CustomEvent('rate', {detail:3}))">Difícil</button>
                    <button class="btn-rev btn-good" onclick="document.dispatchEvent(new CustomEvent('rate', {detail:4}))">Bom</button>
                    <button class="btn-rev btn-easy" onclick="document.dispatchEvent(new CustomEvent('rate', {detail:5}))">Fácil</button>
                </div>
            </div>
        `;
    },

    setupListeners: (card, philosopherId, onNext) => {
        document.addEventListener('rate', (e) => {
            FlashcardState.updateCardProgress(philosopherId, card.id, e.detail);
            if (onNext) onNext();
        }, { once: true });
    }
};
