class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    aplyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    jump() {
        this.speedY = 30;

    }


    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }
        return this.y < 180;
    }




    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x + this.x &&
            this.y < mo.y + mo.height
    }

    hit() {
        this.energy -= 5;


        if (this.energy > 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
        //console.log(this.energy); 
    }

    isHurt() {
      let timePassed = new Date().getTime() - this.lastHit;
       timePassed = timePassed /1000;
       //console.log(timePassed);
       
        return timePassed < 0.5; 
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


