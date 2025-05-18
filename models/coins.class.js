class Coins extends MovableObject {
  height = 120;
  width = 120;
  offset = {
    top: 40,
    left: 35,
    right: 35,
    bottom: 35,
  };
   collected = false;

  IMAGES_COIN = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  constructor(x, y) {
    super().loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COIN);
    this.x = x;
    this.y = y;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.currentImage = (this.currentImage + 1) % this.IMAGES_COIN.length;
      this.img = this.imageCache[this.IMAGES_COIN[this.currentImage]];
    }, 200);
  }
 
playCollectSound() {
  if (this.collected) return;
  this.collected = true;
  let sound = new Audio("audio/collect-coins.mp3");
  sound.volume = 0.2;
  sound.play().catch(e => console.warn("Coin sound blockiert:", e));
}
}
