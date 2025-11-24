/**
 * FishingSystem.js - Fishing & Aquatic Catching
 * @version 1.0.0
 * @description Cast rod, catch fish, rare catches, fishing tournaments
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.FishingSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // FISH TYPES (40 Species)
  // ============================

  const FISH_SPECIES = {
    // Common Fish (15)
    minnow: {
      id: "minnow",
      name: "Minnow",
      rarity: "common",
      icon: "🐟",
      catchRate: 0.5,
      sellPrice: 10,
      xp: 5,
      size: [5, 10],
    },
    trout: {
      id: "trout",
      name: "Trout",
      rarity: "common",
      icon: "🐟",
      catchRate: 0.35,
      sellPrice: 30,
      xp: 10,
      size: [15, 25],
    },
    bass: {
      id: "bass",
      name: "Bass",
      rarity: "common",
      icon: "🐟",
      catchRate: 0.3,
      sellPrice: 50,
      xp: 15,
      size: [20, 40],
    },
    salmon: {
      id: "salmon",
      name: "Salmon",
      rarity: "uncommon",
      icon: "🐟",
      catchRate: 0.2,
      sellPrice: 100,
      xp: 30,
      size: [40, 80],
    },
    tuna: {
      id: "tuna",
      name: "Tuna",
      rarity: "uncommon",
      icon: "🐟",
      catchRate: 0.15,
      sellPrice: 150,
      xp: 40,
      size: [60, 120],
    },
    squid: {
      id: "squid",
      name: "Squid",
      rarity: "uncommon",
      icon: "🦑",
      catchRate: 0.18,
      sellPrice: 120,
      xp: 35,
      size: [30, 60],
    },
    octopus: {
      id: "octopus",
      name: "Octopus",
      rarity: "rare",
      icon: "🐙",
      catchRate: 0.1,
      sellPrice: 300,
      xp: 80,
      size: [50, 100],
    },
    lobster: {
      id: "lobster",
      name: "Lobster",
      rarity: "rare",
      icon: "🦞",
      catchRate: 0.12,
      sellPrice: 250,
      xp: 70,
      size: [20, 40],
    },
    crab: {
      id: "crab",
      name: "Giant Crab",
      rarity: "rare",
      icon: "🦀",
      catchRate: 0.1,
      sellPrice: 280,
      xp: 75,
      size: [30, 60],
    },
    shark: {
      id: "shark",
      name: "Shark",
      rarity: "epic",
      icon: "🦈",
      catchRate: 0.05,
      sellPrice: 1000,
      xp: 200,
      size: [200, 400],
    },
    swordfish: {
      id: "swordfish",
      name: "Swordfish",
      rarity: "epic",
      icon: "🐟⚔️",
      catchRate: 0.06,
      sellPrice: 800,
      xp: 180,
      size: [150, 300],
    },
    whale: {
      id: "whale",
      name: "Whale",
      rarity: "legendary",
      icon: "🐋",
      catchRate: 0.02,
      sellPrice: 5000,
      xp: 1000,
      size: [1000, 2000],
    },
    dolphin: {
      id: "dolphin",
      name: "Magic Dolphin",
      rarity: "legendary",
      icon: "🐬✨",
      catchRate: 0.03,
      sellPrice: 3000,
      xp: 800,
      size: [150, 250],
      special: "grants_luck",
    },
    golden_fish: {
      id: "golden_fish",
      name: "Golden Fish",
      rarity: "legendary",
      icon: "🐟💛",
      catchRate: 0.01,
      sellPrice: 25000,
      xp: 5000,
      size: [10, 20],
      special: "grants_wish",
    },
    kraken_baby: {
      id: "kraken_baby",
      name: "Baby Kraken",
      rarity: "mythic",
      icon: "🦑",
      catchRate: 0.005,
      sellPrice: 100000,
      xp: 25000,
      size: [500, 1000],
      special: "becomes_pet",
    },

    // Legendary Fish (10)
    leviathan: {
      id: "leviathan",
      name: "Leviathan",
      rarity: "divine",
      icon: "🐋⚡",
      catchRate: 0.001,
      sellPrice: 1000000,
      xp: 500000,
      size: [5000, 10000],
      special: "legendary_pet",
    },
    void_fish: {
      id: "void_fish",
      name: "Void Fish",
      rarity: "mythic",
      icon: "🕳️🐟",
      catchRate: 0.002,
      sellPrice: 500000,
      xp: 100000,
      size: [100, 200],
      special: "void_essence",
    },
    phoenix_koi: {
      id: "phoenix_koi",
      name: "Phoenix Koi",
      rarity: "legendary",
      icon: "🔥🐟",
      catchRate: 0.015,
      sellPrice: 50000,
      xp: 10000,
      size: [50, 100],
      special: "fire_resistance",
    },
    ice_fish: {
      id: "ice_fish",
      name: "Ice Crystal Fish",
      rarity: "epic",
      icon: "❄️🐟",
      catchRate: 0.08,
      sellPrice: 5000,
      xp: 500,
      size: [30, 60],
      special: "freeze_effect",
    },
    electric_eel: {
      id: "electric_eel",
      name: "Electric Eel",
      rarity: "rare",
      icon: "⚡🐍",
      catchRate: 0.1,
      sellPrice: 400,
      xp: 100,
      size: [80, 150],
      special: "shock_damage",
    },
    anglerfish: {
      id: "anglerfish",
      name: "Deep Sea Anglerfish",
      rarity: "epic",
      icon: "🔦🐟",
      catchRate: 0.07,
      sellPrice: 1200,
      xp: 250,
      size: [100, 180],
      special: "light_source",
    },
    pufferfish: {
      id: "pufferfish",
      name: "Pufferfish",
      rarity: "uncommon",
      icon: "🐡",
      catchRate: 0.15,
      sellPrice: 180,
      xp: 50,
      size: [15, 30],
      special: "poison_ingredient",
    },
    jellyfish: {
      id: "jellyfish",
      name: "Jellyfish",
      rarity: "uncommon",
      icon: "🪼",
      catchRate: 0.18,
      sellPrice: 150,
      xp: 45,
      size: [20, 40],
      special: "regeneration",
    },
    starfish: {
      id: "starfish",
      name: "Starfish",
      rarity: "rare",
      icon: "⭐",
      catchRate: 0.12,
      sellPrice: 350,
      xp: 90,
      size: [10, 25],
      special: "luck_boost",
    },
    seahorse: {
      id: "seahorse",
      name: "Royal Seahorse",
      rarity: "epic",
      icon: "🐴🌊",
      catchRate: 0.08,
      sellPrice: 900,
      xp: 220,
      size: [15, 35],
      special: "speed_boost",
    },
  };

  const FISH_KEYS = Object.keys(FISH_SPECIES);

  // ============================
  // FISHING SYSTEM CLASS
  // ============================

  class FishingSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          castTime: 3000,
          minigameEnabled: true,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Player ID -> Fishing stats */
      this.playerStats = new Map();

      /** @type {Object} Global statistics */
      this.stats = {
        totalCasts: 0,
        totalCaught: 0,
        totalGoldEarned: 0,
        biggestCatch: null,
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("fishing:ready", { species: FISH_KEYS.length });

      return this;
    }

    /**
     * Cast fishing rod
     * @param {string} playerId - Player ID
     * @param {Object} options - Luck, bait, etc.
     * @returns {Promise<Object>} Catch result
     */
    async castRod(playerId, options = {}) {
      this.stats.totalCasts++;

      // Wait for cast time
      await new Promise((resolve) =>
        setTimeout(resolve, this.options.castTime)
      );

      // Roll for catch
      const luck = (options.luck || 0) + (options.bait || 0);
      const catchResult = this._rollCatch(luck);

      if (catchResult) {
        this.stats.totalCaught++;

        const playerStats = this.playerStats.get(playerId) || {
          totalCaught: 0,
          bySpecies: {},
          biggestCatch: null,
        };

        playerStats.totalCaught++;
        playerStats.bySpecies[catchResult.fish.id] =
          (playerStats.bySpecies[catchResult.fish.id] || 0) + 1;

        // Track biggest catch
        if (
          !playerStats.biggestCatch ||
          catchResult.size > playerStats.biggestCatch.size
        ) {
          playerStats.biggestCatch = catchResult;
        }

        this.playerStats.set(playerId, playerStats);

        this._emit("fish:caught", { playerId, catch: catchResult });

        return catchResult;
      }

      return { success: false, message: "Nothing caught..." };
    }

    /**
     * Sell fish
     * @param {string} playerId - Player ID
     * @param {Object} fish - Fish data
     * @returns {number} Gold earned
     */
    sellFish(playerId, fish) {
      const basePrice = fish.sellPrice || 0;

      // Size bonus (larger = more gold)
      const sizeBonus = Math.floor((fish.size / 100) * basePrice);

      const totalGold = basePrice + sizeBonus;

      this.stats.totalGoldEarned += totalGold;

      this._emit("fish:sold", { playerId, fish, gold: totalGold });

      return totalGold;
    }

    /**
     * Get player fishing stats
     * @param {string} playerId - Player ID
     * @returns {Object} Stats
     */
    getPlayerStats(playerId) {
      return this.playerStats.get(playerId) || null;
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        playerStats: Array.from(this.playerStats.entries()),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.playerStats.clear();
      if (data.playerStats) {
        data.playerStats.forEach(([playerId, stats]) => {
          this.playerStats.set(playerId, stats);
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("fishing:loaded");
    }

    // Private methods
    _rollCatch(luck) {
      const luckBonus = luck * 0.01;

      for (const fish of Object.values(FISH_SPECIES)) {
        const adjustedRate = fish.catchRate + luckBonus;
        const roll = Math.random();

        if (roll <= adjustedRate) {
          const size = this._randomRange(fish.size[0], fish.size[1]);

          return {
            success: true,
            fish,
            size,
            sellPrice: fish.sellPrice,
            xp: fish.xp,
          };
        }
      }

      return null;
    }

    _randomRange(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[FishingSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  FishingSystem.FISH_SPECIES = FISH_SPECIES;
  FishingSystem.FISH_KEYS = FISH_KEYS;

  return FishingSystem;
});

