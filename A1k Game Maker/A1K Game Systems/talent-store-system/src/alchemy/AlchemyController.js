/**
 * AlchemyController.js
 * Handles alchemy crafting, fusion, and recipe management
 */

import {
  RECIPE_TYPES,
  ITEM_RANKS,
  getRecipeType,
  isSpecialRecipe,
  isFusionRecipe,
  getHighestRank,
  getNextRank,
  validateItems,
  generateSpecialReward,
  TREASURE_BOX_REWARDS
} from './AlchemyRecipes.js';

class AlchemyController {
  constructor(gameState) {
    this.gameState = gameState;
  }

  /**
   * Get valid items for crafting (excludes equipped items)
   */
  getValidItems() {
    const state = this.gameState.get();
    const equippedIds = Object.values(state.inventory.equipped)
      .filter(Boolean)
      .map(item => item.id);

    return state.inventory.items.filter(item => {
      // Exclude equipped items
      if (equippedIds.includes(item.id)) {
        return false;
      }

      // Only allow certain types
      const validTypes = ['gear', 'pet', 'vehicle'];
      const itemType = item.type || item.slot;
      return validTypes.includes(itemType);
    });
  }

  /**
   * Set item in crafting slot
   */
  setSlot(slotIndex, itemId) {
    if (slotIndex < 0 || slotIndex > 2) {
      return { success: false, error: 'Invalid slot index' };
    }

    // Validate item exists and is not equipped
    if (itemId) {
      const validItems = this.getValidItems();
      const item = validItems.find(i => i.id === itemId);
      
      if (!item) {
        return { success: false, error: 'Item not found or equipped' };
      }

      // Check if item is already in another slot
      const state = this.gameState.get();
      const otherSlots = state.alchemy.craftingSlots.filter((_, i) => i !== slotIndex);
      if (otherSlots.includes(itemId)) {
        return { success: false, error: 'Item already in another slot' };
      }
    }

    return this.gameState.setAlchemySlot(slotIndex, itemId);
  }

  /**
   * Clear a slot
   */
  clearSlot(slotIndex) {
    return this.setSlot(slotIndex, null);
  }

  /**
   * Clear all slots
   */
  clearAllSlots() {
    this.gameState.clearAlchemySlots();
    return { success: true };
  }

  /**
   * Get items in crafting slots
   */
  getSlotItems() {
    const state = this.gameState.get();
    const slots = state.alchemy.craftingSlots;

    return slots.map(itemId => {
      if (!itemId) return null;
      return this.gameState.getItem(itemId);
    });
  }

  /**
   * Check if can craft
   */
  canCraft() {
    const items = this.getSlotItems().filter(Boolean);
    
    if (items.length !== 3) {
      return { can: false, reason: 'Need 3 items' };
    }

    const state = this.gameState.get();
    const equipped = Object.values(state.inventory.equipped).filter(Boolean);
    const validation = validateItems(items, equipped);

    if (!validation.valid) {
      return { can: false, reason: validation.errors.join(', ') };
    }

    return { can: true, recipeType: getRecipeType(items) };
  }

  /**
   * Craft items
   */
  craft() {
    const canCraftResult = this.canCraft();
    if (!canCraftResult.can) {
      return { success: false, error: canCraftResult.reason };
    }

    const items = this.getSlotItems().filter(Boolean);
    const recipeType = canCraftResult.recipeType;

    let result;
    switch (recipeType) {
      case RECIPE_TYPES.FUSION:
        result = this.performFusion(items);
        break;
      case RECIPE_TYPES.SPECIAL:
        result = this.performSpecialRecipe(items);
        break;
      case RECIPE_TYPES.ALCHEMY:
        result = this.performAlchemy(items);
        break;
      default:
        return { success: false, error: 'Unknown recipe type' };
    }

    if (result.success) {
      // Remove items from inventory
      for (const item of items) {
        this.gameState.removeItem(item.id);
      }

      // Add crafting history
      this.gameState.addAlchemyHistory({
        recipeType,
        inputs: items.map(i => ({ id: i.id, name: i.name, rank: i.rank || 'C' })),
        output: result.output
      });

      // Clear slots
      this.clearAllSlots();

      console.log(`Crafting successful: ${recipeType}`);
    }

    return result;
  }

