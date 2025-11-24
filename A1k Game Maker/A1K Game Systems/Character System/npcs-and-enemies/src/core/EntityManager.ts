import { Entity, EntityConfig } from '../entities/Entity.js';
import { NPC, NPCConfig } from '../entities/NPC.js';
import { Enemy, EnemyConfig } from '../entities/Enemy.js';
import { RankTier, EntityCategory } from '../ranks/RankConfig.js';
import { rankSystem } from '../ranks/RankSystem.js';

/**
 * Entity factory for creating different entity types
 */
export class EntityManager {
  private static instance: EntityManager;
  private entities: Map<string, Entity> = new Map();
  private entityIdCounter: number = 0;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): EntityManager {
    if (!EntityManager.instance) {
      EntityManager.instance = new EntityManager();
    }
    return EntityManager.instance;
  }

  /**
   * Generate unique entity ID
   */
  private generateId(prefix: string = 'entity'): string {
    return `${prefix}_${++this.entityIdCounter}_${Date.now()}`;
  }

  /**
   * Create a new NPC
   */
  createNPC(config: Partial<NPCConfig>): NPC {
    const id = config.id || this.generateId('npc');
    
    const fullConfig: NPCConfig = {
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
  createEnemy(config: Partial<EnemyConfig>): Enemy {
    const id = config.id || this.generateId('enemy');
    
    const fullConfig: EnemyConfig = {
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
  createEntity(config: Partial<EntityConfig>): Entity {
    const id = config.id || this.generateId('entity');
    
    const fullConfig: EntityConfig = {
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
  private getDefaultStats(type: string): any {
    const baseStats = {
      npc: { health: 100, maxHealth: 100, power: 10, speed: 50, defense: 5, luck: 5 },
      enemy: { health: 100, maxHealth: 100, power: 20, speed: 60, defense: 10, luck: 3 },
      generic: { health: 100, maxHealth: 100, power: 15, speed: 50, defense: 5, luck: 5 }
    };
    
    return baseStats[type as keyof typeof baseStats] || baseStats.generic;
  }

  /**
   * Get default visuals
   */
  private getDefaultVisuals(): any {
    return {
      assetPath: 'placeholder.png',
      assetKey: 'placeholder',
      scale: 1.0
    };
  }

  /**
   * Get entity by ID
   */
  getEntity(id: string): Entity | undefined {
    return this.entities.get(id);
  }

  /**
   * Get all entities
   */
  getAllEntities(): Entity[] {
    return Array.from(this.entities.values());
  }

  /**
   * Get entities by category
   */
  getEntitiesByCategory(category: EntityCategory): Entity[] {
    return this.getAllEntities().filter(e => e.rank.category === category);
  }

  /**
   * Get entities by rank tier
   */
  getEntitiesByRank(tier: RankTier): Entity[] {
    return this.getAllEntities().filter(e => e.rank.tier === tier);
  }

  /**
   * Get NPCs
   */
  getNPCs(): NPC[] {
    return this.getAllEntities().filter(e => e instanceof NPC) as NPC[];
  }

  /**
   * Get Enemies
   */
  getEnemies(): Enemy[] {
    return this.getAllEntities().filter(e => e instanceof Enemy) as Enemy[];
  }

  /**
   * Get active entities
   */
  getActiveEntities(): Entity[] {
    return this.getAllEntities().filter(e => e.isActive);
  }

  /**
   * Remove entity
   */
  removeEntity(id: string): boolean {
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
  clearAll(): void {
    this.getAllEntities().forEach(entity => entity.destroy());
    this.entities.clear();
  }

  /**
   * Update all active entities
   */
  updateAll(deltaTime: number): void {
    this.getActiveEntities().forEach(entity => {
      entity.update(deltaTime);
    });
  }

  /**
   * Render all active entities
   */
  renderAll(container: HTMLElement): void {
    this.getActiveEntities().forEach(entity => {
      entity.render(container);
    });
  }

  /**
   * Get entity count
   */
  getEntityCount(): number {
    return this.entities.size;
  }

  /**
   * Get entities by tag
   */
  getEntitiesByTag(tag: string): Entity[] {
    return this.getAllEntities().filter(e => e.tags.includes(tag));
  }

  /**
   * Import entities from JSON data
   */
  importFromJSON(data: any[]): Entity[] {
    const imported: Entity[] = [];
    
    data.forEach(entityData => {
      try {
        let entity: Entity;
        
        if (entityData.type === 'npc' || entityData.interactionType) {
          entity = this.createNPC(entityData);
        } else if (entityData.type === 'enemy' || entityData.enemyType) {
          entity = this.createEnemy(entityData);
        } else {
          entity = this.createEntity(entityData);
        }
        
        imported.push(entity);
      } catch (error) {
        console.error('Error importing entity:', entityData, error);
      }
    });
    
    return imported;
  }

  /**
   * Export all entities to JSON
   */
  exportToJSON(): any[] {
    return this.getAllEntities().map(e => e.toJSON());
  }

  /**
   * Get statistics
   */
  getStats(): any {
    const entities = this.getAllEntities();
    const stats: any = {
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
