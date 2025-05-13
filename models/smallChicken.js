class SmallChicken extends MovableObject {
  y = 380;
  width = 50;
  height = 55;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];
  IMAGES_DEAD = [
    "img/3_enemies_chicken/chicken_small/2_dead/dead.png"
  ];
  offset = {
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
  };
   dead = false;

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);

    this.x = 450 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.55;
    this.animate();
  }

   die() {
    this.dead = true;  
    super.die(); 
    this.loadImage(this.IMAGES_DEAD[0]);
  }

  
animate() {
  setInterval(() => {
    if (!this.dead) {
      this.moveLeft();
    }
  }, 1000 / 60);

  setInterval(() => {
    if (this.dead) {
      // Nur Standbild, kein Animationwechsel nötig
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }, 200);
}
}


 
