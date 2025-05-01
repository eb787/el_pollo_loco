class MovableObject {
    x = 50;
    y = 225;
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