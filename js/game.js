let canvas;
let ctx;
let world;
let backgroundMusic;
let keyboard = new Keyboard();
let startScreenImage = new Image();
startScreenImage.src = "img/9_intro_outro_screens/start/startscreen_1.png";
let isMuted = false;
let isRestarting = false;
let bgMusic = null;
let mobileControlsInitialized = false;
let AUDIOS = {
  guitar: ["audio/guitar.mp3", 0.1],
  win: ["audio/win.mp3", 0.5],
  lose: ["audio/fail.mp3", 0.5],
};

/**
 * Initializes the canvas and draws the start screen once the DOM is ready.
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
 * Draws the game's start screen and a "Click to Start" prompt.
 */
function drawStartScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Click to Start", canvas.width / 2, canvas.height - 30);
}

/**
 * Attaches a click event listener to start the game.
 */
function setupStartListener() {
  canvas.addEventListener("click", startGameOnce);
}

/**
 * Starts the game only once per session, then removes the click listener.
 */
function startGameOnce() {
  canvas.removeEventListener("click", startGameOnce);
  startGame();
}

/**
 * Starts the game by initializing the level, the game world, and other components.
 */
function startGame() {
  if (world) {
    world.cleanup();
    world = null;
  }
  initLevel1();
  world = new World(canvas, keyboard);
  world.isMuted = isMuted;
  setupGameAudio();
  setupMobileControls();
  bindReloadButton();
}

/**
 * Binds handlers to reload buttons that return to the start screen instead of reloading the page.
 */
function bindReloadButton() {
  const buttons = ["button_reload", "button_reload_mobile"];
  buttons.forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener("click", () => returnToStartScreen());
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      returnToStartScreen();
    });
  });
}

/**
 * Cleans up the game and returns to the start screen UI.
 */
function returnToStartScreen() {
  if (world) {
    world.stopGame();
    world.cleanup?.();
    world = null;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStartScreen();
  setupStartListener(); 
}

/**
 * Configures and plays game audio including background music and SFX.
 */
function setupGameAudio() {
  const audioInstances = {};
  for (const [key, [src, volume]] of Object.entries(AUDIOS)) {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.loop = key === "guitar";
    audio.muted = isMuted;
    audioInstances[key] = audio;
    world.allSounds ??= [];
    world.allSounds.push(audio);
  }
  backgroundMusic = audioInstances.guitar;
  backgroundMusic.play().catch((error) =>
    console.warn("Autoplay prevented:", error)
  );
  world.backgroundMusic = backgroundMusic;
  world.sounds = {
    win: audioInstances.win,
    lose: audioInstances.lose,
  };
}

/**
 * Toggles the mute state and updates audio and UI accordingly.
 */
function toggleMute() {
  isMuted = !isMuted;
  localStorage.setItem("isMuted", isMuted ? "true" : "false");
  updateWorldSounds(isMuted);
  updateMuteIcons(isMuted);
}

/**
 * Called when the DOM content is loaded. Initializes mute state and buttons.
 */
window.addEventListener("DOMContentLoaded", () => {
  const savedMute = localStorage.getItem("isMuted");
  isMuted = savedMute === "true";
  updateWorldSounds(isMuted);
  updateMuteIcons(isMuted);
  const muteBtn = document.getElementById("muteBtn");
  if (muteBtn) muteBtn.addEventListener("click", toggleMute);
  const muteBtnMobile = document.getElementById("muteBtn_mobile");
  if (muteBtnMobile) muteBtnMobile.addEventListener("click", toggleMute);
  checkOrientation();
  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);
});


/**
 * Updates all sound objects with the new mute state.
 * 
 * @param {boolean} muted - Whether to mute or unmute all sounds.
 */
function updateWorldSounds(muted) {
  if (world) {
    if (typeof world.onMuteChange === "function") {
      world.onMuteChange(muted);
    }
    world.isMuted = muted;
    if (Array.isArray(world.allSounds)) {
      world.allSounds.forEach((audio) => {
        audio.muted = muted;
      });
    }
  }
  if (backgroundMusic) {
    backgroundMusic.muted = muted;
  }
}

/**
 * Updates the icon of the mute button based on the current mute state.
 * 
 * @param {boolean} muted - Whether the sound is currently muted.
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

/**
 * Handles keydown events and updates the keyboard state accordingly.
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
 * Handles keyup events and resets the keyboard state accordingly.
 */
window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
  if (e.keyCode == 68) keyboard.D = false;
});

/**
 * Sets up touch controls for mobile devices to simulate keyboard input.
 */
function setupMobileControls() {
  if (mobileControlsInitialized) return;
  mobileControlsInitialized = true;

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
    if (!button) return;

    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      keyboard[key] = true;
    });

    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      keyboard[key] = false;
    });

    button.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      keyboard[key] = false;
    });
  });
}

/**
 * Stops the current game and cleans up resources,
 * including stopping and resetting background music.
 */
function stopAndCleanupGame() {
  if (world) {
    world.stopGame();
    if (bgMusic) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }
    world = null;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Initializes the game world, background music and controls,
 * then starts the background music with a slight delay.
 * 
 * @param {HTMLCanvasElement} canvas - The canvas element for the game.
 * @param {Keyboard} keyboard - The keyboard input handler.
 * @param {boolean} isMuted - Whether the audio should be muted.
 */
function setupAndStartGame(canvas, keyboard, isMuted) {
  initLevel1();
  world = new World(canvas, keyboard);
  world.isMuted = isMuted;
  world.isStopping = false;
  world.isGameOver = false;
  if (!bgMusic) {
    bgMusic = new Audio("audio/guitar.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.1;
  }
  bgMusic.muted = isMuted;
  world.backgroundMusic = bgMusic;
  if (!world.allSounds) world.allSounds = [];
  world.allSounds.push(bgMusic);
  if (!isMuted) {
    setTimeout(() => {
      if (bgMusic.paused) {
        bgMusic.play().catch(err => console.warn("Autoplay prevented", err));
      }
    }, 100);
  }
  setupMobileControls();
}

/**
 * Main function to restart the game, ensures restart only happens once at a time.
 * It stops the current game, cleans up and then setups and starts a new game instance.
 */
function restartGame() {
  if (isRestarting) return;
  isRestarting = true;
  stopAndCleanupGame();
  setupAndStartGame(canvas, keyboard, isMuted);
  isRestarting = false;
}

/**
 * Returns true if the user is on a mobile device.
 */
function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

/**
 * Shows or hides the rotate overlay depending on orientation and device.
 */
function checkOrientation() {
  const overlay = document.getElementById('rotateOverlay');
  if (!overlay) return;

  const isPortrait = window.innerHeight > window.innerWidth;

  if (isPortrait && isMobileDevice()) {
    overlay.classList.add('show');
  } else {
    overlay.classList.remove('show');
  }
}


