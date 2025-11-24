/**
 * EnemyScaling.js - Smart Enemy Stat Scaling System
 * @version 1.0.0
 * @description Respects 9.5 wave/stage/area logic, 15 rank tiers (F to SSS+)
 * CRITICAL: Never uses wave 10 or stage 10 - respects existing progression_v95.js
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.EnemyScaling = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // RANK DEFINITIONS
  // ============================

  const RANKS = {
    F: { mult: 0.5, name: "Novice", color: "#888888", tier: 1 },
    E: { mult: 0.7, name: "Beginner", color: "#999999", tier: 2 },
    D: { mult: 0.9, name: "Apprentice", color: "#aaaaaa", tier: 3 },
    "C-": { mult: 1.0, name: "Journeyman", color: "#8bc34a", tier: 4 },
    C: { mult: 1.2, name: "Adventurer", color: "#4caf50", tier: 5 },
    "C+": { mult: 1.4, name: "Veteran", color: "#2196f3", tier: 6 },
    "B-": { mult: 1.7, name: "Elite", color: "#2196f3", tier: 7 },
    B: { mult: 2.0, name: "Expert", color: "#9c27b0", tier: 8 },
    "B+": { mult: 2.5, name: "Master", color: "#9c27b0", tier: 9 },
    "A-": { mult: 3.0, name: "Champion", color: "#ff9800", tier: 10 },
    A: { mult: 4.0, name: "Hero", color: "#ff9800", tier: 11 },
    "A+": { mult: 5.0, name: "Legend", color: "#ff5722", tier: 12 },
    S: { mult: 7.0, name: "Mythic", color: "#f44336", tier: 13 },
    SS: { mult: 10.0, name: "Godlike", color: "#ffd700", tier: 14 },
    SSS: { mult: 15.0, name: "Transcendent", color: "#ffd700", tier: 15 },
    "SSS+": { mult: 25.0, name: "Supreme", color: "rainbow", tier: 16 },
  };

  const RANK_ORDER = [
    "F",
    "E",
    "D",
    "C-",
    "C",
    "C+",
    "B-",
    "B",
    "B+",
    "A-",
    "A",
    "A+",
    "S",
    "SS",
    "SSS",
    "SSS+",
  ];

  // ============================
  // ENEMY SCALING CLASS
  // ============================

  class EnemyScaling {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          useWaveScaling: true,
          useStageScaling: true,
          useAreaScaling: true,
          useRankScaling: true,
          bossMultiplier: 2.0,
          eliteMultiplier: 1.5,
          eventBus: null,
          debug: false,
        },
        options
      );

      // Event bus integration
      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);

      this.initialized = false;
    }

    /**
     * Initialize the enemy scaling system
     */
    init() {
      if (this.initialized) {
        console.warn("[EnemyScaling] Already initialized");
        return this;
      }

      this.initialized = true;
      this._emit("enemy:scaling:ready");

      if (this.options.debug) {
        console.log("[EnemyScaling] Initialized");
      }

      return this;
    }

    /**
     * Calculate enemy stats based on progression
     * @param {Object} baseStats - Base enemy stats {hp, atk, def, spd}
     * @param {Object} progression - Progression data {wave, stage, area, loop, rank, isBoss, isElite}
     * @returns {Object} Scaled stats
     */
    calculateEnemyStats(baseStats, progression = {}) {
      // Parse progression
      const wave = this._parseWave(progression.wave || 1);
      const stage = this._parseStage(progression.stage || 1);
      const area = progression.area || 1;
      const loop = progression.loop || 0;
      const rank = progression.rank || "C-";
      const isBoss = !!progression.isBoss;
      const isElite = !!progression.isElite;

      // Calculate multipliers
      const waveMult = this._getWaveMultiplier(wave);
      const stageMult = this._getStageMultiplier(stage);
      const areaMult = this._getAreaMultiplier(area, loop);
      const rankMult = this._getRankMultiplier(rank);
      const typeMult = this._getTypeMultiplier(isBoss, isElite);

      // Total multiplier
      const totalMult = waveMult * stageMult * areaMult * rankMult * typeMult;

      // Apply to stats
      const scaledStats = {
        hp: Math.round((baseStats.hp || 100) * totalMult),
        atk: Math.round((baseStats.atk || 10) * totalMult),
        def: Math.round((baseStats.def || 5) * totalMult),
        spd: Math.round((baseStats.spd || 50) * (1 + (totalMult - 1) * 0.3)), // Speed scales slower

        // Additional properties
        rank: rank,
        rankTier: RANKS[rank]?.tier || 4,
        isBoss: isBoss,
        isElite: isElite,
        progression: { wave, stage, area, loop },
        multipliers: {
          waveMult,
          stageMult,
          areaMult,
          rankMult,
          typeMult,
          totalMult,
        },
      };

      // XP/Gold rewards scale with difficulty
      scaledStats.xpReward = Math.round((baseStats.xpReward || 10) * totalMult);
      scaledStats.goldReward = Math.round(
        (baseStats.goldReward || 5) * totalMult
      );

      if (this.options.debug) {
        console.log("[EnemyScaling] Calculated stats:", scaledStats);
      }

      return scaledStats;
    }

    /**
     * Get suggested rank for progression
     * @param {Object} progression - Progression data
     * @returns {string} Suggested rank
     */
    getSuggestedRank(progression = {}) {
      const wave = this._parseWave(progression.wave || 1);
      const stage = this._parseStage(progression.stage || 1);
      const area = progression.area || 1;
      const loop = progression.loop || 0;

      // Calculate difficulty score
      let score = 0;

      // Wave contribution (1-9, then .5 variants)
      score += wave.base + (wave.isHalf ? 0.5 : 0);

      // Stage contribution
      score += (stage.base - 1) * 9 + (stage.isHalf ? 4.5 : 0);

      // Area contribution
      score += (area - 1) * 36;

      // Loop contribution
      score += loop * 360;

      // Map score to rank
      if (score < 10) return "F";
      if (score < 20) return "E";
      if (score < 30) return "D";
      if (score < 40) return "C-";
      if (score < 60) return "C";
      if (score < 80) return "C+";
      if (score < 100) return "B-";
      if (score < 140) return "B";
      if (score < 180) return "B+";
      if (score < 250) return "A-";
      if (score < 350) return "A";
      if (score < 500) return "A+";
      if (score < 700) return "S";
      if (score < 1000) return "SS";
      if (score < 1500) return "SSS";
      return "SSS+";
    }

    /**
     * Get rank multiplier
     * @param {string} rank - Rank tier
     * @returns {number}
     */
    getRankMultiplier(rank) {
      return this._getRankMultiplier(rank);
    }

    /**
     * Get rank info
     * @param {string} rank - Rank tier
     * @returns {Object|null}
     */
    getRankInfo(rank) {
      return RANKS[rank] || null;
    }

    /**
     * Get all ranks
     * @returns {Array}
     */
    getAllRanks() {
      return RANK_ORDER.map((rankKey) => ({
        key: rankKey,
        ...RANKS[rankKey],
      }));
    }

    /**
     * Get next rank
     * @param {string} currentRank - Current rank
     * @returns {string|null}
     */
    getNextRank(currentRank) {
      const index = RANK_ORDER.indexOf(currentRank);
      if (index === -1 || index === RANK_ORDER.length - 1) return null;
      return RANK_ORDER[index + 1];
    }

    /**
     * Get previous rank
     * @param {string} currentRank - Current rank
     * @returns {string|null}
     */
    getPreviousRank(currentRank) {
      const index = RANK_ORDER.indexOf(currentRank);
      if (index <= 0) return null;
      return RANK_ORDER[index - 1];
    }

    // ============================
    // PRIVATE METHODS
    // ============================

    /**
     * Parse wave number (handles .5 variants)
     * @private
     */
    _parseWave(wave) {
      if (typeof wave === "object") return wave;

      const waveNum = Number(wave);
      const base = Math.floor(waveNum);
      const isHalf = waveNum % 1 >= 0.5;

      // Ensure wave stays in 1-9 range (NEVER 10!)
      const clampedBase = Math.max(1, Math.min(9, base));

      return {
        base: clampedBase,
        isHalf: isHalf,
        display: isHalf ? `${clampedBase}.5` : String(clampedBase),
      };
    }

    /**
     * Parse stage number (handles .5 variants)
     * @private
     */
    _parseStage(stage) {
      if (typeof stage === "object") return stage;

      const stageNum = Number(stage);
      const base = Math.floor(stageNum);
      const isHalf = stageNum % 1 >= 0.5;

      // Ensure stage stays in 1-2 range per area (NEVER 10!)
      const clampedBase = Math.max(1, Math.min(2, base));

      return {
        base: clampedBase,
        isHalf: isHalf,
        display: isHalf ? `${clampedBase}.5` : String(clampedBase),
      };
    }

    /**
     * Get wave multiplier (respects 1-9 and .5 variants)
     * @private
     */
    _getWaveMultiplier(wave) {
      if (!this.options.useWaveScaling) return 1.0;

      const parsed = typeof wave === "object" ? wave : this._parseWave(wave);

      // Base wave multiplier: 1.0 at wave 1, scales up
      let mult = 1 + (parsed.base - 1) * 0.15; // +15% per wave

      // Half-waves get intermediate scaling
      if (parsed.isHalf) {
        mult += 0.075 + parsed.base * 0.03; // +7.5% base + 3% per wave level
      }

      return mult;
    }

    /**
     * Get stage multiplier
     * @private
     */
    _getStageMultiplier(stage) {
      if (!this.options.useStageScaling) return 1.0;

      const parsed =
        typeof stage === "object" ? stage : this._parseStage(stage);

      // Stage multiplier
      let mult = 1 + (parsed.base - 1) * 0.12; // +12% per stage

      // Half-stages
      if (parsed.isHalf) {
        mult += 0.06; // +6% for .5 variant
      }

      return mult;
    }

    /**
     * Get area multiplier (includes loop scaling)
     * @private
     */
    _getAreaMultiplier(area, loop = 0) {
      if (!this.options.useAreaScaling) return 1.0;

      // Clamp area to 1-100
      const clampedArea = Math.max(1, Math.min(100, area));

      // Area scaling
      const areaMult = 1 + (clampedArea - 1) * 0.08; // +8% per area

      // Loop scaling (significant boost)
      const loopMult = 1 + loop * 0.25; // +25% per loop

      return areaMult * loopMult;
    }

    /**
     * Get rank multiplier
     * @private
     */
    _getRankMultiplier(rank) {
      if (!this.options.useRankScaling) return 1.0;

      const rankData = RANKS[rank];
      if (!rankData) {
        console.warn(`[EnemyScaling] Unknown rank: ${rank}, defaulting to C-`);
        return RANKS["C-"].mult;
      }

      return rankData.mult;
    }

    /**
     * Get type multiplier (boss/elite)
     * @private
     */
    _getTypeMultiplier(isBoss, isElite) {
      let mult = 1.0;

      if (isBoss) {
        mult *= this.options.bossMultiplier;
      } else if (isElite) {
        mult *= this.options.eliteMultiplier;
      }

      return mult;
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
          console.error("[EnemyScaling] Event emit failed:", err);
        }
      }
    }
  }

  // ============================
  // STATIC UTILITIES
  // ============================

  /**
   * Calculate threat level (0-100 scale)
   * @static
   */
  EnemyScaling.calculateThreatLevel = function (progression) {
    const wave =
      typeof progression.wave === "object"
        ? progression.wave.base
        : Math.floor(progression.wave || 1);
    const stage =
      typeof progression.stage === "object"
        ? progression.stage.base
        : Math.floor(progression.stage || 1);
    const area = progression.area || 1;
    const loop = progression.loop || 0;
    const rank = progression.rank || "C-";
    const isBoss = !!progression.isBoss;
    const isElite = !!progression.isElite;

    // Base threat from progression
    let threat = 0;
    threat += wave * 2; // 0-18
    threat += stage * 9; // 0-18
    threat += area; // 0-100
    threat += loop * 25; // 0-250+

    // Rank threat
    const rankData = RANKS[rank];
    if (rankData) {
      threat *= rankData.mult;
    }

    // Type modifiers
    if (isBoss) threat *= 2;
    if (isElite) threat *= 1.5;

    // Normalize to 0-100 scale
    return Math.min(100, Math.round(threat / 5));
  };

  /**
   * Get difficulty tier name
   * @static
   */
  EnemyScaling.getDifficultyTier = function (threatLevel) {
    if (threatLevel < 10) return "Trivial";
    if (threatLevel < 20) return "Easy";
    if (threatLevel < 35) return "Normal";
    if (threatLevel < 50) return "Challenging";
    if (threatLevel < 65) return "Hard";
    if (threatLevel < 80) return "Brutal";
    if (threatLevel < 90) return "Nightmare";
    return "Impossible";
  };

  // Expose ranks
  EnemyScaling.RANKS = RANKS;
  EnemyScaling.RANK_ORDER = RANK_ORDER;

  return EnemyScaling;
});
