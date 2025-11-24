/**
 * LootSystem.js - 10-Tier Rarity System with Pity Mechanic
 * @version 1.0.0
 * @description Advanced loot with drop tables, luck, and pity counter
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.LootSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // RARITY TIERS (10 Tiers!)
  // ============================

  const RARITIES = {
    common: {
      id: "common",
      name: "Common",
      color: "#9e9e9e",
      dropChance: 0.5, // 50%
      statMultiplier: 1.0,
      icon: "⬜",
      pityIncrement: 1,
    },
    uncommon: {
      id: "uncommon",
      name: "Uncommon",
      color: "#4caf50",
      dropChance: 0.25, // 25%
      statMultiplier: 1.3,
      icon: "🟩",
      pityIncrement: 2,
    },
    rare: {
      id: "rare",
      name: "Rare",
      color: "#2196f3",
      dropChance: 0.15, // 15%
      statMultiplier: 1.7,
      icon: "🟦",
      pityIncrement: 5,
    },
    epic: {
      id: "epic",
      name: "Epic",
      color: "#9c27b0",
      dropChance: 0.06, // 6%
      statMultiplier: 2.5,
      icon: "🟪",
      pityIncrement: 10,
    },
    legendary: {
      id: "legendary",
      name: "Legendary",
      color: "#ff9800",
      dropChance: 0.03, // 3%
      statMultiplier: 4.0,
      icon: "🟧",
      pityIncrement: 20,
    },
    mythic: {
      id: "mythic",
      name: "Mythic",
      color: "#f44336",
      dropChance: 0.008, // 0.8%
      statMultiplier: 7.0,
      icon: "🟥",
      pityIncrement: 40,
    },
    ancient: {
      id: "ancient",
      name: "Ancient",
      color: "#00bcd4",
      dropChance: 0.003, // 0.3%
      statMultiplier: 12.0,
      icon: "🔷",
      pityIncrement: 80,
    },
    divine: {
      id: "divine",
      name: "Divine",
      color: "#ffd700",
      dropChance: 0.001, // 0.1%
      statMultiplier: 20.0,
      icon: "⭐",
      pityIncrement: 150,
    },
    celestial: {
      id: "celestial",
      name: "Celestial",
      color: "#e1bee7",
      dropChance: 0.0003, // 0.03%
      statMultiplier: 35.0,
      icon: "💫",
      pityIncrement: 300,
    },
    transcendent: {
      id: "transcendent",
      name: "Transcendent",
      color: "#ff1744",
      dropChance: 0.0001, // 0.01%
      statMultiplier: 100.0,
      icon: "🌟",
      pityIncrement: 999,
    },
  };

  const RARITY_KEYS = Object.keys(RARITIES);

  // ============================
  // LOOT TABLES
  // ============================

  const LOOT_TABLES = {
    common_enemy: {
      id: "common_enemy",
      items: [
        { type: "gold", min: 10, max: 50 },
        { type: "equipment", chance: 0.3 },
      ],
    },
    elite_enemy: {
      id: "elite_enemy",
      items: [
        { type: "gold", min: 50, max: 200 },
        { type: "equipment", chance: 0.7, minRarity: "uncommon" },
      ],
    },
    boss: {
      id: "boss",
      items: [
        { type: "gold", min: 200, max: 1000 },
        { type: "equipment", chance: 1.0, minRarity: "rare" },
        { type: "ability_point", min: 1, max: 5 },
      ],
    },
    treasure_chest: {
      id: "treasure_chest",
      items: [
        { type: "gold", min: 100, max: 500 },
        { type: "equipment", chance: 0.8, minRarity: "uncommon" },
      ],
    },
    rare_chest: {
      id: "rare_chest",
      items: [
        { type: "gold", min: 500, max: 2000 },
        { type: "equipment", chance: 1.0, minRarity: "epic" },
        { type: "ability_point", min: 3, max: 10 },
      ],
    },
  };

  // ============================
  // LOOT SYSTEM CLASS
  // ============================

  class LootSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          baseLuck: 0,
          pityEnabled: true,
          pityThreshold: {
            rare: 20,
            epic: 50,
            legendary: 100,
            mythic: 250,
            ancient: 500,
            divine: 1000,
            celestial: 2000,
            transcendent: 5000,
          },
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, number>} Rarity -> Pity counter */
      this.pityCounters = new Map();

      /** @type {Array} Loot history */
      this.lootHistory = [];

      /** @type {Object} Statistics */
      this.stats = {
        totalDrops: 0,
        byRarity: {},
      };

      // Initialize pity counters
      RARITY_KEYS.forEach((rarity) => {
        this.pityCounters.set(rarity, 0);
        this.stats.byRarity[rarity] = 0;
      });

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("loot:ready");

      return this;
    }

    /**
     * Roll for loot from a table
     * @param {string} tableId - Loot table ID
     * @param {Object} options - Luck, level, etc.
     * @returns {Array} Loot items
     */
    rollLoot(tableId, options = {}) {
      const table = LOOT_TABLES[tableId];
      if (!table) return [];

      const luck = (options.luck || 0) + this.options.baseLuck;
      const results = [];

      table.items.forEach((item) => {
        // Check if item drops
        const dropChance = item.chance !== undefined ? item.chance : 1.0;
        const roll = Math.random();

        if (roll <= dropChance) {
          // Generate item
          let loot = null;

          switch (item.type) {
            case "gold":
              loot = this._generateGold(item, luck);
              break;
            case "equipment":
              loot = this._generateEquipment(item, luck, options.level);
              break;
            case "ability_point":
              loot = this._generateAP(item);
              break;
          }

          if (loot) {
            results.push(loot);
          }
        }
      });

      this._emit("loot:rolled", { tableId, results, luck });

      return results;
    }

    /**
     * Roll for rarity tier
     * @param {Object} options - Luck, min rarity, etc.
     * @returns {string} Rarity ID
     */
    rollRarity(options = {}) {
      const luck = (options.luck || 0) + this.options.baseLuck;
      const minRarity = options.minRarity || "common";
      const minIndex = RARITY_KEYS.indexOf(minRarity);

      // Apply luck bonus (1 luck = +0.5% to rare+ drops)
      const luckBonus = luck * 0.005;

      // Roll
      let roll = Math.random();

      // Check pity system
      if (this.options.pityEnabled) {
        const pityBonus = this._calculatePityBonus();
        roll -= pityBonus;
      }

      // Determine rarity (from highest to lowest)
      let selectedRarity = "common";
      let cumulative = 0;

      for (let i = RARITY_KEYS.length - 1; i >= minIndex; i--) {
        const rarity = RARITIES[RARITY_KEYS[i]];
        const adjustedChance = rarity.dropChance + (i >= 2 ? luckBonus : 0); // Only boost rare+

        cumulative += adjustedChance;

        if (roll <= cumulative) {
          selectedRarity = rarity.id;
          break;
        }
      }

      // Update pity counters
      this._updatePityCounters(selectedRarity);

      // Stats
      this.stats.totalDrops++;
      this.stats.byRarity[selectedRarity]++;

      this._emit("rarity:rolled", { rarity: selectedRarity, luck, roll });

      return selectedRarity;
    }

    /**
     * Get pity counter for a rarity
     * @param {string} rarity - Rarity ID
     * @returns {number}
     */
    getPityCounter(rarity) {
      return this.pityCounters.get(rarity) || 0;
    }

    /**
     * Reset pity counter
     * @param {string} rarity - Rarity ID
     */
    resetPityCounter(rarity) {
      this.pityCounters.set(rarity, 0);
      this._emit("pity:reset", { rarity });
    }

    /**
     * Get loot statistics
     * @returns {Object}
     */
    getStats() {
      return {
        ...this.stats,
        pityCounters: Object.fromEntries(this.pityCounters),
      };
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        pityCounters: Array.from(this.pityCounters.entries()),
        stats: this.stats,
        lootHistory: this.lootHistory.slice(-100), // Last 100 drops
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.pityCounters.clear();
      if (data.pityCounters) {
        data.pityCounters.forEach(([rarity, count]) => {
          this.pityCounters.set(rarity, count);
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      if (data.lootHistory) {
        this.lootHistory = data.lootHistory;
      }

      this._emit("loot:loaded", { stats: this.stats });
    }

    // Private methods
    _generateGold(item, luck) {
      const base = this._randomRange(item.min, item.max);
      const luckBonus = base * (luck * 0.01); // 1 luck = +1% gold
      const amount = Math.floor(base + luckBonus);

      return {
        type: "gold",
        amount,
        icon: "💰",
      };
    }

    _generateEquipment(item, luck, level = 1) {
      const rarity = this.rollRarity({
        luck,
        minRarity: item.minRarity || "common",
      });

      const rarityData = RARITIES[rarity];

      // Generate stats based on level and rarity
      const baseStats = {
        hp: Math.floor(10 * level * rarityData.statMultiplier),
        atk: Math.floor(5 * level * rarityData.statMultiplier),
        def: Math.floor(3 * level * rarityData.statMultiplier),
        spd: Math.floor(1 * level * rarityData.statMultiplier * 0.5),
      };

      // Random equipment slot
      const slots = ["weapon", "armor", "helmet", "boots", "accessory"];
      const slot = slots[Math.floor(Math.random() * slots.length)];

      const equipment = {
        type: "equipment",
        slot,
        rarity,
        level,
        stats: baseStats,
        name: `${rarityData.name} ${slot}`,
        icon: rarityData.icon,
        color: rarityData.color,
      };

      // Add to history
      this.lootHistory.push({
        ...equipment,
        timestamp: Date.now(),
      });

      this._emit("equipment:dropped", { equipment });

      return equipment;
    }

    _generateAP(item) {
      const amount = this._randomRange(item.min, item.max);

      return {
        type: "ability_point",
        amount,
        icon: "🌟",
      };
    }

    _calculatePityBonus() {
      // Pity bonus increases drop chance for rare+ based on counter
      let bonus = 0;

      for (const [rarity, threshold] of Object.entries(
        this.options.pityThreshold
      )) {
        const counter = this.pityCounters.get(rarity) || 0;

        if (counter >= threshold) {
          // Guarantee drop
          bonus += 1.0;
          break;
        } else if (counter > threshold * 0.5) {
          // Partial bonus
          bonus += (counter / threshold) * 0.1;
        }
      }

      return bonus;
    }

    _updatePityCounters(droppedRarity) {
      const droppedIndex = RARITY_KEYS.indexOf(droppedRarity);

      RARITY_KEYS.forEach((rarity, index) => {
        if (index <= droppedIndex) {
          // Reset pity for this and lower rarities
          this.pityCounters.set(rarity, 0);
        } else {
          // Increment pity for higher rarities
          const current = this.pityCounters.get(rarity) || 0;
          const increment = RARITIES[droppedRarity].pityIncrement || 1;
          this.pityCounters.set(rarity, current + increment);
        }
      });
    }

    _randomRange(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[LootSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  LootSystem.RARITIES = RARITIES;
  LootSystem.RARITY_KEYS = RARITY_KEYS;
  LootSystem.LOOT_TABLES = LOOT_TABLES;

  return LootSystem;
});
