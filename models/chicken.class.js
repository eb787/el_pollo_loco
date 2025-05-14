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
  static chickens = [];  // Statische Liste, die alle Hühner speichert

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);

    this.x = this.getRandomPosition();  // Zufällige Position holen
    this.speed = 0.15 + Math.random() * 0.35;
    Chicken.chickens.push(this);  // Das Huhn zur Liste der Hühner hinzufügen
    this.animate();
  }

  // Methode, um eine zufällige Position zu berechnen, die nicht zu nah an anderen Hühnern ist
  getRandomPosition() {
    let xPosition;
    let isValid = false;

    while (!isValid) {
      xPosition = 1100 + Math.random() * 800;  // Zufällige Position im Bereich
      isValid = true;

      // Überprüfen, ob das neue Huhn zu nah an einem anderen ist
      for (let chicken of Chicken.chickens) {
        if (Math.abs(chicken.x - xPosition) < this.width) {
          isValid = false;  // Wenn zu nah, nochmal versuchen
          break;
        }
      }
    }

    return xPosition;
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

