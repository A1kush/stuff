import { Entity, EntityConfig } from './Entity.js';

/**
 * NPC interaction types
 */
export type NPCInteractionType = 
  | 'quest_giver'
  | 'vendor'
  | 'merchant'
  | 'crafter'
  | 'trainer'
  | 'mentor'
  | 'story'
  | 'ambient'
  | 'support';

/**
 * NPC-specific configuration
 */
export interface NPCConfig extends EntityConfig {
  interactionType: NPCInteractionType;
  dialogue?: string[];
  questIds?: string[];
  inventory?: string[]; // Item IDs for vendors
  services?: string[]; // Services offered (crafting, training, etc.)
}

/**
 * NPC class - for non-combat characters
 */
export class NPC extends Entity {
  public interactionType: NPCInteractionType;
  public dialogue: string[];
  public questIds: string[];
  public inventory: string[];
  public services: string[];
  public isInteractable: boolean = true;
  public hasBeenInteracted: boolean = false;

  constructor(config: NPCConfig) {
    super(config);
    
    this.interactionType = config.interactionType;
    this.dialogue = config.dialogue || [];
    this.questIds = config.questIds || [];
    this.inventory = config.inventory || [];
    this.services = config.services || [];
  }

  /**
   * Interact with NPC
   */
  interact(player?: any): string | null {
    if (!this.isInteractable) return null;
    
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
  hasQuests(): boolean {
    return this.questIds.length > 0;
  }

  /**
   * Check if NPC is a vendor
   */
  isVendor(): boolean {
    return this.interactionType === 'vendor' || 
           this.interactionType === 'merchant' ||
           this.inventory.length > 0;
  }

  /**
   * Check if NPC offers crafting
   */
  isCrafter(): boolean {
    return this.interactionType === 'crafter' ||
           this.services.includes('crafting');
  }

  /**
   * Add dialogue line
   */
  addDialogue(line: string): void {
    this.dialogue.push(line);
  }

  /**
   * Add quest
   */
  addQuest(questId: string): void {
    if (!this.questIds.includes(questId)) {
      this.questIds.push(questId);
    }
  }

  /**
   * Add item to inventory
   */
  addToInventory(itemId: string): void {
    if (!this.inventory.includes(itemId)) {
      this.inventory.push(itemId);
    }
  }

  /**
   * Override createElement for NPC-specific styling
   */
  protected createElement(): HTMLElement {
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
  toJSON(): any {
    return {
      ...super.toJSON(),
      interactionType: this.interactionType,
      questIds: this.questIds,
      hasBeenInteracted: this.hasBeenInteracted,
      isInteractable: this.isInteractable
    };
  }
}
