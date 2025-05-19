class SmallChicken extends MovableObject {
  y = 375;
  width = 50;
  height = 55;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];
  IMAGES_DEAD = [
    "img/3_enemies_chicken/chicken_small/2_dead/dead.png"
  ];
  offset = {
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
  };
  dead = false;
  static smallChickens = [];
   lastHurtSoundTime = 0;
  hurtSoundCooldown = 1000; 

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);

    this.x = this.getRandomPosition(); 
    this.speed = 0.15 + Math.random() * 0.45;
    SmallChicken.smallChickens.push(this);  
    this.animate();
  }

  getRandomPosition() {
    let xPosition;
    let isValid = false;

    while (!isValid) {
      xPosition = 450 + Math.random() * 1000; 
      isValid = true;
      for (let smallChicken of SmallChicken.smallChickens) {
        if (Math.abs(smallChicken.x - xPosition) < this.width) {
          isValid = false;  
          break;
        }
      }
    }
    return xPosition;
  }

  die() {
    this.dead = true;
    super.die();
    this.loadImage(this.IMAGES_DEAD[0]);
    this.playHurtSound();
  }

  animate() {
    setInterval(() => {
      if (!this.dead) {
        this.moveLeft();
      }
    }, 1000 / 60);

    setInterval(() => {
      if (this.dead) {
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
  }

     playHurtSound() {
    let currentTime = new Date().getTime();
    if (currentTime - this.lastHurtSoundTime > 1000) {
      let hurtSound = new Audio("audio/jump_small_chicken.mp3");
      hurtSound.volume = 0.5;
      hurtSound
        .play()
        .catch((e) => console.warn("Chicken-Sound blockiert:", e));
      this.lastHurtSoundTime = currentTime;
    }
  }
}
