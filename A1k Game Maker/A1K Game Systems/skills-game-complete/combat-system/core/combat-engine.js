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
    this.comboSystem = new ComboSystem();
    this.masterySystem = new SkillMasterySystem();
    this.synergySystem = new SkillSynergySystem();
    this.cancelSystem = new SkillCancelingSystem();
    this.transformationSystem = new UltimateTransformationSystem();
    this.animationController = new AnimationController();
    this.characterAnimations = new CharacterAnimations();

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
   * Enhanced to support charge level, combos, mastery, and synergies
   */
  activateSkill(skillId, targetX, targetY, chargeLevel = 1.0) {
    // Get base skill
    let skill = getSkillById(skillId);
    if (!skill) return false;

    // Apply mastery bonuses
    const masteryBonuses = this.masterySystem.getMasteryBonuses(skillId);
    skill = { ...skill };
    skill.damage = Math.floor((skill.damage || skill.baseDamage || 0) * masteryBonuses.damage);
    skill.cooldown = (skill.cooldown || 0) * masteryBonuses.cooldown;

    // Apply transformation bonuses if active
    if (this.transformationSystem.isTransformed(this.activeCharacter)) {
      const transformBonuses = this.transformationSystem.getBonuses(this.activeCharacter);
      skill.damage = Math.floor(skill.damage * transformBonuses.damage);
      skill.cooldown = skill.cooldown * transformBonuses.cooldown;
    }

    // Check for synergy
    const synergy = this.synergySystem.checkSynergy(skillId);
    if (synergy) {
      skill = this.synergySystem.applySynergyBonus(skill, synergy);
    }

    // Apply combo multiplier
    const comboMultiplier = this.comboSystem.addSkillToCombo(skillId);
    skill.damage = Math.floor(skill.damage * comboMultiplier);

    // Apply rage multiplier if active
    if (this.rageActive) {
      skill.damage = Math.floor(skill.damage * 2);
    }

    // Apply charge multiplier
    if (skill.chargeable && chargeLevel > 0) {
      const chargeMultiplier = 0.5 + (chargeLevel * 1.5); // 0.5x to 2.0x
      skill.damage = Math.floor(skill.damage * chargeMultiplier);
    }

    // Register skill for canceling system
    this.cancelSystem.registerActiveSkill(skillId, Date.now());

    // Record skill use for mastery
    this.masterySystem.recordSkillUse(skillId);

    // Check if this is an ultimate skill and activate transformation
    if (skill.slot === 'X' && skill.chargeable) {
      this.transformationSystem.activateTransformation(this.activeCharacter, skill);
    }

    // Play skill animation
    const animConfig = this.characterAnimations.getSkillAnimation(this.activeCharacter, skillId);
    this.animationController.playAnimation(this.activeCharacter, 'cast', animConfig.frames * animConfig.speed * 1000);

    // Execute skill with modified stats
    return this.skillExecutor.executeSkill(
      skillId,
      this.x,
      this.y,
      targetX || this.x + 100,
      targetY || this.y,
      this,
      chargeLevel,
      skill // Pass modified skill
    );
  }

  /**
   * Execute basic attack
   */
  basicAttack(targetX, targetY) {
    // Play attack animation
    if (this.characterAnimations && this.animationController) {
      const animConfig = this.characterAnimations.getAnimation(this.activeCharacter, 'attack');
      this.animationController.playAnimation(this.activeCharacter, 'attack', animConfig.frames * animConfig.speed * 1000);
    }

    return this.skillExecutor.executeBasicAttack(
      this.activeCharacter,
      this.x,
      this.y,
      targetX || this.x + 100,
      targetY || this.y,
      this.rageActive // Pass rage state
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
   * Get equipped skills for current character from BagSystem
   * Reads from window.gameState.equippedSkills (slot1, slot2, slot3, etc.)
   */
  getEquippedSkills() {
    if (!window.gameState || !window.gameState.equippedSkills) {
      return [];
    }

    const equippedSkills = [];
    const charId = this.activeCharacter;

    // Check all slots (slot1, slot2, slot3, etc.)
    for (let i = 1; i <= 5; i++) {
      const slotKey = `slot${i}`;
      const skill = window.gameState.equippedSkills[slotKey];
      
      if (skill && skill.characterId === charId) {
        equippedSkills.push({
          ...skill,
          slot: i
        });
      }
    }

    return equippedSkills;
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

    // Update cancel system
    if (this.cancelSystem) {
      this.cancelSystem.clearCompleted();
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
   * Always renders projectiles regardless of enemy presence
   */
  render(ctx) {
    if (!ctx) {
      console.warn('⚠️ CombatEngine.render: No ctx provided');
      return;
    }

    // Always render projectiles (even without enemies)
    if (this.projectileManager && this.projectileManager.render) {
      try {
        this.projectileManager.render(ctx);
      } catch (err) {
        console.error('❌ Error rendering projectiles:', err);
      }
    } else {
      console.warn('⚠️ ProjectileManager not available for rendering');
    }

    // Render character sprite (if sprite renderer exists)
    if (this.activeCharacterSprite) {
      this.activeCharacterSprite.render(ctx, this.x, this.y);
    }
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
