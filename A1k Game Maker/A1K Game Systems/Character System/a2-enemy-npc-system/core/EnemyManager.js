// 🎯 ENEMY MANAGER
// Manages enemy spawning, tracking, and lifecycle

import { getEnemyById, getAllEnemies } from '../data/enemies_db.js';
import { getZombieById } from '../data/zombies_db.js';
import { getVillainById } from '../data/villains_db.js';
import { getHeroById } from '../data/superheroes_db.js';
import { 
  getGoldBoss, 
  getGiftBoss, 
  getRandomBossFromPool,
  getRunnerBoss,
  getWaveBosses
} from '../data/runner_bosses_db.js';

export class EnemyManager {
  constructor() {
    this.activeEnemies = [];
    this.enemyIdCounter = 0;
    this.maxActiveEnemies = 50;
    this.difficultyMultiplier = 1.0;
  }

  /**
   * Spawn a new enemy
   * @param {string} enemyId - Enemy type ID from database
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} stage - Current stage (for scaling)
   * @returns {object} - Spawned enemy instance
   */
  spawnEnemy(enemyId, x, y, stage = 1) {
    if (this.activeEnemies.length >= this.maxActiveEnemies) {
      console.warn('Max enemies reached');
      return null;
    }

    // Try to find entity in all databases
    let template = getEnemyById(enemyId);
    if (!template) template = getZombieById(enemyId);
    if (!template) template = getVillainById(enemyId);
    if (!template) template = getHeroById(enemyId);
    if (!template) template = getRunnerBoss(enemyId);
    
    if (!template) {
      console.error(`Entity ${enemyId} not found in any database`);
      return null;
    }

    // Create enemy instance
    const enemy = {
      ...template,
      instanceId: `enemy_${this.enemyIdCounter++}`,
      x,
      y,
      currentHp: this.scaleHp(template.hp, stage),
      maxHp: this.scaleHp(template.hp, stage),
      atk: this.scaleAtk(template.atk, stage),
      def: this.scaleDef(template.def, stage),
      stage,
      state: 'idle',
      target: null,
      lastAttackTime: 0,
      animTime: performance.now(),
      facingLeft: true,
      isDead: false,
      deathAnimTime: 0,
    };

    this.activeEnemies.push(enemy);
    return enemy;
  }

  /**
   * Spawn multiple enemies in a wave
   * @param {string} enemyId - Enemy type
   * @param {number} count - How many to spawn
   * @param {object} spawnArea - {x, y, width, height}
   * @param {number} stage - Current stage
   * @returns {array} - Array of spawned enemies
   */
  spawnWave(enemyId, count, spawnArea, stage = 1) {
    const spawned = [];
    
    for (let i = 0; i < count; i++) {
      const x = spawnArea.x + Math.random() * spawnArea.width;
      const y = spawnArea.y + Math.random() * spawnArea.height;
      
      const enemy = this.spawnEnemy(enemyId, x, y, stage);
      if (enemy) spawned.push(enemy);
    }
    
    return spawned;
  }

  /**
   * Remove enemy from active list
   * @param {string} instanceId - Enemy instance ID
   */
  removeEnemy(instanceId) {
    const index = this.activeEnemies.findIndex(e => e.instanceId === instanceId);
    if (index !== -1) {
      this.activeEnemies.splice(index, 1);
    }
  }

  /**
   * Mark enemy as dead and trigger death sequence
   * @param {string} instanceId - Enemy instance ID
   * @param {function} onDeathCallback - Called when enemy dies
   */
  killEnemy(instanceId, onDeathCallback = null) {
    const enemy = this.getEnemy(instanceId);
    if (!enemy || enemy.isDead) return;

    enemy.isDead = true;
    enemy.deathAnimTime = performance.now();
    enemy.state = 'death';

    // Trigger callback (for loot, XP, etc.)
    if (onDeathCallback) {
      onDeathCallback(enemy);
    }

    // Remove after death animation (500ms)
    setTimeout(() => {
      this.removeEnemy(instanceId);
    }, 500);
  }

  /**
   * Get enemy by instance ID
   * @param {string} instanceId
   * @returns {object|null}
   */
  getEnemy(instanceId) {
    return this.activeEnemies.find(e => e.instanceId === instanceId) || null;
  }

