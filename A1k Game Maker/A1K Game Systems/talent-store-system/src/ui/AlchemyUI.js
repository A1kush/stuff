/**
 * AlchemyUI.js
 * Renders alchemy interface with drag-and-drop crafting slots
 */

class AlchemyUI {
  constructor(alchemyController, gameState) {
    this.controller = alchemyController;
    this.gameState = gameState;
    this.container = null;
  }

  /**
   * Render alchemy interface
   */
  render(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container #${containerId} not found`);
      return;
    }

    const validItems = this.controller.getValidItems();
    const slotItems = this.controller.getSlotItems();
    const preview = this.controller.getRecipePreview();
    const stats = this.controller.getStatistics();

    this.container.innerHTML = `
      <div class="alchemy-system">
        <div class="alchemy-header">
          <h2>Alchemy Station</h2>
          <div class="alchemy-stats">
            <span>Total Crafts: ${stats.totalCrafts}</span>
            <span>Fusion: ${stats.byType.fusion}</span>
            <span>Special: ${stats.byType.special}</span>
            <span>Alchemy: ${stats.byType.alchemy}</span>
          </div>
        </div>

        <div class="alchemy-info">
          <div class="info-box">
            <strong>Fusion:</strong> 3 same-type/rank items → tier up
          </div>
          <div class="info-box">
            <strong>Special:</strong> C gear + B gear + C pet → premium reward
          </div>
          <div class="info-box">
            <strong>Alchemy:</strong> Any 3 items → treasure box
          </div>
        </div>

        <div class="alchemy-crafting">
          <div class="crafting-slots">
            ${this.renderCraftingSlots(slotItems)}
          </div>
          <div class="arrow">→</div>
          <div class="result-preview">
            ${this.renderPreview(preview)}
          </div>
        </div>

        <div class="alchemy-actions">
          <button class="btn-craft" id="btnCraft" ${!preview.valid ? 'disabled' : ''}>
            Craft
          </button>
          <button class="btn-clear" id="btnClearSlots">Clear Slots</button>
        </div>

        <div class="alchemy-inventory">
          <h3>Available Items</h3>
          <div class="inventory-grid">
            ${validItems.map(item => this.renderInventoryItem(item)).join('')}
          </div>
        </div>

        <div class="alchemy-history">
          <h3>Recent Crafts</h3>
          <div class="history-list">
            ${this.renderHistory()}
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
    this.setupDragAndDrop();
  }

  /**
   * Render crafting slots
   */
  renderCraftingSlots(slotItems) {
    return slotItems.map((item, index) => `
      <div 
        class="craft-slot ${item ? 'filled' : 'empty'}" 
        data-slot-index="${index}"
      >
        ${item ? `
          <div class="slot-item" data-item-id="${item.id}">
            <div class="item-name">${item.name}</div>
            <div class="item-rank">${item.rank || 'C'}</div>
            <button class="btn-remove" data-slot-index="${index}">×</button>
          </div>
        ` : `
          <div class="slot-placeholder">Drop Item</div>
        `}
      </div>
    `).join('');
  }

  /**
   * Render result preview
   */
  renderPreview(preview) {
    if (!preview.valid) {
      return `
        <div class="preview-empty">
          <div class="preview-placeholder">?</div>
          <div class="preview-message">${preview.message || 'Add 3 items'}</div>
        </div>
      `;
    }

    return `
      <div class="preview-result">
        <div class="result-type">${preview.recipeType.toUpperCase()}</div>
        ${preview.output.rank ? `<div class="result-rank">${preview.output.rank}-Rank</div>` : ''}
        <div class="result-message">${preview.output.message}</div>
      </div>
    `;
  }

  /**
   * Render inventory item
   */
  renderInventoryItem(item) {
    return `
      <div 
        class="inventory-item" 
        draggable="true" 
        data-item-id="${item.id}"
      >
        <div class="item-name">${item.name}</div>
        <div class="item-rank rank-${item.rank || 'C'}">${item.rank || 'C'}</div>
        ${item.atk ? `<div class="item-stat">⚔️ ${item.atk}</div>` : ''}
        ${item.def ? `<div class="item-stat">🛡️ ${item.def}</div>` : ''}
      </div>
    `;
  }

  /**
   * Render history
   */
  renderHistory() {
    const history = this.controller.getHistory(5);
    
    if (history.length === 0) {
      return '<div class="history-empty">No crafts yet</div>';
    }

    return history.map(entry => `
      <div class="history-entry">
        <span class="history-type">${entry.recipeType}</span>
        <span class="history-inputs">${entry.inputs.map(i => i.name).join(' + ')}</span>
        <span class="history-arrow">→</span>
        <span class="history-output">${entry.output.name}</span>
      </div>
    `).join('');
  }

  /**
   * Setup drag and drop
   */
  setupDragAndDrop() {
    // Inventory items (drag start)
    const inventoryItems = this.container.querySelectorAll('.inventory-item');
    inventoryItems.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('itemId', e.target.dataset.itemId);
        e.target.classList.add('dragging');
      });

      item.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
      });
    });

    // Crafting slots (drop target)
    const craftSlots = this.container.querySelectorAll('.craft-slot');
    craftSlots.forEach(slot => {
      slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        slot.classList.add('drag-over');
      });

      slot.addEventListener('dragleave', () => {
        slot.classList.remove('drag-over');
      });

      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('drag-over');
        
        const itemId = e.dataTransfer.getData('itemId');
        const slotIndex = parseInt(slot.dataset.slotIndex);
        
        this.setSlot(slotIndex, itemId);
      });
    });
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Craft button
    const craftButton = this.container.querySelector('#btnCraft');
    if (craftButton) {
      craftButton.addEventListener('click', () => {
        this.craft();
      });
    }

    // Clear button
    const clearButton = this.container.querySelector('#btnClearSlots');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        this.controller.clearAllSlots();
        this.render(this.container.id);
      });
    }

    // Remove buttons
    const removeButtons = this.container.querySelectorAll('.btn-remove');
    removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const slotIndex = parseInt(e.target.dataset.slotIndex);
        this.controller.clearSlot(slotIndex);
        this.render(this.container.id);
      });
    });

    // Click to add (alternative to drag-drop)
    const inventoryItems = this.container.querySelectorAll('.inventory-item');
    inventoryItems.forEach(item => {
      item.addEventListener('click', () => {
        const itemId = item.dataset.itemId;
        const slots = this.controller.getSlotItems();
        const emptySlotIndex = slots.findIndex(slot => !slot);
        
        if (emptySlotIndex !== -1) {
          this.setSlot(emptySlotIndex, itemId);
        } else {
          this.showNotification('All slots are full', 'warning');
        }
      });
    });
  }

  /**
   * Set item in slot
   */
  setSlot(slotIndex, itemId) {
    const result = this.controller.setSlot(slotIndex, itemId);
    
    if (result.success) {
      this.render(this.container.id);
    } else {
      this.showNotification(result.error, 'error');
    }
  }

  /**
   * Craft items
   */
  craft() {
    const result = this.controller.craft();
    
    if (result.success) {
      this.showNotification(result.message, 'success');
      this.render(this.container.id);
    } else {
      this.showNotification(result.error, 'error');
    }
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Update display
   */
  update() {
    if (this.container) {
      this.render(this.container.id);
    }
  }
}

export function createAlchemyUI(alchemyController, gameState) {
  return new AlchemyUI(alchemyController, gameState);
}

export default {
  createAlchemyUI
};

