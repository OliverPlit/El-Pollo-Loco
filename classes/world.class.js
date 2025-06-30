class World {
    character = new Character();
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBarHealth = new StatusBar('health');
    statusBarBottles = new StatusBar('sauce');
    statusBarCoins = new StatusBar('coins');
    endboss = new Endboss();
    throwableObjects = [];
    coins = [];
    bottles = [];
    paused = false;
    active = true;
    gameOver = false;
    gameWin = false;
    lastBottleThrowTime = 0;
    loseSound = new Audio('./audio/350987__cabled_mess__lose_c_05.wav');
    winSound = new Audio('./audio/270545__littlerobotsoundfactory__jingle_win_01.wav');
    coinSound = new Audio('./audio/402767__lilmati__retro-coin-03.wav');
    collectBottle = new Audio('./audio/711129__xiko__retro-collection-3.wav');

    constructor(canvas, keyboard, level) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level;
        this.draw();

        this.setWorld();
        this.generateCoins();
        this.generateBottles();
        this.assignWorldToEnemies()
        this.run();
        this.muteSounds();


    }


    muteSounds() {
        window.soundManager.addSound(this.coinSound);
        window.soundManager.addSound(this.collectBottle);
        window.soundManager.addSound(this.winSound);
        window.soundManager.addSound(this.loseSound);
    }


    assignWorldToEnemies() {
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
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
        this.checkCollisionsInterval = setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 100);
    }


    checkThrowObjects() {
        const now = new Date().getTime();
        const cooldown = 1000;
        if (this.keyboard.D && this.character.bottles > 0 && now - this.lastBottleThrowTime > cooldown) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
            this.character.bottles--;
            let percentage = (this.character.bottles / 20) * 100;
            this.statusBarBottles.setPercentage(percentage);
            this.lastBottleThrowTime = now;
        }
    }


    draw() {
        if (this.paused || !this.active) {
            requestAnimationFrame(() => this.draw());
            return;
        } this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        if (this.gameOver) {
            this.closeGameBecauseLose();
            return;
        }

        if (this.gameWin) {
            this.closeGameBecauseWin();
            return;
        }
        this.endboss.animate();
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0)
        this.addtoMap(this.statusBarHealth);
        this.addtoMap(this.statusBarBottles);
        this.addtoMap(this.statusBarCoins);
        this.addtoMap(this.endboss.statusBar);
        this.ctx.translate(this.camera_x, 0);
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


    closeGameBecauseWin() {
        let windowBack = document.getElementById('window_back');
        let backgroundSound = document.getElementById('startSound');
        if (this.gameWin) {
            this.ctx.translate(-this.camera_x, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.ctx.drawImage(this.character.winImage, 0, 0, this.canvas.width, this.canvas.height);
            this.winSound.play();
            this.ctx.restore();
            this.stopGameLoop();
            setTimeout(() => {
                windowBack.style.display = 'flex'
            }, 1000); return;
        }
    }


    closeGameBecauseLose() {
        let windowBack = document.getElementById('window_back');
        let backgroundSound = document.getElementById('startSound');
        if (this.gameOver) {
            this.character.stopSounds();
            this.ctx.translate(-this.camera_x, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.loseSound.play();
            backgroundSound.pause();
            setTimeout(() => {
                windowBack.style.display = 'flex'
            }, 1000);
            this.ctx.drawImage(this.character.loseImage, 0, 0, this.canvas.width, this.canvas.height);
            return;
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
        if (mo.otherDirection) {
            this.flipImageBack(mo)
        }
    }


    stopGameLoop() {
        if (this.checkCollisionsInterval) {
            clearInterval(this.checkCollisionsInterval);
            this.checkCollisionsInterval = null;
        }
        this.active = true;
        this.paused = true;
    }


    resumeGameLoop() {
        if (!this.checkCollisionsInterval) {
            this.run();
        }
        this.paused = false;
        this.active = true;
    }


    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkThrowableObjectCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
    }


    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                const cBox = this.character.getHitBox();
                const eBox = enemy.getHitBox();
                const isJumpingOnEnemy =
                    this.character.speedY < 0 &&
                    cBox.bottom <= eBox.top + (enemy.height / 2);
                if (isJumpingOnEnemy) {
                    enemy.energy = 0;
                    this.character.speedY = 25;
                    this.character.y = 155;
                } else if (enemy.energy > 0) {
                    let now = new Date().getTime();
                    let timePassed = (now - this.character.lastHit) / 1000;

                    if (timePassed > 2 || this.character.lastHit === 0) {
                        this.character.hit();
                        this.statusBarHealth.setPercentage(this.character.energy);
                    }
                }
            }
        });
    }


    checkThrowableObjectCollisions() {
        this.level.enemies.forEach((enemy) => {
            this.throwableObjects.forEach((throwableObject, tIndex) => {
                if (enemy.isColliding(throwableObject)) {
                    if (enemy instanceof Endboss) {
                        enemy.hitByBottle();
                        throwableObject.crash();
                    } else {
                        enemy.energy = 0;
                                        throwableObject.crash();

                    }
                }
            });
        });
    }

    checkCoinCollisions() {
        this.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.coins.splice(index, 1);
                this.character.coins += 1;
                this.coinSound.play();

                let percentage = this.character.coins * 5;
                if (percentage > 100) percentage = 100;
                this.statusBarCoins.setPercentage(percentage);
            }
        });
    }

    
    checkBottleCollisions() {
        this.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.bottles.splice(index, 1);
                this.character.bottles += 5;
                this.collectBottle.play();
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



