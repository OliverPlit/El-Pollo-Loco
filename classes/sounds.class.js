class SoundManager {
    constructor() {
        this.sounds = [];
        this.isMuted = false;
    }

    addSound(sound) {
        if (sound && typeof sound.play === 'function') {
            this.sounds.push(sound);
            sound.muted = this.isMuted;
        }
    }

    muteAll() {
        this.isMuted = true;
        this.sounds.forEach(s => {
            s.muted = true;
            s.pause();
            s.currentTime = 0;
        });
    }

    unmuteAll() {
        this.isMuted = false;
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