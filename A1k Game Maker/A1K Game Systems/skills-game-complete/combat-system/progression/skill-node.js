/**
 * SKILL NODE
 * Individual node in skill tree
 * 
 * @version 1.0.0
 */

class SkillNode {
  constructor(id, name, description, cost = 1, prerequisites = []) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.cost = cost;
    this.prerequisites = prerequisites;
    this.x = 0; // Position in tree
    this.y = 0;
    this.skillId = null; // Associated skill
    this.bonuses = {}; // Bonuses when unlocked
  }

  /**
   * Set position in tree
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Set associated skill
   */
  setSkill(skillId) {
    this.skillId = skillId;
  }

  /**
   * Set bonuses
   */
  setBonuses(bonuses) {
    this.bonuses = bonuses;
  }
}

