/**
 * CombatArenaSystem.js - 1v1 Combat Arena & Tournaments
 * @version 1.0.0
 * @description Battle arena, spectate mode, rankings, tournaments, rewards
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CombatArenaSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // ARENA RANKS (15 Tiers)
  // ============================

  const ARENA_RANKS = {
    bronze: { id: "bronze", name: "Bronze", tier: 1, icon: "🥉", points: 0, rewards: { gold: 1000 } },
    silver: { id: "silver", name: "Silver", tier: 2, icon: "🥈", points: 500, rewards: { gold: 5000 } },
    gold: { id: "gold", name: "Gold", tier: 3, icon: "🥇", points: 1000, rewards: { gold: 15000 } },
    platinum: { id: "platinum", name: "Platinum", tier: 4, icon: "💎", points: 2000, rewards: { gold: 50000 } },
    diamond: { id: "diamond", name: "Diamond", tier: 5, icon: "💠", points: 3500, rewards: { gold: 150000 } },
    master: { id: "master", name: "Master", tier: 6, icon: "⭐", points: 5000, rewards: { gold: 500000 } },
    grandmaster: { id: "grandmaster", name: "Grandmaster", tier: 7, icon: "🌟", points: 7500, rewards: { gold: 2000000 } },
    champion: { id: "champion", name: "Champion", tier: 8, icon: "👑", points: 10000, rewards: { gold: 10000000, title: "arena_champion" } },
  };

  const RANK_KEYS = Object.keys(ARENA_RANKS);

  // ============================
  // COMBAT ARENA SYSTEM CLASS
  // ============================

  class CombatArenaSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          enableSpectate: true,
          enableTournaments: true,
          rankDecayDays: 7,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Player ID -> Arena stats */
      this.playerStats = new Map();

      /** @type {Map<string, Object>} Match ID -> Match data */
      this.activeMatches = new Map();

      /** @type {Array} Leaderboard */
      this.leaderboard = [];

      /** @type {Map<string, Set>} Match ID -> Spectators */
      this.spectators = new Map();

      /** @type {Array} Tournament queue */
      this.tournamentQueue = [];

      /** @type {Object} Global statistics */
      this.stats = {
        totalMatches: 0,
        totalKnockouts: 0,
        longestMatch: { duration: 0, players: [] },
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("arena:ready");

      return this;
    }

    /**
     * Queue for match
     * @param {string} playerId - Player ID
     * @returns {Object} Queue status
     */
    queueForMatch(playerId) {
      // Get or create player stats
      const stats = this.playerStats.get(playerId) || this._createPlayerStats(playerId);

      // Find opponent
      const opponent = this._findOpponent(playerId, stats.points);

      if (opponent) {
        return this.startMatch(playerId, opponent.playerId);
      }

      // Add to queue
      stats.queued = true;
      stats.queuedAt = Date.now();

      this._emit("arena:queued", { playerId });

      return { success: true, queued: true };
    }

    /**
     * Start arena match
     * @param {string} player1Id - Player 1 ID
     * @param {string} player2Id - Player 2 ID
     * @returns {Object} Match data
     */
    startMatch(player1Id, player2Id) {
      const matchId = `arena_${Date.now()}`;

      const match = {
        id: matchId,
        player1: {
          id: player1Id,
          hp: 100,
          energy: 100,
          combo: 0,
        },
        player2: {
          id: player2Id,
          hp: 100,
          energy: 100,
          combo: 0,
        },
        turn: 1,
        status: "active",
        startedAt: Date.now(),
        history: [],
      };

      this.activeMatches.set(matchId, match);
      this.spectators.set(matchId, new Set());

      this.stats.totalMatches++;

      // Remove from queue
      const stats1 = this.playerStats.get(player1Id);
      const stats2 = this.playerStats.get(player2Id);
      if (stats1) stats1.queued = false;
      if (stats2) stats2.queued = false;

      this._emit("arena:match_started", { match });

      return match;
    }

    /**
     * Perform action in match
     * @param {string} matchId - Match ID
     * @param {string} playerId - Player ID
     * @param {string} action - Action type (attack, defend, special)
     * @returns {Object} Result
     */
    performAction(matchId, playerId, action) {
      const match = this.activeMatches.get(matchId);
      if (!match || match.status !== "active") {
        return { error: "Invalid match" };
      }

      const playerKey = match.player1.id === playerId ? "player1" : "player2";
      const opponentKey = playerKey === "player1" ? "player2" : "player1";

      const player = match[playerKey];
      const opponent = match[opponentKey];

      let result = {};

      switch (action) {
        case "attack":
          const damage = 10 + player.combo * 2;
          opponent.hp -= damage;
          player.combo++;
          result = { action: "attack", damage, combo: player.combo };
          break;

        case "defend":
          player.hp = Math.min(100, player.hp + 5);
          player.combo = 0;
          result = { action: "defend", healed: 5 };
          break;

        case "special":
          if (player.energy >= 50) {
            const specialDamage = 30 + player.combo * 5;
            opponent.hp -= specialDamage;
            player.energy -= 50;
            player.combo = 0;
            result = { action: "special", damage: specialDamage };
          } else {
            return { error: "Not enough energy" };
          }
          break;

        default:
          return { error: "Invalid action" };
      }

      // Regenerate energy
      player.energy = Math.min(100, player.energy + 10);

      match.turn++;
      match.history.push({
        turn: match.turn,
        playerId,
        ...result,
        timestamp: Date.now(),
      });

      // Check win condition
      if (opponent.hp <= 0) {
        return this._endMatch(matchId, playerId);
      }

      this._emit("arena:action_performed", { matchId, playerId, result });

      return { success: true, result, match };
    }

    /**
     * Forfeit match
     * @param {string} matchId - Match ID
     * @param {string} playerId - Player ID
     * @returns {Object} Result
     */
    forfeitMatch(matchId, playerId) {
      const match = this.activeMatches.get(matchId);
      if (!match) return { error: "Invalid match" };

      const opponentId = match.player1.id === playerId ? match.player2.id : match.player1.id;

      return this._endMatch(matchId, opponentId, "forfeit");
    }

    /**
     * Spectate match
     * @param {string} matchId - Match ID
     * @param {string} spectatorId - Spectator ID
     * @returns {Object} Match data
     */
    spectateMatch(matchId, spectatorId) {
      if (!this.options.enableSpectate) {
        return { error: "Spectating disabled" };
      }

      const match = this.activeMatches.get(matchId);
      if (!match) return { error: "Invalid match" };

      const spectators = this.spectators.get(matchId) || new Set();
      spectators.add(spectatorId);
      this.spectators.set(matchId, spectators);

      this._emit("arena:spectator_joined", { matchId, spectatorId });

      return match;
    }

    /**
     * Get leaderboard
     * @param {number} limit - Max entries
     * @returns {Array} Top players
     */
    getLeaderboard(limit = 100) {
      return this.leaderboard.slice(0, limit);
    }

    /**
     * Get player stats
     * @param {string} playerId - Player ID
     * @returns {Object} Stats
     */
    getPlayerStats(playerId) {
      return this.playerStats.get(playerId) || null;
    }

    /**
     * Get player rank
     * @param {string} playerId - Player ID
     * @returns {Object} Rank
     */
    getPlayerRank(playerId) {
      const stats = this.playerStats.get(playerId);
      if (!stats) return ARENA_RANKS.bronze;

      for (let i = RANK_KEYS.length - 1; i >= 0; i--) {
        const rank = ARENA_RANKS[RANK_KEYS[i]];
        if (stats.points >= rank.points) {
          return rank;
        }
      }

      return ARENA_RANKS.bronze;
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        playerStats: Array.from(this.playerStats.entries()),
        leaderboard: this.leaderboard,
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.playerStats.clear();
      if (data.playerStats) {
        data.playerStats.forEach(([playerId, stats]) => {
          this.playerStats.set(playerId, stats);
        });
      }

      if (data.leaderboard) {
        this.leaderboard = data.leaderboard;
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("arena:loaded");
    }

    // Private methods
    _createPlayerStats(playerId) {
      const stats = {
        playerId,
        wins: 0,
        losses: 0,
        points: 0,
        winStreak: 0,
        bestRank: "bronze",
        totalMatches: 0,
        knockouts: 0,
        queued: false,
      };

      this.playerStats.set(playerId, stats);

      return stats;
    }

    _findOpponent(playerId, points) {
      // Find player in queue with similar points
      for (const [otherId, stats] of this.playerStats.entries()) {
        if (otherId === playerId) continue;
        if (!stats.queued) continue;

        const pointDiff = Math.abs(stats.points - points);
        if (pointDiff <= 500) {
          return stats;
        }
      }

      return null;
    }

    _endMatch(matchId, winnerId, reason = "knockout") {
      const match = this.activeMatches.get(matchId);
      if (!match) return { error: "Match not found" };

      match.status = "completed";
      match.winner = winnerId;
      match.reason = reason;
      match.endedAt = Date.now();
      match.duration = match.endedAt - match.startedAt;

      const loserId = match.player1.id === winnerId ? match.player2.id : match.player1.id;

      // Update stats
      const winnerStats = this.playerStats.get(winnerId) || this._createPlayerStats(winnerId);
      const loserStats = this.playerStats.get(loserId) || this._createPlayerStats(loserId);

      winnerStats.wins++;
      winnerStats.winStreak++;
      winnerStats.totalMatches++;
      winnerStats.points += 25 + winnerStats.winStreak * 5;

      if (reason === "knockout") {
        winnerStats.knockouts++;
        this.stats.totalKnockouts++;
      }

      loserStats.losses++;
      loserStats.winStreak = 0;
      loserStats.totalMatches++;
      loserStats.points = Math.max(0, loserStats.points - 15);

      // Update best rank
      const winnerRank = this.getPlayerRank(winnerId);
      if (ARENA_RANKS[winnerRank.id].tier > ARENA_RANKS[winnerStats.bestRank].tier) {
        winnerStats.bestRank = winnerRank.id;
      }

      // Update leaderboard
      this._updateLeaderboard();

      // Track longest match
      if (match.duration > this.stats.longestMatch.duration) {
        this.stats.longestMatch = {
          duration: match.duration,
          players: [winnerId, loserId],
        };
      }

      this._emit("arena:match_ended", { match, winnerId, reason });

      this.activeMatches.delete(matchId);
      this.spectators.delete(matchId);

      return {
        success: true,
        winner: winnerId,
        reason,
        rewards: winnerRank.rewards,
      };
    }

    _updateLeaderboard() {
      this.leaderboard = Array.from(this.playerStats.values())
        .sort((a, b) => b.points - a.points)
        .slice(0, 1000);
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[CombatArenaSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  CombatArenaSystem.ARENA_RANKS = ARENA_RANKS;
  CombatArenaSystem.RANK_KEYS = RANK_KEYS;

  return CombatArenaSystem;
});

