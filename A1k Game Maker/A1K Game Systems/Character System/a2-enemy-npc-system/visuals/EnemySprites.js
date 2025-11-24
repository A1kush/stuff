// 🎨 ENEMY SPRITES - HIGH QUALITY
// Procedural sprite rendering using full AI robot system techniques
// Enhanced quality with detailed rendering, gradients, and animations

// Tech/Cyberpunk color palette from AI robot system
const TECH_PALETTE = {
  core: '#00d4ff',
  energy: '#5ba3ff',
  accent: '#5bffaa',
  warning: '#ff6b35',
  critical: '#ff4444',
  shield: '#74b9ff',
  stealth: '#9b59b6',
  dark: '#0B1421',
  bodyDark: '#101728',
  bodyDarker: '#1a1a2e',
};

// Element colors with expanded palette
const ELEMENT_COLORS = {
  fire: { primary: '#ff6b35', secondary: '#f7931e', glow: '#ffb347', accent: '#d32f2f' },
  ice: { primary: '#4ecdc4', secondary: '#45b7d1', glow: '#a8e6cf', accent: '#00acc1' },
  lightning: { primary: '#ffeb3b', secondary: '#ffc107', glow: '#fff59d', accent: '#fdd835' },
  nature: { primary: '#4caf50', secondary: '#66bb6a', glow: '#a5d6a7', accent: '#388e3c' },
  dark: { primary: '#2c3e50', secondary: '#34495e', glow: '#7f8c8d', accent: '#1a252f' },
  light: { primary: '#ffd93d', secondary: '#ffffff', glow: '#fffacd', accent: '#fbc02d' },
  neutral: { primary: '#a0a0a0', secondary: '#c0c0c0', glow: '#e0e0e0', accent: '#808080' },
  tech: { primary: '#5ba3ff', secondary: '#00d4ff', glow: '#a8d8ff', accent: '#1976d2' },
  fusion: { primary: '#ff00ff', secondary: '#00ffff', glow: '#ffff00', accent: '#8b00ff' },
  earth: { primary: '#8b4513', secondary: '#a0522d', glow: '#deb887', accent: '#5d4037' },
  wind: { primary: '#87ceeb', secondary: '#b0e0e6', glow: '#e0f2f7', accent: '#4fc3f7' },
};

export class EnemySprites {
  /**
   * Render any entity (enemy, boss, zombie, villain, hero)
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} entity
   * @param {object} options
   */
  static render(ctx, entity, options = {}) {
    const { animTime = 0, glow = true, showHealth = true } = options;

    if (!entity) return;

    // Determine entity category
    if (entity.category === 'walker' || entity.category === 'tank' || entity.category === 'special') {
      this.renderZombie(ctx, entity, animTime, glow);
    } else if (entity.phases) {
      // Boss or Villain
      if (entity.tier === 'SS' && !entity.backstory) {
        this.renderBoss(ctx, entity, animTime, glow);
      } else {
        this.renderVillain(ctx, entity, animTime, glow);
      }
    } else if (entity.category === 'ally' || entity.category === 'rival' || entity.category === 'neutral') {
      this.renderHero(ctx, entity, animTime, glow);
    } else {
      this.renderEnemy(ctx, entity, animTime, glow);
    }

    // Health bar
    if (showHealth && entity.currentHp !== undefined && entity.maxHp) {
      this.renderHealthBar(ctx, entity);
    }
  }

