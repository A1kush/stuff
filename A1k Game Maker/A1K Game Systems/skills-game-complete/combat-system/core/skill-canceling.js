/**
 * SKILL CANCELING SYSTEM
 * Cancel skill animations and chain into other skills
 * 
 * @version 1.0.0
 */

class SkillCancelingSystem {
  constructor() {
    this.activeSkills = []; // Currently executing skills
    this.cancelWindows = {}; // skillId -> cancel window timing
  }

  /**
   * Register active skill
   */
  registerActiveSkill(skillId, startTime) {
    this.activeSkills.push({
      skillId,
      startTime,
      canCancel: false
    });
  }

  /**
   * Check if skill can be canceled
   */
  canCancel(skillId) {
    const active = this.activeSkills.find(s => s.skillId === skillId);
    if (!active) return false;

    const elapsed = Date.now() - active.startTime;
    const cancelWindow = this.cancelWindows[skillId] || 500; // Default 500ms window

    return elapsed >= cancelWindow && elapsed < cancelWindow + 200; // 200ms cancel window
  }

  /**
   * Cancel skill
   */
  cancelSkill(skillId) {
    const index = this.activeSkills.findIndex(s => s.skillId === skillId);
    if (index !== -1) {
      this.activeSkills.splice(index, 1);
      
      // Dispatch cancel event
      if (window.combatEvents) {
        window.combatEvents.dispatchEvent(new CustomEvent('skillCanceled', {
          detail: { skillId }
        }));
      }
      
      return true;
    }
    return false;
  }

  /**
   * Clear completed skills
   */
  clearCompleted() {
    this.activeSkills = this.activeSkills.filter(s => {
      const elapsed = Date.now() - s.startTime;
      return elapsed < 5000; // Keep for 5 seconds max
    });
  }
}

