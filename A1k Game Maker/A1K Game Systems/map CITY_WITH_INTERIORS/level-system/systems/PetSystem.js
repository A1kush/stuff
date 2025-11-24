/**
 * PetSystem.js - Pet/Companion Collection & Abilities
 * @version 1.0.0
 * @description Collectible pets with stats, abilities, evolution
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PetSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // PET SPECIES (30 Pets!)
  // ============================

  const PET_SPECIES = {
    // Common Pets (10)
    slime: {
      id: "slime",
      name: "Slime",
      rarity: "common",
      icon: "🟢",
      element: "neutral",
      baseStats: { hp: 50, atk: 5, def: 3 },
      ability: { name: "Bounce", effect: "dodge", value: 0.05 },
      evolution: "mega_slime",
    },
    wolf: {
      id: "wolf",
      name: "Wolf",
      rarity: "common",
      icon: "🐺",
      element: "neutral",
      baseStats: { hp: 80, atk: 12, def: 5 },
      ability: { name: "Howl", effect: "atk_buff", value: 10 },
      evolution: "dire_wolf",
    },
    bat: {
      id: "bat",
      name: "Bat",
      rarity: "common",
      icon: "🦇",
      element: "dark",
      baseStats: { hp: 40, atk: 8, def: 2 },
      ability: { name: "Screech", effect: "spd_buff", value: 5 },
      evolution: "vampire_bat",
    },
    rat: {
      id: "rat",
      name: "Rat",
      rarity: "common",
      icon: "🐀",
      element: "neutral",
      baseStats: { hp: 30, atk: 6, def: 2 },
      ability: { name: "Scavenge", effect: "gold_bonus", value: 0.05 },
      evolution: "plague_rat",
    },
    bird: {
      id: "bird",
      name: "Bird",
      rarity: "common",
      icon: "🐦",
      element: "wind",
      baseStats: { hp: 35, atk: 10, def: 2 },
      ability: { name: "Scout", effect: "xp_bonus", value: 0.05 },
      evolution: "eagle",
    },
    cat: {
      id: "cat",
      name: "Cat",
      rarity: "common",
      icon: "🐱",
      element: "neutral",
      baseStats: { hp: 45, atk: 9, def: 3 },
      ability: { name: "Lucky Paw", effect: "luk_bonus", value: 5 },
      evolution: "panther",
    },
    spider: {
      id: "spider",
      name: "Spider",
      rarity: "common",
      icon: "🕷️",
      element: "poison",
      baseStats: { hp: 40, atk: 7, def: 3 },
      ability: { name: "Web", effect: "slow_enemy", value: 0.1 },
      evolution: "arachne",
    },
    snake: {
      id: "snake",
      name: "Snake",
      rarity: "common",
      icon: "🐍",
      element: "poison",
      baseStats: { hp: 50, atk: 11, def: 4 },
      ability: { name: "Venom", effect: "poison_damage", value: 10 },
      evolution: "basilisk",
    },
    rabbit: {
      id: "rabbit",
      name: "Rabbit",
      rarity: "common",
      icon: "🐰",
      element: "neutral",
      baseStats: { hp: 35, atk: 7, def: 2 },
      ability: { name: "Quick Feet", effect: "dodge", value: 0.08 },
      evolution: "horned_rabbit",
    },
    turtle: {
      id: "turtle",
      name: "Turtle",
      rarity: "common",
      icon: "🐢",
      element: "water",
      baseStats: { hp: 100, atk: 5, def: 15 },
      ability: { name: "Shell", effect: "def_bonus", value: 10 },
      evolution: "dragon_turtle",
    },

    // Rare Pets (10)
    phoenix: {
      id: "phoenix",
      name: "Phoenix",
      rarity: "rare",
      icon: "🔥",
      element: "fire",
      baseStats: { hp: 150, atk: 30, def: 10 },
      ability: { name: "Rebirth", effect: "revive", value: 1 },
      evolution: "eternal_phoenix",
    },
    dragon: {
      id: "dragon",
      name: "Baby Dragon",
      rarity: "rare",
      icon: "🐲",
      element: "fire",
      baseStats: { hp: 200, atk: 40, def: 20 },
      ability: { name: "Flame Breath", effect: "fire_damage", value: 50 },
      evolution: "ancient_dragon",
    },
    unicorn: {
      id: "unicorn",
      name: "Unicorn",
      rarity: "rare",
      icon: "🦄",
      element: "light",
      baseStats: { hp: 120, atk: 25, def: 15 },
      ability: { name: "Healing Horn", effect: "heal", value: 30 },
      evolution: "celestial_unicorn",
    },
    griffin: {
      id: "griffin",
      name: "Griffin",
      rarity: "rare",
      icon: "🦅",
      element: "wind",
      baseStats: { hp: 140, atk: 35, def: 12 },
      ability: { name: "Dive Attack", effect: "crit_bonus", value: 0.15 },
      evolution: "royal_griffin",
    },
    fairy: {
      id: "fairy",
      name: "Fairy",
      rarity: "rare",
      icon: "🧚",
      element: "light",
      baseStats: { hp: 80, atk: 20, def: 8 },
      ability: { name: "Magic Dust", effect: "mag_bonus", value: 20 },
      evolution: "fairy_queen",
    },
    golem: {
      id: "golem",
      name: "Golem",
      rarity: "rare",
      icon: "🗿",
      element: "earth",
      baseStats: { hp: 300, atk: 20, def: 40 },
      ability: { name: "Stone Skin", effect: "damage_reduction", value: 0.1 },
      evolution: "titan_golem",
    },
    kitsune: {
      id: "kitsune",
      name: "Kitsune",
      rarity: "rare",
      icon: "🦊",
      element: "magic",
      baseStats: { hp: 100, atk: 30, def: 10 },
      ability: { name: "Illusion", effect: "dodge", value: 0.15 },
      evolution: "nine_tail_fox",
    },
    cerberus: {
      id: "cerberus",
      name: "Cerberus",
      rarity: "rare",
      icon: "🐕",
      element: "dark",
      baseStats: { hp: 180, atk: 45, def: 15 },
      ability: { name: "Triple Bite", effect: "multi_hit", value: 3 },
      evolution: "hell_hound",
    },
    pegasus: {
      id: "pegasus",
      name: "Pegasus",
      rarity: "rare",
      icon: "🦄",
      element: "wind",
      baseStats: { hp: 120, atk: 28, def: 12 },
      ability: { name: "Sky Charge", effect: "spd_bonus", value: 20 },
      evolution: "celestial_pegasus",
    },
    kraken: {
      id: "kraken",
      name: "Baby Kraken",
      rarity: "rare",
      icon: "🦑",
      element: "water",
      baseStats: { hp: 160, atk: 38, def: 18 },
      ability: { name: "Tentacle Grab", effect: "stun_chance", value: 0.1 },
      evolution: "elder_kraken",
    },

    // Legendary Pets (10)
    god_wolf: {
      id: "god_wolf",
      name: "Fenrir",
      rarity: "legendary",
      icon: "🐺",
      element: "divine",
      baseStats: { hp: 500, atk: 100, def: 50 },
      ability: { name: "Ragnarok", effect: "ultimate_damage", value: 200 },
      evolution: null,
    },
    void_dragon: {
      id: "void_dragon",
      name: "Void Dragon",
      rarity: "legendary",
      icon: "🐉",
      element: "void",
      baseStats: { hp: 800, atk: 150, def: 80 },
      ability: { name: "Void Breath", effect: "ignore_def", value: 0.5 },
      evolution: null,
    },
    leviathan: {
      id: "leviathan",
      name: "Leviathan",
      rarity: "legendary",
      icon: "🐋",
      element: "water",
      baseStats: { hp: 1000, atk: 120, def: 100 },
      ability: { name: "Tidal Wave", effect: "aoe_damage", value: 80 },
      evolution: null,
    },
    behemoth: {
      id: "behemoth",
      name: "Behemoth",
      rarity: "legendary",
      icon: "🦏",
      element: "earth",
      baseStats: { hp: 1500, atk: 100, def: 150 },
      ability: { name: "Earthquake", effect: "stun_all", value: 2 },
      evolution: null,
    },
    seraphim: {
      id: "seraphim",
      name: "Seraphim",
      rarity: "legendary",
      icon: "👼",
      element: "light",
      baseStats: { hp: 600, atk: 80, def: 60 },
      ability: { name: "Divine Light", effect: "heal_all", value: 100 },
      evolution: null,
    },
    demon_lord: {
      id: "demon_lord",
      name: "Demon Lord",
      rarity: "legendary",
      icon: "😈",
      element: "dark",
      baseStats: { hp: 700, atk: 180, def: 70 },
      ability: { name: "Dark Pact", effect: "lifesteal", value: 0.2 },
      evolution: null,
    },
    time_dragon: {
      id: "time_dragon",
      name: "Chronos",
      rarity: "legendary",
      icon: "⏰",
      element: "time",
      baseStats: { hp: 900, atk: 90, def: 90 },
      ability: { name: "Time Stop", effect: "freeze_all", value: 3 },
      evolution: null,
    },
    world_tree: {
      id: "world_tree",
      name: "Yggdrasil Sapling",
      rarity: "legendary",
      icon: "🌳",
      element: "nature",
      baseStats: { hp: 2000, atk: 50, def: 200 },
      ability: { name: "Life Force", effect: "regen", value: 50 },
      evolution: null,
    },
    star_beast: {
      id: "star_beast",
      name: "Star Beast",
      rarity: "legendary",
      icon: "⭐",
      element: "cosmic",
      baseStats: { hp: 800, atk: 140, def: 80 },
      ability: { name: "Meteor", effect: "aoe_damage", value: 150 },
      evolution: null,
    },
    primordial: {
      id: "primordial",
      name: "Primordial",
      rarity: "legendary",
      icon: "🌌",
      element: "chaos",
      baseStats: { hp: 1200, atk: 160, def: 120 },
      ability: { name: "Chaos Orb", effect: "all_stats", value: 50 },
      evolution: null,
    },
  };

  const PET_KEYS = Object.keys(PET_SPECIES);

  // ============================
  // PET SYSTEM CLASS
  // ============================

  class PetSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          maxActivePets: 3,
          maxCollectionSize: 100,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Player ID -> Pet collection */
      this.playerPets = new Map();

      /** @type {Map<string, Array>} Player ID -> Active pets */
      this.activePets = new Map();

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("pets:ready", { species: PET_KEYS.length });

      return this;
    }

    /**
     * Obtain a new pet
     * @param {string} playerId - Player ID
     * @param {string} speciesId - Pet species ID
     * @returns {Object} Pet data
     */
    obtainPet(playerId, speciesId) {
      const species = PET_SPECIES[speciesId];
      if (!species) return null;

      const collection = this.playerPets.get(playerId) || [];

      // Check collection limit
      if (collection.length >= this.options.maxCollectionSize) {
        return { error: "Collection full" };
      }

      // Create pet instance
      const petId = `pet_${playerId}_${Date.now()}`;

      const pet = {
        id: petId,
        speciesId,
        name: species.name,
        nickname: null,
        rarity: species.rarity,
        icon: species.icon,
        element: species.element,
        level: 1,
        xp: 0,
        stats: { ...species.baseStats },
        ability: { ...species.ability },
        evolution: species.evolution,
        friendship: 0,
        obtainedAt: Date.now(),
      };

      collection.push(pet);
      this.playerPets.set(playerId, collection);

      this._emit("pet:obtained", { playerId, pet });

      return pet;
    }

    /**
     * Set active pets
     * @param {string} playerId - Player ID
     * @param {Array} petIds - Pet IDs to activate
     * @returns {boolean} Success
     */
    setActivePets(playerId, petIds) {
      if (petIds.length > this.options.maxActivePets) return false;

      const collection = this.playerPets.get(playerId) || [];

      // Verify all pets exist in collection
      const validPets = petIds.every((id) =>
        collection.some((p) => p.id === id)
      );

      if (!validPets) return false;

      this.activePets.set(playerId, petIds);

      this._emit("pets:activated", { playerId, petIds });

      return true;
    }

    /**
     * Feed pet (gain XP & friendship)
     * @param {string} playerId - Player ID
     * @param {string} petId - Pet ID
     * @param {number} xpAmount - XP amount
     * @returns {Object} Result
     */
    feedPet(playerId, petId, xpAmount = 100) {
      const pet = this._findPet(playerId, petId);
      if (!pet) return null;

      pet.xp += xpAmount;
      pet.friendship = Math.min(100, pet.friendship + 1);

      // Level up check
      const xpNeeded = this._getXPNeeded(pet.level);

      if (pet.xp >= xpNeeded) {
        pet.level++;
        pet.xp -= xpNeeded;

        // Scale stats
        this._scalePetStats(pet);

        this._emit("pet:level_up", { playerId, pet });
      }

      return { pet, leveled: pet.xp >= xpNeeded };
    }

    /**
     * Evolve pet
     * @param {string} playerId - Player ID
     * @param {string} petId - Pet ID
     * @returns {Object|null} Evolved pet
     */
    evolvePet(playerId, petId) {
      const pet = this._findPet(playerId, petId);
      if (!pet) return null;

      const species = PET_SPECIES[pet.speciesId];
      if (!species.evolution) return { error: "Cannot evolve" };

      // Requirements: Level 50, Friendship 100
      if (pet.level < 50 || pet.friendship < 100) {
        return { error: "Requirements not met" };
      }

      const newSpecies = PET_SPECIES[species.evolution];
      if (!newSpecies) return null;

      // Evolve
      pet.speciesId = species.evolution;
      pet.name = newSpecies.name;
      pet.icon = newSpecies.icon;
      pet.rarity = newSpecies.rarity;
      pet.stats = { ...newSpecies.baseStats };
      pet.ability = { ...newSpecies.ability };
      pet.evolution = newSpecies.evolution;
      pet.level = 1; // Reset level
      pet.xp = 0;

      this._emit("pet:evolved", { playerId, pet });

      return pet;
    }

    /**
     * Get player's collection
     * @param {string} playerId - Player ID
     * @returns {Array} Pet collection
     */
    getCollection(playerId) {
      return this.playerPets.get(playerId) || [];
    }

    /**
     * Get active pets
     * @param {string} playerId - Player ID
     * @returns {Array} Active pets
     */
    getActivePets(playerId) {
      const activeIds = this.activePets.get(playerId) || [];
      const collection = this.getCollection(playerId);

      return activeIds
        .map((id) => collection.find((p) => p.id === id))
        .filter((p) => p);
    }

    /**
     * Get total pet bonuses
     * @param {string} playerId - Player ID
     * @returns {Object} Bonuses
     */
    getPetBonuses(playerId) {
      const active = this.getActivePets(playerId);

      const bonuses = {
        hp: 0,
        atk: 0,
        def: 0,
        spd: 0,
        mag: 0,
        luk: 0,
        xp: 1.0,
        gold: 1.0,
        dodge: 0,
        crit: 0,
      };

      active.forEach((pet) => {
        // Add stats
        bonuses.hp += pet.stats.hp || 0;
        bonuses.atk += pet.stats.atk || 0;
        bonuses.def += pet.stats.def || 0;

        // Add ability bonuses
        switch (pet.ability.effect) {
          case "xp_bonus":
            bonuses.xp += pet.ability.value;
            break;
          case "gold_bonus":
            bonuses.gold += pet.ability.value;
            break;
          case "atk_buff":
            bonuses.atk += pet.ability.value;
            break;
          case "def_bonus":
            bonuses.def += pet.ability.value;
            break;
          case "spd_bonus":
            bonuses.spd += pet.ability.value;
            break;
          case "mag_bonus":
            bonuses.mag += pet.ability.value;
            break;
          case "luk_bonus":
            bonuses.luk += pet.ability.value;
            break;
          case "dodge":
            bonuses.dodge += pet.ability.value;
            break;
          case "crit_bonus":
            bonuses.crit += pet.ability.value;
            break;
        }
      });

      return bonuses;
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        playerPets: Array.from(this.playerPets.entries()),
        activePets: Array.from(this.activePets.entries()),
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.playerPets.clear();
      if (data.playerPets) {
        data.playerPets.forEach(([playerId, pets]) => {
          this.playerPets.set(playerId, pets);
        });
      }

      this.activePets.clear();
      if (data.activePets) {
        data.activePets.forEach(([playerId, petIds]) => {
          this.activePets.set(playerId, petIds);
        });
      }

      this._emit("pets:loaded");
    }

    // Private methods
    _findPet(playerId, petId) {
      const collection = this.playerPets.get(playerId) || [];
      return collection.find((p) => p.id === petId);
    }

    _getXPNeeded(level) {
      return Math.floor(100 * Math.pow(level, 1.5));
    }

    _scalePetStats(pet) {
      const species = PET_SPECIES[pet.speciesId];
      if (!species) return;

      // Scale stats by level
      pet.stats.hp = Math.floor(species.baseStats.hp * (1 + pet.level * 0.1));
      pet.stats.atk = Math.floor(species.baseStats.atk * (1 + pet.level * 0.1));
      pet.stats.def = Math.floor(species.baseStats.def * (1 + pet.level * 0.1));
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[PetSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  PetSystem.PET_SPECIES = PET_SPECIES;
  PetSystem.PET_KEYS = PET_KEYS;

  return PetSystem;
});

