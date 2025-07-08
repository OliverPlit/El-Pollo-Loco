/**
 * Represents the main boss enemy with multiple states and animations.
 * Extends MovableObject for position, movement, and rendering.
 */
class Endboss extends MovableObject {
    /** @type {number} Horizontal position */
    x = 3200;
    /** @type {number} Height of the boss */
    height = 400;
    /** @type {number} Width of the boss */
    width = 250;
    /** @type {number} Vertical position */
    y = 60;
    /** @type {number} Remaining energy/health */
    energy = 120;
    /** @type {boolean} Whether the boss is dead */
    isDead = false;
    /** @type {Audio} Sound played when alert triggered */
    alertSound = new Audio('./audio/482009__ricratio__rooster-2018-12-25.wav');
    /** @type {boolean} Whether alert has been shown */
    alertShown = false;
    /** @type {string} Current state ('normal', 'alert', 'attack', 'walking') */
    state = 'normal';

    /** @type {string[]} Images for alert animation */
    IMAGES_ALERT = [
        './assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    /** @type {string[]} Images for attack animation */
    IMAGES_ATTACK = [
        './assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    /** @type {string[]} Images for walking animation */
    IMAGES_WALKING = [
        './assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        './assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        './assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        './assets/img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    /** @type {string[]} Image for dead state */
    IMAGE_DEAD = [
        'assets/img/4_enemie_boss_chicken/5_dead/G24.png'
    ];

    /**
     * Constructs the Endboss, loads images, sets initial position, speed, and starts animation.
     * @param {object} world - Reference to the game world.
     */
    constructor(world) {
        super().loadImage('./assets/img/4_enemie_boss_chicken/2_alert/G5.png');
        this.statusBar = new StatusBar('endboss');
        this.speed = 7;
        this.world = world;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.animate();
        this.updateStatusBarPosition();
        this.animateCurrentState();
        window.soundManager.addSound(this.alertSound);
        this.offset = {
            top: 0,
            bottom: 30,
            left: 45,
            right: 0
        };
    }

    /**
     * Starts movement and walking animation intervals.
     * Note: There are two animate() declarations, this one may be overridden by the second.
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
        setInterval(() => {
            if (this.energy > 0) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 100);
    }

    /**
     * Handles damage when hit by a bottle, decreases energy and updates the status bar.
     */
    hitByBottle() {
        if (this.energy > 0 && !this.isDead) {
            this.energy -= 1;
            if (this.energy < 0) {
                this.energy = 0;
            }
            this.statusBar.setPercentage(this.energy * 2);
        }
    }

    /**
     * Draws the boss and its health status bar on the given canvas context.
     * @param {CanvasRenderingContext2D} ctx - Canvas context to draw on.
     */
    draw(ctx) {
        super.draw(ctx);
        this.statusBar.draw(ctx);
    }

    /**
     * Updates the position of the status bar relative to the boss position.
     */
    updateStatusBarPosition() {
        this.statusBar.x = this.x + this.width / 2 - this.statusBar.width / 2;
        this.statusBar.y = this.y - 30;
    }

    /**
     * Plays an animation cycling through the provided images at a fixed interval.
     * @param {string[]} images - Array of image paths for the animation.
     */
    playAnimation(images) {
        clearInterval(this.animationInterval);
        let i = 0;
        this.animationInterval = setInterval(() => {
            this.img = this.imageCache[images[i]];
            i = (i + 1) % images.length;
        }, 100);
    }

    /**
     * Executes animation logic based on the current state.
     */
    animateCurrentState() {
        if (this.state === 'alert') {
            this.playAnimation(this.IMAGES_ALERT);

        } else if (this.state === 'attack') {
            this.playAnimation(this.IMAGES_ATTACK);
            this.playAnimation(this.IMAGES_WALKING);
            this.moveLeft();
        } else if (this.state === 'walking') {
            this.moveLeft();
        }
    }

    /**
     * Starts the behavior cycle and death monitor intervals.
     * Note: This method overrides the earlier animate().
     */
    animate() {
        this.startBehaviorCycle();
        this.startDeathMonitor();
    }

    /**
     * Periodically updates the boss state.
     */
    startBehaviorCycle() {
        setInterval(() => this.updateState(), 100);
    }

    /**
     * Updates the boss state and animation frame based on timing and conditions.
     */
    updateState() {
        if (this.energy <= 0) return;
        this.handleAlertPhase();
        this.handleAttackPhase();
        this.handleWalkingPhase();
        this.updateAnimationFrame();
        this.updateStatusBarPosition();
    }

    /**
     * Checks and initiates alert phase if player is near.
     */
    handleAlertPhase() {
        if (!this.alertShown && this.world?.character?.x >= 2800) {
            this.alertShown = true;
            this.state = 'alert';
            this.animationFrame = 0;
            this.stateStartTime = Date.now();
        }
    }

    /**
     * Advances from alert to attack phase after delay.
     */
    handleAttackPhase() {
        if (this.state === 'alert' && Date.now() - this.stateStartTime > 2000) {
            this.state = 'attack';
            this.animationFrame = 0;
            this.stateStartTime = Date.now();
        }
    }

    /**
     * Advances from attack to walking phase after delay, plays alert sound, moves left.
     */
    handleWalkingPhase() {
        if (this.state === 'attack' && Date.now() - this.stateStartTime > 2000) {
            this.state = 'walking';
            this.animationFrame = 0;
            this.stateStartTime = Date.now();
            if (this.alertSound.paused) this.alertSound.play();
        }
        if (this.state === 'walking') {
            this.moveLeft();
        }
    }

    /**
     * Updates the current animation frame for the active state.
     */
    updateAnimationFrame() {
        let images = this.state === 'alert' ? this.IMAGES_ALERT : this.state === 'attack' ? this.IMAGES_ATTACK : this.IMAGES_WALKING;
        this.img = this.imageCache[images[this.animationFrame]];
        this.animationFrame = (this.animationFrame + 1) % images.length;
    }

    /**
     * Monitors the boss's energy and triggers death logic.
     */
    startDeathMonitor() {
        setInterval(() => {
            if (this.energy == 0 && !this.isDead) {
                this.loadImage(this.IMAGES_DEAD);
                this.isDead = true;
                this.world.gameWin = true;
            }
        }, 50);
    }
}
