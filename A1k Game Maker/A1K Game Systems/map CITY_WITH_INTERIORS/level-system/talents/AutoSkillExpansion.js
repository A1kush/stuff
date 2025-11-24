/**
 * AutoSkillExpansion.js - 3 NEW Auto-Skill Lanes
 * @version 1.0.0
 * @description Dragon, Blood, Arcane lanes (totaling 9 auto lanes with existing 6)
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.AutoSkillExpansion = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // 3 NEW AUTO-SKILL LANES
  // ============================

  const NEW_AUTO_LANES = {
    // LANE 7: DRAGON 🐲 (Balanced - ATK + HP)
    dragon: [
      {
        id: "dragon_1",
        name: "Dragon's Might",
        cost: 1,
        lane: "dragon",
        tier: 1,
        req: null,
        text: "+6% ATK + Dragon's Might",
        description: "Channel the power of dragons (+6% ATK)",
        stats: { atkMul: 0.06 },
      },
      {
        id: "dragon_2",
        name: "Scaled Armor",
        cost: 2,
        lane: "dragon",
        tier: 2,
        req: ["dragon_1"],
        text: "+12% ATK + Scaled Armor",
        description: "Draconic scales protect you (+12% ATK, +120 HP)",
        stats: { atkMul: 0.12, hp: 120 },
      },
      {
        id: "dragon_3",
        name: "Dragon Power",
        cost: 3,
        lane: "dragon",
        tier: 3,
        req: ["dragon_2"],
        text: "+20% ATK + Dragon Power",
        description: "Unleash dragon strength (+20% ATK, +200 HP)",
        stats: { atkMul: 0.2, hp: 200 },
      },
      {
        id: "dragon_4",
        name: "Draconic Fury",
        cost: 4,
        lane: "dragon",
        tier: 4,
        req: ["dragon_3"],
        text: "+28% ATK + Draconic Fury",
        description:
          "Channel pure draconic rage (+28% ATK, +300 HP, +10% Crit)",
        stats: { atkMul: 0.28, hp: 300, crt: 0.1 },
      },
      {
        id: "dragon_ultimate",
        name: "🐲 DRAGON FORM",
        cost: 10,
        lane: "dragon",
        tier: 5,
        ultimate: true,
        equippable: true,
        req: ["dragon_4"],
        text: "🐲 DRAGON FORM: Transform into dragon",
        description:
          "Transform: +100% HP, flame breath (300% ATK), 15s duration, 30s CD",
        cooldown: 30000,
        duration: 15000,
        skillMultiplier: 3.0,
        // Equipped bonus (only when equipped to slot)
        equippedBonus: { atkMul: 0.45, hp: 500, crt: 0.2, defMul: 0.15 },
      },
    ],

    // LANE 8: BLOOD 🩸 (Sustain - Lifesteal)
    blood: [
      {
        id: "blood_1",
        name: "Blood Siphon",
        cost: 1,
        lane: "blood",
        tier: 1,
        req: null,
        text: "+5% ATK + Blood Siphon",
        description: "Siphon life from enemies (+5% ATK, +5% Lifesteal)",
        stats: { atkMul: 0.05, lifesteal: 0.05 },
      },
      {
        id: "blood_2",
        name: "Crimson Power",
        cost: 2,
        lane: "blood",
        tier: 2,
        req: ["blood_1"],
        text: "+10% ATK + Crimson Power",
        description: "Blood empowers you (+10% ATK, +10% Lifesteal)",
        stats: { atkMul: 0.1, lifesteal: 0.1 },
      },
      {
        id: "blood_3",
        name: "Blood Pact",
        cost: 3,
        lane: "blood",
        tier: 3,
        req: ["blood_2"],
        text: "+15% ATK + Blood Pact",
        description: "Pact sealed in blood (+15% ATK, +15% Lifesteal, +100 HP)",
        stats: { atkMul: 0.15, lifesteal: 0.15, hp: 100 },
      },
      {
        id: "blood_4",
        name: "Hemomancy",
        cost: 4,
        lane: "blood",
        tier: 4,
        req: ["blood_3"],
        text: "+22% ATK + Hemomancy",
        description: "Master blood magic (+22% ATK, +20% Lifesteal, +200 HP)",
        stats: { atkMul: 0.22, lifesteal: 0.2, hp: 200 },
      },
      {
        id: "blood_ultimate",
        name: "🩸 BLOOD REAPER",
        cost: 8,
        lane: "blood",
        tier: 5,
        ultimate: true,
        equippable: true,
        req: ["blood_4"],
        text: "🩸 BLOOD REAPER: Drain life AoE",
        description: "Drain life AoE: 180% ATK + 30% max HP heal, 10s CD",
        cooldown: 10000,
        skillMultiplier: 1.8,
        healPercent: 0.3,
        // Equipped bonus
        equippedBonus: { atkMul: 0.32, lifesteal: 0.3, hp: 300 },
      },
    ],

    // LANE 9: ARCANE 🔮 (Magic - MAG + CDR)
    arcane: [
      {
        id: "arcane_1",
        name: "Mana Flow",
        cost: 1,
        lane: "arcane",
        tier: 1,
        req: null,
        text: "+8% MAG + Mana Flow",
        description: "Channel arcane energies (+8% MAG, +50 MP)",
        stats: { magMul: 0.08, mp: 50 },
      },
      {
        id: "arcane_2",
        name: "Arcane Burst",
        cost: 2,
        lane: "arcane",
        tier: 2,
        req: ["arcane_1"],
        text: "+15% MAG + Arcane Burst",
        description: "Bursts of arcane power (+15% MAG, +100 MP, +10% CDR)",
        stats: { magMul: 0.15, mp: 100, cdr: 0.1 },
      },
      {
        id: "arcane_3",
        name: "Spell Weaving",
        cost: 3,
        lane: "arcane",
        tier: 3,
        req: ["arcane_2"],
        text: "+22% MAG + Spell Weaving",
        description:
          "Weave complex spells faster (+22% MAG, +150 MP, +15% CDR)",
        stats: { magMul: 0.22, mp: 150, cdr: 0.15 },
      },
      {
        id: "arcane_4",
        name: "Magic Mastery",
        cost: 4,
        lane: "arcane",
        tier: 4,
        req: ["arcane_3"],
        text: "+30% MAG + Magic Mastery",
        description: "Master the arcane arts (+30% MAG, +200 MP, +20% CDR)",
        stats: { magMul: 0.3, mp: 200, cdr: 0.2 },
      },
      {
        id: "arcane_ultimate",
        name: "🔮 ARCANE SURGE",
        cost: 9,
        lane: "arcane",
        tier: 5,
        ultimate: true,
        equippable: true,
        req: ["arcane_4"],
        text: "🔮 ARCANE SURGE: 5 magic missiles",
        description:
          "Channel 5 magic missiles: 150% MAG each, instant cast, 8s CD",
        cooldown: 8000,
        skillMultiplier: 1.5,
        projectiles: 5,
        // Equipped bonus
        equippedBonus: { magMul: 0.4, mp: 300, cdr: 0.3 },
      },
    ],
  };

  // ============================
  // AUTO SKILL EXPANSION CLASS
  // ============================

  class AutoSkillExpansion {
    constructor(options = {}) {
      this.options = Object.assign(
        {
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
     * Initialize auto-skill expansion
     */
    init() {
      if (this.initialized) {
        console.warn("[AutoSkillExpansion] Already initialized");
        return this;
      }

      this.initialized = true;
      this._emit("autoskill:ready");

      if (this.options.debug) {
        console.log("[AutoSkillExpansion] Initialized with 3 new lanes");
      }

      return this;
    }

    /**
     * Get all new auto-skill lanes
     * @returns {Object} New lanes
     */
    getNewLanes() {
      return { ...NEW_AUTO_LANES };
    }

    /**
     * Get a specific lane
     * @param {string} laneKey - Lane key (dragon, blood, arcane)
     * @returns {Array|null}
     */
    getLane(laneKey) {
      return NEW_AUTO_LANES[laneKey] || null;
    }

    /**
     * Get all talents from new lanes as flat array
     * @returns {Array}
     */
    getAllTalents() {
      const talents = [];
      Object.keys(NEW_AUTO_LANES).forEach((laneKey) => {
        talents.push(...NEW_AUTO_LANES[laneKey]);
      });
      return talents;
    }

    /**
     * Get talent by ID
     * @param {string} talentId - Talent ID
     * @returns {Object|null}
     */
    getTalent(talentId) {
      for (const laneKey in NEW_AUTO_LANES) {
        const talent = NEW_AUTO_LANES[laneKey].find((t) => t.id === talentId);
        if (talent) return { ...talent };
      }
      return null;
    }

    /**
     * Get ultimate skills (equippable)
     * @returns {Array}
     */
    getUltimateSkills() {
      const ultimates = [];
      Object.keys(NEW_AUTO_LANES).forEach((laneKey) => {
        const lane = NEW_AUTO_LANES[laneKey];
        const ultimate = lane.find((t) => t.ultimate);
        if (ultimate) ultimates.push(ultimate);
      });
      return ultimates;
    }

    /**
     * Calculate total investment for a lane
     * @param {string} laneKey - Lane key
     * @returns {number} Total AP cost
     */
    getLaneInvestment(laneKey) {
      const lane = NEW_AUTO_LANES[laneKey];
      if (!lane) return 0;

      return lane.reduce((sum, talent) => sum + talent.cost, 0);
    }

    /**
     * Get lane progression stats (without ultimate)
     * @param {string} laneKey - Lane key
     * @returns {Object} Stat totals
     */
    getLaneProgressionStats(laneKey) {
      const lane = NEW_AUTO_LANES[laneKey];
      if (!lane) return {};

      const stats = {};

      // Sum all non-ultimate talents
      lane
        .filter((t) => !t.ultimate)
        .forEach((talent) => {
          if (!talent.stats) return;

          Object.keys(talent.stats).forEach((stat) => {
            stats[stat] = (stats[stat] || 0) + talent.stats[stat];
          });
        });

      return stats;
    }

    /**
     * Get full lane stats (progression + equipped bonus)
     * @param {string} laneKey - Lane key
     * @param {boolean} isEquipped - Is ultimate equipped?
     * @returns {Object} Total stats
     */
    getFullLaneStats(laneKey, isEquipped = false) {
      const lane = NEW_AUTO_LANES[laneKey];
      if (!lane) return {};

      const stats = this.getLaneProgressionStats(laneKey);

      // Add ultimate's equipped bonus if equipped
      if (isEquipped) {
        const ultimate = lane.find((t) => t.ultimate);
        if (ultimate && ultimate.equippedBonus) {
          Object.keys(ultimate.equippedBonus).forEach((stat) => {
            stats[stat] = (stats[stat] || 0) + ultimate.equippedBonus[stat];
          });
        }
      }

      return stats;
    }

    /**
     * Get lane summary
     * @param {string} laneKey - Lane key
     * @returns {Object} Summary
     */
    getLaneSummary(laneKey) {
      const lane = NEW_AUTO_LANES[laneKey];
      if (!lane) return null;

      const ultimate = lane.find((t) => t.ultimate);

      return {
        key: laneKey,
        name: this._getLaneName(laneKey),
        icon: this._getLaneIcon(laneKey),
        talentCount: lane.length,
        totalCost: this.getLaneInvestment(laneKey),
        ultimate: ultimate
          ? {
              id: ultimate.id,
              name: ultimate.name,
              cost: ultimate.cost,
              cooldown: ultimate.cooldown,
              description: ultimate.description,
            }
          : null,
        progressionStats: this.getLaneProgressionStats(laneKey),
        equippedBonus: ultimate ? ultimate.equippedBonus : {},
      };
    }

    /**
     * Get all lane summaries
     * @returns {Array}
     */
    getAllLaneSummaries() {
      return Object.keys(NEW_AUTO_LANES).map((key) => this.getLaneSummary(key));
    }

    /**
     * Merge with existing talent lanes (if available)
     * @param {Object} existingLanes - Existing TALENT_LANES object
     * @returns {Object} Merged lanes
     */
    mergeWithExisting(existingLanes) {
      return {
        ...existingLanes,
        ...NEW_AUTO_LANES,
      };
    }

    /**
     * Export lanes for talent-store-system integration
     * @returns {Object} Formatted for talent store
     */
    exportForTalentStore() {
      // Convert to talent-store-system format
      const exported = {};

      Object.keys(NEW_AUTO_LANES).forEach((laneKey) => {
        exported[laneKey] = NEW_AUTO_LANES[laneKey].map((talent) => ({
          id: talent.id,
          name: talent.name,
          cost: talent.cost,
          text: talent.text,
          description: talent.description,
          lane: talent.lane,
          tier: talent.tier,
          req: talent.req,
          ultimate: talent.ultimate || false,
          equippable: talent.equippable || false,
          fx: talent.stats ? this._createStatFunction(talent.stats) : null,
          equippedBonus: talent.equippedBonus || null,
          cooldown: talent.cooldown,
          duration: talent.duration,
          skillMultiplier: talent.skillMultiplier,
        }));
      });

      return exported;
    }

    // ============================
    // PRIVATE METHODS
    // ============================

    /**
     * Get lane display name
     * @private
     */
    _getLaneName(laneKey) {
      const names = {
        dragon: "Dragon",
        blood: "Blood",
        arcane: "Arcane",
      };
      return names[laneKey] || laneKey;
    }

    /**
     * Get lane icon
     * @private
     */
    _getLaneIcon(laneKey) {
      const icons = {
        dragon: "🐲",
        blood: "🩸",
        arcane: "🔮",
      };
      return icons[laneKey] || "⭐";
    }

    /**
     * Create stat modifier function (for talent-store compatibility)
     * @private
     */
    _createStatFunction(stats) {
      return function (characterStats) {
        Object.keys(stats).forEach((stat) => {
          characterStats[stat] = (characterStats[stat] || 0) + stats[stat];
        });
      };
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
          console.error("[AutoSkillExpansion] Event emit failed:", err);
        }
      }
    }
  }

  // ============================
  // STATIC UTILITIES
  // ============================

  /**
   * Calculate optimal lane for a playstyle
   * @static
   */
  AutoSkillExpansion.recommendLane = function (playstyle) {
    const recommendations = {
      tank: "dragon", // High HP + ATK
      sustain: "blood", // Lifesteal focus
      mage: "arcane", // Magic + CDR
      balanced: "dragon", // All-rounder
      aggressive: "blood", // High damage + sustain
      caster: "arcane", // Spell-focused
    };

    return recommendations[playstyle] || "dragon";
  };

  /**
   * Calculate total stats from multiple equipped skills
   * @static
   */
  AutoSkillExpansion.calculateCombinedStats = function (equippedLanes) {
    const totalStats = {};

    equippedLanes.forEach((laneKey) => {
      const lane = NEW_AUTO_LANES[laneKey];
      if (!lane) return;

      // Get progression stats
      lane
        .filter((t) => !t.ultimate)
        .forEach((talent) => {
          if (!talent.stats) return;
          Object.keys(talent.stats).forEach((stat) => {
            totalStats[stat] = (totalStats[stat] || 0) + talent.stats[stat];
          });
        });

      // Get equipped bonus
      const ultimate = lane.find((t) => t.ultimate);
      if (ultimate && ultimate.equippedBonus) {
        Object.keys(ultimate.equippedBonus).forEach((stat) => {
          totalStats[stat] =
            (totalStats[stat] || 0) + ultimate.equippedBonus[stat];
        });
      }
    });

    return totalStats;
  };

  // Expose lanes
  AutoSkillExpansion.NEW_AUTO_LANES = NEW_AUTO_LANES;
  AutoSkillExpansion.LANE_KEYS = Object.keys(NEW_AUTO_LANES);

  return AutoSkillExpansion;
});
