/**
 * Represents a game level containing enemies, clouds, and background objects.
 */
class Level {
    /** @type {Array} Array of enemy objects in the level */
    enemies;
    /** @type {Array} Array of cloud objects in the level */
    clouds;
    /** @type {Array} Array of background objects in the level */
    backgroundObjects;
    /** @type {number} The x-coordinate marking the end of the level */
    level_end_x = 3000;

    /**
     * Creates a new Level instance.
     * @param {Array} enemies - List of enemies in the level.
     * @param {Array} clouds - List of clouds in the level.
     * @param {Array} backgroundObjects - List of background objects.
     */
    constructor(enemies, clouds, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}
