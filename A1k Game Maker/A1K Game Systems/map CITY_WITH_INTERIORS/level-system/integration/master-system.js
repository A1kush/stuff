/**
 * master-system.js - Complete RPG Framework Integration
 * @version 2.0.0
 * @description Integrates ALL systems into one unified framework
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.RPGMasterSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  class RPGMasterSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          debug: false,
          autoSave: true,
          autoSaveInterval: 60000, // 1 minute
          eventBus: null,
        },
        options
      );

      // Create or use existing EventBus
      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);

      if (!this.eventBus && typeof EventBus !== "undefined") {
        this.eventBus = new EventBus();
      }

      // Initialize all systems
      this.systems = {
        // Core systems
        stats: null,
        level: null,

        // Combat systems
        damage: null,
        statusEffects: null,
        enemyScaling: null,

        // Progression systems
        talents: null,
        autoSkills: null,

        // Feature systems
        achievements: null,
        quests: null,
        loot: null,

        // UI systems
        statusDisplay: null,
        rankBadge: null,
      };

      this.initialized = false;
      this.characters = new Map();
    }

    /**
     * Initialize all systems
     * @returns {Promise<RPGMasterSystem>}
     */
    async init() {
      if (this.initialized) return this;

      try {
        // Initialize core systems
        await this._initCoreSystems();

        // Initialize combat systems
        await this._initCombatSystems();

        // Initialize progression systems
        await this._initProgressionSystems();

        // Initialize feature systems
        await this._initFeatureSystems();

        // Initialize UI systems
        await this._initUISystems();

        // Set up auto-save
        if (this.options.autoSave) {
          this._startAutoSave();
        }

        this.initialized = true;
        this._emit("rpg:ready", { systems: Object.keys(this.systems) });

        console.log("🎮 RPG Master System initialized with all systems!");
      } catch (err) {
        console.error("[RPGMasterSystem] Init failed:", err);
        throw err;
      }

      return this;
    }

    /**
     * Create a new character
     * @param {string} id - Character ID
     * @param {Object} options - Character options
     * @returns {Object} Character data
     */
    createCharacter(id, options = {}) {
      const character = {
        id,
        name: options.name || "Hero",
        level: options.level || 1,
        xp: 0,
        stats: {
          hp: 100,
          atk: 10,
          def: 5,
          spd: 10,
          int: 10,
          wis: 10,
          luk: 5,
          vit: 10,
          dex: 10,
          mag: 10,
          res: 5,
          crt: 0.05,
        },
        equipment: {},
        talents: [],
        autoSkills: [],
        activeEffects: [],
        inventory: [],
        achievements: [],
        quests: [],
        createdAt: Date.now(),
      };

      this.characters.set(id, character);
      this._emit("character:created", { character });

      return character;
    }

    /**
     * Get character
     * @param {string} id - Character ID
     * @returns {Object|null}
     */
    getCharacter(id) {
      return this.characters.get(id) || null;
    }

    /**
     * Gain XP
     * @param {string} characterId - Character ID
     * @param {number} amount - XP amount
     * @returns {Object} Result with level ups
     */
    gainXP(characterId, amount) {
      const result = this.systems.level?.gainXP?.(characterId, amount) || {
        levelsGained: 0,
      };

      if (result.levelsGained > 0) {
        this.systems.achievements?.checkAchievements?.(characterId);
        this.systems.quests?.updateProgress?.("level", result.newLevel);
      }

      return result;
    }

    /**
     * Deal damage
     * @param {string} attackerId - Attacker ID
     * @param {string} targetId - Target ID
     * @param {Object} options - Damage options
     * @returns {Object} Damage result
     */
    dealDamage(attackerId, targetId, options = {}) {
      const result = this.systems.damage?.calculate?.(
        attackerId,
        targetId,
        options
      ) || { damage: 0 };

      this.systems.quests?.updateProgress?.("total_damage", result.damage);

      if (result.isCritical) {
        this.systems.quests?.updateProgress?.("critical_hits");
        this.systems.achievements?.trackStat?.("criticalHits");
      }

      return result;
    }

    /**
     * Apply status effect
     * @param {string} entityId - Entity ID
     * @param {string} effectKey - Effect key
     * @param {Object} options - Effect options
     * @returns {Object} Effect data
     */
    applyStatusEffect(entityId, effectKey, options = {}) {
      const effect = this.systems.statusEffects?.applyEffect?.(
        entityId,
        effectKey,
        options
      );

      if (effect) {
        this.systems.quests?.updateProgress?.("status_applied");
        this.systems.achievements?.trackStat?.(
          "uniqueStatusApplied",
          effectKey
        );
        this.systems.statusDisplay?.updateDisplay?.(entityId);
      }

      return effect;
    }

    /**
     * Unlock achievement
     * @param {string} achievementId - Achievement ID
     * @returns {Object|null} Achievement
     */
    unlockAchievement(achievementId) {
      return this.systems.achievements?.unlockAchievement?.(achievementId);
    }

    /**
     * Complete quest
     * @param {string} questId - Quest ID
     * @returns {Object|null} Rewards
     */
    completeQuest(questId) {
      return this.systems.quests?.completeQuest?.(questId);
    }

    /**
     * Roll loot
     * @param {string} tableId - Loot table ID
     * @param {Object} options - Loot options
     * @returns {Array} Loot items
     */
    rollLoot(tableId, options = {}) {
      const loot = this.systems.loot?.rollLoot?.(tableId, options) || [];

      loot.forEach((item) => {
        if (
          item.type === "equipment" &&
          (item.rarity === "rare" ||
            item.rarity === "epic" ||
            item.rarity === "legendary")
        ) {
          this.systems.quests?.updateProgress?.("rare_items");
          this.systems.achievements?.trackStat?.("rareItems");
        }

        if (item.type === "gold") {
          this.systems.quests?.updateProgress?.("gold_collected", item.amount);
          this.systems.achievements?.trackStat?.("goldTotal", item.amount);
        }
      });

      return loot;
    }

    /**
     * Save game state
     * @returns {Object} Save data
     */
    save() {
      const saveData = {
        version: "2.0.0",
        timestamp: Date.now(),
        characters: Array.from(this.characters.entries()),
        systems: {
          achievements: this.systems.achievements?.serialize?.(),
          quests: this.systems.quests?.serialize?.(),
          loot: this.systems.loot?.serialize?.(),
        },
      };

      this._emit("game:saved", { saveData });

      return saveData;
    }

    /**
     * Load game state
     * @param {Object} saveData - Save data
     */
    load(saveData) {
      if (!saveData) return;

      // Load characters
      this.characters.clear();
      if (saveData.characters) {
        saveData.characters.forEach(([id, char]) => {
          this.characters.set(id, char);
        });
      }

      // Load systems
      if (saveData.systems) {
        this.systems.achievements?.deserialize?.(saveData.systems.achievements);
        this.systems.quests?.deserialize?.(saveData.systems.quests);
        this.systems.loot?.deserialize?.(saveData.systems.loot);
      }

      this._emit("game:loaded", { saveData });
    }

    /**
     * Get system stats
     * @returns {Object}
     */
    getStats() {
      return {
        characters: this.characters.size,
        achievements: {
          unlocked: this.systems.achievements?.unlocked?.size || 0,
          total:
            this.systems.achievements?.constructor?.ACHIEVEMENT_KEYS?.length ||
            0,
          percentage:
            this.systems.achievements?.getCompletionPercentage?.() || 0,
        },
        quests: {
          active: this.systems.quests?.activeQuests?.size || 0,
          completed: this.systems.quests?.completedQuests?.size || 0,
        },
        loot: this.systems.loot?.getStats?.() || {},
      };
    }

    // Private initialization methods
    async _initCoreSystems() {
      // Stats System
      if (typeof StatsSystem !== "undefined") {
        this.systems.stats = new StatsSystem({ eventBus: this.eventBus });
        this.systems.stats.init();
      }

      // Level System
      if (typeof LevelSystem !== "undefined") {
        this.systems.level = new LevelSystem({ eventBus: this.eventBus });
        this.systems.level.init();
      }
    }

    async _initCombatSystems() {
      // Damage Types
      if (typeof DamageTypes !== "undefined") {
        this.systems.damage = DamageTypes;
      }

      // Status Effects
      if (typeof StatusEffects !== "undefined") {
        this.systems.statusEffects = new StatusEffects({
          eventBus: this.eventBus,
        });
        this.systems.statusEffects.init();
      }

      // Enemy Scaling
      if (typeof EnemyScaling !== "undefined") {
        this.systems.enemyScaling = EnemyScaling;
      }
    }

    async _initProgressionSystems() {
      // Talent Integration
      if (typeof TalentIntegration !== "undefined") {
        this.systems.talents = new TalentIntegration({
          eventBus: this.eventBus,
        });
        this.systems.talents.init();
      }

      // Auto Skill Expansion
      if (typeof AutoSkillExpansion !== "undefined") {
        this.systems.autoSkills = AutoSkillExpansion;
      }
    }

    async _initFeatureSystems() {
      // Achievement System
      if (typeof AchievementSystem !== "undefined") {
        this.systems.achievements = new AchievementSystem({
          eventBus: this.eventBus,
        });
        this.systems.achievements.init();
      }

      // Quest System
      if (typeof QuestSystem !== "undefined") {
        this.systems.quests = new QuestSystem({ eventBus: this.eventBus });
        this.systems.quests.init();
      }

      // Loot System
      if (typeof LootSystem !== "undefined") {
        this.systems.loot = new LootSystem({ eventBus: this.eventBus });
        this.systems.loot.init();
      }
    }

    async _initUISystems() {
      // Status Effect Display
      if (typeof StatusEffectDisplay !== "undefined") {
        this.systems.statusDisplay = new StatusEffectDisplay({
          eventBus: this.eventBus,
        });
        this.systems.statusDisplay.init();
      }

      // Rank Badge
      if (typeof RankBadge !== "undefined") {
        this.systems.rankBadge = new RankBadge({ eventBus: this.eventBus });
        this.systems.rankBadge.init();
      }
    }

    _startAutoSave() {
      setInterval(() => {
        const saveData = this.save();
        // Store in localStorage if available
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("rpg_autosave", JSON.stringify(saveData));
        }
      }, this.options.autoSaveInterval);
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[RPGMasterSystem] Event emit failed:", err);
        }
      }
    }
  }

  return RPGMasterSystem;
});
