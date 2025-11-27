/**
 * Initializes the Schools Screen.
 * Currently only updates the dynamic UI.
 * @module Screens/Schools
 * @param {object} gameState - The global game state.
 * @param {function} updateDynamicUI - Function to refresh the UI.
 * @param {object} toast - Toast notification utility.
 */
export function initSchoolsScreen(gameState, updateDynamicUI, toast) {
    updateDynamicUI();
}

/**
 * Handles click events on the Schools Screen.
 * Manages navigation to specific school member lists.
 * @param {Event} e - The click event object.
 * @param {object} gameState - The global game state.
 * @param {function} updateDynamicUI - Function to refresh the UI.
 * @param {object} toast - Toast notification utility.
 * @returns {Object|null} Navigation action object if a navigation is triggered, null otherwise.
 */
export function handleSchoolsScreenClick(e, gameState, updateDynamicUI, toast) {
    const button = e.target.closest('.action-button');
    if (!button) return null;

    if (button.textContent.trim() === 'Abrir') {
        const clanItem = e.target.closest('.clan-item');
        if (clanItem) {
            const schoolNameElement = clanItem.querySelector('.clan-info strong');
            if (schoolNameElement) {
                const schoolName = schoolNameElement.textContent.trim();

                // Mapeia o nome de exibição para o nome de dados (ex: 'Racionalistas' -> 'Racionalismo')
                let schoolId = schoolName;
                if (schoolName.endsWith('s')) {
                    schoolId = schoolName.slice(0, -1); // Remove o 's' do plural
                }
                if (schoolName === 'Sofistas da Depressão') {
                    schoolId = 'Sofismo';
                }

                // Retorna uma ação de navegação para o main.js
                return {
                    action: 'navigate',
                    screen: 'school_members',
                    params: { school: schoolId }
                };
            }
        }
    } else if (button.querySelector('.fa-search')) {
        toast.show('Funcionalidade de busca em desenvolvimento!', 'info');
    }

    return null;
}