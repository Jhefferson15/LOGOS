import { popupRegistry } from './popups/registry.js';


/**
 * Manages the display and interaction of modal popups in the application.
 * Handles opening, closing, and rendering specific popup content.
 */
class PopupManager {
    constructor() {
        this.container = document.getElementById('modal-container');
        this.titleElement = document.getElementById('modal-title');
        this.bodyElement = document.getElementById('modal-body');
        this.closeBtn = document.getElementById('modal-close-btn');

        this.closeBtn.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-container')) {
                this.close();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.container.classList.contains('active')) {
                this.close();
            }
        });
    }

    /**
     * Opens a specific popup with provided data.
     * @param {string} popupId - The unique identifier for the popup type.
     * @param {Object} [data={}] - Data required to render the popup content.
     */
    open(popupId, data = {}) {
        // Novo fluxo com registro
        const popupModule = popupRegistry[popupId];
        if (popupModule) {
            const title = typeof popupModule.title === 'function' 
                ? popupModule.title(data) 
                : popupModule.title;
                
            const contentHTML = popupModule.getHTML(data);

            this.titleElement.innerText = title;
            this.bodyElement.innerHTML = contentHTML;

            if (title === null) {
                this.titleElement.style.display = 'none';
            } else {
                this.titleElement.style.display = 'block';
            }

            if (popupModule.setupListeners) {
                popupModule.setupListeners(this.bodyElement, data);
            }

            this.container.classList.add('active');
            return;
        }

        console.error(`Popup com ID "${popupId}" não encontrado no registro.`);
    }

    close() {
        this.container.classList.remove('active');
        setTimeout(() => { this.bodyElement.innerHTML = ''; }, 300);
    }
}

export const popupManager = new PopupManager();