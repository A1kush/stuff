export class UISystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.info = null; // { title, lines[] }
  }

  showInfo(title, lines) {
    this.info = { title, lines };
    clearTimeout(this._t);
    this._t = setTimeout(() => (this.info = null), 3000);
  }

  drawPrompt(text, x, y) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(x - 100, y - 30, 200, 22);
    ctx.fillStyle = '#e5e7eb';
    ctx.font = '12px Segoe UI, system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y - 26);
    ctx.restore();
  }

  drawTopLeft(lines) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(10, 10, 320, 60);
    ctx.fillStyle = '#e5e7eb';
    ctx.font = '12px Segoe UI, system-ui';
    let ty = 26;
    for (const l of lines) {
      ctx.fillText(l, 20, ty);
      ty += 16;
    }
    ctx.restore();
  }

  drawInfoPanel() {
    if (!this.info) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(12, this.canvas.height - 120, 360, 108);
    ctx.strokeStyle = '#9A6BFF';
    ctx.strokeRect(12, this.canvas.height - 120, 360, 108);
    ctx.fillStyle = '#00E5FF';
    ctx.font = 'bold 14px Segoe UI, system-ui';
    ctx.fillText(this.info.title, 24, this.canvas.height - 100);
    ctx.fillStyle = '#e5e7eb';
    ctx.font = '12px Segoe UI, system-ui';
    let y = this.canvas.height - 80;
    for (const l of this.info.lines) {
      ctx.fillText(l, 24, y);
      y += 16;
    }
    ctx.restore();
  }
}
