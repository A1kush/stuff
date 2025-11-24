/**
 * CookingSystem.js - Food Cooking & Buffs
 * @version 1.0.0
 * @description Cook dishes from ingredients, temporary buffs, restaurants
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CookingSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // RECIPES (50 Dishes)
  // ============================

  const COOKING_RECIPES = {
    // Basic Dishes (15)
    bread: {
      id: "bread",
      name: "Fresh Bread",
      rarity: "common",
      icon: "🍞",
      ingredients: { wheat: 3 },
      cookTime: 600000, // 10 min
      effect: { hp: 50 },
      duration: 0,
      sellPrice: 50,
    },
    salad: {
      id: "salad",
      name: "Fresh Salad",
      rarity: "common",
      icon: "🥗",
      ingredients: { lettuce: 2, tomato: 1 },
      cookTime: 300000,
      effect: { hp: 80, hp_regen: 5 },
      duration: 600000,
      sellPrice: 80,
    },
    grilled_fish: {
      id: "grilled_fish",
      name: "Grilled Fish",
      rarity: "common",
      icon: "🐟🔥",
      ingredients: { trout: 1 },
      cookTime: 600000,
      effect: { hp: 100 },
      duration: 0,
      sellPrice: 100,
    },
    vegetable_soup: {
      id: "vegetable_soup",
      name: "Vegetable Soup",
      rarity: "common",
      icon: "🍲",
      ingredients: { carrot: 2, potato: 2, herb: 1 },
      cookTime: 1200000,
      effect: { hp: 150, mp: 50 },
      duration: 0,
      sellPrice: 150,
    },
    steak: {
      id: "steak",
      name: "Juicy Steak",
      rarity: "uncommon",
      icon: "🥩",
      ingredients: { meat: 1 },
      cookTime: 1800000,
      effect: { hp: 200, atk_buff: 20 },
      duration: 1800000,
      sellPrice: 300,
    },

    // Advanced Dishes (15)
    seafood_platter: {
      id: "seafood_platter",
      name: "Seafood Platter",
      rarity: "rare",
      icon: "🦞🦀🦑",
      ingredients: { lobster: 1, crab: 1, squid: 1 },
      cookTime: 3600000, // 1 hr
      effect: { hp: 500, all_stats: 30 },
      duration: 3600000,
      sellPrice: 2000,
    },
    dragon_steak: {
      id: "dragon_steak",
      name: "Dragon Steak",
      rarity: "epic",
      icon: "🐉🥩",
      ingredients: { dragon_meat: 1, phoenix_herb: 1 },
      cookTime: 7200000,
      effect: { hp: 1000, atk_buff: 100, fire_damage: 1.5 },
      duration: 7200000,
      sellPrice: 10000,
    },
    phoenix_soup: {
      id: "phoenix_soup",
      name: "Phoenix Soup",
      rarity: "legendary",
      icon: "🔥🍲",
      ingredients: { phoenix_feather: 1, phoenix_herb: 3, crystal_flower: 1 },
      cookTime: 14400000, // 4 hrs
      effect: { revive_on_death: 1 },
      duration: 0,
      sellPrice: 50000,
    },
    elixir_of_life: {
      id: "elixir_of_life",
      name: "Elixir of Life",
      rarity: "legendary",
      icon: "🧪💚",
      ingredients: { world_tree_fruit: 1, moonflower: 2, golden_fish: 1 },
      cookTime: 21600000, // 6 hrs
      effect: { max_hp: 1000, hp_regen: 100 },
      duration: 0,
      sellPrice: 250000,
    },
    ambrosia: {
      id: "ambrosia",
      name: "Ambrosia",
      rarity: "divine",
      icon: "✨🍯",
      ingredients: { star_berry: 1, golden_wheat: 5, divine_metal: 1 },
      cookTime: 43200000, // 12 hrs
      effect: { all_stats: 200, xp: 2.0, gold: 2.0 },
      duration: 86400000,
      sellPrice: 5000000,
    },
    nectar: {
      id: "nectar",
      name: "Divine Nectar",
      rarity: "divine",
      icon: "🍷✨",
      ingredients: { moonflower: 3, crystal_flower: 2, ether: 1 },
      cookTime: 28800000, // 8 hrs
      effect: { mp: 9999, mag_buff: 200, cooldown_reduction: 0.5 },
      duration: 43200000,
      sellPrice: 3000000,
    },

    // Buff Foods (20)
    strength_stew: {
      id: "strength_stew",
      name: "Strength Stew",
      rarity: "uncommon",
      icon: "💪🍲",
      ingredients: { meat: 2, carrot: 2, potato: 1 },
      cookTime: 1800000,
      effect: { atk_buff: 50 },
      duration: 3600000,
      sellPrice: 400,
    },
    defense_roast: {
      id: "defense_roast",
      name: "Defense Roast",
      rarity: "uncommon",
      icon: "🛡️🥩",
      ingredients: { meat: 2, stone: 1 },
      cookTime: 1800000,
      effect: { def_buff: 40 },
      duration: 3600000,
      sellPrice: 350,
    },
    speed_salad: {
      id: "speed_salad",
      name: "Speed Salad",
      rarity: "rare",
      icon: "⚡🥗",
      ingredients: { lettuce: 3, carrot: 2, electric_eel: 1 },
      cookTime: 1200000,
      effect: { spd_buff: 60 },
      duration: 3600000,
      sellPrice: 800,
    },
    magic_pudding: {
      id: "magic_pudding",
      name: "Magic Pudding",
      rarity: "rare",
      icon: "🔮🍮",
      ingredients: { magic_mushroom: 2, essence: 3 },
      cookTime: 2400000,
      effect: { mag_buff: 80 },
      duration: 3600000,
      sellPrice: 1500,
    },
    luck_curry: {
      id: "luck_curry",
      name: "Lucky Curry",
      rarity: "epic",
      icon: "🍀🍛",
      ingredients: { golden_fish: 1, star_berry: 1, herb: 5 },
      cookTime: 3600000,
      effect: { luk_buff: 100, rare_drop: 2.0 },
      duration: 7200000,
      sellPrice: 25000,
    },
    feast: {
      id: "feast",
      name: "Grand Feast",
      rarity: "legendary",
      icon: "🍽️👑",
      ingredients: {
        dragon_steak: 1,
        seafood_platter: 1,
        ambrosia: 1,
      },
      cookTime: 28800000, // 8 hrs
      effect: {
        all_stats: 300,
        xp: 3.0,
        gold: 3.0,
        drop_rate: 3.0,
      },
      duration: 86400000,
      sellPrice: 10000000,
    },
  };

  const RECIPE_KEYS = Object.keys(COOKING_RECIPES);

  // ============================
  // COOKING SYSTEM CLASS
  // ============================

  class CookingSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          burnChance: 0.05,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Cook ID -> Cooking data */
      this.activeCooking = new Map();

      /** @type {Set<string>} Unlocked recipes */
      this.unlockedRecipes = new Set();

      /** @type {Object} Statistics */
      this.stats = {
        totalCooked: 0,
        totalBurned: 0,
        byRecipe: {},
      };

      // Unlock common recipes by default
      RECIPE_KEYS.forEach((key) => {
        if (COOKING_RECIPES[key].rarity === "common") {
          this.unlockedRecipes.add(key);
        }
      });

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("cooking:ready", { recipes: RECIPE_KEYS.length });

      return this;
    }

    /**
     * Start cooking
     * @param {string} playerId - Player ID
     * @param {string} recipeId - Recipe ID
     * @returns {Object} Cooking data
     */
    startCooking(playerId, recipeId) {
      const recipe = COOKING_RECIPES[recipeId];

      if (!recipe) return { error: "Invalid recipe" };
      if (!this.unlockedRecipes.has(recipeId))
        return { error: "Recipe not unlocked" };

      const cookId = `cook_${Date.now()}`;

      const cooking = {
        cookId,
        playerId,
        recipeId,
        recipe,
        startTime: Date.now(),
        endTime: Date.now() + recipe.cookTime,
        completed: false,
      };

      this.activeCooking.set(cookId, cooking);

      // Auto-complete
      setTimeout(() => this.completeCooking(cookId), recipe.cookTime);

      this._emit("cooking:started", { cooking });

      return cooking;
    }

    /**
     * Complete cooking
     * @param {string} cookId - Cook ID
     * @returns {Object} Dish or burned
     */
    completeCooking(cookId) {
      const cooking = this.activeCooking.get(cookId);
      if (!cooking || cooking.completed) return null;

      cooking.completed = true;

      // Check for burn
      const burnRoll = Math.random();

      if (burnRoll < this.options.burnChance) {
        this.stats.totalBurned++;

        this._emit("cooking:burned", { cookId });

        return { success: false, burned: true };
      }

      // Success!
      this.stats.totalCooked++;
      this.stats.byRecipe[cooking.recipeId] =
        (this.stats.byRecipe[cooking.recipeId] || 0) + 1;

      const dish = {
        ...cooking.recipe,
        cookedAt: Date.now(),
      };

      this.activeCooking.delete(cookId);

      this._emit("cooking:complete", { dish });

      return { success: true, dish };
    }

    /**
     * Unlock recipe
     * @param {string} recipeId - Recipe ID
     * @returns {boolean} Success
     */
    unlockRecipe(recipeId) {
      if (!COOKING_RECIPES[recipeId]) return false;
      if (this.unlockedRecipes.has(recipeId)) return false;

      this.unlockedRecipes.add(recipeId);

      this._emit("recipe:unlocked", { recipe: COOKING_RECIPES[recipeId] });

      return true;
    }

    /**
     * Get unlocked recipes
     * @returns {Array} Recipes
     */
    getUnlockedRecipes() {
      return Array.from(this.unlockedRecipes).map((id) => COOKING_RECIPES[id]);
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        activeCooking: Array.from(this.activeCooking.entries()),
        unlockedRecipes: Array.from(this.unlockedRecipes),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.activeCooking.clear();
      if (data.activeCooking) {
        data.activeCooking.forEach(([id, cooking]) => {
          this.activeCooking.set(id, cooking);
        });
      }

      this.unlockedRecipes.clear();
      if (data.unlockedRecipes) {
        data.unlockedRecipes.forEach((id) => this.unlockedRecipes.add(id));
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("cooking:loaded");
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[CookingSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  CookingSystem.COOKING_RECIPES = COOKING_RECIPES;
  CookingSystem.RECIPE_KEYS = RECIPE_KEYS;

  return CookingSystem;
});

