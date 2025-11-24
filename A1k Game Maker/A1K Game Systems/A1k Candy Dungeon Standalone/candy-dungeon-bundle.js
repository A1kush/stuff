(function candyDungeonProgressionModule() {
  'use strict';

  if (!window.CandyDungeonCatalog) {
    console.warn('[CandyDungeonProgression] CandyDungeonCatalog missing; progression system not initialised.');
    return;
  }

  const RANK_ORDER = ['C', 'B', 'A', 'S', 'SS', 'SSS'];
  const catalog = window.CandyDungeonCatalog;
  const floorById = catalog.floorTemplates.reduce((acc, floor) => {
    acc[floor.id] = floor;
    return acc;
  }, {});
  const routeById = catalog.branchingPaths.reduce((acc, route, index) => {
    const mappedRank = RANK_ORDER[Math.min(index + 3, RANK_ORDER.length - 1)]; // push candy routes into higher ranks
    acc[route.id] = { ...route, mappedRank };
    return acc;
  }, {});

  const defaultRankPalette = {
    C: '#8df5ff',
    B: '#7af8c8',
    A: '#ffd77a',
    S: '#ff9a9e',
    SS: '#a78bfa',
    SSS: '#ff6bff'
  };

  const ensureDungeonState = () => {
    if (!window.gameState) {
      window.gameState = {};
    }
    if (!window.gameState.dungeons) {
      window.gameState.dungeons = {
        unlockedRanks: ['C'],
        clearedFloors: {},
        dailyEntries: {},
        bestTimes: {},
        lastResetDate: new Date().toDateString(),
        currentRouteId: null,
        currentDungeon: null,
        currentRoom: null
      };
    }
    if (typeof window.gameState.raidKeys === 'undefined') {
      window.gameState.raidKeys = 0;
    }
    return window.gameState.dungeons;
  };

  const baseRankConfig = {
    C: { unlockLevel: 25, floors: 4, dailyEntries: 3, rewardMultiplier: 1.0, defaultRouteId: 'candy_campaign_route_a' },
    B: { unlockLevel: 30, floors: 5, dailyEntries: 3, rewardMultiplier: 1.1, defaultRouteId: 'candy_campaign_route_a' },
    A: { unlockLevel: 35, floors: 5, dailyEntries: 2, rewardMultiplier: 1.3, defaultRouteId: 'candy_campaign_route_b' },
    S: { unlockLevel: 40, floors: 6, dailyEntries: 2, rewardMultiplier: 1.6, defaultRouteId: 'candy_campaign_route_b' },
    SS: { unlockLevel: 45, floors: 6, dailyEntries: 1, rewardMultiplier: 1.9, defaultRouteId: 'candy_campaign_route_c' },
    SSS: { unlockLevel: 50, floors: 7, dailyEntries: 1, rewardMultiplier: 2.3, defaultRouteId: 'candy_campaign_route_c' }
  };

  const buildRankDefinition = (rankId) => {
    const config = baseRankConfig[rankId];
    const linkedRoute = Object.values(routeById).find(route => route.mappedRank === rankId) || routeById[config.defaultRouteId];
    const dominantCharacter = catalog.characters[Math.min(RANK_ORDER.indexOf(rankId), catalog.characters.length - 1)];
    const entryCostGold = linkedRoute?.modifiers?.entryCostGold || (400000 + RANK_ORDER.indexOf(rankId) * 250000);
    const raidKeyCost = linkedRoute?.modifiers?.raidKeys || Math.max(1, RANK_ORDER.indexOf(rankId) - 1);

    return {
      rankId,
      name: `${rankId}-Rank Candy Gate`,
      description: linkedRoute?.description || 'Clear candy dungeons to stabilise the Solo Leveling economy.',
      color: defaultRankPalette[rankId] || '#ffffff',
      icon: '🍭',
      unlockLevel: config.unlockLevel,
      floors: config.floors,
      roomsPerFloor: 3,
      dailyEntries: config.dailyEntries,
      rewardMultiplier: config.rewardMultiplier,
      entryCostGold,
      raidKeyCost,
      lootMultiplier: linkedRoute?.modifiers?.lootMultiplier || 1,
      timedRushSeconds: linkedRoute?.modifiers?.timedRushSeconds || null,
      hardcore: Boolean(linkedRoute?.modifiers?.hardcore),
      routeId: linkedRoute?.id || config.defaultRouteId,
      recommendedPower: dominantCharacter?.recommendedStats?.power || 1800,
      recommendedAura: dominantCharacter?.auraColor || '#ffffff',
      dominantCharacterId: dominantCharacter?.id
    };
  };

  const ranks = RANK_ORDER.reduce((acc, rankId) => {
    acc[rankId] = buildRankDefinition(rankId);
    return acc;
  }, {});

  window.DungeonRoomData = {
    ranks,
    roomTypes: catalog.floorTemplates.reduce((acc, template) => {
      acc[template.id] = {
        id: template.id,
        type: template.type,
        icon: template.icon,
        description: template.description
      };
      return acc;
    }, {})
  };

  window.DungeonRoomGenerator = {
    /**
     * Generates a floor payload used by the dungeon renderer.
     * The data is kept descriptive so the UI can decide how much detail to surface per view.
     */
    generateRoom(roomId, rankId, floorNumber, roomIndex, isBossRoom) {
      const template = floorById[roomId];
      if (!template) {
        return {
          id: roomId,
          type: 'unknown',
          title: 'Uncharted Floor',
          description: 'The route reference is missing from CandyDungeonCatalog.',
          encounters: [],
          recommendedSkills: []
        };
      }

      const desiredSkills = (template.skillHighlights || [])
        .map((skillId) => catalog.skills.find((skill) => skill.id === skillId))
        .filter(Boolean);

      return {
        id: roomId,
        type: template.type,
        icon: template.icon,
        title: template.type === 'boss' ? 'Boss Arena' : `Floor ${floorNumber}`,
        description: template.description,
        isBoss: Boolean(isBossRoom || template.type === 'boss'),
        floorNumber,
        roomIndex,
        encounters: template.spawnTable || template.enemySquads || [],
        puzzleRules: template.puzzleRules || null,
        branchOptions: template.branchOptions || null,
        recommendedSkills: desiredSkills,
        rewards: template.rewards || template.rewardPreview || [],
        environmentalHazards: template.environmentalHazards || []
      };
    }
  };

  const getRankState = (state, rankId) => {
    if (!state.clearedFloors[rankId]) {
      state.clearedFloors[rankId] = {};
    }
    if (!state.dailyEntries[rankId] && state.dailyEntries[rankId] !== 0) {
      state.dailyEntries[rankId] = 0;
    }
    return state.clearedFloors[rankId];
  };

  window.DungeonProgression = {
    getAvailableDungeons(playerLevel = 1) {
      const state = ensureDungeonState();
      return Object.values(window.DungeonRoomData.ranks)
        .filter((rank) => playerLevel >= rank.unlockLevel)
        .map((rank) => {
          const entriesUsed = state.dailyEntries[rank.rankId] || 0;
          const remaining = rank.dailyEntries === 0 ? 'Unlimited'
            : Math.max(rank.dailyEntries - entriesUsed, 0);
          const canEnter = this.canEnterDungeon(rank.rankId, playerLevel);

          return {
            rankId: rank.rankId,
            name: rank.name,
            description: rank.description,
            color: rank.color,
            icon: rank.icon,
            floors: rank.floors,
            roomsPerFloor: rank.roomsPerFloor,
            entriesRemaining: remaining,
            entriesUsed,
            rewardMultiplier: rank.rewardMultiplier,
            lootMultiplier: rank.lootMultiplier,
            timedRushSeconds: rank.timedRushSeconds,
            hardcore: rank.hardcore,
            entryCostGold: rank.entryCostGold,
            raidKeyCost: rank.raidKeyCost,
            recommendedPower: rank.recommendedPower,
            dominantCharacterId: rank.dominantCharacterId,
            isCleared: this.isRankCleared(rank.rankId),
            canEnter: canEnter.allowed,
            cannotEnterReason: canEnter.allowed ? null : canEnter.reason
          };
        });
    },

    getRankProgress(rankId) {
      const state = ensureDungeonState();
      const rank = window.DungeonRoomData.ranks[rankId];
      if (!rank) return null;
      const clearedFloors = getRankState(state, rankId);
      const totalFloors = rank.floors;
      const clearedCount = Object.keys(clearedFloors).filter((floorKey) => clearedFloors[floorKey]?.cleared).length;
      return {
        rankId,
        floorsCleared: clearedCount,
        totalFloors,
        progressPercent: totalFloors > 0 ? Math.round((clearedCount / totalFloors) * 100) : 0
      };
    },

    canEnterDungeon(rankId, playerLevel) {
      const rank = window.DungeonRoomData.ranks[rankId];
      if (!rank) {
        return { allowed: false, reason: 'Rank configuration missing.' };
      }

      if (playerLevel < rank.unlockLevel) {
        return { allowed: false, reason: `Requires level ${rank.unlockLevel}` };
      }

      const state = ensureDungeonState();
      if (!state.unlockedRanks.includes(rankId)) {
        const index = RANK_ORDER.indexOf(rankId);
        if (index > 0) {
          const prevRank = RANK_ORDER[index - 1];
          if (!this.isRankCleared(prevRank)) {
            return { allowed: false, reason: `Clear ${prevRank}-Rank dungeons first.` };
          }
        }
      }

      const entriesUsed = state.dailyEntries[rankId] || 0;
      if (rank.dailyEntries > 0 && entriesUsed >= rank.dailyEntries) {
        return { allowed: false, reason: 'Daily entry limit reached.' };
      }

      if ((window.gameState.gold || 0) < rank.entryCostGold) {
        return { allowed: false, reason: `Need ${rank.entryCostGold.toLocaleString()} gold.` };
      }

      if ((window.gameState.raidKeys || 0) < rank.raidKeyCost) {
        return { allowed: false, reason: `Need ${rank.raidKeyCost} raid key${rank.raidKeyCost > 1 ? 's' : ''}.` };
      }

      return { allowed: true };
    },

    isRankCleared(rankId) {
      const state = ensureDungeonState();
      const rank = window.DungeonRoomData.ranks[rankId];
      if (!rank) return false;
      const clearedFloors = state.clearedFloors[rankId];
      if (!clearedFloors) return false;
      for (let i = 1; i <= rank.floors; i += 1) {
        if (!clearedFloors[i]?.cleared) {
          return false;
        }
      }
      return true;
    },

    enterDungeon(rankId) {
      const state = ensureDungeonState();
      const rank = window.DungeonRoomData.ranks[rankId];
      if (!rank) {
        return { success: false, error: 'Rank not found.' };
      }

      const gatecheck = this.canEnterDungeon(rankId, window.gameState.playerLevel || 1);
      if (!gatecheck.allowed) {
        return { success: false, error: gatecheck.reason };
      }

      window.gameState.gold -= rank.entryCostGold;
      window.gameState.raidKeys -= rank.raidKeyCost;

      state.dailyEntries[rankId] = (state.dailyEntries[rankId] || 0) + 1;
      if (!state.unlockedRanks.includes(rankId)) {
        state.unlockedRanks.push(rankId);
      }

      const route = Object.values(routeById).find((candidate) => candidate.mappedRank === rankId) || routeById[rank.routeId];
      state.currentRouteId = route?.id || rank.routeId;
      const sequence = route?.sequence || [];

      const run = {
        rankId,
        routeId: state.currentRouteId,
        sequence,
        floorIndex: 0,
        branchChoices: {},
        modifiers: { ...(route?.modifiers || {}), rewardMultiplier: rank.rewardMultiplier },
        startTime: Date.now(),
        clearedFloors: {},
        timeline: []
      };
      state.currentDungeon = run;

      return {
        success: true,
        routeId: state.currentRouteId,
        sequence,
        modifiers: rank
      };
    },

    clearFloor(rankId, floorNumber, clearTimeMs = null) {
      const state = ensureDungeonState();
      const clearedFloors = getRankState(state, rankId);
      clearedFloors[floorNumber] = {
        cleared: true,
        clearedAt: Date.now(),
        time: clearTimeMs
      };

      if (state.currentDungeon && state.currentDungeon.rankId === rankId) {
        state.currentDungeon.clearedFloors[floorNumber] = clearedFloors[floorNumber];
      }

      if (this.isRankCleared(rankId)) {
        const nextIndex = RANK_ORDER.indexOf(rankId) + 1;
        if (nextIndex < RANK_ORDER.length) {
          const nextRank = RANK_ORDER[nextIndex];
          if (!state.unlockedRanks.includes(nextRank)) {
            state.unlockedRanks.push(nextRank);
            window.dispatchEvent(new CustomEvent('dungeon:rank_unlocked', { detail: { rankId: nextRank } }));
          }
        }
        window.dispatchEvent(new CustomEvent('dungeon:rank_cleared', { detail: { rankId } }));
      }
    },

    getCurrentDungeonState() {
      const state = ensureDungeonState();
      const run = state.currentDungeon;
      if (!run) return null;
      const rank = window.DungeonRoomData?.ranks?.[run.rankId];
      const clearedFloors = state.clearedFloors[run.rankId] || {};
      return {
        ...run,
        totalFloors: rank?.floors || run.sequence?.length || 0,
        clearedFloors,
        currentRoom: run.currentRoom || window.gameState.dungeons.currentRoom || null
      };
    },

    getFloorTimeline() {
      const run = this.getCurrentDungeonState();
      if (!run) return [];
      const cleared = run.clearedFloors || {};
      return (run.sequence || []).map((roomId, index) => {
        const floorNumber = index + 1;
        const template = floorById[roomId] || { icon: '🍬', description: roomId };
        let status = 'upcoming';
        if (cleared[floorNumber]?.cleared) {
          status = 'cleared';
        } else if (index === run.floorIndex) {
          status = 'current';
        }
        return {
          floorNumber,
          roomId,
          icon: template.icon || '🍬',
          description: template.description || 'Encounter',
          status,
          branchChoice: run.branchChoices?.[floorNumber] || null
        };
      });
    },

    advanceCurrentFloor(options = {}) {
      const state = ensureDungeonState();
      const run = state.currentDungeon;
      if (!run) {
        return { success: false, error: 'No dungeon run active.' };
      }

      const sequence = run.sequence || [];
      const index = run.floorIndex ?? 0;
      const rankId = run.rankId;
      const currentRoom = run.currentRoom || window.gameState.dungeons.currentRoom;
      if (!currentRoom) {
        return { success: false, error: 'Current room not available.' };
      }

      const floorNumber = index + 1;
      if (Array.isArray(currentRoom.branchOptions) && currentRoom.branchOptions.length > 0) {
        if (!options.branchId) {
          return { success: false, error: 'Branch selection required.', branchRequired: true };
        }
        const selected = currentRoom.branchOptions.find(opt => opt.branchId === options.branchId);
        if (!selected) {
          return { success: false, error: 'Invalid branch selection.' };
        }
        run.branchChoices[floorNumber] = selected;
        if (selected.modifiers) {
          run.modifiers = { ...(run.modifiers || {}), ...selected.modifiers };
        }
      }

      if (!run.clearedFloors[floorNumber]) {
        this.clearFloor(rankId, floorNumber, options.clearTimeMs || null);
        run.clearedFloors[floorNumber] = state.clearedFloors[rankId][floorNumber];
      }

      run.timeline.push({
        type: 'floor-cleared',
        floor: floorNumber,
        roomId: sequence[index],
        branchId: options.branchId || null,
        timestamp: Date.now()
      });

      if (index >= sequence.length - 1) {
        run.floorIndex = index;
        run.finished = true;
        run.currentRoom = null;
        state.currentDungeon = run;
        return { success: true, finished: true };
      }

      run.floorIndex = index + 1;
      const nextRoomId = sequence[run.floorIndex];
      const nextRoom = window.DungeonRoomGenerator.generateRoom(
        nextRoomId,
        rankId,
        run.floorIndex + 1,
        0,
        run.floorIndex === sequence.length - 1
      );
      window.gameState.dungeons.currentRoom = nextRoom;
      run.currentRoom = nextRoom;
      state.currentDungeon = run;
      window.CandyDungeonCombat?.primeEncounter({ ...nextRoom, rankId });
      window.dispatchEvent(new CustomEvent('dungeon:next_room', {
        detail: { rankId, room: nextRoom, floorIndex: run.floorIndex }
      }));
      return { success: true, finished: false, room: nextRoom };
    },

    recordTimelineEntry(entry) {
      const state = ensureDungeonState();
      const run = state.currentDungeon;
      if (!run) return;
      run.timeline.push({ ...entry });
    }
  };

  window.dispatchEvent(new CustomEvent('candy-dungeon:progression-ready'));
})();

