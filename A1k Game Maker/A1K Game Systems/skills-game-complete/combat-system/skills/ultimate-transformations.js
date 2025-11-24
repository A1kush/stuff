/**
 * ULTIMATE SKILL TRANSFORMATIONS
 * Character transformations during ultimate skills
 * 
 * @version 1.0.0
 */

class UltimateTransformationSystem {
  constructor() {
    this.activeTransformations = {}; // characterId -> transformation
  }

  /**
   * Activate ultimate transformation
   */
  activateTransformation(characterId, ultimateSkill) {
    const transformation = {
      characterId,
      skillId: ultimateSkill.id,
      startTime: Date.now(),
      duration: ultimateSkill.duration || 10000, // 10 seconds default
      bonuses: {
        damage: 1.5, // +50% damage
        speed: 1.2, // +20% speed
        cooldown: 0.8 // -20% cooldown
      }
    };

    this.activeTransformations[characterId] = transformation;

    // Dispatch transformation event
    if (window.combatEvents) {
      window.combatEvents.dispatchEvent(new CustomEvent('transformationActivated', {
        detail: { transformation }
      }));
    }
  }

  /**
   * Check if character is transformed
   */
  isTransformed(characterId) {
    const transformation = this.activeTransformations[characterId];
    if (!transformation) return false;

    const elapsed = Date.now() - transformation.startTime;
    if (elapsed >= transformation.duration) {
      delete this.activeTransformations[characterId];
      return false;
    }

    return true;
  }

  /**
   * Get transformation bonuses
   */
  getBonuses(characterId) {
    const transformation = this.activeTransformations[characterId];
    if (!transformation || !this.isTransformed(characterId)) {
      return { damage: 1.0, speed: 1.0, cooldown: 1.0 };
    }

    return transformation.bonuses;
  }
}

