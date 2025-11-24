/**
 * CraftingSystem.js - Item Crafting & Recipes
 * @version 1.0.0
 * @description Craft equipment and consumables from materials
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CraftingSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // CRAFTING RECIPES (40 Recipes)
  // ============================

  const RECIPES = {
    // WEAPONS (10)
    iron_sword: {
      id: "iron_sword",
      name: "Iron Sword",
      type: "weapon",
      rarity: "common",
      materials: { iron_ore: 5, wood: 2 },
      craftTime: 5000,
      stats: { atk: 20, crt: 0.05 },
      requiredLevel: 5,
    },
    steel_blade: {
      id: "steel_blade",
      name: "Steel Blade",
      type: "weapon",
      rarity: "uncommon",
      materials: { iron_ore: 10, coal: 5, copper_ore: 3 },
      craftTime: 10000,
      stats: { atk: 35, crt: 0.08 },
      requiredLevel: 15,
    },
    mithril_rapier: {
      id: "mithril_rapier",
      name: "Mithril Rapier",
      type: "weapon",
      rarity: "rare",
      materials: { mithril: 5, silver_ore: 10, crystal: 3 },
      craftTime: 20000,
      stats: { atk: 60, spd: 10, crt: 0.15 },
      requiredLevel: 30,
    },
    phoenix_bow: {
      id: "phoenix_bow",
      name: "Phoenix Bow",
      type: "weapon",
      rarity: "epic",
      materials: { phoenix_feather: 3, elven_wood: 10, essence: 5 },
      craftTime: 40000,
      stats: { atk: 100, dex: 20, crt: 0.25 },
      requiredLevel: 50,
    },
    dragon_slayer: {
      id: "dragon_slayer",
      name: "Dragon Slayer",
      type: "weapon",
      rarity: "legendary",
      materials: { dragon_heart: 1, adamantite: 10, orichalcum: 5 },
      craftTime: 60000,
      stats: { atk: 200, crt: 0.35, hp: 100 },
      requiredLevel: 75,
    },
    void_reaper: {
      id: "void_reaper",
      name: "Void Reaper",
      type: "weapon",
      rarity: "mythic",
      materials: { void_crystal: 5, chaos_shard: 3, soul_gem: 2 },
      craftTime: 120000,
      stats: { atk: 350, mag: 50, crt: 0.45 },
      requiredLevel: 100,
    },
    celestial_staff: {
      id: "celestial_staff",
      name: "Celestial Staff",
      type: "weapon",
      rarity: "ancient",
      materials: { star_fragment: 10, celestial_silk: 5, ether: 3 },
      craftTime: 180000,
      stats: { mag: 200, int: 50, wis: 30 },
      requiredLevel: 150,
    },
    divine_hammer: {
      id: "divine_hammer",
      name: "Divine Hammer",
      type: "weapon",
      rarity: "divine",
      materials: { divine_metal: 3, god_fragment: 1, infinity_crystal: 1 },
      craftTime: 240000,
      stats: { atk: 500, vit: 100, def: 50 },
      requiredLevel: 200,
    },
    infinity_blade: {
      id: "infinity_blade",
      name: "Infinity Blade",
      type: "weapon",
      rarity: "celestial",
      materials: {
        infinity_crystal: 3,
        cosmic_dust: 5,
        reality_stone: 1,
      },
      craftTime: 300000,
      stats: { atk: 750, mag: 150, crt: 0.60 },
      requiredLevel: 300,
    },
    genesis_weapon: {
      id: "genesis_weapon",
      name: "Genesis",
      type: "weapon",
      rarity: "transcendent",
      materials: {
        philosophers_stone: 1,
        world_tree_seed: 1,
        eternal_flame: 1,
        time_shard: 1,
      },
      craftTime: 600000,
      stats: { atk: 1000, mag: 200, crt: 0.75 },
      requiredLevel: 500,
    },

    // ARMOR (10)
    leather_armor: {
      id: "leather_armor",
      name: "Leather Armor",
      type: "armor",
      rarity: "common",
      materials: { leather: 8, fiber: 4 },
      craftTime: 5000,
      stats: { def: 15, hp: 50 },
      requiredLevel: 5,
    },
    iron_plate: {
      id: "iron_plate",
      name: "Iron Plate Armor",
      type: "armor",
      rarity: "uncommon",
      materials: { iron_ore: 15, leather: 5 },
      craftTime: 10000,
      stats: { def: 30, hp: 100 },
      requiredLevel: 15,
    },
    mithril_chainmail: {
      id: "mithril_chainmail",
      name: "Mithril Chainmail",
      type: "armor",
      rarity: "rare",
      materials: { mithril: 8, silver_ore: 10 },
      craftTime: 20000,
      stats: { def: 60, hp: 200, spd: 5 },
      requiredLevel: 30,
    },
    dragon_scale_armor: {
      id: "dragon_scale_armor",
      name: "Dragon Scale Armor",
      type: "armor",
      rarity: "epic",
      materials: { scales: 20, dragon_heart: 1, adamantite: 5 },
      craftTime: 40000,
      stats: { def: 120, hp: 400, res: 20 },
      requiredLevel: 50,
    },
    titan_plate: {
      id: "titan_plate",
      name: "Titan Plate",
      type: "armor",
      rarity: "legendary",
      materials: { titan_bone: 10, orichalcum: 8, soul_gem: 2 },
      craftTime: 60000,
      stats: { def: 200, hp: 800, vit: 30 },
      requiredLevel: 75,
    },
    void_armor: {
      id: "void_armor",
      name: "Void Armor",
      type: "armor",
      rarity: "mythic",
      materials: { void_crystal: 10, chaos_shard: 5 },
      craftTime: 120000,
      stats: { def: 350, hp: 1500, res: 50 },
      requiredLevel: 100,
    },
    celestial_robes: {
      id: "celestial_robes",
      name: "Celestial Robes",
      type: "armor",
      rarity: "ancient",
      materials: { celestial_silk: 10, star_fragment: 5, ether: 5 },
      craftTime: 180000,
      stats: { def: 150, hp: 1000, mag: 100, int: 50 },
      requiredLevel: 150,
    },
    divine_aegis: {
      id: "divine_aegis",
      name: "Divine Aegis",
      type: "armor",
      rarity: "divine",
      materials: { divine_metal: 5, god_fragment: 2, infinity_crystal: 1 },
      craftTime: 240000,
      stats: { def: 500, hp: 2500, res: 100 },
      requiredLevel: 200,
    },
    cosmic_shell: {
      id: "cosmic_shell",
      name: "Cosmic Shell",
      type: "armor",
      rarity: "celestial",
      materials: { cosmic_dust: 10, reality_stone: 2 },
      craftTime: 300000,
      stats: { def: 750, hp: 4000, res: 150 },
      requiredLevel: 300,
    },
    eternal_guard: {
      id: "eternal_guard",
      name: "Eternal Guard",
      type: "armor",
      rarity: "transcendent",
      materials: {
        philosophers_stone: 1,
        world_tree_seed: 1,
        time_shard: 2,
      },
      craftTime: 600000,
      stats: { def: 1000, hp: 10000, vit: 200 },
      requiredLevel: 500,
    },

    // CONSUMABLES (10)
    health_potion: {
      id: "health_potion",
      name: "Health Potion",
      type: "consumable",
      rarity: "common",
      materials: { herb: 3, slime: 1 },
      craftTime: 1000,
      effect: { type: "heal", value: 100 },
      requiredLevel: 1,
    },
    mana_potion: {
      id: "mana_potion",
      name: "Mana Potion",
      type: "consumable",
      rarity: "common",
      materials: { herb: 2, essence: 1 },
      craftTime: 1000,
      effect: { type: "restore_mana", value: 50 },
      requiredLevel: 1,
    },
    strength_elixir: {
      id: "strength_elixir",
      name: "Strength Elixir",
      type: "consumable",
      rarity: "uncommon",
      materials: { mushroom: 2, venom: 1, herb: 5 },
      craftTime: 5000,
      effect: { type: "buff_atk", value: 50, duration: 300000 },
      requiredLevel: 10,
    },
    defense_tonic: {
      id: "defense_tonic",
      name: "Defense Tonic",
      type: "consumable",
      rarity: "uncommon",
      materials: { bone: 5, stone: 10, herb: 3 },
      craftTime: 5000,
      effect: { type: "buff_def", value: 30, duration: 300000 },
      requiredLevel: 10,
    },
    speed_serum: {
      id: "speed_serum",
      name: "Speed Serum",
      type: "consumable",
      rarity: "rare",
      materials: { feather: 10, mushroom: 3, essence: 2 },
      craftTime: 10000,
      effect: { type: "buff_spd", value: 25, duration: 180000 },
      requiredLevel: 20,
    },
    phoenix_elixir: {
      id: "phoenix_elixir",
      name: "Phoenix Elixir",
      type: "consumable",
      rarity: "epic",
      materials: { phoenix_feather: 1, essence: 10, herb: 20 },
      craftTime: 30000,
      effect: { type: "revive", value: 1 },
      requiredLevel: 40,
    },
    berserk_potion: {
      id: "berserk_potion",
      name: "Berserk Potion",
      type: "consumable",
      rarity: "rare",
      materials: { demon_horn: 1, venom: 5, blood_ruby: 1 },
      craftTime: 15000,
      effect: { type: "berserk", duration: 60000 },
      requiredLevel: 30,
    },
    invisibility_potion: {
      id: "invisibility_potion",
      name: "Invisibility Potion",
      type: "consumable",
      rarity: "epic",
      materials: { void_crystal: 2, essence: 15, mushroom: 10 },
      craftTime: 25000,
      effect: { type: "invisible", duration: 30000 },
      requiredLevel: 50,
    },
    immortality_draft: {
      id: "immortality_draft",
      name: "Immortality Draft",
      type: "consumable",
      rarity: "legendary",
      materials: { world_tree_seed: 1, eternal_flame: 1, ether: 20 },
      craftTime: 120000,
      effect: { type: "immortal", duration: 10000 },
      requiredLevel: 100,
    },
    god_elixir: {
      id: "god_elixir",
      name: "God Elixir",
      type: "consumable",
      rarity: "divine",
      materials: {
        god_fragment: 1,
        philosophers_stone: 1,
        divine_metal: 3,
      },
      craftTime: 300000,
      effect: { type: "godmode", duration: 30000 },
      requiredLevel: 200,
    },

    // ACCESSORIES (10)
    lucky_charm: {
      id: "lucky_charm",
      name: "Lucky Charm",
      type: "accessory",
      rarity: "uncommon",
      materials: { feather: 5, crystal: 2 },
      craftTime: 8000,
      stats: { luk: 10 },
      requiredLevel: 10,
    },
    magic_ring: {
      id: "magic_ring",
      name: "Magic Ring",
      type: "accessory",
      rarity: "rare",
      materials: { gold_ore: 3, essence: 5, crystal: 3 },
      craftTime: 15000,
      stats: { mag: 30, int: 15 },
      requiredLevel: 25,
    },
    phoenix_pendant: {
      id: "phoenix_pendant",
      name: "Phoenix Pendant",
      type: "accessory",
      rarity: "epic",
      materials: { phoenix_feather: 2, gold_ore: 10, moonstone: 3 },
      craftTime: 35000,
      stats: { hp: 200, vit: 20 },
      requiredLevel: 45,
    },
    void_amulet: {
      id: "void_amulet",
      name: "Void Amulet",
      type: "accessory",
      rarity: "legendary",
      materials: { void_crystal: 5, demon_horn: 3, soul_gem: 1 },
      craftTime: 80000,
      stats: { mag: 100, res: 50, int: 30 },
      requiredLevel: 80,
    },
    dragon_necklace: {
      id: "dragon_necklace",
      name: "Dragon Necklace",
      type: "accessory",
      rarity: "mythic",
      materials: { dragon_heart: 2, scales: 50, blood_ruby: 3 },
      craftTime: 150000,
      stats: { atk: 150, mag: 100, hp: 500 },
      requiredLevel: 120,
    },
    star_crown: {
      id: "star_crown",
      name: "Star Crown",
      type: "accessory",
      rarity: "ancient",
      materials: { star_fragment: 20, celestial_silk: 10 },
      craftTime: 200000,
      stats: { int: 100, wis: 80, mag: 150 },
      requiredLevel: 160,
    },
    titan_belt: {
      id: "titan_belt",
      name: "Titan Belt",
      type: "accessory",
      rarity: "legendary",
      materials: { titan_bone: 15, orichalcum: 10 },
      craftTime: 100000,
      stats: { vit: 50, def: 100, hp: 600 },
      requiredLevel: 90,
    },
    ether_circlet: {
      id: "ether_circlet",
      name: "Ether Circlet",
      type: "accessory",
      rarity: "epic",
      materials: { ether: 10, essence: 20, moonstone: 5 },
      craftTime: 50000,
      stats: { mag: 80, int: 40, wis: 30 },
      requiredLevel: 60,
    },
    chaos_ring: {
      id: "chaos_ring",
      name: "Chaos Ring",
      type: "accessory",
      rarity: "mythic",
      materials: { chaos_shard: 10, soul_gem: 3 },
      craftTime: 180000,
      stats: { atk: 100, mag: 100, crt: 0.20 },
      requiredLevel: 140,
    },
    reality_band: {
      id: "reality_band",
      name: "Reality Band",
      type: "accessory",
      rarity: "divine",
      materials: { reality_stone: 3, cosmic_dust: 10, time_shard: 2 },
      craftTime: 360000,
      stats: { atk: 200, mag: 200, hp: 1000 },
      requiredLevel: 250,
    },
  };

  const RECIPE_KEYS = Object.keys(RECIPES);

  // ============================
  // CRAFTING SYSTEM CLASS
  // ============================

  class CraftingSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          biomeLootSystem: null,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Active crafts (craftId -> craft data) */
      this.activeCrafts = new Map();

      /** @type {Set<string>} Unlocked recipes */
      this.unlockedRecipes = new Set();

      /** @type {Object} Statistics */
      this.stats = {
        totalCrafted: 0,
        byRarity: {},
        byType: {},
      };

      this.biomeLootSystem = this.options.biomeLootSystem;
      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      // Unlock common recipes by default
      RECIPE_KEYS.forEach((key) => {
        const recipe = RECIPES[key];
        if (recipe.rarity === "common") {
          this.unlockedRecipes.add(key);
        }
      });

      this.initialized = true;
      this._emit("crafting:ready", {
        unlockedRecipes: this.unlockedRecipes.size,
      });

      return this;
    }

    /**
     * Unlock a recipe
     * @param {string} recipeId - Recipe ID
     * @returns {boolean} Success
     */
    unlockRecipe(recipeId) {
      if (!RECIPES[recipeId]) return false;
      if (this.unlockedRecipes.has(recipeId)) return false;

      this.unlockedRecipes.add(recipeId);
      this._emit("recipe:unlocked", { recipe: RECIPES[recipeId] });

      return true;
    }

    /**
     * Check if can craft
     * @param {string} recipeId - Recipe ID
     * @param {number} characterLevel - Character level
     * @returns {Object} Can craft & missing materials
     */
    canCraft(recipeId, characterLevel = 1) {
      const recipe = RECIPES[recipeId];
      if (!recipe) return { canCraft: false, reason: "Invalid recipe" };
      if (!this.unlockedRecipes.has(recipeId))
        return { canCraft: false, reason: "Recipe not unlocked" };
      if (characterLevel < recipe.requiredLevel)
        return { canCraft: false, reason: "Level too low" };

      // Check materials
      const missing = {};
      let hasMaterials = true;

      for (const [matId, required] of Object.entries(recipe.materials)) {
        const have = this.biomeLootSystem?.getMaterialCount(matId) || 0;
        if (have < required) {
          hasMaterials = false;
          missing[matId] = required - have;
        }
      }

      return {
        canCraft: hasMaterials,
        missing: hasMaterials ? null : missing,
        reason: hasMaterials ? null : "Insufficient materials",
      };
    }

    /**
     * Start crafting an item
     * @param {string} recipeId - Recipe ID
     * @param {number} characterLevel - Character level
     * @returns {Object|null} Craft data
     */
    startCraft(recipeId, characterLevel = 1) {
      const check = this.canCraft(recipeId, characterLevel);
      if (!check.canCraft) return null;

      const recipe = RECIPES[recipeId];

      // Consume materials
      for (const [matId, required] of Object.entries(recipe.materials)) {
        this.biomeLootSystem?.removeMaterial(matId, required);
      }

      // Create craft
      const craftId = `craft_${Date.now()}`;
      const craft = {
        craftId,
        recipeId,
        recipe,
        startTime: Date.now(),
        endTime: Date.now() + recipe.craftTime,
        completed: false,
      };

      this.activeCrafts.set(craftId, craft);

      // Auto-complete after craft time
      setTimeout(() => this.completeCraft(craftId), recipe.craftTime);

      this._emit("craft:started", { craft });

      return craft;
    }

    /**
     * Complete a craft
     * @param {string} craftId - Craft ID
     * @returns {Object|null} Crafted item
     */
    completeCraft(craftId) {
      const craft = this.activeCrafts.get(craftId);
      if (!craft || craft.completed) return null;

      craft.completed = true;

      // Generate item
      const item = {
        ...craft.recipe,
        craftedAt: Date.now(),
      };

      // Update stats
      this.stats.totalCrafted++;
      this.stats.byRarity[item.rarity] =
        (this.stats.byRarity[item.rarity] || 0) + 1;
      this.stats.byType[item.type] = (this.stats.byType[item.type] || 0) + 1;

      this.activeCrafts.delete(craftId);

      this._emit("craft:complete", { item });

      return item;
    }

    /**
     * Get active crafts
     * @returns {Array}
     */
    getActiveCrafts() {
      return Array.from(this.activeCrafts.values());
    }

    /**
     * Get unlocked recipes
     * @returns {Array}
     */
    getUnlockedRecipes() {
      return Array.from(this.unlockedRecipes).map((id) => RECIPES[id]);
    }

    /**
     * Get recipes by type
     * @param {string} type - Type (weapon, armor, etc.)
     * @returns {Array}
     */
    getRecipesByType(type) {
      return RECIPE_KEYS.filter(
        (key) =>
          RECIPES[key].type === type && this.unlockedRecipes.has(key)
      ).map((key) => RECIPES[key]);
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        unlockedRecipes: Array.from(this.unlockedRecipes),
        activeCrafts: Array.from(this.activeCrafts.entries()),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.unlockedRecipes.clear();
      if (data.unlockedRecipes) {
        data.unlockedRecipes.forEach((id) => this.unlockedRecipes.add(id));
      }

      this.activeCrafts.clear();
      if (data.activeCrafts) {
        data.activeCrafts.forEach(([id, craft]) => {
          this.activeCrafts.set(id, craft);
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("crafting:loaded", {
        recipes: this.unlockedRecipes.size,
        active: this.activeCrafts.size,
      });
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[CraftingSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  CraftingSystem.RECIPES = RECIPES;
  CraftingSystem.RECIPE_KEYS = RECIPE_KEYS;

  return CraftingSystem;
});

