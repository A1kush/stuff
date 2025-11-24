// src/art/AllSpiritSprites.js
// Procedural ethereal spirit sprite rendering - magical/mystical style

const ETHEREAL_PALETTE = {
  darkPurple: '#7c3aed',
  lightGold: '#ffd56a',
  goldenYellow: '#ffbf3b',
  techCyan: '#3ec5ff',
  stormBlue: '#60a5fa',
  earthOrange: '#d97706',
  emberRed: '#ff6b35',
};

export class AllSpiritSprites {
  constructor() {
    this.animTime = 0;
  }

  // 1. DARK SOUL - Purple shadow energy orb (24px)
  renderDarkSoul(ctx, x, y, state) {
    const { animTime, color, glowColor } = state;
    const time = animTime / 1000;
    const pulse = Math.sin(time * 4) * 0.3 + 0.7;
    const orbit = Math.sin(time * 2) * 3;

    ctx.save();
    ctx.translate(x, y + orbit);

    // Outer shadow aura
    ctx.globalAlpha = 0.3 * pulse;
    const outerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 40);
    outerGlow.addColorStop(0, color + 'aa');
    outerGlow.addColorStop(1, '#00000000');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Swirling dark tendrils
    ctx.strokeStyle = color || '#7c3aed';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 3; i++) {
      const angle = (time * 2 + i * (Math.PI * 2 / 3));
      const radius = 15 + Math.sin(time * 3 + i) * 5;
      ctx.beginPath();
      ctx.arc(0, 0, radius, angle, angle + Math.PI / 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Core orb
    const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 12);
    coreGrad.addColorStop(0, '#1a1a2e');
    coreGrad.addColorStop(0.5, color || '#7c3aed');
    coreGrad.addColorStop(1, glowColor || '#8b5cf6');
    ctx.fillStyle = coreGrad;
    ctx.shadowColor = glowColor || '#8b5cf6';
    ctx.shadowBlur = 20 * pulse;
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Inner eye
    ctx.fillStyle = '#a78bfa';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    // Shadow particles
    for (let i = 0; i < 5; i++) {
      const angle = time * 1.5 + i * (Math.PI * 2 / 5);
      const radius = 20 + Math.sin(time * 4 + i) * 8;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      ctx.fillStyle = color || '#7c3aed';
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  // 2. LIGHT SOUL - Radiant golden light orb (26px)
  renderLightSoul(ctx, x, y, state) {
    const { animTime, color, glowColor } = state;
    const time = animTime / 1000;
    const pulse = Math.sin(time * 3) * 0.2 + 0.8;
    const float = Math.sin(time * 2) * 4;

    ctx.save();
    ctx.translate(x, y + float);

    // Radiant glow
    ctx.globalAlpha = 0.4 * pulse;
    const radiance = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
    radiance.addColorStop(0, '#ffffff');
    radiance.addColorStop(0.3, color + 'cc');
    radiance.addColorStop(1, '#00000000');
    ctx.fillStyle = radiance;
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Light rays
    ctx.strokeStyle = color || '#ffd56a';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + time;
      const length = 18 + Math.sin(time * 4 + i) * 6;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -13);
      ctx.lineTo(0, -13 - length);
      ctx.stroke();
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    // Core sphere
    const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 13);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.4, color || '#ffd56a');
    coreGrad.addColorStop(1, glowColor || '#ffe89d');
    ctx.fillStyle = coreGrad;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 25 * pulse;
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Sparkles
    for (let i = 0; i < 6; i++) {
      const angle = time * 2 + i * (Math.PI / 3);
      const radius = 25 + Math.sin(time * 5 + i) * 10;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      const sparkleSize = 1 + Math.sin(time * 6 + i) * 1;
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(px, py, sparkleSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  // 3. GOLDEN SPIRIT - Sparkling fortune orb (22px)
  renderGoldenSpirit(ctx, x, y, state) {
    const { animTime, color, glowColor } = state;
    const time = animTime / 1000;
    const twinkle = Math.sin(time * 5) * 0.3 + 0.7;
    const spin = time * 1.5;

    ctx.save();
    ctx.translate(x, y);

    // Golden aura
    ctx.globalAlpha = 0.3 * twinkle;
    const aura = ctx.createRadialGradient(0, 0, 0, 0, 0, 35);
    aura.addColorStop(0, color + 'dd');
    aura.addColorStop(1, '#00000000');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Rotating ring
    ctx.save();
    ctx.rotate(spin);
    ctx.strokeStyle = glowColor || '#ffe89d';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.stroke();
    // Ring nodes
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const px = Math.cos(angle) * 18;
      const py = Math.sin(angle) * 18;
      ctx.fillStyle = color || '#ffbf3b';
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    // Core
    ctx.fillStyle = color || '#ffbf3b';
    ctx.shadowColor = glowColor || '#ffe89d';
    ctx.shadowBlur = 15 * twinkle;
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Inner glow
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Sparkles orbiting
    for (let i = 0; i < 8; i++) {
      const angle = -spin * 2 + i * (Math.PI / 4);
      const radius = 24;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      const size = 1.5 + Math.sin(time * 8 + i) * 0.5;
      ctx.fillStyle = '#ffd56a';
      ctx.shadowColor = '#ffd56a';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }

  // 4. TECH ESSENCE - Cyan energy core (24px)
  renderTechEssence(ctx, x, y, state) {
    const { animTime, color, glowColor } = state;
    const time = animTime / 1000;
    const pulse = Math.sin(time * 6) * 0.25 + 0.75;
    const rotate = time * 3;

    ctx.save();
    ctx.translate(x, y);

    // Energy field
    ctx.save();
    ctx.rotate(rotate);
    ctx.strokeStyle = color || '#3ec5ff';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4;
    // Hexagon
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const px = Math.cos(angle) * 20;
      const py = Math.sin(angle) * 20;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();

    // Core sphere
    const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 12);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.3, color || '#3ec5ff');
    coreGrad.addColorStop(1, glowColor || '#38bdf8');
    ctx.fillStyle = coreGrad;
    ctx.shadowColor = color || '#3ec5ff';
    ctx.shadowBlur = 18 * pulse;
    ctx.beginPath();
    ctx.arc(0, 0, 12 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Circuit lines
    ctx.strokeStyle = glowColor || '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.7;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + time * 2;
      const px = Math.cos(angle) * 15;
      const py = Math.sin(angle) * 15;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(px, py);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Energy particles
    for (let i = 0; i < 6; i++) {
      const angle = time * 4 + i * (Math.PI / 3);
      const radius = 25 + Math.sin(time * 7 + i) * 5;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      ctx.fillStyle = color || '#3ec5ff';
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  // 5. STORM WISP - Lightning spirit (28px)
  renderStormWisp(ctx, x, y, state) {
    const { animTime, color, glowColor } = state;
    const time = animTime / 1000;
    const flicker = Math.sin(time * 12) * 0.2 + 0.8;
    const drift = Math.sin(time * 3) * 5;

    ctx.save();
    ctx.translate(x + drift, y);

    // Storm cloud base
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#4a5568';
    ctx.beginPath();
    ctx.ellipse(0, -5, 20, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Lightning arcs
    ctx.strokeStyle = color || '#60a5fa';
    ctx.lineWidth = 2;
    ctx.shadowColor = glowColor || '#818cf8';
    ctx.shadowBlur = 12 * flicker;
    for (let i = 0; i < 3; i++) {
      const offset = (Math.sin(time * 15 + i * 2) > 0.7) ? 1 : 0;
      if (offset) {
        const startX = (i - 1) * 8;
        ctx.beginPath();
        ctx.moveTo(startX, -5);
        ctx.lineTo(startX + (Math.random() - 0.5) * 6, 5);
        ctx.lineTo(startX + (Math.random() - 0.5) * 8, 15);
        ctx.stroke();
      }
    }
    ctx.shadowBlur = 0;

    // Core orb
    const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 14);
    coreGrad.addColorStop(0, '#e0e7ff');
    coreGrad.addColorStop(0.5, color || '#60a5fa');
    coreGrad.addColorStop(1, glowColor || '#818cf8');
    ctx.fillStyle = coreGrad;
    ctx.shadowColor = '#60a5fa';
    ctx.shadowBlur = 20 * flicker;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Electric charges
    for (let i = 0; i < 4; i++) {
      if (Math.sin(time * 20 + i * 3) > 0.6) {
        const angle = (i / 4) * Math.PI * 2 + time * 8;
        const px = Math.cos(angle) * 22;
        const py = Math.sin(angle) * 22;
        ctx.fillStyle = '#e0e7ff';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    ctx.restore();
  }

  // 6. GUARDIAN SAND - Earth hourglass spirit (26px)
  renderGuardianSand(ctx, x, y, state) {
    const { animTime, color, glowColor } = state;
    const time = animTime / 1000;
    const bob = Math.sin(time * 2.5) * 3;
    const pour = time * 2;

    ctx.save();
    ctx.translate(x, y + bob);

    // Protective circle
    ctx.strokeStyle = color || '#d97706';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5 + Math.sin(time * 3) * 0.2;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Hourglass shape
    ctx.strokeStyle = glowColor || '#f59e0b';
    ctx.lineWidth = 3;
    ctx.shadowColor = glowColor || '#f59e0b';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(-8, -12);
    ctx.lineTo(-8, -8);
    ctx.lineTo(0, 0);
    ctx.lineTo(8, 8);
    ctx.lineTo(8, 12);
    ctx.moveTo(-8, 12);
    ctx.lineTo(-8, 8);
    ctx.lineTo(0, 0);
    ctx.lineTo(8, -8);
    ctx.lineTo(8, -12);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Sand particles falling
    ctx.fillStyle = color || '#d97706';
    for (let i = 0; i < 8; i++) {
      const offset = (pour + i * 0.5) % 2;
      const py = -8 + offset * 16;
      if (py < 8) {
        ctx.globalAlpha = 1 - (offset / 2);
        ctx.beginPath();
        ctx.arc((Math.random() - 0.5) * 3, py, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Core glow
    ctx.fillStyle = color || '#d97706';
    ctx.shadowColor = glowColor || '#f59e0b';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // 7. EMBER FOX - Fiery fox spirit (30px)
  renderEmberFox(ctx, x, y, state) {
    const { animTime, color, secondaryColor, glowColor } = state;
    const time = animTime / 1000;
    const hop = Math.abs(Math.sin(time * 4)) * 6;
    const tailSwish = Math.sin(time * 5) * 0.4;

    ctx.save();
    ctx.translate(x, y - hop);

    // Fire trail
    for (let i = 0; i < 5; i++) {
      const offsetY = i * 5 + hop;
      const offsetX = Math.sin(time * 3 + i) * 3;
      ctx.fillStyle = color || '#ff6b35';
      ctx.globalAlpha = 0.4 - i * 0.08;
      ctx.beginPath();
      ctx.arc(offsetX, offsetY, 4 - i * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Fox body (stylized)
    ctx.fillStyle = color || '#ff6b35';
    ctx.shadowColor = glowColor || '#fb923c';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Fox head
    ctx.fillStyle = secondaryColor || '#fbbf24';
    ctx.beginPath();
    ctx.arc(-5, -8, 8, 0, Math.PI * 2);
    ctx.fill();

    // Ear flames
    ctx.fillStyle = color || '#ff6b35';
    ctx.beginPath();
    ctx.moveTo(-8, -14);
    ctx.lineTo(-5, -18);
    ctx.lineTo(-3, -14);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(-2, -14);
    ctx.lineTo(0, -17);
    ctx.lineTo(2, -14);
    ctx.fill();

    // Eyes (glowing)
    ctx.fillStyle = '#ffff00';
    ctx.shadowColor = '#ffff00';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(-7, -9, 2, 0, Math.PI * 2);
    ctx.arc(-3, -9, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Tail (flame trail)
    ctx.save();
    ctx.translate(8, 2);
    ctx.rotate(tailSwish);
    const tailGrad = ctx.createLinearGradient(0, 0, 15, 0);
    tailGrad.addColorStop(0, color || '#ff6b35');
    tailGrad.addColorStop(1, secondaryColor || '#fbbf24');
    ctx.fillStyle = tailGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(8, -4, 15, -8);
    ctx.quadraticCurveTo(12, 0, 0, 0);
    ctx.fill();
    ctx.restore();

    // Ember particles
    for (let i = 0; i < 6; i++) {
      const angle = time * 3 + i * (Math.PI / 3);
      const radius = 18 + Math.sin(time * 6 + i) * 6;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      ctx.fillStyle = secondaryColor || '#fbbf24';
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  // Helper method to render any spirit by ID
  renderSpirit(ctx, spiritId, x, y, state) {
    const renderMap = {
      'dark_soul': this.renderDarkSoul,
      'light_soul': this.renderLightSoul,
      'golden_spirit': this.renderGoldenSpirit,
      'tech_essence': this.renderTechEssence,
      'storm_wisp': this.renderStormWisp,
      'guardian_sand': this.renderGuardianSand,
      'ember_fox': this.renderEmberFox,
    };

    const renderFn = renderMap[spiritId];
    if (renderFn) {
      renderFn.call(this, ctx, x, y, state);
      return true;
    }
    return false;
  }
}

