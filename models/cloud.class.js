class Cloud extends MovableObject {
  width = 450;
  height = 500;

  IMAGES_CLOUDS = [
    "img/5_background/layers/4_clouds/1.png",
    "img/5_background/layers/4_clouds/2.png",
  ];

  currentImageIndex = 0;

  constructor() {
    super();
    this.imageCache = {};
    this.loadImages(this.IMAGES_CLOUDS);
    this.x = 100 + Math.random() * 3200;
    this.y = -25;
    this.speed = 0.3 + Math.random() * 0.5;
    this.setRandomImage();
    this.animate();
  }

   /**
   * Randomly selects the next cloud image from the list and sets it as the current image.
   */
  setRandomImage() {
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.IMAGES_CLOUDS.length;
    let path = this.IMAGES_CLOUDS[this.currentImageIndex];
    this.img = this.imageCache[path];
  }

  /**
   * Continuously moves the cloud leftward across the screen.
   * Once the cloud exits the screen to the left, it repositions it to the right
   * and assigns a new random image.
   */
  animate() {
    setInterval(() => {
      this.moveLeft();

      if (this.x + this.width < 0) {
        this.x = 3000 + Math.random();
        this.y = -25;

        this.setRandomImage();
      }
    }, 1000 / 60);
  }
}
