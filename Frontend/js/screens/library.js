import { gameState } from '../data/gameState.js';
import { PHILOSOPHERS_DATA } from '../data/philosophers.js';
// Importe o seu arquivo de conteúdo de estudo.
import { STUDY_CONTENT_DATA } from '../data/study_content.js';
import { popupManager } from '../ui/PopupManager.js';
import { ImageService } from '../services/ImageService.js';

// --- Variáveis Globais do Módulo ---
let structuredData = {}; // Para armazenar os dados organizados por escola
let container; // O elemento principal que conterá a trilha de aprendizado
let activeMiniCard = null; // Rastreia o mini-card de lição que está aberto

/**
 * Inicializa a tela da Biblioteca (Árvore do Conhecimento).
 * Estrutura os dados, cria a trilha de aprendizado visual e atualiza a UI.
 * @module Screens/Library
 * @param {object} globalGameState - O estado global do jogo.
 * @param {function} updateDynamicUI - Função para atualizar a UI dinâmica.
 * @param {object} toast - Utilitário de notificações.
 */
export function initLibraryScreen(globalGameState, updateDynamicUI, toast) {
    container = document.getElementById('knowledge-tree-container');

    // 1. Estrutura os dados dos filósofos por escola de forma cronológica
    structurePhilosopherData();

    // 2. Cria os elementos visuais da trilha de aprendizado na DOM
    createKnowledgeTreeDOM();

    // 3. Atualiza a UI com base no progresso do jogador (nós desbloqueados, completos, etc.)
    updateTreeUI();
}

/**
 * Lida com cliques na tela da biblioteca.
 * Gerencia a abertura e fechamento do mini-card de lição e a navegação para o estudo.
 * @param {Event} e - O objeto do evento de clique.
 * @param {object} gameState - O estado global do jogo.
 * @param {function} updateDynamicUI - Função para atualizar a UI dinâmica.
 * @param {object} toast - Utilitário de notificações.
 */
export function handleLibraryScreenClick(e, gameState, updateDynamicUI, toast) {
    const nodeElement = e.target.closest('.philosopher-node');
    const isMiniCardClick = e.target.closest('.mini-lesson-card');

    // Se clicou em qualquer lugar que não seja um nó ou o mini-card, fecha o card aberto.
    if (!nodeElement && !isMiniCardClick) {
        closeMiniCard();
        return;
    }

    if (nodeElement) {
        const philosopherId = nodeElement.dataset.id;
        const nodeData = findNodeGlobally(philosopherId);

        // Verifica se o estudo está disponível (pré-requisitos cumpridos)
        if (checkPrerequisites(nodeData)) {
            // Em vez de abrir o estudo direto, abre o mini-card estilo Duolingo
            showMiniCard(nodeElement, nodeData);
        } else {
            toast.show('Complete os estudos anteriores para desbloquear!', 'info');
        }
    }
}

/**
 * Organiza os dados de PHILOSOPHERS_DATA em um formato agrupado por escola.
 * Garante a ordem cronológica para a construção da trilha.
 * @private
 */
function structurePhilosopherData() {
    structuredData = {};
    const philosopherIds = Object.keys(PHILOSOPHERS_DATA);

    // Ordena os filósofos por data para garantir a ordem correta das eras
    philosopherIds.sort((a, b) => PHILOSOPHERS_DATA[a].date - PHILOSOPHERS_DATA[b].date);

    for (const id of philosopherIds) {
        const philosopher = PHILOSOPHERS_DATA[id];
        const schoolKey = philosopher.school.toLowerCase().replace(/ /g, '_').replace(/-/g, '_');

        if (!structuredData[schoolKey]) {
            structuredData[schoolKey] = {
                title: philosopher.school,
                era: philosopher.era,
                nodes: []
            };
        }
        structuredData[schoolKey].nodes.push({
            id: id,
            name: philosopher.name,
            school: philosopher.school,
            image: philosopher.image,
            req: philosopher.predecessors || []
        });
    }
}

/**
 * Cria os elementos da trilha de aprendizado na página (estilo Duolingo).
 * Renderiza divisores de era e os nós de filósofos em um caminho sinuoso.
 * @private
 */
function createKnowledgeTreeDOM() {
    container.innerHTML = ''; // Limpa o contêiner
    let currentEra = '';

    for (const schoolKey in structuredData) {
        const schoolData = structuredData[schoolKey];

        // Adiciona o divisor de era (como o "UNIT X" do Duolingo)
        if (schoolData.era !== currentEra) {
            currentEra = schoolData.era;
            const eraDivider = document.createElement('div');
            eraDivider.className = `era-divider era-divider-${currentEra.toLowerCase()}`;
            eraDivider.innerHTML = `
                <div class="era-title-card">
                    UNIDADE: FILOSOFIA ${currentEra.toUpperCase()}
                </div>
                <h3 class="era-subtitle">${schoolData.title}</h3>
            `;
            container.appendChild(eraDivider);
        }

        // Cria o contêiner para a trilha da escola
        const content = document.createElement('div');
        content.className = 'timeline-content'; // Usa Flexbox para criar o caminho

        // Adiciona cada filósofo como um "botão" na trilha
        schoolData.nodes.forEach((node, index) => {
            const nodeElement = document.createElement('div');
            nodeElement.className = 'philosopher-node';
            nodeElement.id = `node-${node.id}`;
            nodeElement.dataset.id = node.id;

            // Define uma variável CSS para o ziguezague, que será usada na animação
            const offsetX = index % 2 === 0 ? '50px' : '-50px';
            nodeElement.style.setProperty('--offset-x', offsetX);

            nodeElement.innerHTML = `<img src="${ImageService.getUrl(node.image, ImageService.Sizes.ICON_THUMB)}" alt="${node.name}">`;
            content.appendChild(nodeElement);
        });

        container.appendChild(content);
    }
}

