let showExplanation = false;
let showIntro = false;




function toggleFullscreen() {
    let canvas = document.getElementById('canvas');

    if (!document.fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) { 
            canvas.webkitRequestFullscreen();
        } else if (canvas.msRequestFullscreen) {
            canvas.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}


 
function toggleExplanationCanvas() {
   
    showExplanation = !showExplanation;
    drawStartScreenWithOverlay();
}


function toggleIntro() {
    showIntro = !showIntro;
     drawStartScreenWithOverlay();
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
    ctx.fillText('Pedro war einst ein einfacher Mann. Ein Taco-Liebhaber, ein Sombrero-Träger, ein ruhiger Zeitgenosse mit einem kleinen Hühnerhof. Alles war gut – bis sie kamen.', 80, 140);
    ctx.fillText('Die verrückten Hühner Angeführt vom größenwahnsinnigen Oberhuhn General Gallino rebellierten sie', 80, 170);
    
}


function muteAudio() {
const audioImg = document.getElementById('audio');

if (audioImg.src.endsWith('speaker-filled-audio-tool.png')) {
    audioImg.src = 'assets/img/icons/sound-off.png'
}
else {
    audioImg.src = './assets/img/icons/speaker-filled-audio-tool.png';
}



}


function stopGameplay() {
    const pauseImg = document.getElementById('pause');

if (pauseImg.src.endsWith('pause.png')) {
    pauseImg.src = './assets/img/icons/play.png'
}
else {
    pauseImg.src = './assets/img/icons/pause.png';
}
    if (world) {
        world.paused = !world.paused;
    }
}