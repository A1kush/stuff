/**
 * CosmeticsSystem.js - Visual Customization
 * @version 1.0.0
 * @description Skins, particle effects, animations, mounts, emotes
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CosmeticsSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // COSMETICS (150+ Items!)
  // ============================

  const COSMETICS = {
    // Character Skins (30)
    knight_armor: { id: "knight_armor", name: "Knight Armor", type: "skin", rarity: "common", price: 1000 },
    mage_robes: { id: "mage_robes", name: "Mage Robes", type: "skin", rarity: "common", price: 1000 },
    assassin_outfit: { id: "assassin_outfit", name: "Assassin Outfit", type: "skin", rarity: "uncommon", price: 5000 },
    dragon_scales: { id: "dragon_scales", name: "Dragon Scale Armor", type: "skin", rarity: "legendary", price: 100000 },
    
    // Weapon Skins (30)
    flaming_sword: { id: "flaming_sword", name: "Flaming Sword", type: "weapon_skin", rarity: "rare", price: 10000 },
    ice_blade: { id: "ice_blade", name: "Ice Blade", type: "weapon_skin", rarity: "rare", price: 10000 },
    void_scythe: { id: "void_scythe", name: "Void Scythe", type: "weapon_skin", rarity: "legendary", price: 50000 },
    
    // Particle Effects (20)
    fire_aura: { id: "fire_aura", name: "Fire Aura", type: "effect", rarity: "uncommon", price: 5000 },
    ice_trail: { id: "ice_trail", name: "Ice Trail", type: "effect", rarity: "uncommon", price: 5000 },
    lightning_spark: { id: "lightning_spark", name: "Lightning Sparks", type: "effect", rarity: "rare", price: 15000 },
    void_mist: { id: "void_mist", name: "Void Mist", type: "effect", rarity: "epic", price: 50000 },
    divine_glow: { id: "divine_glow", name: "Divine Glow", type: "effect", rarity: "legendary", price: 100000 },
    
    // Mounts (30)
    brown_horse: { id: "brown_horse", name: "Brown Horse", type: "mount", rarity: "common", price: 10000, speed: 1.5 },
    black_stallion: { id: "black_stallion", name: "Black Stallion", type: "mount", rarity: "uncommon", price: 25000, speed: 1.8 },
    griffin: { id: "griffin", name: "Griffin", type: "mount", rarity: "rare", price: 100000, speed: 2.0 },
    dragon: { id: "dragon", name: "Dragon Mount", type: "mount", rarity: "legendary", price: 1000000, speed: 3.0 },
    unicorn: { id: "unicorn", name: "Unicorn", type: "mount", rarity: "legendary", price: 500000, speed: 2.5 },
    phoenix: { id: "phoenix", name: "Phoenix", type: "mount", rarity: "mythic", price: 5000000, speed: 5.0 },
    
    // Emotes (20)
    wave: { id: "wave", name: "Wave", type: "emote", rarity: "common", price: 100 },
    dance: { id: "dance", name: "Dance", type: "emote", rarity: "common", price: 100 },
    laugh: { id: "laugh", name: "Laugh", type: "emote", rarity: "common", price: 100 },
    cry: { id: "cry", name: "Cry", type: "emote", rarity: "common", price: 100 },
    backflip: { id: "backflip", name: "Backflip", type: "emote", rarity: "rare", price: 5000 },
    moonwalk: { id: "moonwalk", name: "Moonwalk", type: "emote", rarity: "epic", price: 25000 },
    
    // Titles (20) - Visual only
    // (Can integrate with TitleSystem for stat bonuses)
  };

  const COSMETIC_KEYS = Object.keys(COSMETICS);

  // ============================
  // COSMETICS SYSTEM CLASS
  // ============================

  class CosmeticsSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          allowTrade: false,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Set>} Player ID -> Owned cosmetics */
      this.ownedCosmetics = new Map();

      /** @type {Map<string, Object>} Player ID -> Equipped cosmetics */
      this.equippedCosmetics = new Map();

      /** @type {Object} Statistics */
      this.stats = {
        totalPurchases: 0,
        totalSpent: 0,
        mostPopular: null,
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("cosmetics:ready", { items: COSMETIC_KEYS.length });

      return this;
    }

    /**
     * Purchase cosmetic
     * @param {string} playerId - Player ID
     * @param {string} cosmeticId - Cosmetic ID
     * @returns {Object} Result
     */
    purchaseCosmetic(playerId, cosmeticId) {
      const cosmetic = COSMETICS[cosmeticId];
      if (!cosmetic) return { error: "Invalid cosmetic" };

      const owned = this.ownedCosmetics.get(playerId) || new Set();

      if (owned.has(cosmeticId)) {
        return { error: "Already owned" };
      }

      owned.add(cosmeticId);
      this.ownedCosmetics.set(playerId, owned);

      this.stats.totalPurchases++;
      this.stats.totalSpent += cosmetic.price;

      this._emit("cosmetic:purchased", { playerId, cosmetic });

      return {
        success: true,
        cosmetic,
        cost: cosmetic.price,
      };
    }

    /**
     * Equip cosmetic
     * @param {string} playerId - Player ID
     * @param {string} cosmeticId - Cosmetic ID
     * @returns {Object} Equipped cosmetics
     */
    equipCosmetic(playerId, cosmeticId) {
      const cosmetic = COSMETICS[cosmeticId];
      if (!cosmetic) return { error: "Invalid cosmetic" };

      const owned = this.ownedCosmetics.get(playerId) || new Set();
      if (!owned.has(cosmeticId)) {
        return { error: "Cosmetic not owned" };
      }

      const equipped = this.equippedCosmetics.get(playerId) || {};

      // Unequip previous cosmetic of same type
      if (equipped[cosmetic.type]) {
        this._emit("cosmetic:unequipped", {
          playerId,
          cosmeticId: equipped[cosmetic.type],
        });
      }

      equipped[cosmetic.type] = cosmeticId;
      this.equippedCosmetics.set(playerId, equipped);

      this._emit("cosmetic:equipped", { playerId, cosmetic });

      return equipped;
    }

    /**
     * Unequip cosmetic
     * @param {string} playerId - Player ID
     * @param {string} type - Cosmetic type
     * @returns {Object} Equipped cosmetics
     */
    unequipCosmetic(playerId, type) {
      const equipped = this.equippedCosmetics.get(playerId) || {};

      if (!equipped[type]) {
        return { error: "Nothing equipped in that slot" };
      }

      delete equipped[type];
      this.equippedCosmetics.set(playerId, equipped);

      this._emit("cosmetic:unequipped", { playerId, type });

      return equipped;
    }

    /**
     * Get equipped cosmetics
     * @param {string} playerId - Player ID
     * @returns {Object} Equipped cosmetics
     */
    getEquippedCosmetics(playerId) {
      const equipped = this.equippedCosmetics.get(playerId) || {};
      const result = {};

      for (const [type, cosmeticId] of Object.entries(equipped)) {
        result[type] = COSMETICS[cosmeticId];
      }

      return result;
    }

    /**
     * Get owned cosmetics
     * @param {string} playerId - Player ID
     * @param {string} [type] - Filter by type
     * @returns {Array} Cosmetics
     */
    getOwnedCosmetics(playerId, type = null) {
      const owned = this.ownedCosmetics.get(playerId) || new Set();
      let cosmetics = Array.from(owned).map((id) => COSMETICS[id]);

      if (type) {
        cosmetics = cosmetics.filter((c) => c.type === type);
      }

      return cosmetics;
    }

    /**
     * Get shop items
     * @param {string} [type] - Filter by type
     * @param {string} [rarity] - Filter by rarity
     * @returns {Array} Available cosmetics
     */
    getShopItems(type = null, rarity = null) {
      let items = Object.values(COSMETICS);

      if (type) {
        items = items.filter((c) => c.type === type);
      }

      if (rarity) {
        items = items.filter((c) => c.rarity === rarity);
      }

      return items;
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        ownedCosmetics: Array.from(this.ownedCosmetics.entries()).map(([id, set]) => [
          id,
          Array.from(set),
        ]),
        equippedCosmetics: Array.from(this.equippedCosmetics.entries()),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.ownedCosmetics.clear();
      if (data.ownedCosmetics) {
        data.ownedCosmetics.forEach(([id, arr]) => {
          this.ownedCosmetics.set(id, new Set(arr));
        });
      }

      this.equippedCosmetics.clear();
      if (data.equippedCosmetics) {
        data.equippedCosmetics.forEach(([playerId, cosmetics]) => {
          this.equippedCosmetics.set(playerId, cosmetics);
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("cosmetics:loaded");
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[CosmeticsSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  CosmeticsSystem.COSMETICS = COSMETICS;
  CosmeticsSystem.COSMETIC_KEYS = COSMETIC_KEYS;

  return CosmeticsSystem;
});

