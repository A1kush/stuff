import { WORLD, ZONES, BUILDINGS } from './buildings-data.js';

export class MiniMap {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.w = 220;
    this.h = 80;
    this.x = canvas.width - this.w - 12;
    this.y = 12;
    this.playerX = 0;
    this.cameraX = 0;
  }

  set(playerWorldX, cameraX) {
    this.playerX = playerWorldX;
    this.cameraX = cameraX;
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.x, this.y);

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.strokeStyle = '#9A6BFF';
    ctx.strokeRect(0, 0, this.w, this.h);

    // Zones
    for (const z of ZONES) {
      const zx = (z.x / WORLD.width) * this.w;
      const zw = ((z.end - z.x) / WORLD.width) * this.w;
      ctx.fillStyle = 'rgba(154,107,255,0.15)';
      ctx.fillRect(zx, this.h - 20, zw, 20);
    }

    // Buildings
    for (const b of BUILDINGS) {
      const bx = (b.x / WORLD.width) * this.w;
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(bx - 1, this.h - 16, 2, 12);
    }

    // Player
    const px = (this.playerX / WORLD.width) * this.w;
    ctx.fillStyle = '#FFD56A';
    ctx.fillRect(px - 2, this.h - 18, 4, 16);

    // Viewport box
    const vw = (this.canvas.width / WORLD.width) * this.w;
    const vx = (this.cameraX / WORLD.width) * this.w;
    ctx.strokeStyle = '#00E5FF';
    ctx.strokeRect(vx, 2, vw, this.h - 24);

    ctx.restore();
  }
}
