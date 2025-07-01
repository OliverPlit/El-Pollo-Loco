/**
 * Manages multiple sound objects, allowing to mute, unmute, and toggle sound globally.
 * Also persists mute state in localStorage.
 */
class SoundManager {
    /**
     * Initializes the SoundManager, loads mute state from localStorage,
     * and prepares an empty list of sounds.
     */
    constructor() {
        this.sounds = [];
        const mutedFromStorage = localStorage.getItem('soundMuted');
        this.isMuted = mutedFromStorage === 'true' ? true : false;
    }

    /**
     * Adds a sound object to the manager and applies current mute state.
     * @param {HTMLAudioElement} sound - The sound object to manage.
     */
    addSound(sound) {
        if (sound && typeof sound.play === 'function') {
            this.sounds.push(sound);
            sound.muted = this.isMuted;
        }
    }

    /**
     * Mutes all managed sounds, pauses them, resets playback, and saves state.
     */
    muteAll() {
        this.isMuted = true;
        localStorage.setItem('soundMuted', 'true'); 
        this.sounds.forEach(s => {
            s.muted = true;
            s.pause();
            s.currentTime = 0;
        });
    }

    /**
     * Unmutes all managed sounds and saves state.
     */
    unmuteAll() {
        this.isMuted = false;
        localStorage.setItem('soundMuted', 'false');
        this.sounds.forEach(s => {
            s.muted = false;
        });
    }

    /**
     * Toggles the mute state of all managed sounds.
     */
    toggle() {
        this.isMuted ? this.unmuteAll() : this.muteAll();
    }

    /**
     * Returns whether the sounds are currently muted.
     * @returns {boolean} True if muted, false otherwise.
     */
    isMuted() {
        return this.isMuted;
    }
}

window.soundManager = new SoundManager();
