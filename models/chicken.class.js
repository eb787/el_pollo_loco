class Chicken extends MovableObject {
  y = 335;
  height = 90;
  width = 100;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];
  offset = {
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
  };
   dead = false;

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);

    this.x = 850 + Math.random() * 100;
    this.speed = 0.15 + Math.random() * 0.35;
    this.animate();
  }

  die() {
    this.dead = true;  // Huhn wird als tot markiert
    super.die(); // setzt speed = 0 und dead = true
    this.loadImage(this.IMAGES_DEAD[0]); // zeigt Todesbild
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