(function candyDungeonCampaignModule() {
  'use strict';

  const storyLog = [];
  const ensureDungeonState = () => {
    if (!window.gameState) window.gameState = {};
    if (!window.gameState.dungeons) {
      window.gameState.dungeons = {
        unlockedRanks: ['C'],
        clearedFloors: {},
        dailyEntries: {},
        bestTimes: {},
        lastResetDate: new Date().toDateString(),
        currentRouteId: null
      };
    }
    return window.gameState.dungeons;
  };

  const catalogReady = () => Array.isArray(window.CandyDungeonCatalog?.branchingPaths);

  const routeCopy = {
    candy_campaign_route_a: {
      intro: '“The Sugar Citadel is overrun. Stabilise the plaza, then descend toward the nougat avatar.”',
      branch: 'The gate fractures — choose between speed-clearing sugar slides or the caramel vault.',
      boss: 'The Shadow Nougat Avatar condenses all stolen aura. This is the showdown.'
    },
    candy_campaign_route_b: {
      intro: '“Emergency call: split squads between sprint lanes and vault raids. Timers will matter here.”',
      branch: 'Decision point: sprint for leaderboard glory or pillage the caramel vault for extra loot.',
      boss: 'Nougat avatar shifts timelines, forcing the team to weave skills between phases.'
    },
    candy_campaign_route_c: {
      intro: '“Hardcore directive: All modifiers active. Expect chained elites and aura anomalies.”',
      branch: 'No safe path. Pick the anomaly you hate the least and keep aura seals ready.',
      boss: 'Chrono collapse imminent — landing the final sequence is the only way to close the gate.'
    }
  };

  const campaign = {
    log: storyLog,
    pushStory(payload) {
      storyLog.push(payload);
      window.dispatchEvent(new CustomEvent('candy-dungeon:story', { detail: payload }));
      if (window.BagSystem?.addSystemMessage) {
        window.BagSystem.addSystemMessage(`📖 ${payload.headline}`, 'lore');
      }
      window.DungeonProgression?.recordTimelineEntry?.(payload);
    },
    showRecapCard({ title, subtitle, rewards, icon = '🍬' }) {
      const panel = document.createElement('div');
      panel.className = 'candy-dungeon-recap';
      const rewardCopy = Array.isArray(rewards) && rewards.length > 0
        ? rewards.map((reward) => `<span class="recap-reward">${reward}</span>`).join('')
        : '<span class="recap-reward">Loot secured</span>';
      panel.innerHTML = `
        <div class="recap-icon">${icon}</div>
        <div class="recap-copy">
          <div class="recap-title">${title}</div>
          <div class="recap-subtitle">${subtitle}</div>
          <div class="recap-rewards">${rewardCopy}</div>
        </div>
      `;
      document.body.appendChild(panel);
      requestAnimationFrame(() => panel.classList.add('visible'));
      setTimeout(() => panel.classList.remove('visible'), 4200);
      setTimeout(() => panel.remove(), 4700);
    },
    describeRoute(routeId) {
      return routeCopy[routeId] || {
        intro: 'Candy scouts request reinforcements. Descend and neutralise the threat.',
        branch: 'An unstable gate offers multiple paths; pick one and move.',
        boss: 'The final guardian channels pure sugar mana — defeat it to restore balance.'
      };
    },
    handleRaidStarted(event) {
      if (!catalogReady()) return;
      const state = ensureDungeonState();
      const { rankId, room } = event.detail || {};
      const route = this.describeRoute(state.currentRouteId);
      this.activeRunStart = Date.now();
      this.pushStory({
        type: 'intro',
        headline: `Candy Campaign Begins (${rankId}-Rank)`,
        narration: route.intro,
        room,
        timestamp: Date.now()
      });
      if (window.CandyDungeonCatalog.cinematics?.intro) {
        this.pushStory({
          type: 'cinematic',
          headline: window.CandyDungeonCatalog.cinematics.intro.headline,
          narration: window.CandyDungeonCatalog.cinematics.intro.narration,
          asset: window.CandyDungeonCatalog.cinematics.intro
        });
      }
    },
    handleFloorCleared(event) {
      if (!catalogReady()) return;
      const { rankId, floor } = event.detail || {};
      const state = ensureDungeonState();
      const route = this.describeRoute(state.currentRouteId);
      const isBranchPoint = floor === 2;
      const beat = isBranchPoint ? route.branch : 'Sector secure. Candy civilians cheer from the rooftops.';
      this.pushStory({
        type: 'progress',
        headline: `Floor ${floor} Cleared (${rankId}-Rank)`,
        narration: beat,
        timestamp: Date.now()
      });
      const currentRoom = window.gameState?.dungeons?.currentRoom || null;
      this.showRecapCard({
        title: `Floor ${floor} Cleared`,
        subtitle: beat,
        rewards: currentRoom?.rewards || ['Candy loot secured'],
        icon: currentRoom?.icon || '🍬'
      });
      if (window.CandyDungeonCatalog.cinematics?.floorClear) {
        this.pushStory({
          type: 'cinematic',
          headline: window.CandyDungeonCatalog.cinematics.floorClear.headline,
          narration: window.CandyDungeonCatalog.cinematics.floorClear.narration,
          asset: window.CandyDungeonCatalog.cinematics.floorClear
        });
      }
    },
    handleRankCleared(event) {
      if (!catalogReady()) return;
      const { rankId } = event.detail || {};
      const state = ensureDungeonState();
      const route = this.describeRoute(state.currentRouteId);
      this.pushStory({
        type: 'boss',
        headline: `Boss Vanquished (${rankId}-Rank)`,
        narration: route.boss,
        timestamp: Date.now()
      });
      this.showRecapCard({
        title: `${rankId}-Rank Cleared`,
        subtitle: route.boss,
        rewards: ['Legendary Candy Relic', 'Solo Leveling Trophy'],
        icon: '👑'
      });
      if (window.CandyDungeonCatalog.cinematics?.bossIntro) {
        this.pushStory({
          type: 'cinematic',
          headline: window.CandyDungeonCatalog.cinematics.bossIntro.headline,
          narration: window.CandyDungeonCatalog.cinematics.bossIntro.narration,
          asset: window.CandyDungeonCatalog.cinematics.bossIntro
        });
      }
    },
    bootstrap() {
      window.addEventListener('dungeon:raid_started', (evt) => this.handleRaidStarted(evt));
      window.addEventListener('dungeon:floor_cleared', (evt) => this.handleFloorCleared(evt));
      window.addEventListener('dungeon:rank_cleared', (evt) => this.handleRankCleared(evt));
    }
  };

  campaign.bootstrap();
  window.CandyDungeonCampaign = campaign;
})();

