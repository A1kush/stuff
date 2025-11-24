/**
 * PvPArenaSystem.js - Complete PvP Arena & Tournaments
 * @version 1.0.0
 * @description Arena battles, matchmaking, leaderboards, tournaments
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PvPArenaSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // ARENA RANKS (10 Tiers)
  // ============================

  const ARENA_RANKS = {
    bronze: {
      id: "bronze",
      name: "Bronze",
      minRating: 0,
      maxRating: 999,
      color: "#CD7F32",
      icon: "🥉",
      rewards: { gold: 100, ap: 5 },
    },
    silver: {
      id: "silver",
      name: "Silver",
      minRating: 1000,
      maxRating: 1499,
      color: "#C0C0C0",
      icon: "🥈",
      rewards: { gold: 500, ap: 10 },
    },
    gold: {
      id: "gold",
      name: "Gold",
      minRating: 1500,
      maxRating: 1999,
      color: "#FFD700",
      icon: "🥇",
      rewards: { gold: 1000, ap: 20 },
    },
    platinum: {
      id: "platinum",
      name: "Platinum",
      minRating: 2000,
      maxRating: 2499,
      color: "#E5E4E2",
      icon: "💎",
      rewards: { gold: 2000, ap: 40 },
    },
    diamond: {
      id: "diamond",
      name: "Diamond",
      minRating: 2500,
      maxRating: 2999,
      color: "#B9F2FF",
      icon: "💠",
      rewards: { gold: 5000, ap: 75 },
    },
    master: {
      id: "master",
      name: "Master",
      minRating: 3000,
      maxRating: 3499,
      color: "#9C27B0",
      icon: "🔮",
      rewards: { gold: 10000, ap: 150 },
    },
    grandmaster: {
      id: "grandmaster",
      name: "Grandmaster",
      minRating: 3500,
      maxRating: 3999,
      color: "#FF6B6B",
      icon: "⚡",
      rewards: { gold: 20000, ap: 300 },
    },
    challenger: {
      id: "challenger",
      name: "Challenger",
      minRating: 4000,
      maxRating: 4499,
      color: "#FF1744",
      icon: "🔥",
      rewards: { gold: 40000, ap: 500 },
    },
    legend: {
      id: "legend",
      name: "Legend",
      minRating: 4500,
      maxRating: 4999,
      color: "#FFD700",
      icon: "👑",
      rewards: { gold: 80000, ap: 800 },
    },
    mythic_arena: {
      id: "mythic_arena",
      name: "Mythic",
      minRating: 5000,
      maxRating: 99999,
      color: "#FF1744",
      icon: "🌟",
      rewards: { gold: 150000, ap: 1500 },
    },
  };

  // ============================
  // TOURNAMENT TYPES
  // ============================

  const TOURNAMENT_TYPES = {
    daily_1v1: {
      id: "daily_1v1",
      name: "Daily Duel",
      type: "1v1",
      duration: 86400000, // 24 hours
      maxParticipants: 64,
      rewards: {
        1: { gold: 10000, ap: 100, title: "Daily Champion" },
        2: { gold: 5000, ap: 50 },
        3: { gold: 2500, ap: 25 },
      },
    },
    weekly_team: {
      id: "weekly_team",
      name: "Weekly Team Battle",
      type: "3v3",
      duration: 604800000, // 7 days
      maxParticipants: 32,
      rewards: {
        1: { gold: 50000, ap: 500, title: "Team Champion" },
        2: { gold: 25000, ap: 250 },
        3: { gold: 12500, ap: 125 },
      },
    },
    monthly_grand: {
      id: "monthly_grand",
      name: "Grand Tournament",
      type: "1v1",
      duration: 2592000000, // 30 days
      maxParticipants: 128,
      rewards: {
        1: { gold: 500000, ap: 5000, title: "Grand Champion" },
        2: { gold: 250000, ap: 2500 },
        3: { gold: 125000, ap: 1250 },
        top8: { gold: 50000, ap: 500 },
      },
    },
  };

  // ============================
  // PVP ARENA SYSTEM CLASS
  // ============================

  class PvPArenaSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          startingRating: 1000,
          kFactor: 32, // ELO K-factor
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Player ID -> Arena data */
      this.players = new Map();

      /** @type {Array} Leaderboard */
      this.leaderboard = [];

      /** @type {Map<string, Object>} Tournament ID -> Tournament data */
      this.activeTournaments = new Map();

      /** @type {Array} Match history */
      this.matchHistory = [];

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
     * Register player for arena
     * @param {string} playerId - Player ID
     * @param {Object} stats - Player stats
     * @returns {Object} Arena profile
     */
    registerPlayer(playerId, stats = {}) {
      if (this.players.has(playerId)) {
        return this.players.get(playerId);
      }

      const profile = {
        playerId,
        rating: this.options.startingRating,
        rank: this._getRankByRating(this.options.startingRating),
        wins: 0,
        losses: 0,
        winStreak: 0,
        bestWinStreak: 0,
        totalMatches: 0,
        totalDamageDealt: 0,
        totalDamageTaken: 0,
        tournaments: {
          participated: 0,
          wins: 0,
          top3: 0,
        },
        titles: [],
        registeredAt: Date.now(),
      };

      this.players.set(playerId, profile);
      this._updateLeaderboard();

      this._emit("arena:player_registered", { profile });

      return profile;
    }

    /**
     * Find match for player
     * @param {string} playerId - Player ID
     * @returns {Object|null} Matched opponent
     */
    findMatch(playerId) {
      const player = this.players.get(playerId);
      if (!player) return null;

      // Find opponent with similar rating (±200)
      const minRating = player.rating - 200;
      const maxRating = player.rating + 200;

      const candidates = Array.from(this.players.values()).filter(
        (p) =>
          p.playerId !== playerId &&
          p.rating >= minRating &&
          p.rating <= maxRating
      );

      if (candidates.length === 0) return null;

      // Pick random opponent from candidates
      const opponent = candidates[Math.floor(Math.random() * candidates.length)];

      this._emit("arena:match_found", { player, opponent });

      return opponent;
    }

    /**
     * Simulate PvP battle
     * @param {string} player1Id - Player 1 ID
     * @param {string} player2Id - Player 2 ID
     * @returns {Object} Battle result
     */
    simulateBattle(player1Id, player2Id) {
      const player1 = this.players.get(player1Id);
      const player2 = this.players.get(player2Id);

      if (!player1 || !player2) return null;

      // Simple win probability based on rating difference
      const ratingDiff = player1.rating - player2.rating;
      const winProbability = 1 / (1 + Math.pow(10, -ratingDiff / 400));

      const roll = Math.random();
      const winner = roll < winProbability ? player1Id : player2Id;
      const loser = winner === player1Id ? player2Id : player1Id;

      // Update ratings (ELO system)
      this._updateRatings(winner, loser);

      // Update stats
      const winnerProfile = this.players.get(winner);
      const loserProfile = this.players.get(loser);

      winnerProfile.wins++;
      winnerProfile.winStreak++;
      winnerProfile.totalMatches++;
      winnerProfile.bestWinStreak = Math.max(
        winnerProfile.bestWinStreak,
        winnerProfile.winStreak
      );

      loserProfile.losses++;
      loserProfile.winStreak = 0;
      loserProfile.totalMatches++;

      // Update leaderboard
      this._updateLeaderboard();

      // Record match
      const matchResult = {
        matchId: `match_${Date.now()}`,
        player1: player1Id,
        player2: player2Id,
        winner,
        loser,
        timestamp: Date.now(),
        ratingChange: {
          winner: winnerProfile.rating,
          loser: loserProfile.rating,
        },
      };

      this.matchHistory.push(matchResult);

      this._emit("arena:match_complete", { result: matchResult });

      return matchResult;
    }

    /**
     * Get player's arena profile
     * @param {string} playerId - Player ID
     * @returns {Object|null}
     */
    getProfile(playerId) {
      return this.players.get(playerId) || null;
    }

    /**
     * Get leaderboard
     * @param {number} limit - Top N players
     * @returns {Array}
     */
    getLeaderboard(limit = 100) {
      return this.leaderboard.slice(0, limit);
    }

    /**
     * Get player's rank on leaderboard
     * @param {string} playerId - Player ID
     * @returns {number} Rank (1-indexed)
     */
    getPlayerRank(playerId) {
      const index = this.leaderboard.findIndex((p) => p.playerId === playerId);
      return index >= 0 ? index + 1 : -1;
    }

    /**
     * Create tournament
     * @param {string} tournamentType - Tournament type
     * @returns {Object} Tournament data
     */
    createTournament(tournamentType) {
      const template = TOURNAMENT_TYPES[tournamentType];
      if (!template) return null;

      const tournamentId = `tournament_${Date.now()}`;

      const tournament = {
        id: tournamentId,
        ...template,
        participants: [],
        matches: [],
        startTime: Date.now(),
        endTime: Date.now() + template.duration,
        status: "registration",
        currentRound: 0,
      };

      this.activeTournaments.set(tournamentId, tournament);

      this._emit("tournament:created", { tournament });

      return tournament;
    }

    /**
     * Register for tournament
     * @param {string} tournamentId - Tournament ID
     * @param {string} playerId - Player ID
     * @returns {boolean} Success
     */
    registerForTournament(tournamentId, playerId) {
      const tournament = this.activeTournaments.get(tournamentId);
      const player = this.players.get(playerId);

      if (!tournament || !player) return false;
      if (tournament.status !== "registration") return false;
      if (tournament.participants.length >= tournament.maxParticipants)
        return false;

      tournament.participants.push(playerId);
      player.tournaments.participated++;

      this._emit("tournament:registered", { tournamentId, playerId });

      return true;
    }

    /**
     * Start tournament
     * @param {string} tournamentId - Tournament ID
     * @returns {boolean} Success
     */
    startTournament(tournamentId) {
      const tournament = this.activeTournaments.get(tournamentId);
      if (!tournament) return false;

      tournament.status = "active";
      tournament.currentRound = 1;

      // Generate first round matches
      this._generateTournamentMatches(tournament);

      this._emit("tournament:started", { tournament });

      return true;
    }

    /**
     * Advance tournament round
     * @param {string} tournamentId - Tournament ID
     * @returns {Object|null} Tournament state
     */
    advanceTournamentRound(tournamentId) {
      const tournament = this.activeTournaments.get(tournamentId);
      if (!tournament || tournament.status !== "active") return null;

      // Check if all matches complete
      const roundMatches = tournament.matches.filter(
        (m) => m.round === tournament.currentRound
      );
      const allComplete = roundMatches.every((m) => m.completed);

      if (!allComplete) return null;

      // Get winners
      const winners = roundMatches.map((m) => m.winner);

      if (winners.length === 1) {
        // Tournament complete!
        tournament.status = "complete";
        tournament.winner = winners[0];

        this._distributeTournamentRewards(tournament);

        this._emit("tournament:complete", { tournament });

        return tournament;
      }

      // Advance to next round
      tournament.currentRound++;
      tournament.participants = winners;
      this._generateTournamentMatches(tournament);

      this._emit("tournament:round_advanced", {
        tournament,
        round: tournament.currentRound,
      });

      return tournament;
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        players: Array.from(this.players.entries()),
        leaderboard: this.leaderboard,
        activeTournaments: Array.from(this.activeTournaments.entries()),
        matchHistory: this.matchHistory.slice(-100), // Last 100 matches
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.players.clear();
      if (data.players) {
        data.players.forEach(([id, profile]) => {
          this.players.set(id, profile);
        });
      }

      this.leaderboard = data.leaderboard || [];

      this.activeTournaments.clear();
      if (data.activeTournaments) {
        data.activeTournaments.forEach(([id, tournament]) => {
          this.activeTournaments.set(id, tournament);
        });
      }

      this.matchHistory = data.matchHistory || [];

      this._emit("arena:loaded", { players: this.players.size });
    }

    // Private methods
    _updateRatings(winnerId, loserId) {
      const winner = this.players.get(winnerId);
      const loser = this.players.get(loserId);

      // Calculate expected scores
      const expectedWinner =
        1 / (1 + Math.pow(10, (loser.rating - winner.rating) / 400));
      const expectedLoser = 1 - expectedWinner;

      // Update ratings
      const winnerRatingChange = Math.round(
        this.options.kFactor * (1 - expectedWinner)
      );
      const loserRatingChange = Math.round(
        this.options.kFactor * (0 - expectedLoser)
      );

      winner.rating += winnerRatingChange;
      loser.rating += loserRatingChange;

      // Ensure minimum rating of 0
      winner.rating = Math.max(0, winner.rating);
      loser.rating = Math.max(0, loser.rating);

      // Update ranks
      winner.rank = this._getRankByRating(winner.rating);
      loser.rank = this._getRankByRating(loser.rating);
    }

    _getRankByRating(rating) {
      for (const rank of Object.values(ARENA_RANKS)) {
        if (rating >= rank.minRating && rating <= rank.maxRating) {
          return rank.id;
        }
      }
      return "bronze";
    }

    _updateLeaderboard() {
      this.leaderboard = Array.from(this.players.values())
        .sort((a, b) => b.rating - a.rating)
        .map((player, index) => ({
          rank: index + 1,
          playerId: player.playerId,
          rating: player.rating,
          wins: player.wins,
          losses: player.losses,
          winRate:
            player.totalMatches > 0
              ? (player.wins / player.totalMatches) * 100
              : 0,
        }));
    }

    _generateTournamentMatches(tournament) {
      const participants = [...tournament.participants];

      // Shuffle participants
      for (let i = participants.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [participants[i], participants[j]] = [
          participants[j],
          participants[i],
        ];
      }

      // Create bracket matches
      for (let i = 0; i < participants.length; i += 2) {
        if (i + 1 < participants.length) {
          tournament.matches.push({
            matchId: `${tournament.id}_round${tournament.currentRound}_${i / 2}`,
            round: tournament.currentRound,
            player1: participants[i],
            player2: participants[i + 1],
            winner: null,
            completed: false,
          });
        }
      }
    }

    _distributeTournamentRewards(tournament) {
      // Award based on placement
      const winner = tournament.winner;
      const template = TOURNAMENT_TYPES[tournament.id.split("_")[0]];

      if (!template) return;

      const winnerProfile = this.players.get(winner);
      if (winnerProfile) {
        winnerProfile.tournaments.wins++;

        // Give rewards
        const rewards = template.rewards[1];
        if (rewards.title) {
          winnerProfile.titles.push(rewards.title);
        }

        this._emit("tournament:reward", { playerId: winner, rewards });
      }
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[PvPArenaSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  PvPArenaSystem.ARENA_RANKS = ARENA_RANKS;
  PvPArenaSystem.TOURNAMENT_TYPES = TOURNAMENT_TYPES;

  return PvPArenaSystem;
});

