/**
 * WorldBossSystem.js - Massive World Boss Encounters
 * @version 1.0.0
 * @description Raid bosses for entire server, massive HP, exclusive rewards
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.WorldBossSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // WORLD BOSSES (15 Bosses)
  // ============================

  const WORLD_BOSSES = {
    // Tier 1 World Bosses (5)
    golem_king: {
      id: "golem_king",
      name: "Golem King",
      tier: 1,
      icon: "🗿👑",
      hp: 1000000,
      atk: 500,
      def: 300,
      element: "earth",
      immunities: ["stun", "freeze"],
      spawns: ["Every 6 hours"],
      phases: [
        { hp: 100, attacks: ["rock_throw", "earthquake"] },
        { hp: 50, attacks: ["meteor_shower", "stone_prison"] },
        { hp: 25, attacks: ["titan_slam", "earth_rage"] },
      ],
      rewards: {
        participation: { gold: 50000, xp: 100000 },
        top10: { gold: 200000, xp: 500000, item: "golem_core" },
        mvp: { gold: 1000000, xp: 2000000, item: "king_crown" },
      },
    },
    hydra: {
      id: "hydra",
      name: "Nine-Headed Hydra",
      tier: 1,
      icon: "🐍🐍🐍",
      hp: 1500000,
      atk: 600,
      def: 200,
      element: "water",
      immunities: ["poison"],
      spawns: ["Every 8 hours"],
      phases: [
        { hp: 100, heads: 9, attacks: ["bite", "poison_spray"] },
        { hp: 66, heads: 6, attacks: ["tsunami", "acid_rain"] },
        { hp: 33, heads: 3, attacks: ["hydra_rage", "regen"] },
      ],
      rewards: {
        participation: { gold: 75000, xp: 150000 },
        top10: { gold: 300000, xp: 750000, item: "hydra_scale" },
        mvp: { gold: 1500000, xp: 3000000, item: "hydra_heart" },
      },
    },

    // Tier 2 World Bosses (5)
    ancient_wyrm: {
      id: "ancient_wyrm",
      name: "Ancient Wyrm",
      tier: 2,
      icon: "🐉",
      hp: 5000000,
      atk: 1200,
      def: 600,
      element: "fire",
      immunities: ["burn", "bleed"],
      spawns: ["Every 12 hours"],
      phases: [
        { hp: 100, attacks: ["flame_breath", "tail_swipe"] },
        { hp: 66, attacks: ["inferno", "wing_gust"] },
        { hp: 33, attacks: ["dragon_roar", "meteor_fall"] },
        { hp: 10, attacks: ["final_blaze", "self_destruct"] },
      ],
      rewards: {
        participation: { gold: 200000, xp: 500000 },
        top10: { gold: 1000000, xp: 2000000, item: "wyrm_fang" },
        mvp: { gold: 5000000, xp: 10000000, item: "dragon_soul" },
      },
    },
    void_emperor: {
      id: "void_emperor",
      name: "Void Emperor",
      tier: 2,
      icon: "🕳️👑",
      hp: 10000000,
      atk: 1500,
      def: 800,
      element: "void",
      immunities: ["all_status"],
      spawns: ["Every 24 hours"],
      phases: [
        { hp: 100, attacks: ["void_spike", "dark_wave"] },
        { hp: 75, attacks: ["summon_adds", "void_prison"] },
        { hp: 50, attacks: ["black_hole", "chaos_beam"] },
        { hp: 25, attacks: ["void_realm", "ultimate_darkness"] },
        { hp: 5, attacks: ["apocalypse", "void_collapse"] },
      ],
      rewards: {
        participation: { gold: 500000, xp: 1000000 },
        top10: { gold: 2500000, xp: 5000000, item: "void_shard" },
        mvp: { gold: 10000000, xp: 25000000, item: "emperor_crown" },
      },
    },

    // Tier 3 World Bosses (5) - Ultimate
    primordial_titan: {
      id: "primordial_titan",
      name: "Primordial Titan",
      tier: 3,
      icon: "🌌",
      hp: 50000000,
      atk: 3000,
      def: 2000,
      element: "primordial",
      immunities: ["all_status", "all_debuffs"],
      spawns: ["Every 7 days"],
      phases: [
        { hp: 100, attacks: ["titan_slam", "shockwave"] },
        { hp: 80, attacks: ["cosmic_ray", "star_fall"] },
        { hp: 60, attacks: ["reality_warp", "time_distortion"] },
        { hp: 40, attacks: ["black_hole", "supernova"] },
        { hp: 20, attacks: ["big_bang", "universe_collapse"] },
      ],
      rewards: {
        participation: { gold: 1000000, xp: 5000000 },
        top100: { gold: 5000000, xp: 10000000, item: "titan_essence" },
        top10: { gold: 25000000, xp: 50000000, item: "primordial_core" },
        mvp: { gold: 100000000, xp: 250000000, item: "genesis_stone" },
      },
    },
    god_slayer: {
      id: "god_slayer",
      name: "The God Slayer",
      tier: 3,
      icon: "⚡👹",
      hp: 100000000,
      atk: 5000,
      def: 3000,
      element: "divine",
      immunities: ["all"],
      spawns: ["Monthly (1st Sunday)"],
      phases: [
        { hp: 100, attacks: ["god_strike", "divine_punishment"] },
        { hp: 75, attacks: ["heaven_wrath", "angel_army"] },
        { hp: 50, attacks: ["divine_judgment", "holy_prison"] },
        { hp: 25, attacks: ["god_mode", "omnislash"] },
        { hp: 10, attacks: ["final_judgment", "universe_reset"] },
      ],
      rewards: {
        participation: { gold: 5000000, xp: 25000000 },
        top100: { gold: 25000000, xp: 100000000, item: "god_essence" },
        top10: {
          gold: 100000000,
          xp: 500000000,
          item: "slayer_blade",
        },
        mvp: {
          gold: 999999999,
          xp: 999999999,
          item: "godhood",
          title: "God Slayer",
        },
      },
    },
  };

  const BOSS_KEYS = Object.keys(WORLD_BOSSES);

  // ============================
  // WORLD BOSS SYSTEM CLASS
  // ============================

  class WorldBossSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Boss ID -> Boss instance */
      this.activeBosses = new Map();

      /** @type {Map<string, Array>} Boss ID -> Participants */
      this.participants = new Map();

      /** @type {Map<string, Object>} Boss ID -> Damage leaderboard */
      this.damageBoard = new Map();

      /** @type {Object} Statistics */
      this.stats = {
        bossesDefeated: 0,
        totalDamageDealt: 0,
        mvpWins: 0,
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("world_boss:ready", { bosses: BOSS_KEYS.length });

      return this;
    }

    /**
     * Spawn world boss
     * @param {string} bossType - Boss type ID
     * @returns {Object} Boss instance
     */
    spawnBoss(bossType) {
      const template = WORLD_BOSSES[bossType];
      if (!template) return null;

      const bossId = `boss_${bossType}_${Date.now()}`;

      const boss = {
        id: bossId,
        type: bossType,
        ...template,
        currentHp: template.hp,
        currentPhase: 0,
        status: "active",
        spawnedAt: Date.now(),
      };

      this.activeBosses.set(bossId, boss);
      this.participants.set(bossId, []);
      this.damageBoard.set(bossId, []);

      this._emit("world_boss:spawned", { boss });

      return boss;
    }

    /**
     * Join world boss fight
     * @param {string} bossId - Boss ID
     * @param {string} playerId - Player ID
     * @returns {boolean} Success
     */
    joinFight(bossId, playerId) {
      const boss = this.activeBosses.get(bossId);
      if (!boss || boss.status !== "active") return false;

      const participants = this.participants.get(bossId) || [];

      if (!participants.includes(playerId)) {
        participants.push(playerId);
        this.participants.set(bossId, participants);

        this._emit("world_boss:joined", { bossId, playerId });
      }

      return true;
    }

    /**
     * Deal damage to world boss
     * @param {string} bossId - Boss ID
     * @param {string} playerId - Player ID
     * @param {number} damage - Damage amount
     * @returns {Object} Result
     */
    dealDamage(bossId, playerId, damage) {
      const boss = this.activeBosses.get(bossId);
      if (!boss || boss.status !== "active") return null;

      // Reduce boss HP
      boss.currentHp = Math.max(0, boss.currentHp - damage);

      // Update damage leaderboard
      const board = this.damageBoard.get(bossId) || [];
      const entry = board.find((e) => e.playerId === playerId);

      if (entry) {
        entry.damage += damage;
      } else {
        board.push({ playerId, damage });
      }

      // Sort by damage
      board.sort((a, b) => b.damage - a.damage);
      this.damageBoard.set(bossId, board);

      this.stats.totalDamageDealt += damage;

      // Check phase change
      const hpPercent = (boss.currentHp / boss.hp) * 100;
      const phase = boss.phases.find((p, i) => {
        const prevPhase = i > 0 ? boss.phases[i - 1].hp : 101;
        return hpPercent <= p.hp && hpPercent > prevPhase;
      });

      if (phase && boss.currentPhase !== phase.hp) {
        boss.currentPhase = phase.hp;
        this._emit("world_boss:phase_change", { bossId, phase });
      }

      // Check if defeated
      if (boss.currentHp <= 0) {
        boss.status = "defeated";
        boss.defeatedAt = Date.now();

        this.stats.bossesDefeated++;

        this._distributeRewards(bossId);

        this._emit("world_boss:defeated", { boss, mvp: board[0] });
      }

      return {
        bossHp: boss.currentHp,
        bossMaxHp: boss.hp,
        hpPercent,
        phase: boss.currentPhase,
      };
    }

    /**
     * Get damage leaderboard
     * @param {string} bossId - Boss ID
     * @param {number} limit - Top N players
     * @returns {Array} Leaderboard
     */
    getLeaderboard(bossId, limit = 100) {
      const board = this.damageBoard.get(bossId) || [];
      return board.slice(0, limit);
    }

    /**
     * Get player's rank
     * @param {string} bossId - Boss ID
     * @param {string} playerId - Player ID
     * @returns {number} Rank (1-indexed)
     */
    getPlayerRank(bossId, playerId) {
      const board = this.damageBoard.get(bossId) || [];
      const index = board.findIndex((e) => e.playerId === playerId);
      return index >= 0 ? index + 1 : -1;
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        activeBosses: Array.from(this.activeBosses.entries()),
        participants: Array.from(this.participants.entries()),
        damageBoard: Array.from(this.damageBoard.entries()),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.activeBosses.clear();
      if (data.activeBosses) {
        data.activeBosses.forEach(([id, boss]) => {
          this.activeBosses.set(id, boss);
        });
      }

      this.participants.clear();
      if (data.participants) {
        data.participants.forEach(([id, parts]) => {
          this.participants.set(id, parts);
        });
      }

      this.damageBoard.clear();
      if (data.damageBoard) {
        data.damageBoard.forEach(([id, board]) => {
          this.damageBoard.set(id, board);
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("world_boss:loaded");
    }

    // Private methods
    _distributeRewards(bossId) {
      const boss = this.activeBosses.get(bossId);
      const board = this.damageBoard.get(bossId) || [];

      if (!boss) return;

      const rewards = [];

      // MVP (Rank 1)
      if (board[0]) {
        this.stats.mvpWins++;
        rewards.push({
          playerId: board[0].playerId,
          rank: 1,
          type: "mvp",
          ...boss.rewards.mvp,
        });
      }

      // Top 10
      for (let i = 1; i < Math.min(10, board.length); i++) {
        rewards.push({
          playerId: board[i].playerId,
          rank: i + 1,
          type: "top10",
          ...boss.rewards.top10,
        });
      }

      // Top 100 or participation
      for (let i = 10; i < board.length; i++) {
        const rewardTier = i < 100 && boss.rewards.top100 ? boss.rewards.top100 : boss.rewards.participation;

        rewards.push({
          playerId: board[i].playerId,
          rank: i + 1,
          type: i < 100 ? "top100" : "participation",
          ...rewardTier,
        });
      }

      this._emit("world_boss:rewards_distributed", { bossId, rewards });

      return rewards;
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[WorldBossSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  WorldBossSystem.WORLD_BOSSES = WORLD_BOSSES;
  WorldBossSystem.BOSS_KEYS = BOSS_KEYS;

  return WorldBossSystem;
});

