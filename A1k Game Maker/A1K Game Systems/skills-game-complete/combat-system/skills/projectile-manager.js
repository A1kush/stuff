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
    
    // Sword slash system
    this.swordSlashes = [];
    
    // Pistol shot system
    this.pistolShots = [];
    this.muzzleFlashes = [];
    
    // Burst shot system (for UNIQUE)
    this.burstShots = [];
    
    // Summon system (A1 clone, UNIQUE drone, MISSY pet)
    this.summons = [];
    
    // Projectile pooling for performance
    this.pool = [];
    this.poolSize = 100;
    this.initPool();
    
    // Initialize visual renderer
    if (window.ProjectileRenderer) {
      this.renderer = new window.ProjectileRenderer();
    } else {
      console.warn('ProjectileRenderer not loaded - using fallback rendering');
      this.renderer = null;
    }
  }

  /**
   * Initialize projectile pool for performance
   */
  initPool() {
    for (let i = 0; i < this.poolSize; i++) {
      this.pool.push({
        id: -1,
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        age: 0,
        lifetime: 0
      });
    }
  }

  /**
   * Get projectile from pool
   */
  getFromPool() {
    for (const proj of this.pool) {
      if (!proj.active) {
        proj.active = true;
        return proj;
      }
    }
    return null; // Pool exhausted, create new
  }

  /**
   * Return projectile to pool
   */
  returnToPool(proj) {
    proj.active = false;
    proj.id = -1;
  }

  /**
   * Spawn a projectile from skill
   */
  spawnProjectile(skillData, sourceX, sourceY, targetX, targetY, options = {}) {
    console.log(`🎯 Spawning projectile for skill ${skillData.id} from (${sourceX}, ${sourceY}) to (${targetX}, ${targetY})`);
    
    // Calculate angle for rotation
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const angle = Math.atan2(dy, dx);
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate travel distance for lifetime (ensure visible for at least 2 seconds)
    const travelDistance = dist || 500; // Default 500px if no target
    const travelTime = travelDistance / (options.speed || 8);
    const lifetime = Math.max(2.0, travelTime + 1.0); // At least 2 seconds visible
    
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
      lifetime: lifetime, // Dynamic lifetime based on travel distance
      age: 0, // Current age in seconds
      rotation: angle,
      pierce: skillData.pierce || false,
      hitsRemaining: skillData.pierce ? 999 : 1,
      chain: skillData.chain || false,
      burn: skillData.burn || false,
      freeze: skillData.freeze || false,
      stun: skillData.stun || false,
      active: true,
      type: options.type || this.getProjectileType(skillData),
      // Trail system for visual effects
      trail: [],
      maxTrailLength: 10
    };
    
    // Calculate velocity (pixels per frame, will be multiplied by deltaTime in update)
    if (dist > 0) {
      projectile.vx = (dx / dist) * projectile.speed;
      projectile.vy = (dy / dist) * projectile.speed;
    } else {
      projectile.vx = projectile.speed;
      projectile.vy = 0;
    }
    
    // Store base speed for calculations
    projectile.baseSpeed = projectile.speed;

    // Spawn initial trail particles
    this.spawnTrailParticles(projectile, sourceX, sourceY);

    this.projectiles.push(projectile);
    console.log(`✅ Projectile ${projectile.id} created. Total projectiles: ${this.projectiles.length}`);
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
   * Enhanced to ensure all projectiles are visible
   */
  spawnMultiHit(skillData, sourceX, sourceY, targetX, targetY, hitCount) {
    const baseAngle = Math.atan2(targetY - sourceY, targetX - sourceX);
    const spreadAngle = Math.PI / 8; // 22.5 degrees spread

    for (let i = 0; i < hitCount; i++) {
      const angle = baseAngle + (i - (hitCount - 1) / 2) * spreadAngle / (hitCount - 1);
      const distance = 400; // Increased distance for better visibility
      const tx = sourceX + Math.cos(angle) * distance;
      const ty = sourceY + Math.sin(angle) * distance;
      
      // Use requestAnimationFrame for better timing
      setTimeout(() => {
        this.spawnProjectile(skillData, sourceX, sourceY, tx, ty, {
          speed: 10 + i * 2,
          size: 1.2 + (i * 0.1) // Slightly larger for visibility
        });
      }, i * 80); // Stagger by 80ms for smoother effect
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
   * Spawn trail particles for projectile visual effects
   */
  spawnTrailParticles(proj, x, y) {
    const particleCount = 2;
    for (let i = 0; i < particleCount; i++) {
      this.vfxParticles.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 2 + Math.random() * 3,
        color: proj.color,
        alpha: 0.6,
        lifetime: 0,
        maxLifetime: 200 + Math.random() * 200
      });
    }
  }

  /**
   * Spawn impact effect when projectile hits or expires
   */
  spawnImpactEffect(x, y, color) {
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 2 + Math.random() * 3;
      
      this.vfxParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        color: color,
        alpha: 1.0,
        lifetime: 0,
        maxLifetime: 300 + Math.random() * 200
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
    // Update sword slashes
    for (let i = this.swordSlashes.length - 1; i >= 0; i--) {
      const slash = this.swordSlashes[i];
      this.updateSwordSlash(slash, deltaTime, enemies);
      
      if (!slash.active) {
        this.swordSlashes.splice(i, 1);
      }
    }
    
    // Update pistol shots
    for (let i = this.pistolShots.length - 1; i >= 0; i--) {
      const shot = this.pistolShots[i];
      this.updatePistolShot(shot, deltaTime, enemies);
      
      if (!shot.active) {
        this.pistolShots.splice(i, 1);
      }
    }
    
    // Update muzzle flashes
    for (let i = this.muzzleFlashes.length - 1; i >= 0; i--) {
      const flash = this.muzzleFlashes[i];
      this.updateMuzzleFlash(flash, deltaTime);
      
      if (!flash.active) {
        this.muzzleFlashes.splice(i, 1);
      }
    }
    
    // Update burst shots
    for (let i = this.burstShots.length - 1; i >= 0; i--) {
      const shot = this.burstShots[i];
      this.updateBurstShot(shot, deltaTime, enemies);
      
      if (!shot.active) {
        this.burstShots.splice(i, 1);
      }
    }
    
    // Update projectiles (deltaTime is in seconds)
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.age += deltaTime;

      // Check lifetime
      if (proj.age >= proj.lifetime) {
        // Return to pool if pooled
        if (proj.pooled) {
          this.returnToPool(proj);
        }
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

      const frameMultiplier = deltaTime * 60; // Normalize for 60 FPS
      p.x += p.vx * frameMultiplier;
      p.y += p.vy * frameMultiplier;
      p.alpha = 1.0 - (p.age / (p.maxAge || 1.0));
    }

    // Update summons (persistent entities)
    for (let i = this.summons.length - 1; i >= 0; i--) {
      const summon = this.summons[i];
      summon.age = (summon.age || 0) + deltaTime;
      
      // Summons last 15 seconds by default
      if (summon.age >= (summon.lifetime || 15.0)) {
        this.summons.splice(i, 1);
        continue;
      }

      // Update summon position if it has velocity
      if (summon.vx !== undefined && summon.vy !== undefined) {
        const frameMultiplier = deltaTime * 60;
        summon.x += summon.vx * frameMultiplier;
        summon.y += summon.vy * frameMultiplier;
      }
    }
  }

  /**
   * Update standard projectile
   * Projectiles now render and travel even without enemies
   */
  updateProjectile(proj, deltaTime, enemies) {
    // Always update position regardless of enemy presence
    // deltaTime is in seconds, so multiply by 60 to get pixels per frame at 60fps
    const frameMultiplier = deltaTime * 60;
    proj.x += proj.vx * frameMultiplier;
    proj.y += proj.vy * frameMultiplier;

    // Update trail system for visual effects
    if (proj.trail) {
      proj.trail.push({ x: proj.x, y: proj.y, alpha: 1.0 });
      if (proj.trail.length > proj.maxTrailLength) {
        proj.trail.shift();
      }
      // Fade trail
      proj.trail.forEach((point, i) => {
        point.alpha = i / proj.trail.length;
      });
    }

    // Spawn trail particles periodically
    if (Math.random() < 0.3) {
      this.spawnTrailParticles(proj, proj.x, proj.y);
    }

    // Check collision with enemies (if present)
    if (enemies && enemies.length > 0 && proj.hitsRemaining > 0) {
      for (const enemy of enemies) {
        if (!enemy || !enemy.alive) continue;

        const dx = enemy.x - proj.x;
        const dy = enemy.y - proj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const hitRadius = (proj.size * 16) + (enemy.size || 20);

        if (dist < hitRadius) {
          // Hit!
          this.applyDamage(enemy, proj);
          proj.hitsRemaining--;

          if (proj.hitsRemaining <= 0) {
            // Spawn impact effect
            this.spawnImpactEffect(proj.x, proj.y, proj.color);
            proj.active = false;
            break;
          }
        }
      }
    } else if (proj.hitsRemaining <= 0) {
      // Projectile expired, spawn impact effect at end position
      this.spawnImpactEffect(proj.x, proj.y, proj.color);
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
    if (!ctx) {
      console.warn('⚠️ ProjectileManager.render: No ctx provided');
      return;
    }
    
    // Debug: Log render call occasionally
    if (this.projectiles.length > 0 && Math.random() < 0.01) {
      console.log(`🎨 Rendering ${this.projectiles.length} projectiles`);
    }
    
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

    // Render sword slashes
    for (const slash of this.swordSlashes) {
      if (this.renderer && this.renderer.renderSwordSlash) {
        this.renderer.renderSwordSlash(ctx, slash);
      } else {
        this.renderSwordSlashFallback(ctx, slash);
      }
    }
    
    // Render muzzle flashes
    for (const flash of this.muzzleFlashes) {
      if (this.renderer && this.renderer.renderMuzzleFlash) {
        this.renderer.renderMuzzleFlash(ctx, flash);
      } else {
        this.renderMuzzleFlashFallback(ctx, flash);
      }
    }
    
    // Render pistol shots
    for (const shot of this.pistolShots) {
      if (this.renderer && this.renderer.renderPistolShot) {
        this.renderer.renderPistolShot(ctx, shot);
      } else {
        this.renderPistolShotFallback(ctx, shot);
      }
    }
    
    // Render burst shots
    for (const shot of this.burstShots) {
      if (this.renderer && this.renderer.renderBurstShot) {
        this.renderer.renderBurstShot(ctx, shot);
      } else {
        this.renderBurstShotFallback(ctx, shot);
      }
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

    // Render summons (A1 clone, UNIQUE drone, MISSY pet)
    for (const summon of this.summons) {
      if (this.renderer && this.renderer.renderSummon) {
        this.renderer.renderSummon(ctx, summon);
      } else {
        // Fallback generic summon render
        this.renderSummonFallback(ctx, summon);
      }
    }
  }

  /**
   * Fallback render for projectile (if renderer not loaded)
   * Enhanced with trail rendering
   */
  renderProjectileFallback(ctx, proj) {
    ctx.save();
    
    // Convert world coordinates to screen coordinates (camera offset)
    const cameraX = window.gameState?.camera?.x || 0;
    const screenX = proj.x - cameraX;
    const screenY = proj.y;
    
    // Don't render if off-screen
    if (screenX < -100 || screenX > (window.canvas?.width || 2000) + 100) {
      ctx.restore();
      return;
    }
    
    // Render trail if available (convert trail coordinates too)
    if (proj.trail && proj.trail.length > 1) {
      ctx.strokeStyle = proj.color;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      const trailScreenX0 = proj.trail[0].x - cameraX;
      ctx.moveTo(trailScreenX0, proj.trail[0].y);
      for (let i = 1; i < proj.trail.length; i++) {
        ctx.globalAlpha = proj.trail[i].alpha * 0.3;
        const trailScreenX = proj.trail[i].x - cameraX;
        ctx.lineTo(trailScreenX, proj.trail[i].y);
      }
      ctx.stroke();
    }
    
    // Main projectile
    ctx.fillStyle = proj.color;
    ctx.shadowColor = proj.color;
    ctx.shadowBlur = 20;
    ctx.globalAlpha = 1.0;
    
    ctx.beginPath();
    ctx.arc(screenX, screenY, proj.size * 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Outer glow
    ctx.strokeStyle = proj.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.shadowBlur = 15;
    ctx.stroke();
    
    // Inner core
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(screenX, screenY, proj.size * 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  /**
   * Fallback render for beam
   */
  renderBeamFallback(ctx, beam) {
    // Convert world coordinates to screen coordinates
    const cameraX = window.gameState?.camera?.x || 0;
    const x1 = (beam.x || beam.x1) - cameraX;
    const y1 = beam.y || beam.y1;
    const x2 = (beam.targetX || beam.x2) - cameraX;
    const y2 = beam.targetY || beam.y2;
    
    ctx.save();
    
    ctx.strokeStyle = beam.color;
    ctx.lineWidth = beam.width || 12;
    ctx.shadowColor = beam.color;
    ctx.shadowBlur = 20;
    ctx.globalAlpha = 0.8;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
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
    // Convert world coordinates to screen coordinates
    const cameraX = window.gameState?.camera?.x || 0;
    const screenX = explosion.x - cameraX;
    const screenY = explosion.y;
    
    // Don't render if off-screen
    if (screenX < -200 || screenX > (window.canvas?.width || 2000) + 200) {
      return;
    }
    
    ctx.save();
    
    const progress = explosion.age / explosion.lifetime;
    const alpha = 1.0 - progress;
    
    ctx.strokeStyle = explosion.color;
    ctx.lineWidth = 4;
    ctx.globalAlpha = alpha * 0.6;
    ctx.shadowColor = explosion.color;
    ctx.shadowBlur = 30;
    
    ctx.beginPath();
    ctx.arc(screenX, screenY, explosion.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = explosion.color;
    ctx.globalAlpha = alpha * 0.3;
    ctx.fill();
    
    ctx.restore();
  }

  /**
   * Fallback render for sword slash
   */
  renderSwordSlashFallback(ctx, slash) {
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
    
    // Draw arc slash (from game.html renderSlashTrail)
    const startAngle = slash.angle - 0.6;
    const endAngle = slash.angle + 0.6;
    
    ctx.beginPath();
    ctx.arc(screenX - 20, screenY, slash.radius * 0.8, startAngle, endAngle);
    ctx.stroke();
    
    ctx.restore();
  }

  /**
   * Fallback render for pistol shot
   */
  renderPistolShotFallback(ctx, shot) {
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
   * Fallback render for muzzle flash
   */
  renderMuzzleFlashFallback(ctx, flash) {
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
    
    // Radial flash (from game.html renderMuzzleFlash)
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
   * Fallback render for burst shot
   */
  renderBurstShotFallback(ctx, shot) {
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
    
    ctx.restore();
  }

  /**
   * Spawn sword slash (arc-based melee attack)
   * Used for A1 and MISSY sword attacks
   */
  spawnSwordSlash(characterId, sourceX, sourceY, angle, color, radius, damage, timing = 0) {
    const slash = {
      id: this.nextId++,
      characterId: characterId,
      x: sourceX,
      y: sourceY,
      angle: angle,
      color: color,
      radius: radius,
      damage: damage,
      startTime: Date.now() + (timing * 1000), // Delay in milliseconds
      duration: 200, // 200ms visible duration
      active: true,
      hit: false // Track if damage has been applied
    };
    
    this.swordSlashes.push(slash);
    return slash;
  }

  /**
   * Update sword slashes
   */
  updateSwordSlash(slash, deltaTime, enemies) {
    const now = Date.now();
    const elapsed = now - slash.startTime;
    
    // Check if slash should be active
    if (elapsed < 0) {
      return; // Not yet active
    }
    
    if (elapsed >= slash.duration) {
      slash.active = false;
      return;
    }
    
    // Apply damage once when slash becomes active (if enemies present)
    if (!slash.hit && elapsed >= 0 && enemies && enemies.length > 0) {
      const alpha = 1.0 - (elapsed / slash.duration);
      
      // Check collision with enemies in arc area
      for (const enemy of enemies) {
        if (!enemy || !enemy.alive) continue;
        
        // Calculate distance from slash center
        const dx = enemy.x - slash.x;
        const dy = enemy.y - slash.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Check if enemy is within arc radius
        if (dist < slash.radius) {
          // Check if enemy is within arc angle range
          const enemyAngle = Math.atan2(dy, dx);
          const angleDiff = Math.abs(enemyAngle - slash.angle);
          const normalizedAngleDiff = Math.min(angleDiff, Math.PI * 2 - angleDiff);
          
          // Arc spans from angle - 0.6 to angle + 0.6
          if (normalizedAngleDiff < 0.6) {
            this.applyDamage(enemy, {
              damage: slash.damage,
              element: 'PHYSICAL'
            });
            slash.hit = true;
            break; // Only hit one enemy per slash
          }
        }
      }
    }
  }

  /**
   * Spawn pistol shot (coin-shaped projectile with homing)
   * Used for MISSY pistol attacks
   */
  spawnPistolShot(sourceX, sourceY, targetX, targetY, damage, homing = 8, speed = 720, timing = 0) {
    // Calculate angle and distance
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    
    // Create muzzle flash
    this.spawnMuzzleFlash(sourceX, sourceY, timing);
    
    // Create pistol shot projectile
    const shot = {
      id: this.nextId++,
      x: sourceX,
      y: sourceY,
      targetX: targetX,
      targetY: targetY,
      damage: damage,
      speed: speed,
      homing: homing, // Homing strength (pixels per frame)
      angle: angle,
      vx: Math.cos(angle) * speed / 60, // Convert to pixels per frame
      vy: Math.sin(angle) * speed / 60,
      color: '#FFD700', // Gold color
      size: 1.0,
      lifetime: 2.0, // 2 seconds
      age: 0,
      startTime: Date.now() + (timing * 1000), // Delay in milliseconds
      active: true,
      hitsRemaining: 1,
      type: 'pistol',
      shape: 'coinComet'
    };
    
    this.pistolShots.push(shot);
    return shot;
  }

  /**
   * Spawn muzzle flash VFX
   */
  spawnMuzzleFlash(x, y, timing = 0) {
    const flash = {
      id: this.nextId++,
      x: x,
      y: y,
      startTime: Date.now() + (timing * 1000),
      duration: 100, // 100ms flash
      active: true
    };
    
    this.muzzleFlashes.push(flash);
    return flash;
  }

  /**
   * Update pistol shots
   */
  updatePistolShot(shot, deltaTime, enemies) {
    const now = Date.now();
    const elapsed = now - shot.startTime;
    
    // Check if shot should be active
    if (elapsed < 0) {
      return; // Not yet active
    }
    
    shot.age += deltaTime;
    
    // Check lifetime
    if (shot.age >= shot.lifetime || shot.hitsRemaining <= 0) {
      shot.active = false;
      return;
    }
    
    // Update position with homing (if enemies present)
    const frameMultiplier = deltaTime * 60;
    
    if (enemies && enemies.length > 0 && shot.hitsRemaining > 0) {
      // Find nearest enemy
      let nearestEnemy = null;
      let nearestDist = Infinity;
      
      for (const enemy of enemies) {
        if (!enemy || !enemy.alive) continue;
        
        const dx = enemy.x - shot.x;
        const dy = enemy.y - shot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestEnemy = enemy;
        }
      }
      
      // Apply homing if enemy found
      if (nearestEnemy && nearestDist < 500) {
        const targetAngle = Math.atan2(nearestEnemy.y - shot.y, nearestEnemy.x - shot.x);
        const angleDiff = targetAngle - shot.angle;
        
        // Normalize angle difference
        let normalizedDiff = angleDiff;
        while (normalizedDiff > Math.PI) normalizedDiff -= Math.PI * 2;
        while (normalizedDiff < -Math.PI) normalizedDiff += Math.PI * 2;
        
        // Apply homing (gradual turn)
        const homingStrength = shot.homing / 100; // Convert to radians per frame
        shot.angle += normalizedDiff * homingStrength * frameMultiplier;
        
        // Update velocity based on new angle
        shot.vx = Math.cos(shot.angle) * shot.speed / 60;
        shot.vy = Math.sin(shot.angle) * shot.speed / 60;
      }
    }
    
    // Update position
    shot.x += shot.vx * frameMultiplier;
    shot.y += shot.vy * frameMultiplier;
    
    // Check collision with enemies
    if (enemies && enemies.length > 0 && shot.hitsRemaining > 0) {
      for (const enemy of enemies) {
        if (!enemy || !enemy.alive) continue;
        
        const dx = enemy.x - shot.x;
        const dy = enemy.y - shot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const hitRadius = 20 + (enemy.size || 20);
        
        if (dist < hitRadius) {
          this.applyDamage(enemy, {
            damage: shot.damage,
            element: 'PHYSICAL'
          });
          shot.hitsRemaining--;
          shot.active = false;
          break;
        }
      }
    }
  }

  /**
   * Update muzzle flashes
   */
  updateMuzzleFlash(flash, deltaTime) {
    const now = Date.now();
    const elapsed = now - flash.startTime;
    
    if (elapsed < 0) return; // Not yet active
    if (elapsed >= flash.duration) {
      flash.active = false;
    }
  }

  /**
   * Spawn burst shot (cyan plasma projectile with pierce)
   * Used for UNIQUE burst attacks
   */
  spawnBurstShot(sourceX, sourceY, targetX, targetY, damage, pierce = 4, speed = 875, spread = 0, timing = 0) {
    // Calculate base angle
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const baseAngle = Math.atan2(dy, dx);
    
    // Apply spread angle
    const angle = baseAngle + spread;
    
    // Create burst shot projectile
    const shot = {
      id: this.nextId++,
      x: sourceX,
      y: sourceY,
      targetX: targetX,
      targetY: targetY,
      damage: damage,
      speed: speed,
      angle: angle,
      vx: Math.cos(angle) * speed / 60, // Convert to pixels per frame
      vy: Math.sin(angle) * speed / 60,
      color: '#00FFFF', // Cyan color
      size: 1.0,
      lifetime: 2.0, // 2 seconds
      age: 0,
      startTime: Date.now() + (timing * 1000), // Delay in milliseconds
      active: true,
      hitsRemaining: pierce, // Pierce through multiple enemies
      type: 'burst',
      shape: 'smallBurst'
    };
    
    this.burstShots.push(shot);
    return shot;
  }

  /**
   * Update burst shots
   */
  updateBurstShot(shot, deltaTime, enemies) {
    const now = Date.now();
    const elapsed = now - shot.startTime;
    
    // Check if shot should be active
    if (elapsed < 0) {
      return; // Not yet active
    }
    
    shot.age += deltaTime;
    
    // Check lifetime
    if (shot.age >= shot.lifetime || shot.hitsRemaining <= 0) {
      shot.active = false;
      return;
    }
    
    // Update position
    const frameMultiplier = deltaTime * 60;
    shot.x += shot.vx * frameMultiplier;
    shot.y += shot.vy * frameMultiplier;
    
    // Check collision with enemies
    if (enemies && enemies.length > 0 && shot.hitsRemaining > 0) {
      for (const enemy of enemies) {
        if (!enemy || !enemy.alive) continue;
        
        const dx = enemy.x - shot.x;
        const dy = enemy.y - shot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const hitRadius = 20 + (enemy.size || 20);
        
        if (dist < hitRadius) {
          this.applyDamage(enemy, {
            damage: shot.damage,
            element: 'PLASMA'
          });
          shot.hitsRemaining--;
          
          // Continue if pierce remaining
          if (shot.hitsRemaining <= 0) {
            shot.active = false;
            break;
          }
        }
      }
    }
  }

  /**
   * Spawn a summon (A1 clone, UNIQUE drone, MISSY pet)
   */
  spawnSummon(characterId, skillId, x, y, options = {}) {
    const summon = {
      id: this.nextId++,
      characterId: characterId,
      skillId: skillId,
      x: x,
      y: y,
      age: 0,
      lifetime: options.lifetime || 15.0, // 15 seconds default
      vx: options.vx || 0,
      vy: options.vy || 0,
      mode: options.mode || 'assist', // 'hunt', 'loot', 'assist'
      healActive: options.healActive || false,
      paintTarget: options.paintTarget || null,
      cargo: options.cargo || []
    };
    
    this.summons.push(summon);
    console.log(`✨ Spawned ${characterId} summon at (${x}, ${y})`);
    return summon;
  }

  /**
   * Fallback render for summon (if renderer not loaded)
   */
  renderSummonFallback(ctx, summon) {
    const cameraX = window.gameState?.camera?.x || 0;
    const screenX = summon.x - cameraX;
    const screenY = summon.y;
    
    if (screenX < -100 || screenX > (window.canvas?.width || 2000) + 100) {
      return;
    }
    
    ctx.save();
    ctx.translate(screenX, screenY);
    
    // Simple generic summon visualization
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = '#ffaa00';
    ctx.shadowColor = '#ffaa00';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  /**
   * Clear all projectiles
   */
  clear() {
    this.projectiles = [];
    this.vfxParticles = [];
    this.swordSlashes = [];
    this.pistolShots = [];
    this.muzzleFlashes = [];
    this.burstShots = [];
    this.summons = [];
  }
}
