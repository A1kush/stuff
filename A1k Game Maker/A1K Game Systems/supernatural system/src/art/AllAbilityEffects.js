// src/art/AllAbilityEffects.js
// Visual effects for all 7 supernatural abilities

export class AllAbilityEffects {
  constructor() {
    this.activeEffects = [];
    this.particles = [];
  }

  update(dt) {
    // Update active effects
    for (let i = this.activeEffects.length - 1; i >= 0; i--) {
      const effect = this.activeEffects[i];
      effect.life += dt * 1000;
      if (effect.life >= effect.maxLife) {
        this.activeEffects.splice(i, 1);
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt * 1000;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.gravity * dt;
      p.vx *= 0.98;
      p.vy *= 0.98;
    }
  }

  render(ctx) {
    // Render all active effects
    for (const effect of this.activeEffects) {
      this.renderEffect(ctx, effect);
    }

    // Render particles
    for (const p of this.particles) {
      this.renderParticle(ctx, p);
    }
  }

  // 1. DIVINE BARRIER - Protective shield ring
  activateDivineBarrier(x, y) {
    this.activeEffects.push({
      type: 'divine_barrier',
      x, y,
      color: '#7b61ff',
      secondaryColor: '#2EA8FF',
      life: 0,
      maxLife: 4000,
      radius: 60,
    });

    // Create protective particles
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      this.particles.push({
        x: x + Math.cos(angle) * 50,
        y: y + Math.sin(angle) * 50,
        vx: Math.cos(angle) * 20,
        vy: Math.sin(angle) * 20,
        color: '#2EA8FF',
        size: 3,
        life: 0,
        maxLife: 1000,
        gravity: 0,
      });
    }
  }

