/**
 * A1K Dungeon Room Generator
 * Procedurally generates dungeon rooms with platforms, enemies, chests, and hidden areas
 */

(function() {
  'use strict';

  console.log('[DungeonRoomGenerator] Loading room generator...');

  window.DungeonRoomGenerator = {
    
    /**
     * Generate a room configuration
     * @param {string} roomTypeId - ID of room type (e.g., 'dungeon_depths')
     * @param {string} rank - Rank (C, B, A, S, SS, SSS)
     * @param {number} floor - Floor number (1-based)
     * @param {number} roomIndex - Room index within floor (0-based)
     * @param {boolean} isBossRoom - Whether this is the boss room
     * @returns {Object} Room configuration
     */
    generateRoom(roomTypeId, rank, floor, roomIndex, isBossRoom = false) {
      const roomType = window.DungeonRoomData.roomTypes[roomTypeId];
      const rankData = window.DungeonRoomData.ranks[rank];
      
      if (!roomType || !rankData) {
        console.error('[DungeonRoomGenerator] Invalid room type or rank:', roomTypeId, rank);
        return null;
      }

      const roomWidth = 2400; // Standard room width
      const roomHeight = 800; // Standard room height
      const groundY = roomHeight - 100; // Ground level

      // Generate platforms
      const platforms = this.generatePlatforms(roomType, rankData, roomWidth, groundY, isBossRoom);
      
      // Generate enemy spawn points
      const enemySpawns = this.generateEnemySpawns(roomType, rankData, platforms, roomWidth, isBossRoom);
      
      // Generate chest spawns
      const chestSpawns = this.generateChestSpawns(roomType, rankData, platforms, roomWidth, isBossRoom);
      
      // Generate hidden room (chance based on room type)
      const hiddenRoom = Math.random() < roomType.hiddenRoomChance ? 
        this.generateHiddenRoom(roomType, rankData, roomWidth) : null;
      
      // Generate NPC spawns
      const npcSpawns = this.generateNPCSpawns(roomType, rankData, platforms, roomWidth, isBossRoom);
      
      // Generate transition points
      const transitions = this.generateTransitions(roomIndex, isBossRoom, roomWidth);

      return {
        id: `${roomTypeId}_${rank}_f${floor}_r${roomIndex}`,
        type: roomTypeId,
        rank: rank,
        floor: floor,
        roomIndex: roomIndex,
        isBossRoom: isBossRoom,
        width: roomWidth,
        height: roomHeight,
        backgroundColor: roomType.backgroundColor,
        foregroundColor: roomType.foregroundColor,
        accentColor: roomType.accentColor,
        theme: roomType.theme,
        platforms: platforms,
        enemySpawns: enemySpawns,
        chestSpawns: chestSpawns,
        hiddenRoom: hiddenRoom,
        npcSpawns: npcSpawns,
        transitions: transitions,
        features: roomType.features
      };
    },

    /**
     * Generate platforms for the room
     */
    generatePlatforms(roomType, rankData, roomWidth, groundY, isBossRoom) {
      const platforms = [];
      const platformConfig = roomType.platforms;
      
      // Always add ground platform
      platforms.push({
        x: 0,
        y: groundY,
        width: roomWidth,
        height: platformConfig.ground.height,
        type: 'ground',
        color: platformConfig.ground.color
      });

      if (isBossRoom) {
        // Boss rooms have special arena layout
        const bossArenaWidth = 600;
        const bossArenaX = (roomWidth - bossArenaWidth) / 2;
        platforms.push({
          x: bossArenaX,
          y: groundY - 200,
          width: bossArenaWidth,
          height: platformConfig.mid.height,
          type: 'boss_arena',
          color: platformConfig.mid.color,
          floating: platformConfig.mid.floating || false
        });
        return platforms;
      }

      // Generate mid-level platforms
      const midPlatformCount = 3 + Math.floor(rankData.roomsPerFloor * 0.5);
      for (let i = 0; i < midPlatformCount; i++) {
        const x = 200 + (i * (roomWidth - 400) / midPlatformCount);
        const width = 150 + Math.random() * 100;
        platforms.push({
          x: x,
          y: groundY - 150 - Math.random() * 50,
          width: width,
          height: platformConfig.mid.height,
          type: 'mid',
          color: platformConfig.mid.color,
          floating: platformConfig.mid.floating || false,
          glowing: platformConfig.mid.glowing || false,
          lowGravity: platformConfig.mid.lowGravity || false
        });
      }

      // Generate high-level platforms (less common)
      if (rankData.unlockLevel >= 25) { // A-rank and above
        const highPlatformCount = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < highPlatformCount; i++) {
          const x = 300 + Math.random() * (roomWidth - 600);
          const width = 100 + Math.random() * 80;
          platforms.push({
            x: x,
            y: groundY - 300 - Math.random() * 50,
            width: width,
            height: platformConfig.high.height,
            type: 'high',
            color: platformConfig.high.color,
            floating: platformConfig.high.floating || false,
            glowing: platformConfig.high.glowing || false,
            lowGravity: platformConfig.high.lowGravity || false
          });
        }
      }

      return platforms;
    },

    /**
     * Generate enemy spawn points
     */
    generateEnemySpawns(roomType, rankData, platforms, roomWidth, isBossRoom) {
      const spawns = [];
      const baseEnemyCount = isBossRoom ? 0 : Math.floor(3 + rankData.enemyMultiplier * 2);
      
      // Spawn enemies on platforms
      platforms.forEach(platform => {
        if (platform.type === 'ground' || platform.type === 'mid') {
          const enemyCount = Math.floor(baseEnemyCount / platforms.length) + 
                            (Math.random() < 0.3 ? 1 : 0);
          
          for (let i = 0; i < enemyCount; i++) {
            const spawnX = platform.x + 20 + Math.random() * (platform.width - 40);
            spawns.push({
              x: spawnX,
              y: platform.y - 30, // Above platform
              platformId: platform.id || `platform_${spawns.length}`,
              enemyType: this.selectEnemyType(rankData),
              spawnDelay: Math.random() * 2 // Stagger spawns
            });
          }
        }
      });

      // Add flying enemies for higher ranks
      if (rankData.unlockLevel >= 25 && !isBossRoom) {
        const flyingCount = Math.floor(rankData.enemyMultiplier);
        for (let i = 0; i < flyingCount; i++) {
          spawns.push({
            x: 200 + Math.random() * (roomWidth - 400),
            y: 200 + Math.random() * 200,
            platformId: null,
            enemyType: this.selectEnemyType(rankData, true),
            spawnDelay: Math.random() * 3,
            flying: true
          });
        }
      }

      return spawns;
    },

    /**
     * Select enemy type based on rank
     */
    selectEnemyType(rankData, flying = false) {
      // This would integrate with your enemy database
      // For now, return placeholder types
      const enemyTypes = ['enemy_slime', 'enemy_goblin', 'enemy_skeleton', 'enemy_imp'];
      const flyingTypes = ['enemy_bat', 'enemy_dragon_wyrmling'];
      
      if (flying) {
        return flyingTypes[Math.floor(Math.random() * flyingTypes.length)];
      }
      
      // Higher ranks get stronger enemies
      const tier = Math.min(Math.floor(rankData.unlockLevel / 25), 3);
      return enemyTypes[tier] || enemyTypes[0];
    },

    /**
     * Generate chest spawn points
     */
    generateChestSpawns(roomType, rankData, platforms, roomWidth, isBossRoom) {
      const spawns = [];
      const chestCount = isBossRoom ? 3 : Math.floor(1 + rankData.rewardMultiplier);
      
      // Place chests on platforms
      const availablePlatforms = platforms.filter(p => 
        p.type === 'mid' || p.type === 'high' || (p.type === 'ground' && isBossRoom)
      );
      
      for (let i = 0; i < Math.min(chestCount, availablePlatforms.length); i++) {
        const platform = availablePlatforms[i];
        const chestX = platform.x + 30 + Math.random() * (platform.width - 60);
        spawns.push({
          x: chestX,
          y: platform.y - 40,
          platformId: platform.id || `chest_${i}`,
          rarity: this.selectChestRarity(rankData),
          isHidden: Math.random() < 0.2 // 20% chance of hidden chest
        });
      }

      return spawns;
    },

    /**
     * Select chest rarity based on rank
     */
    selectChestRarity(rankData) {
      const rand = Math.random();
      if (rankData.unlockLevel >= 100) {
        // SSS-rank: Higher chance of epic/legendary
        if (rand < 0.1) return 'legendary';
        if (rand < 0.3) return 'epic';
        if (rand < 0.6) return 'rare';
        return 'uncommon';
      } else if (rankData.unlockLevel >= 75) {
        // SS-rank
        if (rand < 0.05) return 'legendary';
        if (rand < 0.2) return 'epic';
        if (rand < 0.5) return 'rare';
        return 'uncommon';
      } else if (rankData.unlockLevel >= 50) {
        // S-rank
        if (rand < 0.2) return 'epic';
        if (rand < 0.5) return 'rare';
        return 'uncommon';
      } else if (rankData.unlockLevel >= 25) {
        // A-rank
        if (rand < 0.1) return 'epic';
        if (rand < 0.4) return 'rare';
        return 'uncommon';
      } else {
        // B and C rank
        if (rand < 0.3) return 'rare';
        return 'uncommon';
      }
    },

    /**
     * Generate hidden room
     */
    generateHiddenRoom(roomType, rankData, roomWidth) {
      // Hidden room entrance is usually on a mid or high platform
      const entranceX = 300 + Math.random() * (roomWidth - 600);
      const entranceY = 300 + Math.random() * 200;
      
      return {
        entranceX: entranceX,
        entranceY: entranceY,
        width: 400,
        height: 300,
        chests: Math.floor(2 + rankData.rewardMultiplier),
        npcs: Math.random() < 0.5 ? 1 : 0,
        enemies: Math.floor(rankData.enemyMultiplier)
      };
    },

    /**
     * Generate NPC spawns
     */
    generateNPCSpawns(roomType, rankData, platforms, roomWidth, isBossRoom) {
      const spawns = [];
      
      if (isBossRoom) return spawns; // No NPCs in boss rooms
      
      // Shop NPC chance
      if (Math.random() < window.DungeonRoomData.npcTypes.shop.spawnChance) {
        const platform = platforms.find(p => p.type === 'ground') || platforms[0];
        spawns.push({
          x: platform.x + platform.width / 2,
          y: platform.y - 40,
          type: 'shop',
          icon: window.DungeonRoomData.npcTypes.shop.icon
        });
      }
      
      // Quest NPC chance (higher for A-rank+)
      if (rankData.unlockLevel >= 25 && Math.random() < window.DungeonRoomData.npcTypes.quest.spawnChance) {
        const midPlatform = platforms.find(p => p.type === 'mid');
        if (midPlatform) {
          spawns.push({
            x: midPlatform.x + midPlatform.width / 2,
            y: midPlatform.y - 40,
            type: 'quest',
            icon: window.DungeonRoomData.npcTypes.quest.icon
          });
        }
      }
      
      return spawns;
    },

    /**
     * Generate transition points (entrance/exit)
     */
    generateTransitions(roomIndex, isBossRoom, roomWidth) {
      const transitions = {
        entrance: {
          x: 50,
          y: 600, // Ground level
          width: 100,
          height: 100
        }
      };
      
      if (!isBossRoom) {
        transitions.exit = {
          x: roomWidth - 150,
          y: 600,
          width: 100,
          height: 100
        };
      }
      
      return transitions;
    }
  };

  console.log('✅ [DungeonRoomGenerator] Room generator loaded');

})();

