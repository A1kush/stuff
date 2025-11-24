/**
 * HPC GOLD INTEGRATION
 * Handles gold transactions for hiring characters
 */

class HPCGoldIntegration {
  constructor() {
    this.callbacks = [];
  }

  /**
   * Get current player gold
   * @returns {number} Current gold amount
   */
  getGold() {
    if (window.gameState && typeof window.gameState.gold === 'number') {
      return window.gameState.gold;
    }
    // Fallback: try to get from gold display element
    const goldElement = document.getElementById('goldCount');
    if (goldElement) {
      const goldText = goldElement.textContent.replace(/,/g, '');
      const gold = parseInt(goldText) || 0;
      return gold;
    }
    return 0;
  }

  /**
   * Check if player can afford amount
   * @param {number} amount - Gold amount to check
   * @returns {boolean} True if can afford
   */
  canAfford(amount) {
    return this.getGold() >= amount;
  }

  /**
   * Deduct gold from player
   * @param {number} amount - Amount to deduct
   * @returns {boolean} True if successful
   */
  deductGold(amount) {
    if (!this.canAfford(amount)) {
      console.warn(`Cannot deduct ${amount} gold - insufficient funds`);
      return false;
    }

    if (window.gameState && typeof window.gameState.gold === 'number') {
      window.gameState.gold -= amount;
      this.updateGoldDisplay();
      this.notifyCallbacks('goldChanged', { newAmount: window.gameState.gold, change: -amount });
      return true;
    }

    // Fallback: try to update gold display element directly
    const goldElement = document.getElementById('goldCount');
    if (goldElement) {
      const currentGold = this.getGold();
      const newGold = currentGold - amount;
      goldElement.textContent = newGold.toLocaleString();
      this.notifyCallbacks('goldChanged', { newAmount: newGold, change: -amount });
      return true;
    }

    console.error('Cannot deduct gold - gameState.gold not found');
    return false;
  }

  /**
   * Add gold to player
   * @param {number} amount - Amount to add
   */
  addGold(amount) {
    if (window.gameState && typeof window.gameState.gold === 'number') {
      window.gameState.gold += amount;
      this.updateGoldDisplay();
      this.notifyCallbacks('goldChanged', { newAmount: window.gameState.gold, change: amount });
      return true;
    }

    // Fallback: try to update gold display element directly
    const goldElement = document.getElementById('goldCount');
    if (goldElement) {
      const currentGold = this.getGold();
      const newGold = currentGold + amount;
      goldElement.textContent = newGold.toLocaleString();
      this.notifyCallbacks('goldChanged', { newAmount: newGold, change: amount });
      return true;
    }

    return false;
  }

  /**
   * Update gold display in UI
   */
  updateGoldDisplay() {
    const gold = this.getGold();
    
    // Update gold count element if it exists
    const goldElement = document.getElementById('goldCount');
    if (goldElement) {
      goldElement.textContent = gold.toLocaleString();
    }

    // Update any other gold displays
    const allGoldElements = document.querySelectorAll('[data-gold-display]');
    allGoldElements.forEach(el => {
      el.textContent = gold.toLocaleString();
    });
  }

  /**
   * Register callback for gold changes
   * @param {Function} callback - Callback function
   */
  onGoldChange(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
    }
  }

  /**
   * Remove callback
   * @param {Function} callback - Callback function to remove
   */
  removeCallback(callback) {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  /**
   * Notify all callbacks
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  notifyCallbacks(event, data) {
    this.callbacks.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in gold change callback:', error);
      }
    });
  }

  /**
   * Format gold amount for display
   * @param {number} amount - Gold amount
   * @returns {string} Formatted string
   */
  formatGold(amount) {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + 'K';
    }
    return amount.toLocaleString();
  }
}

// Create singleton instance
if (typeof window !== 'undefined') {
  window.hpcGoldIntegration = new HPCGoldIntegration();
}

