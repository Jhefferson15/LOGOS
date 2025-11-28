/**
 * Módulo para gerenciar o layout dinâmico da aplicação,
 * adaptando a interface para diferentes tamanhos de tela e orientações.
 */

const DESKTOP_BREAKPOINT = 768;
let gameScreen;

/**
 * Verifica se a largura da viewport atual corresponde a uma visualização de desktop.
 * @returns {boolean} True se a largura da viewport for >= DESKTOP_BREAKPOINT.
 */
export const isDesktopView = () => window.innerWidth >= DESKTOP_BREAKPOINT;

/**
 * Alterna a visibilidade da barra lateral.
 */
export const toggleSidebar = () => {
    if (!gameScreen) return;
    gameScreen.classList.toggle('sidebar-collapsed');
    const isCollapsed = gameScreen.classList.contains('sidebar-collapsed');
    localStorage.setItem('sidebarState', isCollapsed ? 'collapsed' : 'expanded');
};


/**
 * Lida com o redimensionamento da janela.
 * Adiciona ou remove classes CSS com base nas dimensões da tela.
 */
const handleResize = () => {
    if (!gameScreen) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;

    // Lógica para modo paisagem/retrato
    if (width > height) {
        gameScreen.classList.add('landscape');
        gameScreen.classList.remove('portrait');
    } else {
        gameScreen.classList.add('portrait');
        gameScreen.classList.remove('landscape');
    }

    // Lógica para tela "quadrada" (aspect ratio próximo de 1)
    if (aspectRatio > 0.9 && aspectRatio < 1.1) {
        gameScreen.classList.add('square-aspect-ratio');
    } else {
        gameScreen.classList.remove('square-aspect-ratio');
    }

    console.log(`LayoutManager: Resize - W: ${width}, H: ${height}, Aspect Ratio: ${aspectRatio.toFixed(2)}`);

    checkLayoutIntegrity();
};

/**
 * Verifica se o layout está sendo aplicado corretamente via CSS.
 * Se detectar inconsistência (ex: desktop sem grid), tenta forçar classes ou logar erro.
 */
const checkLayoutIntegrity = () => {
    if (!gameScreen) return;

    if (isDesktopView()) {
        const computedStyle = window.getComputedStyle(gameScreen);
        if (computedStyle.display !== 'grid') {
            console.warn('LayoutManager: ALERTA - Layout Desktop detectado mas display não é GRID. Tentando corrigir...');
            // Força uma classe de "correção" se necessário, ou apenas alerta
            gameScreen.style.display = 'grid'; // Fallback forçado via JS
        } else {
            // Limpa estilo inline se o CSS estiver funcionando
            if (gameScreen.style.display === 'grid') {
                gameScreen.style.display = '';
            }
        }
    }
};

/**
 * Inicializa o gerenciador de layout.
 */
export const initLayoutManager = () => {
    gameScreen = document.querySelector('.game-screen');
    if (!gameScreen) {
        console.error('LayoutManager: Elemento .game-screen não encontrado.');
        return;
    }

    // Listeners de eventos
    window.addEventListener('resize', handleResize);

    // Verificação inicial
    handleResize();

    // Setup sidebar state from localStorage
    // Default to collapsed if no state is saved (or if explicitly collapsed)
    const savedState = localStorage.getItem('sidebarState');
    if (isDesktopView() && (savedState === 'collapsed' || !savedState)) {
        gameScreen.classList.add('sidebar-collapsed');
    }

    const sidebarToggleButton = document.getElementById('sidebar-toggle-btn');
    if (sidebarToggleButton) {
        sidebarToggleButton.addEventListener('click', toggleSidebar);
    }
};