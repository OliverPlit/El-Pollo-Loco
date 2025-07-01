/**
 * Represents a background object in the game world.
 * Inherits properties and methods from MovableObject.
 */
class BackgroundObject extends MovableObject {
    /**
     * The width of the background object.
     * @type {number}
     */
    width = 720;

    /**
     * The height of the background object.
     * @type {number}
     */
    height = 480;

    /**
     * Creates a new BackgroundObject.
     * @param {string} imagePath - Path to the image used for the background.
     * @param {number} x - The x-coordinate for the background object.
     * @param {number} y - The y-coordinate (unused, background is aligned to bottom).
     */
    constructor(imagePath, x, y) {
        super().loadImage(imagePath);

        /**
         * The y-coordinate of the background object, aligned to the bottom.
         * @type {number}
         */
        this.y = 480 - this.height;

        /**
         * The x-coordinate of the background object.
         * @type {number}
         */
        this.x = x;
    }
}