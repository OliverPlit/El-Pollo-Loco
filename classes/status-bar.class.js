/**
 * StatusBar displays progress or state (e.g., health, coins) as a graphical bar.
 * Extends DrawableObject and loads different image sets depending on the type.
 */
class StatusBar extends DrawableObject {
    /** @type {number} Current percentage value of the status bar */
    percentage = 100;

    /** @type {string[]} Images used for the endboss status bar */
    IMAGES_STATUSBAR_ENDBOSS = [
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
    ];

    /**
     * Creates a StatusBar for a given type (e.g., 'health', 'coins', 'endboss').
     * Loads the appropriate images and initializes starting values.
     * @param {string} type - The type of the status bar.
     */
    constructor(type) {
        super();
        this.type = type;
        this.y = this.getXByType(type);
        this.x = this.getYByType(type);
        this.width = 250;
        this.height = 60;
        this.IMAGES = this.getImagesByType(type);
        this.loadImages(this.IMAGES);
        this.initializePercentageByType(type);
    }

    /**
     * Initializes the starting percentage value depending on the type.
     * @param {string} type 
     */
   initializePercentageByType(type) {
    if (type === 'coins' || type === 'sauce') {
        this.setPercentage(0); // Bei Coins und Flaschen (Sauce) bei 0 starten
    } else {
        this.setPercentage(100); // Health und andere bei 100
    }
}

    /**
     * Returns the Y position based on the status bar type.
     * @param {string} type
     * @returns {number}
     */
    getXByType(type) {
        if (type == 'health') return 0;
        if (type == 'sauce') return 50;
        if (type == 'coins') return 100;
    }

    /**
     * Returns the X position based on the status bar type.
     * @param {string} type
     * @returns {number}
     */
    getYByType(type) {
        if (type == 'health') return 0;
        if (type == 'sauce') return 0;
        if (type == 'coins') return 0;
    }

    /**
     * Returns the array of image paths corresponding to the given type.
     * @param {string} type
     * @returns {string[]}
     */
    getImagesByType(type) {
        if (type == 'health') {
            return [
                'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
                'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
                'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
                'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
                'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
                'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
            ];
        }
        if (type == 'sauce') {
            return [
                'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
                'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
                'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
                'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
                'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
                'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
            ];
        }
        if (type == 'coins') {
            return [
                'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',
                'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
                'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
                'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
                'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
                'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
            ];
        }
        if (type == 'endboss') {
            return [
                'assets/img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
                'assets/img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
                'assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
                'assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
                'assets/img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
                'assets/img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
            ];
        }
    }

    /**
     * Sets the current percentage value and updates the displayed image accordingly.
     * @param {number} percentage - Value from 0 to 100.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines the index of the image that matches the current percentage.
     * @returns {number} Index in the images array.
     */
    resolveImageIndex() {
    if (this.percentage == 100) return 5;
    if (this.percentage > 80) return 4;
    if (this.percentage > 60) return 3;
    if (this.percentage > 40) return 2;
    if (this.percentage > 20) return 1;
    return 0;
}
}
