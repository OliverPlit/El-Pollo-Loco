/** 
 * @type {boolean} Flag to toggle the explanation overlay on the start screen 
 */
let showExplanation = false;

/** 
 * @type {boolean} Flag to toggle the intro overlay on the start screen 
 */
let showIntro = false;
let isAudioMuted = localStorage.getItem('audioMuted') === 'true';

/** 
 * @type {boolean} Flag indicating whether audio is muted 
 */

/** 
 * @type {Audio[]} Array to hold all sound objects for global control 
 */
const allSounds = [];

/** 
 * @type {HTMLAudioElement} Background audio element for the start sound 
 */
const backgroundAudio = document.getElementById('startSound');

/** 
 * @type {HTMLImageElement} Audio icon image element 
 */
const audioImg = document.getElementById('audio');

/** 
 * @type {HTMLAudioElement} Sound effect for walking 
 */
const walkingSound = new Audio('./audio/537180__colorscrimsontears__walking-on-sand-and-gravel.wav');

/** 
 * @type {HTMLAudioElement} Sound effect for jumping 
 */
const jumpSound = new Audio('./audio/172660__qubodup__boing-jump-cc-by-cfork-boing_rawaif-7967.flac');

/**
 * Toggles fullscreen mode for the game canvas.
 * Uses vendor prefixes for compatibility.
 */
function toggleFullscreen() {
    let canvas = document.getElementById('canvas');
    if (!document.fullscreenElement) {
        canvas.requestFullscreen?.() ||
            canvas.webkitRequestFullscreen?.() ||
            canvas.msRequestFullscreen?.();
    } else {
        document.exitFullscreen?.();
    }
}

/**
 * Toggles the display of the explanation overlay on the start screen.
 * Redraws the start screen after toggling.
 */
function toggleExplanationCanvas() {
    showExplanation = !showExplanation;
    drawStartScreen();
}

/**
 * Toggles the display of the intro overlay on the start screen.
 * Redraws the start screen after toggling.
 */
function toggleIntro() {
    showIntro = !showIntro;
    drawStartScreen();
}

/**
 * Draws a semi-transparent overlay on the canvas explaining controls,
 * shown before the game starts.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 */
function drawExplanationOverlayBeforeStart(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(60, 60, 600, 300);
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText('Controls:', 140, 100);
    ctx.font = '20px Arial';
    ctx.fillText('← : Move left', 170, 140);
    ctx.fillText('→ : Move right', 180, 180);
    ctx.fillText('␣ SPACE: Jump', 180, 220);
    ctx.fillText('D: Throw', 150, 260);
    ctx.fillText('ESC: Close', 160, 300);
}

/**
 * Draws a semi-transparent intro story overlay on the canvas.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 */
function drawIntro(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(60, 60, 600, 300);
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText('Intro:', 120, 90);
    ctx.font = '20px Arial';
    ctx.fillText('Pedro was once a simple man.', 245, 140);
    ctx.fillText('A taco lover, a sombrero wearer,', 250, 170);
    ctx.fillText('a quiet fellow with a small chicken farm.', 280, 200);
    ctx.fillText('Everything was fine – until they came.', 270, 230);
    ctx.fillText('The crazy chickens led by', 220, 260);
    ctx.fillText('Chief Hen Gallino rebelled.', 220, 290);
}

/**
 * Starts playing the background audio.
 */
function startSound() {
    const backgroundAudio = document.getElementById('startSound');
    if (!isAudioMuted) {
        backgroundAudio.play();
    }

}

/**
 * Starts playing the background audio (alias of startSound).
 */
function startAudio() {
    backgroundAudio.play();
}

/**
 * Toggles audio mute state for background and all other sounds.
 * Updates the audio icon accordingly.
 */
function toggleAudio() {
    const iconOn = './assets/img/icons/speaker-filled-audio-tool.png';
    const iconOff = 'assets/img/icons/sound-off.png';

    isAudioMuted = !isAudioMuted;

    if (isAudioMuted) {
        backgroundAudio.pause();
        backgroundAudio.currentTime = 0;
        window.soundManager.muteAll();
        audioImg.src = iconOff;
    } else {
        backgroundAudio.play();
        window.soundManager.unmuteAll();
        audioImg.src = iconOn;
    }
    localStorage.setItem('audioMuted', isAudioMuted);
}

/**
 * Adds a click listener to the backToHome button which starts the game.
 */
function showButton() {
    const btn = document.getElementById('backToHome');
    btn.addEventListener('click', startGame);
}

/**
 * Toggles gameplay pause/resume and updates pause button icon.
 */
function stopGameplay() {
    const pauseImg = document.getElementById('pause');
    if (!world) return;

    const isCurrentlyPaused = world.paused;
    const newPausedStatus = !isCurrentlyPaused;

    pauseImg.src = newPausedStatus ? './assets/img/icons/play.png' : './assets/img/icons/pause.png';

    if (newPausedStatus) {
        world.stopGameLoop();
    } else {
        world.resumeGameLoop();
    }

    world.paused = newPausedStatus;
}

/**
 * Simulates pressing a keyboard key programmatically.
 * Sets the respective keyboard flags true, then resets them after 200ms.
 * @param {string} key - One of 'LEFT', 'RIGHT', 'J', 'SPACE'
 */
function pressKey(key) {
    if (!keyboard) return;
    switch (key) {
        case 'LEFT': keyboard.LEFT = true; break;
        case 'RIGHT': keyboard.RIGHT = true; break;
        case 'J': keyboard.D = true; break;
        case 'SPACE': keyboard.SPACE = true; break;
    }
    setTimeout(() => {
        if (key === 'LEFT') keyboard.LEFT = false;
        if (key === 'RIGHT') keyboard.RIGHT = false;
        if (key === 'J') keyboard.D = false;
        if (key === 'SPACE') keyboard.SPACE = false;
    }, 200);
}
