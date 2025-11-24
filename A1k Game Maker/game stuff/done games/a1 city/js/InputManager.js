/* js/InputManager.js */

class InputManager {
  constructor() {
    this.keys = {};
    this.joystick = { x: 0, y: 0, active: false };
    this.actions = { attack: false, interact: false, run: false };

    // Keyboard and HUD listeners are registered once so both desktop + mobile share state
    this.setupKeyboard();
    this.setupVirtualJoystick();
  }

  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Space') this.actions.attack = true;
      if (e.code === 'KeyE') this.actions.interact = true;
      if (e.code === 'ShiftLeft') this.actions.run = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      if (e.code === 'Space') this.actions.attack = false;
      if (e.code === 'KeyE') this.actions.interact = false;
      if (e.code === 'ShiftLeft') this.actions.run = false;
    });
  }

  setupVirtualJoystick() {
    const root = document.getElementById('vj-root');
    const knob = document.getElementById('vj-knob');

    if (!root || !knob) return;

    window.addEventListener('A1K_HUD:joystick_move', (e) => {
      this.joystick.active = true;
      this.joystick.x = e.detail.x;
      this.joystick.y = e.detail.y;
    });

    window.addEventListener('A1K_HUD:joystick_end', () => {
      this.joystick.active = false;
      this.joystick.x = 0;
      this.joystick.y = 0;
    });

    window.addEventListener('A1K_HUD:button_click', (e) => {
      if (e.detail.button === 'attack') {
        this.actions.attack = true;
        setTimeout(() => (this.actions.attack = false), 100);
      }
    });
  }

  getMovement() {
    let x = 0;
    let y = 0;

    // Keyboard fallback mimics joystick by outputting normalized analog vectors
    if (this.keys['ArrowUp'] || this.keys['KeyW']) y -= 1;
    if (this.keys['ArrowDown'] || this.keys['KeyS']) y += 1;
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) x -= 1;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) x += 1;

    if (this.joystick.active) {
      x = this.joystick.x;
      y = this.joystick.y;
    }

    if (!this.joystick.active && (x !== 0 || y !== 0)) {
      const length = Math.sqrt(x * x + y * y);
      x /= length;
      y /= length;
    }

    return { x, y };
  }
}

window.Input = new InputManager();
