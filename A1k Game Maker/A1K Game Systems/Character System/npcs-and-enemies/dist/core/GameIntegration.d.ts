import { Entity } from '../entities/Entity.js';
import { Enemy } from '../entities/Enemy.js';
import { NPC } from '../entities/NPC.js';
/**
 * Game integration configuration
 */
export interface GameIntegrationConfig {
    containerSelector?: string;
    autoUpdate?: boolean;
    updateInterval?: number;
    enableAutoRender?: boolean;
    enableCollisionDetection?: boolean;
}
/**
 * GameIntegration class - easy integration into any HTML game
 */
export declare class GameIntegration {
    private container;
    private config;
    private isRunning;
    private updateLoopId;
    private lastUpdateTime;
    constructor(config?: GameIntegrationConfig);
    /**
     * Initialize the integration
     */
    init(): boolean;
    /**
     * Inject base CSS for entities
     */
    private injectBaseStyles;
    /**
     * Start the game loop
     */
    start(): void;
    /**
     * Stop the game loop
     */
    stop(): void;
    /**
     * Main game loop
     */
    private gameLoop;
    /**
     * Simple collision detection
     */
    private checkCollisions;
    /**
     * Check if two entities collide (simple AABB)
     */
    private checkCollision;
    /**
     * Handle collision between two entities
     */
    private handleCollision;
    /**
     * Add entity to the game (creates and returns the entity)
     */
    addNPC(config: any): NPC;
    /**
     * Add enemy to the game
     */
    addEnemy(config: any): Enemy;
    /**
     * Load entities from JSON
     */
    loadEntitiesFromJSON(data: any[]): Entity[];
    /**
     * Load entities from URL
     */
    loadEntitiesFromURL(url: string): Promise<Entity[]>;
    /**
     * Clear all entities
     */
    clearAll(): void;
    /**
     * Get entity manager for direct access
     */
    getEntityManager(): import("./EntityManager.js").EntityManager;
    /**
     * Manual update (if autoUpdate is disabled)
     */
    update(deltaTime: number): void;
    /**
     * Manual render (if enableAutoRender is disabled)
     */
    render(): void;
    /**
     * Set container dynamically
     */
    setContainer(element: HTMLElement): void;
    /**
     * Get container
     */
    getContainer(): HTMLElement | null;
    /**
     * Check if running
     */
    isGameRunning(): boolean;
    /**
     * Get stats
     */
    getStats(): any;
}
/**
 * Simple factory function for quick setup
 */
export declare function createGame(config?: GameIntegrationConfig): GameIntegration;
//# sourceMappingURL=GameIntegration.d.ts.map