/**
 * Regular enemy chicken that moves left and can die when hit.
 */
class Chicken extends MovableObject {
    height = 60;
    width = 80;
    y = 370;
    energy = 1;
    isDead = false;
    deadChicken = new Audio('audio/170807__esperar__angry-chicken-imitation.wav');

    IMAGES_WALKING = [
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        './assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    /**
     * Initializes a chicken enemy, loads images, assigns position and starts animation.
     */
    constructor() {
        super().loadImage('./assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = 300 + Math.random() * 2500;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
        window.soundManager.addSound(this.deadChicken);
    }

    /**
     * Starts all animation intervals for movement, walking, and death detection.
     */
    animate() {
        this.startMoving();
        this.startWalkingAnimation();
        this.startDeathCheck();
    }

    /**
     * Continuously moves the chicken to the left.
     */
    startMoving() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }

    /**
     * Plays walking animation if chicken is alive.
     */
    startWalkingAnimation() {
        setInterval(() => {
            if (this.energy > 0) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 100);
    }

    /**
     * Checks if the chicken is dead and triggers death sequence.
     */
    startDeathCheck() {
        setInterval(() => {
            if (this.energy == 0 && !this.isDead) {
                this.loadImage(this.IMAGES_DEAD[0]);
                this.deadChicken.play();
                this.isDead = true;
                this.removeAfterDelay();
            }
        }, 100);
    }

    /**
     * Removes the chicken from the enemy array after a short delay.
     */
    removeAfterDelay() {
        setTimeout(() => {
            let index = this.world.level.enemies.indexOf(this);
            if (index > -1) {
                this.world.level.enemies.splice(index, 1);
            }
        }, 1000);
    }
}