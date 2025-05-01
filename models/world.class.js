class World {
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];
  clouds = [new Cloud()];
  canvas;
  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear the canvas before drawing

    this.ctx.drawImage(this.character.img, this.character.x, this.character.y, this.character.heigth, this.character.width);
    this.enemies.forEach((enemy) => {
      this.ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.heigth, enemy.width);
    });//durch die Schleife wird jedes Element des Arrays enemies durchlaufen und die drawImage-Methode aufgerufen, um das Bild des Gegners an der Position x und y zu zeichnen. Die Höhe und Breite des Bildes werden ebenfalls angegeben.
    
    this.clouds.forEach((cloud) => {
      this.ctx.drawImage(cloud.img, cloud.x, cloud.y, cloud.heigth, cloud.width);
    })


// draw wird so oft aufgerufen, wie es der Browser kann. requestAnimationFrame ist eine Methode, die den Browser auffordert, eine Animation zu zeichnen. Es wird empfohlen, diese Methode zu verwenden, um die Leistung zu optimieren und die Animation flüssiger zu gestalten.
    let self = this;
    requestAnimationFrame(function() {
      self.draw();
    });
  }

}
