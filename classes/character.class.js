class Character extends MovableObject {
    height = 280;
    y = 155;
    speed = 10;
    coins = 0;
    bottles = 20;
    walkSound = new Audio('./audio/537180__colorscrimsontears__walking-on-sand-and-gravel.wav');
    jumpSound = new Audio('./audio/172660__qubodup__boing-jump-cc-by-cfork-boing_rawaif-7967.flac');
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

    world;

    constructor() {
        super().loadImage('./assets/img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.aplyGravity();
        this.loseImage = new Image();
        this.loseImage.src = './assets/img/9_intro_outro_screens/game_over/game over!.png';
    }

    animate() {


        setInterval(() => {
            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
                this.jumpSound.play();
            }


            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.walkSound.play();
                this.otherDirection = false;
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;

            }
            this.world.camera_x = -this.x + 200;
        }, 1000 / 60);


        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                this.world.gameOver = true;
            }
            else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                this.hurtSound.play();

            }
            else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            }
            else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 50);
    }




}