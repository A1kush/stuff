/**
 * unified-bridge.js - Master Integration System
 * @version 1.0.0
 * @description Connects ALL systems together - the heart of the level system
 *
 * Connects:
 * - New Stats System ↔ Old stats.js
 * - Progression v95 (preserves 9.5 logic!)
 * - Talent-store-system (59 talents)
 * - Auto-skill expansion (3 new lanes)
 * - Others-system (quest, supernatural, inventory, skin, settings)
 * - Equipment system
 * - Skill system
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.UnifiedBridge = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // UNIFIED BRIDGE CLASS
  // ============================

  class UnifiedBridge {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          autoInit: false,
          autoConnect: true,
          debug: false,
        },
        options
      );

      // Core systems
      this.eventBus = null;
      this.statsSystem = null;
      this.levelSystem = null;

      // Combat systems
      this.enemyScaling = null;
      this.damageTypes = null;
      this.statusEffects = null;

      // Talent systems
      this.talentIntegration = null;
      this.autoSkillExpansion = null;

      // External systems
      this.oldStatsSystem = null;
      this.progressionV95 = null;
      this.talentStore = null;
      this.othersSystem = {};

      this.initialized = false;
    }

    /**
     * Initialize the unified bridge
     * @param {Object} options - Initialization options
     * @returns {Promise<UnifiedBridge>}
     */
    async init(options = {}) {
      if (this.initialized) {
        console.warn("[UnifiedBridge] Already initialized");
        return this;
      }

      if (this.options.debug) {
        console.log("[UnifiedBridge] Initializing...");
      }

      // Step 1: Create EventBus
      this.eventBus = this._createEventBus();

      // Step 2: Initialize core systems
      await this._initCoreSystems();

      // Step 3: Initialize combat systems
      await this._initCombatSystems();

      // Step 4: Initialize talent systems
      await this._initTalentSystems();

      // Step 5: Connect to external systems
      if (this.options.autoConnect) {
        await this._connectExternalSystems();
      }

      // Step 6: Set up synchronization
      this._setupSync();

      this.initialized = true;

      this.eventBus.emit("unifiedbridge:ready", {
        systems: this._getSystemStatus(),
      });

      if (this.options.debug) {
        console.log(
          "[UnifiedBridge] Initialization complete",
          this._getSystemStatus()
        );
      }

      return this;
    }

    // ============================
    // PUBLIC API - CHARACTER MANAGEMENT
    // ============================

    /**
     * Get complete character sheet (all stats, talents, equipment)
     * @param {string} characterId - Character ID
     * @returns {Object} Complete character data
     */
    getCharacterSheet(characterId) {
      const char = this.statsSystem.getCharacter(characterId);
      if (!char) return null;

      const levelData = this.levelSystem.getLevelData(characterId);
      const talentData = this.talentIntegration.getActiveTalents(characterId);
      const equippedSkills =
        this.talentIntegration.getEquippedSkills(characterId);

      return {
        id: characterId,
        name: char.name,
        class: char.class,

        // Level & XP
        level: char.level,
        xp: char.xp,
        xpToNext: char.xpToNext,
        prestige: levelData ? levelData.prestige : 0,

        // Stats
        baseStats: { ...char.baseStats },
        finalStats: { ...char.finalStats },
        currentHP: char.hp,
        currentMP: char.mp,

        // Talents
        talents: {
          purchased: talentData.purchased,
          equipped: equippedSkills,
          ap: talentData.ap,
          totalAP: talentData.totalAP,
          bonuses: talentData.stats,
        },

        // Status
        statusEffects: this.statusEffects
          ? this.statusEffects.getEffects(characterId)
          : [],
        isStunned: this.statusEffects
          ? this.statusEffects.isStunned(characterId)
          : false,
        isInvincible: this.statusEffects
          ? this.statusEffects.isInvincible(characterId)
          : false,
      };
    }

    /**
     * Gain XP with full integration
     * @param {string} characterId - Character ID
     * @param {number} amount - XP amount
     * @param {Object} options - Options {onLevelUp: callback}
     * @returns {Object} Level up result
     */
    gainXP(characterId, amount, options = {}) {
      // Apply prestige bonus
      const levelData = this.levelSystem.getLevelData(characterId);
      let finalAmount = amount;

      if (levelData && levelData.prestige > 0) {
        const prestigeBonus = this.levelSystem.getPrestigeBonus(
          levelData.prestige
        );
        finalAmount *= prestigeBonus.xpMult;
      }

      // Gain XP in both systems
      const levelResult = this.levelSystem.gainXP(
        characterId,
        finalAmount,
        options
      );
      const statsResult = this.statsSystem.gainXP(characterId, finalAmount);

      // Sync level if needed
      if (levelResult.levelUps.length > 0) {
        this.statsSystem.setLevel(characterId, levelResult.newLevel);

        // Recalculate stats with new level
        const char = this.statsSystem.getCharacter(characterId);
        this.statsSystem.calculateStats(characterId);

        // Emit unified event
        this.eventBus.emit("character:levelup", {
          characterId,
          newLevel: levelResult.newLevel,
          levelUps: levelResult.levelUps,
          stats: char.finalStats,
        });

        // Call callback
        if (options.onLevelUp && typeof options.onLevelUp === "function") {
          options.onLevelUp({
            characterId,
            level: levelResult.newLevel,
            stats: char.finalStats,
          });
        }
      }

      return {
        xpGained: finalAmount,
        levelUps: levelResult.levelUps,
        newLevel: levelResult.newLevel,
        xp: levelResult.xp,
        xpToNext: levelResult.xpToNext,
      };
    }

    /**
     * Apply damage with full combat system integration
     * @param {string} targetId - Target entity ID
     * @param {number} damage - Damage amount
     * @param {string} damageType - Damage type
     * @param {Object} options - Options
     * @returns {Object} Damage result
     */
    applyDamage(targetId, damage, damageType = "physical", options = {}) {
      if (!this.damageTypes) {
        return { damage: Math.floor(damage), type: damageType };
      }

      // Check invincibility
      if (this.statusEffects && this.statusEffects.isInvincible(targetId)) {
        return { damage: 0, blocked: true, invincible: true };
      }

      // Get attacker and target stats
      const attacker = options.attacker || { atk: damage };
      const target =
        options.target || this.statsSystem.getCharacter(targetId) || {};

      // Calculate damage
      const result = this.damageTypes.calculateDamage(
        attacker,
        target,
        damageType,
        options.skillMultiplier || 1.0,
        options
      );

      // Apply damage to character
      if (target && target.hp !== undefined) {
        target.hp = Math.max(0, target.hp - result.damage);

        // Emit event
        this.eventBus.emit("character:damaged", {
          targetId,
          damage: result.damage,
          type: damageType,
          isCritical: result.isCritical,
          remainingHP: target.hp,
          isDead: target.hp <= 0,
        });

        // Check for death
        if (target.hp <= 0) {
          this.eventBus.emit("character:death", { characterId: targetId });
        }
      }

      return result;
    }

    /**
     * Calculate enemy stats with full scaling
     * @param {Object} baseStats - Base enemy stats
     * @param {Object} progression - Progression data (wave, stage, area, rank)
     * @returns {Object} Scaled enemy stats
     */
    calculateEnemyStats(baseStats, progression = {}) {
      if (!this.enemyScaling) {
        return baseStats;
      }

      // Get progression from v95 if not provided
      if (!progression.wave && this.progressionV95) {
        progression = this._getProgressionFromV95();
      }

      return this.enemyScaling.calculateEnemyStats(baseStats, progression);
    }

    /**
     * Apply status effect
     * @param {string} entityId - Entity ID
     * @param {string} effectKey - Effect key
     * @param {Object} options - Options
     * @returns {Object|null} Applied effect
     */
    applyStatusEffect(entityId, effectKey, options = {}) {
      if (!this.statusEffects) return null;

      return this.statusEffects.applyEffect(entityId, effectKey, options);
    }

    /**
     * Update all systems (call every frame)
     * @param {number} deltaTime - Time since last update (ms)
     */
    update(deltaTime) {
      if (!this.initialized) return;

      // Update status effects
      if (this.statusEffects) {
        this.statusEffects.update(deltaTime);
      }

      // Update other time-based systems here
    }

    // ============================
    // MIGRATION & COMPATIBILITY
    // ============================

    /**
     * Migrate old save data to new format
     * @param {Object} oldData - Old save data
     * @returns {Object} Migrated data
     */
    migrateOldSaveData(oldData) {
      if (!oldData) return {};

      const migrated = {
        version: "2.0",
        timestamp: Date.now(),
        characters: [],
        levels: [],
        talents: {},
        progression: {},
      };

      // Migrate characters from old stats system
      if (
        oldData.characters ||
        (oldData.StatsSystem && oldData.StatsSystem.characters)
      ) {
        const oldChars =
          oldData.characters || oldData.StatsSystem.characters || [];
        migrated.characters = oldChars.map((char) => ({
          characterId: char.characterId || char.id,
          name: char.name,
          class: char.class,
          level: char.level || 1,
          xp: char.xp || 0,
          baseStats: char.baseStats,
          growthRates: char.growthRates,
          equipmentBonus: char.equipmentBonus || {},
          hp: char.hp,
          mp: char.mp,
        }));
      }

      // Migrate progression data
      if (oldData.progression || oldData.st) {
        const prog = oldData.progression || oldData.st;
        migrated.progression = {
          wave: prog.waveStep || prog.wave || 1,
          stage: prog.stageInArea || 1,
          stageHalf: prog.stageHalf || false,
          area: prog.area || 1,
          areaHalf: prog.areaHalf || false,
          loop: prog.loop || 0,
        };
      }

      // Migrate talent data
      if (oldData.talents) {
        migrated.talents = oldData.talents;
      }

      return migrated;
    }

    /**
     * Save all systems
     * @returns {Object} Complete save data
     */
    save() {
      return {
        version: "2.0",
        timestamp: Date.now(),

        // Core systems
        stats: this.statsSystem ? this.statsSystem.serialize() : [],
        levels: this.levelSystem ? this.levelSystem.serialize() : [],

        // Talent systems
        talents: this.talentIntegration
          ? this.talentIntegration.serialize()
          : {},

        // Combat systems
        statusEffects: this.statusEffects ? this.statusEffects.serialize() : {},

        // External systems
        progression: this.progressionV95 ? this._serializeProgressionV95() : {},
        othersSystem: this._serializeOthersSystem(),
      };
    }

    /**
     * Load save data
     * @param {Object} saveData - Save data
     * @returns {boolean} Success
     */
    load(saveData) {
      if (!saveData) return false;

      // Check version and migrate if needed
      if (!saveData.version || saveData.version === "1.0") {
        saveData = this.migrateOldSaveData(saveData);
      }

      // Load core systems
      if (saveData.stats && this.statsSystem) {
        this.statsSystem.deserialize(saveData.stats);
      }

      if (saveData.levels && this.levelSystem) {
        this.levelSystem.deserialize(saveData.levels);
      }

      // Load talent systems
      if (saveData.talents && this.talentIntegration) {
        this.talentIntegration.deserialize(saveData.talents);
      }

      // Load combat systems
      if (saveData.statusEffects && this.statusEffects) {
        this.statusEffects.deserialize(saveData.statusEffects);
      }

      // Load external systems
      if (saveData.progression && this.progressionV95) {
        this._loadProgressionV95(saveData.progression);
      }

      this.eventBus.emit("unifiedbridge:loaded", { version: saveData.version });

      return true;
    }

    // ============================
    // PRIVATE METHODS
    // ============================

    /**
     * Create or get EventBus
     * @private
     */
    _createEventBus() {
      // Try to use existing EventBus
      if (typeof window !== "undefined" && window.EventBus) {
        return window.EventBus;
      }

      // Create new EventBus (load from our file)
      if (
        typeof window !== "undefined" &&
        window.EventBus &&
        typeof window.EventBus.EventBus === "function"
      ) {
        return new window.EventBus.EventBus();
      }

      // Minimal fallback EventBus
      return {
        emit: (event, data) => {
          if (this.options.debug) {
            console.log(`[EventBus] ${event}`, data);
          }
        },
        on: () => () => {},
        off: () => {},
      };
    }

    /**
     * Initialize core systems
     * @private
     */
    async _initCoreSystems() {
      // Load systems from window if available
      const StatsSystem =
        (typeof window !== "undefined" && window.StatsSystem) || null;
      const LevelSystem =
        (typeof window !== "undefined" && window.LevelSystem) || null;

      if (StatsSystem) {
        this.statsSystem = new StatsSystem({
          eventBus: this.eventBus,
          debug: this.options.debug,
        });
        this.statsSystem.init();
      }

      if (LevelSystem) {
        this.levelSystem = new LevelSystem({
          eventBus: this.eventBus,
          debug: this.options.debug,
        });
        this.levelSystem.init();
      }
    }

    /**
     * Initialize combat systems
     * @private
     */
    async _initCombatSystems() {
      const EnemyScaling =
        (typeof window !== "undefined" && window.EnemyScaling) || null;
      const DamageTypes =
        (typeof window !== "undefined" && window.DamageTypes) || null;
      const StatusEffects =
        (typeof window !== "undefined" && window.StatusEffects) || null;

      if (EnemyScaling) {
        this.enemyScaling = new EnemyScaling({
          eventBus: this.eventBus,
          debug: this.options.debug,
        });
        this.enemyScaling.init();
      }

      if (DamageTypes) {
        this.damageTypes = new DamageTypes({
          eventBus: this.eventBus,
          debug: this.options.debug,
        });
        this.damageTypes.init();
      }

      if (StatusEffects) {
        this.statusEffects = new StatusEffects({
          eventBus: this.eventBus,
          debug: this.options.debug,
        });
        this.statusEffects.init();
      }
    }

    /**
     * Initialize talent systems
     * @private
     */
    async _initTalentSystems() {
      const TalentIntegration =
        (typeof window !== "undefined" && window.TalentIntegration) || null;
      const AutoSkillExpansion =
        (typeof window !== "undefined" && window.AutoSkillExpansion) || null;

      if (TalentIntegration) {
        this.talentIntegration = new TalentIntegration({
          eventBus: this.eventBus,
          debug: this.options.debug,
        });
        this.talentIntegration.init();
      }

      if (AutoSkillExpansion) {
        this.autoSkillExpansion = new AutoSkillExpansion({
          eventBus: this.eventBus,
          debug: this.options.debug,
        });
        this.autoSkillExpansion.init();
      }
    }

    /**
     * Connect to external systems
     * @private
     */
    async _connectExternalSystems() {
      if (typeof window === "undefined") return;

      // Connect to old stats system
      this.oldStatsSystem = window.StatsSystem;

      // Connect to progression v95 (PRESERVE 9.5 LOGIC!)
      this.progressionV95 = window.__PROG95 || window.st;

      // Connect to talent store
      this.talentStore = window.TalentController || window.talentController;

      // Connect to others-system modules
      this.othersSystem = {
        quest: window.QuestSystem,
        supernatural: window.SupernaturalSystem,
        skin: window.SkinSystem,
        inventory: window.InventorySystem,
        settings: window.SettingsSystem,
      };

      if (this.options.debug) {
        console.log("[UnifiedBridge] External systems connected:", {
          oldStats: !!this.oldStatsSystem,
          progressionV95: !!this.progressionV95,
          talentStore: !!this.talentStore,
          others: Object.keys(this.othersSystem).filter(
            (k) => !!this.othersSystem[k]
          ),
        });
      }
    }

    /**
     * Setup synchronization between old and new systems
     * @private
     */
    _setupSync() {
      // Sync stats system changes to old system
      if (this.statsSystem && this.oldStatsSystem) {
        this.eventBus.on("stat:changed", (data) => {
          // Propagate to old system if needed
          if (this.oldStatsSystem.legacy) {
            // Old system is using our new system, no sync needed
          }
        });
      }
    }

    /**
     * Get progression data from v95
     * @private
     */
    _getProgressionFromV95() {
      if (!this.progressionV95) return {};

      const st = typeof window !== "undefined" ? window.st : {};

      return {
        wave: st.waveStep || st.wave || 1,
        stage: st.stageInArea || 1,
        stageHalf: st.stageHalf || false,
        area: st.area || 1,
        areaHalf: st.areaHalf || false,
        loop: st.loop || 0,
      };
    }

    /**
     * Serialize progression v95 data
     * @private
     */
    _serializeProgressionV95() {
      return this._getProgressionFromV95();
    }

    /**
     * Load progression v95 data
     * @private
     */
    _loadProgressionV95(data) {
      if (!data || typeof window === "undefined" || !window.st) return;

      const st = window.st;
      st.waveStep = data.wave || 1;
      st.wave = Math.ceil((data.wave || 1) / 2);
      st.stageInArea = data.stage || 1;
      st.stageHalf = data.stageHalf || false;
      st.area = data.area || 1;
      st.areaHalf = data.areaHalf || false;
      st.loop = data.loop || 0;
    }

    /**
     * Serialize others-system data
     * @private
     */
    _serializeOthersSystem() {
      const data = {};

      Object.keys(this.othersSystem).forEach((key) => {
        const system = this.othersSystem[key];
        if (system && typeof system.serialize === "function") {
          data[key] = system.serialize();
        }
      });

      return data;
    }

    /**
     * Get system status
     * @private
     */
    _getSystemStatus() {
      return {
        core: {
          eventBus: !!this.eventBus,
          stats: !!this.statsSystem,
          level: !!this.levelSystem,
        },
        combat: {
          enemyScaling: !!this.enemyScaling,
          damageTypes: !!this.damageTypes,
          statusEffects: !!this.statusEffects,
        },
        talents: {
          integration: !!this.talentIntegration,
          expansion: !!this.autoSkillExpansion,
        },
        external: {
          oldStats: !!this.oldStatsSystem,
          progressionV95: !!this.progressionV95,
          talentStore: !!this.talentStore,
          othersSystem: Object.keys(this.othersSystem).filter(
            (k) => !!this.othersSystem[k]
          ).length,
        },
      };
    }
  }

  return UnifiedBridge;
});
