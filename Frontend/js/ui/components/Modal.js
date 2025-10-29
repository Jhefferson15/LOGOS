export class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.modal.addEventListener('click', (e) => {
            if (e.target.id === modalId || e.target.tagName === 'BUTTON') {
                this.hide();
            }
        });
    }

    show() {
        this.modal.style.display = 'flex';
    }

    hide() {
        this.modal.style.display = 'none';
    }

    setContent(content) {
        const contentElement = this.modal.querySelector('.modal-content');
        contentElement.innerHTML = content;
    }
}