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
  isGameOver = false; // Flag, um zu überprüfen, ob das Spiel vorbei ist.

  constructor(canvas, keyboard) {
    this.intervalIds = [];
    this.keyboard = keyboard;
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.setWorld();
    this.checkIfPlayerWon();
    this.checkIfPlayerWon();
    this.checkIfPlayerLost(); // ✅ Jetzt wird auch das Verloren-Szenario geprüft

    this.draw();
    this.run();
  }

  run() {
    if (!this.isGameOver) {
      setInterval(() => {
        this.checkThrowObjects();
        this.checkCollisions();
        this.checkIfPlayerWon();
      }, 100);
    }
  }

  setWorld() {
    this.character.world = this;
  }

  checkThrowObjects() {
    let now = Date.now();
    if (
      this.keyboard.D &&
      this.character.salsa > 0 &&
      now - this.character.lastThrowTime > this.character.throwCooldown
    ) {
      this.character.lastThrowTime = now;
      let bottleX = this.character.otherDirection
        ? this.character.x - 30
        : this.character.x + this.character.width;
      let bottleY = this.character.y + 100;
      let bottle = new ThrowableObject(
        bottleX,
        bottleY,
        this.character.otherDirection
      );
      this.throwableObjects.push(bottle);
      this.character.salsa--;
      this.salsaStatusBar.setPercentage(this.character.salsa * 20);
    }
  }

  checkCollisions() {
    this.throwableObjects.forEach((bottle) => {
      if (!bottle.broken && world.level.enemies[3].isColliding(bottle)) {
        world.level.enemies[3].hitByBottle();
        this.endbossStatusBar.setPercentage(world.level.enemies[3].energy);
        bottle.startSplash();
      }
    });
    this.throwableObjects = this.throwableObjects.filter(
      (obj) => !obj.markedForRemoval
    );

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
        let isChicken =
          enemy instanceof Chicken || enemy instanceof SmallChicken;
        if (isChicken) {
          let characterBottom = this.character.y + this.character.height;
          let enemyTop = enemy.y;
          let isFalling = this.character.speedY < 0;
          if (
            isFalling &&
            characterBottom > enemyTop &&
            characterBottom < enemyTop + enemy.height
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
    if (this.isGameOver) return; // Stoppe die Zeichnung, wenn das Spiel zu Ende ist.

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.salsa);
    this.ctx.translate(-this.camera_x, 0);
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

  setSafeInterval(fn, time) {
    let id = setInterval(fn, time);
    this.intervalIds.push(id);
    return id;
  }

  clearAllIntervals() {
    this.intervalIds.forEach(clearInterval);
    this.intervalIds = [];
  }

  checkIfPlayerWon() {
    let interval = setInterval(() => {
      let endboss = this.level.enemies.find(e => e instanceof Endboss);
      if (endboss && endboss.energy <= 0) {
        clearInterval(interval);
        this.showWinScreen();
      }
    }, 200);
    this.intervalIds.push(interval);
  }

  checkIfPlayerLost() {
  let interval = setInterval(() => {
    if (this.character.energy <= 0) {
      clearInterval(interval);
      this.showLoseScreen();
    }
  }, 200);
  this.intervalIds.push(interval);
}


  showWinScreen() {
    let winImage = new Image();
    winImage.src = "img/You won, you lost/You won A.png";
    winImage.onload = () => {
      let ctx = this.ctx;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(winImage, 0, 0, canvas.width, canvas.height);
    };
    this.stopGame(); // Pausiert das Spiel.
  }

  showLoseScreen() {
  let loseImage = new Image();
  loseImage.src = "img/You won, you lost/You lost.png";
  loseImage.onload = () => {
    let ctx = this.ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(loseImage, 0, 0, canvas.width, canvas.height);
  };
  this.stopGame();
}


  stopGame() {
    this.clearAllIntervals(); // Stoppe alle Intervalle.
    this.isGameOver = true;  // Setze das Spiel als vorbei.
  }
}
