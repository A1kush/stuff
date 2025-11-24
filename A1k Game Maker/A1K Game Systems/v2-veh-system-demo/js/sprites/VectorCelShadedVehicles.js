// VectorCelShadedVehicles.js - Vector Cel-Shaded style for all 17 vehicles

export class VectorCelShadedVehicles {
  constructor() {
    this.outlineWidth = 3;
  }

  // Helper for drawing with bold outline
  drawShape(ctx, drawFn, fillColor, outlineColor = '#000000') {
    ctx.save();
    
    // Draw outline
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = this.outlineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    drawFn(ctx);
    ctx.stroke();
    
    // Draw fill
    ctx.fillStyle = fillColor;
    drawFn(ctx);
    ctx.fill();
    
    ctx.restore();
  }

  // Helper for gradient fills
  createGradient(ctx, x1, y1, x2, y2, color1, color2) {
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  }

  renderBike(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const bounce = Math.sin(animTime * 0.015) * 1;
    
    ctx.save();
    ctx.translate(x, y + bounce);
    if (facingLeft) ctx.scale(-1, 1);

    // Body
    const bodyGradient = this.createGradient(ctx, 0, -10, 0, 8, '#00E5FF', '#0099CC');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.ellipse(0, 0, 20, 8, 0, 0, Math.PI * 2);
    }, bodyGradient);

    // Wheels
    const wheelAngle = (animTime * 0.01) % (Math.PI * 2);
    this.drawWheel(ctx, -14, 8, 6, wheelAngle);
    this.drawWheel(ctx, 14, 8, 6, wheelAngle);

    // Seat
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.ellipse(0, -10, 8, 4, 0, 0, Math.PI * 2);
    }, '#00AACC');

    // Handlebars
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.moveTo(-12, -12);
      c.lineTo(-12, -6);
      c.lineTo(-18, -6);
    }, '#0088AA');

    // Engine glow
    ctx.shadowColor = '#00E5FF';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#00E5FF';
    ctx.beginPath();
    ctx.arc(-18, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  renderChopper(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const bounce = Math.sin(animTime * 0.012) * 0.5;
    
    ctx.save();
    ctx.translate(x, y + bounce);
    if (facingLeft) ctx.scale(-1, 1);

    // Extended body
    const bodyGradient = this.createGradient(ctx, 0, -12, 0, 6, '#FF6B35', '#CC5529');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.moveTo(-30, 0);
      c.bezierCurveTo(-30, -6, -28, -10, -20, -10);
      c.lineTo(20, -10);
      c.bezierCurveTo(28, -10, 30, -6, 30, 0);
      c.lineTo(30, 6);
      c.lineTo(-30, 6);
      c.closePath();
    }, bodyGradient);

    // Seats (3)
    for (let i = -18; i <= 18; i += 18) {
      this.drawShape(ctx, (c) => {
        c.beginPath();
        c.ellipse(i, -12, 6, 3, 0, 0, Math.PI * 2);
      }, '#AA4422');
    }

    // Wheels
    const wheelAngle = (animTime * 0.008) % (Math.PI * 2);
    this.drawWheel(ctx, -22, 8, 8, wheelAngle);
    this.drawWheel(ctx, 22, 8, 8, wheelAngle);

    // Chrome pipes
    const chromeGradient = this.createGradient(ctx, 0, 0, 0, 8, '#EEEEEE', '#AAAAAA');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.ellipse(-8, 4, 2, 6, 0, 0, Math.PI * 2);
    }, chromeGradient);
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.ellipse(8, 4, 2, 6, 0, 0, Math.PI * 2);
    }, chromeGradient);

    ctx.restore();
  }

  renderJetpack(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const hover = Math.sin(animTime * 0.02) * 2;
    const flame = Math.sin(animTime * 0.05) * 4 + 8;
    
    ctx.save();
    ctx.translate(x, y + hover);
    if (facingLeft) ctx.scale(-1, 1);

    // Main body
    const bodyGradient = this.createGradient(ctx, -10, -20, 10, 10, '#AA88FF', '#7A55CC');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.moveTo(0, -22);
      c.bezierCurveTo(-12, -22, -14, -18, -14, -10);
      c.lineTo(-14, 10);
      c.bezierCurveTo(-14, 14, -10, 16, -8, 16);
      c.lineTo(8, 16);
      c.bezierCurveTo(10, 16, 14, 14, 14, 10);
      c.lineTo(14, -10);
      c.bezierCurveTo(14, -18, 12, -22, 0, -22);
    }, bodyGradient);

    // Flames (gradient)
    ctx.globalAlpha = 0.8;
    const flameGradient = this.createGradient(ctx, 0, 16, 0, 16 + flame, '#FF6600', '#FFAA0000');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.moveTo(-8, 16);
      c.lineTo(-5, 16 + flame);
      c.lineTo(-8, 16 + flame);
      c.closePath();
    }, flameGradient);
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.moveTo(8, 16);
      c.lineTo(5, 16 + flame);
      c.lineTo(8, 16 + flame);
      c.closePath();
    }, flameGradient);
    ctx.globalAlpha = 1;

    // Control panel
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.rect(-4, -16, 8, 4);
    }, '#00E5FF');

    ctx.restore();
  }

  renderCar(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Body with gradient
    const bodyGradient = this.createGradient(ctx, 0, -14, 0, 8, '#FFD700', '#CCAA00');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.moveTo(-26, 8);
      c.lineTo(-28, 0);
      c.lineTo(-28, -6);
      c.bezierCurveTo(-28, -10, -24, -12, -20, -12);
      c.lineTo(20, -12);
      c.bezierCurveTo(24, -12, 28, -10, 28, -6);
      c.lineTo(28, 0);
      c.lineTo(26, 8);
      c.closePath();
    }, bodyGradient);

    // Roof
    const roofGradient = this.createGradient(ctx, 0, -20, 0, -12, '#CCAA00', '#AA8800');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.moveTo(-16, -12);
      c.bezierCurveTo(-16, -18, -12, -20, -8, -20);
      c.lineTo(8, -20);
      c.bezierCurveTo(12, -20, 16, -18, 16, -12);
      c.closePath();
    }, roofGradient);

    // Windows
    ctx.globalAlpha = 0.5;
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.moveTo(-14, -12);
      c.bezierCurveTo(-14, -16, -11, -18, -8, -18);
      c.lineTo(-2, -18);
      c.lineTo(-2, -12);
      c.closePath();
    }, '#6699CC');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.moveTo(14, -12);
      c.bezierCurveTo(14, -16, 11, -18, 8, -18);
      c.lineTo(2, -18);
      c.lineTo(2, -12);
      c.closePath();
    }, '#6699CC');
    ctx.globalAlpha = 1;

    // Wheels
    const wheelAngle = (animTime * 0.01) % (Math.PI * 2);
    this.drawWheel(ctx, -20, 10, 7, wheelAngle);
    this.drawWheel(ctx, 20, 10, 7, wheelAngle);

    // Headlight glow
    ctx.shadowColor = '#FFFF88';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#FFFF88';
    ctx.beginPath();
    ctx.arc(28, -2, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  renderPersonalBike(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const bounce = Math.sin(animTime * 0.018) * 1.5;
    
    ctx.save();
    ctx.translate(x, y + bounce);
    if (facingLeft) ctx.scale(-1, 1);

    // Sleek body
    const bodyGradient = this.createGradient(ctx, -18, 0, 18, 0, '#00FF88', '#00CC6A');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.moveTo(-18, 0);
      c.bezierCurveTo(-18, -6, -12, -8, 0, -8);
      c.bezierCurveTo(12, -8, 18, -6, 18, 0);
      c.bezierCurveTo(18, 4, 14, 6, 0, 6);
      c.bezierCurveTo(-14, 6, -18, 4, -18, 0);
    }, bodyGradient);

    // Wheels
    const wheelAngle = (animTime * 0.015) % (Math.PI * 2);
    this.drawWheel(ctx, -12, 8, 5, wheelAngle);
    this.drawWheel(ctx, 12, 8, 5, wheelAngle);

    // Engine glow
    ctx.shadowColor = '#00FF88';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#00FF88';
    ctx.beginPath();
    ctx.arc(-16, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  renderPersonalChopper(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const bounce = Math.sin(animTime * 0.01) * 0.5;
    
    ctx.save();
    ctx.translate(x, y + bounce);
    if (facingLeft) ctx.scale(-1, 1);

    // Body
    const bodyGradient = this.createGradient(ctx, 0, -10, 0, 6, '#FF4444', '#CC3333');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.ellipse(0, 0, 28, 8, 0, 0, Math.PI * 2);
    }, bodyGradient);

    // Seat
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.ellipse(0, -10, 8, 4, 0, 0, Math.PI * 2);
    }, '#AA2222');

    // Wheels
    const wheelAngle = (animTime * 0.008) % (Math.PI * 2);
    this.drawWheel(ctx, -20, 8, 7, wheelAngle);
    this.drawWheel(ctx, 20, 8, 7, wheelAngle);

    ctx.restore();
  }

  renderPersonalJetpack(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const hover = Math.sin(animTime * 0.025) * 2.5;
    const flame = Math.sin(animTime * 0.06) * 5 + 10;
    
    ctx.save();
    ctx.translate(x, y + hover);
    if (facingLeft) ctx.scale(-1, 1);

    // Body
    const bodyGradient = this.createGradient(ctx, 0, -18, 0, 10, '#AA88FF', '#8866CC');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.roundRect(-10, -18, 20, 28, 4);
    }, bodyGradient);

    // Flames
    ctx.globalAlpha = 0.9;
    const flameGradient = this.createGradient(ctx, 0, 13, 0, 13 + flame, '#FF3300', '#FFCC0000');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.moveTo(-8, 13);
      c.lineTo(-6, 13 + flame);
      c.lineTo(-4, 13);
      c.closePath();
    }, flameGradient);
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.moveTo(4, 13);
      c.lineTo(6, 13 + flame);
      c.lineTo(8, 13);
      c.closePath();
    }, flameGradient);
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  renderPersonalCar(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Sporty body
    const bodyGradient = this.createGradient(ctx, 0, -12, 0, 8, '#FFAA00', '#CC8800');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.moveTo(-24, 8);
      c.lineTo(-26, -2);
      c.bezierCurveTo(-26, -8, -22, -10, -16, -10);
      c.lineTo(16, -10);
      c.bezierCurveTo(22, -10, 26, -8, 26, -2);
      c.lineTo(24, 8);
      c.closePath();
    }, bodyGradient);

    // Roof
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.ellipse(0, -12, 12, 4, 0, 0, Math.PI * 2);
    }, '#AA7700');

    // Wheels
    const wheelAngle = (animTime * 0.012) % (Math.PI * 2);
    this.drawWheel(ctx, -16, 10, 6, wheelAngle);
    this.drawWheel(ctx, 16, 10, 6, wheelAngle);

    ctx.restore();
  }

  renderHovercraft(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const hover = Math.sin(animTime * 0.015) * 3;
    
    ctx.save();
    ctx.translate(x, y + hover);
    if (facingLeft) ctx.scale(-1, 1);

    // Body
    const bodyGradient = this.createGradient(ctx, 0, -14, 0, 8, '#00FFFF', '#00CCCC');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.ellipse(0, 0, 32, 12, 0, 0, Math.PI * 2);
    }, bodyGradient);

    // Canopy
    ctx.globalAlpha = 0.5;
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.ellipse(0, -8, 16, 6, 0, Math.PI, 0, true);
    }, '#66DDDD');
    ctx.globalAlpha = 1;

    // Hover glow
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 20;
    ctx.fillStyle = 'rgba(0,255,255,0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 30, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  renderHeavyTransport(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Cargo body
    const cargoGradient = this.createGradient(ctx, 0, -22, 0, 12, '#888888', '#666666');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.roundRect(-38, -18, 76, 30, 4);
    }, cargoGradient);

    // Cabin
    const cabinGradient = this.createGradient(ctx, 0, -24, 0, -14, '#999999', '#777777');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.roundRect(24, -24, 16, 10, 2);
    }, cabinGradient);

    // Window
    ctx.globalAlpha = 0.5;
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.rect(26, -22, 12, 6);
    }, '#4488AA');
    ctx.globalAlpha = 1;

    // Wheels
    const wheelAngle = (animTime * 0.008) % (Math.PI * 2);
    for (let i = -32; i <= 32; i += 21) {
      this.drawWheel(ctx, i, 14, 8, wheelAngle);
    }

    ctx.restore();
  }

  renderBuggy(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const bounce = Math.sin(animTime * 0.02) * 2;
    
    ctx.save();
    ctx.translate(x, y + bounce);
    if (facingLeft) ctx.scale(-1, 1);

    // Roll cage
    ctx.strokeStyle = '#CCCC00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-26, 6);
    ctx.lineTo(-26, -20);
    ctx.lineTo(26, -20);
    ctx.lineTo(26, 6);
    ctx.stroke();

    // Body
    const bodyGradient = this.createGradient(ctx, 0, 0, 0, 8, '#FFFF00', '#CCCC00');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.roundRect(-22, 0, 44, 8, 4);
    }, bodyGradient);

    // Wheels
    const wheelAngle = (animTime * 0.012) % (Math.PI * 2);
    this.drawWheel(ctx, -18, 10, 9, wheelAngle);
    this.drawWheel(ctx, 18, 10, 9, wheelAngle);

    ctx.restore();
  }

  renderMechProto(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const walk = Math.sin(animTime * 0.01) * 2;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Legs
    const legGradient = this.createGradient(ctx, 0, 10, 0, 30, '#555577', '#444466');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.roundRect(-16, 10 + walk, 10, 20, 2);
    }, legGradient);
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.roundRect(6, 10 - walk, 10, 20, 2);
    }, legGradient);

    // Body
    const bodyGradient = this.createGradient(ctx, 0, -18, 0, 12, '#666688', '#555577');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.roundRect(-20, -16, 40, 28, 4);
    }, bodyGradient);

    // Cockpit
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.roundRect(-12, -12, 24, 16, 2);
    }, '#444455');

    // Head
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.roundRect(-8, -24, 16, 8, 2);
    }, '#555577');

    // Eye glow
    ctx.shadowColor = '#FF0000';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(0, -20, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  renderMechApex(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const walk = Math.sin(animTime * 0.01) * 2.5;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Legs
    const legGradient = this.createGradient(ctx, 0, 12, 0, 36, '#667799', '#556688');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.roundRect(-18, 12 + walk, 12, 24, 2);
    }, legGradient);
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.roundRect(6, 12 - walk, 12, 24, 2);
    }, legGradient);

    // Body
    const bodyGradient = this.createGradient(ctx, 0, -22, 0, 14, '#7788AA', '#667799');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.roundRect(-24, -20, 48, 34, 6);
    }, bodyGradient);

    // Shoulder cannons
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.roundRect(-28, -18, 6, 12, 2);
    }, '#556688');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.roundRect(22, -18, 6, 12, 2);
    }, '#556688');

    // Cannon glow
    ctx.shadowColor = '#FF6600';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#FF6600';
    ctx.beginPath();
    ctx.arc(-25, -12, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(25, -12, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  renderStreetSkateboard(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const tilt = Math.sin(animTime * 0.02) * 3;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt * Math.PI / 180);
    if (facingLeft) ctx.scale(-1, 1);

    // Deck
    const deckGradient = this.createGradient(ctx, 0, -3, 0, 3, '#FF88AA', '#CC6688');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.moveTo(-16, 0);
      c.bezierCurveTo(-18, 0, -18, -3, -16, -3);
      c.lineTo(16, -3);
      c.bezierCurveTo(18, -3, 18, 0, 16, 0);
      c.lineTo(16, 3);
      c.bezierCurveTo(18, 3, 18, 0, 16, 0);
      c.lineTo(-16, 0);
      c.bezierCurveTo(-18, 0, -18, 3, -16, 3);
      c.closePath();
    }, deckGradient);

    // Trucks
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.rect(-12, 4, 6, 2);
    }, '#AAAAAA');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.rect(6, 4, 6, 2);
    }, '#AAAAAA');

    // Wheels
    const wheelAngle = (animTime * 0.02) % (Math.PI * 2);
    this.drawWheel(ctx, -14, 7, 3, wheelAngle);
    this.drawWheel(ctx, -8, 7, 3, wheelAngle);
    this.drawWheel(ctx, 8, 7, 3, wheelAngle);
    this.drawWheel(ctx, 14, 7, 3, wheelAngle);

    ctx.restore();
  }

  renderTank(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Hull
    const hullGradient = this.createGradient(ctx, 0, -14, 0, 12, '#3D5A3D', '#2A4A2A');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.roundRect(-42, -12, 84, 24, 4);
    }, hullGradient);

    // Turret
    const turretGradient = this.createGradient(ctx, 0, -26, 0, -10, '#4A664A', '#3D5A3D');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.ellipse(0, -18, 24, 8, 0, 0, Math.PI * 2);
    }, turretGradient);

    // Cannon
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.roundRect(20, -21, 24, 6, 2);
    }, '#2A4A2A');

    // Tracks
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.roundRect(-44, 14, 88, 10, 5);
    }, '#1A2A1A');

    // Track wheels
    const wheelAngle = (animTime * 0.005) % (Math.PI * 2);
    for (let i = -32; i <= 32; i += 16) {
      ctx.fillStyle = '#333333';
      ctx.beginPath();
      ctx.arc(i, 18, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  renderHelicopter(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const hover = Math.sin(animTime * 0.015) * 2;
    const rotorAngle = (animTime * 0.03) % (Math.PI * 2);
    
    ctx.save();
    ctx.translate(x, y + hover);
    if (facingLeft) ctx.scale(-1, 1);

    // Body
    const bodyGradient = this.createGradient(ctx, 0, -10, 0, 8, '#44AA44', '#338833');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.ellipse(0, 0, 32, 10, 0, 0, Math.PI * 2);
    }, bodyGradient);

    // Cockpit
    ctx.globalAlpha = 0.4;
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.ellipse(12, -6, 12, 5, 0, Math.PI, 0, true);
    }, '#66CCFF');
    ctx.globalAlpha = 1;

    // Tail boom
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.ellipse(-38, 0, 8, 4, 0, 0, Math.PI * 2);
    }, '#2A772A');

    // Main rotor
    ctx.save();
    ctx.translate(0, -12);
    ctx.rotate(rotorAngle);
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = '#555555';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-32, 0);
    ctx.lineTo(32, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.lineTo(0, 32);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();

    // Landing skids
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.rect(-24, 14, 48, 2);
    }, '#555555');

    ctx.restore();
  }

  renderSpeedboat(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const bob = Math.sin(animTime * 0.02) * 1.5;
    
    ctx.save();
    ctx.translate(x, y + bob);
    if (facingLeft) ctx.scale(-1, 1);

    // Hull
    const hullGradient = this.createGradient(ctx, 0, -8, 0, 8, '#3399FF', '#2277CC');
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.moveTo(-26, 8);
      c.lineTo(-28, 2);
      c.bezierCurveTo(-28, -4, -24, -6, -18, -6);
      c.lineTo(28, -4);
      c.bezierCurveTo(32, -4, 34, 0, 34, 4);
      c.lineTo(32, 8);
      c.closePath();
    }, hullGradient);

    // Windshield
    ctx.globalAlpha = 0.4;
    this.drawShape(ctx, (c) => {
      c.beginPath();
      c.moveTo(4, -10);
      c.lineTo(18, -10);
      c.lineTo(16, -4);
      c.lineTo(6, -4);
      c.closePath();
    }, '#66CCFF');
    ctx.globalAlpha = 1;

    // Wake
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(-32, 8, 6, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  // Helper to draw wheels with vector style
  drawWheel(ctx, x, y, radius, angle) {
    ctx.save();
    ctx.translate(x, y);

    // Tire
    this.drawShape((c) => {
      c.beginPath();
      c.arc(0, 0, radius, 0, Math.PI * 2);
    }, '#222222');

    // Rim with gradient
    const rimGradient = this.createGradient(ctx, 0, -radius * 0.6, 0, radius * 0.6, '#888888', '#555555');
    ctx.fillStyle = rimGradient;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Spokes
    ctx.save();
    ctx.rotate(angle);
    ctx.strokeStyle = '#AAAAAA';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius * 0.5, 0);
      ctx.stroke();
      ctx.rotate(Math.PI / 2);
    }
    ctx.restore();

    ctx.restore();
  }

  // Main render dispatcher
  renderVehicle(ctx, vehicleId, x, y, state) {
    const renderMap = {
      bike: this.renderBike,
      chopper: this.renderChopper,
      jetpack: this.renderJetpack,
      car: this.renderCar,
      personal_bike: this.renderPersonalBike,
      personal_chopper: this.renderPersonalChopper,
      personal_jetpack: this.renderPersonalJetpack,
      personal_car: this.renderPersonalCar,
      hovercraft: this.renderHovercraft,
      heavy_transport: this.renderHeavyTransport,
      buggy: this.renderBuggy,
      mech_proto: this.renderMechProto,
      mech_apex: this.renderMechApex,
      skateboard_street: this.renderStreetSkateboard,
      tank: this.renderTank,
      helicopter: this.renderHelicopter,
      speedboat: this.renderSpeedboat
    };

    const renderFn = renderMap[vehicleId];
    if (renderFn) {
      renderFn.call(this, ctx, x, y, state);
    }
  }
}

