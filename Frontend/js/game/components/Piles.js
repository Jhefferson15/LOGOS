export class Piles {
    constructor(drawPileEl, discardPileEl, createCardElement) {
        this.drawPileEl = drawPileEl;
        this.discardPileEl = discardPileEl;
        this.createCardElement = createCardElement; // Function from Game to create card elements
    }

    render(deckLength, topCard) {
        this.drawPileEl.innerHTML = '';
        if(deckLength > 0) {
            this.drawPileEl.appendChild(this.createCardElement(null, false));
        }

        this.discardPileEl.innerHTML = '';
        if (topCard) {
            this.discardPileEl.appendChild(this.createCardElement(topCard));
        }
    }
}