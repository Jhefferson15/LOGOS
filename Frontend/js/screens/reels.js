
import { POSTS_DATA } from '../data/posts.js';
import { PINTEREST_MEDIA } from '../data/pinterest_data.js';
import { PHILOSOPHERS_DATA } from '../data/philosophers.js';
import { popupManager } from '../ui/PopupManager.js';
import { ImageService } from '../services/ImageService.js';

let lastTap = 0; // Para detectar o toque duplo
let isCleanView = false; // Estado global do modo limpo

/**
 * Renderiza todos os reels (imagens) na tela com Skeletons e Lazy Loading.
 * @param {object} gameState - O estado atual do jogo para verificar interações.
 */
function renderReels(gameState) {
    const reelsContainer = document.getElementById('reels-container');
    const loader = document.getElementById('reels-loader');
    if (!reelsContainer || !loader) return;

    reelsContainer.innerHTML = `
        <div class="reels-header" style="position: absolute; top: 10px; right: 10px; z-index: 100;">
            <button id="reels-settings-btn" class="action-button-secondary" style="background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-cog"></i>
            </button>
        </div>
    `;

    document.getElementById('reels-settings-btn').addEventListener('click', () => {
        popupManager.open('reels:settings');
    });

    loader.style.display = 'flex'; // Mostra o skeleton

    // Simula um carregamento de rede
    setTimeout(() => {
        // Merge existing posts with Pinterest media
        let allPosts = [...POSTS_DATA, ...PINTEREST_MEDIA];

        // --- LÓGICA DE HISTÓRICO DE VISUALIZAÇÃO ---
        const seenReels = JSON.parse(localStorage.getItem('seenReels') || '[]');

        // Filtra posts que já foram vistos
        allPosts = allPosts.filter(post => !seenReels.includes(post.id));

        // Se não houver mais posts novos, mostra mensagem ou opção de resetar
        if (allPosts.length === 0) {
            reelsContainer.innerHTML = `
                <div class="no-more-reels">
                    <i class="fas fa-check-circle"></i>
                    <p>Você já viu tudo por enquanto!</p>
                    <button id="reset-history-btn" class="action-button">Ver Novamente</button>
                </div>
            `;
            loader.style.display = 'none';

            document.getElementById('reset-history-btn').addEventListener('click', () => {
                localStorage.removeItem('seenReels');
                renderReels(gameState); // Recarrega
            });
            return;
        }

        // Shuffle/Sort logic could go here if needed. For now, just appending.
        // Let's shuffle them a bit to mix them up
        allPosts.sort(() => Math.random() - 0.5);

        allPosts.forEach(post => {
            const philosopher = PHILOSOPHERS_DATA[post.philosopherId];
            if (!philosopher) return;

            const reelElement = document.createElement('div');
            reelElement.className = 'reel-item';
            reelElement.dataset.postId = post.id;

            // Aplica o estado global de clean view
            if (isCleanView) {
                reelElement.classList.add('clean-view');
            }

            const isLiked = gameState.userActions.likedPosts.includes(post.id);

            // Ponto 3: Acessibilidade (alt text e aria-labels)
            const captionExcerpt = post.caption.substring(0, 50).replace(/"/g, "'") + '...';
            const altText = `Reel por ${philosopher.name}: ${captionExcerpt}`;

            reelElement.innerHTML = `
                <!-- Ponto 8: Contêiner para gesto de toque duplo e zoom -->
                <div class="reel-media-container" style="background-color: white;">
                    <!-- Ponto 2: Lazy loading com data-src -->
                    ${post.type === 'video'
                    ? `<video class="reel-image" data-src="${post.mediaUrl}" loop playsinline controls></video>`
                    : `<img class="reel-image" data-src="${post.mediaUrl}" alt="${altText}" />`
                }
                    <i class="fas fa-heart like-heart-animation"></i>
                </div>
                
                <!-- Info na Parte Inferior -->
                <div class="reel-bottom-info">
                    <div class="reel-info" data-philosopher-id="${post.philosopherId}">
                        <img src="${ImageService.getUrl(philosopher.image, ImageService.Sizes.THUMB)}" alt="${philosopher.name}" class="reel-avatar">
                        <div class="reel-text-info">
                            <strong>@${philosopher.name.toLowerCase().replace(/\s+/g, '_')}</strong>
                            <p class="reel-caption-text">${post.caption}</p>
                        </div>
                    </div>
                </div>

                <!-- Sidebar de Ações (separado do overlay de info) -->
                <div class="reel-actions-sidebar">
                    <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" data-post-id="${post.id}" aria-label="Curtir post de ${philosopher.name}">
                        <i class="fas fa-heart"></i>
                        <span>${post.likes}</span>
                    </button>
                    <!-- Ponto 5: Ação para comentários (abre popup) -->
                    <button class="action-btn comment-btn" data-post-id="${post.id}" aria-label="Ver comentários">
                        <i class="fas fa-comment-dots"></i>
                        <span>${post.comments.length}</span>
                    </button>
                    <!-- Ponto 7: Botão de compartilhamento real -->
                    <button class="action-btn share-btn" data-post-id="${post.id}" aria-label="Compartilhar post">
                        <i class="fas fa-share-square"></i>
                    </button>
                </div>`;

            reelsContainer.appendChild(reelElement);
        });

        loader.style.display = 'none'; // Esconde o skeleton
        setupImageObserver();
        setupZoom();
    }, 1000); // Atraso de 1s para visualizar o loader
}

/**
 * Configura a funcionalidade de Pinch-to-Zoom para as imagens dos reels.
 */
function setupZoom() {
    const mediaContainers = document.querySelectorAll('.reel-media-container');

    mediaContainers.forEach(container => {
        const img = container.querySelector('.reel-image');
        if (!img || img.tagName === 'VIDEO') return; // Zoom apenas em imagens por enquanto

        let initialDistance = 0;
        let currentScale = 1;
        let isPinching = false;

        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                isPinching = true;
                initialDistance = getDistance(e.touches[0], e.touches[1]);
            }
        }, { passive: false });

        container.addEventListener('touchmove', (e) => {
            if (isPinching && e.touches.length === 2) {
                e.preventDefault(); // Previne scroll enquanto dá zoom
                const newDistance = getDistance(e.touches[0], e.touches[1]);
                const scaleChange = newDistance / initialDistance;

                // Limita o zoom entre 1x e 3x
                let newScale = currentScale * scaleChange;
                newScale = Math.min(Math.max(1, newScale), 3);

                img.style.transform = `scale(${newScale})`;
                img.style.transition = 'none'; // Remove transição para resposta imediata
            }
        }, { passive: false });

        container.addEventListener('touchend', (e) => {
            if (isPinching && e.touches.length < 2) {
                isPinching = false;
                currentScale = 1; // Reseta o zoom ao soltar
                img.style.transform = `scale(1)`;
                img.style.transition = 'transform 0.3s ease'; // Suaviza o retorno
            }
        });
    });
}