  /**
   * Perform fusion (same type + rank → tier up)
   */
  performFusion(items) {
    const firstItem = items[0];
    const currentRank = firstItem.rank || 'C';
    const nextRank = getNextRank(currentRank);

    if (currentRank === nextRank) {
      return { 
        success: false, 
        error: 'Already at max rank' 
      };
    }

    // Create new item with upgraded rank
    const newItem = {
      ...firstItem,
      id: `item_${Date.now()}_${Math.random()}`,
      rank: nextRank,
      name: `${nextRank}-Rank ${firstItem.name}`,
      addedAt: Date.now()
    };

    // Boost stats based on rank
    const rankMultipliers = { 'B': 1.5, 'A': 2.0, 'S': 3.0 };
    const multiplier = rankMultipliers[nextRank] || 1;

    if (newItem.atk) newItem.atk = Math.round(newItem.atk * multiplier);
    if (newItem.def) newItem.def = Math.round(newItem.def * multiplier);
    if (newItem.hp) newItem.hp = Math.round(newItem.hp * multiplier);
    if (newItem.mp) newItem.mp = Math.round(newItem.mp * multiplier);

    // Add to inventory
    const addResult = this.gameState.addItem(newItem);

    if (!addResult.success) {
      return addResult;
    }

    return {
      success: true,
      recipeType: RECIPE_TYPES.FUSION,
      output: newItem,
      message: `Fused into ${nextRank}-Rank item!`
    };
  }

  /**
   * Perform special recipe (C gear + B gear + C pet → premium)
   */
  performSpecialRecipe(items) {
    const reward = generateSpecialReward();

    let outputItem;

    if (reward.type === 'gift_key') {
      // Add currency instead
      this.gameState.addCurrency('giftKeys', reward.amount || 1);
      outputItem = {
        name: 'Gift Key',
        type: 'currency',
        amount: reward.amount || 1
      };
    } else {
      // Generate item
      outputItem = this.generateItem(reward.type, reward.rank || 'B');
      const addResult = this.gameState.addItem(outputItem);
      
      if (!addResult.success) {
        return addResult;
      }
    }

    return {
      success: true,
      recipeType: RECIPE_TYPES.SPECIAL,
      output: outputItem,
      message: `Special recipe created ${outputItem.name}!`
    };
  }

  /**
   * Perform generic alchemy (any 3 → treasure box)
   */
  performAlchemy(items) {
    const highestRank = getHighestRank(items);

    const treasureBox = {
      id: `item_${Date.now()}_${Math.random()}`,
      name: `${highestRank}-Rank Treasure Box`,
      type: 'treasure_box',
      rank: highestRank,
      description: `Contains rewards based on ${highestRank}-rank quality`,
      addedAt: Date.now()
    };

    const addResult = this.gameState.addItem(treasureBox);

    if (!addResult.success) {
      return addResult;
    }

    return {
      success: true,
      recipeType: RECIPE_TYPES.ALCHEMY,
      output: treasureBox,
      message: `Created ${highestRank}-Rank Treasure Box!`
    };
  }

  /**
   * Open treasure box
   */
  openTreasureBox(itemId) {
    const item = this.gameState.getItem(itemId);
    
    if (!item || item.type !== 'treasure_box') {
      return { success: false, error: 'Not a treasure box' };
    }

    const rank = item.rank || 'C';
    const rewards = this.generateTreasureBoxRewards(rank);

    // Remove treasure box
    this.gameState.removeItem(itemId);

    // Add rewards
    const addedItems = [];
    for (const reward of rewards.items) {
      const result = this.gameState.addItem(reward);
      if (result.success) {
        addedItems.push(result.item);
      }
    }

    // Add gold
    if (rewards.gold > 0) {
      this.gameState.addCurrency('gold', rewards.gold);
    }

    console.log(`Opened ${rank}-Rank Treasure Box`);

    return {
      success: true,
      rewards: {
        gold: rewards.gold,
        items: addedItems
      },
      message: `Received ${rewards.gold} gold and ${addedItems.length} items!`
    };
  }

