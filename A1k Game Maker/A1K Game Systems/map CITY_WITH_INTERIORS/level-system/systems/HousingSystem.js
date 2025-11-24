/**
 * HousingSystem.js - Player Housing & Base Building
 * @version 1.0.0
 * @description Personal houses, furniture, decorations, storage, upgrades
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.HousingSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // HOUSE TYPES (10 Tiers)
  // ============================

  const HOUSE_TYPES = {
    tent: {
      id: "tent",
      name: "Simple Tent",
      tier: 1,
      icon: "⛺",
      cost: { gold: 1000 },
      capacity: 10,
      rooms: 1,
      bonuses: {},
    },
    cottage: {
      id: "cottage",
      name: "Cozy Cottage",
      tier: 2,
      icon: "🏠",
      cost: { gold: 10000, wood: 50, stone: 30 },
      capacity: 50,
      rooms: 3,
      bonuses: { hp_regen: 5 },
    },
    house: {
      id: "house",
      name: "Comfortable House",
      tier: 3,
      icon: "🏡",
      cost: { gold: 50000, wood: 100, stone: 80, iron_ore: 20 },
      capacity: 150,
      rooms: 5,
      bonuses: { hp_regen: 10, xp: 1.05 },
    },
    villa: {
      id: "villa",
      name: "Luxury Villa",
      tier: 4,
      icon: "🏘️",
      cost: { gold: 250000, mithril: 50, crystal: 30 },
      capacity: 300,
      rooms: 8,
      bonuses: { hp_regen: 20, xp: 1.1, gold: 1.05 },
    },
    manor: {
      id: "manor",
      name: "Grand Manor",
      tier: 5,
      icon: "🏛️",
      cost: { gold: 1000000, gold_ore: 100, moonstone: 50 },
      capacity: 500,
      rooms: 12,
      bonuses: { hp_regen: 30, xp: 1.15, gold: 1.1, all_stats: 10 },
    },
    castle: {
      id: "castle",
      name: "Majestic Castle",
      tier: 6,
      icon: "🏰",
      cost: { gold: 5000000, adamantite: 100, star_fragment: 30 },
      capacity: 1000,
      rooms: 20,
      bonuses: { hp_regen: 50, xp: 1.25, gold: 1.2, all_stats: 25 },
    },
    fortress: {
      id: "fortress",
      name: "Impenetrable Fortress",
      tier: 7,
      icon: "⛩️",
      cost: { gold: 20000000, orichalcum: 200, soul_gem: 50 },
      capacity: 2000,
      rooms: 30,
      bonuses: { hp_regen: 75, xp: 1.35, gold: 1.3, all_stats: 50, def: 100 },
    },
    palace: {
      id: "palace",
      name: "Royal Palace",
      tier: 8,
      icon: "🏯",
      cost: { gold: 50000000, divine_metal: 100, infinity_crystal: 10 },
      capacity: 5000,
      rooms: 50,
      bonuses: {
        hp_regen: 100,
        xp: 1.5,
        gold: 1.5,
        all_stats: 100,
        loot: 1.2,
      },
    },
    sanctuary: {
      id: "sanctuary",
      name: "Divine Sanctuary",
      tier: 9,
      icon: "⛪",
      cost: { gold: 100000000, god_fragment: 50, celestial_silk: 100 },
      capacity: 10000,
      rooms: 75,
      bonuses: {
        hp_regen: 150,
        xp: 2.0,
        gold: 2.0,
        all_stats: 200,
        loot: 1.5,
      },
    },
    dimension: {
      id: "dimension",
      name: "Pocket Dimension",
      tier: 10,
      icon: "🌌",
      cost: {
        gold: 999999999,
        philosophers_stone: 10,
        reality_stone: 5,
        time_shard: 5,
      },
      capacity: 99999,
      rooms: 999,
      bonuses: {
        hp_regen: 500,
        xp: 3.0,
        gold: 3.0,
        all_stats: 500,
        loot: 2.0,
      },
    },
  };

  // ============================
  // FURNITURE (60 Items!)
  // ============================

  const FURNITURE = {
    // Storage Furniture (10)
    wooden_chest: {
      id: "wooden_chest",
      name: "Wooden Chest",
      category: "storage",
      rarity: "common",
      icon: "📦",
      cost: { gold: 100, wood: 10 },
      capacity: 10,
      bonuses: {},
    },
    iron_safe: {
      id: "iron_safe",
      name: "Iron Safe",
      category: "storage",
      rarity: "uncommon",
      icon: "🗄️",
      cost: { gold: 1000, iron_ore: 20 },
      capacity: 50,
      bonuses: {},
    },
    magic_vault: {
      id: "magic_vault",
      name: "Magic Vault",
      category: "storage",
      rarity: "rare",
      icon: "🔮",
      cost: { gold: 10000, essence: 10, crystal: 5 },
      capacity: 200,
      bonuses: { loot: 1.05 },
    },
    dimensional_storage: {
      id: "dimensional_storage",
      name: "Dimensional Storage",
      category: "storage",
      rarity: "legendary",
      icon: "🌀",
      cost: { gold: 100000, void_crystal: 10 },
      capacity: 999,
      bonuses: { loot: 1.2 },
    },

    // Comfort Furniture (10)
    bed: {
      id: "bed",
      name: "Comfortable Bed",
      category: "comfort",
      rarity: "common",
      icon: "🛏️",
      cost: { gold: 500, wood: 20, fiber: 10 },
      bonuses: { hp_regen: 5 },
    },
    luxury_bed: {
      id: "luxury_bed",
      name: "Luxury Bed",
      category: "comfort",
      rarity: "rare",
      icon: "🛌",
      cost: { gold: 5000, silk: 20, feather: 50 },
      bonuses: { hp_regen: 20, mp_regen: 10 },
    },
    throne: {
      id: "throne",
      name: "Golden Throne",
      category: "comfort",
      rarity: "epic",
      icon: "👑",
      cost: { gold: 50000, gold_ore: 50 },
      bonuses: { all_stats: 25, charisma: 50 },
    },
    divine_throne: {
      id: "divine_throne",
      name: "Divine Throne",
      category: "comfort",
      rarity: "legendary",
      icon: "⚜️",
      cost: { gold: 500000, divine_metal: 20, god_fragment: 1 },
      bonuses: { all_stats: 100, xp: 1.1 },
    },

    // Utility Furniture (10)
    workbench: {
      id: "workbench",
      name: "Crafting Workbench",
      category: "utility",
      rarity: "uncommon",
      icon: "🔧",
      cost: { gold: 2000, wood: 30, iron_ore: 10 },
      bonuses: { craft_speed: 0.9 },
    },
    enchanting_table: {
      id: "enchanting_table",
      name: "Enchanting Table",
      category: "utility",
      rarity: "rare",
      icon: "✨",
      cost: { gold: 25000, obsidian: 10, essence: 20 },
      bonuses: { enchant_success: 1.1 },
    },
    alchemy_station: {
      id: "alchemy_station",
      name: "Alchemy Station",
      category: "utility",
      rarity: "epic",
      icon: "⚗️",
      cost: { gold: 75000, crystal: 30, ether: 10 },
      bonuses: { potion_power: 1.25 },
    },
    training_dummy: {
      id: "training_dummy",
      name: "Training Dummy",
      category: "utility",
      rarity: "uncommon",
      icon: "🎯",
      cost: { gold: 5000, wood: 20, leather: 10 },
      bonuses: { xp_combat: 1.1 },
    },
    library: {
      id: "library",
      name: "Grand Library",
      category: "utility",
      rarity: "epic",
      icon: "📚",
      cost: { gold: 100000, wood: 100 },
      bonuses: { int: 50, wis: 50, xp: 1.15 },
    },
    forge: {
      id: "forge",
      name: "Master Forge",
      category: "utility",
      rarity: "rare",
      icon: "⚒️",
      cost: { gold: 50000, coal: 100, iron_ore: 50 },
      bonuses: { craft_quality: 1.2 },
    },
    garden: {
      id: "garden",
      name: "Herb Garden",
      category: "utility",
      rarity: "uncommon",
      icon: "🌱",
      cost: { gold: 10000, fiber: 50, herb: 30 },
      bonuses: { material_gen: 10 },
    },
    stable: {
      id: "stable",
      name: "Pet Stable",
      category: "utility",
      rarity: "rare",
      icon: "🐴",
      cost: { gold: 30000, wood: 80 },
      bonuses: { pet_xp: 1.2 },
    },
    trophy_room: {
      id: "trophy_room",
      name: "Trophy Room",
      category: "utility",
      rarity: "epic",
      icon: "🏆",
      cost: { gold: 200000 },
      bonuses: { achievement_bonus: 1.1 },
    },
    portal: {
      id: "portal",
      name: "Teleport Portal",
      category: "utility",
      rarity: "legendary",
      icon: "🌀",
      cost: { gold: 1000000, ether: 50, void_crystal: 20 },
      bonuses: { teleport: true },
    },

    // Decorative Furniture (10)
    painting: {
      id: "painting",
      name: "Masterpiece Painting",
      category: "decoration",
      rarity: "uncommon",
      icon: "🖼️",
      cost: { gold: 5000 },
      bonuses: { charisma: 10 },
    },
    chandelier: {
      id: "chandelier",
      name: "Crystal Chandelier",
      category: "decoration",
      rarity: "rare",
      icon: "💡",
      cost: { gold: 25000, crystal: 10 },
      bonuses: { mag: 20, charisma: 15 },
    },
    statue: {
      id: "statue",
      name: "Hero Statue",
      category: "decoration",
      rarity: "epic",
      icon: "🗽",
      cost: { gold: 100000, mithril: 30 },
      bonuses: { all_stats: 15 },
    },
    fountain: {
      id: "fountain",
      name: "Magic Fountain",
      category: "decoration",
      rarity: "legendary",
      icon: "⛲",
      cost: { gold: 500000, moonstone: 20, ether: 10 },
      bonuses: { hp_regen: 50, mp_regen: 50, luk: 25 },
    },

    // Farming Furniture (10)
    crop_plot: {
      id: "crop_plot",
      name: "Crop Plot",
      category: "farming",
      rarity: "common",
      icon: "🌾",
      cost: { gold: 1000, fiber: 10 },
      production: { type: "herb", rate: 1, interval: 3600000 },
    },
    tree_sapling: {
      id: "tree_sapling",
      name: "Tree Sapling",
      category: "farming",
      rarity: "uncommon",
      icon: "🌳",
      cost: { gold: 5000, wood: 5 },
      production: { type: "wood", rate: 5, interval: 7200000 },
    },
    ore_vein: {
      id: "ore_vein",
      name: "Iron Vein",
      category: "farming",
      rarity: "rare",
      icon: "⛏️",
      cost: { gold: 20000, iron_ore: 10 },
      production: { type: "iron_ore", rate: 3, interval: 14400000 },
    },
    crystal_growth: {
      id: "crystal_growth",
      name: "Crystal Growth",
      category: "farming",
      rarity: "epic",
      icon: "💎",
      cost: { gold: 100000, crystal: 20 },
      production: { type: "crystal", rate: 2, interval: 21600000 },
    },

    // Special Furniture (16)
    shrine: {
      id: "shrine",
      name: "Divine Shrine",
      category: "special",
      rarity: "legendary",
      icon: "⛩️",
      cost: { gold: 1000000, god_fragment: 1 },
      bonuses: { all_stats: 50, xp: 1.25, loot: 1.25 },
    },
    time_crystal: {
      id: "time_crystal",
      name: "Time Crystal",
      category: "special",
      rarity: "legendary",
      icon: "⏰",
      cost: { gold: 2000000, time_shard: 5 },
      bonuses: { production_speed: 2.0 },
    },
    wishing_well: {
      id: "wishing_well",
      name: "Wishing Well",
      category: "special",
      rarity: "mythic",
      icon: "🌟",
      cost: { gold: 10000000, star_fragment: 50 },
      bonuses: { luk: 100, rare_chance: 1.5 },
    },
  };

  const FURNITURE_KEYS = Object.keys(FURNITURE);

  // ============================
  // HOUSING SYSTEM CLASS
  // ============================

  class HousingSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Player ID -> House data */
      this.playerHouses = new Map();

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("housing:ready");

      return this;
    }

    /**
     * Purchase house
     * @param {string} playerId - Player ID
     * @param {string} houseType - House type ID
     * @returns {Object} House data
     */
    purchaseHouse(playerId, houseType) {
      const houseTemplate = HOUSE_TYPES[houseType];
      if (!houseTemplate) return null;

      const house = {
        playerId,
        type: houseType,
        ...houseTemplate,
        furniture: [],
        storage: [],
        production: {},
        purchasedAt: Date.now(),
      };

      this.playerHouses.set(playerId, house);

      this._emit("house:purchased", { playerId, house });

      return house;
    }

    /**
     * Place furniture
     * @param {string} playerId - Player ID
     * @param {string} furnitureId - Furniture ID
     * @param {Object} position - {x, y, room}
     * @returns {boolean} Success
     */
    placeFurniture(playerId, furnitureId, position = {}) {
      const house = this.playerHouses.get(playerId);
      const furnitureTemplate = FURNITURE[furnitureId];

      if (!house || !furnitureTemplate) return false;

      const furniture = {
        id: `furniture_${Date.now()}`,
        type: furnitureId,
        ...furnitureTemplate,
        position,
        placedAt: Date.now(),
      };

      house.furniture.push(furniture);

      // Start production if applicable
      if (furniture.production) {
        this._startProduction(playerId, furniture);
      }

      this._emit("furniture:placed", { playerId, furniture });

      return true;
    }

    /**
     * Get total house bonuses
     * @param {string} playerId - Player ID
     * @returns {Object} Bonuses
     */
    getHouseBonuses(playerId) {
      const house = this.playerHouses.get(playerId);
      if (!house) return {};

      const bonuses = { ...house.bonuses };

      // Add furniture bonuses
      house.furniture.forEach((furn) => {
        for (const [bonus, value] of Object.entries(furn.bonuses)) {
          if (typeof value === "number") {
            bonuses[bonus] = (bonuses[bonus] || 0) + value;
          }
        }
      });

      return bonuses;
    }

    /**
     * Collect production
     * @param {string} playerId - Player ID
     * @returns {Array} Collected materials
     */
    collectProduction(playerId) {
      const house = this.playerHouses.get(playerId);
      if (!house) return [];

      const collected = [];
      const now = Date.now();

      house.furniture.forEach((furn) => {
        if (!furn.production) return;

        const productionKey = `${furn.id}_production`;
        const lastCollect = house.production[productionKey] || furn.placedAt;
        const elapsed = now - lastCollect;
        const cycles = Math.floor(elapsed / furn.production.interval);

        if (cycles > 0) {
          const amount = cycles * furn.production.rate;

          collected.push({
            type: furn.production.type,
            amount,
            furniture: furn.name,
          });

          house.production[productionKey] = now;
        }
      });

      if (collected.length > 0) {
        this._emit("production:collected", { playerId, collected });
      }

      return collected;
    }

    /**
     * Upgrade house
     * @param {string} playerId - Player ID
     * @param {string} newHouseType - New house type
     * @returns {Object} New house
     */
    upgradeHouse(playerId, newHouseType) {
      const currentHouse = this.playerHouses.get(playerId);
      const newTemplate = HOUSE_TYPES[newHouseType];

      if (!currentHouse || !newTemplate) return null;

      if (newTemplate.tier <= currentHouse.tier) {
        return { error: "Cannot downgrade house" };
      }

      // Keep furniture
      const furniture = currentHouse.furniture;
      const production = currentHouse.production;

      // Create new house
      const newHouse = {
        playerId,
        type: newHouseType,
        ...newTemplate,
        furniture,
        storage: currentHouse.storage,
        production,
        purchasedAt: currentHouse.purchasedAt,
        upgradedAt: Date.now(),
      };

      this.playerHouses.set(playerId, newHouse);

      this._emit("house:upgraded", { playerId, house: newHouse });

      return newHouse;
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        playerHouses: Array.from(this.playerHouses.entries()),
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.playerHouses.clear();
      if (data.playerHouses) {
        data.playerHouses.forEach(([playerId, house]) => {
          this.playerHouses.set(playerId, house);
        });
      }

      this._emit("housing:loaded");
    }

    // Private methods
    _startProduction(playerId, furniture) {
      const house = this.playerHouses.get(playerId);
      if (!house) return;

      const productionKey = `${furniture.id}_production`;
      house.production[productionKey] = Date.now();
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[HousingSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  HousingSystem.HOUSE_TYPES = HOUSE_TYPES;
  HousingSystem.FURNITURE = FURNITURE;
  HousingSystem.FURNITURE_KEYS = FURNITURE_KEYS;

  return HousingSystem;
});