(function candyDungeonCombatModule() {
  'use strict';

  const SKILL_SHAPE_BUFFS = {
    xwave: { offense: 0.08, defense: 0.02 },
    backstab_waltz: { offense: 0.15, defense: -0.04 },
    world_splitter: { offense: 0.18, timed: 0.05 },
    hyper_beam: { offense: 0.14, defense: -0.02 },
    cryo_rail: { offense: 0.1, defense: 0.06 },
    helix_drill: { offense: 0.12, defense: 0.03 },
    blade_dance: { offense: 0.1, haste: 0.05 },
    golden_rail: { offense: 0.09, defense: 0.04 },
    coin_cannon: { offense: 0.16, defense: -0.03 }
  };

  const combat = {
    activeBonuses: { offense: 0, defense: 0, haste: 0, timed: 0 },
    routeModifiers: { hardcore: 0, timedRushSeconds: null },
    primeEncounter(room) {
      if (!room) return;
      const bonuses = { offense: 0, defense: 0, haste: 0, timed: 0 };
      const skills = Array.isArray(room.recommendedSkills) ? room.recommendedSkills : [];
      skills.forEach((skill) => {
        const shape = skill.shape || '';
        const buff = SKILL_SHAPE_BUFFS[shape];
        if (buff) {
          bonuses.offense += buff.offense || 0;
          bonuses.defense += buff.defense || 0;
          bonuses.haste += buff.haste || 0;
          bonuses.timed += buff.timed || 0;
        }
      });
      this.activeBonuses = bonuses;
      const currentRank = room.rankId || window.gameState?.dungeons?.currentDungeon?.rankId;
      if (currentRank) {
        const rankConfig = window.DungeonRoomData?.ranks?.[currentRank];
        if (rankConfig) {
          this.routeModifiers.hardcore = rankConfig.hardcore ? 0.15 : 0;
          this.routeModifiers.timedRushSeconds = rankConfig.timedRushSeconds || null;
        }
      }
    },
    getPlayerMultiplier(state) {
      let multiplier = 1 + this.activeBonuses.offense;
      if (this.routeModifiers.hardcore > 0) {
        multiplier += this.routeModifiers.hardcore;
      }
      if (this.routeModifiers.timedRushSeconds && state?.turn && state.turn <= 5) {
        multiplier += this.activeBonuses.timed;
      }
      return Math.max(0.5, multiplier);
    },
    getBossMitigation() {
      const mitigation = 1 - this.activeBonuses.defense;
      return Math.max(0.3, mitigation);
    }
  };

  const attachToBagSystem = () => {
    const bag = window.BagSystem;
    if (!bag || typeof bag.calculateRaidPlayerDamage !== 'function' || typeof bag.applyRaidBossAttack !== 'function') {
      return false;
    }

    const originalDamage = bag.calculateRaidPlayerDamage.bind(bag);
    const originalBossAttack = bag.applyRaidBossAttack.bind(bag);

    bag.calculateRaidPlayerDamage = function patchedCandyDamage(playerStats, state, bossDef) {
        const base = originalDamage(playerStats, state, bossDef);
        const multiplier = combat.getPlayerMultiplier(state);
        return Math.round(base * multiplier);
      };

    bag.applyRaidBossAttack = function patchedCandyDefense(playerStats, state, bossDef, pattern) {
      const mitigation = combat.getBossMitigation();
      const adjustedState = { ...state };
      const baseResult = originalBossAttack(playerStats, adjustedState, bossDef, pattern);
      return Math.round(baseResult * mitigation);
    };
    return true;
  };

  if (!attachToBagSystem()) {
    const retry = () => attachToBagSystem() || setTimeout(retry, 150);
    window.addEventListener('bag-system:ready', () => attachToBagSystem());
    setTimeout(retry, 200);
  }

  window.CandyDungeonCombat = combat;
})();

