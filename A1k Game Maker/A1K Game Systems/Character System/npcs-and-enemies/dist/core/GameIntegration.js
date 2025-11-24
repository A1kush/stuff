import { entityManager } from './EntityManager.js';
/**
 * GameIntegration class - easy integration into any HTML game
 */
export class GameIntegration {
    constructor(config = {}) {
        this.container = null;
        this.isRunning = false;
        this.updateLoopId = null;
        this.lastUpdateTime = 0;
        /**
         * Main game loop
         */
        this.gameLoop = () => {
            if (!this.isRunning)
                return;
            const now = Date.now();
            const deltaTime = now - this.lastUpdateTime;
            this.lastUpdateTime = now;
            // Update all entities
            entityManager.updateAll(deltaTime);
            // Render if enabled
            if (this.config.enableAutoRender && this.container) {
                entityManager.renderAll(this.container);
            }
            // Collision detection if enabled
            if (this.config.enableCollisionDetection) {
                this.checkCollisions();
            }
            // Schedule next frame
            this.updateLoopId = requestAnimationFrame(this.gameLoop);
        };
        this.config = {
            containerSelector: config.containerSelector || '#game-container',
            autoUpdate: config.autoUpdate !== false,
            updateInterval: config.updateInterval || 16, // ~60fps
            enableAutoRender: config.enableAutoRender !== false,
            enableCollisionDetection: config.enableCollisionDetection || false
        };
    }
    /**
     * Initialize the integration
     */
    init() {
        // Find container
        if (this.config.containerSelector) {
            this.container = document.querySelector(this.config.containerSelector);
            if (!this.container) {
                console.error(`Container not found: ${this.config.containerSelector}`);
                return false;
            }
        }
        // Add base styles
        this.injectBaseStyles();
        return true;
    }
    /**
     * Inject base CSS for entities
     */
    injectBaseStyles() {
        const styleId = 'npc-enemy-system-styles';
        if (document.getElementById(styleId))
            return;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
      .entity {
        position: absolute;
        pointer-events: all;
        transition: transform 0.1s ease-out;
        z-index: 10;
      }
      
      .entity img {
        display: block;
        image-rendering: pixelated;
      }
      
      .entity.npc {
        cursor: pointer;
      }
      
      .entity.enemy {
        filter: drop-shadow(0 0 3px rgba(255, 0, 0, 0.5));
      }
      
      .interaction-indicator {
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 16px;
        animation: bounce 0.6s ease-in-out infinite;
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        50% { transform: translateX(-50%) translateY(-5px); }
      }
      
      .enemy-health-bar {
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 4px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 2px;
        overflow: hidden;
      }
      
      .health-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #ef4444, #f87171);
        transition: width 0.3s ease;
      }
    `;
        document.head.appendChild(style);
    }
    /**
     * Start the game loop
     */
    start() {
        if (this.isRunning)
            return;
        this.isRunning = true;
        this.lastUpdateTime = Date.now();
        if (this.config.autoUpdate) {
            this.gameLoop();
        }
    }
    /**
     * Stop the game loop
     */
    stop() {
        this.isRunning = false;
        if (this.updateLoopId !== null) {
            cancelAnimationFrame(this.updateLoopId);
            this.updateLoopId = null;
        }
    }
    /**
     * Simple collision detection
     */
    checkCollisions() {
        const entities = entityManager.getActiveEntities();
        for (let i = 0; i < entities.length; i++) {
            for (let j = i + 1; j < entities.length; j++) {
                const a = entities[i];
                const b = entities[j];
                if (this.checkCollision(a, b)) {
                    this.handleCollision(a, b);
                }
            }
        }
    }
    /**
     * Check if two entities collide (simple AABB)
     */
    checkCollision(a, b) {
        const size = 32; // Default entity size
        return Math.abs(a.position.x - b.position.x) < size &&
            Math.abs(a.position.y - b.position.y) < size;
    }
    /**
     * Handle collision between two entities
     */
    handleCollision(a, b) {
        // Emit collision event
        if (a.element && b.element) {
            const event = new CustomEvent('entity-collision', {
                detail: { entity1: a, entity2: b }
            });
            a.element.dispatchEvent(event);
        }
    }
    /**
     * Add entity to the game (creates and returns the entity)
     */
    addNPC(config) {
        const npc = entityManager.createNPC(config);
        if (this.container) {
            npc.render(this.container);
        }
        return npc;
    }
    /**
     * Add enemy to the game
     */
    addEnemy(config) {
        const enemy = entityManager.createEnemy(config);
        if (this.container) {
            enemy.render(this.container);
        }
        return enemy;
    }
    /**
     * Load entities from JSON
     */
    loadEntitiesFromJSON(data) {
        const entities = entityManager.importFromJSON(data);
        if (this.container) {
            entities.forEach(entity => entity.render(this.container));
        }
        return entities;
    }
    /**
     * Load entities from URL
     */
    async loadEntitiesFromURL(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return this.loadEntitiesFromJSON(Array.isArray(data) ? data : data.entities || []);
        }
        catch (error) {
            console.error('Error loading entities from URL:', error);
            return [];
        }
    }
    /**
     * Clear all entities
     */
    clearAll() {
        entityManager.clearAll();
    }
    /**
     * Get entity manager for direct access
     */
    getEntityManager() {
        return entityManager;
    }
    /**
     * Manual update (if autoUpdate is disabled)
     */
    update(deltaTime) {
        entityManager.updateAll(deltaTime);
    }
    /**
     * Manual render (if enableAutoRender is disabled)
     */
    render() {
        if (this.container) {
            entityManager.renderAll(this.container);
        }
    }
    /**
     * Set container dynamically
     */
    setContainer(element) {
        this.container = element;
    }
    /**
     * Get container
     */
    getContainer() {
        return this.container;
    }
    /**
     * Check if running
     */
    isGameRunning() {
        return this.isRunning;
    }
    /**
     * Get stats
     */
    getStats() {
        return entityManager.getStats();
    }
}
/**
 * Simple factory function for quick setup
 */
export function createGame(config) {
    const game = new GameIntegration(config);
    game.init();
    return game;
}
//# sourceMappingURL=GameIntegration.js.map