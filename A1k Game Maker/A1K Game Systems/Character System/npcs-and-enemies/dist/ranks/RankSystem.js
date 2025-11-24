import { createRank, getRankTierConfig, getCategoryConfig } from './RankConfig.js';
/**
 * RankSystem manages rank progression, calculations, and utilities
 */
export class RankSystem {
    constructor() { }
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!RankSystem.instance) {
            RankSystem.instance = new RankSystem();
        }
        return RankSystem.instance;
    }
    /**
     * Create a new rank
     */
    createRank(tier, category) {
        return createRank(tier, category);
    }
    /**
     * Get all available rank tiers
     */
    getAllTiers() {
        return ['E', 'D', 'C', 'B', 'A', 'S', 'SS'];
    }
    /**
     * Get all available categories
     */
    getAllCategories() {
        return [
            'hero', 'villain', 'npc', 'slayer', 'hunter', 'guardian',
            'mage', 'assassin', 'support', 'minion', 'elite', 'boss',
            'pet', 'merchant', 'crafter'
        ];
    }
    /**
     * Calculate power level based on rank
     */
    calculatePowerLevel(tier, baseLevel = 100) {
        const config = getRankTierConfig(tier);
        return Math.floor(baseLevel * config.powerMultiplier);
    }
    /**
     * Calculate health based on rank
     */
    calculateHealth(tier, baseHealth = 100) {
        const config = getRankTierConfig(tier);
        return Math.floor(baseHealth * config.healthMultiplier);
    }
    /**
     * Calculate speed based on rank
     */
    calculateSpeed(tier, baseSpeed = 100) {
        const config = getRankTierConfig(tier);
        return Math.floor(baseSpeed * config.speedMultiplier);
    }
    /**
     * Compare two ranks (returns positive if rank1 > rank2)
     */
    compareRanks(tier1, tier2) {
        const tiers = this.getAllTiers();
        return tiers.indexOf(tier1) - tiers.indexOf(tier2);
    }
    /**
     * Check if one rank is higher than another
     */
    isHigherRank(tier1, tier2) {
        return this.compareRanks(tier1, tier2) > 0;
    }
    /**
     * Get next rank tier (or null if already max)
     */
    getNextTier(currentTier) {
        const tiers = this.getAllTiers();
        const currentIndex = tiers.indexOf(currentTier);
        if (currentIndex >= tiers.length - 1)
            return null;
        return tiers[currentIndex + 1];
    }
    /**
     * Get previous rank tier (or null if already min)
     */
    getPreviousTier(currentTier) {
        const tiers = this.getAllTiers();
        const currentIndex = tiers.indexOf(currentTier);
        if (currentIndex <= 0)
            return null;
        return tiers[currentIndex - 1];
    }
    /**
     * Get rank color
     */
    getRankColor(tier) {
        return getRankTierConfig(tier).accentColor;
    }
    /**
     * Get category color
     */
    getCategoryColor(category) {
        return getCategoryConfig(category).color;
    }
    /**
     * Get category icon
     */
    getCategoryIcon(category) {
        return getCategoryConfig(category).icon;
    }
    /**
     * Format rank display name
     */
    formatRankName(tier, category) {
        const rank = this.createRank(tier, category);
        return rank.displayName;
    }
    /**
     * Generate random rank tier based on rarity weights
     */
    getRandomTier() {
        const tiers = this.getAllTiers();
        const weights = tiers.map(tier => getRankTierConfig(tier).rarityWeight);
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        let random = Math.random() * totalWeight;
        for (let i = 0; i < tiers.length; i++) {
            random -= weights[i];
            if (random <= 0)
                return tiers[i];
        }
        return tiers[tiers.length - 1];
    }
    /**
     * Get rank tier by index (0 = E, 6 = SS)
     */
    getTierByIndex(index) {
        const tiers = this.getAllTiers();
        if (index < 0 || index >= tiers.length)
            return null;
        return tiers[index];
    }
    /**
     * Get index of rank tier (E = 0, SS = 6)
     */
    getTierIndex(tier) {
        return this.getAllTiers().indexOf(tier);
    }
}
// Export singleton instance
export const rankSystem = RankSystem.getInstance();
//# sourceMappingURL=RankSystem.js.map