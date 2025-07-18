/**
 * Represents the game world including the character, enemies, objects, canvas and game logic.
 */
class World {
    /** @type {Character} */
    character = new Character();
    /** @type {HTMLCanvasElement} */
    canvas;
    /** @type {CanvasRenderingContext2D} */
    ctx;
    keyboard;
    camera_x = 0;

    /** @type {StatusBar} */
    statusBarHealth = new StatusBar('health');
    statusBarBottles = new StatusBar('sauce');
    statusBarCoins = new StatusBar('coins');

    /** @type {Endboss} */
    endboss = new Endboss();
    /** @type {ThrowableObject[]} */
    throwableObjects = [];
    /** @type {Coins[]} */
    coins = [];
    /** @type {Bottle[]} */
    bottles = [];

    /** @type {boolean} */
    hasPlayedLoseSound = false;
    windowBackShown = false;
    isFullscreen = false;
    paused = false;
    active = true;
    gameOver = false;
    gameWin = false;

    /** @type {number} */
    lastBottleThrowTime = 0;

    /** @type {HTMLAudioElement} */
    loseSound = new Audio('./audio/350987__cabled_mess__lose_c_05.wav');
    winSound = new Audio('./audio/270545__littlerobotsoundfactory__jingle_win_01.wav');
    coinSound = new Audio('./audio/402767__lilmati__retro-coin-03.wav');
    collectBottle = new Audio('./audio/711129__xiko__retro-collection-3.wav');

    /** @type {number} */
    requestAnimationFrameID;
    frameSkipCounter = 0;
    frameSkipRate = 2;



    /**
     * Creates an instance of the World.
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {Keyboard} keyboard - The keyboard input tracker.
     * @param {Level} level - The current level object.
     */
    constructor(canvas, keyboard, level) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level;

