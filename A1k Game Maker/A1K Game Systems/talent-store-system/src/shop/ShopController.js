/**
 * ShopController.js
 * Handles shop purchases, currency exchange, and bundle packs
 */

import { SHOP_ITEMS, SHOP_CATEGORIES, getItem, getItemsByCategory } from './ShopItems.js';

class ShopController {
  constructor(gameState) {
    this.gameState = gameState;
    this.currentCategory = 'all';
  }

  /**
   * Purchase an item
   */
  purchase(itemId) {
    const item = getItem(itemId);
    if (!item) {
      return { success: false, error: 'Item not found' };
    }

    const state = this.gameState.get();

    // Determine which currency to use (default to gold)
    const currency = item.currency || 'gold';

    // Check if has enough currency
    if (!this.gameState.hasCurrency(currency, item.cost)) {
      return { 
        success: false, 
        error: `Not enough ${currency} (need ${item.cost}, have ${state.currencies[currency] || 0})` 
      };
    }

    // Deduct currency
    this.gameState.removeCurrency(currency, item.cost);

    // Handle item effect
    const result = this.handleItemPurchase(item);

    // Add to purchase history (track spending for unlock requirements)
    this.gameState.addPurchaseHistory(itemId, item.cost, currency);

    console.log(`Purchased: ${item.name} for ${item.cost} ${currency}`);

    return { 
      success: true, 
      item, 
      effect: result,
      currency 
    };
  }

  /**
   * Handle post-purchase effects
   */
  handleItemPurchase(item) {
    // === ESSENCE PACKS ===
    if (item.essenceAmount) {
      this.gameState.addCurrency('essence', item.essenceAmount);
      
      // Track essence for unlock requirements
      const state = this.gameState.get();
      if (!state.progression) state.progression = {};
      state.progression.essenceSpent = (state.progression.essenceSpent || 0);
      
      // Bonus spirit if premium pack
      if (item.bonusSpirit) {
        const spirits = ['dark_soul', 'light_soul', 'golden_spirit', 'tech_essence', 'storm_wisp', 'guardian_sand', 'ember_fox'];
        const randomSpirit = spirits[Math.floor(Math.random() * spirits.length)];
        return { type: 'essence_pack', essenceAmount: item.essenceAmount, bonusSpirit: randomSpirit };
      }
      
      return { type: 'currency', currency: 'essence', amount: item.essenceAmount };
    }

    // === EXP PACKS ===
    if (item.expAmount) {
      const state = this.gameState.get();
      const currentLevel = state.playerLevel || 1;
      const expGained = item.expAmount;
      
      // Grant experience (game will handle level up logic)
      this.gameState.addExperience(expGained);
      
      return { type: 'experience', amount: expGained, currentLevel };
    }

    // === CORE PACK ===
    if (item.corePackType === 'starter') {
      const lowLevelCores = ['core_ember', 'core_frost', 'core_spark', 'core_stone', 'core_wind', 'core_shadow'];
      const selectedCores = [];
      
      // Give 3 random cores
      for (let i = 0; i < 3; i++) {
        const randomCore = lowLevelCores[Math.floor(Math.random() * lowLevelCores.length)];
        selectedCores.push(getItem(randomCore));
        this.gameState.addItem(getItem(randomCore));
      }
      
      return { type: 'core_pack', cores: selectedCores };
    }

    // === ORIGINAL HANDLERS ===
    switch (item.id) {
      case 'hp_potion':
        return { type: 'heal', amount: 40, target: 'leader' };
        
      case 'rage_pill':
        return { type: 'rage', amount: 30, target: 'party' };
        
      case 'revive_token':
        this.gameState.addCurrency('reviveTokens', 1);
        return { type: 'currency', currency: 'reviveTokens', amount: 1 };
        
      case 'ap_reset':
        this.gameState.resetTalents();
        return { type: 'reset', system: 'talents' };
        
      case 'gold_bag':
        const goldAmount = Math.floor(Math.random() * 4500) + 500;
        this.gameState.addCurrency('gold', goldAmount);
        return { type: 'currency', currency: 'gold', amount: goldAmount };
        
      case 'big_gold_bag':
        const bigGoldAmount = Math.floor(Math.random() * 8000) + 2000;
        this.gameState.addCurrency('gold', bigGoldAmount);
        return { type: 'currency', currency: 'gold', amount: bigGoldAmount };

      case 'spirit_summon_scroll':
        // Summon random spirit (requires essence)
        const spirits = ['dark_soul', 'light_soul', 'golden_spirit', 'tech_essence', 'storm_wisp', 'guardian_sand', 'ember_fox'];
        const spirit = spirits[Math.floor(Math.random() * spirits.length)];
        return { type: 'spirit_summon', spiritId: spirit };

      case 'ability_unlock_token':
        // Unlock random ability (requires essence)
        const abilities = ['divine_barrier', 'angelic_might', 'dash_nova', 'radiant_burst', 'flame_dash', 'aura_of_fortune', 'iron_will'];
        const ability = abilities[Math.floor(Math.random() * abilities.length)];
        return { type: 'ability_unlock', abilityId: ability };

      case 'spirit_evolution_catalyst':
        // Boost spirit trait max levels (requires essence)
        return { type: 'spirit_boost', message: 'Spirit trait max levels +1!' };

      case 'gear_kit':
      case 'super_equipment_pack':
      case 'pet_box':
      case 'vehicle_box':
      case 'big_box':
        // Add item to inventory
        this.gameState.addItem(item);
        return { type: 'inventory', item };

      default:
        // Default: add to inventory
        if (item.type === 'gear' || item.type === 'scroll' || item.type === 'core') {
          this.gameState.addItem(item);
          return { type: 'inventory', item };
        }
        return { type: 'none' };
    }
  }

