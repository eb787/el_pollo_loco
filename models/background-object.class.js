class BackgroundObject extends MovableObject {
  
  width = 720;
  heigth = 720;
    constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 -this.heigth; 
  }
}
