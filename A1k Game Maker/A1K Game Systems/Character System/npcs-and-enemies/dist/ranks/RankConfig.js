/**
 * Complete rank tier configurations
 */
export const RANK_TIERS = {
    E: {
        id: 'E',
        label: 'E Rank',
        accentColor: '#cffafe',
        speedMultiplier: 0.75,
        powerMultiplier: 0.6,
        healthMultiplier: 0.7,
        rarityWeight: 1
    },
    D: {
        id: 'D',
        label: 'D Rank',
        accentColor: '#bae6fd',
        speedMultiplier: 0.85,
        powerMultiplier: 0.8,
        healthMultiplier: 0.85,
        rarityWeight: 2
    },
    C: {
        id: 'C',
        label: 'C Rank',
        accentColor: '#a5b4fc',
        speedMultiplier: 0.95,
        powerMultiplier: 1.0,
        healthMultiplier: 1.0,
        rarityWeight: 3
    },
    B: {
        id: 'B',
        label: 'B Rank',
        accentColor: '#fbcfe8',
        speedMultiplier: 1.05,
        powerMultiplier: 1.3,
        healthMultiplier: 1.2,
        rarityWeight: 5
    },
    A: {
        id: 'A',
        label: 'A Rank',
        accentColor: '#fcd34d',
        speedMultiplier: 1.15,
        powerMultiplier: 1.6,
        healthMultiplier: 1.5,
        rarityWeight: 8
    },
    S: {
        id: 'S',
        label: 'S Rank',
        accentColor: '#fca5a5',
        speedMultiplier: 1.25,
        powerMultiplier: 2.0,
        healthMultiplier: 1.8,
        rarityWeight: 13
    },
    SS: {
        id: 'SS',
        label: 'SS Rank',
        accentColor: '#f472b6',
        speedMultiplier: 1.35,
        powerMultiplier: 2.5,
        healthMultiplier: 2.2,
        rarityWeight: 21
    }
};
/**
 * Category display configurations
 */
export const CATEGORY_CONFIG = {
    hero: { label: 'Hero', color: '#60a5fa', icon: '⚔️' },
    villain: { label: 'Villain', color: '#dc2626', icon: '☠️' },
    npc: { label: 'NPC', color: '#10b981', icon: '👤' },
    slayer: { label: 'Slayer', color: '#f59e0b', icon: '🗡️' },
    hunter: { label: 'Hunter', color: '#84cc16', icon: '🏹' },
    guardian: { label: 'Guardian', color: '#0ea5e9', icon: '🛡️' },
    mage: { label: 'Mage', color: '#8b5cf6', icon: '🔮' },
    assassin: { label: 'Assassin', color: '#6b7280', icon: '🗡️' },
    support: { label: 'Support', color: '#06b6d4', icon: '💚' },
    minion: { label: 'Minion', color: '#78716c', icon: '👾' },
    elite: { label: 'Elite', color: '#ea580c', icon: '💀' },
    boss: { label: 'Boss', color: '#dc2626', icon: '👹' },
    pet: { label: 'Pet', color: '#ec4899', icon: '🐾' },
    merchant: { label: 'Merchant', color: '#eab308', icon: '💰' },
    crafter: { label: 'Crafter', color: '#a855f7', icon: '⚒️' }
};
/**
 * Helper function to create a rank
 */
export function createRank(tier, category) {
    const tierConfig = RANK_TIERS[tier];
    const categoryConfig = CATEGORY_CONFIG[category];
    return {
        tier,
        category,
        displayName: `${tierConfig.label} ${categoryConfig.label}`
    };
}
/**
 * Get rank tier configuration
 */
export function getRankTierConfig(tier) {
    return RANK_TIERS[tier];
}
/**
 * Get category configuration
 */
export function getCategoryConfig(category) {
    return CATEGORY_CONFIG[category];
}
//# sourceMappingURL=RankConfig.js.map