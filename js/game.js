/**
 * @file game.js
 * Main JavaScript file for controlling the game flow, including the start screen, game initialization, and player input.
 */
let canvas;
let ctx;
let world;
let backgroundMusic;
let keyboard = new Keyboard();
let startScreenImage = new Image();
startScreenImage.src = 'img/9_intro_outro_screens/start/startscreen_1.png';

/**
 * Initializes the game, loading the start screen and setting up the click listener.
 * Called on page load by `onload="init()"` in HTML.
 */
function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    startScreenImage.onload = () => {
        drawStartScreen(); 
        setupStartListener(); 
    };
    if (startScreenImage.complete) {
        drawStartScreen();
        setupStartListener();
    }
}

/**
 * Draws the start screen image on the canvas and adds the "Click to Start" text.
 */
function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height); // Draw the background image

    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Click to Start", canvas.width / 2, canvas.height - 30);
}

/**
 * Sets up the click event listener on the canvas to start the game once clicked.
 */
function setupStartListener() {
    canvas.addEventListener('click', startGameOnce);
}

/**
 * Starts the game when the user clicks on the canvas.
 * Removes the click listener after the first click.
 */
function startGameOnce() {
    canvas.removeEventListener('click', startGameOnce); // Remove the click listener after the first click
    startGame(); // Initialize the game
}

/**
 * Initializes the game world and character.
 * This function is called after the user clicks on the start screen.
 */
function startGame() {
    backgroundMusic = new Audio('audio/guitar.mp3'); // Pfad zur Musik
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.1;
    backgroundMusic.play().catch((error) => {
        console.warn("Autoplay prevented:", error);
    });

    world = new World(canvas, keyboard);
    console.log("My Character is", world.character);
}


/**
 * Toggles fullscreen mode for the game.
 * Called when the fullscreen button is clicked.
 */
function toggleFullscreen() {
    const fullscreenElement = document.getElementById('fullscreen');   
    // Check if the document is currently in fullscreen mode
    if (!document.fullscreenElement) {
        // Enter fullscreen for different browsers
        if (fullscreenElement.requestFullscreen) {
            fullscreenElement.requestFullscreen();
        } else if (fullscreenElement.mozRequestFullScreen) { // Firefox
            fullscreenElement.mozRequestFullScreen();
        } else if (fullscreenElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
            fullscreenElement.webkitRequestFullscreen();
        } else if (fullscreenElement.msRequestFullscreen) { // IE/Edge
            fullscreenElement.msRequestFullscreen();
        }
    } else {
        // Exit fullscreen mode if already in fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

/**
 * Handles keydown events to track which keys are pressed.
 * This function maps key codes to keyboard actions.
 */
window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 40) keyboard.DOWN = true;
    if (e.keyCode == 32) keyboard.SPACE = true;
    if (e.keyCode == 68) keyboard.D = true;
});

/**
 * Handles keyup events to reset the keys when released.
 * This function clears the key actions once the key is released.
 */
window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 40) keyboard.DOWN = false;
    if (e.keyCode == 32) keyboard.SPACE = false;
    if (e.keyCode == 68) keyboard.D = false;
});
