// InputController.js - Keyboard input handling

export class InputController {
  constructor() {
    this.keys = {
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ArrowDown: false,
      KeyE: false,
      Escape: false
    };
    
    this.keyPressed = {}; // Track single press
    
    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('keydown', (e) => {
      const key = e.code;
      
      // Prevent default for game keys
      if (key.startsWith('Arrow') || key === 'KeyE' || key === 'Escape' || key === 'Space') {
        e.preventDefault();
      }
      
      if (key in this.keys) {
        // Track single press (only trigger once per key down)
        if (!this.keys[key]) {
          this.keyPressed[key] = true;
        }
        this.keys[key] = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      const key = e.code;
      
      if (key in this.keys) {
        this.keys[key] = false;
        this.keyPressed[key] = false;
      }
    });
  }

  isPressed(key) {
    return this.keys[key] || false;
  }

  wasJustPressed(key) {
    if (this.keyPressed[key]) {
      this.keyPressed[key] = false; // Consume the press
      return true;
    }
    return false;
  }

  reset() {
    Object.keys(this.keys).forEach(key => {
      this.keys[key] = false;
      this.keyPressed[key] = false;
    });
  }
}

