/**
 * SKILL COMBO SYSTEM
 * Chains skills together for bonus damage and effects
 * 
 * @version 1.0.0
 */

class ComboSystem {
  constructor() {
    this.comboWindow = 3000; // 3 seconds to chain skills
    this.activeCombo = null;
    this.comboHistory = [];
    this.maxComboLength = 5;
  }

  /**
   * Start or continue a combo
   */
  addSkillToCombo(skillId, timestamp = Date.now()) {
    if (!this.activeCombo) {
      // Start new combo
      this.activeCombo = {
        skills: [skillId],
        startTime: timestamp,
        lastSkillTime: timestamp,
        multiplier: 1.0
      };
    } else {
      // Check if within combo window
      const timeSinceLast = timestamp - this.activeCombo.lastSkillTime;
      if (timeSinceLast > this.comboWindow) {
        // Combo expired, start new one
        this.completeCombo();
        this.activeCombo = {
          skills: [skillId],
          startTime: timestamp,
          lastSkillTime: timestamp,
          multiplier: 1.0
        };
      } else {
        // Continue combo
        this.activeCombo.skills.push(skillId);
        this.activeCombo.lastSkillTime = timestamp;
        
        // Increase multiplier
        const comboLength = this.activeCombo.skills.length;
        this.activeCombo.multiplier = 1.0 + (comboLength - 1) * 0.15; // +15% per skill
        
        // Cap at max combo length
        if (comboLength >= this.maxComboLength) {
          this.completeCombo();
        }
      }
    }

    return this.activeCombo.multiplier;
  }

  /**
   * Complete current combo
   */
  completeCombo() {
    if (!this.activeCombo) return;

    this.comboHistory.push({
      ...this.activeCombo,
      endTime: Date.now()
    });

    // Dispatch combo complete event
    if (window.combatEvents) {
      window.combatEvents.dispatchEvent(new CustomEvent('comboComplete', {
        detail: {
          length: this.activeCombo.skills.length,
          multiplier: this.activeCombo.multiplier
        }
      }));
    }

    this.activeCombo = null;
  }

  /**
   * Get current combo multiplier
   */
  getComboMultiplier() {
    if (!this.activeCombo) return 1.0;
    
    // Check if combo expired
    const timeSinceLast = Date.now() - this.activeCombo.lastSkillTime;
    if (timeSinceLast > this.comboWindow) {
      this.completeCombo();
      return 1.0;
    }

    return this.activeCombo.multiplier;
  }

  /**
   * Get current combo info
   */
  getCurrentCombo() {
    if (!this.activeCombo) return null;
    
    const timeSinceLast = Date.now() - this.activeCombo.lastSkillTime;
    if (timeSinceLast > this.comboWindow) {
      this.completeCombo();
      return null;
    }

    return {
      length: this.activeCombo.skills.length,
      multiplier: this.activeCombo.multiplier,
      timeRemaining: this.comboWindow - timeSinceLast
    };
  }
}

