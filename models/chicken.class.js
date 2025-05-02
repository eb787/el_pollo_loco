
// durch extends MovableObject wird die Klasse Chicken von der Klasse MovableObject abgeleitet. Das bedeutet, dass die Klasse Chicken alle Eigenschaften und Methoden der Klasse MovableObject abgeleitet. Das bedeutet, dass die Klasse Chicken alle Eigenschaften und Methoden der Klasse MovableObject abgeleitet. Das bedeutet, dass die Klasse Chicken alle Eigenschaften und Methoden der Klasse MovableObject abgeleitet. Das bedeutet, dass die Klasse Chicken alle Eigenschaften und Methoden der Klasse MovableObject abgeleitet. Das bedeutet, dass die Klasse Chicken alle Eigenschaften und Methoden der Klasse MovableObject abgeleitet. Das bedeutet, dass die Klasse Chicken alle Eigenschaften und Methoden der Klasse MovableObject abgeleitet. Das bedeutet, dass die Klasse Chicken alle Eigenschaften und Methoden der Klasse MovableObject abgeleitet. Das bedeutet, dass die Klasse Chicken alle Eigenschaften und Methoden der Klasse MovableObject abgeleitet. Das bedeutet, dass die Klasse Chicken alle Eigenschaften und Methoden der Klasse MovableObject abgeleitet. Das bedeutet, dass die Klasse Chicken alle Eigenschaften und Methoden der Klasse MovableObject abgeleitet. Das bedeutet, dass die Klasse Chicken alle Eigenschaften und Methoden der Klasse MovableObject abgeleitet. Das bedeutet, dass die Klasse Chicken alle Eigenschaften und Methoden der Klasse MovableObject abgeleitet. Das bedeutet, dass die Klasse Chicken alle Eigenschaften und Methoden der Klasse MovableObject abgeleitet. Das bedeutet, dass die Klasse Chicken alle Eigenschaften und Methoden der Klasse MovableObject abgeleitet. Das bedeutet, dass die Klasse Chicken alle Eigenschaften und Methoden der klasse movableobject abgeleitet.
class Chicken extends MovableObject{
     y = 335;
     heigth = 90;
     width = 100;
     IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
        
    ];


    constructor(){
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png')
        this.loadImages(this.IMAGES_WALKING);

        this.x = 350 + Math.random() * 400; // Random x position between 200 and 700
        this.speed = 0.15 + Math.random() * 0.35; // Random speed between 0.15 and 0.65
        this.animate();
    }
    

    animate() {
        this.moveLeft(); // Start moving the cloud to the left
        setInterval(() => {
          let i = this.currentImage % this.IMAGES_WALKING.length; // let i = 0 % 6 => 0, Rest 0
          let path = this.IMAGES_WALKING[i];
          this.img = this.imageCache[path];
          this.currentImage++;
        }, 200); 
      }

}