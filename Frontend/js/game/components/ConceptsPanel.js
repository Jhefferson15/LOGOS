export class ConceptsPanel {
    constructor(conceptsListEl, handleConceptPlay) {
        this.conceptsListEl = conceptsListEl;
        this.handleConceptPlay = handleConceptPlay; // Callback from Game class
    }

    render(playerConcepts) {
        this.conceptsListEl.innerHTML = '';
        playerConcepts.forEach(concept => {
            const conceptEl = document.createElement('div');
            conceptEl.classList.add('concept-card');
            if (concept.used) conceptEl.classList.add('used');
            conceptEl.innerHTML = `
                <div class="concept-card-header">
                    <span class="concept-name">${concept.name}</span>
                    <span class="concept-points">${concept.points} pts</span>
                </div>
                <p class="concept-description">${concept.description}</p>
            `;
            conceptEl.addEventListener('click', () => this.handleConceptPlay(concept.id));
            this.conceptsListEl.appendChild(conceptEl);
        });
    }

    addActivePromptClass() {
        this.conceptsListEl.querySelectorAll('.concept-card:not(.used)').forEach(el => el.classList.add('active-prompt'));
    }

    removeActivePromptClass() {
        this.conceptsListEl.querySelectorAll('.concept-card').forEach(el => el.classList.remove('active-prompt'));
    }
}