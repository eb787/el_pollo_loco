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

    /**
     * Creates an instance of EndbossStatusBar.
     * Initializes the position, size, and image of the status bar.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_ENBOSS_HEALTH);
        this.x = 500;
        this.y = 10;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Sets the current health percentage of the endboss and updates the displayed image accordingly.
     * @param {number} percentage - The health percentage (0 to 100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_ENBOSS_HEALTH[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
}
