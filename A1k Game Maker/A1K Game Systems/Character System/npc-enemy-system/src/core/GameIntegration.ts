import { EntityManager } from './EntityManager';
import { RankSystem } from './RankSystem';

class GameIntegration {
    private entityManager: EntityManager;
    private rankSystem: RankSystem;

    constructor() {
        this.entityManager = new EntityManager();
        this.rankSystem = new RankSystem();
    }

    initialize() {
        // Initialize the entity manager and rank system
        this.entityManager.initialize();
        this.rankSystem.initialize();
    }

    addEntity(entity) {
        // Add an entity (NPC or Enemy) to the game
        this.entityManager.addEntity(entity);
    }

    updateEntities(deltaTime) {
        // Update all entities in the game
        this.entityManager.updateEntities(deltaTime);
    }

    rankEntity(entityId, newRank) {
        // Rank an entity based on its ID
        this.rankSystem.rankEntity(entityId, newRank);
    }

    getEntityRank(entityId) {
        // Get the rank of an entity
        return this.rankSystem.getEntityRank(entityId);
    }
}

export default GameIntegration;