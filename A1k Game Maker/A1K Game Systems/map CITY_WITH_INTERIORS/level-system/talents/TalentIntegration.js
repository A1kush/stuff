/**
 * TalentIntegration.js - Bridge to talent-store-system
 * @version 1.0.0
 * @description Import existing 59 talents, manage equipment slots, calculate bonuses
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.TalentIntegration = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // TALENT INTEGRATION CLASS
  // ============================

  class TalentIntegration {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          maxEquipSlots: 3, // Can equip up to 3 auto-skills
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Character ID -> Talent Data */
      this.characterTalents = new Map();

      /** @type {Map<string, Array>} Character ID -> Equipped Skills */
      this.equippedSkills = new Map();

      // Event bus integration
      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);

      // Reference to external talent store system (if available)
      this.talentStore = null;

      this.initialized = false;
    }

    /**
     * Initialize the talent integration
     * @param {Object} options - Options {talentStore: external system}
     */
    init(options = {}) {
      if (this.initialized) {
        console.warn("[TalentIntegration] Already initialized");
        return this;
      }

      // Try to find existing talent store system
      if (options.talentStore) {
        this.talentStore = options.talentStore;
      } else if (typeof window !== "undefined") {
        // Try window.TalentController or window.talentController
        this.talentStore = window.TalentController || window.talentController;
      }

      this.initialized = true;
      this._emit("talent:ready", { hasTalentStore: !!this.talentStore });

      if (this.options.debug) {
        console.log("[TalentIntegration] Initialized", {
          hasTalentStore: !!this.talentStore,
          maxEquipSlots: this.options.maxEquipSlots,
        });
      }

      return this;
    }

    /**
     * Import talents from talent-store-system for a character
     * @param {string} characterId - Character ID
     * @returns {Object} Talent data
     */
    importTalentStore(characterId) {
      if (!this.talentStore) {
        if (this.options.debug) {
          console.warn("[TalentIntegration] Talent store not available");
        }
        return this._createEmptyTalentData(characterId);
      }

      // Get purchased talents from store
      const purchased = this._getPurchasedTalents();
      const equipped = this._getEquippedSkills();

      const talentData = {
        characterId,
        purchased: purchased,
        equipped: equipped,
        ap: this._getAP(),
        totalAP: this._getTotalAP(),
        stats: this._calculateTalentStats(purchased, equipped),
      };

      this.characterTalents.set(characterId, talentData);
      this.equippedSkills.set(characterId, equipped);

      this._emit("talent:imported", { characterId, talentData });

      return talentData;
    }

    /**
     * Get active talents for a character
     * @param {string} characterId - Character ID
     * @returns {Object} Active talent data
     */
    getActiveTalents(characterId) {
      let talentData = this.characterTalents.get(characterId);

      if (!talentData) {
        // Try to import from talent store
        talentData = this.importTalentStore(characterId);
      }

      return talentData;
    }

    /**
     * Get equipped skills for a character
     * @param {string} characterId - Character ID
     * @returns {Array} Equipped skill IDs
     */
    getEquippedSkills(characterId) {
      return this.equippedSkills.get(characterId) || [];
    }

    /**
     * Equip a skill to a slot
     * @param {string} characterId - Character ID
     * @param {string} skillId - Skill/talent ID
     * @param {number} slot - Slot index (0-2)
     * @returns {boolean} Success
     */
    equipSkill(characterId, skillId, slot = 0) {
      if (slot < 0 || slot >= this.options.maxEquipSlots) {
        console.error(`[TalentIntegration] Invalid slot: ${slot}`);
        return false;
      }

      const equipped = this.equippedSkills.get(characterId) || [];

      // Ensure array is large enough
      while (equipped.length <= slot) {
        equipped.push(null);
      }

      // Check if skill is purchased
      const talentData = this.getActiveTalents(characterId);
      if (!talentData.purchased[skillId]) {
        console.error(`[TalentIntegration] Skill not purchased: ${skillId}`);
        return false;
      }

      equipped[slot] = skillId;
      this.equippedSkills.set(characterId, equipped);

      // Recalculate stats
      talentData.stats = this._calculateTalentStats(
        talentData.purchased,
        equipped
      );
      this.characterTalents.set(characterId, talentData);

      this._emit("skill:equipped", { characterId, skillId, slot });

      if (this.options.debug) {
        console.log(
          `[TalentIntegration] Equipped ${skillId} to slot ${slot} for ${characterId}`
        );
      }

      return true;
    }

    /**
     * Unequip a skill from a slot
     * @param {string} characterId - Character ID
     * @param {number} slot - Slot index
     * @returns {boolean} Success
     */
    unequipSkill(characterId, slot) {
      const equipped = this.equippedSkills.get(characterId);
      if (!equipped || slot < 0 || slot >= equipped.length) {
        return false;
      }

      const removed = equipped[slot];
      equipped[slot] = null;

      // Recalculate stats
      const talentData = this.getActiveTalents(characterId);
      talentData.stats = this._calculateTalentStats(
        talentData.purchased,
        equipped
      );
      this.characterTalents.set(characterId, talentData);

      this._emit("skill:unequipped", { characterId, skillId: removed, slot });

      return true;
    }

    /**
     * Calculate total talent bonuses for a character
     * @param {string} characterId - Character ID
     * @returns {Object} Stat bonuses
     */
    calculateTalentBonuses(characterId) {
      const talentData = this.getActiveTalents(characterId);
      return { ...talentData.stats };
    }

    /**
     * Check if a talent is purchased
     * @param {string} characterId - Character ID
     * @param {string} talentId - Talent ID
     * @returns {boolean}
     */
    hasTalent(characterId, talentId) {
      const talentData = this.getActiveTalents(characterId);
      return !!talentData.purchased[talentId];
    }

    /**
     * Check if character has dual wielding unlocked
     * @param {string} characterId - Character ID
     * @returns {boolean}
     */
    hasDualWielding(characterId) {
      // Check for dual wielding talent (from cooldown lane)
      return (
        this.hasTalent(characterId, "dual_wield") ||
        this.hasTalent(characterId, "cd_dual_wield")
      );
    }

    /**
     * Get available equipment slots for character
     * @param {string} characterId - Character ID
     * @returns {number} Number of slots
     */
    getAvailableSlots(characterId) {
      // 1 slot by default, +1 if dual wielding, +1 if triple wielding (future)
      let slots = 1;

      if (this.hasDualWielding(characterId)) {
        slots = 2;
      }

      // Check for triple wielding (SSS+ tier)
      if (this.hasTalent(characterId, "triple_wield")) {
        slots = 3;
      }

      return Math.min(slots, this.options.maxEquipSlots);
    }

    /**
     * Serialize talent data for saving
     * @returns {Object}
     */
    serialize() {
      const data = {};

      for (const [characterId, talentData] of this.characterTalents) {
        data[characterId] = {
          purchased: talentData.purchased,
          equipped: this.equippedSkills.get(characterId) || [],
          ap: talentData.ap,
          totalAP: talentData.totalAP,
        };
      }

      return data;
    }

    /**
     * Deserialize and load talent data
     * @param {Object} data - Serialized data
     */
    deserialize(data) {
      if (!data || typeof data !== "object") {
        console.error("[TalentIntegration] Invalid deserialization data");
        return;
      }

      this.characterTalents.clear();
      this.equippedSkills.clear();

      Object.keys(data).forEach((characterId) => {
        const charData = data[characterId];

        const talentData = {
          characterId,
          purchased: charData.purchased || {},
          equipped: charData.equipped || [],
          ap: charData.ap || 0,
          totalAP: charData.totalAP || 0,
          stats: {},
        };

        // Recalculate stats
        talentData.stats = this._calculateTalentStats(
          talentData.purchased,
          talentData.equipped
        );

        this.characterTalents.set(characterId, talentData);
        this.equippedSkills.set(characterId, talentData.equipped);
      });

      this._emit("talent:loaded", {
        characterCount: this.characterTalents.size,
      });
    }

    // ============================
    // PRIVATE METHODS
    // ============================

    /**
     * Get purchased talents from talent store
     * @private
     */
    _getPurchasedTalents() {
      if (!this.talentStore) return {};

      // Try different API methods
      if (typeof this.talentStore.getPurchased === "function") {
        return this.talentStore.getPurchased();
      }

      if (typeof this.talentStore.getPurchasedTalents === "function") {
        return this.talentStore.getPurchasedTalents();
      }

      // Try accessing purchased property directly
      if (this.talentStore.purchased) {
        return { ...this.talentStore.purchased };
      }

      return {};
    }

    /**
     * Get equipped skills from talent store
     * @private
     */
    _getEquippedSkills() {
      if (!this.talentStore) return [];

      // Try different API methods
      if (typeof this.talentStore.getEquipped === "function") {
        return this.talentStore.getEquipped();
      }

      if (typeof this.talentStore.getEquippedSkills === "function") {
        return this.talentStore.getEquippedSkills();
      }

      // Try accessing equipped property directly
      if (Array.isArray(this.talentStore.equipped)) {
        return [...this.talentStore.equipped];
      }

      return [];
    }

    /**
     * Get current AP from talent store
     * @private
     */
    _getAP() {
      if (!this.talentStore) return 0;

      if (typeof this.talentStore.getAP === "function") {
        return this.talentStore.getAP();
      }

      return this.talentStore.ap || 0;
    }

    /**
     * Get total AP earned from talent store
     * @private
     */
    _getTotalAP() {
      if (!this.talentStore) return 0;

      if (typeof this.talentStore.getTotalAP === "function") {
        return this.talentStore.getTotalAP();
      }

      return this.talentStore.totalAP || 0;
    }

    /**
     * Calculate stat bonuses from talents
     * @private
     */
    _calculateTalentStats(purchased, equipped) {
      const stats = {
        atkMul: 0,
        defMul: 0,
        spdMul: 0,
        magMul: 0,
        hp: 0,
        mp: 0,
        crt: 0,
        lifesteal: 0,
        cdr: 0,
      };

      // Get all talent definitions
      const talentDefs = this._getTalentDefinitions();

      // Apply progression bonuses (from purchased talents)
      Object.keys(purchased).forEach((talentId) => {
        const talent = talentDefs[talentId];
        if (!talent) return;

        // Apply stat bonuses from progression
        if (talent.stats) {
          Object.keys(talent.stats).forEach((stat) => {
            stats[stat] = (stats[stat] || 0) + talent.stats[stat];
          });
        }
      });

      // Apply equipped skill bonuses (ultimate bonuses)
      equipped.forEach((skillId) => {
        if (!skillId) return;

        const talent = talentDefs[skillId];
        if (!talent || !talent.equippedBonus) return;

        // Apply equipped bonuses
        Object.keys(talent.equippedBonus).forEach((stat) => {
          stats[stat] = (stats[stat] || 0) + talent.equippedBonus[stat];
        });
      });

      return stats;
    }

    /**
     * Get talent definitions from talent store
     * @private
     */
    _getTalentDefinitions() {
      if (!this.talentStore) return {};

      // Try to get talent registry
      if (this.talentStore.registry) {
        return { ...this.talentStore.registry };
      }

      if (this.talentStore.talents) {
        return { ...this.talentStore.talents };
      }

      // Check window scope
      if (typeof window !== "undefined" && window.TALENT_LANES) {
        // Flatten talent lanes into single object
        const talents = {};
        Object.values(window.TALENT_LANES).forEach((lane) => {
          if (Array.isArray(lane)) {
            lane.forEach((talent) => {
              talents[talent.id] = talent;
            });
          }
        });
        return talents;
      }

      return {};
    }

    /**
     * Create empty talent data
     * @private
     */
    _createEmptyTalentData(characterId) {
      return {
        characterId,
        purchased: {},
        equipped: [],
        ap: 0,
        totalAP: 0,
        stats: {},
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
          console.error("[TalentIntegration] Event emit failed:", err);
        }
      }
    }
  }

  return TalentIntegration;
});
