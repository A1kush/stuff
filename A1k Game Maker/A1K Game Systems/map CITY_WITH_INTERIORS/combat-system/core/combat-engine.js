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
   */
  onDamageDealt(detail) {
    // Build rage
    this.addRage(2);

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
    return this.skillExecutor.executeBasicAttack(
      this.activeCharacter,
      this.x,
      this.y,
      targetX || this.x + 100,
      targetY || this.y
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
   */
  update(deltaTime, enemies) {
    // Update skill executor
    this.skillExecutor.update();

    // Update projectiles
    this.projectileManager.update(deltaTime, enemies);

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
    // Render projectiles
    this.projectileManager.render(ctx);

    // Render character sprite (if sprite renderer exists)
    if (this.activeCharacterSprite) {
      this.activeCharacterSprite.render(ctx, this.x, this.y);
    }
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
