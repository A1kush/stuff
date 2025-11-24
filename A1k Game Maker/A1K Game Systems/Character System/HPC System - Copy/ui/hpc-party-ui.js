/**
 * HPC PARTY UI - Party management interface
 * Side panel for managing active party members
 */

class HPCPartyUI {
  constructor() {
    this.panel = null;
    this.isOpen = false;
  }

  /**
   * Open party UI
   */
  open() {
    if (this.isOpen) return;
    this.createPanel();
    this.isOpen = true;
  }

  /**
   * Close party UI
   */
  close() {
    if (this.panel) {
      this.panel.remove();
      this.panel = null;
    }
    this.isOpen = false;
  }

  /**
   * Toggle party UI
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Create panel element
   */
  createPanel() {
    this.panel = document.createElement('div');
    this.panel.className = 'hpc-party-panel';
    this.panel.innerHTML = `
      <div class="hpc-party-header">
        <h3>👥 Party Management</h3>
        <button class="hpc-party-close">&times;</button>
      </div>
      <div class="hpc-party-body">
        <div class="hpc-party-slots" id="hpc-party-slots">
          <!-- Party slots will be created here -->
        </div>
        <div class="hpc-party-available">
          <h4>Available Characters</h4>
          <div class="hpc-available-list" id="hpc-available-list">
            <!-- Available characters will be loaded here -->
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.panel);

    // Event listeners
    this.panel.querySelector('.hpc-party-close').addEventListener('click', () => this.close());

    this.refresh();
  }

  /**
   * Refresh party UI
   */
  refresh() {
    if (!this.panel) return;

    this.refreshPartySlots();
    this.refreshAvailableList();
  }

  /**
   * Refresh party slots
   */
  refreshPartySlots() {
    const slotsContainer = document.getElementById('hpc-party-slots');
    if (!slotsContainer) return;

    slotsContainer.innerHTML = '';

    const maxSlots = window.hpcManager?.maxPartySize || 4;
    const partyMembers = window.hpcManager?.getPartyMembers() || [];

    for (let i = 0; i < maxSlots; i++) {
      const slot = document.createElement('div');
      slot.className = 'hpc-party-slot';
      slot.dataset.slotIndex = i;

      if (partyMembers[i]) {
        const member = partyMembers[i];
        const card = this.createPartyMemberCard(member);
        slot.appendChild(card);
      } else {
        slot.classList.add('empty');
        slot.innerHTML = '<div class="hpc-slot-empty">Empty Slot</div>';
      }

      slotsContainer.appendChild(slot);
    }
  }

  /**
   * Create party member card
   * @param {Object} character - Character data
   * @returns {HTMLElement} Card element
   */
  createPartyMemberCard(character) {
    const card = document.createElement('div');
    card.className = 'hpc-party-member-card';
    card.dataset.hpcId = character.id;

    const icon = document.createElement('span');
    icon.className = 'hpc-party-icon';
    icon.textContent = character.icon || '👤';

    const name = document.createElement('div');
    name.className = 'hpc-party-name';
    name.textContent = character.displayName || character.name;

    const level = document.createElement('div');
    level.className = 'hpc-party-level';
    level.textContent = `Lv.${character.level}`;

    const stats = document.createElement('div');
    stats.className = 'hpc-party-stats';
    stats.innerHTML = `
      <span>HP: ${Math.floor(character.currentStats.hp)}</span>
      <span>ATK: ${Math.floor(character.currentStats.atk)}</span>
    `;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'hpc-party-remove-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      window.hpcManager?.removeFromParty(character.id);
      this.refresh();
      if (window.hpcHiringUI) {
        window.hpcHiringUI.refresh();
      }
    });

    card.appendChild(icon);
    card.appendChild(name);
    card.appendChild(level);
    card.appendChild(stats);
    card.appendChild(removeBtn);

    return card;
  }

  /**
   * Refresh available characters list
   */
  refreshAvailableList() {
    const listContainer = document.getElementById('hpc-available-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    const hiredCharacters = window.hpcManager?.getHiredCharacters() || [];
    const partyIds = window.hpcManager?.getPartyMembers().map(c => c.id) || [];

    // Filter out characters already in party
    const available = hiredCharacters.filter(char => !partyIds.includes(char.id));

    if (available.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'hpc-empty-message';
      empty.textContent = 'No available characters. Hire some first!';
      listContainer.appendChild(empty);
      return;
    }

    available.forEach(character => {
      const item = document.createElement('div');
      item.className = 'hpc-available-item';
      item.dataset.hpcId = character.id;

      const icon = document.createElement('span');
      icon.className = 'hpc-available-icon';
      icon.textContent = character.icon || '👤';

      const info = document.createElement('div');
      info.className = 'hpc-available-info';
      
      const name = document.createElement('div');
      name.className = 'hpc-available-name';
      name.textContent = character.displayName || character.name;

      const level = document.createElement('div');
      level.className = 'hpc-available-level';
      level.textContent = `Lv.${character.level}`;

      info.appendChild(name);
      info.appendChild(level);

      const addBtn = document.createElement('button');
      addBtn.className = 'hpc-available-add-btn';
      addBtn.textContent = 'Add';
      addBtn.addEventListener('click', () => {
        const result = window.hpcManager?.addToParty(character.id);
        if (result.success) {
          this.refresh();
          if (window.hpcHiringUI) {
            window.hpcHiringUI.refresh();
          }
        } else {
          alert(result.message || result.error);
        }
      });

      item.appendChild(icon);
      item.appendChild(info);
      item.appendChild(addBtn);
      listContainer.appendChild(item);
    });
  }
}

// Create singleton instance
if (typeof window !== 'undefined') {
  window.hpcPartyUI = new HPCPartyUI();
}

