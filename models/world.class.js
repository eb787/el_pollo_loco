class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  coinStatusBar = new CoinStatusBar();
  salsaStatusBar = new SalsaStatusBar();
  endbossStatusBar = new EndbossStatusBar();
  throwableObjects = [];
  intervalIds = [];
  isGameOver = false;
  characterRecentlyHit = false;
  allSounds = [];
  AUDIOS = {
    win: ["audio/win.mp3", 0.5],
    lose: ["audio/fail.mp3", 0.5],
  };

  /**
   * Creates a new World instance.
   * Initializes canvas context, keyboard input, sets up the game world,
   * and starts the main game loop and win/lose checks.
   *
   * @param {HTMLCanvasElement} canvas - The canvas element where the game is drawn.
   * @param {Object} keyboard - The keyboard input handler.
   */
  constructor(canvas, keyboard) {
    this.intervalIds = [];
    this.allSounds = [];
    this.keyboard = keyboard;
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.setWorld();
    this.checkIfPlayerWon();
    this.checkIfPlayerLost();
    this.draw();
    this.run();
    this.initSounds();
  }

  /**
   * Starts the game loop for throwing objects and collision checks,
   * if the game is not over.
   */
  run() {
    if (!this.isGameOver) {
      this.setSafeInterval(() => {
        this.checkThrowObjects();
        this.checkCollisions();
      }, 70);
    }
  }

  /**
   * Sets the world reference and initializes sounds for
   * the character and all relevant game objects.
   */
  setWorld() {
    this.character.world = this;
    if (typeof this.character.initSounds === "function") {
      this.character.initSounds();
    }
    const objectLists = [
      this.level.enemies,
      this.level.salsa,
      this.level.coins,
      this.throwableObjects,
    ];
    objectLists.forEach((list) => this.assignWorldAndSounds(list));
  }

  /**
   * Assigns the world reference and initializes sounds for each object in the array.
   * If the object is an Endboss, assigns the character reference as well.
   *
   * @param {Array} objects - Array of game objects.
   */
  assignWorldAndSounds(objects) {
    objects.forEach((obj) => {
      obj.world = this;

      if (obj instanceof Endboss) {
        obj.character = this.character;
      }
      if (typeof obj.initSounds === "function") {
        obj.initSounds();
      }
    });
  }

  /**
   * Checks if the character can throw a bottle and throws one if possible.
   */
  checkThrowObjects() {
    let now = Date.now();
    if (this.canThrowBottle(now)) {
      this.character.lastThrowTime = now;
      this.throwBottle();
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
      this.keyboard.D &&
      this.character.salsa > 0 &&
      now - this.character.lastThrowTime > this.character.throwCooldown
    );
  }

  /**
   * Creates and throws a new bottle:
   * - Sets its position and direction
   * - Starts the throw animation and sound
   * - Adds it to the world and updates the throwableObjects array
   */
  throwBottle() {
    const x = this.character.x + 50;
    const y = this.character.y + 100;
    const throwToLeft = this.character.otherDirection;
    const bottle = new ThrowableObject(x, y, throwToLeft);
    bottle.world = this;
    bottle.initSounds();
    bottle.startThrowWithSound();
    this.throwableObjects.push(bottle);
    this.character.salsa--;
    this.salsaStatusBar.setPercentage(this.character.salsa * 20);
  }

  /**
   * Checks for all types of collisions between the character,
   * enemies, coins, salsa, and thrown objects.
   */
  checkCollisions() {
    this.handleBottleHits();
    this.handleCoinCollision();
    this.handleSalsaCollision();
    this.handleEnemyCollisions();
  }

  /**
   * Checks for collisions between throwable objects (bottles) and enemies.
   * If a bottle hits an enemy, the enemy takes damage.
   * If the enemy is the Endboss, the boss status bar is updated accordingly.
   * The bottle plays its splash animation and is marked for removal after hitting an enemy.
   * Finally, all bottles marked for removal are filtered out from the throwableObjects array.
   */
  handleBottleHits() {
  this.throwableObjects.forEach((bottle) => {
    for (let enemy of this.level.enemies) {
      if (!bottle.broken && bottle.isColliding(enemy)) {
        const isSmallEnemy = enemy instanceof SmallChicken;
        if (isSmallEnemy || bottle.y + bottle.height >= enemy.y) {
          enemy.hitByBottle();
          if (enemy instanceof Endboss) {
            this.endbossStatusBar.setPercentage(enemy.energy);
          }
          bottle.broken = true;
          bottle.startSplash();
          break;
        }
      }
    }
  });

  this.throwableObjects = this.throwableObjects.filter(
    (obj) => !obj.markedForRemoval
  );
}

  /**
   * Handles collision between the character and salsa pickups.
   * Plays sound, updates character salsa count, and status bar.
   */
  handleSalsaCollision() {
    this.level.salsa.forEach((salsa, index) => {
      if (this.character.isColliding(salsa)) {
        if (!this.isMuted) {
          salsa.playCollectSalsaSound();
        }
        this.character.collectSalsa();
        this.level.salsa.splice(index, 1);
        this.salsaStatusBar.setPercentage(this.character.salsa * 20);
      }
    });
  }

  /**
   * Handles collision between the character and coins.
   * Plays sound, updates character coins count, and status bar.
   */
  handleCoinCollision() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        if (!this.isMuted) {
          coin.playCollectSound();
        }
        this.character.collectCoin();
        this.level.coins.splice(index, 1);
        this.coinStatusBar.setPercentage(this.character.coins * 20);
      }
    });
  }

  /**
   * Handles collisions between the character and enemies.
   * Differentiates behavior for chickens and the Endboss.
   */
  handleEnemyCollisions() {
    for (let enemy of this.level.enemies) {
      if (enemy.dead) continue;
      if (this.character.isColliding(enemy)) {
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
      const newY = chicken.y - this.character.height;
      if (this.character.y > newY) {
        this.character.y = newY;
      }
      this.character.speedY = 15; 
    } else {
      this.character.hit();
      this.statusBar.setPercentage(this.character.energy);
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
    const characterBottom = this.character.y + this.character.height;
    const characterCenterX = this.character.x + this.character.width / 2;
    const chickenTop = chicken.y;
    const chickenLeft = chicken.x;
    const chickenRight = chicken.x + chicken.width;
    const isFalling = this.character.speedY < 0;
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
   */
  handleEndbossCollision() {
    if (!this.characterRecentlyHit) {
      this.character.hitEndboss();
      this.statusBar.setPercentage(this.character.energy);
      this.characterRecentlyHit = true;

      setTimeout(() => {
        this.characterRecentlyHit = false;
      }, 1000);
    }
  }

  /**
   * Clears the canvas and redraws all game elements, including the background,
   * character, enemies, projectiles, items, and status bars.
   * Uses requestAnimationFrame for continuous animation.
   */
  draw() {
    if (this.isGameOver) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.salsa);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.salsaStatusBar);
    this.addToMap(this.endbossStatusBar);
    this.animationFrameId = requestAnimationFrame(() => {
      this.draw();
    });
  }

  /**
   * Adds multiple game objects to the canvas map.
   *
   * @param {Array} objects - Array of drawable game objects.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Draws a single game object on the canvas, flipping it if necessary.
   *
   * @param {Object} mo - The movable object to draw.
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips the canvas context horizontally to mirror the image.
   *
   * @param {Object} mo - The movable object to flip.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.scale(-1, 1);
    mo.x = -mo.x - mo.width;
  }

  /**
   * Restores the canvas context after flipping the image.
   *
   * @param {Object} mo - The movable object to flip back.
   */
  flipImageBack(mo) {
    mo.x = -mo.x - mo.width;
    this.ctx.restore();
  }

  /**
   * Sets a safe interval and keeps track of its ID for later cleanup.
   * This ensures that all intervals can be cleared easily when the game stops.
   *
   * @param {Function} fn - The function to be executed repeatedly.
   * @param {number} time - The interval time in milliseconds.
   * @returns {number} The ID of the interval.
   */
  setSafeInterval(fn, time) {
    const id = setInterval(fn, time);
    this.intervalIds.push(id);
    return id;
  }

  /**
   * Clears all intervals that were set using setSafeInterval.
   * Useful for stopping all repeating actions when the game ends.
   */
  clearAllIntervals() {
    this.intervalIds.forEach(clearInterval);
    this.intervalIds = [];
  }

  /**
   * Stops the game by clearing intervals, stopping sounds,
   * and marking the game as over.
   */
  stopGame() {
    this.level.enemies.forEach((enemy) => enemy.clearAllIntervals());
    this.throwableObjects.forEach((obj) => obj.clearAllIntervals());
    this.character.clearAllIntervals();
    this.clearAllIntervals();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.stopAllSounds();
    this.isGameOver = true;
  }

  /**
   * Performs full cleanup by first releasing sounds, then cleaning the world.
   */
  cleanup() {
    this.cleanupSounds();
    this.cleanupWorld();
  }

  /**
   * Stops and releases all audio resources by pausing, removing sources,
   * and resetting audio elements in the allSounds array.
   */
  cleanupSounds() {
    if (this.allSounds && this.allSounds.length > 0) {
      this.allSounds.forEach((audio) => {
        try {
          audio.pause();
          audio.src = "";
          audio.load();
        } catch (e) {
          console.warn("Error while cleaning up a sound:", e);
        }
      });
    }
    this.allSounds = [];
  }

  /**
   * Cleans up the game world by stopping the game and resetting all
   * game-related properties, allowing garbage collection and fresh start.
   */
  cleanupWorld() {
    this.stopGame();
    this.character = null;
    this.level = null;
    Chicken.chickens = [];
    this.statusBar = null;
    this.coinStatusBar = null;
    this.salsaStatusBar = null;
    this.endbossStatusBar = null;
    this.throwableObjects = [];
    this.keyboard = null;
    this.ctx = null;
    this.canvas = null;
  }

  /**
   * Stops all playing sounds including background music and other audios.
   */
  stopAllSounds() {
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }

    if (this.allSounds) {
      this.allSounds.forEach((audio) => {
        if (audio === this.sounds?.win || audio === this.sounds?.lose) return;

        if (audio && !audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    }
  }

  initSounds() {
    const newSounds = SoundHelper.initSounds(this.AUDIOS, false, (audio) =>
      SoundHelper.registerSound(audio, this.allSounds)
    );
    this.sounds = newSounds;
  }

  /**
   * Continuously checks if the player has defeated the Endboss.
   * Shows the win screen once the Endboss energy reaches zero.
   */
  checkIfPlayerWon() {
    let interval = setInterval(() => {
      let endboss = this.level.enemies.find((e) => e instanceof Endboss);
      if (endboss && endboss.energy <= 0) {
        clearInterval(interval);

        setTimeout(() => {
          this.showWinScreen();
        }, 700);
      }
    }, 200);
    this.intervalIds.push(interval);
  }

  /**
   * Continuously checks if the player has lost (energy <= 0).
   * Shows the lose screen when the player is out of energy.
   */
  checkIfPlayerLost() {
    let interval = setInterval(() => {
      if (this.character.energy <= 0) {
        clearInterval(interval);
        this.showLoseScreen();
      }
    }, 200);
    this.intervalIds.push(interval);
  }

  /**
   * Displays the win screen:
   * - Stops background music
   * - Plays win sound
   * - Draws win image on canvas
   * - Stops the game and shows restart button
   */
  showWinScreen() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
    if (!this.isMuted && this.sounds?.win) {
      this.sounds.win.currentTime = 0;
      this.sounds.win
        .play()
        .catch((e) => console.warn("Win sound blocked:", e));
    }
    let winImage = new Image();
    winImage.src = "img/You won, you lost/You won A.png";
    winImage.onload = () => {
      let ctx = this.ctx;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(winImage, 0, 0, canvas.width, canvas.height);
    };
    this.stopGame();
    this.showRestartButton();
  }

  /**
   * Displays the lose screen:
   * - Stops background music
   * - Plays lose sound
   * - Draws lose image on canvas
   * - Stops the game and shows restart button
   */
  showLoseScreen() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
    if (!this.isMuted && this.sounds?.lose) {
      this.sounds.lose.currentTime = 0;
      this.sounds.lose
        .play()
        .catch((e) => console.warn("Lose sound blocked:", e));
    }
    let loseImage = new Image();
    loseImage.src = "img/You won, you lost/You lost.png";
    loseImage.onload = () => {
      let ctx = this.ctx;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(loseImage, 0, 0, canvas.width, canvas.height);
    };
    this.stopGame();
    this.showRestartButton();
  }

  /**
   * Shows the restart button and reloads the page when clicked.
   */
  showRestartButton() {
    const btn = document.getElementById("restartBtn");
    btn.style.display = "block";

    // Falls es schon einen Listener gibt, entfernen wir ihn
    if (this._restartHandler) {
      btn.removeEventListener("click", this._restartHandler);
    }

    // Event Handler als Property speichern, damit removeEventListener funktioniert
    this._restartHandler = () => {
      btn.style.display = "none";
      restartGame();
    };

    btn.addEventListener("click", this._restartHandler);
  }
}
