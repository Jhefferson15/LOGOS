/**
 * Manages the available game mechanics and the active mechanic.
 */
import { TemporalMechanic } from './TemporalMechanic.js';
import { UnoMechanic } from './UnoMechanic.js';
import { ConceptualMechanic } from './ConceptualMechanic.js';
import { CombatMechanic } from './CombatMechanic.js';
import { TrucoMechanic } from './TrucoMechanic.js';
import { PifPafMechanic } from './PifPafMechanic.js';

/**
 * Manages the available game mechanics and the active mechanic.
 */
export const MechanicManager = {
    mechanics: {},
    activeMechanicId: null,
    initialized: false,

    /**
     * Registers a new game mechanic.
     * @param {GameMechanic} mechanicInstance - An instance of a GameMechanic subclass.
     */
    registerMechanic(mechanicInstance) {
        if (this.mechanics[mechanicInstance.id]) {
            console.warn(`Mechanic with ID '${mechanicInstance.id}' is already registered. Overwriting.`);
        }
        this.mechanics[mechanicInstance.id] = mechanicInstance;
    },

    /**
     * Sets the active mechanic.
     * @param {string} mechanicId - The ID of the mechanic to activate.
     */
    setActiveMechanic(mechanicId) {
        if (!this.mechanics[mechanicId]) {
            console.error(`Mechanic with ID '${mechanicId}' not found.`);
            return;
        }
        this.activeMechanicId = mechanicId;
        const mechanic = this.mechanics[mechanicId];
        console.log(`Active mechanic set to: ${mechanic.name}`);

        // Apply Theme
        if (window.GameUI) {
            const theme = mechanic.getTheme();
            if (window.GameUI.applyTheme) {
                window.GameUI.applyTheme(theme);
            }
            if (window.GameUI.setAudioTheme) { // SoundManager is mixed into GameUI
                window.GameUI.setAudioTheme(theme);
            }
        }
    },

    /**
     * Gets the currently active mechanic.
     * @returns {GameMechanic} The active mechanic instance.
     */
    getActiveMechanic() {
        if (!this.activeMechanicId) {
            // Fallback to temporal if not set (safety net)
            if (this.mechanics['temporal']) {
                this.setActiveMechanic('temporal');
                return this.mechanics['temporal'];
            }
            throw new Error("No active mechanic set.");
        }
        return this.mechanics[this.activeMechanicId];
    },

    /**
     * Returns a list of all registered mechanics.
     * @returns {Array<object>} Array of mechanic metadata (id, name, description).
     */
    getAvailableMechanics() {
        return Object.values(this.mechanics).map(m => ({
            id: m.id,
            name: m.name,
            description: m.description
        }));
    },

    /**
     * Initializes the manager with default mechanics.
     */
    init() {
        if (this.initialized) return;

        this.registerMechanic(new TemporalMechanic());
        this.registerMechanic(new UnoMechanic());
        this.registerMechanic(new ConceptualMechanic());
        this.registerMechanic(new CombatMechanic());
        this.registerMechanic(new TrucoMechanic());
        this.registerMechanic(new PifPafMechanic());

        // Default is now handled by the caller (game.js) to avoid overriding persistence

        this.initialized = true;
    }
};

// Auto-initialize on module load
MechanicManager.init();
