import { PHILOSOPHERS_DATA } from '../data/philosophers.js';
import { POSTS_DATA } from '../data/posts.js';
import { popupManager } from '../ui/PopupManager.js';

/**
 * Renderiza os cards dos membros da escola.
 * @param {string} schoolName - O nome da escola.
 * @param {object} gameState - O estado atual do jogo.
 */
function renderMembers(schoolName, gameState) {
    const gridElement = document.getElementById('school-members-grid');
    if (!gridElement) return;

    gridElement.innerHTML = ''; // Limpa o conteúdo anterior

    const members = Object.values(PHILOSOPHERS_DATA).filter(p => p.school === schoolName);

    if (members.length === 0) {
        gridElement.innerHTML = '<p class="empty-message">Nenhum filósofo encontrado para esta escola.</p>';
        return;
    }

    members.forEach(philosopher => {
        const philosopherId = Object.keys(PHILOSOPHERS_DATA).find(key => PHILOSOPHERS_DATA[key] === philosopher);
        const isDiscovered = gameState.discoveredPhilosophers.includes(parseInt(philosopherId));
        const philosopherState = gameState.collection.philosophers[philosopherId] || { level: 0, count: 0 };

        const cardElement = document.createElement('div');
        cardElement.className = `card-item ${isDiscovered ? 'unlocked' : 'locked'}`;
        cardElement.dataset.philosopherId = philosopherId;

        if (isDiscovered) {
            cardElement.innerHTML = `
                <img src="${philosopher.image}" alt="${philosopher.name}" class="card-image">
                <span class="card-name">${philosopher.name}</span>
                <span class="card-level">Nível ${philosopherState.level}</span>
            `;
        } else {
            cardElement.innerHTML = `
                <i class="fas fa-question-circle card-icon-locked"></i>
                <span class="card-name">???</span>
                <span class="card-level">Não Descoberto</span>
            `;
        }

        gridElement.appendChild(cardElement);
    });
}

/**
 * Renderiza as postagens (reels) da escola.
 * @param {string} schoolName - O nome da escola.
 */
function renderPosts(schoolName) {
    const reelsContainer = document.getElementById('school-posts-reels-container');
    if (!reelsContainer) return;

    reelsContainer.innerHTML = ''; // Limpa o conteúdo

    const memberIds = Object.keys(PHILOSOPHERS_DATA).filter(id => PHILOSOPHERS_DATA[id].school === schoolName);
    const schoolPosts = POSTS_DATA.filter(post => memberIds.includes(post.philosopherId));

    if (schoolPosts.length === 0) {
        reelsContainer.innerHTML = '<p class="empty-message" style="color: white; padding: 40px; text-align: center;">Nenhuma postagem encontrada para esta escola.</p>';
        return;
    }

    schoolPosts.forEach(post => {
        const philosopher = PHILOSOPHERS_DATA[post.philosopherId];
        if (!philosopher) return;

        const reelElement = document.createElement('div');
        reelElement.className = 'reel-item';

        // Adiciona o vídeo
        const videoElement = document.createElement('video');
        videoElement.className = 'reel-video';
        videoElement.src = post.mediaUrl;
        videoElement.loop = true;
        videoElement.muted = true; // Vídeos devem começar sem som
        videoElement.playsInline = true;

        reelElement.appendChild(videoElement);

        // Adiciona a sobreposição com informações
        const overlayElement = document.createElement('div');
        overlayElement.className = 'reel-overlay';
        overlayElement.innerHTML = `
            <div class="reel-caption">
                <p>${post.caption}</p>
            </div>
            <a href="#" class="reel-info" data-philosopher-id="${post.philosopherId}">
                <img src="${philosopher.image}" alt="${philosopher.name}" class="reel-avatar">
                <strong>@${philosopher.name.toLowerCase().replace(/\s+/g, '_')}</strong>
            </a>
        `;
        reelElement.appendChild(overlayElement);

        reelsContainer.appendChild(reelElement);
    });

    setupReelsObserver();
}

