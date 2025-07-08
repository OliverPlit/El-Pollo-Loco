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
    requestAnimationFrameID;
    frameSkipCounter = 0;
    frameSkipRate = 2; // Render nur jedes zweite Frame

    constructor(canvas, keyboard, level) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level;
        this.setWorld();
        this.generateCoins();
        this.generateBottles();
        this.assignWorldToEnemies();
        this.run();
        this.muteSounds();
        this.draw();
    }

    muteSounds() {
        window.soundManager.addSound(this.coinSound);
        window.soundManager.addSound(this.collectBottle);
        window.soundManager.addSound(this.winSound);
        window.soundManager.addSound(this.loseSound);
    }

    assignWorldToEnemies() {
        this.level.enemies.forEach(enemy => enemy.world = this);
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
            if (!this.coins.some(c => Math.hypot(c.x - coin.x, c.y - coin.y) < minDistance)) {
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
            if (!this.bottles.some(c => Math.hypot(c.x - bottle.x, c.y - bottle.y) < minDistance)) {
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
        const now = Date.now();
        const cooldown = 1000;
        if (this.keyboard.D && this.character.bottles > 0 && now - this.lastBottleThrowTime > cooldown) {
            const offsetX = this.character.otherDirection ? -50 : 100;
            const bottle = new ThrowableObject(this.character.x + offsetX, this.character.y + 100, this.character.otherDirection);
            this.throwableObjects.push(bottle);
            this.character.bottles--;
            this.statusBarBottles.setPercentage((this.character.bottles / 20) * 100);
            this.lastBottleThrowTime = now;
        }
    }

    draw() {
        this.requestAnimationFrameID = requestAnimationFrame(() => this.draw());

        if (this.paused || !this.active) return;

        // Frameskipping
        if (this.frameSkipCounter++ % this.frameSkipRate !== 0) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);

        if (this.gameOver) return this.closeGameBecauseLose();
        if (this.gameWin) return this.closeGameBecauseWin();

        this.endboss.animate();
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
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
        this.ctx.translate(-this.camera_x, 0);

        if (this.showIntro) this.drawExplanationOverlay();
    }

    closeGameBecauseWin() {
        const windowBack = document.getElementById('window_back');
        const backgroundSound = document.getElementById('startSound');
        this.ctx.translate(-this.camera_x, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.character.winImage, 0, 0, this.canvas.width, this.canvas.height);
        this.winSound.play();
        this.ctx.restore();
        this.stopGameLoop();
        setTimeout(() => windowBack.style.display = 'flex', 1000);
    }

    closeGameBecauseLose() {
        const windowBack = document.getElementById('window_back');
        const backgroundSound = document.getElementById('startSound');
        this.ctx.translate(-this.camera_x, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.loseSound.play();
        backgroundSound.pause();
        setTimeout(() => windowBack.style.display = 'flex', 1000);
        this.ctx.drawImage(this.character.loseImage, 0, 0, this.canvas.width, this.canvas.height);
    }

    addObjectsToMap(objects) {
        objects.forEach(o => this.addtoMap(o));
    }

    addtoMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    stopGameLoop() {
    // Stoppt die Intervall-Checks für Kollisionen etc.
    if (this.checkCollisionsInterval) {
        clearInterval(this.checkCollisionsInterval);
        this.checkCollisionsInterval = null;
    }

    // Stoppt den RequestAnimationFrame Loop
    if (this.requestAnimationFrameID) {
        cancelAnimationFrame(this.requestAnimationFrameID);
        this.requestAnimationFrameID = null;
    }

    // Stoppt alle Gegneranimationen (Chicken, YellowChicken etc.)
    this.level.enemies.forEach(enemy => {
        if (enemy.stopAllAnimations) {
            enemy.stopAllAnimations();
        }
    });

    this.active = false;
    this.paused = true;
}

resumeGameLoop() {
    if (!this.checkCollisionsInterval) this.run();

    if (!this.requestAnimationFrameID) this.draw();

    this.level.enemies.forEach(enemy => {
        if (enemy.startAllAnimations) {
            enemy.startAllAnimations();
        }
    });

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
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy)) {
                const cBox = this.character.getHitBox();
                const eBox = enemy.getHitBox();
                const isJumpingOnEnemy = this.character.speedY < 0 && cBox.bottom <= eBox.top + (enemy.height / 2);

                if (isJumpingOnEnemy) {
                    enemy.energy = 0;
                    this.character.speedY = 25;
                    this.character.y = 155;
                } else if (enemy.energy > 0) {
                    const now = Date.now();
                    const timePassed = (now - this.character.lastHit) / 1000;
                    if (timePassed > 2 || this.character.lastHit === 0) {
                        this.character.hit();
                        this.statusBarHealth.setPercentage(this.character.energy);
                    }
                }
            }
        });
    }

    checkThrowableObjectCollisions() {
        this.level.enemies.forEach(enemy => {
            this.throwableObjects.forEach((throwableObject) => {
                if (enemy.isColliding(throwableObject)) {
                    if (enemy instanceof Endboss) {
                        enemy.hitByBottle();
                    } else {
                        enemy.energy = 0;
                    }
                    throwableObject.crash();
                }
            });
        });
    }

    checkCoinCollisions() {
        this.coins = this.coins.filter((coin) => {
            if (this.character.isColliding(coin)) {
                this.character.coins += 1;
                this.coinSound.play();
                const percentage = Math.min(this.character.coins * 3, 100);
                this.statusBarCoins.setPercentage(percentage);
                return false;
            }
            return true;
        });
    }

    checkBottleCollisions() {
        this.bottles = this.bottles.filter((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.character.bottles += 5;
                this.collectBottle.play();
                const percentage = Math.min(this.character.bottles * 5, 100);
                this.statusBarBottles.setPercentage(percentage);
                return false;
            }
            return true;
        });
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x *= -1;
    }

    flipImageBack(mo) {
        mo.x *= -1;
        this.ctx.restore();
    }
}