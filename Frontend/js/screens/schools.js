export function initSchoolsScreen(gameState, updateDynamicUI, toast) {
    updateDynamicUI();
}

export function handleSchoolsScreenClick(e, gameState, updateDynamicUI, toast) {
    const t = e.target;
    if (t.closest('.action-button')) {
        if (t.closest('#schools-screen')) toast.show('Pedido de entrada enviado!', 'info');
    }
}