/**
 * Configura um Intersection Observer para tocar/pausar vídeos de reels quando entram/saem da tela.
 */
function setupReelsObserver() {
    const reels = document.querySelectorAll('.reel-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            if (!video) return;

            if (entry.isIntersecting) {
                video.play().catch(e => console.error("Erro ao tocar o vídeo:", e));
            } else {
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Toca o vídeo quando 50% dele está visível
    });

    reels.forEach(reel => {
        observer.observe(reel);
    });
}

/**
 * Inicializa a tela de membros da escola.
 * @param {object} params - Parâmetros da rota (ex: { school: 'Estoicismo' }).
 * @param {object} gameState - O estado atual do jogo.
 */
/**
 * Initializes the School Members Screen.
 * Sets the title, renders members and posts, and sets up tab navigation.
 * @param {object} params - Route parameters (e.g., { school: 'Stoicism' }).
 * @param {object} gameState - The global game state.
 */
export function initSchoolMembersScreen(params, gameState) {
    const schoolName = params.school;
    const titleElement = document.getElementById('school-members-title');

    if (!titleElement) {
        console.error("Elemento de título da tela de membros não encontrado.");
        return;
    }

    titleElement.textContent = schoolName;

    // Renderiza o conteúdo inicial
    renderMembers(schoolName, gameState);
    renderPosts(schoolName);

    // Lógica para troca de abas
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('active')) return;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            const activeTab = document.getElementById(button.dataset.tab);
            activeTab.classList.add('active');

            // Pausa todos os vídeos se a aba de postagens não estiver ativa
            if (button.dataset.tab !== 'posts-content') {
                document.querySelectorAll('.reel-video').forEach(video => video.pause());
            } else {
                // Toca o primeiro vídeo visível se a aba de postagens for ativada
                const firstVisibleReel = document.querySelector('.reel-item');
                if (firstVisibleReel) {
                    const video = firstVisibleReel.querySelector('video');
                    if (video) video.play().catch(e => console.error("Erro ao tocar o vídeo:", e));
                }
            }
        });
    });

    // Garante que a aba inicial correta esteja visível
    document.querySelector('.tab-btn.active').click();
}

/**
 * Manipulador de cliques para a tela de membros da escola.
 * @param {Event} event - O objeto do evento de clique.
 * @param {object} gameState - O estado atual do jogo.
 * @param {object} toast - A instância do Toast para notificações.
 */
/**
 * Handles click events on the School Members Screen.
 * Manages interactions with member cards and post profiles.
 * @param {Event} event - The click event object.
 * @param {object} gameState - The global game state.
 * @param {object} toast - Toast notification utility.
 */
export function handleSchoolMembersScreenClick(event, gameState, toast) {
    const target = event.target;

    // Clique em um card de membro
    const memberCard = target.closest('#members-content .card-item');
    if (memberCard && memberCard.dataset.philosopherId) {
        const philosopherId = memberCard.dataset.philosopherId;
        const isDiscovered = gameState.discoveredPhilosophers.includes(parseInt(philosopherId));

        if (!isDiscovered) {
            toast.show('Este filósofo ainda não foi descoberto!', 'info');
            return;
        }

        const philosopherState = gameState.collection.philosophers[philosopherId] || { level: 0, count: 0 };
        popupManager.open('philosopher-details', {
            philosopherId: philosopherId,
            philosopherState: philosopherState
        });
        return;
    }

    // Clique no perfil de uma postagem
    const reelInfo = target.closest('#posts-content .reel-info');
    if (reelInfo && reelInfo.dataset.philosopherId) {
        event.preventDefault(); // Previne a navegação do link '#'
        const philosopherId = reelInfo.dataset.philosopherId;
        const philosopherState = gameState.collection.philosophers[philosopherId] || { level: 0, count: 0 };

        popupManager.open('philosopher-details', {
            philosopherId: philosopherId,
            philosopherState: philosopherState
        });
        return;
    }
}
