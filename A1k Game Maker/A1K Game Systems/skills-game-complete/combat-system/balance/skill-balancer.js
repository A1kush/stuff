/**
 * SKILL BALANCER
 * Balance tuning and testing tools
 * 
 * @version 1.0.0
 */

class SkillBalancer {
  constructor() {
    this.balancePresets = {
      normal: { damageMultiplier: 1.0, cooldownMultiplier: 1.0 },
      easy: { damageMultiplier: 1.5, cooldownMultiplier: 0.8 },
      hard: { damageMultiplier: 0.7, cooldownMultiplier: 1.3 }
    };
    this.currentPreset = 'normal';
  }

  /**
   * Apply balance preset
   */
  applyPreset(presetName) {
    const preset = this.balancePresets[presetName];
    if (!preset) return false;

    this.currentPreset = presetName;
    return true;
  }

  /**
   * Get balance multipliers
   */
  getMultipliers() {
    return this.balancePresets[this.currentPreset];
  }

  /**
   * Calculate skill effectiveness
   */
  calculateEffectiveness(skill) {
    const dps = (skill.damage || 0) / (skill.cooldown || 1);
    const range = skill.range || 200;
    const aoe = skill.radius ? Math.PI * skill.radius * skill.radius : 0;
    
    return {
      dps,
      range,
      aoe,
      totalScore: dps * (1 + range / 100) * (1 + aoe / 1000)
    };
  }
}

