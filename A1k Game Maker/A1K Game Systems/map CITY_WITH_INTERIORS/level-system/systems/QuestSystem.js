/**
 * QuestSystem.js - Daily/Weekly Quests with Progress Tracking
 * @version 1.0.0
 * @description Repeatable quests with rewards and rotation
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.QuestSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // QUEST TEMPLATES
  // ============================

  const DAILY_QUESTS = [
    {
      id: "daily_kills_10",
      name: "Monster Slayer",
      description: "Defeat 10 enemies",
      type: "daily",
      icon: "⚔️",
      objective: { type: "kills", target: 10 },
      reward: { gold: 500, xp: 200, ap: 1 },
    },
    {
      id: "daily_kills_50",
      name: "Killing Spree",
      description: "Defeat 50 enemies",
      type: "daily",
      icon: "🗡️",
      objective: { type: "kills", target: 50 },
      reward: { gold: 2000, xp: 1000, ap: 3 },
    },
    {
      id: "daily_boss",
      name: "Boss Hunter",
      description: "Defeat 3 bosses",
      type: "daily",
      icon: "👹",
      objective: { type: "boss_kills", target: 3 },
      reward: { gold: 3000, xp: 2000, ap: 5 },
    },
    {
      id: "daily_damage",
      name: "Heavy Hitter",
      description: "Deal 100,000 total damage",
      type: "daily",
      icon: "💥",
      objective: { type: "total_damage", target: 100000 },
      reward: { gold: 2500, xp: 1500, ap: 3 },
    },
    {
      id: "daily_crits",
      name: "Critical Strikes",
      description: "Land 20 critical hits",
      type: "daily",
      icon: "💢",
      objective: { type: "critical_hits", target: 20 },
      reward: { gold: 1500, xp: 800, ap: 2 },
    },
    {
      id: "daily_waves",
      name: "Wave Rider",
      description: "Complete 5 waves",
      type: "daily",
      icon: "🌊",
      objective: { type: "waves_completed", target: 5 },
      reward: { gold: 2000, xp: 1200, ap: 3 },
    },
    {
      id: "daily_chests",
      name: "Treasure Hunt",
      description: "Open 10 chests",
      type: "daily",
      icon: "📦",
      objective: { type: "chests_opened", target: 10 },
      reward: { gold: 1000, xp: 500, ap: 2 },
    },
    {
      id: "daily_gold",
      name: "Gold Digger",
      description: "Collect 5,000 gold",
      type: "daily",
      icon: "💰",
      objective: { type: "gold_collected", target: 5000 },
      reward: { gold: 1500, xp: 600, ap: 2 },
    },
    {
      id: "daily_talent",
      name: "Skill Training",
      description: "Purchase 2 talents",
      type: "daily",
      icon: "🌟",
      objective: { type: "talents_purchased", target: 2 },
      reward: { gold: 2000, xp: 1000, ap: 5 },
    },
    {
      id: "daily_status",
      name: "Status Master",
      description: "Apply 30 status effects",
      type: "daily",
      icon: "✨",
      objective: { type: "status_applied", target: 30 },
      reward: { gold: 1800, xp: 900, ap: 3 },
    },
  ];

  const WEEKLY_QUESTS = [
    {
      id: "weekly_kills_500",
      name: "Exterminator",
      description: "Defeat 500 enemies",
      type: "weekly",
      icon: "⚔️⚔️",
      objective: { type: "kills", target: 500 },
      reward: { gold: 20000, xp: 10000, ap: 20 },
    },
    {
      id: "weekly_boss_20",
      name: "Boss Slayer",
      description: "Defeat 20 bosses",
      type: "weekly",
      icon: "👺",
      objective: { type: "boss_kills", target: 20 },
      reward: { gold: 30000, xp: 15000, ap: 30 },
    },
    {
      id: "weekly_damage_1m",
      name: "Damage Dealer",
      description: "Deal 1,000,000 damage",
      type: "weekly",
      icon: "💥💥",
      objective: { type: "total_damage", target: 1000000 },
      reward: { gold: 25000, xp: 12000, ap: 25 },
    },
    {
      id: "weekly_waves_50",
      name: "Wave Master",
      description: "Complete 50 waves",
      type: "weekly",
      icon: "🌊🌊",
      objective: { type: "waves_completed", target: 50 },
      reward: { gold: 35000, xp: 18000, ap: 35 },
    },
    {
      id: "weekly_rare_items",
      name: "Rare Hunter",
      description: "Find 10 rare items",
      type: "weekly",
      icon: "💎",
      objective: { type: "rare_items", target: 10 },
      reward: { gold: 40000, xp: 20000, ap: 40 },
    },
    {
      id: "weekly_gold_100k",
      name: "Wealthy Merchant",
      description: "Collect 100,000 gold",
      type: "weekly",
      icon: "💰💰",
      objective: { type: "gold_collected", target: 100000 },
      reward: { gold: 30000, xp: 15000, ap: 30 },
    },
    {
      id: "weekly_talents_10",
      name: "Skill Master",
      description: "Purchase 10 talents",
      type: "weekly",
      icon: "🌟🌟",
      objective: { type: "talents_purchased", target: 10 },
      reward: { gold: 50000, xp: 25000, ap: 50 },
    },
    {
      id: "weekly_a_rank",
      name: "A-Rank Hunter",
      description: "Defeat 5 A-Rank enemies",
      type: "weekly",
      icon: "🥇",
      objective: { type: "a_rank_kills", target: 5 },
      reward: { gold: 60000, xp: 30000, ap: 60 },
    },
    {
      id: "weekly_perfect_waves",
      name: "Flawless Victory",
      description: "Complete 10 waves without taking damage",
      type: "weekly",
      icon: "💯",
      objective: { type: "perfect_waves", target: 10 },
      reward: { gold: 70000, xp: 35000, ap: 70 },
    },
    {
      id: "weekly_status_500",
      name: "Effect Specialist",
      description: "Apply 500 status effects",
      type: "weekly",
      icon: "✨✨",
      objective: { type: "status_applied", target: 500 },
      reward: { gold: 45000, xp: 22000, ap: 45 },
    },
  ];

  // ============================
  // QUEST SYSTEM CLASS
  // ============================

  class QuestSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          maxDailyQuests: 3,
          maxWeeklyQuests: 3,
          autoRotate: true,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Active quest ID -> Quest data */
      this.activeQuests = new Map();

      /** @type {Map<string, number>} Quest ID -> Progress */
      this.questProgress = new Map();

      /** @type {Set<string>} Completed quest IDs (for this rotation) */
      this.completedQuests = new Set();

      /** @type {Object} Rotation timestamps */
      this.rotationTimers = {
        daily: null,
        weekly: null,
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      // Generate initial quests
      this.rotateQuests("daily");
      this.rotateQuests("weekly");

      // Set up event listeners for auto-tracking
      if (this.eventBus) {
        this._setupAutoTracking();
      }

      // Set up auto-rotation
      if (this.options.autoRotate) {
        this._startAutoRotation();
      }

      this.initialized = true;
      this._emit("quests:ready", {
        daily: this.getActiveQuests("daily").length,
        weekly: this.getActiveQuests("weekly").length,
      });

      return this;
    }

    /**
     * Rotate quests (generate new set)
     * @param {string} type - 'daily' or 'weekly'
     * @returns {Array} New quests
     */
    rotateQuests(type) {
      const templates = type === "daily" ? DAILY_QUESTS : WEEKLY_QUESTS;
      const max =
        type === "daily"
          ? this.options.maxDailyQuests
          : this.options.maxWeeklyQuests;

      // Remove old quests of this type
      for (const [id, quest] of this.activeQuests) {
        if (quest.type === type) {
          this.activeQuests.delete(id);
          this.questProgress.delete(id);
        }
      }

      // Clear completed for this type
      this.completedQuests.forEach((id) => {
        const quest =
          DAILY_QUESTS.find((q) => q.id === id) ||
          WEEKLY_QUESTS.find((q) => q.id === id);
        if (quest && quest.type === type) {
          this.completedQuests.delete(id);
        }
      });

      // Pick random quests
      const shuffled = [...templates].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, max);

      // Activate them
      const newQuests = [];
      selected.forEach((template) => {
        const quest = {
          ...template,
          activatedAt: Date.now(),
          expiresAt: Date.now() + (type === "daily" ? 86400000 : 604800000), // 1 day or 7 days
        };
        this.activeQuests.set(quest.id, quest);
        this.questProgress.set(quest.id, 0);
        newQuests.push(quest);
      });

      // Update rotation timer
      this.rotationTimers[type] = Date.now();

      this._emit("quests:rotated", { type, quests: newQuests });

      return newQuests;
    }

    /**
     * Get active quests
     * @param {string} [type] - Filter by type
     * @returns {Array}
     */
    getActiveQuests(type = null) {
      const quests = Array.from(this.activeQuests.values());

      if (type) {
        return quests.filter((q) => q.type === type);
      }

      return quests;
    }

    /**
     * Update quest progress
     * @param {string} objectiveType - Objective type
     * @param {number} amount - Amount to add
     */
    updateProgress(objectiveType, amount = 1) {
      const updated = [];

      for (const [id, quest] of this.activeQuests) {
        if (this.completedQuests.has(id)) continue;
        if (quest.objective.type !== objectiveType) continue;

        const current = this.questProgress.get(id) || 0;
        const newProgress = Math.min(current + amount, quest.objective.target);

        this.questProgress.set(id, newProgress);

        // Check if completed
        if (
          newProgress >= quest.objective.target &&
          !this.completedQuests.has(id)
        ) {
          this.completeQuest(id);
        }

        updated.push({
          id,
          progress: newProgress,
          target: quest.objective.target,
          completed: this.completedQuests.has(id),
        });
      }

      if (updated.length > 0) {
        this._emit("quests:progress", { updated });
      }
    }

    /**
     * Complete a quest
     * @param {string} questId - Quest ID
     * @returns {Object|null} Rewards
     */
    completeQuest(questId) {
      const quest = this.activeQuests.get(questId);
      if (!quest || this.completedQuests.has(questId)) return null;

      this.completedQuests.add(questId);

      this._emit("quest:completed", {
        quest,
        reward: quest.reward,
      });

      // Give rewards
      this._giveReward(quest.reward);

      return quest.reward;
    }

    /**
     * Get quest progress
     * @param {string} questId - Quest ID
     * @returns {Object}
     */
    getProgress(questId) {
      const quest = this.activeQuests.get(questId);
      if (!quest) return null;

      const current = this.questProgress.get(questId) || 0;
      const target = quest.objective.target;
      const completed = this.completedQuests.has(questId);

      return {
        questId,
        current,
        target,
        percentage: (current / target) * 100,
        completed,
      };
    }

    /**
     * Get all quest progress
     * @returns {Array}
     */
    getAllProgress() {
      return Array.from(this.activeQuests.keys()).map((id) =>
        this.getProgress(id)
      );
    }

    /**
     * Check if quests need rotation
     * @returns {Object} { daily: boolean, weekly: boolean }
     */
    needsRotation() {
      const now = Date.now();
      const dayMs = 86400000;
      const weekMs = 604800000;

      return {
        daily:
          !this.rotationTimers.daily || now - this.rotationTimers.daily > dayMs,
        weekly:
          !this.rotationTimers.weekly ||
          now - this.rotationTimers.weekly > weekMs,
      };
    }

    /**
     * Force check rotation
     */
    checkRotation() {
      const needs = this.needsRotation();

      if (needs.daily) {
        this.rotateQuests("daily");
      }
      if (needs.weekly) {
        this.rotateQuests("weekly");
      }
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        activeQuests: Array.from(this.activeQuests.entries()),
        questProgress: Array.from(this.questProgress.entries()),
        completedQuests: Array.from(this.completedQuests),
        rotationTimers: this.rotationTimers,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.activeQuests.clear();
      if (data.activeQuests) {
        data.activeQuests.forEach(([id, quest]) => {
          this.activeQuests.set(id, quest);
        });
      }

      this.questProgress.clear();
      if (data.questProgress) {
        data.questProgress.forEach(([id, progress]) => {
          this.questProgress.set(id, progress);
        });
      }

      this.completedQuests.clear();
      if (data.completedQuests) {
        data.completedQuests.forEach((id) => this.completedQuests.add(id));
      }

      if (data.rotationTimers) {
        this.rotationTimers = data.rotationTimers;
      }

      // Check if rotation needed after load
      this.checkRotation();

      this._emit("quests:loaded", {
        active: this.activeQuests.size,
        completed: this.completedQuests.size,
      });
    }

    // Private methods
    _giveReward(reward) {
      this._emit("quest:reward", { reward });

      if (reward.gold) {
        this._emit("reward:gold", { amount: reward.gold });
      }
      if (reward.xp) {
        this._emit("reward:xp", { amount: reward.xp });
      }
      if (reward.ap) {
        this._emit("reward:ap", { amount: reward.ap });
      }
    }

    _setupAutoTracking() {
      // Track kills
      this.eventBus.on("character:death", (data) => {
        if (data.characterId.startsWith("enemy")) {
          this.updateProgress("kills");

          if (data.characterId.includes("boss")) {
            this.updateProgress("boss_kills");
          }

          // Track rank kills
          if (data.rank === "A" || data.rank === "A+" || data.rank === "A-") {
            this.updateProgress("a_rank_kills");
          }
        }
      });

      // Track damage
      this.eventBus.on("damage:dealt", (data) => {
        this.updateProgress("total_damage", data.result.damage);

        if (data.result.isCritical) {
          this.updateProgress("critical_hits");
        }
      });

      // Track waves
      this.eventBus.on("wave:completed", () => {
        this.updateProgress("waves_completed");
      });

      // Track chests
      this.eventBus.on("chest:opened", () => {
        this.updateProgress("chests_opened");
      });

      // Track gold
      this.eventBus.on("gold:collected", (data) => {
        this.updateProgress("gold_collected", data.amount);
      });

      // Track talents
      this.eventBus.on("talent:purchased", () => {
        this.updateProgress("talents_purchased");
      });

      // Track status effects
      this.eventBus.on("status:applied", () => {
        this.updateProgress("status_applied");
      });

      // Track rare items
      this.eventBus.on("item:looted", (data) => {
        if (
          data.item.rarity === "rare" ||
          data.item.rarity === "epic" ||
          data.item.rarity === "legendary"
        ) {
          this.updateProgress("rare_items");
        }
      });
    }

    _startAutoRotation() {
      // Check every hour
      setInterval(() => this.checkRotation(), 3600000);
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[QuestSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose templates
  QuestSystem.DAILY_QUESTS = DAILY_QUESTS;
  QuestSystem.WEEKLY_QUESTS = WEEKLY_QUESTS;

  return QuestSystem;
});
