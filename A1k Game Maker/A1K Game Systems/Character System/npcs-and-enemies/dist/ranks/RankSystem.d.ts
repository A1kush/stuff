import { Rank, RankTier, EntityCategory } from './RankConfig.js';
/**
 * RankSystem manages rank progression, calculations, and utilities
 */
export declare class RankSystem {
    private static instance;
    private constructor();
    /**
     * Get singleton instance
     */
    static getInstance(): RankSystem;
    /**
     * Create a new rank
     */
    createRank(tier: RankTier, category: EntityCategory): Rank;
    /**
     * Get all available rank tiers
     */
    getAllTiers(): RankTier[];
    /**
     * Get all available categories
     */
    getAllCategories(): EntityCategory[];
    /**
     * Calculate power level based on rank
     */
    calculatePowerLevel(tier: RankTier, baseLevel?: number): number;
    /**
     * Calculate health based on rank
     */
    calculateHealth(tier: RankTier, baseHealth?: number): number;
    /**
     * Calculate speed based on rank
     */
    calculateSpeed(tier: RankTier, baseSpeed?: number): number;
    /**
     * Compare two ranks (returns positive if rank1 > rank2)
     */
    compareRanks(tier1: RankTier, tier2: RankTier): number;
    /**
     * Check if one rank is higher than another
     */
    isHigherRank(tier1: RankTier, tier2: RankTier): boolean;
    /**
     * Get next rank tier (or null if already max)
     */
    getNextTier(currentTier: RankTier): RankTier | null;
    /**
     * Get previous rank tier (or null if already min)
     */
    getPreviousTier(currentTier: RankTier): RankTier | null;
    /**
     * Get rank color
     */
    getRankColor(tier: RankTier): string;
    /**
     * Get category color
     */
    getCategoryColor(category: EntityCategory): string;
    /**
     * Get category icon
     */
    getCategoryIcon(category: EntityCategory): string;
    /**
     * Format rank display name
     */
    formatRankName(tier: RankTier, category: EntityCategory): string;
    /**
     * Generate random rank tier based on rarity weights
     */
    getRandomTier(): RankTier;
    /**
     * Get rank tier by index (0 = E, 6 = SS)
     */
    getTierByIndex(index: number): RankTier | null;
    /**
     * Get index of rank tier (E = 0, SS = 6)
     */
    getTierIndex(tier: RankTier): number;
}
export declare const rankSystem: RankSystem;
//# sourceMappingURL=RankSystem.d.ts.map