        this.setWorld();
        this.generateCoins();
        this.generateBottles();
        this.assignWorldToEnemies();
        addCollisionFunctionsToWorld(this);
        this.run();
        this.muteSounds();
        this.draw();

        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
    }

    /** Registers all game sounds with the global sound manager. */
    muteSounds() {
        window.soundManager.addSound(this.coinSound);
        window.soundManager.addSound(this.collectBottle);
        window.soundManager.addSound(this.winSound);
        window.soundManager.addSound(this.loseSound);
    }

    /** Assigns the world reference to all enemies. */
    assignWorldToEnemies() {
        this.level.enemies.forEach(enemy => enemy.world = this);
    }

    /** Assigns the world to the character and starts character animation. */
    setWorld() {
        this.character.world = this;
        this.character.animate();
    }

    /** Randomly generates coin positions in the level without overlapping. */
    generateCoins() {
        const minDistance = 80;
        while (this.coins.length < 30) {
            let coin = new Coins();
            coin.x = 100 + Math.random() * 2800;
            coin.y = 100 + Math.random() * 280;
            if (!this.coins.some(c => Math.hypot(c.x - coin.x, c.y - coin.y) < minDistance)) {
                this.coins.push(coin);
            }
        }
    }

    /** Randomly generates bottle positions in the level without overlapping. */
    generateBottles() {
        const minDistance = 200;
        while (this.bottles.length < 5) {
            let bottle = new Bottle();
            bottle.x = 300 + Math.random() * 2500;
            bottle.y = 370;
            if (!this.bottles.some(c => Math.hypot(c.x - bottle.x, c.y - bottle.y) < minDistance)) {
                this.bottles.push(bottle);
            }
        }
    }

    /** Starts checking for collisions and throw inputs repeatedly. */
    run() {
        this.checkCollisionsInterval = setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 100);
    }

    /** Handles logic to throw bottles with cooldown. */
    checkThrowObjects() {
        const now = Date.now();
        const cooldown = 1000;
        if (this.keyboard.D && this.character.bottles > 0 && now - this.lastBottleThrowTime > cooldown) {
            const offsetX = this.character.otherDirection ? -50 : 100;
            const bottle = new ThrowableObject(this.character.x + offsetX, this.character.y + 100, this.character.otherDirection);
            this.throwableObjects.push(bottle);
            this.character.bottles--;
            this.statusBarBottles.setPercentage((this.character.bottles / 20) * 100);
            this.lastBottleThrowTime = now;
            this.character.lastActionTime = now;
        }
    }

    /** Main game draw loop using requestAnimationFrame. */
    draw() {
        this.requestAnimationFrameID = requestAnimationFrame(() => this.draw());
        if (this.paused || !this.active) return;
        if (this.frameSkipCounter++ % this.frameSkipRate !== 0) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);

        if (this.gameOver) return this.closeGameBecauseLose();
        if (this.gameWin) return this.closeGameBecauseWin();

        this.endboss.animate();
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
        this.addtoMapElements();
        this.ctx.translate(-this.camera_x, 0);

        if (this.showIntro) this.drawExplanationOverlay();
    }

    /** Draws all overlay and character elements. */
    addtoMapElements() {
        this.addObjectsToMap(this.level.clouds);
        this.addtoMap(this.statusBarHealth);
        this.addtoMap(this.statusBarBottles);
        this.addtoMap(this.statusBarCoins);
        this.addtoMap(this.endboss.statusBar);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.enemies);
        this.addtoMap(this.character);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.bottles);
    }

    /** Handles end of game logic when player wins. */
    closeGameBecauseWin() {
        const windowBack = document.getElementById('window_back');
        const backgroundSound = document.getElementById('startSound');
        this.ctx.translate(-this.camera_x, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.character.winImage, 0, 0, this.canvas.width, this.canvas.height);
        this.winSound.play();
        this.ctx.restore();
        this.stopGameLoop();
        setTimeout(() => windowBack.style.display = 'flex', 1000);
    }

    /** Handles end of game logic when player loses. */
    closeGameBecauseLose() {
        const windowBack = document.getElementById('window_back');
        const backgroundSound = document.getElementById('startSound');
        this.ctx.translate(-this.camera_x, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.hasPlayedLoseSound) {
            this.loseSound.play();
            backgroundSound.pause();
            this.hasPlayedLoseSound = true;
        }

        this.ctx.drawImage(this.character.loseImage, 0, 0, this.canvas.width, this.canvas.height);
        if (!this.windowBackShown) {
            setTimeout(() => {
                windowBack.style.display = 'flex';
            }, 1000);
            this.windowBackShown = true;
        }
    }

    /**
     * Adds multiple objects to the canvas.
     * @param {MovableObject[]} objects 
     */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addtoMap(o));
    }

    /**
     * Draws a single object on the canvas, flipping if necessary.
     * @param {MovableObject} mo 
     */
    addtoMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    /** Stops the draw loop and pauses all animations. */
    stopGameLoop() {
        if (this.checkCollisionsInterval) {
            clearInterval(this.checkCollisionsInterval);
            this.checkCollisionsInterval = null;
        }
        if (this.requestAnimationFrameID) {
            cancelAnimationFrame(this.requestAnimationFrameID);
            this.requestAnimationFrameID = null;
        }
        MovableObject.allMovables.forEach(obj => obj.isAnimatedPaused = true);
        this.active = false;
        this.paused = true;
    }

    /** Resumes the draw loop and all animations. */
    resumeGameLoop() {
        if (!this.checkCollisionsInterval) this.run();
        if (!this.requestAnimationFrameID) this.draw();
        MovableObject.allMovables.forEach(obj => obj.isAnimatedPaused = false);
        this.paused = false;
        this.active = true;
    }

    /**
     * Flips the canvas context horizontally.
     * @param {MovableObject} mo 
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x *= -1;
    }

    /**
     * Restores the flipped canvas context.
     * @param {MovableObject} mo 
     */
    flipImageBack(mo) {
        mo.x *= -1;
        this.ctx.restore();
    }
}
