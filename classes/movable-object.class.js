class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    hurtSound = new Audio('./audio/515624__mrickey13__playerhurt2.wav')

    constructor() {
        super();
        window.soundManager.addSound(this.hurtSound);

    }


    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }


    jump() {
        this.speedY = 20;
    }


    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }
        return this.y < 180;
    }


    getHitBox() {
        return {
            left: this.x + (this.offset?.left || 0),
            right: this.x + this.width - (this.offset?.right || 0),
            top: this.y + (this.offset?.top || 0),
            bottom: this.y + this.height - (this.offset?.bottom || 0)
        };
    }


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


    hit() {
        this.energy -= 10;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }


    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 2;
    }


    isDead() {
        return this.energy == 0;
    }


    moveRight() {
        this.x += this.speed;
    }


    moveLeft() {
        this.x -= this.speed;
    }

    
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}


