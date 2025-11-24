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
        // Add hover for range preview and tooltip
        btn.addEventListener('mouseenter', (e) => {
          this.onSkillHover(i, e);
          this.showTooltip(i, e);
        });
        btn.addEventListener('mouseleave', () => {
          this.onSkillHoverEnd(i);
          this.hideTooltip();
        });
        btn.addEventListener('mousemove', (e) => this.updateTooltipPosition(e));
        
        // Charge system for chargeable skills
        btn.addEventListener('mousedown', () => this.startCharge(i));
        btn.addEventListener('mouseup', () => this.releaseCharge(i));
        btn.addEventListener('mouseleave', () => this.cancelCharge(i));
      }
    }
    
    // Track hover state
    this.hoveredSkill = null;
    this.rangePreviewCanvas = null;
    this.tooltipElement = null;
    
    // Charge state tracking
    this.chargingSkills = {}; // skillId -> { startTime, chargeLevel }

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
   * Enhanced with visual cooldown timer and progress bar
   */
  update() {
    // Update range preview if skill is hovered
    if (this.hoveredSkill) {
      this.showRangePreview(this.hoveredSkill);
    }

    // Update charge indicators
    this.updateChargeIndicators();
    const skills = this.combatEngine.getEquippedSkills();

    // Update S1-S5 cooldowns with timer display
    for (let i = 1; i <= 5; i++) {
      const skill = skills.find(s => s.slot === i);
      if (!skill) continue;

      const cooldown = this.combatEngine.getSkillCooldown(skill.id);
      const btn = document.getElementById(`S${i}`);
      if (!btn) continue;

      if (!cooldown.isReady) {
        // Dim button during cooldown
        btn.style.opacity = 0.5 + (cooldown.progress * 0.5);
        
        // Add cooldown timer overlay
        this.updateCooldownOverlay(btn, cooldown.remaining, cooldown.progress);
      } else {
        btn.style.opacity = 1.0;
        this.removeCooldownOverlay(btn);
      }
    }

    // Update X1 cooldown
    const ultimate = skills.find(s => s.slot === 'X1');
    if (ultimate) {
      const cooldown = this.combatEngine.getSkillCooldown(ultimate.id);
      const btn = document.getElementById('X1');
      if (btn && !cooldown.isReady) {
        btn.style.opacity = 0.5 + (cooldown.progress * 0.5);
        this.updateCooldownOverlay(btn, cooldown.remaining, cooldown.progress);
      } else if (btn) {
        btn.style.opacity = 1.0;
        this.removeCooldownOverlay(btn);
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

  /**
   * Update cooldown overlay on button
   */
  updateCooldownOverlay(btn, remainingSeconds, progress) {
    // Remove existing overlay
    this.removeCooldownOverlay(btn);

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'skill-cooldown-overlay';
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: inherit;
      pointer-events: none;
      z-index: 10;
    `;

    // Timer text
    const timerText = document.createElement('div');
    timerText.textContent = remainingSeconds.toFixed(1) + 's';
    timerText.style.cssText = `
      color: #ffffff;
      font-size: 14px;
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    `;
    overlay.appendChild(timerText);

    // Progress bar
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      width: 80%;
      height: 4px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
      margin-top: 4px;
      overflow: hidden;
    `;
    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
      width: ${progress * 100}%;
      height: 100%;
      background: linear-gradient(90deg, #00ff00, #ffff00);
      transition: width 0.1s linear;
    `;
    progressBar.appendChild(progressFill);
    overlay.appendChild(progressBar);

    // Ensure button has relative positioning
    if (getComputedStyle(btn).position === 'static') {
      btn.style.position = 'relative';
    }

    btn.appendChild(overlay);
    btn._cooldownOverlay = overlay;
  }

  /**
   * Remove cooldown overlay
   */
  removeCooldownOverlay(btn) {
    if (btn._cooldownOverlay) {
      btn._cooldownOverlay.remove();
      btn._cooldownOverlay = null;
    }
  }

  /**
   * Handle skill button hover (show range preview)
   */
  onSkillHover(slotNumber, event) {
    const skills = this.combatEngine.getEquippedSkills();
    const skill = skills.find(s => s.slot === slotNumber);
    if (!skill) return;

    // Check if on cooldown
    const cooldown = this.combatEngine.getSkillCooldown(skill.id);
    if (!cooldown.isReady) return; // Don't show range if on cooldown

    this.hoveredSkill = skill;
    this.showRangePreview(skill);
  }

  /**
   * Handle skill button hover end
   */
  onSkillHoverEnd(slotNumber) {
    this.hoveredSkill = null;
    this.hideRangePreview();
  }

  /**
   * Show range preview for skill
   */
  showRangePreview(skill) {
    // Get range from skill (default 200px)
    const range = skill.range || skill.radius || 200;
    
    // Create canvas overlay for range preview
    if (!this.rangePreviewCanvas) {
      this.rangePreviewCanvas = document.createElement('canvas');
      this.rangePreviewCanvas.id = 'skill-range-preview';
      this.rangePreviewCanvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9998;
      `;
      document.body.appendChild(this.rangePreviewCanvas);
    }

    const ctx = this.rangePreviewCanvas.getContext('2d');
    this.rangePreviewCanvas.width = window.innerWidth;
    this.rangePreviewCanvas.height = window.innerHeight;

    // Draw range circle at character position
    const centerX = this.combatEngine.x;
    const centerY = this.combatEngine.y;

    // Outer glow
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, range, 0, Math.PI * 2);
    ctx.stroke();

    // Inner circle
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, range, 0, Math.PI * 2);
    ctx.stroke();

    // Center dot
    ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Hide range preview
   */
  hideRangePreview() {
    if (this.rangePreviewCanvas) {
      const ctx = this.rangePreviewCanvas.getContext('2d');
      ctx.clearRect(0, 0, this.rangePreviewCanvas.width, this.rangePreviewCanvas.height);
    }
  }

  /**
   * Show tooltip for skill
   */
  showTooltip(slotNumber, event) {
    const skills = this.combatEngine.getEquippedSkills();
    const skill = skills.find(s => s.slot === slotNumber);
    if (!skill) return;

    // Remove existing tooltip
    this.hideTooltip();

    // Create tooltip element
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.className = 'skill-tooltip';
    this.tooltipElement.style.cssText = `
      position: fixed;
      background: linear-gradient(135deg, rgba(20, 20, 30, 0.95), rgba(10, 10, 20, 0.95));
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      padding: 12px;
      color: #ffffff;
      font-family: Arial, sans-serif;
      font-size: 13px;
      z-index: 10000;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      max-width: 250px;
    `;

    // Tooltip content
    const name = document.createElement('div');
    name.textContent = skill.name;
    name.style.cssText = 'font-weight: bold; font-size: 16px; color: #ffd700; margin-bottom: 6px;';
    this.tooltipElement.appendChild(name);

    const desc = document.createElement('div');
    desc.textContent = skill.description || 'No description';
    desc.style.cssText = 'color: #cccccc; margin-bottom: 8px;';
    this.tooltipElement.appendChild(desc);

    const stats = document.createElement('div');
    stats.style.cssText = 'border-top: 1px solid rgba(255, 255, 255, 0.2); padding-top: 6px;';
    stats.innerHTML = `
      <div>Damage: <span style="color: #ff6666;">${skill.damage || skill.baseDamage || 0}</span></div>
      <div>Cooldown: <span style="color: #66ff66;">${skill.cooldown || 0}s</span></div>
      <div>Element: <span style="color: ${this.getElementColor(skill.element)};">${skill.element || 'PHYSICAL'}</span></div>
      ${skill.unlock ? `<div>Unlock: Level ${skill.unlock}</div>` : ''}
    `;
    this.tooltipElement.appendChild(stats);

    document.body.appendChild(this.tooltipElement);
    this.updateTooltipPosition(event);
  }

  /**
   * Update tooltip position
   */
  updateTooltipPosition(event) {
    if (!this.tooltipElement) return;
    this.tooltipElement.style.left = (event.clientX + 15) + 'px';
    this.tooltipElement.style.top = (event.clientY + 15) + 'px';
  }

  /**
   * Hide tooltip
   */
  hideTooltip() {
    if (this.tooltipElement) {
      this.tooltipElement.remove();
      this.tooltipElement = null;
    }
  }

  /**
   * Get element color for tooltip
   */
  getElementColor(element) {
    const colors = {
      PHYSICAL: '#ffffff',
      FIRE: '#ff4400',
      ICE: '#00ddff',
      LIGHTNING: '#ffff00',
      SHADOW: '#aa00ff',
      LIGHT: '#ffffaa',
      PLASMA: '#00ffaa',
      ENERGY: '#00aaff',
      ARCANE: '#ff00ff'
    };
    return colors[element] || '#ffffff';
  }

  /**
   * Start charging skill
   */
  startCharge(slotNumber) {
    const skills = this.combatEngine.getEquippedSkills();
    const skill = skills.find(s => s.slot === slotNumber);
    if (!skill || !skill.chargeable) return;

    this.chargingSkills[skill.id] = {
      startTime: Date.now(),
      chargeLevel: 0
    };
  }

  /**
   * Release charge
   */
  releaseCharge(slotNumber) {
    const skills = this.combatEngine.getEquippedSkills();
    const skill = skills.find(s => s.slot === slotNumber);
    if (!skill || !skill.chargeable) return;

    const charge = this.chargingSkills[skill.id];
    if (!charge) return;

    const chargeTime = Date.now() - charge.startTime;
    const maxChargeTime = 2000; // 2 seconds max charge
    const chargeLevel = Math.min(1.0, chargeTime / maxChargeTime);

    // Activate skill with charge level
    const targetX = this.combatEngine.x + 150;
    const targetY = this.combatEngine.y;
    this.combatEngine.activateSkill(skill.id, targetX, targetY, chargeLevel);

    delete this.chargingSkills[skill.id];
  }

  /**
   * Cancel charge
   */
  cancelCharge(slotNumber) {
    const skills = this.combatEngine.getEquippedSkills();
    const skill = skills.find(s => s.slot === slotNumber);
    if (!skill) return;

    delete this.chargingSkills[skill.id];
  }

  /**
   * Update charge indicators on buttons
   */
  updateChargeIndicators() {
    for (const [skillId, charge] of Object.entries(this.chargingSkills)) {
      const skills = this.combatEngine.getEquippedSkills();
      const skill = skills.find(s => s.id === skillId);
      if (!skill) continue;

      const chargeTime = Date.now() - charge.startTime;
      const maxChargeTime = 2000;
      const chargeLevel = Math.min(1.0, chargeTime / maxChargeTime);
      charge.chargeLevel = chargeLevel;

      // Find button for this skill
      const btn = document.getElementById(`S${skill.slot}`) || 
                  (skill.slot === 'X' ? document.getElementById('X1') : null);
      if (!btn) continue;

      // Update charge visual
      this.updateChargeOverlay(btn, chargeLevel);
    }
  }

  /**
   * Update charge overlay on button
   */
  updateChargeOverlay(btn, chargeLevel) {
    // Remove existing overlay
    if (btn._chargeOverlay) {
      btn._chargeOverlay.remove();
    }

    // Create charge meter
    const overlay = document.createElement('div');
    overlay.className = 'skill-charge-overlay';
    overlay.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 6px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 0 0 inherit inherit;
      overflow: hidden;
      pointer-events: none;
    `;

    const fill = document.createElement('div');
    const hue = 120 - (chargeLevel * 60); // Green to yellow
    fill.style.cssText = `
      width: ${chargeLevel * 100}%;
      height: 100%;
      background: hsl(${hue}, 100%, 50%);
      transition: width 0.05s linear;
    `;
    overlay.appendChild(fill);

    if (getComputedStyle(btn).position === 'static') {
      btn.style.position = 'relative';
    }
    btn.appendChild(overlay);
    btn._chargeOverlay = overlay;
  }
}
