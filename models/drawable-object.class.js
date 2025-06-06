class DrawableObject {
  img;
  imageCache = {};
  intervalIds = [];
  currentImage = 0;
  x = 50;
  y = 225;
  width = 165;
  height = 130;
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * Loads a single image into this.img.
   * @param {string} path - The path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Loads multiple images and stores them in the image cache.
   * @param {string[]} arr - Array of image paths.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Sets a safe interval and keeps track of its ID for later cleanup.
   * This ensures that all intervals can be cleared easily when the game stops.
   *
   * @param {Function} fn - The function to be executed repeatedly.
   * @param {number} time - The interval time in milliseconds.
   * @returns {number} The ID of the interval.
   */
  setSafeInterval(fn, time) {
    const id = setInterval(fn, time);
    this.intervalIds.push(id);
    return id;
  }

  /**
   * Clears all intervals that were set using setSafeInterval.
   * Useful for stopping all repeating actions when the game ends.
   */
  clearAllIntervals() {
    this.intervalIds.forEach(clearInterval);
    this.intervalIds = [];
  }

  /**
   * Draws the current image of this object on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
   */
  draw(ctx) {
    try {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (e) {
      console.warn("Error drawing object:", e);
    }
  }

  /**
   * Resolves the image index based on a percentage (e.g. for status bars).
   * Requires `this.percentage` to be set externally.
   * @returns {number} The image index based on the percentage.
   */
  resolveImageIndex() {
    if (this.percentage >= 100) {
      return 5;
    } else if (this.percentage >= 80) {
      return 4;
    } else if (this.percentage >= 60) {
      return 3;
    } else if (this.percentage >= 40) {
      return 2;
    } else if (this.percentage >= 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
