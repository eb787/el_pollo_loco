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
    this.collisionHandler = new CollisionHandler(this);
  }

  /**
   * Starts the game loop for throwing objects and collision checks,
   * if the game is not over.
   */
  run() {
    if (!this.isGameOver) {
      this.setSafeInterval(() => {
        this.collisionHandler.checkThrowObjects(); // NEU
        this.collisionHandler.checkCollisions();
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

  checkCollisions() {
    this.collisionHandler.checkCollisions();
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
   * @param {Array} objects - Array of drawable game objects.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Draws a single game object on the canvas, flipping it if necessary.
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
   * @param {Object} mo - The movable object to flip.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.scale(-1, 1);
    mo.x = -mo.x - mo.width;
  }

  /**
   * Restores the canvas context after flipping the image.
   * @param {Object} mo - The movable object to flip back.
   */
  flipImageBack(mo) {
    mo.x = -mo.x - mo.width;
    this.ctx.restore();
  }

  /**
   * Sets a safe interval and keeps track of its ID for later cleanup.
   * This ensures that all intervals can be cleared easily when the game stops.
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

  /**
   * Initializes the character's sounds using the SoundHelper utility.
   * - Stores the returned sounds object in this.sounds for later use.
   */
  initSounds() {
    const newSounds = SoundHelper.initSounds(this.AUDIOS, false, (audio) =>
      SoundHelper.registerSound(audio, this.allSounds)
    );
    this.sounds = newSounds;
  }

  /**
   * Continuously checks for a game end condition and shows the respective screen.
   * Prevents multiple end states by checking isGameOver flag.
   *
   * @param {Function} conditionFn - Function that returns true when the condition to end the game is met.
   * @param {Function} endScreenFn - Function to call when the condition is met (e.g., this.showWinScreen).
   * @param {number} [delay=0] - Optional delay before showing the end screen.
   */
  checkEndCondition(conditionFn, endScreenFn, delay = 0) {
    const interval = setInterval(() => {
      if (this.isGameOver) return;
      if (conditionFn()) {
        clearInterval(interval);
        this.character.isFrozen = true;
        setTimeout(() => {
          this.isGameOver = true;
          this.stopGame();
          endScreenFn.call(this);
        }, delay);
      }
    }, 200);
    this.intervalIds.push(interval);
  }

  /**
   * Checks if the player has won the game by evaluating the end condition.
   * The win condition is met if the Endboss exists and its energy is less than or equal to 0.
   * If the condition is met, the win screen is shown after a delay.
   */
  checkIfPlayerWon() {
    this.checkEndCondition(
      () => {
        let endboss = this.level.enemies.find((e) => e instanceof Endboss);
        return endboss && endboss.energy <= 0;
      },
      this.showWinScreen,
      3000 // Delay in milliseconds before showing the win screen
    );
  }

  /**
   * Checks if the player has lost the game by evaluating the end condition.
   * The lose condition is met if the character's energy is less than or equal to 0.
   * If the condition is met, the lose screen is shown immediately.
   */
  checkIfPlayerLost() {
    this.checkEndCondition(
      () => this.character.energy <= 0,
      this.showLoseScreen
    );
  }

  /**
   * Stops the game, displays the end screen image, and shows the restart button.
   * @param {string} imagePath - Path to the image to display.
   */
  showEndScreenVisual(imagePath) {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
    let image = new Image();
    image.src = imagePath;
    image.onload = () => {
      let ctx = this.ctx;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    this.stopGame();
    this.showRestartButton();
  }

  /**
   * Plays the end screen sound.
   * @param {string} soundKey - Key of the sound to play ('win' or 'lose').
   */
  playEndScreenSound(soundKey) {
    if (!this.isMuted && this.sounds?.[soundKey]) {
      this.sounds[soundKey].currentTime = 0;
      this.sounds[soundKey]
        .play()
        .catch((e) => console.warn(`${soundKey} sound blocked:`, e));
    }
  }

  /**
   * Combines sound and visual display for the end screen.
   * @param {string} soundKey - Key of the sound to play ('win' or 'lose').
   * @param {string} imagePath - Path to the image to display.
   */
  showEndScreen(soundKey, imagePath) {
    if (this.isGameOver) {
      this.isGameOver = true;
    }
    this.playEndScreenSound(soundKey);
    this.showEndScreenVisual(imagePath);
  }

  showWinScreen() {
    this.showEndScreen("win", "img/You won, you lost/You won A.png");
  }

  showLoseScreen() {
    this.showEndScreen("lose", "img/You won, you lost/You lost.png");
  }

  /**
   * Displays the restart button and sets up the click handler to restart the game.
   * When clicked, the button hides itself and calls the restartGame() function.
   * Ensures previous event listeners are removed to avoid duplicates.
   */
  showRestartButton() {
    const btn = document.getElementById("restartBtn");
    btn.style.display = "block";
    if (this._restartHandler) {
      btn.removeEventListener("click", this._restartHandler);
    }
    this._restartHandler = () => {
      btn.style.display = "none";
      restartGame();
    };
    btn.addEventListener("click", this._restartHandler);
  }
}
