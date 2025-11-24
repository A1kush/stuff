/**
 * DAMAGE NUMBERS
 * Floating damage text with animations
 * 
 * @version 1.0.0
 */

class DamageNumberManager {
  constructor() {
    this.damageNumbers = [];
  }

  /**
   * Spawn damage number
   * Enhanced to show damage even when hitting air (no enemies)
   */
  spawn(x, y, damage, options = {}) {
    // Always spawn damage number, even if no enemy hit
    const damageNumber = {
      x: x,
      y: y,
      startY: y,
      damage: Math.ceil(damage),
      lifetime: 0,
      maxLifetime: options.duration || 1500,
      velocityX: (Math.random() - 0.5) * 50,
      velocityY: -100,
      isCrit: options.isCrit || false,
      element: options.element || 'PHYSICAL',
      statusEffect: options.statusEffect || null,
      isHeal: options.isHeal || false,
      hitAir: options.hitAir || false // Flag for air hits
    };

    this.damageNumbers.push(damageNumber);
  }

  /**
   * Spawn damage number for skill cast (even without hitting enemy)
   */
  spawnSkillDamage(skill, targetX, targetY) {
    // Show skill damage at target location even if no enemy
    this.spawn(targetX, targetY, skill.damage || skill.baseDamage || 0, {
      element: skill.element || 'PHYSICAL',
      isCrit: false,
      hitAir: true,
      duration: 1200 // Slightly shorter for air hits
    });
  }

  /**
   * Update damage numbers
   */
  update(deltaTime) {
    for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
      const dmg = this.damageNumbers[i];
      
      // Update lifetime
      dmg.lifetime += deltaTime;

      // Update position
      dmg.x += dmg.velocityX * (deltaTime / 1000);
      dmg.y += dmg.velocityY * (deltaTime / 1000);

      // Apply gravity
      dmg.velocityY += 200 * (deltaTime / 1000);

      // Remove if expired
      if (dmg.lifetime >= dmg.maxLifetime) {
        this.damageNumbers.splice(i, 1);
      }
    }
  }

  /**
   * Render damage numbers
   */
  render(ctx) {
    for (const dmg of this.damageNumbers) {
      this.renderDamageNumber(ctx, dmg);
    }
  }

  /**
   * Render individual damage number
   */
  renderDamageNumber(ctx, dmg) {
    ctx.save();

    // Calculate alpha (fade out)
    const progress = dmg.lifetime / dmg.maxLifetime;
    const alpha = 1.0 - progress;

    // Font size
    let fontSize = dmg.isCrit ? 36 : 24;
    if (dmg.isHeal) fontSize = 28;

    ctx.font = `bold ${fontSize}px Arial`;

    // Color based on element/type
    let color = this.getElementColor(dmg.element);
    if (dmg.isHeal) color = '#00ff00';
    if (dmg.isCrit) color = '#ff00ff'; // Purple for crits

    ctx.fillStyle = `rgba(${this.hexToRgb(color).r}, ${this.hexToRgb(color).g}, ${this.hexToRgb(color).b}, ${alpha})`;
    ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.lineWidth = dmg.isCrit ? 4 : 3;

    // Text
    let text = dmg.damage.toString();
    if (dmg.isCrit) text = `${dmg.damage}!`; // Exclamation for crits
    if (dmg.isHeal) text = `+${dmg.damage}`;
    if (dmg.hitAir) text = `${dmg.damage} (air)`; // Indicate air hit

    // Scale effect for crits
    if (dmg.isCrit) {
      const scale = 1.0 + (Math.sin(dmg.lifetime / 100) * 0.2);
      ctx.save();
      ctx.translate(dmg.x, dmg.y);
      ctx.scale(scale, scale);
      ctx.strokeText(text, 0, 0);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    } else {
      ctx.strokeText(text, dmg.x, dmg.y);
      ctx.fillText(text, dmg.x, dmg.y);
    }

    // Status effect icon
    if (dmg.statusEffect) {
      const icon = this.getStatusIcon(dmg.statusEffect);
      ctx.font = '20px Arial';
      ctx.strokeText(icon, dmg.x + 40, dmg.y - 10);
      ctx.fillText(icon, dmg.x + 40, dmg.y - 10);
    }

    ctx.restore();
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
      LIGHT: '#ffffaa',
      PLASMA: '#00ffaa',
      ENERGY: '#00aaff',
      ARCANE: '#ff00ff',
      SUMMON: '#ffaa00'
    };
    return colors[element] || '#ffffff';
  }

  /**
   * Get status effect icon
   */
  getStatusIcon(effect) {
    const icons = {
      burn: '🔥',
      freeze: '❄️',
      stun: '⚡',
      poison: '☠️',
      lifesteal: '❤️'
    };
    return icons[effect] || '';
  }

  /**
   * Convert hex to RGB
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  }

  /**
   * Clear all damage numbers
   */
  clear() {
    this.damageNumbers = [];
  }
}
