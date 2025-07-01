/**
 * Base class for drawable objects with position, size and image management.
 */
class DrawableObject {
    x = 20;
    y = 280;
    width = 100;
    height = 100;
    img;
    imageCache = {};
    currentImage = 0;

    constructor() {}

    /**
     * Draws the current image on the given canvas context.
     * Also draws a rectangular path for collision or debugging.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        if (this.img && this.img.complete) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        ctx.beginPath();
        ctx.rect(
            this.x + (this.offset?.left || 0),
            this.y + (this.offset?.top || 0),
            this.width - (this.offset?.left || 0) - (this.offset?.right || 0),
            this.height - (this.offset?.top || 0) - (this.offset?.bottom || 0)
        );
    }

    /**
     * Loads an image from a given path and sets it as the current image.
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Preloads multiple images from given array of paths into the cache.
     * @param {string[]} arr - Array of image paths.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}