/**
 * Exibe o mini-card de lição flutuante acima de um nó clicado.
 * @param {HTMLElement} nodeElement - O elemento do nó que foi clicado.
 * @param {object} nodeData - Os dados do filósofo correspondente ao nó.
 * @private
 */
function showMiniCard(nodeElement, nodeData) {
    // Fecha qualquer outro card que possa estar aberto
    closeMiniCard();

    const card = document.createElement('div');
    card.className = 'mini-lesson-card';
    card.innerHTML = `
        <div class="mini-card-header">${nodeData.name}</div>
        <div class="mini-card-desc">${nodeData.school}</div>
        <button class="mini-start-btn">COMEÇAR ESTUDO</button>
    `;

    container.appendChild(card);
    activeMiniCard = card;

    // Posiciona o card dinamicamente acima do nó
    const nodeRect = nodeElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const topPos = (nodeRect.top - containerRect.top) - card.offsetHeight + 85;
    const leftPos = (nodeRect.left - containerRect.left) + (nodeRect.width / 2) - (card.offsetWidth / 2);

    card.style.top = `${topPos}px`;
    card.style.left = `${leftPos}px`;

    // Adiciona a classe 'visible' para ativar a animação de surgimento
    requestAnimationFrame(() => {
        card.classList.add('visible');
    });

    // Adiciona o evento de clique ao botão "COMEÇAR"
    card.querySelector('.mini-start-btn').addEventListener('click', () => {
        popupManager.open('library:philosopher-study-module', { philosopherId: nodeData.id });
        closeMiniCard();
    });
}

/**
 * Fecha e remove o mini-card de lição ativo da tela.
 * @private
 */
function closeMiniCard() {
    if (activeMiniCard) {
        activeMiniCard.remove();
        activeMiniCard = null;
    }
}

/**
 * Atualiza o estado visual da trilha com base no progresso do jogador.
 * Aplica classes como 'locked', 'available', 'active', 'maxed'.
 * @private
 */
function updateTreeUI() {
    if (!gameState.studyProgress) gameState.studyProgress = {};

    for (const schoolKey in structuredData) {
        const schoolData = structuredData[schoolKey];

        schoolData.nodes.forEach(node => {
            const nodeElement = document.getElementById(`node-${node.id}`);
            if (!nodeElement) return;

            const progress = gameState.studyProgress[node.id];
            const studyContent = STUDY_CONTENT_DATA[node.id];
            let percentage = 0;
            if (progress && studyContent) {
                percentage = Math.floor((progress.pagesViewed.size / studyContent.totalPages) * 100);
            }

            nodeElement.classList.remove('active', 'maxed', 'available', 'locked');

            const isAvailable = checkPrerequisites(node);

            if (percentage >= 100) {
                nodeElement.classList.add('maxed'); // Completou 100%
            } else if (percentage > 0) {
                nodeElement.classList.add('active'); // Em progresso
            } else if (isAvailable) {
                nodeElement.classList.add('available'); // Desbloqueado, mas não iniciado
            } else {
                nodeElement.classList.add('locked'); // Bloqueado
            }
        });
    }
}

/**
 * Procura por um nó de filósofo em toda a estrutura de dados.
 * @param {string} nodeId - O ID do filósofo a ser encontrado.
 * @returns {object|null} O objeto do nó ou nulo se não for encontrado.
 * @private
 */
function findNodeGlobally(nodeId) {
    for (const schoolKey in structuredData) {
        const found = structuredData[schoolKey].nodes.find(n => n.id === nodeId);
        if (found) return found;
    }
    return null;
}

/**
 * Verifica se o jogador cumpriu os pré-requisitos para estudar um filósofo.
 * @param {object} node - O nó do filósofo a ser verificado.
 * @returns {boolean} True se os pré-requisitos foram atendidos, false caso contrário.
 * @private
 */
function checkPrerequisites(node) {
    if (!node || node.req.length === 0) return true; // Nós iniciais estão sempre disponíveis

    // Verifica se o jogador já COMPLETOU o estudo de TODOS os predecessores (Passou no Quiz)
    return node.req.every(reqId => {
        const reqProgress = gameState.studyProgress[reqId];
        // O pré-requisito é cumprido se o jogador completou o filósofo anterior (Quiz > 80%)
        return reqProgress && reqProgress.completed;
    });
}