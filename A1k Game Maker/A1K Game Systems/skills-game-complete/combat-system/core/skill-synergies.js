/**
 * SKILL SYNERGIES SYSTEM
 * Defines skill combinations that provide bonus effects
 * 
 * @version 1.0.0
 */

class SkillSynergySystem {
  constructor() {
    // Define skill synergies
    this.synergies = [
      {
        skills: ['A1_S1', 'A1_S3'], // Crimson Slash + Power Wave
        name: 'Crimson Power',
        bonus: { damage: 1.25, effect: 'Combined wave deals extra damage' }
      },
      {
        skills: ['A1_S1', 'A1_S4'], // Crimson Slash + Phantom Strike
        name: 'Shadow Crimson',
        bonus: { damage: 1.3, effect: 'Teleport combo with crimson energy' }
      },
      {
        skills: ['UNIQUE_S1', 'UNIQUE_S3'], // Plasma Blast + Power Beam
        name: 'Plasma Beam',
        bonus: { damage: 1.2, effect: 'Beam charges with plasma energy' }
      },
      {
        skills: ['MISSY_S1', 'MISSY_S3'], // Crescent Slash + Rapid Fire
        name: 'Blade Barrage',
        bonus: { damage: 1.25, effect: 'Rapid slashes with enhanced speed' }
      }
    ];

    this.recentSkills = []; // Track last 2 skills used
  }

  /**
   * Check for synergy when skill is used
   */
  checkSynergy(skillId) {
    this.recentSkills.push(skillId);
    if (this.recentSkills.length > 2) {
      this.recentSkills.shift();
    }

    if (this.recentSkills.length < 2) return null;

    // Check if last 2 skills form a synergy
    const [skill1, skill2] = this.recentSkills;
    
    for (const synergy of this.synergies) {
      if ((synergy.skills.includes(skill1) && synergy.skills.includes(skill2)) &&
          skill1 !== skill2) {
        return synergy;
      }
    }

    return null;
  }

  /**
   * Apply synergy bonus
   */
  applySynergyBonus(skill, synergy) {
    if (!synergy) return skill;

    const enhancedSkill = { ...skill };
    enhancedSkill.damage = Math.floor(skill.damage * synergy.bonus.damage);
    
    // Dispatch synergy event
    if (window.combatEvents) {
      window.combatEvents.dispatchEvent(new CustomEvent('synergyActivated', {
        detail: { synergy, skill }
      }));
    }

    return enhancedSkill;
  }

  /**
   * Get all synergies for a skill
   */
  getSynergiesForSkill(skillId) {
    return this.synergies.filter(s => s.skills.includes(skillId));
  }
}

