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
        if (this.isMuted || !this.sounds[soundName]) return;
        // CRÍTICO: Clona para permitir que o som seja tocado múltiplas vezes simultaneamente
        const sound = this.sounds[soundName].cloneNode();
        sound.volume = 0.6;
        sound.play().catch(e => console.error(`Erro ao tocar o som ${soundName}:`, e));
    }
};