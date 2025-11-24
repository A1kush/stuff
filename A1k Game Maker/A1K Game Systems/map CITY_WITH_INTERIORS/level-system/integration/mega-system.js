/**
 * mega-system.js - Complete RPG Mega Framework (v3.0)
 * @version 3.0.0
 * @description Integrates ALL 14 systems into one ultimate framework
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.RPGMegaSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  class RPGMegaSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          debug: false,
          autoSave: true,
          autoSaveInterval: 60000,
          eventBus: null,
        },
        options
      );

      // Create EventBus
      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);

      if (!this.eventBus && typeof EventBus !== "undefined") {
        this.eventBus = new EventBus();
      }

      // All 14 systems
      this.systems = {
        // Core (3)
        stats: null,
        level: null,
        eventBus: this.eventBus,

        // Combat (3)
        damage: null,
        statusEffects: null,
        enemyScaling: null,

        // Progression (2)
        talents: null,
        autoSkills: null,

        // Features (3)
        achievements: null,
        quests: null,
        loot: null,

        // NEW v3.0 Systems (3)
        pvp: null,
        biomes: null,
        crafting: null,

        // UI (2)
        statusDisplay: null,
        rankBadge: null,
      };

      this.initialized = false;
      this.characters = new Map();
    }

    /**
     * Initialize all 14 systems
     * @returns {Promise<RPGMegaSystem>}
     */
    async init() {
      if (this.initialized) return this;

      try {
        console.log("🎮 Initializing RPG Mega Framework v3.0...");

        await this._initCoreSystems();
        await this._initCombatSystems();
        await this._initProgressionSystems();
        await this._initFeatureSystems();
        await this._initNewSystems(); // NEW v3.0
        await this._initUISystems();

        if (this.options.autoSave) {
          this._startAutoSave();
        }

        this.initialized = true;

        console.log("✅ All 14 systems initialized!");
        console.log("🏆 100 Achievements | 📜 20 Quests | 💎 10 Biomes");
        console.log("⚔️ PvP Arena | 🔨 40 Crafting Recipes");

        this._emit("mega:ready", { version: "3.0.0", systems: 14 });
      } catch (err) {
        console.error("[RPGMegaSystem] Init failed:", err);
        throw err;
      }

      return this;
    }

    /**
     * Create character
     * @param {string} id - Character ID
     * @param {Object} options - Options
     * @returns {Object} Character
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
        materials: {},
        achievements: [],
        quests: [],
        arena: {
          rating: 1000,
          wins: 0,
          losses: 0,
        },
        createdAt: Date.now(),
      };

      this.characters.set(id, character);

      // Register in PvP
      if (this.systems.pvp) {
        this.systems.pvp.registerPlayer(id, character.stats);
      }

      this._emit("character:created", { character });

      return character;
    }

    /**
     * Gain XP
     * @param {string} characterId - Character ID
     * @param {number} amount - XP amount
     * @returns {Object} Result
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
     * Roll biome loot
     * @param {Object} options - Options
     * @returns {Array} Materials
     */
    rollBiomeLoot(options = {}) {
      const materials =
        this.systems.biomes?.rollBiomeLoot?.(options) || [];

      this._emit("loot:biome_rolled", { materials });

      return materials;
    }

    /**
     * Craft item
     * @param {string} recipeId - Recipe ID
     * @param {number} characterLevel - Character level
     * @returns {Object|null} Craft data
     */
    craftItem(recipeId, characterLevel = 1) {
      return this.systems.crafting?.startCraft?.(recipeId, characterLevel);
    }

    /**
     * Start PvP match
     * @param {string} player1Id - Player 1 ID
     * @param {string} player2Id - Player 2 ID (optional, auto-match if null)
     * @returns {Object} Match result
     */
    pvpBattle(player1Id, player2Id = null) {
      if (!player2Id) {
        const opponent = this.systems.pvp?.findMatch?.(player1Id);
        if (!opponent) return null;
        player2Id = opponent.playerId;
      }

      const result = this.systems.pvp?.simulateBattle?.(player1Id, player2Id);

      if (result) {
        this.systems.quests?.updateProgress?.("pvp_wins", 1);
        this.systems.achievements?.trackStat?.("pvpWins", 1);
      }

      return result;
    }

    /**
     * Get complete game stats
     * @returns {Object} All stats
     */
    getCompleteStats() {
      return {
        version: "3.0.0",
        characters: this.characters.size,
        achievements: {
          unlocked: this.systems.achievements?.unlocked?.size || 0,
          total: 100,
          percentage: this.systems.achievements?.getCompletionPercentage?.() || 0,
        },
        quests: {
          active: this.systems.quests?.activeQuests?.size || 0,
          completed: this.systems.quests?.completedQuests?.size || 0,
        },
        loot: this.systems.loot?.getStats?.() || {},
        biomes: {
          current: this.systems.biomes?.currentBiome,
          visited:
            Array.from(
              this.systems.biomes?.biomeProgress?.values() || []
            ).filter((b) => b.visited).length || 0,
        },
        crafting: {
          recipes: this.systems.crafting?.unlockedRecipes?.size || 0,
          crafted: this.systems.crafting?.stats?.totalCrafted || 0,
        },
        pvp: {
          players: this.systems.pvp?.players?.size || 0,
          matches: this.systems.pvp?.matchHistory?.length || 0,
        },
      };
    }

    /**
     * Save all systems
     * @returns {Object} Save data
     */
    save() {
      const saveData = {
        version: "3.0.0",
        timestamp: Date.now(),
        characters: Array.from(this.characters.entries()),
        systems: {
          achievements: this.systems.achievements?.serialize?.(),
          quests: this.systems.quests?.serialize?.(),
          loot: this.systems.loot?.serialize?.(),
          pvp: this.systems.pvp?.serialize?.(),
          biomes: this.systems.biomes?.serialize?.(),
          crafting: this.systems.crafting?.serialize?.(),
        },
      };

      this._emit("game:saved", { saveData });

      return saveData;
    }

    /**
     * Load all systems
     * @param {Object} saveData - Save data
     */
    load(saveData) {
      if (!saveData) return;

      this.characters.clear();
      if (saveData.characters) {
        saveData.characters.forEach(([id, char]) => {
          this.characters.set(id, char);
        });
      }

      if (saveData.systems) {
        this.systems.achievements?.deserialize?.(saveData.systems.achievements);
        this.systems.quests?.deserialize?.(saveData.systems.quests);
        this.systems.loot?.deserialize?.(saveData.systems.loot);
        this.systems.pvp?.deserialize?.(saveData.systems.pvp);
        this.systems.biomes?.deserialize?.(saveData.systems.biomes);
        this.systems.crafting?.deserialize?.(saveData.systems.crafting);
      }

      this._emit("game:loaded", { saveData });
    }

    // Private initialization
    async _initCoreSystems() {
      if (typeof StatsSystem !== "undefined") {
        this.systems.stats = new StatsSystem({ eventBus: this.eventBus });
        this.systems.stats.init();
      }

      if (typeof LevelSystem !== "undefined") {
        this.systems.level = new LevelSystem({ eventBus: this.eventBus });
        this.systems.level.init();
      }
    }

    async _initCombatSystems() {
      if (typeof DamageTypes !== "undefined") {
        this.systems.damage = DamageTypes;
      }

      if (typeof StatusEffects !== "undefined") {
        this.systems.statusEffects = new StatusEffects({
          eventBus: this.eventBus,
        });
        this.systems.statusEffects.init();
      }

      if (typeof EnemyScaling !== "undefined") {
        this.systems.enemyScaling = EnemyScaling;
      }
    }

    async _initProgressionSystems() {
      if (typeof TalentIntegration !== "undefined") {
        this.systems.talents = new TalentIntegration({
          eventBus: this.eventBus,
        });
        this.systems.talents.init();
      }

      if (typeof AutoSkillExpansion !== "undefined") {
        this.systems.autoSkills = AutoSkillExpansion;
      }
    }

    async _initFeatureSystems() {
      if (typeof AchievementSystem !== "undefined") {
        this.systems.achievements = new AchievementSystem({
          eventBus: this.eventBus,
        });
        this.systems.achievements.init();
      }

      if (typeof QuestSystem !== "undefined") {
        this.systems.quests = new QuestSystem({ eventBus: this.eventBus });
        this.systems.quests.init();
      }

      if (typeof LootSystem !== "undefined") {
        this.systems.loot = new LootSystem({ eventBus: this.eventBus });
        this.systems.loot.init();
      }
    }

    async _initNewSystems() {
      // PvP Arena
      if (typeof PvPArenaSystem !== "undefined") {
        this.systems.pvp = new PvPArenaSystem({ eventBus: this.eventBus });
        this.systems.pvp.init();
      }

      // Biome Loot
      if (typeof BiomeLootSystem !== "undefined") {
        this.systems.biomes = new BiomeLootSystem({
          eventBus: this.eventBus,
        });
        this.systems.biomes.init();
      }

      // Crafting
      if (typeof CraftingSystem !== "undefined") {
        this.systems.crafting = new CraftingSystem({
          eventBus: this.eventBus,
          biomeLootSystem: this.systems.biomes,
        });
        this.systems.crafting.init();
      }
    }

    async _initUISystems() {
      if (typeof StatusEffectDisplay !== "undefined") {
        this.systems.statusDisplay = new StatusEffectDisplay({
          eventBus: this.eventBus,
        });
        this.systems.statusDisplay.init();
      }

      if (typeof RankBadge !== "undefined") {
        this.systems.rankBadge = new RankBadge({ eventBus: this.eventBus });
        this.systems.rankBadge.init();
      }
    }

    _startAutoSave() {
      setInterval(() => {
        const saveData = this.save();
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("rpg_mega_save_v3", JSON.stringify(saveData));
        }
      }, this.options.autoSaveInterval);
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[RPGMegaSystem] Event emit failed:", err);
        }
      }
    }
  }

  return RPGMegaSystem;
});

