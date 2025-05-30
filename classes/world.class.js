class World {
    character = new Character();
    canvas;
    level = level1;
    ctx;
    keyboard;
    camera_x = 0;
    statusBarHealth = new StatusBar('health');
    statusBarBottles = new StatusBar('sauce');
    statusBarCoins = new StatusBar('coins');
    throwableObjects = [];
    coins = [];
    bottles = [];
    paused = false;
    active = true;


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.generateCoins();
        this.generateBottles();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.character.animate();
    }

    generateCoins() {
        const minDistance = 80;

        while (this.coins.length < 30) {
            let coin = new Coins();
            coin.x = 100 + Math.random() * 2500;
            coin.y = 100 + Math.random() * 280;

            let tooClose = this.coins.some(c => {
                let dx = c.x - coin.x;
                let dy = c.y - coin.y;
                return Math.sqrt(dx * dx + dy * dy) < minDistance;
            });

            if (!tooClose) {
                this.coins.push(coin);
            }
        }


    }

    generateBottles() {
        const minDistance = 200;

        while (this.bottles.length < 5) {
            let bottle = new Bottle();
            bottle.x = 100 + Math.random() * 2500;
            bottle.y = 370;

            let tooClose = this.bottles.some(c => {
                let dx = c.x - bottle.x;
                let dy = c.y - bottle.y;
                return Math.sqrt(dx * dx + dy * dy) < minDistance;
            });

            if (!tooClose) {
                this.bottles.push(bottle);
            }
        }


    }

    run() {
        setInterval(() => {
            this.checkCollsions();
            this.checkThrowObjects();
        }, 100);
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.character.bottles > 0) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);

            this.character.bottles--;
            let percentage = (this.character.bottles / 20) * 100;
            this.statusBarBottles.setPercentage(percentage);
        }
    }

    draw() {
        if (this.paused || !this.active) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0)
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0)
        this.addtoMap(this.statusBarHealth);
        this.addtoMap(this.statusBarBottles);
        this.addtoMap(this.statusBarCoins); this.ctx.translate(this.camera_x, 0)
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addtoMap(this.character);

        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.bottles);


        this.ctx.translate(-this.camera_x, 0)

        

        if (this.showIntro) {
            this.drawExplanationOverlay();
        }

        if (this.active) {
            requestAnimationFrame(() => this.draw());
        }


    }

  
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addtoMap(o)
        });
    }

    addtoMap(mo) {

        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo)
        }
    }


    checkCollsions() {
        setInterval(() => {
            this.level.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy) && !this.character.wasHitRecently) {
                    this.character.hit();
                    this.statusBarHealth.setPercentage(this.character.energy);
                }
            }, 20);

        });

        this.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.coins.splice(index, 1);
                this.character.coins += 1;
                let percentage = this.character.coins * 5;
                if (percentage > 100) percentage = 100;
                this.statusBarCoins.setPercentage(percentage);
            }
        });
        this.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.bottles.splice(index, 1);
                this.character.bottles += 5;
                let percentage = this.character.bottles * 5;
                if (percentage > 100) percentage = 100;
                this.statusBarBottles.setPercentage(percentage);
            }
        });
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }


    flipImageBack(mo) {
        mo.x = mo.x * -1;

        this.ctx.restore();
    }



}



