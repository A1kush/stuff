import { Entity, EntityConfig } from '../entities/Entity.js';
import { NPC, NPCConfig } from '../entities/NPC.js';
import { Enemy, EnemyConfig } from '../entities/Enemy.js';
import { RankTier, EntityCategory } from '../ranks/RankConfig.js';
/**
 * Entity factory for creating different entity types
 */
export declare class EntityManager {
    private static instance;
    private entities;
    private entityIdCounter;
    private constructor();
    /**
     * Get singleton instance
     */
    static getInstance(): EntityManager;
    /**
     * Generate unique entity ID
     */
    private generateId;
    /**
     * Create a new NPC
     */
    createNPC(config: Partial<NPCConfig>): NPC;
    /**
     * Create a new Enemy
     */
    createEnemy(config: Partial<EnemyConfig>): Enemy;
    /**
     * Create a generic entity
     */
    createEntity(config: Partial<EntityConfig>): Entity;
    /**
     * Get default stats based on entity type
     */
    private getDefaultStats;
    /**
     * Get default visuals
     */
    private getDefaultVisuals;
    /**
     * Get entity by ID
     */
    getEntity(id: string): Entity | undefined;
    /**
     * Get all entities
     */
    getAllEntities(): Entity[];
    /**
     * Get entities by category
     */
    getEntitiesByCategory(category: EntityCategory): Entity[];
    /**
     * Get entities by rank tier
     */
    getEntitiesByRank(tier: RankTier): Entity[];
    /**
     * Get NPCs
     */
    getNPCs(): NPC[];
    /**
     * Get Enemies
     */
    getEnemies(): Enemy[];
    /**
     * Get active entities
     */
    getActiveEntities(): Entity[];
    /**
     * Remove entity
     */
    removeEntity(id: string): boolean;
    /**
     * Clear all entities
     */
    clearAll(): void;
    /**
     * Update all active entities
     */
    updateAll(deltaTime: number): void;
    /**
     * Render all active entities
     */
    renderAll(container: HTMLElement): void;
    /**
     * Get entity count
     */
    getEntityCount(): number;
    /**
     * Get entities by tag
     */
    getEntitiesByTag(tag: string): Entity[];
    /**
     * Import entities from JSON data
     */
    importFromJSON(data: any[]): Entity[];
    /**
     * Export all entities to JSON
     */
    exportToJSON(): any[];
    /**
     * Get statistics
     */
    getStats(): any;
}
export declare const entityManager: EntityManager;
//# sourceMappingURL=EntityManager.d.ts.map