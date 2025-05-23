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
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
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
    this.energy = 20;
    this.speed = 0.15 + Math.random() * 0.35;
    Chicken.chickens.push(this);
    this.animate();
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
  if (this.dead) return; // Falls schon tot, nichts tun
  console.log("Chicken died");

  this.dead = true;
  this.loadImage(this.IMAGES_DEAD[0]);
  this.playHurtSound();

  clearInterval(this.movementInterval);
  clearInterval(this.walkAnimationInterval);
}



hitByBottle() {
  console.log("Chicken hit by bottle");

  this.energy -= 20;
  if (this.energy < 0) this.energy = 0;

  if (this.energy === 0 && !this.dead) {
    console.log("Chicken has no energy, calling die()");
    this.die();
  }

  this.lastHitBottle = new Date().getTime();
}



  /**
   * Handles the chicken's movement and animation.
   * Makes the chicken move left and play walking animation when alive.
   */
animate() {
  this.movementInterval = setInterval(() => {
    if (!this.dead) {
      this.moveLeft();
    }
  }, 1000 / 60);

  this.walkAnimationInterval = setInterval(() => {
    if (!this.dead) {
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
