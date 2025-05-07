class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 50;
    y = 225;
    heigth = 130;
    width = 165;
   
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.heigth);
  }

  drawFrame(ctx) { 
    if (this instanceof Character || this instanceof Chicken || this instanceof SmallChicken || this instanceof Endboss || this instanceof Coins || this instanceof Salsa) {
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.heigth);
      ctx.stroke();
     }
  }

  resolveImageIndex() {
    if (this.percentage >= 100) {
      return 5; 
    } else if (this.percentage >= 80) {
      return 4; 
    } else if (this.percentage >= 60) {
      return 3; 
    } else if (this.percentage >= 40) {
      return 2; 
    } else if (this.percentage >= 20) {
      return 1; 
    } else {
      return 0; 
    }
  }  
}