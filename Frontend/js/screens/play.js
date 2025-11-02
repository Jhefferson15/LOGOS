import { arenas } from '../../js/data/arenas.js';
import { popupManager } from '../../js/ui/PopupManager.js';


export function initPlayScreen(gameState, updateDynamicUI, toast) {
    // Código de inicialização da tela, permanece o mesmo.
    const arena = arenas[0];
    const arenaSection = document.querySelector('.arena-section');
    if (arenaSection) {
        arenaSection.style.backgroundImage = `url('${arena.image}')`;
        const arenaName = arenaSection.querySelector('.arena-name');
        if (arenaName) {
            arenaName.innerText = arena.name;
        }
    }
    updateDynamicUI();
}

/**
 * Função principal que trata os cliques na tela de menu.
 * @param {Event} e - O objeto do evento de clique.
 * @param {object} gameState - O estado atual do jogo.
 * @param {function} updateDynamicUI - Função para atualizar a UI.
 * @param {object} toast - O objeto para mostrar notificações.
 */
export function handlePlayScreenClick(e, gameState, updateDynamicUI, toast) {
    const t = e.target;

    // --- LÓGICA DO BOTÃO DE BATALHA ---

    if (t.matches('.battle-button')) {
        // Desabilita o botão para evitar cliques múltiplos
        t.disabled = true;
        t.textContent = 'Carregando Batalha...';
        
        // Chama a nova função para carregar o jogo em um overlay.
        // Os caminhos são baseados no seu código original.
        loadGamePage(
            '/Frontend/views/game.html', 
            "/Frontend/css/screens/game.css", 
            '/Frontend/js/game/game.js'
        );
        return; // Encerra a função aqui
    }

    // --- FIM DA LÓGICA DO BOTÃO DE BATALHA ---

    // O restante do seu código para outros cliques permanece o mesmo.
    if (t.closest('.player-profile')) {
        popupManager.open('full-profile');
        return;
    }
    if (t.closest('.settings')) {
        popupManager.open('settings');
        return;
    }
    if (t.closest('.arena-section') && !t.matches('.battle-button')) {
        popupManager.open('arena-timeline');
        return;
    }
    if (t.closest('#free-chest')) {
        popupManager.open('timed-chest-info', { type: 'free' });
        return;
    }
    if (t.closest('#crown-chest')) {
        popupManager.open('timed-chest-info', { type: 'crown' });
        return;
    }
    const cs = t.closest('.chest-slot');
    if (cs) {
        const i = cs.dataset.index;
        const c = gameState.chestSlots[i];
        if (!c) return;

        if (t.classList.contains('open-btn')) {
            const chest = gameState.chestSlots[i];
            const rewards = { scrolls: 50, books: 1 };
            gameState.scrolls += rewards.scrolls;
            gameState.books += rewards.books;
            popupManager.open('chest-rewards', { chestType: chest.type, rewards: rewards });
            gameState.chestSlots[i] = null;
            // É importante chamar updateDynamicUI após modificar o estado
            updateDynamicUI(); 
            return;
        }
        if (c.status === 'locked' || c.status === 'unlocking') {
            popupManager.open('chest-info', { chest: c });
            return;
        }
    }
}


/**
 * Carrega dinamicamente o jogo em um overlay de tela cheia, 
 * preservando a estrutura da SPA original.
 * 
 * @param {string} htmlPath - Caminho para o arquivo .html do jogo.
 * @param {string} cssPath - Caminho para o arquivo .css do jogo.
 * @param {string} scriptPath - Caminho para o arquivo .js do jogo.
 */
async function loadGamePage(htmlPath, cssPath, scriptPath) {
    try {
        // 1. Fetch (buscar) o conteúdo do arquivo HTML do jogo
        const response = await fetch(htmlPath);
        if (!response.ok) throw new Error(`Não foi possível carregar ${htmlPath}`);
        const htmlString = await response.text();

        // 2. Parsear o HTML para extrair apenas o conteúdo do <body>
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const gameBodyContent = doc.body.innerHTML;

        // 3. Criar um container de overlay para o jogo
        const gameContainer = document.createElement('div');
        gameContainer.id = 'dynamic-game-container';
        gameContainer.style.position = 'fixed';
        gameContainer.style.top = '0';
        gameContainer.style.left = '0';
        gameContainer.style.width = '100vw';
        gameContainer.style.height = '100vh';
        gameContainer.style.zIndex = '9999'; // Garante que fique por cima de tudo

        // 4. Injetar o conteúdo do jogo no nosso container
        gameContainer.innerHTML = gameBodyContent;
        
        // 5. Adicionar o container à página principal (sem apagar a SPA)
        document.body.appendChild(gameContainer);

        // 6. Carregar o CSS do jogo dinamicamente no <head>
        const gameStyles = document.createElement('link');
        gameStyles.rel = 'stylesheet';
        gameStyles.href = cssPath;
        gameStyles.id = 'game-styles';
        document.head.appendChild(gameStyles);
        
        // 7. Carregar e EXECUTAR o JavaScript do jogo dinamicamente
        const gameScript = document.createElement('script');
        gameScript.src = scriptPath;
        gameScript.defer = true; // 'defer' garante que execute após o HTML do container ser processado
        gameScript.id = 'game-script';
        gameContainer.appendChild(gameScript); // Adiciona o script ao container

        // 8. Adicionar lógica para SAIR do jogo e limpar os recursos
        // Procuramos o botão de sair DENTRO do container que acabamos de criar
        const quitButton = gameContainer.querySelector('#quit-button');
        if (quitButton) {
            quitButton.addEventListener('click', () => {
                // Limpeza: remove o container do jogo, o CSS e o script
                gameContainer.remove();
                document.getElementById('game-styles')?.remove();
                
                // Reabilita o botão "Batalhar" na tela de play original
                const battleButton = document.querySelector('.battle-button');
                if (battleButton) {
                    battleButton.disabled = false;
                    battleButton.textContent = 'Batalhar';
                }
            });
        }

    } catch (error) {
        console.error("Erro ao carregar a página do jogo:", error);
        // Garante que o botão seja reabilitado se o carregamento falhar
        const battleButton = document.querySelector('.battle-button');
        if(battleButton) {
            battleButton.disabled = false;
            battleButton.textContent = 'Batalhar';
        }
    }
}