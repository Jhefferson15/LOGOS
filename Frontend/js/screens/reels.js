import { POSTS_DATA } from '../data/posts.js';
import { PHILOSOPHERS_DATA } from '../data/philosophers.js';
import { popupManager } from '../ui/PopupManager.js';

/**
 * Renderiza todos os reels na tela.
 * @param {object} gameState - O estado atual do jogo para verificar interações.
 */
function renderReels(gameState) {
    const reelsContainer = document.getElementById('reels-container');
    if (!reelsContainer) return;

    reelsContainer.innerHTML = ''; // Limpa o conteúdo existente

    POSTS_DATA.forEach(post => {
        const philosopher = PHILOSOPHERS_DATA[post.philosopherId];
        if (!philosopher) return;

        const reelElement = document.createElement('div');
        reelElement.className = 'reel-item';
        reelElement.dataset.postId = post.id;

        // Adiciona o vídeo
        const videoElement = document.createElement('video');
        videoElement.className = 'reel-video';
        videoElement.src = post.mediaUrl;
        videoElement.loop = true;
        videoElement.muted = true;
        videoElement.playsInline = true;
        reelElement.appendChild(videoElement);

        // Adiciona a sobreposição com informações e ações
        const overlayElement = document.createElement('div');
        overlayElement.className = 'reel-overlay';
        
        const isLiked = gameState.userActions.likedPosts.includes(post.id);

        overlayElement.innerHTML = `
            <div class="reel-details">
                <div class="reel-info" data-philosopher-id="${post.philosopherId}">
                    <img src="${philosopher.image}" alt="${philosopher.name}" class="reel-avatar">
                    <strong>@${philosopher.name.toLowerCase().replace(/\s+/g, '_')}</strong>
                </div>
                <div class="reel-caption">
                    <p>${post.caption}</p>
                </div>
            </div>
            <div class="reel-actions-sidebar">
                <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" data-post-id="${post.id}">
                    <i class="fas fa-heart"></i>
                    <span>${post.likes}</span>
                </button>
                <button class="action-btn comment-btn" data-post-id="${post.id}">
                    <i class="fas fa-comment-dots"></i>
                    <span>${post.comments.length}</span>
                </button>
                <button class="action-btn share-btn" data-post-id="${post.id}">
                    <i class="fas fa-share-square"></i>
                </button>
            </div>
        `;
        reelElement.appendChild(overlayElement);

        reelsContainer.appendChild(reelElement);
    });

    setupReelsObserver();
}

/**
 * Configura um Intersection Observer para tocar/pausar vídeos de reels.
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
    }, { threshold: 0.5 });

    reels.forEach(reel => {
        observer.observe(reel);
    });
}

/**
 * Inicializa a tela de Reels.
 * @param {object} gameState - O estado atual do jogo.
 */
export function initReelsScreen(gameState) {
    renderReels(gameState);
}

/**
 * Manipulador de cliques para a tela de Reels.
 * @param {Event} event - O objeto do evento de clique.
 * @param {object} gameState - O estado atual do jogo.
 * @param {object} toast - A instância do Toast para notificações.
 */
export function handleReelsScreenClick(event, gameState, toast) {
    const target = event.target;

    // Ação de curtir
    const likeBtn = target.closest('.like-btn');
    if (likeBtn) {
        const postId = parseInt(likeBtn.dataset.postId);
        const post = POSTS_DATA.find(p => p.id === postId);
        const likeIcon = likeBtn.querySelector('i');
        const likeCount = likeBtn.querySelector('span');

        const isLiked = gameState.userActions.likedPosts.includes(postId);

        if (isLiked) {
            // Descurtir
            gameState.userActions.likedPosts = gameState.userActions.likedPosts.filter(id => id !== postId);
            post.likes--;
            likeBtn.classList.remove('liked');
        } else {
            // Curtir
            gameState.userActions.likedPosts.push(postId);
            post.likes++;
            likeBtn.classList.add('liked');
        }
        likeCount.textContent = post.likes;
        return;
    }

    // Ação de comentar
    const commentBtn = target.closest('.comment-btn');
    if (commentBtn) {
        const postId = parseInt(commentBtn.dataset.postId);
        popupManager.open('comments', { postId: postId });
        return;
    }

    // Ação de compartilhar
    const shareBtn = target.closest('.share-btn');
    if (shareBtn) {
        toast.show('Funcionalidade de compartilhamento em breve!', 'info');
        return;
    }

    // Abrir detalhes do filósofo
    const reelInfo = target.closest('.reel-info');
    if (reelInfo && reelInfo.dataset.philosopherId) {
        const philosopherId = reelInfo.dataset.philosopherId;
        const philosopherState = gameState.collection.philosophers[philosopherId] || { level: 0, count: 0 };
        
        popupManager.open('philosopher-details', { 
            philosopherId: philosopherId,
            philosopherState: philosopherState
        });
        return;
    }
}