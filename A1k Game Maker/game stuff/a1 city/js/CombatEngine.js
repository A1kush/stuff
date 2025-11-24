/* js/CombatEngine.js */

class CombatEngine {
  constructor() {
    this.damageNumbers = [];
    this.screenShake = 0;
    this.hitStop = 0;
    this.isPaused = false;
  }

  init() {
    // Hook into the main game loop if the shared EventBus exists
    if (window.EventBus) {
      window.EventBus.on('game:tick', this.update.bind(this));
      window.EventBus.on('game:render', this.render.bind(this));
    }
  }

  // Call this when an attack connects
  applyDamage(attacker, defender, skillMultiplier = 1.0) {
    const baseAtk = attacker.stats?.atk || 10;
    const defense = defender.stats?.def || 0;
    const critChance = attacker.stats?.crt || 0.05;

    const isCrit = Math.random() < critChance;
    let damage = Math.max(1, baseAtk * skillMultiplier - defense * 0.5);

    if (isCrit) {
      damage *= 1.5;
    }

    damage = Math.floor(damage);

    defender.hp = Math.max(0, defender.hp - damage);

    this.spawnDamageNumber(defender.x, defender.y - 20, damage, isCrit);
    this.triggerHitStop(isCrit ? 100 : 0);
    if (isCrit) {
      this.triggerScreenShake(5);
    }

    if (defender.hp <= 0) {
      this.handleDeath(defender);
    }

    return damage;
  }

  spawnDamageNumber(x, y, amount, isCrit) {
    this.damageNumbers.push({
      x,
      y,
      text: amount.toString(),
      life: 1.0,
      velocity: { x: (Math.random() - 0.5) * 2, y: -3 },
      isCrit,
      color: isCrit ? '#ff0000' : '#ffffff',
      scale: isCrit ? 1.5 : 1.0,
    });
  }

  triggerScreenShake(intensity) {
    this.screenShake = intensity;
  }

  triggerHitStop(ms) {
    if (ms > 0) {
      this.isPaused = true;
      setTimeout(() => {
        this.isPaused = false;
      }, ms);
    }
  }

  handleDeath(entity) {
    if (window.EventBus) {
      window.EventBus.emit('character:death', { id: entity.id, type: entity.type });
    }
    // TODO: add death particle effects here
  }

  update(dt) {
    if (this.isPaused) return;

    for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
      const dn = this.damageNumbers[i];
      dn.x += dn.velocity.x;
      dn.y += dn.velocity.y;
      dn.velocity.y += 0.1;
      dn.life -= dt;
      if (dn.life <= 0) {
        this.damageNumbers.splice(i, 1);
      }
    }

    if (this.screenShake > 0) {
      this.screenShake *= 0.9;
      if (this.screenShake < 0.5) {
        this.screenShake = 0;
      }
    }
  }

  render(ctx) {
    if (this.screenShake > 0) {
      const dx = (Math.random() - 0.5) * this.screenShake;
      const dy = (Math.random() - 0.5) * this.screenShake;
      ctx.translate(dx, dy);
    }

    this.damageNumbers.forEach((dn) => {
      ctx.globalAlpha = Math.max(0, dn.life);
      ctx.fillStyle = dn.color;
      ctx.font = `bold ${20 * dn.scale}px Arial`;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.strokeText(dn.text, dn.x, dn.y);
      ctx.fillText(dn.text, dn.x, dn.y);
      ctx.globalAlpha = 1.0;
    });
  }
}

window.CombatSystem = new CombatEngine();
