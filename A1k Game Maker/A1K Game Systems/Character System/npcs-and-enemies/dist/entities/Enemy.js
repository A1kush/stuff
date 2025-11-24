import { Entity } from './Entity.js';
/**
 * Enemy class - for combat entities
 */
export class Enemy extends Entity {
    constructor(config) {
        super(config);
        this.isAggro = false;
        this.target = null;
        this.lastAttackTime = 0;
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
    calculateBaseExperience() {
        const baseXP = {
            'minion': 10,
            'elite': 50,
            'mini-boss': 200,
            'boss': 1000,
            'world-boss': 5000
        };
        const rankMultipliers = {
            'E': 0.5, 'D': 0.75, 'C': 1.0, 'B': 1.5, 'A': 2.5, 'S': 4.0, 'SS': 6.0
        };
        const base = baseXP[this.enemyType] || 10;
        const multiplier = rankMultipliers[this.rank.tier] || 1.0;
        return Math.floor(base * multiplier);
    }
    /**
     * Update enemy AI and behavior
     */
    update(deltaTime) {
        super.update(deltaTime);
        if (!this.isAlive() || !this.isActive)
            return;
        // Simple AI behavior
        if (this.target && this.isAggro) {
            this.updateCombatBehavior(deltaTime);
        }
    }
    /**
     * Update combat behavior when engaged
     */
    updateCombatBehavior(deltaTime) {
        if (!this.target)
            return;
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
    getDistanceTo(target) {
        const dx = target.position.x - this.position.x;
        const dy = target.position.y - this.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * Move towards target
     */
    moveTowards(target, deltaTime) {
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
    attack(target) {
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
    setTarget(target) {
        this.target = target;
        this.isAggro = true;
    }
    /**
     * Clear target and stop being aggressive
     */
    clearTarget() {
        this.target = null;
        this.isAggro = false;
    }
    /**
     * Check if entity is in detection range
     */
    canDetect(entity) {
        return this.getDistanceTo(entity) <= this.detectionRange;
    }
    /**
     * Get loot drops when enemy dies
     */
    getLoot() {
        const drops = [];
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
    onDeath() {
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
    createElement() {
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
    updateElement() {
        super.updateElement();
        if (this.element) {
            const healthFill = this.element.querySelector('.health-bar-fill');
            if (healthFill) {
                const healthPercent = (this.stats.health / this.stats.maxHealth) * 100;
                healthFill.style.width = `${healthPercent}%`;
            }
        }
    }
    /**
     * Serialize enemy to JSON
     */
    toJSON() {
        return {
            ...super.toJSON(),
            enemyType: this.enemyType,
            behavior: this.behavior,
            experienceValue: this.experienceValue,
            isAggro: this.isAggro
        };
    }
}
//# sourceMappingURL=Enemy.js.map