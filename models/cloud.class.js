class Cloud extends MovableObject{
y = -20;
width = 450;
heigth = 500;



    constructor(){
        super().loadImage('img/5_background/layers/4_clouds/1.png')

        this.x = Math.random() * 300; // Random x position between 200 and 700  
        this.animate();    
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
          }, 1000 / 60); // Start moving the cloud to the left
    }

}
