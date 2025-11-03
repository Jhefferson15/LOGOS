import { initPlayScreen, handlePlayScreenClick } from './screens/play.js';                                                                                                                 
import { initLibraryScreen, handleLibraryScreenClick } from './screens/library.js';                                                                                                        
import { initPhilosophersScreen, handlePhilosophersScreenClick } from './screens/philosophers.js';                                                                                                
import { initSchoolsScreen, handleSchoolsScreenClick } from './screens/schools.js';                                                                                                        
import { initSymposiumScreen, handleSymposiumScreenClick } from './screens/symposium.js'; 
import { toast } from './ui/Toast.js';
import { gameState } from './data/gameState.js';
import { popupManager } from './ui/PopupManager.js';


document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }
    const screenContent = document.getElementById('screen-content');
    const navItems = document.querySelectorAll('.nav-item');
    const gameScreen = document.querySelector('.game-screen');

    let currentScreenName = ''; // To keep track of the active screen

    const formatTime = (s) => { if (s <= 0) return "Pronto!"; const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60; return h > 0 ? `${h}H ${m}MIN` : m > 0 ? `${m}MIN ${sec}SEG` : `${sec}SEG`; };

    const getChestIcon = (t) => `fas ${{Papiro: 'fa-scroll', Tomo: 'fa-book', 'Obra Rara': 'fa-gem'}[t] || 'fa-box'}`;

    const updateDynamicUI = () => {
        const scrollAmount = document.getElementById('scroll-amount');
        if (scrollAmount) scrollAmount.innerText = gameState.scrolls;

        const bookAmount = document.getElementById('book-amount');
        if (bookAmount) bookAmount.innerText = gameState.books;

        const trophyCount = document.getElementById('trophy-count');
        if (trophyCount) trophyCount.innerText = gameState.trophies;

        const xpFill = document.getElementById('xp-fill');
        if (xpFill) xpFill.style.width = `${(gameState.xp / gameState.xpMax) * 100}%`;

        const xpText = document.getElementById('xp-text');
        if (xpText) xpText.innerText = `${gameState.xp}/${gameState.xpMax}`;

        const freeChestTimer = document.getElementById('free-chest-timer');
        if(freeChestTimer) freeChestTimer.innerText = gameState.timers.freeChest > 0 ? `Em: ${formatTime(gameState.timers.freeChest)}` : 'COLETAR!';

        const freeChest = document.getElementById('free-chest');
        if(freeChest) freeChest.classList.toggle('ready', gameState.timers.freeChest <= 0);

        const crownChestTimer = document.getElementById('crown-chest-timer');
        if(crownChestTimer) crownChestTimer.innerText = gameState.timers.crownChest > 0 ? `Em: ${formatTime(gameState.timers.crownChest)}` : 'COLETAR!';

        const crownChest = document.getElementById('crown-chest');
        if(crownChest) crownChest.classList.toggle('ready', gameState.timers.crownChest <= 0);

        const chestSlotsContainer = document.getElementById('chest-slots-container');
        if (chestSlotsContainer) {
            chestSlotsContainer.innerHTML = '';
            gameState.chestSlots.forEach((c, i) => {
                const s = document.createElement('div');
                s.className = 'chest-slot';
                s.dataset.index = i;
                if (c) {
                    s.innerHTML = `<i class="${getChestIcon(c.type)} fa-2x"></i><span>${c.type}</span><span>${c.arena}</span><strong>${formatTime(c.remainingTime)}</strong>`;
                    s.classList.add(c.status);
                    if (c.status === 'ready') s.innerHTML += `<button class="open-btn">Abrir</button>`;
                } else {
                    s.innerHTML = `<span>Vazio</span>`;
                }
                chestSlotsContainer.appendChild(s);
            });
        }
    };

    const loadScreen = async (screenName) => {
        try {
            const response = await fetch(`views/${screenName}.html`);
            if (!response.ok) {
                throw new Error(`Could not load screen: ${screenName}`);
            }
            const content = await response.text();
            screenContent.innerHTML = content;
            currentScreenName = screenName; // Set the current screen name

            // Initialize screen-specific JavaScript (for initial setup, not event listeners)
            switch (screenName) {
                case 'play':
                    initPlayScreen(gameState, updateDynamicUI, toast);
                    break;
                case 'library':
                    initLibraryScreen(gameState, updateDynamicUI, toast);
                    break;
                case 'philosophers':
                    initPhilosophersScreen(gameState, updateDynamicUI, toast);
                    break;
                case 'schools':
                    initSchoolsScreen(gameState, updateDynamicUI, toast);
                    break;
                case 'symposium':
                    initSymposiumScreen(gameState, updateDynamicUI, toast);
                    break;
                default:
                    console.warn(`No specific init function for screen: ${screenName}`);
            }

            updateDynamicUI(); // Update global UI elements after screen content is loaded
        } catch (error) {
            console.error('Error loading screen:', error);
            screenContent.innerHTML = `<p>Error loading content.</p>`;
        }
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const screenName = item.dataset.target;

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            loadScreen(screenName);
        });
    });

    // Global event listener for the game screen
    gameScreen.addEventListener('click', (e) => {
        // Handle navigation clicks (bottom-nav)
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
            // Navigation is handled by the navItems.forEach loop, so we can return here
            return;
        }

        // Delegate clicks to the appropriate screen handler
        switch (currentScreenName) {
            case 'play':
                handlePlayScreenClick(e, gameState, updateDynamicUI, toast);
                break;
            case 'library':
                handleLibraryScreenClick(e, gameState, updateDynamicUI, toast);
                break;
            case 'schools':
                handleSchoolsScreenClick(e, gameState, updateDynamicUI, toast);
                break;
            case 'symposium':
                handleSymposiumScreenClick(e, gameState, updateDynamicUI, toast);
                break;
            case 'philosophers':
                handlePhilosophersScreenClick(e, gameState, updateDynamicUI, toast);
                break;
            // Philosophers screen has no click handler yet
            default:
                // console.log(`Click on ${currentScreenName} screen:`, e.target);
                break;
        }
    });
    const gameHeader = document.querySelector('.game-header'); // Certifique-se que o seletor está correto


    // Adicione este listener para o header
    gameHeader.addEventListener('click', (e) => {
        if (e.target.closest('.xp-bar-container')) {
            popupManager.open('level-xp');
        }
    });

    setInterval(() => {
        if (gameState.timers.freeChest > 0) gameState.timers.freeChest--;
        if (gameState.timers.crownChest > 0) gameState.timers.crownChest--;
        gameState.chestSlots.forEach(c => {
            if (c && c.status === 'unlocking' && c.remainingTime > 0) {
                c.remainingTime--;
                if (c.remainingTime === 0) {
                    c.status = 'ready';
                    gameState.isUnlocking = false;
                }
            }
        });
        updateDynamicUI();
    }, 1000);

    // Load the initial screen
    loadScreen('play');
});