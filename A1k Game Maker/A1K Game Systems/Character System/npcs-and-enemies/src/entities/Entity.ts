import { Rank, RankTier, EntityCategory } from '../ranks/RankConfig.js';
import { rankSystem } from '../ranks/RankSystem.js';

/**
 * Base stats for all entities
 */
export interface EntityStats {
  health: number;
  maxHealth: number;
  power: number;
  speed: number;
  defense: number;
  luck: number;
}

/**
 * Position and movement data
 */
export interface EntityPosition {
  x: number;
  y: number;
  lane?: number;
}

/**
 * Visual/rendering properties
 */
export interface EntityVisuals {
  assetPath: string;
  assetKey: string;
  scale: number;
  spriteWidth?: number;
  spriteHeight?: number;
  animationFrames?: number;
}

/**
 * Base entity configuration
 */
export interface EntityConfig {
  id: string;
  name: string;
  rank: Rank;
  stats: EntityStats;
  visuals: EntityVisuals;
  tags?: string[];
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * Entity class - base for all NPCs, enemies, pets, etc.
 */
export class Entity {
  public id: string;
  public name: string;
  public rank: Rank;
  public stats: EntityStats;
  public visuals: EntityVisuals;
  public tags: string[];
  public description: string;
  public metadata: Record<string, any>;
  
  public position: EntityPosition;
  public isActive: boolean = true;
  public element?: HTMLElement;

  constructor(config: EntityConfig) {
    this.id = config.id;
    this.name = config.name;
    this.rank = config.rank;
    this.stats = { ...config.stats };
    this.visuals = { ...config.visuals };
    this.tags = config.tags || [];
    this.description = config.description || '';
    this.metadata = config.metadata || {};
    
    this.position = { x: 0, y: 0 };
  }

  /**
   * Update entity stats based on rank
   */
  applyRankModifiers(): void {
    const tier = this.rank.tier;
    const baseStats = { ...this.stats };
    
    this.stats.health = rankSystem.calculateHealth(tier, baseStats.maxHealth);
    this.stats.maxHealth = this.stats.health;
    this.stats.power = rankSystem.calculatePowerLevel(tier, baseStats.power);
    this.stats.speed = rankSystem.calculateSpeed(tier, baseStats.speed);
  }

  /**
   * Take damage
   */
  takeDamage(amount: number): void {
    const actualDamage = Math.max(0, amount - this.stats.defense);
    this.stats.health = Math.max(0, this.stats.health - actualDamage);
    
    if (this.stats.health <= 0) {
      this.onDeath();
    }
  }

  /**
   * Heal entity
   */
  heal(amount: number): void {
    this.stats.health = Math.min(this.stats.maxHealth, this.stats.health + amount);
  }

  /**
   * Check if entity is alive
   */
  isAlive(): boolean {
    return this.stats.health > 0;
  }

  /**
   * Called when entity dies
   */
  protected onDeath(): void {
    this.isActive = false;
  }

  /**
   * Update entity (called each frame)
   */
  update(deltaTime: number): void {
    // Override in subclasses
  }

  /**
   * Render entity to DOM
   */
  render(container: HTMLElement): void {
    if (!this.element) {
      this.element = this.createElement();
    }
    
    if (!container.contains(this.element)) {
      container.appendChild(this.element);
    }
    
    this.updateElement();
  }

  /**
   * Create DOM element for entity
   */
  protected createElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = `entity entity-${this.rank.category}`;
    element.dataset.entityId = this.id;
    element.dataset.rank = this.rank.tier;
    element.dataset.category = this.rank.category;
    
    const img = document.createElement('img');
    img.src = this.visuals.assetPath;
    img.alt = this.name;
    img.style.width = this.visuals.spriteWidth ? `${this.visuals.spriteWidth}px` : 'auto';
    img.style.height = this.visuals.spriteHeight ? `${this.visuals.spriteHeight}px` : 'auto';
    img.style.transform = `scale(${this.visuals.scale})`;
    
    element.appendChild(img);
    
    return element;
  }

  /**
   * Update DOM element position and state
   */
  protected updateElement(): void {
    if (!this.element) return;
    
    this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    this.element.style.display = this.isActive ? 'block' : 'none';
  }

  /**
   * Remove entity from DOM
   */
  destroy(): void {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.isActive = false;
  }

  /**
   * Get entity info for debugging/display
   */
  getInfo(): string {
    return `${this.rank.displayName} - ${this.name} (HP: ${this.stats.health}/${this.stats.maxHealth})`;
  }

  /**
   * Serialize entity to JSON
   */
  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      rank: this.rank,
      stats: this.stats,
      position: this.position,
      isActive: this.isActive,
      tags: this.tags,
      description: this.description
    };
  }
}
