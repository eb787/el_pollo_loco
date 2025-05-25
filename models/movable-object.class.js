class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  coins = 0;
  salsa = 0;
  lastHit = 0;
  lastHitBottle = 1000;
  hitCooldown = 300;
  offset = {
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
  };

  /**
   * Applies gravity to the object by continuously updating its vertical position.
   * @memberof MovableObject
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the object is above the ground.
   * For ThrowableObject, it is always considered "falling".
   * @returns {boolean} - Returns true if the object is above the ground.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true; // ThrowableObjects are always falling
    } else {
      return this.y < 170;
    }
  }

  /**
   * Checks if this object is colliding with another object.
   * @param {MovableObject} mo - The object to check collision against.
   * @returns {boolean} - Returns true if the objects are colliding.
   */
isColliding(mo) {
  const buffer = 5;

  const a_left = this.x + this.offset.left - buffer;
  const a_right = this.x + this.width - this.offset.right + buffer;
  const a_top = this.y + this.offset.top - buffer;
  const a_bottom = this.y + this.height - this.offset.bottom + buffer;

  const b_left = mo.x + mo.offset.left - buffer;
  const b_right = mo.x + mo.width - mo.offset.right + buffer;
  const b_top = mo.y + mo.offset.top - buffer;
  const b_bottom = mo.y + mo.height - mo.offset.bottom + buffer;

  return (
    a_right > b_left &&
    a_bottom > b_top &&
    a_left < b_right &&
    a_top < b_bottom
  );
}
  /**
   * Marks the object as dead and stops its movement.
   * @memberof MovableObject
   */
  die() {
    this.speed = 0;
    this.dead = true;
  }

  /**
   * Increments the coin count when the object collects a coin.
   * @memberof MovableObject
   */
  collectCoin() {
    this.coins += 1;
  }

  /**
   * Increments the salsa count when the object collects a salsa item.
   * @memberof MovableObject
   */
  collectSalsa() {
    this.salsa += 1;
  }

/**
 * Reduces the object's energy by 5 when it is hit,
 * but only if enough time has passed since the last hit.
 * Prevents taking damage too frequently.
 * @memberof MovableObject
 */
hit() {
  const now = new Date().getTime();
  if (now - this.lastHit > this.hitCooldown) {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    }
    this.lastHit = now;
    this.lastHitBottle = now;
  }
}


  /**
   * Reduces the object's energy by 20 when hit by the Endboss.
   * Updates the last hit timestamp.
   * @memberof MovableObject
   */
  hitEndboss() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
      this.lastHitBottle = new Date().getTime();
    }
  }

  /**
   * Checks if the object is in the "hurt" state by comparing the time passed since the last hit.
   * @returns {boolean} - Returns true if the object is currently hurt.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; 
    timepassed = timepassed / 1000; // Convert to seconds
    return timepassed < 1;
  }

  /**
   * Reduces the object's energy by 20 when hit by a bottle.
   * Marks the object as hurt and updates the last hit timestamp.
   * @memberof MovableObject
   */
  hitByBottle() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    }
    this.bossIsHurt = true;
    this.lastHitBottle = new Date().getTime();
  }

  /**
   * Checks if the object is currently "hurt" by a bottle, based on the last hit time.
   * @returns {boolean} - Returns true if the object is hurt by a bottle.
   */
  isHurtByBottle() {
    let timepassed = new Date().getTime() - this.lastHitBottle;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Plays the animation based on the provided array of images.
   * @param {string[]} images - Array of image paths for the animation.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length; 
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Checks if the object is dead (energy = 0).
   * @returns {boolean} - Returns true if the object is dead.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Moves the object to the right by its speed.
   * @memberof MovableObject
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left by its speed.
   * @memberof MovableObject
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Makes the object jump by setting its vertical speed to a positive value.
   * @memberof MovableObject
   */
  jump() {
    this.speedY = 20;
  }
}
