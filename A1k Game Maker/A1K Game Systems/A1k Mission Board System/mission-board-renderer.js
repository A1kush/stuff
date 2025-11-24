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
    cinematicCleanupFns: [],
    activeColorGrade: null,
    flythroughActive: false,

    // Main render function for the Mission Board tab
    renderMissionBoardTab() {
      // Support both bag system integration and standalone mode
      const pane = document.getElementById('bagContentPane') || document.getElementById('missionContentPane');
      if (!pane) {
        console.error('[MissionBoardRenderer] No content pane found (bagContentPane or missionContentPane)');
        return;
      }

      const html = `
        <div class="mission-board-container">
          ${this.renderGatekeeperCTA()}
          <!-- Subsection Navigation -->
          <div class="mission-subsection-tabs">
            <button class="mission-subtab ${this.currentSubsection === 'available' ? 'active' : ''}" data-subsection="available">
              <span class="tab-icon">ðŸ“‹</span>
              <span class="tab-label">Available</span>
            </button>
            <button class="mission-subtab ${this.currentSubsection === 'active' ? 'active' : ''}" data-subsection="active">
              <span class="tab-icon">âš”ï¸</span>
              <span class="tab-label">Active</span>
            </button>
            <button class="mission-subtab ${this.currentSubsection === 'completed' ? 'active' : ''}" data-subsection="completed">
              <span class="tab-icon">âœ…</span>
              <span class="tab-label">Completed</span>
            </button>
            <button class="mission-subtab ${this.currentSubsection === 'dungeons' ? 'active' : ''}" data-subsection="dungeons">
              <span class="tab-icon">ðŸ°</span>
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
      this.handleCinematicPostRender();
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
            <h4 class="mission-type-title">ðŸŽ¯ Hunt Bounties</h4>
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
            <h4 class="mission-type-title">ðŸ§Ÿ Horde Survival</h4>
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
            <h4 class="mission-type-title">âš”ï¸ Boss Rush</h4>
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
            <h4 class="mission-type-title">ðŸ° Tower Floors</h4>
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
            <h4 class="mission-type-title">ðŸ›ï¸ Dungeon Runs</h4>
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
              <h4>ðŸ° Dungeon Raids (C-Rank to SSS-Rank)</h4>
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
              <h4>ðŸ° Towers</h4>
              <div class="dungeon-grid">
                ${towers.map(tower => this.renderDungeonCard(tower, 'tower')).join('')}
              </div>
            </div>
          `;
        }

        if (dungeons.length > 0) {
          html += `
            <div class="dungeon-section">
              <h4>ðŸ›ï¸ Dungeons</h4>
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
      const raidKeysOwned = window.gameState?.raidKeys ?? 0;
      const accent = dungeon.color || '#8df5ff';
      const [r, g, b] = this.hexToRgb(accent);
      return `
        <div class="dungeon-card ${dungeon.isCleared ? 'completed' : ''}" 
             data-rank-id="${dungeon.rankId}"
             data-rank-color="${accent}"
             tabindex="0"
             style="--dungeon-rank-color:${accent}; --dungeon-rank-color-rgb:${r},${g},${b};">
          <div class="dungeon-holo"></div>
          <div class="dungeon-card-inner">
            <div class="dungeon-header">
              <h4>${dungeon.name} Dungeons</h4>
              <span class="dungeon-type-badge" style="background-color: ${accent}20; color: ${accent};">
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
                  <span>${dungeon.entriesRemaining === 'Unlimited' ? 'âˆž' : dungeon.entriesRemaining} / ${dungeon.entriesUsed + (dungeon.entriesRemaining === 'Unlimited' ? 0 : parseInt(dungeon.entriesRemaining))}</span>
                </div>
                <div class="stat-row">
                  <span>Entry Cost:</span>
                  <span>${(dungeon.entryCostGold || 0).toLocaleString()} Gold</span>
                </div>
                <div class="stat-row">
                  <span>Raid Keys:</span>
                  <span>${dungeon.raidKeyCost || 0} required â€¢ ${raidKeysOwned} owned</span>
                </div>
                <div class="stat-row">
                  <span>Recommended Power:</span>
                  <span>${dungeon.recommendedPower?.toLocaleString?.() || 'â€”'}</span>
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
                    <div class="progress-bar" style="width: ${progressPercent}%; background-color: ${accent};"></div>
                  </div>
                  <div class="progress-text">${progress.floorsCleared} / ${progress.totalFloors} Floors Cleared</div>
                </div>
              ` : ''}
            </div>
            
            <div class="dungeon-footer">
              ${dungeon.canEnter ? `
                <button class="btn-enter-dungeon" 
                        onclick="window.MissionBoardRenderer.enterDungeonRaid('${dungeon.rankId}')"
                        style="background-color: ${accent};">
                  Enter Dungeon
                </button>
              ` : `
                <div class="dungeon-locked" style="color: ${accent};">
                  ${dungeon.cannotEnterReason || 'Locked'}
                </div>
              `}
              ${dungeon.isCleared ? `
                <div class="dungeon-completed-badge">âœ“ Rank Cleared</div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    },

    // Enter dungeon raid
    async enterDungeonRaid(rankId) {
      const playerLevel = window.gameState?.playerLevel || 1;
      const canEnter = window.DungeonProgression.canEnterDungeon(rankId, playerLevel);
      
      if (!canEnter.allowed) {
        alert(`Cannot enter dungeon: ${canEnter.reason}`);
        return;
      }
      
      const availableDungeons = window.DungeonProgression.getAvailableDungeons(playerLevel);
      const dungeonMeta = availableDungeons.find(d => d.rankId === rankId) || null;
      try {
        await this.runDungeonFlyThrough(rankId, dungeonMeta);
      } catch (error) {
        console.warn('[MissionBoardRenderer] Fly-through sequence interrupted', error);
      }
      
      const enterResult = window.DungeonProgression.enterDungeon(rankId);
      if (!enterResult.success) {
        alert(`Failed to enter dungeon: ${enterResult.error}`);
        return;
      }
      
    // Use the routed sequence when available; pick a fallback template otherwise so runs always start with a deterministic payload.
    const routeSequence = Array.isArray(enterResult.sequence) && enterResult.sequence.length > 0
      ? [...enterResult.sequence]
      : Object.keys(window.DungeonRoomData.roomTypes);
    const firstFloorId = routeSequence[0];
    const firstRoom = window.DungeonRoomGenerator.generateRoom(
      firstFloorId,
      rankId,
      1,
      0,
      routeSequence.length === 1
    );
    
    // Update the run object that enterDungeon already created
    const dungeonState = window.gameState.dungeons;
    const run = dungeonState.currentDungeon;
    if (run) {
      // Update the existing run object with room data
      run.sequence = routeSequence;
      run.floorIndex = 0;
      run.currentRoom = firstRoom;
      run.timeline = run.timeline || [];
    } else {
      // Fallback: create run if enterDungeon didn't create one (shouldn't happen)
      dungeonState.currentDungeon = {
        rankId,
        routeId: enterResult.routeId || null,
        sequence: routeSequence,
        floorIndex: 0,
        branchChoices: {},
        modifiers: enterResult.modifiers || {},
        startTime: Date.now(),
        clearedFloors: {},
        timeline: [],
        currentRoom: firstRoom
      };
    }
    dungeonState.currentRoom = firstRoom;
    
    if (window.CandyDungeonCombat) {
      window.CandyDungeonCombat.primeEncounter({ ...firstRoom, rankId });
    }
      
      // Dispatch event to start dungeon
      window.dispatchEvent(new CustomEvent('dungeon:raid_started', {
        detail: {
        rankId,
          room: firstRoom
        }
      }));
      
    // Sound hook helps reinforce the candy UI feedback; inline comment requested to clarify the intent.
    if (window.playCandySfx) {
      window.playCandySfx('ui-click');
    }
    
    if (window.BagSystem && window.BagSystem.showToast) {
      window.BagSystem.showToast(`Entering ${rankId}-Rank Dungeon: ${firstRoom.type.replace(/_/g, ' ')}`);
      }
      
      // Close bag and start dungeon
      if (window.BagSystem) {
        if (typeof window.BagSystem.createParticleEffect === 'function') {
          const bagWindowEl = document.getElementById('bagWindow');
          if (bagWindowEl) {
            const rect = bagWindowEl.getBoundingClientRect();
            const rankColor = window.DungeonRoomData?.ranks?.[rankId]?.color;
            window.BagSystem.createParticleEffect(
              'raid-entry',
              rect.left + rect.width / 2,
              rect.top + rect.height / 2,
              { color: rankColor, count: 22 }
            );
          }
        }
        window.BagSystem.close();
      }
    },

    // Render a mission card
    renderMissionCard(mission, isCompleted = false) {
      const difficultyStars = 'â­'.repeat(mission.difficulty || 1);
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
              <span class="completed-badge">âœ“ Completed</span>
            </div>
          `}
        </div>
      `;
    },

    // Render dungeon/tower card
    renderDungeonCard(location, type) {
      const accent = location.color || (type === 'tower' ? '#ffd77a' : '#7af8c8');
      const [r, g, b] = this.hexToRgb(accent);
      return `
        <div class="dungeon-card" data-location-id="${location.id}" data-rank-color="${accent}" tabindex="0" style="--dungeon-rank-color:${accent}; --dungeon-rank-color-rgb:${r},${g},${b};">
          <div class="dungeon-holo"></div>
          <div class="dungeon-card-inner">
            <div class="dungeon-header">
              <h4>${location.name}</h4>
              <span class="dungeon-type-badge" style="background-color:${accent}20; color:${accent};">${type === 'tower' ? 'ðŸ° Tower' : 'ðŸ›ï¸ Dungeon'}</span>
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

            <div class="dungeon-footer">
              <button class="btn-teleport" onclick="window.MissionBoardRenderer.teleportToLocation('${location.id}', '${type}')" style="background: ${accent};">
                ${type === 'tower' ? 'Enter Tower' : 'Enter Dungeon'}
              </button>
            </div>
          </div>
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
              <button class="btn-close-modal" onclick="window.MissionBoardRenderer.closeMissionDetails()">Ã—</button>
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
        html += `<div class="reward-item"><span class="reward-icon">ðŸ’°</span> ${rewards.gold} Gold</div>`;
      }
      
      if (rewards.xp) {
        html += `<div class="reward-item"><span class="reward-icon">â­</span> ${rewards.xp} XP</div>`;
      }
      
      if (rewards.items && rewards.items.length > 0) {
        rewards.items.forEach(itemId => {
          html += `<div class="reward-item"><span class="reward-icon">ðŸ“¦</span> ${itemId}</div>`;
        });
      }

      html += '</div>';
      return html;
    },

    // Render rewards preview (compact)
    renderRewardsPreview(rewards) {
      if (!rewards) return '<div class="rewards-preview-empty">No rewards</div>';

      let parts = [];
      if (rewards.gold) parts.push(`ðŸ’°${rewards.gold}`);
      if (rewards.xp) parts.push(`â­${rewards.xp}`);
      if (rewards.items && rewards.items.length > 0) {
        parts.push(`ðŸ“¦${rewards.items.length} item${rewards.items.length !== 1 ? 's' : ''}`);
      }

      return `<div class="rewards-preview">${parts.join(' â€¢ ')}</div>`;
    },

    // Get mission type icon
    getMissionTypeIcon(type) {
      const icons = {
        hunt: 'ðŸŽ¯',
        survival: 'ðŸ§Ÿ',
        boss_rush: 'âš”ï¸',
        tower: 'ðŸ°',
        dungeon: 'ðŸ›ï¸'
      };
      return icons[type] || 'ðŸ“‹';
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

    // Make sure the missions container exists before we read its properties; live sessions can hit this before init wires defaults.
    if (!window.gameState.missions) {
      window.gameState.missions = { available: [], active: null, completed: [], progress: {} };
    }

    // Shared handler so we can reuse the remaining start logic after any confirmation flow.
    const finalizeStart = () => {
      const missionsState = window.gameState.missions;
      const previous = missionsState.active;
      if (previous && previous.id && previous.id !== mission.id && missionsState.progress) {
        delete missionsState.progress[previous.id];
      }

      // Set active mission payload with start metadata
      missionsState.active = {
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
        target
      };

      // Dispatch event for game to handle
      window.dispatchEvent(new CustomEvent('mission:started', {
        detail: { missionId: mission.id, mission }
      }));

      // Show toast
      if (window.BagSystem?.showToast) {
        window.BagSystem.showToast(`Mission started: ${mission.name}`);
      }

      // Switch to active tab
      this.currentSubsection = 'active';
      this.selectedMission = null;
      this.renderMissionBoardTab();
    };

    // Check if there's already an active mission
    const existingMission = window.gameState.missions.active;
    if (existingMission) {
      if (existingMission.id === mission.id) {
        finalizeStart();
        return;
      }

      const confirmMessage = 'You already have an active mission. Abandon it and start this one?';
      if (window.BagSystem?.showConfirmDialog) {
        window.BagSystem.showConfirmDialog(
          confirmMessage,
          () => {
            window.gameState.missions.active = null;
            finalizeStart();
          },
          () => {
            // No-op when the user cancels; we intentionally leave the existing mission running.
          }
        );
        return;
      }

      if (!confirm(confirmMessage)) {
        return;
      }

      window.gameState.missions.active = null;
    }

    finalizeStart();

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

    handleCinematicPostRender() {
      this.detachCinematicCardListeners();
      if (this.currentSubsection === 'dungeons') {
        this.attachCinematicCardListeners();
      } else {
        this.clearAdaptiveColorGrade(true);
      }
    },

    attachCinematicCardListeners() {
      const cards = Array.from(document.querySelectorAll('.mission-board-container .dungeon-card'));
      if (!cards.length) {
        this.clearAdaptiveColorGrade(true);
        return;
      }
      this.cinematicCleanupFns = this.cinematicCleanupFns || [];

      cards.forEach((card) => {
        card.style.setProperty('--holo-tilt-x', '0deg');
        card.style.setProperty('--holo-tilt-y', '0deg');
        card.style.setProperty('--holo-spot-x', '50%');
        card.style.setProperty('--holo-spot-y', '50%');
        const onEnter = () => {
          const color = card.dataset.rankColor;
          if (color) {
            this.applyAdaptiveColorGrade(color);
          }
          card.classList.add('is-active');
        };
        const onLeave = () => {
          card.classList.remove('is-active');
          card.style.removeProperty('--holo-tilt-x');
          card.style.removeProperty('--holo-tilt-y');
          card.style.removeProperty('--holo-spot-x');
          card.style.removeProperty('--holo-spot-y');
          this.clearAdaptiveColorGrade();
        };
        const onMove = (evt) => this.updateHologramTilt(card, evt);
        const onFocus = () => onEnter();
        const onBlur = () => onLeave();

        card.addEventListener('mouseenter', onEnter);
        card.addEventListener('mouseleave', onLeave);
        card.addEventListener('mousemove', onMove);
        card.addEventListener('focus', onFocus);
        card.addEventListener('blur', onBlur);

        this.cinematicCleanupFns.push(() => {
          card.removeEventListener('mouseenter', onEnter);
          card.removeEventListener('mouseleave', onLeave);
          card.removeEventListener('mousemove', onMove);
          card.removeEventListener('focus', onFocus);
          card.removeEventListener('blur', onBlur);
        });
      });

      const firstColoredCard = cards.find((card) => card.dataset.rankColor);
      if (firstColoredCard) {
        this.applyAdaptiveColorGrade(firstColoredCard.dataset.rankColor);
        firstColoredCard.classList.add('is-active');
        this.cinematicCleanupFns.push(() => firstColoredCard.classList.remove('is-active'));
      }
    },

    detachCinematicCardListeners() {
      if (!Array.isArray(this.cinematicCleanupFns)) return;
      while (this.cinematicCleanupFns.length) {
        const dispose = this.cinematicCleanupFns.pop();
        try {
          dispose?.();
        } catch (error) {
          console.warn('[MissionBoardRenderer] Failed to dispose cinematic listener', error);
        }
      }
      this.cinematicCleanupFns = [];
    },

    updateHologramTilt(card, evt) {
      const rect = card.getBoundingClientRect();
      const relX = Math.min(Math.max((evt.clientX - rect.left) / rect.width, 0), 1);
      const relY = Math.min(Math.max((evt.clientY - rect.top) / rect.height, 0), 1);
      const tiltX = (0.5 - relY) * 10;
      const tiltY = (relX - 0.5) * 12;
      card.style.setProperty('--holo-tilt-x', `${tiltX}deg`);
      card.style.setProperty('--holo-tilt-y', `${tiltY}deg`);
      card.style.setProperty('--holo-spot-x', `${(relX * 100).toFixed(2)}%`);
      card.style.setProperty('--holo-spot-y', `${(relY * 100).toFixed(2)}%`);
    },

    applyAdaptiveColorGrade(color) {
      if (!color) return;
      const body = document.body;
      if (!body) return;
      const [r, g, b] = this.hexToRgb(color);
      body.classList.add('mission-grade-active');
      body.style.setProperty('--mission-grade-color-rgb', `${r}, ${g}, ${b}`);
      this.activeColorGrade = color;
    },

    clearAdaptiveColorGrade(force = false) {
      if (!force && !this.activeColorGrade) return;
      const body = document.body;
      if (!body) return;
      body.classList.remove('mission-grade-active');
      body.style.removeProperty('--mission-grade-color-rgb');
      this.activeColorGrade = null;
    },

    hexToRgb(hex) {
      if (typeof hex !== 'string') return [147, 51, 234];
      let normalized = hex.replace('#', '').trim();
      if (normalized.length === 3) {
        normalized = normalized.split('').map((char) => char + char).join('');
      }
      const value = parseInt(normalized, 16);
      if (Number.isNaN(value)) return [147, 51, 234];
      return [
        (value >> 16) & 255,
        (value >> 8) & 255,
        value & 255
      ];
    },

    async runDungeonFlyThrough(rankId, dungeonMeta) {
      if (window.DungeonCinematicsDev?.skipFlyThrough) {
        return;
      }
      if (this.flythroughActive) {
        return;
      }
      this.flythroughActive = true;
      const accent = dungeonMeta?.color || '#8df5ff';
      const [r, g, b] = this.hexToRgb(accent);
      this.applyAdaptiveColorGrade(accent);

      const duration = window.DungeonCinematicsDev?.flyThroughDuration ?? 1400;

      await new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'dungeon-flythrough';
        overlay.style.setProperty('--mission-grade-color-rgb', `${r}, ${g}, ${b}`);
        overlay.innerHTML = `
          <div class="flythrough-layer layer-stars" style="background: radial-gradient(circle at center, rgba(${r}, ${g}, ${b}, 0.22), transparent 68%);"></div>
          <div class="flythrough-layer layer-grid" style="background: radial-gradient(circle at center, rgba(${r}, ${g}, ${b}, 0.3), transparent 70%);"></div>
          <div class="flythrough-title">
            <div class="flythrough-rank" style="color:${accent};">
              <span>${rankId || 'Rank'}</span>
              <span>Gate</span>
            </div>
            <div class="flythrough-name">${dungeonMeta?.name || 'Unknown Dungeon'}</div>
            <div class="flythrough-hint">Tap to skip</div>
          </div>
        `;

        let finished = false;
        const finalize = () => {
          if (finished) return;
          finished = true;
          overlay.classList.add('is-skip-ready');
          overlay.style.pointerEvents = 'none';
          overlay.style.animation = 'flythroughFade 0.55s ease-out reverse';
          window.BagSystem?.stopAudioLayer?.('flythrough-swell');
          window.setTimeout(() => {
            if (overlay.parentNode) overlay.remove();
            resolve();
          }, 260);
        };

        window.setTimeout(finalize, duration);
        overlay.addEventListener('click', finalize, { once: true });
        document.body.appendChild(overlay);

        window.requestAnimationFrame(() => {
          window.BagSystem?.createParticleEffect?.('raid-entry', window.innerWidth / 2, window.innerHeight / 2, {
            colors: [accent, '#ffffff'],
            count: 18
          });
          window.BagSystem?.createParticleEffect?.('raid-contrail', window.innerWidth / 2, window.innerHeight / 2, {
            colors: [accent, '#ffffff'],
            count: 16,
            duration: duration
          });
          window.BagSystem?.playAudioLayer?.('flythrough-swell', {
            waveform: 'sine',
            frequency: 420,
            gain: 0.12,
            duration: duration / 1000 + 0.4
          });
        });
      }).catch(() => {});

      this.flythroughActive = false;
      if (!window.DungeonCinematicsDev?.persistGradeAfterFlyThrough) {
        this.clearAdaptiveColorGrade(true);
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

