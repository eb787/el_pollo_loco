class ThrowableObject extends MovableObject {
  offset = {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  };
  

  constructor(x, y) {
    super(); 
    this.loadImage("img/6_salsa_bottle/salsa_bottle.png"); 
    this.height = 60;
    this.width = 70;
    this.x = x;
    this.y = y;
    this.speedY = 20;
    this.throw();
   
  }

  throw() {
    this.speedY = 30;
    this.applyGravity();
    setInterval(() => {
      this.x += 10;
    }, 25);
   }

}

