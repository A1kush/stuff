/**
 * SKILL BUTTON HANDLER
 * Handles S1-S5, ATK, X1, SWITCH, RAGE button clicks
 * 
 * @version 1.0.0
 */

class SkillButtonHandler {
  constructor(combatEngine) {
    this.combatEngine = combatEngine;
    this.setupButtons();
  }

  /**
   * Setup button event listeners
   */
  setupButtons() {
    // S1-S5 skill buttons
    for (let i = 1; i <= 5; i++) {
      const btn = document.getElementById(`S${i}`);
      if (btn) {
        btn.addEventListener('click', () => this.onSkillClick(i));
      }
    }

    // X1 ultimate button
    const x1Btn = document.getElementById('X1');
    if (x1Btn) {
      x1Btn.addEventListener('click', () => this.onUltimateClick());
    }

    // ATK basic attack button
    const atkBtn = document.getElementById('ATK');
    if (atkBtn) {
      atkBtn.addEventListener('click', () => this.onAttackClick());
    }

    // SWITCH character button
    const switchBtn = document.getElementById('SWITCH');
    if (switchBtn) {
      switchBtn.addEventListener('click', () => this.onSwitchClick());
    }

    // RAGE button
    const rageBtn = document.getElementById('RAGE');
    if (rageBtn) {
      rageBtn.addEventListener('click', () => this.onRageClick());
    }
  }

  /**
   * Handle S1-S5 skill click
   */
  onSkillClick(slotNumber) {
    // Get equipped skills for current character
    const skills = this.combatEngine.getEquippedSkills();
    const skill = skills.find(s => s.slot === slotNumber);

    if (!skill) {
      console.log(`No skill equipped in slot S${slotNumber}`);
      return;
    }

    // Get target position (default: right side of character)
    const targetX = this.combatEngine.x + 150;
    const targetY = this.combatEngine.y;

    // Activate skill
    const success = this.combatEngine.activateSkill(skill.id, targetX, targetY);
    
    if (success) {
      console.log(`✨ ${skill.name} activated!`);
      this.updateButton(`S${slotNumber}`, skill.id);
    }
  }

  /**
   * Handle X1 ultimate click
   */
  onUltimateClick() {
    // Get equipped skills for current character
    const skills = this.combatEngine.getEquippedSkills();
    const ultimate = skills.find(s => s.slot === 'X1');

    if (!ultimate) {
      console.log('No ultimate skill equipped');
      return;
    }

    // Get target position
    const targetX = this.combatEngine.x + 150;
    const targetY = this.combatEngine.y;

    // Activate skill
    const success = this.combatEngine.activateSkill(ultimate.id, targetX, targetY);
    
    if (success) {
      console.log(`💥 ${ultimate.name} ULTIMATE ACTIVATED!`);
      this.updateButton('X1', ultimate.id);
    }
  }

  /**
   * Handle ATK basic attack click
   */
  onAttackClick() {
    // Get target position
    const targetX = this.combatEngine.x + 150;
    const targetY = this.combatEngine.y;

    // Execute basic attack
    const success = this.combatEngine.basicAttack(targetX, targetY);
    
    if (success) {
      this.updateButton('ATK', `${this.combatEngine.activeCharacter}_BASIC_ATK`);
    }
  }

  /**
   * Handle SWITCH character click
   */
  onSwitchClick() {
    // Cycle through characters
    const characters = ['A1', 'UNIQUE', 'MISSY'];
    const currentIndex = characters.indexOf(this.combatEngine.activeCharacter);
    const nextIndex = (currentIndex + 1) % characters.length;
    const nextCharacter = characters[nextIndex];

    // Switch character
    this.combatEngine.switchCharacter(nextCharacter);
    console.log(`🔄 Switched to ${nextCharacter}`);

    // Update button text
    const switchBtn = document.getElementById('SWITCH');
    if (switchBtn) {
      switchBtn.textContent = `${nextCharacter}`;
    }

    // Update skill buttons with new character's skills
    this.updateAllSkillButtons();
  }

  /**
   * Handle RAGE button click
   */
  onRageClick() {
    if (this.combatEngine.rage < 100) {
      console.log(`Rage: ${this.combatEngine.rage}/100 - Need 100 to activate!`);
      return;
    }

    const success = this.combatEngine.activateRage();
    if (success) {
      console.log('🔥 RAGE MODE ACTIVATED - 2x ATK for 10 seconds!');
      
      const rageBtn = document.getElementById('RAGE');
      if (rageBtn) {
        rageBtn.classList.add('rage-active');
        setTimeout(() => {
          rageBtn.classList.remove('rage-active');
        }, 10000);
      }
    }
  }

  /**
   * Update button cooldown display
   */
  updateButton(buttonId, skillId) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    // Add cooldown class
    btn.classList.add('on-cooldown');

    // Get skill cooldown
    const skill = getSkillById(skillId);
    if (!skill) return;

    const cooldownMs = skill.cooldown * 1000;

    // Remove cooldown class after cooldown
    setTimeout(() => {
      btn.classList.remove('on-cooldown');
    }, cooldownMs);
  }

  /**
   * Update all skill buttons with current character's skills
   */
  updateAllSkillButtons() {
    const skills = this.combatEngine.getEquippedSkills();

    // Update S1-S5
    for (let i = 1; i <= 5; i++) {
      const btn = document.getElementById(`S${i}`);
      if (!btn) continue;

      const skill = skills.find(s => s.slot === i);
      if (skill) {
        btn.textContent = skill.name;
        btn.title = skill.description;
        btn.disabled = false;
      } else {
        btn.textContent = `S${i}`;
        btn.title = 'No skill equipped';
        btn.disabled = true;
      }
    }

    // Update X1
    const x1Btn = document.getElementById('X1');
    if (x1Btn) {
      const ultimate = skills.find(s => s.slot === 'X1');
      if (ultimate) {
        x1Btn.textContent = ultimate.name;
        x1Btn.title = ultimate.description;
        x1Btn.disabled = false;
      } else {
        x1Btn.textContent = 'X1';
        x1Btn.title = 'No ultimate equipped';
        x1Btn.disabled = true;
      }
    }
  }

  /**
   * Update cooldown displays (call every frame)
   */
  update() {
    const skills = this.combatEngine.getEquippedSkills();

    // Update S1-S5 cooldowns
    for (let i = 1; i <= 5; i++) {
      const skill = skills.find(s => s.slot === i);
      if (!skill) continue;

      const cooldown = this.combatEngine.getSkillCooldown(skill.id);
      const btn = document.getElementById(`S${i}`);
      if (btn && !cooldown.isReady) {
        btn.style.opacity = 0.5 + (cooldown.progress * 0.5);
      } else if (btn) {
        btn.style.opacity = 1.0;
      }
    }

    // Update X1 cooldown
    const ultimate = skills.find(s => s.slot === 'X1');
    if (ultimate) {
      const cooldown = this.combatEngine.getSkillCooldown(ultimate.id);
      const btn = document.getElementById('X1');
      if (btn && !cooldown.isReady) {
        btn.style.opacity = 0.5 + (cooldown.progress * 0.5);
      } else if (btn) {
        btn.style.opacity = 1.0;
      }
    }

    // Update RAGE button
    const rageBtn = document.getElementById('RAGE');
    if (rageBtn) {
      const ragePercent = this.combatEngine.rage / 100;
      rageBtn.style.opacity = 0.5 + (ragePercent * 0.5);
      
      if (this.combatEngine.rage >= 100) {
        rageBtn.classList.add('rage-ready');
      } else {
        rageBtn.classList.remove('rage-ready');
      }
    }
  }
}
