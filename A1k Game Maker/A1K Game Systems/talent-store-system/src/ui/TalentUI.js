/**
 * TalentUI.js
 * Renders talent tree with 6 lanes and interactive nodes
 */

import { getLaneNames } from '../talents/TalentRegistry.js';

class TalentUI {
  constructor(talentController) {
    this.controller = talentController;
    this.container = null;
  }

  /**
   * Render talent tree
   */
  render(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container #${containerId} not found`);
      return;
    }

    const summary = this.controller.getPurchaseSummary();
    const stats = this.controller.getDisplayStats();

    this.container.innerHTML = `
      <div class="talent-system">
        <div class="talent-header">
          <h2>Talent Tree</h2>
          <div class="talent-summary">
            <div class="summary-item">
              <span class="label">AP:</span>
              <span class="value">${summary.ap.spent} / ${summary.ap.total}</span>
            </div>
            <div class="summary-item">
              <span class="label">Talents:</span>
              <span class="value">${summary.purchased} / ${summary.total}</span>
            </div>
            <div class="summary-item">
              <span class="label">Ultimates:</span>
              <span class="value">${summary.ultimates.purchased} / ${summary.ultimates.total}</span>
            </div>
          </div>
          <button class="btn-reset" id="resetTalents">Reset All Talents</button>
        </div>

        <div class="talent-stats">
          <h3>Current Stats</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Attack:</span>
              <span class="stat-value">${stats.attack.multiplier}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">HP:</span>
              <span class="stat-value">${stats.hp.display}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Lifesteal:</span>
              <span class="stat-value">${stats.lifesteal.percent}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">CDR:</span>
              <span class="stat-value">${stats.cooldown.reduction}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Luck:</span>
              <span class="stat-value">${stats.luck.value}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Crit:</span>
              <span class="stat-value">${stats.crit.chance}</span>
            </div>
          </div>
        </div>

        <div class="talent-lanes" id="talentLanes">
          ${this.renderLanes()}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  /**
   * Render all lanes
   */
  renderLanes() {
    const lanes = getLaneNames();
    return lanes.map(laneName => this.renderLane(laneName)).join('');
  }

  /**
   * Render single lane
   */
  renderLane(laneName) {
    const talents = this.controller.getTalentsByLane(laneName);
    
    return `
      <div class="talent-lane">
        <h3 class="lane-title">${laneName.toUpperCase()}</h3>
        <div class="lane-nodes">
          ${talents.map(talent => this.renderTalentNode(talent)).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render talent node
   */
  renderTalentNode(talent) {
    const classes = ['talent-node'];
    if (talent.isPurchased) classes.push('purchased');
    if (!talent.canPurchase && !talent.isPurchased) classes.push('locked');
    if (talent.ultimate) classes.push('ultimate');

    return `
      <div class="${classes.join(' ')}" data-talent-id="${talent.id}">
        <div class="node-header">
          <span class="node-name">${talent.name}</span>
          <span class="node-cost">AP ${talent.cost}</span>
        </div>
        <div class="node-description">${talent.description}</div>
        ${talent.req ? `<div class="node-req">Requires: ${talent.req.join(', ')}</div>` : ''}
        <button 
          class="btn-purchase" 
          data-talent-id="${talent.id}"
          ${talent.isPurchased || !talent.canPurchase ? 'disabled' : ''}
        >
          ${talent.isPurchased ? 'Owned' : 'Purchase'}
        </button>
        ${talent.purchaseError ? `<div class="node-error">${talent.purchaseError}</div>` : ''}
      </div>
    `;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Purchase buttons
    const purchaseButtons = this.container.querySelectorAll('.btn-purchase');
    purchaseButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const talentId = e.target.dataset.talentId;
        this.purchaseTalent(talentId);
      });
    });

    // Reset button
    const resetButton = this.container.querySelector('#resetTalents');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        if (confirm('Reset all talents? This will refund all AP.')) {
          this.controller.reset();
          this.render(this.container.id);
          this.showNotification('Talents reset!', 'success');
        }
      });
    }
  }

  /**
   * Purchase talent
   */
  purchaseTalent(talentId) {
    const result = this.controller.purchase(talentId);
    
    if (result.success) {
      this.showNotification('Talent purchased!', 'success');
      this.render(this.container.id);
    } else {
      this.showNotification(result.error, 'error');
    }
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Update display (for external updates)
   */
  update() {
    if (this.container) {
      this.render(this.container.id);
    }
  }
}

export function createTalentUI(talentController) {
  return new TalentUI(talentController);
}

export default {
  createTalentUI
};

