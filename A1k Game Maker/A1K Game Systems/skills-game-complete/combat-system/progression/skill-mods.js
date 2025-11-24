/**
 * SKILL MODS SYSTEM
 * Modifiers that enhance skills
 * 
 * @version 1.0.0
 */

class SkillModSystem {
  constructor() {
    this.mods = {}; // skillId -> [mods]
    this.loadFromStorage();
  }

  /**
   * Apply mod to skill
   */
  applyMod(skillId, mod) {
    if (!this.mods[skillId]) {
      this.mods[skillId] = [];
    }

    this.mods[skillId].push(mod);
    this.saveToStorage();
  }

  /**
   * Remove mod from skill
   */
  removeMod(skillId, modIndex) {
    if (this.mods[skillId] && this.mods[skillId][modIndex]) {
      this.mods[skillId].splice(modIndex, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  /**
   * Get mods for skill
   */
  getMods(skillId) {
    return this.mods[skillId] || [];
  }

  /**
   * Apply mod bonuses to skill
   */
  applyModBonuses(skill) {
    const mods = this.getMods(skill.id);
    let modifiedSkill = { ...skill };

    for (const mod of mods) {
      switch (mod.type) {
        case 'damage':
          modifiedSkill.damage = Math.floor((modifiedSkill.damage || 0) * (1 + mod.value));
          break;
        case 'cooldown':
          modifiedSkill.cooldown = (modifiedSkill.cooldown || 0) * (1 - mod.value);
          break;
        case 'range':
          modifiedSkill.range = (modifiedSkill.range || 200) * (1 + mod.value);
          break;
      }
    }

    return modifiedSkill;
  }

  /**
   * Save to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem('skillMods', JSON.stringify(this.mods));
    } catch (e) {
      console.warn('Failed to save mods:', e);
    }
  }

  /**
   * Load from localStorage
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('skillMods');
      if (saved) {
        this.mods = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load mods:', e);
    }
  }
}

