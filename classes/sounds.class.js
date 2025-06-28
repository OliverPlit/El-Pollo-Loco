class SoundManager {
    constructor() {
        this.sounds = [];
        // Lade den Mute-Status aus localStorage, falls vorhanden, sonst false
        const mutedFromStorage = localStorage.getItem('soundMuted');
        this.isMuted = mutedFromStorage === 'true' ? true : false;
    }

    addSound(sound) {
        if (sound && typeof sound.play === 'function') {
            this.sounds.push(sound);
            sound.muted = this.isMuted;
        }
    }

    muteAll() {
        this.isMuted = true;
        localStorage.setItem('soundMuted', 'true'); 
        this.sounds.forEach(s => {
            s.muted = true;
            s.pause();
            s.currentTime = 0;
        });
    }

    unmuteAll() {
        this.isMuted = false;
        localStorage.setItem('soundMuted', 'false');
        this.sounds.forEach(s => {
            s.muted = false;
        });
    }

    toggle() {
        this.isMuted ? this.unmuteAll() : this.muteAll();
    }

    isMuted() {
        return this.isMuted;
    }
}

window.soundManager = new SoundManager();
