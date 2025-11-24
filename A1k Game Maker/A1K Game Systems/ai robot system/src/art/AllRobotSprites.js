// src/art/AllRobotSprites.js
// Procedural robot sprite rendering - tech/cyberpunk style

const TECH_PALETTE = {
  core: '#00d4ff',
  energy: '#5ba3ff',
  accent: '#5bffaa',
  warning: '#ff6b35',
  critical: '#ff4444',
  shield: '#74b9ff',
  stealth: '#9b59b6',
};

export class AllRobotSprites {
  constructor() {
    this.animTime = 0;
  }

  // 1. ROBOX STANDARD - Balanced combat bot (28x70px)
  renderRoboxStandard(ctx, x, y, state) {
    const { animTime, color, secondaryColor } = state;
    const time = animTime / 1000;
    const bob = Math.sin(time * 8) * 3;
    const facingLeft = state.facingLeft || false;

    ctx.save();
    ctx.translate(x, y + bob);
    if (facingLeft) ctx.scale(-1, 1);

    // Energy glow
    ctx.save();
    ctx.globalAlpha = 0.3 + Math.sin(time * 10) * 0.15;
    const glow = ctx.createRadialGradient(0, -20, 0, 0, -24, 44);
    glow.addColorStop(0, color + '88');
    glow.addColorStop(1, color + '00');
    ctx.fillStyle = glow;
    ctx.arc(0, -22, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Main body
    ctx.fillStyle = '#101728';
    ctx.strokeStyle = secondaryColor || '#5bffaa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-14, -36 + bob);
    ctx.quadraticCurveTo(-18, -12 + bob, -10, 12 + bob);
    ctx.quadraticCurveTo(-6, 30 + bob, 0, 34 + bob);
    ctx.quadraticCurveTo(6, 30 + bob, 10, 12 + bob);
    ctx.quadraticCurveTo(18, -12 + bob, 14, -36 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Visor
    ctx.fillStyle = color || '#5ba3ff';
    ctx.fillRect(-10, -28 + bob, 20, 10);
    
    // Eyes
    ctx.fillStyle = secondaryColor || '#5bffaa';
    ctx.fillRect(-6, -26 + bob, 5, 5);
    ctx.fillRect(2, -26 + bob, 5, 5);

    // Arms
    const armSwing = Math.sin(time * 10) * 0.45;
    ctx.strokeStyle = secondaryColor || '#5bffaa';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    // Left arm
    ctx.save();
    ctx.translate(-12, -10 + bob);
    ctx.rotate(-armSwing);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-6, 20);
    ctx.stroke();
    ctx.restore();
    
    // Right arm
    ctx.save();
    ctx.translate(12, -10 + bob);
    ctx.rotate(armSwing);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(6, 20);
    ctx.stroke();
    ctx.restore();

    // Thruster
    ctx.save();
    ctx.translate(0, 18 + bob);
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = color || '#5ba3ff';
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  // 2. ROBOX ELITE - Enhanced with shield (32x75px)
  renderRoboxElite(ctx, x, y, state) {
    const { animTime, color, secondaryColor } = state;
    const time = animTime / 1000;
    const bob = Math.sin(time * 8) * 2;
    const facingLeft = state.facingLeft || false;

    ctx.save();
    ctx.translate(x, y + bob);
    if (facingLeft) ctx.scale(-1, 1);

    // Shield aura
    if (state.hasShield !== false) {
      ctx.strokeStyle = '#8a2be2';
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.4 + Math.sin(time * 6) * 0.2;
      ctx.beginPath();
      ctx.arc(0, -20, 40, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Body (larger)
    ctx.fillStyle = '#1a1a2e';
    ctx.strokeStyle = color || '#8a2be2';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-16, -38);
    ctx.quadraticCurveTo(-20, -14, -12, 14);
    ctx.quadraticCurveTo(-7, 32, 0, 37);
    ctx.quadraticCurveTo(7, 32, 12, 14);
    ctx.quadraticCurveTo(20, -14, 16, -38);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Visor (larger)
    ctx.fillStyle = color || '#8a2be2';
    ctx.fillRect(-12, -30, 24, 12);
    
    // Enhanced eyes
    ctx.fillStyle = secondaryColor || '#ff69b4';
    ctx.shadowColor = secondaryColor || '#ff69b4';
    ctx.shadowBlur = 8;
    ctx.fillRect(-8, -28, 6, 6);
    ctx.fillRect(2, -28, 6, 6);
    ctx.shadowBlur = 0;

    // Shoulder cannons
    ctx.fillStyle = '#444';
    ctx.fillRect(-20, -20, 6, 12);
    ctx.fillRect(14, -20, 6, 12);
    ctx.fillStyle = color || '#8a2be2';
    ctx.fillRect(-19, -18, 4, 3);
    ctx.fillRect(15, -18, 4, 3);

    // Arms (thicker)
    ctx.strokeStyle = color || '#8a2be2';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-14, -8);
    ctx.lineTo(-16, 18);
    ctx.moveTo(14, -8);
    ctx.lineTo(16, 18);
    ctx.stroke();

    // Enhanced thruster
    ctx.save();
    ctx.translate(0, 22);
    ctx.globalAlpha = 0.7;
    const thrusterGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
    thrusterGrad.addColorStop(0, color || '#8a2be2');
    thrusterGrad.addColorStop(1, '#00000000');
    ctx.fillStyle = thrusterGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  // 3. ROBOX TITAN - Massive heavy bot (45x90px)
  renderRoboxTitan(ctx, x, y, state) {
    const { animTime, color, secondaryColor } = state;
    const time = animTime / 1000;
    const bob = Math.sin(time * 6) * 2;

    ctx.save();
    ctx.translate(x, y + bob);

    // Warning lights
    ctx.fillStyle = Math.sin(time * 15) > 0 ? '#ff4444' : '#444';
    ctx.beginPath();
    ctx.arc(-18, -40, 3, 0, Math.PI * 2);
    ctx.arc(18, -40, 3, 0, Math.PI * 2);
    ctx.fill();

    // Massive body
    ctx.fillStyle = '#0a0a0a';
    ctx.strokeStyle = color || '#ff4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-22, -45);
    ctx.lineTo(-22, 20);
    ctx.lineTo(-18, 40);
    ctx.lineTo(18, 40);
    ctx.lineTo(22, 20);
    ctx.lineTo(22, -45);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Chest core
    ctx.save();
    ctx.fillStyle = secondaryColor || '#ffff00';
    ctx.shadowColor = secondaryColor || '#ffff00';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, -10, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    // Visor array
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = color || '#ff4444';
      ctx.fillRect(-14 + i * 10, -38, 8, 6);
    }

    // Heavy weapons
    ctx.fillStyle = '#222';
    ctx.strokeStyle = color || '#ff4444';
    ctx.lineWidth = 2;
    // Left cannon
    ctx.fillRect(-28, -25, 8, 20);
    ctx.strokeRect(-28, -25, 8, 20);
    // Right cannon
    ctx.fillRect(20, -25, 8, 20);
    ctx.strokeRect(20, -25, 8, 20);

    // Massive arms
    ctx.strokeStyle = color || '#ff4444';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-18, -5);
    ctx.lineTo(-22, 25);
    ctx.moveTo(18, -5);
    ctx.lineTo(22, 25);
    ctx.stroke();

    // Dual thrusters
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = color || '#ff4444';
    ctx.beginPath();
    ctx.ellipse(-10, 30, 8, 18, 0, 0, Math.PI * 2);
    ctx.ellipse(10, 30, 8, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 4. SCOUT DRONE - Fast hovering drone (20x20px)
  renderScoutDrone(ctx, x, y, state) {
    const { animTime, color } = state;
    const time = animTime / 1000;
    const hover = Math.sin(time * 5) * 4;

    ctx.save();
    ctx.translate(x, y + hover);

    // Propeller blur
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = color || '#74b9ff';
    ctx.beginPath();
    ctx.ellipse(0, -8, 16, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Hexagon body
    ctx.fillStyle = '#1a1a2e';
    ctx.strokeStyle = color || '#74b9ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const px = Math.cos(angle) * 10;
      const py = Math.sin(angle) * 10;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Core eye
    ctx.fillStyle = '#00d4ff';
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // 5. REPAIR DRONE - Healing support (22x22px)
  renderRepairDrone(ctx, x, y, state) {
    const { animTime, color, secondaryColor } = state;
    const time = animTime / 1000;
    const hover = Math.sin(time * 4) * 3;
    const pulse = Math.sin(time * 8) * 0.2 + 0.8;

    ctx.save();
    ctx.translate(x, y + hover);

    // Healing aura
    ctx.strokeStyle = secondaryColor || '#00ff88';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4 * pulse;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Body
    ctx.fillStyle = '#0f3d2e';
    ctx.strokeStyle = color || '#5bffaa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Medical cross
    ctx.fillStyle = secondaryColor || '#00ff88';
    ctx.fillRect(-2, -8, 4, 16);
    ctx.fillRect(-8, -2, 16, 4);

    // Repair arms (4)
    ctx.strokeStyle = color || '#5bffaa';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI / 2) * i + time * 2;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(0, -16);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  // 6. SHIELD DRONE - Defensive unit (26x26px)
  renderShieldDrone(ctx, x, y, state) {
    const { animTime, color } = state;
    const time = animTime / 1000;
    const hover = Math.sin(time * 4) * 2;

    ctx.save();
    ctx.translate(x, y + hover);

    // Shield barrier
    ctx.strokeStyle = color || '#00d4ff';
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.5 + Math.sin(time * 6) * 0.3;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Octagon body
    ctx.fillStyle = '#0a1628';
    ctx.strokeStyle = color || '#00d4ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI / 4) * i;
      const px = Math.cos(angle) * 13;
      const py = Math.sin(angle) * 13;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Shield projector
    ctx.fillStyle = color || '#00d4ff';
    ctx.shadowColor = color || '#00d4ff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // 7. ASSAULT MECH - Heavy weapons platform (50x80px)
  renderAssaultMech(ctx, x, y, state) {
    const { animTime, color, secondaryColor } = state;
    const time = animTime / 1000;

    ctx.save();
    ctx.translate(x, y);

    // Chassis
    ctx.fillStyle = '#2a2a2a';
    ctx.strokeStyle = color || '#ff6b35';
    ctx.lineWidth = 3;
    ctx.fillRect(-25, -40, 50, 60);
    ctx.strokeRect(-25, -40, 50, 60);

    // Cockpit
    ctx.fillStyle = '#1a1a1a';
    ctx.strokeStyle = secondaryColor || '#ffd56a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-15, -35);
    ctx.lineTo(15, -35);
    ctx.lineTo(15, -15);
    ctx.lineTo(-15, -15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Gatling guns (dual)
    for (let side of [-1, 1]) {
      ctx.fillStyle = '#444';
      ctx.fillRect(side * 22, -20, side * 8, 30);
      // Barrels
      ctx.fillStyle = '#222';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(side * 26, -12 + i * 8, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      // Muzzle flash
      if (Math.sin(time * 20) > 0.5) {
        ctx.fillStyle = '#ff6b35';
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(side * 30, -5, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Legs
    ctx.strokeStyle = color || '#ff6b35';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-12, 20);
    ctx.lineTo(-14, 35);
    ctx.moveTo(12, 20);
    ctx.lineTo(14, 35);
    ctx.stroke();

    // Ammo belt detail
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = secondaryColor || '#ffd56a';
      ctx.fillRect(-8 + i * 4, -8, 3, 5);
    }

    ctx.restore();
  }

  // 8. SNIPER BOT - Long-range specialist (30x65px)
  renderSniperBot(ctx, x, y, state) {
    const { animTime, color, secondaryColor } = state;
    const time = animTime / 1000;

    ctx.save();
    ctx.translate(x, y);

    // Slim body
    ctx.fillStyle = '#1a1a1a';
    ctx.strokeStyle = color || '#c0392b';
    ctx.lineWidth = 2;
    ctx.fillRect(-10, -32, 20, 50);
    ctx.strokeRect(-10, -32, 20, 50);

    // Scope/head
    ctx.fillStyle = '#0a0a0a';
    ctx.strokeStyle = secondaryColor || '#ff6b6b';
    ctx.beginPath();
    ctx.arc(0, -32, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Scope lens
    ctx.fillStyle = '#ff0000';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, -32, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Railgun (long)
    ctx.fillStyle = '#222';
    ctx.strokeStyle = color || '#c0392b';
    ctx.lineWidth = 3;
    ctx.fillRect(5, -25, 8, 40);
    ctx.strokeRect(5, -25, 8, 40);

    // Energy coils
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = secondaryColor || '#ff6b6b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(9, -20 + i * 10, 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Charging effect
    if (Math.sin(time * 3) > 0) {
      ctx.fillStyle = '#ff0000';
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(9, 15, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Stabilizer legs
    ctx.strokeStyle = color || '#c0392b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-8, 18);
    ctx.lineTo(-12, 30);
    ctx.moveTo(8, 18);
    ctx.lineTo(12, 30);
    ctx.stroke();

    ctx.restore();
  }

  // 9. STEALTH BOT - Cloaking infiltrator (24x60px)
  renderStealthBot(ctx, x, y, state) {
    const { animTime, color, secondaryColor } = state;
    const time = animTime / 1000;
    const cloaked = state.cloaked || false;

    ctx.save();
    ctx.translate(x, y);
    
    // Cloak effect
    if (cloaked) {
      ctx.globalAlpha = 0.3;
      // Shimmer
      ctx.strokeStyle = secondaryColor || '#9b59b6';
      ctx.lineWidth = 1;
      ctx.globalAlpha = Math.sin(time * 10) * 0.2 + 0.2;
      ctx.strokeRect(-12, -30, 24, 60);
      ctx.globalAlpha = 0.3;
    }

    // Sleek body
    ctx.fillStyle = '#1a1a2e';
    ctx.strokeStyle = color || '#2c3e50';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.lineTo(-8, -20);
    ctx.lineTo(-8, 15);
    ctx.lineTo(0, 25);
    ctx.lineTo(8, 15);
    ctx.lineTo(8, -20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Visor (narrow)
    ctx.fillStyle = secondaryColor || '#9b59b6';
    if (!cloaked) {
      ctx.shadowColor = secondaryColor || '#9b59b6';
      ctx.shadowBlur = 8;
    }
    ctx.fillRect(-6, -26, 12, 4);
    ctx.shadowBlur = 0;

    // Blade arms
    ctx.strokeStyle = color || '#2c3e50';
    ctx.lineWidth = 2;
    const bladeAngle = Math.sin(time * 12) * 0.3;
    
    ctx.save();
    ctx.translate(-8, -10);
    ctx.rotate(-bladeAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-8, 15);
    ctx.lineTo(-6, 16);
    ctx.lineTo(0, 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    
    ctx.save();
    ctx.translate(8, -10);
    ctx.rotate(bladeAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(8, 15);
    ctx.lineTo(6, 16);
    ctx.lineTo(0, 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  // 10. ENGINEER BOT - Builder unit (32x55px)
  renderEngineerBot(ctx, x, y, state) {
    const { animTime, color, secondaryColor } = state;
    const time = animTime / 1000;

    ctx.save();
    ctx.translate(x, y);

    // Toolbox body
    ctx.fillStyle = '#2a2a1a';
    ctx.strokeStyle = color || '#f39c12';
    ctx.lineWidth = 2.5;
    ctx.fillRect(-14, -27, 28, 45);
    ctx.strokeRect(-14, -27, 28, 45);

    // Tool belt
    ctx.fillStyle = secondaryColor || '#e67e22';
    ctx.fillRect(-14, -5, 28, 6);

    // Head
    ctx.fillStyle = '#1a1a1a';
    ctx.strokeStyle = color || '#f39c12';
    ctx.beginPath();
    ctx.arc(0, -27, 10, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Visor
    ctx.fillStyle = color || '#f39c12';
    ctx.fillRect(-8, -28, 16, 4);

    // Construction arms (multiple tools)
    const armSwing = Math.sin(time * 6) * 0.4;
    
    // Wrench arm
    ctx.save();
    ctx.translate(-12, -10);
    ctx.rotate(-armSwing);
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-6, 12);
    ctx.stroke();
    // Wrench head
    ctx.fillStyle = '#aaa';
    ctx.fillRect(-8, 12, 4, 6);
    ctx.restore();

    // Welder arm
    ctx.save();
    ctx.translate(12, -10);
    ctx.rotate(armSwing);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(6, 12);
    ctx.stroke();
    // Welding spark
    if (Math.sin(time * 15) > 0.7) {
      ctx.fillStyle = '#ffff00';
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(6, 14, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.restore();

    // Treads
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-14, 18, 28, 8);
    ctx.strokeStyle = color || '#f39c12';
    ctx.strokeRect(-14, 18, 28, 8);
    // Tread details
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = '#444';
      ctx.fillRect(-12 + i * 5, 20, 3, 4);
    }

    ctx.restore();
  }

  // 11. PLASMA BOT - Unstable energy (35x70px)
  renderPlasmaBot(ctx, x, y, state) {
    const { animTime, color, secondaryColor } = state;
    const time = animTime / 1000;
    const unstable = Math.sin(time * 12) * 2;

    ctx.save();
    ctx.translate(x + unstable, y);

    // Unstable energy aura
    ctx.globalAlpha = 0.4;
    const aura = ctx.createRadialGradient(0, -15, 5, 0, -15, 35);
    aura.addColorStop(0, color || '#e74c3c');
    aura.addColorStop(1, '#00000000');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, -15, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Containment body
    ctx.fillStyle = '#1a0a0a';
    ctx.strokeStyle = color || '#e74c3c';
    ctx.lineWidth = 2;
    ctx.fillRect(-17, -35, 34, 60);
    ctx.strokeRect(-17, -35, 34, 60);

    // Plasma core (pulsing)
    const coreSize = 12 + Math.sin(time * 15) * 3;
    ctx.save();
    ctx.fillStyle = secondaryColor || '#ff9ff3';
    ctx.shadowColor = secondaryColor || '#ff9ff3';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(0, -10, coreSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    // Plasma cannon
    ctx.fillStyle = '#0a0a0a';
    ctx.strokeStyle = color || '#e74c3c';
    ctx.lineWidth = 3;
    ctx.fillRect(-8, -35, 16, 20);
    ctx.strokeRect(-8, -35, 16, 20);

    // Energy coils
    for (let i = 0; i < 3; i++) {
      const offset = Math.sin(time * 10 + i) * 2;
      ctx.strokeStyle = secondaryColor || '#ff9ff3';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -30 + i * 8 + offset, 6, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Charging warning
    if (Math.sin(time * 8) > 0.5) {
      ctx.fillStyle = '#ff0000';
      ctx.globalAlpha = 0.8;
      for (let i = 0; i < 3; i++) {
        const angle = (Math.PI * 2 / 3) * i + time * 5;
        const px = Math.cos(angle) * 20;
        const py = -10 + Math.sin(angle) * 20;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Stabilizers
    ctx.strokeStyle = color || '#e74c3c';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-14, 20);
    ctx.lineTo(-18, 30);
    ctx.moveTo(14, 20);
    ctx.lineTo(18, 30);
    ctx.stroke();

    ctx.restore();
  }

  // 12. AI CORE - Command unit (40x40px)
  renderAICore(ctx, x, y, state) {
    const { animTime, color, secondaryColor } = state;
    const time = animTime / 1000;
    const hover = Math.sin(time * 3) * 5;
    const rotate = time * 0.5;

    ctx.save();
    ctx.translate(x, y + hover);

    // Command aura
    ctx.strokeStyle = secondaryColor || '#3498db';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3 + Math.sin(time * 4) * 0.2;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, 25 + i * 10, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Rotating outer ring
    ctx.save();
    ctx.rotate(rotate);
    ctx.strokeStyle = color || '#9b59b6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.stroke();
    // Ring nodes
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 / 6) * i;
      const px = Math.cos(angle) * 20;
      const py = Math.sin(angle) * 20;
      ctx.fillStyle = secondaryColor || '#3498db';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Core sphere
    const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 15);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.3, color || '#9b59b6');
    coreGrad.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = coreGrad;
    ctx.shadowColor = color || '#9b59b6';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Neural network lines
    ctx.strokeStyle = secondaryColor || '#3498db';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i + time * 2;
      const px = Math.cos(angle) * 10;
      const py = Math.sin(angle) * 10;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(px, py);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Data particles
    for (let i = 0; i < 4; i++) {
      const angle = time * 3 + i * Math.PI / 2;
      const radius = 18 + Math.sin(time * 4 + i) * 5;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      ctx.fillStyle = secondaryColor || '#3498db';
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  // Helper method to render any robot by ID
  renderRobot(ctx, robotId, x, y, state) {
    const renderMap = {
      'robox_standard': this.renderRoboxStandard,
      'robox_elite': this.renderRoboxElite,
      'robox_titan': this.renderRoboxTitan,
      'drone_scout': this.renderScoutDrone,
      'drone_healer': this.renderRepairDrone,
      'drone_shield': this.renderShieldDrone,
      'mech_assault': this.renderAssaultMech,
      'sniper_bot': this.renderSniperBot,
      'stealth_bot': this.renderStealthBot,
      'engineer_bot': this.renderEngineerBot,
      'plasma_bot': this.renderPlasmaBot,
      'ai_core': this.renderAICore,
    };

    const renderFn = renderMap[robotId];
    if (renderFn) {
      renderFn.call(this, ctx, x, y, state);
      return true;
    }
    return false;
  }
}