  /**
   * Render standard enemy
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} enemy
   * @param {number} animTime
   * @param {boolean} glow
   */
  static renderEnemy(ctx, enemy, animTime, glow) {
    const colors = ELEMENT_COLORS[enemy.element] || ELEMENT_COLORS.neutral;
    const time = animTime / 1000;
    const size = enemy.size || 32;
    const bob = Math.sin(time * 8) * 2;

    ctx.save();
    ctx.translate(enemy.x, enemy.y + bob);

    // Enhanced energy glow (AI robot style)
    if (glow) {
      ctx.save();
      ctx.globalAlpha = 0.3 + Math.sin(time * 10) * 0.15;
      const glowGrad = ctx.createRadialGradient(0, -size * 0.3, 0, 0, -size * 0.4, size * 1.2);
      glowGrad.addColorStop(0, colors.glow + '88');
      glowGrad.addColorStop(1, colors.glow + '00');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(0, -size * 0.3, size * 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Determine shape based on sprite.shape
    const shape = enemy.sprite?.shape || 'circle';
    
    switch(shape) {
      case 'blob':
        this.renderBlob(ctx, colors, size, time, glow);
        break;
      case 'humanoid':
        this.renderHumanoid(ctx, colors, size, time, glow);
        break;
      case 'skeleton':
        this.renderSkeleton(ctx, colors, size, time, glow);
        break;
      case 'wings':
        this.renderWings(ctx, colors, size, time, glow);
        break;
      case 'spider':
        this.renderSpider(ctx, colors, size, time, glow);
        break;
      case 'demon':
        this.renderDemon(ctx, colors, size, time, glow);
        break;
      case 'elemental':
        this.renderElemental(ctx, colors, size, time, glow, enemy.element);
        break;
      default:
        this.renderBasic(ctx, colors, size, time, glow);
    }

    ctx.restore();
  }

  /**
   * Render boss (large, multi-phase)
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} boss
   * @param {number} animTime
   * @param {boolean} glow
   */
  static renderBoss(ctx, boss, animTime, glow) {
    const phase = boss.phases ? boss.phases[boss.phaseIndex || 0] : boss;
    const colors = ELEMENT_COLORS[boss.element] || ELEMENT_COLORS.neutral;
    const time = animTime / 1000;
    const size = boss.size || 64;
    const rotate = time * 0.5;
    const pulse = 0.9 + Math.sin(time * 3) * 0.1;

    ctx.save();
    ctx.translate(boss.x, boss.y);

    // AI robot style: Multi-layer aura system
    if (glow) {
      // Outer aura
      ctx.strokeStyle = colors.glow;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.3 + Math.sin(time * 4) * 0.2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, size * (0.7 + i * 0.15), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Rotating outer ring (AI robot style)
    ctx.save();
    ctx.rotate(rotate);
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2);
    ctx.stroke();
    
    // Ring nodes
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i;
      const px = Math.cos(angle) * size * 0.55;
      const py = Math.sin(angle) * size * 0.55;
      ctx.fillStyle = colors.glow;
      ctx.beginPath();
      ctx.arc(px, py, size * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Central core with gradient (AI robot style)
    const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.4 * pulse);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.3, colors.primary);
    coreGrad.addColorStop(1, colors.accent || TECH_PALETTE.bodyDarker);
    ctx.fillStyle = coreGrad;
    ctx.shadowColor = colors.glow;
    ctx.shadowBlur = 20 * pulse;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Energy spikes (enhanced)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + time;
      const innerRadius = size * 0.55;
      const outerRadius = size * 0.75;
      const x1 = Math.cos(angle) * innerRadius;
      const y1 = Math.sin(angle) * innerRadius;
      const x2 = Math.cos(angle) * outerRadius;
      const y2 = Math.sin(angle) * outerRadius;
      
      // Gradient spike
      const spikeGrad = ctx.createLinearGradient(x1, y1, x2, y2);
      spikeGrad.addColorStop(0, colors.primary);
      spikeGrad.addColorStop(1, colors.glow + '00');
      
      ctx.strokeStyle = spikeGrad;
      ctx.lineWidth = size * 0.08;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Inner detail lines
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 / 12) * i + time * 2;
      const px = Math.cos(angle) * size * 0.2;
      const py = Math.sin(angle) * size * 0.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(px, py);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  /**
   * Render zombie with decay effects
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} zombie
   * @param {number} animTime
   * @param {boolean} glow
   */
  static renderZombie(ctx, zombie, animTime, glow) {
    const time = animTime / 1000;
    const size = zombie.size || 30;
    const shamble = Math.sin(time * 2) * 2;

    ctx.save();
    ctx.translate(zombie.x, zombie.y + shamble);

    // Zombie green glow
    if (glow) {
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#4caf50';
    }

    // Body (decayed)
    ctx.fillStyle = zombie.sprite?.color || '#388e3c';
    ctx.strokeStyle = '#2e7d32';
    ctx.lineWidth = 2;

    // Different shapes for different zombie types
    if (zombie.category === 'tank') {
      // Large bulky form
      ctx.fillRect(-size * 0.5, -size * 0.8, size, size * 1.2);
      ctx.strokeRect(-size * 0.5, -size * 0.8, size, size * 1.2);
    } else if (zombie.category === 'special') {
      // Distorted form
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.5, size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      // Standard humanoid
      ctx.fillRect(-size * 0.4, -size * 0.7, size * 0.8, size);
      ctx.strokeRect(-size * 0.4, -size * 0.7, size * 0.8, size);
    }

    // Glowing eyes
    ctx.fillStyle = '#ffeb3b';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ffeb3b';
    ctx.beginPath();
    ctx.arc(-size * 0.2, -size * 0.4, size * 0.08, 0, Math.PI * 2);
    ctx.arc(size * 0.2, -size * 0.4, size * 0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.restore();
  }

  /**
   * Render villain (large 64x96 sprite)
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} villain
   * @param {number} animTime
   * @param {boolean} glow
   */
  static renderVillain(ctx, villain, animTime, glow) {
    const phase = villain.phases ? villain.phases[villain.phaseIndex || 0] : villain;
    const time = animTime / 1000;
    const size = villain.size || 64;

    ctx.save();
    ctx.translate(villain.x, villain.y);

    // Villain aura (phase-dependent)
    if (glow) {
      const intensity = (villain.phaseIndex + 1) * 8;
      ctx.shadowBlur = intensity + Math.sin(time * 4) * 4;
      ctx.shadowColor = phase.sprite?.glow || '#ff00ff';
    }

    // Large imposing form
    ctx.fillStyle = phase.sprite?.color || '#2c3e50';
    ctx.strokeStyle = phase.sprite?.glow || '#9c27b0';
    ctx.lineWidth = 3;

    // Main body
    ctx.fillRect(-size * 0.35, -size * 0.8, size * 0.7, size * 1.3);
    ctx.strokeRect(-size * 0.35, -size * 0.8, size * 0.7, size * 1.3);

    // Power core (center)
    ctx.fillStyle = phase.sprite?.glow || '#ff00ff';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (menacing)
    ctx.fillStyle = '#ff4444';
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(-size * 0.15, -size * 0.5, size * 0.06, 0, Math.PI * 2);
    ctx.arc(size * 0.15, -size * 0.5, size * 0.06, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.restore();
  }

  /**
   * Render superhero with powers
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} hero
   * @param {number} animTime
   * @param {boolean} glow
   */
  static renderHero(ctx, hero, animTime, glow) {
    const colors = ELEMENT_COLORS[hero.element] || ELEMENT_COLORS.tech;
    const time = animTime / 1000;
    const size = hero.size || 48;

    ctx.save();
    ctx.translate(hero.x, hero.y);

    // Hero aura
    if (glow) {
      ctx.shadowBlur = 15;
      ctx.shadowColor = colors.glow;
    }

    // Heroic form
    ctx.fillStyle = colors.primary;
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 2;

    // Cape
    if (hero.sprite?.wings || hero.category === 'ally') {
      const capeWidth = size * 0.6;
      const capeHeight = size * 0.8;
      const wave = Math.sin(time * 3) * size * 0.1;

      ctx.fillStyle = colors.secondary;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.moveTo(-size * 0.2, -size * 0.6);
      ctx.quadraticCurveTo(-capeWidth + wave, 0, -capeWidth * 0.5, capeHeight);
      ctx.lineTo(capeWidth * 0.5, capeHeight);
      ctx.quadraticCurveTo(capeWidth + wave, 0, size * 0.2, -size * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Body
    ctx.fillStyle = colors.primary;
    ctx.fillRect(-size * 0.3, -size * 0.6, size * 0.6, size * 0.9);
    ctx.strokeRect(-size * 0.3, -size * 0.6, size * 0.6, size * 0.9);

    // Hero symbol (chest)
    ctx.fillStyle = colors.glow;
    ctx.beginPath();
    ctx.arc(0, -size * 0.2, size * 0.12, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // ============= HELPER RENDERERS =============

  static renderBlob(ctx, colors, size, time, glow) {
    const bounce = Math.abs(Math.sin(time * 4)) * size * 0.1;
    
    if (glow) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = colors.glow;
    }

    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.ellipse(0, bounce, size * 0.6, size * 0.5 - bounce * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Highlights
    ctx.fillStyle = colors.glow;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(-size * 0.2, -size * 0.1, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.shadowBlur = 0;
  }

  static renderHumanoid(ctx, colors, size, time, glow) {
    // AI robot style humanoid with detailed body
    const armSwing = Math.sin(time * 10) * 0.45;

    if (glow) {
      ctx.shadowBlur = 12;
      ctx.shadowColor = colors.glow;
    }

    // Body (curved, robot-like)
    ctx.fillStyle = TECH_PALETTE.bodyDark;
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-size * 0.28, -size * 0.6);
    ctx.quadraticCurveTo(-size * 0.35, -size * 0.2, -size * 0.25, size * 0.2);
    ctx.quadraticCurveTo(-size * 0.15, size * 0.35, 0, size * 0.4);
    ctx.quadraticCurveTo(size * 0.15, size * 0.35, size * 0.25, size * 0.2);
    ctx.quadraticCurveTo(size * 0.35, -size * 0.2, size * 0.28, -size * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Visor
    ctx.fillStyle = colors.primary;
    ctx.fillRect(-size * 0.25, -size * 0.55, size * 0.5, size * 0.15);

    // Eyes (glowing)
    ctx.fillStyle = colors.glow;
    ctx.shadowColor = colors.glow;
    ctx.shadowBlur = 8;
    ctx.fillRect(-size * 0.15, -size * 0.52, size * 0.1, size * 0.1);
    ctx.fillRect(size * 0.05, -size * 0.52, size * 0.1, size * 0.1);
    ctx.shadowBlur = 0;

    // Arms (animated)
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = size * 0.08;
    ctx.lineCap = 'round';
    
    ctx.save();
    ctx.translate(-size * 0.25, -size * 0.2);
    ctx.rotate(-armSwing);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size * 0.15, size * 0.4);
    ctx.stroke();
    ctx.restore();
    
    ctx.save();
    ctx.translate(size * 0.25, -size * 0.2);
    ctx.rotate(armSwing);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size * 0.15, size * 0.4);
    ctx.stroke();
    ctx.restore();

    // Energy core (chest)
    ctx.fillStyle = colors.glow;
    ctx.shadowColor = colors.glow;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.12, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  static renderSkeleton(ctx, colors, size, time, glow) {
    if (glow) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = colors.glow;
    }

    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    // Skull
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.arc(0, -size * 0.7, size * 0.22, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (glowing)
    ctx.fillStyle = '#ff4444';
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 8;
    ctx.fillRect(-size * 0.12, -size * 0.75, size * 0.08, size * 0.1);
    ctx.fillRect(size * 0.04, -size * 0.75, size * 0.08, size * 0.1);
    ctx.shadowBlur = 0;

    // Spine
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.5);
    ctx.lineTo(0, size * 0.3);
    ctx.stroke();

    // Ribs
    for (let i = 0; i < 4; i++) {
      const y = -size * 0.3 + i * size * 0.15;
      ctx.beginPath();
      ctx.moveTo(-size * 0.2, y);
      ctx.lineTo(size * 0.2, y);
      ctx.stroke();
    }
  }

  static renderWings(ctx, colors, size, time, glow) {
    const flap = Math.sin(time * 6) * 0.3;

    if (glow) {
      ctx.shadowBlur = 8;
      ctx.shadowColor = colors.glow;
    }

    // Body
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.2, size * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    ctx.save();
    ctx.rotate(flap);
    ctx.fillStyle = colors.secondary;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size * 0.6, -size * 0.3);
    ctx.lineTo(-size * 0.4, size * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.rotate(-flap);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size * 0.6, -size * 0.3);
    ctx.lineTo(size * 0.4, size * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.shadowBlur = 0;
  }

  static renderSpider(ctx, colors, size, time, glow) {
    if (glow) {
      ctx.shadowBlur = 8;
      ctx.shadowColor = colors.glow;
    }

    // Body
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.35, size * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs (8)
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 2;
    const legWave = Math.sin(time * 5) * 0.2;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI - Math.PI / 2;
      const legLength = size * 0.6;
      
      // Left legs
      ctx.beginPath();
      ctx.moveTo(-size * 0.2, 0);
      ctx.lineTo(-size * 0.2 + Math.cos(angle + legWave) * legLength, Math.sin(angle + legWave) * legLength);
      ctx.stroke();
      
      // Right legs
      ctx.beginPath();
      ctx.moveTo(size * 0.2, 0);
      ctx.lineTo(size * 0.2 + Math.cos(Math.PI - angle - legWave) * legLength, Math.sin(Math.PI - angle - legWave) * legLength);
      ctx.stroke();
    }

    // Eyes (multiple)
    ctx.fillStyle = colors.glow;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(-size * 0.2 + i * size * 0.13, -size * 0.1, size * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
  }

  static renderDemon(ctx, colors, size, time, glow) {
    if (glow) {
      ctx.shadowBlur = 12;
      ctx.shadowColor = colors.glow;
    }

    // Body
    ctx.fillStyle = colors.primary;
    ctx.fillRect(-size * 0.35, -size * 0.6, size * 0.7, size);

    // Horns
    ctx.fillStyle = colors.secondary;
    ctx.beginPath();
    ctx.moveTo(-size * 0.3, -size * 0.8);
    ctx.lineTo(-size * 0.2, -size * 0.6);
    ctx.lineTo(-size * 0.35, -size * 0.6);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(size * 0.3, -size * 0.8);
    ctx.lineTo(size * 0.2, -size * 0.6);
    ctx.lineTo(size * 0.35, -size * 0.6);
    ctx.closePath();
    ctx.fill();

    // Glowing eyes
    ctx.fillStyle = '#ff4444';
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 10;
    ctx.fillRect(-size * 0.15, -size * 0.55, size * 0.1, size * 0.12);
    ctx.fillRect(size * 0.05, -size * 0.55, size * 0.1, size * 0.12);

    ctx.shadowBlur = 0;
  }

  static renderElemental(ctx, colors, size, time, glow, element) {
    const pulse = 0.9 + Math.sin(time * 4) * 0.1;

    if (glow) {
      ctx.shadowBlur = 15 * pulse;
      ctx.shadowColor = colors.glow;
    }

    // Swirling elemental form
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + time * 2;
      const radius = size * 0.5 * pulse + Math.sin(time * 3 + i) * size * 0.1;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // Core
    ctx.fillStyle = colors.glow;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.2 * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  static renderBasic(ctx, colors, size, time, glow) {
    if (glow) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = colors.glow;
    }

    ctx.fillStyle = colors.primary;
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Eyes
    ctx.fillStyle = colors.glow;
    ctx.fillRect(-size * 0.2, -size * 0.1, size * 0.12, size * 0.12);
    ctx.fillRect(size * 0.08, -size * 0.1, size * 0.12, size * 0.12);

    ctx.shadowBlur = 0;
  }

  /**
   * Render health bar
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} entity
   */
  static renderHealthBar(ctx, entity) {
    const barWidth = entity.size * 1.5 || 40;
    const barHeight = 6;
    const yOffset = -(entity.size || 32) - 15;

    ctx.save();
    ctx.translate(entity.x, entity.y + yOffset);

    // Background
    ctx.fillStyle = '#000000';
    ctx.globalAlpha = 0.5;
    ctx.fillRect(-barWidth / 2, 0, barWidth, barHeight);
    ctx.globalAlpha = 1;

    // Health (colored by percentage)
    const hpPercent = entity.currentHp / entity.maxHp;
    let hpColor = '#4caf50';
    if (hpPercent < 0.3) hpColor = '#f44336';
    else if (hpPercent < 0.6) hpColor = '#ff9800';

    ctx.fillStyle = hpColor;
    ctx.fillRect(-barWidth / 2, 0, barWidth * hpPercent, barHeight);

    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(-barWidth / 2, 0, barWidth, barHeight);

    ctx.restore();
  }
}

