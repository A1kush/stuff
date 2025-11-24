/**
 * COMBAT ENGINE
 * Main combat system coordinator
 * 
 * @version 1.0.0
 */

class CombatEngine {
  constructor() {
    // Core combat state
    this.activeCharacter = 'A1'; // A1, UNIQUE, or MISSY
    this.currentHP = 1000;
    this.maxHP = 1000;
    this.rage = 0; // 0-100
    this.rageActive = false; // 2x ATK mode
    this.combo = 0;
    this.lastHitTime = 0;
    this.comboBreakDelay = 2000; // 2 seconds to break combo

    // Character stats
    this.characters = {
      A1: {
        id: 'A1',
        name: 'A1',
        maxHP: 1000,
        attackPower: 1.0,
        sprite: null
      },
      UNIQUE: {
        id: 'UNIQUE',
        name: 'Unique',
        maxHP: 900,
        attackPower: 1.2,
        sprite: null
      },
      MISSY: {
        id: 'MISSY',
        name: 'Missy',
        maxHP: 850,
        attackPower: 1.3,
        sprite: null
      }
    };

    // Position
    this.x = 400;
    this.y = 300;

    // Combat modules
    this.projectileManager = new ProjectileManager();
    this.skillExecutor = new SkillExecutor(this.projectileManager);

    // Sprite renderer (set externally)
    this.spriteRenderer = null;
    this.isMoving = false;
    this.lastAttackTime = 0;

    // Event system
    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    if (!window.combatEvents) {
      window.combatEvents = new EventTarget();
    }

    // Listen for damage dealt
    window.combatEvents.addEventListener('damageDealt', (e) => {
      this.onDamageDealt(e.detail);
    });

    // Listen for skill used
    window.combatEvents.addEventListener('skillUsed', (e) => {
      this.onSkillUsed(e.detail);
    });
  }

  /**
   * Called when damage is dealt to enemy
   * Infinite Horizon: Handle boredom timer reset for S-Rank+ enemies
   */
  onDamageDealt(detail) {
    // Build rage (for A1 and Missy) or style meter (for Unique)
    if (this.activeCharacter === 'UNIQUE') {
      // For Unique, build style meter instead
      if (!this.styleMeter) this.styleMeter = 0;
      this.styleMeter = Math.min(100, this.styleMeter + 2);
    } else {
      // For A1 and Missy, build rage
      this.addRage(2);
    }

    // Infinite Horizon: Reset boredom timer if enemy is S-Rank+
    if (detail.enemyRank && (detail.enemyRank.includes('S') || detail.enemyRank.includes('SS'))) {
      if (window.gameState) {
        window.gameState.boredomTimer = 0;
      }
    }

    // Increment combo
    this.combo++;
    this.lastHitTime = Date.now();

    // Check combo achievements
    this.checkComboAchievements();
  }

  /**
   * Called when skill is used
   */
  onSkillUsed(detail) {
    // Consume rage if rage mode active
    if (this.rageActive) {
      // Rage mode stays active
    }
  }

  /**
   * Activate skill by ID
   */
  activateSkill(skillId, targetX, targetY) {
    // Apply rage multiplier if active
    const skill = getSkillById(skillId);
    if (skill && this.rageActive) {
      skill.damage = Math.floor(skill.damage * 2);
    }

    // Trigger attack animation
    if (this.spriteRenderer) {
      this.spriteRenderer.setAnimation('attack');
      this.lastAttackTime = Date.now();
    }

    return this.skillExecutor.executeSkill(
      skillId,
      this.x,
      this.y,
      targetX || this.x + 100,
      targetY || this.y,
      this
    );
  }

  /**
   * Execute basic attack
   */
  basicAttack(targetX, targetY) {
    // Trigger attack animation
    if (this.spriteRenderer) {
      this.spriteRenderer.setAnimation('attack');
      this.lastAttackTime = Date.now();
    }

    return this.skillExecutor.executeBasicAttack(
      this.activeCharacter,
      this.x,
      this.y,
      targetX || this.x + 100,
      targetY || this.y,
      this.rageActive
    );
  }

  /**
   * Switch character
   */
  switchCharacter(characterId) {
    if (!this.characters[characterId]) {
      console.warn(`Character ${characterId} not found`);
      return false;
    }

    this.activeCharacter = characterId;
    this.currentHP = this.characters[characterId].maxHP;
    this.maxHP = this.characters[characterId].maxHP;

    // Update sprite renderer
    if (this.spriteRenderer) {
      this.spriteRenderer.setActiveCharacter(characterId);
      this.spriteRenderer.setPosition(this.x, this.y);
    }

    // Dispatch event
    if (window.combatEvents) {
      window.combatEvents.dispatchEvent(new CustomEvent('characterSwitched', {
        detail: { characterId, character: this.characters[characterId] }
      }));
    }

    return true;
  }

  /**
   * Activate rage mode (2x ATK)
   */
  activateRage() {
    if (this.rage < 100) {
      console.log('Not enough rage');
      return false;
    }

    this.rageActive = true;
    this.rage = 100;

    // Rage lasts 10 seconds
    setTimeout(() => {
      this.rageActive = false;
      this.rage = 0;
    }, 10000);

    // Dispatch event
    if (window.combatEvents) {
      window.combatEvents.dispatchEvent(new CustomEvent('rageActivated', {
        detail: { duration: 10000 }
      }));
    }

    return true;
  }

  /**
   * Add rage
   */
  addRage(amount) {
    this.rage = Math.min(100, this.rage + amount);
  }

