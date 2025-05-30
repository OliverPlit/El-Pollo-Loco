class Coins extends DrawableObject {

    y = 300;
    x = 250;
    width = 100;
    height = 100;

    IMAGES_COINS = [
        'assets/img/8_coin/coin_1.png'
    ]
    IMAGE_BOTTLE = [
        'assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png'
    ]

    constructor() {
        super();
        this.loadImage(this.IMAGES_COINS);


    }






}