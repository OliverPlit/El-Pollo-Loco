class ThrowableObject extends MovableObject {

    constructor(x, y) {
        super(); // super() ruft den Konstruktor von MovableObject auf
        this.loadImage('assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.throw();
    }

    throw() {
        this.speedY = 30;
        this.aplyGravity();
        setInterval(() => {
            this.x += 10;
        }, 50);
    }

}
