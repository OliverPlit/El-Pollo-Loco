class Coins extends DrawableObject {

    y = 300;
    x = 250;
    width = 100;
    height = 100;
   animationTime = 0;


    IMAGES_COINS = [
        'assets/img/8_coin/coin_1.png'
    ]

    constructor() {
        super();
        this.loadImage(this.IMAGES_COINS);


    }

/**draw(ctx) {
  let alpha = 0.5 + 0.5 *Math.sin(this.animationTime);
  let scale = 0.5 + 0.5 *Math.sin(this.animationTime);

  this.animationTime +=0.1;
  ctx.save();

  ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
  ctx.scale(scale,scale);
  ctx.globalAlpha = alpha;
};*/

}


