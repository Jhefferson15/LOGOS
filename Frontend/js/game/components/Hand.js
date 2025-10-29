export class Hand {
    constructor(handEl, createCardElement, isValidPlay, handleCardPlay) {
        this.handEl = handEl;
        this.createCardElement = createCardElement; // Function from Game to create card elements
        this.isValidPlay = isValidPlay; // Function from Game to check if a card is playable
        this.handleCardPlay = handleCardPlay; // Callback from Game for card click
    }

    renderPlayerHand(player) {
        this.handEl.innerHTML = '';
        player.hand.forEach(cardData => {
            const cardEl = this.createCardElement(cardData);
            if (this.isValidPlay(cardData)) {
                cardEl.classList.add('playable');
            }
            cardEl.addEventListener('click', () => this.handleCardPlay(cardData.id));
            this.handEl.appendChild(cardEl);
        });
    }

    renderOpponentHand(player) {
        this.handEl.innerHTML = '';
        for (let i = 0; i < player.hand.length; i++) {
            this.handEl.appendChild(this.createCardElement(null, false));
        }
    }
}