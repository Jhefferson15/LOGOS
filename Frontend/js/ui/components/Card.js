/**
 * Component for creating Card elements.
 */
export class Card {
    /**
     * Creates a philosopher card element.
     * @param {object} cardData - Data for the card.
     * @param {boolean} [isBack=false] - Whether to render the back of the card.
     * @returns {HTMLElement} The created card element.
     */
    static create(cardData, isBack = false) {
        const cardEl = document.createElement('div');
        if (isBack) {
            cardEl.className = 'card card-back';
            if (Math.random() > 0.8) {
                cardEl.classList.add('logo');
                cardEl.innerHTML = `<span>LOGOS</span>`;
            }
            return cardEl;
        }

        cardEl.className = 'card philosopher-card';
        const schoolClass = 'c-escola-' + cardData.school.toLowerCase().replace(' ', '-');
        cardEl.classList.add(schoolClass);
        cardEl.innerHTML = `<span class="name">${cardData.name}</span><span class="school">${cardData.school}</span>`;

        return cardEl;
    }

    /**
     * Creates a concept card element.
     * @param {object} conceptData - Data for the concept.
     * @returns {HTMLElement} The created concept card element.
     */
    static createConcept(conceptData) {
        const cardEl = document.createElement('div');
        cardEl.className = 'card concept-card';
        cardEl.innerHTML = `<span class="name">${conceptData.name}</span><span class="points">${conceptData.points} pts</span>`;
        return cardEl;
    }
}