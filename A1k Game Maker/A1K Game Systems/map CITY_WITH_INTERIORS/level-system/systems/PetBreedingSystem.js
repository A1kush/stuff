/**
 * PetBreedingSystem.js - Pet Breeding & Genetics
 * @version 1.0.0
 * @description Breed pets to create new species, inherit stats, discover hybrids
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PetBreedingSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // HYBRID PETS (20 Special Breeds)
  // ============================

  const HYBRID_PETS = {
    // Elemental Hybrids (10)
    storm_wolf: {
      id: "storm_wolf",
      name: "Storm Wolf",
      parents: ["wolf", "bird"],
      rarity: "rare",
      icon: "⚡🐺",
      element: "lightning",
      baseStats: { hp: 150, atk: 40, def: 20 },
      ability: { name: "Thunder Howl", effect: "lightning_aoe", value: 60 },
    },
    lava_slime: {
      id: "lava_slime",
      name: "Lava Slime",
      parents: ["slime", "dragon"],
      rarity: "epic",
      icon: "🔥🟢",
      element: "fire",
      baseStats: { hp: 200, atk: 50, def: 30 },
      ability: { name: "Magma Burst", effect: "burn_area", value: 40 },
    },
    frost_phoenix: {
      id: "frost_phoenix",
      name: "Frost Phoenix",
      parents: ["phoenix", "turtle"],
      rarity: "legendary",
      icon: "❄️🔥",
      element: "ice",
      baseStats: { hp: 300, atk: 80, def: 50 },
      ability: { name: "Frozen Rebirth", effect: "freeze_revive", value: 1 },
    },
    shadow_dragon: {
      id: "shadow_dragon",
      name: "Shadow Dragon",
      parents: ["dragon", "bat"],
      rarity: "legendary",
      icon: "🌑🐲",
      element: "dark",
      baseStats: { hp: 400, atk: 120, def: 60 },
      ability: { name: "Eclipse Breath", effect: "dark_dmg", value: 150 },
    },
    crystal_unicorn: {
      id: "crystal_unicorn",
      name: "Crystal Unicorn",
      parents: ["unicorn", "golem"],
      rarity: "mythic",
      icon: "💎🦄",
      element: "earth",
      baseStats: { hp: 500, atk: 70, def: 100 },
      ability: { name: "Crystal Heal", effect: "aoe_heal", value: 80 },
    },

    // Legendary Hybrids (10)
    chaos_beast: {
      id: "chaos_beast",
      name: "Chaos Beast",
      parents: ["cerberus", "griffin"],
      rarity: "legendary",
      icon: "🌀",
      element: "chaos",
      baseStats: { hp: 600, atk: 150, def: 80 },
      ability: { name: "Chaos Storm", effect: "random_effects", value: 5 },
    },
    void_leviathan: {
      id: "void_leviathan",
      name: "Void Leviathan",
      parents: ["kraken", "void_dragon"],
      rarity: "mythic",
      icon: "🕳️🐋",
      element: "void",
      baseStats: { hp: 1200, atk: 180, def: 120 },
      ability: { name: "Void Tsunami", effect: "void_aoe", value: 200 },
    },
    celestial_seraph: {
      id: "celestial_seraph",
      name: "Celestial Seraph",
      parents: ["seraphim", "pegasus"],
      rarity: "divine",
      icon: "☁️👼",
      element: "divine",
      baseStats: { hp: 800, atk: 100, def: 100 },
      ability: { name: "Divine Blessing", effect: "team_buff", value: 100 },
    },
    time_phoenix: {
      id: "time_phoenix",
      name: "Chronos Phoenix",
      parents: ["phoenix", "time_dragon"],
      rarity: "divine",
      icon: "⏰🔥",
      element: "time",
      baseStats: { hp: 1000, atk: 200, def: 100 },
      ability: { name: "Time Loop", effect: "revive_all", value: 1 },
    },
    primordial_dragon: {
      id: "primordial_dragon",
      name: "Primordial Dragon",
      parents: ["void_dragon", "world_tree"],
      rarity: "transcendent",
      icon: "🌌🐉",
      element: "primordial",
      baseStats: { hp: 2000, atk: 300, def: 200 },
      ability: {
        name: "Genesis Wave",
        effect: "ultimate_power",
        value: 500,
      },
    },
  };

  const HYBRID_KEYS = Object.keys(HYBRID_PETS);

  // ============================
  // PET BREEDING SYSTEM CLASS
  // ============================

  class PetBreedingSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          breedingCost: 10000,
          breedingTime: 86400000, // 24 hours
          petSystem: null,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Breeding ID -> Breeding data */
      this.activeBreedings = new Map();

      /** @type {Set<string>} Discovered hybrids */
      this.discoveredHybrids = new Set();

      /** @type {Object} Statistics */
      this.stats = {
        totalBreedings: 0,
        successfulBreedings: 0,
        hybridsDiscovered: 0,
      };

      this.petSystem = this.options.petSystem;
      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("breeding:ready", { possibleHybrids: HYBRID_KEYS.length });

      return this;
    }

    /**
     * Start breeding two pets
     * @param {string} playerId - Player ID
     * @param {string} pet1Id - Pet 1 ID
     * @param {string} pet2Id - Pet 2 ID
     * @returns {Object} Breeding data
     */
    startBreeding(playerId, pet1Id, pet2Id) {
      if (!this.petSystem) return { error: "Pet system not connected" };

      const pets = this.petSystem.getCollection(playerId);
      const pet1 = pets.find((p) => p.id === pet1Id);
      const pet2 = pets.find((p) => p.id === pet2Id);

      if (!pet1 || !pet2) return { error: "Invalid pets" };

      // Check if pets can breed
      if (pet1.level < 25 || pet2.level < 25) {
        return { error: "Pets must be level 25+" };
      }

      const breedingId = `breeding_${Date.now()}`;

      const breeding = {
        id: breedingId,
        playerId,
        parent1: pet1Id,
        parent2: pet2Id,
        parent1Species: pet1.speciesId,
        parent2Species: pet2.speciesId,
        startTime: Date.now(),
        endTime: Date.now() + this.options.breedingTime,
        completed: false,
      };

      this.activeBreedings.set(breedingId, breeding);

      this.stats.totalBreedings++;

      // Auto-complete after time
      setTimeout(() => this.completeBreeding(breedingId), this.options.breedingTime);

      this._emit("breeding:started", { breeding });

      return breeding;
    }

    /**
     * Complete breeding
     * @param {string} breedingId - Breeding ID
     * @returns {Object} New pet
     */
    completeBreeding(breedingId) {
      const breeding = this.activeBreedings.get(breedingId);
      if (!breeding || breeding.completed) return null;

      breeding.completed = true;

      // Check for hybrid match
      const hybrid = this._findHybrid(
        breeding.parent1Species,
        breeding.parent2Species
      );

      let newPet = null;

      if (hybrid) {
        // Hybrid discovered!
        newPet = this.petSystem?.obtainPet(breeding.playerId, hybrid.id);

        if (!this.discoveredHybrids.has(hybrid.id)) {
          this.discoveredHybrids.add(hybrid.id);
          this.stats.hybridsDiscovered++;

          this._emit("hybrid:discovered", { hybrid });
        }
      } else {
        // Random parent species
        const speciesId = Math.random() < 0.5 ? breeding.parent1Species : breeding.parent2Species;
        newPet = this.petSystem?.obtainPet(breeding.playerId, speciesId);
      }

      this.stats.successfulBreedings++;

      this.activeBreedings.delete(breedingId);

      this._emit("breeding:complete", { breedingId, newPet, hybrid: !!hybrid });

      return newPet;
    }

    /**
     * Get active breedings
     * @param {string} playerId - Player ID
     * @returns {Array} Breedings
     */
    getActiveBreedings(playerId) {
      return Array.from(this.activeBreedings.values()).filter(
        (b) => b.playerId === playerId
      );
    }

    /**
     * Get breeding compatibility
     * @param {string} species1 - Species 1 ID
     * @param {string} species2 - Species 2 ID
     * @returns {Object} Compatibility info
     */
    getCompatibility(species1, species2) {
      const hybrid = this._findHybrid(species1, species2);

      if (hybrid) {
        const discovered = this.discoveredHybrids.has(hybrid.id);

        return {
          compatible: true,
          hybrid: discovered ? hybrid : { name: "???", rarity: "unknown" },
          discovered,
        };
      }

      return {
        compatible: true,
        hybrid: null,
        outcome: "Random parent species",
      };
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        activeBreedings: Array.from(this.activeBreedings.entries()),
        discoveredHybrids: Array.from(this.discoveredHybrids),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.activeBreedings.clear();
      if (data.activeBreedings) {
        data.activeBreedings.forEach(([id, breeding]) => {
          this.activeBreedings.set(id, breeding);
        });
      }

      this.discoveredHybrids.clear();
      if (data.discoveredHybrids) {
        data.discoveredHybrids.forEach((id) => this.discoveredHybrids.add(id));
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("breeding:loaded");
    }

    // Private methods
    _findHybrid(species1, species2) {
      for (const hybrid of Object.values(HYBRID_PETS)) {
        const parents = hybrid.parents.sort();
        const test = [species1, species2].sort();

        if (parents[0] === test[0] && parents[1] === test[1]) {
          return hybrid;
        }
      }

      return null;
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[PetBreedingSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  PetBreedingSystem.HYBRID_PETS = HYBRID_PETS;
  PetBreedingSystem.HYBRID_KEYS = HYBRID_KEYS;

  return PetBreedingSystem;
});

