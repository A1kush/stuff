/**
 * StatsSystem.js - Enhanced Character Stats Management
 * @version 2.0.0
 * @description Production-ready stats system with 12 base stats, soft caps, and equipment integration
 * Replaces: src/systems/stats.js with backward compatibility
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.StatsSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // CONSTANTS
  // ============================

  const BASE_STATS = [
    "hp",
    "maxHP",
    "mp",
    "maxMP",
    "atk",
    "def",
    "spd",
    "mag",
    "res",
    "luk",
    "crt",
    "eva",
    "acc",
    "sta",
  ];

  const SOFT_CAPS = {
    hp: 9999,
    maxHP: 9999,
    mp: 999,
    maxMP: 999,
    atk: 999,
    def: 500,
    spd: 200,
    mag: 999,
    res: 500,
    luk: 100,
    crt: 0.75, // 75% crit cap
    eva: 0.5, // 50% evasion cap
    acc: 0.99, // 99% accuracy cap
    sta: 200,
  };

  const HARD_CAPS = {
    hp: 99999,
    maxHP: 99999,
    mp: 9999,
    maxMP: 9999,
    atk: 9999,
    def: 9999,
    spd: 999,
    mag: 9999,
    res: 9999,
    luk: 999,
    crt: 1.0, // 100% hard cap
    eva: 0.75, // 75% hard cap
    acc: 1.0, // 100% hard cap
    sta: 999,
  };

  // ============================
  // STATS SYSTEM CLASS
  // ============================

  class StatsSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          autoSave: true,
          eventBus: null,
          useSoftCaps: true,
          useHardCaps: true,
          debug: false,
        },
        options
      );

      /** @type {Map<string, CharacterStats>} */
      this.characters = new Map();

      /** @type {Map<string, Array>} Equipment cache */
      this.equipmentCache = new Map();

      /** @type {Map<string, Object>} Talent bonus cache */
      this.talentCache = new Map();

      // Event bus integration
      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);

      this.initialized = false;
    }

    /**
     * Initialize the stats system
     * @param {Array|Object} initialData - Character data to load
     */
    init(initialData = []) {
      if (this.initialized) {
        console.warn("[StatsSystem] Already initialized");
        return this;
      }

      this.characters.clear();
      this.equipmentCache.clear();
      this.talentCache.clear();

      // Load character data
      const dataArray = Array.isArray(initialData)
        ? initialData
        : [initialData];

      // Check for GameData.characters (backward compat)
      if (
        dataArray.length === 0 &&
        typeof window !== "undefined" &&
        window.GameData?.characters?.characters
      ) {
        dataArray.push(...window.GameData.characters.characters);
      }

      dataArray.forEach((charData) => {
        if (charData && (charData.id || charData.characterId)) {
          this.createCharacter(charData);
        }
      });

      this.initialized = true;
      this._emit("stats:ready", { characterCount: this.characters.size });

      if (this.options.debug) {
        console.log(
          `[StatsSystem] Initialized with ${this.characters.size} characters`
        );
      }

      return this;
    }

    /**
     * Create a new character
     * @param {Object} data - Character data
     * @returns {Object} Character stats object
     */
    createCharacter(data) {
      const id = data.characterId || data.id;
      if (!id) {
        console.error("[StatsSystem] Cannot create character without ID");
        return null;
      }

      // Parse base stats
      const baseStats = this._parseStats(data.baseStats || {});
      baseStats.maxHP = baseStats.maxHP || baseStats.hp || 100;
      baseStats.maxMP = baseStats.maxMP || baseStats.mp || 50;

      // Create character object
      const character = {
        characterId: id,
        name: data.name || id,
        class: data.class || "adventurer",
        level: data.level || 1,
        xp: data.xp || 0,
        xpToNext: this._calculateXPForLevel(data.level || 1),

        // Stats
        baseStats,
        growthRates: this._parseStats(data.growthRates || {}),
        equipmentBonus: this._parseStats(data.equipmentBonus || {}),
        talentBonus: this._parseStats(data.talentBonus || {}),
        tempBonus: this._parseStats(data.tempBonus || {}),
        finalStats: {},

        // Current values
        hp: baseStats.hp || baseStats.maxHP || 100,
        mp: baseStats.mp || baseStats.maxMP || 50,
      };

      // Calculate final stats
      this._recalculateStats(character);

      // Store character
      this.characters.set(id, character);

      this._emit("character:created", { characterId: id, character });

      if (this.options.debug) {
        console.log(`[StatsSystem] Created character: ${id}`, character);
      }

      return character;
    }

    /**
     * Get character by ID
     * @param {string} id - Character ID
     * @returns {Object|null} Character object
     */
    getCharacter(id) {
      return this.characters.get(id) || null;
    }

    /**
     * Get all characters
     * @returns {Array} Array of character objects
     */
    listCharacters() {
      return Array.from(this.characters.values());
    }

    /**
     * Calculate stats for a character
     * @param {string} characterId - Character ID
     * @param {number} [level] - Optional level override
     * @returns {Object|null} Calculated stats
     */
    calculateStats(characterId, level) {
      const char = this.getCharacter(characterId);
      if (!char) return null;

      const lvl = level !== undefined ? level : char.level;
      const finalStats = {};

      BASE_STATS.forEach((stat) => {
        // Base value with growth
        const baseValue = this._calculateStatWithGrowth(
          char.baseStats[stat] || 0,
          char.growthRates[stat] || 1.0,
          lvl
        );

        // Add all bonuses
        const equipBonus = char.equipmentBonus[stat] || 0;
        const talentBonus = char.talentBonus[stat] || 0;
        const tempBonus = char.tempBonus[stat] || 0;

        let finalValue = baseValue + equipBonus + talentBonus + tempBonus;

        // Apply soft caps
        if (this.options.useSoftCaps && finalValue > SOFT_CAPS[stat]) {
          finalValue = this._applySoftCap(
            finalValue,
            SOFT_CAPS[stat],
            HARD_CAPS[stat]
          );
        }

        // Apply hard caps
        if (this.options.useHardCaps && finalValue > HARD_CAPS[stat]) {
          finalValue = HARD_CAPS[stat];
        }

        // Ensure non-negative
        finalStats[stat] = Math.max(0, Math.round(finalValue * 100) / 100);
      });

      return finalStats;
    }

    /**
     * Get total stats including all bonuses
     * @param {string} characterId - Character ID
     * @returns {Object|null} Total stats
     */
    getTotalStats(characterId) {
      const char = this.getCharacter(characterId);
      if (!char) return null;

      return { ...char.finalStats };
    }

    /**
     * Get stat growth at specific level
     * @param {string} characterId - Character ID
     * @param {string} stat - Stat name
     * @param {number} level - Level
     * @returns {number}
     */
    getStatGrowth(characterId, stat, level) {
      const char = this.getCharacter(characterId);
      if (!char) return 0;

      return this._calculateStatWithGrowth(
        char.baseStats[stat] || 0,
        char.growthRates[stat] || 1.0,
        level
      );
    }

    /**
     * Apply equipment bonuses
     * @param {string} characterId - Character ID
     * @param {Array} equipment - Equipment items with bonusStats
     * @returns {Object|null} Updated final stats
     */
    applyEquipmentBonus(characterId, equipment = []) {
      const char = this.getCharacter(characterId);
      if (!char) return null;

      // Calculate total equipment bonus
      const bonus = {};
      equipment.forEach((item) => {
        if (!item || !item.bonusStats) return;

        Object.keys(item.bonusStats).forEach((stat) => {
          bonus[stat] = (bonus[stat] || 0) + (item.bonusStats[stat] || 0);
        });
      });

      // Update equipment bonus
      char.equipmentBonus = this._parseStats(bonus);

      // Cache equipment
      this.equipmentCache.set(characterId, equipment.slice());

      // Recalculate stats
      this._recalculateStats(char);

      this._emit("equipment:applied", { characterId, equipment, bonus });

      return { ...char.finalStats };
    }

    /**
     * Apply talent bonuses
     * @param {string} characterId - Character ID
     * @param {Object} talentBonuses - Talent bonuses object
     * @returns {Object|null} Updated final stats
     */
    applyTalentBonus(characterId, talentBonuses = {}) {
      const char = this.getCharacter(characterId);
      if (!char) return null;

      char.talentBonus = this._parseStats(talentBonuses);
      this.talentCache.set(characterId, { ...talentBonuses });

      this._recalculateStats(char);

      this._emit("talents:applied", { characterId, talentBonuses });

      return { ...char.finalStats };
    }

    /**
     * Apply temporary bonus (buffs/debuffs)
     * @param {string} characterId - Character ID
     * @param {Object} tempBonuses - Temporary bonuses
     * @returns {Object|null} Updated final stats
     */
    applyTempBonus(characterId, tempBonuses = {}) {
      const char = this.getCharacter(characterId);
      if (!char) return null;

      char.tempBonus = this._parseStats(tempBonuses);

      this._recalculateStats(char);

      this._emit("temp:applied", { characterId, tempBonuses });

      return { ...char.finalStats };
    }

    /**
     * Clear temporary bonuses
     * @param {string} characterId - Character ID
     */
    clearTempBonus(characterId) {
      const char = this.getCharacter(characterId);
      if (!char) return;

      char.tempBonus = this._parseStats({});
      this._recalculateStats(char);

      this._emit("temp:cleared", { characterId });
    }

    /**
     * Gain XP and level up if needed
     * @param {string} characterId - Character ID
     * @param {number} amount - XP amount
     * @returns {Object|null} Level up info
     */
    gainXP(characterId, amount) {
      const char = this.getCharacter(characterId);
      if (!char) return null;

      char.xp = (char.xp || 0) + Math.max(0, amount || 0);

      const levelUps = [];

      // Check for level ups
      while (char.xp >= char.xpToNext) {
        char.xp -= char.xpToNext;
        char.level += 1;
        char.xpToNext = this._calculateXPForLevel(char.level);

        // Recalculate stats
        this._recalculateStats(char);

        // Restore HP/MP
        char.hp = char.finalStats.maxHP;
        char.mp = char.finalStats.maxMP;

        levelUps.push(char.level);

        this._emit("level:up", {
          characterId,
          level: char.level,
          finalStats: { ...char.finalStats },
        });
      }

      if (levelUps.length > 0) {
        this._emit("stat:changed", {
          characterId,
          xp: char.xp,
          level: char.level,
          levelUps,
        });
      }

      return { character: char, levelUps };
    }

    /**
     * Set character level
     * @param {string} characterId - Character ID
     * @param {number} level - New level
     */
    setLevel(characterId, level) {
      const char = this.getCharacter(characterId);
      if (!char) return;

      char.level = Math.max(1, level);
      char.xpToNext = this._calculateXPForLevel(char.level);

      this._recalculateStats(char);

      // Restore HP/MP
      char.hp = char.finalStats.maxHP;
      char.mp = char.finalStats.maxMP;

      this._emit("level:set", { characterId, level: char.level });
    }

    /**
     * Serialize all characters for saving
     * @returns {Array} Serialized character data
     */
    serialize() {
      return this.listCharacters().map((char) => ({
        characterId: char.characterId,
        name: char.name,
        class: char.class,
        level: char.level,
        xp: char.xp,
        xpToNext: char.xpToNext,
        baseStats: { ...char.baseStats },
        growthRates: { ...char.growthRates },
        equipmentBonus: { ...char.equipmentBonus },
        talentBonus: { ...char.talentBonus },
        tempBonus: { ...char.tempBonus },
        finalStats: { ...char.finalStats },
        hp: char.hp,
        mp: char.mp,
      }));
    }

    /**
     * Deserialize and load character data
     * @param {Array} data - Serialized character data
     */
    deserialize(data) {
      if (!Array.isArray(data)) {
        console.error("[StatsSystem] Invalid deserialization data");
        return;
      }

      this.characters.clear();

      data.forEach((charData) => {
        this.createCharacter(charData);
      });

      this._emit("stats:loaded", { characterCount: this.characters.size });
    }

    // ============================
    // PRIVATE METHODS
    // ============================

    /**
     * Recalculate all final stats for a character
     * @private
     */
    _recalculateStats(character) {
      character.finalStats = this.calculateStats(character.characterId);

      // Ensure current HP/MP don't exceed max
      if (character.hp > character.finalStats.maxHP) {
        character.hp = character.finalStats.maxHP;
      }
      if (character.mp > character.finalStats.maxMP) {
        character.mp = character.finalStats.maxMP;
      }
    }

    /**
     * Calculate stat value with growth
     * @private
     */
    _calculateStatWithGrowth(base, growthRate, level) {
      if (level <= 1) return base;

      // Exponential growth: base * (growthRate ^ (level - 1))
      return base * Math.pow(growthRate, level - 1);
    }

    /**
     * Apply soft cap diminishing returns
     * @private
     */
    _applySoftCap(value, softCap, hardCap) {
      if (value <= softCap) return value;

      // Diminishing returns formula
      const excess = value - softCap;
      const range = hardCap - softCap;
      const diminished = range * (1 - Math.exp(-excess / range));

      return softCap + diminished;
    }

    /**
     * Calculate XP required for level
     * @private
     */
    _calculateXPForLevel(level) {
      if (level <= 1) return 100;

      // Exponential curve: 100 * (1.5 ^ (level - 1))
      return Math.round(100 * Math.pow(1.5, Math.max(0, level - 1)));
    }

    /**
     * Parse stats object, ensuring all values are numbers
     * @private
     */
    _parseStats(stats = {}) {
      const parsed = {};

      BASE_STATS.forEach((stat) => {
        if (stat in stats) {
          parsed[stat] = Number(stats[stat]) || 0;
        }
      });

      return parsed;
    }

    /**
     * Emit event through event bus
     * @private
     */
    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[StatsSystem] Event emit failed:", err);
        }
      }
    }
  }

  // ============================
  // BACKWARD COMPATIBILITY LAYER
  // ============================

  /**
   * Create a singleton instance for backward compatibility
   */
  const statsSystemInstance = new StatsSystem();

  // Expose legacy API
  const LegacyStatsSystem = {
    init: (data) => statsSystemInstance.init(data),
    setEventBus: (bus) => {
      statsSystemInstance.eventBus = bus;
    },
    createCharacter: (data) => statsSystemInstance.createCharacter(data),
    getCharacter: (id) => statsSystemInstance.getCharacter(id),
    listCharacters: () => statsSystemInstance.listCharacters(),
    applyEquipmentBonus: (id, eq) =>
      statsSystemInstance.applyEquipmentBonus(id, eq),
    calculateStats: (id) => statsSystemInstance.calculateStats(id),
    getStatGrowth: (id, stat, lvl) =>
      statsSystemInstance.getStatGrowth(id, stat, lvl),
    gainXP: (id, amt) => statsSystemInstance.gainXP(id, amt),
    levelUp: (id) => {
      const char = statsSystemInstance.getCharacter(id);
      if (!char) return null;
      return statsSystemInstance.gainXP(id, char.xpToNext);
    },
    serialize: () => statsSystemInstance.serialize(),
  };

  // Expose both new class and legacy API
  StatsSystem.instance = statsSystemInstance;
  StatsSystem.legacy = LegacyStatsSystem;

  return StatsSystem;
});
