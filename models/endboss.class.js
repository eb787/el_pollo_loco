class Endboss extends MovableObject {
  height = 450;
  width = 280;
  y = 5;
  energy = 100;
  world;
  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];
  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];
  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];
  AUDIOS = {
    hurt: ["audio/enboss_is_hurt.mp3", 0.6],
    walking: ["audio/endboss_walking.mp3", 0.2],
  };
  offset = {
    top: 80,
    left: 10,
    right: 10,
    bottom: 10,
  };

  constructor() {
    super().loadImage("img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.x = 2400;
    this.lastHurtSoundTime = 0;
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

  /**
   * Starts the animation logic for the Endboss.
   * Controls animations and sound effects depending on the Endboss' state:
   * dead, hurt, walking towards the character, attacking, or alert.
   */
  animate() {
     this.setSafeInterval(() => {
      if (this.world?.isGameOver || !this.character) {
        this.stopWalkSound();
        return;
      }

      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurtByBottle()) {
        this.playAnimation(this.IMAGES_HURT);
        this.playHurtSound();
      } else {
        let distance = Math.abs(this.x - this.character.x);
        if (distance < 450 && distance > 100) {
          this.moveTowardsCharacter(this.character);
          this.playAnimation(this.IMAGES_WALKING);
          this.playWalkSound();
        } else if (distance <= 100) {
          this.playAnimation(this.IMAGES_ATTACK);
        } else {
          this.playAnimation(this.IMAGES_ALERT);
          this.stopWalkSound();
        }
      }
    }, 150);
  }

  /**
   * Moves the Endboss towards the character horizontally.
   *
   * @param {MovableObject} character - The target character to move towards.
   */
  moveTowardsCharacter(character) {
    if (this.x < character.x) {
      this.otherDirection = true;
      this.x += 18;
    } else {
      this.otherDirection = false;
      this.x -= 18;
    }
  }

  /**
   * Plays the hurt sound if not muted and at least 1 second
   * has passed since the last time it played.
   */
  playHurtSound() {
    if (this.world?.isMuted) return;
    const now = Date.now();
    if (now - this.lastHurtSoundTime > 1000) {
      if (this.sounds.hurt) {
        this.sounds.hurt.play().catch((e) =>
          console.warn("Endboss hurt sound blocked:", e)
        );
        this.lastHurtSoundTime = now;
      } else {
        console.warn("Endboss hurt sound not found!");
      }
    }
  }

  /**
   * Plays the walking sound loop if available,
   * pauses background music while walking sound is playing.
   */
  playWalkSound() {
    if (this.world?.isGameOver || this.world?.isMuted) return;
    const walkingSound = this.sounds?.walking;
    if (walkingSound && walkingSound.paused) {
      walkingSound.loop = true;
      walkingSound.volume = this.AUDIOS.walking[1];

      if (this.world?.backgroundMusic && !this.world.backgroundMusic.paused) {
        this.world.backgroundMusic.pause();
      }

      walkingSound.play().catch((e) =>
        console.warn("Endboss walking sound blocked:", e)
      );
    }
  }

  /**
   * Stops the walking sound and resets its playback.
   * Resumes background music if muted state allows it.
   */
  stopWalkSound() {
    if (this.sounds?.walking && !this.sounds.walking.paused) {
      this.sounds.walking.pause();
      this.sounds.walking.currentTime = 0;

      if (
        this.world?.backgroundMusic &&
        this.world.backgroundMusic.paused &&
        !this.world.isMuted
      ) {
        this.world.backgroundMusic.play().catch((e) =>
          console.warn("Background music play error:", e)
        );
      }
    }
  }

  /**
   * Handles muting behavior by stopping all Endboss sounds
   * when the game is muted.
   *
   * @param {boolean} isMuted - Indicates whether the game is muted.
   */
  onMuteChange(isMuted) {
    if (isMuted) {
      this.stopWalkSound();
    }
  }
}