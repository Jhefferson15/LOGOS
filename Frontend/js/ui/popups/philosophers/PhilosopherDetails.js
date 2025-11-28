import { PHILOSOPHERS_DATA } from '../../../data/philosophers.js';
import { CONCEPTS_DATA_1 } from '../../../data/concepts.js';
import { toast } from '../../Toast.js';
import { ImageService } from '../../../services/ImageService.js';

/**
 * Módulo para o popup de detalhes do filósofo.
 */
export const PhilosopherDetailsPopup = {
    /**
     * Gera o título dinâmico do popup.
     */
    title: (data) => {
        const philosopher = PHILOSOPHERS_DATA[data.philosopherId];
        return philosopher ? philosopher.name : 'Detalhes';
    },

    /**
     * Gera o HTML do conteúdo do popup com CSS embutido.
     */
    getHTML: (data) => {
        const philosopher = PHILOSOPHERS_DATA[data.philosopherId];
        if (!philosopher) return '<p>Erro: Filósofo não encontrado.</p>';

        const state = data.philosopherState;

        // Lógica dos Conceitos
        const keyConceptsHTML = philosopher.keyConcepts.map(conceptId => {
            const concept = CONCEPTS_DATA_1[conceptId];
            return concept ? `
                <div class="concept-chip">
                    <div class="concept-header">
                        <strong>${concept.name}</strong>
                        <span class="concept-pts">${concept.points} pts</span>
                    </div>
                    <p>${concept.description}</p>
                </div>` : '';
        }).join('');

        // Lógica dos Predecessores
        const predecessorsLinks = philosopher.predecessors.map(id => {
            const pred = PHILOSOPHERS_DATA[id];
            return pred ? `<span class="philosopher-link" data-philosopher-id="${id}">${pred.name}</span>` : null;
        }).filter(Boolean);
        const predecessorsHTML = predecessorsLinks.length > 0 ? predecessorsLinks.join(', ') : '<span>Nenhum direto (pensador original)</span>';

        // Lógica da Barra de Progresso
        const nextLevelPergaminhos = state.level * 10;
        const progressPercent = Math.min((state.count / nextLevelPergaminhos) * 100, 100);

        return `
            <style>
                /* Layout Geral */
                .philosopher-popup-content {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    padding: 0 5px;
                }

                /* 1. Carta em Destaque */
                .card-highlight {
                    display: flex;
                    justify-content: center;
                    margin-top: 10px;
                    margin-bottom: 5px;
                    perspective: 1000px; /* Para efeitos 3D sutis se desejar */
                }
                
                .card-highlight img {
                    width: 200px;
                    height: auto;
                    border-radius: 12px;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.25);
                    border: 3px solid #d4af37;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    cursor: zoom-in; /* Indica que é clicável */
                }
                
                .card-highlight img:hover {
                    transform: scale(1.03);
                    box-shadow: 0 15px 25px rgba(212, 175, 55, 0.4); /* Glow dourado */
                }

                /* --- Fullscreen Overlay Styles --- */
                .fs-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.1);
                    z-index: 9999; /* Fica acima de tudo */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    pointer-events: none; /* Não bloqueia cliques quando invisível */
                    transition: opacity 0.3s ease;
                    backdrop-filter: blur(5px);
                }

                .fs-overlay.active {
                    opacity: 1;
                    pointer-events: all;
                }

                .fs-image-container {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                }

                .fs-image {
                    max-width: 100%;
                    max-height: 90vh;
                    border-radius: 15px;
                    box-shadow: 0 0 30px rgba(212, 175, 55, 0.6);
                    border: 4px solid #d4af37;
                    object-fit: contain;
                }

                .fs-close-btn {
                    position: absolute;
                    top: -40px;
                    right: -40px;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 2.5rem;
                    cursor: pointer;
                    transition: transform 0.2s;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                }

                .fs-close-btn:hover {
                    transform: scale(1.2) rotate(90deg);
                    color: #d4af37;
                }
                
                /* Responsividade para o botão fechar em telas pequenas */
                @media (max-width: 600px) {
                    .fs-close-btn {
                        top: -50px;
                        right: 0;
                    }
                }
                /* -------------------------------- */

                /* 2. Informações Centralizadas */
                .info-centered {
                    text-align: center;
                    border-bottom: 1px solid #e0e0e0;
                    padding-bottom: 15px;
                }
                .info-school {
                    color: #8b5a2b; font-size: 1.5rem; margin: 5px 0;
                    font-weight: bold; text-transform: uppercase; letter-spacing: 1px;
                }
                .info-era {
                    font-size: 0.9rem; color: #777; background: #f0f0f0;
                    padding: 4px 12px; border-radius: 15px; display: inline-block; margin-bottom: 10px;
                }
                .info-desc { font-size: 1rem; color: #444; line-height: 1.5; font-style: italic; }

                /* 3. Stats Grid */
                .stats-grid {
                    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;
                    background: #fdfbf7; padding: 15px; border-radius: 8px;
                    border: 1px solid #eaddcf; text-align: center;
                }
                .stat-box span { display: block; font-size: 0.8rem; color: #888; text-transform: uppercase; margin-bottom: 4px; }
                .stat-box strong { font-size: 1.2rem; color: #333; }

                /* 4. Aprimoramento */
                .upgrade-wrapper { background: #fff; padding: 10px; }
                .upgrade-bar-container {
                    background: #eee; height: 24px; border-radius: 12px;
                    position: relative; overflow: hidden; margin-bottom: 10px;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
                }
                .upgrade-fill { background: linear-gradient(90deg, #d4af37, #f2d06b); height: 100%; transition: width 0.4s ease; }
                .upgrade-text {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.85rem; font-weight: bold; color: #555;
                    text-shadow: 0 1px 1px rgba(255,255,255,0.8);
                }
                .btn-upgrade {
                    width: 100%; padding: 12px; background: #6d4c41; color: white;
                    border: none; border-radius: 6px; font-weight: bold; cursor: pointer;
                    font-size: 1rem; text-transform: uppercase; transition: background 0.2s;
                }
                .btn-upgrade:hover { background: #5d4037; }
                .btn-upgrade.disabled { background: #ccc; cursor: not-allowed; }

                /* 5. Detalhes */
                .section-title { font-size: 1.1rem; color: #5d4037; border-bottom: 2px solid #eaddcf; padding-bottom: 5px; margin-bottom: 10px; margin-top: 10px; }
                .concept-chip {
                    background: #fff; border: 1px solid #ddd; border-left: 4px solid #d4af37;
                    padding: 10px; border-radius: 4px; margin-bottom: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .concept-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
                .concept-pts { font-size: 0.8rem; color: #888; }
                .concept-chip p { margin: 0; font-size: 0.9rem; color: #666; }

            </style>

            <div class="philosopher-popup-content">
                
                <!-- Imagem Pequena (Botão de Trigger) -->
                <div class="card-highlight">
                    <img 
                        src="${ImageService.getUrl(philosopher.image, ImageService.Sizes.MEDIUM)}" 
                        srcset="${ImageService.getSrcSet(philosopher.image)}"
                        sizes="(max-width: 600px) 150px, 400px"
                        alt="${philosopher.name}" 
                        id="popup-card-trigger" 
                        title="Clique para ampliar"
                    >
                </div>

                <!-- Overlay Fullscreen (Inicialmente Oculto) -->
                <div class="fs-overlay" id="fs-card-overlay">
                    <div class="fs-image-container">
                        <button class="fs-close-btn" id="fs-close-btn" title="Fechar">&times;</button>
                        <img 
                            src="${ImageService.getUrl(philosopher.image, ImageService.Sizes.LARGE)}" 
                            srcset="${ImageService.getSrcSet(philosopher.image)}"
                            sizes="90vw"
                            alt="${philosopher.name}" 
                            class="fs-image"
                        >
                    </div>
                </div>

                <!-- Info Header -->
                <div class="info-centered">
                    <div class="info-era">${philosopher.era}</div>
                    <h2 class="info-school">${philosopher.school}</h2>
                    <p class="info-desc">"${philosopher.description}"</p>
                </div>

                <!-- Stats -->
                <div class="stats-grid">
                    <div class="stat-box"><span>Nível</span><strong>${state.level}</strong></div>
                    <div class="stat-box"><span>Poder</span><strong>${state.level * 15}</strong></div>
                    <div class="stat-box"><span>Custo</span><strong><i class="fas fa-coins"></i> ${state.level * 100}</strong></div>
                </div>

                <!-- Upgrade -->
                <div class="upgrade-wrapper">
                    <div class="upgrade-bar-container">
                        <div class="upgrade-fill" style="width: ${progressPercent}%"></div>
                        <span class="upgrade-text">${state.count} / ${nextLevelPergaminhos} Pergaminhos</span>
                    </div>
                    <button class="btn-upgrade ${state.count >= nextLevelPergaminhos ? '' : 'disabled'}" id="upgrade-philosopher-btn">Aprimorar</button>
                </div>

                <!-- Detalhes -->
                <div>
                    <h3 class="section-title">Conceitos-Chave</h3>
                    <div class="concepts-list">${keyConceptsHTML}</div>
                    <h3 class="section-title">Influenciado Por</h3>
                    <p style="font-size: 0.9rem; color: #555;">${predecessorsHTML}</p>
                </div>

            </div>`;
    },

    /**
     * Configura os event listeners para o popup.
     */
    setupListeners: (element, data, popupManager) => {
        // --- Listener de Aprimoramento ---
        const upgradeBtn = element.querySelector('#upgrade-philosopher-btn');
        if (upgradeBtn && !upgradeBtn.classList.contains('disabled')) {
            upgradeBtn.addEventListener('click', () => {
                toast.show(`Aprimorando ${PHILOSOPHERS_DATA[data.philosopherId].name}...`, 'success');
                // Lógica real de aprimoramento aqui
                popupManager.close();
            });
        }

        // --- Lógica Fullscreen ---
        const triggerImg = element.querySelector('#popup-card-trigger');
        const overlay = element.querySelector('#fs-card-overlay');
        const closeBtn = element.querySelector('#fs-close-btn');

        if (triggerImg && overlay && closeBtn) {
            // Abrir Fullscreen
            triggerImg.addEventListener('click', () => {
                overlay.classList.add('active');
            });

            // Fechar ao clicar no botão X
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita conflitos de clique
                overlay.classList.remove('active');
            });

            // Fechar ao clicar fora da imagem (na parte escura)
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                }
            });
        }
    }
};