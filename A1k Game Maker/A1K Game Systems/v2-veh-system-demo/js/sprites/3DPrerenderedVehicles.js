// 3DPrerenderedVehicles.js - 3D Pre-rendered style with simulated lighting for all 17 vehicles

export class ThreeDPrerenderedVehicles {
  constructor() {
    this.lightDirection = { x: 0.5, y: -0.8, z: 0.3 }; // Directional light
    this.ambientLight = 0.3;
  }

  // Helper to calculate shading based on normal and light direction
  calculateShading(normal, intensity = 1) {
    const dot = normal.x * this.lightDirection.x +
                normal.y * this.lightDirection.y +
                normal.z * this.lightDirection.z;
    const diffuse = Math.max(0, -dot) * intensity;
    return this.ambientLight + diffuse * (1 - this.ambientLight);
  }

  // Helper to create 3D gradient with lighting
  create3DGradient(ctx, x1, y1, x2, y2, baseColor, shading) {
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    const lightColor = this.adjustBrightness(baseColor, 1 + shading * 0.5);
    const shadowColor = this.adjustBrightness(baseColor, 0.5 + shading * 0.5);
    gradient.addColorStop(0, lightColor);
    gradient.addColorStop(0.5, baseColor);
    gradient.addColorStop(1, shadowColor);
    return gradient;
  }

  // Adjust color brightness
  adjustBrightness(color, factor) {
    const hex = color.replace('#', '');
    const r = Math.min(255, Math.floor(parseInt(hex.substr(0, 2), 16) * factor));
    const g = Math.min(255, Math.floor(parseInt(hex.substr(2, 2), 16) * factor));
    const b = Math.min(255, Math.floor(parseInt(hex.substr(4, 2), 16) * factor));
    return `rgb(${r},${g},${b})`;
  }

  // Draw with ambient occlusion
  drawWithAO(ctx, drawFn, baseColor, aoStrength = 0.3) {
    ctx.save();
    
    // Draw shadow/AO layer
    ctx.globalAlpha = aoStrength;
    ctx.fillStyle = '#000000';
    ctx.translate(2, 2);
    drawFn(ctx);
    ctx.fill();
    ctx.translate(-2, -2);
    ctx.globalAlpha = 1;
    
    // Draw main shape
    ctx.fillStyle = baseColor;
    drawFn(ctx);
    ctx.fill();
    
    ctx.restore();
  }

