class StatusBar extends DrawableObject {
    percentage = 100;
    IMAGES_STATUSBAR_ENDBOSS = [
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
    ]

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

    initializePercentageByType(type) {
        if (type === 'coins') {
            this.setPercentage(0);
        } else {
            this.setPercentage(100);
        }
    }




    getXByType(type) {
        if (type == 'health') return 0;
        if (type == 'sauce') return 50;
        if (type == 'coins') return 100;
    }

    getYByType(type) {
        if (type == 'health') return 0;
        if (type == 'sauce') return 0;
        if (type == 'coins') return 0;
    }




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



    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if (this.percentage == 100) return 5;
        if (this.percentage > 80) return 4;
        if (this.percentage > 60) return 3;
        if (this.percentage > 40) return 2;
        if (this.percentage > 20) return 1;
        return 0;
    }
}