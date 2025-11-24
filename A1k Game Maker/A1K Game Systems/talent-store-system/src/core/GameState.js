/**
 * GameState.js
 * Central state management for all game systems
 */

class GameState {
  constructor() {
    this.state = this.getDefaultState();
    this.listeners = [];
  }

  /**
   * Get default state
   */
  getDefaultState() {
    return {
      // Currencies
      currencies: {
        gold: 10000,      // Starting gold
        essence: 50,      // Crafting currency
        tokens: 10,       // Premium currency
        ap: 0,            // Ability Points (earned through leveling)
        apTotal: 20,      // Total AP available
        apSpent: 0        // AP spent on talents
      },

      // Talent System
      talents: {
        purchased: new Set(),
        stats: {
          atkMul: 0,
          defMul: 0,
          hpFlat: 0,
          ls: 0,
          haste: 0,
          luck: 0,
          crit: 0,
          damageReduction: 0,
          regen: 0,
          moveSpeed: 0,
          goldFind: 0,
          // Special flags
          berserker: false,
          killRage: false,
          guardian: false,
          fortress: false,
          vampiric: false,
          phoenix: false,
          cascade: false,
          timeMaster: false,
          fortune: false,
          jackpot: false,
          goldenTouch: false
        }
      },

      // Inventory
      inventory: {
        items: [],
        maxSlots: 100,
        equipped: {
          weapon: null,
          armor: null,
          accessory1: null,
          accessory2: null,
          helmet: null,
          boots: null,
          gloves: null,
          back: null
        }
      },

      // Alchemy
      alchemy: {
        craftingSlots: [null, null, null],
        history: []
      },

      // Shop
      shop: {
        purchaseHistory: [],
        bundleCounts: {
          essence: 0,
          tokens: 0
        }
      },

      // Player Stats
      player: {
        level: 1,
        xp: 0,
        xpToNext: 100,
        hp: 100,
        hpMax: 100,
        atk: 10,
        def: 10
      },

      // Meta
      meta: {
        version: '1.0.0',
        created: Date.now(),
        lastSaved: Date.now(),
        totalPlayTime: 0
      }
    };
  }

  /**
   * Get current state
   */
  get() {
    return this.state;
  }

