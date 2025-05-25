let canvas;
let ctx;
let world;
let backgroundMusic;
let keyboard = new Keyboard();
let startScreenImage = new Image();
startScreenImage.src = "img/9_intro_outro_screens/start/startscreen_1.png";
let isMuted = false; // Variable to track mute state

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
  document.getElementById("muteBtn").addEventListener("click", toggleMute);
}

function bindReloadButton() {
  const reloadBtn = document.getElementById("button_reload");
  if (reloadBtn) {
    reloadBtn.addEventListener("click", () => {
      location.reload();
    });
  }
}

/**
 * Draws the start screen image on the canvas and adds the "Click to Start" text.
 */
function drawStartScreen() {
  initLevel1()
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
  canvas.addEventListener("click", startGameOnce);
}

/**
 * Starts the game when the user clicks on the canvas.
 * Removes the click listener after the first click.
 */
function startGameOnce() {
  canvas.removeEventListener("click", startGameOnce); // Remove the click listener after the first click
  startGame(); // Initialize the game
}

/**
 * Initializes the game world and character.
 * This function is called after the user clicks on the start screen.
 */
function startGame() {
  world = new World(canvas, keyboard);
  world.isMuted = isMuted;
  world.backgroundMusic = new Audio("audio/guitar.mp3");
  world.backgroundMusic.loop = true;
  world.backgroundMusic.volume = 0.1;
  world.backgroundMusic.muted = isMuted;

  world.backgroundMusic.play().catch((error) => {
    console.warn("Autoplay verhindert:", error);
  });

  setupMobileControls();
  bindReloadButton();
}

/**
 * Toggles fullscreen mode for the game.
 * Called when the fullscreen button is clicked.
 */
function toggleFullscreen() {
  const fullscreenElement = document.getElementById("fullscreen");
  // Check if the document is currently in fullscreen mode
  if (!document.fullscreenElement) {
    // Enter fullscreen for different browsers
    if (fullscreenElement.requestFullscreen) {
      fullscreenElement.requestFullscreen();
    } else if (fullscreenElement.mozRequestFullScreen) {
      // Firefox
      fullscreenElement.mozRequestFullScreen();
    } else if (fullscreenElement.webkitRequestFullscreen) {
      // Chrome, Safari, Opera
      fullscreenElement.webkitRequestFullscreen();
    } else if (fullscreenElement.msRequestFullscreen) {
      // IE/Edge
      fullscreenElement.msRequestFullscreen();
    }
  } else {
    // Exit fullscreen mode if already in fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

function toggleMute() {
  isMuted = !isMuted;

  if (typeof world !== "undefined" && world) {
    if (typeof world.onMuteChange === "function") {
      world.onMuteChange(isMuted);
    }
    world.isMuted = isMuted;
    if (Array.isArray(world.allSounds)) {
      world.allSounds.forEach((audio) => {
        audio.muted = isMuted;
      });
    }
  }
  document.querySelectorAll("audio").forEach((audio) => {
    audio.muted = isMuted;
  });
  if (typeof backgroundMusic !== "undefined" && backgroundMusic) {
    backgroundMusic.muted = isMuted;
  }
  const muteBtnImg = document.querySelector("#muteBtn img");
  if (muteBtnImg) {
    muteBtnImg.src = isMuted ? "./img/sound_off.svg" : "./img/sound_on.svg";
    muteBtnImg.alt = isMuted ? "mute off" : "mute on";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const muteBtn = document.getElementById("muteBtn");
  if (muteBtn) {
    muteBtn.addEventListener("click", toggleMute);
  }
});

/**
 * Handles keydown events to track which keys are pressed.
 * This function maps key codes to keyboard actions.
 */
window.addEventListener("keydown", (e) => {
  // SPACE oder Pfeiltasten verhindern Standardverhalten (z. B. Scrollen oder Button-Trigger)
  if (
    ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
      e.code
    )
  ) {
    e.preventDefault();
  }

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

function setupMobileControls() {
  const leftButton = document.getElementById("button_left");
  const rightButton = document.getElementById("button_right");
  const jumpButton = document.getElementById("button_jump");
  const throwButton = document.getElementById("button_throw");

  // Touchstart = gedrückt halten
  leftButton.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.LEFT = true;
  });
  rightButton.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.RIGHT = true;
  });
  jumpButton.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.SPACE = true;
  });
  throwButton.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.D = true;
  });

  // Touchend = loslassen
  leftButton.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.LEFT = false;
  });
  rightButton.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.RIGHT = false;
  });
  jumpButton.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.SPACE = false;
  });
  throwButton.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.D = false;
  });
}
