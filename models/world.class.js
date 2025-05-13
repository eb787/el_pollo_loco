class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  coinStatusBar = new CoinStatusBar();
  salsaStatusBar = new SalsaStatusBar();
  endbossStatusBar = new EndbossStatusBar();
  throwableObjects = [];

  // constructor ist eine spezielle Methode, die aufgerufen wird, wenn ein neues Objekt der Klasse erstellt wird.
  // //In diesem Fall wird der Konstruktor verwendet, um das Canvas-Element zu initialisieren und die draw-Methode aufzurufen.
  constructor(canvas, keyboard) {
    this.keyboard = keyboard;
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
    this.setWorld();
    this.run();
  }

  run() {
    setInterval(() => {
      this.checkThrowObjects();
      this.checkCollisions();
    }, 100);
  }

  setWorld() {
    this.character.world = this; // this.character.world ist eine Eigenschaft des Charakters, die auf die Welt verweist. Sie wird verwendet, um den Charakter mit der Welt zu verbinden.
  }

  checkThrowObjects() {
    if (this.keyboard.D && this.character.salsa > 0) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );
      this.throwableObjects.push(bottle);
      this.character.salsa--;
      this.salsaStatusBar.setPercentage(this.character.salsa * 20);
    }
  }

  checkCollisions() {
    this.throwableObjects.forEach((bottle, index) => {
      if (world.level.enemies[3].isColliding(bottle)) {
        world.level.enemies[3].hitByBottle();
        this.endbossStatusBar.setPercentage(world.level.enemies[3].energy);
        this.throwableObjects.splice(index, 1);
      }
    });

    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.character.collectCoin();
        this.level.coins.splice(index, 1);
        this.coinStatusBar.setPercentage(this.character.coins * 20);
      }
    });

    this.level.salsa.forEach((salsa, index) => {
      if (this.character.isColliding(salsa)) {
        this.character.collectSalsa();
        this.level.salsa.splice(index, 1);
        this.salsaStatusBar.setPercentage(this.character.salsa * 20);
      }
    });

    for (let enemy of this.level.enemies) {
      if (enemy.dead) continue;

      if (this.character.isColliding(enemy)) {
        let isChicken = enemy instanceof Chicken || enemy instanceof SmallChicken;

        if (isChicken) {
          let characterBottom = this.character.y + this.character.height;
          let enemyTop = enemy.y;
          let isFalling = this.character.speedY < 0;

          if (
            isFalling && characterBottom > enemyTop && characterBottom < enemyTop + enemy.height
          ) {
            enemy.die();
            this.character.speedY = 25;
            continue;
          }
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        }
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear the canvas before drawing
    this.ctx.translate(this.camera_x, 0); // translate the canvas to the left by camera_x pixels
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.salsa);
    this.ctx.translate(-this.camera_x, 0); // reset the translation to the original position
    this.addToMap(this.statusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.salsaStatusBar);
    this.addToMap(this.endbossStatusBar);

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
