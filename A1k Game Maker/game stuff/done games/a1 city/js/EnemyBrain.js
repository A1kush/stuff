/* js/EnemyBrain.js */

class EnemyBrain {
  constructor() {
    this.entities = [];
  }

  register(entity) {
    // Seed default AI metadata so legacy enemy objects gain stateful behavior
    entity.aiState = 'IDLE';
    entity.aiTimer = 0;
    entity.target = null;
    entity.detectionRange = entity.detectionRange || 200;
    entity.attackRange = entity.attackRange || 40;
    entity.patrolHome = { x: entity.x, y: entity.y };
    this.entities.push(entity);
  }

  update(dt, player) {
    this.entities.forEach((entity) => {
      if (entity.hp <= 0) return;
      // State updates are split out so designers can hot-swap behavior logic later
      this.updateState(entity, player, dt);
    });
  }

  updateState(entity, player, dt) {
    const distToPlayer = this.getDistance(entity, player);

    switch (entity.aiState) {
      case 'IDLE':
        if (distToPlayer < entity.detectionRange) {
          entity.aiState = 'CHASE';
          entity.target = player;
        }
        break;

      case 'CHASE':
        if (distToPlayer > entity.detectionRange * 1.5) {
          entity.aiState = 'PATROL';
        } else if (distToPlayer < entity.attackRange) {
          entity.aiState = 'ATTACK';
        } else {
          // Use lightweight steering toward player to avoid full pathfinding cost
          this.moveTowards(entity, player.x, player.y, 1.5);
        }
        break;

      case 'ATTACK':
        if (entity.aiTimer <= 0) {
          window.CombatSystem.applyDamage(entity, player);
          entity.aiTimer = 60;
        } else {
          entity.aiTimer--;
        }

        if (distToPlayer > entity.attackRange) {
          entity.aiState = 'CHASE';
        }
        break;

      case 'PATROL':
        if (this.getDistance(entity, entity.patrolHome) < 5) {
          entity.aiState = 'IDLE';
        } else {
          // Patrol drift gently nudges enemies back home to keep towns populated
          this.moveTowards(entity, entity.patrolHome.x, entity.patrolHome.y, 0.5);
        }
        break;
    }
  }

  moveTowards(entity, targetX, targetY, speed) {
    const dx = targetX - entity.x;
    const dy = targetY - entity.y;
    const angle = Math.atan2(dy, dx);
    entity.x += Math.cos(angle) * speed;
    entity.y += Math.sin(angle) * speed;
  }

  getDistance(e1, e2) {
    return Math.sqrt((e2.x - e1.x) ** 2 + (e2.y - e1.y) ** 2);
  }
}

window.EnemyAI = new EnemyBrain();
