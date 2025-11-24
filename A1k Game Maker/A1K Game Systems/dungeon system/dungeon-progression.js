/**
 * A1K Dungeon Progression System
 * Handles C-Rank to SSS-Rank dungeon unlocks, daily entries, and progression
 */

(function() {
  'use strict';

  console.log('[DungeonProgression] Loading progression system...');

  window.DungeonProgression = {
    
    /**
     * Get available ranks for player level
     */
    getAvailableRanks(playerLevel) {
      const ranks = [];
      const rankData = window.DungeonRoomData.ranks;
      
      for (const rankKey in rankData) {
        const rank = rankData[rankKey];
        if (playerLevel >= rank.unlockLevel) {
          ranks.push(rankKey);
        }
      }
      
      return ranks;
    },

    /**
     * Check if player can enter a dungeon of specific rank
     */
    canEnterDungeon(rankId, playerLevel) {
      const rank = window.DungeonRoomData.ranks[rankId];
      if (!rank) return false;
      
      // Check level requirement
      if (playerLevel < rank.unlockLevel) {
        return { allowed: false, reason: `Requires level ${rank.unlockLevel}` };
      }
      
      // Check daily entry limit
      if (!window.gameState) {
        return { allowed: false, reason: 'Game state not initialized' };
      }
      
      if (!window.gameState.dungeons) {
        window.gameState.dungeons = {
          unlockedRanks: ['C'],
          clearedFloors: {},
          dailyEntries: {},
          bestTimes: {},
          lastResetDate: new Date().toDateString()
        };
      }
      
      // Check if rank is unlocked
      if (!window.gameState.dungeons.unlockedRanks.includes(rankId)) {
        // Check if previous rank is cleared
        const rankOrder = ['C', 'B', 'A', 'S', 'SS', 'SSS'];
        const currentIndex = rankOrder.indexOf(rankId);
        if (currentIndex > 0) {
          const prevRank = rankOrder[currentIndex - 1];
          const prevRankCleared = this.isRankCleared(prevRank);
          if (!prevRankCleared) {
            return { allowed: false, reason: `Must clear ${prevRank}-Rank dungeons first` };
          }
        }
      }
      
      // Check daily entries
      const entriesUsed = window.gameState.dungeons.dailyEntries[rankId] || 0;
      if (rank.dailyEntries > 0 && entriesUsed >= rank.dailyEntries) {
        const resetTime = this.getNextResetTime(rankId);
        return { 
          allowed: false, 
          reason: `Daily limit reached. Resets in ${resetTime}` 
        };
      }
      
      // SSS-rank has weekly limit
      if (rankId === 'SSS') {
        const lastEntryDate = window.gameState.dungeons.lastSSSEntryDate;
        if (lastEntryDate) {
          const daysSince = Math.floor((Date.now() - new Date(lastEntryDate).getTime()) / (1000 * 60 * 60 * 24));
          if (daysSince < 7) {
            return { 
              allowed: false, 
              reason: `Weekly limit reached. Resets in ${7 - daysSince} days` 
            };
          }
        }
      }
      
      return { allowed: true };
    },

    /**
     * Check if a rank is fully cleared
     */
    isRankCleared(rankId) {
      if (!window.gameState || !window.gameState.dungeons) return false;
      
      const rank = window.DungeonRoomData.ranks[rankId];
      if (!rank) return false;
      
      const clearedFloors = window.gameState.dungeons.clearedFloors[rankId] || {};
      const totalFloors = rank.floors;
      
      // Check if all floors are cleared
      for (let floor = 1; floor <= totalFloors; floor++) {
        if (!clearedFloors[floor]) {
          return false;
        }
      }
      
      return true;
    },

    /**
     * Enter a dungeon (consume daily entry)
     */
    enterDungeon(rankId) {
      const canEnter = this.canEnterDungeon(rankId, window.gameState.playerLevel || 1);
      if (!canEnter.allowed) {
        return { success: false, error: canEnter.reason };
      }
      
      // Consume entry
      if (!window.gameState.dungeons.dailyEntries) {
        window.gameState.dungeons.dailyEntries = {};
      }
      
      const rank = window.DungeonRoomData.ranks[rankId];
      if (rank.dailyEntries > 0) {
        window.gameState.dungeons.dailyEntries[rankId] = 
          (window.gameState.dungeons.dailyEntries[rankId] || 0) + 1;
      }
      
      // Track SSS-rank weekly entry
      if (rankId === 'SSS') {
        window.gameState.dungeons.lastSSSEntryDate = new Date().toISOString();
      }
      
      // Unlock rank if not already unlocked
      if (!window.gameState.dungeons.unlockedRanks.includes(rankId)) {
        window.gameState.dungeons.unlockedRanks.push(rankId);
      }
      
      return { success: true };
    },

    /**
     * Clear a floor
     */
    clearFloor(rankId, floor) {
      if (!window.gameState.dungeons.clearedFloors[rankId]) {
        window.gameState.dungeons.clearedFloors[rankId] = {};
      }
      
      window.gameState.dungeons.clearedFloors[rankId][floor] = {
        cleared: true,
        clearedAt: Date.now(),
        time: Date.now() // Will be updated with actual clear time
      };
      
      // Check if rank is fully cleared
      if (this.isRankCleared(rankId)) {
        this.onRankCleared(rankId);
      }
      
      // Dispatch event
      window.dispatchEvent(new CustomEvent('dungeon:floor_cleared', {
        detail: { rankId, floor }
      }));
    },

    /**
     * Called when a rank is fully cleared
     */
    onRankCleared(rankId) {
      const rankOrder = ['C', 'B', 'A', 'S', 'SS', 'SSS'];
      const currentIndex = rankOrder.indexOf(rankId);
      
      // Unlock next rank
      if (currentIndex < rankOrder.length - 1) {
        const nextRank = rankOrder[currentIndex + 1];
        if (!window.gameState.dungeons.unlockedRanks.includes(nextRank)) {
          window.gameState.dungeons.unlockedRanks.push(nextRank);
          
          window.dispatchEvent(new CustomEvent('dungeon:rank_unlocked', {
            detail: { rankId: nextRank }
          }));
        }
      }
      
      // Dispatch completion event
      window.dispatchEvent(new CustomEvent('dungeon:rank_cleared', {
        detail: { rankId }
      }));
    },

    /**
     * Get dungeon info
     */
    getDungeonInfo(rankId) {
      const rank = window.DungeonRoomData.ranks[rankId];
      if (!rank) return null;
      
      const entriesUsed = window.gameState?.dungeons?.dailyEntries?.[rankId] || 0;
      const entriesRemaining = rank.dailyEntries < 0 ? 
        'Unlimited' : 
        Math.max(0, rank.dailyEntries - entriesUsed);
      
      const clearedFloors = window.gameState?.dungeons?.clearedFloors?.[rankId] || {};
      const floorsCleared = Object.keys(clearedFloors).length;
      
      return {
        rankId: rankId,
        name: rank.name,
        color: rank.color,
        unlockLevel: rank.unlockLevel,
        floors: rank.floors,
        roomsPerFloor: rank.roomsPerFloor,
        entriesRemaining: entriesRemaining,
        entriesUsed: entriesUsed,
        floorsCleared: floorsCleared,
        isCleared: this.isRankCleared(rankId),
        description: rank.description,
        enemyMultiplier: rank.enemyMultiplier,
        rewardMultiplier: rank.rewardMultiplier
      };
    },

    /**
     * Get all available dungeons for current player level
     */
    getAvailableDungeons(playerLevel) {
      const availableRanks = this.getAvailableRanks(playerLevel);
      const dungeons = [];
      
      availableRanks.forEach(rankId => {
        const info = this.getDungeonInfo(rankId);
        if (info) {
          const canEnter = this.canEnterDungeon(rankId, playerLevel);
          info.canEnter = canEnter.allowed;
          info.cannotEnterReason = canEnter.reason;
          dungeons.push(info);
        }
      });
      
      return dungeons;
    },

    /**
     * Reset daily entries (call this daily)
     */
    resetDailyEntries() {
      if (!window.gameState.dungeons) return;
      
      const today = new Date().toDateString();
      const lastReset = window.gameState.dungeons.lastResetDate;
      
      if (today !== lastReset) {
        // Reset all daily entries except SSS (weekly)
        window.gameState.dungeons.dailyEntries = {};
        window.gameState.dungeons.lastResetDate = today;
        
        console.log('[DungeonProgression] Daily entries reset');
      }
    },

    /**
     * Get time until next reset
     */
    getNextResetTime(rankId) {
      if (rankId === 'SSS') {
        const lastEntry = window.gameState?.dungeons?.lastSSSEntryDate;
        if (lastEntry) {
          const daysSince = Math.floor((Date.now() - new Date(lastEntry).getTime()) / (1000 * 60 * 60 * 24));
          return `${7 - daysSince} days`;
        }
        return 'Available';
      }
      
      // Daily reset at midnight
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const hoursUntil = Math.floor((tomorrow - now) / (1000 * 60 * 60));
      const minutesUntil = Math.floor(((tomorrow - now) % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hoursUntil}h ${minutesUntil}m`;
    },

    /**
     * Get progress for a rank
     */
    getRankProgress(rankId) {
      const rank = window.DungeonRoomData.ranks[rankId];
      if (!rank) return null;
      
      const clearedFloors = window.gameState?.dungeons?.clearedFloors?.[rankId] || {};
      const floorsCleared = Object.keys(clearedFloors).length;
      const totalFloors = rank.floors;
      const progressPercent = (floorsCleared / totalFloors) * 100;
      
      return {
        floorsCleared: floorsCleared,
        totalFloors: totalFloors,
        progressPercent: progressPercent,
        isComplete: floorsCleared >= totalFloors
      };
    }
  };

  // Initialize daily reset check
  if (window.gameState && window.gameState.dungeons) {
    window.DungeonProgression.resetDailyEntries();
  }

  console.log('✅ [DungeonProgression] Progression system loaded');

})();

