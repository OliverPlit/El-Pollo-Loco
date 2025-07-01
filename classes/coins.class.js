/**
 * Collectible coin object that animates spinning coins.
 */
class Coins extends MovableObject {
    y = 200;
    x = 250;
    width = 100;
    height = 100;

    IMAGES_COINS = [
        './assets/img/8_coin/coin_1.png',
        './assets/img/8_coin/coin_2.png'
    ];

    /**
     * Initializes the coin, loads images and starts the animation.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_COINS);
        this.animate();
        this.offset = {
            top: 30,
            bottom: 30,
            left: 30,
            right: 30
        };
    }

    /**
     * Starts an interval to animate coin frames.
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COINS);
        }, 300);
    }
}



