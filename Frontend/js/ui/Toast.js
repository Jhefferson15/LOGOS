
/**
 * Toast Notification Manager.
 * Handles the display of temporary notification messages.
 */
class Toast {
    /**
     * Creates a Toast instance.
     * Initializes the toast container if it doesn't exist.
     */
    constructor() {
        this.container = document.querySelector('.toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.classList.add('toast-container');
            document.body.appendChild(this.container);
        }
    }

    /**
     * Shows a toast message.
     * @param {string} message - The message to display.
     * @param {string} [type='info'] - The type of toast ('info', 'success', 'error').
     * @param {number} [duration=3000] - Duration in milliseconds.
     */
    show(message, type = 'info', duration = 3000) {
        const toastElement = document.createElement('div');
        toastElement.classList.add('toast', type);
        toastElement.textContent = message;

        this.container.appendChild(toastElement);

        // Force reflow to enable transition
        void toastElement.offsetWidth;

        toastElement.classList.add('show');

        setTimeout(() => {
            toastElement.classList.remove('show');
            toastElement.classList.add('hide');
            toastElement.addEventListener('transitionend', () => {
                toastElement.remove();
            }, { once: true });
        }, duration);
    }
}

export const toast = new Toast();
