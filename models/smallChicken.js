class SmallChicken extends MovableObject{
    y = 385;
    heigth = 45;
    width = 50;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
   ]

   constructor(){
       super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png')
       this.loadImages(this.IMAGES_WALKING);

       this.x = 350 + Math.random() * 300; 
       this.speed = 0.15 + Math.random() * 0.55; 
       this.animate();
   }
   

   animate() {
       this.moveLeft(); 
       setInterval(() => {
         this.playAnimation(this.IMAGES_WALKING); 
       }, 200); 
     }

}