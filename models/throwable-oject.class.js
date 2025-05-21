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
   * Creates an instance of the ThrowableObject (bottle).
   * @param {number} x - The x-coordinate of the bottle.
   * @param {number} y - The y-coordinate of the bottle.
   * @param {boolean} [throwToLeft=false] - Indicates whether the bottle is thrown to the left.
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
    this.initSounds(); // Initialize and register audio
    this.throw();
  }

  /**
   * Initializes the sounds defined in AUDIOS and registers them globally.
   */
  initSounds() {
    if (this.world && this.world.isMuted) return; 
    this.sounds = {};
    if (this.AUDIOS) {
      for (let key in this.AUDIOS) {
        const [src, volume] = this.AUDIOS[key];
        const audio = this.createAudio(src, volume);
        this.sounds[key] = audio;
        this.registerSound(audio);
      }
    }
  }

/**
 * Initiates the throwing action for the bottle.
 * Plays the throw sound, applies gravity, and starts movement.
 */
throw() {
  if (this.world?.isMuted) {
    // Bewegung trotzdem durchführen, aber ohne Sounds
    this.speedY = 20;
    this.applyGravity();

    const moveInterval = setInterval(() => {
      this.x += this.throwToLeft ? -10 : 10;
      if (this.broken) {
        clearInterval(moveInterval);
      }
    }, 25);

    this.animationInterval = setInterval(() => {
      if (!this.broken && this.y >= this.groundLevel) {
        this.startSplash(); 
      }
      if (!this.broken) {
        this.playAnimation(this.IMAGE_BOTTLE);
      }
    }, 80);
    
    return; // Keine Sounds
  }

  // Überprüfen, ob das Spiel nicht gemutet ist, bevor der Werf-Sound abgespielt wird
  if (this.sounds.throw && !this.world?.isMuted) {
    this.sounds.throw.play().catch(e => console.warn("Throw sound blocked:", e));
  }

  this.speedY = 20;
  this.applyGravity();

  const moveInterval = setInterval(() => {
    this.x += this.throwToLeft ? -10 : 10;

    if (this.broken) {
      if (this.sounds.throw) {
        this.sounds.throw.pause();
        this.sounds.throw.currentTime = 0;
      }
      if (this.sounds.splash && !this.world?.isMuted) { 
        this.sounds.splash.play().catch(e => console.warn("Splash sound blocked:", e));
      }
      clearInterval(moveInterval);
    }
  }, 25);

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
   * Starts the bottle splash animation after it has hit the ground.
   * Ends the animation and marks the object for removal.
   */
startSplash() {
  this.broken = true;
  this.currentImage = 0;

  if (!this.world?.isMuted && this.sounds?.splash) {
    this.sounds.splash.play().catch(e => console.warn("Splash sound blocked:", e));
  }

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
