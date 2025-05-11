class EndbossStatusBar extends DrawableObject {
    IMAGES_ENBOSS_HEALTH = [
       "img/7_statusbars/2_statusbar_endboss/green/green0.png",
        "img/7_statusbars/2_statusbar_endboss/green/green20.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
        "img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
        "img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
      ];
      percentage = 100;

      constructor() {
        super();
        this.loadImages(this.IMAGES_ENBOSS_HEALTH);
        this.x = 500; 
        this.y = 10;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
      }
    
      setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_ENBOSS_HEALTH[this.resolveImageIndex()];
        this.img = this.imageCache[path];
      }
   
      resolveImageIndex() {
    if (this.percentage >= 25) {
      return 5;
    } else if (this.percentage >= 20) {
      return 4;
    } else if (this.percentage >= 15) {
      return 3;
    } else if (this.percentage >= 10) {
      return 2;
    } else if (this.percentage >= 5) {
      return 1;
    } else {
      return 0;
    }
  }
}