  /**
   * Take damage
   */
  takeDamage(amount) {
    this.currentHP -= amount;
    
    if (this.currentHP <= 0) {
      this.currentHP = 0;
      this.onDeath();
    }

    // Dispatch event
    if (window.combatEvents) {
      window.combatEvents.dispatchEvent(new CustomEvent('playerDamaged', {
        detail: { amount, currentHP: this.currentHP, maxHP: this.maxHP }
      }));
    }
  }

  /**
   * Heal
   */
  heal(amount) {
    this.currentHP = Math.min(this.maxHP, this.currentHP + amount);

    // Dispatch event
    if (window.combatEvents) {
      window.combatEvents.dispatchEvent(new CustomEvent('playerHealed', {
        detail: { amount, currentHP: this.currentHP, maxHP: this.maxHP }
      }));
    }
  }

  /**
   * Called on death
   */
  onDeath() {
    // Check for revive
    if (this.reviveActive && this.reviveCount > 0) {
      this.currentHP = this.maxHP * 0.5;
      this.reviveCount--;
      this.reviveActive = this.reviveCount > 0;

      // Dispatch event
      if (window.combatEvents) {
        window.combatEvents.dispatchEvent(new CustomEvent('playerRevived', {
          detail: { currentHP: this.currentHP }
        }));
      }
    } else {
      // Game over
      if (window.combatEvents) {
        window.combatEvents.dispatchEvent(new CustomEvent('playerDied', {
          detail: { characterId: this.activeCharacter }
        }));
      }
    }
  }

  /**
   * Check combo achievements
   */
  checkComboAchievements() {
    if (this.combo === 10) {
      console.log('🏆 COMBO STARTER - 10 hit combo!');
    }
    if (this.combo === 50) {
      console.log('🏆 COMBO MASTER - 50 hit combo!');
    }
    if (this.combo === 100) {
      console.log('🏆 COMBO GOD - 100 hit combo!');
    }
  }

  /**
   * Update combat system
   * Infinite Horizon: Added boredom debuff check
   */
  update(deltaTime, enemies) {
    // Infinite Horizon: Boredom Debuff System
    if (window.gameState && this.activeCharacter === 'A1') {
      // Check if only low-rank enemies hit (> 60 seconds)
      if (window.gameState.boredomTimer > 60) {
        // Apply debuff: 10% attack speed reduction
        const characters = this.characters[this.activeCharacter];
        if (characters) {
          characters.attackSpeed = (characters.attackSpeed || 1.0) * 0.9;
        }
      }
    }

    // Infinite Horizon: Unique's Style Meter (replaces rage for Unique) - Phase 4
    if (this.activeCharacter === 'UNIQUE') {
      // Style meter will be built by holding R key (implemented in main.js)
      // This will be used for Demon Form transformation
      if (!this.styleMeter) {
        this.styleMeter = 0;
      }
    }

    // Update skill executor
    this.skillExecutor.update();

    // Update projectiles
    this.projectileManager.update(deltaTime, enemies);

    // Update sprite renderer
    if (this.spriteRenderer) {
      this.spriteRenderer.update(deltaTime);
      this.spriteRenderer.setPosition(this.x, this.y);

      // Auto-return to idle after attack animation
      if (this.lastAttackTime > 0 && Date.now() - this.lastAttackTime > 500) {
        const activeSprite = this.spriteRenderer.getActiveSprite();
        if (activeSprite && activeSprite.currentAnim === 'attack') {
          // Check if attack animation finished
          const anim = activeSprite.animations['attack'];
          if (anim && !anim.loop && activeSprite.currentFrame >= anim.frames - 1) {
            this.spriteRenderer.setAnimation(this.isMoving ? 'walk' : 'idle');
          }
        }
      }

      // Set animation based on movement
      if (!this.isMoving && this.lastAttackTime > 0 && Date.now() - this.lastAttackTime > 500) {
        this.spriteRenderer.setAnimation('idle');
      } else if (this.isMoving && Date.now() - this.lastAttackTime > 500) {
        this.spriteRenderer.setAnimation('walk');
      }
    }

    // Check combo break
    if (this.combo > 0 && Date.now() - this.lastHitTime > this.comboBreakDelay) {
      console.log(`Combo broken at ${this.combo} hits`);
      this.combo = 0;
    }

    // Update shield duration
    if (this.shieldActive && this.shieldDuration > 0) {
      this.shieldDuration -= deltaTime;
      if (this.shieldDuration <= 0) {
        this.shieldActive = false;
        this.shieldAmount = 0;
      }
    }
  }

  /**
   * Render combat visuals
   */
  render(ctx) {
    // Render character sprite first (behind projectiles)
    if (this.spriteRenderer) {
      this.spriteRenderer.render(ctx, this.x, this.y);
    }

    // Render projectiles (on top)
    this.projectileManager.render(ctx);
  }

  /**
   * Set movement state (for walk animation)
   */
  setMoving(moving) {
    this.isMoving = moving;
  }

  /**
   * Get equipped skills for current character
   */
  getEquippedSkills() {
    return getEquippedSkills(this.activeCharacter);
  }

  /**
   * Get skill cooldown info
   */
  getSkillCooldown(skillId) {
    return {
      remaining: this.skillExecutor.getCooldownRemaining(skillId),
      progress: this.skillExecutor.getCooldownProgress(skillId),
      isReady: !this.skillExecutor.isOnCooldown(skillId)
    };
  }

  /**
   * Reset combat state
   */
  reset() {
    this.currentHP = this.maxHP;
    this.rage = 0;
    this.rageActive = false;
    this.combo = 0;
    this.lastHitTime = 0;
    this.shieldActive = false;
    this.shieldAmount = 0;
    this.reviveActive = false;
    this.reviveCount = 0;
    this.skillExecutor.resetCooldowns();
    this.projectileManager.projectiles = [];
    this.projectileManager.vfxParticles = [];
  }
}
