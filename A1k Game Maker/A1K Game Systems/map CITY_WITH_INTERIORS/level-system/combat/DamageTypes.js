/**
 * DamageTypes.js - Damage Calculation & Type System
 * @version 1.0.0
 * @description 6 damage types with resistances, crits, and variance
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.DamageTypes = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // DAMAGE TYPE DEFINITIONS
  // ============================

  const DAMAGE_TYPES = {
    physical: {
      name: "Physical",
      color: "#ff6b6b",
      icon: "⚔️",
      description: "Physical melee and ranged attacks",
    },
    magic: {
      name: "Magic",
      color: "#4c6ef5",
      icon: "✨",
      description: "Magical spell damage",
    },
    fire: {
      name: "Fire",
      color: "#ff6b35",
      icon: "🔥",
      description: "Fire elemental damage",
    },
    ice: {
      name: "Ice",
      color: "#4ecdc4",
      icon: "❄️",
      description: "Ice elemental damage, may slow",
    },
    lightning: {
      name: "Lightning",
      color: "#ffd93d",
      icon: "⚡",
      description: "Lightning elemental damage",
    },
    dark: {
      name: "Dark",
      color: "#9b59b6",
      icon: "🌑",
      description: "Dark/shadow magic damage",
    },
  };

  const TYPE_KEYS = Object.keys(DAMAGE_TYPES);

  // ============================
  // DAMAGE TYPES CLASS
  // ============================

  class DamageTypes {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          baseCritMultiplier: 2.0,
          maxCritMultiplier: 5.0,
          damageVariance: 0.1, // ±10%
          armorFormula: "diminishing", // 'diminishing' or 'percentage'
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
     * Initialize the damage system
     */
    init() {
      if (this.initialized) {
        console.warn("[DamageTypes] Already initialized");
        return this;
      }

      this.initialized = true;
      this._emit("damage:ready");

      if (this.options.debug) {
        console.log("[DamageTypes] Initialized");
      }

      return this;
    }

    /**
     * Calculate damage dealt by attacker to target
     * @param {Object} attacker - Attacker stats
     * @param {Object} target - Target stats
     * @param {string} damageType - Type of damage
     * @param {number} skillMultiplier - Skill damage multiplier
     * @param {Object} options - Additional options
     * @returns {Object} Damage result
     */
    calculateDamage(
      attacker,
      target,
      damageType = "physical",
      skillMultiplier = 1.0,
      options = {}
    ) {
      if (!this.initialized) {
        console.error("[DamageTypes] Not initialized");
        return { damage: 0, isCritical: false, type: damageType };
      }

      // Validate damage type
      if (!DAMAGE_TYPES[damageType]) {
        console.warn(
          `[DamageTypes] Unknown damage type: ${damageType}, defaulting to physical`
        );
        damageType = "physical";
      }

      // Get attacker stats
      const attackStat = this._getAttackStat(attacker, damageType);
      const critChance = this._getCritChance(attacker);
      const critDamage = this._getCritDamage(attacker);
      const armorPen = attacker.armorPen || 0;

      // Get target stats
      const defense = this._getDefenseStat(target, damageType);
      const resistance = this._getResistance(target, damageType);
      const evasion = target.eva || 0;

      // Check for miss (evasion)
      if (this._rollMiss(evasion, options.forcedHit)) {
        this._emit("damage:miss", { attacker, target, damageType });
        return {
          damage: 0,
          missed: true,
          type: damageType,
          color: DAMAGE_TYPES[damageType].color,
        };
      }

      // Base damage
      let baseDamage = attackStat * skillMultiplier;

      // Apply damage variance
      if (this.options.damageVariance > 0 && !options.noVariance) {
        const variance = this.options.damageVariance;
        const randomFactor = 1 + (Math.random() * 2 - 1) * variance;
        baseDamage *= randomFactor;
      }

      // Check for critical hit
      const isCritical = this._rollCrit(critChance, options.forcedCrit);
      if (isCritical) {
        const critMult = Math.min(this.options.maxCritMultiplier, critDamage);
        baseDamage *= critMult;
      }

      // Apply resistance
      const resistanceMultiplier =
        this._calculateResistanceMultiplier(resistance);
      baseDamage *= resistanceMultiplier;

      // Apply defense reduction
      const defenseReduction = this._calculateDefenseReduction(
        defense,
        armorPen
      );
      baseDamage *= 1 - defenseReduction;

      // Ensure minimum damage
      const finalDamage = Math.max(
        options.minDamage || 1,
        Math.floor(baseDamage)
      );

      // Create result object
      const result = {
        damage: finalDamage,
        isCritical,
        missed: false,
        type: damageType,
        color: DAMAGE_TYPES[damageType].color,
        breakdown: {
          baseAttack: attackStat,
          skillMultiplier,
          critMultiplier: isCritical ? critDamage : 1.0,
          resistanceMultiplier,
          defenseReduction,
          variance: this.options.damageVariance,
        },
      };

      this._emit("damage:dealt", { attacker, target, result });

      if (this.options.debug) {
        console.log("[DamageTypes] Damage calculated:", result);
      }

      return result;
    }

    /**
     * Calculate damage over time (DOT)
     * @param {Object} target - Target entity
     * @param {string} damageType - Type of damage
     * @param {number} damagePerTick - Damage per tick
     * @param {number} duration - Total duration in ms
     * @param {number} tickRate - Tick rate in ms
     * @returns {Object} DOT info
     */
    calculateDOT(target, damageType, damagePerTick, duration, tickRate = 1000) {
      const ticks = Math.floor(duration / tickRate);
      const totalDamage = damagePerTick * ticks;

      // Apply resistance
      const resistance = this._getResistance(target, damageType);
      const resistanceMultiplier =
        this._calculateResistanceMultiplier(resistance);

      const adjustedDamagePerTick = Math.floor(
        damagePerTick * resistanceMultiplier
      );
      const adjustedTotalDamage = adjustedDamagePerTick * ticks;

      return {
        type: damageType,
        damagePerTick: adjustedDamagePerTick,
        totalDamage: adjustedTotalDamage,
        ticks,
        tickRate,
        duration,
        color: DAMAGE_TYPES[damageType].color,
      };
    }

    /**
     * Get type effectiveness (for future expansion)
     * @param {string} attackType - Attack damage type
     * @param {string} targetType - Target entity type
     * @returns {number} Effectiveness multiplier
     */
    getTypeEffectiveness(attackType, targetType) {
      // Type chart (can be expanded)
      const chart = {
        fire: { ice: 1.5, fire: 0.5 },
        ice: { fire: 0.5, ice: 1.0 },
        lightning: { physical: 1.2 },
        dark: { magic: 1.3 },
      };

      return chart[attackType]?.[targetType] || 1.0;
    }

    /**
     * Get damage type info
     * @param {string} type - Damage type
     * @returns {Object|null}
     */
    getDamageTypeInfo(type) {
      return DAMAGE_TYPES[type] || null;
    }

    /**
     * Get all damage types
     * @returns {Array}
     */
    getAllDamageTypes() {
      return TYPE_KEYS.map((key) => ({
        key,
        ...DAMAGE_TYPES[key],
      }));
    }

    // ============================
    // PRIVATE METHODS
    // ============================

    /**
     * Get attack stat based on damage type
     * @private
     */
    _getAttackStat(attacker, damageType) {
      switch (damageType) {
        case "magic":
          return attacker.mag || attacker.atk || 10;
        case "fire":
        case "ice":
        case "lightning":
        case "dark":
          // Elemental damage can use mag or atk
          return Math.max(attacker.mag || 0, attacker.atk || 0) || 10;
        case "physical":
        default:
          return attacker.atk || 10;
      }
    }

    /**
     * Get defense stat based on damage type
     * @private
     */
    _getDefenseStat(target, damageType) {
      switch (damageType) {
        case "magic":
        case "fire":
        case "ice":
        case "lightning":
        case "dark":
          return target.res || target.def || 0;
        case "physical":
        default:
          return target.def || 0;
      }
    }

    /**
     * Get crit chance
     * @private
     */
    _getCritChance(attacker) {
      const crt = attacker.crt || 0;

      // If crt is < 1, treat as percentage
      if (crt < 1) return crt;

      // If crt is >= 1, treat as points (100 = 100%)
      return Math.min(1.0, crt / 100);
    }

    /**
     * Get crit damage multiplier
     * @private
     */
    _getCritDamage(attacker) {
      return attacker.critDmg || this.options.baseCritMultiplier;
    }

    /**
     * Get resistance to damage type
     * @private
     */
    _getResistance(target, damageType) {
      if (!target.resistances) return 0;

      return target.resistances[damageType] || 0;
    }

    /**
     * Calculate resistance multiplier
     * @private
     */
    _calculateResistanceMultiplier(resistance) {
      // Resistance: -50 (weak) to +100 (immune)
      // -50 = 150% damage
      // 0 = 100% damage
      // 50 = 50% damage
      // 100 = 0% damage (immune)

      const clampedResistance = Math.max(-50, Math.min(100, resistance));
      return 1 - clampedResistance / 100;
    }

    /**
     * Calculate defense reduction
     * @private
     */
    _calculateDefenseReduction(defense, armorPen = 0) {
      // Apply armor penetration
      const effectiveDefense = Math.max(0, defense * (1 - armorPen));

      if (this.options.armorFormula === "diminishing") {
        // Diminishing returns formula: DEF / (DEF + 100)
        return effectiveDefense / (effectiveDefense + 100);
      } else {
        // Percentage reduction (capped at 90%)
        return Math.min(0.9, effectiveDefense / 100);
      }
    }

    /**
     * Roll for critical hit
     * @private
     */
    _rollCrit(critChance, forced = false) {
      if (forced) return true;
      return Math.random() < critChance;
    }

    /**
     * Roll for miss (evasion)
     * @private
     */
    _rollMiss(evasion, forcedHit = false) {
      if (forcedHit) return false;

      // Evasion is capped at 75%
      const clampedEvasion = Math.min(0.75, evasion);
      return Math.random() < clampedEvasion;
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
          console.error("[DamageTypes] Event emit failed:", err);
        }
      }
    }
  }

  // ============================
  // STATIC UTILITIES
  // ============================

  /**
   * Calculate total damage from combo
   * @static
   */
  DamageTypes.calculateComboDamage = function (hits, baseBonus = 0.05) {
    if (!Array.isArray(hits)) return 0;

    let totalDamage = 0;
    let comboMult = 1.0;

    hits.forEach((hit, index) => {
      // Combo multiplier increases with each hit
      comboMult = 1.0 + index * baseBonus;
      totalDamage += hit * comboMult;
    });

    return Math.floor(totalDamage);
  };

  /**
   * Calculate overkill damage (excess damage distributed)
   * @static
   */
  DamageTypes.calculateOverkill = function (
    damage,
    targetHP,
    nearbyEnemies = []
  ) {
    const overkill = Math.max(0, damage - targetHP);

    if (overkill === 0 || nearbyEnemies.length === 0) {
      return { overkill: 0, distributed: [] };
    }

    // Distribute 50% of overkill to nearby enemies
    const distributedDamage = Math.floor(
      (overkill * 0.5) / nearbyEnemies.length
    );

    const distributed = nearbyEnemies.map((enemy) => ({
      target: enemy,
      damage: distributedDamage,
    }));

    return { overkill, distributed };
  };

  // Expose damage types
  DamageTypes.DAMAGE_TYPES = DAMAGE_TYPES;
  DamageTypes.TYPE_KEYS = TYPE_KEYS;

  return DamageTypes;
});