function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Configura Intersection Observer para lazy loading e preloading de imagens.
 */
function setupImageObserver() {
    const reels = document.querySelectorAll('.reel-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const img = entry.target.querySelector('.reel-image');
            if (!img) return;

            if (entry.isIntersecting) {
                // Ponto 2: Lazy Loading - Carrega a imagem visível
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }

                // Ponto 2: Preloading - Carrega a próxima e a anterior
                preloadAdjacentImages(entry.target);
            }
        });
    }, { threshold: 0.5 });

    reels.forEach(reel => observer.observe(reel));

    // --- OBSERVER PARA MARCAR COMO VISTO ---
    const seenObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const reelElement = entry.target;
                const postId = parseInt(reelElement.dataset.postId);

                if (postId) {
                    const seenReels = JSON.parse(localStorage.getItem('seenReels') || '[]');
                    if (!seenReels.includes(postId)) {
                        seenReels.push(postId);
                        localStorage.setItem('seenReels', JSON.stringify(seenReels));
                    }
                }

                // Para de observar após marcar como visto
                seenObserver.unobserve(reelElement);
            }
        });
    }, { threshold: 0.6 }); // Considera visto quando 60% estiver visível

    reels.forEach(reel => seenObserver.observe(reel));
}

/**
 * Pré-carrega as imagens do reel adjacente (próximo e anterior).
 * @param {HTMLElement} currentReelElement O elemento do reel atual.
 */
function preloadAdjacentImages(currentReelElement) {
    const nextReel = currentReelElement.nextElementSibling;
    const prevReel = currentReelElement.previousElementSibling;

    const preload = (element) => {
        if (!element) return;
        const imgToPreload = element.querySelector('.reel-image[data-src]');
        if (imgToPreload) {
            // Cria um objeto de imagem em memória para forçar o download e cache
            if (imgToPreload.tagName === 'IMG') {
                const img = new Image();
                img.src = imgToPreload.dataset.src;
            } else if (imgToPreload.tagName === 'VIDEO') {
                // For video, we can just set the src to start buffering if we wanted, 
                // but for now let's just leave it to the intersection observer
            }
        }
    };

    preload(nextReel);
    preload(prevReel);
}

/**
 * Mostra a animação de coração no centro da imagem.
 * @param {HTMLElement} mediaContainer O contêiner da mídia.
 */
function showLikeAnimation(mediaContainer) {
    const heart = mediaContainer.querySelector('.like-heart-animation');
    if (heart) {
        heart.classList.add('show');
        setTimeout(() => {
            heart.classList.remove('show');
        }, 800);
    }
}

/**
 * Lógica para curtir/descurtir um post.
 * @param {number} postId ID do post.
 * @param {object} gameState O estado do jogo.
 */
