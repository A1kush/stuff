/**
 * HPC PROGRESSION - Leveling, XP, and Equipment System
 * Handles character progression, stat growth, and equipment management
 */

class HPCProgression {
  constructor() {
    // XP required per level (exponential growth)
    this.baseXPPerLevel = 100;
    this.xpMultiplier = 1.5;
  }

  /**
   * Add XP to character
   * @param {string} hpcId - Character ID
   * @param {number} amount - XP amount
   * @returns {Object} Result with level up info
   */
  addXP(hpcId, amount) {
    const character = window.hpcManager?.getCharacter(hpcId);
    if (!character) {
      return { success: false, error: 'Character not found' };
    }

    character.xp += amount;
    let levelsGained = 0;

    // Check for level ups
    while (character.xp >= character.xpToNext) {
      character.xp -= character.xpToNext;
      levelsGained++;
      this.levelUp(hpcId);
    }

    return {
      success: true,
      levelsGained: levelsGained,
      newLevel: character.level,
      newXP: character.xp,
      xpToNext: character.xpToNext
    };
  }

  /**
   * Level up character
   * @param {string} hpcId - Character ID
   * @returns {Object} Result object
   */
  levelUp(hpcId) {
    const character = window.hpcManager?.getCharacter(hpcId);
    if (!character) {
      return { success: false, error: 'Character not found' };
    }

    character.level++;
    
    // Calculate new XP requirement
    character.xpToNext = Math.floor(this.baseXPPerLevel * Math.pow(this.xpMultiplier, character.level - 1));

    // Increase stats
    const statGrowth = this.getStatGrowth(character.type, character.rank);
    character.currentStats.hp = Math.floor(character.baseStats.hp + (character.level - 1) * statGrowth.hp);
    character.currentStats.atk = Math.floor(character.baseStats.atk + (character.level - 1) * statGrowth.atk);
    character.currentStats.def = Math.floor(character.baseStats.def + (character.level - 1) * statGrowth.def);
    character.currentStats.speed = Math.floor(character.baseStats.speed + (character.level - 1) * statGrowth.speed);

    // Unlock skills at certain levels
    this.checkSkillUnlocks(hpcId);

    // Apply equipment bonuses
    this.recalculateStats(hpcId);

    console.log(`✅ ${character.name} leveled up to level ${character.level}`);

    return {
      success: true,
      newLevel: character.level,
      newStats: { ...character.currentStats }
    };
  }

  /**
   * Get stat growth per level by type and rank
   * @param {string} type - Character type
   * @param {string} rank - Character rank
   * @returns {Object} Stat growth values
   */
  getStatGrowth(type, rank) {
    // Base growth by type
    const typeGrowth = {
      warrior: { hp: 15, atk: 3, def: 2, speed: 1 },
      mage: { hp: 8, atk: 4, def: 1, speed: 1 },
      archer: { hp: 10, atk: 3.5, def: 1.5, speed: 2 },
      healer: { hp: 12, atk: 1.5, def: 1.5, speed: 1 },
      rogue: { hp: 11, atk: 3.5, def: 1, speed: 2.5 },
      tank: { hp: 20, atk: 2, def: 3, speed: 0.5 },
      crafter: { hp: 12, atk: 2.5, def: 2, speed: 1 }
    };

    // Rank multiplier
    const rankMultiplier = {
      E: 0.8, D: 0.9, C: 1.0,
      B: 1.1, A: 1.2, S: 1.3
    };

    const base = typeGrowth[type] || typeGrowth.warrior;
    const multiplier = rankMultiplier[rank] || 1.0;

    return {
      hp: Math.floor(base.hp * multiplier),
      atk: Math.floor(base.atk * multiplier * 10) / 10,
      def: Math.floor(base.def * multiplier * 10) / 10,
      speed: Math.floor(base.speed * multiplier * 10) / 10
    };
  }

  /**
   * Check and unlock skills at certain levels
   * @param {string} hpcId - Character ID
   */
  checkSkillUnlocks(hpcId) {
    const character = window.hpcManager?.getCharacter(hpcId);
    if (!character) return;

    // Skill unlock levels: 1, 3, 5, 10, 15, 20
    const unlockLevels = [1, 3, 5, 10, 15, 20];
    const hpcData = window.HPCDatabase?.getHPCById(hpcId);
    
    if (!hpcData) return;

    unlockLevels.forEach((level, index) => {
      if (character.level >= level && hpcData.skills[index] && 
          !character.unlockedSkills.includes(hpcData.skills[index])) {
        character.unlockedSkills.push(hpcData.skills[index]);
        console.log(`✨ ${character.name} unlocked skill: ${hpcData.skills[index]}`);
      }
    });
  }

  /**
   * Get final stats (base + level + equipment)
   * @param {string} hpcId - Character ID
   * @returns {Object} Final stats
   */
  getStats(hpcId) {
    const character = window.hpcManager?.getCharacter(hpcId);
    if (!character) return null;

    this.recalculateStats(hpcId);
    return { ...character.currentStats };
  }

