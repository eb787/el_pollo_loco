class CoinStatusBar extends DrawableObject {
  IMAGES_COIN = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
  ];

  /**
   * Creates an instance of CoinStatusBar.
   * Loads coin status images, sets initial position and size, and initializes percentage.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_COIN);
    this.x = 20;
    this.y = 45;
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }

  /**
   * Sets the current coin collection percentage and updates the status bar image.
   * @param {number} percentage - The percentage of collected coins (0 to 100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_COIN[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }
}