function toggleLike(postId, gameState) {
    const post = POSTS_DATA.find(p => p.id === postId);
    const likeBtn = document.querySelector(`.like-btn[data-post-id="${postId}"]`);
    if (!post || !likeBtn) return;

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
        // Mostra animação apenas ao curtir
        const mediaContainer = likeBtn.closest('.reel-item').querySelector('.reel-media-container');
        showLikeAnimation(mediaContainer);
    }
    likeCount.textContent = post.likes;
}


/**
 * Inicializa a tela de Reels.
 * @param {object} gameState - O estado atual do jogo.
 */
/**
 * Initializes the Reels Screen.
 * Triggers the rendering of the reels feed.
 * @module Screens/Reels
 * @param {object} gameState - The global game state.
 */
export function initReelsScreen(gameState) {
    renderReels(gameState);
}

/**
 * Manipulador de cliques e toques para a tela de Reels.
 * @param {Event} event - O objeto do evento.
 * @param {object} gameState - O estado atual do jogo.
 * @param {object} toast - A instância do Toast para notificações.
 */
/**
 * Handles click and tap events on the Reels Screen.
 * Supports double-tap to like, and buttons for like, comment, and share.
 * @param {Event} event - The event object.
 * @param {object} gameState - The global game state.
 * @param {object} toast - Toast notification utility.
 */
export function handleReelsScreenClick(event, gameState, toast) {
    const target = event.target;

    // Ponto 8: Gesto de toque duplo para curtir + Toggle de visibilidade
    const mediaContainer = target.closest('.reel-media-container');
    if (mediaContainer) {
        const currentTime = new Date().getTime();
        const timeSinceLastTap = currentTime - lastTap;

        if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
            // Duplo clique em 300ms - CURTIR
            const postId = parseInt(mediaContainer.closest('.reel-item').dataset.postId);
            const isLiked = gameState.userActions.likedPosts.includes(postId);
            if (!isLiked) {
                toggleLike(postId, gameState);
            } else {
                showLikeAnimation(mediaContainer); // Mostra a animação mesmo se já estiver curtido
            }
        } else {
            // Clique simples - TOGGLE VISIBILIDADE (com delay para distinguir de duplo clique)
            setTimeout(() => {
                const timeSinceThisTap = new Date().getTime() - currentTime;
                // Se passou mais de 300ms sem outro clique, é um clique simples
                if (timeSinceThisTap >= 300) {
                    // Alterna o estado global
                    isCleanView = !isCleanView;

                    // Aplica o estado a todos os reels
                    const allReels = document.querySelectorAll('.reel-item');
                    allReels.forEach(reel => {
                        if (isCleanView) {
                            reel.classList.add('clean-view');
                        } else {
                            reel.classList.remove('clean-view');
                        }
                    });
                }
            }, 300);
        }

        lastTap = currentTime;
        return;
    }

    // Ação de curtir (botão)
    const likeBtn = target.closest('.like-btn');
    if (likeBtn) {
        const postId = parseInt(likeBtn.dataset.postId);
        toggleLike(postId, gameState);
        return;
    }

    // Ponto 5: Comentários (com suporte a threads em uma implementação futura)
    const commentBtn = target.closest('.comment-btn');
    if (commentBtn) {
        const postId = parseInt(commentBtn.dataset.postId);
        // O popupManager agora pode receber dados para renderizar comentários,
        // incluindo respostas, formando threads.
        popupManager.open('comments', { postId: postId });
        return;
    }

    // Ponto 7: Funcionalidade de compartilhamento real
    const shareBtn = target.closest('.share-btn');
    if (shareBtn) {
        const postId = parseInt(shareBtn.dataset.postId);
        const post = POSTS_DATA.find(p => p.id === postId);
        const philosopher = PHILOSOPHERS_DATA[post.philosopherId];

        const shareData = {
            title: `LOGOS: Um reel de ${philosopher.name}`,
            text: post.caption,
            url: window.location.href // Em um app real, seria um link direto para o post
        };

        if (navigator.share && navigator.canShare(shareData)) {
            navigator.share(shareData)
                .catch(err => console.error('Erro ao compartilhar:', err));
        } else {
            // Fallback para desktop ou navegadores sem suporte
            navigator.clipboard.writeText(shareData.url).then(() => {
                toast.show('Link copiado para a área de transferência!', 'success');
            });
        }
        return;
    }

    // Ponto 6: Abrir página de perfil do filósofo
    const reelInfo = target.closest('.reel-info');
    if (reelInfo && reelInfo.dataset.philosopherId) {
        const philosopherId = reelInfo.dataset.philosopherId;
        // Aqui, em vez de um popup, você poderia navegar para uma nova "tela"
        // que mostraria todos os posts e informações do filósofo.
        // Usando o popupManager como simulação:
        popupManager.open('philosopher-profile', { philosopherId: philosopherId });
        return;
    }
}