  /**
   * Recalculate stats with equipment bonuses
   * @param {string} hpcId - Character ID
   */
  recalculateStats(hpcId) {
    const character = window.hpcManager?.getCharacter(hpcId);
    if (!character) return;

    // Start with base stats + level growth
    const statGrowth = this.getStatGrowth(character.type, character.rank);
    const levelBonus = {
      hp: (character.level - 1) * statGrowth.hp,
      atk: (character.level - 1) * statGrowth.atk,
      def: (character.level - 1) * statGrowth.def,
      speed: (character.level - 1) * statGrowth.speed
    };

    character.currentStats = {
      hp: Math.floor(character.baseStats.hp + levelBonus.hp),
      atk: Math.floor((character.baseStats.atk + levelBonus.atk) * 10) / 10,
      def: Math.floor((character.baseStats.def + levelBonus.def) * 10) / 10,
      speed: Math.floor((character.baseStats.speed + levelBonus.speed) * 10) / 10
    };

    // Add equipment bonuses
    const equipmentBonus = this.getEquipmentBonus(hpcId);
    character.currentStats.hp += equipmentBonus.hp;
    character.currentStats.atk += equipmentBonus.atk;
    character.currentStats.def += equipmentBonus.def;
    character.currentStats.speed += equipmentBonus.speed;
  }

  /**
   * Get equipment stat bonuses
   * @param {string} hpcId - Character ID
   * @returns {Object} Equipment bonuses
   */
  getEquipmentBonus(hpcId) {
    const character = window.hpcManager?.getCharacter(hpcId);
    if (!character) return { hp: 0, atk: 0, def: 0, speed: 0 };

    let bonus = { hp: 0, atk: 0, def: 0, speed: 0 };

    // Check each equipment slot
    Object.values(character.equipment).forEach(itemId => {
      if (itemId) {
        const item = this.getItemStats(itemId);
        if (item) {
          bonus.hp += item.hp || 0;
          bonus.atk += item.atk || 0;
          bonus.def += item.def || 0;
          bonus.speed += item.speed || 0;
        }
      }
    });

    return bonus;
  }

  /**
   * Get item stats (placeholder - integrate with item system)
   * @param {string} itemId - Item ID
   * @returns {Object|null} Item stats
   */
  getItemStats(itemId) {
    // TODO: Integrate with actual item system
    // For now, return placeholder stats
    if (itemId && typeof itemId === 'string') {
      // Simple placeholder based on item ID
      return {
        hp: 10,
        atk: 5,
        def: 5,
        speed: 2
      };
    }
    return null;
  }

  /**
   * Equip item on character
   * @param {string} hpcId - Character ID
   * @param {string} itemId - Item ID
   * @param {string} slot - Equipment slot (weapon, armor, accessory1, accessory2)
   * @returns {Object} Result object
   */
  equipItem(hpcId, itemId, slot) {
    const character = window.hpcManager?.getCharacter(hpcId);
    if (!character) {
      return { success: false, error: 'Character not found' };
    }

    const validSlots = ['weapon', 'armor', 'accessory1', 'accessory2'];
    if (!validSlots.includes(slot)) {
      return { success: false, error: 'Invalid slot' };
    }

    // Unequip current item if any
    const oldItem = character.equipment[slot];
    character.equipment[slot] = itemId;

    // Recalculate stats
    this.recalculateStats(hpcId);

    console.log(`✅ Equipped ${itemId} to ${character.name}'s ${slot}`);

    return {
      success: true,
      oldItem: oldItem,
      newItem: itemId,
      newStats: { ...character.currentStats }
    };
  }

  /**
   * Unequip item from character
   * @param {string} hpcId - Character ID
   * @param {string} slot - Equipment slot
   * @returns {Object} Result object
   */
  unequipItem(hpcId, slot) {
    const character = window.hpcManager?.getCharacter(hpcId);
    if (!character) {
      return { success: false, error: 'Character not found' };
    }

    const oldItem = character.equipment[slot];
    character.equipment[slot] = null;

    // Recalculate stats
    this.recalculateStats(hpcId);

    return {
      success: true,
      unequippedItem: oldItem,
      newStats: { ...character.currentStats }
    };
  }

  /**
   * Get character level
   * @param {string} hpcId - Character ID
   * @returns {number} Character level
   */
  getLevel(hpcId) {
    const character = window.hpcManager?.getCharacter(hpcId);
    return character ? character.level : 1;
  }

  /**
   * Get character XP
   * @param {string} hpcId - Character ID
   * @returns {Object} XP info
   */
  getXP(hpcId) {
    const character = window.hpcManager?.getCharacter(hpcId);
    if (!character) {
      return { xp: 0, xpToNext: 100, level: 1 };
    }

    return {
      xp: character.xp,
      xpToNext: character.xpToNext,
      level: character.level,
      progress: character.xp / character.xpToNext
    };
  }
}

// Create singleton instance
if (typeof window !== 'undefined') {
  window.hpcProgression = new HPCProgression();
}

