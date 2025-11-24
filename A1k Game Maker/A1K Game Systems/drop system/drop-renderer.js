/**
 * A1K Drop Systems Renderer
 * Renders the Drop Systems tab with enemy types, boss loot, quests, and missions
 */

(function() {
  'use strict';

  console.log('[DropRenderer] Loading drop systems renderer...');

  window.DropSystemsRenderer = {
    currentSection: 'enemies',

    // Main render function for the Drop Systems tab
    renderDropSystemsTab() {
      console.log('[DropRenderer] renderDropSystemsTab called');
      const pane = document.getElementById('bagContentPane');
      if (!pane) {
        console.error('[DropRenderer] bagContentPane not found!');
        return;
      }

      try {
        const html = `
          <div class="drop-systems-container">
            <!-- Section Navigation -->
            <div class="drop-section-tabs">
              <button class="drop-tab ${this.currentSection === 'enemies' ? 'active' : ''}" data-section="enemies">
                <span class="tab-icon">👾</span>
                <span class="tab-label">Enemy Drops</span>
              </button>
              <button class="drop-tab ${this.currentSection === 'bosses' ? 'active' : ''}" data-section="bosses">
                <span class="tab-icon">👑</span>
                <span class="tab-label">Boss Loot</span>
              </button>
              <button class="drop-tab ${this.currentSection === 'quests' ? 'active' : ''}" data-section="quests">
                <span class="tab-icon">📜</span>
                <span class="tab-label">Quest Rewards</span>
              </button>
              <button class="drop-tab ${this.currentSection === 'missions' ? 'active' : ''}" data-section="missions">
                <span class="tab-icon">⭐</span>
                <span class="tab-label">Daily Missions</span>
              </button>
            </div>

            <!-- Content Sections -->
            <div class="drop-content">
              ${this.renderCurrentSection()}
            </div>
          </div>
        `;

        pane.innerHTML = html;
        console.log('[DropRenderer] HTML set, attaching event listeners');
        this.attachEventListeners();
        console.log('[DropRenderer] renderDropSystemsTab completed successfully');
      } catch (error) {
        console.error('[DropRenderer] Error rendering drop systems tab:', error);
        pane.innerHTML = `
          <div style="padding: 40px; text-align: center;">
            <h3 style="color: #ff6b35;">⚠️ Error Rendering Drop Systems</h3>
            <p style="color: rgba(207, 227, 255, 0.7); margin-top: 12px;">
              ${error.message}
            </p>
            <pre style="color: rgba(207, 227, 255, 0.5); font-size: 12px; margin-top: 20px; text-align: left; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; max-height: 300px; overflow: auto;">${error.stack}</pre>
          </div>
        `;
      }
    },

    // Render the currently active section
    renderCurrentSection() {
      try {
        switch(this.currentSection) {
          case 'enemies':
            return this.renderEnemySection();
          case 'bosses':
            return this.renderBossSection();
          case 'quests':
            return this.renderQuestSection();
          case 'missions':
            return this.renderMissionSection();
          default:
            return '<div>Section not found</div>';
        }
      } catch (error) {
        console.error('[DropRenderer] Error rendering section:', error);
        return `<div style="padding: 40px; text-align: center; color: #ff6b35;">
          <h3>Error rendering ${this.currentSection} section</h3>
          <p>${error.message}</p>
        </div>`;
      }
    },

    // Render enemy types and their drop tables
    renderEnemySection() {
      if (!window.DROP_SYSTEMS || !window.DROP_SYSTEMS.enemyTypes) {
        console.warn('[DropRenderer] DROP_SYSTEMS not initialized yet');
        return '<div style="padding: 40px; text-align: center;"><h3 style="color: #ff6b35;">Loading Drop Tables...</h3><p style="color: rgba(207, 227, 255, 0.7);">Please wait while drop tables are being loaded.</p></div>';
      }

      const types = window.DROP_SYSTEMS.enemyTypes;
      let html = `
        <div class="drop-section-header">
          <h3>Enemy Type Drop Tables</h3>
          <p>Different enemy types drop specific categories of items. Higher level enemies have better drop rates.</p>
        </div>
        <div class="enemy-types-grid">
      `;

      for (let typeKey in types) {
        const type = types[typeKey];
        html += this.renderEnemyTypeCard(typeKey, type);
      }

      html += '</div>';
      return html;
    },

    // Render a single enemy type card
    renderEnemyTypeCard(typeKey, typeData) {
      const sprite = window.MonsterSpriteGenerator ? 
        window.MonsterSpriteGenerator.getEmojiForType(typeKey, 'uncommon') : 
        typeData.icon;

      return `
        <div class="enemy-type-card" data-type="${typeKey}" style="border-color: ${typeData.color};">
          <div class="enemy-header">
            <div class="enemy-sprite">${sprite}</div>
            <div class="enemy-info">
              <h4>${typeData.name}</h4>
              <p>${typeData.description}</p>
            </div>
          </div>

          <div class="drop-rarity-section">
            ${this.renderDropsByRarity(typeData.drops, typeData.dropRates)}
          </div>
        </div>
      `;
    },

    // Render drops organized by rarity
    renderDropsByRarity(drops, dropRates) {
      const rarities = ['legendary', 'epic', 'rare', 'uncommon', 'common'];
      let html = '';

      rarities.forEach(rarity => {
        if (!drops[rarity] || drops[rarity].length === 0) return;

        const rate = (dropRates[rarity] * 100).toFixed(1);
        const rarityColor = this.getRarityColor(rarity);

        html += `
          <div class="drop-rarity-row" data-rarity="${rarity}">
            <div class="rarity-header" style="background: ${rarityColor};">
              <span class="rarity-name">${rarity.toUpperCase()}</span>
              <span class="rarity-rate">${rate}%</span>
            </div>
            <div class="drop-items">
              ${this.renderDropItems(drops[rarity], rarity)}
            </div>
          </div>
        `;
      });

      return html;
    },

    // Render item icons for drops
    renderDropItems(itemIds, rarity) {
      return itemIds.slice(0, 10).map(itemId => {
        const item = window.DROP_SYSTEMS.getItemDetails(itemId);
        if (!item) return `<span class="drop-item-icon" title="${itemId}">❓</span>`;

        return `
          <span class="drop-item-icon" 
                title="${item.name} - ${item.description || ''}" 
                data-item-id="${itemId}">
            ${item.icon || '📦'}
          </span>
        `;
      }).join('') + (itemIds.length > 10 ? `<span class="drop-more">+${itemIds.length - 10} more</span>` : '');
    },

    // Render boss loot section
    renderBossSection() {
      if (!window.DROP_SYSTEMS || !window.DROP_SYSTEMS.bossLoot) {
        console.warn('[DropRenderer] DROP_SYSTEMS not initialized yet');
        return '<div style="padding: 40px; text-align: center;"><h3 style="color: #ff6b35;">Loading Boss Loot...</h3><p style="color: rgba(207, 227, 255, 0.7);">Please wait while boss loot tables are being loaded.</p></div>';
      }

      const bosses = window.DROP_SYSTEMS.bossLoot;
      let html = `
        <div class="drop-section-header">
          <h3>Boss-Specific Loot Tables</h3>
          <p>Each boss has unique guaranteed drops and rare rewards. Hunt specific bosses for specific items!</p>
        </div>
        <div class="boss-loot-grid">
      `;

      for (let bossName in bosses) {
        const boss = bosses[bossName];
        html += this.renderBossCard(bossName, boss);
      }

      html += '</div>';
      return html;
    },

    // Render a single boss card
    renderBossCard(bossName, bossData) {
      return `
        <div class="boss-card" data-boss="${bossName}">
          <div class="boss-header">
            <div class="boss-icon">${bossData.icon}</div>
            <div class="boss-info">
              <h4>${bossName}</h4>
              <span class="boss-type-badge">${bossData.type}</span>
              <p>${bossData.description}</p>
            </div>
          </div>

          <div class="boss-rewards">
            ${bossData.guaranteed ? `
              <div class="reward-tier guaranteed">
                <div class="tier-label">✅ GUARANTEED</div>
                <div class="reward-items">
                  ${this.renderRewardItems(bossData.guaranteed)}
                </div>
              </div>
            ` : ''}

            ${bossData.rare ? `
              <div class="reward-tier rare">
                <div class="tier-label">💎 RARE (${(bossData.dropRates.rare * 100)}%)</div>
                <div class="reward-items">
                  ${this.renderRewardItems(bossData.rare)}
                </div>
              </div>
            ` : ''}

            ${bossData.epic ? `
              <div class="reward-tier epic">
                <div class="tier-label">⭐ EPIC (${(bossData.dropRates.epic * 100)}%)</div>
                <div class="reward-items">
                  ${this.renderRewardItems(bossData.epic)}
                </div>
              </div>
            ` : ''}

            ${bossData.legendary ? `
              <div class="reward-tier legendary">
                <div class="tier-label">👑 LEGENDARY (${(bossData.dropRates.legendary * 100)}%)</div>
                <div class="reward-items">
                  ${this.renderRewardItems(bossData.legendary)}
                </div>
              </div>
            ` : ''}

            ${bossData.goldBonus ? `
              <div class="gold-bonus">
                💰 +${bossData.goldBonus.toLocaleString()} Gold
              </div>
            ` : ''}
          </div>
        </div>
      `;
    },

    // Render reward items with names
    renderRewardItems(itemIds) {
      if (!itemIds || itemIds.length === 0) return '';

      return itemIds.map(itemId => {
        const item = window.DROP_SYSTEMS.getItemDetails(itemId);
        if (!item) return `<div class="reward-item unknown">${itemId}</div>`;

        return `
          <div class="reward-item" data-item-id="${itemId}" title="${item.description || ''}">
            <span class="item-icon">${item.icon || '📦'}</span>
            <span class="item-name">${item.name}</span>
          </div>
        `;
      }).join('');
    },

    // Render quest rewards section
    renderQuestSection() {
      if (!window.DROP_SYSTEMS || !window.DROP_SYSTEMS.questRewards) {
        console.warn('[DropRenderer] DROP_SYSTEMS not initialized yet');
        return '<div style="padding: 40px; text-align: center;"><h3 style="color: #ff6b35;">Loading Quest Rewards...</h3><p style="color: rgba(207, 227, 255, 0.7);">Please wait while quest rewards are being loaded.</p></div>';
      }

      const quests = window.DROP_SYSTEMS.questRewards;
      let html = `
        <div class="drop-section-header">
          <h3>Quest Rewards</h3>
          <p>Complete quests to earn guaranteed items, gold, and gems!</p>
        </div>
        <div class="quest-list">
      `;

      for (let questId in quests) {
        const quest = quests[questId];
        html += this.renderQuestCard(questId, quest);
      }

      html += '</div>';
      return html;
    },

    // Render a single quest card
    renderQuestCard(questId, questData) {
      const rewards = questData.rewards;
      
      return `
        <div class="quest-card" data-quest-id="${questId}">
          <div class="quest-header">
            <div class="quest-icon">${questData.icon}</div>
            <div class="quest-info">
              <h4>${questData.name}</h4>
              <p>${questData.description}</p>
              <span class="quest-type-badge">${questData.type} • Target: ${questData.target}</span>
              <span class="quest-level-badge">Level ${questData.levelReq}+</span>
            </div>
          </div>

          <div class="quest-rewards">
            <div class="reward-header">REWARDS:</div>
            ${rewards.gold ? `<div class="reward-currency">💰 ${rewards.gold.toLocaleString()} Gold</div>` : ''}
            ${rewards.gems ? `<div class="reward-currency">💎 ${rewards.gems} Gems</div>` : ''}
            ${rewards.essence ? `<div class="reward-currency">✨ ${rewards.essence} Essence</div>` : ''}
            
            ${rewards.items ? `
              <div class="reward-items-section">
                <div class="reward-label">Guaranteed Items:</div>
                ${this.renderRewardItems(rewards.items)}
              </div>
            ` : ''}

            ${rewards.random ? `
              <div class="reward-items-section random">
                <div class="reward-label">Random (x${rewards.randomCount}):</div>
                ${this.renderRewardItems(rewards.random)}
              </div>
            ` : ''}

            ${rewards.alchemyTier ? `
              <div class="reward-special">⚗️ Unlock Alchemy Tier ${rewards.alchemyTier}</div>
            ` : ''}
          </div>
        </div>
      `;
    },

    // Render daily missions section
    renderMissionSection() {
      if (!window.DROP_SYSTEMS || !window.DROP_SYSTEMS.dailyMissions) {
        console.warn('[DropRenderer] DROP_SYSTEMS not initialized yet');
        return '<div style="padding: 40px; text-align: center;"><h3 style="color: #ff6b35;">Loading Missions...</h3><p style="color: rgba(207, 227, 255, 0.7);">Please wait while missions are being loaded.</p></div>';
      }

      const missions = window.DROP_SYSTEMS.dailyMissions;
      const dailyMissions = missions.filter(m => m.type === 'daily');
      const weeklyMissions = missions.filter(m => m.type === 'weekly');

      let html = `
        <div class="drop-section-header">
          <h3>Daily & Weekly Missions</h3>
          <p>Complete missions for bonus rewards! Dailies reset every 24 hours, weeklies every 7 days.</p>
        </div>

        <div class="missions-container">
          <div class="mission-group">
            <h4 class="mission-group-title">📅 Daily Missions (${dailyMissions.length})</h4>
            <div class="mission-grid">
              ${dailyMissions.map(m => this.renderMissionCard(m)).join('')}
            </div>
          </div>

          <div class="mission-group">
            <h4 class="mission-group-title">🗓️ Weekly Missions (${weeklyMissions.length})</h4>
            <div class="mission-grid">
              ${weeklyMissions.map(m => this.renderMissionCard(m)).join('')}
            </div>
          </div>
        </div>
      `;

      return html;
    },

    // Render a single mission card
    renderMissionCard(missionData) {
      const rewards = missionData.rewards;
      const isWeekly = missionData.type === 'weekly';

      return `
        <div class="mission-card ${isWeekly ? 'weekly' : 'daily'}" data-mission-id="${missionData.id}">
          <div class="mission-header">
            <div class="mission-icon">${missionData.icon}</div>
            <div class="mission-info">
              <h5>${missionData.name}</h5>
              <p>${missionData.description}</p>
              <div class="mission-progress-bar">
                <div class="progress-fill" style="width: 0%;"></div>
                <span class="progress-text">0 / ${missionData.goal.target}</span>
              </div>
            </div>
          </div>

          <div class="mission-rewards">
            ${rewards.gold ? `<span class="reward-mini">💰 ${rewards.gold.toLocaleString()}</span>` : ''}
            ${rewards.gems ? `<span class="reward-mini">💎 ${rewards.gems}</span>` : ''}
            ${rewards.essence ? `<span class="reward-mini">✨ ${rewards.essence}</span>` : ''}
            ${rewards.items ? `<span class="reward-mini">🎁 x${rewards.items.length}</span>` : ''}
            ${rewards.random ? `<span class="reward-mini">🎲 x${rewards.randomCount}</span>` : ''}
          </div>
        </div>
      `;
    },

    // Get color for rarity
    getRarityColor(rarity) {
      const colors = {
        common: 'rgba(107, 114, 128, 0.6)',
        uncommon: 'rgba(34, 197, 94, 0.6)',
        rare: 'rgba(59, 130, 246, 0.6)',
        epic: 'rgba(147, 51, 234, 0.6)',
        legendary: 'rgba(255, 215, 0, 0.7)'
      };
      return colors[rarity] || colors.common;
    },

    // Attach event listeners
    attachEventListeners() {
      // Section tab switching
      document.querySelectorAll('.drop-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          this.currentSection = tab.dataset.section;
          this.renderDropSystemsTab();
        });
      });

      // Item click to show details
      document.querySelectorAll('.drop-item-icon, .reward-item').forEach(item => {
        item.addEventListener('click', () => {
          const itemId = item.dataset.itemId;
          if (itemId) {
            this.showItemSources(itemId);
          }
        });
      });

      // Enemy card expand/collapse
      document.querySelectorAll('.enemy-type-card').forEach(card => {
        card.addEventListener('click', () => {
          card.classList.toggle('expanded');
        });
      });
    },

    // Show where an item can be obtained
    showItemSources(itemId) {
      const sources = window.DROP_SYSTEMS.findDropSources(itemId);
      const item = window.DROP_SYSTEMS.getItemDetails(itemId);
      
      if (!item) return;

      let message = `📦 ${item.icon} ${item.name}\n\n`;
      message += `WHERE TO FIND:\n`;

      if (sources.enemies.length > 0) {
        message += `\n👾 ENEMY DROPS:\n`;
        sources.enemies.forEach(src => {
          message += `  • ${src.type} enemies (${src.rarity}) - ${(src.rate * 100).toFixed(1)}%\n`;
        });
      }

      if (sources.bosses.length > 0) {
        message += `\n👑 BOSS DROPS:\n`;
        sources.bosses.forEach(src => {
          message += `  • ${src.boss} (${src.tier}) - ${src.rate === 1.0 ? 'GUARANTEED' : (src.rate * 100).toFixed(1) + '%'}\n`;
        });
      }

      if (sources.quests.length > 0) {
        message += `\n📜 QUEST REWARDS:\n`;
        sources.quests.forEach(src => {
          message += `  • ${src.quest} ${src.guaranteed ? '(guaranteed)' : '(chance)'}\n`;
        });
      }

      if (sources.missions.length > 0) {
        message += `\n⭐ MISSIONS:\n`;
        sources.missions.forEach(src => {
          message += `  • ${src.mission} (${src.type}) ${src.guaranteed ? '(guaranteed)' : '(chance)'}\n`;
        });
      }

      if (window.BagSystem && window.BagSystem.showToast) {
        alert(message); // Simple alert for now, can be styled later
      }
    }
  };

  console.log('✅ [DropRenderer] Drop systems renderer ready');

})();

