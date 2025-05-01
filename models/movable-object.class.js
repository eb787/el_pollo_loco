class MovableObject {
    x = 120;
    y = 250;
    heigth = 130;
    width = 165;
    img;

    //loadImage ('img/test.png'))
loadImage(path) {
    this.img = new Image();
    this.img.src = path;
}

     moveRight(){
        console.log("Moving right");
    }

    moveLeft() {
        console.log("Moving left");
    }
}