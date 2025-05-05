class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();

  // constructor ist eine spezielle Methode, die aufgerufen wird, wenn ein neues Objekt der Klasse erstellt wird. In diesem Fall wird der Konstruktor verwendet, um das Canvas-Element zu initialisieren und die draw-Methode aufzurufen.
  constructor(canvas, keyboard) {
    this.keyboard = keyboard;
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
    this.setWorld();
    this.checkCollisions();
  }

  setWorld() {
    this.character.world = this; // this.character.world ist eine Eigenschaft des Charakters, die auf die Welt verweist. Sie wird verwendet, um den Charakter mit der Welt zu verbinden.
  }

  checkCollisions() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {
          this.character.hit();
        }
      });
    }, 200);
    
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear the canvas before drawing
    this.ctx.translate(this.camera_x, 0); // translate the canvas to the left by camera_x pixels
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.salsa);
    this.ctx.translate(-this.camera_x, 0); // reset the translation to the original position
    this.addToMap(this.statusBar);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.scale(-1, 1);
    mo.x = -mo.x - mo.width;
  }

  flipImageBack(mo) {
    mo.x = -mo.x - mo.width;
    this.ctx.restore();
  }
}
