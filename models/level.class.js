class Level{
    enemies;
    clouds;
    coins;
    salsa;
    backgroundObjects;
    level_end_x = 2200; // The x position where the level ends

    constructor(enemies, clouds, backgroundObjects, coins, salsa) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.salsa = salsa;
    }
}