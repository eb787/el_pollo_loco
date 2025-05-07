class ThrowableObject extends MovableObject {
    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.height = 60;
        this.width = 70;   
        this.x = x;
        this.y = y;
        this.speedY = 20;
        this.throw(); 
    }

    throw() {
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
            this.x += 10;
        }, 25); 
    }
}