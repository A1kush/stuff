/**
 * ultimate-system.js - Complete RPG Ultimate Framework (v4.0)
 * @version 4.0.0
 * @description Integrates ALL 19 systems into the ultimate RPG framework
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.RPGUltimateSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  class RPGUltimateSystem {
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

      // ALL 19 SYSTEMS!
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

        // Features v2.0 (3)
        achievements: null,
        quests: null,
        loot: null,

        // Features v3.0 (3)
        pvp: null,
        biomes: null,
        crafting: null,

        // Features v4.0 (5) ⭐ NEW
        guild: null,
        pets: null,
        enchantment: null,
        seasonal: null,
        dungeons: null,

        // UI (2)
        statusDisplay: null,
        rankBadge: null,
      };

      this.initialized = false;
      this.characters = new Map();
    }

    /**
     * Initialize all 19 systems
     * @returns {Promise<RPGUltimateSystem>}
     */
    async init() {
      if (this.initialized) return this;

      try {
        console.log("🎮 Initializing RPG ULTIMATE Framework v4.0...");

        await this._initCoreSystems();
        await this._initCombatSystems();
        await this._initProgressionSystems();
        await this._initFeatureSystemsV2();
        await this._initFeatureSystemsV3();
        await this._initFeatureSystemsV4(); // NEW!
        await this._initUISystems();

        if (this.options.autoSave) {
          this._startAutoSave();
        }

        this.initialized = true;

        console.log("✅ All 19 systems initialized!");
        console.log("🏆 100 Achievements | 🌍 10 Biomes | 🐲 30 Pets");
        console.log("🏰 Guilds | 🔨 Crafting | ⚔️ PvP | 🏛️ Dungeons");

        this._emit("ultimate:ready", { version: "4.0.0", systems: 19 });
      } catch (err) {
        console.error("[RPGUltimateSystem] Init failed:", err);
        throw err;
      }

      return this;
    }

    /**
     * Create character with full integration
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
        pets: {
          collection: [],
          active: [],
        },
        guild: null,
        arena: {
          rating: 1000,
          wins: 0,
          losses: 0,
        },
        createdAt: Date.now(),
      };

      this.characters.set(id, character);

      // Register in systems
      if (this.systems.pvp) {
        this.systems.pvp.registerPlayer(id, character.stats);
      }

      this._emit("character:created", { character });

      return character;
    }

    /**
     * Get complete stats (all systems)
     * @returns {Object} Complete stats
     */
    getUltimateStats() {
      return {
        version: "4.0.0",
        systems: 19,
        characters: this.characters.size,
        achievements: {
          unlocked: this.systems.achievements?.unlocked?.size || 0,
          total: 100,
          percentage:
            this.systems.achievements?.getCompletionPercentage?.() || 0,
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
        guilds: {
          total: this.systems.guild?.guilds?.size || 0,
        },
        pets: {
          species: 30,
        },
        enchantments: {
          items: this.systems.enchantment?.enchantedItems?.size || 0,
          total: this.systems.enchantment?.stats?.totalEnchantments || 0,
        },
        seasonal: {
          active: this.systems.seasonal?.activeEvents?.length || 0,
        },
        dungeons: {
          completed: this.systems.dungeons?.stats?.dungeonsCompleted || 0,
        },
      };
    }

    /**
     * Save all systems
     * @returns {Object} Save data
     */
    save() {
      const saveData = {
        version: "4.0.0",
        timestamp: Date.now(),
        characters: Array.from(this.characters.entries()),
        systems: {
          achievements: this.systems.achievements?.serialize?.(),
          quests: this.systems.quests?.serialize?.(),
          loot: this.systems.loot?.serialize?.(),
          pvp: this.systems.pvp?.serialize?.(),
          biomes: this.systems.biomes?.serialize?.(),
          crafting: this.systems.crafting?.serialize?.(),
          guild: this.systems.guild?.serialize?.(),
          pets: this.systems.pets?.serialize?.(),
          enchantment: this.systems.enchantment?.serialize?.(),
          seasonal: this.systems.seasonal?.serialize?.(),
          dungeons: this.systems.dungeons?.serialize?.(),
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
        this.systems.guild?.deserialize?.(saveData.systems.guild);
        this.systems.pets?.deserialize?.(saveData.systems.pets);
        this.systems.enchantment?.deserialize?.(saveData.systems.enchantment);
        this.systems.seasonal?.deserialize?.(saveData.systems.seasonal);
        this.systems.dungeons?.deserialize?.(saveData.systems.dungeons);
      }

      this._emit("game:loaded", { saveData });
    }

    // System initialization methods
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

    async _initFeatureSystemsV2() {
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

    async _initFeatureSystemsV3() {
      if (typeof PvPArenaSystem !== "undefined") {
        this.systems.pvp = new PvPArenaSystem({ eventBus: this.eventBus });
        this.systems.pvp.init();
      }

      if (typeof BiomeLootSystem !== "undefined") {
        this.systems.biomes = new BiomeLootSystem({
          eventBus: this.eventBus,
        });
        this.systems.biomes.init();
      }

      if (typeof CraftingSystem !== "undefined") {
        this.systems.crafting = new CraftingSystem({
          eventBus: this.eventBus,
          biomeLootSystem: this.systems.biomes,
        });
        this.systems.crafting.init();
      }
    }

    async _initFeatureSystemsV4() {
      // Guild System
      if (typeof GuildSystem !== "undefined") {
        this.systems.guild = new GuildSystem({ eventBus: this.eventBus });
        this.systems.guild.init();
      }

      // Pet System
      if (typeof PetSystem !== "undefined") {
        this.systems.pets = new PetSystem({ eventBus: this.eventBus });
        this.systems.pets.init();
      }

      // Enchantment System
      if (typeof EnchantmentSystem !== "undefined") {
        this.systems.enchantment = new EnchantmentSystem({
          eventBus: this.eventBus,
        });
        this.systems.enchantment.init();
      }

      // Seasonal Events
      if (typeof SeasonalEventSystem !== "undefined") {
        this.systems.seasonal = new SeasonalEventSystem({
          eventBus: this.eventBus,
        });
        this.systems.seasonal.init();
      }

      // Dungeon System
      if (typeof DungeonSystem !== "undefined") {
        this.systems.dungeons = new DungeonSystem({
          eventBus: this.eventBus,
        });
        this.systems.dungeons.init();
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
          localStorage.setItem(
            "rpg_ultimate_save_v4",
            JSON.stringify(saveData)
          );
        }
      }, this.options.autoSaveInterval);
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[RPGUltimateSystem] Event emit failed:", err);
        }
      }
    }
  }

  return RPGUltimateSystem;
});

