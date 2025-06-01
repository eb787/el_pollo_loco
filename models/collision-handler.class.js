class CollisionHandler {
  constructor(world) {
    this.world = world;
  }

  /**
   * Checks for all types of collisions between the character,
   * enemies, coins, salsa, and thrown objects.
   */
  checkCollisions() {
    this.handleCoinCollision();
    this.handleSalsaCollision();
    this.handleEnemyCollisions();

    this.checkBottleHits();
    this.removeBrokenBottles();
  }

  /**
   * Checks for collisions between throwable objects (bottles) and enemies.
   * If a bottle hits an enemy, the enemy takes damage.
   * If the enemy is the Endboss, the boss status bar is updated accordingly.
   * The bottle plays its splash animation and is marked for removal after hitting an enemy.
   */
  checkBottleHits() {
    this.world.throwableObjects.forEach((bottle) => {
      for (let enemy of this.world.level.enemies) {
        if (!bottle.broken && bottle.isColliding(enemy)) {
          if (enemy instanceof Endboss && enemy.isInvincible) {
            continue;
          }
          const isSmallEnemy = enemy instanceof SmallChicken;
          if (isSmallEnemy || bottle.y + bottle.height >= enemy.y) {
            if (enemy instanceof Endboss) {
              enemy.hurt();
              this.world.endbossStatusBar.setPercentage(enemy.energy);
            } else {
              enemy.hitByBottle();
            }
            bottle.broken = true;
            bottle.startSplash();
            break;
          }
        }
      }
    });
  }

  removeBrokenBottles() {
    this.world.throwableObjects = this.world.throwableObjects.filter(
      (obj) => !obj.markedForRemoval
    );
  }

  /**
   * Handles collision between the character and salsa pickups.
   * Plays sound, updates character salsa count, and status bar.
   */
  handleSalsaCollision() {
    this.world.level.salsa = this.world.level.salsa.filter((salsa) => {
      if (this.world.character.isColliding(salsa)) {
        if (!this.world.isMuted) {
          salsa.playCollectSalsaSound();
        }
        this.world.character.collectSalsa();
        this.world.salsaStatusBar.setPercentage(
          this.world.character.salsa * 20
        );
        return false; // Entferne eingesammeltes Salsa-Objekt
      }
      return true;
    });
  }

  /**
   * Handles collision between the character and coins.
   * Plays sound, updates character coins count, and status bar.
   */
  handleCoinCollision() {
    this.world.level.coins = this.world.level.coins.filter((coin) => {
      if (this.world.character.isColliding(coin)) {
        if (!this.world.isMuted) {
          coin.playCollectSound();
        }
        this.world.character.collectCoin();
        this.world.coinStatusBar.setPercentage(this.world.character.coins * 20);
        return false; // Entferne eingesammelte Münze
      }
      return true;
    });
  }

  /**
   * Handles collisions between the character and enemies.
   * Differentiates behavior for chickens and the Endboss.
   */
  handleEnemyCollisions() {
    for (let enemy of this.world.level.enemies) {
      if (enemy.dead) continue;
      if (this.world.character.isColliding(enemy)) {
        if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
          this.handleChickenCollision(enemy);
        }
        if (enemy instanceof Endboss) {
          this.handleEndbossCollision(enemy);
        }
      }
    }
  }

  /**
   * Handles the collision between the character and a chicken enemy.
   * If the character is falling onto the chicken, the chicken dies and the character bounces.
   * Otherwise, the character takes damage.
   *
   * @param {Chicken|SmallChicken} chicken - The chicken enemy that the character has collided with.
   */
  handleChickenCollision(chicken) {
    if (this.isFatalChickenHit(chicken)) {
      chicken.die();
      const newY = chicken.y - this.world.character.height;
      if (this.world.character.y > newY) {
        this.world.character.y = newY;
      }
      this.world.character.speedY = 15;
    } else {
      this.world.character.hit();
      this.world.statusBar.setPercentage(this.world.character.energy);
    }
  }

  /**
   * Determines whether the character has landed on the chicken in a way that kills it.
   * This occurs when the character is falling and lands within a specific vertical and horizontal range of the chicken.
   *
   * @param {Chicken|SmallChicken} chicken - The chicken enemy being checked for a fatal collision.
   * @returns {boolean} True if the collision should result in the chicken's death, false otherwise.
   */
  isFatalChickenHit(chicken) {
    const characterBottom =
      this.world.character.y + this.world.character.height;
    const characterCenterX =
      this.world.character.x + this.world.character.width / 2;
    const chickenTop = chicken.y;
    const chickenLeft = chicken.x;
    const chickenRight = chicken.x + chicken.width;
    const isFalling = this.world.character.speedY < 0;
    const verticalMargin = chicken instanceof SmallChicken ? 25 : 15;
    const horizontalHit =
      characterCenterX > chickenLeft && characterCenterX < chickenRight;
    const verticalHit =
      characterBottom > chickenTop - verticalMargin &&
      characterBottom < chickenTop + chicken.height;
    return isFalling && verticalHit && horizontalHit;
  }

  /**
   * Handles collision between the character and the Endboss.
   * Prevents repeated damage within a short cooldown.
   *
   * @param {Endboss} enemy - The Endboss enemy.
   */
  handleEndbossCollision(enemy) {
    if (!this.world.characterRecentlyHit) {
      this.world.character.hitEndboss();
      this.world.statusBar.setPercentage(this.world.character.energy);
      this.world.characterRecentlyHit = true;

      setTimeout(() => {
        this.world.characterRecentlyHit = false;
      }, 1000);
    }
  }

  /**
   * Checks whether the character is allowed to throw a bottle.
   * Conditions:
   * - The "D" key is pressed
   * - The character has salsa bottles left
   * - Enough time has passed since the last throw
   *
   * @param {number} now - Current timestamp in milliseconds
   * @returns {boolean} True if the character can throw a bottle.
   */
  canThrowBottle(now) {
    return (
      this.world.keyboard.D &&
      this.world.character.salsa > 0 &&
      now - this.world.character.lastThrowTime >
        this.world.character.throwCooldown
    );
  }

  /**
   * Creates and throws a new bottle:
   * - Sets its position and direction
   * - Starts the throw animation and sound
   * - Adds it to the world and updates the throwableObjects array
   */
  throwBottle() {
    const character = this.world.character;
    const x = character.x + 50;
    const y = character.y + 100;
    const throwToLeft = character.otherDirection;
    const bottle = new ThrowableObject(x, y, throwToLeft);
    bottle.world = this.world;
    bottle.initSounds();
    bottle.startThrowWithSound();
    this.world.throwableObjects.push(bottle);
    character.salsa--;
    this.world.salsaStatusBar.setPercentage(character.salsa * 20);
  }

  /**
   * Checks if the character can throw a bottle and throws one if possible.
   */
  checkThrowObjects() {
    const now = Date.now();
    if (this.canThrowBottle(now)) {
      this.world.character.lastThrowTime = now;
      this.throwBottle();
    }
  }
}
