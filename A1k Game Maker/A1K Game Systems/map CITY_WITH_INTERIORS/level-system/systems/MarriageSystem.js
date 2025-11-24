/**
 * MarriageSystem.js - Marriage & Relationship System
 * @version 1.0.0
 * @description Player marriage, relationship levels, couple bonuses, ceremonies
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.MarriageSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // RELATIONSHIP LEVELS (10 Tiers)
  // ============================

  const RELATIONSHIP_LEVELS = {
    1: {
      level: 1,
      name: "Acquaintances",
      icon: "👋",
      requiredAffection: 0,
      bonuses: {},
    },
    2: {
      level: 2,
      name: "Friends",
      icon: "🤝",
      requiredAffection: 100,
      bonuses: { xp: 1.05 },
    },
    3: {
      level: 3,
      name: "Good Friends",
      icon: "😊",
      requiredAffection: 500,
      bonuses: { xp: 1.1, gold: 1.05 },
    },
    4: {
      level: 4,
      name: "Close Friends",
      icon: "🥰",
      requiredAffection: 1500,
      bonuses: { xp: 1.15, gold: 1.1, all_stats: 10 },
    },
    5: {
      level: 5,
      name: "Best Friends",
      icon: "💖",
      requiredAffection: 5000,
      bonuses: { xp: 1.2, gold: 1.15, all_stats: 20 },
    },
    6: {
      level: 6,
      name: "Romantic Interest",
      icon: "💕",
      requiredAffection: 10000,
      bonuses: { xp: 1.25, gold: 1.2, all_stats: 30, luk: 10 },
    },
    7: {
      level: 7,
      name: "Dating",
      icon: "💑",
      requiredAffection: 25000,
      bonuses: { xp: 1.3, gold: 1.25, all_stats: 50, luk: 20 },
    },
    8: {
      level: 8,
      name: "Engaged",
      icon: "💍",
      requiredAffection: 50000,
      bonuses: { xp: 1.4, gold: 1.35, all_stats: 75, luk: 30 },
    },
    9: {
      level: 9,
      name: "Married",
      icon: "👰",
      requiredAffection: 100000,
      bonuses: { xp: 1.5, gold: 1.5, all_stats: 100, luk: 50 },
    },
    10: {
      level: 10,
      name: "Soulmates",
      icon: "💖",
      requiredAffection: 500000,
      bonuses: { xp: 2.0, gold: 2.0, all_stats: 200, luk: 100 },
    },
  };

  // ============================
  // COUPLE SKILLS (15 Skills)
  // ============================

  const COUPLE_SKILLS = {
    power_couple: {
      id: "power_couple",
      name: "Power Couple",
      description: "+20% damage when together",
      requiredLevel: 3,
      effect: { damage_bonus: 1.2 },
    },
    soul_link: {
      id: "soul_link",
      name: "Soul Link",
      description: "Share 50% of damage taken",
      requiredLevel: 5,
      effect: { damage_share: 0.5 },
    },
    love_heal: {
      id: "love_heal",
      name: "Love's Embrace",
      description: "Heal partner for 30% of damage dealt",
      requiredLevel: 4,
      effect: { partner_heal: 0.3 },
    },
    combo_boost: {
      id: "combo_boost",
      name: "Combo Boost",
      description: "+50% combo damage",
      requiredLevel: 6,
      effect: { combo_damage: 1.5 },
    },
    shared_loot: {
      id: "shared_loot",
      name: "Shared Fortune",
      description: "Both get loot from kills",
      requiredLevel: 7,
      effect: { shared_loot: true },
    },
    resurrection: {
      id: "resurrection",
      name: "True Love's Kiss",
      description: "Revive partner once per day",
      requiredLevel: 9,
      effect: { revive_daily: true },
    },
    teleport_to_partner: {
      id: "teleport_to_partner",
      name: "Heart's Call",
      description: "Teleport to partner anywhere",
      requiredLevel: 8,
      effect: { teleport: true },
    },
    xp_share: {
      id: "xp_share",
      name: "Growth Together",
      description: "Share 25% XP gains",
      requiredLevel: 4,
      effect: { xp_share: 0.25 },
    },
    sync_attack: {
      id: "sync_attack",
      name: "Synchronized Strike",
      description: "Attack together for 2x damage",
      requiredLevel: 7,
      effect: { sync_damage: 2.0 },
    },
    protective_bond: {
      id: "protective_bond",
      name: "Protective Bond",
      description: "+30% defense when near partner",
      requiredLevel: 5,
      effect: { def_near: 1.3 },
    },
    mana_link: {
      id: "mana_link",
      name: "Mana Link",
      description: "Share mana pool",
      requiredLevel: 6,
      effect: { shared_mana: true },
    },
    double_drop: {
      id: "double_drop",
      name: "Lucky Pair",
      description: "2x drop rate when together",
      requiredLevel: 8,
      effect: { drop_rate: 2.0 },
    },
    ultimate_combo: {
      id: "ultimate_combo",
      name: "Ultimate Combination",
      description: "Combine ultimates for 5x power",
      requiredLevel: 10,
      effect: { ultimate_combo: 5.0 },
    },
    immortal_bond: {
      id: "immortal_bond",
      name: "Immortal Bond",
      description: "Cannot die while partner is alive",
      requiredLevel: 10,
      effect: { immortal_bond: true },
    },
    soulmate_aura: {
      id: "soulmate_aura",
      name: "Soulmate Aura",
      description: "+100% all bonuses",
      requiredLevel: 10,
      effect: { all_bonuses: 2.0 },
    },
  };

  // ============================
  // MARRIAGE SYSTEM CLASS
  // ============================

  class MarriageSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          engagementCost: 50000,
          weddingCost: 500000,
          divorceCost: 1000000,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Player ID -> Relationship data */
      this.relationships = new Map();

      /** @type {Map<string, string>} Player ID -> Partner ID */
      this.marriages = new Map();

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("marriage:ready");

      return this;
    }

    /**
     * Propose marriage
     * @param {string} proposerId - Proposer ID
     * @param {string} partnerId - Partner ID
     * @returns {Object} Proposal data
     */
    propose(proposerId, partnerId) {
      if (this.marriages.has(proposerId) || this.marriages.has(partnerId)) {
        return { error: "Already married" };
      }

      const relationshipKey = this._getRelationshipKey(proposerId, partnerId);
      const relationship =
        this.relationships.get(relationshipKey) ||
        this._createRelationship(proposerId, partnerId);

      if (relationship.affection < 10000) {
        return { error: "Not enough affection (need 10,000)" };
      }

      relationship.status = "engaged";
      relationship.engagedAt = Date.now();

      this._emit("marriage:engaged", { proposerId, partnerId, relationship });

      return relationship;
    }

    /**
     * Hold wedding ceremony
     * @param {string} player1Id - Player 1 ID
     * @param {string} player2Id - Player 2 ID
     * @returns {Object} Marriage data
     */
    marry(player1Id, player2Id) {
      const relationshipKey = this._getRelationshipKey(player1Id, player2Id);
      const relationship = this.relationships.get(relationshipKey);

      if (!relationship || relationship.status !== "engaged") {
        return { error: "Must be engaged first" };
      }

      relationship.status = "married";
      relationship.marriedAt = Date.now();

      this.marriages.set(player1Id, player2Id);
      this.marriages.set(player2Id, player1Id);

      this._emit("marriage:married", { player1Id, player2Id, relationship });

      return relationship;
    }

    /**
     * Add affection points
     * @param {string} player1Id - Player 1 ID
     * @param {string} player2Id - Player 2 ID
     * @param {number} amount - Affection amount
     * @returns {Object} Relationship
     */
    addAffection(player1Id, player2Id, amount) {
      const relationshipKey = this._getRelationshipKey(player1Id, player2Id);
      const relationship =
        this.relationships.get(relationshipKey) ||
        this._createRelationship(player1Id, player2Id);

      relationship.affection += amount;

      // Update level
      const newLevel = this._getRelationshipLevel(relationship.affection);

      if (newLevel > relationship.level) {
        relationship.level = newLevel;

        this._emit("relationship:level_up", {
          player1Id,
          player2Id,
          level: newLevel,
        });
      }

      return relationship;
    }

    /**
     * Get relationship bonuses
     * @param {string} playerId - Player ID
     * @returns {Object} Bonuses
     */
    getCoupleBonuses(playerId) {
      const partnerId = this.marriages.get(playerId);
      if (!partnerId) return {};

      const relationshipKey = this._getRelationshipKey(playerId, partnerId);
      const relationship = this.relationships.get(relationshipKey);

      if (!relationship) return {};

      const level = RELATIONSHIP_LEVELS[relationship.level];

      return level ? level.bonuses : {};
    }

    /**
     * Get available couple skills
     * @param {string} playerId - Player ID
     * @returns {Array} Skills
     */
    getCoupleSkills(playerId) {
      const partnerId = this.marriages.get(playerId);
      if (!partnerId) return [];

      const relationshipKey = this._getRelationshipKey(playerId, partnerId);
      const relationship = this.relationships.get(relationshipKey);

      if (!relationship) return [];

      return Object.values(COUPLE_SKILLS).filter(
        (skill) => skill.requiredLevel <= relationship.level
      );
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        relationships: Array.from(this.relationships.entries()),
        marriages: Array.from(this.marriages.entries()),
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.relationships.clear();
      if (data.relationships) {
        data.relationships.forEach(([key, rel]) => {
          this.relationships.set(key, rel);
        });
      }

      this.marriages.clear();
      if (data.marriages) {
        data.marriages.forEach(([playerId, partnerId]) => {
          this.marriages.set(playerId, partnerId);
        });
      }

      this._emit("marriage:loaded");
    }

    // Private methods
    _getRelationshipKey(player1Id, player2Id) {
      return [player1Id, player2Id].sort().join("_");
    }

    _createRelationship(player1Id, player2Id) {
      const relationshipKey = this._getRelationshipKey(player1Id, player2Id);

      const relationship = {
        player1: player1Id,
        player2: player2Id,
        affection: 0,
        level: 1,
        status: "friends",
        createdAt: Date.now(),
      };

      this.relationships.set(relationshipKey, relationship);

      return relationship;
    }

    _getRelationshipLevel(affection) {
      for (let i = 10; i >= 1; i--) {
        const levelData = RELATIONSHIP_LEVELS[i];
        if (affection >= levelData.requiredAffection) {
          return i;
        }
      }
      return 1;
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[MarriageSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  MarriageSystem.RELATIONSHIP_LEVELS = RELATIONSHIP_LEVELS;
  MarriageSystem.COUPLE_SKILLS = COUPLE_SKILLS;

  return MarriageSystem;
});

