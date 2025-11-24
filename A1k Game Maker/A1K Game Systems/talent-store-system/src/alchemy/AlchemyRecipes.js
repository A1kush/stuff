/**
 * AlchemyRecipes.js
 * Complete alchemy and fusion recipe system
 * Extracted from A1K Runner game
 */

/**
 * Recipe Types
 */
export const RECIPE_TYPES = {
  FUSION: 'fusion',           // Same type + rank → tier up
  SPECIAL: 'special',         // Specific combination → premium reward
  ALCHEMY: 'alchemy'          // Any 3 items → treasure box
};

/**
 * Item Ranks
 */
export const ITEM_RANKS = ['C', 'B', 'A', 'S'];

/**
 * Rank Progression for Fusion
 */
export const RANK_PROGRESSION = {
  'C': 'B',
  'B': 'A',
  'A': 'S',
  'S': 'S'  // Max rank
};

/**
 * Fusion Recipes
 * 3 items of same type + same rank → 1 item of next rank
 */
export const FUSION_RULES = {
  description: 'Combine 3 items of the same type and rank to create 1 item of the next rank',
  requirements: {
    itemCount: 3,
    sameType: true,
    sameRank: true,
    excludeEquipped: true
  },
  validTypes: ['gear', 'pet', 'vehicle'],
  examples: [
    { input: 'C Gear + C Gear + C Gear', output: 'B Gear' },
    { input: 'B Pet + B Pet + B Pet', output: 'A Pet' },
    { input: 'A Vehicle + A Vehicle + A Vehicle', output: 'S Vehicle' }
  ]
};

/**
 * Special Recipe
 * Specific combination for premium rewards
 */
export const SPECIAL_RECIPE = {
  description: 'Combine specific items for a chance at premium loot',
  recipe: {
    items: [
      { type: 'gear', rank: 'C' },
      { type: 'gear', rank: 'B' },
      { type: 'pet', rank: 'C' }
    ],
    orderMatters: false
  },
  possibleOutputs: [
    { type: 'gear', chance: 0.30, rank: 'B' },
    { type: 'pet', chance: 0.30, rank: 'B' },
    { type: 'gift_key', chance: 0.20, amount: 1 },
    { type: 'treasure_box', chance: 0.20, rank: 'B' }
  ]
};

/**
 * Generic Alchemy
 * Any 3 items → treasure box based on highest rank
 */
export const ALCHEMY_RULES = {
  description: 'Combine any 3 items to create a treasure box. Box rank is based on highest input rank.',
  requirements: {
    itemCount: 3,
    anyType: true,
    anyRank: true,
    excludeEquipped: true
  },
  output: {
    type: 'treasure_box',
    rankDetermination: 'highest_input'
  },
  examples: [
    { input: 'C Gear + C Pet + C Armor', output: 'C-Rank Treasure Box' },
    { input: 'C Gear + B Pet + C Armor', output: 'B-Rank Treasure Box' },
    { input: 'C Gear + A Pet + B Armor', output: 'A-Rank Treasure Box' }
  ]
};

/**
 * Item Filtering Rules
 */
export const FILTER_RULES = {
  excludeEquipped: true,
  excludeRanks: [],  // Can be ['A', 'S'] to protect high-rank items
  includeTypes: ['gear', 'pet', 'vehicle'],
  minRank: 'C',
  maxCount: 3
};

/**
 * Treasure Box Contents
 * What you can get from treasure boxes
 */
export const TREASURE_BOX_REWARDS = {
  'C': {
    gold: { min: 100, max: 500 },
    items: { count: { min: 1, max: 2 }, rank: 'C' },
    rareChance: 0.10  // 10% chance for B-rank item
  },
  'B': {
    gold: { min: 500, max: 1500 },
    items: { count: { min: 2, max: 3 }, rank: 'B' },
    rareChance: 0.15  // 15% chance for A-rank item
  },
  'A': {
    gold: { min: 1500, max: 5000 },
    items: { count: { min: 2, max: 4 }, rank: 'A' },
    rareChance: 0.20  // 20% chance for S-rank item
  },
  'S': {
    gold: { min: 5000, max: 15000 },
    items: { count: { min: 3, max: 5 }, rank: 'S' },
    guaranteedLegendary: true
  }
};

