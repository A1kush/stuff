/**
 * CITY-COMBAT BRIDGE
 * Integrates combat system with 2.5D isometric city
 * 
 * @version 1.0.0
 */

class CityCombatBridge {
  constructor() {
    // Combat system
    this.combatEngine = null;
    this.combatHUD = null;
    this.skillButtons = null;
    this.damageNumbers = null;

    // Integration state
    this.isInitialized = false;
    this.combatMode = false;
    this.enemiesInRange = [];

    // Enemy system reference (from city)
    this.enemySystem = null;
  }

  /**
   * Initialize combat system
   */
  initialize() {
    if (this.isInitialized) return;

    console.log('🎮 Initializing Combat System...');

    // Create combat engine
    this.combatEngine = new CombatEngine();

    // Create UI systems
    this.combatHUD = new CombatHUD(this.combatEngine);
    this.skillButtons = new SkillButtonHandler(this.combatEngine);
    this.damageNumbers = new DamageNumberManager();
    
    // Expose damage number manager globally for skill executor
    window.damageNumberManager = this.damageNumbers;

    // Initialize progression systems
    this.presetSystem = new SkillPresetSystem();
    this.modSystem = new SkillModSystem();
    this.skillTree = new SkillTree();
    this.balancer = new SkillBalancer();
    this.accessibility = new AccessibilitySystem();

    // Expose globally
    window.skillPresetSystem = this.presetSystem;
    window.skillModSystem = this.modSystem;
    window.skillTree = this.skillTree;

    // Setup damage number spawning
    this.setupDamageNumbers();

    // Mark as initialized
    this.isInitialized = true;

    console.log('✅ Combat System Ready!');
    console.log(`Active Character: ${this.combatEngine.activeCharacter}`);
    console.log(`Equipped Skills: ${this.combatEngine.getEquippedSkills().length}`);
  }

  /**
   * Setup damage number spawning
   */
  setupDamageNumbers() {
    if (!window.combatEvents) return;

    window.combatEvents.addEventListener('damageDealt', (e) => {
      const { targetX, targetY, damage, skill } = e.detail;
      
      this.damageNumbers.spawn(targetX, targetY, damage, {
        isCrit: skill.crit || false,
        element: skill.element,
        statusEffect: this.getStatusEffect(skill)
      });
    });

    window.combatEvents.addEventListener('playerHealed', (e) => {
      const { amount } = e.detail;
      
      this.damageNumbers.spawn(
        this.combatEngine.x,
        this.combatEngine.y - 50,
        amount,
        { isHeal: true }
      );
    });
  }

  /**
   * Get status effect from skill
   */
  getStatusEffect(skill) {
    if (skill.burn) return 'burn';
    if (skill.freeze) return 'freeze';
    if (skill.stun) return 'stun';
    if (skill.lifesteal) return 'lifesteal';
    return null;
  }

  /**
   * Update combat system
   * Called from city's gameLoop()
   */
  update(deltaTime) {
    if (!this.isInitialized) return;

    // Update combat engine
    this.combatEngine.update(deltaTime, this.enemiesInRange);

    // Update skill buttons (cooldown displays)
    this.skillButtons.update();

    // Update damage numbers
    this.damageNumbers.update(deltaTime);

    // Update enemies in range
    this.updateEnemiesInRange();
  }

  /**
   * Render combat system
   * Called from city's render loop (draws on top of city)
   */
  render(ctx) {
    if (!this.isInitialized) {
      console.warn('⚠️ Combat bridge not initialized, skipping render');
      return;
    }

    if (!ctx) {
      console.warn('⚠️ No canvas context provided to combat render');
      return;
    }

    try {
      // Render combat visuals (projectiles, VFX)
      if (this.combatEngine && this.combatEngine.render) {
        this.combatEngine.render(ctx);
      }

      // Render damage numbers
      if (this.damageNumbers && this.damageNumbers.render) {
        this.damageNumbers.render(ctx);
      }

      // Render HUD
      if (this.combatHUD && this.combatHUD.render) {
        this.combatHUD.render(ctx);
      }
    } catch (err) {
      console.error('❌ Error in combat bridge render:', err);
    }
  }

  /**
   * Update enemies in range
   */
  updateEnemiesInRange() {
    // Get enemies from city's enemy system
    if (window.enemySystem && window.enemySystem.enemies) {
      this.enemiesInRange = window.enemySystem.enemies.filter(e => e.alive);
    } else {
      this.enemiesInRange = [];
    }
  }

  /**
   * Toggle combat mode
   */
  toggleCombatMode() {
    this.combatMode = !this.combatMode;
    console.log(`Combat Mode: ${this.combatMode ? 'ON' : 'OFF'}`);
  }

  /**
   * Get combat engine (for external access)
   */
  getCombatEngine() {
    return this.combatEngine;
  }

  /**
   * Hook into city's gameLoop
   * Call this once after city initializes
   */
  hookIntoGameLoop(gameLoopFunction) {
    console.log('🔗 Hooking combat into city game loop...');
    
    const originalLoop = gameLoopFunction;
    const self = this;

    return function(deltaTime) {
      // Call original city game loop
      originalLoop.call(this, deltaTime);

      // Call combat update/render
      self.update(deltaTime);
      // Note: render is called separately after city render
    };
  }

  /**
   * Hook into city's render function
   * Call this once after city initializes
   */
  hookIntoRender(renderFunction, ctx) {
    console.log('🔗 Hooking combat into city render...');
    
    const originalRender = renderFunction;
    const self = this;

    return function() {
      // Call original city render
      originalRender.call(this);

      // Call combat render (draws on top)
      self.render(ctx);
    };
  }
}

// Global instance
let cityCombatBridge = null;

/**
 * Initialize combat system integration
 * Call this after city is loaded
 */
function initializeCombatSystem() {
  if (cityCombatBridge) {
    console.log('Combat system already initialized');
    return cityCombatBridge;
  }

  cityCombatBridge = new CityCombatBridge();
  cityCombatBridge.initialize();

  // Expose globally for button access
  window.combatSystem = cityCombatBridge;
  window.combatEngine = cityCombatBridge.getCombatEngine();

  return cityCombatBridge;
}
