/**
 * HPC CHARACTER CARD - Reusable character display component
 * Creates character cards for display in UI
 */

class HPCCharacterCard {
  /**
   * Create character card element
   * @param {Object} hpcInfo - HPC info from manager
   * @param {Object} options - Display options
   * @returns {HTMLElement} Card element
   */
  static createCard(hpcInfo, options = {}) {
    const {
      showActions = true,
      showStats = true,
      showXP = true,
      compact = false,
      onClick = null
    } = options;

    const card = document.createElement('div');
    card.className = `hpc-character-card ${compact ? 'compact' : ''}`;
    card.dataset.hpcId = hpcInfo.id;

    // Card header with icon and name
    const header = this.createHeader(hpcInfo);
    card.appendChild(header);

    // Stats section
    if (showStats) {
      const stats = this.createStats(hpcInfo);
      card.appendChild(stats);
    }

    // XP/Level section
    if (showXP && hpcInfo.character) {
      const xpSection = this.createXPSection(hpcInfo.character);
      card.appendChild(xpSection);
    }

    // Actions section
    if (showActions) {
      const actions = this.createActions(hpcInfo);
      card.appendChild(actions);
    }

    // Click handler
    if (onClick) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => onClick(hpcInfo));
    }

    return card;
  }

  /**
   * Create card header
   */
  static createHeader(hpcInfo) {
    const header = document.createElement('div');
    header.className = 'hpc-card-header';

    const icon = document.createElement('span');
    icon.className = 'hpc-card-icon';
    icon.textContent = hpcInfo.icon || '👤';
    icon.style.fontSize = '32px';

    const nameSection = document.createElement('div');
    nameSection.className = 'hpc-card-name-section';

    const name = document.createElement('div');
    name.className = 'hpc-card-name';
    name.textContent = hpcInfo.displayName || hpcInfo.name;

    const rank = document.createElement('div');
    rank.className = 'hpc-card-rank';
    rank.textContent = hpcInfo.rank;
    rank.style.color = hpcInfo.color || '#9CA3AF';
    rank.style.fontWeight = 'bold';

    nameSection.appendChild(name);
    nameSection.appendChild(rank);

    header.appendChild(icon);
    header.appendChild(nameSection);

    // Status badges
    if (hpcInfo.isHired) {
      const hiredBadge = document.createElement('span');
      hiredBadge.className = 'hpc-badge hired';
      hiredBadge.textContent = '✓ Hired';
      header.appendChild(hiredBadge);
    }

    if (hpcInfo.isInParty) {
      const partyBadge = document.createElement('span');
      partyBadge.className = 'hpc-badge party';
      partyBadge.textContent = '👥 In Party';
      header.appendChild(partyBadge);
    }

    return header;
  }

  /**
   * Create stats section
   */
  static createStats(hpcInfo) {
    const stats = document.createElement('div');
    stats.className = 'hpc-card-stats';

    const character = hpcInfo.character;
    const statsToShow = character ? character.currentStats : hpcInfo.baseStats;

    const statNames = {
      hp: 'HP',
      atk: 'ATK',
      def: 'DEF',
      speed: 'SPD'
    };

    Object.entries(statsToShow).forEach(([key, value]) => {
      if (statNames[key]) {
        const statRow = document.createElement('div');
        statRow.className = 'hpc-stat-row';

        const label = document.createElement('span');
        label.className = 'hpc-stat-label';
        label.textContent = statNames[key] + ':';

        const valueSpan = document.createElement('span');
        valueSpan.className = 'hpc-stat-value';
        valueSpan.textContent = Math.floor(value);

        statRow.appendChild(label);
        statRow.appendChild(valueSpan);
        stats.appendChild(statRow);
      }
    });

    return stats;
  }

  /**
   * Create XP/Level section
   */
  static createXPSection(character) {
    const xpSection = document.createElement('div');
    xpSection.className = 'hpc-card-xp';

    const levelLabel = document.createElement('div');
    levelLabel.className = 'hpc-level-label';
    levelLabel.textContent = `Level ${character.level}`;

    const xpBarContainer = document.createElement('div');
    xpBarContainer.className = 'hpc-xp-bar-container';

    const xpBar = document.createElement('div');
    xpBar.className = 'hpc-xp-bar';
    const progress = character.xp / character.xpToNext;
    xpBar.style.width = `${Math.min(progress * 100, 100)}%`;

    const xpText = document.createElement('div');
    xpText.className = 'hpc-xp-text';
    xpText.textContent = `${character.xp}/${character.xpToNext} XP`;

    xpBarContainer.appendChild(xpBar);
    xpBarContainer.appendChild(xpText);

    xpSection.appendChild(levelLabel);
    xpSection.appendChild(xpBarContainer);

    return xpSection;
  }

  /**
   * Create actions section
   */
  static createActions(hpcInfo) {
    const actions = document.createElement('div');
    actions.className = 'hpc-card-actions';

    if (!hpcInfo.isHired) {
      // Hire button
      const hireBtn = document.createElement('button');
      hireBtn.className = 'hpc-action-btn hire-btn';
      hireBtn.textContent = `Hire (${hpcInfo.hireCost.toLocaleString()}g)`;
      
      if (!hpcInfo.canAfford) {
        hireBtn.disabled = true;
        hireBtn.classList.add('disabled');
        hireBtn.title = 'Insufficient funds';
      }

      hireBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.hpcHiringUI) {
          window.hpcHiringUI.handleHire(hpcInfo.id);
        }
      });

      actions.appendChild(hireBtn);
    } else {
      // Party management buttons
      if (!hpcInfo.isInParty) {
        const addBtn = document.createElement('button');
        addBtn.className = 'hpc-action-btn add-party-btn';
        addBtn.textContent = 'Add to Party';
        addBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (window.hpcManager) {
            window.hpcManager.addToParty(hpcInfo.id);
            if (window.hpcPartyUI) {
              window.hpcPartyUI.refresh();
            }
            if (window.hpcHiringUI) {
              window.hpcHiringUI.refresh();
            }
          }
        });
        actions.appendChild(addBtn);
      } else {
        const removeBtn = document.createElement('button');
        removeBtn.className = 'hpc-action-btn remove-party-btn';
        removeBtn.textContent = 'Remove from Party';
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (window.hpcManager) {
            window.hpcManager.removeFromParty(hpcInfo.id);
            if (window.hpcPartyUI) {
              window.hpcPartyUI.refresh();
            }
            if (window.hpcHiringUI) {
              window.hpcHiringUI.refresh();
            }
          }
        });
        actions.appendChild(removeBtn);
      }
    }

    return actions;
  }

  /**
   * Update card with new data
   * @param {HTMLElement} card - Card element
   * @param {Object} hpcInfo - Updated HPC info
   */
  static updateCard(card, hpcInfo) {
    // Update stats
    const statsSection = card.querySelector('.hpc-card-stats');
    if (statsSection) {
      const character = hpcInfo.character;
      const statsToShow = character ? character.currentStats : hpcInfo.baseStats;
      
      const statRows = statsSection.querySelectorAll('.hpc-stat-row');
      const statValues = {
        hp: statsToShow.hp,
        atk: statsToShow.atk,
        def: statsToShow.def,
        speed: statsToShow.speed
      };

      statRows.forEach((row, index) => {
        const keys = ['hp', 'atk', 'def', 'speed'];
        const valueSpan = row.querySelector('.hpc-stat-value');
        if (valueSpan && statValues[keys[index]]) {
          valueSpan.textContent = Math.floor(statValues[keys[index]]);
        }
      });
    }

    // Update XP section
    if (hpcInfo.character) {
      const xpSection = card.querySelector('.hpc-card-xp');
      if (xpSection) {
        const levelLabel = xpSection.querySelector('.hpc-level-label');
        const xpBar = xpSection.querySelector('.hpc-xp-bar');
        const xpText = xpSection.querySelector('.hpc-xp-text');
        
        if (levelLabel) levelLabel.textContent = `Level ${hpcInfo.character.level}`;
        if (xpBar) {
          const progress = hpcInfo.character.xp / hpcInfo.character.xpToNext;
          xpBar.style.width = `${Math.min(progress * 100, 100)}%`;
        }
        if (xpText) {
          xpText.textContent = `${hpcInfo.character.xp}/${hpcInfo.character.xpToNext} XP`;
        }
      }
    }

    // Update badges
    const header = card.querySelector('.hpc-card-header');
    if (header) {
      // Remove existing badges
      const existingBadges = header.querySelectorAll('.hpc-badge');
      existingBadges.forEach(badge => badge.remove());

      // Add new badges
      if (hpcInfo.isHired) {
        const hiredBadge = document.createElement('span');
        hiredBadge.className = 'hpc-badge hired';
        hiredBadge.textContent = '✓ Hired';
        header.appendChild(hiredBadge);
      }

      if (hpcInfo.isInParty) {
        const partyBadge = document.createElement('span');
        partyBadge.className = 'hpc-badge party';
        partyBadge.textContent = '👥 In Party';
        header.appendChild(partyBadge);
      }
    }

    // Update actions
    const actionsSection = card.querySelector('.hpc-card-actions');
    if (actionsSection) {
      actionsSection.innerHTML = '';
      const newActions = this.createActions(hpcInfo);
      actionsSection.appendChild(newActions);
    }
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.HPCCharacterCard = HPCCharacterCard;
}

