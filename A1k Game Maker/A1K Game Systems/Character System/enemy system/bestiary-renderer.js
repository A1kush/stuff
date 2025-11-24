/**
 * Bestiary Renderer
 * Renders the Enemy Bestiary tab with all enemies, bosses, zombies, and villains
 */

(function() {
  'use strict';

  console.log('[BestiaryRenderer] Loading bestiary renderer...');

  window.BestiaryRenderer = {
    currentSection: 'enemies',
    expandedEnemy: null,

    // Main render function for the Bestiary tab
    renderBestiaryTab() {
      const pane = document.getElementById('bagContentPane');
      if (!pane) return;

      const html = `
        <div class="bestiary-container">
          <!-- Section Navigation -->
          <div class="bestiary-section-tabs">
            <button class="bestiary-tab ${this.currentSection === 'enemies' ? 'active' : ''}" data-section="enemies">
              <span class="tab-icon">👾</span>
              <span class="tab-label">Enemies (${this.getEnemyCount('enemies')})</span>
            </button>
            <button class="bestiary-tab ${this.currentSection === 'bosses' ? 'active' : ''}" data-section="bosses">
              <span class="tab-icon">👑</span>
              <span class="tab-label">Bosses (${this.getEnemyCount('bosses')})</span>
            </button>
            <button class="bestiary-tab ${this.currentSection === 'zombies' ? 'active' : ''}" data-section="zombies">
              <span class="tab-icon">🧟</span>
              <span class="tab-label">Zombies (${this.getEnemyCount('zombies')})</span>
            </button>
            <button class="bestiary-tab ${this.currentSection === 'villains' ? 'active' : ''}" data-section="villains">
              <span class="tab-icon">😈</span>
              <span class="tab-label">Villains (${this.getEnemyCount('villains')})</span>
            </button>
          </div>

          <!-- Filter Bar -->
          <div class="bestiary-filters">
            <input type="text" class="bestiary-search" placeholder="Search enemies..." id="bestiarySearch">
            <select class="bestiary-filter-tier" id="bestiaryFilterTier">
              <option value="">All Tiers</option>
              <option value="C">C Rank</option>
              <option value="B">B Rank</option>
              <option value="A">A Rank</option>
              <option value="S">S Rank</option>
              <option value="SS">SS Rank</option>
              <option value="SSS">SSS Rank</option>
            </select>
            <select class="bestiary-filter-element" id="bestiaryFilterElement">
              <option value="">All Elements</option>
              <option value="fire">Fire</option>
              <option value="ice">Ice</option>
              <option value="lightning">Lightning</option>
              <option value="nature">Nature</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>

          <!-- Content Sections -->
          <div class="bestiary-content">
            ${this.renderCurrentSection()}
          </div>
        </div>
      `;

      pane.innerHTML = html;
      this.attachEventListeners();
    },

    // Get enemy count for section
    getEnemyCount(section) {
      if (!window.EnemyDatabase) return 0;
      switch(section) {
        case 'enemies': return Object.keys(window.EnemyDatabase.enemies || {}).length;
        case 'bosses': return Object.keys(window.EnemyDatabase.bosses || {}).length;
        case 'zombies': return Object.keys(window.EnemyDatabase.zombies || {}).length;
        case 'villains': return Object.keys(window.EnemyDatabase.villains || {}).length;
        default: return 0;
      }
    },

    // Render the currently active section
    renderCurrentSection() {
      if (!window.EnemyDatabase) {
        return '<div class="bestiary-loading">Loading enemy data...</div>';
      }

      switch(this.currentSection) {
        case 'enemies':
          return this.renderEnemySection();
        case 'bosses':
          return this.renderBossSection();
        case 'zombies':
          return this.renderZombieSection();
        case 'villains':
          return this.renderVillainSection();
        default:
          return '<div>Section not found</div>';
      }
    },

    // Render basic enemies section
    renderEnemySection() {
      const enemies = window.EnemyDatabase.getAllEnemies();
      if (enemies.length === 0) {
        return '<div class="bestiary-empty">No enemies loaded. Make sure enemy-data-loader.js is loaded.</div>';
      }

      let html = `
        <div class="bestiary-section-header">
          <h3>Basic Enemies</h3>
          <p>Common enemies you'll encounter throughout your journey</p>
        </div>
        <div class="enemy-grid">
      `;

      enemies.forEach(enemy => {
        html += this.renderEnemyCard(enemy);
      });

      html += '</div>';
      return html;
    },

    // Render bosses section
    renderBossSection() {
      const bosses = window.EnemyDatabase.getAllBosses();
      if (bosses.length === 0) {
        return '<div class="bestiary-empty">No bosses loaded.</div>';
      }

      let html = `
        <div class="bestiary-section-header">
          <h3>Stage Bosses</h3>
          <p>Powerful bosses that guard each stage</p>
        </div>
        <div class="enemy-grid">
      `;

      bosses.forEach(boss => {
        html += this.renderBossCard(boss);
      });

      html += '</div>';
      return html;
    },

    // Render zombies section
    renderZombieSection() {
      const zombies = window.EnemyDatabase.getAllZombies();
      if (zombies.length === 0) {
        return '<div class="bestiary-empty">No zombies loaded.</div>';
      }

      let html = `
        <div class="bestiary-section-header">
          <h3>Zombie Horde</h3>
          <p>Undead creatures with infection mechanics</p>
        </div>
        <div class="enemy-grid">
      `;

      zombies.forEach(zombie => {
        html += this.renderEnemyCard(zombie, 'zombie');
      });

      html += '</div>';
      return html;
    },

    // Render villains section
    renderVillainSection() {
      const villains = window.EnemyDatabase.getAllVillains();
      if (villains.length === 0) {
        return '<div class="bestiary-empty">No villains loaded.</div>';
      }

      let html = `
        <div class="bestiary-section-header">
          <h3>Named Villains</h3>
          <p>Elite enemies with unique abilities and multi-phase battles</p>
        </div>
        <div class="enemy-grid">
      `;

      villains.forEach(villain => {
        html += this.renderVillainCard(villain);
      });

      html += '</div>';
      return html;
    },

    // Render a single enemy card
    renderEnemyCard(enemy, type = 'enemy') {
      const isEncountered = this.isEncountered(enemy.id);
      const isDefeated = this.isDefeated(enemy.id);
      const spriteUrl = isEncountered && window.EnemySpriteRenderer ? 
        window.EnemySpriteRenderer.generateSprite(enemy, 64) : null;

      return `
        <div class="enemy-card ${isDefeated ? 'defeated' : ''} ${!isEncountered ? 'unseen' : ''}" 
             data-enemy-id="${enemy.id}" 
             data-tier="${enemy.tier || 'C'}" 
             data-element="${enemy.element || 'neutral'}">
          <div class="enemy-card-header" onclick="window.BestiaryRenderer.toggleExpand('${enemy.id}')">
            <div class="enemy-sprite-container">
              ${spriteUrl ? 
                `<img src="${spriteUrl}" class="enemy-sprite" alt="${enemy.name}">` : 
                `<div class="enemy-sprite-placeholder">${!isEncountered ? '???' : '👾'}</div>`
              }
              ${isDefeated ? '<span class="defeated-badge">✓</span>' : ''}
            </div>
            <div class="enemy-info">
              <h4>${isEncountered ? enemy.name : '???'}</h4>
              <div class="enemy-badges">
                <span class="tier-badge tier-${enemy.tier || 'C'}">${enemy.tier || 'C'}</span>
                <span class="element-badge element-${enemy.element || 'neutral'}">${this.getElementIcon(enemy.element)}</span>
              </div>
            </div>
          </div>
          ${this.expandedEnemy === enemy.id ? this.renderEnemyDetails(enemy, isEncountered) : ''}
        </div>
      `;
    },

    // Render boss card (similar but with phase info)
    renderBossCard(boss) {
      const isEncountered = this.isEncountered(boss.id);
      const isDefeated = this.isDefeated(boss.id);
      const spriteUrl = isEncountered && window.EnemySpriteRenderer ? 
        window.EnemySpriteRenderer.generateSprite(boss, 80) : null;
      const phases = boss.phases ? boss.phases.length : 1;

      return `
        <div class="enemy-card boss-card ${isDefeated ? 'defeated' : ''} ${!isEncountered ? 'unseen' : ''}" 
             data-enemy-id="${boss.id}" 
             data-tier="${boss.tier || 'SS'}" 
             data-element="${boss.element || 'neutral'}">
          <div class="enemy-card-header" onclick="window.BestiaryRenderer.toggleExpand('${boss.id}')">
            <div class="enemy-sprite-container">
              ${spriteUrl ? 
                `<img src="${spriteUrl}" class="enemy-sprite boss-sprite" alt="${boss.name}">` : 
                `<div class="enemy-sprite-placeholder">${!isEncountered ? '???' : '👑'}</div>`
              }
              ${isDefeated ? '<span class="defeated-badge">✓</span>' : ''}
            </div>
            <div class="enemy-info">
              <h4>${isEncountered ? boss.name : '???'}</h4>
              <div class="enemy-badges">
                <span class="tier-badge tier-${boss.tier || 'SS'}">${boss.tier || 'SS'}</span>
                <span class="element-badge element-${boss.element || 'neutral'}">${this.getElementIcon(boss.element)}</span>
                <span class="phase-badge">${phases} Phase${phases > 1 ? 's' : ''}</span>
              </div>
              ${isEncountered ? `<p class="enemy-description">${boss.description || ''}</p>` : ''}
            </div>
          </div>
          ${this.expandedEnemy === boss.id ? this.renderBossDetails(boss, isEncountered) : ''}
        </div>
      `;
    },

    // Render villain card
    renderVillainCard(villain) {
      const isEncountered = this.isEncountered(villain.id);
      const isDefeated = this.isDefeated(villain.id);
      const spriteUrl = isEncountered && window.EnemySpriteRenderer ? 
        window.EnemySpriteRenderer.generateSprite(villain, 80) : null;
      const phases = villain.phases ? villain.phases.length : 1;

      return `
        <div class="enemy-card villain-card ${isDefeated ? 'defeated' : ''} ${!isEncountered ? 'unseen' : ''}" 
             data-enemy-id="${villain.id}" 
             data-tier="${villain.tier || 'SS'}" 
             data-element="${villain.element || 'dark'}">
          <div class="enemy-card-header" onclick="window.BestiaryRenderer.toggleExpand('${villain.id}')">
            <div class="enemy-sprite-container">
              ${spriteUrl ? 
                `<img src="${spriteUrl}" class="enemy-sprite villain-sprite" alt="${villain.name}">` : 
                `<div class="enemy-sprite-placeholder">${!isEncountered ? '???' : '😈'}</div>`
              }
              ${isDefeated ? '<span class="defeated-badge">✓</span>' : ''}
            </div>
            <div class="enemy-info">
              <h4>${isEncountered ? villain.name : '???'}</h4>
              ${villain.title ? `<p class="villain-title">${villain.title}</p>` : ''}
              <div class="enemy-badges">
                <span class="tier-badge tier-${villain.tier || 'SS'}">${villain.tier || 'SS'}</span>
                <span class="element-badge element-${villain.element || 'dark'}">${this.getElementIcon(villain.element)}</span>
                <span class="phase-badge">${phases} Phase${phases > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          ${this.expandedEnemy === villain.id ? this.renderVillainDetails(villain, isEncountered) : ''}
        </div>
      `;
    },

    // Render enemy details (expanded view)
    renderEnemyDetails(enemy, isEncountered) {
      if (!isEncountered) {
        return '<div class="enemy-details-unseen">Encounter this enemy to reveal its stats!</div>';
      }

      const phase = enemy.phases ? enemy.phases[0] : enemy;
      return `
        <div class="enemy-details">
          <div class="enemy-stats">
            <div class="stat-row">
              <span class="stat-label">HP:</span>
              <span class="stat-value">${phase.hp || enemy.hp || '???'}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">ATK:</span>
              <span class="stat-value">${phase.atk || enemy.atk || '???'}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">DEF:</span>
              <span class="stat-value">${phase.def || enemy.def || '???'}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">SPD:</span>
              <span class="stat-value">${phase.speed || enemy.speed || '???'}</span>
            </div>
          </div>
          ${enemy.abilities && enemy.abilities.length > 0 ? `
            <div class="enemy-abilities">
              <h5>Abilities:</h5>
              <ul>
                ${enemy.abilities.map(ability => `<li>${ability}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${enemy.description ? `
            <div class="enemy-description-full">
              <p>${enemy.description}</p>
            </div>
          ` : ''}
          ${enemy.loot ? `
            <div class="enemy-loot">
              <h5>Loot:</h5>
              <div class="loot-items">
                ${this.renderLootItems(enemy.loot)}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    },

    // Render boss details
    renderBossDetails(boss, isEncountered) {
      if (!isEncountered) {
        return '<div class="enemy-details-unseen">Encounter this boss to reveal its stats!</div>';
      }

      let html = '<div class="enemy-details boss-details">';
      
      if (boss.phases && boss.phases.length > 1) {
        html += '<div class="boss-phases">';
        boss.phases.forEach((phase, index) => {
          html += `
            <div class="boss-phase">
              <h5>Phase ${phase.phase}</h5>
              <div class="phase-stats">
                <div class="stat-row">
                  <span class="stat-label">HP:</span>
                  <span class="stat-value">${phase.hp || '???'}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">ATK:</span>
                  <span class="stat-value">${phase.atk || '???'}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">DEF:</span>
                  <span class="stat-value">${phase.def || '???'}</span>
                </div>
                ${phase.abilities ? `
                  <div class="phase-abilities">
                    <strong>Abilities:</strong> ${phase.abilities.join(', ')}
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        });
        html += '</div>';
      } else {
        html += this.renderEnemyDetails(boss, isEncountered);
      }

      if (boss.loot) {
        html += `
          <div class="boss-loot">
            <h5>Loot:</h5>
            <div class="loot-items">
              ${this.renderBossLoot(boss.loot)}
            </div>
          </div>
        `;
      }

      html += '</div>';
      return html;
    },

    // Render villain details
    renderVillainDetails(villain, isEncountered) {
      if (!isEncountered) {
        return '<div class="enemy-details-unseen">Encounter this villain to reveal their secrets!</div>';
      }

      let html = '<div class="enemy-details villain-details">';
      
      if (villain.personality) {
        html += `<div class="villain-personality"><strong>Personality:</strong> ${villain.personality}</div>`;
      }
      
      if (villain.backstory) {
        html += `<div class="villain-backstory"><strong>Backstory:</strong> ${villain.backstory}</div>`;
      }

      html += this.renderBossDetails(villain, isEncountered);
      html += '</div>';
      return html;
    },

    // Render loot items
    renderLootItems(loot) {
      let html = '';
      if (loot.common) {
        html += `<div class="loot-tier common">Common: ${loot.common.join(', ')}</div>`;
      }
      if (loot.rare) {
        html += `<div class="loot-tier rare">Rare: ${loot.rare.join(', ')}</div>`;
      }
      return html;
    },

    // Render boss loot
    renderBossLoot(loot) {
      let html = '';
      if (loot.guaranteed) {
        html += `<div class="loot-tier guaranteed">✅ Guaranteed: ${loot.guaranteed.join(', ')}</div>`;
      }
      if (loot.rare) {
        html += `<div class="loot-tier rare">Rare (${(loot.rareRate * 100).toFixed(0)}%): ${loot.rare.join(', ')}</div>`;
      }
      if (loot.epic) {
        html += `<div class="loot-tier epic">Epic (${(loot.epicRate * 100).toFixed(0)}%): ${loot.epic.join(', ')}</div>`;
      }
      return html;
    },

    // Get element icon
    getElementIcon(element) {
      const icons = {
        fire: '🔥',
        ice: '❄️',
        lightning: '⚡',
        nature: '🌿',
        dark: '🌑',
        light: '✨',
        neutral: '⚪',
        tech: '⚙️',
        fusion: '💫',
        earth: '🌍',
        wind: '💨'
      };
      return icons[element] || '⚪';
    },

    // Check if enemy is encountered
    isEncountered(enemyId) {
      if (!window.gameState || !window.gameState.bestiary) return false;
      return window.gameState.bestiary.encountered && window.gameState.bestiary.encountered.includes(enemyId);
    },

    // Check if enemy is defeated
    isDefeated(enemyId) {
      if (!window.gameState || !window.gameState.bestiary) return false;
      return window.gameState.bestiary.defeated && window.gameState.bestiary.defeated.includes(enemyId);
    },

    // Toggle expand/collapse
    toggleExpand(enemyId) {
      if (this.expandedEnemy === enemyId) {
        this.expandedEnemy = null;
      } else {
        this.expandedEnemy = enemyId;
      }
      this.renderBestiaryTab();
    },

    // Attach event listeners
    attachEventListeners() {
      // Section tabs
      document.querySelectorAll('.bestiary-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
          this.currentSection = e.currentTarget.dataset.section;
          this.renderBestiaryTab();
        });
      });

      // Search filter
      const searchInput = document.getElementById('bestiarySearch');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.filterEnemies();
        });
      }

      // Tier filter
      const tierFilter = document.getElementById('bestiaryFilterTier');
      if (tierFilter) {
        tierFilter.addEventListener('change', () => {
          this.filterEnemies();
        });
      }

      // Element filter
      const elementFilter = document.getElementById('bestiaryFilterElement');
      if (elementFilter) {
        elementFilter.addEventListener('change', () => {
          this.filterEnemies();
        });
      }
    },

    // Filter enemies based on search and filters
    filterEnemies() {
      const searchTerm = document.getElementById('bestiarySearch')?.value.toLowerCase() || '';
      const tierFilter = document.getElementById('bestiaryFilterTier')?.value || '';
      const elementFilter = document.getElementById('bestiaryFilterElement')?.value || '';

      document.querySelectorAll('.enemy-card').forEach(card => {
        const enemyId = card.dataset.enemyId;
        const tier = card.dataset.tier || '';
        const element = card.dataset.element || '';
        const enemy = window.EnemyDatabase.getEnemy(enemyId);
        
        const matchesSearch = !searchTerm || (enemy && enemy.name && enemy.name.toLowerCase().includes(searchTerm));
        const matchesTier = !tierFilter || tier === tierFilter;
        const matchesElement = !elementFilter || element === elementFilter;

        if (matchesSearch && matchesTier && matchesElement) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }
  };

  console.log('[BestiaryRenderer] Bestiary renderer ready');
})();

