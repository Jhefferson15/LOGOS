export function initSymposiumScreen(gameState, updateDynamicUI, toast) {
    updateDynamicUI();
}

export function handleSymposiumScreenClick(e, gameState, updateDynamicUI, toast) {
    const t = e.target;
    if (t.closest('.action-button')) {
        if (t.closest('#symposium-screen')) toast.show('Iniciando o evento...', 'info');
    }
}