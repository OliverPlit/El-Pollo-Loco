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


if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });
}


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
    const boxWidth = canvas.width * 0.8;
    const boxHeight = canvas.height * 0.5;
    const boxX = (canvas.width - boxWidth) / 2;
    const boxY = (canvas.height - boxHeight) / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    ctx.fillStyle = '#ffffff';
    ctx.font = `${Math.floor(canvas.height * 0.05)}px Arial`;
    ctx.fillText('Controls:', boxX + boxWidth * 0.1, boxY + boxHeight * 0.15);

    ctx.font = `${Math.floor(canvas.height * 0.035)}px Arial`;
    ctx.fillText('← : Move left', boxX + boxWidth * 0.15, boxY + boxHeight * 0.30);
    ctx.fillText('→ : Move right', boxX + boxWidth * 0.15, boxY + boxHeight * 0.40);
    ctx.fillText('␣ SPACE: Jump', boxX + boxWidth * 0.15, boxY + boxHeight * 0.50);
    ctx.fillText('D: Throw', boxX + boxWidth * 0.15, boxY + boxHeight * 0.60);
    ctx.fillText('ESC: Close', boxX + boxWidth * 0.15, boxY + boxHeight * 0.70);
}

/**
 * Draws a semi-transparent intro story overlay on the canvas.
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 */
function drawIntro(ctx) {
    const boxWidth = canvas.width * 0.8;
    const boxHeight = canvas.height * 0.5;
    const boxX = (canvas.width - boxWidth) / 2;
    const boxY = (canvas.height - boxHeight) / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    ctx.fillStyle = '#ffffff';
    ctx.font = `${Math.floor(canvas.height * 0.05)}px Arial`;
    ctx.fillText('Intro:', boxX + boxWidth * 0.1, boxY + boxHeight * 0.2);

    ctx.font = `${Math.floor(canvas.height * 0.035)}px Arial`;
    const lines = [
        'Pedro was once a simple man.',
        'A taco lover, a sombrero wearer,',
        'a quiet fellow with a small chicken farm.',
        'Everything was fine – until they came.',
        'The crazy chickens led by',
        'Chief Hen Gallino rebelled.',
    ];

    lines.forEach((line, i) => {
        ctx.fillText(line, boxX + boxWidth * 0.5, boxY + boxHeight * (0.35 + i * 0.1));
    });
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
function pressKeyDown(key) {
    if (!keyboard) return;
    switch (key) {
        case 'LEFT': keyboard.LEFT = true; break;
        case 'RIGHT': keyboard.RIGHT = true; break;
        case 'D': keyboard.D = true; break;
        case 'SPACE': keyboard.SPACE = true; break;
    }
}

function pressKeyUp(key) {
    if (!keyboard) return;
    switch (key) {
        case 'LEFT': keyboard.LEFT = false; break;
        case 'RIGHT': keyboard.RIGHT = false; break;
        case 'D': keyboard.D = false; break;
        case 'SPACE': keyboard.SPACE = false; break;
    }
}

/**
 * Keyboard event listener for keydown events.
 * Updates keyboard state flags to true based on pressed keys.
 * @param {KeyboardEvent} event 
 */
window.addEventListener('keydown', (event) => {
  if (event.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (event.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (event.keyCode == 38) {
    keyboard.UP = true;
  }
  if (event.keyCode == 40) {
    keyboard.DOWN = true;
  }
  if (event.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (event.keyCode == 68) {
    keyboard.D = true;
  }
});

/**
 * Keyboard event listener for keyup events.
 * Updates keyboard state flags to false based on released keys.
 * @param {KeyboardEvent} event 
 */
window.addEventListener('keyup', (event) => {
  if (event.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (event.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (event.keyCode == 38) {
    keyboard.UP = false;
  }
  if (event.keyCode == 40) {
    keyboard.DOWN = false;
  }
  if (event.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (event.keyCode == 68) {
    keyboard.D = false;
  }
});