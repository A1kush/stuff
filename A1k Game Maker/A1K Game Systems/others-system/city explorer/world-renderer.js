import { WORLD, ZONES, BUILDINGS } from './buildings-data.js';

export class WorldRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.cameraX = 0;
  }

  setCamera(x) {
    const maxX = Math.max(0, WORLD.width - this.canvas.width);
    this.cameraX = Math.max(0, Math.min(maxX, x));
  }

  getZoneAt(x) {
    return ZONES.find(z => x >= z.x && x < z.end) || ZONES[0];
  }

  drawBackground() {
    const ctx = this.ctx;
    ctx.fillStyle = '#0b0f17';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Zone gradient based on current camera center
    const midX = this.cameraX + this.canvas.width * 0.5;
    const zone = this.getZoneAt(midX);
    const g = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    g.addColorStop(0, this.tint(zone.color || '#1f2937', 0.5));
    g.addColorStop(1, '#0a0a12');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawZoneLabels() {
    const ctx = this.ctx;
    ctx.save();
    ctx.font = 'bold 26px Segoe UI, system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const viewStart = this.cameraX;
    const viewEnd = this.cameraX + this.canvas.width;

    for (const z of ZONES) {
      const zx = z.x - this.cameraX + 120;
      if (z.x > viewEnd || z.end < viewStart) continue;
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(zx - 160, 8, 320, 34);
      ctx.fillStyle = '#e5e7eb';
      ctx.fillText(`${z.name}`, zx, 12);
    }
    ctx.restore();
  }

  drawPlatforms() {
    const ctx = this.ctx;
    const baseY = 480;
    const viewStart = this.cameraX;
    const viewEnd = this.cameraX + this.canvas.width;

    ctx.save();
    for (const z of ZONES) {
      if (z.x > viewEnd || z.end < viewStart) continue;
      const x = Math.max(z.x, viewStart) - this.cameraX;
      const w = Math.min(z.end, viewEnd) - Math.max(z.x, viewStart);
      // Purple floating strip
      ctx.fillStyle = '#3b2e58';
      ctx.fillRect(x, baseY, w, 14);
      ctx.fillStyle = '#9A6BFF';
      ctx.fillRect(x, baseY + 12, w, 4);
    }
    ctx.restore();
  }

  drawBuildings() {
    const ctx = this.ctx;
    const viewStart = this.cameraX;
    const viewEnd = this.cameraX + this.canvas.width;

    for (const b of BUILDINGS) {
      const bx = b.x - this.cameraX;
      if (b.x + (b.width || 120) < viewStart - 80 || b.x > viewEnd + 80) continue;
      // Base
      ctx.save();
      ctx.translate(bx, b.y);
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(-10, (b.height || 70), (b.width || 120) + 20, 10);
      // Body
      ctx.fillStyle = b.color || '#64748b';
      ctx.fillRect(0, 0, b.width || 120, b.height || 70);
      // Roof
      ctx.fillStyle = b.roof || '#475569';
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo((b.width || 120) + 8, 0);
      ctx.lineTo((b.width || 120) * 0.5, -18);
      ctx.closePath();
      ctx.fill();
      // Door
      ctx.fillStyle = '#1f2937';
      const doorW = Math.max(14, (b.width || 120) * 0.18);
      ctx.fillRect((b.width || 120) * 0.5 - doorW * 0.5, (b.height || 70) - 26, doorW, 26);
      // Label
      ctx.fillStyle = '#e5e7eb';
      ctx.font = 'bold 12px Segoe UI, system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(b.name, (b.width || 120) * 0.5, -28);
      ctx.restore();
    }
  }

  render(cameraX) {
    if (typeof cameraX === 'number') this.setCamera(cameraX);
    this.drawBackground();
    this.drawPlatforms();
    this.drawBuildings();
    this.drawZoneLabels();
  }

  tint(hex, amt) {
    // Tiny hex color tint utility
    const c = hex.replace('#', '');
    const num = parseInt(c, 16);
    const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + Math.floor(amt * 255)));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + Math.floor(amt * 255)));
    const b = Math.max(0, Math.min(255, (num & 0xff) + Math.floor(amt * 255)));
    return `rgb(${r},${g},${b})`;
  }
}
