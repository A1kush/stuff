/**
 * Mission Board Renderer
 * Renders the Mission Board tab with available missions, active missions, and dungeon/tower access
 */

(function() {
  'use strict';

  console.log('[MissionBoardRenderer] Loading mission board renderer...');

  window.MissionBoardRenderer = {
    currentSubsection: 'available',
    selectedMission: null,
    gatekeeperConfig: null,

    // Main render function for the Mission Board tab
    renderMissionBoardTab() {
      const pane = document.getElementById('bagContentPane');
      if (!pane) return;

      const html = `
        <div class="mission-board-container">
          ${this.renderGatekeeperCTA()}
          <!-- Subsection Navigation -->
          <div class="mission-subsection-tabs">
            <button class="mission-subtab ${this.currentSubsection === 'available' ? 'active' : ''}" data-subsection="available">
              <span class="tab-icon">📋</span>
              <span class="tab-label">Available</span>
            </button>
            <button class="mission-subtab ${this.currentSubsection === 'active' ? 'active' : ''}" data-subsection="active">
              <span class="tab-icon">⚔️</span>
              <span class="tab-label">Active</span>
            </button>
            <button class="mission-subtab ${this.currentSubsection === 'completed' ? 'active' : ''}" data-subsection="completed">
              <span class="tab-icon">✅</span>
              <span class="tab-label">Completed</span>
            </button>
            <button class="mission-subtab ${this.currentSubsection === 'dungeons' ? 'active' : ''}" data-subsection="dungeons">
              <span class="tab-icon">🏰</span>
              <span class="tab-label">Dungeons & Towers</span>
            </button>
          </div>

          <!-- Content Sections -->
          <div class="mission-content">
            ${this.renderCurrentSubsection()}
          </div>
        </div>
      `;

      pane.innerHTML = html;
      this.attachEventListeners();
      this._mountGatekeeperCTA();
    },

    // Render the currently active subsection
    renderCurrentSubsection() {
      switch(this.currentSubsection) {
        case 'available':
          return this.renderAvailableMissions();
        case 'active':
          return this.renderActiveMission();
        case 'completed':
          return this.renderCompletedMissions();
        case 'dungeons':
          return this.renderDungeonsAndTowers();
        default:
          return '<div>Subsection not found</div>';
      }
    },

    renderGatekeeperCTA() {
      const cfg = this._getGatekeeperConfig();
      const statusCopy = cfg.statusHint || 'Badge payouts refund forging costs.';
      const hotkey = (cfg.hotkey || 'g').toUpperCase();

      return `
        <div class="mission-gatekeeper-cta">
          <div class="gatekeeper-status">
            <div>${statusCopy}</div>
            <div style="margin-top:6px; font-size:11px; color: rgba(207,227,255,0.6);">
              Hotkey: <span style="color:#00e5ff; font-weight:600;">${hotkey}</span>
            </div>
          </div>
          <div class="gatekeeper-cta-button" data-role="gatekeeper-cta"></div>
        </div>
      `;
    },

    _mountGatekeeperCTA() {
      try {
        const host = document.querySelector('.gatekeeper-cta-button[data-role="gatekeeper-cta"]');
        if (!host) return;
        const attached = window.RiftUI?.attachGatekeeperToggle?.(host);
        if (!attached) {
          host.innerHTML = '<div style="color: rgba(255,107,53,0.7); font-size: 12px;">Gatekeeper interface unavailable.</div>';
        }
      } catch (error) {
        console.error('[MissionBoardRenderer] Failed to mount Gatekeeper CTA', error);
      }
    },

    _getGatekeeperConfig() {
      if (this.gatekeeperConfig) return this.gatekeeperConfig;
      const configCandidate =
        window.CONFIG?.bag?.missions?.gatekeeperBriefing ||
        window.CONFIG?.polish?.bag?.missions?.gatekeeperBriefing ||
        window.__A1K_CONFIG?.bag?.missions?.gatekeeperBriefing;
      this.gatekeeperConfig =
        (configCandidate && typeof configCandidate === 'object'
          ? configCandidate
          : {
              label: 'Gatekeeper Briefing',
              statusHint: 'Badge payouts refund forging costs.',
              hotkey: 'g',
            });
      return this.gatekeeperConfig;
    },

    // Render available missions
    renderAvailableMissions() {
      if (!window.MissionDatabase) {
        return '<div class="mission-loading">Loading mission data...</div>';
      }

      const playerLevel = window.gameState?.level || 1;
      const availableMissions = window.MissionDatabase.getAvailableMissions(playerLevel);
      const activeMissionId = window.gameState?.missions?.active?.id;

      // Filter out active mission
      const missions = availableMissions.filter(m => m.id !== activeMissionId);

      if (missions.length === 0) {
        return '<div class="mission-empty">No missions available. Level up to unlock more!</div>';
      }

      // Group by type
      const missionsByType = {
        hunt: missions.filter(m => m.type === 'hunt'),
        survival: missions.filter(m => m.type === 'survival'),
        bossRush: missions.filter(m => m.type === 'boss_rush'),
        tower: missions.filter(m => m.type === 'tower'),
        dungeon: missions.filter(m => m.type === 'dungeon')
      };

      let html = `
        <div class="mission-section-header">
          <h3>Available Missions</h3>
          <p>Select a mission to view details and start</p>
        </div>
        <div class="mission-type-sections">
      `;

      // Hunt Missions
      if (missionsByType.hunt.length > 0) {
        html += `
          <div class="mission-type-section">
            <h4 class="mission-type-title">🎯 Hunt Bounties</h4>
            <div class="mission-grid">
              ${missionsByType.hunt.map(m => this.renderMissionCard(m)).join('')}
            </div>
          </div>
        `;
      }

      // Survival Missions
      if (missionsByType.survival.length > 0) {
        html += `
          <div class="mission-type-section">
            <h4 class="mission-type-title">🧟 Horde Survival</h4>
            <div class="mission-grid">
              ${missionsByType.survival.map(m => this.renderMissionCard(m)).join('')}
            </div>
          </div>
        `;
      }

      // Boss Rush Missions
      if (missionsByType.bossRush.length > 0) {
        html += `
          <div class="mission-type-section">
            <h4 class="mission-type-title">⚔️ Boss Rush</h4>
            <div class="mission-grid">
              ${missionsByType.bossRush.map(m => this.renderMissionCard(m)).join('')}
            </div>
          </div>
        `;
      }

      // Tower Missions
      if (missionsByType.tower.length > 0) {
        html += `
          <div class="mission-type-section">
            <h4 class="mission-type-title">🏰 Tower Floors</h4>
            <div class="mission-grid">
              ${missionsByType.tower.map(m => this.renderMissionCard(m)).join('')}
            </div>
          </div>
        `;
      }

      // Dungeon Missions
      if (missionsByType.dungeon.length > 0) {
        html += `
          <div class="mission-type-section">
            <h4 class="mission-type-title">🏛️ Dungeon Runs</h4>
            <div class="mission-grid">
              ${missionsByType.dungeon.map(m => this.renderMissionCard(m)).join('')}
            </div>
          </div>
        `;
      }

      html += '</div>';

      // Mission details modal
      if (this.selectedMission) {
        html += this.renderMissionDetails(this.selectedMission);
      }

      return html;
    },

    // Render active mission
    renderActiveMission() {
      const activeMission = window.gameState?.missions?.active;
      
      if (!activeMission) {
        return `
          <div class="mission-empty">
            <p>No active mission</p>
            <p>Go to Available missions to start one!</p>
          </div>
        `;
      }

      const mission = window.MissionDatabase.getMissionById(activeMission.id);
      if (!mission) {
        return '<div class="mission-error">Active mission data not found</div>';
      }

      const progress = window.gameState.missions.progress[activeMission.id] || { current: 0, target: 1 };
      const progressPercent = Math.min((progress.current / progress.target) * 100, 100);

      return `
        <div class="active-mission-container">
          <div class="active-mission-header">
            <h3>${mission.name}</h3>
            <button class="btn-abandon-mission" onclick="window.MissionBoardRenderer.abandonMission()">Abandon</button>
          </div>
          
          <div class="mission-description">
            <p>${mission.description}</p>
          </div>

          ${this.renderMissionProgress(mission, progress)}

          <div class="mission-rewards-preview">
            <h4>Rewards:</h4>
            ${this.renderRewards(mission.rewards)}
          </div>
        </div>
      `;
    },

    // Render completed missions
    renderCompletedMissions() {
      const completed = window.gameState?.missions?.completed || [];
      
      if (completed.length === 0) {
        return '<div class="mission-empty">No completed missions yet</div>';
      }

      let html = `
        <div class="mission-section-header">
          <h3>Completed Missions</h3>
          <p>${completed.length} mission${completed.length !== 1 ? 's' : ''} completed</p>
        </div>
        <div class="mission-grid completed-missions">
      `;

      completed.forEach(missionId => {
        const mission = window.MissionDatabase.getMissionById(missionId);
        if (mission) {
          html += this.renderMissionCard(mission, true);
        }
      });

      html += '</div>';
      return html;
    },

    // Render dungeons and towers
    renderDungeonsAndTowers() {
      let html = `
        <div class="mission-section-header">
          <h3>Dungeons & Towers</h3>
          <p>Teleport to dungeons and towers directly. Clear floors to unlock higher ranks!</p>
        </div>
      `;

      // Add Dungeon Raid section if DungeonProgression is available
      if (window.DungeonProgression && window.DungeonRoomData) {
        const playerLevel = window.gameState?.playerLevel || 1;
        const availableDungeons = window.DungeonProgression.getAvailableDungeons(playerLevel);
        
        if (availableDungeons.length > 0) {
          html += `
            <div class="dungeon-section">
              <h4>🏰 Dungeon Raids (C-Rank to SSS-Rank)</h4>
              <div class="dungeon-grid">
                ${availableDungeons.map(dungeon => this.renderDungeonRaidCard(dungeon)).join('')}
              </div>
            </div>
          `;
        } else {
          html += `
            <div class="dungeon-section">
              <p class="mission-empty">No dungeons available yet. Level up to unlock C-Rank dungeons!</p>
            </div>
          `;
        }
      }

      // Add existing tower/dungeon missions if available
      if (window.MissionDatabase) {
        const towers = window.MissionDatabase.getMissionsByType('tower');
        const dungeons = window.MissionDatabase.getMissionsByType('dungeon');

        if (towers.length > 0) {
          html += `
            <div class="dungeon-section">
              <h4>🏰 Towers</h4>
              <div class="dungeon-grid">
                ${towers.map(tower => this.renderDungeonCard(tower, 'tower')).join('')}
              </div>
            </div>
          `;
        }

        if (dungeons.length > 0) {
          html += `
            <div class="dungeon-section">
              <h4>🏛️ Dungeons</h4>
              <div class="dungeon-grid">
                ${dungeons.map(dungeon => this.renderDungeonCard(dungeon, 'dungeon')).join('')}
              </div>
            </div>
          `;
        }
      }

      return html;
    },

    // Render dungeon raid card (C-SSS rank)
    renderDungeonRaidCard(dungeon) {
      const progress = window.DungeonProgression.getRankProgress(dungeon.rankId);
      const progressPercent = progress ? progress.progressPercent : 0;
      
      return `
        <div class="dungeon-card ${dungeon.isCleared ? 'completed' : ''}" 
             data-rank-id="${dungeon.rankId}"
             style="border-color: ${dungeon.color};">
          <div class="dungeon-header">
            <h4>${dungeon.name} Dungeons</h4>
            <span class="dungeon-type-badge" style="background-color: ${dungeon.color}20; color: ${dungeon.color};">
              ${dungeon.rankId}-Rank
            </span>
          </div>
          
          <div class="dungeon-info">
            <p>${dungeon.description}</p>
            
            <div class="dungeon-stats">
              <div class="stat-row">
                <span>Floors:</span>
                <span>${dungeon.floorsCleared} / ${dungeon.floors}</span>
              </div>
              <div class="stat-row">
                <span>Rooms/Floor:</span>
                <span>${dungeon.roomsPerFloor}</span>
              </div>
              <div class="stat-row">
                <span>Entries:</span>
                <span>${dungeon.entriesRemaining === 'Unlimited' ? '∞' : dungeon.entriesRemaining} / ${dungeon.entriesUsed + (dungeon.entriesRemaining === 'Unlimited' ? 0 : parseInt(dungeon.entriesRemaining))}</span>
              </div>
              ${dungeon.enemyMultiplier ? `
                <div class="stat-row">
                  <span>Difficulty:</span>
                  <span>${dungeon.enemyMultiplier}x</span>
                </div>
              ` : ''}
            </div>
            
            ${progress ? `
              <div class="dungeon-progress">
                <div class="progress-bar-container">
                  <div class="progress-bar" style="width: ${progressPercent}%; background-color: ${dungeon.color};"></div>
                </div>
                <div class="progress-text">${progress.floorsCleared} / ${progress.totalFloors} Floors Cleared</div>
              </div>
            ` : ''}
          </div>
          
          <div class="dungeon-footer">
            ${dungeon.canEnter ? `
              <button class="btn-enter-dungeon" 
                      onclick="window.MissionBoardRenderer.enterDungeonRaid('${dungeon.rankId}')"
                      style="background-color: ${dungeon.color};">
                Enter Dungeon
              </button>
            ` : `
              <div class="dungeon-locked" style="color: ${dungeon.color};">
                ${dungeon.cannotEnterReason || 'Locked'}
              </div>
            `}
            ${dungeon.isCleared ? `
              <div class="dungeon-completed-badge">✓ Rank Cleared</div>
            ` : ''}
          </div>
        </div>
      `;
    },

    // Enter dungeon raid
    enterDungeonRaid(rankId) {
      const playerLevel = window.gameState?.playerLevel || 1;
      const canEnter = window.DungeonProgression.canEnterDungeon(rankId, playerLevel);
      
      if (!canEnter.allowed) {
        alert(`Cannot enter dungeon: ${canEnter.reason}`);
        return;
      }
      
      const result = window.DungeonProgression.enterDungeon(rankId);
      if (!result.success) {
        alert(`Failed to enter dungeon: ${result.error}`);
        return;
      }
      
      // Generate first room
      const rankData = window.DungeonRoomData.ranks[rankId];
      const roomTypeIds = Object.keys(window.DungeonRoomData.roomTypes);
      const randomRoomType = roomTypeIds[Math.floor(Math.random() * roomTypeIds.length)];
      
      const firstRoom = window.DungeonRoomGenerator.generateRoom(
        randomRoomType,
        rankId,
        1, // Floor 1
        0, // Room 0
        false // Not boss room
      );
      
      // Set current dungeon state
      window.gameState.dungeons.currentDungeon = {
        rankId: rankId,
        floor: 1,
        roomIndex: 0,
        startTime: Date.now()
      };
      window.gameState.dungeons.currentRoom = firstRoom;
      
      // Dispatch event to start dungeon
      window.dispatchEvent(new CustomEvent('dungeon:raid_started', {
        detail: {
          rankId: rankId,
          room: firstRoom
        }
      }));
      
      // Show toast
      if (window.BagSystem && window.BagSystem.showToast) {
        window.BagSystem.showToast(`Entering ${rankId}-Rank Dungeon: ${firstRoom.type.replace(/_/g, ' ')}`);
      }
      
      // Close bag and start dungeon
      if (window.BagSystem) {
        window.BagSystem.close();
      }
    },

    // Render a mission card
    renderMissionCard(mission, isCompleted = false) {
      const difficultyStars = '⭐'.repeat(mission.difficulty || 1);
      const typeIcon = this.getMissionTypeIcon(mission.type);

      return `
        <div class="mission-card ${isCompleted ? 'completed' : ''}" 
             data-mission-id="${mission.id}"
             onclick="window.MissionBoardRenderer.selectMission('${mission.id}')">
          <div class="mission-card-header">
            <span class="mission-type-icon">${typeIcon}</span>
            <h4>${mission.name}</h4>
            <div class="difficulty-stars">${difficultyStars}</div>
          </div>
          
          <div class="mission-card-body">
            <p class="mission-card-description">${mission.description}</p>
            
            ${this.renderMissionPreview(mission)}
            
            <div class="mission-rewards-preview">
              ${this.renderRewardsPreview(mission.rewards)}
            </div>
          </div>

          ${!isCompleted ? `
            <div class="mission-card-footer">
              <button class="btn-start-mission" onclick="event.stopPropagation(); window.MissionBoardRenderer.startMission('${mission.id}')">
                Start Mission
              </button>
            </div>
          ` : `
            <div class="mission-card-footer">
              <span class="completed-badge">✓ Completed</span>
            </div>
          `}
        </div>
      `;
    },

    // Render dungeon/tower card
    renderDungeonCard(location, type) {
      return `
        <div class="dungeon-card" data-location-id="${location.id}">
          <div class="dungeon-header">
            <h4>${location.name}</h4>
            <span class="dungeon-type-badge">${type === 'tower' ? '🏰 Tower' : '🏛️ Dungeon'}</span>
          </div>
          
          <div class="dungeon-info">
            <p>${location.description}</p>
            ${type === 'tower' ? `
              <div class="dungeon-stats">
                <span>Floor ${location.floor}</span>
                <span>${location.waves} Waves</span>
              </div>
            ` : `
              <div class="dungeon-stats">
                <span>${location.rooms} Rooms</span>
              </div>
            `}
          </div>

          <div class="dungeon-rewards">
            ${this.renderRewardsPreview(location.rewards)}
          </div>

          <button class="btn-teleport" onclick="window.MissionBoardRenderer.teleportToLocation('${location.id}', '${type}')">
            ${type === 'tower' ? 'Enter Tower' : 'Enter Dungeon'}
          </button>
        </div>
      `;
    },

    // Render mission details modal
    renderMissionDetails(missionId) {
      const mission = window.MissionDatabase.getMissionById(missionId);
      if (!mission) return '';

      return `
        <div class="mission-details-modal" id="missionDetailsModal">
          <div class="mission-details-content">
            <div class="mission-details-header">
              <h3>${mission.name}</h3>
              <button class="btn-close-modal" onclick="window.MissionBoardRenderer.closeMissionDetails()">×</button>
            </div>
            
            <div class="mission-details-body">
              <p class="mission-details-description">${mission.description}</p>
              
              ${this.renderMissionFullDetails(mission)}
              
              <div class="mission-details-rewards">
                <h4>Rewards:</h4>
                ${this.renderRewards(mission.rewards)}
              </div>
            </div>

            <div class="mission-details-footer">
              <button class="btn-start-mission-large" onclick="window.MissionBoardRenderer.startMission('${mission.id}')">
                Start Mission
              </button>
            </div>
          </div>
        </div>
      `;
    },

    // Render full mission details
    renderMissionFullDetails(mission) {
      let html = '<div class="mission-full-details">';

      if (mission.type === 'hunt') {
        html += `
          <div class="mission-detail-row">
            <strong>Target:</strong> ${mission.targetEnemy || 'Unknown'}
          </div>
          <div class="mission-detail-row">
            <strong>Required Kills:</strong> ${mission.targetCount || 1}
          </div>
        `;
      } else if (mission.type === 'survival') {
        const minutes = Math.floor((mission.duration || 0) / 60000);
        html += `
          <div class="mission-detail-row">
            <strong>Duration:</strong> ${minutes} minute${minutes !== 1 ? 's' : ''}
          </div>
          <div class="mission-detail-row">
            <strong>Enemy Type:</strong> ${mission.enemyType || 'Mixed'}
          </div>
          <div class="mission-detail-row">
            <strong>Spawn Rate:</strong> ${mission.spawnRate || 1} per second
          </div>
        `;
      } else if (mission.type === 'boss_rush') {
        html += `
          <div class="mission-detail-row">
            <strong>Bosses:</strong> ${mission.bosses.length}
          </div>
          <div class="mission-boss-list">
            ${mission.bosses.map(bossId => `<span class="boss-tag">${bossId}</span>`).join('')}
          </div>
        `;
      } else if (mission.type === 'tower') {
        html += `
          <div class="mission-detail-row">
            <strong>Floor:</strong> ${mission.floor}
          </div>
          <div class="mission-detail-row">
            <strong>Waves:</strong> ${mission.waves}
          </div>
          <div class="mission-detail-row">
            <strong>Boss:</strong> ${mission.boss || 'None'}
          </div>
        `;
      } else if (mission.type === 'dungeon') {
        html += `
          <div class="mission-detail-row">
            <strong>Rooms:</strong> ${mission.rooms}
          </div>
        `;
      }

      html += '</div>';
      return html;
    },

    // Render mission preview
    renderMissionPreview(mission) {
      if (mission.type === 'hunt') {
        return `<div class="mission-preview">Kill ${mission.targetCount || 1} ${mission.targetEnemy || 'enemies'}</div>`;
      } else if (mission.type === 'survival') {
        const minutes = Math.floor((mission.duration || 0) / 60000);
        return `<div class="mission-preview">Survive ${minutes} minute${minutes !== 1 ? 's' : ''}</div>`;
      } else if (mission.type === 'boss_rush') {
        return `<div class="mission-preview">Fight ${mission.bosses.length} bosses</div>`;
      } else if (mission.type === 'tower') {
        return `<div class="mission-preview">Floor ${mission.floor} - ${mission.waves} waves</div>`;
      } else if (mission.type === 'dungeon') {
        return `<div class="mission-preview">${mission.rooms} rooms</div>`;
      }
      return '';
    },

    // Render mission progress
    renderMissionProgress(mission, progress) {
      const progressPercent = Math.min((progress.current / progress.target) * 100, 100);
      
      let progressText = '';
      if (mission.type === 'hunt') {
        progressText = `Killed: ${progress.current} / ${progress.target}`;
      } else if (mission.type === 'survival') {
        const seconds = Math.floor(progress.current / 1000);
        const minutes = Math.floor(seconds / 60);
        progressText = `Survived: ${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
      } else if (mission.type === 'boss_rush') {
        progressText = `Bosses Defeated: ${progress.current} / ${progress.target}`;
      } else if (mission.type === 'tower') {
        progressText = `Waves Cleared: ${progress.current} / ${progress.target}`;
      } else if (mission.type === 'dungeon') {
        progressText = `Rooms Explored: ${progress.current} / ${progress.target}`;
      }

      return `
        <div class="mission-progress">
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${progressPercent}%"></div>
          </div>
          <div class="progress-text">${progressText}</div>
        </div>
      `;
    },

    // Render rewards
    renderRewards(rewards) {
      if (!rewards) return '<div>No rewards</div>';

      let html = '<div class="rewards-list">';
      
      if (rewards.gold) {
        html += `<div class="reward-item"><span class="reward-icon">💰</span> ${rewards.gold} Gold</div>`;
      }
      
      if (rewards.xp) {
        html += `<div class="reward-item"><span class="reward-icon">⭐</span> ${rewards.xp} XP</div>`;
      }
      
      if (rewards.items && rewards.items.length > 0) {
        rewards.items.forEach(itemId => {
          html += `<div class="reward-item"><span class="reward-icon">📦</span> ${itemId}</div>`;
        });
      }

      html += '</div>';
      return html;
    },

    // Render rewards preview (compact)
    renderRewardsPreview(rewards) {
      if (!rewards) return '<div class="rewards-preview-empty">No rewards</div>';

      let parts = [];
      if (rewards.gold) parts.push(`💰${rewards.gold}`);
      if (rewards.xp) parts.push(`⭐${rewards.xp}`);
      if (rewards.items && rewards.items.length > 0) {
        parts.push(`📦${rewards.items.length} item${rewards.items.length !== 1 ? 's' : ''}`);
      }

      return `<div class="rewards-preview">${parts.join(' • ')}</div>`;
    },

    // Get mission type icon
    getMissionTypeIcon(type) {
      const icons = {
        hunt: '🎯',
        survival: '🧟',
        boss_rush: '⚔️',
        tower: '🏰',
        dungeon: '🏛️'
      };
      return icons[type] || '📋';
    },

    // Select mission (show details)
    selectMission(missionId) {
      this.selectedMission = missionId;
      this.renderMissionBoardTab();
    },

    // Close mission details
    closeMissionDetails() {
      this.selectedMission = null;
      this.renderMissionBoardTab();
    },

    // Start mission
    startMission(missionId) {
      const mission = window.MissionDatabase.getMissionById(missionId);
      if (!mission) {
        console.error('[MissionBoard] Mission not found:', missionId);
        return;
      }

      // Check if there's already an active mission
      if (window.gameState.missions.active) {
        if (!confirm('You already have an active mission. Abandon it and start this one?')) {
          return;
        }
      }

      // Initialize mission state
      if (!window.gameState.missions) {
        window.gameState.missions = { available: [], active: null, completed: [], progress: {} };
      }

      // Set active mission
      window.gameState.missions.active = {
        id: mission.id,
        startTime: Date.now(),
        ...mission
      };

      // Initialize progress
      let target = 1;
      if (mission.type === 'hunt') {
        target = mission.targetCount || 1;
      } else if (mission.type === 'survival') {
        target = mission.duration || 300000;
      } else if (mission.type === 'boss_rush') {
        target = mission.bosses.length;
      } else if (mission.type === 'tower') {
        target = mission.waves || 20;
      } else if (mission.type === 'dungeon') {
        target = mission.rooms || 5;
      }

      window.gameState.missions.progress[mission.id] = {
        current: 0,
        target: target
      };

      // Dispatch event for game to handle
      window.dispatchEvent(new CustomEvent('mission:started', {
        detail: { missionId: mission.id, mission: mission }
      }));

      // Show toast
      if (window.BagSystem && window.BagSystem.showToast) {
        window.BagSystem.showToast(`Mission started: ${mission.name}`);
      }

      // Switch to active tab
      this.currentSubsection = 'active';
      this.selectedMission = null;
      this.renderMissionBoardTab();
    },

    // Abandon mission
    abandonMission() {
      if (!confirm('Are you sure you want to abandon this mission?')) {
        return;
      }

      window.gameState.missions.active = null;
      this.renderMissionBoardTab();
    },

    // Teleport to location
    teleportToLocation(locationId, type) {
      const location = window.MissionDatabase.getMissionById(locationId);
      if (!location) {
        console.error('[MissionBoard] Location not found:', locationId);
        return;
      }

      // Dispatch event for game to handle teleportation
      window.dispatchEvent(new CustomEvent('dungeon:teleport', {
        detail: { locationId: locationId, location: location, type: type }
      }));

      if (window.BagSystem && window.BagSystem.showToast) {
        window.BagSystem.showToast(`Teleporting to ${location.name}...`);
      }

      // Close bag
      if (window.BagSystem && window.BagSystem.close) {
        setTimeout(() => window.BagSystem.close(), 500);
      }
    },

    // Attach event listeners
    attachEventListeners() {
      // Subsection tabs
      document.querySelectorAll('.mission-subtab').forEach(tab => {
        tab.addEventListener('click', (e) => {
          this.currentSubsection = e.currentTarget.dataset.subsection;
          this.renderMissionBoardTab();
        });
      });
    }
  };

  console.log('[MissionBoardRenderer] Mission board renderer ready');
})();