  // Add specular highlight
  addSpecular(ctx, x, y, size, intensity = 0.8) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${intensity})`);
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${intensity * 0.3})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Render methods for all 17 vehicles
  
  renderBike(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const bounce = Math.sin(animTime * 0.015) * 1;
    
    ctx.save();
    ctx.translate(x, y + bounce);
    if (facingLeft) ctx.scale(-1, 1);

    // Body with 3D shading
    const bodyShading = this.calculateShading({ x: 0, y: -1, z: 0 });
    const bodyGradient = this.create3DGradient(ctx, 0, -10, 0, 8, '#00AACC', bodyShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.ellipse(0, 0, 20, 8, 0, 0, Math.PI * 2);
    }, bodyGradient);

    // Metallic specular on body
    this.addSpecular(ctx, -5, -6, 8, 0.6);

    // Wheels with rim lighting
    const wheelAngle = (animTime * 0.01) % (Math.PI * 2);
    this.draw3DWheel(ctx, -14, 8, 6, wheelAngle);
    this.draw3DWheel(ctx, 14, 8, 6, wheelAngle);

    // Engine glow with volumetric effect
    ctx.shadowColor = '#00E5FF';
    ctx.shadowBlur = 20;
    const engineGradient = ctx.createRadialGradient(-20, 0, 0, -20, 0, 10);
    engineGradient.addColorStop(0, '#00FFFF');
    engineGradient.addColorStop(0.5, '#00E5FF');
    engineGradient.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.fillStyle = engineGradient;
    ctx.beginPath();
    ctx.arc(-20, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Seat with lighting
    const seatGradient = this.create3DGradient(ctx, 0, -12, 0, -8, '#0099BB', bodyShading);
    ctx.fillStyle = seatGradient;
    ctx.fillRect(-8, -12, 16, 4);

    ctx.restore();
  }

  renderChopper(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const bounce = Math.sin(animTime * 0.012) * 0.5;
    
    ctx.save();
    ctx.translate(x, y + bounce);
    if (facingLeft) ctx.scale(-1, 1);

    // Extended body with metallic shading
    const bodyShading = this.calculateShading({ x: 0, y: -1, z: 0 }, 1.2);
    const bodyGradient = this.create3DGradient(ctx, 0, -12, 0, 6, '#CC5529', bodyShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.roundRect(-30, -10, 60, 16, 4);
    }, bodyGradient, 0.4);

    // Chrome pipe speculars
    for (let i = -10; i <= 10; i += 10) {
      const pipeGradient = this.create3DGradient(ctx, i - 2, 0, i + 2, 8, '#DDDDDD', 1);
      ctx.fillStyle = pipeGradient;
      ctx.fillRect(i - 1.5, 0, 3, 10);
      this.addSpecular(ctx, i, 2, 4, 1);
    }

    // Seats with depth
    for (let i = -18; i <= 18; i += 18) {
      const seatGradient = this.create3DGradient(ctx, i, -14, i, -10, '#AA4422', bodyShading);
      ctx.fillStyle = seatGradient;
      ctx.fillRect(i - 6, -14, 12, 4);
    }

    // Wheels
    const wheelAngle = (animTime * 0.008) % (Math.PI * 2);
    this.draw3DWheel(ctx, -22, 8, 8, wheelAngle);
    this.draw3DWheel(ctx, 22, 8, 8, wheelAngle);

    // Top highlight
    this.addSpecular(ctx, 0, -10, 20, 0.4);

    ctx.restore();
  }

  renderJetpack(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const hover = Math.sin(animTime * 0.02) * 2;
    const flame = Math.sin(animTime * 0.05) * 4 + 8;
    
    ctx.save();
    ctx.translate(x, y + hover);
    if (facingLeft) ctx.scale(-1, 1);

    // Main body with metallic shading
    const bodyShading = this.calculateShading({ x: 0, y: -1, z: 0.2 }, 1);
    const bodyGradient = this.create3DGradient(ctx, -10, -20, 10, 10, '#7A55CC', bodyShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.roundRect(-12, -20, 24, 32, 4);
    }, bodyGradient, 0.5);

    // Specular highlights
    this.addSpecular(ctx, -4, -16, 8, 0.5);
    this.addSpecular(ctx, 4, -8, 6, 0.4);

    // Volumetric flame jets
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 2; i++) {
      const flameX = i === 0 ? -8 : 6;
      const flameGradient = ctx.createLinearGradient(flameX, 16, flameX, 16 + flame);
      flameGradient.addColorStop(0, 'rgba(255, 200, 100, 1)');
      flameGradient.addColorStop(0.3, 'rgba(255, 100, 0, 0.9)');
      flameGradient.addColorStop(0.7, 'rgba(255, 50, 0, 0.6)');
      flameGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      
      ctx.fillStyle = flameGradient;
      ctx.beginPath();
      ctx.ellipse(flameX, 16 + flame / 2, 3, flame / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    // Thruster nozzles with inner glow
    ctx.fillStyle = '#333333';
    ctx.fillRect(-10, 10, 6, 6);
    ctx.fillRect(4, 10, 6, 6);
    
    ctx.shadowColor = '#FF6600';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#FF6600';
    ctx.fillRect(-8, 12, 2, 2);
    ctx.fillRect(6, 12, 2, 2);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  renderCar(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Body with automotive paint shading
    const bodyShading = this.calculateShading({ x: 0, y: -1, z: 0 }, 1.3);
    const bodyGradient = this.create3DGradient(ctx, 0, -14, 0, 8, '#CCAA00', bodyShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.roundRect(-28, -12, 56, 20, 6);
    }, bodyGradient, 0.4);

    // Roof
    const roofGradient = this.create3DGradient(ctx, 0, -18, 0, -14, '#AA8800', bodyShading);
    ctx.fillStyle = roofGradient;
    ctx.fillRect(-16, -18, 32, 6);
    
    // Roof specular
    this.addSpecular(ctx, 0, -16, 16, 0.3);

    // Windows with reflection
    ctx.globalAlpha = 0.7;
    const windowGradient = this.create3DGradient(ctx, 0, -16, 0, -12, '#6699CC', 0.5);
    ctx.fillStyle = windowGradient;
    ctx.fillRect(-14, -16, 12, 4);
    ctx.fillRect(2, -16, 12, 4);
    ctx.globalAlpha = 1;

    // Headlight with light beam
    ctx.shadowColor = '#FFFF88';
    ctx.shadowBlur = 25;
    const headlightGradient = ctx.createRadialGradient(26, -4, 0, 26, -4, 30);
    headlightGradient.addColorStop(0, 'rgba(255, 255, 200, 0.9)');
    headlightGradient.addColorStop(0.3, 'rgba(255, 255, 150, 0.4)');
    headlightGradient.addColorStop(1, 'rgba(255, 255, 100, 0)');
    ctx.fillStyle = headlightGradient;
    ctx.fillRect(26, -10, 30, 12);
    ctx.shadowBlur = 0;

    // Wheels
    const wheelAngle = (animTime * 0.01) % (Math.PI * 2);
    this.draw3DWheel(ctx, -20, 10, 7, wheelAngle);
    this.draw3DWheel(ctx, 20, 10, 7, wheelAngle);

    // Body highlight
    this.addSpecular(ctx, -10, -10, 15, 0.4);

    ctx.restore();
  }

  renderPersonalBike(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const bounce = Math.sin(animTime * 0.018) * 1.5;
    
    ctx.save();
    ctx.translate(x, y + bounce);
    if (facingLeft) ctx.scale(-1, 1);

    // Sleek body
    const bodyShading = this.calculateShading({ x: 0, y: -1, z: 0 }, 1.2);
    const bodyGradient = this.create3DGradient(ctx, 0, -8, 0, 6, '#00CC6A', bodyShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.ellipse(0, 0, 18, 7, 0, 0, Math.PI * 2);
    }, bodyGradient);

    this.addSpecular(ctx, -6, -5, 10, 0.6);

    // Wheels
    const wheelAngle = (animTime * 0.015) % (Math.PI * 2);
    this.draw3DWheel(ctx, -12, 6, 5, wheelAngle);
    this.draw3DWheel(ctx, 12, 6, 5, wheelAngle);

    // Engine glow
    ctx.shadowColor = '#00FF88';
    ctx.shadowBlur = 18;
    const engineGradient = ctx.createRadialGradient(-18, 0, 0, -18, 0, 12);
    engineGradient.addColorStop(0, '#00FF88');
    engineGradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
    ctx.fillStyle = engineGradient;
    ctx.beginPath();
    ctx.arc(-18, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  renderPersonalChopper(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const bounce = Math.sin(animTime * 0.01) * 0.5;
    
    ctx.save();
    ctx.translate(x, y + bounce);
    if (facingLeft) ctx.scale(-1, 1);

    const bodyShading = this.calculateShading({ x: 0, y: -1, z: 0 }, 1.1);
    const bodyGradient = this.create3DGradient(ctx, 0, -10, 0, 6, '#CC3333', bodyShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.ellipse(0, 0, 28, 8, 0, 0, Math.PI * 2);
    }, bodyGradient);

    this.addSpecular(ctx, -8, -6, 12, 0.5);

    const wheelAngle = (animTime * 0.008) % (Math.PI * 2);
    this.draw3DWheel(ctx, -20, 8, 7, wheelAngle);
    this.draw3DWheel(ctx, 20, 8, 7, wheelAngle);

    ctx.restore();
  }

  renderPersonalJetpack(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const hover = Math.sin(animTime * 0.025) * 2.5;
    const flame = Math.sin(animTime * 0.06) * 5 + 10;
    
    ctx.save();
    ctx.translate(x, y + hover);
    if (facingLeft) ctx.scale(-1, 1);

    const bodyShading = this.calculateShading({ x: 0, y: -1, z: 0 }, 1);
    const bodyGradient = this.create3DGradient(ctx, 0, -18, 0, 10, '#8866CC', bodyShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.roundRect(-10, -18, 20, 28, 4);
    }, bodyGradient, 0.5);

    this.addSpecular(ctx, -2, -14, 8, 0.5);

    // Enhanced volumetric flames
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 2; i++) {
      const flameX = i === 0 ? -6 : 5;
      const flameGradient = ctx.createLinearGradient(flameX, 13, flameX, 13 + flame);
      flameGradient.addColorStop(0, 'rgba(255, 150, 50, 1)');
      flameGradient.addColorStop(0.4, 'rgba(255, 80, 0, 0.8)');
      flameGradient.addColorStop(1, 'rgba(200, 0, 0, 0)');
      ctx.fillStyle = flameGradient;
      ctx.beginPath();
      ctx.ellipse(flameX, 13 + flame / 2, 2.5, flame / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    ctx.restore();
  }

  renderPersonalCar(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    const bodyShading = this.calculateShading({ x: 0, y: -1, z: 0 }, 1.2);
    const bodyGradient = this.create3DGradient(ctx, 0, -12, 0, 8, '#CC8800', bodyShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.roundRect(-24, -10, 48, 18, 5);
    }, bodyGradient);

    this.addSpecular(ctx, -8, -10, 14, 0.4);

    const wheelAngle = (animTime * 0.012) % (Math.PI * 2);
    this.draw3DWheel(ctx, -16, 10, 6, wheelAngle);
    this.draw3DWheel(ctx, 16, 10, 6, wheelAngle);

    // Headlight glow
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 20;
    const headlightGradient = ctx.createRadialGradient(22, -4, 0, 22, -4, 25);
    headlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    headlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = headlightGradient;
    ctx.fillRect(22, -10, 25, 12);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  renderHovercraft(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const hover = Math.sin(animTime * 0.015) * 3;
    
    ctx.save();
    ctx.translate(x, y + hover);
    if (facingLeft) ctx.scale(-1, 1);

    const bodyShading = this.calculateShading({ x: 0, y: -1, z: 0 }, 1.1);
    const bodyGradient = this.create3DGradient(ctx, 0, -14, 0, 8, '#00CCCC', bodyShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.ellipse(0, 0, 32, 12, 0, 0, Math.PI * 2);
    }, bodyGradient, 0.3);

    this.addSpecular(ctx, -10, -8, 15, 0.5);

    // Hover glow with volumetric effect
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 30;
    const hoverGradient = ctx.createRadialGradient(0, 14, 0, 0, 14, 35);
    hoverGradient.addColorStop(0, 'rgba(0, 255, 255, 0.8)');
    hoverGradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.4)');
    hoverGradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
    ctx.fillStyle = hoverGradient;
    ctx.beginPath();
    ctx.ellipse(0, 14, 35, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  renderHeavyTransport(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    const bodyShading = this.calculateShading({ x: 0, y: -1, z: 0 }, 0.9);
    const bodyGradient = this.create3DGradient(ctx, 0, -22, 0, 12, '#666666', bodyShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.roundRect(-44, -20, 88, 32, 6);
    }, bodyGradient, 0.5);

    // Cabin
    const cabinGradient = this.create3DGradient(ctx, 0, -24, 0, -14, '#777777', bodyShading);
    ctx.fillStyle = cabinGradient;
    ctx.fillRect(24, -24, 18, 10);

    const wheelAngle = (animTime * 0.008) % (Math.PI * 2);
    for (let i = -32; i <= 32; i += 21) {
      this.draw3DWheel(ctx, i, 14, 8, wheelAngle);
    }

    ctx.restore();
  }

  renderBuggy(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const bounce = Math.sin(animTime * 0.02) * 2;
    
    ctx.save();
    ctx.translate(x, y + bounce);
    if (facingLeft) ctx.scale(-1, 1);

    // Roll cage with metallic shading
    const cageGradient = this.create3DGradient(ctx, -2, -20, 2, 6, '#CCCC00', 1.1);
    ctx.strokeStyle = cageGradient;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-26, -20, 52, 26, 4);
    ctx.stroke();

    // Body
    const bodyShading = this.calculateShading({ x: 0, y: -1, z: 0 }, 1);
    const bodyGradient = this.create3DGradient(ctx, 0, -2, 0, 8, '#FFFF00', bodyShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.roundRect(-22, 0, 44, 8, 3);
    }, bodyGradient);

    const wheelAngle = (animTime * 0.012) % (Math.PI * 2);
    this.draw3DWheel(ctx, -18, 10, 9, wheelAngle);
    this.draw3DWheel(ctx, 18, 10, 9, wheelAngle);

    ctx.restore();
  }

  renderMechProto(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const walk = Math.sin(animTime * 0.01) * 2;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    const mechShading = this.calculateShading({ x: 0, y: -1, z: 0.2 }, 1);
    
    // Legs
    const legGradient = this.create3DGradient(ctx, 0, 10, 0, 30, '#444466', mechShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.roundRect(-16, 10 + walk, 10, 20, 2);
    }, legGradient, 0.6);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.roundRect(6, 10 - walk, 10, 20, 2);
    }, legGradient, 0.6);

    // Body
    const bodyGradient = this.create3DGradient(ctx, 0, -18, 0, 12, '#555577', mechShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.roundRect(-20, -16, 40, 28, 4);
    }, bodyGradient, 0.5);

    // Metallic speculars
    this.addSpecular(ctx, -8, -12, 10, 0.6);
    this.addSpecular(ctx, 6, -6, 8, 0.5);

    // Head sensor with glow
    ctx.shadowColor = '#FF0000';
    ctx.shadowBlur = 15;
    const sensorGradient = ctx.createRadialGradient(0, -20, 0, 0, -20, 8);
    sensorGradient.addColorStop(0, '#FF0000');
    sensorGradient.addColorStop(0.5, '#CC0000');
    sensorGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
    ctx.fillStyle = sensorGradient;
    ctx.beginPath();
    ctx.arc(0, -20, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  renderMechApex(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const walk = Math.sin(animTime * 0.01) * 2.5;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    const mechShading = this.calculateShading({ x: 0, y: -1, z: 0.3 }, 1.2);
    
    // Legs
    const legGradient = this.create3DGradient(ctx, 0, 12, 0, 36, '#556688', mechShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.roundRect(-18, 12 + walk, 12, 24, 3);
    }, legGradient, 0.6);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.roundRect(6, 12 - walk, 12, 24, 3);
    }, legGradient, 0.6);

    // Body
    const bodyGradient = this.create3DGradient(ctx, 0, -22, 0, 14, '#667799', mechShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.roundRect(-24, -20, 48, 34, 6);
    }, bodyGradient, 0.5);

    // Shoulder cannons with glow
    const cannonGradient = this.create3DGradient(ctx, -2, -18, 2, -6, '#556688', mechShading);
    ctx.fillStyle = cannonGradient;
    ctx.fillRect(-28, -18, 6, 12);
    ctx.fillRect(22, -18, 6, 12);

    // Cannon muzzle glow
    ctx.shadowColor = '#FF6600';
    ctx.shadowBlur = 18;
    const muzzleGradient = ctx.createRadialGradient(-25, -12, 0, -25, -12, 10);
    muzzleGradient.addColorStop(0, '#FF6600');
    muzzleGradient.addColorStop(1, 'rgba(255, 102, 0, 0)');
    ctx.fillStyle = muzzleGradient;
    ctx.beginPath();
    ctx.arc(-25, -12, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(25, -12, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Metallic highlights
    this.addSpecular(ctx, -10, -16, 12, 0.7);
    this.addSpecular(ctx, 8, -10, 10, 0.6);

    ctx.restore();
  }

  renderStreetSkateboard(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const tilt = Math.sin(animTime * 0.02) * 3;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt * Math.PI / 180);
    if (facingLeft) ctx.scale(-1, 1);

    const deckShading = this.calculateShading({ x: 0, y: -1, z: 0 }, 1);
    const deckGradient = this.create3DGradient(ctx, 0, -3, 0, 3, '#CC6688', deckShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.roundRect(-16, -3, 32, 6, 3);
    }, deckGradient, 0.2);

    this.addSpecular(ctx, -4, -1, 6, 0.3);

    const wheelAngle = (animTime * 0.02) % (Math.PI * 2);
    for (let i = -14; i <= 14; i += 6) {
      if (Math.abs(i) > 6) {
        this.draw3DWheel(ctx, i, 7, 3, wheelAngle);
      }
    }

    ctx.restore();
  }

  renderTank(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    const tankShading = this.calculateShading({ x: 0, y: -1, z: 0 }, 0.8);
    
    // Hull with armor plates
    const hullGradient = this.create3DGradient(ctx, 0, -14, 0, 12, '#2A4A2A', tankShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.roundRect(-42, -12, 84, 24, 4);
    }, hullGradient, 0.6);

    // Turret
    const turretGradient = this.create3DGradient(ctx, 0, -26, 0, -10, '#3D5A3D', tankShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.ellipse(0, -18, 24, 8, 0, 0, Math.PI * 2);
    }, turretGradient, 0.5);

    // Cannon with metallic shading
    const cannonGradient = this.create3DGradient(ctx, 0, -21, 0, -17, '#1A3A1A', tankShading);
    ctx.fillStyle = cannonGradient;
    ctx.fillRect(20, -21, 24, 6);
    this.addSpecular(ctx, 32, -19, 8, 0.4);

    // Tracks
    ctx.fillStyle = '#1A2A1A';
    ctx.fillRect(-44, 14, 88, 10);

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

    const bodyShading = this.calculateShading({ x: 0, y: -1, z: 0 }, 1.1);
    const bodyGradient = this.create3DGradient(ctx, 0, -10, 0, 8, '#338833', bodyShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.ellipse(0, 0, 32, 10, 0, 0, Math.PI * 2);
    }, bodyGradient, 0.4);

    this.addSpecular(ctx, -8, -6, 14, 0.5);

    // Rotor motion blur with 3D effect
    ctx.save();
    ctx.translate(0, -18);
    ctx.rotate(rotorAngle);
    ctx.globalAlpha = 0.3;
    const rotorGradient = ctx.createLinearGradient(-36, 0, 36, 0);
    rotorGradient.addColorStop(0, 'rgba(100, 100, 100, 0)');
    rotorGradient.addColorStop(0.5, 'rgba(100, 100, 100, 0.5)');
    rotorGradient.addColorStop(1, 'rgba(100, 100, 100, 0)');
    ctx.fillStyle = rotorGradient;
    ctx.fillRect(-36, -2, 72, 4);
    ctx.fillRect(-2, -36, 4, 72);
    ctx.globalAlpha = 1;
    ctx.restore();

    ctx.restore();
  }

  renderSpeedboat(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const bob = Math.sin(animTime * 0.02) * 1.5;
    
    ctx.save();
    ctx.translate(x, y + bob);
    if (facingLeft) ctx.scale(-1, 1);

    const boatShading = this.calculateShading({ x: 0, y: -1, z: 0.3 }, 1.1);
    const hullGradient = this.create3DGradient(ctx, 0, -8, 0, 8, '#2277CC', boatShading);
    this.drawWithAO(ctx, (c) => {
      c.beginPath();
      c.moveTo(-26, 8);
      c.lineTo(-28, 2);
      c.lineTo(-24, -6);
      c.lineTo(32, -4);
      c.lineTo(34, 4);
      c.lineTo(32, 8);
      c.closePath();
    }, hullGradient, 0.4);

    // Glossy finish specular
    this.addSpecular(ctx, -4, -4, 16, 0.6);
    this.addSpecular(ctx, 12, 0, 12, 0.5);

    // Wake splash with foam
    ctx.globalAlpha = 0.7;
    const wakeGradient = ctx.createRadialGradient(-32, 8, 0, -32, 8, 10);
    wakeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    wakeGradient.addColorStop(0.5, 'rgba(200, 230, 255, 0.6)');
    wakeGradient.addColorStop(1, 'rgba(170, 210, 255, 0)');
    ctx.fillStyle = wakeGradient;
    ctx.beginPath();
    ctx.ellipse(-32, 8, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  // Helper to draw 3D wheels
  draw3DWheel(ctx, x, y, radius, angle) {
    ctx.save();
    ctx.translate(x, y);

    // Tire with AO
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Rim with metallic gradient
    const rimGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.6);
    rimGradient.addColorStop(0, '#AAAAAA');
    rimGradient.addColorStop(0.5, '#666666');
    rimGradient.addColorStop(1, '#444444');
    ctx.fillStyle = rimGradient;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Rim specular highlight
    this.addSpecular(ctx, -radius * 0.2, -radius * 0.3, radius * 0.4, 0.7);

    // Spokes with rotation
    ctx.save();
    ctx.rotate(angle);
    ctx.strokeStyle = '#888888';
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

