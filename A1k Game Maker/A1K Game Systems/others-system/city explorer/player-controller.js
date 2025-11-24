import { WORLD, BUILDINGS, ZONES } from './buildings-data.js';

export class PlayerController {
  constructor(worldRenderer, interior) {
    this.world = worldRenderer;
    this.interior = interior;
    this.canvas = worldRenderer.canvas;
    this.ctx = worldRenderer.ctx;

    this.x = 200;
    this.y = 420;
    this.vx = 0;
    this.speed = 280;
    this.input = { left: false, right: false, up: false, down: false, e: false };

    this.nearBuilding = null;
    this.interiorMode = false;

    this.bindInput();
  }

  bindInput() {
    window.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft') this.input.left = true;
      if (k === 'arrowright') this.input.right = true;
      if (k === 'arrowup') this.input.up = true;
      if (k === 'arrowdown') this.input.down = true;
      if (k === 'e') this.input.e = true;
    });
    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft') this.input.left = false;
      if (k === 'arrowright') this.input.right = false;
      if (k === 'arrowup') this.input.up = false;
      if (k === 'arrowdown') this.input.down = false;
      if (k === 'e') this.input.e = false;
    });
  }

  update(dt) {
    if (this.interiorMode) {
      this.interior.update(dt, this.input);
      // Exit at door
      if (this.input.e && this.interior.player.y > this.canvas.height - 70) {
        this.interior.exit();
        this.interiorMode = false;
      }
      return;
    }

    // Movement
    let ax = 0;
    if (this.input.left) ax -= 1;
    if (this.input.right) ax += 1;
    this.vx = ax * this.speed;
    this.x += this.vx * dt;

    // Clamp to world
    this.x = Math.max(0, Math.min(WORLD.width, this.x));

    // Camera follow
    this.world.setCamera(this.x - this.canvas.width * 0.5);

    // Find nearby building
    this.nearBuilding = null;
    let bestD = 1e9;
    for (const b of BUILDINGS) {
      const doorX = b.x + (b.width || 120) * 0.5;
      const d = Math.abs(this.x - doorX);
      if (d < 80 && d < bestD) { this.nearBuilding = b; bestD = d; }
    }

    // Enter building
    if (this.input.e && this.nearBuilding) {
      this.interior.enter(this.nearBuilding);
      this.interiorMode = true;
    }
  }

  draw() {
    if (this.interiorMode) {
      this.interior.draw();
      return;
    }

    // Draw world
    this.world.render();

    // Draw player
    const ctx = this.ctx;
    const px = this.x - this.world.cameraX;
    const py = 420;
    ctx.fillStyle = '#FFD56A';
    ctx.beginPath();
    ctx.arc(px, py - 20, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px - 10, py - 20 + 10, 20, 26);

    // Prompt
    if (this.nearBuilding) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(px - 80, py - 70, 160, 24);
      ctx.fillStyle = '#e5e7eb';
      ctx.font = '12px Segoe UI, system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`Press E to enter ${this.nearBuilding.name}`, px, py - 66);
    }
  }
}
