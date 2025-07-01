/**
 * YellowChicken is an enemy that moves left, jumps periodically, and can be killed.
 * Extends MovableObject and manages animations, gravity, and death behavior.
 */
class YellowChicken extends MovableObject {
    /** @type {number} Height of the chicken */
    height = 70;

    /** @type {number} Width of the chicken */
    width = 80;

    /** @type {number} Vertical position */
    y = 370;

    /** @type {number} Initial vertical speed for jump */
    speedY = 20;

    /** @type {number} Current energy (health) */
    energy = 1;

    /** @type {boolean} Flag if chicken is dead */
    isDead = false;

    /** @type {Audio} Sound to play when chicken dies */
    isDeadSound = new Audio('audio/11568__samplecat__squeak-duck4.wav');

    /** @type {string[]} Walking animation image paths */
    IMAGES_WALKING = [
        './assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    /** @type {string[]} Image shown when dead */
    IMAGES_DEAD = [
        './assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /**
     * Creates a new YellowChicken with random horizontal position and speed.
     * Loads images, starts animations, gravity, and jump loop.
     */
    constructor() {
        super().loadImage('./assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = 400 + Math.random() * 2500;
        this.speed = 1.55 + Math.random() * 0.25;
        this.animate();
        this.jump();
        this.applyGravity();
        this.jumpLoop();
        this.muteSounds();
    }

    /**
     * Registers the death sound with the global sound manager.
     */
    muteSounds() {
        window.soundManager.addSound(this.isDeadSound);
    }

    /**
     * Checks if the chicken is above ground (can jump).
     * @returns {boolean} True if chicken is in the air.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }
        return this.y < 370;
    }

    /**
     * Starts all animations and behaviors: moving, walking animation, death check.
     */
    animate() {
        this.startMoving();
        this.startWalkingAnimation();
        this.startDeathCheck();
    }

    /**
     * Moves the chicken continuously to the left.
     */
    startMoving() {
        setInterval(() => this.moveLeft(), 1000 / 60);
    }

    /**
     * Plays walking animation while chicken is alive.
     */
    startWalkingAnimation() {
        setInterval(() => {
            if (this.energy > 0) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 100);
    }

    /**
     * Regularly checks if chicken is dead and triggers death behavior.
     */
    startDeathCheck() {
        setInterval(() => this.checkDeath(), 100);
    }

    /**
     * Handles death: changes image, plays sound, flags dead, schedules removal.
     */
    checkDeath() {
        if (this.energy == 0 && !this.isDead) {
            this.loadImage(this.IMAGES_DEAD[0]);
            this.isDeadSound.play();
            this.isDead = true;
            this.removeFromWorldAfterDelay();
        }
    }

    /**
     * Removes the chicken from the world's enemy array after a delay.
     */
    removeFromWorldAfterDelay() {
        setTimeout(() => {
            let index = this.world.level.enemies.indexOf(this);
            if (index > -1) {
                this.world.level.enemies.splice(index, 1);
            }
        }, 1000);
    }

    /**
     * Periodically makes the chicken jump if it is on the ground.
     */
    jumpLoop() {
        setInterval(() => {
            if (!this.isAboveGround()) {
                this.jump();
            }
        }, 2000);
    }
}
