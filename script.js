let showExplanation = false;
let showIntro = false;
let isAudioMuted = false;

const allSounds = [];

const backgroundAudio = document.getElementById('startSound');
const audioImg = document.getElementById('audio');

const walkingSound = new Audio('./audio/537180__colorscrimsontears__walking-on-sand-and-gravel.wav');
const jumpSound = new Audio('./audio/172660__qubodup__boing-jump-cc-by-cfork-boing_rawaif-7967.flac');



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

function toggleExplanationCanvas() {
    showExplanation = !showExplanation;
    drawStartScreen();
}

function toggleIntro() {
    showIntro = !showIntro;
    drawStartScreen();
}

function drawExplanationOverlayBeforeStart(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(60, 60, 600, 300);
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText('Controls:', 80, 100);
    ctx.font = '20px Arial';
    ctx.fillText('← A: Nach links', 80, 140);
    ctx.fillText('→ D: Nach rechts', 80, 170);
    ctx.fillText('␣ SPACE: Springen', 80, 200);
    ctx.fillText('D: Werfen', 80, 230);
    ctx.fillText('ESC: Schließen', 80, 270);
}

function drawIntro(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(60, 60, 600, 300);
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText('Intro:', 80, 100);
    ctx.font = '20px Arial';
    ctx.fillText('Pedro war einst ein einfacher Mann.', 80, 140);
    ctx.fillText('Ein Taco-Liebhaber, ein Sombrero-Träger,', 80, 170);
    ctx.fillText('ein ruhiger Zeitgenosse mit einem kleinen Hühnerhof.', 80, 200);
    ctx.fillText('Alles war gut – bis sie kamen.', 80, 230);
    ctx.fillText('Die verrückten Hühner angeführt vom ', 80, 260);
    ctx.fillText('Oberhuhn Gallino rebellierten.', 80, 290);
}

function startSound() {
    const backgroundAudio = document.getElementById('startSound');

    backgroundAudio.play();
}

function startAudio() {
    backgroundAudio.play();
}

function toggleAudio() {
    const iconOn = './assets/img/icons/speaker-filled-audio-tool.png';
    const iconOff = 'assets/img/icons/sound-off.png';

    if (window.soundManager.isMuted) {
        backgroundAudio.play();
        window.soundManager.unmuteAll();
        audioImg.src = iconOn;
    } else {
        backgroundAudio.pause();
        backgroundAudio.currentTime = 0;
        window.soundManager.muteAll();
        audioImg.src = iconOff;
    }
}

function showButton() {
    const btn = document.getElementById('backToHome');
    btn.style.display = 'flex';
    btn.addEventListener('click', startGame);
}

function stopGameplay() {
    const pauseImg = document.getElementById('pause');
    if (!world) return;

    const isPaused = pauseImg.src.endsWith('pause.png');

    pauseImg.src = isPaused ? './assets/img/icons/play.png' : './assets/img/icons/pause.png';

    if (isPaused) {
        world.stopGameLoop();
    } else {
        world.resumeGameLoop();
    }

    world.paused = !isPaused;
}




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