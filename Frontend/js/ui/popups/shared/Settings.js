
/**
 * Módulo para o popup de Configurações.
 */
export const SettingsPopup = {
    title: 'Configurações',

    /**
     * Gera o HTML do conteúdo do popup.
     * @param {object} data - Dados para renderização (não utilizado neste popup).
     * @returns {string} HTML do conteúdo do popup.
     */
    getHTML: (data) => {
        return `
            <div class="settings-popup">
                <div class="settings-section">
                    <h4><i class="fas fa-volume-up"></i> Áudio</h4>
                    <div class="setting-item">
                        <span>Música</span>
                        <div class="range-slider"><input type="range" min="0" max="100" value="80"></div>
                    </div>
                    <div class="setting-item">
                        <span>Efeitos Sonoros</span>
                        <div class="range-slider"><input type="range" min="0" max="100" value="100"></div>
                    </div>
                </div>
                <div class="settings-section">
                    <h4><i class="fas fa-user-circle"></i> Conta</h4>
                    <button class="action-button-secondary"><i class="fab fa-google"></i> Vincular ao Google</button>
                    <button class="action-button-secondary"><i class="fab fa-facebook"></i> Vincular ao Facebook</button>
                </div>
                <div class="settings-section">
                    <h4><i class="fas fa-info-circle"></i> Outros</h4>
                    <button id="fullscreen-btn" class="action-button-secondary"><i class="fas fa-expand"></i> <span>Tela Cheia</span></button>
                    <button class="action-button-secondary">Termos de Serviço</button>
                    <button class="action-button-secondary">Política de Privacidade</button>
                    <button id="logout-btn" class="action-button red">Sair da Conta</button>
                </div>
            </div>
        `;
    },

    /**
     * Configura os event listeners para o popup.
     * @param {HTMLElement} element - O elemento do corpo do modal onde o HTML foi injetado.
     * @param {object} data - Dados para configuração (não utilizado neste popup).
     */
    setupListeners: (element, data) => {
        const setupFullscreenButton = () => {
            const fullscreenButton = element.querySelector('#fullscreen-btn');
            if (!fullscreenButton) return;
            const buttonIcon = fullscreenButton.querySelector('i');
            const buttonText = fullscreenButton.querySelector('span');

            const updateButtonUI = () => {
                if (document.fullscreenElement) {
                    buttonIcon.classList.remove('fa-expand'); buttonIcon.classList.add('fa-compress');
                    buttonText.textContent = 'Sair da Tela Cheia';
                } else {
                    buttonIcon.classList.remove('fa-compress'); buttonIcon.classList.add('fa-expand');
                    buttonText.textContent = 'Tela Cheia';
                }
            };

            fullscreenButton.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => console.error(`Erro: ${err.message}`));
                } else {
                    document.exitFullscreen();
                }
            });
            document.addEventListener('fullscreenchange', updateButtonUI);
            updateButtonUI();
        };

        setupFullscreenButton();
        
        const logoutBtn = element.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('isLoggedIn');
                window.location.reload();
            });
        }
    }
};
