/**
 * Base Modal Component.
 * Handles basic modal functionality like showing, hiding, and setting content.
 */
export class Modal {
    /**
     * Creates a Modal instance.
     * @param {string} modalId - The ID of the modal element.
     */
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.modal.addEventListener('click', (e) => {
            if (e.target.id === modalId || e.target.tagName === 'BUTTON') {
                this.hide();
            }
        });
    }

    /**
     * Shows the modal.
     */
    show() {
        this.modal.style.display = 'flex';
    }

    /**
     * Hides the modal.
     */
    hide() {
        this.modal.style.display = 'none';
    }

    /**
     * Sets the content of the modal.
     * @param {string} content - HTML content to set.
     */
    setContent(content) {
        const contentElement = this.modal.querySelector('.modal-content');
        contentElement.innerHTML = content;
    }
}