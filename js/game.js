/** 
 * @type {CanvasRenderingContext2D} Canvas rendering context 
 */
let ctx;

/** 
 * @type {World|null} Current game world instance 
 */
let world;

/** 
 * @type {Keyboard} Keyboard input state tracker 
 */
let keyboard = new Keyboard();

/**
 * Initializes the game by setting up the canvas, loading the start screen image,
 * and adding event listeners for the start button.
 */


window.addEventListener('load', init);

function init() {
  const canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  startImage = new Image();
  startImage.src = 'assets/img/9_intro_outro_screens/start/startscreen_1.png';
  startImage.onload = () => {
    loadStartScreen();
      canvas.addEventListener('click', handleCanvasClick);

  };
}
/**
 * Event listener for fullscreen change.
 * Updates the world's fullscreen state when fullscreen mode changes.
 */
window.addEventListener("fullscreenchange", () => {
  if (world) {
    world.isFullscreen = !!document.fullscreenElement;
  }
});

/**
 * Toggles fullscreen mode for the game container.
 * If not fullscreen, enters fullscreen on the element with id 'relative'.
 * Otherwise exits fullscreen.
 * Also hides or shows the legal notice accordingly.
 */
function toggleFullscreenGame() {
  const fullscreenDiv = document.getElementById('relative');

  if (!document.fullscreenElement) {
    enterFullscreen(fullscreenDiv);
    document.getElementById('legal').style.display = 'none';
  } else {
    exitFullscreen();
    document.getElementById('legal').style.display = 'block';
  }
}

/**
 * Requests fullscreen mode for a given element.
 * Sets the world's fullscreen flag to true after entering fullscreen.
 * @param {HTMLElement} element - The element to make fullscreen.
 */
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen().then(() => {
      if (world) world.isFullscreen = true;
    });
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
    if (world) world.isFullscreen = true;
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
    if (world) world.isFullscreen = true;
  }
}

/**
 * Exits fullscreen mode if currently active.
 */
function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

/**
 * Handles click events on the canvas for the "Start Game" button.
 * Calculates click position relative to the canvas scale and
 * starts the game if click is inside the start button area and game is not running.
 * @param {MouseEvent} event - Mouse click event on the canvas.
 */
function handleCanvasClick(event) {
  const rect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  if (x >= 60 && x <= 160 && y >= 30 && y <= 80 && !world) {
    startGame();
  }
}

/**
 * Loads and displays the start screen.
 * Shows relevant UI elements like fullscreen toggle, audio, legend, and statement icons.
 */
function loadStartScreen() {
  drawStartScreen();
  document.getElementById('fullscreen').style.display = 'flex';
  document.getElementById('audio').style.display = 'flex';
  document.getElementById('legend').style.display = 'flex';
  document.getElementById('statement').style.display = 'flex';
}

/**
 * Draws the start screen image and UI elements on the canvas.
 * Also overlays explanation or intro if those flags are set.
 */
function drawStartScreen() {
  if (!startImage) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);
  drawStartButton(ctx); 

  if (showExplanation) {
    drawExplanationOverlayBeforeStart(ctx);
  }
  if (showIntro) {
    drawIntro(ctx);
  }
}

/**
 * Draws a rounded rectangular "Start" button on the canvas at fixed coordinates.
 * Uses shadow, fill, and stroke styles for visual effect.
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context.
 */
function drawStartButton(ctx) {
  const x = 60;
  const y = 30;
  const width = 100;
  const height = 50;
  const radius = 20;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  drawRoundedRect(ctx, x, y, width, height, radius);
  ctx.fillStyle = '#ff9247';
  ctx.fill();

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'white';
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = 'white';
  ctx.font = '30px "zabras", Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Start', x + width / 2, y + height / 2);
}

/**
 * Draws a rounded rectangle path on the canvas.
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context.
 * @param {number} x - X coordinate of the rectangle's top-left corner.
 * @param {number} y - Y coordinate of the rectangle's top-left corner.
 * @param {number} width - Width of the rectangle.
 * @param {number} height - Height of the rectangle.
 * @param {number} radius - Radius of the rounded corners.
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Starts the game by creating the world and level,
 * starting enemy animations,
 * and adjusting UI elements visibility.
 */
function startGame() {
  if (world) {
    world.stopGameLoop();
    world = null;
  }
  startSound();
  const level1 = createLevel1();
  world = new World(canvas, keyboard, level1);
  world.level.enemies.forEach(enemy => enemy.animate());
  
  document.getElementById('legend').style.display = 'none';
  document.getElementById('statement').style.display = 'none';
  document.getElementById('fullscreen').style.display = 'flex';

  document.getElementById('pause').style.display = 'flex';
  document.getElementById('back').style.display = 'flex';
  document.getElementById('window_back').style.display = 'none';
  document.getElementById('mobileControls').classList.add('visible');
  startSound();
}

/**
 * Returns to the start screen,
 * clears the current world,
 * resets UI elements and flags.
 */
function backToStart() {
  if (world) {
    world.stopGameLoop();
    world = null;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStartScreen();
  showExplanation = false;
  showIntro = false;
  document.getElementById('fullscreen').style.display = 'flex';
  document.getElementById('audio').style.display = 'flex';
  document.getElementById('legend').style.display = 'flex';
  document.getElementById('statement').style.display = 'flex';
  document.getElementById('pause').style.display = 'none';
  document.getElementById('back').style.display = 'none';
  document.getElementById('window_back').style.display = 'none';
  document.getElementById('mobileControls').style.display = 'none';
    document.getElementById('mobileControls').classList.remove('visible');

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
