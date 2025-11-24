/**
 * BAG INTEGRATION
 * Bridge between bag system and combat engine
 * 
 * @version 1.0.0
 */

class BagCombatIntegration {
  constructor(combatEngine, bagSystem) {
    this.combatEngine = combatEngine;
    this.bagSystem = bagSystem;
    this.initialized = false;
  }

  /**
   * Initialize integration
   */
  initialize() {
    if (this.initialized) return;

    // Setup game state if not exists
    if (!window.gameState) {
      window.gameState = {
        gold: 1000,
        gems: 100,
        keys: 5,
        tickets: 10,
        inventory: {
          items: [],
          gear: [],
          pets: [],
          vehicles: [],
          skills: []
        },
        equippedSkills: {
          slot1: null,
          slot2: null,
          slot3: null,
          slot4: null,
          slot5: null,
          x1: null
        },
        currentCharacter: 'A1'
      };
    }

    // Load skills into inventory
    if (typeof SKILL_DATABASE !== 'undefined') {
      if (!window.gameState.inventory.skills || window.gameState.inventory.skills.length === 0) {
        window.gameState.inventory.skills = SKILL_DATABASE.filter(s => s.slot !== null);
      }
    }

    // Auto-equip default skills
    this.autoEquipDefaults();

    // Setup event listeners
    this.setupEventListeners();

    this.initialized = true;
  }

  /**
   * Auto-equip default skills for current character
   */
  autoEquipDefaults() {
    const characterId = this.combatEngine.activeCharacter;
    const defaultSkills = getEquippedSkills(characterId);

    for (const skill of defaultSkills) {
      if (skill.slot === 1) window.gameState.equippedSkills.slot1 = skill.id;
      else if (skill.slot === 2) window.gameState.equippedSkills.slot2 = skill.id;
      else if (skill.slot === 3) window.gameState.equippedSkills.slot3 = skill.id;
      else if (skill.slot === 4) window.gameState.equippedSkills.slot4 = skill.id;
      else if (skill.slot === 5) window.gameState.equippedSkills.slot5 = skill.id;
      else if (skill.slot === 'X') window.gameState.equippedSkills.x1 = skill.id;
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Listen for character switch
    if (window.combatEvents) {
      window.combatEvents.addEventListener('characterSwitched', (e) => {
        window.gameState.currentCharacter = e.detail.characterId;
        this.autoEquipDefaults();
        this.updateBagUI();
      });
    }

    // Listen for bag system events
    document.addEventListener('itemUsed', (e) => {
      this.handleItemUse(e.detail);
    });

    document.addEventListener('itemEquipped', (e) => {
      this.handleSkillEquip(e.detail);
    });
  }

  /**
   * Handle item use (potions, consumables)
   */
  handleItemUse(detail) {
    const item = detail.item;
    
    if (item.type === 'potion' || item.type === 'consumable') {
      if (item.effect === 'heal') {
        const healAmount = item.value || 100;
        this.combatEngine.heal(healAmount);
        console.log(`Used ${item.name}: +${healAmount} HP`);
      } else if (item.effect === 'rage') {
        const rageAmount = item.value || 25;
        this.combatEngine.addRage(rageAmount);
        console.log(`Used ${item.name}: +${rageAmount} Rage`);
      }
    }
  }

  /**
   * Handle skill equipment
   */
  handleSkillEquip(detail) {
    const skillId = detail.skillId || detail.itemId;
    const slot = detail.slot;

    if (slot) {
      // Update equipped skills
      if (slot === 'slot1') window.gameState.equippedSkills.slot1 = skillId;
      else if (slot === 'slot2') window.gameState.equippedSkills.slot2 = skillId;
      else if (slot === 'slot3') window.gameState.equippedSkills.slot3 = skillId;
      else if (slot === 'slot4') window.gameState.equippedSkills.slot4 = skillId;
      else if (slot === 'slot5') window.gameState.equippedSkills.slot5 = skillId;
      else if (slot === 'x1') window.gameState.equippedSkills.x1 = skillId;

      console.log(`Equipped ${skillId} to ${slot}`);
    }
  }

  /**
   * Get equipped skill for slot
   */
  getEquippedSkill(slot) {
    let skillId = null;
    
    if (slot === 1) skillId = window.gameState.equippedSkills.slot1;
    else if (slot === 2) skillId = window.gameState.equippedSkills.slot2;
    else if (slot === 3) skillId = window.gameState.equippedSkills.slot3;
    else if (slot === 4) skillId = window.gameState.equippedSkills.slot4;
    else if (slot === 5) skillId = window.gameState.equippedSkills.slot5;
    else if (slot === 'X' || slot === 'x1') skillId = window.gameState.equippedSkills.x1;

    if (skillId) {
      return getSkillById(skillId);
    }

    // Fallback to default equipped skills
    const characterId = this.combatEngine.activeCharacter;
    const defaultSkills = getEquippedSkills(characterId);
    const defaultSkill = defaultSkills.find(s => s.slot === slot);
    return defaultSkill || null;
  }

  /**
   * Equip skill to slot
   */
  equipSkill(skillId, slot) {
    const skill = getSkillById(skillId);
    if (!skill) {
      console.warn(`Skill ${skillId} not found`);
      return false;
    }

    // Check if skill belongs to current character
    if (skill.characterId !== this.combatEngine.activeCharacter) {
      console.warn(`Skill ${skillId} does not belong to ${this.combatEngine.activeCharacter}`);
      return false;
    }

    // Update equipped skills
    this.handleSkillEquip({ skillId, slot });
    this.updateBagUI();

    return true;
  }

  /**
   * Unequip skill from slot
   */
  unequipSkill(slot) {
    if (slot === 'slot1') window.gameState.equippedSkills.slot1 = null;
    else if (slot === 'slot2') window.gameState.equippedSkills.slot2 = null;
    else if (slot === 'slot3') window.gameState.equippedSkills.slot3 = null;
    else if (slot === 'slot4') window.gameState.equippedSkills.slot4 = null;
    else if (slot === 'slot5') window.gameState.equippedSkills.slot5 = null;
    else if (slot === 'x1') window.gameState.equippedSkills.x1 = null;

    this.updateBagUI();
  }

  /**
   * Update bag UI (if bag system is loaded)
   */
  updateBagUI() {
    if (this.bagSystem && typeof this.bagSystem.updateGameState === 'function') {
      this.bagSystem.updateGameState(window.gameState);
    }
  }

  /**
   * Open bag
   */
  openBag() {
    if (this.bagSystem && typeof this.bagSystem.openBag === 'function') {
      this.bagSystem.openBag();
    }
  }

  /**
   * Close bag
   */
  closeBag() {
    if (this.bagSystem && typeof this.bagSystem.closeBag === 'function') {
      this.bagSystem.closeBag();
    }
  }
}

