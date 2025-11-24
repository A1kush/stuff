import { Entity, EntityConfig } from './Entity.js';

/**
 * Enemy behavior types
 */
export type EnemyBehaviorType = 
  | 'aggressive'   // Attacks on sight
  | 'passive'      // Doesn't attack unless provoked
  | 'defensive'    // Defends territory
  | 'patrol'       // Patrols an area
  | 'stationary'   // Stays in one place
  | 'chase'        // Chases player
  | 'ranged'       // Attacks from distance
  | 'swarm';       // Groups with others

/**
 * Enemy type classification
 */
export type EnemyType = 
  | 'minion'       // Basic enemy
  | 'elite'        // Stronger enemy
  | 'mini-boss'    // Mid-tier boss
  | 'boss'         // Main boss
  | 'world-boss';  // Super boss

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
  lootTable?: string[]; // Item IDs that can drop
  experienceValue?: number;
  abilities?: string[];
}

/**
 * Enemy class - for combat entities
 */
export class Enemy extends Entity {
  public enemyType: EnemyType;
  public behavior: EnemyBehaviorType;
  public attackPower: number;
  public attackRange: number;
  public attackSpeed: number;
  public detectionRange: number;
  public lootTable: string[];
  public experienceValue: number;
  public abilities: string[];
  
  public isAggro: boolean = false;
  public target: Entity | null = null;
  private lastAttackTime: number = 0;

  constructor(config: EnemyConfig) {
    super(config);
    
    this.enemyType = config.enemyType;
    this.behavior = config.behavior;
    this.attackPower = config.attackPower || this.stats.power;
    this.attackRange = config.attackRange || 50;
    this.attackSpeed = config.attackSpeed || 1000; // ms between attacks
    this.detectionRange = config.detectionRange || 200;
    this.lootTable = config.lootTable || [];
    this.experienceValue = config.experienceValue || this.calculateBaseExperience();
    this.abilities = config.abilities || [];
  }

  /**
   * Calculate base experience based on enemy type and rank
   */
  private calculateBaseExperience(): number {
    const baseXP: Record<EnemyType, number> = {
      'minion': 10,
      'elite': 50,
      'mini-boss': 200,
      'boss': 1000,
      'world-boss': 5000
    };
    
    const rankMultipliers: Record<string, number> = {
      'E': 0.5, 'D': 0.75, 'C': 1.0, 'B': 1.5, 'A': 2.5, 'S': 4.0, 'SS': 6.0
    };
    
    const base = baseXP[this.enemyType] || 10;
    const multiplier = rankMultipliers[this.rank.tier] || 1.0;
    
    return Math.floor(base * multiplier);
  }

  /**
   * Update enemy AI and behavior
   */
  update(deltaTime: number): void {
    super.update(deltaTime);
    
    if (!this.isAlive() || !this.isActive) return;
    
    // Simple AI behavior
    if (this.target && this.isAggro) {
      this.updateCombatBehavior(deltaTime);
    }
  }

  /**
   * Update combat behavior when engaged
   */
  private updateCombatBehavior(deltaTime: number): void {
    if (!this.target) return;
    
    const distance = this.getDistanceTo(this.target);
    
    // Move towards target if out of range
    if (distance > this.attackRange) {
      this.moveTowards(this.target, deltaTime);
    }
    // Attack if in range and cooldown ready
    else {
      const now = Date.now();
      if (now - this.lastAttackTime >= this.attackSpeed) {
        this.attack(this.target);
        this.lastAttackTime = now;
      }
    }
  }

  /**
   * Calculate distance to another entity
   */
  private getDistanceTo(target: Entity): number {
    const dx = target.position.x - this.position.x;
    const dy = target.position.y - this.position.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Move towards target
   */
  private moveTowards(target: Entity, deltaTime: number): void {
    const dx = target.position.x - this.position.x;
    const dy = target.position.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      const moveSpeed = this.stats.speed * deltaTime / 1000;
      this.position.x += (dx / distance) * moveSpeed;
      this.position.y += (dy / distance) * moveSpeed;
    }
  }

  /**
   * Attack target
   */
  attack(target: Entity): void {
    if (!target.isAlive()) {
      this.target = null;
      this.isAggro = false;
      return;
    }
    
    target.takeDamage(this.attackPower);
  }

  /**
   * Set target and become aggressive
   */
  setTarget(target: Entity): void {
    this.target = target;
    this.isAggro = true;
  }

  /**
   * Clear target and stop being aggressive
   */
  clearTarget(): void {
    this.target = null;
    this.isAggro = false;
  }

  /**
   * Check if entity is in detection range
   */
  canDetect(entity: Entity): boolean {
    return this.getDistanceTo(entity) <= this.detectionRange;
  }

  /**
   * Get loot drops when enemy dies
   */
  getLoot(): string[] {
    const drops: string[] = [];
    
    // Simple loot system - random chance for each item
    this.lootTable.forEach(itemId => {
      if (Math.random() < 0.3) { // 30% drop chance
        drops.push(itemId);
      }
    });
    
    return drops;
  }

  /**
   * Override onDeath to handle loot and XP
   */
  protected onDeath(): void {
    super.onDeath();
    this.clearTarget();
    
    // Emit death event (can be listened to by game systems)
    if (this.element) {
      const event = new CustomEvent('enemy-death', {
        detail: {
          enemy: this,
          experience: this.experienceValue,
          loot: this.getLoot()
        }
      });
      this.element.dispatchEvent(event);
    }
  }

  /**
   * Override createElement for enemy-specific styling
   */
  protected createElement(): HTMLElement {
    const element = super.createElement();
    element.classList.add('enemy');
    element.dataset.enemyType = this.enemyType;
    element.dataset.behavior = this.behavior;
    
    // Add health bar
    const healthBar = document.createElement('div');
    healthBar.className = 'enemy-health-bar';
    healthBar.innerHTML = `
      <div class="health-bar-fill" style="width: 100%"></div>
    `;
    element.appendChild(healthBar);
    
    return element;
  }

  /**
   * Override updateElement to update health bar
   */
  protected updateElement(): void {
    super.updateElement();
    
    if (this.element) {
      const healthFill = this.element.querySelector('.health-bar-fill') as HTMLElement;
      if (healthFill) {
        const healthPercent = (this.stats.health / this.stats.maxHealth) * 100;
        healthFill.style.width = `${healthPercent}%`;
      }
    }
  }

  /**
   * Serialize enemy to JSON
   */
  toJSON(): any {
    return {
      ...super.toJSON(),
      enemyType: this.enemyType,
      behavior: this.behavior,
      experienceValue: this.experienceValue,
      isAggro: this.isAggro
    };
  }
}
