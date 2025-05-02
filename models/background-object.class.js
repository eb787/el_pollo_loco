class BackgroundObject extends MovableObject {
  
 
  heigth = 480;
  width = 720;
    constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 -this.heigth; 
  }
}
