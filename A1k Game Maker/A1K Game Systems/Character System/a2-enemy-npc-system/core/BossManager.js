// 👑 BOSS MANAGER
// Manages boss spawning, multi-phase transitions, and special mechanics

import { getBossById, getBossByStage, getBossPhase } from '../data/bosses_db.js';

export class BossManager {
  constructor() {
    this.activeBoss = null;
    this.currentPhase = null;
    this.phaseIndex = 0;
    this.lastPhaseTransitionTime = 0;
  }

  /**
   * Spawn a boss by ID or stage
   * @param {string|number} bossIdOrStage - Boss ID or stage number
   * @param {number} x - X position
   * @param {number} y - Y position
   * @returns {object} - Boss instance
   */
  spawnBoss(bossIdOrStage, x, y) {
    let template;
    
    if (typeof bossIdOrStage === 'number') {
      template = getBossByStage(bossIdOrStage);
    } else {
      template = getBossById(bossIdOrStage);
    }

    if (!template) {
      console.error(`Boss not found: ${bossIdOrStage}`);
      return null;
    }

    // Calculate total HP across all phases
    const totalHp = template.phases.reduce((sum, phase) => sum + phase.hp, 0);

    // Create boss instance
    this.activeBoss = {
      ...template,
      instanceId: `boss_${Date.now()}`,
      x,
      y,
      totalHp,
      currentHp: totalHp,
      maxHp: totalHp,
      phaseIndex: 0,
      state: 'idle',
      target: null,
      lastAttackTime: 0,
      animTime: performance.now(),
      facingLeft: true,
      isDead: false,
      deathAnimTime: 0,
      dialogueShown: {},
    };

    // Set initial phase
    this.updatePhase();

    return this.activeBoss;
  }

  /**
   * Update current phase based on HP
   */
  updatePhase() {
    if (!this.activeBoss) return;

    const boss = this.activeBoss;
    const hpPercent = boss.currentHp / boss.totalHp;
    
    // Find appropriate phase
    let newPhaseIndex = 0;
    for (let i = boss.phases.length - 1; i >= 0; i--) {
      const phase = boss.phases[i];
      if (!phase.hpThreshold || hpPercent <= phase.hpThreshold) {
        newPhaseIndex = i;
        break;
      }
    }

    // Check if phase changed
    if (newPhaseIndex !== boss.phaseIndex) {
      boss.phaseIndex = newPhaseIndex;
      this.transitionToPhase(newPhaseIndex);
    }

    // Update current phase stats
    this.currentPhase = boss.phases[boss.phaseIndex];
    boss.atk = this.currentPhase.atk;
    boss.def = this.currentPhase.def;
    boss.speed = this.currentPhase.speed;
    boss.attackRange = this.currentPhase.attackRange;
    boss.abilities = this.currentPhase.abilities;
  }

  /**
   * Transition to a new phase
   * @param {number} phaseIndex
   */
  transitionToPhase(phaseIndex) {
    if (!this.activeBoss) return;

    const phase = this.activeBoss.phases[phaseIndex];
    this.lastPhaseTransitionTime = performance.now();

    // Show phase dialogue
    if (phase.dialogue && phase.dialogue.length > 0) {
      const randomDialogue = phase.dialogue[Math.floor(Math.random() * phase.dialogue.length)];
      console.log(`${this.activeBoss.name}: "${randomDialogue}"`);
      
      // Trigger dialogue event
      if (this.onPhaseTransition) {
        this.onPhaseTransition({
          boss: this.activeBoss,
          phase: phaseIndex + 1,
          dialogue: randomDialogue,
        });
      }
    }

    // Phase transition visual effect
    if (this.onPhaseEffect) {
      this.onPhaseEffect(this.activeBoss, phase);
    }
  }

  /**
   * Damage the boss
   * @param {number} damage
   * @param {function} onDeathCallback
   * @returns {boolean} - True if boss died
   */
  damageBoss(damage, onDeathCallback = null) {
    if (!this.activeBoss || this.activeBoss.isDead) return false;

    const boss = this.activeBoss;
    const phase = this.currentPhase;

    // Apply damage with defense reduction
    const actualDamage = Math.max(1, damage - phase.def);
    boss.currentHp -= actualDamage;

    // Update phase if HP threshold crossed
    this.updatePhase();

    // Check for death
    if (boss.currentHp <= 0) {
      boss.currentHp = 0;
      this.killBoss(onDeathCallback);
      return true;
    }

    return false;
  }

  /**
   * Kill the boss
   * @param {function} onDeathCallback
   */
  killBoss(onDeathCallback = null) {
    if (!this.activeBoss || this.activeBoss.isDead) return;

    this.activeBoss.isDead = true;
    this.activeBoss.deathAnimTime = performance.now();
    this.activeBoss.state = 'death';

    // Show defeat dialogue
    if (this.activeBoss.defeatDialogue) {
      const dialogue = Array.isArray(this.activeBoss.defeatDialogue) 
        ? this.activeBoss.defeatDialogue[0]
        : this.activeBoss.defeatDialogue;
      console.log(`${this.activeBoss.name}: "${dialogue}"`);
    }

    // Trigger death callback
    if (onDeathCallback) {
      onDeathCallback(this.activeBoss);
    }

    // Clear boss after death animation
    setTimeout(() => {
      this.clearBoss();
    }, 2000);
  }

  /**
   * Clear active boss
   */
  clearBoss() {
    this.activeBoss = null;
    this.currentPhase = null;
    this.phaseIndex = 0;
  }

  /**
   * Check if boss is active
   * @returns {boolean}
   */
  hasBoss() {
    return this.activeBoss !== null && !this.activeBoss.isDead;
  }

  /**
   * Get current boss
   * @returns {object|null}
   */
  getBoss() {
    return this.activeBoss;
  }

  /**
   * Get current phase
   * @returns {object|null}
   */
  getCurrentPhase() {
    return this.currentPhase;
  }

  /**
   * Get phase progress (0-1)
   * @returns {number}
   */
  getPhaseProgress() {
    if (!this.activeBoss) return 0;
    return this.activeBoss.currentHp / this.activeBoss.totalHp;
  }

  /**
   * Update boss (called each frame)
   * @param {number} dt - Delta time
   * @param {object} player - Player reference
   */
  update(dt, player) {
    if (!this.activeBoss || this.activeBoss.isDead) return;

    // Update animation time
    this.activeBoss.animTime += dt;

    // Update phase based on HP
    this.updatePhase();

    // Basic boss AI - move toward player
    if (player && this.currentPhase.behavior.includes('aggressive')) {
      const dx = player.x - this.activeBoss.x;
      const dy = player.y - this.activeBoss.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > this.activeBoss.attackRange) {
        const moveSpeed = this.activeBoss.speed * dt / 1000;
        this.activeBoss.x += (dx / dist) * moveSpeed;
        this.activeBoss.y += (dy / dist) * moveSpeed;
        this.activeBoss.facingLeft = dx < 0;
      }
    }
  }

  /**
   * Set phase transition callback
   * @param {function} callback
   */
  onPhaseChange(callback) {
    this.onPhaseTransition = callback;
  }

  /**
   * Set phase effect callback
   * @param {function} callback
   */
  onPhaseEffectTrigger(callback) {
    this.onPhaseEffect = callback;
  }
}

