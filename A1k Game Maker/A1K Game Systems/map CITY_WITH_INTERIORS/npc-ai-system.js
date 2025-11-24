/**
 * NPC AI SYSTEM
 * Handles hired NPCs (follow, attack enemies) and hostile NPCs (hunt player)
 */

class NPCAISystem {
  constructor() {
    this.updateInterval = 16; // ~60fps
    this.lastUpdate = Date.now();
  }

  /**
   * Update all NPCs
   */
  update(deltaTime) {
    if (!window.gameState.npcs) return;

    window.gameState.npcs.forEach(npc => {
      if (npc.hp <= 0) {
        this.handleDeath(npc);
        return;
      }

      // Update AI based on mode
      switch (npc.aiMode) {
        case 'follow':
          this.updateFollowAI(npc, deltaTime);
          break;
        case 'attack':
          this.updateAttackAI(npc, deltaTime);
          break;
        case 'flee':
          this.updateFleeAI(npc, deltaTime);
          break;
        case 'idle':
        default:
          this.updateIdleAI(npc, deltaTime);
          break;
      }

      // Update animation
      this.updateAnimation(npc, deltaTime);

      // Apply velocity
      npc.x += npc.vx * (deltaTime / 16);
      npc.y += npc.vy * (deltaTime / 16);

      // Slow down
      npc.vx *= 0.85;
      npc.vy *= 0.85;
    });
  }

  /**
   * Follow AI - for hired NPCs
   */
  updateFollowAI(npc, deltaTime) {
    if (!npc.target) {
      npc.target = window.gameState.party[window.gameState.currentLeader || 0];
    }

    if (!npc.target) return;

    const dx = npc.target.x - npc.x;
    const dy = npc.target.y - npc.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Keep distance from leader (60-100px)
    if (dist > 100) {
      const angle = Math.atan2(dy, dx);
      npc.vx += Math.cos(angle) * npc.speed * 0.01;
      npc.vy += Math.sin(angle) * npc.speed * 0.01;
      npc.state = 'walk';

      // Update direction
      if (Math.abs(dx) > Math.abs(dy)) {
        npc.direction = dx > 0 ? 'right' : 'left';
      } else {
        npc.direction = dy > 0 ? 'down' : 'up';
      }
    } else if (dist < 60) {
      // Too close, move away slightly
      const angle = Math.atan2(dy, dx);
      npc.vx -= Math.cos(angle) * npc.speed * 0.005;
      npc.vy -= Math.sin(angle) * npc.speed * 0.005;
      npc.state = 'idle';
    } else {
      npc.state = 'idle';
    }

    // Check for nearby enemies and attack them
    this.checkAndAttackEnemies(npc);
  }

  /**
   * Attack AI - for hostile NPCs
   */
  updateAttackAI(npc, deltaTime) {
    if (!npc.target) {
      npc.target = window.gameState.party[window.gameState.currentLeader || 0];
    }

    if (!npc.target || npc.target.hp <= 0) {
      npc.aiMode = 'idle';
      npc.hostile = false;
      return;
    }

    const dx = npc.target.x - npc.x;
    const dy = npc.target.y - npc.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Check health for flee
    const hpPercent = npc.hp / npc.maxHp;
    const personality = window.NPC_PERSONALITIES ? window.NPC_PERSONALITIES[npc.personality] : null;
    
    if (personality && hpPercent < personality.fleeThreshold) {
      npc.aiMode = 'flee';
      return;
    }

    // Chase target
    if (dist > 50) {
      const angle = Math.atan2(dy, dx);
      npc.vx += Math.cos(angle) * npc.speed * 0.015;
      npc.vy += Math.sin(angle) * npc.speed * 0.015;
      npc.state = 'walk';

      // Update direction
      if (Math.abs(dx) > Math.abs(dy)) {
        npc.direction = dx > 0 ? 'right' : 'left';
      } else {
        npc.direction = dy > 0 ? 'down' : 'up';
      }
    } else {
      // In attack range
      this.performAttack(npc);
    }
  }

  /**
   * Flee AI - run away from target
   */
  updateFleeAI(npc, deltaTime) {
    if (!npc.target) {
      npc.aiMode = 'idle';
      return;
    }

    const dx = npc.target.x - npc.x;
    const dy = npc.target.y - npc.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Run away
    if (dist < 300) {
      const angle = Math.atan2(dy, dx);
      npc.vx -= Math.cos(angle) * npc.speed * 0.02;
      npc.vy -= Math.sin(angle) * npc.speed * 0.02;
      npc.state = 'walk';

      // Update direction (opposite)
      if (Math.abs(dx) > Math.abs(dy)) {
        npc.direction = dx < 0 ? 'right' : 'left';
      } else {
        npc.direction = dy < 0 ? 'down' : 'up';
      }
    } else {
      // Far enough, calm down
      npc.aiMode = 'idle';
      npc.hostile = false;
      npc.state = 'idle';
    }
  }

