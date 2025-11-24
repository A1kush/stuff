import { INTERIOR_TEMPLATES } from './buildings-data.js';

export class HouseInterior {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.active = false;
    this.template = null;
    this.building = null;
    this.player = { x: 0, y: 0 };
  }

  enter(building) {
    const t = INTERIOR_TEMPLATES[building.type] || INTERIOR_TEMPLATES.house;
    this.template = t;
    this.building = building;
    this.active = true;
    this.player.x = this.canvas.width * 0.5;
    this.player.y = this.canvas.height - 100;
  }

  exit() {
    this.active = false;
    this.template = null;
    this.building = null;
  }

  update(dt, input) {
    if (!this.active) return;
    const speed = 220;
    if (input.left) this.player.x -= speed * dt;
    if (input.right) this.player.x += speed * dt;
    if (input.up) this.player.y -= speed * dt * 0.8;
    if (input.down) this.player.y += speed * dt * 0.8;

    // Clamp to room bounds
    this.player.x = Math.max(40, Math.min(this.canvas.width - 40, this.player.x));
    this.player.y = Math.max(120, Math.min(this.canvas.height - 40, this.player.y));
  }

  draw() {
    if (!this.active) return;
    const ctx = this.ctx;
    const t = this.template;

    // Background
    ctx.fillStyle = t.floor || '#111827';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // Walls
    ctx.fillStyle = t.wall || '#0b1020';
    ctx.fillRect(0, 80, this.canvas.width, 12);

    // Furnishings
    ctx.fillStyle = '#374151';
    if (t.counter) ctx.fillRect(this.canvas.width * 0.5 - 80, 180, 160, 20);
    if (t.shelves) {
      for (let i = 0; i < t.shelves; i++) ctx.fillRect(80 + i * 140, 120, 100, 10);
    }
    if (t.anvil) ctx.fillRect(120, 200, 40, 18);
    if (t.furnace) ctx.fillRect(180, 200, 34, 24);
    if (t.herbs) ctx.fillRect(220, 200, 40, 10);
    if (t.altar) ctx.fillRect(this.canvas.width * 0.5 - 30, 200, 60, 16);

    // NPC
    if (t.npc) {
      ctx.fillStyle = '#9A6BFF';
      ctx.beginPath();
      ctx.arc(this.canvas.width * 0.7, 220, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e5e7eb';
      ctx.font = '12px Segoe UI, system-ui';
      ctx.fillText('NPC', this.canvas.width * 0.7 - 12, 240);
    }

    // Chest / Booth / etc.
    if (t.chest) {
      ctx.fillStyle = '#b45309';
      ctx.fillRect(80, 220, 26, 18);
    }
    if (t.booth) {
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(this.canvas.width * 0.5 - 30, 150, 60, 80);
    }

    // Exit door (bottom center)
    ctx.fillStyle = '#111827';
    ctx.fillRect(this.canvas.width * 0.5 - 24, this.canvas.height - 40, 48, 40);

    // Player
    ctx.fillStyle = '#FFD56A';
    ctx.beginPath();
    ctx.arc(this.player.x, this.player.y - 18, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.player.x - 10, this.player.y - 18 + 10, 20, 26);

    // HUD
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(10, 10, 280, 24);
    ctx.fillStyle = '#e5e7eb';
    ctx.font = '12px Segoe UI, system-ui';
    const name = this.building?.name || 'Interior';
    ctx.fillText(`Inside: ${name}  —  Press E at door to exit`, 16, 18);
  }
}
