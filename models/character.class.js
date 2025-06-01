class Character extends MovableObject {
  width = 135;
  height = 250;
  y = 180;
  speed = 4;
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
  throwCooldown = 1000;
  lastWalkSoundTime = 0;
  walkSoundCooldown = 10;
  lastSnoreSoundTime = 0;
  snoreSoundCooldown = 6000;
  hasPlayedSurpriseSound = false;
  offset = {
    top: 100,
    left: 40,
    right: 40,
    bottom: 20,
  };

  /**
   * Creates an instance of Character.
   * Loads all animation images, sets default values, initializes audio,
   * applies gravity and starts movement and animation loops.
   */
  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.applyGravity();
    this.animate();
  }

  /**
   * Sets the reference to the game world and initializes sounds.
   *
   * @param {World} world - The game world instance to associate with this object.
   */
  setWorld(world) {
    this.world = world;
    this.initSounds();
  }

  /**
   * Starts character animation and movement loops.
   * This method initiates both the movement and animation update intervals.
   */
  animate() {
    this.startMovementLoop();
    this.startAnimationLoop();
  }

  /**
   * Initializes the sounds for this object by calling the SoundHelper,
   * respecting the muted state of the world, and registering all sounds
   * in the world's global sound list.
   * Also sets the snoreSound to the idle sound from the initialized sounds.
   */
  initSounds() {
    this.sounds = SoundHelper.initSounds(
      this.AUDIOS,
      this.world?.isMuted || false,
      (audio) => SoundHelper.registerSound(audio, this.world?.allSounds || [])
    );
    this.snoreSound = this.sounds.idle;
  }

  /**
   * Starts character movement based on keyboard input.
   * Calls smaller helper methods for specific input handling.
   */
  startMovementLoop() {
    this.setSafeInterval(() => {
      if (this.world?.isGameOver) return;
      if (this.world?.keyboard.RIGHT) this.moveRightHandler();
      if (this.world?.keyboard.LEFT) this.moveLeftHandler();
      if (this.world?.keyboard.SPACE) this.jumpHandler();
      if (this.world?.keyboard.D) this.handleDKey();
      this.checkSurpriseSound();
      this.checkIdleSound();
      this.updateCameraPosition();
    }, 1000 / 60);
  }

  /**
   * Handles the character's right movement.
   */
  moveRightHandler() {
    if (this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.lastMoveTime = Date.now();
      this.stopSnoreSound();
      if (this.isOnGround()) this.playWalkSound();
    }
  }

  /**
   * Handles the character's left movement.
   */
  moveLeftHandler() {
    if (this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      this.lastMoveTime = Date.now();
      this.stopSnoreSound();
      if (this.isOnGround()) this.playWalkSound();
    }
  }

  /**
   * Handles character jump.
   */
  jumpHandler() {
    if (!this.isAboveGround()) {
      this.jump();
      this.stopSnoreSound();
      this.lastMoveTime = Date.now();
    }
  }

  /**
   * Handles the D key press (no movement but resets idle timer).
   */
  handleDKey() {
    this.stopSnoreSound();
    this.lastMoveTime = Date.now();
  }

  /**
   * Plays surprise sound once when character reaches x >= 1900.
   */
  checkSurpriseSound() {
    if (
      !this.hasPlayedSurpriseSound &&
      this.x >= 1900 &&
      !this.world?.isMuted
    ) {
      this.sounds.suprise
        .play()
        .catch((e) => console.warn("Surprise sound blocked:", e));
      this.hasPlayedSurpriseSound = true;
    }
  }

  /**
   * Plays snore sound if idle for more than 5 seconds.
   */
  checkIdleSound() {
    this.idleDuration = Date.now() - this.lastMoveTime;
    if (this.idleDuration > 5000 && !this.world?.isMuted) {
      this.playSnoreSound();
    }
  }

  /**
   * Updates the camera position based on character's x coordinate.
   */
  updateCameraPosition() {
    this.world.camera_x = -this.x + 200;
  }

  /**
   * Starts a recurring animation loop that updates the character's visual state.
   * Plays the appropriate animation depending on state (dead, hurt, jumping, walking, or idle).
   */
  startAnimationLoop() {
    this.setSafeInterval(() => {
      if (this.isDead()) {
        this.handleDeadAnimation();
        return;
      }if (this.isHurt()) {
        this.handleHurtAnimation();
        return;
      } if (this.isAboveGround()) {
        this.handleJumpingAnimation();
      } else if (this.world?.keyboard?.RIGHT || this.world?.keyboard?.LEFT) {
        this.handleWalkingAnimation();
      } else {
        this.handleIdleAnimation();
      }
    }, 80);
  }

  /**
   * Handles the animation when the character is dead.
   */
  handleDeadAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
    this.stopSnoreSound();
  }

  /**
   * Handles the animation and sound when the character is hurt.
   */
  handleHurtAnimation() {
    this.playHurtSound();
    this.stopSnoreSound();
    this.playAnimation(this.IMAGES_HURT);
  }

  /**
   * Handles the animation when the character is jumping.
   */
  handleJumpingAnimation() {
    this.playAnimation(this.IMAGES_JUMPING);
  }

  /**
   * Handles the animation when the character is walking.
   */
  handleWalkingAnimation() {
    this.playAnimation(this.IMAGES_WALKING);
  }

  /**
   * Handles the idle animation, including long idle after a delay.
   */
  handleIdleAnimation() {
    this.idleDuration = Date.now() - this.lastMoveTime;
    if (this.idleDuration > 5000) {
      this.playAnimation(this.IMAGES_LONG_IDLE);
      this.playSnoreSound();
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  /**
   * Plays the hurt sound if not on cooldown.
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
   * Plays the walking sound if not on cooldown and not muted.
   */
  playWalkSound() {
    if (this.world?.isMuted) return;
    let now = Date.now();
    if (now - this.lastWalkSoundTime > this.walkSoundCooldown) {
      this.sounds.walking
        .play()
        .catch((e) => console.warn("Walk sound blocked:", e));
      this.lastWalkSoundTime = now;
    }
  }

  /**
   * Plays the snore sound if idle and not muted.
   */
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

  /**
   * Stops the snore sound if it's currently playing.
   */
  stopSnoreSound() {
    if (this.snoreSound && !this.snoreSound.paused) {
      this.snoreSound.pause();
      this.snoreSound.currentTime = 0;
    }
  }

  /**
   * Makes the character jump if on the ground and not in game over state.
   * Also plays the jump sound.
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
   * Checks if the character is on the ground.
   * @returns {boolean} True if the character is not in the air.
   */
  isOnGround() {
    return !this.isAboveGround();
  }
}
