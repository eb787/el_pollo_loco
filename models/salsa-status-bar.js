class SalsaStatusBar extends DrawableObject {
  IMAGES_BOTTLE = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png",
  ];

  /**
   * Creates an instance of SalsaStatusBar.
   * Initializes the position, size, and loads the bottle status images.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLE);
    this.x = 20;
    this.y = 90;
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }

  /**
   * Sets the current percentage of collected bottles and updates the displayed image accordingly.
   * @param {number} percentage - The fill percentage (0 to 100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_BOTTLE[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }
}

