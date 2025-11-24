// 🎮 RUNNER BOSS SPRITES - Specialized Rendering
// Enhanced algorithmic rendering for Gold, Gift, and Pool bosses
// Standalone - no imports needed

// Math utilities
const MathUtils = {
  wave: (time, frequency = 1, amplitude = 1, phase = 0) => {
    return Math.sin(time * frequency + phase) * amplitude;
  }
};

// Runner Boss specific color palettes
const RUNNER_PALETTE = {
  gold: { base: '#ffd700', bright: '#ffed4e', dark: '#d4af37', shadow: '#8b7500' },
  gift: { base: '#ff69b4', bright: '#ff1493', dark: '#c71585', shadow: '#8b008b' },
  silver: { base: '#c0c0c0', bright: '#e8e8e8', dark: '#a9a9a9', shadow: '#696969' },
  candy: { base: '#ffb6c1', bright: '#ffc0cb', dark: '#ff69b4', shadow: '#db7093' },
  chocolate: { base: '#8b4513', bright: '#d2691e', dark: '#a0522d', shadow: '#654321' },
};

export class RunnerBossSprites {
  /**
   * Render any runner boss based on category
   */
  static render(ctx, boss, time, glow = true) {
    if (!boss || !boss.bossCategory) {
      console.warn('Not a runner boss or missing category');
      return false;
    }

    switch (boss.bossCategory) {
      case 'gold':
        this.renderGoldBoss(ctx, boss, time, glow);
        return true;
      case 'gift':
        this.renderGiftBoss(ctx, boss, time, glow);
        return true;
      case 'silver':
        this.renderSilverBoss(ctx, boss, time, glow);
        return true;
      case 'armor':
        this.renderArmorBoss(ctx, boss, time, glow);
        return true;
      case 'pet':
        this.renderPetBoss(ctx, boss, time, glow);
        return true;
      case 'key':
        this.renderKeyBoss(ctx, boss, time, glow);
        return true;
      case 'miniBoss':
      case 'bigBoss':
        this.renderEpicBoss(ctx, boss, time, glow);
        return true;
      default:
        return false; // Let default renderer handle it
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // GOLD BOSS RENDERING - Golden shimmer with coin particles
  // ═════════════════════════════════════════════════════════════════════════
  static renderGoldBoss(ctx, boss, time, glow) {
    const color = RUNNER_PALETTE.gold;
    const size = boss.size || 64;
    const x = boss.x;
    const y = boss.y;
    const shimmer = MathUtils.wave(time, 12, 0.3) + 1;
    const hover = MathUtils.wave(time, 3, size * 0.08);

    ctx.save();
    ctx.translate(x, y + hover);

    // Golden aura (multi-layer)
    if (glow) {
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = color.bright;
        ctx.lineWidth = 3 - i;
        ctx.globalAlpha = (0.3 - i * 0.08) * shimmer;
        ctx.beginPath();
        ctx.arc(0, -size * 0.3, size * (0.9 + i * 0.15), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Coin particles orbiting
    if (glow) {
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + time * 2;
        const radius = size * 0.7;
        const coinX = Math.cos(angle) * radius;
        const coinY = -size * 0.3 + Math.sin(angle) * radius * 0.5;
        
        ctx.fillStyle = color.bright;
        ctx.globalAlpha = 0.7 + MathUtils.wave(time + i, 6, 0.3);
        ctx.beginPath();
        ctx.ellipse(coinX, coinY, 6, 3, angle, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Main golden body with metallic sheen
    const bodyGrad = ctx.createRadialGradient(-size * 0.2, -size * 0.5, 0, 0, -size * 0.3, size * 0.6);
    bodyGrad.addColorStop(0, color.bright);
    bodyGrad.addColorStop(0.4, color.base);
    bodyGrad.addColorStop(0.8, color.dark);
    bodyGrad.addColorStop(1, color.shadow);
    
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.3, size * 0.4, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Golden crown
    ctx.fillStyle = color.bright;
    ctx.shadowColor = color.bright;
    ctx.shadowBlur = 15 * shimmer;
    const crownPoints = 5;
    ctx.beginPath();
    for (let i = 0; i < crownPoints * 2; i++) {
      const angle = (i / (crownPoints * 2)) * Math.PI * 2 - Math.PI / 2;
      const radius = (i % 2 === 0) ? size * 0.35 : size * 0.25;
      const px = Math.cos(angle) * radius;
      const py = -size * 0.8 + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Golden eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-size * 0.15, -size * 0.4, size * 0.08, 0, Math.PI * 2);
    ctx.arc(size * 0.15, -size * 0.4, size * 0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    
    // Health bar
    this.renderHealthBar(ctx, x, y - size * 1.2, size * 1.2, boss.currentHp, boss.maxHp, color);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // GIFT BOSS RENDERING - Colorful with ribbon and sparkles
  // ═════════════════════════════════════════════════════════════════════════
  static renderGiftBoss(ctx, boss, time, glow) {
    // Use specific candy colors for each gift boss
    let color = RUNNER_PALETTE.gift;
    if (boss.id === 'candy_king' || boss.id === 'sugar_beast') {
      color = RUNNER_PALETTE.candy;
    } else if (boss.id === 'chocolate_golem') {
      color = RUNNER_PALETTE.chocolate;
    } else if (boss.id === 'gummy_dragon') {
      color = NEON_PALETTE.emerald;
    } else if (boss.id === 'gift_king') {
      color = RUNNER_PALETTE.gold; // Gift King is golden
    }

    const size = boss.size || 56;
    const x = boss.x;
    const y = boss.y;
    const bounce = Math.abs(MathUtils.wave(time, 4, size * 0.1));

    ctx.save();
    ctx.translate(x, y + bounce);

    // Rainbow sparkles
    if (glow) {
      const sparkleColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + time * 3;
        const radius = size * (0.6 + MathUtils.wave(time + i * 0.5, 5, 0.2));
        const sparkleX = Math.cos(angle) * radius;
        const sparkleY = -size * 0.3 + Math.sin(angle) * radius;
        
        ctx.fillStyle = sparkleColors[i % sparkleColors.length];
        ctx.globalAlpha = 0.8 * (0.5 + MathUtils.wave(time * 2 + i, 6, 0.5));
        ctx.beginPath();
        const sparkleSize = 3 + MathUtils.wave(time + i, 8, 2);
        ctx.moveTo(sparkleX, sparkleY - sparkleSize);
        ctx.lineTo(sparkleX + sparkleSize * 0.3, sparkleY);
        ctx.lineTo(sparkleX, sparkleY + sparkleSize);
        ctx.lineTo(sparkleX - sparkleSize * 0.3, sparkleY);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Gift box body
    ctx.fillStyle = color.base;
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 3;
    ctx.fillRect(-size * 0.35, -size * 0.6, size * 0.7, size * 0.8);
    ctx.strokeRect(-size * 0.35, -size * 0.6, size * 0.7, size * 0.8);

    // Ribbon (vertical)
    ctx.fillStyle = color.bright;
    ctx.fillRect(-size * 0.08, -size * 0.6, size * 0.16, size * 0.8);

    // Ribbon (horizontal)
    ctx.fillRect(-size * 0.35, -size * 0.25, size * 0.7, size * 0.16);

    // Bow on top
    ctx.fillStyle = color.bright;
    ctx.shadowColor = color.bright;
    ctx.shadowBlur = 10;
    // Left bow loop
    ctx.beginPath();
    ctx.arc(-size * 0.2, -size * 0.7, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    // Right bow loop
    ctx.beginPath();
    ctx.arc(size * 0.2, -size * 0.7, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    // Center knot
    ctx.beginPath();
    ctx.arc(0, -size * 0.7, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();

    // Health bar
    this.renderHealthBar(ctx, x, y - size * 1.1, size, boss.currentHp, boss.maxHp, color);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // SILVER BOSS RENDERING - Fast with speed trails
  // ═════════════════════════════════════════════════════════════════════════
  static renderSilverBoss(ctx, boss, time, glow) {
    const color = RUNNER_PALETTE.silver;
    const size = boss.size || 48;
    const x = boss.x;
    const y = boss.y;
    const dash = MathUtils.wave(time, 10, size * 0.15);

    ctx.save();
    ctx.translate(x + dash, y);

    // Speed trails
    if (glow) {
      for (let i = 0; i < 5; i++) {
        ctx.globalAlpha = 0.3 - i * 0.05;
        ctx.fillStyle = color.bright;
        const trailX = -size * 0.3 * (i + 1);
        ctx.fillRect(trailX, -size * 0.4, size * 0.2, size * 0.8);
      }
      ctx.globalAlpha = 1;
    }

    // Silver metallic body
    const bodyGrad = ctx.createLinearGradient(-size * 0.3, -size * 0.5, size * 0.3, size * 0.3);
    bodyGrad.addColorStop(0, color.bright);
    bodyGrad.addColorStop(0.5, color.base);
    bodyGrad.addColorStop(1, color.dark);
    
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    // Aerodynamic shape
    ctx.moveTo(size * 0.4, -size * 0.2);
    ctx.lineTo(0, -size * 0.5);
    ctx.lineTo(-size * 0.35, -size * 0.2);
    ctx.lineTo(-size * 0.35, size * 0.2);
    ctx.lineTo(0, size * 0.5);
    ctx.lineTo(size * 0.4, size * 0.2);
    ctx.closePath();
    ctx.fill();

    // Silver highlights
    ctx.strokeStyle = color.bright;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();

    // Health bar
    this.renderHealthBar(ctx, x, y - size * 0.8, size, boss.currentHp, boss.maxHp, color);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // ARMOR BOSS RENDERING - Heavy plated appearance
  // ═════════════════════════════════════════════════════════════════════════
  static renderArmorBoss(ctx, boss, time, glow) {
    const color = { base: '#708090', bright: '#a9a9a9', dark: '#2f4f4f', shadow: '#1a1a1a' };
    const size = boss.size || 64;
    const x = boss.x;
    const y = boss.y;
    const breathe = MathUtils.wave(time, 2, 0.03) + 1;

    ctx.save();
    ctx.translate(x, y);

    // Fortress aura
    if (glow) {
      ctx.strokeStyle = color.bright;
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.4;
      ctx.strokeRect(-size * 0.5, -size * 0.7, size, size * 1.2);
      ctx.globalAlpha = 1;
    }

    // Heavy armor plates
    ctx.scale(breathe, breathe);
    
    // Chest plate
    ctx.fillStyle = color.dark;
    ctx.fillRect(-size * 0.4, -size * 0.5, size * 0.8, size * 0.7);
    
    // Plate segments
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = i % 2 === 0 ? color.base : color.dark;
      ctx.fillRect(-size * 0.4, -size * 0.5 + i * size * 0.175, size * 0.8, size * 0.15);
    }

    // Shoulder guards
    ctx.fillStyle = color.base;
    ctx.beginPath();
    ctx.arc(-size * 0.5, -size * 0.4, size * 0.2, 0, Math.PI * 2);
    ctx.arc(size * 0.5, -size * 0.4, size * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Helmet with visor
    ctx.fillStyle = color.dark;
    ctx.beginPath();
    ctx.arc(0, -size * 0.7, size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Visor slit
    ctx.fillStyle = '#ff0000';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 10;
    ctx.fillRect(-size * 0.2, -size * 0.72, size * 0.4, size * 0.08);
    ctx.shadowBlur = 0;

    ctx.restore();

    // Health bar
    this.renderHealthBar(ctx, x, y - size * 1.1, size * 1.2, boss.currentHp, boss.maxHp, color);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // PET BOSS RENDERING - Beast-like with summoned cubs
  // ═════════════════════════════════════════════════════════════════════════
  static renderPetBoss(ctx, boss, time, glow) {
    const color = { base: '#ff4500', bright: '#ff7f50', dark: '#8b2500', shadow: '#4b1300' };
    const size = boss.size || 52;
    const x = boss.x;
    const y = boss.y;
    const prowl = MathUtils.wave(time, 5, size * 0.05);

    ctx.save();
    ctx.translate(x + prowl, y);

    // Fire aura
    if (glow) {
      const flameCount = 8;
      for (let i = 0; i < flameCount; i++) {
        const angle = (i / flameCount) * Math.PI * 2 + time * 4;
        const radius = size * 0.5;
        const flameX = Math.cos(angle) * radius;
        const flameY = -size * 0.3 + Math.sin(angle) * radius * 0.5;
        const flameHeight = size * 0.3 + MathUtils.wave(time * 3 + i, 10, size * 0.1);
        
        const flameGrad = ctx.createLinearGradient(flameX, flameY, flameX, flameY - flameHeight);
        flameGrad.addColorStop(0, color.bright);
        flameGrad.addColorStop(0.5, color.base);
        flameGrad.addColorStop(1, color.base + '00');
        
        ctx.fillStyle = flameGrad;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(flameX, flameY);
        ctx.lineTo(flameX - size * 0.08, flameY - flameHeight);
        ctx.lineTo(flameX + size * 0.08, flameY - flameHeight);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Beast body (quadruped)
    ctx.fillStyle = color.dark;
    ctx.strokeStyle = color.base;
    ctx.lineWidth = 2;
    
    // Main body
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.2, size * 0.35, size * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Head
    ctx.beginPath();
    ctx.ellipse(size * 0.25, -size * 0.4, size * 0.2, size * 0.18, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Glowing eyes
    ctx.fillStyle = color.bright;
    ctx.shadowColor = color.bright;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(size * 0.3, -size * 0.45, size * 0.05, 0, Math.PI * 2);
    ctx.arc(size * 0.2, -size * 0.42, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Legs
    ctx.strokeStyle = color.base;
    ctx.lineWidth = size * 0.08;
    ctx.lineCap = 'round';
    // Front legs
    ctx.beginPath();
    ctx.moveTo(size * 0.15, -size * 0.05);
    ctx.lineTo(size * 0.15, size * 0.25);
    ctx.moveTo(size * 0.25, -size * 0.05);
    ctx.lineTo(size * 0.25, size * 0.25);
    // Back legs
    ctx.moveTo(-size * 0.1, -size * 0.05);
    ctx.lineTo(-size * 0.1, size * 0.25);
    ctx.moveTo(-size * 0.2, -size * 0.05);
    ctx.lineTo(-size * 0.2, size * 0.25);
    ctx.stroke();

    ctx.restore();

    // Health bar
    this.renderHealthBar(ctx, x, y - size * 0.8, size, boss.currentHp, boss.maxHp, color);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // KEY BOSS RENDERING - Keys orbiting with lock symbols
  // ═══════════════════════════════════════════════════════════════════════════
  static renderKeyBoss(ctx, boss, time, glow) {
    const color = RUNNER_PALETTE.gold;
    const size = boss.size || 58;
    const x = boss.x;
    const y = boss.y;

    ctx.save();
    ctx.translate(x, y);

    // Orbiting keys
    if (glow) {
      const keyCount = 6;
      for (let i = 0; i < keyCount; i++) {
        const angle = (i / keyCount) * Math.PI * 2 + time * 2;
        const radius = size * 0.6;
        const keyX = Math.cos(angle) * radius;
        const keyY = -size * 0.4 + Math.sin(angle) * radius * 0.7;
        
        ctx.save();
        ctx.translate(keyX, keyY);
        ctx.rotate(angle);
        
        // Key shape
        ctx.fillStyle = color.bright;
        ctx.shadowColor = color.bright;
        ctx.shadowBlur = 8;
        // Key shaft
        ctx.fillRect(-size * 0.15, -size * 0.02, size * 0.15, size * 0.04);
        // Key head
        ctx.beginPath();
        ctx.arc(-size * 0.15, 0, size * 0.06, 0, Math.PI * 2);
        ctx.fill();
        // Key teeth
        ctx.fillRect(0, 0, size * 0.04, size * 0.06);
        ctx.fillRect(size * 0.05, 0, size * 0.04, size * 0.08);
        ctx.shadowBlur = 0;
        
        ctx.restore();
      }
    }

    // Central keyhole/lock body
    const lockGrad = ctx.createRadialGradient(0, -size * 0.3, 0, 0, -size * 0.3, size * 0.4);
    lockGrad.addColorStop(0, color.bright);
    lockGrad.addColorStop(0.5, color.base);
    lockGrad.addColorStop(1, color.dark);
    
    ctx.fillStyle = lockGrad;
    ctx.strokeStyle = color.dark;
    ctx.lineWidth = 3;
    
    // Lock body (rectangular)
    ctx.fillRect(-size * 0.3, -size * 0.5, size * 0.6, size * 0.6);
    ctx.strokeRect(-size * 0.3, -size * 0.5, size * 0.6, size * 0.6);

    // Keyhole
    ctx.fillStyle = '#000000';
    ctx.shadowColor = color.bright;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, -size * 0.25, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-size * 0.04, -size * 0.25, size * 0.08, size * 0.2);
    ctx.shadowBlur = 0;

    // Shackle
    ctx.strokeStyle = color.base;
    ctx.lineWidth = size * 0.08;
    ctx.beginPath();
    ctx.arc(0, -size * 0.5, size * 0.2, Math.PI, Math.PI * 2);
    ctx.stroke();

    ctx.restore();

    // Health bar
    this.renderHealthBar(ctx, x, y - size * 0.9, size, boss.currentHp, boss.maxHp, color);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // EPIC BOSS RENDERING (miniBoss / bigBoss) - Massive with multiple effects
  // ═════════════════════════════════════════════════════════════════════════
  static renderEpicBoss(ctx, boss, time, glow) {
    const colorKey = boss.element || 'purple';
    const color = NEON_PALETTE[ELEMENT_COLORS[colorKey]] || NEON_PALETTE.purple;
    const size = boss.size || 80;
    const x = boss.x;
    const y = boss.y;
    const pulse = MathUtils.wave(time, 2, 0.15) + 1;
    const hover = MathUtils.wave(time, 3, size * 0.12);

    ctx.save();
    ctx.translate(x, y + hover);
    ctx.scale(pulse, pulse);

    // Epic multi-layer aura
    if (glow) {
      for (let layer = 0; layer < 4; layer++) {
        ctx.strokeStyle = color.bright;
        ctx.lineWidth = 4 - layer;
        ctx.globalAlpha = 0.4 - layer * 0.08;
        ctx.beginPath();
        ctx.arc(0, -size * 0.4, size * (0.8 + layer * 0.2), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Power particles
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2 + time * 3;
        const radius = size * 0.9 + MathUtils.wave(time + i * 0.3, 5, size * 0.1);
        const px = Math.cos(angle) * radius;
        const py = -size * 0.4 + Math.sin(angle) * radius;
        
        ctx.fillStyle = color.bright;
        ctx.globalAlpha = 0.7 + MathUtils.wave(time * 2 + i, 8, 0.3);
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Massive core with gradient
    const coreGrad = ctx.createRadialGradient(0, -size * 0.4, 0, 0, -size * 0.4, size * 0.5);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.2, color.bright);
    coreGrad.addColorStop(0.6, color.base);
    coreGrad.addColorStop(1, color.dark);
    
    ctx.fillStyle = coreGrad;
    ctx.shadowColor = color.bright;
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(0, -size * 0.4, size * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Power spikes
    const spikeCount = 12;
    for (let i = 0; i < spikeCount; i++) {
      const angle = (i / spikeCount) * Math.PI * 2 + time;
      const innerRadius = size * 0.5;
      const outerRadius = size * 0.75;
      
      const x1 = Math.cos(angle) * innerRadius;
      const y1 = -size * 0.4 + Math.sin(angle) * innerRadius;
      const x2 = Math.cos(angle) * outerRadius;
      const y2 = -size * 0.4 + Math.sin(angle) * outerRadius;
      
      const spikeGrad = ctx.createLinearGradient(x1, y1, x2, y2);
      spikeGrad.addColorStop(0, color.bright);
      spikeGrad.addColorStop(1, color.base + '00');
      
      ctx.strokeStyle = spikeGrad;
      ctx.lineWidth = size * 0.1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    ctx.restore();

    // Epic health bar
    this.renderHealthBar(ctx, x, y - size * 1.3, size * 1.5, boss.currentHp, boss.maxHp, color);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // HEALTH BAR (runner boss style)
  // ═════════════════════════════════════════════════════════════════════════
  static renderHealthBar(ctx, x, y, width, currentHp, maxHp, color) {
    const barWidth = width * 1.2;
    const barHeight = 8;
    const hpPercent = Math.max(0, Math.min(1, currentHp / maxHp));

    ctx.save();
    ctx.translate(x - barWidth / 2, y);

    // Background
    ctx.fillStyle = '#000000cc';
    ctx.fillRect(0, 0, barWidth, barHeight);

    // HP fill with gradient
    const fillGrad = ctx.createLinearGradient(0, 0, barWidth * hpPercent, 0);
    fillGrad.addColorStop(0, color.bright);
    fillGrad.addColorStop(0.5, color.base);
    fillGrad.addColorStop(1, color.dark);
    
    ctx.fillStyle = fillGrad;
    ctx.fillRect(2, 2, (barWidth - 4) * hpPercent, barHeight - 4);

    // Border with glow
    ctx.strokeStyle = color.bright;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.8;
    ctx.strokeRect(0, 0, barWidth, barHeight);
    ctx.globalAlpha = 1;

    ctx.restore();
  }
}

export default RunnerBossSprites;

