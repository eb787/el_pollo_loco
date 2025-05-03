class Salsa extends MovableObject {
    height = 120;
    width = 120;

    IMAGES_SALSA = [
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
    ];

    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES_SALSA);
        this.x = x;
        this.y = y;
    
        const imageIndex = Math.floor(Math.random() * this.IMAGES_SALSA.length);
        this.loadImage(this.IMAGES_SALSA[imageIndex]);
    }
    
}
