class DrawableObject {
  img;
  imageCache = {};
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
   * Registers a sound in the world's global sound list for global control.
   * @param {HTMLAudioElement} sound - The sound to register.
   */
registerSound(audio) {
  if (this.world?.allSounds) {
    if (!this.world.allSounds.includes(audio)) {
      this.world.allSounds.push(audio);
    }
  }
}

  /**
   * This method will be called whenever a new Audio object is created.
   * It will automatically register the sound and return it.
   * 
   * @param {string} path - The file path of the sound to create.
   * @param {number} [volume=0.2] - The volume level of the audio (default is 0.2).
   * @returns {HTMLAudioElement} The created Audio object.
   */
createAudio(src, volume = 1, loop = false) {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.loop = loop;
  this.registerSound(audio); 
  return audio;
}

 /**
 * Initializes the sounds defined in AUDIOS and registers them globally.
 */
initSounds() {
  if (this.world && this.world.isMuted) {
    this.sounds = {};  
    return;
  }
  this.sounds = {}; 
  if (this.AUDIOS) {
    for (let key in this.AUDIOS) {
      const [src, volume] = this.AUDIOS[key];
      const audio = this.createAudio(src, volume);
      audio.muted = this.world?.isMuted || false;  
      this.sounds[key] = audio;
      this.registerSound(audio);
    }
  }
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
