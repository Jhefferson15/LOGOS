import { gameState } from '../data/gameState.js';
import { PHILOSOPHERS_DATA } from '../data/philosophers.js';
// Importe o seu arquivo de conteúdo de estudo. Crie este arquivo se ele não existir.
import { STUDY_CONTENT_DATA } from '../data/study_content.js'; 
import { popupManager } from '../ui/PopupManager.js';

// Variáveis globais do módulo
let structuredData = {}; // Para armazenar os dados organizados por escola
let tooltip;
let container;

// Função principal que inicializa a tela da biblioteca
export function initLibraryScreen(globalGameState, updateDynamicUI, toast) {
    container = document.getElementById('knowledge-tree-container');
    tooltip = document.getElementById('tooltip');
    
    // 1. Estrutura os dados dos filósofos por escola
    structurePhilosopherData();
    
    // 2. Cria os elementos visuais na DOM
    createKnowledgeTreeDOM();
    
    // 3. Atualiza a UI com base no progresso do jogador
    updateTreeUI();
}

// Lida com cliques na tela da biblioteca
export function handleLibraryScreenClick(e, gameState, updateDynamicUI, toast) {
    const nodeElement = e.target.closest('.philosopher-node');
    if (nodeElement) {
        const philosopherId = nodeElement.dataset.id;
        const nodeData = findNodeGlobally(philosopherId);
        
        // Verifica se o estudo está disponível (pré-requisitos cumpridos)
        if (checkPrerequisites(nodeData)) {
            // Abre o popup de estudo detalhado
            popupManager.open('philosopher-study-module', { philosopherId });
        } else {
            toast.show('Você precisa estudar os pensadores anteriores primeiro!', 'info');
        }
    }
}

// 1. Organiza os dados de PHILOSOPHERS_DATA em um formato agrupado por escola
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
            date: philosopher.date,
            school: philosopher.school,
            image: philosopher.image,
            pos: philosopher.pos, // Posição vinda de philosophers.js
            req: philosopher.predecessors || []
        });
    }
}

// 2. Cria os elementos da árvore do conhecimento na página
function createKnowledgeTreeDOM() {
    container.innerHTML = ''; // Limpa o contêiner
    let currentEra = '';

    for (const schoolKey in structuredData) {
        const schoolData = structuredData[schoolKey];
        
        // Adiciona o divisor de era
        if (schoolData.era !== currentEra) {
            currentEra = schoolData.era;
            const eraDivider = document.createElement('div');
            eraDivider.className = `era-divider era-divider-${currentEra.toLowerCase()}`;
            eraDivider.innerHTML = `<h2>Filosofia ${currentEra}</h2>`;
            container.appendChild(eraDivider);
        }
        
        // Cria o card da escola
        const schoolElement = document.createElement('div');
        schoolElement.className = `school-timeline era-${schoolData.era.toLowerCase()}`;
        schoolElement.id = schoolKey;
        schoolElement.innerHTML = `<div class="timeline-header"><h3>${schoolData.title}</h3></div>`;

        const content = document.createElement('div');
        content.className = 'timeline-content';
        
        const svgLines = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        schoolData.nodes.forEach(node => {
            const nodeElement = document.createElement('div');
            nodeElement.className = 'philosopher-node';
            nodeElement.id = `node-${node.id}`;
            nodeElement.dataset.id = node.id;
            nodeElement.style.left = node.pos.x;
            nodeElement.style.top = node.pos.y;
            
            nodeElement.innerHTML = `<img src="${node.image}" alt="${node.name}"><span class="progress-label">0%</span>`;
            
            // Adiciona listeners para o tooltip
            nodeElement.addEventListener('mouseover', (e) => showTooltip(e, node));
            nodeElement.addEventListener('mousemove', moveTooltip);
            nodeElement.addEventListener('mouseout', hideTooltip);
            
            content.appendChild(nodeElement);

            // Desenha as linhas de conexão
            node.req.forEach(reqId => {
                const reqNode = findNodeGlobally(reqId);
                if (reqNode && reqNode.pos) {
                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute('x1', reqNode.pos.x);
                    line.setAttribute('y1', reqNode.pos.y);
                    line.setAttribute('x2', node.pos.x);
                    line.setAttribute('y2', node.pos.y);
                    line.setAttribute('data-from', reqId);
                    svgLines.appendChild(line);
                }
            });
        });
        
        content.appendChild(svgLines);
        schoolElement.appendChild(content);
        container.appendChild(schoolElement);
    }
}

// 3. Atualiza a aparência dos nós e linhas com base no progresso do jogador
function updateTreeUI() {
    if (!gameState.studyProgress) gameState.studyProgress = {};

    for (const schoolKey in structuredData) {
        const schoolData = structuredData[schoolKey];

        schoolData.nodes.forEach(node => {
            const nodeElement = document.getElementById(`node-${node.id}`);
            if (!nodeElement) return;

            // Calcula o progresso de estudo
            const progress = gameState.studyProgress[node.id];
            const studyContent = STUDY_CONTENT_DATA[node.id];
            let percentage = 0;
            if (progress && studyContent) {
                percentage = Math.floor((progress.pagesViewed.size / studyContent.totalPages) * 100);
            }

            nodeElement.querySelector('.progress-label').textContent = `${percentage}%`;
            nodeElement.classList.remove('active', 'maxed', 'available', 'locked');
            
            const isAvailable = checkPrerequisites(node);

            if (percentage > 0) {
                nodeElement.classList.add('active');
                if (percentage >= 100) nodeElement.classList.add('maxed');
            } else if (isAvailable) {
                nodeElement.classList.add('available');
            } else {
                nodeElement.classList.add('locked');
            }
        });
        
        // Atualiza as linhas de conexão
        const svgLines = document.querySelectorAll(`#${schoolKey} .timeline-content svg line`);
        svgLines.forEach(line => {
            const fromId = line.getAttribute('data-from');
            const fromProgress = gameState.studyProgress[fromId];
            const hasProgress = fromProgress && fromProgress.pagesViewed.size > 0;
            line.classList.toggle('active', hasProgress);
        });
    }
}

// Funções de utilidade
function findNodeGlobally(nodeId) {
    for (const schoolKey in structuredData) {
        const found = structuredData[schoolKey].nodes.find(n => n.id === nodeId);
        if (found) return found;
    }
    return null;
}

function checkPrerequisites(node) {
    if (!node || node.req.length === 0) return true;
    return node.req.every(reqId => {
        const reqProgress = gameState.studyProgress[reqId];
        // O pré-requisito é cumprido se o jogador já começou a estudar o filósofo anterior
        return reqProgress && reqProgress.pagesViewed.size > 0;
    });
}

// Funções do Tooltip
function showTooltip(e, node) {
    tooltip.innerHTML = `<strong>${node.name}</strong><br><small>${node.school} (${node.date > 0 ? '' : 'c.'}${Math.abs(node.date)} ${node.date > 0 ? 'd.C.' : 'a.C.'})</small>`;
    tooltip.classList.add('visible');
    moveTooltip(e);
}
function moveTooltip(e) { tooltip.style.left = `${e.clientX}px`; tooltip.style.top = `${e.clientY}px`; }
function hideTooltip() { tooltip.classList.remove('visible'); }