(function candyDungeonUIBootstrap() {
  'use strict';

  const OVERLAY_ID = 'candyDungeonOverlay';
  const FLOORS_ID = 'candyDungeonFloors';
  const BRANCH_ID = 'candyDungeonBranch';
  const TIMELINE_ID = 'candyDungeonTimeline';

  const DEFAULT_RANK_COLOR = '#ff9a9e';

  const hexToRgb = (hex) => {
    if (typeof hex !== 'string') return [255, 154, 158];
    let normalized = hex.trim().replace('#', '');
    if (normalized.length === 3) {
      normalized = normalized.split('').map((char) => char + char).join('');
    }
    const numeric = parseInt(normalized, 16);
    if (Number.isNaN(numeric)) return [255, 154, 158];
    return [
      (numeric >> 16) & 255,
      (numeric >> 8) & 255,
      numeric & 255
    ];
  };

  window.DungeonCinematicsDev = window.DungeonCinematicsDev || {};
  window.DungeonCinematicsDev.skipFlyThrough = window.DungeonCinematicsDev.skipFlyThrough ?? false;
  window.DungeonCinematicsDev.flyThroughDuration = window.DungeonCinematicsDev.flyThroughDuration ?? 1400;
  window.DungeonCinematicsDev.persistGradeAfterFlyThrough = window.DungeonCinematicsDev.persistGradeAfterFlyThrough ?? false;
  window.DungeonCinematicsDev.timerMultiplier = window.DungeonCinematicsDev.timerMultiplier ?? 1;
  window.DungeonCinematicsDev.muteAmbient = window.DungeonCinematicsDev.muteAmbient ?? false;
  window.DungeonCinematicsDev.toggleFlyThroughSkip = function toggleFlyThroughSkip(value) {
    this.skipFlyThrough = typeof value === 'boolean' ? value : !this.skipFlyThrough;
    console.info('[CinematicsDev] skipFlyThrough:', this.skipFlyThrough);
    return this.skipFlyThrough;
  };
  window.DungeonCinematicsDev.setFlyThroughDuration = function setFlyThroughDuration(ms) {
    const parsed = Math.max(300, Number(ms) || 1400);
    this.flyThroughDuration = parsed;
    console.info('[CinematicsDev] flyThroughDuration set to', parsed, 'ms');
    return parsed;
  };
  window.DungeonCinematicsDev.setTimerMultiplier = function setTimerMultiplier(multiplier) {
    const parsed = Math.max(0.1, Number(multiplier) || 1);
    this.timerMultiplier = parsed;
    console.info('[CinematicsDev] timerMultiplier set to', parsed);
    return parsed;
  };
  window.DungeonCinematicsDev.toggleAmbientMute = function toggleAmbientMute(value) {
    this.muteAmbient = typeof value === 'boolean' ? value : !this.muteAmbient;
    console.info('[CinematicsDev] muteAmbient:', this.muteAmbient);
    return this.muteAmbient;
  };
  window.DungeonCinematicsDev.triggerRecap = function triggerRecap(detail = {}) {
    if (window.CandyDungeonUI && typeof window.CandyDungeonUI.showRaidRecap === 'function') {
      window.CandyDungeonUI.showRaidRecap({
        rankId: detail.rankId || window.CandyDungeonUI.currentRankId || 'QA'
      });
      console.info('[CinematicsDev] Manual recap triggered.');
    } else {
      console.warn('[CinematicsDev] CandyDungeonUI.showRaidRecap not available.');
    }
  };
  window.DungeonCinematicsDev.logTelemetry = function logTelemetry() {
    if (!window.OfflineBagTelemetry) {
      console.warn('[CinematicsDev] Telemetry module not initialised.');
      return;
    }
    console.groupCollapsed('[CinematicsDev] Telemetry Snapshot');
    console.table(window.OfflineBagTelemetry.timers || [], ['phase', 'remainingSeconds', 'totalSeconds']);
    console.table(window.OfflineBagTelemetry.branches || [], ['rankId', 'floor', 'label']);
    console.table(window.OfflineBagTelemetry.recaps || [], ['rankId', 'durationText', 'clearedFloors']);
    console.groupEnd();
  };

  const rgbToFrequency = ([r, g, b]) => {
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return 150 + luminance * 180; // Maps roughly to 150Hz – 330Hz range
  };

  const ui = {
    selectedBranch: null,
    playbackTimer: null,
    playbackIndex: 0,
    parallaxHandler: null,
    parallaxRaf: null,
    ambientCtx: null,
    ambientNodes: null,
    isAudioMuted: false,
    currentRankId: null,
    audioToggleButton: null,
    timerInterval: null,
    timerEndTime: null,
    timerDuration: null,
    activeTimerKey: null,
    timerMeta: null,
    shaderElement: null,
    recapElement: null,
    recapKeyHandler: null,
    lastRunSnapshot: null,

    init() {
      this.loadAudioPreference();
      window.addEventListener('dungeon:raid_started', (evt) => this.open(evt.detail));
      window.addEventListener('dungeon:floor_cleared', () => this.render());
      window.addEventListener('dungeon:next_room', (evt) => this.onNextRoom(evt));
      window.addEventListener('dungeon:rank_cleared', (evt) => {
        this.close({ keepShader: true, keepRecap: true });
        this.showRaidRecap(evt?.detail || {});
      });
      window.addEventListener('candy-dungeon:story', () => this.updateTimelinePanel());
    },

    open(detail) {
      this.close();
      this.removeRaidRecap();
      this.currentRankId = detail?.rankId || null;
      if (window.DungeonCinematicsDev?.muteAmbient === true) {
        this.isAudioMuted = true;
      }
      this.activateRaidBackdrop(this.currentRankId);
      if (!this.isAudioMuted) {
        this.playRankAmbient(this.currentRankId);
      }
      this.ensureReactiveShader();
      const overlay = document.createElement('div');
      overlay.id = OVERLAY_ID;
      overlay.className = 'candy-dungeon-overlay';
      overlay.setAttribute('tabindex', '-1');
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-label', 'Candy Dungeon Run Overlay');
      overlay.innerHTML = `
        <div class="overlay-header">
          <div>
            <div class="overlay-title">Candy Dungeon Run</div>
            <div class="overlay-subtitle">${detail?.rankId || ''}-Rank • ${detail?.room?.title || 'Floor 1'}</div>
          </div>
          <button class="overlay-close" data-action="close">✕</button>
        </div>
        <div class="overlay-body">
          <div class="overlay-metrics">
            <div class="timer-widget" data-role="timer">
              <div class="timer-head">
                <span class="timer-label">Timer</span>
                <span class="timer-countdown" id="candyDungeonTimer">--:--</span>
              </div>
              <div class="timer-progress">
                <div class="timer-progress-bar" id="candyDungeonTimerBar"></div>
              </div>
            </div>
            <button class="audio-toggle" type="button" data-action="toggle-audio" aria-pressed="false" title="Toggle ambient audio">
              <span class="audio-icon" aria-hidden="true">🔊</span>
            </button>
          </div>
          <div class="reward-ticker" id="candyDungeonTicker">
            <span class="ticker-empty">Initializing raid modifiers…</span>
          </div>
          <div class="story-beats" id="candyDungeonStory">
            <div class="story-beats-header">
              <div class="story-beats-title">Story Beats</div>
              <div class="story-beats-subtitle">Track your chapter progress</div>
            </div>
            <div class="story-beats-list" id="candyDungeonStoryList">
              <div class="story-empty">Enter a gate to unlock new chapters.</div>
            </div>
          </div>
          <div class="floor-track" id="${FLOORS_ID}"></div>
          <div class="branch-area" id="${BRANCH_ID}"></div>
          <div class="overlay-actions">
            <button class="overlay-btn overlay-advance" data-action="advance">Mark Floor Cleared</button>
            <button class="overlay-btn overlay-playback" data-action="playback">Play Timeline</button>
          </div>
          <div class="timeline-panel hidden" id="${TIMELINE_ID}">
            <div class="timeline-header">
              <span>Recap Timeline</span>
              <button class="overlay-btn overlay-stop hidden" data-action="stop-playback">Stop</button>
            </div>
            <div class="timeline-items"></div>
          </div>
        </div>
        <div class="overlay-footer" id="candyDungeonFooter">
          <div class="contextual-tip">Preparing raid intel...</div>
        </div>
      `;
      document.body.appendChild(overlay);
      overlay.classList.add('overlay-entering');
      setTimeout(() => overlay.classList.remove('overlay-entering'), 1000);
      overlay.classList.add('subtitle-pulsing');
      setTimeout(() => overlay.classList.remove('subtitle-pulsing'), 3200);
      window.requestAnimationFrame(() => {
        try {
          overlay.focus({ preventScroll: true });
        } catch (error) {
          overlay.focus();
        }
        overlay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });

      overlay.addEventListener('click', (evt) => {
        const actionTarget = evt.target?.closest('[data-action]');
        if (!actionTarget) return;
        const action = actionTarget.dataset.action;
        if (!action) return;
        if (action === 'close') {
          this.close();
        } else if (action === 'advance') {
          this.handleAdvance();
        } else if (action === 'playback') {
          this.startPlayback();
        } else if (action === 'stop-playback') {
          this.stopPlayback();
        } else if (action === 'toggle-audio') {
          this.toggleAmbientAudio();
        }
      });

      this.bindOverlayControls(overlay);
      this.render();
    },

    onNextRoom(evt) {
      const overlay = document.getElementById(OVERLAY_ID);
      if (!overlay) return;
      overlay.querySelector('.overlay-subtitle').textContent = `${evt.detail.rankId}-Rank • ${evt.detail.room.title}`;
      this.selectedBranch = null;
      this.render();
      this.currentRankId = evt.detail.rankId || this.currentRankId;
      if (!this.isAudioMuted) {
        this.playRankAmbient(this.currentRankId);
      }
    },

    handleAdvance() {
      const run = window.DungeonProgression?.getCurrentDungeonState?.();
      if (!run) return;
      const room = run.currentRoom || {};
      const needsBranch = Array.isArray(room.branchOptions) && room.branchOptions.length > 0;
      if (needsBranch && !this.selectedBranch) {
        this.flashBranchWarning();
        this.updateContextualTip(run);
        return;
      }
      const result = window.DungeonProgression.advanceCurrentFloor({
        branchId: this.selectedBranch || null
      });
      if (result.branchRequired) {
        this.flashBranchWarning();
        this.updateContextualTip(window.DungeonProgression?.getCurrentDungeonState?.());
      }
      if (result.finished) {
        this.selectedBranch = null;
        this.render();
      } else {
        this.updateContextualTip(window.DungeonProgression?.getCurrentDungeonState?.());
      }
    },

    flashBranchWarning() {
      const branchZone = document.getElementById(BRANCH_ID);
      if (!branchZone) return;
      branchZone.classList.add('branch-required');
      setTimeout(() => branchZone.classList.remove('branch-required'), 600);
    },

    render() {
      const overlay = document.getElementById(OVERLAY_ID);
      if (!overlay) return;
      const run = window.DungeonProgression?.getCurrentDungeonState?.();
      this.renderFloors(run);
      this.renderBranchOptions(run);
      this.updateTimelinePanel(run);
      this.updateRewardTicker(run);
      this.syncTimerState(run);
      this.updateContextualTip(run);
      this.renderStoryBeats(run);
      this.updateReactiveShader(run);
      this.updateAudioToggleUI();
      if (run) {
        this.lastRunSnapshot = this.captureRunSnapshot(run);
      }
    },

    renderFloors(run) {
      const container = document.getElementById(FLOORS_ID);
      if (!container) return;
      run = run || window.DungeonProgression?.getCurrentDungeonState?.();
      const timeline = window.DungeonProgression?.getFloorTimeline?.() || [];
      
      // If timeline is empty but we have a current room, show at least the current floor
      if (timeline.length === 0 && run && run.currentRoom) {
        const currentFloor = {
          floorNumber: run.currentRoom.floorNumber || run.floorIndex + 1,
          description: run.currentRoom.description || run.currentRoom.title || 'Current Floor',
          icon: run.currentRoom.icon || '🏰',
          status: 'current'
        };
        container.innerHTML = `
          <div class="floor-node current">
            <div class="node-icon">${currentFloor.icon}</div>
            <div class="node-text">
              <div class="node-label">Floor ${currentFloor.floorNumber}</div>
              <div class="node-desc">${currentFloor.description}</div>
            </div>
          </div>
        `;
        return;
      }
      
      container.innerHTML = timeline.map(item => `
        <div class="floor-node ${item.status || (item.floorNumber === (run?.floorIndex + 1) ? 'current' : '')}">
          <div class="node-icon">${item.icon || '🏰'}</div>
          <div class="node-text">
            <div class="node-label">Floor ${item.floorNumber || item.floor || '?'}</div>
            <div class="node-desc">${item.description || item.narration || 'Floor cleared'}</div>
            ${item.branchChoice ? `<div class="node-branch">Path: ${item.branchChoice.label || item.branchChoice.branchId}</div>` : ''}
            ${item.branchId ? `<div class="node-branch">Path: ${item.branchId}</div>` : ''}
          </div>
        </div>
      `).join('');
    },

    renderBranchOptions(run) {
      const container = document.getElementById(BRANCH_ID);
      if (!container) return;
      run = run || window.DungeonProgression?.getCurrentDungeonState?.();
      if (!run) {
        container.innerHTML = '';
        container.style.display = 'none';
        this.updateContextualTip();
        return;
      }
      const room = run.currentRoom || {};
      if (!Array.isArray(room.branchOptions) || room.branchOptions.length === 0) {
        container.innerHTML = '';
        container.style.display = 'none';
        this.selectedBranch = null;
        this.updateContextualTip(run);
        return;
      }
      container.style.display = 'flex';
      const floorNumber = (run?.floorIndex ?? 0) + 1;
      const branchLookup = new Map(Array.isArray(room.branchOptions) ? room.branchOptions.map(option => [option.branchId, option]) : []);
      container.innerHTML = `
        <div class="branch-title">Choose next modifier</div>
        <div class="branch-buttons">
          ${room.branchOptions.map(option => `
            <button class="branch-btn ${this.selectedBranch === option.branchId ? 'selected' : ''}"
                    data-branch="${option.branchId}"
                    data-branch-label="${(option.label || '').replace(/"/g, '&quot;')}">
              <span class="branch-label">${option.label}</span>
              ${option.modifiers ? `<span class="branch-mod">${this.describeModifiers(option.modifiers)}</span>` : ''}
            </button>
          `).join('')}
        </div>
      `;
      container.querySelectorAll('.branch-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.selectedBranch = btn.dataset.branch;
          container.querySelectorAll('.branch-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          container.classList.remove('branch-required');
          if (window.BagSystem?.showToast) {
            const label = btn.dataset.branchLabel || btn.textContent.trim();
            window.BagSystem.showToast(`Selected: ${label}`);
          }
          const option = branchLookup.get(this.selectedBranch);
          window.OfflineBagTelemetry?.recordBranchSelection?.({
            rankId: run?.rankId,
            floor: floorNumber,
            branchId: option?.branchId || this.selectedBranch,
            label: option?.label || btn.textContent.trim(),
            modifiers: option?.modifiers || null
          });
          this.updateContextualTip(run);
        });
      });
      this.updateContextualTip(run);
    },

    describeModifiers(modifiers) {
      const copy = [];
      if (modifiers.timerSeconds) copy.push(`Timer ${modifiers.timerSeconds}s`);
      if (modifiers.lootMultiplier) copy.push(`Loot ×${modifiers.lootMultiplier}`);
      if (modifiers.eliteCount) copy.push(`+${modifiers.eliteCount} elites`);
      if (modifiers.hardcore) copy.push('Hardcore');
      return copy.join(' • ') || 'Modifier applied';
    },

    updateTimelinePanel(run) {
      const panel = document.getElementById(TIMELINE_ID);
      if (!panel) return;
      run = run || window.DungeonProgression?.getCurrentDungeonState?.();
      const itemsHost = panel.querySelector('.timeline-items');
      if (!run || !itemsHost) {
        panel.classList.add('hidden');
        return;
      }
      const stopBtn = panel.querySelector('[data-action="stop-playback"]');
      if (stopBtn) stopBtn.classList.add('hidden');
      const combinedEntries = run.timeline || [];
      if (combinedEntries.length === 0) {
        itemsHost.innerHTML = '<div class="timeline-empty">No events yet.</div>';
        return;
      }
      itemsHost.innerHTML = combinedEntries.map((entry, idx) => `
        <div class="timeline-item" data-index="${idx}">
          <div class="timeline-head">${this.getTimelineHeadline(entry)}</div>
          ${entry.narration ? `<div class="timeline-body">${entry.narration}</div>` : ''}
        </div>
      `).join('');
    },

    updateRewardTicker(run) {
      const host = document.getElementById('candyDungeonTicker');
      if (!host) return;
      run = run || window.DungeonProgression?.getCurrentDungeonState?.();
      if (!run) {
        host.innerHTML = '<span class="ticker-empty">Start a raid to view active modifiers.</span>';
        return;
      }

      const modifiers = run.modifiers || {};
      const items = [];
      const formatMultiplier = (value) => {
        if (typeof value !== 'number' || !Number.isFinite(value)) return value;
        return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2);
      };

      if (modifiers.rewardMultiplier && modifiers.rewardMultiplier !== 1) {
        items.push({ icon: '💎', label: `Rewards ×${formatMultiplier(modifiers.rewardMultiplier)}` });
      }
      if (modifiers.lootMultiplier && modifiers.lootMultiplier !== 1) {
        items.push({ icon: '🎁', label: `Loot ×${formatMultiplier(modifiers.lootMultiplier)}` });
      }
      if (modifiers.eliteCount) {
        items.push({ icon: '⚔️', label: `+${modifiers.eliteCount} Elite${modifiers.eliteCount > 1 ? 's' : ''}` });
      }
      if (modifiers.timerSeconds) {
        const minutes = Math.floor(modifiers.timerSeconds / 60);
        const seconds = modifiers.timerSeconds % 60;
        const label = minutes > 0
          ? `${minutes}m ${seconds ? `${seconds}s` : ''}`
          : `${seconds}s`;
        items.push({ icon: '⏱️', label: `Timer ${label}` });
      }
      if (modifiers.hardcore) {
        items.push({ icon: '🔥', label: 'Hardcore Mode', alert: true });
      }
      if (modifiers.entryCostGold) {
        items.push({ icon: '💰', label: `${(modifiers.entryCostGold || 0).toLocaleString()}g Entry` });
      }

      if (!items.length) {
        host.innerHTML = '<span class="ticker-empty">Standard modifiers active.</span>';
        return;
      }

      host.innerHTML = items.map((item) => `
        <span class="ticker-item${item.alert ? ' alert' : ''}">
          <span class="ticker-icon">${item.icon || '✨'}</span>
          <span>${item.label}</span>
        </span>
      `).join('');
    },

    syncTimerState(run) {
      run = run || window.DungeonProgression?.getCurrentDungeonState?.();
      const timerEl = document.getElementById('candyDungeonTimer');
      const barEl = document.getElementById('candyDungeonTimerBar');
      if (!timerEl || !barEl) return;

      if (!run) {
        this.clearTimer();
        return;
      }

      const room = run.currentRoom || {};
      const modifiers = run.modifiers || {};
      const timerSeconds =
        typeof room.timerSeconds === 'number' ? room.timerSeconds :
        (room.puzzleRules && typeof room.puzzleRules.timerSeconds === 'number') ? room.puzzleRules.timerSeconds :
        (typeof modifiers.timerSeconds === 'number' ? modifiers.timerSeconds : null);

      if (!timerSeconds || timerSeconds <= 0) {
        this.clearTimer();
        return;
      }

      const key = `${run.rankId || 'raid'}:${run.floorIndex ?? 0}:${room.id || room.type || 'room'}:${timerSeconds}`;
      if (this.activeTimerKey === key) {
        return;
      }
      const multiplier = Math.max(0.1, Number(window.DungeonCinematicsDev?.timerMultiplier || 1));
      const adjustedSeconds = Math.max(1, Math.round(timerSeconds / multiplier));
      this.startTimer(adjustedSeconds, key, { originalSeconds: timerSeconds, multiplier });
    },

    startTimer(durationSeconds, key, meta = {}) {
      this.clearTimer();
      const timerEl = document.getElementById('candyDungeonTimer');
      const barEl = document.getElementById('candyDungeonTimerBar');
      if (!timerEl || !barEl) return;

      this.activeTimerKey = key;
      this.timerDuration = durationSeconds;
      this.timerEndTime = Date.now() + durationSeconds * 1000;
      this.timerMeta = meta;
      timerEl.classList.remove('timer-expired');
      this.updateTimerDisplay();
      this.timerInterval = window.setInterval(() => this.updateTimerDisplay(), 500);
      window.OfflineBagTelemetry?.recordTimerTick?.({
        phase: 'start',
        rankId: this.currentRankId,
        totalSeconds: this.timerDuration,
        remainingSeconds: this.timerDuration,
        meta
      });
    },

    clearTimer(preserveDisplay = false) {
      if (this.timerInterval) {
        window.clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.activeTimerKey = null;
      this.timerDuration = null;
      this.timerEndTime = null;
      this.timerMeta = null;

      const timerEl = document.getElementById('candyDungeonTimer');
      const barEl = document.getElementById('candyDungeonTimerBar');
      if (timerEl) {
        if (!preserveDisplay) {
          timerEl.textContent = '--:--';
          timerEl.classList.remove('timer-expired');
        }
      }
      if (barEl) {
        barEl.style.transform = 'scaleX(0)';
      }
    },

    updateTimerDisplay() {
      if (!this.timerEndTime || !this.timerDuration) return;
      const timerEl = document.getElementById('candyDungeonTimer');
      const barEl = document.getElementById('candyDungeonTimerBar');
      if (!timerEl || !barEl) return;

      const remainingMs = Math.max(0, this.timerEndTime - Date.now());
      const remainingSeconds = Math.floor(remainingMs / 1000);
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      const ratio = Math.max(0, Math.min(1, remainingMs / (this.timerDuration * 1000)));
      barEl.style.transform = `scaleX(${ratio})`;
      if (remainingMs <= 0) {
        timerEl.classList.add('timer-expired');
        timerEl.textContent = '00:00';
        this.clearTimer(true);
      }
      window.OfflineBagTelemetry?.recordTimerTick?.({
        phase: remainingMs <= 0 ? 'end' : 'tick',
        rankId: this.currentRankId,
        totalSeconds: this.timerDuration,
        remainingSeconds,
        meta: this.timerMeta || {}
      });
    },

    bindOverlayControls(overlay) {
      this.audioToggleButton = overlay.querySelector('[data-action="toggle-audio"]');
      this.updateAudioToggleUI();
    },

    loadAudioPreference() {
      try {
        this.isAudioMuted = localStorage.getItem('A1K_RAID_AUDIO_MUTED') === '1';
      } catch (error) {
        this.isAudioMuted = false;
      }
    },

    saveAudioPreference() {
      try {
        localStorage.setItem('A1K_RAID_AUDIO_MUTED', this.isAudioMuted ? '1' : '0');
      } catch (error) {
        // Ignore persistence errors (private mode, etc.)
      }
    },

    toggleAmbientAudio() {
      this.isAudioMuted = !this.isAudioMuted;
      this.saveAudioPreference();
      if (window.DungeonCinematicsDev) {
        window.DungeonCinematicsDev.muteAmbient = this.isAudioMuted;
      }
      if (this.isAudioMuted) {
        this.stopRankAmbient();
      } else if (this.currentRankId) {
        this.playRankAmbient(this.currentRankId);
      }
      this.updateAudioToggleUI();
    },

    updateAudioToggleUI() {
      if (!this.audioToggleButton) return;
      const icon = this.audioToggleButton.querySelector('.audio-icon');
      const isMuted = this.isAudioMuted;
      this.audioToggleButton.setAttribute('aria-pressed', String(!isMuted));
      this.audioToggleButton.classList.toggle('is-muted', isMuted);
      if (icon) {
        icon.textContent = isMuted ? '🔇' : '🔊';
      }
      this.audioToggleButton.setAttribute('title', isMuted ? 'Unmute ambient audio' : 'Mute ambient audio');
    },

    updateContextualTip(run) {
      const footer = document.getElementById('candyDungeonFooter');
      if (!footer) return;
      const tipNode = footer.querySelector('.contextual-tip') || footer;
      run = run || window.DungeonProgression?.getCurrentDungeonState?.();

      if (!run) {
        tipNode.textContent = 'Enter a dungeon raid from the Mission Board to begin.';
        return;
      }

      if (run.finished) {
        tipNode.textContent = 'Rank cleared! Close the window to collect your rewards.';
        return;
      }

      const room = run.currentRoom || {};
      const branchCount = Array.isArray(room.branchOptions) ? room.branchOptions.length : 0;
      if (branchCount > 0 && !this.selectedBranch) {
        tipNode.textContent = 'Select a branch modifier to lock in your next encounter.';
        return;
      }

      const currentFloor = (run.floorIndex ?? 0) + 1;
      const totalFloors = run.totalFloors || run.sequence?.length || '?';
      if (branchCount > 0 && this.selectedBranch) {
        tipNode.textContent = 'Ready! Mark the floor cleared to charge into the next path.';
        return;
      }

      if (currentFloor >= totalFloors) {
        tipNode.textContent = 'Mark the final floor cleared to face the boss gate.';
        return;
      }

      tipNode.textContent = `Mark Floor ${currentFloor} cleared to advance to Floor ${currentFloor + 1}.`;
    },

    renderStoryBeats(run) {
      const host = document.getElementById('candyDungeonStoryList');
      if (!host) return;
      if (!run) {
        host.innerHTML = '<div class="story-empty">Enter a gate to unlock new chapters.</div>';
        return;
      }
      const beats = this.buildStoryBeats(run);
      if (!beats.length) {
        host.innerHTML = '<div class="story-empty">Progress deeper to reveal story chapters.</div>';
        return;
      }
      host.innerHTML = beats.map((beat, index) => `
        <div class="story-beat ${beat.status || ''}">
          <div class="story-beat-index">Chapter ${String(index + 1).padStart(2, '0')}</div>
          <div class="story-beat-body">
            <div class="story-beat-title">${beat.title}</div>
            ${beat.subtitle ? `<div class="story-beat-subtitle">${beat.subtitle}</div>` : ''}
            ${beat.branch ? `<div class="story-beat-branch">${beat.branch}</div>` : ''}
          </div>
        </div>
      `).join('');
    },

    buildStoryBeats(run) {
      const beats = [];
      const presets = window.CandyDungeonCatalog?.cinematics?.storyBeats?.[run.rankId] || [];
      presets.forEach((preset) => {
        beats.push({
          title: preset.title,
          subtitle: preset.subtitle || '',
          status: 'preset',
          branch: ''
        });
      });
      const timeline = window.DungeonProgression?.getFloorTimeline?.() || [];
      const branchChoices = run.branchChoices || {};
      timeline.forEach((entry) => {
        const template = window.DungeonRoomData?.roomTypes?.[entry.roomId];
        const branch = branchChoices?.[entry.floorNumber];
        const branchSummary = branch
          ? `Path: ${branch.label || branch.branchId || 'Unknown'}${branch.modifiers ? ` • ${this.describeModifiers(branch.modifiers)}` : ''}`
          : '';
        beats.push({
          title: template?.title || `Floor ${entry.floorNumber}`,
          subtitle: template?.description || entry.description || '',
          status: entry.status,
          branch: branchSummary
        });
      });
      return beats;
    },

    ensureReactiveShader() {
      if (this.shaderElement && this.shaderElement.isConnected) return;
      const shader = document.createElement('div');
      shader.className = 'raid-reactive-shader';
      shader.style.opacity = '0';
      document.body.appendChild(shader);
      this.shaderElement = shader;
      window.BagSystem?.playAudioLayer?.('raid-shimmer', {
        waveform: 'sine',
        frequency: 360,
        gain: 0.06
      });
    },

    updateReactiveShader(run) {
      const shader = this.shaderElement;
      if (!shader) return;
      if (!run) {
        shader.style.opacity = '0';
        return;
      }
      const rankColor = window.DungeonRoomData?.ranks?.[run.rankId]?.color || '#8df5ff';
      const [r, g, b] = hexToRgb(rankColor);
      const currentRoom = run.currentRoom || {};
      const modifiers = run.modifiers || {};
      const bossActive = Boolean(currentRoom.isBoss);
      const hardcore = Boolean(modifiers.hardcore);
      const lootBoost = modifiers.lootMultiplier && modifiers.lootMultiplier > 1;
      const shaderConfig = window.CandyDungeonCatalog?.cinematics?.shaderPresets || {};
      const primaryAlpha = hardcore
        ? shaderConfig.primaryHardcoreAlpha ?? 0.58
        : shaderConfig.primaryAlpha ?? 0.35;
      const secondaryColor = bossActive
        ? shaderConfig.bossSecondary || 'rgba(255, 110, 170, 0.45)'
        : shaderConfig.secondary || `rgba(${r}, ${g}, ${b}, 0.25)`;
      const tertiaryColor = lootBoost
        ? shaderConfig.lootAccent || 'rgba(122, 248, 200, 0.32)'
        : shaderConfig.tertiary || 'rgba(147, 51, 234, 0.18)';
      shader.style.setProperty('--shader-primary', `rgba(${r}, ${g}, ${b}, ${primaryAlpha})`);
      shader.style.setProperty('--shader-secondary', secondaryColor);
      shader.style.setProperty('--shader-tertiary', tertiaryColor);
      shader.style.setProperty('--shader-opacity', run.finished ? (shaderConfig.finishedOpacity ?? 0.12) : (shaderConfig.baseOpacity ?? 0.45));
    },

    removeReactiveShader() {
      if (!this.shaderElement) return;
      const element = this.shaderElement;
      element.style.opacity = '0';
      window.setTimeout(() => {
        if (element.parentNode) {
          element.remove();
        }
      }, 280);
      this.shaderElement = null;
      window.BagSystem?.stopAudioLayer?.('raid-shimmer');
    },

    captureRunSnapshot(run) {
      if (!run) return null;
      return {
        rankId: run.rankId,
        startTime: run.startTime,
        sequence: Array.isArray(run.sequence) ? [...run.sequence] : [],
        modifiers: { ...(run.modifiers || {}) },
        branchChoices: { ...(run.branchChoices || {}) },
        timeline: (window.DungeonProgression?.getFloorTimeline?.() || []).map((entry) => ({
          floorNumber: entry.floorNumber,
          status: entry.status,
          description: entry.description,
          branchId: entry.branchId,
          roomId: entry.roomId
        }))
      };
    },

    formatDuration(ms) {
      const safe = Math.max(0, ms);
      const minutes = Math.floor(safe / 60000);
      const seconds = Math.floor((safe % 60000) / 1000);
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },

    buildRecapSummary(snapshot, detail) {
      if (!snapshot) return null;
      const completedAt = Date.now();
      const durationMs = Math.max(0, completedAt - (snapshot.startTime || completedAt));
      const timeline = snapshot.timeline || [];
      const totalFloors = timeline.length || snapshot.sequence.length || 0;
      const clearedFloors = timeline.filter(item => item.status === 'cleared').length;
      const branches = Object.keys(snapshot.branchChoices || {}).map((floorKey) => {
        const branch = snapshot.branchChoices[floorKey];
        return {
          floor: Number(floorKey),
          label: branch?.label || branch?.branchId || `Floor ${floorKey}`,
          modifiers: branch?.modifiers ? this.describeModifiers(branch.modifiers) : ''
        };
      }).sort((a, b) => a.floor - b.floor);
      return {
        rankId: snapshot.rankId || detail.rankId || '—',
        durationMs,
        durationText: this.formatDuration(durationMs),
        completedAt,
        totalFloors,
        clearedFloors,
        modifiers: snapshot.modifiers || {},
        branches,
        rewards: {
          lootMultiplier: snapshot.modifiers?.lootMultiplier || 1,
          rewardMultiplier: snapshot.modifiers?.rewardMultiplier || 1,
          hardcore: Boolean(snapshot.modifiers?.hardcore)
        }
      };
    },

    composeRecapShareText(summary) {
      if (!summary) return '';
      const branchTexts = summary.branches.map((branch) => `Floor ${branch.floor}: ${branch.label}${branch.modifiers ? ` (${branch.modifiers})` : ''}`);
      const modifierParts = [];
      if (summary.rewards.rewardMultiplier && summary.rewards.rewardMultiplier !== 1) {
        modifierParts.push(`Rewards ×${summary.rewards.rewardMultiplier}`);
      }
      if (summary.rewards.lootMultiplier && summary.rewards.lootMultiplier !== 1) {
        modifierParts.push(`Loot ×${summary.rewards.lootMultiplier}`);
      }
      if (summary.rewards.hardcore) {
        modifierParts.push('Hardcore enabled');
      }
      const modifierLine = modifierParts.length ? `Modifiers: ${modifierParts.join(', ')}` : 'Modifiers: Standard route';
      return [
        `Raid Recap — ${summary.rankId}-Rank Gate`,
        `Runtime: ${summary.durationText}`,
        `Floors Cleared: ${summary.clearedFloors} / ${summary.totalFloors}`,
        modifierLine,
        branchTexts.length ? `Branch Choices:\n- ${branchTexts.join('\n- ')}` : 'Branch Choices: None selected'
      ].join('\n');
    },

    showRaidRecap(detail = {}) {
      const snapshot = this.lastRunSnapshot || this.captureRunSnapshot(window.DungeonProgression?.getCurrentDungeonState?.());
      const summary = this.buildRecapSummary(snapshot, detail);
      if (!summary) {
        this.removeRaidRecap();
        return;
      }
      this.ensureReactiveShader();
      window.OfflineBagTelemetry?.recordRecap?.(summary);
      this.removeRaidRecap();
      const recap = document.createElement('div');
      recap.className = 'raid-recap-card';
      recap.setAttribute('role', 'dialog');
      recap.setAttribute('aria-label', 'Dungeon Recap');
      const modifierBadges = [];
      if (summary.rewards.rewardMultiplier && summary.rewards.rewardMultiplier !== 1) {
        modifierBadges.push(`<span class="recap-badge">Rewards ×${summary.rewards.rewardMultiplier.toFixed(2)}</span>`);
      }
      if (summary.rewards.lootMultiplier && summary.rewards.lootMultiplier !== 1) {
        modifierBadges.push(`<span class="recap-badge">Loot ×${summary.rewards.lootMultiplier.toFixed(2)}</span>`);
      }
      if (summary.rewards.hardcore) {
        modifierBadges.push('<span class="recap-badge alert">Hardcore</span>');
      }
      const branchList = summary.branches.length
        ? summary.branches.map(branch => `
            <li>
              <span class="recap-branch-label">Floor ${branch.floor}</span>
              <span>${branch.label}${branch.modifiers ? ` • ${branch.modifiers}` : ''}</span>
            </li>
          `).join('')
        : '<li><span>No branch modifiers selected.</span></li>';
      recap.innerHTML = `
        <div class="recap-surface">
          <div class="recap-header">
            <div>
              <div class="recap-rank">${summary.rankId}-Rank Gate</div>
              <div class="recap-runtime">Runtime ${summary.durationText}</div>
            </div>
            <button class="recap-close" type="button" data-action="close-recap" aria-label="Close recap">✕</button>
          </div>
          <div class="recap-metrics">
            <div class="recap-metric">
              <span class="recap-metric-label">Floors Cleared</span>
              <span class="recap-metric-value">${summary.clearedFloors} / ${summary.totalFloors}</span>
            </div>
            <div class="recap-metric">
              <span class="recap-metric-label">Duration</span>
              <span class="recap-metric-value">${summary.durationText}</span>
            </div>
            <div class="recap-metric">
              <span class="recap-metric-label">Completed</span>
              <span class="recap-metric-value">${new Date(summary.completedAt).toLocaleTimeString()}</span>
            </div>
          </div>
          <div class="recap-badges">
            ${modifierBadges.join('')}
          </div>
          <div class="recap-branches">
            <div class="recap-section-title">Branch Choices</div>
            <ul>
              ${branchList}
            </ul>
          </div>
          <div class="recap-footer">
            <button class="recap-share" type="button" data-action="copy-recap">Copy Summary</button>
          </div>
        </div>
      `;
      recap.addEventListener('click', (evt) => {
        const action = evt.target?.dataset?.action;
        if (action === 'close-recap') {
          this.removeRaidRecap();
        } else if (action === 'copy-recap') {
          const text = this.composeRecapShareText(summary);
          if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text).then(() => {
              window.BagSystem?.showToast?.('Recap copied to clipboard!');
            }).catch(() => {
              window.BagSystem?.showToast?.('Copy failed. Try again.', '#ff6b6b');
            });
          } else {
            window.prompt('Copy recap summary:', text);
          }
        }
      });
      document.body.appendChild(recap);
      this.recapElement = recap;
      window.BagSystem?.createParticleEffect?.('raid-recap', window.innerWidth / 2, window.innerHeight / 2, {
        colors: ['#ffd77a', '#8df5ff', '#ff9a9e'],
        count: 28,
        duration: 1600
      });
      window.BagSystem?.playAudioLayer?.('raid-recap-chime', {
        waveform: 'triangle',
        frequency: 620,
        gain: 0.1,
        duration: 1.6
      });

      if (this.recapKeyHandler) {
        window.removeEventListener('keydown', this.recapKeyHandler);
      }
      this.recapKeyHandler = (evt) => {
        if (evt.key === 'Escape') {
          this.removeRaidRecap();
        }
      };
      window.addEventListener('keydown', this.recapKeyHandler);
    },

    removeRaidRecap() {
      if (this.recapElement?.parentNode) {
        this.recapElement.remove();
      }
      this.recapElement = null;
      if (this.recapKeyHandler) {
        window.removeEventListener('keydown', this.recapKeyHandler);
        this.recapKeyHandler = null;
      }
      this.removeReactiveShader();
      window.BagSystem?.stopAudioLayer?.('raid-recap-chime');
    },

    activateRaidBackdrop(rankId) {
      const rankColor = window.DungeonRoomData?.ranks?.[rankId]?.color || DEFAULT_RANK_COLOR;
      const [r, g, b] = hexToRgb(rankColor);
      const body = document.body;
      if (!body) return;
      body.classList.add('raid-active');
      body.style.setProperty('--raid-rank-color-rgb', `${r}, ${g}, ${b}`);
      body.style.setProperty('--bloom-x', `${40 + Math.random() * 20}%`);
      body.style.setProperty('--bloom-y', `${30 + Math.random() * 40}%`);
      body.style.setProperty('--parallax-x', '50%');
      body.style.setProperty('--parallax-y', '45%');

      const handler = (evt) => {
        if (this.parallaxRaf) return;
        this.parallaxRaf = window.requestAnimationFrame(() => {
          const width = window.innerWidth || 1;
          const height = window.innerHeight || 1;
          const x = Math.max(0, Math.min(100, (evt.clientX / width) * 100));
          const y = Math.max(0, Math.min(100, (evt.clientY / height) * 100));
          body.style.setProperty('--parallax-x', `${x}%`);
          body.style.setProperty('--parallax-y', `${y}%`);
          this.parallaxRaf = null;
        });
      };

      this.parallaxHandler = handler;
      window.addEventListener('mousemove', this.parallaxHandler, { passive: true });
    },

    playRankAmbient(rankId) {
      if (!rankId) {
        this.stopRankAmbient();
        return;
      }
      if (this.isAudioMuted) {
        this.stopRankAmbient();
        return;
      }
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.stopRankAmbient();
      const ctx = window.__candyAmbientCtx || new AudioContext();
      window.__candyAmbientCtx = ctx;
      this.ambientCtx = ctx;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const rankColor = window.DungeonRoomData?.ranks?.[rankId]?.color || DEFAULT_RANK_COLOR;
      const rgb = hexToRgb(rankColor);
      const baseFrequency = Math.max(120, Math.min(420, rgbToFrequency(rgb)));

      const oscillator = ctx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(baseFrequency, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.18, ctx.currentTime);

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(baseFrequency * 0.04, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(baseFrequency * 1.5, ctx.currentTime);
      filter.Q.value = 0.7;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 0.8);

      oscillator.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start();
      lfo.start();

      this.ambientNodes = { oscillator, gain, lfo, lfoGain, filter };
    },

    stopRankAmbient() {
      if (!this.ambientNodes) return;
      const ctx = this.ambientCtx || window.__candyAmbientCtx;
      if (!ctx) {
        this.ambientNodes = null;
        return;
      }
      const { oscillator, gain, lfo, lfoGain, filter } = this.ambientNodes;
      const now = ctx.currentTime + 0.01;
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
      } catch (error) {
        // Safe to ignore; fallback to immediate stop below.
      }

      setTimeout(() => {
        try {
          oscillator?.stop();
          oscillator?.disconnect();
        } catch (error) {}
        try {
          lfo?.stop();
          lfo?.disconnect();
        } catch (error) {}
        try {
          lfoGain?.disconnect();
        } catch (error) {}
        try {
          gain?.disconnect();
        } catch (error) {}
        try {
          filter?.disconnect();
        } catch (error) {}
      }, 420);

      this.ambientNodes = null;
    },

    deactivateRaidBackdrop() {
      const body = document.body;
      if (this.parallaxHandler) {
        window.removeEventListener('mousemove', this.parallaxHandler);
        this.parallaxHandler = null;
      }
      if (this.parallaxRaf) {
        window.cancelAnimationFrame(this.parallaxRaf);
        this.parallaxRaf = null;
      }
      if (!body) return;
      body.classList.remove('raid-active');
      body.style.removeProperty('--raid-rank-color-rgb');
      body.style.removeProperty('--bloom-x');
      body.style.removeProperty('--bloom-y');
      body.style.removeProperty('--parallax-x');
      body.style.removeProperty('--parallax-y');
    },

    getTimelineHeadline(entry) {
      if (entry.type === 'floor-cleared') {
        return `Floor ${entry.floor} cleared • ${entry.branchId ? `Path ${entry.branchId}` : 'Standard route'}`;
      }
      return entry.headline || entry.title || 'Story Beat';
    },

    startPlayback() {
      const panel = document.getElementById(TIMELINE_ID);
      if (!panel) return;
      panel.classList.remove('hidden');
      this.stopPlayback();
      const items = Array.from(panel.querySelectorAll('.timeline-item'));
      if (items.length === 0) return;
      const stopBtn = panel.querySelector('[data-action="stop-playback"]');
      if (stopBtn) stopBtn.classList.remove('hidden');
      this.playbackIndex = 0;
      this.playbackTimer = setInterval(() => {
        items.forEach(item => item.classList.remove('active'));
        if (this.playbackIndex >= items.length) {
          this.stopPlayback();
          return;
        }
        items[this.playbackIndex].classList.add('active');
        this.playbackIndex += 1;
      }, 1200);
    },

    stopPlayback() {
      if (this.playbackTimer) {
        clearInterval(this.playbackTimer);
        this.playbackTimer = null;
      }
      const panel = document.getElementById(TIMELINE_ID);
      if (panel) {
        panel.querySelectorAll('.timeline-item').forEach(item => item.classList.remove('active'));
        const stopBtn = panel.querySelector('[data-action="stop-playback"]');
        if (stopBtn) stopBtn.classList.add('hidden');
      }
    },

    close(options = {}) {
      const { keepShader = false, keepRecap = false } = options;
      this.stopPlayback();
      const overlay = document.getElementById(OVERLAY_ID);
      if (overlay) overlay.remove();
      this.stopRankAmbient();
      this.deactivateRaidBackdrop();
      this.clearTimer();
      this.audioToggleButton = null;
      this.currentRankId = null;
      this.selectedBranch = null;
      if (!keepShader) {
        this.removeReactiveShader();
      }
      if (!keepRecap) {
        this.removeRaidRecap();
      }
    }
  };

  ui.init();
  window.CandyDungeonUI = ui;
})();

