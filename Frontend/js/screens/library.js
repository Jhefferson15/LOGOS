export function initLibraryScreen(gameState, updateDynamicUI, toast) {
    updateDynamicUI();
}

export function handleLibraryScreenClick(e, gameState, updateDynamicUI, toast) {
    const t = e.target;
    if (t.closest('.action-button')) {
        if (t.closest('#library-screen')) toast.show('Obra adquirida com sucesso!', 'success');
    }
}