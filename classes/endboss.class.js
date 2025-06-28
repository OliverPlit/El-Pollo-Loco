class Endboss extends MovableObject {
    x = 3200;
    height = 400;
    width = 250;
    y = 60;
    energy = 50;
    isDead = false;
    alertSound = new Audio('./audio/482009__ricratio__rooster-2018-12-25.wav')

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

    IMAGES_WALKING = [
        './assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        './assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        './assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        './assets/img/4_enemie_boss_chicken/1_walk/G4.png',

    ];

    IMAGE_DEAD = [
        'assets/img/4_enemie_boss_chicken/5_dead/G24.png'
    ]

    alertShown = false;
    state = 'normal';

    constructor(world) {
        super().loadImage('./assets/img/4_enemie_boss_chicken/2_alert/G5.png');
        this.statusBar = new StatusBar('endboss');
        this.speed = 3;
        this.world = world;

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.animate();
        this.updateStatusBarPosition()
        this.animateCurrentState();
        window.soundManager.addSound(this.alertSound);
        this.offset = {
            top: 0,
            bottom: 30,
            left: 45,
            right: 0
        };
    }


    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60)
        setInterval(() => {
            if ((this.energy > 0)) {
                this.playAnimation(this.IMAGES_WALKING);
                console.log(this.energy);

            }


        }, 100);
    }

    hitByBottle() {
        if (this.energy > 0 && !this.isDead) {
            this.energy -= 1;

            if (this.energy < 0) {
                this.energy = 0;
            }

            this.statusBar.setPercentage(this.energy * 2); // 50 HP → 100%
        }
    }


    draw(ctx) {
        super.draw(ctx);
        this.statusBar.draw(ctx);
    }
    updateStatusBarPosition() {
        this.statusBar.x = this.x + this.width / 2 - this.statusBar.width / 2;
        this.statusBar.y = this.y - 30;
    }

    playAnimation(images) {
        clearInterval(this.animationInterval); // Vorherige Animation stoppen
        let i = 0;
        this.animationInterval = setInterval(() => {
            this.img = this.imageCache[images[i]];
            i = (i + 1) % images.length;
        }, 100);
    }


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


    animate() {
        setInterval(() => {
            if (this.energy <= 0) return;

            if (!this.alertShown && this.world?.character?.x >= 2800) {
                this.alertShown = true;
                this.state = 'alert';
                this.animationFrame = 0;
                this.stateStartTime = Date.now();
            }

            if (this.state === 'alert' && Date.now() - this.stateStartTime > 2000) {
                this.state = 'attack';
                this.animationFrame = 0;
                this.stateStartTime = Date.now();
            }

            if (this.state === 'attack' && Date.now() - this.stateStartTime > 2000) {
                this.state = 'walking';
                this.animationFrame = 0;
                this.stateStartTime = Date.now();
                if (this.alertSound.paused) {
            this.alertSound.play();
        }
            }

            let images;
            if (this.state === 'alert') images = this.IMAGES_ALERT;
            else if (this.state === 'attack') images = this.IMAGES_ATTACK;
            else images = this.IMAGES_WALKING;

            this.img = this.imageCache[images[this.animationFrame]];
            this.animationFrame = (this.animationFrame + 1) % images.length;

            if (this.state === 'walking') {
                this.moveLeft();
            }

            this.updateStatusBarPosition();

        }, 100);
        setInterval(() => {
            if (this.energy == 0 && !this.isDead) {
                this.loadImage(this.IMAGES_DEAD);
                this.isDead = true;
                this.world.gameWin = true;

                setTimeout(() => {
                    let index = this.world.level.enemies.indexOf(this);
                    if (index > -1) {
                        this.world.level.enemies.splice(index, 1);
                    }
                }, 1000);
            }
        }, 50);
    }

    showWin() {

    }
}