/**
 * Rank tiers used throughout the system
 * Follows common rank progression: E -> D -> C -> B -> A -> S -> SS
 */
export type RankTier = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS';
/**
 * Entity categories that define their role/archetype
 */
export type EntityCategory = 'hero' | 'villain' | 'npc' | 'slayer' | 'hunter' | 'guardian' | 'mage' | 'assassin' | 'support' | 'minion' | 'elite' | 'boss' | 'pet' | 'merchant' | 'crafter';
/**
 * Rank tier configuration
 */
export interface RankTierConfig {
    id: RankTier;
    label: string;
    accentColor: string;
    speedMultiplier: number;
    powerMultiplier: number;
    healthMultiplier: number;
    rarityWeight: number;
}
/**
 * Full rank definition combining tier and category
 */
export interface Rank {
    tier: RankTier;
    category: EntityCategory;
    displayName: string;
}
/**
 * Complete rank tier configurations
 */
export declare const RANK_TIERS: Record<RankTier, RankTierConfig>;
/**
 * Category display configurations
 */
export declare const CATEGORY_CONFIG: Record<EntityCategory, {
    label: string;
    color: string;
    icon: string;
}>;
/**
 * Helper function to create a rank
 */
export declare function createRank(tier: RankTier, category: EntityCategory): Rank;
/**
 * Get rank tier configuration
 */
export declare function getRankTierConfig(tier: RankTier): RankTierConfig;
/**
 * Get category configuration
 */
export declare function getCategoryConfig(category: EntityCategory): {
    label: string;
    color: string;
    icon: string;
};
//# sourceMappingURL=RankConfig.d.ts.map