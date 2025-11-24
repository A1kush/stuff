/**
 * PROJECTILE MANAGER
 * Handles all skill projectiles, VFX, and damage application
 * 
 * @version 1.0.0
 */

class ProjectileManager {
  constructor() {
    this.projectiles = [];
    this.vfxParticles = [];
    this.nextId = 0;
    
    // Initialize visual renderer
    if (window.ProjectileRenderer) {
      this.renderer = new window.ProjectileRenderer();
    } else {
      console.warn('ProjectileRenderer not loaded - using fallback rendering');
      this.renderer = null;
    }
  }

  /**
   * Spawn a projectile from skill
   */
  spawnProjectile(skillData, sourceX, sourceY, targetX, targetY, options = {}) {
    // Calculate angle for rotation
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const angle = Math.atan2(dy, dx);
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    const projectile = {
      id: this.nextId++,
      skillId: skillData.id,
      x: sourceX,
      y: sourceY,
      targetX: targetX,
      targetY: targetY,
      damage: skillData.damage,
      element: skillData.element,
      speed: options.speed || 8,
      size: options.size || 1.0,
      color: this.getElementColor(skillData.element),
      lifetime: 5.0, // Total lifetime in seconds
      age: 0, // Current age in seconds
      rotation: angle,
      pierce: skillData.pierce || false,
      hitsRemaining: skillData.pierce ? 999 : 1,
      chain: skillData.chain || false,
      burn: skillData.burn || false,
      freeze: skillData.freeze || false,
      stun: skillData.stun || false,
      active: true,
      type: options.type || this.getProjectileType(skillData)
    };
    
    if (dist > 0) {
      projectile.vx = (dx / dist) * projectile.speed;
      projectile.vy = (dy / dist) * projectile.speed;
    } else {
      projectile.vx = projectile.speed;
      projectile.vy = 0;
    }

    this.projectiles.push(projectile);
    return projectile;
  }
  
  /**
   * Determine projectile visual type based on skill
   */
  getProjectileType(skillData) {
    const skillName = skillData.name.toLowerCase();
    
    // Check for specific skill types
    if (skillName.includes('slash') || skillName.includes('wave')) {
      return 'xwave';
    } else if (skillName.includes('plasma') || skillName.includes('blaster')) {
      return 'plasma';
    } else if (skillName.includes('moon') || skillName.includes('luna')) {
      return 'crescent';
    } else if (skillName.includes('beam') || skillName.includes('kamehameha')) {
      return 'beam';
    } else if (skillName.includes('clone') || skillName.includes('summon')) {
      return 'summon';
    } else if (skillName.includes('explosion') || skillName.includes('burst')) {
      return 'explosion';
    }
    
    // Default based on element
    switch (skillData.element) {
      case 'PHYSICAL': return 'xwave';
      case 'FIRE': return 'plasma';
      case 'ICE': return 'crescent';
      case 'LIGHTNING': return 'plasma';
      case 'SHADOW': return 'xwave';
      default: return 'plasma';
    }
  }

  /**
   * Spawn multi-hit skill (3-hit, 4-hit, etc.)
   */
  spawnMultiHit(skillData, sourceX, sourceY, targetX, targetY, hitCount) {
    const baseAngle = Math.atan2(targetY - sourceY, targetX - sourceX);
    const spreadAngle = Math.PI / 8; // 22.5 degrees spread

    for (let i = 0; i < hitCount; i++) {
      const angle = baseAngle + (i - (hitCount - 1) / 2) * spreadAngle / (hitCount - 1);
      const distance = 300;
      const tx = sourceX + Math.cos(angle) * distance;
      const ty = sourceY + Math.sin(angle) * distance;
      
      setTimeout(() => {
        this.spawnProjectile(skillData, sourceX, sourceY, tx, ty, {
          speed: 10 + i * 2
        });
      }, i * 100); // Stagger by 100ms
    }
  }

