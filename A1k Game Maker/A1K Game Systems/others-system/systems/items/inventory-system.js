/**
 * Inventory System - Standalone Module
 * @description Complete inventory and equipment management system
 * @version 1.0.0
 * @license MIT
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.InventorySystem = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class InventorySystem {
    constructor(options = {}) {
      this.options = Object.assign({
        maxSlots: 50,
        storageKey: 'inventory_data',
        autoSave: true,
        eventBus: null
      }, options);

      // Inventory
      this.items = [];
      this.maxSlots = this.options.maxSlots;

      // Equipment
      this.equipped = {
        weapon: null,
        armor: null,
        accessory: null,
        core: null
      };

      // Item database
      this.itemDatabase = {};

      // Categories and rarities
      this.categories = {
        weapon: { color: '#ff6b6b', icon: '⚔️', name: 'Weapons' },
        armor: { color: '#4c6ef5', icon: '🛡️', name: 'Armor' },
        accessory: { color: '#9b59b6', icon: '💎', name: 'Accessories' },
        consumable: { color: '#4ecdc4', icon: '🧪', name: 'Consumables' },
        material: { color: '#ffd93d', icon: '📦', name: 'Materials' },
        misc: { color: '#95a5a6', icon: '🎁', name: 'Miscellaneous' }
      };

      this.rarities = {
        common: { color: '#ffffff', multiplier: 1.0, name: 'Common' },
        uncommon: { color: '#4ecdc4', multiplier: 1.2, name: 'Uncommon' },
        rare: { color: '#4c6ef5', multiplier: 1.5, name: 'Rare' },
        epic: { color: '#9b59b6', multiplier: 2.0, name: 'Epic' },
        legendary: { color: '#f39c12', multiplier: 3.0, name: 'Legendary' }
      };

      this.initialized = false;
    }

    async initialize(data = {}) {
      if (this.initialized) return;

      if (data.itemDatabase) this.itemDatabase = data.itemDatabase;
      if (data.maxSlots) this.maxSlots = data.maxSlots;

      this.load();
      this.initialized = true;
      this.emit('inventory:initialized');
      
      console.log('[InventorySystem] Initialized');
    }

    // ===== ITEM DATABASE =====

    registerItem(item) {
      this.itemDatabase[item.id] = item;
    }

    getItem(itemId) {
      return this.itemDatabase[itemId] || null;
    }

    // ===== INVENTORY MANAGEMENT =====

    addItem(itemId, quantity = 1) {
      const itemData = this.getItem(itemId);
      if (!itemData) {
        console.warn(`[InventorySystem] Item ${itemId} not found`);
        return false;
      }

      // Try to stack with existing items
      if (itemData.stackable !== false) {
        const existing = this.items.find(i => i && i.id === itemId);
        if (existing) {
          const maxStack = itemData.maxStack || 99;
          const canAdd = Math.min(quantity, maxStack - existing.quantity);
          
          if (canAdd > 0) {
            existing.quantity += canAdd;
            quantity -= canAdd;
            
            this.emit('item:added', { item: itemData, quantity: canAdd });
            this.save();
            
            if (quantity === 0) return true;
          }
        }
      }

      // Add to empty slot
      while (quantity > 0 && this.items.length < this.maxSlots) {
        const maxStack = itemData.maxStack || 99;
        const addAmount = Math.min(quantity, maxStack);
        
        this.items.push({
          id: itemId,
          quantity: addAmount,
          ...itemData
        });
        
        quantity -= addAmount;
        this.emit('item:added', { item: itemData, quantity: addAmount });
      }

      if (quantity > 0) {
        console.warn('[InventorySystem] Inventory full, could not add all items');
        return false;
      }

      this.save();
      return true;
    }

    removeItem(itemId, quantity = 1) {
      let remaining = quantity;

      for (let i = this.items.length - 1; i >= 0; i--) {
        const item = this.items[i];
        if (!item || item.id !== itemId) continue;

        if (item.quantity <= remaining) {
          remaining -= item.quantity;
          this.items.splice(i, 1);
        } else {
          item.quantity -= remaining;
          remaining = 0;
        }

        if (remaining === 0) break;
      }

      if (remaining > 0) {
        console.warn(`[InventorySystem] Could not remove all ${itemId}, ${remaining} remaining`);
        return false;
      }

      this.emit('item:removed', { itemId, quantity });
      this.save();
      return true;
    }

    hasItem(itemId, quantity = 1) {
      let total = 0;
      this.items.forEach(item => {
        if (item && item.id === itemId) {
          total += item.quantity;
        }
      });
      return total >= quantity;
    }

    getItemCount(itemId) {
      let total = 0;
      this.items.forEach(item => {
        if (item && item.id === itemId) {
          total += item.quantity;
        }
      });
      return total;
    }

    moveItem(fromIndex, toIndex) {
      if (fromIndex === toIndex) return true;
      if (fromIndex < 0 || fromIndex >= this.items.length) return false;
      if (toIndex < 0 || toIndex >= this.maxSlots) return false;

      const item = this.items[fromIndex];
      this.items.splice(fromIndex, 1);
      this.items.splice(toIndex, 0, item);

      this.emit('item:moved', { fromIndex, toIndex });
      this.save();
      return true;
    }

    sortInventory(sortBy = 'rarity') {
      const sortFunctions = {
        rarity: (a, b) => {
          const rarityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
          return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
        },
        name: (a, b) => a.name.localeCompare(b.name),
        category: (a, b) => a.category.localeCompare(b.category),
        quantity: (a, b) => b.quantity - a.quantity
      };

      const sortFn = sortFunctions[sortBy] || sortFunctions.rarity;
      this.items.sort(sortFn);

      this.emit('inventory:sorted', { sortBy });
      this.save();
    }

    clearInventory() {
      this.items = [];
      this.emit('inventory:cleared');
      this.save();
    }

    // ===== EQUIPMENT =====

    equipItem(itemId, slot) {
      const itemData = this.getItem(itemId);
      if (!itemData) return false;

      if (!this.hasItem(itemId)) {
        console.warn(`[InventorySystem] Don't have ${itemId} to equip`);
        return false;
      }

      // Check if item can go in this slot
      if (itemData.category !== slot && !(slot === 'accessory' && itemData.category === 'accessory')) {
        console.warn(`[InventorySystem] ${itemId} cannot be equipped in ${slot} slot`);
        return false;
      }

      // Unequip current item if any
      if (this.equipped[slot]) {
        this.unequipItem(slot);
      }

      // Remove from inventory and equip
      this.removeItem(itemId, 1);
      this.equipped[slot] = itemData;

      this.emit('item:equipped', { item: itemData, slot });
      this.save();
      return true;
    }

    unequipItem(slot) {
      const item = this.equipped[slot];
      if (!item) return false;

      // Add back to inventory
      this.addItem(item.id, 1);
      this.equipped[slot] = null;

      this.emit('item:unequipped', { item, slot });
      this.save();
      return true;
    }

    getEquipped(slot) {
      return this.equipped[slot] || null;
    }

    getAllEquipped() {
      return { ...this.equipped };
    }

    getTotalStats() {
      const stats = {
        attack: 0,
        defense: 0,
        hp: 0,
        speed: 0
      };

      Object.values(this.equipped).forEach(item => {
        if (!item) return;
        
        if (item.stats) {
          for (const [stat, value] of Object.entries(item.stats)) {
            stats[stat] = (stats[stat] || 0) + value;
          }
        }
      });

      return stats;
    }

    // ===== CONSUMABLES =====

    useConsumable(itemId) {
      const itemData = this.getItem(itemId);
      if (!itemData || itemData.category !== 'consumable') {
        return false;
      }

      if (!this.hasItem(itemId)) {
        return false;
      }

      this.removeItem(itemId, 1);
      
      const effects = itemData.effects || {};
      this.emit('consumable:used', { item: itemData, effects });
      
      return effects;
    }

    // ===== FILTERS =====

    getItemsByCategory(category) {
      return this.items.filter(item => item && item.category === category);
    }

    getItemsByRarity(rarity) {
      return this.items.filter(item => item && item.rarity === rarity);
    }

    searchItems(query) {
      const lowerQuery = query.toLowerCase();
      return this.items.filter(item => 
        item && (
          item.name.toLowerCase().includes(lowerQuery) ||
          (item.description && item.description.toLowerCase().includes(lowerQuery))
        )
      );
    }

    // ===== DATA MANAGEMENT =====

    save() {
      if (!this.options.autoSave) return;

      const data = {
        items: this.items,
        equipped: this.equipped,
        maxSlots: this.maxSlots,
        lastSaved: Date.now()
      };

      try {
        localStorage.setItem(this.options.storageKey, JSON.stringify(data));
      } catch (e) {
        console.error('[InventorySystem] Save error:', e);
      }
    }

    load() {
      try {
        const saved = localStorage.getItem(this.options.storageKey);
        if (!saved) return;

        const data = JSON.parse(saved);
        
        if (data.items) this.items = data.items;
        if (data.equipped) this.equipped = data.equipped;
        if (data.maxSlots) this.maxSlots = data.maxSlots;

        this.emit('inventory:loaded');
      } catch (e) {
        console.error('[InventorySystem] Load error:', e);
      }
    }

    exportData() {
      return {
        items: this.items,
        equipped: this.equipped,
        maxSlots: this.maxSlots
      };
    }

    importData(data) {
      if (data.items) this.items = data.items;
      if (data.equipped) this.equipped = data.equipped;
      if (data.maxSlots) this.maxSlots = data.maxSlots;

      this.save();
      this.emit('inventory:imported');
    }

    emit(event, data) {
      if (this.options.eventBus && typeof this.options.eventBus.emit === 'function') {
        this.options.eventBus.emit(event, data);
      }

      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent(event, { detail: data }));
      }
    }

    getStats() {
      return {
        totalItems: this.items.length,
        maxSlots: this.maxSlots,
        emptySlots: this.maxSlots - this.items.length,
        totalValue: this.getTotalValue(),
        equipped: Object.keys(this.equipped).filter(slot => this.equipped[slot]).length
      };
    }

    getTotalValue() {
      let total = 0;
      this.items.forEach(item => {
        if (!item) return;
        const rarityMultiplier = this.rarities[item.rarity]?.multiplier || 1.0;
        total += (item.value || 0) * item.quantity * rarityMultiplier;
      });
      return total;
    }
  }

  return InventorySystem;
}));

