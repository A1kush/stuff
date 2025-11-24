/**
 * PROJECTILE VISUAL EFFECTS RENDERER
 * 
 * Advanced rendering system for combat projectiles with multi-layer effects
 * Ported from A1_BEST_SKILLS.html ProjectileSprite class
 * 
 * Features:
 * - Multi-layer particle rendering (3-7 layers per effect)
 * - Dynamic shadows and glows
 * - Rotation and fade animations
 * - Element-based color palettes
 * - Procedural particle systems
 */

class ProjectileRenderer {
  constructor() {
    // Element color palettes
    this.ELEMENT_COLORS = {
      PHYSICAL: { primary: '#ff0000', secondary: '#000000', glow: '#ff0000' },
      FIRE: { primary: '#ff6600', secondary: '#ff0000', glow: '#ffaa00' },
      ICE: { primary: '#00ffff', secondary: '#0080ff', glow: '#87ceeb' },
      LIGHTNING: { primary: '#ffff00', secondary: '#ffffff', glow: '#ffff00' },
      SHADOW: { primary: '#000000', secondary: '#660066', glow: '#ff00ff' },
      LIGHT: { primary: '#ffffff', secondary: '#ffff00', glow: '#ffffff' },
      PLASMA: { primary: '#00ffff', secondary: '#0080ff', glow: '#00ffff' },
      ENERGY: { primary: '#00ff00', secondary: '#00ff00', glow: '#88ff88' },
      ARCANE: { primary: '#ff00ff', secondary: '#8800ff', glow: '#ff00ff' },
      SUMMON: { primary: '#ffaa00', secondary: '#ff6600', glow: '#ffff00' }
    };
  }

