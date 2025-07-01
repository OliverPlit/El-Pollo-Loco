/**
 * Button object (UI element).
 * Displays a static image button on screen.
 */
class Buttons extends DrawableObject {
    /**
     * Creates a button and loads its image.
     */
    constructor() {
        super().loadImage('./assets/img/2_character_pepe/2_walk/W-21.png');
        this.loadImage(this.IMAGES);
    }
}
