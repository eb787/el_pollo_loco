/**
 * Base class for drawable game objects.
 * Handles loading and drawing of images, as well as basic hitbox representation.
 */
class DrawableObject {
  /**
   * The current image to be displayed.
   * @type {HTMLImageElement}
   */
  img;

  /**
   * A cache of preloaded images indexed by their path.
   * @type {Object.<string, HTMLImageElement>}
   */
  imageCache = {};

  /**
   * Index of the current image in an animation array.
   * @type {number}
   */
  currentImage = 0;

  /**
   * X position on the canvas.
   * @type {number}
   */
  x = 50;

  /**
   * Y position on the canvas.
   * @type {number}
   */
  y = 225;

  /**
   * Width of the object.
   * @type {number}
   */
  width = 165;

  /**
   * Height of the object.
   * @type {number}
   */
  height = 130;

  /**
   * Hitbox offset to fine-tune collision detection.
   * @type {{ top: number, left: number, right: number, bottom: number }}
   */
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
   * Draws the bounding box and offset box for debugging purposes.
   * @param {CanvasRenderingContext2D} ctx - The canvas 2D context.
   */
  drawFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof SmallChicken ||
      this instanceof Endboss ||
      this instanceof Coins ||
      this instanceof Salsa ||
      this instanceof ThrowableObject
    ) {
      // Outer frame
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();

      // Inner frame with offset
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.rect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.left - this.offset.right,
        this.height - this.offset.top - this.offset.bottom
      );
      ctx.stroke();
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