  /**
   * Render X-wave projectile (Red/Black slashing X)
   * Used for: Crimson Slash, Power Wave, and similar skills
   */
  renderXWave(ctx, proj) {
    const size = 18 * proj.size;
    const rotation = proj.rotation || 0;
    const fadeAlpha = Math.min(1, (proj.lifetime - proj.age) / proj.lifetime);
    const time = proj.age;

    ctx.save();
    ctx.translate(proj.x, proj.y);
    ctx.rotate(rotation);

    // Outer black energy aura
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = size * 0.7;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 40;
    ctx.globalAlpha = fadeAlpha * 0.4;

    // Draw X (4 lines from center)
    ctx.beginPath();
    ctx.moveTo(-size * 1.2, -size * 1.2);
    ctx.lineTo(size * 1.2, size * 1.2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(size * 1.2, -size * 1.2);
    ctx.lineTo(-size * 1.2, size * 1.2);
    ctx.stroke();

    // Middle red layer (crimson energy)
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = size * 0.5;
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 30;
    ctx.globalAlpha = fadeAlpha * 0.9;

    ctx.beginPath();
    ctx.moveTo(-size * 1.1, -size * 1.1);
    ctx.lineTo(size * 1.1, size * 1.1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(size * 1.1, -size * 1.1);
    ctx.lineTo(-size * 1.1, size * 1.1);
    ctx.stroke();

    // Inner crimson core
    ctx.strokeStyle = '#ff3333';
    ctx.lineWidth = size * 0.3;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 20;
    ctx.globalAlpha = fadeAlpha;

    ctx.beginPath();
    ctx.moveTo(-size, -size);
    ctx.lineTo(size, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(size, -size);
    ctx.lineTo(-size, size);
    ctx.stroke();

    // Bright white center flash
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 25;
    ctx.globalAlpha = fadeAlpha * 0.8;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Energy particles orbiting the X
    ctx.globalAlpha = fadeAlpha * 0.5;
    for (let i = 0; i < 8; i++) {
      const angle = (time * 4) + (i / 8) * Math.PI * 2;
      const dist = size * 0.7;
      const particleX = Math.cos(angle) * dist;
      const particleY = Math.sin(angle) * dist;

      ctx.fillStyle = i % 2 === 0 ? '#ff0000' : '#000000';
      ctx.beginPath();
      ctx.arc(particleX, particleY, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }

    // Trailing energy wisps
    ctx.globalAlpha = fadeAlpha * 0.3;
    for (let i = 0; i < 3; i++) {
      const trailSize = size * (0.5 - i * 0.15);
      const trailDist = -size * (0.5 + i * 0.3);

      ctx.strokeStyle = i % 2 === 0 ? '#ff0000' : '#660000';
      ctx.lineWidth = trailSize * 0.3;
      ctx.shadowBlur = 15;

      ctx.beginPath();
      ctx.moveTo(trailDist - trailSize * 0.5, -trailSize * 0.5);
      ctx.lineTo(trailDist + trailSize * 0.5, trailSize * 0.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(trailDist + trailSize * 0.5, -trailSize * 0.5);
      ctx.lineTo(trailDist - trailSize * 0.5, trailSize * 0.5);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  /**
   * Render plasma projectile (Cyan/Blue energy bolt)
   * Used for: Plasma Blaster, Tech Sphere, energy attacks
   */
  renderPlasma(ctx, proj) {
    const size = 16 * proj.size;
    const fadeAlpha = Math.min(1, proj.lifetime - proj.age);
    const time = proj.age;

    ctx.save();
    ctx.translate(proj.x, proj.y);
    ctx.globalAlpha = fadeAlpha;

    // Outer glow halo
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 30;
    ctx.globalAlpha = fadeAlpha * 0.3;
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Mid layer (electric blue)
    ctx.fillStyle = '#0080ff';
    ctx.shadowBlur = 20;
    ctx.globalAlpha = fadeAlpha * 0.6;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Core (bright white)
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 15;
    ctx.globalAlpha = fadeAlpha;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Electric crackle (rotating segments)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.globalAlpha = fadeAlpha * 0.8;

    for (let i = 0; i < 4; i++) {
      const angle = (time * 5) + (i / 4) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  /**
   * Render crescent slash (Pink/White moon slash)
   * Used for: Luna Slash, Moon Blade, light attacks
   */
  renderSlash(ctx, proj) {
    const size = 16 * proj.size;
    const rotation = proj.rotation || 0;
    const fadeAlpha = Math.min(1, (proj.lifetime - proj.age) / proj.lifetime);

    ctx.save();
    ctx.translate(proj.x, proj.y);
    ctx.rotate(rotation);

    // Outer pink glow
    ctx.strokeStyle = '#ff69b4';
    ctx.lineWidth = size * 0.5;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#ff69b4';
    ctx.shadowBlur = 30;
    ctx.globalAlpha = fadeAlpha * 0.4;

    // Draw crescent arc
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.1, -Math.PI * 0.35, Math.PI * 0.35);
    ctx.stroke();

    // Mid layer (lighter pink)
    ctx.strokeStyle = '#ff88cc';
    ctx.lineWidth = size * 0.35;
    ctx.shadowBlur = 20;
    ctx.globalAlpha = fadeAlpha * 0.7;

    ctx.beginPath();
    ctx.arc(0, 0, size, -Math.PI * 0.35, Math.PI * 0.35);
    ctx.stroke();

    // Inner white core
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = size * 0.2;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 15;
    ctx.globalAlpha = fadeAlpha;

    ctx.beginPath();
    ctx.arc(0, 0, size * 0.9, -Math.PI * 0.35, Math.PI * 0.35);
    ctx.stroke();

    // Sparkles along the arc
    ctx.globalAlpha = fadeAlpha * 0.8;
    for (let i = 0; i < 5; i++) {
      const angle = -Math.PI * 0.35 + (i / 4) * Math.PI * 0.7;
      const sparkX = Math.cos(angle) * size * 0.9;
      const sparkY = Math.sin(angle) * size * 0.9;

      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  /**
   * Render beam attack (Kamehameha-style beam)
   * Used for: Charged beams, laser attacks
   */
  renderBeam(ctx, beam) {
    const startX = beam.x || 0;
    const startY = beam.y || 0;
    const angle = beam.angle || 0;
    const baseWidth = (beam.width || 40) * (beam.chargeLevel || 1);
    const length = beam.length || 400;
    const time = beam.age || 0;
    const alpha = Math.min(1, (beam.lifetime - beam.age) / beam.lifetime);
    const colors = this.ELEMENT_COLORS[beam.element] || this.ELEMENT_COLORS.ENERGY;

    const endX = startX + Math.cos(angle) * length;
    const endY = startY + Math.sin(angle) * length;

    ctx.save();

    // Outer glow layer
    ctx.globalAlpha = alpha * 0.2;
    ctx.strokeStyle = colors.glow;
    ctx.lineWidth = baseWidth * 2;
    ctx.shadowColor = colors.glow;
    ctx.shadowBlur = 50;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Middle energy layer
    ctx.globalAlpha = alpha * 0.6;
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = baseWidth * 1.2;
    ctx.shadowBlur = 30;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Core layer
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = baseWidth * 0.6;
    ctx.shadowBlur = 20;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // White hot center
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = baseWidth * 0.2;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 15;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Particle trail along beam
    ctx.shadowBlur = 10;
    for (let i = 0; i < 10; i++) {
      const t = i / 10;
      const pX = startX + (endX - startX) * t;
      const pY = startY + (endY - startY) * t;
      const scatter = (Math.random() - 0.5) * baseWidth * 0.5;
      const perpAngle = angle + Math.PI / 2;

      ctx.globalAlpha = alpha * 0.6;
      ctx.fillStyle = i % 2 === 0 ? colors.primary : '#ffffff';
      ctx.beginPath();
      ctx.arc(
        pX + Math.cos(perpAngle) * scatter,
        pY + Math.sin(perpAngle) * scatter,
        2 + Math.random() * 3,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  /**
   * Render explosion effect (AoE blast)
   * Used for: Explosions, impact bursts
   */
  renderExplosion(ctx, explosion) {
    const x = explosion.x;
    const y = explosion.y;
    const radius = explosion.radius;
    const progress = explosion.age / explosion.lifetime;
    const alpha = 1 - progress;
    const colors = this.ELEMENT_COLORS[explosion.element] || this.ELEMENT_COLORS.FIRE;

    ctx.save();
    ctx.translate(x, y);

    // Outer shockwave ring
    ctx.globalAlpha = alpha * 0.3;
    ctx.strokeStyle = colors.glow;
    ctx.lineWidth = radius * 0.15;
    ctx.shadowColor = colors.glow;
    ctx.shadowBlur = 30;

    ctx.beginPath();
    ctx.arc(0, 0, radius * (1 + progress * 0.5), 0, Math.PI * 2);
    ctx.stroke();

    // Inner explosion gradient
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, colors.secondary);
    gradient.addColorStop(0.4, colors.primary);
    gradient.addColorStop(0.7, colors.glow);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.globalAlpha = alpha * 0.8;
    ctx.fillStyle = gradient;
    ctx.shadowBlur = 40;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Explosion particles
    const particleCount = 20;
    ctx.shadowBlur = 10;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const dist = radius * (0.6 + progress * 0.8);
      const pX = Math.cos(angle) * dist;
      const pY = Math.sin(angle) * dist;
      const size = 3 + Math.random() * 4;

      ctx.globalAlpha = alpha * (0.6 + Math.random() * 0.4);
      ctx.fillStyle = i % 3 === 0 ? '#ffffff' : (i % 3 === 1 ? colors.primary : colors.secondary);
      ctx.beginPath();
      ctx.arc(pX, pY, size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  /**
   * Render summoned entity visual effect
   * Used for: Shadow Clone, summons, clones
   */
  renderSummon(ctx, summon) {
    const x = summon.x;
    const y = summon.y;
    const size = summon.size || 30;
    const time = summon.age || 0;
    const alpha = Math.min(1, summon.age / 0.5); // Fade in over 0.5s

    ctx.save();
    ctx.translate(x, y);

    // Outer glow
    ctx.globalAlpha = alpha * 0.3;
    ctx.fillStyle = '#ffaa00';
    ctx.shadowColor = '#ffaa00';
    ctx.shadowBlur = 40;
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Rotating energy rings
    ctx.strokeStyle = '#ff6600';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 20;
    ctx.globalAlpha = alpha * 0.6;

    for (let ring = 0; ring < 3; ring++) {
      const ringRadius = size * (0.8 + ring * 0.2);
      const rotation = time * (2 + ring * 0.5);

      ctx.save();
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Center orb
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffff00';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  /**
   * Auto-select and render projectile based on type
   */
  render(ctx, projectile) {
    switch (projectile.type) {
      case 'xwave':
      case 'slash':
        this.renderXWave(ctx, projectile);
        break;
      case 'plasma':
      case 'energy':
        this.renderPlasma(ctx, projectile);
        break;
      case 'crescent':
      case 'moon':
        this.renderSlash(ctx, projectile);
        break;
      case 'beam':
        this.renderBeam(ctx, projectile);
        break;
      case 'explosion':
        this.renderExplosion(ctx, projectile);
        break;
      case 'summon':
        this.renderSummon(ctx, projectile);
        break;
      default:
        // Fallback simple circle render
        this.renderPlasma(ctx, projectile);
    }
  }
}

// Export for use in combat system
if (typeof window !== 'undefined') {
  window.ProjectileRenderer = ProjectileRenderer;
}
