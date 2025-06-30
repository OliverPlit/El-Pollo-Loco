class YellowChicken extends MovableObject {
    height = 70;
    width = 80;
    y = 370;
    speedY = 20;
    energy = 1;
    isDead = false;
    isDeadSound = new Audio('audio/11568__samplecat__squeak-duck4.wav');

    IMAGES_WALKING = [
        './assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        './assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ]

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


    muteSounds() {
        window.soundManager.addSound(this.isDeadSound);

    }


    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }
        return this.y < 370;
    }


    animate() {
    this.startMoving();
    this.startWalkingAnimation();
    this.startDeathCheck();
}


startMoving() {
    setInterval(() => this.moveLeft(), 1000 / 60);
}


startWalkingAnimation() {
    setInterval(() => {
        if (this.energy > 0) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }, 100);
}


startDeathCheck() {
    setInterval(() => this.checkDeath(), 100);
}


checkDeath() {
    if (this.energy == 0 && !this.isDead) {
        this.loadImage(this.IMAGES_DEAD[0]);
        this.isDeadSound.play();
        this.isDead = true;
        this.removeFromWorldAfterDelay();
    }
}


removeFromWorldAfterDelay() {
    setTimeout(() => {
        let index = this.world.level.enemies.indexOf(this);
        if (index > -1) {
            this.world.level.enemies.splice(index, 1);
        }
    }, 1000);
}


    jumpLoop() {
        setInterval(() => {
            if (!this.isAboveGround()) {
                this.jump();
            }
        }, 2000);
    }
}