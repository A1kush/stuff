// src/art/SpiritProjectiles.js
// Spirit companion attack projectiles with targeting and impacts

export class SpiritProjectiles {
  constructor() {
    this.projectiles = [];
    this.impacts = [];
  }

  update(dt, enemies = []) {
    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.life += dt * 1000;

      if (proj.life >= proj.maxLife) {
        this.createImpact(proj.x, proj.y, proj.color, proj.size * 2);
        this.projectiles.splice(i, 1);
        continue;
      }

      // Homing behavior
      if (proj.homing && proj.target && proj.target.alive) {
        const dx = proj.target.x - proj.x;
        const dy = proj.target.y - proj.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 5) {
          const turnRate = 0.1;
          const targetAngle = Math.atan2(dy, dx);
          const currentAngle = Math.atan2(proj.vy, proj.vx);
          let angleDiff = targetAngle - currentAngle;
          // Normalize angle
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          const newAngle = currentAngle + angleDiff * turnRate;
          const speed = Math.hypot(proj.vx, proj.vy);
          proj.vx = Math.cos(newAngle) * speed;
          proj.vy = Math.sin(newAngle) * speed;
        }
      }

      // Move projectile
      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;

      // Check collision with enemies
      for (const enemy of enemies) {
        if (!enemy.alive) continue;
        const dx = enemy.x - proj.x;
        const dy = enemy.y - proj.y;
        const dist = Math.hypot(dx, dy);
        if (dist < (enemy.width || 30) / 2 + proj.size) {
          // Hit!
          enemy.takeDamage?.(proj.damage);
          this.createImpact(proj.x, proj.y, proj.color, proj.size * 3);
          
          // Chain lightning
          if (proj.canChain && proj.chainCount > 0) {
            const nextTarget = this.findNearestEnemy(proj.x, proj.y, enemies, enemy, 100);
            if (nextTarget) {
              this.createChainLightning(proj.x, proj.y, nextTarget, proj.color, proj.damage * 0.7, proj.chainCount - 1);
            }
          }
          
          this.projectiles.splice(i, 1);
          break;
        }
      }
    }

    // Update impacts
    for (let i = this.impacts.length - 1; i >= 0; i--) {
      const impact = this.impacts[i];
      impact.life += dt * 1000;
      if (impact.life >= impact.maxLife) {
        this.impacts.splice(i, 1);
      }
    }
  }

  render(ctx) {
    // Render projectiles
    for (const proj of this.projectiles) {
      this.renderProjectile(ctx, proj);
    }

    // Render impacts
    for (const impact of this.impacts) {
      this.renderImpact(ctx, impact);
    }
  }

  // CREATE PROJECTILE
  createProjectile(spiritId, x, y, targetX, targetY, damage, target = null) {
    const angle = Math.atan2(targetY - y, targetX - x);
    const speed = 400;

    const projectileTypes = {
      'dark_bolt': {
        color: '#7c3aed',
        size: 8,
        trail: true,
        homing: false,
      },
      'light_beam': {
        color: '#ffd56a',
        size: 10,
        trail: true,
        homing: true,
      },
      'gold_shard': {
        color: '#ffbf3b',
        size: 6,
        trail: false,
        homing: false,
      },
      'tech_pulse': {
        color: '#3ec5ff',
        size: 9,
        trail: true,
        homing: true,
      },
      'chain_lightning': {
        color: '#60a5fa',
        size: 7,
        trail: true,
        homing: true,
        canChain: true,
        chainCount: 3,
      },
      'earth_spike': {
        color: '#d97706',
        size: 10,
        trail: false,
        homing: false,
      },
      'fire_bolt': {
        color: '#ff6b35',
        size: 9,
        trail: true,
        homing: false,
      },
    };

    const projType = projectileTypes[spiritId] || projectileTypes['dark_bolt'];

    this.projectiles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: projType.size,
      color: projType.color,
      damage: damage,
      homing: projType.homing,
      target: target,
      canChain: projType.canChain,
      chainCount: projType.chainCount || 0,
      life: 0,
      maxLife: 2000,
      trail: projType.trail,
    });
  }

  createChainLightning(x, y, target, color, damage, remaining) {
    if (!target || remaining <= 0) return;
    
    const angle = Math.atan2(target.y - y, target.x - x);
    const speed = 500;

    this.projectiles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 6,
      color: color,
      damage: damage,
      homing: true,
      target: target,
      canChain: true,
      chainCount: remaining,
      life: 0,
      maxLife: 1500,
      trail: true,
    });
  }

  renderProjectile(ctx, proj) {
    const alpha = 1 - (proj.life / proj.maxLife) * 0.3;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Trail
    if (proj.trail) {
      const trailLength = 20;
      const grad = ctx.createLinearGradient(
        proj.x, proj.y,
        proj.x - proj.vx * 0.05, proj.y - proj.vy * 0.05
      );
      grad.addColorStop(0, proj.color);
      grad.addColorStop(1, proj.color + '00');
      ctx.fillStyle = grad;
      ctx.fillRect(proj.x - trailLength / 2, proj.y - 3, trailLength, 6);
    }

    // Main orb
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

  createImpact(x, y, color, size) {
    this.impacts.push({
      x, y,
      color,
      size,
      life: 0,
      maxLife: 500,
      particles: [],
    });

    // Explosion particles
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const speed = 50 + Math.random() * 50;
      this.impacts[this.impacts.length - 1].particles.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2,
      });
    }
  }

  renderImpact(ctx, impact) {
    const progress = impact.life / impact.maxLife;
    const alpha = 1 - progress;
    const explosionSize = impact.size + progress * impact.size * 0.5;

    ctx.save();
    ctx.globalAlpha = alpha * 0.7;

    // Explosion flash
    ctx.fillStyle = impact.color;
    ctx.shadowColor = impact.color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(impact.x, impact.y, explosionSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Shockwave ring
    ctx.strokeStyle = impact.color;
    ctx.lineWidth = 3 * (1 - progress);
    ctx.globalAlpha = alpha * 0.5;
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

  findNearestEnemy(x, y, enemies, excludeEnemy, maxDist) {
    let nearest = null;
    let minDist = maxDist;

    for (const enemy of enemies) {
      if (!enemy.alive || enemy === excludeEnemy) continue;
      const dx = enemy.x - x;
      const dy = enemy.y - y;
      const dist = Math.hypot(dx, dy);
      if (dist < minDist) {
        minDist = dist;
        nearest = enemy;
      }
    }

    return nearest;
  }

  clearAll() {
    this.projectiles = [];
    this.impacts = [];
  }
}

