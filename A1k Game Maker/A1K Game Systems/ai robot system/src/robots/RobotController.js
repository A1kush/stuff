// src/robots/RobotController.js
// AI behavior and robot control

export function updateRobot(robot, dt, leader, enemies = []) {
  if (!robot || !robot.alive) return;
  
  // Update animation time
  robot.animTime += dt * 1000;
  
  // Get goal position based on mode
  const goal = getGoalPosition(robot, leader, enemies);
  
  if (goal) {
    const dx = goal.x - robot.x;
    const dy = goal.y - robot.y;
    const dist = Math.hypot(dx, dy);
    
    // Move towards goal
    if (dist > 10) {
      const step = Math.min(robot.speed * dt, dist);
      robot.x += (dx / dist) * step;
      robot.y += (dy / dist) * step;
      robot.animState = 'run';
      robot.facingLeft = dx < 0;
    } else {
      robot.animState = 'idle';
    }
  }
  
  // Handle combat
  if (robot.isSupport) {
    handleSupportBehavior(robot, leader, dt);
  } else {
    handleCombatBehavior(robot, enemies, dt);
  }
  
  // Special behaviors
  if (robot.canCloak && robot.mode === 'hunt') {
    robot.cloaked = Math.random() < 0.7; // 70% cloaked when hunting
  } else {
    robot.cloaked = false;
  }
  
  // Commander buffs
  if (robot.isCommander && robot.buffRadius > 0) {
    // Buff logic would go here
  }
}

function getGoalPosition(robot, leader, enemies) {
  if (!leader) return { x: robot.x, y: robot.y };
  
  switch (robot.mode) {
    case 'follow':
      return { x: leader.x - 80, y: leader.y };
      
    case 'aggro':
      const target = findTarget(robot, enemies);
      if (target) {
        const attackRange = robot.melee > 0 ? robot.melee : robot.ranged;
        return { x: target.x - attackRange, y: target.y };
      }
      return { x: leader.x - 80, y: leader.y };
      
    case 'guard':
      return { x: leader.x + 60, y: leader.y };
      
    case 'assist':
      return { x: leader.x, y: leader.y - 60 };
      
    case 'patrol':
      // Simple patrol pattern
      const patrolX = leader.x + Math.sin(robot.animTime / 2000) * 150;
      return { x: patrolX, y: leader.y };
      
    case 'defend':
    case 'command':
      return { x: leader.x, y: leader.y - 80 };
      
    case 'hunt':
    case 'flank':
      const huntTarget = findTarget(robot, enemies);
      if (huntTarget) {
        // Flank from side
        const flankOffset = robot.mode === 'flank' ? 100 : 0;
        return { x: huntTarget.x - flankOffset, y: huntTarget.y };
      }
      return { x: leader.x - 80, y: leader.y };
      
    case 'snipe':
    case 'overwatch':
      // Stay back
      return { x: leader.x - 200, y: leader.y };
      
    case 'build':
      return { x: leader.x + 100, y: leader.y };
      
    default:
      return { x: leader.x - 80, y: leader.y };
  }
}

function findTarget(robot, enemies) {
  if (!enemies || enemies.length === 0) return null;
  
  let target = null;
  
  switch (robot.targetMode) {
    case 'nearest':
      let minDist = Infinity;
      for (const enemy of enemies) {
        if (!enemy.alive) continue;
        const dist = Math.hypot(enemy.x - robot.x, enemy.y - robot.y);
        if (dist < minDist) {
          minDist = dist;
          target = enemy;
        }
      }
      break;
      
    case 'lowest':
    case 'lowest_ally':
      let minHP = Infinity;
      for (const enemy of enemies) {
        if (!enemy.alive) continue;
        if (enemy.hp < minHP) {
          minHP = enemy.hp;
          target = enemy;
        }
      }
      break;
      
    case 'boss':
      target = enemies.find(e => e.isBoss && e.alive) || null;
      if (!target) {
        // Fallback to nearest
        return findTarget({ ...robot, targetMode: 'nearest' }, enemies);
      }
      break;
      
    case 'highest_hp':
    case 'strongest':
      let maxHP = 0;
      for (const enemy of enemies) {
        if (!enemy.alive) continue;
        if (enemy.hp > maxHP) {
          maxHP = enemy.hp;
          target = enemy;
        }
      }
      break;
      
    case 'grouped':
      // Find enemy in densest group
      let maxNearby = 0;
      for (const enemy of enemies) {
        if (!enemy.alive) continue;
        let nearby = 0;
        for (const other of enemies) {
          if (!other.alive || other === enemy) continue;
          const dist = Math.hypot(other.x - enemy.x, other.y - enemy.y);
          if (dist < 100) nearby++;
        }
        if (nearby > maxNearby) {
          maxNearby = nearby;
          target = enemy;
        }
      }
      break;
      
    default:
      target = enemies.find(e => e.alive) || null;
  }
  
  return target;
}

function handleCombatBehavior(robot, enemies, dt) {
  if (enemies.length === 0) {
    robot.animState = 'idle';
    return;
  }
  
  const target = findTarget(robot, enemies);
  if (!target) return;
  
  const dist = Math.hypot(target.x - robot.x, target.y - robot.y);
  const attackRange = robot.melee > 0 ? robot.melee : robot.ranged;
  
  if (dist <= attackRange) {
    const now = performance.now();
    if (robot.canFire(now)) {
      robot.fire(now);
      // Attack logic would trigger visual effects here
      
      // Simple damage calculation
      if (dist <= robot.melee && robot.melee > 0) {
        // Melee attack
        target.takeDamage?.(robot.atk);
      } else if (robot.ranged > 0) {
        // Ranged attack
        target.takeDamage?.(robot.atk * 0.8);
      }
    }
  }
}

function handleSupportBehavior(robot, leader, dt) {
  if (!leader) return;
  
  // Healing behavior
  if (robot.healingPower > 0) {
    const healInterval = 2000; // Heal every 2 seconds
    if (robot.animTime % healInterval < dt * 1000) {
      if (leader.hp < leader.hpMax) {
        leader.heal?.(robot.healingPower);
        robot.animState = 'attack'; // Use attack anim for healing beam
      }
    }
  }
  
  // Shield behavior
  if (robot.shieldStrength > 0) {
    // Shield logic would go here
    robot.animState = 'idle';
  }
}

export function setRobotMode(robot, mode) {
  if (robot && robot.data.modes.includes(mode)) {
    robot.mode = mode;
  }
}

export function setRobotTargetMode(robot, targetMode) {
  if (robot && robot.data.targetModes.includes(targetMode)) {
    robot.targetMode = targetMode;
  }
}

