class Character extends MovableObject {
  width = 135;
  height = 250;
  y = 180;
  speed = 6;
  energy = 100;
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];
  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];
  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];
  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];
  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];
  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  AUDIOS = {
    walking: ["audio/charackter_walking.mp3", 0.2],
    jumping: ["audio/character_jump.mp3", 0.2],
    hurt: ["audio/hurt.mp3", 0.1],
    idle: ["audio/snore_character.mp3", 0.1],
    suprise: ["audio/surprise-sound-effect.mp3", 0.2],
  };

  lastMoveTime = Date.now();
  idleDuration = 0;
  lastThrowTime = 0;
  lastHurtSoundTime = 0;
  hurtSoundCooldown = 1000;
  throwCooldown = 700;
  lastWalkSoundTime = 0;
  walkSoundCooldown = 10;
  lastSnoreSoundTime = 0;
  snoreSoundCooldown = 6000;
  hasPlayedSurpriseSound = false;


  offset = {
    top: 100,
    left: 15,
    right: 20,
    bottom: 10,
  };

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.initSounds();
    this.snoreSound = this.sounds.idle;
    this.applyGravity();
    this.animate();
  }

  animate() {
  this.startMovementLoop();
  this.startAnimationLoop();
}

  /**
   * Starts character movement and animation intervals.
   * Handles input-based actions and animation frame switching.
   */
 startMovementLoop() {
  setInterval(() => {
    if (this.world?.isGameOver) return;

    if (this.world?.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.lastMoveTime = Date.now();
      this.stopSnoreSound();
      if (this.isOnGround()) this.playWalkSound();
    }
    if (this.world?.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      this.lastMoveTime = Date.now();
      this.stopSnoreSound();
      if (this.isOnGround()) this.playWalkSound();
    }
    if (this.world?.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.stopSnoreSound();
      this.lastMoveTime = Date.now();
    }
    if (this.world?.keyboard.D) {
      this.stopSnoreSound();
      this.lastMoveTime = Date.now();
    }
    // Surprise Sound bei x = 2000
    if (!this.hasPlayedSurpriseSound && this.x >= 1900 && !this.world?.isMuted) {
      this.sounds.suprise
        .play()
        .catch((e) => console.warn("Surprise sound blocked:", e));
      this.hasPlayedSurpriseSound = true;
    }

    this.idleDuration = Date.now() - this.lastMoveTime;
    if (this.idleDuration > 5000 && !this.world?.isMuted) {
      this.playSnoreSound();
    }

    this.world.camera_x = -this.x + 200;
  }, 1000 / 60);
}


/**
 * Starts a recurring animation loop that updates the character's visual state.
 * 
 * This loop checks the character's status every 80ms and plays the appropriate
 * animation based on its current condition:
 * 
 * - If the character is dead, it plays the death animation and stops snoring.
 * - If the character is hurt, it plays the hurt animation, sound, and stops snoring.
 * - If the character is jumping (not on the ground), it plays the jumping animation.
 * - If the character is moving left or right, it plays the walking animation.
 * - If the character is idle:
 *   - For longer than 5 seconds, it plays the long idle animation and snore sound.
 *   - Otherwise, it plays the regular idle animation.
 */
startAnimationLoop() {
  setInterval(() => {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
      this.stopSnoreSound();
      return;
    }

    if (this.isHurt()) {
      this.playHurtSound();
      this.stopSnoreSound();
      this.playAnimation(this.IMAGES_HURT);
      return;
    }

    if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else if (this.world?.keyboard.RIGHT || this.world?.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    } else {
      this.idleDuration = Date.now() - this.lastMoveTime;
      if (this.idleDuration > 5000) {
        this.playAnimation(this.IMAGES_LONG_IDLE);
        this.playSnoreSound();
      } else {
        this.playAnimation(this.IMAGES_IDLE);
      }
    }
  }, 80);
}



  /**
   * Plays the hurt sound with cooldown.
   */
  playHurtSound() {
    if (this.world?.isMuted) return;
    let now = Date.now();
    if (now - this.lastHurtSoundTime > this.hurtSoundCooldown) {
      this.sounds.hurt
        .play()
        .catch((e) => console.warn("Hurt sound blocked:", e));
      this.lastHurtSoundTime = now;
    }
  }

  /**
   * Plays the walk sound with cooldown.
   */
  playWalkSound() {
    if (this.world?.isMuted) return;
    let now = Date.now();
    if (now - this.lastWalkSoundTime > this.walkSoundCooldown) {
      this.sounds.walking
        .play()
        .catch((e) => console.warn("Walk sound blockiert:", e));
      this.lastWalkSoundTime = now;
    }
  }

  playSnoreSound() {
    if (this.world?.isGameOver || this.world?.isMuted) {
      if (!this.snoreSound.paused) {
        this.snoreSound.pause();
        this.snoreSound.currentTime = 0;
      }
      return;
    }
    if (this.snoreSound.paused) {
      this.snoreSound
        .play()
        .catch((e) => console.warn("Snore sound blocked:", e));
    }
  }

  stopSnoreSound() {
    if (this.snoreSound && !this.snoreSound.paused) {
      this.snoreSound.pause();
      this.snoreSound.currentTime = 0;
    }
  }

  /**
   * Makes the character jump and plays jump sound.
   */
  jump() {
    if (this.world?.isGameOver) return;
    if (this.isOnGround() && this.snoreSound.paused) {
      this.speedY = 25;
      const jumpSound = this.sounds.jumping;
      jumpSound.muted = this.world?.isMuted;
      jumpSound.play().catch((e) => console.warn("Jump sound blocked:", e));
    }
  }

  /**
   * Checks if the character is standing on the ground.
   * @returns {boolean}
   */
  isOnGround() {
    return !this.isAboveGround();
  }
}
