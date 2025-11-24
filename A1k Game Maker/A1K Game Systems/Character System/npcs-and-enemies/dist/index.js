// Core exports
export { Entity } from './entities/Entity.js';
export { NPC } from './entities/NPC.js';
export { Enemy } from './entities/Enemy.js';
// Rank system exports
export { RANK_TIERS, CATEGORY_CONFIG, createRank, getRankTierConfig, getCategoryConfig } from './ranks/RankConfig.js';
export { RankSystem, rankSystem } from './ranks/RankSystem.js';
// Core system exports
export { EntityManager, entityManager } from './core/EntityManager.js';
export { GameIntegration, createGame } from './core/GameIntegration.js';
// Version
export const VERSION = '1.0.0';
//# sourceMappingURL=index.js.map