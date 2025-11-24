// src/spirits/SpiritController.js
// Spirit companion AI behavior and control

export function updateSpirit(spirit, dt, owner, enemies = [], projectileSystem = null) {
  if (!spirit || !spirit.active) return;

  spirit.setOwner(owner);
  spirit.update(dt);

  // Auto-attack enemies
  if (projectileSystem && enemies.length > 0) {
    const now = performance.now();
    if (spirit.canAttack(now)) {
      const target = findBestTarget(spirit, owner, enemies);
      if (target) {
        const attacked = spirit.attack(now, target);
        if (attacked) {
          projectileSystem.createProjectile(
            spirit.attackType,
            spirit.x,
            spirit.y,
            target.x,
            target.y,
            spirit.attackDamage,
            target
          );
        }
      }
    }
  }

  // Apply special passive effects
  applyPassiveEffects(spirit, owner, dt);
}

function findBestTarget(spirit, owner, enemies) {
  if (!owner || enemies.length === 0) return null;

  // Targeting cone based on player direction
  const ownerDir = owner.facingLeft ? -1 : 1;
  const maxDist = 420;
  const maxAngle = 0.9; // radians (~50 degrees)

  let best = null;
  let bestScore = Infinity;

  for (const enemy of enemies) {
    if (!enemy.alive || enemy.hp <= 0) continue;

    const dx = enemy.x - owner.x;
    const dy = enemy.y - owner.y;
    const dist = Math.hypot(dx, dy);

    if (dist > maxDist) continue;

    // Angle check
    const angle = Math.atan2(dy, dx);
    const faceAngle = ownerDir >= 0 ? 0 : Math.PI;
    const angleDiff = Math.abs(Math.atan2(Math.sin(angle - faceAngle), Math.cos(angle - faceAngle)));

    if (angleDiff > maxAngle) continue;

    // Score: prefer closer, weaker enemies
    const distScore = dist / maxDist;
    const hpScore = Math.min(1, enemy.hp / 2000);
    const angleScore = angleDiff / maxAngle;
    const score = distScore * 0.4 + hpScore * 0.4 + angleScore * 0.2;

    if (score < bestScore) {
      bestScore = score;
      best = enemy;
    }
  }

  return best;
}

function applyPassiveEffects(spirit, owner, dt) {
  if (!spirit.specialPassive || !owner) return;

  switch (spirit.specialPassive) {
    case 'slow_fall':
      // Light Soul - reduce fall speed
      if (owner.vy > 3) {
        owner.vy = 3;
      }
      break;

    case 'gold_magnet':
      // Golden Spirit - attract pickups (if pickup system exists)
      // Implementation would go here
      break;

    case 'speed_boost':
      // Tech Essence - periodic speed bursts
      if (!owner._techBoostTime || owner._techBoostTime < performance.now()) {
        owner._techBoostTime = performance.now() + 200;
        if (owner.vx) {
          owner.vx += owner.vx >= 0 ? 0.15 : -0.15;
        }
      }
      break;

    case 'glide':
      // Storm Wisp - reduced air friction
      if (owner.vy > 4) {
        owner.vy = 4;
      }
      break;

    case 'earth_shield':
      // Guardian Sand - damage absorption (handled elsewhere)
      break;

    case 'burning_trail':
      // Ember Fox - leaves fire damage trail (handled elsewhere)
      break;
  }
}

export function equipSpirit(spirit) {
  if (spirit) {
    spirit.equip();
  }
}

export function unequipSpirit(spirit) {
  if (spirit) {
    spirit.unequip();
  }
}

export function getSpiritBonuses(spirit) {
  return spirit && spirit.equipped ? spirit.getBonuses() : {};
}

