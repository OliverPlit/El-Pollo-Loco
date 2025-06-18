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
 drawStartScreen();}


function toggleIntro() {
    showIntro = !showIntro;
 drawStartScreen();}

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
    ctx.fillText('Intro:', 80, 100, 80, 80);
    ctx.font = '20px Arial';
    
    ctx.fillText('Pedro war einst ein einfacher Mann. ' ,80, 140);
    ctx.fillText('Ein Taco-Liebhaber, ein Sombrero-Träger, ',80, 170);
    ctx.fillText('ein ruhiger Zeitgenosse mit einem kleinen Hühnerhof.',80, 200);
    ctx.fillText('Alles war gut – bis sie kamen.',80, 230);
    ctx.fillText('Die verrückten Hühner Angeführt vom größenwahnsinnigen Oberhuhn General Gallino rebellierten sie', 80, 260);
    
}

function startSound() {
const audio = document.getElementById('startSound');
  //  audio.play();
}

function toggleAudio() {
 // const allSounds = [
    new Audio('./audio/537180__colorscrimsontears__walking-on-sand-and-gravel.wav'),
    new Audio('./audio/172660__qubodup__boing-jump-cc-by-cfork-boing_rawaif-7967.flac')
 // ];  
   muteAudio(allSounds)
}

function startAudio() {
const audio = document.getElementById('audio');
   // audio.play();
}

function muteAudio(allSounds) {
  const audioImg = document.getElementById('audio');
  const audio = document.getElementById('startSound');

  if (audioImg.src.endsWith('speaker-filled-audio-tool.png')) {
    audioImg.src = 'assets/img/icons/sound-off.png';
    audio.pause();

    allSounds.forEach((sound) => {
      if (sound) {
        sound.pause();
        sound.currentTime = 0; 
      }
    });
  } else {
    audioImg.src = './assets/img/icons/speaker-filled-audio-tool.png';
    audio.play();

    allSounds.forEach((sound) => {
      if (sound) {
        sound.play();
      }
    });
  }
}










function stopGameplay() {
    const pauseImg = document.getElementById('pause');

if (pauseImg.src.endsWith('pause.png')) {
    pauseImg.src = './assets/img/icons/play.png'
    world.stopGameLoop();
}
else {
    pauseImg.src = './assets/img/icons/pause.png';
     world.resumeGameLoop();
}
    if (world) {
        world.paused = !world.active;
    }
}