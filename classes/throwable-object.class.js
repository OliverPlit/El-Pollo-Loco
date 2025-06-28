class ThrowableObject extends MovableObject {

    explosion = new Audio('./audio/323317__alfrodou__explosion-2.wav');
    IMAGE_BOTTLE_CRASH = [
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',

    ];

    IMAGE_BOTTLE_ROTATE = [
        './assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ]


    constructor(x, y) {
        super();
        this.loadImage('./assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.loadImages(this.IMAGE_BOTTLE_ROTATE);
        this.loadImages(this.IMAGE_BOTTLE_CRASH)

        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.isFlying = true;

        if (isAudioMuted) {
            this.explosion.muted = true;
        }
        this.throw();
    }

    throw() {
        this.speedY = 20;
        this.applyGravity();
        this.explosion.play();

        let flightInterval = setInterval(() => {
            this.x += 15;
            this.playAnimation(this.IMAGE_BOTTLE_ROTATE);

            if (this.y > 350) {
                this.crash();
                clearInterval(flightInterval);
            }
        }, 100);
    }

    crash() {
        this.isFlying = false;
        this.speedX = 0;
        this.speedY = 0;
        this.playAnimation(this.IMAGE_BOTTLE_CRASH);
    }
}



