class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 60;
    energy = 50;
    isDead = false;

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

    alertShow = false;
    state = 'normal';

    constructor() {
        super().loadImage('./assets/img/4_enemie_boss_chicken/2_alert/G5.png');

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.x = 3200;
        this.animateCurrentState();
    }

    updateEnemies(characterX) {
        if (characterX >= 2800 && this.state === 'normal' && !this.alertShown) {
            this.startAlertSequence();
        }

        this.animateCurrentState();
    }

    startAlertSequence() {
        this.state = 'alert';
        this.alertShown = true;

        this.playAnimation(this.IMAGES_ALERT);
        setTimeout(() => {
            this.state = 'attack';
            this.playAnimation(this.IMAGES_ATTACK);

            setTimeout(() => {
                this.state = 'walking';
                this.playAnimation(this.IMAGES_WALKING);
            }, 2000);

        }, 2000);
    }

    animateCurrentState() {
        if (this.state === 'walking') {
            this.moveLeft();
        }
    }
}