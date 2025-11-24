/**
 * BiomeLootSystem.js - Biome-Specific Loot Tables & Crafting
 * @version 1.0.0
 * @description Expands loot system with 10 biomes and crafting materials
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.BiomeLootSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // BIOME DEFINITIONS (10 Biomes)
  // ============================

  const BIOMES = {
    forest: {
      id: "forest",
      name: "Ancient Forest",
      color: "#228B22",
      icon: "🌲",
      difficultyMod: 1.0,
      luckMod: 1.1,
      description: "Dense woods filled with ancient magic",
    },
    desert: {
      id: "desert",
      name: "Scorching Desert",
      color: "#DEB887",
      icon: "🏜️",
      difficultyMod: 1.2,
      luckMod: 0.9,
      description: "Harsh sands hiding rare treasures",
    },
    tundra: {
      id: "tundra",
      name: "Frozen Tundra",
      color: "#B0E0E6",
      icon: "❄️",
      difficultyMod: 1.3,
      luckMod: 1.0,
      description: "Icy wasteland with frozen relics",
    },
    volcano: {
      id: "volcano",
      name: "Volcanic Crater",
      color: "#FF4500",
      icon: "🌋",
      difficultyMod: 1.5,
      luckMod: 1.3,
      description: "Molten landscape with fire-forged items",
    },
    ocean: {
      id: "ocean",
      name: "Deep Ocean",
      color: "#4682B4",
      icon: "🌊",
      difficultyMod: 1.2,
      luckMod: 1.2,
      description: "Underwater depths concealing sea treasures",
    },
    mountains: {
      id: "mountains",
      name: "Sky Mountains",
      color: "#778899",
      icon: "⛰️",
      difficultyMod: 1.4,
      luckMod: 1.1,
      description: "Peaks touching the clouds",
    },
    swamp: {
      id: "swamp",
      name: "Toxic Swamp",
      color: "#556B2F",
      icon: "🐊",
      difficultyMod: 1.3,
      luckMod: 0.8,
      description: "Poisonous marshlands with rare ingredients",
    },
    ruins: {
      id: "ruins",
      name: "Ancient Ruins",
      color: "#8B7355",
      icon: "🏛️",
      difficultyMod: 1.6,
      luckMod: 1.5,
      description: "Crumbling civilization with legendary artifacts",
    },
    abyss: {
      id: "abyss",
      name: "Dark Abyss",
      color: "#1C1C1C",
      icon: "🕳️",
      difficultyMod: 2.0,
      luckMod: 1.8,
      description: "Void realm with eldritch treasures",
    },
    heaven: {
      id: "heaven",
      name: "Celestial Realm",
      color: "#FFD700",
      icon: "☁️",
      difficultyMod: 2.5,
      luckMod: 2.0,
      description: "Divine domain with sacred relics",
    },
  };

  // ============================
  // CRAFTING MATERIALS (50 Types)
  // ============================

  const MATERIALS = {
    // Common Materials (10)
    wood: { id: "wood", name: "Wood", rarity: "common", icon: "🪵", value: 5 },
    stone: {
      id: "stone",
      name: "Stone",
      rarity: "common",
      icon: "🪨",
      value: 5,
    },
    iron_ore: {
      id: "iron_ore",
      name: "Iron Ore",
      rarity: "common",
      icon: "⛏️",
      value: 10,
    },
    leather: {
      id: "leather",
      name: "Leather",
      rarity: "common",
      icon: "🦎",
      value: 8,
    },
    fiber: {
      id: "fiber",
      name: "Fiber",
      rarity: "common",
      icon: "🌾",
      value: 3,
    },
    bone: {
      id: "bone",
      name: "Bone",
      rarity: "common",
      icon: "🦴",
      value: 7,
    },
    feather: {
      id: "feather",
      name: "Feather",
      rarity: "common",
      icon: "🪶",
      value: 4,
    },
    slime: {
      id: "slime",
      name: "Slime",
      rarity: "common",
      icon: "💧",
      value: 6,
    },
    coal: {
      id: "coal",
      name: "Coal",
      rarity: "common",
      icon: "⚫",
      value: 8,
    },
    herb: {
      id: "herb",
      name: "Herb",
      rarity: "common",
      icon: "🌿",
      value: 5,
    },

    // Uncommon Materials (10)
    copper_ore: {
      id: "copper_ore",
      name: "Copper Ore",
      rarity: "uncommon",
      icon: "🟤",
      value: 20,
    },
    silver_ore: {
      id: "silver_ore",
      name: "Silver Ore",
      rarity: "uncommon",
      icon: "⚪",
      value: 30,
    },
    crystal: {
      id: "crystal",
      name: "Crystal",
      rarity: "uncommon",
      icon: "💎",
      value: 25,
    },
    silk: {
      id: "silk",
      name: "Silk",
      rarity: "uncommon",
      icon: "🕸️",
      value: 22,
    },
    venom: {
      id: "venom",
      name: "Venom",
      rarity: "uncommon",
      icon: "☠️",
      value: 28,
    },
    scales: {
      id: "scales",
      name: "Dragon Scales",
      rarity: "uncommon",
      icon: "🐉",
      value: 35,
    },
    essence: {
      id: "essence",
      name: "Magic Essence",
      rarity: "uncommon",
      icon: "✨",
      value: 30,
    },
    pearl: {
      id: "pearl",
      name: "Pearl",
      rarity: "uncommon",
      icon: "⚪",
      value: 40,
    },
    amber: {
      id: "amber",
      name: "Amber",
      rarity: "uncommon",
      icon: "🟠",
      value: 32,
    },
    mushroom: {
      id: "mushroom",
      name: "Rare Mushroom",
      rarity: "uncommon",
      icon: "🍄",
      value: 27,
    },

    // Rare Materials (10)
    gold_ore: {
      id: "gold_ore",
      name: "Gold Ore",
      rarity: "rare",
      icon: "🟡",
      value: 100,
    },
    mithril: {
      id: "mithril",
      name: "Mithril",
      rarity: "rare",
      icon: "🔷",
      value: 150,
    },
    obsidian: {
      id: "obsidian",
      name: "Obsidian",
      rarity: "rare",
      icon: "⬛",
      value: 120,
    },
    phoenix_feather: {
      id: "phoenix_feather",
      name: "Phoenix Feather",
      rarity: "rare",
      icon: "🔥",
      value: 200,
    },
    moonstone: {
      id: "moonstone",
      name: "Moonstone",
      rarity: "rare",
      icon: "🌙",
      value: 180,
    },
    demon_horn: {
      id: "demon_horn",
      name: "Demon Horn",
      rarity: "rare",
      icon: "😈",
      value: 250,
    },
    void_crystal: {
      id: "void_crystal",
      name: "Void Crystal",
      rarity: "rare",
      icon: "🕳️",
      value: 300,
    },
    elven_wood: {
      id: "elven_wood",
      name: "Elven Wood",
      rarity: "rare",
      icon: "🌳",
      value: 140,
    },
    ice_core: {
      id: "ice_core",
      name: "Ice Core",
      rarity: "rare",
      icon: "❄️",
      value: 160,
    },
    blood_ruby: {
      id: "blood_ruby",
      name: "Blood Ruby",
      rarity: "rare",
      icon: "💎",
      value: 220,
    },

    // Epic Materials (10)
    adamantite: {
      id: "adamantite",
      name: "Adamantite",
      rarity: "epic",
      icon: "💠",
      value: 500,
    },
    dragon_heart: {
      id: "dragon_heart",
      name: "Dragon Heart",
      rarity: "epic",
      icon: "❤️",
      value: 800,
    },
    star_fragment: {
      id: "star_fragment",
      name: "Star Fragment",
      rarity: "epic",
      icon: "⭐",
      value: 600,
    },
    ether: {
      id: "ether",
      name: "Ether",
      rarity: "epic",
      icon: "🌀",
      value: 700,
    },
    orichalcum: {
      id: "orichalcum",
      name: "Orichalcum",
      rarity: "epic",
      icon: "🟨",
      value: 650,
    },
    soul_gem: {
      id: "soul_gem",
      name: "Soul Gem",
      rarity: "epic",
      icon: "💜",
      value: 900,
    },
    titan_bone: {
      id: "titan_bone",
      name: "Titan Bone",
      rarity: "epic",
      icon: "🦴",
      value: 750,
    },
    celestial_silk: {
      id: "celestial_silk",
      name: "Celestial Silk",
      rarity: "epic",
      icon: "✨",
      value: 850,
    },
    chaos_shard: {
      id: "chaos_shard",
      name: "Chaos Shard",
      rarity: "epic",
      icon: "💥",
      value: 950,
    },
    ancient_rune: {
      id: "ancient_rune",
      name: "Ancient Rune",
      rarity: "epic",
      icon: "📜",
      value: 800,
    },

    // Legendary Materials (10)
    philosophers_stone: {
      id: "philosophers_stone",
      name: "Philosopher's Stone",
      rarity: "legendary",
      icon: "💎",
      value: 5000,
    },
    god_fragment: {
      id: "god_fragment",
      name: "God Fragment",
      rarity: "legendary",
      icon: "👑",
      value: 8000,
    },
    primordial_essence: {
      id: "primordial_essence",
      name: "Primordial Essence",
      rarity: "legendary",
      icon: "🌌",
      value: 7000,
    },
    world_tree_seed: {
      id: "world_tree_seed",
      name: "World Tree Seed",
      rarity: "legendary",
      icon: "🌱",
      value: 6000,
    },
    eternal_flame: {
      id: "eternal_flame",
      name: "Eternal Flame",
      rarity: "legendary",
      icon: "🔥",
      value: 9000,
    },
    infinity_crystal: {
      id: "infinity_crystal",
      name: "Infinity Crystal",
      rarity: "legendary",
      icon: "♾️",
      value: 10000,
    },
    time_shard: {
      id: "time_shard",
      name: "Time Shard",
      rarity: "legendary",
      icon: "⏰",
      value: 12000,
    },
    reality_stone: {
      id: "reality_stone",
      name: "Reality Stone",
      rarity: "legendary",
      icon: "🔮",
      value: 15000,
    },
    cosmic_dust: {
      id: "cosmic_dust",
      name: "Cosmic Dust",
      rarity: "legendary",
      icon: "✨",
      value: 11000,
    },
    divine_metal: {
      id: "divine_metal",
      name: "Divine Metal",
      rarity: "legendary",
      icon: "🌟",
      value: 13000,
    },
  };

  // ============================
  // BIOME LOOT TABLES
  // ============================

  const BIOME_LOOT_TABLES = {
    forest: {
      common: ["wood", "fiber", "herb", "feather"],
      uncommon: ["elven_wood", "essence", "silk"],
      rare: ["elven_wood", "moonstone"],
      epic: ["star_fragment"],
    },
    desert: {
      common: ["stone", "bone", "coal"],
      uncommon: ["copper_ore", "amber", "crystal"],
      rare: ["gold_ore", "obsidian"],
      epic: ["orichalcum", "chaos_shard"],
    },
    tundra: {
      common: ["bone", "leather", "iron_ore"],
      uncommon: ["silver_ore", "crystal"],
      rare: ["ice_core", "moonstone"],
      epic: ["ether", "celestial_silk"],
    },
    volcano: {
      common: ["coal", "stone", "iron_ore"],
      uncommon: ["copper_ore", "venom"],
      rare: ["obsidian", "phoenix_feather", "blood_ruby"],
      epic: ["dragon_heart", "chaos_shard"],
      legendary: ["eternal_flame"],
    },
    ocean: {
      common: ["slime", "bone", "leather"],
      uncommon: ["pearl", "silk", "scales"],
      rare: ["mithril", "moonstone"],
      epic: ["soul_gem", "ether"],
    },
    mountains: {
      common: ["stone", "iron_ore", "bone"],
      uncommon: ["copper_ore", "silver_ore", "crystal"],
      rare: ["gold_ore", "mithril"],
      epic: ["adamantite", "titan_bone"],
    },
    swamp: {
      common: ["slime", "bone", "herb"],
      uncommon: ["venom", "mushroom", "silk"],
      rare: ["demon_horn", "void_crystal"],
      epic: ["soul_gem", "chaos_shard"],
    },
    ruins: {
      common: ["stone", "bone", "iron_ore"],
      uncommon: ["amber", "essence", "crystal"],
      rare: ["obsidian", "void_crystal", "blood_ruby"],
      epic: ["ancient_rune", "soul_gem", "orichalcum"],
      legendary: ["philosophers_stone", "time_shard"],
    },
    abyss: {
      common: ["bone", "coal"],
      uncommon: ["venom", "essence"],
      rare: ["void_crystal", "demon_horn", "blood_ruby"],
      epic: ["chaos_shard", "soul_gem", "titan_bone"],
      legendary: ["primordial_essence", "reality_stone", "cosmic_dust"],
    },
    heaven: {
      common: ["feather", "fiber"],
      uncommon: ["essence", "pearl", "silk"],
      rare: ["phoenix_feather", "moonstone", "elven_wood"],
      epic: ["star_fragment", "celestial_silk", "ancient_rune"],
      legendary: [
        "god_fragment",
        "world_tree_seed",
        "infinity_crystal",
        "divine_metal",
      ],
    },
  };

  // ============================
  // BIOME LOOT SYSTEM CLASS
  // ============================

  class BiomeLootSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          baseLootSystem: null,
          eventBus: null,
          debug: false,
        },
        options
      );

      this.currentBiome = "forest";
      this.materialInventory = new Map();
      this.biomeProgress = new Map();

      // Initialize biome progress
      Object.keys(BIOMES).forEach((biomeId) => {
        this.biomeProgress.set(biomeId, {
          visited: false,
          cleared: false,
          enemiesKilled: 0,
          materialsFound: 0,
        });
      });

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("biome_loot:ready");

      return this;
    }

    /**
     * Set current biome
     * @param {string} biomeId - Biome ID
     */
    setBiome(biomeId) {
      if (!BIOMES[biomeId]) return false;

      this.currentBiome = biomeId;

      const progress = this.biomeProgress.get(biomeId);
      if (!progress.visited) {
        progress.visited = true;
        this._emit("biome:visited", { biome: BIOMES[biomeId] });
      }

      return true;
    }

    /**
     * Roll biome-specific loot
     * @param {Object} options - Options (luck, quantity, etc.)
     * @returns {Array} Material drops
     */
    rollBiomeLoot(options = {}) {
      const biome = BIOMES[this.currentBiome];
      const table = BIOME_LOOT_TABLES[this.currentBiome];
      const luck = (options.luck || 0) * biome.luckMod;
      const quantity = options.quantity || 1;

      const materials = [];

      for (let i = 0; i < quantity; i++) {
        const roll = Math.random() + luck * 0.01;

        let material = null;

        // Legendary (0.1% + luck)
        if (table.legendary && roll > 0.999) {
          material = this._pickRandom(table.legendary);
        }
        // Epic (1% + luck)
        else if (table.epic && roll > 0.99) {
          material = this._pickRandom(table.epic);
        }
        // Rare (5% + luck)
        else if (table.rare && roll > 0.95) {
          material = this._pickRandom(table.rare);
        }
        // Uncommon (20% + luck)
        else if (table.uncommon && roll > 0.8) {
          material = this._pickRandom(table.uncommon);
        }
        // Common (74%)
        else {
          material = this._pickRandom(table.common);
        }

        if (material) {
          materials.push(this._generateMaterial(material));
          this.addMaterial(material, 1);
        }
      }

      // Update biome progress
      const progress = this.biomeProgress.get(this.currentBiome);
      progress.materialsFound += materials.length;

      this._emit("biome:loot_rolled", { biome, materials });

      return materials;
    }

    /**
     * Add material to inventory
     * @param {string} materialId - Material ID
     * @param {number} quantity - Quantity
     */
    addMaterial(materialId, quantity = 1) {
      const current = this.materialInventory.get(materialId) || 0;
      this.materialInventory.set(materialId, current + quantity);

      this._emit("material:added", {
        material: MATERIALS[materialId],
        quantity,
      });
    }

    /**
     * Remove material from inventory
     * @param {string} materialId - Material ID
     * @param {number} quantity - Quantity
     * @returns {boolean} Success
     */
    removeMaterial(materialId, quantity = 1) {
      const current = this.materialInventory.get(materialId) || 0;

      if (current < quantity) return false;

      this.materialInventory.set(materialId, current - quantity);
      return true;
    }

    /**
     * Get material count
     * @param {string} materialId - Material ID
     * @returns {number}
     */
    getMaterialCount(materialId) {
      return this.materialInventory.get(materialId) || 0;
    }

    /**
     * Get all materials
     * @returns {Object}
     */
    getAllMaterials() {
      const result = {};
      for (const [id, count] of this.materialInventory) {
        result[id] = {
          material: MATERIALS[id],
          count,
        };
      }
      return result;
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        currentBiome: this.currentBiome,
        materialInventory: Array.from(this.materialInventory.entries()),
        biomeProgress: Array.from(this.biomeProgress.entries()),
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.currentBiome = data.currentBiome || "forest";

      this.materialInventory.clear();
      if (data.materialInventory) {
        data.materialInventory.forEach(([id, count]) => {
          this.materialInventory.set(id, count);
        });
      }

      if (data.biomeProgress) {
        data.biomeProgress.forEach(([id, progress]) => {
          this.biomeProgress.set(id, progress);
        });
      }

      this._emit("biome_loot:loaded");
    }

    // Private methods
    _generateMaterial(materialId) {
      const material = MATERIALS[materialId];

      return {
        type: "material",
        id: materialId,
        name: material.name,
        rarity: material.rarity,
        icon: material.icon,
        value: material.value,
        quantity: 1,
      };
    }

    _pickRandom(array) {
      return array[Math.floor(Math.random() * array.length)];
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[BiomeLootSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  BiomeLootSystem.BIOMES = BIOMES;
  BiomeLootSystem.MATERIALS = MATERIALS;
  BiomeLootSystem.BIOME_LOOT_TABLES = BIOME_LOOT_TABLES;

  return BiomeLootSystem;
});