/**
 * Determine recipe type from items
 */
export function getRecipeType(items) {
  if (!items || items.length !== 3) {
    return null;
  }

  // Check for Special Recipe
  if (isSpecialRecipe(items)) {
    return RECIPE_TYPES.SPECIAL;
  }

  // Check for Fusion
  if (isFusionRecipe(items)) {
    return RECIPE_TYPES.FUSION;
  }

  // Default to Alchemy
  return RECIPE_TYPES.ALCHEMY;
}

/**
 * Check if items match special recipe
 */
export function isSpecialRecipe(items) {
  if (items.length !== 3) return false;

  const hasCGear = items.some(it => it.type === 'gear' && (it.rank || 'C') === 'C');
  const hasBGear = items.some(it => it.type === 'gear' && it.rank === 'B');
  const hasCPet = items.some(it => (it.slot === 'pet' || it.type === 'pet') && (it.rank || 'C') === 'C');

  return hasCGear && hasBGear && hasCPet;
}

/**
 * Check if items can be fused
 */
export function isFusionRecipe(items) {
  if (items.length !== 3) return false;

  const firstType = items[0].type || items[0].slot;
  const firstRank = items[0].rank || 'C';

  return items.every(item => {
    const itemType = item.type || item.slot;
    const itemRank = item.rank || 'C';
    return itemType === firstType && itemRank === firstRank;
  });
}

/**
 * Get highest rank from items
 */
export function getHighestRank(items) {
  let highestRank = 'C';
  let highestIndex = 0;

  for (const item of items) {
    const itemRank = item.rank || 'C';
    const itemIndex = ITEM_RANKS.indexOf(itemRank);
    
    if (itemIndex > highestIndex) {
      highestIndex = itemIndex;
      highestRank = itemRank;
    }
  }

  return highestRank;
}

/**
 * Get next rank for fusion
 */
export function getNextRank(currentRank) {
  return RANK_PROGRESSION[currentRank] || currentRank;
}

/**
 * Validate items for crafting
 */
export function validateItems(items, equipped = []) {
  const errors = [];

  if (!items || items.length !== 3) {
    errors.push('Must have exactly 3 items');
  }

  if (equipped && equipped.length > 0) {
    const equippedIds = equipped.map(e => e?.id).filter(Boolean);
    const hasEquipped = items.some(item => equippedIds.includes(item.id));
    if (hasEquipped) {
      errors.push('Cannot use equipped items');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generate reward for special recipe
 */
export function generateSpecialReward() {
  const rand = Math.random();
  let cumulative = 0;

  for (const output of SPECIAL_RECIPE.possibleOutputs) {
    cumulative += output.chance;
    if (rand <= cumulative) {
      return {
        type: output.type,
        rank: output.rank,
        amount: output.amount || 1
      };
    }
  }

  // Fallback
  return { type: 'gear', rank: 'B' };
}

/**
 * Recipe statistics
 */
export const RECIPE_STATS = {
  totalRecipeTypes: 3,
  fusionCombinations: ITEM_RANKS.length - 1, // C→B, B→A, A→S
  specialRecipes: 1,
  treasureBoxRanks: 4,
  maxItemsPerCraft: 3
};

export default {
  RECIPE_TYPES,
  ITEM_RANKS,
  RANK_PROGRESSION,
  FUSION_RULES,
  SPECIAL_RECIPE,
  ALCHEMY_RULES,
  FILTER_RULES,
  TREASURE_BOX_REWARDS,
  getRecipeType,
  isSpecialRecipe,
  isFusionRecipe,
  getHighestRank,
  getNextRank,
  validateItems,
  generateSpecialReward,
  RECIPE_STATS
};

