// src/art/SkillEffects.js
// Visual effects for pet skills - projectiles, casts, impacts

export class SkillEffects {
  constructor() {
    this.projectiles = [];
    this.castEffects = [];
    this.impactEffects = [];
    this.screenShake = { x: 0, y: 0, intensity: 0 };
  }

  // Update all effects
  update(dt) {
    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.life += dt * 1000;
      
      if (proj.life >= proj.maxLife) {
        this.createImpact(proj.x, proj.y, proj.color, proj.size * 2);
        this.projectiles.splice(i, 1);
        continue;
      }
      
      // Move projectile
      if (proj.type === 'homing' && proj.target) {
        const dx = proj.target.x - proj.x;
        const dy = proj.target.y - proj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 5) {
          proj.vx = (dx / dist) * proj.speed;
          proj.vy = (dy / dist) * proj.speed;
        }
      }
      
      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;
    }
    
    // Update cast effects
    for (let i = this.castEffects.length - 1; i >= 0; i--) {
      const cast = this.castEffects[i];
      cast.life += dt * 1000;
      if (cast.life >= cast.maxLife) {
        this.castEffects.splice(i, 1);
      }
    }
    
    // Update impact effects
    for (let i = this.impactEffects.length - 1; i >= 0; i--) {
      const impact = this.impactEffects[i];
      impact.life += dt * 1000;
      if (impact.life >= impact.maxLife) {
        this.impactEffects.splice(i, 1);
      }
    }
    
    // Update screen shake
    if (this.screenShake.intensity > 0) {
      this.screenShake.intensity *= 0.92;
      if (this.screenShake.intensity < 0.1) {
        this.screenShake.intensity = 0;
        this.screenShake.x = 0;
        this.screenShake.y = 0;
      } else {
        this.screenShake.x = (Math.random() - 0.5) * this.screenShake.intensity;
        this.screenShake.y = (Math.random() - 0.5) * this.screenShake.intensity;
      }
    }
  }

  // Render all effects
  render(ctx) {
    ctx.save();
    
    // Apply screen shake
    if (this.screenShake.intensity > 0) {
      ctx.translate(this.screenShake.x, this.screenShake.y);
    }
    
    // Render cast effects (behind everything)
    for (const cast of this.castEffects) {
      this.renderCastEffect(ctx, cast);
    }
    
    // Render projectiles
    for (const proj of this.projectiles) {
      this.renderProjectile(ctx, proj);
    }
    
    // Render impacts (on top)
    for (const impact of this.impactEffects) {
      this.renderImpact(ctx, impact);
    }
    
    ctx.restore();
  }

  // CREATE PROJECTILE
  createProjectile(x, y, targetX, targetY, skillData, target = null) {
    const angle = Math.atan2(targetY - y, targetX - x);
    const speed = skillData.projectileSpeed || 300;
    
    this.projectiles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: skillData.projectileSize || 8,
      color: skillData.color,
      damage: skillData.damage,
      type: skillData.type,
      target: target,
      speed: speed,
      life: 0,
      maxLife: 2000,
      trail: [],
    });
  }

  // CREATE CAST EFFECT
  createCastEffect(x, y, color, duration = 1000, type = 'charge') {
    this.castEffects.push({
      x, y,
      color,
      type,
      life: 0,
      maxLife: duration,
      radius: 10,
    });
  }

  // CREATE IMPACT EFFECT
  createImpact(x, y, color, size = 20) {
    this.impactEffects.push({
      x, y,
      color,
      size,
      life: 0,
      maxLife: 500,
      particles: [],
    });
    
    // Create particles
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const speed = 50 + Math.random() * 50;
      this.impactEffects[this.impactEffects.length - 1].particles.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3,
      });
    }
  }

  // RENDER PROJECTILE
  renderProjectile(ctx, proj) {
    const alpha = 1 - (proj.life / proj.maxLife);
    
    ctx.save();
    ctx.globalAlpha = alpha;
    
    // Trail effect
    ctx.fillStyle = proj.color;
    ctx.shadowColor = proj.color;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, proj.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Inner glow
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = alpha * 0.6;
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, proj.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  // RENDER CAST EFFECT
  renderCastEffect(ctx, cast) {
    const progress = cast.life / cast.maxLife;
    const alpha = 1 - progress;
    const radius = cast.radius + progress * 30;
    
    ctx.save();
    ctx.globalAlpha = alpha * 0.5;
    
    // Expanding ring
    ctx.strokeStyle = cast.color;
    ctx.lineWidth = 3;
    ctx.shadowColor = cast.color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(cast.x, cast.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Particles
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + progress * Math.PI * 4;
      const particleX = cast.x + Math.cos(angle) * radius * 0.7;
      const particleY = cast.y + Math.sin(angle) * radius * 0.7;
      
      ctx.fillStyle = cast.color;
      ctx.beginPath();
      ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  // RENDER IMPACT
  renderImpact(ctx, impact) {
    const progress = impact.life / impact.maxLife;
    const alpha = 1 - progress;
    const explosionSize = impact.size + progress * impact.size;
    
    ctx.save();
    
    // Explosion circle
    ctx.globalAlpha = alpha * 0.7;
    ctx.fillStyle = impact.color;
    ctx.shadowColor = impact.color;
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(impact.x, impact.y, explosionSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Shockwave ring
    ctx.globalAlpha = alpha * 0.5;
    ctx.strokeStyle = impact.color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(impact.x, impact.y, explosionSize * 1.5, 0, Math.PI * 2);
    ctx.stroke();
    
    // Particles
    ctx.globalAlpha = alpha;
    for (const particle of impact.particles) {
      particle.x += particle.vx * 0.016;
      particle.y += particle.vy * 0.016;
      
      ctx.fillStyle = impact.color;
      ctx.beginPath();
      ctx.arc(impact.x + particle.x, impact.y + particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  // SPECIAL EFFECTS

  // Meteor Storm
  createMeteorStorm(centerX, centerY, color, count = 10) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const offsetX = (Math.random() - 0.5) * 300;
        const meteorX = centerX + offsetX;
        const meteorY = -50;
        const targetY = centerY;
        
        this.projectiles.push({
          x: meteorX,
          y: meteorY,
          vx: 0,
          vy: 400,
          size: 15,
          color: color,
          damage: 15,
          type: 'meteor',
          life: 0,
          maxLife: 3000,
          trail: [],
        });
      }, i * 200);
    }
    this.addScreenShake(8);
  }

  // Chain Lightning
  createChainLightning(startX, startY, targets, color, damage) {
    const chainPoints = [{ x: startX, y: startY }];
    
    for (let i = 0; i < Math.min(targets.length, 10); i++) {
      if (targets[i]) {
        chainPoints.push({ x: targets[i].x, y: targets[i].y });
      }
    }
    
    this.castEffects.push({
      x: startX,
      y: startY,
      color,
      type: 'chain_lightning',
      chainPoints,
      life: 0,
      maxLife: 800,
    });
    
    this.addScreenShake(12);
  }

  // Screen-wide explosion
  createScreenExplosion(centerX, centerY, color, radius = 400) {
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const distance = radius;
      const targetX = centerX + Math.cos(angle) * distance;
      const targetY = centerY + Math.sin(angle) * distance;
      
      setTimeout(() => {
        this.createImpact(targetX, targetY, color, 30);
      }, i * 50);
    }
    
    this.castEffects.push({
      x: centerX,
      y: centerY,
      color,
      type: 'explosion',
      radius: 0,
      maxRadius: radius,
      life: 0,
      maxLife: 2000,
    });
    
    this.addScreenShake(14);
  }

  // Tornado effect
  createTornado(x, y, color, duration = 3500) {
    this.castEffects.push({
      x, y,
      color,
      type: 'tornado',
      life: 0,
      maxLife: duration,
      rotation: 0,
    });
    this.addScreenShake(7);
  }

  // Add screen shake
  addScreenShake(intensity) {
    this.screenShake.intensity = Math.max(this.screenShake.intensity, intensity);
  }

  // Clear all effects
  clearAll() {
    this.projectiles = [];
    this.castEffects = [];
    this.impactEffects = [];
    this.screenShake = { x: 0, y: 0, intensity: 0 };
  }
}

