class MovableObject {
    x = 50;
    y = 225;
    heigth = 130;
    width = 165;
    img;
    imageCache = {};
    currentImage = 0;
    speed = 0.15; // Speed of the cloud
    otherDirection = false;

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

playAnimation(images) {
    let i = this.currentImage % this.IMAGES_WALKING.length; // let i = 0 % 6 => 0, Rest 0
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
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