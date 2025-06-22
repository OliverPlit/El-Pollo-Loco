class DrawableObject {
    x = 20;
    y = 280;
    width = 100;
    height = 100;
    img;
    imageCache = {};
    currentImage = 0;

    constructor() {

    }

 draw(ctx) {
    if (this.img && this.img.complete) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "blue";
    ctx.rect(
        this.x + (this.offset?.left || 0),
        this.y + (this.offset?.top || 0),
        this.width - (this.offset?.left || 0) - (this.offset?.right || 0),
        this.height - (this.offset?.top || 0) - (this.offset?.bottom || 0)
    );
    ctx.stroke();
}





    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    
    }
}