  /**
   * Idle AI - stand still or wander
   */
  updateIdleAI(npc, deltaTime) {
    npc.state = 'idle';

    // Random wandering (5% chance per frame)
    if (Math.random() < 0.05) {
      const angle = Math.random() * Math.PI * 2;
      npc.vx += Math.cos(angle) * npc.speed * 0.005;
      npc.vy += Math.sin(angle) * npc.speed * 0.005;
    }
  }

  /**
   * Check for nearby enemies and attack them (for hired NPCs)
   */
  checkAndAttackEnemies(npc) {
    if (!window.gameState.enemies) return;

    let closestEnemy = null;
    let closestDist = 200; // Attack range

    window.gameState.enemies.forEach(enemy => {
      if (enemy.hp <= 0) return;

      const dx = enemy.x - npc.x;
      const dy = enemy.y - npc.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < closestDist) {
        closestEnemy = enemy;
        closestDist = dist;
      }
    });

    if (closestEnemy) {
      // Attack enemy
      const now = Date.now();
      if (now - npc.lastAttackTime > npc.attackCooldown) {
        this.attackEnemy(npc, closestEnemy);
        npc.lastAttackTime = now;
      }
    }
  }

  /**
   * NPC attacks enemy
   */
  attackEnemy(npc, enemy) {
    const damage = Math.max(1, npc.atk - enemy.def * 0.5);
    enemy.hp = Math.max(0, enemy.hp - damage);

    npc.state = 'attack';
    npc.animFrame = 0;

    // Create damage number
    if (typeof createDamageNumber === 'function') {
      createDamageNumber(enemy.x, enemy.y - 40, damage, '#00FF00');
    }

    // Add combo if function exists
    if (typeof addCombo === 'function') {
      addCombo(true);
    }

    if (enemy.hp <= 0) {
      enemy.state = 'dead';
      enemy.deathTimer = 0;
    }

    // Visual feedback
    setTimeout(() => {
      if (npc.state === 'attack') npc.state = 'idle';
    }, 300);
  }

  /**
   * NPC performs attack on target (player)
   */
  performAttack(npc) {
    const now = Date.now();
    if (now - npc.lastAttackTime < npc.attackCooldown) return;

    const target = npc.target;
    if (!target || target.hp <= 0) return;

    const damage = Math.max(1, npc.atk - (target.def || 0) * 0.5);
    target.hp = Math.max(0, target.hp - damage);

    npc.state = 'attack';
    npc.animFrame = 0;
    npc.lastAttackTime = now;

    // Create damage number
    if (typeof createDamageNumber === 'function') {
      createDamageNumber(target.x, target.y - 40, damage, '#FF0000');
    }

    if (typeof showToast === 'function') {
      showToast(`⚠️ ${npc.displayName} hit you for ${damage} damage!`);
    }

    // Check if player defeated
    if (target.hp <= 0) {
      target.isDefeated = true;
      if (typeof handlePlayerDeath === 'function') {
        handlePlayerDeath(target);
      }
    }

    // Visual feedback
    setTimeout(() => {
      if (npc.state === 'attack') npc.state = 'idle';
    }, 300);
  }

  /**
   * Update NPC animation
   */
  updateAnimation(npc, deltaTime) {
    if (npc.state === 'walk') {
      npc.animFrame += deltaTime / 100;
    } else if (npc.state === 'attack') {
      npc.animFrame += deltaTime / 50;
    } else {
      npc.animFrame += deltaTime / 200;
    }
  }

  /**
   * Handle NPC death
   */
  handleDeath(npc) {
    if (npc.state !== 'dead') {
      npc.state = 'dead';
      npc.deathTimer = 0;
      npc.vx = 0;
      npc.vy = 0;

      // Remove from hired NPCs
      if (npc.hired && window.gameState.hiredNPCs) {
        window.gameState.hiredNPCs = window.gameState.hiredNPCs.filter(n => n.id !== npc.id);
      }

      if (typeof showToast === 'function' && npc.hired) {
        showToast(`💀 ${npc.displayName} has been defeated!`);
      }
    }

    // Fade out
    npc.deathTimer += 16;
    if (npc.deathTimer > 3000) {
      // Remove NPC after 3 seconds
      window.gameState.npcs = window.gameState.npcs.filter(n => n.id !== npc.id);
    }
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NPCAISystem;
}
