class Chicken extends MovableObject {
  y = 335;
  height = 90;
  width = 100;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];
  AUDIOS = {
    hurt: ["audio/chicken-crash6.mp3", 0.2],
  };
  offset = {
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
  };
   world;
  dead = false;
  static chickens = [];
  lastHurtSoundTime = 0;
  hurtSoundCooldown = 1000;

  /**
   * Creates an instance of the Chicken.
   * Initializes the chicken's properties, randomizes its position, and starts its animation.
   */
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.x = this.getRandomPosition();
    this.speed = 0.15 + Math.random() * 0.35;
    Chicken.chickens.push(this);
    this.animate();

    this.sounds = {};
    for (let key in this.AUDIOS) {
      const [src, volume] = this.AUDIOS[key];
      const sound = this.createAudio(src, volume);
      this.sounds[key] = sound;
      this.registerSound(sound); 
    }
  }

  /**
   * Generates a random x-position for the chicken, ensuring it doesn't overlap with other chickens.
   * @returns {number} - The random x-coordinate for the chicken.
   */
  getRandomPosition() {
    let xPosition;
    let isValid = false;

    while (!isValid) {
      xPosition = 1100 + Math.random() * 800;
      isValid = true;
      for (let chicken of Chicken.chickens) {
        if (Math.abs(chicken.x - xPosition) < this.width) {
          isValid = false;
          break;
        }
      }
    }
    return xPosition;
  }

  /**
   * Marks the chicken as dead, updates its image, and plays the hurt sound.
   */
  die() {
    this.dead = true;
    super.die();
    this.loadImage(this.IMAGES_DEAD[0]);
    this.playHurtSound();
  }

  /**
   * Handles the chicken's movement and animation.
   * Makes the chicken move left and play walking animation when alive.
   */
  animate() {
    setInterval(() => {
      if (!this.dead) {
        this.moveLeft();
      }
    }, 1000 / 60);

    setInterval(() => {
      if (this.dead) {
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
  }

  /**
   * Plays the sound when the chicken is hurt.
   * Ensures that the sound is played only once every cooldown period.
   */
  playHurtSound() {
      if (this.world?.isMuted) return; 
    let now = Date.now();
    if (now - this.lastHurtSoundTime > this.hurtSoundCooldown) {
      this.sounds.hurt
        .play()
        .catch((e) => console.warn("Chicken sound blocked:", e));
      this.lastHurtSoundTime = now;
    }
  }
}
