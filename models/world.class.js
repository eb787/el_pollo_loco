class World {
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];
  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.draw();
  }

  draw() {
    this.ctx.drawImage(this.character.img, this.character.x, this.character.y, this.character.heigth, this.character.width);
  }

    drawEnemies() {
        this.enemies.forEach((enemy) => {
        this.ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.heigth, enemy.width);
        });
    }
}