  /**
   * Exchange currencies
   */
  exchange(fromCurrency, toCurrency, amount) {
    const rates = this.getExchangeRates();
    const pair = `${fromCurrency}_to_${toCurrency}`;
    
    if (!rates[pair]) {
      return { success: false, error: 'Invalid currency pair' };
    }

    const rate = rates[pair];
    const cost = rate.cost * amount;
    const gain = rate.rate * amount;

    // Check if has enough
    if (!this.gameState.hasCurrency(fromCurrency, cost)) {
      return { 
        success: false, 
        error: `Not enough ${fromCurrency} (need ${cost}, have ${this.gameState.getCurrency(fromCurrency)})` 
      };
    }

    // Perform exchange
    this.gameState.removeCurrency(fromCurrency, cost);
    this.gameState.addCurrency(toCurrency, gain);

    console.log(`Exchanged ${cost} ${fromCurrency} for ${gain} ${toCurrency}`);

    return { 
      success: true, 
      cost, 
      gain,
      fromCurrency,
      toCurrency
    };
  }

  /**
   * Get exchange rates
   */
  getExchangeRates() {
    return {
      gold_to_essence: { cost: 500, rate: 5 },      // 500 gold → 5 essence
      gold_to_tokens: { cost: 2000, rate: 2 },      // 2000 gold → 2 tokens
      essence_to_gold: { cost: 10, rate: 800 },     // 10 essence → 800 gold
      tokens_to_gold: { cost: 2, rate: 1800 },      // 2 tokens → 1800 gold
    };
  }

  /**
   * Buy bundle pack
   */
  buyPack(packType) {
    const packs = {
      essence: {
        name: 'Essence Pack',
        reward: { currency: 'essence', amount: 50 },
        baseCost: 800
      },
      tokens: {
        name: 'Token Pack',
        reward: { currency: 'tokens', amount: 5 },
        baseCost: 1800
      }
    };

    const pack = packs[packType];
    if (!pack) {
      return { success: false, error: 'Pack not found' };
    }

    // Calculate price with scaling
    const purchaseCount = this.gameState.getBundleCount(packType);
    const multiplier = packType === 'essence' ? 1.15 : 1.2;
    const cost = Math.round(pack.baseCost * Math.pow(multiplier, purchaseCount));

    // Check if has enough gold
    if (!this.gameState.hasCurrency('gold', cost)) {
      return { 
        success: false, 
        error: `Not enough gold (need ${cost}, have ${this.gameState.getCurrency('gold')})` 
      };
    }

    // Purchase pack
    this.gameState.removeCurrency('gold', cost);
    this.gameState.addCurrency(pack.reward.currency, pack.reward.amount);
    this.gameState.incrementBundleCount(packType);

    console.log(`Purchased ${pack.name} for ${cost} gold`);

    return { 
      success: true, 
      pack: pack.name,
      cost,
      reward: pack.reward,
      nextCost: Math.round(pack.baseCost * Math.pow(multiplier, purchaseCount + 1))
    };
  }

  /**
   * Get pack prices
   */
  getPackPrices() {
    const essenceCount = this.gameState.getBundleCount('essence');
    const tokenCount = this.gameState.getBundleCount('tokens');

    return {
      essence: {
        current: Math.round(800 * Math.pow(1.15, essenceCount)),
        next: Math.round(800 * Math.pow(1.15, essenceCount + 1)),
        purchased: essenceCount
      },
      tokens: {
        current: Math.round(1800 * Math.pow(1.2, tokenCount)),
        next: Math.round(1800 * Math.pow(1.2, tokenCount + 1)),
        purchased: tokenCount
      }
    };
  }

