class Chicken extends MovableObject {
    height = 70;
    width = 80;
    y = 370;
    energy = 1;
    isDead = false;
   

    IMAGES_WALKING = [
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'

    ]


    IMAGES_DEAD = [
        './assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ]


    constructor() {
        super().loadImage('./assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING)
        this.x = 200 + Math.random() * 2500;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }


    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60)
        setInterval(() => {
            if ((this.energy > 0)) {
                this.playAnimation(this.IMAGES_WALKING);
            }
            

        }, 100);
       setInterval(() => {
    if (this.energy == 0 && !this.isDead) {
        this.loadImage(this.IMAGES_DEAD[0]);
        this.isDead = true;

        setTimeout(() => {
            let index = this.world.level.enemies.indexOf(this);
            if (index > -1) {
                this.world.level.enemies.splice(index, 1);
            }
        }, 1000);
    }
}, 100);
        console.log(this.energy);
        
    }



}
