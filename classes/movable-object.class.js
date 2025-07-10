/**
 * Represents a drawable object that can move and interact in the game world.
 * Extends DrawableObject with movement, collision, gravity, and health functionality.
 */
class MovableObject extends DrawableObject {
    /** @type {number} Horizontal movement speed */
    speed = 0.15;

    /** @type {boolean} Indicates if the object is facing the opposite direction */
    otherDirection = false;

    /** @type {number} Vertical speed for jumps and falls */
    speedY = 0;

    /** @type {number} Gravity acceleration applied to vertical speed */
    acceleration = 2.5;

    /** @type {number} Current energy (health) of the object */
    energy = 100;
    static allMovables = []; // Liste aller Instanzen

    /** @type {number} Timestamp of the last time the object was hit */
    lastHit = 0;
    isAnimatedPaused = false;

    /** @type {Audio} Sound played when the object is hurt */
    hurtSound = new Audio('./audio/515624__mrickey13__playerhurt2.wav');

    /**
     * Creates a new MovableObject and registers hurt sound.
     */
    constructor() {
        super();
        window.soundManager.addSound(this.hurtSound);
                MovableObject.allMovables.push(this); // automatisch registrieren

    }

    drawHitbox(ctx) {
    const hb = this.getHitBox();
    ctx.save();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.strokeRect(
        hb.left,
        hb.top,
        hb.right - hb.left,
        hb.bottom - hb.top
    );
    ctx.restore();
}
    /**
     * Applies gravity to the object, making it fall if above ground.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Makes the object jump by setting an upward vertical speed.
     */
    jump() {
        if (!this.isAnimatedPaused) {
        this.speedY = 25;

        }
    }

    /**
     * Checks if the object is above the ground.
     * @returns {boolean} True if above ground, false otherwise.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }
        return this.y < 180;
    }

    /**
     * Returns the hitbox boundaries of the object, considering offsets.
     * @returns {{left: number, right: number, top: number, bottom: number}} Hitbox rectangle.
     */
    getHitBox() {
        return {
            left: this.x + (this.offset?.left || 0),
            right: this.x + this.width - (this.offset?.right || 0),
            top: this.y + (this.offset?.top || 0),
            bottom: this.y + this.height - (this.offset?.bottom || 0)
        };
        
    }

    /**
     * Checks collision with another MovableObject based on hitboxes.
     * @param {MovableObject} mo - Another movable object to check collision against.
     * @returns {boolean} True if colliding, false otherwise.
     */
    isColliding(mo) {
        const a = this.getHitBox();
        const b = mo.getHitBox();
        return (
            a.right > b.left &&
            a.left < b.right &&
            a.bottom > b.top &&
            a.top < b.bottom
        );
    }

    /**
     * Applies damage to the object, reducing energy and updating last hit time.
     */
  hit() {
    this.energy -= 10;
    if (this.energy < 0) this.energy = 0;
    this.lastHit = new Date().getTime();
}

    /**
     * Checks if the object is currently in a hurt state (within 2 seconds after hit).
     * @returns {boolean} True if hurt, false otherwise.
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 2;
    }

    /**
     * Checks if the object is dead (energy equals zero).
     * @returns {boolean} True if dead, false otherwise.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Moves the object to the right by its speed.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left by its speed.
     */
    moveLeft() {
        if (!this.isAnimatedPaused) {
                    this.x -= this.speed;

        }
    }

    /**
     * Animates the object by cycling through a given array of image paths.
     * @param {string[]} images - Array of image source paths to animate through.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }


    /**
 * Plays the given image sequence exactly once.
 * @param {string[]} images - Array of image paths
 * @param {Function} callback - Called when animation is finished
 */
playAnimationOnce(images, callback) {
    if (this.animationInProgress) return;

    this.animationInProgress = true;
    let i = 0;
    this.animationInterval = setInterval(() => {
        if (i >= images.length) {
            clearInterval(this.animationInterval);
            this.animationInProgress = false;
            if (callback) callback();
        } else {
            this.img = this.imageCache[images[i]];
            i++;
        }
    }, 100); // 100ms pro Frame, anpassen nach Geschmack
}

}
