class Coins extends MovableObject {
  height = 120;
  width = 120;
  offset = {
    top: 40,
    left: 35,
    right: 35,
    bottom: 35,
  };
  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];
  AUDIOS = {
    collect: ["audio/collect-coins.mp3", 0.2],
  };
  collected = false;

  /**
   * Creates an instance of the Coin.
   * Loads the coin images, sets its position and initializes sounds.
   * @param {number} x - The x-coordinate of the coin.
   * @param {number} y - The y-coordinate of the coin.
   */
  constructor(x, y) {
    super(); // Initialize base class first
    this.loadImages(this.IMAGES_COIN);
    this.loadImage(this.IMAGES_COIN[0]);
    this.x = x;
    this.y = y; 
    this.animate();
  }

  /**
   * Handles the animation of the coin.
   * Cycles through the coin images every 200 milliseconds.
   */
  animate() {
    setInterval(() => {
      this.currentImage = (this.currentImage + 1) % this.IMAGES_COIN.length;
      this.img = this.imageCache[this.IMAGES_COIN[this.currentImage]];
    }, 200);
  }

  /**
   * Plays the sound when the coin is collected.
   * Ensures the sound is only played once.
   */
 playCollectSound() {
  if (this.world?.isMuted || this.collected) return;
  this.collected = true;
  const sound = this.sounds?.collect;
  if (sound) {
    sound.play().catch(e => console.warn("Coin sound blocked:", e));
  }
}
}
