/**
 * SKILL MASTERY SYSTEM
 * Tracks skill usage and levels up skills
 * 
 * @version 1.0.0
 */

class SkillMasterySystem {
  constructor() {
    this.masteryData = {}; // skillId -> { level, exp, totalUses }
    this.loadFromStorage();
  }

  /**
   * Record skill use
   */
  recordSkillUse(skillId) {
    if (!this.masteryData[skillId]) {
      this.masteryData[skillId] = {
        level: 1,
        exp: 0,
        totalUses: 0
      };
    }

    this.masteryData[skillId].totalUses++;
    this.addExp(skillId, 10); // 10 exp per use
  }

  /**
   * Add experience to skill
   */
  addExp(skillId, amount) {
    if (!this.masteryData[skillId]) {
      this.masteryData[skillId] = { level: 1, exp: 0, totalUses: 0 };
    }

    this.masteryData[skillId].exp += amount;
    
    // Check level up
    const expNeeded = this.getExpForLevel(this.masteryData[skillId].level);
    if (this.masteryData[skillId].exp >= expNeeded) {
      this.levelUp(skillId);
    }

    this.saveToStorage();
  }

  /**
   * Level up skill
   */
  levelUp(skillId) {
    this.masteryData[skillId].level++;
    this.masteryData[skillId].exp = 0;

    // Dispatch level up event
    if (window.combatEvents) {
      window.combatEvents.dispatchEvent(new CustomEvent('skillLevelUp', {
        detail: { skillId, level: this.masteryData[skillId].level }
      }));
    }
  }

  /**
   * Get experience needed for level
   */
  getExpForLevel(level) {
    return 100 * Math.pow(1.5, level - 1); // Exponential growth
  }

  /**
   * Get mastery bonuses for skill
   */
  getMasteryBonuses(skillId) {
    const mastery = this.masteryData[skillId];
    if (!mastery) return { damage: 1.0, cooldown: 1.0, range: 1.0 };

    const level = mastery.level;
    return {
      damage: 1.0 + (level - 1) * 0.05, // +5% damage per level
      cooldown: Math.max(0.5, 1.0 - (level - 1) * 0.02), // -2% cooldown per level
      range: 1.0 + (level - 1) * 0.03 // +3% range per level
    };
  }

  /**
   * Get skill mastery info
   */
  getMasteryInfo(skillId) {
    return this.masteryData[skillId] || { level: 1, exp: 0, totalUses: 0 };
  }

  /**
   * Save to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem('skillMastery', JSON.stringify(this.masteryData));
    } catch (e) {
      console.warn('Failed to save mastery data:', e);
    }
  }

  /**
   * Load from localStorage
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('skillMastery');
      if (saved) {
        this.masteryData = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load mastery data:', e);
    }
  }
}