  /**
   * Spawn beam skill (channeled)
   */
  spawnBeam(skillData, sourceX, sourceY, targetX, targetY, duration = 1000) {
    const beam = {
      id: this.nextId++,
      type: 'beam',
      skillId: skillData.id,
      x1: sourceX,
      y1: sourceY,
      x2: targetX,
      y2: targetY,
      damage: skillData.damage,
      element: skillData.element,
      color: this.getElementColor(skillData.element),
      width: 12,
      lifetime: 0,
      maxLifetime: duration,
      active: true,
      dealDamageInterval: 100, // Damage every 100ms
      lastDamageTime: 0
    };

    this.projectiles.push(beam);
    return beam;
  }

  /**
   * Spawn AoE explosion
   */
  spawnExplosion(skillData, x, y, radius = 100) {
    const explosion = {
      id: this.nextId++,
      type: 'explosion',
      skillId: skillData.id,
      x: x,
      y: y,
      radius: radius,
      maxRadius: radius,
      damage: skillData.damage,
      element: skillData.element,
      color: this.getElementColor(skillData.element),
      lifetime: 0,
      maxLifetime: 500, // 0.5 seconds
      active: true,
      dealDamage: true
    };

    this.projectiles.push(explosion);
    
    // Spawn VFX particles
    this.spawnExplosionParticles(x, y, radius, explosion.color);
    
    return explosion;
  }

