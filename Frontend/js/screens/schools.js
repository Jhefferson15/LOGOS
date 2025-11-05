export function initSchoolsScreen(gameState, updateDynamicUI, toast) {
    updateDynamicUI();
}

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