class Character extends MovableObject {
    height = 280;
    y = 155;
    x = 20;
    speed = 10;
    coins = 0;
    bottles = 20;
    walkSound = new Audio('./audio/263006__dermotte__giant_step_1.wav');
    jumpSound = new Audio('./audio/172660__qubodup__boing-jump-cc-by-cfork-boing_rawaif-7967.flac');
    sleepSound = new Audio('./audio/491961__cmilo1269__snoring.wav')
    lastActionTime = Date.now();

    IMAGES_IDLE = [
        './assets/img/2_character_pepe/1_idle/idle/I-1.png',
        './assets/img/2_character_pepe/1_idle/idle/I-2.png',
        './assets/img/2_character_pepe/1_idle/idle/I-3.png',
        './assets/img/2_character_pepe/1_idle/idle/I-4.png',
        './assets/img/2_character_pepe/1_idle/idle/I-5.png',
        './assets/img/2_character_pepe/1_idle/idle/I-6.png',
        './assets/img/2_character_pepe/1_idle/idle/I-7.png',
        './assets/img/2_character_pepe/1_idle/idle/I-8.png',
        './assets/img/2_character_pepe/1_idle/idle/I-9.png',
        './assets/img/2_character_pepe/1_idle/idle/I-10.png'


    ];



    IMAGES_WALKING = [
        './assets/img/2_character_pepe/2_walk/W-21.png',
        './assets/img/2_character_pepe/2_walk/W-22.png',
        './assets/img/2_character_pepe/2_walk/W-23.png',
        './assets/img/2_character_pepe/2_walk/W-24.png',
        './assets/img/2_character_pepe/2_walk/W-25.png',
        './assets/img/2_character_pepe/2_walk/W-26.png'

    ];


    IMAGES_JUMPING = [
        './assets/img/2_character_pepe/3_jump/J-31.png',
        './assets/img/2_character_pepe/3_jump/J-32.png',
        './assets/img/2_character_pepe/3_jump/J-33.png',
        './assets/img/2_character_pepe/3_jump/J-34.png',
        './assets/img/2_character_pepe/3_jump/J-35.png',
        './assets/img/2_character_pepe/3_jump/J-36.png',
        './assets/img/2_character_pepe/3_jump/J-37.png',
        './assets/img/2_character_pepe/3_jump/J-39.png',

    ];


    IMAGES_DEAD = [
        'assets/img/2_character_pepe/5_dead/D-51.png',
        'assets/img/2_character_pepe/5_dead/D-52.png',
        'assets/img/2_character_pepe/5_dead/D-53.png',
        'assets/img/2_character_pepe/5_dead/D-54.png',
        'assets/img/2_character_pepe/5_dead/D-55.png',
        'assets/img/2_character_pepe/5_dead/D-56.png',
        'assets/img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'assets/img/2_character_pepe/4_hurt/H-41.png',
        'assets/img/2_character_pepe/4_hurt/H-42.png',
        'assets/img/2_character_pepe/4_hurt/H-43.png',

    ]


    IMAGES_SLEEP = [
        './assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-20.png',


    ];
    world;

    constructor() {
        super().loadImage('./assets/img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_SLEEP);

        this.applyGravity();
        this.loseImage = new Image();
        this.loseImage.src = './assets/img/9_intro_outro_screens/game_over/game over!.png';
        this.winImage = new Image();
        this.winImage.src = './assets/img/You won, you lost/You Win A.png';
        this.muteSounds()

        this.offset = {
            top: 101,
            bottom: 10,
            left: 10,
            right: 15
        };


    }

    muteSounds() {
        window.soundManager.addSound(this.jumpSound);
        window.soundManager.addSound(this.walkSound);
        window.soundManager.addSound(this.sleepSound);


    }
    stopSounds() {
        this.sleepSound.pause();
    }


    animate() {


        setInterval(() => {
            const now = Date.now();

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
                this.jumpSound.play();
                this.lastActionTime = now;
            }

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.walkSound.play();
                this.otherDirection = false;
                this.lastActionTime = now;
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
                this.lastActionTime = now;
            }

            this.world.camera_x = -this.x + 200;
        }, 1000 / 60);

        setInterval(() => {
            const now = Date.now();
            const timeSinceLastAction = (now - this.lastActionTime) / 1000;

            const isMoving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
            const isJumping = this.isAboveGround();

            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                this.world.gameOver = true;
            }
            else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                this.hurtSound.play();
            }
            else if (isJumping) {
                this.playAnimation(this.IMAGES_JUMPING);
            }
            else if (isMoving) {
                this.playAnimation(this.IMAGES_WALKING);
            }
            else if (!this.isHurt() && !isMoving && !isJumping && timeSinceLastAction >= 15) {
                this.playAnimation(this.IMAGES_SLEEP);
                if (this.sleepSound.paused) this.sleepSound.play();
            }
            else if (!this.isHurt() && !isMoving && !isJumping) {
                this.playAnimation(this.IMAGES_IDLE);
            }
        }, 50);





    }
}