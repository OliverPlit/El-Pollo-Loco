/**
 * Cloud background object that moves left continuously.
 */
class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;

    /**
     * Initializes a cloud at a random x-position and starts its animation.
     */
    constructor() {
        super().loadImage('./assets/img/5_background/layers/4_clouds/1.png');
        this.x = 0 + Math.random() * 500;
        this.animate();
    }

    /**
     * Moves the cloud to the left to simulate wind.
     */
    animate() {
        setInterval(() => {
            this.x -= 0.15
        },1000/ 60)
    }
}