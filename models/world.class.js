class World {
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];
  clouds = [new Cloud()];
  backgroundObjects = [
    new BackgroundObject('img/5_background/layers/air.png', 0),
    new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
    new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
    new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
  ];
  canvas;
  ctx;

  // constructor ist eine spezielle Methode, die aufgerufen wird, wenn ein neues Objekt der Klasse erstellt wird. In diesem Fall wird der Konstruktor verwendet, um das Canvas-Element zu initialisieren und die draw-Methode aufzurufen.
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
  }

  draw() {
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear the canvas before drawing
    this.addObjectsToMap(this.backgroundObjects);//addObjectsToMap ist eine Methode, die ein Array von Objekten auf die Karte hinzufügt. Sie wird verwendet, um die Bilder der Hintergrundobjekte an den Positionen x und y zu zeichnen. Die Höhe und Breite der Bilder werden ebenfalls angegeben.
    this.addToMap(this.character);//addToMap ist eine Methode, die ein Objekt auf die Karte hinzufügt. Sie wird verwendet, um das Bild des Charakters an der Position x und y zu zeichnen. Die Höhe und Breite des Bildes werden ebenfalls angegeben.
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.enemies);
    


// draw wird so oft aufgerufen, wie es der Browser kann. requestAnimationFrame ist eine Methode, die den Browser auffordert, eine Animation zu zeichnen. Es wird empfohlen, diese Methode zu verwenden, um die Leistung zu optimieren und die Animation flüssiger zu gestalten.
    let self = this;
    requestAnimationFrame(function() {
      self.draw();
    });
  }

  addObjectsToMap(objects){
    objects.forEach((o) => {
      this.addToMap(o)
    });
  }

  addToMap(mo){
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.heigth, mo.width);
  }

}
