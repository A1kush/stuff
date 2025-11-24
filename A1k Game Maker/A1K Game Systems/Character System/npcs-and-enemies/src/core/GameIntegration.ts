import { entityManager } from './EntityManager.js';
import { Entity } from '../entities/Entity.js';
import { Enemy } from '../entities/Enemy.js';
import { NPC } from '../entities/NPC.js';

/**
 * Game integration configuration
 */
export interface GameIntegrationConfig {
  containerSelector?: string;
  autoUpdate?: boolean;
  updateInterval?: number; // ms
  enableAutoRender?: boolean;
  enableCollisionDetection?: boolean;
}

/**
 * GameIntegration class - easy integration into any HTML game
 */
export class GameIntegration {
  private container: HTMLElement | null = null;
  private config: GameIntegrationConfig;
  private isRunning: boolean = false;
  private updateLoopId: number | null = null;
  private lastUpdateTime: number = 0;

  constructor(config: GameIntegrationConfig = {}) {
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
  init(): boolean {
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
  private injectBaseStyles(): void {
    const styleId = 'npc-enemy-system-styles';
    
    if (document.getElementById(styleId)) return;
    
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
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastUpdateTime = Date.now();
    
    if (this.config.autoUpdate) {
      this.gameLoop();
    }
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    this.isRunning = false;
    
    if (this.updateLoopId !== null) {
      cancelAnimationFrame(this.updateLoopId);
      this.updateLoopId = null;
    }
  }

  /**
   * Main game loop
   */
  private gameLoop = (): void => {
    if (!this.isRunning) return;
    
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

  /**
   * Simple collision detection
   */
  private checkCollisions(): void {
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
  private checkCollision(a: Entity, b: Entity): boolean {
    const size = 32; // Default entity size
    
    return Math.abs(a.position.x - b.position.x) < size &&
           Math.abs(a.position.y - b.position.y) < size;
  }

  /**
   * Handle collision between two entities
   */
  private handleCollision(a: Entity, b: Entity): void {
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
  addNPC(config: any): NPC {
    const npc = entityManager.createNPC(config);
    
    if (this.container) {
      npc.render(this.container);
    }
    
    return npc;
  }

  /**
   * Add enemy to the game
   */
  addEnemy(config: any): Enemy {
    const enemy = entityManager.createEnemy(config);
    
    if (this.container) {
      enemy.render(this.container);
    }
    
    return enemy;
  }

  /**
   * Load entities from JSON
   */
  loadEntitiesFromJSON(data: any[]): Entity[] {
    const entities = entityManager.importFromJSON(data);
    
    if (this.container) {
      entities.forEach(entity => entity.render(this.container!));
    }
    
    return entities;
  }

  /**
   * Load entities from URL
   */
  async loadEntitiesFromURL(url: string): Promise<Entity[]> {
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      return this.loadEntitiesFromJSON(Array.isArray(data) ? data : data.entities || []);
    } catch (error) {
      console.error('Error loading entities from URL:', error);
      return [];
    }
  }

  /**
   * Clear all entities
   */
  clearAll(): void {
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
  update(deltaTime: number): void {
    entityManager.updateAll(deltaTime);
  }

  /**
   * Manual render (if enableAutoRender is disabled)
   */
  render(): void {
    if (this.container) {
      entityManager.renderAll(this.container);
    }
  }

  /**
   * Set container dynamically
   */
  setContainer(element: HTMLElement): void {
    this.container = element;
  }

  /**
   * Get container
   */
  getContainer(): HTMLElement | null {
    return this.container;
  }

  /**
   * Check if running
   */
  isGameRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Get stats
   */
  getStats(): any {
    return entityManager.getStats();
  }
}

/**
 * Simple factory function for quick setup
 */
export function createGame(config?: GameIntegrationConfig): GameIntegration {
  const game = new GameIntegration(config);
  game.init();
  return game;
}
