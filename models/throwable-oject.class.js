class ThrowableObject extends MovableObject {
  IMAGE_BOTTLE = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];
  IMAGE_BOTTLE_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];
  AUDIOS = {
    throw: ["audio/rotate-bottle.mp3", 0.2],
    splash: ["audio/glassbroken.mp3", 0.2],
  };
  offset = {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  };
  animationInterval;
  broken = false;
  splashFrame = 0;

  /**
   * Creates a throwable object (bottle) that can fly.
   * @param {number} x - The x starting position.
   * @param {number} y - The y starting position.
   * @param {boolean} [throwToLeft=false] - Whether the bottle is thrown to the left.
   */
  constructor(x, y, throwToLeft = false) {
    super();
    this.loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(this.IMAGE_BOTTLE);
    this.loadImages(this.IMAGE_BOTTLE_SPLASH);
    this.height = 60;
    this.width = 70;
    this.x = x;
    this.y = y;
    this.throwToLeft = throwToLeft;
    this.groundLevel = 280;
    this.throw(); // Starts movement and animation, but not sound
  }

  /**
   * Starts the throw animation and movement, **but not** the sound.
   */
  throw() {
    this.speedY = 20;
    this.applyGravity();
    this.startMove();
    this.startAnimation();
  }

  /**
   * Starts the throw sound **only** if sound is enabled.
   */
  startThrowWithSound() {
    if (this.world?.isMuted || this.world?.isGameOver) return;

    const throwSound = this.sounds?.throw;
    if (throwSound && throwSound.paused) {
      throwSound.loop = false;
      throwSound.volume = this.AUDIOS.throw[1];
      throwSound.play().catch((e) => console.warn("Throw sound blocked:", e));
    }
  }

  /**
   * Movement after throw: flies left or right.
   * Continuously checks if the bottle is broken.
   */
  startMove() {
    const moveInterval = setInterval(() => {
      this.x += this.throwToLeft ? -10 : 10;

      if (this.broken) {
        this.stopThrowSound();
        this.playSplashSound();
        clearInterval(moveInterval);
      }
    }, 25);
  }

  /**
   * Stops the throw sound (if active).
   */
  stopThrowSound() {
    if (this.sounds.throw) {
      this.sounds.throw.pause();
      this.sounds.throw.currentTime = 0;
    }
  }

  /**
   * Plays the splash sound, **only if sound is enabled**.
   */
  playSplashSound() {
    if (this.world?.isMuted || this.world?.isGameOver) return;

    const splashSound = this.sounds?.splash;
    if (splashSound) {
      splashSound.play().catch((e) => console.warn("Splash sound blocked:", e));
    }
  }

  /**
   * Starts the throw rotation animation.
   */
  startAnimation() {
    this.animationInterval = setInterval(() => {
      if (!this.broken && this.y >= this.groundLevel) {
        this.startSplash();
      }
      if (!this.broken) {
        this.playAnimation(this.IMAGE_BOTTLE);
      }
    }, 80);
  }

  /**
   * Starts the splash animation once the ground is hit.
   */
  startSplash() {
    this.broken = true;
    this.currentImage = 0;
    this.playSplashSound();

    clearInterval(this.animationInterval);
    this.animationInterval = setInterval(() => {
      if (this.currentImage < this.IMAGE_BOTTLE_SPLASH.length) {
        this.playAnimation(this.IMAGE_BOTTLE_SPLASH);
      } else {
        clearInterval(this.animationInterval);
        this.markedForRemoval = true;
      }
    }, 80);
  }
}
