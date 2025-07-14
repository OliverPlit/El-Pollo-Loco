/**
 * Adds collision checking functions to the given World instance.
 * @param {World} world - The World instance to which collision functions will be added.
 */
function addCollisionFunctionsToWorld(world) {
    /**
     * Checks all relevant collisions in the game (enemies, throwable objects, coins, bottles).
     */
    world.checkCollisions = function () {
        this.checkEnemyCollisions();
        this.checkThrowableObjectCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
    };

    /**
     * Checks collisions between the character and enemies.
     * Decides if the character is jumping on the enemy or takes damage.
     */
    world.checkEnemyCollisions = function () {
        this.level.enemies.forEach(enemy => {
            if (!this.character.isColliding(enemy)) return;

            if (this.isJumpingOnEnemy(enemy)) {
                this.killEnemy(enemy);
            } else if (enemy.energy > 0 && this.canBeHit()) {
                this.handleCharacterHit(enemy);
            }
        });
    };

    /**
     * Checks if the character is jumping on an enemy from above.
     * @param {Enemy} enemy - The enemy to check.
     * @returns {boolean} True if the character is jumping on top of the enemy.
     */
    world.isJumpingOnEnemy = function (enemy) {
        const cBox = this.character.getHitBox();
        const eBox = enemy.getHitBox();
        const isJumping = this.character.speedY < 0;
        const hitsTop = cBox.bottom <= eBox.top + (enemy.height / 2);
        return isJumping && hitsTop;
    };

    /**
     * Kills an enemy by setting its energy to zero and bouncing the character upwards.
     * @param {Enemy} enemy - The enemy to kill.
     */
    world.killEnemy = function (enemy) {
        enemy.energy = 0;
        this.character.speedY = 30;
        this.character.y = 155;
    };

    /**
     * Checks if the character can currently be hit (cooldown of 2 seconds).
     * @returns {boolean} True if the character can be hit.
     */
    world.canBeHit = function () {
        const now = Date.now();
        const timePassed = (now - this.character.lastHit) / 1000;
        return timePassed > 2 || this.character.lastHit === 0;
    };

    /**
     * Handles the character being hit by an enemy.
     * Reduces health, triggers hit animation if needed, and updates the health bar.
     * @param {Enemy} enemy - The enemy that hit the character.
     */
    world.handleCharacterHit = function (enemy) {
        if (enemy instanceof Endboss) {
            this.character.energy -= 30;
        } else {
            this.character.hit();
        }

        if (this.character.energy < 0) {
            this.character.energy = 0;
        }

        this.statusBarHealth.setPercentage(this.character.energy);
    };

    /**
     * Checks collisions between throwable objects (e.g., bottles) and enemies.
     * Reduces enemy energy or triggers a hit event on the Endboss.
     */
    world.checkThrowableObjectCollisions = function () {
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
    };

    /**
     * Checks collisions between the character and coins.
     * Increases coin count, plays sound, updates coin bar, and removes collected coins.
     */
    world.checkCoinCollisions = function () {
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
    };

    /**
     * Checks collisions between the character and bottles.
     * Increases bottle count, plays sound, updates bottle bar, and removes collected bottles.
     */
    world.checkBottleCollisions = function () {
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
    };
}
