class MovableObject {
    x = 50;
    y = 225;
    heigth = 130;
    width = 165;
    img;
    imageCache = {};
    currentImage = 0;
    speed = 0.15; // Speed of the cloud

    //loadImage ('img/test.png'))
loadImage(path) {
    this.img = new Image();
    this.img.src = path;
}

loadImages(arr) {
    arr.forEach((path) => {
    let  img = new Image();
    img.src = path;
    this.imageCache[path] = img;
    });
   
}


     moveRight(){
        console.log("Moving right");
    }

    moveLeft(){
        setInterval(() => {
            this.x -= this.speed; // Move the cloud to the left
        }, 1000 /60); // 60 frames per second
    }
}