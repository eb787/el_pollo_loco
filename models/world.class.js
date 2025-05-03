class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0; 
  

  // constructor ist eine spezielle Methode, die aufgerufen wird, wenn ein neues Objekt der Klasse erstellt wird. In diesem Fall wird der Konstruktor verwendet, um das Canvas-Element zu initialisieren und die draw-Methode aufzurufen.
  constructor(canvas, keyboard) {
    this.keyboard = keyboard;
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
    this.setWorld(); // setWorld ist eine Methode, die aufgerufen wird, um die Welt zu initialisieren. Sie wird verwendet, um die Hintergrundobjekte und den Charakter zu zeichnen.
  }

setWorld() {
  this.character.world = this; // this.character.world ist eine Eigenschaft des Charakters, die auf die Welt verweist. Sie wird verwendet, um den Charakter mit der Welt zu verbinden.
}


  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear the canvas before drawing
    this.ctx.translate(this.camera_x, 0); // translate the canvas to the left by camera_x pixels
    this.addObjectsToMap(this.level.backgroundObjects);//addObjectsToMap ist eine Methode, die ein Array von Objekten auf die Karte hinzufügt. Sie wird verwendet, um die Bilder der Hintergrundobjekte an den Positionen x und y zu zeichnen. Die Höhe und Breite der Bilder werden ebenfalls angegeben.
    this.addToMap(this.character);//addToMap ist eine Methode, die ein Objekt auf die Karte hinzufügt. Sie wird verwendet, um das Bild des Charakters an der Position x und y zu zeichnen. Die Höhe und Breite des Bildes werden ebenfalls angegeben.
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.ctx.translate(-this.camera_x, 0); // reset the translation to the original position
    


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
    if (mo.otherDirection) {
      this.ctx.save(); // Save the current state of the canvas
      this.ctx.scale(-1, 1); // Flip the canvas horizontally
      mo.x = -mo.x - mo.width; // Adjust the x position for the flipped image
     
    }
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.heigth);
    if (mo.otherDirection) {
      mo.x = -mo.x - mo.width; // Reset the x position to its original value
      this.ctx.restore(); // Restore the canvas to its original state
    }

  }

}
