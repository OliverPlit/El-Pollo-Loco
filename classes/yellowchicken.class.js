class YellowChicken extends MovableObject {
    height = 70;
    width = 80;
    y = 370;
    speedY = 30;
    IMAGES_WALKING = [
        './assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ]
    constructor() {
        super().loadImage('./assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = 400 + Math.random() * 2500;
        this.speed = 1.55 + Math.random() * 0.25;
        this.animate();
        this.jump();
        this.aplyGravity();
        this.jumpLoop();

    }


    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }
        return this.y < 370;
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60)
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);

        }, 100);
    }

    jumpLoop() {
        setInterval(() => {
            if (!this.isAboveGround()) {
                this.jump();
            }
        }, 2000);
        console.log(this.y);
    }
}