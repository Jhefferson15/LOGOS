import { initPlayScreen, handlePlayScreenClick } from './screens/play.js';
import { initLibraryScreen, handleLibraryScreenClick } from './screens/library.js';
import { initPhilosophersScreen, handlePhilosophersScreenClick } from './screens/philosophers.js';
import { initSchoolsScreen, handleSchoolsScreenClick } from './screens/schools.js';
import { initSymposiumScreen, handleSymposiumScreenClick } from './screens/symposium.js';
import { initSchoolMembersScreen, handleSchoolMembersScreenClick } from './screens/school_members.js';
import { initReelsScreen, handleReelsScreenClick } from './screens/reels.js';
import { initShopScreen, handleShopScreenClick } from './screens/shop.js';
import { toast } from './ui/Toast.js';
import { gameState } from './data/gameState.js';
import { popupManager } from './ui/PopupManager.js';
import { logout, subscribeToAuthChanges } from './services/auth-service.js';
import { saveUserProfile, saveGameProgress, loadGameProgress } from './services/db-service.js';
import { initLayoutManager, isDesktopView } from './layout-manager.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- LOGIN CHECK (Legacy/Fast check) ---
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    // --- NEW: DOM ELEMENT SELECTION FOR MULTI-PANEL LAYOUT ---
    const gameScreen = document.querySelector('.game-screen');
    const contextPanel = document.getElementById('context-panel'); // Main panel on mobile, side panel on desktop
    const mainDebatePanel = document.getElementById('main-debate-panel'); // Fixed debate panel on desktop
    const mainNav = document.querySelector('.main-nav');
    const gameHeader = document.querySelector('.game-header');
    const logoutBtn = document.getElementById('logout-btn');

    // --- NEW: STATE TRACKING FOR PANELS ---
    /**
     * Tracks the name of the screen currently displayed in the context panel (desktop only).
     * @type {string}
     */
    let currentContextScreenName = ''; // Tracks what's in the context panel
    let currentUser = null; // Track current user for saving

    // --- HELPER FUNCTIONS (from your file, unchanged) ---
    const formatTime = (s) => { if (s <= 0) return "Pronto!"; const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60; return h > 0 ? `${h}H ${m}MIN` : m > 0 ? `${m}MIN ${sec}SEG` : `${sec}SEG`; };
    const getChestIcon = (t) => `fas ${{ Papiro: 'fa-scroll', Tomo: 'fa-book', 'Obra Rara': 'fa-gem' }[t] || 'fa-box'}`;

    // --- UI UPDATE FUNCTION (from your file, unchanged) ---
    /**
     * Updates the dynamic UI elements based on the current game state.
     * Updates resources (scrolls, books), stats (trophies, xp), and timers.
     */
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

        // This function will find these elements regardless of which panel they are in
        const freeChestTimer = document.getElementById('free-chest-timer');
        if (freeChestTimer) freeChestTimer.innerText = gameState.timers.freeChest > 0 ? `Em: ${formatTime(gameState.timers.freeChest)}` : 'COLETAR!';
        const freeChest = document.getElementById('free-chest');
        if (freeChest) freeChest.classList.toggle('ready', gameState.timers.freeChest <= 0);

        const crownChestTimer = document.getElementById('crown-chest-timer');
        if (crownChestTimer) crownChestTimer.innerText = gameState.timers.crownChest > 0 ? `Em: ${formatTime(gameState.timers.crownChest)}` : 'COLETAR!';
        const crownChest = document.getElementById('crown-chest');
        if (crownChest) crownChest.classList.toggle('ready', gameState.timers.crownChest <= 0);

        const chestSlotsContainer = document.getElementById('chest-slots-container');
        if (chestSlotsContainer) {
            chestSlotsContainer.innerHTML = '';
            gameState.chestSlots.forEach((c, i) => {
                const s = document.createElement('div'); s.className = 'chest-slot'; s.dataset.index = i;
                if (c) {
                    s.innerHTML = `<i class="${getChestIcon(c.type)} fa-2x"></i><span>${c.type}</span><span>${c.arena}</span><strong>${formatTime(c.remainingTime)}</strong>`;
                    s.classList.add(c.status);
                } else { s.innerHTML = `<span>Vazio</span>`; }
                chestSlotsContainer.appendChild(s);
            });
        }
    };

    /**
     * --- NEW: REWORKED SCREEN LOADING LOGIC ---
     * This function now only loads content into a specific panel and runs initializers.
     * It's called by the main `loadScreen` function.
     */
    /**
     * Loads screen content into a specific DOM element and initializes it.
     * @async
     * @param {string} screenName - The name of the screen to load (e.g., 'play', 'library').
     * @param {HTMLElement} targetPanel - The DOM element where content should be injected.
     * @param {Object} [params=null] - Optional parameters to pass to the screen initializer.
     */
    const loadContentIntoPanel = async (screenName, targetPanel, params = null) => {
        try {
            // NOTE: Using your path '/views/'
            const response = await fetch(`views/${screenName}.html`);
            if (!response.ok) throw new Error(`Could not load screen: ${screenName}`);

            const content = await response.text();
            targetPanel.innerHTML = content;

            // On desktop, track the context screen name
            if (targetPanel === contextPanel) {
                currentContextScreenName = screenName;
            }

            // Run screen-specific initialization logic (from your file)
            switch (screenName) {
                case 'play': initPlayScreen(gameState, updateDynamicUI, toast); break;
                case 'library': initLibraryScreen(gameState, updateDynamicUI, toast); break;
                case 'philosophers': initPhilosophersScreen(gameState, updateDynamicUI, toast); break;
                case 'schools': initSchoolsScreen(gameState, updateDynamicUI, toast); break;
                case 'symposium': initSymposiumScreen(gameState, updateDynamicUI, toast); break;
                case 'school_members': initSchoolMembersScreen(params, gameState); break;
                case 'reels': initReelsScreen(gameState); break;
                case 'shop': initShopScreen(gameState, updateDynamicUI, toast); break;
                default: console.warn(`No specific init function for screen: ${screenName}`);
            }

            updateDynamicUI();
        } catch (error) {
            console.error('Error loading screen content:', error);
            targetPanel.innerHTML = `<p>Error loading content.</p>`;
        }
    };

    /**
     * --- NEW: MAIN SCREEN ORCHESTRATOR ---
     * This function decides WHERE to load content based on viewport size.
     */
    /**
     * Orchestrates screen loading based on the device type (mobile vs desktop).
     * On desktop, manages the split view (main debate panel vs context panel).
     * On mobile, loads content into the single main view.
     * @param {string} screenName - The name of the screen to navigate to.
     * @param {Object} [params=null] - Optional navigation parameters.
     */
    const loadScreen = (screenName, params = null) => {
        // Update active state on navigation
        const navItems = mainNav.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            // Ignore logout button for active state
            if (item.id === 'logout-btn') return;
            item.classList.toggle('active', item.dataset.target === screenName);
        });

        if (isDesktopView()) {
            // DESKTOP LOGIC
            // The 'play' screen is fixed. Clicking it does nothing but set the active state.
            // Any other screen is loaded into the context panel.
            if (screenName !== 'play') {
                loadContentIntoPanel(screenName, contextPanel, params);
            }
        } else {
            // MOBILE LOGIC
            // All screens, including 'play', are loaded into the single main panel.
            loadContentIntoPanel(screenName, contextPanel, params);
        }
    };

    /**
     * --- INITIALIZATION FUNCTION ---
     */
    /**
     * Initializes the application.
     * Sets up sidebar state, loads initial screens, and attaches global event listeners.
     */
    const initialize = () => {
        initLayoutManager();

        // Initial screen loading
        if (isDesktopView()) {
            // DESKTOP: Load 'play' into the main panel and 'philosophers' into the context panel
            loadContentIntoPanel('play', mainDebatePanel);
            loadScreen('philosophers'); // Use loadScreen to set active nav item correctly
        } else {
            // MOBILE: Load 'play' into the only panel
            loadScreen('play');
        }

        // --- AUTH LISTENER ---
        subscribeToAuthChanges(async (user) => {
            if (!user) {
                // Check for Demo Mode
                if (localStorage.getItem('isDemoMode')) {
                    console.log("Running in Demo Mode");
                    // Create a mock user for demo purposes
                    user = {
                        uid: 'demo-user-123',
                        displayName: 'Demo User',
                        email: 'demo@demo.com',
                        isAnonymous: true
                    };
                } else {
                    // User signed out or session expired
                    window.location.href = 'login.html';
                    return;
                }
            }

            if (user) {
                console.log("Authenticated as:", user.displayName || user.email);
                currentUser = user;

                // Save user profile
                await saveUserProfile(user);

                // Load game progress
                const savedProgress = await loadGameProgress(user.uid);
                if (savedProgress) {
                    // Update local gameState with saved data
                    Object.assign(gameState, savedProgress);
                    updateDynamicUI();
                    toast.show("Progresso carregado da nuvem!", "success");
                }
            }
        });

        // --- EVENT LISTENERS ---

        // Navigation click handler
        mainNav.addEventListener('click', (e) => {
            const navItem = e.target.closest('.nav-item');
            if (navItem) {
                if (navItem.id === 'logout-btn') {
                    // Handle Logout
                    logout().then(() => {
                        window.location.href = 'login.html';
                    }).catch(err => console.error("Logout failed", err));
                    return;
                }

                if (navItem.dataset.target) {
                    e.preventDefault();
                    loadScreen(navItem.dataset.target);
                }
            }
        });

        // Header click listener (for popups)
        gameHeader.addEventListener('click', (e) => {
            if (e.target.closest('.xp-bar-container')) {
                popupManager.open('profile:level-xp');
            }
        });

        // --- MODIFIED: GLOBAL CLICK DELEGATION ---
        gameScreen.addEventListener('click', (e) => {
            let navigationAction = null;

            if (isDesktopView()) {
                // DESKTOP: Check which panel was clicked
                if (e.target.closest('#context-panel')) {
                    // Click was in the context panel, use its specific handler
                    switch (currentContextScreenName) {
                        case 'library': handleLibraryScreenClick(e, gameState, updateDynamicUI, toast); break;
                        case 'schools': navigationAction = handleSchoolsScreenClick(e, gameState, updateDynamicUI, toast); break;
                        case 'symposium': handleSymposiumScreenClick(e, gameState, updateDynamicUI, toast); break;
                        case 'philosophers': handlePhilosophersScreenClick(e, gameState, updateDynamicUI, toast); break;
                        case 'school_members': handleSchoolMembersScreenClick(e, gameState, toast); break;
                        case 'reels': handleReelsScreenClick(e, gameState, toast); break;
                        case 'shop': handleShopScreenClick(e, gameState, updateDynamicUI, toast); break;
                    }
                } else if (e.target.closest('#main-debate-panel')) {
                    // Click was in the fixed debate panel
                    handlePlayScreenClick(e, gameState, updateDynamicUI, toast);
                }
            } else {
                // MOBILE: The old logic works perfectly, as there's only one panel
                switch (currentContextScreenName) {
                    case 'play': handlePlayScreenClick(e, gameState, updateDynamicUI, toast); break;
                    case 'library': handleLibraryScreenClick(e, gameState, updateDynamicUI, toast); break;
                    case 'schools': navigationAction = handleSchoolsScreenClick(e, gameState, updateDynamicUI, toast); break;
                    case 'symposium': handleSymposiumScreenClick(e, gameState, updateDynamicUI, toast); break;
                    case 'philosophers': handlePhilosophersScreenClick(e, gameState, updateDynamicUI, toast); break;
                    case 'school_members': handleSchoolMembersScreenClick(e, gameState, toast); break;
                    case 'reels': handleReelsScreenClick(e, gameState, toast); break;
                    case 'shop': handleShopScreenClick(e, gameState, updateDynamicUI, toast); break;
                }
            }

            // Handle navigation actions returned from click handlers
            if (navigationAction && navigationAction.action === 'navigate') {
                loadScreen(navigationAction.screen, navigationAction.params);
            }
        });

        // --- GAME TIMER & AUTO-SAVE ---
        let saveCounter = 0;
        setInterval(() => {
            // Timer logic
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

            // Auto-save every 30 seconds
            saveCounter++;
            if (saveCounter >= 30) {
                if (currentUser) {
                    saveGameProgress(currentUser.uid, gameState);
                }
                saveCounter = 0;
            }
        }, 1000);
    };

    // --- START THE APPLICATION ---
    initialize();
});