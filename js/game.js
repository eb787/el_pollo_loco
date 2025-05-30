let canvas;
let ctx;
let world;
let backgroundMusic;
let keyboard = new Keyboard();
let startScreenImage = new Image();
startScreenImage.src = "img/9_intro_outro_screens/start/startscreen_1.png";
let isMuted = false;
let mobileControlsInitialized = false;
let AUDIOS = {
  guitar: ["audio/guitar.mp3", 0.1],
  win: ["audio/win.mp3", 0.5],
  lose: ["audio/fail.mp3", 0.5],
};

/**
 * Called on page load.
 * Initializes the canvas, draws the start screen, and sets up event listeners.
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
 * Draws the start screen image and a "Click to Start" prompt.
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
 * Sets up a click listener on the canvas to start the game.
 */
function setupStartListener() {
  canvas.addEventListener("click", startGameOnce);
}

/**
 * Starts the game on first click, then removes the click listener to prevent multiple starts.
 */
function startGameOnce() {
  canvas.removeEventListener("click", startGameOnce);
  startGame();
}

/**
 * Starts the game by initializing the level, game world, audio, mobile controls,
 * and reload buttons.
 */
function startGame() {
  initLevel1();
  world = new World(canvas, keyboard);
  world.isMuted = isMuted;
  setupGameAudio();
  setupMobileControls();
  bindReloadButton();
}

/**
 * Loads and configures all required game audio, including background music
 * and win/lose sounds. Assigns them to the world and plays background music.
 */
function setupGameAudio() {
  const audioInstances = {};
  for (const [key, [src, volume]] of Object.entries(AUDIOS)) {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.loop = key === "guitar"; // Only loop background music
    audio.muted = isMuted;
    audioInstances[key] = audio;
    world.allSounds ??= [];
    world.allSounds.push(audio);
  }
  // Play background music
  backgroundMusic = audioInstances.guitar;
  backgroundMusic.play().catch((error) => {
    console.warn("Autoplay prevented:", error);
  });
  world.backgroundMusic = backgroundMusic;
  // Assign win and lose sounds
  world.sounds = {
    win: audioInstances.win,
    lose: audioInstances.lose,
  };
}

/**
 * Adds event listeners to reload buttons for desktop and mobile.
 */
function bindReloadButton() {
  const buttons = ["button_reload", "button_reload_mobile"];
  buttons.forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener("click", () => location.reload());
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      location.reload();
    });
  });
}

/**
 * Toggles the mute state for all game sounds and UI elements.
 */
function toggleMute() {
  isMuted = !isMuted;
  localStorage.setItem("isMuted", isMuted ? "true" : "false");
  updateWorldSounds(isMuted);
  updateMuteIcons(isMuted);
}

window.addEventListener("DOMContentLoaded", () => {
  const savedMute = localStorage.getItem("isMuted");
  isMuted = savedMute === "true";
  updateWorldSounds(isMuted);
  updateMuteIcons(isMuted);

  const muteBtn = document.getElementById("muteBtn");
  if (muteBtn) muteBtn.addEventListener("click", toggleMute);

  const muteBtnMobile = document.getElementById("muteBtn_mobile");
  if (muteBtnMobile) muteBtnMobile.addEventListener("click", toggleMute);
});

/**
 * Updates the mute state of all sounds within the game world.
 *
 * @param {boolean} muted - Whether to mute or unmute the sounds.
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
 * Updates the mute/unmute icons for desktop and mobile mute buttons.
 *
 * @param {boolean} muted - If true, shows the muted icon; otherwise, the unmuted icon.
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
 * Handles keydown events and updates the keyboard object state accordingly.
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
 * Handles keyup events and resets the keyboard object state accordingly.
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
 * Sets up touch event listeners for mobile control buttons,
 * updating the keyboard state on touchstart and touchend.
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

function restartGame() {
  if (world) {
    world.cleanup();
    world = null;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  initLevel1();
  world = new World(canvas, keyboard);
  world.isMuted = isMuted;
  world.backgroundMusic = new Audio("audio/guitar.mp3");
  world.backgroundMusic.loop = true;
  world.backgroundMusic.volume = 0.1;
  world.backgroundMusic.muted = isMuted;
  world.backgroundMusic.play().catch((error) => {
    console.warn("Autoplay prevented:", error);
  });
  if (!world.allSounds) world.allSounds = [];
  world.allSounds.push(world.backgroundMusic);
  setupMobileControls();
}
