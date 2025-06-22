class Bottle extends MovableObject {

    y = 300;
    x = 150;
    width = 100;
    height = 70;

    IMAGE_BOTTLE = [
        'assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png'
    ];
    

    constructor() {
        super();
        this.loadImage(this.IMAGE_BOTTLE);

        this.offset = {
            top: 10,
            bottom: 10,
            left: 40,
            right: 20
        };

    }






}