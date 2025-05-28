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
  const buttons = ["button_reload", "button_reload_mobile"];

  buttons.forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener("click", () => {
      location.reload();
    });

    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      location.reload();
    });
  });
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
    initLevel1()
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
 * Toggles the mute status.
 * Updates world sounds, all audio elements, and mute icons accordingly.
 */
function toggleMute() {
  isMuted = !isMuted;
  updateWorldSounds(isMuted);
  updateAllAudioElements(isMuted);
  updateMuteIcons(isMuted);
}

/**
 * Updates the mute state of sounds related to the game world.
 * Calls world's mute change handler if it exists,
 * sets mute state on all sounds in the world, and on background music.
 * 
 * @param {boolean} muted - Whether sounds should be muted or unmuted.
 */
function updateWorldSounds(muted) {
  if (typeof world !== "undefined" && world) {
    if (typeof world.onMuteChange === "function") {
      world.onMuteChange(muted);
    }
    world.isMuted = muted;

    if (Array.isArray(world.allSounds)) {
      world.allSounds.forEach(audio => {
        audio.muted = muted;
      });
    }
  }

  if (typeof backgroundMusic !== "undefined" && backgroundMusic) {
    backgroundMusic.muted = muted;
  }
}

/**
 * Updates the mute state for all <audio> elements on the page.
 * 
 * @param {boolean} muted - Whether audio elements should be muted or unmuted.
 */
function updateAllAudioElements(muted) {
  document.querySelectorAll("audio").forEach(audio => {
    audio.muted = muted;
  });
}

/**
 * Updates the mute/unmute icons for both desktop and mobile mute buttons.
 * Changes the image source and alt text based on mute state.
 * 
 * @param {boolean} muted - Whether the mute icons should show muted or unmuted state.
 */
function updateMuteIcons(muted) {
  const muteBtnImg = document.querySelector("#muteBtn img");
  const muteBtnImgMobile = document.querySelector("#muteBtn_mobile img");

  const newSrc = muted ? "./img/sound_off.svg" : "./img/sound_on.svg";
  const newAlt = muted ? "mute off" : "mute on";

  if (muteBtnImg) {
    muteBtnImg.src = newSrc;
    muteBtnImg.alt = newAlt;
  }
  if (muteBtnImgMobile) {
    muteBtnImgMobile.src = newSrc;
    muteBtnImgMobile.alt = newAlt;
  }
}


window.addEventListener("DOMContentLoaded", () => {
  const muteBtn = document.getElementById("muteBtn");
  if (muteBtn) {
    muteBtn.addEventListener("click", toggleMute);
  }

  const muteBtnMobile = document.getElementById("muteBtn_mobile");
  if (muteBtnMobile) {
    muteBtnMobile.addEventListener("click", toggleMute);
  }
});


/**
 * Handles keydown events to track which keys are pressed.
 * This function maps key codes to keyboard actions.
 */
window.addEventListener("keydown", (e) => {
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
  const buttons = [
    { el: "button_left", key: "LEFT" },
    { el: "button_right", key: "RIGHT" },
    { el: "button_jump", key: "SPACE" },
    { el: "button_throw", key: "D" },
    { el: "button_left_mobile", key: "LEFT" },
    { el: "button_right_mobile", key: "RIGHT" },
    { el: "button_jump_mobile", key: "SPACE" },
    { el: "button_throw_mobile", key: "D" },
  ];

  buttons.forEach(({ el, key }) => {
    const button = document.getElementById(el);
    if (!button) return; // Falls Button nicht existiert

    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      keyboard[key] = true;
    });

    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      keyboard[key] = false;
    });

    // Optional: Für bessere UX auch touchcancel behandeln
    button.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      keyboard[key] = false;
    });
  });
}
