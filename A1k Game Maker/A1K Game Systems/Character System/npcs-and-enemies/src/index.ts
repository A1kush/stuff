// Core exports
export { Entity, EntityConfig, EntityStats, EntityPosition, EntityVisuals } from './entities/Entity.js';
export { NPC, NPCConfig, NPCInteractionType } from './entities/NPC.js';
export { Enemy, EnemyConfig, EnemyBehaviorType, EnemyType } from './entities/Enemy.js';

// Rank system exports
export { 
  RankTier, 
  EntityCategory, 
  Rank, 
  RankTierConfig,
  RANK_TIERS,
  CATEGORY_CONFIG,
  createRank,
  getRankTierConfig,
  getCategoryConfig
} from './ranks/RankConfig.js';

export { RankSystem, rankSystem } from './ranks/RankSystem.js';

// Core system exports
export { EntityManager, entityManager } from './core/EntityManager.js';
export { GameIntegration, GameIntegrationConfig, createGame } from './core/GameIntegration.js';

// Version
export const VERSION = '1.0.0';
