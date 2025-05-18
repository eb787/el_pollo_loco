class ThrowableObject extends MovableObject {
  IMAGE_BOTTLE = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /**
   * Array of image paths for the bottle splash animation after it breaks.
   * @type {string[]}
   */
  IMAGE_BOTTLE_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];
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
    this.currentImage = 0;
    this.throwToLeft = throwToLeft;
    this.groundLevel = 280;
    this.throw();
  }

  /**
   * Initiates the throwing action for the bottle.
   * Plays the throw sound and applies gravity.
   * Starts moving the bottle either to the left or right based on the throw direction.
   */
  throw() {
    this.throwSound = new Audio("audio/rotate-bottle.mp3");
    this.throwSound.volume = 0.5;
    this.throwSound
      .play()
      .catch((e) => console.warn("Wurfsound blockiert:", e));
    this.speedY = 20;
    this.applyGravity();
    const moveInterval = setInterval(() => {
      this.x += this.throwToLeft ? -10 : 10;
      if (this.broken) {
        clearInterval(moveInterval);
        if (this.throwSound) {
          this.throwSound.pause();
          this.throwSound.currentTime = 0;
        }
        let breakSound = new Audio("audio/glassbroken.mp3");
        breakSound.volume = 0.2;
        breakSound
          .play()
          .catch((e) => console.warn("Breaksound blockiert:", e));
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
   * Starts the bottle splash animation after the bottle has broken.
   * The splash animation plays until it finishes, marking the object for removal.
   */
  startSplash() {
    this.broken = true;
    this.currentImage = 0;

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
