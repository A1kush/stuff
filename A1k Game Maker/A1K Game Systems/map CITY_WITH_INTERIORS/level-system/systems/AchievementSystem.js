/**
 * AchievementSystem.js - Complete Achievement Tracking
 * @version 1.0.0
 * @description 50 achievements with progress tracking and rewards
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.AchievementSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // ACHIEVEMENT DEFINITIONS (50 Total!)
  // ============================

  const ACHIEVEMENTS = {
    // LEVEL ACHIEVEMENTS (10)
    level_10: {
      id: "level_10",
      name: "Novice Adventurer",
      description: "Reach level 10",
      category: "level",
      icon: "⭐",
      requirement: { type: "level", value: 10 },
      reward: { gold: 100, ap: 1 },
    },
    level_25: {
      id: "level_25",
      name: "Seasoned Fighter",
      description: "Reach level 25",
      category: "level",
      icon: "⭐⭐",
      requirement: { type: "level", value: 25 },
      reward: { gold: 500, ap: 2 },
    },
    level_50: {
      id: "level_50",
      name: "Veteran Warrior",
      description: "Reach level 50",
      category: "level",
      icon: "⭐⭐⭐",
      requirement: { type: "level", value: 50 },
      reward: { gold: 1000, ap: 5 },
    },
    level_100: {
      id: "level_100",
      name: "Legendary Hero",
      description: "Reach level 100",
      category: "level",
      icon: "🌟",
      requirement: { type: "level", value: 100 },
      reward: { gold: 5000, ap: 10 },
    },
    level_500: {
      id: "level_500",
      name: "Mythic Champion",
      description: "Reach level 500",
      category: "level",
      icon: "💫",
      requirement: { type: "level", value: 500 },
      reward: { gold: 50000, ap: 50 },
    },
    level_999: {
      id: "level_999",
      name: "Max Level!",
      description: "Reach level 999",
      category: "level",
      icon: "👑",
      requirement: { type: "level", value: 999 },
      reward: { gold: 999999, ap: 100 },
    },
    prestige_1: {
      id: "prestige_1",
      name: "Rebirth",
      description: "Prestige for the first time",
      category: "level",
      icon: "♻️",
      requirement: { type: "prestige", value: 1 },
      reward: { gold: 10000, ap: 20 },
    },
    prestige_5: {
      id: "prestige_5",
      name: "Eternal Cycle",
      description: "Reach prestige 5",
      category: "level",
      icon: "🔄",
      requirement: { type: "prestige", value: 5 },
      reward: { gold: 100000, ap: 100 },
    },
    prestige_10: {
      id: "prestige_10",
      name: "Transcendent Soul",
      description: "Reach max prestige (10)",
      category: "level",
      icon: "✨",
      requirement: { type: "prestige", value: 10 },
      reward: { gold: 1000000, ap: 500 },
    },
    fast_leveler: {
      id: "fast_leveler",
      name: "Speed Runner",
      description: "Reach level 50 in under 30 minutes",
      category: "level",
      icon: "⚡",
      requirement: { type: "time_to_level", level: 50, time: 1800000 },
      reward: { gold: 5000, ap: 10 },
    },

    // COMBAT ACHIEVEMENTS (15)
    first_kill: {
      id: "first_kill",
      name: "First Blood",
      description: "Defeat your first enemy",
      category: "combat",
      icon: "⚔️",
      requirement: { type: "kills", value: 1 },
      reward: { gold: 50 },
    },
    kill_100: {
      id: "kill_100",
      name: "Monster Slayer",
      description: "Defeat 100 enemies",
      category: "combat",
      icon: "🗡️",
      requirement: { type: "kills", value: 100 },
      reward: { gold: 500, ap: 2 },
    },
    kill_1000: {
      id: "kill_1000",
      name: "Mass Destroyer",
      description: "Defeat 1,000 enemies",
      category: "combat",
      icon: "⚔️",
      requirement: { type: "kills", value: 1000 },
      reward: { gold: 5000, ap: 10 },
    },
    kill_10000: {
      id: "kill_10000",
      name: "Legendary Slayer",
      description: "Defeat 10,000 enemies",
      category: "combat",
      icon: "🏆",
      requirement: { type: "kills", value: 10000 },
      reward: { gold: 50000, ap: 50 },
    },
    boss_killer: {
      id: "boss_killer",
      name: "Boss Hunter",
      description: "Defeat 10 bosses",
      category: "combat",
      icon: "👹",
      requirement: { type: "boss_kills", value: 10 },
      reward: { gold: 2000, ap: 5 },
    },
    crit_master: {
      id: "crit_master",
      name: "Critical Master",
      description: "Land 100 critical hits",
      category: "combat",
      icon: "💥",
      requirement: { type: "critical_hits", value: 100 },
      reward: { gold: 1000, ap: 3 },
    },
    perfect_dodge: {
      id: "perfect_dodge",
      name: "Untouchable",
      description: "Dodge 50 attacks",
      category: "combat",
      icon: "🌪️",
      requirement: { type: "dodges", value: 50 },
      reward: { gold: 1500, ap: 5 },
    },
    damage_dealer: {
      id: "damage_dealer",
      name: "Heavy Hitter",
      description: "Deal 1,000,000 total damage",
      category: "combat",
      icon: "💪",
      requirement: { type: "total_damage", value: 1000000 },
      reward: { gold: 10000, ap: 20 },
    },
    survivor: {
      id: "survivor",
      name: "Survivor",
      description: "Survive with less than 10% HP 10 times",
      category: "combat",
      icon: "🩹",
      requirement: { type: "near_death_escapes", value: 10 },
      reward: { gold: 2000, ap: 5 },
    },
    no_damage_boss: {
      id: "no_damage_boss",
      name: "Flawless Victory",
      description: "Defeat a boss without taking damage",
      category: "combat",
      icon: "✨",
      requirement: { type: "no_damage_boss", value: 1 },
      reward: { gold: 5000, ap: 15 },
    },
    elemental_master: {
      id: "elemental_master",
      name: "Elemental Master",
      description: "Use all 6 damage types",
      category: "combat",
      icon: "🌈",
      requirement: { type: "damage_types_used", value: 6 },
      reward: { gold: 3000, ap: 10 },
    },
    combo_king: {
      id: "combo_king",
      name: "Combo King",
      description: "Achieve a 50+ hit combo",
      category: "combat",
      icon: "🎯",
      requirement: { type: "max_combo", value: 50 },
      reward: { gold: 4000, ap: 10 },
    },
    status_master: {
      id: "status_master",
      name: "Status Effect Master",
      description: "Apply 10 different status effects",
      category: "combat",
      icon: "✨",
      requirement: { type: "unique_status_applied", value: 10 },
      reward: { gold: 3000, ap: 8 },
    },
    rank_hunter_a: {
      id: "rank_hunter_a",
      name: "A-Rank Hunter",
      description: "Defeat an A-Rank enemy",
      category: "combat",
      icon: "🥇",
      requirement: { type: "rank_defeated", rank: "A", value: 1 },
      reward: { gold: 5000, ap: 15 },
    },
    rank_hunter_s: {
      id: "rank_hunter_s",
      name: "S-Rank Slayer",
      description: "Defeat an S-Rank enemy",
      category: "combat",
      icon: "💎",
      requirement: { type: "rank_defeated", rank: "S", value: 1 },
      reward: { gold: 10000, ap: 25 },
    },

    // PROGRESSION ACHIEVEMENTS (10)
    wave_5: {
      id: "wave_5",
      name: "Wave Warrior",
      description: "Reach wave 5",
      category: "progression",
      icon: "🌊",
      requirement: { type: "wave", value: 5 },
      reward: { gold: 500, ap: 2 },
    },
    wave_9: {
      id: "wave_9",
      name: "Wave Master",
      description: "Reach wave 9",
      category: "progression",
      icon: "🌊🌊",
      requirement: { type: "wave", value: 9 },
      reward: { gold: 2000, ap: 5 },
    },
    area_10: {
      id: "area_10",
      name: "Explorer",
      description: "Reach area 10",
      category: "progression",
      icon: "🗺️",
      requirement: { type: "area", value: 10 },
      reward: { gold: 3000, ap: 8 },
    },
    area_50: {
      id: "area_50",
      name: "Pathfinder",
      description: "Reach area 50",
      category: "progression",
      icon: "🧭",
      requirement: { type: "area", value: 50 },
      reward: { gold: 25000, ap: 30 },
    },
    area_100: {
      id: "area_100",
      name: "World Traveler",
      description: "Reach area 100",
      category: "progression",
      icon: "🌍",
      requirement: { type: "area", value: 100 },
      reward: { gold: 100000, ap: 100 },
    },
    first_loop: {
      id: "first_loop",
      name: "Loop Runner",
      description: "Complete your first loop",
      category: "progression",
      icon: "🔁",
      requirement: { type: "loop", value: 1 },
      reward: { gold: 50000, ap: 50 },
    },
    loop_10: {
      id: "loop_10",
      name: "Infinite Warrior",
      description: "Complete 10 loops",
      category: "progression",
      icon: "♾️",
      requirement: { type: "loop", value: 10 },
      reward: { gold: 1000000, ap: 500 },
    },
    stage_clear_fast: {
      id: "stage_clear_fast",
      name: "Speed Demon",
      description: "Clear a stage in under 60 seconds",
      category: "progression",
      icon: "⏱️",
      requirement: { type: "stage_time", value: 60000 },
      reward: { gold: 2000, ap: 5 },
    },
    no_deaths: {
      id: "no_deaths",
      name: "Deathless",
      description: "Complete 10 waves without dying",
      category: "progression",
      icon: "🛡️",
      requirement: { type: "deathless_waves", value: 10 },
      reward: { gold: 5000, ap: 15 },
    },
    perfect_run: {
      id: "perfect_run",
      name: "Perfect Run",
      description: "Complete a full area without taking damage",
      category: "progression",
      icon: "💯",
      requirement: { type: "perfect_area", value: 1 },
      reward: { gold: 10000, ap: 25 },
    },

    // TALENT ACHIEVEMENTS (10)
    first_talent: {
      id: "first_talent",
      name: "Talented",
      description: "Purchase your first talent",
      category: "talents",
      icon: "🌟",
      requirement: { type: "talents_purchased", value: 1 },
      reward: { gold: 100, ap: 1 },
    },
    talent_10: {
      id: "talent_10",
      name: "Skill Collector",
      description: "Purchase 10 talents",
      category: "talents",
      icon: "📚",
      requirement: { type: "talents_purchased", value: 10 },
      reward: { gold: 1000, ap: 5 },
    },
    talent_all_lanes: {
      id: "talent_all_lanes",
      name: "Jack of All Trades",
      description: "Purchase talents from all 9 lanes",
      category: "talents",
      icon: "🎭",
      requirement: { type: "lanes_invested", value: 9 },
      reward: { gold: 10000, ap: 30 },
    },
    complete_lane: {
      id: "complete_lane",
      name: "Lane Master",
      description: "Complete an entire talent lane",
      category: "talents",
      icon: "🏆",
      requirement: { type: "lanes_completed", value: 1 },
      reward: { gold: 5000, ap: 20 },
    },
    ultimate_unlock: {
      id: "ultimate_unlock",
      name: "Ultimate Power",
      description: "Unlock your first ultimate skill",
      category: "talents",
      icon: "⚡",
      requirement: { type: "ultimates_unlocked", value: 1 },
      reward: { gold: 3000, ap: 10 },
    },
    triple_ultimate: {
      id: "triple_ultimate",
      name: "Trinity",
      description: "Equip 3 ultimate skills simultaneously",
      category: "talents",
      icon: "🔱",
      requirement: { type: "ultimates_equipped", value: 3 },
      reward: { gold: 20000, ap: 50 },
    },
    ap_hoarder: {
      id: "ap_hoarder",
      name: "AP Hoarder",
      description: "Accumulate 1000 total AP",
      category: "talents",
      icon: "💎",
      requirement: { type: "total_ap", value: 1000 },
      reward: { gold: 50000 },
    },
    respec_master: {
      id: "respec_master",
      name: "Flexible Fighter",
      description: "Reset talents 5 times",
      category: "talents",
      icon: "🔄",
      requirement: { type: "respecs", value: 5 },
      reward: { gold: 5000, ap: 10 },
    },
    new_lanes: {
      id: "new_lanes",
      name: "New Powers",
      description: "Unlock Dragon, Blood, or Arcane lane",
      category: "talents",
      icon: "🐲",
      requirement: { type: "new_lanes_unlocked", value: 1 },
      reward: { gold: 2000, ap: 5 },
    },
    full_build: {
      id: "full_build",
      name: "Complete Build",
      description: "Have 50+ talents purchased",
      category: "talents",
      icon: "🎖️",
      requirement: { type: "talents_purchased", value: 50 },
      reward: { gold: 50000, ap: 100 },
    },

    // LOOT ACHIEVEMENTS (10)
    first_rare: {
      id: "first_rare",
      name: "Rare Find",
      description: "Find your first rare item",
      category: "loot",
      icon: "💎",
      requirement: { type: "rare_items", value: 1 },
      reward: { gold: 500 },
    },
    gold_1000: {
      id: "gold_1000",
      name: "Wealthy",
      description: "Accumulate 1,000 gold",
      category: "loot",
      icon: "💰",
      requirement: { type: "gold_total", value: 1000 },
      reward: { ap: 2 },
    },
    gold_100k: {
      id: "gold_100k",
      name: "Rich",
      description: "Accumulate 100,000 gold",
      category: "loot",
      icon: "💰💰",
      requirement: { type: "gold_total", value: 100000 },
      reward: { ap: 20 },
    },
    gold_1m: {
      id: "gold_1m",
      name: "Millionaire",
      description: "Accumulate 1,000,000 gold",
      category: "loot",
      icon: "💰💰💰",
      requirement: { type: "gold_total", value: 1000000 },
      reward: { ap: 100 },
    },
    legendary_drop: {
      id: "legendary_drop",
      name: "Legendary Luck",
      description: "Find a legendary item",
      category: "loot",
      icon: "🌟",
      requirement: { type: "legendary_items", value: 1 },
      reward: { gold: 10000, ap: 20 },
    },
    equipment_full: {
      id: "equipment_full",
      name: "Fully Equipped",
      description: "Fill all equipment slots",
      category: "loot",
      icon: "⚔️🛡️",
      requirement: { type: "equipment_slots_filled", value: 1 },
      reward: { gold: 2000, ap: 5 },
    },
    treasure_chest_100: {
      id: "treasure_chest_100",
      name: "Treasure Hunter",
      description: "Open 100 treasure chests",
      category: "loot",
      icon: "📦",
      requirement: { type: "chests_opened", value: 100 },
      reward: { gold: 5000, ap: 10 },
    },
    pity_break: {
      id: "pity_break",
      name: "Lucky Break",
      description: "Trigger pity system for a rare drop",
      category: "loot",
      icon: "🍀",
      requirement: { type: "pity_breaks", value: 1 },
      reward: { gold: 3000, ap: 8 },
    },
    hoarder: {
      id: "hoarder",
      name: "Hoarder",
      description: "Collect 100 unique items",
      category: "loot",
      icon: "🎒",
      requirement: { type: "unique_items", value: 100 },
      reward: { gold: 10000, ap: 20 },
    },
    lucky_streak: {
      id: "lucky_streak",
      name: "Lucky Streak",
      description: "Get 5 rare drops in a row",
      category: "loot",
      icon: "🎰",
      requirement: { type: "rare_streak", value: 5 },
      reward: { gold: 20000, ap: 30 },
    },

    // STATS ACHIEVEMENTS (10)
    hp_1000: {
      id: "hp_1000",
      name: "Tank",
      description: "Reach 1,000 HP",
      category: "stats",
      icon: "❤️",
      requirement: { type: "stat_threshold", stat: "hp", value: 1000 },
      reward: { gold: 1000, ap: 3 },
    },
    atk_500: {
      id: "atk_500",
      name: "Powerhouse",
      description: "Reach 500 ATK",
      category: "stats",
      icon: "⚔️",
      requirement: { type: "stat_threshold", stat: "atk", value: 500 },
      reward: { gold: 1000, ap: 3 },
    },
    def_300: {
      id: "def_300",
      name: "Fortified",
      description: "Reach 300 DEF",
      category: "stats",
      icon: "🛡️",
      requirement: { type: "stat_threshold", stat: "def", value: 300 },
      reward: { gold: 1000, ap: 3 },
    },
    spd_150: {
      id: "spd_150",
      name: "Speed Demon",
      description: "Reach 150 SPD",
      category: "stats",
      icon: "💨",
      requirement: { type: "stat_threshold", stat: "spd", value: 150 },
      reward: { gold: 1000, ap: 3 },
    },
    balanced_stats: {
      id: "balanced_stats",
      name: "Well Rounded",
      description: "Have all stats above 100",
      category: "stats",
      icon: "⚖️",
      requirement: { type: "all_stats_above", value: 100 },
      reward: { gold: 5000, ap: 15 },
    },
    soft_cap_reached: {
      id: "soft_cap_reached",
      name: "Soft Cap",
      description: "Reach soft cap on any stat",
      category: "stats",
      icon: "📈",
      requirement: { type: "soft_cap", value: 1 },
      reward: { gold: 10000, ap: 20 },
    },
    hard_cap_reached: {
      id: "hard_cap_reached",
      name: "Hard Cap",
      description: "Reach hard cap on any stat",
      category: "stats",
      icon: "🔝",
      requirement: { type: "hard_cap", value: 1 },
      reward: { gold: 50000, ap: 50 },
    },
    crit_chance_50: {
      id: "crit_chance_50",
      name: "Critical Expert",
      description: "Reach 50% critical chance",
      category: "stats",
      icon: "💥",
      requirement: { type: "stat_threshold", stat: "crt", value: 0.5 },
      reward: { gold: 5000, ap: 10 },
    },
    high_luck: {
      id: "high_luck",
      name: "Fortune Favored",
      description: "Reach 50 LUK",
      category: "stats",
      icon: "🍀",
      requirement: { type: "stat_threshold", stat: "luk", value: 50 },
      reward: { gold: 3000, ap: 8 },
    },
    glass_cannon: {
      id: "glass_cannon",
      name: "Glass Cannon",
      description: "Have 500+ ATK but less than 100 DEF",
      category: "stats",
      icon: "💣",
      requirement: { type: "glass_cannon", atk: 500, def: 100 },
      reward: { gold: 5000, ap: 15 },
    },

    // SPECIAL ACHIEVEMENTS (5)
    completionist: {
      id: "completionist",
      name: "Completionist",
      description: "Unlock all other achievements",
      category: "special",
      icon: "🏆",
      requirement: { type: "achievements", value: 49 },
      reward: { gold: 999999, ap: 1000 },
    },
    speedrun: {
      id: "speedrun",
      name: "Speedrunner",
      description: "Reach level 100 in under 1 hour",
      category: "special",
      icon: "🏃",
      requirement: { type: "time_to_level", level: 100, time: 3600000 },
      reward: { gold: 50000, ap: 100 },
    },
    collector: {
      id: "collector",
      name: "Collector",
      description: "Unlock all talent lanes",
      category: "special",
      icon: "📦",
      requirement: { type: "all_lanes_unlocked", value: 1 },
      reward: { gold: 20000, ap: 50 },
    },
    survivor_master: {
      id: "survivor_master",
      name: "Immortal",
      description: "Play for 10 hours without dying",
      category: "special",
      icon: "👼",
      requirement: { type: "survival_time", value: 36000000 },
      reward: { gold: 100000, ap: 200 },
    },
    true_hero: {
      id: "true_hero",
      name: "True Hero",
      description: "Reach max level, max prestige, and all achievements",
      category: "special",
      icon: "👑",
      requirement: { type: "true_completion", value: 1 },
      reward: { gold: 9999999, ap: 9999 },
    },
  };

  const ACHIEVEMENT_KEYS = Object.keys(ACHIEVEMENTS);

  // ============================
  // ACHIEVEMENT SYSTEM CLASS
  // ============================

  class AchievementSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          autoTrack: true,
          showNotifications: true,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Achievement ID -> Progress */
      this.progress = new Map();

      /** @type {Set<string>} Unlocked achievement IDs */
      this.unlocked = new Set();

      /** @type {Object} Tracking stats */
      this.stats = {
        kills: 0,
        bossKills: 0,
        criticalHits: 0,
        dodges: 0,
        totalDamage: 0,
        chestsOpened: 0,
        talentsPurchased: 0,
        goldTotal: 0,
        maxCombo: 0,
        rankDefeats: {}, // rank -> count
        damageTypesUsed: new Set(),
        uniqueStatusApplied: new Set(),
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      // Initialize all achievements
      ACHIEVEMENT_KEYS.forEach((key) => {
        this.progress.set(key, {
          id: key,
          progress: 0,
          unlocked: false,
          unlockedAt: null,
        });
      });

      // Set up event listeners for auto-tracking
      if (this.options.autoTrack && this.eventBus) {
        this._setupAutoTracking();
      }

      this.initialized = true;
      this._emit("achievements:ready", { total: ACHIEVEMENT_KEYS.length });

      return this;
    }

    /**
     * Check and unlock achievements
     * @param {string} characterId - Character ID
     * @returns {Array} Newly unlocked achievements
     */
    checkAchievements(characterId) {
      const newlyUnlocked = [];

      ACHIEVEMENT_KEYS.forEach((key) => {
        if (this.unlocked.has(key)) return;

        const achievement = ACHIEVEMENTS[key];
        const meetsRequirement = this._checkRequirement(
          achievement.requirement,
          characterId
        );

        if (meetsRequirement) {
          this.unlockAchievement(key);
          newlyUnlocked.push(achievement);
        }
      });

      return newlyUnlocked;
    }

    /**
     * Unlock an achievement
     * @param {string} achievementId - Achievement ID
     * @returns {Object|null} Achievement data
     */
    unlockAchievement(achievementId) {
      if (this.unlocked.has(achievementId)) return null;

      const achievement = ACHIEVEMENTS[achievementId];
      if (!achievement) return null;

      this.unlocked.add(achievementId);

      const progress = this.progress.get(achievementId);
      if (progress) {
        progress.unlocked = true;
        progress.unlockedAt = Date.now();
      }

      this._emit("achievement:unlocked", { achievement });

      if (this.options.showNotifications) {
        this._showNotification(achievement);
      }

      // Give rewards
      if (achievement.reward) {
        this._giveReward(achievement.reward);
      }

      return achievement;
    }

    /**
     * Get all unlocked achievements
     * @returns {Array}
     */
    getUnlocked() {
      return Array.from(this.unlocked).map((id) => ACHIEVEMENTS[id]);
    }

    /**
     * Get unlock percentage
     * @returns {number} 0-100
     */
    getCompletionPercentage() {
      return (this.unlocked.size / ACHIEVEMENT_KEYS.length) * 100;
    }

    /**
     * Get achievements by category
     * @param {string} category - Category name
     * @returns {Array}
     */
    getByCategory(category) {
      return ACHIEVEMENT_KEYS.map((key) => ACHIEVEMENTS[key]).filter(
        (a) => a.category === category
      );
    }

    /**
     * Track stat for achievements
     * @param {string} stat - Stat name
     * @param {number} value - Value to add
     */
    trackStat(stat, value = 1) {
      if (stat in this.stats) {
        if (typeof this.stats[stat] === "number") {
          this.stats[stat] += value;
        } else if (this.stats[stat] instanceof Set) {
          this.stats[stat].add(value);
        } else if (typeof this.stats[stat] === "object") {
          this.stats[stat][value] = (this.stats[stat][value] || 0) + 1;
        }
      }
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        unlocked: Array.from(this.unlocked),
        stats: {
          ...this.stats,
          damageTypesUsed: Array.from(this.stats.damageTypesUsed),
          uniqueStatusApplied: Array.from(this.stats.uniqueStatusApplied),
        },
        progress: Array.from(this.progress.values()),
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.unlocked.clear();
      if (data.unlocked) {
        data.unlocked.forEach((id) => this.unlocked.add(id));
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
        this.stats.damageTypesUsed = new Set(data.stats.damageTypesUsed || []);
        this.stats.uniqueStatusApplied = new Set(
          data.stats.uniqueStatusApplied || []
        );
      }

      this._emit("achievements:loaded", { unlocked: this.unlocked.size });
    }

    // Private methods
    _checkRequirement(req, characterId) {
      // Implementation would check against actual game state
      // This is a simplified version
      switch (req.type) {
        case "kills":
          return this.stats.kills >= req.value;
        case "boss_kills":
          return this.stats.bossKills >= req.value;
        case "total_damage":
          return this.stats.totalDamage >= req.value;
        case "critical_hits":
          return this.stats.criticalHits >= req.value;
        case "gold_total":
          return this.stats.goldTotal >= req.value;
        case "talents_purchased":
          return this.stats.talentsPurchased >= req.value;
        case "damage_types_used":
          return this.stats.damageTypesUsed.size >= req.value;
        case "unique_status_applied":
          return this.stats.uniqueStatusApplied.size >= req.value;
        case "rank_defeated":
          return (this.stats.rankDefeats[req.rank] || 0) >= req.value;
        // Add more checks as needed
        default:
          return false;
      }
    }

    _giveReward(reward) {
      this._emit("achievement:reward", { reward });

      // Emit specific reward events
      if (reward.gold) {
        this._emit("reward:gold", { amount: reward.gold });
      }
      if (reward.ap) {
        this._emit("reward:ap", { amount: reward.ap });
      }
    }

    _showNotification(achievement) {
      console.log(
        `🏆 Achievement Unlocked: ${achievement.icon} ${achievement.name}`
      );
    }

    _setupAutoTracking() {
      // Track level ups
      this.eventBus.on("level:up", (data) => {
        this.checkAchievements(data.characterId);
      });

      // Track kills
      this.eventBus.on("character:death", (data) => {
        if (data.characterId.startsWith("enemy")) {
          this.trackStat("kills");
        }
      });

      // Track damage
      this.eventBus.on("damage:dealt", (data) => {
        this.trackStat("totalDamage", data.result.damage);
        if (data.result.isCritical) {
          this.trackStat("criticalHits");
        }
        this.trackStat("damageTypesUsed", data.result.type);
      });

      // Track status effects
      this.eventBus.on("status:applied", (data) => {
        this.trackStat("uniqueStatusApplied", data.effect.key);
      });
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[AchievementSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose achievements
  AchievementSystem.ACHIEVEMENTS = ACHIEVEMENTS;
  AchievementSystem.ACHIEVEMENT_KEYS = ACHIEVEMENT_KEYS;

  return AchievementSystem;
});
