class Salsa extends MovableObject {
  y = 350;
  width = 50;
  height = 80;
  IMAGES_SALSA = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];
  offset = {
    top: 10,
    left: 10,
    right: 15,
    bottom: 10,
  };
    collected = false;

  constructor(x) {
    super();
    this.loadImages(this.IMAGES_SALSA);
    this.x = x;

    const imageIndex = Math.floor(Math.random() * this.IMAGES_SALSA.length);
    this.loadImage(this.IMAGES_SALSA[imageIndex]);
  }
    playCollectSalsaSound() {
    if (this.collected) return;
    this.collected = true;
    let sound = new Audio("audio/collect_bottle.mp3");
    sound.volume = 0.5;
    sound.play().catch((e) => console.warn("Coin sound blockiert:", e));
  }
}
