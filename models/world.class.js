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
  isGameOver = false;
  characterRecentlyHit = false;

  constructor(canvas, keyboard) {
    this.intervalIds = [];
    this.keyboard = keyboard;
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.setWorld();
    this.checkIfPlayerWon();
    this.checkIfPlayerLost();
    this.draw();
    this.run();
  }

  run() {
    if (!this.isGameOver) {
      setInterval(() => {
        this.checkThrowObjects();
        this.checkCollisions();
        this.checkIfPlayerWon();
      }, 70);
    }
  }

 setWorld() {
  this.character.world = this;
  this.level.enemies.forEach(enemy => {
    enemy.world = this;
    if (enemy instanceof Endboss) {
      enemy.character = this.character;
    }
  });
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
  this.handleBottleHits();
  this.handleCoinCollision();
  this.handleSalsaCollision();
  this.handleEnemyCollisions();
}

handleBottleHits() {
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
}

handleSalsaCollision() {
  this.level.salsa.forEach((salsa, index) => {
    if (this.character.isColliding(salsa)) {
      salsa.playCollectSalsaSound();
      this.character.collectSalsa();
      this.level.salsa.splice(index, 1);
      this.salsaStatusBar.setPercentage(this.character.salsa * 20);
    }
  });
}

handleCoinCollision() {
  this.level.coins.forEach((coin, index) => {
    if (this.character.isColliding(coin)) {
      coin.playCollectSound();
      this.character.collectCoin();
      this.level.coins.splice(index, 1);
      this.coinStatusBar.setPercentage(this.character.coins * 20);
    }
  });
}

handleEnemyCollisions() {
  for (let enemy of this.level.enemies) {
    if (enemy.dead) continue;
    if (this.character.isColliding(enemy)) {
      if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
        this.handleChickenCollision(enemy);
      }
      if (enemy instanceof Endboss) {
        this.handleEndbossCollision(enemy);
      }
    }
  }
}

handleChickenCollision(chicken) {
  let characterBottom = this.character.y + this.character.height;
  let chickenTop = chicken.y;
  let isFalling = this.character.speedY < 0;

  if (
    isFalling &&
    characterBottom > chickenTop &&
    characterBottom < chickenTop + chicken.height
  ) {
    chicken.die();
    this.character.speedY = 20;
  } else {
    this.character.hit();
    this.statusBar.setPercentage(this.character.energy);
  }
}

handleEndbossCollision() {
  if (!this.characterRecentlyHit) {
    this.character.hitEndboss(); 
    this.statusBar.setPercentage(this.character.energy);
    this.characterRecentlyHit = true;

    setTimeout(() => {
      this.characterRecentlyHit = false;
    }, 1000);
  }
}

  draw() {
    if (this.isGameOver) return;
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
      let endboss = this.level.enemies.find((e) => e instanceof Endboss);
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
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }

    let winImage = new Image();
    winImage.src = "img/You won, you lost/You won A.png";
    winImage.onload = () => {
      let ctx = this.ctx;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(winImage, 0, 0, canvas.width, canvas.height);
    };
    this.stopGame();
    this.showRestartButton();
  }

  showLoseScreen() {
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }

    let loseImage = new Image();
    loseImage.src = "img/You won, you lost/You lost.png";
    loseImage.onload = () => {
      let ctx = this.ctx;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(loseImage, 0, 0, canvas.width, canvas.height);
    };
    this.stopGame();
    this.showRestartButton();
  }

  stopGame() {
    this.clearAllIntervals();
    this.isGameOver = true;
  }

  showRestartButton() {
    const btn = document.getElementById("restartBtn");
    btn.style.display = "block";
    btn.onclick = () => {
      location.reload();
    };
  }
}
