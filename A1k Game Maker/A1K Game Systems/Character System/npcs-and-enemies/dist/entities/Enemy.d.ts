import { Entity, EntityConfig } from './Entity.js';
/**
 * Enemy behavior types
 */
export type EnemyBehaviorType = 'aggressive' | 'passive' | 'defensive' | 'patrol' | 'stationary' | 'chase' | 'ranged' | 'swarm';
/**
 * Enemy type classification
 */
export type EnemyType = 'minion' | 'elite' | 'mini-boss' | 'boss' | 'world-boss';
/**
 * Enemy-specific configuration
 */
export interface EnemyConfig extends EntityConfig {
    enemyType: EnemyType;
    behavior: EnemyBehaviorType;
    attackPower?: number;
    attackRange?: number;
    attackSpeed?: number;
    detectionRange?: number;
    lootTable?: string[];
    experienceValue?: number;
    abilities?: string[];
}
/**
 * Enemy class - for combat entities
 */
export declare class Enemy extends Entity {
    enemyType: EnemyType;
    behavior: EnemyBehaviorType;
    attackPower: number;
    attackRange: number;
    attackSpeed: number;
    detectionRange: number;
    lootTable: string[];
    experienceValue: number;
    abilities: string[];
    isAggro: boolean;
    target: Entity | null;
    private lastAttackTime;
    constructor(config: EnemyConfig);
    /**
     * Calculate base experience based on enemy type and rank
     */
    private calculateBaseExperience;
    /**
     * Update enemy AI and behavior
     */
    update(deltaTime: number): void;
    /**
     * Update combat behavior when engaged
     */
    private updateCombatBehavior;
    /**
     * Calculate distance to another entity
     */
    private getDistanceTo;
    /**
     * Move towards target
     */
    private moveTowards;
    /**
     * Attack target
     */
    attack(target: Entity): void;
    /**
     * Set target and become aggressive
     */
    setTarget(target: Entity): void;
    /**
     * Clear target and stop being aggressive
     */
    clearTarget(): void;
    /**
     * Check if entity is in detection range
     */
    canDetect(entity: Entity): boolean;
    /**
     * Get loot drops when enemy dies
     */
    getLoot(): string[];
    /**
     * Override onDeath to handle loot and XP
     */
    protected onDeath(): void;
    /**
     * Override createElement for enemy-specific styling
     */
    protected createElement(): HTMLElement;
    /**
     * Override updateElement to update health bar
     */
    protected updateElement(): void;
    /**
     * Serialize enemy to JSON
     */
    toJSON(): any;
}
//# sourceMappingURL=Enemy.d.ts.map