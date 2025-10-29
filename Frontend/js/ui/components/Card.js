export class Card {
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

    static createConcept(conceptData) {
        const cardEl = document.createElement('div');
        cardEl.className = 'card concept-card';
        cardEl.innerHTML = `<span class="name">${conceptData.name}</span><span class="points">${conceptData.points} pts</span>`;
        return cardEl;
    }
}