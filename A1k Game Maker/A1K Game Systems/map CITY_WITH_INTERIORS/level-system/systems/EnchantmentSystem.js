/**
 * EnchantmentSystem.js - Equipment Enchanting & Upgrading
 * @version 1.0.0
 * @description Enhance equipment with enchantments, upgrades, and sockets
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.EnchantmentSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // ENCHANTMENTS (30 Types)
  // ============================

  const ENCHANTMENTS = {
    // Weapon Enchantments (10)
    sharpness: {
      id: "sharpness",
      name: "Sharpness",
      type: "weapon",
      maxLevel: 10,
      effect: { stat: "atk", perLevel: 5 },
      cost: [100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000],
    },
    fire_aspect: {
      id: "fire_aspect",
      name: "Fire Aspect",
      type: "weapon",
      maxLevel: 5,
      effect: { element: "fire", perLevel: 10 },
      cost: [500, 1250, 2500, 5000, 10000],
    },
    ice_edge: {
      id: "ice_edge",
      name: "Ice Edge",
      type: "weapon",
      maxLevel: 5,
      effect: { element: "ice", perLevel: 10 },
      cost: [500, 1250, 2500, 5000, 10000],
    },
    lightning_strike: {
      id: "lightning_strike",
      name: "Lightning Strike",
      type: "weapon",
      maxLevel: 5,
      effect: { element: "lightning", perLevel: 15 },
      cost: [750, 1875, 3750, 7500, 15000],
    },
    life_steal: {
      id: "life_steal",
      name: "Life Steal",
      type: "weapon",
      maxLevel: 5,
      effect: { lifesteal: true, perLevel: 0.02 },
      cost: [1000, 2500, 5000, 10000, 20000],
    },
    critical_edge: {
      id: "critical_edge",
      name: "Critical Edge",
      type: "weapon",
      maxLevel: 5,
      effect: { stat: "crt", perLevel: 0.03 },
      cost: [800, 2000, 4000, 8000, 16000],
    },
    knockback: {
      id: "knockback",
      name: "Knockback",
      type: "weapon",
      maxLevel: 3,
      effect: { knockback: true, perLevel: 1 },
      cost: [500, 1500, 4500],
    },
    soul_eater: {
      id: "soul_eater",
      name: "Soul Eater",
      type: "weapon",
      maxLevel: 3,
      effect: { soul_steal: true, perLevel: 5 },
      cost: [2000, 6000, 18000],
    },
    poison_blade: {
      id: "poison_blade",
      name: "Poison Blade",
      type: "weapon",
      maxLevel: 5,
      effect: { status: "poison", perLevel: 0.05 },
      cost: [600, 1500, 3000, 6000, 12000],
    },
    bleeding_edge: {
      id: "bleeding_edge",
      name: "Bleeding Edge",
      type: "weapon",
      maxLevel: 5,
      effect: { status: "bleed", perLevel: 0.05 },
      cost: [600, 1500, 3000, 6000, 12000],
    },

    // Armor Enchantments (10)
    protection: {
      id: "protection",
      name: "Protection",
      type: "armor",
      maxLevel: 10,
      effect: { stat: "def", perLevel: 5 },
      cost: [100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000],
    },
    vitality: {
      id: "vitality",
      name: "Vitality",
      type: "armor",
      maxLevel: 10,
      effect: { stat: "hp", perLevel: 50 },
      cost: [150, 375, 750, 1500, 3000, 6000, 12000, 24000, 48000, 96000],
    },
    fire_resistance: {
      id: "fire_resistance",
      name: "Fire Resistance",
      type: "armor",
      maxLevel: 5,
      effect: { resistance: "fire", perLevel: 0.05 },
      cost: [500, 1250, 2500, 5000, 10000],
    },
    ice_resistance: {
      id: "ice_resistance",
      name: "Ice Resistance",
      type: "armor",
      maxLevel: 5,
      effect: { resistance: "ice", perLevel: 0.05 },
      cost: [500, 1250, 2500, 5000, 10000],
    },
    thorns: {
      id: "thorns",
      name: "Thorns",
      type: "armor",
      maxLevel: 5,
      effect: { reflect: true, perLevel: 0.05 },
      cost: [1000, 2500, 5000, 10000, 20000],
    },
    regeneration: {
      id: "regeneration",
      name: "Regeneration",
      type: "armor",
      maxLevel: 5,
      effect: { regen: true, perLevel: 10 },
      cost: [1200, 3000, 6000, 12000, 24000],
    },
    fortitude: {
      id: "fortitude",
      name: "Fortitude",
      type: "armor",
      maxLevel: 5,
      effect: { stat: "vit", perLevel: 10 },
      cost: [800, 2000, 4000, 8000, 16000],
    },
    magic_shield: {
      id: "magic_shield",
      name: "Magic Shield",
      type: "armor",
      maxLevel: 5,
      effect: { stat: "res", perLevel: 5 },
      cost: [700, 1750, 3500, 7000, 14000],
    },
    feather_fall: {
      id: "feather_fall",
      name: "Feather Fall",
      type: "armor",
      maxLevel: 3,
      effect: { no_fall_damage: true, perLevel: 1 },
      cost: [500, 1500, 4500],
    },
    indestructible: {
      id: "indestructible",
      name: "Indestructible",
      type: "armor",
      maxLevel: 1,
      effect: { no_durability_loss: true, perLevel: 1 },
      cost: [50000],
    },

    // Accessory Enchantments (10)
    wisdom: {
      id: "wisdom",
      name: "Wisdom",
      type: "accessory",
      maxLevel: 5,
      effect: { stat: "wis", perLevel: 10 },
      cost: [600, 1500, 3000, 6000, 12000],
    },
    intelligence: {
      id: "intelligence",
      name: "Intelligence",
      type: "accessory",
      maxLevel: 5,
      effect: { stat: "int", perLevel: 10 },
      cost: [600, 1500, 3000, 6000, 12000],
    },
    dexterity: {
      id: "dexterity",
      name: "Dexterity",
      type: "accessory",
      maxLevel: 5,
      effect: { stat: "dex", perLevel: 10 },
      cost: [600, 1500, 3000, 6000, 12000],
    },
    fortune: {
      id: "fortune",
      name: "Fortune",
      type: "accessory",
      maxLevel: 10,
      effect: { stat: "luk", perLevel: 5 },
      cost: [1000, 2500, 5000, 10000, 20000, 40000, 80000, 160000, 320000, 640000],
    },
    soul_bound: {
      id: "soul_bound",
      name: "Soul Bound",
      type: "accessory",
      maxLevel: 1,
      effect: { keep_on_death: true, perLevel: 1 },
      cost: [100000],
    },
    experience: {
      id: "experience",
      name: "Experience",
      type: "accessory",
      maxLevel: 5,
      effect: { xp_boost: true, perLevel: 0.1 },
      cost: [2000, 5000, 10000, 20000, 40000],
    },
    treasure_hunter: {
      id: "treasure_hunter",
      name: "Treasure Hunter",
      type: "accessory",
      maxLevel: 5,
      effect: { rare_boost: true, perLevel: 0.05 },
      cost: [2500, 6250, 12500, 25000, 50000],
    },
    magic_find: {
      id: "magic_find",
      name: "Magic Find",
      type: "accessory",
      maxLevel: 5,
      effect: { magic_find: true, perLevel: 0.1 },
      cost: [3000, 7500, 15000, 30000, 60000],
    },
    speed_demon: {
      id: "speed_demon",
      name: "Speed Demon",
      type: "accessory",
      maxLevel: 5,
      effect: { stat: "spd", perLevel: 15 },
      cost: [800, 2000, 4000, 8000, 16000],
    },
    mana_regen: {
      id: "mana_regen",
      name: "Mana Regeneration",
      type: "accessory",
      maxLevel: 5,
      effect: { mp_regen: true, perLevel: 5 },
      cost: [1000, 2500, 5000, 10000, 20000],
    },
  };

  const ENCHANTMENT_KEYS = Object.keys(ENCHANTMENTS);

  // ============================
  // UPGRADE SYSTEM
  // ============================

  const UPGRADE_TIERS = {
    0: { level: 0, bonus: 1.0, cost: 0, successRate: 1.0 },
    1: { level: 1, bonus: 1.1, cost: 1000, successRate: 0.95 },
    2: { level: 2, bonus: 1.2, cost: 2500, successRate: 0.9 },
    3: { level: 3, bonus: 1.3, cost: 5000, successRate: 0.85 },
    4: { level: 4, bonus: 1.4, cost: 10000, successRate: 0.8 },
    5: { level: 5, bonus: 1.5, cost: 20000, successRate: 0.75 },
    6: { level: 6, bonus: 1.6, cost: 40000, successRate: 0.7 },
    7: { level: 7, bonus: 1.7, cost: 80000, successRate: 0.65 },
    8: { level: 8, bonus: 1.8, cost: 160000, successRate: 0.6 },
    9: { level: 9, bonus: 1.9, cost: 320000, successRate: 0.55 },
    10: { level: 10, bonus: 2.0, cost: 640000, successRate: 0.5 },
  };

  // ============================
  // ENCHANTMENT SYSTEM CLASS
  // ============================

  class EnchantmentSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          maxEnchantments: 3,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Item ID -> Enchantments */
      this.enchantedItems = new Map();

      /** @type {Object} Statistics */
      this.stats = {
        totalEnchantments: 0,
        totalUpgrades: 0,
        failedUpgrades: 0,
        byEnchantment: {},
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("enchantment:ready");

      return this;
    }

    /**
     * Enchant an item
     * @param {string} itemId - Item ID
     * @param {string} enchantmentId - Enchantment ID
     * @param {number} level - Enchantment level
     * @returns {Object} Result
     */
    enchantItem(itemId, enchantmentId, level = 1) {
      const enchantment = ENCHANTMENTS[enchantmentId];
      if (!enchantment) return { success: false, error: "Invalid enchantment" };

      if (level > enchantment.maxLevel) {
        return { success: false, error: "Level too high" };
      }

      // Get or create item enchantments
      let itemData = this.enchantedItems.get(itemId);

      if (!itemData) {
        itemData = {
          itemId,
          enchantments: [],
          upgradeLevel: 0,
          sockets: [],
        };
        this.enchantedItems.set(itemId, itemData);
      }

      // Check enchantment limit
      if (itemData.enchantments.length >= this.options.maxEnchantments) {
        return { success: false, error: "Max enchantments reached" };
      }

      // Check if already has this enchantment
      if (itemData.enchantments.some((e) => e.id === enchantmentId)) {
        return { success: false, error: "Already has this enchantment" };
      }

      // Add enchantment
      itemData.enchantments.push({
        id: enchantmentId,
        level,
      });

      this.stats.totalEnchantments++;
      this.stats.byEnchantment[enchantmentId] =
        (this.stats.byEnchantment[enchantmentId] || 0) + 1;

      this._emit("item:enchanted", { itemId, enchantmentId, level });

      return { success: true, itemData };
    }

    /**
     * Upgrade item enhancement level
     * @param {string} itemId - Item ID
     * @param {boolean} safeMode - Prevent downgrade on fail
     * @returns {Object} Result
     */
    upgradeItem(itemId, safeMode = false) {
      const itemData = this.enchantedItems.get(itemId);

      if (!itemData) {
        return { success: false, error: "Item not enchanted" };
      }

      const currentLevel = itemData.upgradeLevel || 0;
      if (currentLevel >= 10) {
        return { success: false, error: "Max upgrade level" };
      }

      const nextTier = UPGRADE_TIERS[currentLevel + 1];
      const successRate = nextTier.successRate;

      const roll = Math.random();

      if (roll <= successRate) {
        // Success!
        itemData.upgradeLevel = currentLevel + 1;
        this.stats.totalUpgrades++;

        this._emit("item:upgraded", {
          itemId,
          level: itemData.upgradeLevel,
          bonus: nextTier.bonus,
        });

        return {
          success: true,
          level: itemData.upgradeLevel,
          bonus: nextTier.bonus,
        };
      } else {
        // Failed
        this.stats.failedUpgrades++;

        if (!safeMode && currentLevel > 0) {
          // Downgrade by 1
          itemData.upgradeLevel = currentLevel - 1;

          this._emit("item:downgraded", {
            itemId,
            level: itemData.upgradeLevel,
          });

          return { success: false, downgraded: true, level: itemData.upgradeLevel };
        }

        this._emit("item:upgrade_failed", { itemId });

        return { success: false, downgraded: false };
      }
    }

    /**
     * Add socket to item
     * @param {string} itemId - Item ID
     * @param {string} gemType - Gem type
     * @returns {boolean} Success
     */
    socketGem(itemId, gemType) {
      const itemData = this.enchantedItems.get(itemId);
      if (!itemData) return false;

      // Max 3 sockets
      if (itemData.sockets.length >= 3) return false;

      itemData.sockets.push({
        gemType,
        socketedAt: Date.now(),
      });

      this._emit("item:socketed", { itemId, gemType });

      return true;
    }

    /**
     * Get item bonuses from enchantments
     * @param {string} itemId - Item ID
     * @returns {Object} Total bonuses
     */
    getItemBonuses(itemId) {
      const itemData = this.enchantedItems.get(itemId);
      if (!itemData) return {};

      const bonuses = {
        stats: {},
        effects: [],
      };

      // Base upgrade bonus
      const upgradeTier = UPGRADE_TIERS[itemData.upgradeLevel || 0];
      const upgradeMultiplier = upgradeTier.bonus;

      // Enchantment bonuses
      itemData.enchantments.forEach((ench) => {
        const enchDef = ENCHANTMENTS[ench.id];
        if (!enchDef) return;

        const effect = enchDef.effect;
        const value = effect.perLevel * ench.level;

        if (effect.stat) {
          bonuses.stats[effect.stat] =
            (bonuses.stats[effect.stat] || 0) + value;
        } else {
          bonuses.effects.push({
            type: Object.keys(effect)[0],
            value: value,
          });
        }
      });

      // Apply upgrade multiplier to stats
      for (const stat in bonuses.stats) {
        bonuses.stats[stat] *= upgradeMultiplier;
      }

      bonuses.upgradeMultiplier = upgradeMultiplier;

      return bonuses;
    }

    /**
     * Remove enchantment
     * @param {string} itemId - Item ID
     * @param {string} enchantmentId - Enchantment ID
     * @returns {boolean} Success
     */
    removeEnchantment(itemId, enchantmentId) {
      const itemData = this.enchantedItems.get(itemId);
      if (!itemData) return false;

      itemData.enchantments = itemData.enchantments.filter(
        (e) => e.id !== enchantmentId
      );

      this._emit("enchantment:removed", { itemId, enchantmentId });

      return true;
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        enchantedItems: Array.from(this.enchantedItems.entries()),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.enchantedItems.clear();
      if (data.enchantedItems) {
        data.enchantedItems.forEach(([id, item]) => {
          this.enchantedItems.set(id, item);
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("enchantment:loaded");
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[EnchantmentSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  EnchantmentSystem.ENCHANTMENTS = ENCHANTMENTS;
  EnchantmentSystem.ENCHANTMENT_KEYS = ENCHANTMENT_KEYS;
  EnchantmentSystem.UPGRADE_TIERS = UPGRADE_TIERS;

  return EnchantmentSystem;
});

