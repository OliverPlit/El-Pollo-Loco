let ctx;
let world;
let keyboard = new Keyboard();


function init() {
  const canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  startImage = new Image();
  startImage.src = 'assets/img/9_intro_outro_screens/start/startscreen_1.png';
  startImage.onload = () => {
    loadStartScreen();
  };
  document.getElementById('startButton').addEventListener('click', startGame);
}


function loadStartScreen() {
  drawStartScreen();
  document.getElementById('fullscreen').style.display = 'flex';
  document.getElementById('audio').style.display = 'flex';
  document.getElementById('legend').style.display = 'flex';
  document.getElementById('statement').style.display = 'flex';
}


function drawStartScreen() {
  if (!startImage) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);
  if (showExplanation) {
    drawExplanationOverlayBeforeStart(ctx);
  }
  if (showIntro) {
    drawIntro(ctx);
  }
}


function startGame() {
  if (world) {
    world.stopGameLoop();
    world = null;
  }
  const level1 = createLevel1();
  world = new World(canvas, keyboard, level1);
  world.level.enemies.forEach(enemy => enemy.animate());
  document.getElementById('startButton').style.display = 'none';
  document.getElementById('fullscreen').style.display = 'none';
  document.getElementById('legend').style.display = 'none';
  document.getElementById('statement').style.display = 'none';
  document.getElementById('pause').style.display = 'flex';
  document.getElementById('back').style.display = 'flex';
  document.getElementById('window_back').style.display = 'none';
  startSound();
}


function backToStart() {
  if (world) {
    world.stopGameLoop();
    world = null;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStartScreen();
  showExplanation = false;
  showIntro = false;
  document.getElementById('startButton').style.display = 'block';
  document.getElementById('fullscreen').style.display = 'flex';
  document.getElementById('audio').style.display = 'flex';
  document.getElementById('legend').style.display = 'flex';
  document.getElementById('statement').style.display = 'flex';
  document.getElementById('pause').style.display = 'none';
  document.getElementById('back').style.display = 'none';
  document.getElementById('window_back').style.display = 'none';

}


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




