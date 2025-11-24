/**
 * FarmingSystem.js - Crop Growing & Harvesting
 * @version 1.0.0
 * @description Plant crops, water, harvest, sell produce
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.FarmingSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // CROPS (30 Types)
  // ============================

  const CROPS = {
    // Common Crops (10)
    wheat: {
      id: "wheat",
      name: "Wheat",
      rarity: "common",
      icon: "🌾",
      growTime: 1800000, // 30 min
      seedCost: 10,
      sellPrice: 30,
      xp: 5,
      waterNeeded: 3,
    },
    carrot: {
      id: "carrot",
      name: "Carrot",
      rarity: "common",
      icon: "🥕",
      growTime: 2400000, // 40 min
      seedCost: 15,
      sellPrice: 45,
      xp: 8,
      waterNeeded: 4,
    },
    potato: {
      id: "potato",
      name: "Potato",
      rarity: "common",
      icon: "🥔",
      growTime: 3000000, // 50 min
      seedCost: 12,
      sellPrice: 40,
      xp: 7,
      waterNeeded: 4,
    },
    tomato: {
      id: "tomato",
      name: "Tomato",
      rarity: "common",
      icon: "🍅",
      growTime: 3600000, // 1 hr
      seedCost: 20,
      sellPrice: 60,
      xp: 10,
      waterNeeded: 5,
    },
    corn: {
      id: "corn",
      name: "Corn",
      rarity: "common",
      icon: "🌽",
      growTime: 4200000, // 70 min
      seedCost: 25,
      sellPrice: 80,
      xp: 12,
      waterNeeded: 5,
    },
    lettuce: {
      id: "lettuce",
      name: "Lettuce",
      rarity: "common",
      icon: "🥬",
      growTime: 1800000,
      seedCost: 8,
      sellPrice: 25,
      xp: 4,
      waterNeeded: 3,
    },
    cabbage: {
      id: "cabbage",
      name: "Cabbage",
      rarity: "common",
      icon: "🥬",
      growTime: 3000000,
      seedCost: 15,
      sellPrice: 50,
      xp: 9,
      waterNeeded: 4,
    },
    pumpkin: {
      id: "pumpkin",
      name: "Pumpkin",
      rarity: "uncommon",
      icon: "🎃",
      growTime: 7200000, // 2 hrs
      seedCost: 50,
      sellPrice: 200,
      xp: 25,
      waterNeeded: 8,
    },
    strawberry: {
      id: "strawberry",
      name: "Strawberry",
      rarity: "uncommon",
      icon: "🍓",
      growTime: 3600000,
      seedCost: 30,
      sellPrice: 100,
      xp: 15,
      waterNeeded: 5,
    },
    watermelon: {
      id: "watermelon",
      name: "Watermelon",
      rarity: "uncommon",
      icon: "🍉",
      growTime: 5400000, // 90 min
      seedCost: 40,
      sellPrice: 150,
      xp: 20,
      waterNeeded: 10,
    },

    // Rare Crops (10)
    golden_wheat: {
      id: "golden_wheat",
      name: "Golden Wheat",
      rarity: "rare",
      icon: "🌾✨",
      growTime: 7200000,
      seedCost: 200,
      sellPrice: 1000,
      xp: 100,
      waterNeeded: 10,
    },
    magic_mushroom: {
      id: "magic_mushroom",
      name: "Magic Mushroom",
      rarity: "rare",
      icon: "🍄",
      growTime: 10800000, // 3 hrs
      seedCost: 500,
      sellPrice: 2500,
      xp: 200,
      waterNeeded: 8,
    },
    crystal_flower: {
      id: "crystal_flower",
      name: "Crystal Flower",
      rarity: "epic",
      icon: "💎🌸",
      growTime: 14400000, // 4 hrs
      seedCost: 1000,
      sellPrice: 5000,
      xp: 400,
      waterNeeded: 15,
      special: "produces_crystal",
    },
    phoenix_herb: {
      id: "phoenix_herb",
      name: "Phoenix Herb",
      rarity: "epic",
      icon: "🔥🌿",
      growTime: 21600000, // 6 hrs
      seedCost: 2000,
      sellPrice: 10000,
      xp: 800,
      waterNeeded: 20,
      special: "fire_resistant",
    },
    moonflower: {
      id: "moonflower",
      name: "Moonflower",
      rarity: "legendary",
      icon: "🌙🌺",
      growTime: 43200000, // 12 hrs
      seedCost: 10000,
      sellPrice: 50000,
      xp: 2000,
      waterNeeded: 30,
      special: "grows_at_night",
    },
    world_tree_fruit: {
      id: "world_tree_fruit",
      name: "World Tree Fruit",
      rarity: "legendary",
      icon: "🌳🍎",
      growTime: 86400000, // 24 hrs
      seedCost: 50000,
      sellPrice: 250000,
      xp: 10000,
      waterNeeded: 50,
      special: "permanent_stat_boost",
    },
    dragon_fruit: {
      id: "dragon_fruit",
      name: "Dragon Fruit",
      rarity: "mythic",
      icon: "🐲🍇",
      growTime: 172800000, // 48 hrs
      seedCost: 100000,
      sellPrice: 1000000,
      xp: 50000,
      waterNeeded: 100,
      special: "summon_dragon",
    },
    star_berry: {
      id: "star_berry",
      name: "Star Berry",
      rarity: "divine",
      icon: "⭐🍓",
      growTime: 259200000, // 72 hrs
      seedCost: 500000,
      sellPrice: 5000000,
      xp: 250000,
      waterNeeded: 200,
      special: "grants_wish",
    },
    infinity_seed: {
      id: "infinity_seed",
      name: "Infinity Seed",
      rarity: "transcendent",
      icon: "♾️🌱",
      growTime: 604800000, // 7 days
      seedCost: 10000000,
      sellPrice: 100000000,
      xp: 1000000,
      waterNeeded: 999,
      special: "infinite_harvest",
    },
  };

  const CROP_KEYS = Object.keys(CROPS);

  // ============================
  // FARMING SYSTEM CLASS
  // ============================

  class FarmingSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          maxPlots: 9, // 3x3 grid
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Array>} Player ID -> Farm plots */
      this.playerFarms = new Map();

      /** @type {Object} Statistics */
      this.stats = {
        totalPlanted: 0,
        totalHarvested: 0,
        totalGoldEarned: 0,
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("farming:ready", { crops: CROP_KEYS.length });

      return this;
    }

    /**
     * Plant crop
     * @param {string} playerId - Player ID
     * @param {number} plotIndex - Plot index (0-8)
     * @param {string} cropId - Crop ID
     * @returns {Object} Plot data
     */
    plantCrop(playerId, plotIndex, cropId) {
      const crop = CROPS[cropId];
      if (!crop) return null;

      const farm = this.playerFarms.get(playerId) || Array(this.options.maxPlots).fill(null);

      if (plotIndex < 0 || plotIndex >= this.options.maxPlots) {
        return { error: "Invalid plot" };
      }

      if (farm[plotIndex] !== null) {
        return { error: "Plot occupied" };
      }

      const plot = {
        cropId,
        crop: crop.name,
        icon: crop.icon,
        plantedAt: Date.now(),
        harvestAt: Date.now() + crop.growTime,
        waterLevel: 0,
        waterNeeded: crop.waterNeeded,
        status: "growing",
      };

      farm[plotIndex] = plot;
      this.playerFarms.set(playerId, farm);

      this.stats.totalPlanted++;

      this._emit("crop:planted", { playerId, plotIndex, plot });

      return plot;
    }

    /**
     * Water crop
     * @param {string} playerId - Player ID
     * @param {number} plotIndex - Plot index
     * @returns {Object} Plot data
     */
    waterCrop(playerId, plotIndex) {
      const farm = this.playerFarms.get(playerId);
      if (!farm || !farm[plotIndex]) return null;

      const plot = farm[plotIndex];

      if (plot.status !== "growing") return null;

      plot.waterLevel = Math.min(plot.waterNeeded, plot.waterLevel + 1);

      // Speed up growth if well watered
      if (plot.waterLevel >= plot.waterNeeded) {
        const reduction = 0.1; // 10% faster
        const remaining = plot.harvestAt - Date.now();
        plot.harvestAt = Date.now() + remaining * (1 - reduction);
      }

      this._emit("crop:watered", { playerId, plotIndex, plot });

      return plot;
    }

    /**
     * Harvest crop
     * @param {string} playerId - Player ID
     * @param {number} plotIndex - Plot index
     * @returns {Object} Harvest result
     */
    harvestCrop(playerId, plotIndex) {
      const farm = this.playerFarms.get(playerId);
      if (!farm || !farm[plotIndex]) return null;

      const plot = farm[plotIndex];

      if (Date.now() < plot.harvestAt) {
        return { error: "Not ready yet" };
      }

      const crop = CROPS[plot.cropId];

      // Calculate harvest yield (1-3 based on watering)
      const waterBonus = plot.waterLevel / plot.waterNeeded;
      const harvestYield = Math.floor(1 + waterBonus * 2); // 1-3

      const harvest = {
        crop: plot.cropId,
        quantity: harvestYield,
        gold: crop.sellPrice * harvestYield,
        xp: crop.xp * harvestYield,
      };

      // Clear plot
      farm[plotIndex] = null;

      this.stats.totalHarvested++;
      this.stats.totalGoldEarned += harvest.gold;

      this._emit("crop:harvested", { playerId, plotIndex, harvest });

      return harvest;
    }

    /**
     * Get farm status
     * @param {string} playerId - Player ID
     * @returns {Array} Farm plots
     */
    getFarm(playerId) {
      return this.playerFarms.get(playerId) || Array(this.options.maxPlots).fill(null);
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        playerFarms: Array.from(this.playerFarms.entries()),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.playerFarms.clear();
      if (data.playerFarms) {
        data.playerFarms.forEach(([playerId, farm]) => {
          this.playerFarms.set(playerId, farm);
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("farming:loaded");
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[FarmingSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  FarmingSystem.CROPS = CROPS;
  FarmingSystem.CROP_KEYS = Object.keys(CROPS);

  return FarmingSystem;
});

