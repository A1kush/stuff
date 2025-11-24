// ═══════════════════════════════════════════════════════════════════════════
// EPIC FANTASY BAG SYSTEM - Production Edition (7 Main Tabs with Subtabs)
// ═══════════════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB CONFIGURATION (7 Main Tabs with Subtabs)
  // ═══════════════════════════════════════════════════════════════════════════
  const MAIN_TABS = [
    { 
      id: 'items', 
      label: 'Items', 
      icon: '📦', 
      order: 1,
      subtabs: [
        { id: 'inventory', label: 'Inventory', icon: '📦' },
        { id: 'alchemy', label: 'Alchemy', icon: '⚗️' }
      ]
    },
    { 
      id: 'gear', 
      label: 'Gear', 
      icon: '⚔️', 
      order: 2,
      subtabs: []
    },
    { 
      id: 'player', 
      label: 'Player', 
      icon: '👤', 
      order: 3,
      subtabs: [
        { id: 'stats', label: 'Stats', icon: '📊' },
        { id: 'team', label: 'Team', icon: '👥' },
        { id: 'companions', label: 'Companions', icon: '🐾' },
        { id: 'cosmetics', label: 'Cosmetics', icon: '✨' }
      ]
    },
    { 
      id: 'abilities', 
      label: 'Abilities', 
      icon: '🔰', 
      order: 4,
      subtabs: [
        { id: 'skills', label: 'Skills', icon: '⚡' },
        { id: 'supernatural', label: 'Supernatural', icon: '🔮' },
        { id: 'talent', label: 'Talent', icon: '⭐' }
      ]
    },
    { 
      id: 'companions', 
      label: 'Companions', 
      icon: '🐾', 
      order: 5,
      subtabs: [
        { id: 'pets', label: 'Pets', icon: '🐕' },
        { id: 'ai', label: 'AI', icon: '🤖' },
        { id: 'vehicles', label: 'Vehicles', icon: '🚗' },
        { id: 'spirit', label: 'Spirit', icon: '✨' }
      ]
    },
    { 
      id: 'quests', 
      label: 'Quest & Collection', 
      icon: '📜', 
      order: 6,
      subtabs: [
        { id: 'quests', label: 'Quests', icon: '📜' },
        { id: 'missions', label: 'Missions', icon: '🗺️' },
        { id: 'bestiary', label: 'Bestiary', icon: '📖' },
        { id: 'drops', label: 'Drops', icon: '🎁' },
        { id: 'map', label: 'Map', icon: '🗺️' }
      ]
    },
    { 
      id: 'shop', 
      label: 'Shop', 
      icon: '🏪', 
      order: 7,
      subtabs: []
    }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // NEO BAG SYSTEM CLASS
  // ═══════════════════════════════════════════════════════════════════════════
  class NeoBagSystem {
    constructor(options = {}) {
      this.containerId = options.containerId || 'bag-system-root';
      this.state = {
        isOpen: false,
        activeTab: 'items',
        activeSubtab: {},
        isMinimized: false,
        isMaximized: false
      };
      this.container = null;
    }

    init() {
      this.container = document.getElementById(this.containerId);
      if (!this.container) {
        console.error('Container not found:', this.containerId);
        return;
      }
      this.render();
      this.attachEvents();
      this.updateCurrencies();
      console.log('✅ Epic Fantasy Bag System initialized');
    }

    render() {
      this.container.innerHTML = `
        <div class="neo-bag-window" id="neoBagWindow">
          <div class="neo-bag-titlebar">
            <div class="neo-titlebar-left">
              <span class="neo-icon">⚔️</span>
              <span class="neo-title">EPIC FANTASY BAG</span>
            </div>
            <div class="neo-titlebar-controls">
              <button class="neo-btn-icon" id="neoMinimizeBtn" title="Minimize">−</button>
              <button class="neo-btn-icon" id="neoMaximizeBtn" title="Maximize">□</button>
              <button class="neo-btn-icon" id="neoCloseBtn" title="Close">✕</button>
            </div>
          </div>
          
          <div class="neo-bag-currencies">
            <div class="neo-currency-item">
              <span class="neo-currency-icon">💰</span>
              <span class="neo-currency-value" id="neoGoldValue">0</span>
            </div>
            <div class="neo-currency-item">
              <span class="neo-currency-icon">💎</span>
              <span class="neo-currency-value" id="neoGemsValue">0</span>
            </div>
            <div class="neo-currency-item">
              <span class="neo-currency-icon">🔑</span>
              <span class="neo-currency-value" id="neoKeysValue">0</span>
            </div>
          </div>
          
          <div class="neo-bag-tabs">
            <div class="neo-tabs-strip" id="neoTabsStrip"></div>
          </div>
          
          <div class="neo-bag-subtabs" id="neoSubtabsContainer"></div>
          
          <div class="neo-bag-content" id="neoBagContent">
            <div class="neo-content-placeholder">Select a tab to begin</div>
          </div>
        </div>
      `;
      this.renderTabs();
      this.renderActiveTab();
    }

    renderTabs() {
      const tabsStrip = document.getElementById('neoTabsStrip');
      if (!tabsStrip) return;

      tabsStrip.innerHTML = MAIN_TABS.map(tab => `
        <button class="neo-tab-btn ${this.state.activeTab === tab.id ? 'active' : ''}" 
                data-tab="${tab.id}"
                title="${tab.label}">
          <span class="neo-tab-icon">${tab.icon}</span>
          <span class="neo-tab-label">${tab.label}</span>
        </button>
      `).join('');

      tabsStrip.querySelectorAll('.neo-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const tabId = e.currentTarget.dataset.tab;
          this.switchTab(tabId);
        });
      });
    }

    renderSubtabs(tabId) {
      const subtabsContainer = document.getElementById('neoSubtabsContainer');
      if (!subtabsContainer) return;

      const tab = MAIN_TABS.find(t => t.id === tabId);
      if (!tab || !tab.subtabs || tab.subtabs.length === 0) {
        subtabsContainer.innerHTML = '';
        subtabsContainer.style.display = 'none';
        return;
      }

      subtabsContainer.style.display = 'block';
      const currentSubtab = this.state.activeSubtab[tabId] || tab.subtabs[0].id;

      subtabsContainer.innerHTML = `
        <div class="neo-subtabs-strip">
          ${tab.subtabs.map(subtab => `
            <button class="neo-subtab-btn ${currentSubtab === subtab.id ? 'active' : ''}" 
                    data-subtab="${subtab.id}"
                    title="${subtab.label}">
              <span class="neo-subtab-icon">${subtab.icon}</span>
              <span class="neo-subtab-label">${subtab.label}</span>
            </button>
          `).join('')}
        </div>
      `;

      subtabsContainer.querySelectorAll('.neo-subtab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const subtabId = e.currentTarget.dataset.subtab;
          this.switchSubtab(tabId, subtabId);
        });
      });
    }

    switchTab(tabId) {
      this.state.activeTab = tabId;
      const tab = MAIN_TABS.find(t => t.id === tabId);
      if (tab && tab.subtabs && tab.subtabs.length > 0) {
        if (!this.state.activeSubtab[tabId]) {
          this.state.activeSubtab[tabId] = tab.subtabs[0].id;
        }
      }
      this.renderTabs();
      this.renderSubtabs(tabId);
      this.renderActiveTab();
    }

    switchSubtab(tabId, subtabId) {
      this.state.activeSubtab[tabId] = subtabId;
      this.renderSubtabs(tabId);
      this.renderActiveTab();
    }

    renderActiveTab() {
      const content = document.getElementById('neoBagContent');
      if (!content) return;

      const tabId = this.state.activeTab;
      const tab = MAIN_TABS.find(t => t.id === tabId);
      const subtabId = tab && tab.subtabs && tab.subtabs.length > 0 
        ? (this.state.activeSubtab[tabId] || tab.subtabs[0].id)
        : null;

      const renderers = {
        items: () => this.renderItemsTab(subtabId || 'inventory'),
        gear: () => this.renderGearTab(),
        player: () => this.renderPlayerTab(subtabId || 'stats'),
        abilities: () => this.renderAbilitiesTab(subtabId || 'skills'),
        companions: () => this.renderCompanionsTab(subtabId || 'pets'),
        quests: () => this.renderQuestsTab(subtabId || 'quests'),
        shop: () => this.renderShopTab()
      };

      const renderer = renderers[tabId];
      if (renderer) {
        content.innerHTML = renderer();
      } else {
        content.innerHTML = `<div class="neo-error">Tab "${tabId}" not implemented</div>`;
      }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TAB RENDERERS
    // ═══════════════════════════════════════════════════════════════════════════
    
    renderItemsTab(subtab) {
      if (subtab === 'alchemy') {
        return this.renderAlchemyTab();
      }
      
      let items = window.gameState?.inventory?.items || [];
      
      // Apply filter
      if (this.state.filterBy && this.state.filterBy !== 'all') {
        items = items.filter(i => i.category === this.state.filterBy || i.rarity === this.state.filterBy);
      }
      
      // Apply sort
      if (this.state.sortBy) {
        const sortFunctions = {
          name: (a, b) => (a.name || '').localeCompare(b.name || ''),
          rarity: (a, b) => {
            const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
            return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
          },
          quantity: (a, b) => (b.quantity || 0) - (a.quantity || 0),
          type: (a, b) => (a.category || '').localeCompare(b.category || '')
        };
        const sortFn = sortFunctions[this.state.sortBy] || sortFunctions.name;
        items.sort(sortFn);
      }
      
      if (items.length === 0) {
        return `
          <div class="neo-controls-bar" style="margin-bottom: 20px;">
            <select class="neo-select" onchange="window.neoBagSystem.sortInventory(this.value)" style="margin-right: 8px;">
              <option value="name">Sort: Name</option>
              <option value="rarity">Sort: Rarity</option>
              <option value="quantity">Sort: Quantity</option>
              <option value="type">Sort: Type</option>
            </select>
            <select class="neo-select" onchange="window.neoBagSystem.filterInventory(this.value)">
              <option value="all">Filter: All</option>
              <option value="consumable">Consumable</option>
              <option value="common">Common</option>
              <option value="rare">Rare</option>
            </select>
          </div>
          <div class="neo-empty">No items in inventory</div>
        `;
      }
      
      return `
        <div class="neo-controls-bar" style="margin-bottom: 20px;">
          <select class="neo-select" onchange="window.neoBagSystem.sortInventory(this.value)" style="margin-right: 8px;">
            <option value="name">Sort: Name</option>
            <option value="rarity">Sort: Rarity</option>
            <option value="quantity">Sort: Quantity</option>
            <option value="type">Sort: Type</option>
          </select>
          <select class="neo-select" onchange="window.neoBagSystem.filterInventory(this.value)">
            <option value="all">Filter: All</option>
            <option value="consumable">Consumable</option>
            <option value="common">Common</option>
            <option value="rare">Rare</option>
          </select>
        </div>
        <div class="neo-items-grid">
          ${items.map(item => `
            <div class="neo-item-card" data-rarity="${item.rarity || 'common'}">
              ${item.locked ? '<div class="neo-locked-overlay">🔒</div>' : ''}
              <div class="neo-item-icon">${item.icon || '📦'}</div>
              <div class="neo-item-name">${item.name}</div>
              <div class="neo-item-quantity">x${item.quantity || 1}</div>
              <div class="neo-item-actions">
                ${item.category === 'consumable' ? `<button class="neo-btn-small" onclick="window.neoBagSystem.useItem('${item.id}')">Use</button>` : ''}
                <button class="neo-btn-small" onclick="window.neoBagSystem.lockItem('${item.id}')" style="margin-top: 4px;">${item.locked ? '🔓 Unlock' : '🔒 Lock'}</button>
                <button class="neo-btn-small" onclick="window.neoBagSystem.sellItem('${item.id}')" style="margin-top: 4px; ${item.locked ? 'opacity: 0.5; pointer-events: none;' : ''}">Sell</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    renderGearTab() {
      const gameState = window.gameState;
      const charId = gameState.currentCharacterId || 'A1';
      let gear = gameState?.inventory?.gear || [];
      const equipped = gameState?.equipped?.[charId] || {};
      
      // Apply filter
      if (this.state.filterBy && this.state.filterBy !== 'all') {
        gear = gear.filter(g => g.rarity === this.state.filterBy || g.slot === this.state.filterBy);
      }
      
      // Apply sort
      if (this.state.sortBy) {
        const sortFunctions = {
          name: (a, b) => (a.name || '').localeCompare(b.name || ''),
          rarity: (a, b) => {
            const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
            return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
          },
          power: (a, b) => this.calculateItemPower(b) - this.calculateItemPower(a),
          type: (a, b) => (a.slot || '').localeCompare(b.slot || '')
        };
        const sortFn = sortFunctions[this.state.sortBy] || sortFunctions.name;
        gear.sort(sortFn);
      }
      
      return `
        <div class="neo-gear-container">
          <div class="neo-gear-equipped">
            <div class="neo-section-header">
              <h3 class="neo-section-title">Equipped Gear - ${charId}</h3>
              <button class="neo-btn-small" onclick="window.neoBagSystem.autoEquip('${charId}')" style="margin-left: auto;">⚡ Auto-Equip</button>
            </div>
            <div class="neo-gear-slots-grid">
              ${['weapon', 'offhand', 'head', 'chest', 'gloves', 'pants', 'boots', 'ring1', 'ring2', 'necklace'].map(slot => {
                const item = equipped[slot];
                return `
                  <div class="neo-gear-slot" data-slot="${slot}">
                    <div class="neo-slot-label">${slot}</div>
                    ${item ? `
                      <div class="neo-slot-item" data-rarity="${item.rarity || 'common'}">
                        <span class="neo-slot-icon">${item.icon || '⚔️'}</span>
                        <span class="neo-slot-name">${item.name}</span>
                        ${item.upgradeLevel ? `<span class="neo-upgrade-level">+${item.upgradeLevel}</span>` : ''}
                        ${item.locked ? '<span class="neo-locked-badge">🔒</span>' : ''}
                      </div>
                    ` : '<div class="neo-slot-empty">Empty</div>'}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
          <div class="neo-gear-inventory">
            <div class="neo-section-header">
              <h3 class="neo-section-title">Inventory</h3>
              <div class="neo-controls">
                <select class="neo-select" onchange="window.neoBagSystem.sortInventory(this.value)" style="margin-right: 8px;">
                  <option value="name">Sort: Name</option>
                  <option value="rarity">Sort: Rarity</option>
                  <option value="power">Sort: Power</option>
                  <option value="type">Sort: Type</option>
                </select>
                <select class="neo-select" onchange="window.neoBagSystem.filterInventory(this.value)">
                  <option value="all">Filter: All</option>
                  <option value="common">Common</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                </select>
              </div>
            </div>
            <div class="neo-items-grid">
              ${gear.length === 0 ? '<div class="neo-empty">No gear in inventory</div>' : gear.map(g => {
                const power = this.calculateItemPower(g);
                return `
                <div class="neo-item-card" data-rarity="${g.rarity || 'common'}">
                  ${g.locked ? '<div class="neo-locked-overlay">🔒</div>' : ''}
                  <div class="neo-item-icon">${g.icon || '⚔️'}</div>
                  <div class="neo-item-name">${g.name}</div>
                  <div class="neo-item-slot">${g.slot}</div>
                  ${g.upgradeLevel ? `<div class="neo-item-upgrade">+${g.upgradeLevel}</div>` : ''}
                  <div class="neo-item-power">Power: ${power}</div>
                  <div class="neo-item-actions">
                    <button class="neo-btn-small" onclick="window.neoBagSystem.equipGear('${g.id}')">Equip</button>
                    <button class="neo-btn-small" onclick="window.neoBagSystem.upgradeGear('${g.id}')" style="margin-top: 4px;">Upgrade</button>
                    <button class="neo-btn-small" onclick="window.neoBagSystem.lockItem('${g.id}')" style="margin-top: 4px;">${g.locked ? '🔓 Unlock' : '🔒 Lock'}</button>
                    <button class="neo-btn-small" onclick="window.neoBagSystem.sellItem('${g.id}')" style="margin-top: 4px; ${g.locked ? 'opacity: 0.5; pointer-events: none;' : ''}">Sell</button>
                  </div>
                </div>
              `;
              }).join('')}
            </div>
          </div>
        </div>
      `;
    }

    renderPlayerTab(subtab) {
      const gameState = window.gameState;
      const currentChar = gameState?.characters?.[gameState.currentCharacterId] || {};
      
      if (subtab === 'stats') {
        return `
          <div class="neo-player-stats">
            <h3 class="neo-section-title">Character Stats</h3>
            <div class="neo-stats-grid">
              <div class="neo-stat-card">
                <div class="neo-stat-label">HP</div>
                <div class="neo-stat-value">${currentChar.stats?.hp || 0}</div>
              </div>
              <div class="neo-stat-card">
                <div class="neo-stat-label">MP</div>
                <div class="neo-stat-value">${currentChar.stats?.mp || 0}</div>
              </div>
              <div class="neo-stat-card">
                <div class="neo-stat-label">Attack</div>
                <div class="neo-stat-value">${currentChar.stats?.attack || 0}</div>
              </div>
              <div class="neo-stat-card">
                <div class="neo-stat-label">Defense</div>
                <div class="neo-stat-value">${currentChar.stats?.defense || 0}</div>
              </div>
            </div>
          </div>
        `;
      } else if (subtab === 'team') {
        const characters = gameState?.characters || {};
        return `
          <div class="neo-team-container">
            ${Object.entries(characters).map(([id, char]) => `
              <div class="neo-character-card ${id === gameState.currentCharacterId ? 'active' : ''}">
                <div class="neo-char-header">
                  <h3 class="neo-char-name">${char.name}</h3>
                  <span class="neo-char-title">${char.title || ''}</span>
                </div>
                <div class="neo-char-stats">
                  <div>Level: ${char.level || 1}</div>
                  <div>HP: ${char.stats?.hp || 0}</div>
                  <div>MP: ${char.stats?.mp || 0}</div>
                </div>
                <div class="neo-char-actions">
                  <button class="neo-btn-small" onclick="window.neoBagSystem.switchCharacter('${id}')">Select</button>
                  <button class="neo-btn-small" onclick="window.neoBagSystem.autoEquip('${id}')" style="margin-top: 8px;">⚡ Auto-Equip</button>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      } else if (subtab === 'companions') {
        return this.renderCompanionsTab('pets');
      } else if (subtab === 'cosmetics') {
        const skins = gameState?.inventory?.skins || [];
        return `
          <div class="neo-cosmetics-container">
            <h3 class="neo-section-title">Skins & Cosmetics</h3>
            <div class="neo-items-grid">
              ${skins.length === 0 ? '<div class="neo-empty">No skins unlocked</div>' : skins.map(skin => `
                <div class="neo-item-card" data-rarity="${skin.rarity || 'common'}">
                  <div class="neo-item-icon">${skin.icon || '👤'}</div>
                  <div class="neo-item-name">${skin.name}</div>
                  <div class="neo-item-status">${skin.unlocked ? 'Unlocked' : 'Locked'}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }
    }

    renderAbilitiesTab(subtab) {
      if (subtab === 'skills') {
        return this.renderSkillsTab();
      } else if (subtab === 'supernatural') {
        const powers = window.gameState?.inventory?.supernatural || [
          { id: 'power1', name: 'Telekinesis', icon: '🧠', rarity: 'rare', description: 'Move objects with your mind' },
          { id: 'power2', name: 'Time Dilation', icon: '⏱️', rarity: 'epic', description: 'Slow down time around you' },
          { id: 'power3', name: 'Energy Shield', icon: '🛡️', rarity: 'uncommon', description: 'Create a protective barrier' },
          { id: 'power4', name: 'Phase Shift', icon: '👻', rarity: 'rare', description: 'Become intangible briefly' }
        ];
        return `
          <div class="neo-supernatural-container">
            <h3 class="neo-section-title">Supernatural Powers</h3>
            <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 16px;">Unlock and master extraordinary abilities beyond normal limits.</p>
            <div class="neo-items-grid">
              ${powers.map(power => `
                <div class="neo-item-card" data-rarity="${power.rarity || 'common'}">
                  <div class="neo-item-icon">${power.icon || '🔮'}</div>
                  <div class="neo-item-name">${power.name}</div>
                  <div class="neo-item-description" style="font-size: 9px; margin-top: 8px;">${power.description || ''}</div>
                  <div style="font-size: 8px; color: rgba(255, 255, 255, 0.5); margin-top: 8px;">Rarity: ${power.rarity}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else if (subtab === 'talent') {
        const talents = window.gameState?.inventory?.talents || [
          { id: 'talent1', name: 'Combat Mastery', icon: '⚔️', tier: 1, rarity: 'common', description: 'Increase damage by 5%' },
          { id: 'talent2', name: 'Defensive Stance', icon: '🛡️', tier: 1, rarity: 'common', description: 'Reduce damage taken by 5%' },
          { id: 'talent3', name: 'Swift Movement', icon: '💨', tier: 2, rarity: 'uncommon', description: 'Increase movement speed by 10%' },
          { id: 'talent4', name: 'Critical Strike', icon: '💥', tier: 2, rarity: 'uncommon', description: 'Increase crit chance by 5%' },
          { id: 'talent5', name: 'Elemental Affinity', icon: '✨', tier: 3, rarity: 'rare', description: 'Elemental damage +15%' },
          { id: 'talent6', name: 'Regeneration', icon: '💚', tier: 3, rarity: 'rare', description: 'HP regeneration +2/sec' }
        ];
        return `
          <div class="neo-talent-container">
            <h3 class="neo-section-title">Talent Tree</h3>
            <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 16px;">Invest talent points to unlock powerful passive abilities.</p>
            <div class="neo-items-grid">
              ${talents.map(talent => `
                <div class="neo-item-card" data-rarity="${talent.rarity || 'common'}">
                  <div class="neo-item-icon">${talent.icon || '⭐'}</div>
                  <div class="neo-item-name">${talent.name}</div>
                  <div class="neo-item-tier" style="font-size: 9px; color: #ffd700; margin: 4px 0;">Tier ${talent.tier || 1}</div>
                  <div class="neo-item-description" style="font-size: 9px; margin-top: 8px;">${talent.description || ''}</div>
                  <button class="neo-btn-small" style="margin-top: 8px;" onclick="window.neoBagSystem.unlockTalent('${talent.id}')">Unlock</button>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }
    }

    renderCompanionsTab(subtab) {
      const gameState = window.gameState;
      
      if (subtab === 'pets') {
        const pets = gameState?.inventory?.pets || [];
        return `
          <div class="neo-companions-container">
            <h3 class="neo-section-title">Pets</h3>
            <div class="neo-items-grid">
              ${pets.length === 0 ? '<div class="neo-empty">No pets in inventory</div>' : pets.map(pet => `
                <div class="neo-item-card" data-rarity="${pet.rarity || 'common'}">
                  <div class="neo-item-icon">${pet.icon || '🐕'}</div>
                  <div class="neo-item-name">${pet.name}</div>
                  <div class="neo-item-level">Level ${pet.level || 1}</div>
                  <button class="neo-btn-small" onclick="window.neoBagSystem.equipCompanion('pet', '${pet.id}')">Equip</button>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else if (subtab === 'ai') {
        const robots = gameState?.inventory?.robots || [];
        return `
          <div class="neo-companions-container">
            <h3 class="neo-section-title">AI Companions</h3>
            <div class="neo-items-grid">
              ${robots.length === 0 ? '<div class="neo-empty">No AI companions in inventory</div>' : robots.map(robot => `
                <div class="neo-item-card" data-rarity="${robot.rarity || 'common'}">
                  <div class="neo-item-icon">${robot.icon || '🤖'}</div>
                  <div class="neo-item-name">${robot.name}</div>
                  <div class="neo-item-level">Level ${robot.level || 1}</div>
                  <button class="neo-btn-small" onclick="window.neoBagSystem.equipCompanion('robot', '${robot.id}')">Equip</button>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else if (subtab === 'vehicles') {
        const vehicles = gameState?.inventory?.vehicles || [];
        return `
          <div class="neo-companions-container">
            <h3 class="neo-section-title">Vehicles</h3>
            <div class="neo-items-grid">
              ${vehicles.length === 0 ? '<div class="neo-empty">No vehicles in inventory</div>' : vehicles.map(vehicle => `
                <div class="neo-item-card" data-rarity="${vehicle.rarity || 'common'}">
                  <div class="neo-item-icon">${vehicle.icon || '🚗'}</div>
                  <div class="neo-item-name">${vehicle.name}</div>
                  <div class="neo-item-level">Level ${vehicle.level || 1}</div>
                  <button class="neo-btn-small" onclick="window.neoBagSystem.equipCompanion('vehicle', '${vehicle.id}')">Equip</button>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else if (subtab === 'spirit') {
        const spirits = gameState?.inventory?.spirits || [];
        return `
          <div class="neo-companions-container">
            <h3 class="neo-section-title">Spirits</h3>
            <div class="neo-items-grid">
              ${spirits.length === 0 ? '<div class="neo-empty">No spirits in inventory</div>' : spirits.map(spirit => `
                <div class="neo-item-card" data-rarity="${spirit.rarity || 'common'}">
                  <div class="neo-item-icon">${spirit.icon || '✨'}</div>
                  <div class="neo-item-name">${spirit.name}</div>
                  <div class="neo-item-level">Level ${spirit.level || 1}</div>
                  <button class="neo-btn-small" onclick="window.neoBagSystem.equipCompanion('spirit', '${spirit.id}')">Equip</button>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }
    }

    renderQuestsTab(subtab) {
      if (subtab === 'quests') {
        const quests = window.gameState?.quests || [];
        return `
          <div class="neo-quests-container">
            ${quests.length === 0 ? '<div class="neo-empty">No active quests</div>' : quests.map(quest => `
              <div class="neo-quest-card" data-status="${quest.status}">
                <div class="neo-quest-header">
                  <h4 class="neo-quest-name">${quest.name}</h4>
                  <span class="neo-quest-status">${quest.status}</span>
                </div>
                <div class="neo-quest-description">${quest.description || ''}</div>
              </div>
            `).join('')}
          </div>
        `;
      } else if (subtab === 'missions') {
        const missions = window.NeoGameData?.MISSIONS_DB || [];
        return `
          <div class="neo-missions-container">
            ${missions.length === 0 ? '<div class="neo-empty">No missions available</div>' : missions.map(mission => `
              <div class="neo-mission-card">
                <div class="neo-mission-header">
                  <h4 class="neo-mission-name">${mission.name}</h4>
                </div>
                <div class="neo-mission-description">${mission.description || ''}</div>
                <div class="neo-mission-level">Level Required: ${mission.levelRequirement || 1}</div>
                <button class="neo-btn-small" onclick="window.neoBagSystem.startMission('${mission.id}')">Start</button>
              </div>
            `).join('')}
          </div>
        `;
      } else if (subtab === 'bestiary') {
        const bestiary = window.NeoGameData?.BESTIARY_DB || [];
        return `
          <div class="neo-bestiary-container">
            ${bestiary.length === 0 ? '<div class="neo-empty">No monsters discovered</div>' : bestiary.map(monster => `
              <div class="neo-monster-card" data-rarity="${monster.rarity || 'common'}">
                <div class="neo-monster-icon">${monster.icon || '👹'}</div>
                <div class="neo-monster-name">${monster.name}</div>
                <div class="neo-monster-level">Level ${monster.level || 1}</div>
                <div class="neo-monster-stats">
                  <div>HP: ${monster.hp || 0}</div>
                  <div>Attack: ${monster.attack || 0}</div>
                  <div>Defense: ${monster.defense || 0}</div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      } else if (subtab === 'drops') {
        const dropTables = [
          { id: 'drops1', name: 'Forest Enemies', icon: '🌲', items: ['Herb', 'Wood', 'Common Gear'], rarity: 'common' },
          { id: 'drops2', name: 'Dungeon Bosses', icon: '👹', items: ['Epic Gear', 'Rare Materials', 'Gems'], rarity: 'epic' },
          { id: 'drops3', name: 'Elite Monsters', icon: '⚔️', items: ['Rare Gear', 'Crystals', 'Essence'], rarity: 'rare' },
          { id: 'drops4', name: 'World Bosses', icon: '🐉', items: ['Legendary Gear', 'Unique Materials', 'Premium Gems'], rarity: 'legendary' }
        ];
        return `
          <div class="neo-drops-container">
            <h3 class="neo-section-title">Drop Tables</h3>
            <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 16px;">View potential loot drops from different enemy types and locations.</p>
            <div class="neo-items-grid">
              ${dropTables.map(table => `
                <div class="neo-item-card" data-rarity="${table.rarity || 'common'}">
                  <div class="neo-item-icon">${table.icon || '🎁'}</div>
                  <div class="neo-item-name">${table.name}</div>
                  <div class="neo-item-description" style="font-size: 9px; margin-top: 8px;">
                    Possible Drops:<br>
                    ${table.items.map(item => `• ${item}`).join('<br>')}
                  </div>
                  <div style="font-size: 8px; color: rgba(255, 255, 255, 0.5); margin-top: 8px;">Rarity: ${table.rarity}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else if (subtab === 'map') {
        const locations = [
          { id: 'loc1', name: 'Starting Village', icon: '🏘️', level: '1-5', status: 'unlocked', description: 'A peaceful starting area' },
          { id: 'loc2', name: 'Dark Forest', icon: '🌲', level: '6-10', status: 'unlocked', description: 'Dangerous woodland' },
          { id: 'loc3', name: 'Mountain Pass', icon: '⛰️', level: '11-15', status: 'locked', description: 'High altitude challenge' },
          { id: 'loc4', name: 'Ancient Ruins', icon: '🏛️', level: '16-20', status: 'locked', description: 'Mysterious ancient site' },
          { id: 'loc5', name: 'Dragon Lair', icon: '🐉', level: '21+', status: 'locked', description: 'Ultimate challenge area' }
        ];
        return `
          <div class="neo-map-container">
            <h3 class="neo-section-title">World Map</h3>
            <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 16px;">Explore different locations and unlock new areas as you progress.</p>
            <div class="neo-items-grid">
              ${locations.map(loc => `
                <div class="neo-item-card" style="opacity: ${loc.status === 'locked' ? '0.6' : '1'};">
                  <div class="neo-item-icon">${loc.icon || '🗺️'}</div>
                  <div class="neo-item-name">${loc.name}</div>
                  <div style="font-size: 9px; color: #ffd700; margin: 4px 0;">Level: ${loc.level}</div>
                  <div class="neo-item-description" style="font-size: 9px; margin-top: 8px;">${loc.description || ''}</div>
                  <div style="font-size: 8px; color: ${loc.status === 'locked' ? '#ff4444' : '#38ef7d'}; margin-top: 8px;">
                    ${loc.status === 'locked' ? '🔒 Locked' : '✓ Unlocked'}
                  </div>
                  ${loc.status === 'unlocked' ? `<button class="neo-btn-small" style="margin-top: 8px;" onclick="window.neoBagSystem.travelTo('${loc.id}')">Travel</button>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }
    }

    renderSkillsTab() {
      const gameState = window.gameState;
      const allSkills = window.NeoGameData?.skills || [];
      
      // Character info - IDs must match characterId in skills data
      const characters = [
        { id: 'A1', name: 'A1', icon: '⚔️', color: '#ff6b6b' },
        { id: 'MISSY', name: 'Missy', icon: '🐱', color: '#a78bfa' },
        { id: 'UNIQUE', name: 'Unique', icon: '🤖', color: '#00e5ff' }
      ];
      
      // Skill slots
      const skillSlots = ['S1', 'S2', 'S3'];
      
      // Initialize equipped skills structure
      if (!gameState.equippedSkills) {
        gameState.equippedSkills = {};
      }
      
      const renderCharacterSkillBox = (char) => {
        // Filter skills for this character that can be equipped to S1-S3 (slot <= 3 or X/X1/X2)
        const charSkills = allSkills.filter(s => {
          if (s.characterId !== char.id) return false;
          // Only show skills that can be equipped to quick slots
          return s.slot <= 3 || s.slot === 'X' || s.slot === 'X1' || s.slot === 'X2';
        });
        const equippedSkills = gameState.equippedSkills[char.id] || {};
        
        return `
          <div class="neo-character-skill-box" style="background: rgba(0, 0, 0, 0.4); border: 2px solid ${char.color}40; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <span style="font-size: 20px;">${char.icon}</span>
              <h3 style="margin: 0; color: ${char.color}; font-size: 14px; font-weight: 700;">${char.name}</h3>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">
              ${skillSlots.map(slot => {
                const equippedSkill = equippedSkills[slot];
                
                return `
                  <div class="neo-skill-slot-box" 
                       onclick="${equippedSkill ? `window.neoBagSystem.unequipSkill('${char.id}', '${slot}')` : ''}"
                       style="background: ${equippedSkill ? `linear-gradient(135deg, ${char.color}40, ${char.color}20)` : 'rgba(255, 255, 255, 0.05)'};
                              border: 2px solid ${equippedSkill ? char.color : 'rgba(255, 255, 255, 0.2)'};
                              border-radius: 6px; padding: 8px; ${equippedSkill ? 'cursor: pointer;' : ''} min-height: 60px;
                              display: flex; flex-direction: column; align-items: center; justify-content: center;
                              transition: all 0.2s;">
                    <div style="font-size: 8px; color: rgba(255, 255, 255, 0.5); margin-bottom: 4px;">${slot}</div>
                    ${equippedSkill ? `
                      <div style="font-size: 18px; margin-bottom: 4px;">${equippedSkill.icon || '⚡'}</div>
                      <div style="font-size: 9px; color: ${char.color}; font-weight: 600; text-align: center;">${equippedSkill.name}</div>
                      <div style="font-size: 7px; color: rgba(255, 255, 255, 0.5); margin-top: 4px;">Click to remove</div>
                    ` : `
                      <div style="font-size: 20px; opacity: 0.3;">+</div>
                      <div style="font-size: 8px; color: rgba(255, 255, 255, 0.4);">Empty</div>
                    `}
                  </div>
                `;
              }).join('')}
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px;">
              ${charSkills.length === 0 ? '<div class="neo-empty" style="grid-column: 1 / -1;">No skills available</div>' : charSkills.map(skill => {
                const equippedSlot = skillSlots.find(slot => equippedSkills[slot]?.id === skill.id);
                const isEquipped = !!equippedSlot;
                return `
                  <div class="neo-skill-card" data-tier="${skill.tier || 'common'}" 
                       onclick="window.neoBagSystem.equipSkillToNextSlot('${char.id}', '${skill.id}')"
                       style="opacity: ${isEquipped ? '0.6' : '1'}; cursor: pointer; transition: all 0.2s;"
                       onmouseover="${!isEquipped ? "this.style.transform='scale(1.05)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.3)';" : ''}"
                       onmouseout="${!isEquipped ? "this.style.transform='scale(1)'; this.style.boxShadow='none';" : ''}">
                    <div class="neo-skill-icon">${skill.icon || '⚡'}</div>
                    <div class="neo-skill-name">${skill.name}</div>
                    <div class="neo-skill-slot">Slot ${typeof skill.slot === 'number' ? skill.slot : skill.slot}</div>
                    <div class="neo-skill-info">
                      <div>DMG: ${skill.baseDamage || skill.damage || 0}</div>
                      <div>CD: ${skill.cooldown || 0}s</div>
                    </div>
                    ${isEquipped ? `<div style="font-size: 8px; color: #38ef7d; margin-top: 8px;">✓ Equipped in ${equippedSlot}</div>` : '<div style="font-size: 8px; color: rgba(255, 255, 255, 0.6); margin-top: 8px;">Click to equip</div>'}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      };
      
      return `
        <div class="neo-skills-container">
          <h3 class="neo-section-title">Skill Management</h3>
          ${characters.map(char => renderCharacterSkillBox(char)).join('')}
        </div>
      `;
    }
    
    equipSkillToNextSlot(charId, skillId) {
      const gameState = window.gameState;
      const skill = (window.NeoGameData?.skills || []).find(s => s.id === skillId);
      if (!skill) {
        this.showToast('Skill not found', 'error');
        return;
      }
      
      // Only allow equipping skills with slot <= 3 to S1-S3 slots
      if (skill.slot > 3 && skill.slot !== 'X' && skill.slot !== 'X1' && skill.slot !== 'X2') {
        this.showToast('This skill cannot be equipped to quick slots (S1-S3)', 'info');
        return;
      }
      
      if (!gameState.equippedSkills) {
        gameState.equippedSkills = {};
      }
      if (!gameState.equippedSkills[charId]) {
        gameState.equippedSkills[charId] = {};
      }
      
      const equippedSkills = gameState.equippedSkills[charId];
      const skillSlots = ['S1', 'S2', 'S3'];
      
      // Check if already equipped
      const currentSlot = skillSlots.find(slot => equippedSkills[slot]?.id === skillId);
      if (currentSlot) {
        this.showToast(`${skill.name} is already equipped in ${currentSlot}`, 'info');
        return;
      }
      
      // Find first empty slot or replace the first slot
      let targetSlot = skillSlots.find(slot => !equippedSkills[slot]);
      if (!targetSlot) {
        // All slots full, replace S1
        targetSlot = 'S1';
      }
      
      equippedSkills[targetSlot] = skill;
      this.showToast(`Equipped ${skill.name} to ${charId} - ${targetSlot}`);
      this.renderActiveTab();
    }
    
    unequipSkill(charId, slot) {
      const gameState = window.gameState;
      if (!gameState.equippedSkills || !gameState.equippedSkills[charId]) {
        return;
      }
      
      const skill = gameState.equippedSkills[charId][slot];
      if (skill) {
        delete gameState.equippedSkills[charId][slot];
        this.showToast(`Unequipped ${skill.name} from ${slot}`);
        this.renderActiveTab();
      }
    }

    renderAlchemyTab() {
      const recipes = [
        { id: 'recipe1', name: 'Health Potion', icon: '🧪', ingredients: ['Herb', 'Water'], result: 'Health Potion', cost: 50 },
        { id: 'recipe2', name: 'Mana Potion', icon: '💧', ingredients: ['Crystal', 'Water'], result: 'Mana Potion', cost: 50 },
        { id: 'recipe3', name: 'Strength Elixir', icon: '⚗️', ingredients: ['Herb', 'Crystal', 'Essence'], result: 'Strength Elixir', cost: 150 },
        { id: 'recipe4', name: 'Speed Potion', icon: '💨', ingredients: ['Herb', 'Essence'], result: 'Speed Potion', cost: 100 }
      ];
      
      return `
        <div class="neo-alchemy-container">
          <h3 class="neo-section-title">Alchemy Lab</h3>
          <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 16px;">Combine materials to create powerful consumables and enhancements.</p>
          <div class="neo-items-grid">
            ${recipes.map(recipe => `
              <div class="neo-item-card" data-rarity="common">
                <div class="neo-item-icon">${recipe.icon}</div>
                <div class="neo-item-name">${recipe.name}</div>
                <div class="neo-item-description" style="font-size: 9px; margin: 8px 0;">
                  Ingredients: ${recipe.ingredients.join(', ')}
                </div>
                <div style="font-size: 10px; color: #ffd700; margin-bottom: 8px;">Cost: ${recipe.cost} gold</div>
                <button class="neo-btn-small" onclick="window.neoBagSystem.craftItem('${recipe.id}')">Craft</button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    craftItem(recipeId) {
      this.showToast('Crafting system coming soon!', 'info');
    }

    renderShopTab() {
      const shopItems = window.NeoGameData?.SHOP_ITEMS_DB || [];
      return `
        <div class="neo-shop-container">
          <h3 class="neo-section-title">Shop</h3>
          <div class="neo-shop-grid">
            ${shopItems.length === 0 ? '<div class="neo-empty">Shop is empty</div>' : shopItems.map(item => `
              <div class="neo-shop-item" data-category="${item.category}">
                <div class="neo-shop-icon">${item.icon || '📦'}</div>
                <div class="neo-shop-name">${item.name}</div>
                <div class="neo-shop-price">
                  <span class="neo-price-icon">${item.currency === 'gems' ? '💎' : '💰'}</span>
                  <span class="neo-price-value">${item.cost}</span>
                </div>
                <button class="neo-btn-small" onclick="window.neoBagSystem.buyItem('${item.id}')">Buy</button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ACTIONS
    // ═══════════════════════════════════════════════════════════════════════════
    useItem(itemId) {
      const gameState = window.gameState;
      const item = gameState?.inventory?.items?.find(i => i.id === itemId);
      if (!item) return;
      this.showToast(`Used ${item.name}`);
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        gameState.inventory.items = gameState.inventory.items.filter(i => i.id !== itemId);
      }
      this.renderActiveTab();
    }

    equipGear(gearId) {
      const gameState = window.gameState;
      const gear = gameState?.inventory?.gear?.find(g => g.id === gearId);
      if (!gear) return;
      
      const charId = gameState.currentCharacterId || 'A1';
      const slot = gear.slot;
      
      if (!gameState.equipped[charId]) {
        gameState.equipped[charId] = {};
      }
      
      gameState.equipped[charId][slot] = gear;
      this.showToast(`Equipped ${gear.name}`);
      this.renderActiveTab();
    }

    equipCompanion(type, id) {
      const gameState = window.gameState;
      let companion = null;
      
      if (type === 'pet') {
        companion = gameState?.inventory?.pets?.find(p => p.id === id);
      } else if (type === 'vehicle') {
        companion = gameState?.inventory?.vehicles?.find(v => v.id === id);
      } else if (type === 'robot') {
        companion = gameState?.inventory?.robots?.find(r => r.id === id);
      } else if (type === 'spirit') {
        companion = gameState?.inventory?.spirits?.find(s => s.id === id);
      }
      
      if (!companion) return;
      
      const charId = gameState.currentCharacterId || 'A1';
      if (!gameState.equipped[charId]) {
        gameState.equipped[charId] = {};
      }
      
      gameState.equipped[charId][type] = companion;
      this.showToast(`Equipped ${companion.name}`);
      this.renderActiveTab();
    }

    equipSkill(charId, skillId, slot) {
      const skill = (window.NeoGameData?.skills || []).find(s => s.id === skillId);
      if (!skill) {
        this.showToast('Skill not found', 'error');
        return;
      }
      
      const gameState = window.gameState;
      if (!gameState.equippedSkills) {
        gameState.equippedSkills = {};
      }
      if (!gameState.equippedSkills[charId]) {
        gameState.equippedSkills[charId] = {};
      }
      
      // Handle slot parameter - can be 'S1', 'S2', 'S3' or just a number
      let slotKey = slot;
      if (typeof slot === 'string' && slot.startsWith('S')) {
        slotKey = slot;
      } else if (typeof slot === 'number') {
        slotKey = slot <= 3 ? `S${slot}` : slot;
      } else if (typeof slot === 'string' && !isNaN(parseInt(slot))) {
        const slotNum = parseInt(slot);
        slotKey = slotNum <= 3 ? `S${slotNum}` : slot;
      }
      
      gameState.equippedSkills[charId][slotKey] = skill;
      this.showToast(`Equipped ${skill.name} to ${charId} - ${slotKey}`);
      this.renderActiveTab();
    }

    switchCharacter(charId) {
      const gameState = window.gameState;
      gameState.currentCharacterId = charId;
      this.showToast(`Switched to ${charId}`);
      this.renderActiveTab();
    }

    buyItem(itemId) {
      const shopItem = window.NeoGameData?.SHOP_ITEMS_DB?.find(i => i.id === itemId);
      if (!shopItem) return;
      
      const gameState = window.gameState;
      const currency = shopItem.currency || 'gold';
      const cost = shopItem.cost || 0;
      const current = gameState[currency] || 0;
      
      if (current < cost) {
        this.showToast(`Not enough ${currency}!`, 'error');
        return;
      }
      
      gameState[currency] -= cost;
      
      const existing = gameState.inventory.items.find(i => i.id === itemId);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        gameState.inventory.items.push({
          id: itemId,
          name: shopItem.name,
          icon: shopItem.icon,
          category: shopItem.category,
          quantity: 1,
          rarity: shopItem.rarity || 'common'
        });
      }
      
      this.showToast(`Bought ${shopItem.name}`);
      this.updateCurrencies();
      this.renderActiveTab();
    }

    startMission(missionId) {
      const mission = window.NeoGameData?.MISSIONS_DB?.find(m => m.id === missionId);
      if (!mission) return;
      this.showToast(`Starting mission: ${mission.name}`);
    }
    
    unlockTalent(talentId) {
      const gameState = window.gameState;
      if (!gameState.inventory.talents) {
        gameState.inventory.talents = [];
      }
      const talent = gameState.inventory.talents.find(t => t.id === talentId);
      if (talent) {
        this.showToast('Talent already unlocked!', 'info');
        return;
      }
      // Add talent to inventory
      gameState.inventory.talents.push({ id: talentId, unlocked: true });
      this.showToast('Talent unlocked!', 'success');
      this.renderActiveTab();
    }
    
    travelTo(locationId) {
      const gameState = window.gameState;
      gameState.currentLocation = locationId;
      this.showToast(`Traveling to location...`, 'info');
      this.renderActiveTab();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // AUTO-EQUIP SYSTEM
    // ═══════════════════════════════════════════════════════════════════════════
    calculateItemPower(item) {
      if (!item || !item.baseStats) return 0;
      const stats = item.baseStats;
      let power = 0;
      power += (stats.attack || 0) * 2;
      power += (stats.defense || 0) * 1.5;
      power += (stats.hp || 0) * 0.1;
      power += (stats.mp || 0) * 0.15;
      power += (stats.critRate || 0) * 100;
      power += (stats.critDamage || 0) * 50;
      power += (stats.speed || 0) * 200;
      power += (stats.cooldownReduction || 0) * 300;
      power += (stats.armorPen || 0) * 150;
      power += (stats.block || 0) * 200;
      power += (stats.evade || 0) * 250;
      
      // Rarity multiplier
      const rarityMultiplier = {
        common: 1.0,
        uncommon: 1.3,
        rare: 1.6,
        epic: 2.0,
        legendary: 2.5
      };
      power *= (rarityMultiplier[item.rarity] || 1.0);
      
      // Upgrade level bonus
      if (item.upgradeLevel) {
        power *= (1 + item.upgradeLevel * 0.1);
      }
      
      return Math.round(power);
    }

    autoEquip(charId = null) {
      const gameState = window.gameState;
      const targetCharId = charId || gameState.currentCharacterId || 'A1';
      const equipped = gameState.equipped[targetCharId] || {};
      const inventory = gameState.inventory.gear || [];
      
      let equippedCount = 0;
      const slots = ['weapon', 'offhand', 'head', 'chest', 'gloves', 'pants', 'boots', 'ring1', 'ring2', 'necklace'];
      
      for (const slot of slots) {
        const slotKey = slot.startsWith('ring') ? 'ring' : slot;
        const availableGear = inventory.filter(g => {
          if (g.locked) return false;
          const gearSlot = g.slot || '';
          if (slotKey === 'ring' && (gearSlot === 'ring' || gearSlot === 'ring1' || gearSlot === 'ring2')) return true;
          return gearSlot === slotKey;
        });
        
        if (availableGear.length === 0) continue;
        
        // Calculate power for each item
        const gearWithPower = availableGear.map(g => ({
          gear: g,
          power: this.calculateItemPower(g)
        }));
        
        // Sort by power (highest first)
        gearWithPower.sort((a, b) => b.power - a.power);
        const bestGear = gearWithPower[0].gear;
        
        // Compare with currently equipped
        const currentEquipped = equipped[slot];
        const currentPower = currentEquipped ? this.calculateItemPower(currentEquipped) : 0;
        const bestPower = gearWithPower[0].power;
        
        if (bestPower > currentPower) {
          // Unequip current item if exists
          if (currentEquipped) {
            inventory.push(currentEquipped);
          }
          
          // Equip best item
          equipped[slot] = bestGear;
          const index = inventory.findIndex(g => g.id === bestGear.id);
          if (index !== -1) {
            inventory.splice(index, 1);
          }
          equippedCount++;
        }
      }
      
      // Auto-equip companions
      const companions = ['pets', 'vehicles', 'robots', 'spirits'];
      for (const compType of companions) {
        const compInventory = gameState.inventory[compType] || [];
        if (compInventory.length > 0) {
          const bestCompanion = compInventory.reduce((best, current) => {
            const bestPower = this.calculateItemPower(best);
            const currentPower = this.calculateItemPower(current);
            return currentPower > bestPower ? current : best;
          });
          
          if (!equipped[compType] || this.calculateItemPower(bestCompanion) > this.calculateItemPower(equipped[compType])) {
            if (equipped[compType]) {
              compInventory.push(equipped[compType]);
            }
            equipped[compType] = bestCompanion;
            const index = compInventory.findIndex(c => c.id === bestCompanion.id);
            if (index !== -1) {
              compInventory.splice(index, 1);
            }
          }
        }
      }
      
      // Auto-equip skills
      const skills = window.NeoGameData?.skills?.filter(s => s.characterId === targetCharId) || [];
      const equippedSkills = gameState.equippedSkills[targetCharId] || {};
      const skillSlots = ['S1', 'S2', 'S3'];
      
      for (const slot of skillSlots) {
        if (!equippedSkills[slot]) {
          const availableSkills = skills.filter(s => s.slot <= 3 && s.unlockLevel <= (gameState.characters[targetCharId]?.level || 1));
          if (availableSkills.length > 0) {
            const bestSkill = availableSkills[0];
            equippedSkills[slot] = bestSkill;
          }
        }
      }
      
      gameState.equipped[targetCharId] = equipped;
      gameState.equippedSkills[targetCharId] = equippedSkills;
      
      this.showToast(`Auto-equipped ${equippedCount} items for ${targetCharId}`, 'info');
      this.renderActiveTab();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ITEM ACTIONS
    // ═══════════════════════════════════════════════════════════════════════════
    useItem(itemId) {
      const gameState = window.gameState;
      const item = gameState.inventory.items.find(i => i.id === itemId);
      if (!item) {
        this.showToast('Item not found', 'error');
        return;
      }
      
      if (item.locked) {
        this.showToast('Cannot use locked item', 'error');
        return;
      }
      
      if (item.category !== 'consumable') {
        this.showToast('This item cannot be used', 'error');
        return;
      }
      
      // Apply effects
      if (item.effect) {
        const char = gameState.characters[gameState.currentCharacterId || 'A1'];
        if (!char.stats) char.stats = {};
        
        if (item.effect.hp) {
          char.stats.hp = (char.stats.hp || 0) + item.effect.hp;
          this.showToast(`Restored ${item.effect.hp} HP`);
        }
        if (item.effect.mp) {
          char.stats.mp = (char.stats.mp || 0) + item.effect.mp;
          this.showToast(`Restored ${item.effect.mp} MP`);
        }
        if (item.effect.speed) {
          this.showToast(`Speed increased by ${item.effect.speed * 100}%`);
        }
      }
      
      // Remove item
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        gameState.inventory.items = gameState.inventory.items.filter(i => i.id !== itemId);
      }
      
      this.renderActiveTab();
    }

    sellItem(itemId, quantity = 1) {
      const gameState = window.gameState;
      let item = gameState.inventory.items.find(i => i.id === itemId);
      let isGear = false;
      
      if (!item) {
        item = gameState.inventory.gear.find(g => g.id === itemId);
        isGear = true;
      }
      
      if (!item) {
        this.showToast('Item not found', 'error');
        return;
      }
      
      if (item.locked) {
        this.showToast('Cannot sell locked item', 'error');
        return;
      }
      
      // Confirmation
      if (!confirm(`Sell ${item.name} for ${(item.price || 0) * quantity} gold?`)) {
        return;
      }
      
      const sellPrice = (item.price || 0) * quantity;
      gameState.gold = (gameState.gold || 0) + sellPrice;
      
      if (isGear) {
        if (item.quantity > quantity) {
          item.quantity -= quantity;
        } else {
          gameState.inventory.gear = gameState.inventory.gear.filter(g => g.id !== itemId);
        }
      } else {
        if (item.quantity > quantity) {
          item.quantity -= quantity;
        } else {
          gameState.inventory.items = gameState.inventory.items.filter(i => i.id !== itemId);
        }
      }
      
      this.showToast(`Sold ${item.name} for ${sellPrice} gold`);
      this.updateCurrencies();
      this.renderActiveTab();
    }

    upgradeGear(gearId) {
      const gameState = window.gameState;
      const gear = gameState.inventory.gear.find(g => g.id === gearId);
      
      if (!gear) {
        const equipped = gameState.equipped[gameState.currentCharacterId || 'A1'] || {};
        const slot = Object.keys(equipped).find(s => equipped[s]?.id === gearId);
        if (slot) {
          gear = equipped[slot];
        }
      }
      
      if (!gear) {
        this.showToast('Gear not found', 'error');
        return;
      }
      
      if (gear.locked) {
        this.showToast('Cannot upgrade locked item', 'error');
        return;
      }
      
      const currentLevel = gear.upgradeLevel || 0;
      const upgradeCost = Math.floor((currentLevel + 1) * 100 * (gear.rarity === 'epic' ? 2 : gear.rarity === 'rare' ? 1.5 : 1));
      
      if (gameState.gold < upgradeCost) {
        this.showToast(`Not enough gold! Need ${upgradeCost}`, 'error');
        return;
      }
      
      gameState.gold -= upgradeCost;
      gear.upgradeLevel = (gear.upgradeLevel || 0) + 1;
      
      // Increase stats
      if (gear.baseStats) {
        Object.keys(gear.baseStats).forEach(stat => {
          if (typeof gear.baseStats[stat] === 'number') {
            gear.baseStats[stat] = Math.floor(gear.baseStats[stat] * 1.1);
          }
        });
      }
      
      this.showToast(`${gear.name} upgraded to +${gear.upgradeLevel}`);
      this.updateCurrencies();
      this.renderActiveTab();
    }

    enhanceGear(gearId, enhancementType = 'attack') {
      const gameState = window.gameState;
      const gear = gameState.inventory.gear.find(g => g.id === gearId);
      
      if (!gear) {
        this.showToast('Gear not found', 'error');
        return;
      }
      
      if (gear.locked) {
        this.showToast('Cannot enhance locked item', 'error');
        return;
      }
      
      const enhanceCost = 500;
      if (gameState.gold < enhanceCost) {
        this.showToast(`Not enough gold! Need ${enhanceCost}`, 'error');
        return;
      }
      
      gameState.gold -= enhanceCost;
      
      if (!gear.enhancements) {
        gear.enhancements = {};
      }
      
      const enhancementBonus = {
        attack: 10,
        defense: 8,
        critRate: 0.02,
        critDamage: 0.05
      };
      
      gear.enhancements[enhancementType] = (gear.enhancements[enhancementType] || 0) + enhancementBonus[enhancementType];
      
      this.showToast(`${gear.name} enhanced with +${enhancementBonus[enhancementType]} ${enhancementType}`);
      this.updateCurrencies();
      this.renderActiveTab();
    }

    lockItem(itemId) {
      const gameState = window.gameState;
      let item = gameState.inventory.items.find(i => i.id === itemId);
      let isGear = false;
      
      if (!item) {
        item = gameState.inventory.gear.find(g => g.id === itemId);
        isGear = true;
      }
      
      if (!item) {
        // Check equipped items
        const equipped = gameState.equipped[gameState.currentCharacterId || 'A1'] || {};
        const slot = Object.keys(equipped).find(s => equipped[s]?.id === itemId);
        if (slot) {
          item = equipped[slot];
        }
      }
      
      if (!item) {
        this.showToast('Item not found', 'error');
        return;
      }
      
      item.locked = !item.locked;
      this.showToast(`${item.name} ${item.locked ? 'locked' : 'unlocked'}`);
      this.renderActiveTab();
    }

    sortInventory(sortBy = 'name') {
      const gameState = window.gameState;
      const sortFunctions = {
        name: (a, b) => (a.name || '').localeCompare(b.name || ''),
        rarity: (a, b) => {
          const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
          return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
        },
        power: (a, b) => this.calculateItemPower(b) - this.calculateItemPower(a),
        type: (a, b) => (a.category || '').localeCompare(b.category || ''),
        quantity: (a, b) => (b.quantity || 0) - (a.quantity || 0)
      };
      
      const sortFn = sortFunctions[sortBy] || sortFunctions.name;
      
      if (gameState.inventory.items) {
        gameState.inventory.items.sort(sortFn);
      }
      if (gameState.inventory.gear) {
        gameState.inventory.gear.sort(sortFn);
      }
      
      this.state.sortBy = sortBy;
      this.showToast(`Sorted by ${sortBy}`);
      this.renderActiveTab();
    }

    filterInventory(filterBy = 'all') {
      this.state.filterBy = filterBy;
      this.showToast(`Filtered by ${filterBy}`);
      this.renderActiveTab();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITIES
    // ═══════════════════════════════════════════════════════════════════════════
    updateCurrencies() {
      const gameState = window.gameState;
      const gold = gameState?.gold || 0;
      const gems = gameState?.gems || 0;
      const keys = gameState?.keys || 0;
      
      const goldEl = document.getElementById('neoGoldValue');
      const gemsEl = document.getElementById('neoGemsValue');
      const keysEl = document.getElementById('neoKeysValue');
      
      if (goldEl) goldEl.textContent = gold.toLocaleString();
      if (gemsEl) gemsEl.textContent = gems.toLocaleString();
      if (keysEl) keysEl.textContent = keys.toLocaleString();
    }

    showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `neo-toast neo-toast-${type}`;
      toast.textContent = message;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('show');
      }, 10);
      
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    open() {
      this.state.isOpen = true;
      const window = document.getElementById('neoBagWindow');
      if (window) {
        window.classList.add('open');
      }
      this.updateCurrencies();
      this.renderActiveTab();
    }

    close() {
      this.state.isOpen = false;
      const window = document.getElementById('neoBagWindow');
      if (window) {
        window.classList.remove('open');
      }
    }

    toggle() {
      if (this.state.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    minimize() {
      this.state.isMinimized = !this.state.isMinimized;
      const window = document.getElementById('neoBagWindow');
      if (window) {
        window.classList.toggle('minimized', this.state.isMinimized);
      }
    }

    maximize() {
      this.state.isMaximized = !this.state.isMaximized;
      const window = document.getElementById('neoBagWindow');
      if (window) {
        window.classList.toggle('maximized', this.state.isMaximized);
      }
    }

    attachEvents() {
      // Window controls
      const minimizeBtn = document.getElementById('neoMinimizeBtn');
      const maximizeBtn = document.getElementById('neoMaximizeBtn');
      const closeBtn = document.getElementById('neoCloseBtn');

      if (minimizeBtn) minimizeBtn.addEventListener('click', () => this.minimize());
      if (maximizeBtn) maximizeBtn.addEventListener('click', () => this.maximize());
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());

      // ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.state.isOpen) {
          this.close();
        } else if ((e.key === 'b' || e.key === 'B') && !e.ctrlKey && !e.metaKey) {
          this.toggle();
        }
      });
    }
  }

  // Export
  window.NeoBagSystem = NeoBagSystem;
  window.neoBagSystem = null; // Will be set in index.html
  console.log('✅ EpicFantasyBagSystem class loaded');
})();