  /**
   * Spawn VFX particles for explosion
   */
  spawnExplosionParticles(x, y, radius, color) {
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 3 + Math.random() * 4;
      
      this.vfxParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 4,
        color: color,
        alpha: 1.0,
        lifetime: 0,
        maxLifetime: 500 + Math.random() * 300
      });
    }
  }

  /**
   * Get element color
   */
  getElementColor(element) {
    const colors = {
      PHYSICAL: '#ffffff',
      FIRE: '#ff4400',
      ICE: '#00ddff',
      LIGHTNING: '#ffff00',
      SHADOW: '#aa00ff',
      LIGHT: '#ffee00',
      PLASMA: '#00ff88',
      ENERGY: '#00aaff',
      ARCANE: '#ff00ff',
      SUMMON: '#88ff88'
    };
    return colors[element] || '#ffffff';
  }

  /**
   * Update all projectiles
   */
  update(deltaTime, enemies) {
    // Update projectiles (deltaTime is in seconds)
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.age += deltaTime;

      // Check lifetime
      if (proj.age >= proj.lifetime) {
        this.projectiles.splice(i, 1);
        continue;
      }

      // Update based on type
      if (proj.type === 'beam') {
        this.updateBeam(proj, deltaTime, enemies);
      } else if (proj.type === 'explosion') {
        this.updateExplosion(proj, deltaTime, enemies);
      } else {
        this.updateProjectile(proj, deltaTime, enemies);
      }
    }

    // Update VFX particles
    for (let i = this.vfxParticles.length - 1; i >= 0; i--) {
      const p = this.vfxParticles[i];
      p.age = (p.age || 0) + deltaTime;
      
      if (p.age >= (p.maxAge || 1.0)) {
        this.vfxParticles.splice(i, 1);
        continue;
      }

      p.x += p.vx * deltaTime * 60; // Normalize for 60 FPS
      p.y += p.vy * deltaTime * 60;
      p.alpha = 1.0 - (p.age / (p.maxAge || 1.0));
    }
  }

  /**
   * Update standard projectile
   */
  updateProjectile(proj, deltaTime, enemies) {
    proj.x += proj.vx;
    proj.y += proj.vy;

    // Check collision with enemies
    if (enemies && proj.hitsRemaining > 0) {
      for (const enemy of enemies) {
        if (!enemy.alive) continue;

        const dx = enemy.x - proj.x;
        const dy = enemy.y - proj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const hitRadius = (proj.size * 16) + (enemy.size || 20);

        if (dist < hitRadius) {
          // Hit!
          this.applyDamage(enemy, proj);
          proj.hitsRemaining--;

          if (proj.hitsRemaining <= 0) {
            proj.active = false;
            break;
          }
        }
      }
    }
  }

  /**
   * Update beam
   */
  updateBeam(beam, dt, enemies) {
    beam.lastDamageTime += dt;

    if (beam.lastDamageTime >= beam.dealDamageInterval && enemies) {
      beam.lastDamageTime = 0;

      // Check all enemies in beam path
      for (const enemy of enemies) {
        if (!enemy.alive) continue;

        // Simple line-to-point distance check
        if (this.pointToLineDistance(enemy.x, enemy.y, beam.x1, beam.y1, beam.x2, beam.y2) < beam.width / 2) {
          this.applyDamage(enemy, beam);
        }
      }
    }
  }

  /**
   * Update explosion
   */
  updateExplosion(explosion, dt, enemies) {
    const progress = explosion.lifetime / explosion.maxLifetime;
    explosion.radius = explosion.maxRadius * (0.3 + progress * 0.7);

    // Deal damage once at the start
    if (explosion.dealDamage && enemies) {
      explosion.dealDamage = false;

      for (const enemy of enemies) {
        if (!enemy.alive) continue;

        const dx = enemy.x - explosion.x;
        const dy = enemy.y - explosion.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < explosion.radius) {
          this.applyDamage(enemy, explosion);
        }
      }
    }
  }

  /**
   * Apply damage to enemy
   */
  applyDamage(enemy, projectile) {
    if (!enemy || !enemy.alive) return;

    const damage = projectile.damage;
    enemy.hp = Math.max(0, enemy.hp - damage);

    // Apply status effects
    if (projectile.burn) enemy.burning = 3000; // 3 seconds
    if (projectile.freeze) enemy.frozen = 2000; // 2 seconds
    if (projectile.stun) enemy.stunned = 1000; // 1 second

    // Check death
    if (enemy.hp <= 0) {
      enemy.alive = false;
      enemy.deathTime = Date.now();
    }

    // Emit damage number event
    if (window.combatEvents) {
      window.combatEvents.dispatchEvent(new CustomEvent('damageDealt', {
        detail: { enemy, damage, element: projectile.element }
      }));
    }
  }

  /**
   * Point to line distance
   */
  pointToLineDistance(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Render all projectiles
   */
  render(ctx) {
    // Render VFX particles (behind projectiles)
    for (const p of this.vfxParticles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Render projectiles with enhanced visual effects
    for (const proj of this.projectiles) {
      if (this.renderer) {
        // Use advanced renderer
        this.renderer.render(ctx, proj);
      } else {
        // Fallback to simple rendering
        if (proj.type === 'beam') {
          this.renderBeamFallback(ctx, proj);
        } else if (proj.type === 'explosion') {
          this.renderExplosionFallback(ctx, proj);
        } else {
          this.renderProjectileFallback(ctx, proj);
        }
      }
    }
  }

  /**
   * Fallback render for projectile (if renderer not loaded)
   */
  renderProjectileFallback(ctx, proj) {
    ctx.save();
    ctx.fillStyle = proj.color;
    ctx.shadowColor = proj.color;
    ctx.shadowBlur = 15;
    
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, proj.size * 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = proj.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    
    ctx.restore();
  }

  /**
   * Fallback render for beam
   */
  renderBeamFallback(ctx, beam) {
    ctx.save();
    
    ctx.strokeStyle = beam.color;
    ctx.lineWidth = beam.width || 12;
    ctx.shadowColor = beam.color;
    ctx.shadowBlur = 20;
    ctx.globalAlpha = 0.8;
    
    ctx.beginPath();
    ctx.moveTo(beam.x || beam.x1, beam.y || beam.y1);
    ctx.lineTo(beam.targetX || beam.x2, beam.targetY || beam.y2);
    ctx.stroke();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = (beam.width || 12) / 3;
    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 10;
    ctx.stroke();
    
    ctx.restore();
  }

  /**
   * Fallback render for explosion
   */
  renderExplosionFallback(ctx, explosion) {
    ctx.save();
    
    const progress = explosion.age / explosion.lifetime;
    const alpha = 1.0 - progress;
    
    ctx.strokeStyle = explosion.color;
    ctx.lineWidth = 4;
    ctx.globalAlpha = alpha * 0.6;
    ctx.shadowColor = explosion.color;
    ctx.shadowBlur = 30;
    
    ctx.beginPath();
    ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = explosion.color;
    ctx.globalAlpha = alpha * 0.3;
    ctx.fill();
    
    ctx.restore();
  }

  /**
   * Clear all projectiles
   */
  clear() {
    this.projectiles = [];
    this.vfxParticles = [];
  }
}
