import { rankSystem } from '../ranks/RankSystem.js';
/**
 * Entity class - base for all NPCs, enemies, pets, etc.
 */
export class Entity {
    constructor(config) {
        this.isActive = true;
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
    applyRankModifiers() {
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
    takeDamage(amount) {
        const actualDamage = Math.max(0, amount - this.stats.defense);
        this.stats.health = Math.max(0, this.stats.health - actualDamage);
        if (this.stats.health <= 0) {
            this.onDeath();
        }
    }
    /**
     * Heal entity
     */
    heal(amount) {
        this.stats.health = Math.min(this.stats.maxHealth, this.stats.health + amount);
    }
    /**
     * Check if entity is alive
     */
    isAlive() {
        return this.stats.health > 0;
    }
    /**
     * Called when entity dies
     */
    onDeath() {
        this.isActive = false;
    }
    /**
     * Update entity (called each frame)
     */
    update(deltaTime) {
        // Override in subclasses
    }
    /**
     * Render entity to DOM
     */
    render(container) {
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
    createElement() {
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
    updateElement() {
        if (!this.element)
            return;
        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
        this.element.style.display = this.isActive ? 'block' : 'none';
    }
    /**
     * Remove entity from DOM
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.isActive = false;
    }
    /**
     * Get entity info for debugging/display
     */
    getInfo() {
        return `${this.rank.displayName} - ${this.name} (HP: ${this.stats.health}/${this.stats.maxHealth})`;
    }
    /**
     * Serialize entity to JSON
     */
    toJSON() {
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
//# sourceMappingURL=Entity.js.map