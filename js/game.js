let ctx;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    loadStart(canvas);

    const button = document.getElementById('startButton');
    button.addEventListener('click', startGame);
};


function drawStartScreenWithOverlay() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const startImage = new Image();
    startImage.src = 'assets/img/9_intro_outro_screens/start/startscreen_1.png';
    startImage.onload = () => {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);

        if (showExplanation) {
            drawExplanationOverlayBeforeStart(ctx);
        }

         if (showIntro) {
            drawIntro(ctx);
        }
    };
}

function loadStart() {
    drawStartScreenWithOverlay(); 

    document.getElementById('fullscreen').style.display = 'flex';
    document.getElementById('audio').style.display = 'flex';
    document.getElementById('legend').style.display = 'flex';
    document.getElementById('statement').style.display = 'flex';
}

function startGame() {
    world = new World(canvas, keyboard);
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('fullscreen').style.display = 'none';
    document.getElementById('legend').style.display = 'none';
    document.getElementById('statement').style.display = 'none';
    document.getElementById('pause').style.display = 'flex';
    document.getElementById('back').style.display = 'flex';


}


function backToStart() {
    if (world) {
        world.active = false;
        world = null;
    }

    showExplanation = false;
    showIntro = false;

  
    init(); 

    
    document.getElementById('startButton').style.display = 'flex';
    document.getElementById('fullscreen').style.display = 'flex';
    document.getElementById('audio').style.display = 'flex';
    document.getElementById('legend').style.display = 'flex';
    document.getElementById('statement').style.display = 'flex';

    document.getElementById('pause').style.display = 'none';
    document.getElementById('back').style.display = 'none';
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




