class SmallChicken extends MovableObject {
  y = 370;
  width = 50;
  height = 55;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];
  AUDIOS = {
    hurt: ["audio/jump_small_chicken.mp3", 0.5],
  };
  offset = {
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
  };
  dead = false;
  static smallChickens = [];
  lastHurtSoundTime = 0;
  hurtSoundCooldown = 1000;

  /**
   * Creates an instance of the SmallChicken.
   * Initializes the small chicken's properties, randomizes its position, and starts its animation.
   */
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.x = this.getRandomPosition();
    this.energy = 20;
    this.speed = 0.15 + Math.random() * 0.45;
    SmallChicken.smallChickens.push(this);
    this.animate();
  }

  /**
   * Sets the reference to the game world and initializes sounds.
   *
   * @param {World} world - The game world instance to be associated with this object.
   */
  setWorld(world) {
    this.world = world;
    this.initSounds();
  }

  /**
   * Initializes the sounds for this object by calling the SoundHelper,
   * respecting the muted state of the world, and registering all sounds
   * in the world's global sound list.
   */
  initSounds() {
    this.sounds = SoundHelper.initSounds(
      this.AUDIOS,
      this.world?.isMuted || false,
      (audio) => SoundHelper.registerSound(audio, this.world?.allSounds || [])
    );
  }

  hitByBottle() {
    this.energy -= 20;
    if (this.energy <= 0 && !this.dead) {
      this.die();
    }
  }

  /**
   * Generates a random x-position for the small chicken, ensuring it doesn't overlap with other small chickens.
   * @returns {number} - The random x-coordinate for the small chicken.
   */
  getRandomPosition() {
    let xPosition;
    let isValid = false;

    while (!isValid) {
      xPosition = 450 + Math.random() * 1000;
      isValid = true;

      for (let smallChicken of SmallChicken.smallChickens) {
        if (Math.abs(smallChicken.x - xPosition) < this.width) {
          isValid = false;
          break;
        }
      }
    }
    return xPosition;
  }

  /**
   * Marks the small chicken as dead, updates its image, and plays the hurt sound.
   */
  die() {
    this.dead = true;
    super.die();
    this.loadImage(this.IMAGES_DEAD[0]);
    this.playHurtSound();
    this.y += 10;
  }

  /**
   * Handles the small chicken's movement and animation.
   */
  animate() {
     this.setSafeInterval(() => {
      if (!this.dead) {
        this.moveLeft();
      }
    }, 1000 / 60);

     this.setSafeInterval(() => {
      if (!this.dead) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
  }

  /**
   * Plays the sound when the small chicken is hurt.
   * Ensures that the sound is played only once every cooldown period.
   */
  playHurtSound() {
    if (this.world?.isMuted) return;
    const now = Date.now();
    if (
      now - this.lastHurtSoundTime > this.hurtSoundCooldown &&
      this.sounds?.hurt
    ) {
      this.sounds.hurt.currentTime = 0;
      this.sounds.hurt
        .play()
        .catch((e) => console.warn("SmallChicken sound blocked:", e));
      this.lastHurtSoundTime = now;
    }
  }
}