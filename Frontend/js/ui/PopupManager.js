import { popupRegistry } from './popups/registry.js';

/**
 * Manages the display and interaction of modal popups in the application.
 * Handles opening, closing, and rendering specific popup content.
 */
class PopupManager {
    constructor() {
        this.container = null;
        this.titleElement = null;
        this.bodyElement = null;
        this.closeBtn = null;

        // Try to initialize immediately
        this._initElements();
    }

    /**
     * Initializes or re-initializes DOM elements and listeners.
     * Safe to call multiple times.
     * @returns {boolean} True if elements are ready, false otherwise.
     */
    _initElements() {
        const newContainer = document.getElementById('modal-container');

        // If container hasn't changed and is still in document, do nothing
        if (this.container === newContainer && document.body.contains(this.container)) {
            return true;
        }

        this.container = newContainer;
        this.titleElement = document.getElementById('modal-title');
        this.bodyElement = document.getElementById('modal-body');
        this.closeBtn = document.getElementById('modal-close-btn');

        if (!this.container || !this.closeBtn) {
            return false;
        }

        this._attachGlobalListeners();
        return true;
    }

    _attachGlobalListeners() {
        this.closeBtn.onclick = () => this.close();

        this.container.onclick = (e) => {
            if (e.target.classList.contains('modal-container')) {
                this.close();
            }
        };

        if (!this._keyDownListener) {
            this._keyDownListener = (e) => {
                if (e.key === 'Escape' && this.container && this.container.classList.contains('active')) {
                    this.close();
                }
            };
            document.addEventListener('keydown', this._keyDownListener);
        }
    }

    /**
     * Opens a specific popup with provided data.
     * @param {string} popupId - The unique identifier for the popup type.
     * @param {Object} [data={}] - Data required to render the popup content.
     */
    open(popupId, data = {}) {
        // Ensure elements are initialized before trying to open
        if (!this._initElements()) {
            console.error('PopupManager: Cannot open popup - modal elements not found in DOM.');
            return;
        }

        const popupModule = popupRegistry[popupId];
        if (popupModule) {
            const title = typeof popupModule.title === 'function'
                ? popupModule.title(data)
                : popupModule.title;

            const contentHTML = popupModule.getHTML(data);

            if (this.titleElement) {
                this.titleElement.innerText = title || '';
                this.titleElement.style.display = title === null ? 'none' : 'block';
            }

            if (this.bodyElement) {
                this.bodyElement.innerHTML = contentHTML;
            }

            if (popupModule.setupListeners && this.bodyElement) {
                popupModule.setupListeners(this.bodyElement, data, this);
            }

            this.container.classList.add('active');
            return;
        }

        console.error(`Popup com ID "${popupId}" não encontrado no registro.`);
    }

    /**
     * Closes the currently active popup.
     * @param {Function} [callback] - Optional callback to execute after the popup closes.
     */
    close(callback) {
        if (!this._initElements()) {
            if (callback && typeof callback === 'function') callback();
            return;
        }

        this.container.classList.remove('active');
        setTimeout(() => {
            if (this.bodyElement) this.bodyElement.innerHTML = '';
            if (callback && typeof callback === 'function') {
                callback();
            }
        }, 300);
    }
}

export const popupManager = new PopupManager();