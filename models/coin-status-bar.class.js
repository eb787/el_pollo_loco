class CoinStatusBar extends DrawableObject {
    IMAGES_COIN = [
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
      ];

      constructor() {
        super();
        this.loadImages(this.IMAGES_COIN);
        this.x = 20; 
        this.y = 45;
        this.width = 200;
        this.height = 60;
        this.setPercentage(0);
      }
    
      setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_COIN[this.resolveImageIndex()];
        this.img = this.imageCache[path];
      }
      
}