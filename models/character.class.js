//durch extends MovableObject wird die Klasse Character von der Klasse MovableObject abgeleitet. Das bedeutet, dass die Klasse Chicken alle Eigenschaften und Methoden der Klasse MovableObject erbt und zusätzlich eigene Eigenschaften und Methoden hinzufügen kann.
class Character extends MovableObject {
  heigth = 250;
  width = 165;
  y = 180;
  speed = 10;
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];
  world;

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.x += this.speed; // Move the character to the right
        this.otherDirection = false; // Set the direction to right
      }
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.x -= this.speed; // Move the character to the left
        this.otherDirection = true; // Set the direction to left
      }
      this.world.camera_x = -this.x +100; // Update the camera position based on the character's position
    }, 1000 / 60); // 60 frames per second

    setInterval(() => {
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        // Start moving the character to the right
       this.playAnimation(this.IMAGES_WALKING); // Play the walking animation
      }
    }, 50); // 10 frames per second
  }

  jump() {}
}
