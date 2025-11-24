import { Entity } from '../entities/Entity.js';
import { NPC } from '../entities/NPC.js';
import { Enemy } from '../entities/Enemy.js';
import { rankSystem } from '../ranks/RankSystem.js';
/**
 * Entity factory for creating different entity types
 */
export class EntityManager {
    constructor() {
        this.entities = new Map();
        this.entityIdCounter = 0;
    }
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!EntityManager.instance) {
            EntityManager.instance = new EntityManager();
        }
        return EntityManager.instance;
    }
    /**
     * Generate unique entity ID
     */
    generateId(prefix = 'entity') {
        return `${prefix}_${++this.entityIdCounter}_${Date.now()}`;
    }
    /**
     * Create a new NPC
     */
    createNPC(config) {
        const id = config.id || this.generateId('npc');
        const fullConfig = {
            id,
            name: config.name || 'Unknown NPC',
            rank: config.rank || rankSystem.createRank('C', 'npc'),
            stats: config.stats || this.getDefaultStats('npc'),
            visuals: config.visuals || this.getDefaultVisuals(),
            interactionType: config.interactionType || 'quest_giver',
            dialogue: config.dialogue,
            questIds: config.questIds,
            inventory: config.inventory,
            services: config.services,
            tags: config.tags,
            description: config.description,
            metadata: config.metadata
        };
        const npc = new NPC(fullConfig);
        npc.applyRankModifiers();
        this.entities.set(id, npc);
        return npc;
    }
    /**
     * Create a new Enemy
     */
    createEnemy(config) {
        const id = config.id || this.generateId('enemy');
        const fullConfig = {
            id,
            name: config.name || 'Unknown Enemy',
            rank: config.rank || rankSystem.createRank('C', 'minion'),
            stats: config.stats || this.getDefaultStats('enemy'),
            visuals: config.visuals || this.getDefaultVisuals(),
            enemyType: config.enemyType || 'minion',
            behavior: config.behavior || 'aggressive',
            attackPower: config.attackPower,
            attackRange: config.attackRange,
            attackSpeed: config.attackSpeed,
            detectionRange: config.detectionRange,
            lootTable: config.lootTable,
            experienceValue: config.experienceValue,
            abilities: config.abilities,
            tags: config.tags,
            description: config.description,
            metadata: config.metadata
        };
        const enemy = new Enemy(fullConfig);
        enemy.applyRankModifiers();
        this.entities.set(id, enemy);
        return enemy;
    }
    /**
     * Create a generic entity
     */
    createEntity(config) {
        const id = config.id || this.generateId('entity');
        const fullConfig = {
            id,
            name: config.name || 'Unknown Entity',
            rank: config.rank || rankSystem.createRank('C', 'npc'),
            stats: config.stats || this.getDefaultStats('generic'),
            visuals: config.visuals || this.getDefaultVisuals(),
            tags: config.tags,
            description: config.description,
            metadata: config.metadata
        };
        const entity = new Entity(fullConfig);
        entity.applyRankModifiers();
        this.entities.set(id, entity);
        return entity;
    }
    /**
     * Get default stats based on entity type
     */
    getDefaultStats(type) {
        const baseStats = {
            npc: { health: 100, maxHealth: 100, power: 10, speed: 50, defense: 5, luck: 5 },
            enemy: { health: 100, maxHealth: 100, power: 20, speed: 60, defense: 10, luck: 3 },
            generic: { health: 100, maxHealth: 100, power: 15, speed: 50, defense: 5, luck: 5 }
        };
        return baseStats[type] || baseStats.generic;
    }
    /**
     * Get default visuals
     */
    getDefaultVisuals() {
        return {
            assetPath: 'placeholder.png',
            assetKey: 'placeholder',
            scale: 1.0
        };
    }
    /**
     * Get entity by ID
     */
    getEntity(id) {
        return this.entities.get(id);
    }
    /**
     * Get all entities
     */
    getAllEntities() {
        return Array.from(this.entities.values());
    }
    /**
     * Get entities by category
     */
    getEntitiesByCategory(category) {
        return this.getAllEntities().filter(e => e.rank.category === category);
    }
    /**
     * Get entities by rank tier
     */
    getEntitiesByRank(tier) {
        return this.getAllEntities().filter(e => e.rank.tier === tier);
    }
    /**
     * Get NPCs
     */
    getNPCs() {
        return this.getAllEntities().filter(e => e instanceof NPC);
    }
    /**
     * Get Enemies
     */
    getEnemies() {
        return this.getAllEntities().filter(e => e instanceof Enemy);
    }
    /**
     * Get active entities
     */
    getActiveEntities() {
        return this.getAllEntities().filter(e => e.isActive);
    }
    /**
     * Remove entity
     */
    removeEntity(id) {
        const entity = this.entities.get(id);
        if (entity) {
            entity.destroy();
            return this.entities.delete(id);
        }
        return false;
    }
    /**
     * Clear all entities
     */
    clearAll() {
        this.getAllEntities().forEach(entity => entity.destroy());
        this.entities.clear();
    }
    /**
     * Update all active entities
     */
    updateAll(deltaTime) {
        this.getActiveEntities().forEach(entity => {
            entity.update(deltaTime);
        });
    }
    /**
     * Render all active entities
     */
    renderAll(container) {
        this.getActiveEntities().forEach(entity => {
            entity.render(container);
        });
    }
    /**
     * Get entity count
     */
    getEntityCount() {
        return this.entities.size;
    }
    /**
     * Get entities by tag
     */
    getEntitiesByTag(tag) {
        return this.getAllEntities().filter(e => e.tags.includes(tag));
    }
    /**
     * Import entities from JSON data
     */
    importFromJSON(data) {
        const imported = [];
        data.forEach(entityData => {
            try {
                let entity;
                if (entityData.type === 'npc' || entityData.interactionType) {
                    entity = this.createNPC(entityData);
                }
                else if (entityData.type === 'enemy' || entityData.enemyType) {
                    entity = this.createEnemy(entityData);
                }
                else {
                    entity = this.createEntity(entityData);
                }
                imported.push(entity);
            }
            catch (error) {
                console.error('Error importing entity:', entityData, error);
            }
        });
        return imported;
    }
    /**
     * Export all entities to JSON
     */
    exportToJSON() {
        return this.getAllEntities().map(e => e.toJSON());
    }
    /**
     * Get statistics
     */
    getStats() {
        const entities = this.getAllEntities();
        const stats = {
            total: entities.length,
            active: this.getActiveEntities().length,
            byCategory: {},
            byRank: {},
            npcs: this.getNPCs().length,
            enemies: this.getEnemies().length
        };
        // Count by category
        rankSystem.getAllCategories().forEach(cat => {
            stats.byCategory[cat] = this.getEntitiesByCategory(cat).length;
        });
        // Count by rank
        rankSystem.getAllTiers().forEach(tier => {
            stats.byRank[tier] = this.getEntitiesByRank(tier).length;
        });
        return stats;
    }
}
// Export singleton instance
export const entityManager = EntityManager.getInstance();
//# sourceMappingURL=EntityManager.js.map