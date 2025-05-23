/**
 * Represents a salsa bottle collectible item.
 * When collected, it plays a sound and changes its state.
 */
class Salsa extends MovableObject {
  y = 350;
  width = 50;
  height = 80;
  collected = false;

  IMAGES_SALSA = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Audio configuration for salsa bottle sounds.
   * Key: identifier, Value: [audio source, volume]
   */
  AUDIOS = {
    collect: ["audio/collect_bottle.mp3", 0.3],
  };

  offset = {
    top: 10,
    left: 10,
    right: 15,
    bottom: 10,
  };

  /**
   * Creates an instance of Salsa at a specific x-position.
   * Loads the salsa bottle image and registers audio.
   * @param {number} x - The x-position where the salsa bottle appears.
   */
  constructor(x) {
    super(); // Automatically loads audio via DrawableObject constructor
    this.loadImages(this.IMAGES_SALSA);
    this.x = x;
    const imageIndex = Math.floor(Math.random() * this.IMAGES_SALSA.length);
    this.loadImage(this.IMAGES_SALSA[imageIndex]);
  }

/**
 * Plays the sound when the salsa bottle is collected.
 * Only plays once to prevent repeated triggering.
 */
playCollectSalsaSound() {
  if (this.collected || this.world?.isMuted) return; 
  this.collected = true;

  const sound = this.sounds?.collect;
  if (sound) {
    sound.volume = this.AUDIOS.collect[1];
    sound.play().catch(e => console.warn("Collect sound blocked:", e));
  } else {
    console.warn("Salsa collect sound not found!");
  }
}
}
