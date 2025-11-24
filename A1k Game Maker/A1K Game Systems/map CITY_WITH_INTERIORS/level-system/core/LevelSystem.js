/**
 * LevelSystem.js - Character Level & XP Management
 * @version 1.0.0
 * @description Level progression, XP curves, and prestige system
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.LevelSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // CONSTANTS
  // ============================

  const XP_CURVES = {
    EXPONENTIAL: "exponential", // 100 * (1.5 ^ (level - 1))
    LINEAR: "linear", // 100 * level
    MILESTONE: "milestone", // Custom per-milestone curve
  };

  const MAX_LEVEL = 999;
  const MAX_PRESTIGE = 10;

  // ============================
  // LEVEL SYSTEM CLASS
  // ============================

  class LevelSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          maxLevel: MAX_LEVEL,
          maxPrestige: MAX_PRESTIGE,
          xpCurve: XP_CURVES.EXPONENTIAL,
          baseXP: 100,
          growthFactor: 1.5,
          enablePrestige: true,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, LevelData>} */
      this.levels = new Map();

      // Event bus integration
      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);

      this.initialized = false;
    }

    /**
     * Initialize the level system
     * @param {Array|Object} initialData - Character level data
     */
    init(initialData = []) {
      if (this.initialized) {
        console.warn("[LevelSystem] Already initialized");
        return this;
      }

      this.levels.clear();

      const dataArray = Array.isArray(initialData)
        ? initialData
        : [initialData];

      dataArray.forEach((data) => {
        if (data && (data.id || data.characterId)) {
          this.createLevel(data);
        }
      });

      this.initialized = true;
      this._emit("level:ready", { characterCount: this.levels.size });

      if (this.options.debug) {
        console.log(
          `[LevelSystem] Initialized with ${this.levels.size} characters`
        );
      }

      return this;
    }

    /**
     * Create level data for a character
     * @param {Object} data - Character data
     * @returns {Object} Level data
     */
    createLevel(data) {
      const id = data.characterId || data.id;
      if (!id) {
        console.error("[LevelSystem] Cannot create level without ID");
        return null;
      }

      const level = data.level || 1;

      const levelData = {
        characterId: id,
        level: Math.max(1, Math.min(level, this.options.maxLevel)),
        xp: data.xp || 0,
        xpToNext: this.calculateXPForLevel(level),
        prestige: data.prestige || 0,
        totalXP: data.totalXP || 0,
        levelHistory: data.levelHistory || [],
      };

      this.levels.set(id, levelData);

      this._emit("level:created", { characterId: id, levelData });

      if (this.options.debug) {
        console.log(`[LevelSystem] Created level for: ${id}`, levelData);
      }

      return levelData;
    }

    /**
     * Get level data for a character
     * @param {string} characterId - Character ID
     * @returns {Object|null}
     */
    getLevelData(characterId) {
      return this.levels.get(characterId) || null;
    }

    /**
     * Get character's current level
     * @param {string} characterId - Character ID
     * @returns {number}
     */
    getLevel(characterId) {
      const data = this.getLevelData(characterId);
      return data ? data.level : 1;
    }

    /**
     * Get character's current XP
     * @param {string} characterId - Character ID
     * @returns {number}
     */
    getXP(characterId) {
      const data = this.getLevelData(characterId);
      return data ? data.xp : 0;
    }

    /**
     * Get character's prestige level
     * @param {string} characterId - Character ID
     * @returns {number}
     */
    getPrestige(characterId) {
      const data = this.getLevelData(characterId);
      return data ? data.prestige : 0;
    }

    /**
     * Calculate XP required for a specific level
     * @param {number} level - Target level
     * @returns {number} XP required
     */
    calculateXPForLevel(level) {
      if (level <= 1) return this.options.baseXP;

      switch (this.options.xpCurve) {
        case XP_CURVES.EXPONENTIAL:
          return Math.round(
            this.options.baseXP *
              Math.pow(this.options.growthFactor, Math.max(0, level - 1))
          );

        case XP_CURVES.LINEAR:
          return this.options.baseXP * level;

        case XP_CURVES.MILESTONE:
          return this._calculateMilestoneXP(level);

        default:
          return this.options.baseXP * level;
      }
    }

    /**
     * Add XP to a character and handle level ups
     * @param {string} characterId - Character ID
     * @param {number} amount - XP amount
     * @param {Object} options - Options {silent: boolean, callback: function}
     * @returns {Object} Result {levelUps: Array, newLevel: number}
     */
    gainXP(characterId, amount, options = {}) {
      const data = this.getLevelData(characterId);
      if (!data) {
        console.error(`[LevelSystem] Character not found: ${characterId}`);
        return { levelUps: [], newLevel: 1 };
      }

      const xpGain = Math.max(0, amount || 0);
      data.xp += xpGain;
      data.totalXP += xpGain;

      const levelUps = [];
      let didLevelUp = false;

      // Check for level ups
      while (data.xp >= data.xpToNext && data.level < this.options.maxLevel) {
        data.xp -= data.xpToNext;
        data.level += 1;
        data.xpToNext = this.calculateXPForLevel(data.level);

        levelUps.push(data.level);
        didLevelUp = true;

        // Track in history
        data.levelHistory.push({
          level: data.level,
          timestamp: Date.now(),
        });

        if (!options.silent) {
          this._emit("level:up", {
            characterId,
            level: data.level,
            xp: data.xp,
            xpToNext: data.xpToNext,
          });
        }
      }

      if (!options.silent && xpGain > 0) {
        this._emit("xp:gained", {
          characterId,
          amount: xpGain,
          totalXP: data.totalXP,
          levelUps: didLevelUp ? levelUps : [],
        });
      }

      // Callback
      if (options.callback && typeof options.callback === "function") {
        options.callback({ levelUps, newLevel: data.level });
      }

      if (this.options.debug && didLevelUp) {
        console.log(
          `[LevelSystem] ${characterId} leveled up to ${data.level}!`
        );
      }

      return {
        levelUps,
        newLevel: data.level,
        xp: data.xp,
        xpToNext: data.xpToNext,
      };
    }

    /**
     * Set character level directly
     * @param {string} characterId - Character ID
     * @param {number} level - New level
     * @returns {boolean} Success
     */
    setLevel(characterId, level) {
      const data = this.getLevelData(characterId);
      if (!data) return false;

      const oldLevel = data.level;
      data.level = Math.max(1, Math.min(level, this.options.maxLevel));
      data.xp = 0;
      data.xpToNext = this.calculateXPForLevel(data.level);

      data.levelHistory.push({
        level: data.level,
        timestamp: Date.now(),
        setDirectly: true,
      });

      this._emit("level:set", {
        characterId,
        oldLevel,
        newLevel: data.level,
      });

      if (this.options.debug) {
        console.log(`[LevelSystem] ${characterId} level set to ${data.level}`);
      }

      return true;
    }

    /**
     * Add a level to character
     * @param {string} characterId - Character ID
     * @param {number} levels - Number of levels to add (default 1)
     * @returns {number} New level
     */
    addLevels(characterId, levels = 1) {
      const data = this.getLevelData(characterId);
      if (!data) return 1;

      const newLevel = Math.min(data.level + levels, this.options.maxLevel);
      this.setLevel(characterId, newLevel);

      return newLevel;
    }

    /**
     * Get XP progress as percentage
     * @param {string} characterId - Character ID
     * @returns {number} Progress (0-100)
     */
    getXPProgress(characterId) {
      const data = this.getLevelData(characterId);
      if (!data) return 0;

      if (data.level >= this.options.maxLevel) return 100;

      return Math.min(100, (data.xp / data.xpToNext) * 100);
    }

    /**
     * Check if character can prestige
     * @param {string} characterId - Character ID
     * @returns {boolean}
     */
    canPrestige(characterId) {
      if (!this.options.enablePrestige) return false;

      const data = this.getLevelData(characterId);
      if (!data) return false;

      return (
        data.level >= this.options.maxLevel &&
        data.prestige < this.options.maxPrestige
      );
    }

    /**
     * Prestige/rebirth a character
     * @param {string} characterId - Character ID
     * @returns {Object|null} Prestige result
     */
    prestige(characterId) {
      if (!this.canPrestige(characterId)) {
        return null;
      }

      const data = this.getLevelData(characterId);

      const oldPrestige = data.prestige;
      const oldLevel = data.level;

      // Reset to level 1
      data.level = 1;
      data.xp = 0;
      data.xpToNext = this.calculateXPForLevel(1);
      data.prestige += 1;

      // Track in history
      data.levelHistory.push({
        level: 1,
        prestige: data.prestige,
        timestamp: Date.now(),
        prestiged: true,
      });

      this._emit("prestige:complete", {
        characterId,
        oldPrestige,
        newPrestige: data.prestige,
        prestigeBonus: this.getPrestigeBonus(data.prestige),
      });

      if (this.options.debug) {
        console.log(
          `[LevelSystem] ${characterId} prestiged to level ${data.prestige}!`
        );
      }

      return {
        prestige: data.prestige,
        prestigeBonus: this.getPrestigeBonus(data.prestige),
      };
    }

    /**
     * Get prestige bonuses
     * @param {number} prestige - Prestige level
     * @returns {Object} Bonus multipliers
     */
    getPrestigeBonus(prestige) {
      if (prestige <= 0) return { xpMult: 1.0, statMult: 1.0 };

      return {
        xpMult: 1 + prestige * 0.25, // +25% XP per prestige
        statMult: 1 + prestige * 0.05, // +5% stats per prestige
        goldMult: 1 + prestige * 0.1, // +10% gold per prestige
        dropMult: 1 + prestige * 0.05, // +5% drop rate per prestige
      };
    }

    /**
     * Get effective level (including prestige)
     * @param {string} characterId - Character ID
     * @returns {number}
     */
    getEffectiveLevel(characterId) {
      const data = this.getLevelData(characterId);
      if (!data) return 1;

      // Effective level = current level + (prestige * maxLevel)
      return data.level + data.prestige * this.options.maxLevel;
    }

    /**
     * Get level history
     * @param {string} characterId - Character ID
     * @param {number} limit - Max entries to return
     * @returns {Array}
     */
    getLevelHistory(characterId, limit = 10) {
      const data = this.getLevelData(characterId);
      if (!data) return [];

      return data.levelHistory.slice(-limit);
    }

    /**
     * Serialize level data for saving
     * @returns {Array}
     */
    serialize() {
      return Array.from(this.levels.values()).map((data) => ({
        characterId: data.characterId,
        level: data.level,
        xp: data.xp,
        xpToNext: data.xpToNext,
        prestige: data.prestige,
        totalXP: data.totalXP,
        levelHistory: data.levelHistory,
      }));
    }

    /**
     * Deserialize and load level data
     * @param {Array} data - Serialized level data
     */
    deserialize(data) {
      if (!Array.isArray(data)) {
        console.error("[LevelSystem] Invalid deserialization data");
        return;
      }

      this.levels.clear();

      data.forEach((levelData) => {
        this.createLevel(levelData);
      });

      this._emit("level:loaded", { characterCount: this.levels.size });
    }

    // ============================
    // PRIVATE METHODS
    // ============================

    /**
     * Calculate milestone-based XP
     * @private
     */
    _calculateMilestoneXP(level) {
      // Custom milestone curve
      if (level <= 10) {
        return 100 * level;
      } else if (level <= 50) {
        return 100 * 10 + (level - 10) * 200;
      } else if (level <= 100) {
        return 100 * 10 + 40 * 200 + (level - 50) * 500;
      } else {
        return 100 * 10 + 40 * 200 + 50 * 500 + (level - 100) * 1000;
      }
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
          console.error("[LevelSystem] Event emit failed:", err);
        }
      }
    }
  }

  // ============================
  // STATIC UTILITIES
  // ============================

  /**
   * Calculate total XP needed from level 1 to target level
   * @static
   */
  LevelSystem.calculateTotalXP = function (targetLevel, options = {}) {
    const opts = Object.assign(
      {
        baseXP: 100,
        growthFactor: 1.5,
        curve: XP_CURVES.EXPONENTIAL,
      },
      options
    );

    let total = 0;

    for (let lvl = 1; lvl < targetLevel; lvl++) {
      switch (opts.curve) {
        case XP_CURVES.EXPONENTIAL:
          total += opts.baseXP * Math.pow(opts.growthFactor, lvl - 1);
          break;
        case XP_CURVES.LINEAR:
          total += opts.baseXP * lvl;
          break;
        default:
          total += opts.baseXP * lvl;
      }
    }

    return Math.round(total);
  };

  /**
   * Calculate level from total XP
   * @static
   */
  LevelSystem.getLevelFromTotalXP = function (totalXP, options = {}) {
    const opts = Object.assign(
      {
        baseXP: 100,
        growthFactor: 1.5,
        maxLevel: MAX_LEVEL,
      },
      options
    );

    let level = 1;
    let accumulatedXP = 0;

    while (level < opts.maxLevel) {
      const xpForNextLevel =
        opts.baseXP * Math.pow(opts.growthFactor, level - 1);

      if (accumulatedXP + xpForNextLevel > totalXP) {
        break;
      }

      accumulatedXP += xpForNextLevel;
      level++;
    }

    return { level, remainingXP: totalXP - accumulatedXP };
  };

  // Expose XP curves
  LevelSystem.XP_CURVES = XP_CURVES;

  return LevelSystem;
});