  /**
   * Get items by category
   */
  getItems(category = 'all') {
    this.currentCategory = category;
    return getItemsByCategory(category);
  }

  /**
   * Set current category
   */
  setCategory(category) {
    this.currentCategory = category;
  }

  /**
   * Get current category
   */
  getCurrentCategory() {
    return this.currentCategory;
  }

  /**
   * Get all categories
   */
  getCategories() {
    return SHOP_CATEGORIES;
  }

  /**
   * Get item info with purchase status
   */
  getItemInfo(itemId) {
    const item = getItem(itemId);
    if (!item) {
      return null;
    }

    const state = this.gameState.get();
    const canAfford = state.currencies.gold >= item.cost;
    const timesGold = (state.currencies.gold / item.cost).toFixed(1);

    return {
      ...item,
      canAfford,
      affordable: canAfford ? 'Yes' : 'No',
      costRatio: `${timesGold}x`
    };
  }

  /**
   * Get purchase summary
   */
  getPurchaseSummary() {
    const state = this.gameState.get();
    const history = state.shop.purchaseHistory;

    const totalSpent = history.reduce((sum, purchase) => sum + purchase.cost, 0);
    const totalPurchases = history.length;

    const byItem = {};
    for (const purchase of history) {
      if (!byItem[purchase.itemId]) {
        byItem[purchase.itemId] = { count: 0, total: 0 };
      }
      byItem[purchase.itemId].count++;
      byItem[purchase.itemId].total += purchase.cost;
    }

    return {
      totalSpent,
      totalPurchases,
      averageCost: totalPurchases > 0 ? Math.round(totalSpent / totalPurchases) : 0,
      byItem,
      recentPurchases: history.slice(0, 10)
    };
  }

  /**
   * Get affordable items
   */
  getAffordableItems() {
    const state = this.gameState.get();
    const gold = state.currencies.gold;

    return SHOP_ITEMS.filter(item => item.cost <= gold);
  }

  /**
   * Get items by price range
   */
  getItemsByPriceRange(min, max) {
    return SHOP_ITEMS.filter(item => item.cost >= min && item.cost <= max);
  }

  /**
   * Search items
   */
  searchItems(query) {
    const lowerQuery = query.toLowerCase();
    return SHOP_ITEMS.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get featured items (S-rank + expensive items)
   */
  getFeaturedItems() {
    return SHOP_ITEMS
      .filter(item => item.category === 'srank' || item.cost >= 2000)
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 10);
  }

  /**
   * Get discount/sale simulation
   */
  getSaleItems(discountPercent = 20) {
    return SHOP_ITEMS.map(item => ({
      ...item,
      originalCost: item.cost,
      cost: Math.round(item.cost * (1 - discountPercent / 100)),
      discount: discountPercent,
      savings: Math.round(item.cost * (discountPercent / 100))
    }));
  }

  /**
   * Calculate bulk purchase discount
   */
  calculateBulkPurchase(itemId, quantity) {
    const item = getItem(itemId);
    if (!item) {
      return null;
    }

    const discounts = [
      { min: 1, max: 4, discount: 0 },
      { min: 5, max: 9, discount: 5 },
      { min: 10, max: 19, discount: 10 },
      { min: 20, max: Infinity, discount: 15 }
    ];

    const discountTier = discounts.find(d => quantity >= d.min && quantity <= d.max);
    const discountPercent = discountTier ? discountTier.discount : 0;
    
    const originalTotal = item.cost * quantity;
    const discountAmount = Math.round(originalTotal * (discountPercent / 100));
    const finalTotal = originalTotal - discountAmount;

    return {
      item,
      quantity,
      originalCost: item.cost,
      originalTotal,
      discountPercent,
      discountAmount,
      finalTotal,
      costPerItem: Math.round(finalTotal / quantity)
    };
  }

  /**
   * Get shop statistics
   */
  getShopStats() {
    const items = SHOP_ITEMS;
    
    return {
      totalItems: items.length,
      categories: SHOP_CATEGORIES.length,
      priceRange: {
        min: Math.min(...items.map(i => i.cost)),
        max: Math.max(...items.map(i => i.cost)),
        average: Math.round(items.reduce((sum, i) => sum + i.cost, 0) / items.length)
      },
      byCategory: SHOP_CATEGORIES.reduce((acc, cat) => {
        if (cat.id !== 'all') {
          acc[cat.id] = getItemsByCategory(cat.id).length;
        }
        return acc;
      }, {})
    };
  }
}

export function createShopController(gameState) {
  return new ShopController(gameState);
}

export default {
  createShopController
};

