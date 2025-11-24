import { Entity } from './Entity.js';
/**
 * NPC class - for non-combat characters
 */
export class NPC extends Entity {
    constructor(config) {
        super(config);
        this.isInteractable = true;
        this.hasBeenInteracted = false;
        this.interactionType = config.interactionType;
        this.dialogue = config.dialogue || [];
        this.questIds = config.questIds || [];
        this.inventory = config.inventory || [];
        this.services = config.services || [];
    }
    /**
     * Interact with NPC
     */
    interact(player) {
        if (!this.isInteractable)
            return null;
        this.hasBeenInteracted = true;
        // Return random dialogue if available
        if (this.dialogue.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.dialogue.length);
            return this.dialogue[randomIndex];
        }
        return null;
    }
    /**
     * Check if NPC offers quests
     */
    hasQuests() {
        return this.questIds.length > 0;
    }
    /**
     * Check if NPC is a vendor
     */
    isVendor() {
        return this.interactionType === 'vendor' ||
            this.interactionType === 'merchant' ||
            this.inventory.length > 0;
    }
    /**
     * Check if NPC offers crafting
     */
    isCrafter() {
        return this.interactionType === 'crafter' ||
            this.services.includes('crafting');
    }
    /**
     * Add dialogue line
     */
    addDialogue(line) {
        this.dialogue.push(line);
    }
    /**
     * Add quest
     */
    addQuest(questId) {
        if (!this.questIds.includes(questId)) {
            this.questIds.push(questId);
        }
    }
    /**
     * Add item to inventory
     */
    addToInventory(itemId) {
        if (!this.inventory.includes(itemId)) {
            this.inventory.push(itemId);
        }
    }
    /**
     * Override createElement for NPC-specific styling
     */
    createElement() {
        const element = super.createElement();
        element.classList.add('npc');
        element.dataset.interactionType = this.interactionType;
        // Add interaction indicator
        if (this.isInteractable) {
            const indicator = document.createElement('div');
            indicator.className = 'interaction-indicator';
            indicator.textContent = '💬';
            element.appendChild(indicator);
        }
        return element;
    }
    /**
     * Serialize NPC to JSON
     */
    toJSON() {
        return {
            ...super.toJSON(),
            interactionType: this.interactionType,
            questIds: this.questIds,
            hasBeenInteracted: this.hasBeenInteracted,
            isInteractable: this.isInteractable
        };
    }
}
//# sourceMappingURL=NPC.js.map