  /**
   * Generate treasure box rewards
   */
  generateTreasureBoxRewards(rank) {
    const config = TREASURE_BOX_REWARDS[rank] || TREASURE_BOX_REWARDS['C'];

    const gold = Math.floor(Math.random() * (config.gold.max - config.gold.min + 1)) + config.gold.min;
    const itemCount = Math.floor(Math.random() * (config.items.count.max - config.items.count.min + 1)) + config.items.count.min;

    const items = [];
    for (let i = 0; i < itemCount; i++) {
      const itemRank = Math.random() < (config.rareChance || 0) ? getNextRank(config.items.rank) : config.items.rank;
      const types = ['gear', 'pet', 'vehicle'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      items.push(this.generateItem(randomType, itemRank));
    }

    return { gold, items };
  }

  /**
   * Generate random item
   */
  generateItem(type, rank = 'C') {
    const baseStats = {
      'C': { atk: 10, def: 15, hp: 50 },
      'B': { atk: 20, def: 30, hp: 100 },
      'A': { atk: 35, def: 50, hp: 200 },
      'S': { atk: 55, def: 80, hp: 350 }
    };

    const stats = baseStats[rank] || baseStats['C'];

    const item = {
      id: `item_${Date.now()}_${Math.random()}`,
      name: `${rank}-Rank ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      type: type,
      rank: rank,
      addedAt: Date.now()
    };

    // Add random stats
    if (type === 'gear') {
      item.slot = 'weapon';
      item.atk = stats.atk + Math.floor(Math.random() * 10);
    } else if (type === 'pet') {
      item.slot = 'pet';
      item.atk = Math.floor(stats.atk * 0.7);
      item.hp = stats.hp;
    } else if (type === 'vehicle') {
      item.slot = 'vehicle';
      item.speed = 20 + Math.floor(Math.random() * 30);
    }

    return item;
  }

  /**
   * Get crafting history
   */
  getHistory(limit = 10) {
    const state = this.gameState.get();
    return state.alchemy.history.slice(0, limit);
  }

  /**
   * Get crafting statistics
   */
  getStatistics() {
    const state = this.gameState.get();
    const history = state.alchemy.history;

    const stats = {
      totalCrafts: history.length,
      byType: {
        fusion: 0,
        special: 0,
        alchemy: 0
      },
      byRank: {
        C: 0,
        B: 0,
        A: 0,
        S: 0
      }
    };

    for (const entry of history) {
      stats.byType[entry.recipeType]++;
      if (entry.output.rank) {
        stats.byRank[entry.output.rank]++;
      }
    }

    return stats;
  }

  /**
   * Get recipe preview
   */
  getRecipePreview() {
    const items = this.getSlotItems().filter(Boolean);
    
    if (items.length !== 3) {
      return {
        valid: false,
        message: `Need ${3 - items.length} more item(s)`
      };
    }

    const recipeType = getRecipeType(items);
    
    let preview = {
      valid: true,
      recipeType,
      inputs: items.map(i => ({ name: i.name, rank: i.rank || 'C' }))
    };

    switch (recipeType) {
      case RECIPE_TYPES.FUSION:
        const rank = items[0].rank || 'C';
        const nextRank = getNextRank(rank);
        preview.output = {
          type: 'fusion',
          rank: nextRank,
          message: `Will create ${nextRank}-Rank ${items[0].type}`
        };
        break;

      case RECIPE_TYPES.SPECIAL:
        preview.output = {
          type: 'special',
          message: 'Will create random premium reward'
        };
        break;

      case RECIPE_TYPES.ALCHEMY:
        const highestRank = getHighestRank(items);
        preview.output = {
          type: 'treasure_box',
          rank: highestRank,
          message: `Will create ${highestRank}-Rank Treasure Box`
        };
        break;
    }

    return preview;
  }
}

export function createAlchemyController(gameState) {
  return new AlchemyController(gameState);
}

export default {
  createAlchemyController
};

