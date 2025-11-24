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
  /**
   * Render summon with character-specific sprite
   */
  renderSummon(ctx, summon) {
    // Convert world coordinates to screen coordinates
    const cameraX = window.gameState?.camera?.x || 0;
    const screenX = summon.x - cameraX;
    const screenY = summon.y;
    
    // Don't render if off-screen
    if (screenX < -100 || screenX > (window.canvas?.width || 2000) + 100) {
      return;
    }
    
    // Create screen-space summon object
    const screenSummon = { ...summon };
    screenSummon.x = screenX;
    screenSummon.y = screenY;
    
    // Route to character-specific sprite renderer
    const characterId = summon.characterId || summon.skillId?.split('_')[0] || 'A1';
    
    switch (characterId) {
      case 'A1':
        this.renderCloneSprite(ctx, screenSummon);
        break;
      case 'UNIQUE':
        this.renderDroneSprite(ctx, screenSummon);
        break;
      case 'MISSY':
        this.renderPetSprite(ctx, screenSummon);
        break;
      default:
        // Fallback generic summon
        this.renderGenericSummon(ctx, screenSummon);
    }
  }

  /**
   * CLONE SPRITE HD - Shadow Clone with Twin Swords (A1 S2)
   * Based on game.html CloneSpriteHD
   */
  renderCloneSprite(ctx, clone) {
    ctx.save();
    ctx.translate(clone.x, clone.y);

    // Shadow silhouette body
    this.drawCloneBody(ctx, clone);

    // Twin swords with glow
    this.drawCloneSwords(ctx, clone);

    // Purple aura (shadow energy)
    this.drawCloneAura(ctx, clone);

    // Mode indicator above head
    if (clone.mode) {
      this.drawModeIndicator(ctx, clone.mode, 0, -35);
    }

    ctx.restore();
  }

  drawCloneBody(ctx, clone) {
    const pulse = Math.sin(performance.now() * 0.003) * 0.1 + 0.9;

    ctx.globalAlpha = 0.7 * pulse;
    ctx.fillStyle = '#1a1a1a';

    // Head
    ctx.fillRect(-4, -12, 8, 8);

    // Body
    ctx.fillRect(-6, -4, 12, 12);

    // Arms
    ctx.fillRect(-10, -2, 4, 8);
    ctx.fillRect(6, -2, 4, 8);

    // Legs
    ctx.fillRect(-6, 8, 4, 8);
    ctx.fillRect(2, 8, 4, 8);

    // Red eyes
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(-3, -10, 2, 2);
    ctx.fillRect(1, -10, 2, 2);

    ctx.globalAlpha = 1.0;
  }

  drawCloneSwords(ctx, clone) {
    const time = performance.now() * 0.004;
    const glowIntensity = Math.sin(time) * 0.3 + 0.7;

    // Left sword (red glow)
    ctx.save();
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 15 * glowIntensity;
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.8;

    ctx.beginPath();
    ctx.moveTo(-12, -4);
    ctx.lineTo(-18, -10);
    ctx.stroke();

    // Blade core
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-12, -4);
    ctx.lineTo(-18, -10);
    ctx.stroke();

    ctx.restore();

    // Right sword (black glow)
    ctx.save();
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 15 * glowIntensity;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.8;

    ctx.beginPath();
    ctx.moveTo(12, -4);
    ctx.lineTo(18, -10);
    ctx.stroke();

    // Blade core
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(12, -4);
    ctx.lineTo(18, -10);
    ctx.stroke();

    ctx.restore();
  }

  drawCloneAura(ctx, clone) {
    const time = performance.now() * 0.002;
    const pulse = Math.sin(time) * 0.2 + 0.8;

    ctx.save();
    ctx.globalAlpha = 0.3 * pulse;

    // Radial gradient aura
    const gradient = ctx.createRadialGradient(0, 0, 5, 0, 0, 25);
    gradient.addColorStop(0, 'rgba(138, 43, 226, 0.4)'); // Purple
    gradient.addColorStop(1, 'rgba(138, 43, 226, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, 25 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Outer ring
    ctx.strokeStyle = '#8B00FF';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4 * pulse;
    ctx.beginPath();
    ctx.arc(0, 0, 20 * pulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  drawModeIndicator(ctx, mode, x, y) {
    const letter = mode === 'hunt' ? 'H' : mode === 'loot' ? 'L' : 'A';
    const color = mode === 'hunt' ? '#ff0000' : mode === 'loot' ? '#FFD700' : '#888888';
    const isActive = mode !== 'assist';

    // Bubble background
    ctx.save();
    ctx.fillStyle = isActive ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();

    // Border
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Letter
    ctx.fillStyle = color;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, x, y);

    // Pulse effect for active modes
    if (isActive) {
      const pulse = Math.sin(performance.now() * 0.005) * 0.3 + 0.7;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = pulse * 0.5;
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * DRONE SPRITE HD - Combat Drone (UNIQUE S2)
   * Based on game.html DroneSpriteHD
   */
  renderDroneSprite(ctx, drone) {
    ctx.save();
    ctx.translate(drone.x, drone.y);

    const pulse = Math.sin(performance.now() * 0.003) * 0.2 + 0.8;

    // Core orb
    this.drawDroneCore(ctx, pulse);

    // Outer tech ring
    this.drawDroneTechRing(ctx, pulse);

    // Rotating segments
    this.drawDroneRotatingSegments(ctx);

    // Heal sparkles (if healing active)
    if (drone.healActive) {
      this.drawDroneHealSparkles(ctx, pulse);
    }

    // Target paint laser (if painting)
    if (drone.paintTarget) {
      this.drawDronePaintLaser(ctx, drone);
    }

    ctx.restore();
  }

  drawDroneCore(ctx, pulse) {
    // Inner glow
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 20 * pulse;
    ctx.fillStyle = '#00FFFF';
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();

    // Bright center
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = pulse * 0.8;
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;
  }

  drawDroneTechRing(ctx, pulse) {
    // Outer ring
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.7 * pulse;
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.stroke();

    // Inner ring
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 1;
    ctx.globalAlpha = pulse;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 1.0;
  }

  drawDroneRotatingSegments(ctx) {
    const rotationSpeed = 0.002;
    const rotation = (performance.now() * rotationSpeed) % (Math.PI * 2);

    ctx.fillStyle = '#00E5FF';
    ctx.globalAlpha = 0.8;

    // 4 segments rotating around core
    for (let i = 0; i < 4; i++) {
      const angle = rotation + (i / 4) * Math.PI * 2;
      const x = Math.cos(angle) * 14;
      const y = Math.sin(angle) * 14;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Tech segment shape
      ctx.fillRect(-2, -3, 4, 6);

      // Inner detail
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-1, -2, 2, 4);

      ctx.restore();
    }

    ctx.globalAlpha = 1.0;
  }

  drawDroneHealSparkles(ctx, pulse) {
    const time = performance.now() * 0.003;

    // Mint/cyan sparkles orbiting
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + time;
      const dist = 18 + pulse * 4;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;

      ctx.fillStyle = '#00FF88';
      ctx.shadowColor = '#00FF88';
      ctx.shadowBlur = 10;
      ctx.globalAlpha = pulse * 0.7;

      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Plus sign in sparkle
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.globalAlpha = pulse * 0.5;
      ctx.beginPath();
      ctx.moveTo(x - 2, y);
      ctx.lineTo(x + 2, y);
      ctx.moveTo(x, y - 2);
      ctx.lineTo(x, y + 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;
  }

  drawDronePaintLaser(ctx, drone) {
    if (!drone.paintTarget) return;

    const target = drone.paintTarget;
    const dx = target.x - drone.x;
    const dy = target.y - drone.y;

    // Thin cyan laser line
    ctx.save();
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 10;
    ctx.globalAlpha = 0.6;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(dx, dy);
    ctx.stroke();

    // Dashed line for tech effect
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(dx, dy);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * PET SPRITE HD - Lucky Battle Pet (MISSY S2)
   * Based on game.html PetSpriteHD
   */
  renderPetSprite(ctx, pet) {
    const bobSpeed = 0.004;
    const bobAmount = 3;
    const bob = Math.sin(performance.now() * bobSpeed) * bobAmount;

    ctx.save();
    ctx.translate(pet.x, pet.y + bob);

    // Gold ribbon trail (if moving)
    if (pet.vx !== 0 || pet.vy !== 0) {
      this.drawPetRibbonTrail(ctx, pet);
    }

    // Pet body
    this.drawPetBody(ctx);

    // Wings
    this.drawPetWings(ctx, bob);

    // Halo
    this.drawPetHalo(ctx, bob);

    // Heart pips (cargo counter)
    if (pet.cargo && pet.cargo.length > 0) {
      this.drawPetHeartPips(ctx, pet.cargo.length);
    }

    ctx.restore();
  }

  drawPetBody(ctx) {
    // Body (gold)
    ctx.fillStyle = '#FFD700';
    ctx.globalAlpha = 0.9;

    // Round body
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(0, -8, 6, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-2, -9, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(2, -9, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Cute mouth
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, -7, 2, 0, Math.PI);
    ctx.stroke();

    // White belly accent
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.ellipse(0, 2, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1.0;
  }

  drawPetWings(ctx, bob) {
    const flapAngle = Math.sin(performance.now() * 0.01) * 0.3;

    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.8;

    // Left wing
    ctx.save();
    ctx.translate(-6, -2);
    ctx.rotate(-0.5 + flapAngle);
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Right wing
    ctx.save();
    ctx.translate(6, -2);
    ctx.rotate(0.5 - flapAngle);
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
    ctx.globalAlpha = 1.0;
  }

  drawPetHalo(ctx, bob) {
    const spin = performance.now() * 0.003;

    ctx.save();
    ctx.translate(0, -18 - bob * 0.5);
    ctx.rotate(spin);

    // Gold ring
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 10;
    ctx.globalAlpha = 0.9;

    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.stroke();

    // Inner glow
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;
  }

  drawPetRibbonTrail(ctx, pet) {
    const trailLength = 6;
    const vx = pet.vx || 0;
    const vy = pet.vy || 0;
    const speed = Math.sqrt(vx * vx + vy * vy);

    if (speed < 10) return; // Only show when moving fast

    const angle = Math.atan2(vy, vx);

    ctx.save();
    ctx.globalAlpha = 0.6;

    for (let i = 0; i < trailLength; i++) {
      const progress = i / trailLength;
      const alpha = (1 - progress) * 0.6;
      const offset = -i * 8;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#FFD700';

      const x = Math.cos(angle + Math.PI) * offset;
      const y = Math.sin(angle + Math.PI) * offset;

      ctx.fillRect(x - 3, y - 1, 6, 2);
    }

    ctx.restore();
    ctx.globalAlpha = 1.0;
  }

  drawPetHeartPips(ctx, count) {
    const maxDisplay = Math.min(count, 5);
    const time = performance.now() * 0.004;

    for (let i = 0; i < maxDisplay; i++) {
      const x = (i - 2) * 8;
      const y = -22 - Math.sin(time + i * 0.5) * 3;

      ctx.save();
      ctx.translate(x, y);

      // Heart shape
      ctx.fillStyle = '#FF69B4';
      ctx.shadowColor = '#FF69B4';
      ctx.shadowBlur = 8;

      // Left lobe
      ctx.beginPath();
      ctx.arc(-2, -1, 3, 0, Math.PI * 2);
      ctx.fill();

      // Right lobe
      ctx.beginPath();
      ctx.arc(2, -1, 3, 0, Math.PI * 2);
      ctx.fill();

      // Bottom point
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(0, 6);
      ctx.lineTo(4, 0);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    ctx.shadowBlur = 0;
  }

  /**
   * Fallback generic summon renderer
   */
  renderGenericSummon(ctx, summon) {
    const size = summon.size || 30;
    const time = summon.age || 0;
    const alpha = Math.min(1, summon.age / 0.5); // Fade in over 0.5s

    ctx.save();
    ctx.translate(summon.x, summon.y);

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
   * Enhanced with particle trails and motion blur
   */
  render(ctx, projectile) {
    // Convert world coordinates to screen coordinates (camera offset)
    const cameraX = window.gameState?.camera?.x || 0;
    const screenX = projectile.x - cameraX;
    const screenY = projectile.y;
    
    // Don't render if off-screen
    if (screenX < -100 || screenX > (window.canvas?.width || 2000) + 100) {
      return;
    }
    
    // Create a copy of projectile with screen coordinates for rendering
    const screenProj = { ...projectile };
    screenProj.x = screenX;
    screenProj.y = screenY;
    
    // Convert trail coordinates if present
    if (screenProj.trail && screenProj.trail.length > 0) {
      screenProj.trail = screenProj.trail.map(point => ({
        ...point,
        x: point.x - cameraX
      }));
    }
    
    // Render trail particles first (behind main projectile)
    if (screenProj.trail && screenProj.trail.length > 1) {
      this.renderTrail(ctx, screenProj);
    }

    // Render main projectile (use screen coordinates)
    switch (screenProj.type) {
      case 'xwave':
      case 'slash':
        this.renderXWave(ctx, screenProj);
        break;
      case 'plasma':
      case 'energy':
        this.renderPlasma(ctx, screenProj);
        break;
      case 'crescent':
      case 'moon':
        this.renderSlash(ctx, screenProj);
        break;
      case 'beam':
        this.renderBeam(ctx, screenProj);
        break;
      case 'explosion':
        this.renderExplosion(ctx, screenProj);
        break;
      case 'summon':
        this.renderSummon(ctx, screenProj);
        break;
      default:
        // Fallback simple circle render
        this.renderPlasma(ctx, screenProj);
    }

    // Render motion blur for fast projectiles (use screen coordinates)
    if (screenProj.speed && screenProj.speed > 10) {
      this.renderMotionBlur(ctx, screenProj);
    }
  }

  /**
   * Render particle trail behind projectile
   */
  renderTrail(ctx, proj) {
    if (!proj.trail || proj.trail.length < 2) return;

    ctx.save();
    ctx.strokeStyle = proj.color || '#ffffff';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw trail with gradient opacity
    for (let i = 0; i < proj.trail.length - 1; i++) {
      const point1 = proj.trail[i];
      const point2 = proj.trail[i + 1];
      const alpha = point1.alpha || (i / proj.trail.length);

      ctx.globalAlpha = alpha * 0.5;
      ctx.lineWidth = 3 * (1 - i / proj.trail.length);
      ctx.shadowColor = proj.color || '#ffffff';
      ctx.shadowBlur = 10 * alpha;

      ctx.beginPath();
      ctx.moveTo(point1.x, point1.y);
      ctx.lineTo(point2.x, point2.y);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Render motion blur effect for fast projectiles
   */
  renderMotionBlur(ctx, proj) {
    if (!proj.vx && !proj.vy) return;

    ctx.save();
    ctx.globalAlpha = 0.3;

    // Calculate blur direction
    const speed = Math.sqrt(proj.vx * proj.vx + proj.vy * proj.vy);
    const blurLength = Math.min(30, speed * 2);
    const angle = Math.atan2(proj.vy, proj.vx);

    // Draw blur streak (proj.x and proj.y are already screen coordinates)
    const gradient = ctx.createLinearGradient(
      proj.x - Math.cos(angle) * blurLength,
      proj.y - Math.sin(angle) * blurLength,
      proj.x,
      proj.y
    );
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, proj.color || '#ffffff');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(
      proj.x - Math.cos(angle) * blurLength / 2,
      proj.y - Math.sin(angle) * blurLength / 2,
      blurLength / 2,
      proj.size * 4,
      angle,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }

  /**
   * Render sword slash (arc-based melee attack)
   * Used for A1 and MISSY sword attacks
   * Based on game.html renderSlashTrail
   */
  renderSwordSlash(ctx, slash) {
    const now = Date.now();
    const elapsed = now - slash.startTime;
    
    // Don't render if not yet active
    if (elapsed < 0) return;
    
    // Calculate fade alpha
    const progress = elapsed / slash.duration;
    const alpha = Math.max(0, 1.0 - progress);
    
    if (alpha <= 0) return;
    
    // Convert world coordinates to screen coordinates
    const cameraX = window.gameState?.camera?.x || 0;
    const screenX = slash.x - cameraX;
    const screenY = slash.y;
    
    // Don't render if off-screen
    if (screenX < -200 || screenX > (window.canvas?.width || 2000) + 200) {
      return;
    }
    
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = slash.color;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.shadowColor = slash.color;
    ctx.shadowBlur = 20;
    
    // Draw arc slash (from game.html renderSlashTrail line 13237)
    const startAngle = slash.angle - 0.6;
    const endAngle = slash.angle + 0.6;
    
    ctx.beginPath();
    ctx.arc(screenX - 20, screenY, slash.radius * 0.8, startAngle, endAngle);
    ctx.stroke();
    
    ctx.restore();
  }

  /**
   * Render pistol shot (coin-shaped projectile)
   * Used for MISSY pistol attacks
   */
  renderPistolShot(ctx, shot) {
    const now = Date.now();
    const elapsed = now - shot.startTime;
    
    // Don't render if not yet active
    if (elapsed < 0) return;
    
    // Convert world coordinates to screen coordinates
    const cameraX = window.gameState?.camera?.x || 0;
    const screenX = shot.x - cameraX;
    const screenY = shot.y;
    
    // Don't render if off-screen
    if (screenX < -100 || screenX > (window.canvas?.width || 2000) + 100) {
      return;
    }
    
    ctx.save();
    
    // Gold coin-shaped projectile
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 15;
    ctx.globalAlpha = 1.0;
    
    // Main coin body
    ctx.beginPath();
    ctx.arc(screenX, screenY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner highlight
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.arc(screenX - 2, screenY - 2, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  /**
   * Render muzzle flash
   * Used for MISSY pistol attacks
   * Based on game.html renderMuzzleFlash
   */
  renderMuzzleFlash(ctx, flash) {
    const now = Date.now();
    const elapsed = now - flash.startTime;
    
    // Don't render if not yet active
    if (elapsed < 0) return;
    
    // Calculate fade alpha
    const progress = elapsed / flash.duration;
    const alpha = Math.max(0, 1.0 - progress);
    
    if (alpha <= 0) return;
    
    // Convert world coordinates to screen coordinates
    const cameraX = window.gameState?.camera?.x || 0;
    const screenX = flash.x - cameraX;
    const screenY = flash.y;
    
    ctx.save();
    ctx.globalAlpha = alpha;
    
    // Radial flash (from game.html renderMuzzleFlash line 13260)
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(screenX, screenY, 15 * alpha, 0, Math.PI * 2);
    ctx.fill();
    
    // Bright center
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(screenX, screenY, 8 * alpha, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  /**
   * Render burst shot (cyan plasma projectile)
   * Used for UNIQUE burst attacks
   */
  renderBurstShot(ctx, shot) {
    const now = Date.now();
    const elapsed = now - shot.startTime;
    
    // Don't render if not yet active
    if (elapsed < 0) return;
    
    // Convert world coordinates to screen coordinates
    const cameraX = window.gameState?.camera?.x || 0;
    const screenX = shot.x - cameraX;
    const screenY = shot.y;
    
    // Don't render if off-screen
    if (screenX < -100 || screenX > (window.canvas?.width || 2000) + 100) {
      return;
    }
    
    ctx.save();
    
    // Cyan burst projectile (similar to plasma but smaller and faster)
    const fadeAlpha = Math.min(1, shot.lifetime - shot.age);
    
    // Outer glow halo
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 20;
    ctx.globalAlpha = fadeAlpha * 0.3;
    ctx.beginPath();
    ctx.arc(screenX, screenY, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Mid layer (electric blue)
    ctx.fillStyle = '#0080ff';
    ctx.shadowBlur = 15;
    ctx.globalAlpha = fadeAlpha * 0.6;
    ctx.beginPath();
    ctx.arc(screenX, screenY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Core (bright white)
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.globalAlpha = fadeAlpha;
    ctx.beginPath();
    ctx.arc(screenX, screenY, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Electric crackle (rotating segments)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 6;
    ctx.globalAlpha = fadeAlpha * 0.8;
    
    const time = shot.age;
    for (let i = 0; i < 3; i++) {
      const angle = (time * 5) + (i / 3) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(screenX, screenY);
      ctx.lineTo(screenX + Math.cos(angle) * 8, screenY + Math.sin(angle) * 8);
      ctx.stroke();
    }
    
    ctx.restore();
  }
}

// Export for use in combat system
if (typeof window !== 'undefined') {
  window.ProjectileRenderer = ProjectileRenderer;
}
