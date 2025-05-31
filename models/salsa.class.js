class Salsa extends MovableObject {
  y = 350;
  width = 50;
  height = 80;
  collected = false;

  IMAGES_SALSA = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  AUDIOS = {
    collect: ["audio/collect_bottle.mp3", 0.3],
  };

  offset = {
    top: 10,
    left: 10,
    right: 15,
    bottom: 10,
  };

  constructor(x) {
    super();
    this.loadImages(this.IMAGES_SALSA);
    this.loadImage(this.IMAGES_SALSA[0]);
    this.x = x;
    this.animate();
  }

  /**
   * Sets the reference to the game world and initializes the sounds for this object.
   *
   * @param {World} world - The game world instance to associate with this object.
   */
  setWorld(world) {
    this.world = world;
    this.initSounds();
  }

  /**
   * Initializes audio assets for the salsa object.
   * Takes into account the muted state of the world and registers
   * the audio instances globally in the world’s sound list.
   */
  initSounds() {
    this.sounds = SoundHelper.initSounds(
      this.AUDIOS,
      this.world?.isMuted || false,
      (audio) => SoundHelper.registerSound(audio, this.world?.allSounds || [])
    );
  }

  /**
   * Starts an animation loop cycling through salsa bottle images
   * to create a simple animation effect.
   * Changes image every 200 milliseconds.
   */
  animate() {
     this.setSafeInterval(() => {
      this.currentImage = (this.currentImage + 1) % this.IMAGES_SALSA.length;
      this.img = this.imageCache[this.IMAGES_SALSA[this.currentImage]];
    }, 200);
  }

  /**
   * Plays the collection sound when the salsa bottle is picked up.
   * Ensures the sound is only played once and respects the muted state.
   */
  playCollectSalsaSound() {
    if (this.collected || this.world?.isMuted) return;
    this.collected = true;

    const sound = this.sounds?.collect;
    if (sound) {
      sound.volume = this.AUDIOS.collect[1];
      sound.play().catch((e) => console.warn("Collect sound blocked:", e));
    } else {
      console.warn("Salsa collect sound not found!");
    }
  }
}