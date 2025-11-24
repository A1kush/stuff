import { Entity, EntityConfig } from './Entity.js';
/**
 * NPC interaction types
 */
export type NPCInteractionType = 'quest_giver' | 'vendor' | 'merchant' | 'crafter' | 'trainer' | 'mentor' | 'story' | 'ambient' | 'support';
/**
 * NPC-specific configuration
 */
export interface NPCConfig extends EntityConfig {
    interactionType: NPCInteractionType;
    dialogue?: string[];
    questIds?: string[];
    inventory?: string[];
    services?: string[];
}
/**
 * NPC class - for non-combat characters
 */
export declare class NPC extends Entity {
    interactionType: NPCInteractionType;
    dialogue: string[];
    questIds: string[];
    inventory: string[];
    services: string[];
    isInteractable: boolean;
    hasBeenInteracted: boolean;
    constructor(config: NPCConfig);
    /**
     * Interact with NPC
     */
    interact(player?: any): string | null;
    /**
     * Check if NPC offers quests
     */
    hasQuests(): boolean;
    /**
     * Check if NPC is a vendor
     */
    isVendor(): boolean;
    /**
     * Check if NPC offers crafting
     */
    isCrafter(): boolean;
    /**
     * Add dialogue line
     */
    addDialogue(line: string): void;
    /**
     * Add quest
     */
    addQuest(questId: string): void;
    /**
     * Add item to inventory
     */
    addToInventory(itemId: string): void;
    /**
     * Override createElement for NPC-specific styling
     */
    protected createElement(): HTMLElement;
    /**
     * Serialize NPC to JSON
     */
    toJSON(): any;
}
//# sourceMappingURL=NPC.d.ts.map