  /**
   * Set state
   */
  set(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  /**
   * Update nested state
   */
  update(path, value) {
    const keys = path.split('.');
    let current = this.state;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    this.notify();
  }

  /**
   * Currency Management
   */
  getCurrency(type) {
    return this.state.currencies[type] || 0;
  }

  setCurrency(type, amount) {
    if (!this.state.currencies.hasOwnProperty(type)) {
      console.error(`Currency type "${type}" does not exist`);
      return false;
    }
    this.state.currencies[type] = Math.max(0, amount);
    this.notify();
    return true;
  }

  addCurrency(type, amount) {
    const current = this.getCurrency(type);
    return this.setCurrency(type, current + amount);
  }

  removeCurrency(type, amount) {
    return this.addCurrency(type, -amount);
  }

  hasCurrency(type, amount) {
    return this.getCurrency(type) >= amount;
  }

  /**
   * Talent Management
   */
  purchaseTalent(talentId, cost) {
    if (this.state.talents.purchased.has(talentId)) {
      return { success: false, error: 'Talent already purchased' };
    }

    if (this.state.currencies.apSpent >= this.state.currencies.apTotal) {
      return { success: false, error: 'Not enough AP' };
    }

    this.state.talents.purchased.add(talentId);
    this.state.currencies.apSpent += cost;
    this.notify();
    return { success: true };
  }

  hasTalent(talentId) {
    return this.state.talents.purchased.has(talentId);
  }

  resetTalents() {
    this.state.talents.purchased.clear();
    this.state.currencies.apSpent = 0;
    this.state.talents.stats = this.getDefaultState().talents.stats;
    this.notify();
  }

  /**
   * Inventory Management
   */
  addItem(item) {
    if (this.state.inventory.items.length >= this.state.inventory.maxSlots) {
      return { success: false, error: 'Inventory full' };
    }

    const itemWithId = {
      ...item,
      id: item.id || `item_${Date.now()}_${Math.random()}`,
      addedAt: Date.now()
    };

    this.state.inventory.items.push(itemWithId);
    this.notify();
    return { success: true, item: itemWithId };
  }

  removeItem(itemId) {
    const index = this.state.inventory.items.findIndex(item => item.id === itemId);
    if (index === -1) {
      return { success: false, error: 'Item not found' };
    }

    const item = this.state.inventory.items.splice(index, 1)[0];
    this.notify();
    return { success: true, item };
  }

  getItem(itemId) {
    return this.state.inventory.items.find(item => item.id === itemId) || null;
  }

  equipItem(itemId, slot) {
    const item = this.getItem(itemId);
    if (!item) {
      return { success: false, error: 'Item not found' };
    }

    // Unequip current item in slot
    const currentItem = this.state.inventory.equipped[slot];
    if (currentItem) {
      this.state.inventory.equipped[slot] = null;
    }

    // Equip new item
    this.state.inventory.equipped[slot] = item;
    this.notify();
    return { success: true, unequipped: currentItem };
  }

  unequipItem(slot) {
    const item = this.state.inventory.equipped[slot];
    if (!item) {
      return { success: false, error: 'No item equipped in this slot' };
    }

    this.state.inventory.equipped[slot] = null;
    this.notify();
    return { success: true, item };
  }

  /**
   * Alchemy Management
   */
  setAlchemySlot(slotIndex, itemId) {
    if (slotIndex < 0 || slotIndex > 2) {
      return { success: false, error: 'Invalid slot index' };
    }

    this.state.alchemy.craftingSlots[slotIndex] = itemId;
    this.notify();
    return { success: true };
  }

  clearAlchemySlots() {
    this.state.alchemy.craftingSlots = [null, null, null];
    this.notify();
  }

  addAlchemyHistory(entry) {
    this.state.alchemy.history.unshift({
      ...entry,
      timestamp: Date.now()
    });

    // Keep only last 50 entries
    if (this.state.alchemy.history.length > 50) {
      this.state.alchemy.history.pop();
    }

    this.notify();
  }

  /**
   * Shop Management
   */
  addPurchaseHistory(itemId, cost) {
    this.state.shop.purchaseHistory.unshift({
      itemId,
      cost,
      timestamp: Date.now()
    });

    // Keep only last 100 purchases
    if (this.state.shop.purchaseHistory.length > 100) {
      this.state.shop.purchaseHistory.pop();
    }

    this.notify();
  }

  incrementBundleCount(bundleType) {
    if (!this.state.shop.bundleCounts.hasOwnProperty(bundleType)) {
      this.state.shop.bundleCounts[bundleType] = 0;
    }
    this.state.shop.bundleCounts[bundleType]++;
    this.notify();
  }

  getBundleCount(bundleType) {
    return this.state.shop.bundleCounts[bundleType] || 0;
  }

  /**
   * Player Management
   */
  addXP(amount) {
    this.state.player.xp += amount;

    // Level up
    while (this.state.player.xp >= this.state.player.xpToNext) {
      this.state.player.xp -= this.state.player.xpToNext;
      this.state.player.level++;
      this.state.player.xpToNext = Math.floor(this.state.player.xpToNext * 1.5);
      
      // Grant AP on level up
      this.state.currencies.apTotal += 2;
      
      console.log(`Level Up! Now level ${this.state.player.level}`);
    }

    this.notify();
  }

  /**
   * State Management
   */
  reset() {
    this.state = this.getDefaultState();
    this.notify();
  }

  export() {
    // Convert Set to Array for JSON serialization
    const exportState = JSON.parse(JSON.stringify(this.state));
    exportState.talents.purchased = Array.from(this.state.talents.purchased);
    return exportState;
  }

  import(data) {
    try {
      // Convert Array back to Set
      if (Array.isArray(data.talents?.purchased)) {
        data.talents.purchased = new Set(data.talents.purchased);
      }
      
      this.state = { ...this.getDefaultState(), ...data };
      this.notify();
      return { success: true };
    } catch (error) {
      console.error('Failed to import state:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Observer Pattern
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.state.meta.lastSaved = Date.now();
    for (const callback of this.listeners) {
      try {
        callback(this.state);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    }
  }

  /**
   * Statistics
   */
  getStats() {
    return {
      currencies: { ...this.state.currencies },
      talentsPurchased: this.state.talents.purchased.size,
      inventoryUsed: this.state.inventory.items.length,
      inventoryMax: this.state.inventory.maxSlots,
      totalPurchases: this.state.shop.purchaseHistory.length,
      alchemyCrafts: this.state.alchemy.history.length,
      playerLevel: this.state.player.level,
      playTime: this.state.meta.totalPlayTime
    };
  }
}

// Singleton instance
let instance = null;

export function createGameState() {
  if (!instance) {
    instance = new GameState();
  }
  return instance;
}

export function getGameState() {
  if (!instance) {
    instance = new GameState();
  }
  return instance;
}

export default {
  createGameState,
  getGameState
};

