/**
 * HPC HIRING UI - Character browser and hiring interface
 * Modal interface for browsing and hiring characters
 */

class HPCHiringUI {
  constructor() {
    this.modal = null;
    this.currentFilter = 'all';
    this.currentSort = 'rank';
    this.searchTerm = '';
    this.isOpen = false;
  }

  /**
   * Open hiring UI
   */
  open() {
    if (this.isOpen) return;
    this.createModal();
    this.isOpen = true;
  }

  /**
   * Close hiring UI
   */
  close() {
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }
    this.isOpen = false;
  }

  /**
   * Toggle hiring UI
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Create modal element
   */
  createModal() {
    this.modal = document.createElement('div');
    this.modal.className = 'hpc-hiring-modal';
    this.modal.innerHTML = `
      <div class="hpc-modal-overlay"></div>
      <div class="hpc-modal-content">
        <div class="hpc-modal-header">
          <h2>💰 Hire Characters</h2>
          <button class="hpc-modal-close">&times;</button>
        </div>
        <div class="hpc-modal-body">
          <div class="hpc-filters">
            <div class="hpc-filter-group">
              <label>Type:</label>
              <select id="hpc-type-filter">
                <option value="all">All Types</option>
                <option value="warrior">Warrior</option>
                <option value="mage">Mage</option>
                <option value="archer">Archer</option>
                <option value="healer">Healer</option>
                <option value="rogue">Rogue</option>
                <option value="tank">Tank</option>
                <option value="crafter">Crafter</option>
              </select>
            </div>
            <div class="hpc-filter-group">
              <label>Rank:</label>
              <select id="hpc-rank-filter">
                <option value="all">All Ranks</option>
                <option value="E">E-Rank</option>
                <option value="D">D-Rank</option>
                <option value="C">C-Rank</option>
                <option value="B">B-Rank</option>
                <option value="A">A-Rank</option>
                <option value="S">S-Rank</option>
              </select>
            </div>
            <div class="hpc-filter-group">
              <label>Sort:</label>
              <select id="hpc-sort">
                <option value="rank">By Rank</option>
                <option value="cost">By Cost</option>
                <option value="type">By Type</option>
              </select>
            </div>
            <div class="hpc-filter-group">
              <input type="text" id="hpc-search" placeholder="Search...">
            </div>
          </div>
          <div class="hpc-gold-display">
            <span>Your Gold: </span>
            <span id="hpc-current-gold" class="hpc-gold-amount">0</span>
          </div>
          <div class="hpc-character-grid" id="hpc-character-grid">
            <!-- Characters will be loaded here -->
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);

    // Event listeners
    this.modal.querySelector('.hpc-modal-close').addEventListener('click', () => this.close());
    this.modal.querySelector('.hpc-modal-overlay').addEventListener('click', () => this.close());
    
    document.getElementById('hpc-type-filter').addEventListener('change', (e) => {
      this.currentFilter = e.target.value;
      this.refresh();
    });
    
    document.getElementById('hpc-rank-filter').addEventListener('change', (e) => {
      this.currentFilter = e.target.value;
      this.refresh();
    });
    
    document.getElementById('hpc-sort').addEventListener('change', (e) => {
      this.currentSort = e.target.value;
      this.refresh();
    });
    
    document.getElementById('hpc-search').addEventListener('input', (e) => {
      this.searchTerm = e.target.value.toLowerCase();
      this.refresh();
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    this.refresh();
    this.updateGoldDisplay();
  }

  /**
   * Refresh character grid
   */
  refresh() {
    const grid = document.getElementById('hpc-character-grid');
    if (!grid) return;

    grid.innerHTML = '';

    // Get all HPCs
    let hpcList = window.HPCDatabase?.getAllHPCs() || [];

    // Apply filters
    if (this.currentFilter !== 'all') {
      // Check if filter is a type or rank
      const types = ['warrior', 'mage', 'archer', 'healer', 'rogue', 'tank', 'crafter'];
      const ranks = ['E', 'D', 'C', 'B', 'A', 'S'];
      
      if (types.includes(this.currentFilter)) {
        hpcList = hpcList.filter(hpc => hpc.type === this.currentFilter);
      } else if (ranks.includes(this.currentFilter)) {
        hpcList = hpcList.filter(hpc => hpc.rank === this.currentFilter);
      }
    }

    // Apply search
    if (this.searchTerm) {
      hpcList = hpcList.filter(hpc => 
        hpc.name.toLowerCase().includes(this.searchTerm) ||
        hpc.type.toLowerCase().includes(this.searchTerm) ||
        hpc.description.toLowerCase().includes(this.searchTerm)
      );
    }

    // Sort
    hpcList.sort((a, b) => {
      switch (this.currentSort) {
        case 'cost':
          return a.hireCost - b.hireCost;
        case 'type':
          return a.type.localeCompare(b.type);
        case 'rank':
        default:
          const rankOrder = { E: 0, D: 1, C: 2, B: 3, A: 4, S: 5 };
          return rankOrder[a.rank] - rankOrder[b.rank];
      }
    });

    // Create cards
    hpcList.forEach(hpcData => {
      const hpcInfo = window.hpcManager?.getHPCInfo(hpcData.id);
      if (hpcInfo) {
        const card = window.HPCCharacterCard?.createCard(hpcInfo, {
          showActions: true,
          showStats: true,
          showXP: true
        });
        if (card) {
          grid.appendChild(card);
        }
      }
    });

    if (hpcList.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'hpc-empty-message';
      empty.textContent = 'No characters found.';
      grid.appendChild(empty);
    }
  }

  /**
   * Handle hire action
   * @param {string} hpcId - HPC ID to hire
   */
  handleHire(hpcId) {
    const result = window.hpcManager?.hireCharacter(hpcId);
    
    if (result.success) {
      // Show success message
      this.showMessage(`Successfully hired ${result.character.name}!`, 'success');
      
      // Refresh UI
      this.refresh();
      this.updateGoldDisplay();
      
      // Update party UI if open
      if (window.hpcPartyUI) {
        window.hpcPartyUI.refresh();
      }
    } else {
      // Show error message
      this.showMessage(result.message || result.error, 'error');
    }
  }

  /**
   * Update gold display
   */
  updateGoldDisplay() {
    const goldElement = document.getElementById('hpc-current-gold');
    if (goldElement && window.hpcGoldIntegration) {
      const gold = window.hpcGoldIntegration.getGold();
      goldElement.textContent = gold.toLocaleString();
    }
  }

  /**
   * Show message
   * @param {string} message - Message text
   * @param {string} type - Message type (success, error, info)
   */
  showMessage(message, type = 'info') {
    // Remove existing messages
    const existing = this.modal?.querySelector('.hpc-message');
    if (existing) existing.remove();

    const messageEl = document.createElement('div');
    messageEl.className = `hpc-message hpc-message-${type}`;
    messageEl.textContent = message;
    
    if (this.modal) {
      this.modal.querySelector('.hpc-modal-body').insertBefore(
        messageEl,
        this.modal.querySelector('.hpc-character-grid')
      );
      
      // Auto-remove after 3 seconds
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.remove();
        }
      }, 3000);
    }
  }
}

// Create singleton instance
if (typeof window !== 'undefined') {
  window.hpcHiringUI = new HPCHiringUI();
}

