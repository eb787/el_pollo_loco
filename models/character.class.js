//durch extends MovableObject wird die Klasse Character von der Klasse MovableObject abgeleitet. Das bedeutet, dass die Klasse Chicken alle Eigenschaften und Methoden der Klasse MovableObject erbt und zusätzlich eigene Eigenschaften und Methoden hinzufügen kann.
class Character extends MovableObject {
  heigth = 250;
  width = 165;
  y = 180;
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];
  

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
  }

  animate() {
    setInterval(() => {
      let i = this.currentImage % this.IMAGES_WALKING.length; // let i = 0 % 6 => 0, Rest 0
      let path = this.IMAGES_WALKING[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 200); // 10 frames per second
  }

  jump() {}
}
