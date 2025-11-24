import { Rank } from '../ranks/RankConfig.js';
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
export declare class Entity {
    id: string;
    name: string;
    rank: Rank;
    stats: EntityStats;
    visuals: EntityVisuals;
    tags: string[];
    description: string;
    metadata: Record<string, any>;
    position: EntityPosition;
    isActive: boolean;
    element?: HTMLElement;
    constructor(config: EntityConfig);
    /**
     * Update entity stats based on rank
     */
    applyRankModifiers(): void;
    /**
     * Take damage
     */
    takeDamage(amount: number): void;
    /**
     * Heal entity
     */
    heal(amount: number): void;
    /**
     * Check if entity is alive
     */
    isAlive(): boolean;
    /**
     * Called when entity dies
     */
    protected onDeath(): void;
    /**
     * Update entity (called each frame)
     */
    update(deltaTime: number): void;
    /**
     * Render entity to DOM
     */
    render(container: HTMLElement): void;
    /**
     * Create DOM element for entity
     */
    protected createElement(): HTMLElement;
    /**
     * Update DOM element position and state
     */
    protected updateElement(): void;
    /**
     * Remove entity from DOM
     */
    destroy(): void;
    /**
     * Get entity info for debugging/display
     */
    getInfo(): string;
    /**
     * Serialize entity to JSON
     */
    toJSON(): any;
}
//# sourceMappingURL=Entity.d.ts.map