  // 2. ANGELIC MIGHT - Power-up aura
  activateAngelicMight(x, y) {
    this.activeEffects.push({
      type: 'angelic_might',
      x, y,
      color: '#ffd56a',
      secondaryColor: '#ff6b35',
      life: 0,
      maxLife: 5000,
      radius: 40,
    });

    // Ascending light particles
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        this.particles.push({
          x: x + (Math.random() - 0.5) * 30,
          y: y + 20,
          vx: (Math.random() - 0.5) * 10,
          vy: -50 - Math.random() * 30,
          color: '#ffd56a',
          size: 2 + Math.random() * 2,
          life: 0,
          maxLife: 2000,
          gravity: -10,
        });
      }, i * 100);
    }
  }

  // 3. DASH NOVA - Speed burst with afterimages
  activateDashNova(x, y, direction = 1) {
    this.activeEffects.push({
      type: 'dash_nova',
      x, y,
      color: '#60a5fa',
      secondaryColor: '#e0e7ff',
      life: 0,
      maxLife: 200,
      direction,
    });

    // Afterimage trail
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.activeEffects.push({
          type: 'afterimage',
          x: x - i * 20 * direction,
          y: y,
          color: '#60a5fa',
          life: 0,
          maxLife: 300,
        });
      }, i * 30);
    }

    // Speed particles
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: x,
        y: y + (Math.random() - 0.5) * 40,
        vx: -direction * (100 + Math.random() * 100),
        vy: (Math.random() - 0.5) * 50,
        color: '#e0e7ff',
        size: 2,
        life: 0,
        maxLife: 400,
        gravity: 0,
      });
    }
  }

  // 4. RADIANT BURST - Explosion wave
  activateRadiantBurst(x, y) {
    this.activeEffects.push({
      type: 'radiant_burst',
      x, y,
      color: '#ffd56a',
      secondaryColor: '#fff7d1',
      life: 0,
      maxLife: 400,
      radius: 0,
      maxRadius: 150,
    });

    // Light rays
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      this.activeEffects.push({
        type: 'light_ray',
        x, y,
        angle,
        color: '#ffd56a',
        life: 0,
        maxLife: 600,
        length: 0,
        maxLength: 100,
      });
    }

    // Burst particles
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const speed = 100 + Math.random() * 100;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: '#fff7d1',
        size: 2 + Math.random() * 2,
        life: 0,
        maxLife: 600,
        gravity: 0,
      });
    }
  }

  // 5. FLAME DASH - Fire trail
  activateFlameDash(x, y, direction = 1) {
    this.activeEffects.push({
      type: 'flame_dash',
      x, y,
      color: '#ff6b35',
      secondaryColor: '#fbbf24',
      life: 0,
      maxLife: 200,
      direction,
    });

    // Fire trail particles
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        this.particles.push({
          x: x - i * 10 * direction,
          y: y + (Math.random() - 0.5) * 20,
          vx: -direction * (Math.random() * 30),
          vy: -20 - Math.random() * 30,
          color: i % 2 === 0 ? '#ff6b35' : '#fbbf24',
          size: 3 + Math.random() * 3,
          life: 0,
          maxLife: 1000 + Math.random() * 1000,
          gravity: 50,
        });
      }, i * 20);
    }
  }

  // 6. AURA OF FORTUNE - Luck sparkles (passive visual)
  renderAuraOfFortune(x, y, animTime) {
    const time = animTime / 1000;
    
    // Golden shimmer particles
    for (let i = 0; i < 4; i++) {
      const angle = time * 2 + i * (Math.PI / 2);
      const radius = 30 + Math.sin(time * 3 + i) * 10;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      
      ctx.save();
      ctx.fillStyle = '#ffbf3b';
      ctx.shadowColor = '#ffd56a';
      ctx.shadowBlur = 10;
      ctx.globalAlpha = 0.6 + Math.sin(time * 6 + i) * 0.3;
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // 7. IRON WILL - Steel defensive aura (passive visual)
  renderIronWill(x, y, animTime) {
    const time = animTime / 1000;
    const pulse = Math.sin(time * 2) * 0.2 + 0.8;
    
    // Steel ring
    ctx.save();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4 * pulse;
    ctx.shadowColor = '#cbd5e1';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // RENDER EFFECT
  renderEffect(ctx, effect) {
    const progress = effect.life / effect.maxLife;
    const alpha = effect.type === 'afterimage' ? (1 - progress) * 0.5 : 1;

    ctx.save();
    ctx.globalAlpha = alpha;

    switch (effect.type) {
      case 'divine_barrier':
        this.renderDivineBarrierEffect(ctx, effect, progress);
        break;
      case 'angelic_might':
        this.renderAngelicMightEffect(ctx, effect, progress);
        break;
      case 'dash_nova':
      case 'flame_dash':
        this.renderDashEffect(ctx, effect, progress);
        break;
      case 'radiant_burst':
        this.renderRadiantBurstEffect(ctx, effect, progress);
        break;
      case 'light_ray':
        this.renderLightRay(ctx, effect, progress);
        break;
      case 'afterimage':
        this.renderAfterimage(ctx, effect);
        break;
    }

    ctx.restore();
  }

  renderDivineBarrierEffect(ctx, effect, progress) {
    const radius = effect.radius + progress * 20;
    const alpha = 1 - progress * 0.5;

    ctx.globalAlpha = alpha * 0.6;
    ctx.strokeStyle = effect.color;
    ctx.lineWidth = 4;
    ctx.shadowColor = effect.secondaryColor;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Inner ring
    ctx.strokeStyle = effect.secondaryColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, radius - 5, 0, Math.PI * 2);
    ctx.stroke();
  }

  renderAngelicMightEffect(ctx, effect, progress) {
    const pulseSize = 1 + Math.sin(progress * Math.PI * 4) * 0.2;

    ctx.fillStyle = effect.color;
    ctx.shadowColor = effect.color;
    ctx.shadowBlur = 30;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, effect.radius * pulseSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  renderDashEffect(ctx, effect, progress) {
    const width = 60 * (1 - progress);
    const height = 40;

    const grad = ctx.createLinearGradient(
      effect.x - width / 2, effect.y,
      effect.x + width / 2, effect.y
    );
    grad.addColorStop(0, effect.color + '00');
    grad.addColorStop(0.5, effect.color);
    grad.addColorStop(1, effect.color + '00');

    ctx.fillStyle = grad;
    ctx.globalAlpha = 1 - progress;
    ctx.fillRect(effect.x - width / 2, effect.y - height / 2, width, height);
  }

  renderRadiantBurstEffect(ctx, effect, progress) {
    const currentRadius = progress * effect.maxRadius;

    ctx.strokeStyle = effect.color;
    ctx.lineWidth = 8 * (1 - progress);
    ctx.globalAlpha = 1 - progress;
    ctx.shadowColor = effect.color;
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, currentRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  renderLightRay(ctx, effect, progress) {
    const length = progress * effect.maxLength;

    ctx.save();
    ctx.translate(effect.x, effect.y);
    ctx.rotate(effect.angle);
    
    const grad = ctx.createLinearGradient(0, 0, 0, -length);
    grad.addColorStop(0, effect.color + '00');
    grad.addColorStop(0.3, effect.color);
    grad.addColorStop(1, effect.color + '00');

    ctx.strokeStyle = grad;
    ctx.lineWidth = 6 * (1 - progress);
    ctx.globalAlpha = 1 - progress;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -length);
    ctx.stroke();

    ctx.restore();
  }

  renderAfterimage(ctx, effect) {
    ctx.fillStyle = effect.color;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(effect.x - 15, effect.y - 25, 30, 50);
  }

  renderParticle(ctx, p) {
    const alpha = 1 - (p.life / p.maxLife);
    
    ctx.fillStyle = p.color;
    ctx.globalAlpha = alpha * 0.8;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  clearAll() {
    this.activeEffects = [];
    this.particles = [];
  }
}

