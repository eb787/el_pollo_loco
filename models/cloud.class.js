class Cloud extends MovableObject{
y = 30;
width = 350;
heigth = 800;

    constructor(){
        super().loadImage('img/5_background/layers/4_clouds/1.png')

        this.x = Math.random() * 300; // Random x position between 200 and 700      
    }

}