  /**
   * Get all active enemies
   * @returns {array}
   */
  getAllActive() {
    return this.activeEnemies.filter(e => !e.isDead);
  }

  /**
   * Get enemies within range of a point
   * @param {number} x
   * @param {number} y
   * @param {number} range
   * @returns {array}
   */
  getEnemiesInRange(x, y, range) {
    return this.getAllActive().filter(e => {
      const dx = e.x - x;
      const dy = e.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist <= range;
    });
  }

  /**
   * Get nearest enemy to a point
   * @param {number} x
   * @param {number} y
   * @returns {object|null}
   */
  getNearestEnemy(x, y) {
    const active = this.getAllActive();
    if (active.length === 0) return null;

    let nearest = null;
    let minDist = Infinity;

    for (const enemy of active) {
      const dx = enemy.x - x;
      const dy = enemy.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < minDist) {
        minDist = dist;
        nearest = enemy;
      }
    }

    return nearest;
  }

  /**
   * Damage an enemy
   * @param {string} instanceId
   * @param {number} damage
   * @param {function} onDeathCallback
   * @returns {boolean} - True if enemy died
   */
  damageEnemy(instanceId, damage, onDeathCallback = null) {
    const enemy = this.getEnemy(instanceId);
    if (!enemy || enemy.isDead) return false;

    // Apply damage with defense reduction
    const actualDamage = Math.max(1, damage - enemy.def);
    enemy.currentHp -= actualDamage;

    // Check for death
    if (enemy.currentHp <= 0) {
      enemy.currentHp = 0;
      this.killEnemy(instanceId, onDeathCallback);
      return true;
    }

    return false;
  }

  /**
   * Clear all enemies
   */
  clearAll() {
    this.activeEnemies = [];
  }

  /**
   * Update all enemies
   * @param {number} dt - Delta time
   * @param {object} player - Player reference for AI
   */
  update(dt, player) {
    for (const enemy of this.activeEnemies) {
      if (enemy.isDead) continue;

      // Update animation time
      enemy.animTime += dt;

      // Basic AI - move toward player
      if (player && enemy.behavior === 'chase') {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > enemy.attackRange) {
          const moveSpeed = enemy.speed * dt / 1000;
          enemy.x += (dx / dist) * moveSpeed;
          enemy.y += (dy / dist) * moveSpeed;
          enemy.facingLeft = dx < 0;
        }
      }
    }
  }

  /**
   * Scale HP based on stage
   * @param {number} baseHp
   * @param {number} stage
   * @returns {number}
   */
  scaleHp(baseHp, stage) {
    const scaling = 1 + ((stage - 1) * 0.15); // +15% per stage
    return Math.floor(baseHp * scaling * this.difficultyMultiplier);
  }

  /**
   * Scale attack based on stage
   * @param {number} baseAtk
   * @param {number} stage
   * @returns {number}
   */
  scaleAtk(baseAtk, stage) {
    const scaling = 1 + ((stage - 1) * 0.12); // +12% per stage
    return Math.floor(baseAtk * scaling * this.difficultyMultiplier);
  }

  /**
   * Scale defense based on stage
   * @param {number} baseDef
   * @param {number} stage
   * @returns {number}
   */
  scaleDef(baseDef, stage) {
    const scaling = 1 + ((stage - 1) * 0.10); // +10% per stage
    return Math.floor(baseDef * scaling * this.difficultyMultiplier);
  }

  /**
   * Set difficulty multiplier
   * @param {number} multiplier - 1.0 = normal, 2.0 = hard
   */
  setDifficulty(multiplier) {
    this.difficultyMultiplier = multiplier;
  }

  /**
   * Get enemy count by tier
   * @returns {object}
   */
  getStats() {
    const active = this.getAllActive();
    return {
      total: active.length,
      basic: active.filter(e => e.tier === 'C').length,
      elite: active.filter(e => e.tier === 'B' || e.tier === 'A').length,
      miniBoss: active.filter(e => e.tier === 'S').length,
    };
  }

  // ═════════════════════════════════════════════════════════════════════════
  // RUNNER BOSS SPAWNING METHODS
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Spawn a gold boss (drops extra gold)
   * @param {string} bossId - Gold boss ID (gold_boss_v, gilded_serpent, gold_knight)
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} stage - Current stage (for scaling)
   * @returns {object} - Spawned gold boss instance
   */
  spawnGoldBoss(bossId, x, y, stage = 1) {
    const template = getGoldBoss(bossId);
    if (!template) {
      console.error(`Gold boss ${bossId} not found`);
      return null;
    }

    // Apply scaling if boss uses multipliers
    let hp = template.hp || template.maxHp;
    let atk = template.atk;
    let def = template.def;

    if (template.hpMul) {
      hp = Math.round(300 * (1 + stage * 0.12) * template.hpMul);
    }
    if (template.atkMul) {
      atk = Math.round(25 * (1 + stage * 0.12) * template.atkMul);
    }
    if (template.defMul) {
      def = Math.round(8 * (1 + stage * 0.12) * template.defMul);
    }

    const goldBoss = {
      ...template,
      instanceId: `gold_boss_${this.enemyIdCounter++}`,
      x,
      y,
      hp,
      maxHp: hp,
      currentHp: hp,
      atk,
      def,
      stage,
      state: 'idle',
      target: null,
      lastAttackTime: 0,
      animTime: performance.now(),
      facingLeft: true,
      isDead: false,
      deathAnimTime: 0,
      isRunnerBoss: true,
      bossCategory: 'gold'
    };

    this.activeEnemies.push(goldBoss);
    console.log(`💰 Spawned gold boss: ${goldBoss.name} (HP: ${goldBoss.hp}, ATK: ${goldBoss.atk})`);
    return goldBoss;
  }

  /**
   * Spawn a gift boss (from Gift Room challenge)
   * @param {string} bossId - Gift boss ID (candy_king, sugar_beast, etc.)
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} stage - Current stage
   * @returns {object} - Spawned gift boss instance
   */
  spawnGiftBoss(bossId, x, y, stage = 1) {
    const template = getGiftBoss(bossId);
    if (!template) {
      console.error(`Gift boss ${bossId} not found`);
      return null;
    }

    const giftBoss = {
      ...template,
      instanceId: `gift_boss_${this.enemyIdCounter++}`,
      x: x || template.position?.x || 0,
      y: y || template.position?.y || 0,
      currentHp: this.scaleHp(template.hp || template.maxHp, stage),
      maxHp: this.scaleHp(template.hp || template.maxHp, stage),
      atk: this.scaleAtk(template.atk, stage),
      def: this.scaleDef(template.def, stage),
      stage,
      state: 'idle',
      target: null,
      lastAttackTime: 0,
      animTime: performance.now(),
      facingLeft: true,
      isDead: false,
      deathAnimTime: 0,
      defeated: false,
      locked: template.locked || false,
      isRunnerBoss: true,
      bossCategory: 'gift'
    };

    this.activeEnemies.push(giftBoss);
    console.log(`🎁 Spawned gift boss: ${giftBoss.name} (HP: ${giftBoss.maxHp}, ATK: ${giftBoss.atk})`);
    return giftBoss;
  }

  /**
   * Spawn a random boss from a pool (gold, silver, armor, pet, gift, key, etc.)
   * @param {string} poolName - Pool name (gold, silver, armor, pet, gift, key, miniBoss, bigBoss)
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} stage - Current stage (for scaling)
   * @returns {object} - Spawned random boss instance
   */
  spawnRandomBoss(poolName, x, y, stage = 1) {
    const template = getRandomBossFromPool(poolName);
    if (!template) {
      console.error(`No bosses found in pool: ${poolName}`);
      return null;
    }

    // Apply scaling
    let hp = template.hp || template.maxHp;
    let atk = template.atk;
    let def = template.def;

    if (template.hpMul) {
      hp = Math.round(300 * (1 + stage * 0.12) * template.hpMul);
    } else if (hp) {
      hp = this.scaleHp(hp, stage);
    } else {
      hp = Math.round(300 * (1 + stage * 0.12) * 2.0); // Default
    }

    if (template.atkMul) {
      atk = Math.round(25 * (1 + stage * 0.12) * template.atkMul);
    } else if (atk) {
      atk = this.scaleAtk(atk, stage);
    } else {
      atk = Math.round(25 * (1 + stage * 0.12) * 1.1); // Default
    }

    if (template.defMul) {
      def = Math.round(8 * (1 + stage * 0.12) * template.defMul);
    } else if (def) {
      def = this.scaleDef(def, stage);
    } else {
      def = Math.round(8 * (1 + stage * 0.12)); // Default
    }

    const randomBoss = {
      ...template,
      instanceId: `random_boss_${this.enemyIdCounter++}`,
      x,
      y,
      hp,
      maxHp: hp,
      currentHp: hp,
      atk,
      def,
      stage,
      state: 'idle',
      target: null,
      lastAttackTime: 0,
      animTime: performance.now(),
      facingLeft: true,
      isDead: false,
      deathAnimTime: 0,
      isRunnerBoss: true,
      bossCategory: poolName
    };

    this.activeEnemies.push(randomBoss);
    console.log(`🎲 Spawned random boss from ${poolName} pool: ${randomBoss.name} (HP: ${randomBoss.hp}, ATK: ${randomBoss.atk})`);
    return randomBoss;
  }

  /**
   * Spawn bosses for a specific wave (uses Runner Game wave configuration)
   * @param {number} wave - Wave number (1-9, 9.5)
   * @param {object} spawnArea - {x, y, width, height}
   * @param {number} stage - Current stage
   * @returns {array} - Array of spawned bosses
   */
  spawnWaveBosses(wave, spawnArea, stage = 1) {
    const bosses = getWaveBosses(wave, stage);
    const spawned = [];

    for (const bossTemplate of bosses) {
      const x = spawnArea.x + Math.random() * spawnArea.width;
      const y = spawnArea.y + Math.random() * spawnArea.height;

      const boss = {
        ...bossTemplate,
        instanceId: `wave_boss_${this.enemyIdCounter++}`,
        x,
        y,
        currentHp: bossTemplate.hp || bossTemplate.maxHp,
        state: 'idle',
        target: null,
        lastAttackTime: 0,
        animTime: performance.now(),
        facingLeft: true,
        isDead: false,
        deathAnimTime: 0,
        isRunnerBoss: true,
        wave
      };

      this.activeEnemies.push(boss);
      spawned.push(boss);
    }

    console.log(`🌊 Spawned ${spawned.length} wave ${wave} bosses`);
    return spawned;
  }

  /**
   * Spawn the complete Gift Room challenge (4 mini-bosses + Gift King)
   * @param {object} roomBounds - {x, y, width, height}
   * @param {number} stage - Current stage
   * @returns {object} - {miniBosses: [], king: {}}
   */
  spawnGiftRoomChallenge(roomBounds, stage = 1) {
    const miniBosses = [
      this.spawnGiftBoss('candy_king', roomBounds.x + 200, roomBounds.y + 230, stage),
      this.spawnGiftBoss('sugar_beast', roomBounds.x + 420, roomBounds.y + 230, stage),
      this.spawnGiftBoss('chocolate_golem', roomBounds.x + 640, roomBounds.y + 230, stage),
      this.spawnGiftBoss('gummy_dragon', roomBounds.x + 860, roomBounds.y + 230, stage)
    ];

    const king = this.spawnGiftBoss('gift_king', roomBounds.x + 520, roomBounds.y + 160, stage);
    king.locked = true; // Unlocked when all mini-bosses defeated

    console.log(`🎁 Gift Room Challenge spawned: 4 mini-bosses + Gift King`);
    return { miniBosses, king };
  }

  /**
   * Check if all Gift Room mini-bosses are defeated and unlock Gift King
   * @param {object} giftRoomChallenge - Result from spawnGiftRoomChallenge
   * @returns {boolean} - True if king was unlocked
   */
  unlockGiftKing(giftRoomChallenge) {
    const { miniBosses, king } = giftRoomChallenge;
    
    if (king.locked) {
      const allDefeated = miniBosses.every(boss => boss.defeated || boss.isDead);
      if (allDefeated) {
        king.locked = false;
        console.log(`👑 Gift King has been unlocked!`);
        return true;
      }
    }
    
    return false;
  }
}

