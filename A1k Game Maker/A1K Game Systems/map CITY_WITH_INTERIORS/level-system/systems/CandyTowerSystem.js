/**
 * CandyTowerSystem.js - Candy Tower Ascension System
 * @version 1.0.0
 * @description Solo climbing tower with candy theme, rank progression C→SSS+
 * Inspired by progression tower systems, unique candy implementation
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CandyTowerSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // SWEET HUNTER RANKS (10 Ranks)
  // ============================

  const SWEET_RANKS = {
    C: {
      rank: "C",
      name: "Candy Collector",
      icon: "🍬",
      tier: 1,
      requiredFloor: 0,
      bonuses: { hp: 100, atk: 20, def: 10 },
      gateAccess: ["Lollipop Gate", "Gummy Gate"],
      dailyRewards: { gold: 5000, candy_points: 10 },
    },
    B: {
      rank: "B",
      name: "Gumdrop Guardian",
      icon: "🍭",
      tier: 2,
      requiredFloor: 10,
      bonuses: { hp: 250, atk: 50, def: 30 },
      gateAccess: ["Chocolate Gate", "Marshmallow Gate"],
      dailyRewards: { gold: 15000, candy_points: 30 },
    },
    A: {
      rank: "A",
      name: "Bonbon Breaker",
      icon: "🍫",
      tier: 3,
      requiredFloor: 25,
      bonuses: { hp: 500, atk: 100, def: 60 },
      gateAccess: ["Caramel Gate", "Jellybean Gate"],
      dailyRewards: { gold: 50000, candy_points: 100 },
    },
    S: {
      rank: "S",
      name: "Sugar Sovereign",
      icon: "🍰",
      tier: 4,
      requiredFloor: 50,
      bonuses: { hp: 1000, atk: 250, def: 150 },
      gateAccess: ["Frosting Gate", "Taffy Gate"],
      dailyRewards: { gold: 200000, candy_points: 300 },
      ability: "Sweet Surge",
    },
    SS: {
      rank: "SS",
      name: "Confection Champion",
      icon: "🧁",
      tier: 5,
      requiredFloor: 75,
      bonuses: { hp: 2500, atk: 500, def: 300 },
      gateAccess: ["Truffle Gate", "Macaron Gate"],
      dailyRewards: { gold: 750000, candy_points: 1000 },
      ability: "Candy Crush",
    },
    SSS: {
      rank: "SSS",
      name: "Sweetness Supreme",
      icon: "🍩",
      tier: 6,
      requiredFloor: 100,
      bonuses: { hp: 5000, atk: 1000, def: 600 },
      gateAccess: ["Nougat Gate", "Fudge Gate"],
      dailyRewards: { gold: 2000000, candy_points: 3000 },
      ability: "Sugar Rush",
    },
    "SSS+": {
      rank: "SSS+",
      name: "Divine Dessert",
      icon: "🎂",
      tier: 7,
      requiredFloor: 150,
      bonuses: { hp: 10000, atk: 2500, def: 1500 },
      gateAccess: ["Rainbow Gate", "Stardust Gate"],
      dailyRewards: { gold: 10000000, candy_points: 10000 },
      ability: "Sweetest Dream",
    },
    NATIONAL: {
      rank: "NATIONAL",
      name: "Candy King",
      icon: "👑",
      tier: 8,
      requiredFloor: 200,
      bonuses: { hp: 25000, atk: 5000, def: 3000 },
      gateAccess: ["Monarch Gate"],
      dailyRewards: { gold: 50000000, candy_points: 50000 },
      ability: "Royal Sweetness",
    },
    TRANSCENDENT: {
      rank: "TRANSCENDENT",
      name: "Sugar God",
      icon: "✨",
      tier: 9,
      requiredFloor: 250,
      bonuses: { hp: 50000, atk: 10000, def: 7500 },
      gateAccess: ["Divine Candy Gate"],
      dailyRewards: { gold: 250000000, candy_points: 250000 },
      ability: "Godly Confection",
    },
    SOVEREIGN: {
      rank: "SOVEREIGN",
      name: "Eternal Sweetness",
      icon: "🌟",
      tier: 10,
      requiredFloor: 300,
      bonuses: { hp: 100000, atk: 25000, def: 15000 },
      gateAccess: ["ALL"],
      dailyRewards: { gold: 999999999, candy_points: 999999 },
      ability: "Infinite Candy",
    },
  };

  const RANK_KEYS = Object.keys(SWEET_RANKS);

  // ============================
  // CANDY TOWER FLOORS (300 Floors!)
  // ============================

  const generateFloors = () => {
    const floors = {};

    for (let i = 1; i <= 300; i++) {
      const tier = Math.floor(i / 30) + 1;
      const isBoss = i % 10 === 0;
      const isCheckpoint = i % 25 === 0;

      floors[i] = {
        floor: i,
        name: isBoss ? `Candy Boss Floor ${i}` : `Sweet Floor ${i}`,
        tier,
        isBoss,
        isCheckpoint,
        enemies: isBoss ? 1 : Math.floor(i / 10) + 3,
        enemyLevel: i * 2,
        enemyType: isBoss ? "boss" : i % 5 === 0 ? "elite" : "normal",
        rewards: {
          gold: i * 1000,
          xp: i * 500,
          candy_points: i * 10,
        },
        specialReward: isCheckpoint ? "legendary_candy_item" : null,
      };

      // Boss floors have special rewards
      if (isBoss) {
        floors[i].rewards.gold *= 10;
        floors[i].rewards.xp *= 5;
        floors[i].rewards.candy_points *= 20;
      }

      // Checkpoint floors have mega rewards
      if (isCheckpoint) {
        floors[i].rewards.gold *= 50;
        floors[i].rewards.xp *= 25;
      }
    }

    return floors;
  };

  const TOWER_FLOORS = generateFloors();

  // ============================
  // CANDY GATES (15 Types)
  // ============================

  const CANDY_GATES = {
    lollipop_gate: {
      id: "lollipop_gate",
      name: "Lollipop Gate",
      icon: "🍭",
      rank: "C",
      difficulty: 1,
      duration: 1800000, // 30 minutes
      enemies: 20,
      rewards: { gold: 10000, xp: 5000, rare_candy: 1 },
    },
    gummy_gate: {
      id: "gummy_gate",
      name: "Gummy Bear Gate",
      icon: "🧸",
      rank: "C",
      difficulty: 1,
      duration: 1800000,
      enemies: 25,
      rewards: { gold: 12000, xp: 6000, rare_candy: 1 },
    },
    chocolate_gate: {
      id: "chocolate_gate",
      name: "Chocolate Cavern",
      icon: "🍫",
      rank: "B",
      difficulty: 2,
      duration: 3600000, // 1 hour
      enemies: 50,
      rewards: { gold: 50000, xp: 25000, rare_candy: 3 },
    },
    marshmallow_gate: {
      id: "marshmallow_gate",
      name: "Marshmallow Mountain",
      icon: "☁️",
      rank: "B",
      difficulty: 2,
      duration: 3600000,
      enemies: 60,
      rewards: { gold: 60000, xp: 30000, rare_candy: 4 },
    },
    caramel_gate: {
      id: "caramel_gate",
      name: "Caramel Castle",
      icon: "🏰",
      rank: "A",
      difficulty: 3,
      duration: 7200000, // 2 hours
      enemies: 100,
      rewards: { gold: 250000, xp: 125000, rare_candy: 10 },
    },
    frosting_gate: {
      id: "frosting_gate",
      name: "Frosting Fortress",
      icon: "🧊",
      rank: "S",
      difficulty: 4,
      duration: 10800000, // 3 hours
      enemies: 200,
      rewards: { gold: 1000000, xp: 500000, rare_candy: 30 },
    },
    truffle_gate: {
      id: "truffle_gate",
      name: "Truffle Temple",
      icon: "🍄",
      rank: "SS",
      difficulty: 5,
      duration: 14400000, // 4 hours
      enemies: 500,
      rewards: { gold: 5000000, xp: 2500000, rare_candy: 100 },
    },
    rainbow_gate: {
      id: "rainbow_gate",
      name: "Rainbow Candy Realm",
      icon: "🌈",
      rank: "SSS+",
      difficulty: 7,
      duration: 21600000, // 6 hours
      enemies: 1000,
      rewards: { gold: 50000000, xp: 25000000, rare_candy: 500 },
    },
    monarch_gate: {
      id: "monarch_gate",
      name: "Candy Monarch Dimension",
      icon: "👑",
      rank: "NATIONAL",
      difficulty: 8,
      duration: 43200000, // 12 hours
      enemies: 2000,
      boss: "Candy Monarch",
      rewards: { gold: 500000000, xp: 250000000, rare_candy: 5000 },
    },
    divine_candy_gate: {
      id: "divine_candy_gate",
      name: "Divine Candy Dimension",
      icon: "✨",
      rank: "TRANSCENDENT",
      difficulty: 10,
      duration: 86400000, // 24 hours
      enemies: 10000,
      boss: "Sugar God",
      rewards: { gold: 999999999, xp: 999999999, rare_candy: 99999 },
    },
  };

  const GATE_KEYS = Object.keys(CANDY_GATES);

  // ============================
  // SPECIAL ABILITIES (10 Abilities)
  // ============================

  const TOWER_ABILITIES = {
    sweet_surge: {
      id: "sweet_surge",
      name: "Sweet Surge",
      rank: "S",
      cooldown: 30000,
      effect: { atk_buff: 1.5, duration: 10000 },
      description: "Sugar rush! +50% ATK for 10s",
    },
    candy_crush: {
      id: "candy_crush",
      name: "Candy Crush",
      rank: "SS",
      cooldown: 60000,
      effect: { aoe_damage: 500, stun: 3000 },
      description: "Crush enemies with candy power",
    },
    sugar_rush: {
      id: "sugar_rush",
      name: "Sugar Rush",
      rank: "SSS",
      cooldown: 90000,
      effect: { all_stats: 2.0, duration: 30000 },
      description: "2x all stats for 30s!",
    },
    sweetest_dream: {
      id: "sweetest_dream",
      name: "Sweetest Dream",
      rank: "SSS+",
      cooldown: 120000,
      effect: { invincible: 10000, heal_full: true },
      description: "10s invincibility + full heal",
    },
    royal_sweetness: {
      id: "royal_sweetness",
      name: "Royal Sweetness",
      rank: "NATIONAL",
      cooldown: 300000,
      effect: { summon_candy_army: true },
      description: "Summon candy minions",
    },
    godly_confection: {
      id: "godly_confection",
      name: "Godly Confection",
      rank: "TRANSCENDENT",
      cooldown: 600000,
      effect: { instant_kill: 10, heal_all: 99999 },
      description: "Instant kill 10 enemies + massive heal",
    },
    infinite_candy: {
      id: "infinite_candy",
      name: "Infinite Candy",
      rank: "SOVEREIGN",
      cooldown: 0,
      effect: { unlimited_power: true },
      description: "Infinite candy power!",
    },
  };

  // ============================
  // CANDY TOWER SYSTEM CLASS
  // ============================

  class CandyTowerSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          allowParty: false, // Solo only (like Solo Leveling!)
          deathPenalty: 0.1, // Lose 10% progress
          dailyRewardsEnabled: true,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Player ID -> Tower progress */
      this.playerProgress = new Map();

      /** @type {Map<string, Object>} Gate ID -> Active gate */
      this.activeGates = new Map();

      /** @type {Map<string, Array>} Player ID -> Gate clears */
      this.gateHistory = new Map();

      /** @type {Object} Statistics */
      this.stats = {
        highestFloor: 0,
        totalClears: 0,
        totalDeaths: 0,
        fastestClear: { floor: 0, time: Infinity },
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("candy_tower:ready", {
        totalFloors: 300,
        ranks: RANK_KEYS.length,
        gates: GATE_KEYS.length,
      });

      return this;
    }

    /**
     * Get player rank
     * @param {string} playerId - Player ID
     * @returns {Object} Rank data
     */
    getPlayerRank(playerId) {
      const progress = this.playerProgress.get(playerId);
      if (!progress) return SWEET_RANKS.C;

      const currentFloor = progress.currentFloor || 0;

      // Find highest rank achieved
      for (let i = RANK_KEYS.length - 1; i >= 0; i--) {
        const rankKey = RANK_KEYS[i];
        const rank = SWEET_RANKS[rankKey];

        if (currentFloor >= rank.requiredFloor) {
          return rank;
        }
      }

      return SWEET_RANKS.C;
    }

    /**
     * Start floor challenge
     * @param {string} playerId - Player ID
     * @param {number} floorNumber - Floor to challenge
     * @returns {Object} Floor data
     */
    startFloor(playerId, floorNumber) {
      const progress =
        this.playerProgress.get(playerId) || this._createProgress(playerId);

      // Can only challenge current floor or lower
      if (floorNumber > progress.currentFloor + 1) {
        return { error: "Floor not unlocked yet" };
      }

      const floor = TOWER_FLOORS[floorNumber];
      if (!floor) return { error: "Invalid floor" };

      const challenge = {
        floorNumber,
        floor,
        playerId,
        startTime: Date.now(),
        enemiesKilled: 0,
        enemiesTotal: floor.enemies,
        status: "active",
      };

      progress.activeChallenge = challenge;

      this._emit("tower:floor_started", { playerId, floor });

      return challenge;
    }

    /**
     * Kill enemy on floor
     * @param {string} playerId - Player ID
     * @returns {Object} Result
     */
    killEnemy(playerId) {
      const progress = this.playerProgress.get(playerId);
      if (!progress || !progress.activeChallenge) {
        return { error: "No active challenge" };
      }

      const challenge = progress.activeChallenge;
      challenge.enemiesKilled++;

      // Check if floor complete
      if (challenge.enemiesKilled >= challenge.enemiesTotal) {
        return this.completeFloor(playerId);
      }

      this._emit("tower:enemy_killed", {
        playerId,
        progress: challenge.enemiesKilled,
        total: challenge.enemiesTotal,
      });

      return {
        success: true,
        remaining: challenge.enemiesTotal - challenge.enemiesKilled,
      };
    }

    /**
     * Complete floor
     * @param {string} playerId - Player ID
     * @returns {Object} Rewards
     */
    completeFloor(playerId) {
      const progress = this.playerProgress.get(playerId);
      if (!progress || !progress.activeChallenge) {
        return { error: "No active challenge" };
      }

      const challenge = progress.activeChallenge;
      const floor = challenge.floor;
      const clearTime = Date.now() - challenge.startTime;

      // Update progress
      if (challenge.floorNumber > progress.currentFloor) {
        progress.currentFloor = challenge.floorNumber;

        // Update highest floor globally
        if (challenge.floorNumber > this.stats.highestFloor) {
          this.stats.highestFloor = challenge.floorNumber;
        }
      }

      progress.floorsCleared++;
      progress.totalCandyPoints += floor.rewards.candy_points;

      this.stats.totalClears++;

      // Track fastest clear
      if (clearTime < this.stats.fastestClear.time) {
        this.stats.fastestClear = {
          floor: challenge.floorNumber,
          time: clearTime,
          playerId,
        };
      }

      // Check for rank up
      const newRank = this.getPlayerRank(playerId);
      if (newRank.rank !== progress.currentRank) {
        progress.currentRank = newRank.rank;

        this._emit("tower:rank_up", { playerId, rank: newRank });
      }

      delete progress.activeChallenge;

      this._emit("tower:floor_completed", {
        playerId,
        floor: challenge.floorNumber,
        clearTime,
        rewards: floor.rewards,
      });

      return {
        success: true,
        floor: challenge.floorNumber,
        clearTime,
        rewards: floor.rewards,
        currentRank: newRank,
      };
    }

    /**
     * Fail floor (death)
     * @param {string} playerId - Player ID
     * @returns {Object} Penalty
     */
    failFloor(playerId) {
      const progress = this.playerProgress.get(playerId);
      if (!progress || !progress.activeChallenge) {
        return { error: "No active challenge" };
      }

      const floor = progress.activeChallenge.floorNumber;

      // Apply penalty
      const pointsLost = Math.floor(
        progress.totalCandyPoints * this.options.deathPenalty
      );
      progress.totalCandyPoints = Math.max(
        0,
        progress.totalCandyPoints - pointsLost
      );

      this.stats.totalDeaths++;

      delete progress.activeChallenge;

      this._emit("tower:floor_failed", { playerId, floor, pointsLost });

      return {
        success: false,
        floor,
        penalty: pointsLost,
      };
    }

    /**
     * Enter candy gate
     * @param {string} playerId - Player ID
     * @param {string} gateId - Gate ID
     * @returns {Object} Gate instance
     */
    enterGate(playerId, gateId) {
      const gate = CANDY_GATES[gateId];
      if (!gate) return { error: "Invalid gate" };

      const playerRank = this.getPlayerRank(playerId);

      // Check rank requirement
      if (
        !playerRank ||
        !SWEET_RANKS[playerRank.rank].gateAccess.includes(gate.name)
      ) {
        return { error: `Rank ${gate.rank} required` };
      }

      const gateInstanceId = `gate_${Date.now()}`;

      const gateInstance = {
        id: gateInstanceId,
        gateId,
        gate,
        playerId,
        startTime: Date.now(),
        endTime: Date.now() + gate.duration,
        enemiesKilled: 0,
        enemiesTotal: gate.enemies,
        status: "active",
      };

      this.activeGates.set(gateInstanceId, gateInstance);

      // Auto-close after duration
      setTimeout(() => {
        if (this.activeGates.has(gateInstanceId)) {
          const g = this.activeGates.get(gateInstanceId);
          if (g.status === "active") {
            g.status = "expired";
            this._emit("gate:expired", { gate: g });
          }
        }
      }, gate.duration);

      this._emit("gate:entered", { playerId, gate: gateInstance });

      return gateInstance;
    }

    /**
     * Clear gate
     * @param {string} gateInstanceId - Gate instance ID
     * @returns {Object} Rewards
     */
    clearGate(gateInstanceId) {
      const gateInstance = this.activeGates.get(gateInstanceId);
      if (!gateInstance) return { error: "Gate not found" };

      gateInstance.status = "cleared";
      gateInstance.clearTime = Date.now() - gateInstance.startTime;

      // Add to history
      const history = this.gateHistory.get(gateInstance.playerId) || [];
      history.push({
        gateId: gateInstance.gateId,
        clearTime: gateInstance.clearTime,
        clearedAt: Date.now(),
      });
      this.gateHistory.set(gateInstance.playerId, history);

      this._emit("gate:cleared", { gate: gateInstance });

      this.activeGates.delete(gateInstanceId);

      return {
        success: true,
        rewards: gateInstance.gate.rewards,
        clearTime: gateInstance.clearTime,
      };
    }

    /**
     * Get daily rewards
     * @param {string} playerId - Player ID
     * @returns {Object} Rewards
     */
    getDailyRewards(playerId) {
      const rank = this.getPlayerRank(playerId);

      const rewards = {
        ...rank.dailyRewards,
        claimedAt: Date.now(),
      };

      this._emit("tower:daily_claimed", { playerId, rewards });

      return rewards;
    }

    /**
     * Get player progress
     * @param {string} playerId - Player ID
     * @returns {Object} Progress
     */
    getProgress(playerId) {
      return this.playerProgress.get(playerId) || null;
    }

    /**
     * Get leaderboard
     * @param {number} limit - Max entries
     * @returns {Array} Top players
     */
    getLeaderboard(limit = 100) {
      const players = Array.from(this.playerProgress.values());
      players.sort((a, b) => b.currentFloor - a.currentFloor);

      return players.slice(0, limit);
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        playerProgress: Array.from(this.playerProgress.entries()),
        gateHistory: Array.from(this.gateHistory.entries()),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.playerProgress.clear();
      if (data.playerProgress) {
        data.playerProgress.forEach(([playerId, progress]) => {
          this.playerProgress.set(playerId, progress);
        });
      }

      this.gateHistory.clear();
      if (data.gateHistory) {
        data.gateHistory.forEach(([playerId, history]) => {
          this.gateHistory.set(playerId, history);
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("candy_tower:loaded");
    }

    // Private methods
    _createProgress(playerId) {
      const progress = {
        playerId,
        currentFloor: 0,
        highestFloor: 0,
        floorsCleared: 0,
        currentRank: "C",
        totalCandyPoints: 0,
        abilities: [],
        joinedAt: Date.now(),
      };

      this.playerProgress.set(playerId, progress);

      return progress;
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[CandyTowerSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  CandyTowerSystem.SWEET_RANKS = SWEET_RANKS;
  CandyTowerSystem.RANK_KEYS = RANK_KEYS;
  CandyTowerSystem.TOWER_FLOORS = TOWER_FLOORS;
  CandyTowerSystem.CANDY_GATES = CANDY_GATES;
  CandyTowerSystem.GATE_KEYS = GATE_KEYS;
  CandyTowerSystem.TOWER_ABILITIES = TOWER_ABILITIES;
  // WORLD removed - was not defined

  return CandyTowerSystem;
});
