class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5; // Acceleration due to gravity
  energy = 100;
  coins = 0;
  salsa = 0;
  lastHit = 0;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) { //ThrowableObjects should be always falling
      return true;
    } else {
      return this.y < 180;
    }
  }

  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.heigth > mo.y &&
      this.x < mo.x + mo.width &&
      this.y < mo.y + mo.heigth
    );
  }

  collectCoin() {
    this.coins += 1;
  }

  collectSalsa() {
    this.salsa += 1;
  }

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; //difference between now and the last hit
    timepassed = timepassed / 1000; // difference between now and the last hit
    return timepassed < 1;
  }

  isDead() {
    return this.energy == 0;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 30;
  }

   playAnimation(images) {
    let i = this.currentImage % images.length; // let i = 0 % 6 => 0, Rest 0
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

}
