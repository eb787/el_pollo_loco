class Keyboard {
  constructor() {
    this.LEFT = false;
    this.RIGHT = false;
    this.UP = false;
    this.DOWN = false;
    this.SPACE = false;
    this.D = false;

    this.keyDownHandler = this.onKeyDown.bind(this);
    this.keyUpHandler = this.onKeyUp.bind(this);

    window.addEventListener("keydown", this.keyDownHandler);
    window.addEventListener("keyup", this.keyUpHandler);
  }

  onKeyDown(e) {
    switch (e.code) {
      case 'ArrowLeft': this.LEFT = true; break;
      case 'ArrowRight': this.RIGHT = true; break;
      case 'ArrowUp': this.UP = true; break;
      case 'ArrowDown': this.DOWN = true; break;
      case 'Space': this.SPACE = true; break;
      case 'KeyD': this.D = true; break;
    }
  }

  onKeyUp(e) {
    switch (e.code) {
      case 'ArrowLeft': this.LEFT = false; break;
      case 'ArrowRight': this.RIGHT = false; break;
      case 'ArrowUp': this.UP = false; break;
      case 'ArrowDown': this.DOWN = false; break;
      case 'Space': this.SPACE = false; break;
      case 'KeyD': this.D = false; break;
    }
  }

  removeListeners() {
    window.removeEventListener("keydown", this.keyDownHandler);
    window.removeEventListener("keyup", this.keyUpHandler);
  }
}
