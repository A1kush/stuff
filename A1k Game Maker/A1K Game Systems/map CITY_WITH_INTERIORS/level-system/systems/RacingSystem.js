/**
 * RacingSystem.js - Racing & Time Trials
 * @version 1.0.0
 * @description Races, leaderboards, vehicles, racing rewards
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.RacingSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // RACE TRACKS (15 Tracks)
  // ============================

  const RACE_TRACKS = {
    // Beginner (5)
    meadow_circuit: {
      id: "meadow_circuit",
      name: "Meadow Circuit",
      difficulty: 1,
      icon: "🌾",
      laps: 3,
      checkpoints: 5,
      parTime: 180000, // 3 minutes
      rewards: { gold: 5000, xp: 1000 },
    },
    forest_trail: {
      id: "forest_trail",
      name: "Forest Trail",
      difficulty: 1,
      icon: "🌲",
      laps: 2,
      checkpoints: 8,
      parTime: 150000,
      rewards: { gold: 6000, xp: 1200 },
    },

    // Intermediate (5)
    mountain_pass: {
      id: "mountain_pass",
      name: "Mountain Pass",
      difficulty: 2,
      icon: "⛰️",
      laps: 4,
      checkpoints: 10,
      parTime: 240000,
      rewards: { gold: 15000, xp: 3000 },
    },
    desert_dash: {
      id: "desert_dash",
      name: "Desert Dash",
      difficulty: 2,
      icon: "🏜️",
      laps: 3,
      checkpoints: 12,
      parTime: 200000,
      rewards: { gold: 18000, xp: 3500 },
    },

    // Advanced (5)
    volcano_speedway: {
      id: "volcano_speedway",
      name: "Volcano Speedway",
      difficulty: 3,
      icon: "🌋",
      laps: 5,
      checkpoints: 15,
      parTime: 300000,
      rewards: { gold: 50000, xp: 10000 },
    },
    sky_highway: {
      id: "sky_highway",
      name: "Sky Highway",
      difficulty: 3,
      icon: "☁️",
      laps: 4,
      checkpoints: 20,
      parTime: 280000,
      rewards: { gold: 60000, xp: 12000 },
    },
    rainbow_road: {
      id: "rainbow_road",
      name: "Rainbow Road",
      difficulty: 4,
      icon: "🌈",
      laps: 6,
      checkpoints: 25,
      parTime: 360000,
      rewards: { gold: 150000, xp: 30000 },
    },
    void_circuit: {
      id: "void_circuit",
      name: "Void Circuit",
      difficulty: 5,
      icon: "🕳️",
      laps: 8,
      checkpoints: 30,
      parTime: 480000,
      rewards: { gold: 500000, xp: 100000 },
    },
    dimension_dash: {
      id: "dimension_dash",
      name: "Dimension Dash",
      difficulty: 5,
      icon: "🌌",
      laps: 10,
      checkpoints: 50,
      parTime: 600000,
      rewards: { gold: 1000000, xp: 250000 },
    },
  };

  const TRACK_KEYS = Object.keys(RACE_TRACKS);

  // ============================
  // RACING SYSTEM CLASS
  // ============================

  class RacingSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Player ID -> Best times */
      this.playerRecords = new Map();

      /** @type {Map<string, Array>} Track ID -> Leaderboard */
      this.leaderboards = new Map();

      /** @type {Map<string, Object>} Race ID -> Active race */
      this.activeRaces = new Map();

      /** @type {Object} Global records */
      this.worldRecords = {};

      /** @type {Object} Statistics */
      this.stats = {
        totalRaces: 0,
        totalWins: 0,
        perfectRuns: 0,
      };

      // Initialize leaderboards
      TRACK_KEYS.forEach((trackId) => {
        this.leaderboards.set(trackId, []);
        this.worldRecords[trackId] = null;
      });

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("racing:ready", { tracks: TRACK_KEYS.length });

      return this;
    }

    /**
     * Start race
     * @param {string} playerId - Player ID
     * @param {string} trackId - Track ID
     * @returns {Object} Race data
     */
    startRace(playerId, trackId) {
      const track = RACE_TRACKS[trackId];
      if (!track) return { error: "Invalid track" };

      const raceId = `race_${Date.now()}`;

      const race = {
        id: raceId,
        playerId,
        trackId,
        track,
        startTime: Date.now(),
        currentLap: 1,
        currentCheckpoint: 0,
        checkpointTimes: [],
        lapTimes: [],
        penalties: 0,
        status: "active",
      };

      this.activeRaces.set(raceId, race);

      this.stats.totalRaces++;

      this._emit("race:started", { race });

      return race;
    }

    /**
     * Pass checkpoint
     * @param {string} raceId - Race ID
     * @returns {Object} Result
     */
    passCheckpoint(raceId) {
      const race = this.activeRaces.get(raceId);
      if (!race || race.status !== "active") {
        return { error: "Invalid race" };
      }

      race.currentCheckpoint++;
      const now = Date.now();
      const elapsed = now - race.startTime;

      race.checkpointTimes.push(elapsed);

      // Check if lap complete
      if (race.currentCheckpoint >= race.track.checkpoints) {
        race.currentCheckpoint = 0;
        race.currentLap++;
        race.lapTimes.push(elapsed);

        this._emit("race:lap_complete", {
          raceId,
          lap: race.currentLap - 1,
          time: elapsed,
        });

        // Check if race complete
        if (race.currentLap > race.track.laps) {
          return this._completeRace(raceId);
        }
      }

      this._emit("race:checkpoint", { raceId, checkpoint: race.currentCheckpoint });

      return { success: true, race };
    }

    /**
     * Add penalty
     * @param {string} raceId - Race ID
     * @param {number} penaltyTime - Penalty in ms
     * @returns {Object} Race
     */
    addPenalty(raceId, penaltyTime = 5000) {
      const race = this.activeRaces.get(raceId);
      if (!race) return { error: "Invalid race" };

      race.penalties += penaltyTime;

      this._emit("race:penalty", { raceId, penalty: penaltyTime });

      return race;
    }

    /**
     * Forfeit race
     * @param {string} raceId - Race ID
     * @returns {boolean} Success
     */
    forfeitRace(raceId) {
      const race = this.activeRaces.get(raceId);
      if (!race) return false;

      race.status = "forfeited";
      race.endTime = Date.now();

      this._emit("race:forfeited", { race });

      this.activeRaces.delete(raceId);

      return true;
    }

    /**
     * Get leaderboard
     * @param {string} trackId - Track ID
     * @param {number} limit - Max entries
     * @returns {Array} Leaderboard
     */
    getLeaderboard(trackId, limit = 100) {
      const leaderboard = this.leaderboards.get(trackId) || [];
      return leaderboard.slice(0, limit);
    }

    /**
     * Get player's best time
     * @param {string} playerId - Player ID
     * @param {string} trackId - Track ID
     * @returns {number|null} Best time
     */
    getPlayerBest(playerId, trackId) {
      const records = this.playerRecords.get(playerId);
      return records && records[trackId] ? records[trackId].time : null;
    }

    /**
     * Get world record
     * @param {string} trackId - Track ID
     * @returns {Object|null} World record
     */
    getWorldRecord(trackId) {
      return this.worldRecords[trackId] || null;
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        playerRecords: Array.from(this.playerRecords.entries()),
        leaderboards: Array.from(this.leaderboards.entries()),
        worldRecords: this.worldRecords,
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.playerRecords.clear();
      if (data.playerRecords) {
        data.playerRecords.forEach(([playerId, records]) => {
          this.playerRecords.set(playerId, records);
        });
      }

      this.leaderboards.clear();
      if (data.leaderboards) {
        data.leaderboards.forEach(([trackId, board]) => {
          this.leaderboards.set(trackId, board);
        });
      }

      if (data.worldRecords) {
        this.worldRecords = data.worldRecords;
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("racing:loaded");
    }

    // Private methods
    _completeRace(raceId) {
      const race = this.activeRaces.get(raceId);
      if (!race) return { error: "Race not found" };

      race.status = "completed";
      race.endTime = Date.now();
      race.totalTime = race.endTime - race.startTime + race.penalties;

      const track = race.track;

      // Calculate performance
      const parTime = track.parTime;
      let rank = "F";
      let multiplier = 0.5;

      if (race.totalTime <= parTime * 0.7) {
        rank = "S";
        multiplier = 3.0;
      } else if (race.totalTime <= parTime * 0.8) {
        rank = "A";
        multiplier = 2.5;
      } else if (race.totalTime <= parTime * 0.9) {
        rank = "B";
        multiplier = 2.0;
      } else if (race.totalTime <= parTime) {
        rank = "C";
        multiplier = 1.5;
      } else if (race.totalTime <= parTime * 1.2) {
        rank = "D";
        multiplier = 1.0;
      }

      // Calculate rewards
      const gold = Math.floor(track.rewards.gold * multiplier);
      const xp = Math.floor(track.rewards.xp * multiplier);

      const result = {
        raceId,
        playerId: race.playerId,
        trackId: race.trackId,
        totalTime: race.totalTime,
        penalties: race.penalties,
        rank,
        rewards: { gold, xp },
        perfect: race.penalties === 0,
      };

      if (race.penalties === 0) {
        this.stats.perfectRuns++;
      }

      // Update personal best
      this._updatePersonalBest(race.playerId, race.trackId, race.totalTime);

      // Update leaderboard
      this._updateLeaderboard(race.trackId, {
        playerId: race.playerId,
        time: race.totalTime,
        rank,
        completedAt: Date.now(),
      });

      // Check world record
      const worldRecord = this.worldRecords[race.trackId];
      if (!worldRecord || race.totalTime < worldRecord.time) {
        this.worldRecords[race.trackId] = {
          playerId: race.playerId,
          time: race.totalTime,
          completedAt: Date.now(),
        };

        this._emit("race:world_record", { trackId: race.trackId, record: result });
      }

      this._emit("race:completed", { race, result });

      this.activeRaces.delete(raceId);

      return result;
    }

    _updatePersonalBest(playerId, trackId, time) {
      const records = this.playerRecords.get(playerId) || {};

      if (!records[trackId] || time < records[trackId].time) {
        records[trackId] = {
          time,
          completedAt: Date.now(),
        };

        this.playerRecords.set(playerId, records);

        this._emit("race:personal_best", { playerId, trackId, time });
      }
    }

    _updateLeaderboard(trackId, entry) {
      const leaderboard = this.leaderboards.get(trackId) || [];

      leaderboard.push(entry);
      leaderboard.sort((a, b) => a.time - b.time);

      // Keep top 1000
      if (leaderboard.length > 1000) {
        leaderboard.length = 1000;
      }

      this.leaderboards.set(trackId, leaderboard);
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[RacingSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  RacingSystem.RACE_TRACKS = RACE_TRACKS;
  RacingSystem.TRACK_KEYS = TRACK_KEYS;

  return RacingSystem;
});

