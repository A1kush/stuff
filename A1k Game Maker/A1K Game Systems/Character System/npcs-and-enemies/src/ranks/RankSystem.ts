import { Rank, RankTier, EntityCategory, createRank, getRankTierConfig, getCategoryConfig } from './RankConfig.js';

/**
 * RankSystem manages rank progression, calculations, and utilities
 */
export class RankSystem {
  private static instance: RankSystem;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): RankSystem {
    if (!RankSystem.instance) {
      RankSystem.instance = new RankSystem();
    }
    return RankSystem.instance;
  }

  /**
   * Create a new rank
   */
  createRank(tier: RankTier, category: EntityCategory): Rank {
    return createRank(tier, category);
  }

  /**
   * Get all available rank tiers
   */
  getAllTiers(): RankTier[] {
    return ['E', 'D', 'C', 'B', 'A', 'S', 'SS'];
  }

  /**
   * Get all available categories
   */
  getAllCategories(): EntityCategory[] {
    return [
      'hero', 'villain', 'npc', 'slayer', 'hunter', 'guardian',
      'mage', 'assassin', 'support', 'minion', 'elite', 'boss',
      'pet', 'merchant', 'crafter'
    ];
  }

  /**
   * Calculate power level based on rank
   */
  calculatePowerLevel(tier: RankTier, baseLevel: number = 100): number {
    const config = getRankTierConfig(tier);
    return Math.floor(baseLevel * config.powerMultiplier);
  }

  /**
   * Calculate health based on rank
   */
  calculateHealth(tier: RankTier, baseHealth: number = 100): number {
    const config = getRankTierConfig(tier);
    return Math.floor(baseHealth * config.healthMultiplier);
  }

  /**
   * Calculate speed based on rank
   */
  calculateSpeed(tier: RankTier, baseSpeed: number = 100): number {
    const config = getRankTierConfig(tier);
    return Math.floor(baseSpeed * config.speedMultiplier);
  }

  /**
   * Compare two ranks (returns positive if rank1 > rank2)
   */
  compareRanks(tier1: RankTier, tier2: RankTier): number {
    const tiers = this.getAllTiers();
    return tiers.indexOf(tier1) - tiers.indexOf(tier2);
  }

  /**
   * Check if one rank is higher than another
   */
  isHigherRank(tier1: RankTier, tier2: RankTier): boolean {
    return this.compareRanks(tier1, tier2) > 0;
  }

  /**
   * Get next rank tier (or null if already max)
   */
  getNextTier(currentTier: RankTier): RankTier | null {
    const tiers = this.getAllTiers();
    const currentIndex = tiers.indexOf(currentTier);
    if (currentIndex >= tiers.length - 1) return null;
    return tiers[currentIndex + 1];
  }

  /**
   * Get previous rank tier (or null if already min)
   */
  getPreviousTier(currentTier: RankTier): RankTier | null {
    const tiers = this.getAllTiers();
    const currentIndex = tiers.indexOf(currentTier);
    if (currentIndex <= 0) return null;
    return tiers[currentIndex - 1];
  }

  /**
   * Get rank color
   */
  getRankColor(tier: RankTier): string {
    return getRankTierConfig(tier).accentColor;
  }

  /**
   * Get category color
   */
  getCategoryColor(category: EntityCategory): string {
    return getCategoryConfig(category).color;
  }

  /**
   * Get category icon
   */
  getCategoryIcon(category: EntityCategory): string {
    return getCategoryConfig(category).icon;
  }

  /**
   * Format rank display name
   */
  formatRankName(tier: RankTier, category: EntityCategory): string {
    const rank = this.createRank(tier, category);
    return rank.displayName;
  }

  /**
   * Generate random rank tier based on rarity weights
   */
  getRandomTier(): RankTier {
    const tiers = this.getAllTiers();
    const weights = tiers.map(tier => getRankTierConfig(tier).rarityWeight);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    let random = Math.random() * totalWeight;
    for (let i = 0; i < tiers.length; i++) {
      random -= weights[i];
      if (random <= 0) return tiers[i];
    }
    
    return tiers[tiers.length - 1];
  }

  /**
   * Get rank tier by index (0 = E, 6 = SS)
   */
  getTierByIndex(index: number): RankTier | null {
    const tiers = this.getAllTiers();
    if (index < 0 || index >= tiers.length) return null;
    return tiers[index];
  }

  /**
   * Get index of rank tier (E = 0, SS = 6)
   */
  getTierIndex(tier: RankTier): number {
    return this.getAllTiers().indexOf(tier);
  }
}

// Export singleton instance
export const rankSystem = RankSystem.getInstance();
