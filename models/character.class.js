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

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];
  world;

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.applyGravity(); // Apply gravity to the character
    this.animate();
  }

  animate() {

    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
       this.moveRight();
       this.otherDirection = false;
      }
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true; 
      }
      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      }



      this.world.camera_x = -this.x + 100; // Update the camera position based on the character's position
    }, 1000 / 60); // 60 frames per second

    setInterval(() => {
      if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {

        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING); 
        }
      }
    }, 50); // 10 frames per second
  }

  jump() {
    this.speedY = 30;
  }
}
