/**
 * COMBAT HUD
 * Displays HP bars, rage gauge, combo counter, character info
 * 
 * @version 1.0.0
 */

class CombatHUD {
  constructor(combatEngine) {
    this.combatEngine = combatEngine;
    this.hudX = 20;
    this.hudY = 20;
  }

  /**
   * Render HUD
   */
  render(ctx) {
    this.renderCharacterInfo(ctx);
    this.renderHPBar(ctx);
    this.renderRageGauge(ctx);
    this.renderComboCounter(ctx);
    this.renderShieldIndicator(ctx);
  }

  /**
   * Render character info
   */
  renderCharacterInfo(ctx) {
    const character = this.combatEngine.characters[this.combatEngine.activeCharacter];
    
    ctx.save();
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;

    const text = character.name;
    ctx.strokeText(text, this.hudX, this.hudY + 20);
    ctx.fillText(text, this.hudX, this.hudY + 20);
    ctx.restore();
  }

  /**
   * Render HP bar
   */
  renderHPBar(ctx) {
    const barX = this.hudX;
    const barY = this.hudY + 30;
    const barWidth = 300;
    const barHeight = 30;

    // Background
    ctx.fillStyle = '#333333';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // HP fill
    const hpPercent = this.combatEngine.currentHP / this.combatEngine.maxHP;
    const fillWidth = barWidth * hpPercent;

    // Color based on HP
    let fillColor = '#00ff00'; // Green
    if (hpPercent < 0.5) fillColor = '#ffaa00'; // Orange
    if (hpPercent < 0.25) fillColor = '#ff0000'; // Red

    ctx.fillStyle = fillColor;
    ctx.fillRect(barX, barY, fillWidth, barHeight);

    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    // HP text
    ctx.save();
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    const hpText = `${Math.ceil(this.combatEngine.currentHP)} / ${this.combatEngine.maxHP}`;
    const textWidth = ctx.measureText(hpText).width;
    const textX = barX + (barWidth / 2) - (textWidth / 2);
    ctx.strokeText(hpText, textX, barY + 20);
    ctx.fillText(hpText, textX, barY + 20);
    ctx.restore();

    // HP label
    ctx.save();
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeText('HP', barX, barY - 5);
    ctx.fillText('HP', barX, barY - 5);
    ctx.restore();
  }

  /**
   * Render rage gauge
   */
  renderRageGauge(ctx) {
    const barX = this.hudX;
    const barY = this.hudY + 70;
    const barWidth = 300;
    const barHeight = 20;

    // Background
    ctx.fillStyle = '#333333';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Rage fill
    const ragePercent = this.combatEngine.rage / 100;
    const fillWidth = barWidth * ragePercent;

    // Color gradient (yellow to red)
    const gradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
    gradient.addColorStop(0, '#ffaa00');
    gradient.addColorStop(1, '#ff0000');

    ctx.fillStyle = gradient;
    ctx.fillRect(barX, barY, fillWidth, barHeight);

    // Pulse effect when rage is full
    if (this.combatEngine.rage >= 100) {
      const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(255, 0, 0, ${pulse})`;
      ctx.fillRect(barX, barY, barWidth, barHeight);
    }

    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    // Rage text
    ctx.save();
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    const rageText = `${Math.floor(this.combatEngine.rage)} / 100`;
    const textWidth = ctx.measureText(rageText).width;
    const textX = barX + (barWidth / 2) - (textWidth / 2);
    ctx.strokeText(rageText, textX, barY + 15);
    ctx.fillText(rageText, textX, barY + 15);
    ctx.restore();

    // RAGE label
    ctx.save();
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#ff0000';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeText('RAGE', barX, barY - 5);
    ctx.fillText('RAGE', barX, barY - 5);
    ctx.restore();

    // Rage mode active indicator
    if (this.combatEngine.rageActive) {
      ctx.save();
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = '#ff0000';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      const modeText = '🔥 2x ATK MODE ACTIVE 🔥';
      ctx.strokeText(modeText, barX + barWidth + 20, barY + 15);
      ctx.fillText(modeText, barX + barWidth + 20, barY + 15);
      ctx.restore();
    }
  }

  /**
   * Render combo counter
   */
  renderComboCounter(ctx) {
    if (this.combatEngine.combo === 0) return;

    const x = this.hudX + 350;
    const y = this.hudY + 30;

    // Combo background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x - 10, y - 30, 150, 50);

    // Combo number
    ctx.save();
    ctx.font = 'bold 32px Arial';
    
    // Color based on combo count
    let comboColor = '#ffffff';
    if (this.combatEngine.combo >= 100) comboColor = '#ff00ff'; // God
    else if (this.combatEngine.combo >= 50) comboColor = '#ffaa00'; // Master
    else if (this.combatEngine.combo >= 10) comboColor = '#00ffff'; // Starter

    ctx.fillStyle = comboColor;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    
    const comboText = `${this.combatEngine.combo}`;
    ctx.strokeText(comboText, x, y);
    ctx.fillText(comboText, x, y);
    ctx.restore();

    // "COMBO" label
    ctx.save();
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = comboColor;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeText('COMBO', x, y + 20);
    ctx.fillText('COMBO', x, y + 20);
    ctx.restore();

    // Achievement text
    let achievement = '';
    if (this.combatEngine.combo >= 100) achievement = 'COMBO GOD!';
    else if (this.combatEngine.combo >= 50) achievement = 'COMBO MASTER!';
    else if (this.combatEngine.combo >= 10) achievement = 'COMBO STARTER!';

    if (achievement) {
      ctx.save();
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = comboColor;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeText(achievement, x - 10, y - 35);
      ctx.fillText(achievement, x - 10, y - 35);
      ctx.restore();
    }
  }

  /**
   * Render shield indicator
   */
  renderShieldIndicator(ctx) {
    if (!this.combatEngine.shieldActive) return;

    const x = this.hudX;
    const y = this.hudY + 100;

    // Shield icon
    ctx.save();
    ctx.font = '24px Arial';
    ctx.fillStyle = '#00aaff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeText('🛡️', x, y);
    ctx.fillText('🛡️', x, y);
    ctx.restore();

    // Shield amount
    ctx.save();
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#00aaff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    const shieldText = `${Math.ceil(this.combatEngine.shieldAmount)}`;
    ctx.strokeText(shieldText, x + 30, y);
    ctx.fillText(shieldText, x + 30, y);
    ctx.restore();

    // Shield duration bar
    const barWidth = 100;
    const barHeight = 8;
    const barX = x + 80;
    const barY = y - 10;

    ctx.fillStyle = '#333333';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    const durationPercent = this.combatEngine.shieldDuration / 5000;
    ctx.fillStyle = '#00aaff';
    ctx.fillRect(barX, barY, barWidth * durationPercent, barHeight);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
  }

  /**
   * Render revive indicator
   */
  renderReviveIndicator(ctx) {
    if (!this.combatEngine.reviveActive) return;

    const x = this.hudX + 350;
    const y = this.hudY + 70;

    ctx.save();
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#00ff00';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    const text = `❤️ ${this.combatEngine.reviveCount} Extra Life`;
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.restore();
  }
}
