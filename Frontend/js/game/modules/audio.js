export const SoundManager = {
    isMuted: false,
    sounds: {},
    soundFiles: {
        play_card: '../assets/game/audio/flipcard.mp3',
        draw_card: '../assets/game/audio/flipcard.mp3',
        button_click: '../assets/game/audio/flipcard.mp3',
        shuffle: '../assets/game/audio/flipcard.mp3',
        win: '../assets/game/audio/flipcard.mp3',
        lose: '../assets/game/audio/flipcard.mp3',
        error: '../assets/game/audio/flipcard.mp3',
        power_activate: '../assets/game/audio/flipcard.mp3',
        matchmaking_start: '../assets/game/audio/flipcard.mp3',
        match_found: '../assets/game/audio/flipcard.mp3'
    },
    init() {
        for (const key in this.soundFiles) {
            this.sounds[key] = new Audio(this.soundFiles[key]);
            this.sounds[key].volume = 0.6;
        }
    },
    toggleMute(isMuted) {
        this.isMuted = isMuted;
    },
    play(soundName) {
        if (this.isMuted) return;

        // Check for theme-specific override
        let soundSrc = this.soundFiles[soundName];
        if (this.currentTheme && this.currentTheme.sfx && this.currentTheme.sfx[soundName]) {
            soundSrc = this.currentTheme.sfx[soundName];
        }

        // If we have a pre-loaded sound and no override, use it. 
        // If override, we might need to load it dynamically or check if it's in a separate cache.
        // For simplicity, we'll assume overrides are also paths and we might create new Audio objects if needed, 
        // or better, we update the 'sounds' object when theme changes.

        const sound = this.sounds[soundName];
        if (sound) {
            const clone = sound.cloneNode();
            clone.volume = 0.6;
            clone.play().catch(e => console.error(`Erro ao tocar o som ${soundName}:`, e));
        }
    },

    /**
     * Sets the audio theme, updating sound mappings.
     * @param {object} theme - The theme configuration.
     */
    setAudioTheme(theme) {
        this.currentTheme = theme;

        // Update sound files if theme provides overrides
        if (theme.sfx) {
            for (const [key, path] of Object.entries(theme.sfx)) {
                // Update the sound object with the new path
                this.sounds[key] = new Audio(path);
                this.sounds[key].volume = 0.6;
            }
        }

        // Handle Music (BGM)
        if (theme.music) {
            // Stop current BGM if playing (not implemented yet in base, but placeholder logic)
            // this.playBGM(theme.music);
        }
    }
};