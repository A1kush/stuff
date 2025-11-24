/**
 * InventoryBagSystem.js - Complete Inventory & Bag Management
 * @version 1.0.0
 * @description 13 tabs, equipment, items, pets, skins, talents, vehicles, AI
 * Integrates data from bag-system-demo (89KB system!)
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.InventoryBagSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // BAG TABS (13 Categories!)
  // ============================

  const BAG_TABS = {
    items: {
      id: "items",
      name: "Items",
      icon: "📦",
      capacity: 999,
      categories: ["consumables", "materials", "quest_items"],
    },
    gear: {
      id: "gear",
      name: "Gear",
      icon: "⚔️",
      capacity: 200,
      slots: [
        "weapon",
        "offhand",
        "helmet",
        "chest",
        "legs",
        "boots",
        "gloves",
        "necklace",
        "ring1",
        "ring2",
      ],
    },
    pets: {
      id: "pets",
      name: "Pets",
      icon: "🐾",
      capacity: 100,
      activeSlots: 3,
    },
    skins: {
      id: "skins",
      name: "Skins",
      icon: "👤",
      capacity: 200,
      categories: ["character", "weapon", "pet", "mount"],
    },
    talents: {
      id: "talents",
      name: "Talents",
      icon: "⭐",
      capacity: 100,
      points: 0,
    },
    vehicles: {
      id: "vehicles",
      name: "Vehicles",
      icon: "🚗",
      capacity: 50,
      activeSlot: 1,
    },
    ai: {
      id: "ai",
      name: "AI Companions",
      icon: "🤖",
      capacity: 30,
      activeSlots: 2,
    },
    alchemy: {
      id: "alchemy",
      name: "Alchemy",
      icon: "⚗️",
      recipes: 50,
      materials: 100,
    },
    spirit: {
      id: "spirit",
      name: "Spirit",
      icon: "✨",
      capacity: 50,
      activeSlots: 1,
    },
    supernatural: {
      id: "supernatural",
      name: "Supernatural",
      icon: "🔮",
      capacity: 50,
      abilities: 30,
    },
    quests: {
      id: "quests",
      name: "Quests",
      icon: "📜",
      active: 10,
      completed: 999,
    },
    achievements: {
      id: "achievements",
      name: "Achievements",
      icon: "🏆",
      total: 100,
    },
    settings: {
      id: "settings",
      name: "Settings",
      icon: "⚙️",
      options: [
        "audio",
        "graphics",
        "controls",
        "interface",
      ],
    },
  };

  const TAB_KEYS = Object.keys(BAG_TABS);

  // ============================
  // ITEM RARITIES (10 Tiers)
  // ============================

  const RARITIES = {
    common: { tier: 1, color: "#9e9e9e", sellMultiplier: 1.0 },
    uncommon: { tier: 2, color: "#4caf50", sellMultiplier: 2.0 },
    rare: { tier: 3, color: "#2196f3", sellMultiplier: 5.0 },
    epic: { tier: 4, color: "#9c27b0", sellMultiplier: 10.0 },
    legendary: { tier: 5, color: "#ff9800", sellMultiplier: 25.0 },
    mythic: { tier: 6, color: "#e91e63", sellMultiplier: 50.0 },
    ancient: { tier: 7, color: "#00bcd4", sellMultiplier: 100.0 },
    divine: { tier: 8, color: "#ffeb3b", sellMultiplier: 250.0 },
    celestial: { tier: 9, color: "#fff", sellMultiplier: 500.0 },
    transcendent: { tier: 10, color: "#f0f", sellMultiplier: 1000.0 },
  };

  // ============================
  // INVENTORY BAG SYSTEM CLASS
  // ============================

  class InventoryBagSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          startingCapacity: 50,
          maxCapacity: 999,
          stackSize: 999,
          autoSort: false,
          enableFilters: true,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Map>} Player ID -> Inventory */
      this.inventories = new Map();

      /** @type {Map<string, Object>} Player ID -> Equipped items */
      this.equippedItems = new Map();

      /** @type {Map<string, Object>} Player ID -> Bag settings */
      this.bagSettings = new Map();

      /** @type {Object} Statistics */
      this.stats = {
        totalItems: 0,
        totalValue: 0,
        itemsSold: 0,
        itemsUsed: 0,
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("inventory:ready", { tabs: TAB_KEYS.length });

      return this;
    }

    /**
     * Initialize player inventory
     * @param {string} playerId - Player ID
     * @returns {Object} Inventory
     */
    initializeInventory(playerId) {
      const inventory = new Map();

      // Initialize each tab
      TAB_KEYS.forEach((tab) => {
        inventory.set(tab, []);
      });

      this.inventories.set(playerId, inventory);

      // Initialize equipped items
      this.equippedItems.set(playerId, {
        weapon: null,
        offhand: null,
        helmet: null,
        chest: null,
        legs: null,
        boots: null,
        gloves: null,
        necklace: null,
        ring1: null,
        ring2: null,
      });

      this._emit("inventory:initialized", { playerId });

      return inventory;
    }

    /**
     * Add item to inventory
     * @param {string} playerId - Player ID
     * @param {Object} item - Item data
     * @param {number} quantity - Quantity
     * @returns {Object} Result
     */
    addItem(playerId, item, quantity = 1) {
      const inventory = this.inventories.get(playerId);
      if (!inventory) return { error: "Inventory not initialized" };

      // Determine tab
      const tab = item.tab || "items";
      const items = inventory.get(tab) || [];

      // Check for stackable
      if (item.stackable) {
        const existing = items.find((i) => i.id === item.id);

        if (existing) {
          existing.quantity = Math.min(
            this.options.stackSize,
            existing.quantity + quantity
          );

          this._emit("inventory:item_stacked", { playerId, item, quantity });

          return { success: true, stacked: true };
        }
      }

      // Add new item
      items.push({
        ...item,
        quantity,
        obtainedAt: Date.now(),
      });

      inventory.set(tab, items);

      this.stats.totalItems++;

      this._emit("inventory:item_added", { playerId, item, quantity });

      return { success: true };
    }

    /**
     * Remove item
     * @param {string} playerId - Player ID
     * @param {string} itemId - Item ID
     * @param {number} quantity - Quantity to remove
     * @returns {Object} Result
     */
    removeItem(playerId, itemId, quantity = 1) {
      const inventory = this.inventories.get(playerId);
      if (!inventory) return { error: "Inventory not initialized" };

      // Find item
      for (const [tab, items] of inventory.entries()) {
        const index = items.findIndex((i) => i.id === itemId);

        if (index >= 0) {
          const item = items[index];

          if (item.quantity > quantity) {
            item.quantity -= quantity;
          } else {
            items.splice(index, 1);
          }

          inventory.set(tab, items);

          this._emit("inventory:item_removed", { playerId, itemId, quantity });

          return { success: true };
        }
      }

      return { error: "Item not found" };
    }

    /**
     * Equip item
     * @param {string} playerId - Player ID
     * @param {string} itemId - Item ID
     * @param {string} slot - Equipment slot
     * @returns {Object} Result
     */
    equipItem(playerId, itemId, slot) {
      const equipped = this.equippedItems.get(playerId);
      if (!equipped) return { error: "Player not initialized" };

      // Find item in inventory
      const inventory = this.inventories.get(playerId);
      const gearItems = inventory.get("gear") || [];
      const item = gearItems.find((i) => i.id === itemId);

      if (!item) return { error: "Item not found" };

      // Unequip current item in slot
      if (equipped[slot]) {
        const oldItem = equipped[slot];
        this._emit("inventory:item_unequipped", { playerId, slot, item: oldItem });
      }

      // Equip new item
      equipped[slot] = item;

      this._emit("inventory:item_equipped", { playerId, slot, item });

      return { success: true, equipped };
    }

    /**
     * Unequip item
     * @param {string} playerId - Player ID
     * @param {string} slot - Equipment slot
     * @returns {Object} Result
     */
    unequipItem(playerId, slot) {
      const equipped = this.equippedItems.get(playerId);
      if (!equipped) return { error: "Player not initialized" };

      if (!equipped[slot]) {
        return { error: "Nothing equipped in that slot" };
      }

      const item = equipped[slot];
      equipped[slot] = null;

      this._emit("inventory:item_unequipped", { playerId, slot, item });

      return { success: true };
    }

    /**
     * Get equipment stats
     * @param {string} playerId - Player ID
     * @returns {Object} Total stats
     */
    getEquipmentStats(playerId) {
      const equipped = this.equippedItems.get(playerId);
      if (!equipped) return {};

      const stats = {};

      for (const item of Object.values(equipped)) {
        if (!item || !item.stats) continue;

        for (const [stat, value] of Object.entries(item.stats)) {
          stats[stat] = (stats[stat] || 0) + value;
        }
      }

      return stats;
    }

    /**
     * Get tab contents
     * @param {string} playerId - Player ID
     * @param {string} tabId - Tab ID
     * @returns {Array} Items
     */
    getTabContents(playerId, tabId) {
      const inventory = this.inventories.get(playerId);
      if (!inventory) return [];

      return inventory.get(tabId) || [];
    }

    /**
     * Sort inventory
     * @param {string} playerId - Player ID
     * @param {string} tabId - Tab ID
     * @param {string} sortBy - Sort method
     * @returns {Array} Sorted items
     */
    sortInventory(playerId, tabId, sortBy = "name") {
      const inventory = this.inventories.get(playerId);
      if (!inventory) return [];

      const items = inventory.get(tabId) || [];

      switch (sortBy) {
        case "name":
          items.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "rarity":
          items.sort((a, b) => (RARITIES[b.rarity]?.tier || 0) - (RARITIES[a.rarity]?.tier || 0));
          break;
        case "power":
          items.sort((a, b) => (b.power || 0) - (a.power || 0));
          break;
        case "quantity":
          items.sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
          break;
      }

      inventory.set(tabId, items);

      return items;
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        inventories: Array.from(this.inventories.entries()).map(([pid, inv]) => [
          pid,
          Array.from(inv.entries()),
        ]),
        equippedItems: Array.from(this.equippedItems.entries()),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.inventories.clear();
      if (data.inventories) {
        data.inventories.forEach(([pid, invArr]) => {
          const inv = new Map(invArr);
          this.inventories.set(pid, inv);
        });
      }

      this.equippedItems.clear();
      if (data.equippedItems) {
        data.equippedItems.forEach(([playerId, equipped]) => {
          this.equippedItems.set(playerId, equipped);
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("inventory:loaded");
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[InventoryBagSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  InventoryBagSystem.BAG_TABS = BAG_TABS;
  InventoryBagSystem.TAB_KEYS = TAB_KEYS;
  InventoryBagSystem.RARITIES = RARITIES;

  return InventoryBagSystem;
});

