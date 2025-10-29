export class Card {
    constructor(cardData, isFaceUp = true) {
        this.cardData = cardData;
        this.isFaceUp = isFaceUp;
        this.element = this.createCardElement();
    }

    createCardElement() {
        const cardEl = document.createElement('div');
        cardEl.classList.add('card');
        
        if (!this.isFaceUp) {
            cardEl.classList.add('card-back');
            cardEl.innerHTML = '<div class="card-back-text">LOGOS</div>'; // Add text for card back
            return cardEl;
        }

        const schoolClass = `school-${this.cardData.school.toLowerCase().replace(/ /g, '-')}`;
        cardEl.classList.add(schoolClass);
        cardEl.dataset.id = this.cardData.id;

        cardEl.innerHTML = `
            <div class="card-name">${this.cardData.name}</div>
            <div class="card-school">${this.cardData.school}</div>
        `;
        return cardEl;
    }

    get id() {
        return this.cardData.id;
    }

    get element() {
        return this._element;
    }

    set element(el) {
        this._element = el;
    }

    addPlayableClass() {
        this.element.classList.add('playable');
    }

    removePlayableClass() {
        this.element.classList.remove('playable');
    }

    // You can add more methods here for card animations, etc.
}