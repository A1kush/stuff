/**
 * SeasonalEventSystem.js - Time-Limited Seasonal Events
 * @version 1.0.0
 * @description Seasonal events, limited-time rewards, event shops
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.SeasonalEventSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // SEASONAL EVENTS (12 Events)
  // ============================

  const SEASONAL_EVENTS = {
    // Yearly Events (4)
    winter_festival: {
      id: "winter_festival",
      name: "Winter Festival",
      description: "Celebrate the winter season!",
      icon: "❄️",
      duration: 1209600000, // 14 days
      schedule: { month: 12, day: 15 }, // Dec 15
      rewards: {
        currency: "snowflakes",
        items: ["winter_sword", "frost_armor", "ice_pet"],
      },
      quests: [
        {
          id: "winter_kills",
          name: "Snowman Slayer",
          objective: { type: "kills", target: 100 },
          reward: { snowflakes: 500 },
        },
        {
          id: "winter_boss",
          name: "Frost Giant",
          objective: { type: "boss_kills", target: 5 },
          reward: { snowflakes: 1000, item: "winter_sword" },
        },
      ],
    },
    spring_bloom: {
      id: "spring_bloom",
      name: "Spring Bloom",
      description: "Flowers are blooming!",
      icon: "🌸",
      duration: 1209600000,
      schedule: { month: 3, day: 20 }, // Mar 20
      rewards: {
        currency: "petals",
        items: ["bloom_staff", "nature_armor", "fairy_pet"],
      },
      quests: [
        {
          id: "spring_collect",
          name: "Petal Collector",
          objective: { type: "petals_collected", target: 200 },
          reward: { petals: 800 },
        },
      ],
    },
    summer_heat: {
      id: "summer_heat",
      name: "Summer Heat Wave",
      description: "The sun is blazing!",
      icon: "☀️",
      duration: 1209600000,
      schedule: { month: 6, day: 21 }, // Jun 21
      rewards: {
        currency: "sunstones",
        items: ["solar_blade", "flame_armor", "phoenix_pet"],
      },
      quests: [
        {
          id: "summer_fire",
          name: "Fire Master",
          objective: { type: "fire_damage", target: 500000 },
          reward: { sunstones: 1200 },
        },
      ],
    },
    autumn_harvest: {
      id: "autumn_harvest",
      name: "Autumn Harvest",
      description: "Time to gather!",
      icon: "🍂",
      duration: 1209600000,
      schedule: { month: 9, day: 22 }, // Sep 22
      rewards: {
        currency: "harvest_coins",
        items: ["reaper_scythe", "earth_armor", "golem_pet"],
      },
      quests: [
        {
          id: "harvest_gather",
          name: "Gatherer",
          objective: { type: "materials_gathered", target: 500 },
          reward: { harvest_coins: 900 },
        },
      ],
    },

    // Monthly Events (4)
    blood_moon: {
      id: "blood_moon",
      name: "Blood Moon",
      description: "The moon turns red...",
      icon: "🌕",
      duration: 259200000, // 3 days
      schedule: { frequency: "monthly", day: 1 },
      rewards: {
        currency: "blood_shards",
        items: ["blood_sword", "vampire_cloak"],
      },
      bonuses: {
        xp: 2.0,
        drop_rate: 1.5,
      },
      quests: [
        {
          id: "blood_moon_hunt",
          name: "Moonlight Hunter",
          objective: { type: "kills", target: 200 },
          reward: { blood_shards: 1500 },
        },
      ],
    },
    treasure_hunt: {
      id: "treasure_hunt",
      name: "Treasure Hunt",
      description: "Rare chests everywhere!",
      icon: "📦",
      duration: 172800000, // 2 days
      schedule: { frequency: "monthly", day: 15 },
      bonuses: {
        chest_spawn: 3.0,
        rare_rate: 2.0,
      },
      quests: [
        {
          id: "treasure_chests",
          name: "Chest Hunter",
          objective: { type: "chests_opened", target: 50 },
          reward: { gold: 50000 },
        },
      ],
    },
    double_xp: {
      id: "double_xp",
      name: "Double XP Weekend",
      description: "2x XP for all activities!",
      icon: "⭐",
      duration: 259200000, // 3 days
      schedule: { frequency: "bi_weekly", day: 6 }, // Every other Saturday
      bonuses: {
        xp: 2.0,
      },
    },
    boss_invasion: {
      id: "boss_invasion",
      name: "Boss Invasion",
      description: "Bosses spawn more frequently!",
      icon: "👹",
      duration: 86400000, // 1 day
      schedule: { frequency: "weekly", day: 0 }, // Sundays
      bonuses: {
        boss_spawn: 5.0,
        boss_loot: 2.0,
      },
      quests: [
        {
          id: "invasion_bosses",
          name: "Boss Slayer",
          objective: { type: "boss_kills", target: 20 },
          reward: { gold: 100000, ap: 100 },
        },
      ],
    },

    // Special Events (4)
    halloween: {
      id: "halloween",
      name: "Halloween Spooktacular",
      description: "Trick or treat!",
      icon: "🎃",
      duration: 604800000, // 7 days
      schedule: { month: 10, day: 25 }, // Oct 25-31
      rewards: {
        currency: "candy",
        items: ["pumpkin_axe", "ghost_cloak", "demon_pet"],
      },
      quests: [
        {
          id: "halloween_hunt",
          name: "Pumpkin Hunter",
          objective: { type: "pumpkins_collected", target: 100 },
          reward: { candy: 2000, item: "pumpkin_axe" },
        },
      ],
    },
    valentine: {
      id: "valentine",
      name: "Valentine's Day",
      description: "Spread the love!",
      icon: "💝",
      duration: 259200000, // 3 days
      schedule: { month: 2, day: 13 }, // Feb 13-15
      rewards: {
        currency: "hearts",
        items: ["cupid_bow", "love_amulet"],
      },
    },
    new_year: {
      id: "new_year",
      name: "New Year Celebration",
      description: "Ring in the new year!",
      icon: "🎆",
      duration: 259200000, // 3 days
      schedule: { month: 1, day: 1 }, // Jan 1-3
      rewards: {
        currency: "fireworks",
        items: ["zodiac_sword", "year_armor"],
      },
      bonuses: {
        all_rewards: 3.0,
      },
    },
    anniversary: {
      id: "anniversary",
      name: "Game Anniversary",
      description: "Celebrating our players!",
      icon: "🎂",
      duration: 604800000, // 7 days
      schedule: { month: 11, day: 1 }, // Nov 1-7
      rewards: {
        currency: "tokens",
        items: ["anniversary_sword", "legendary_pet_egg"],
      },
      bonuses: {
        xp: 3.0,
        gold: 3.0,
        drop_rate: 2.0,
      },
    },
  };

  const EVENT_KEYS = Object.keys(SEASONAL_EVENTS);

  // ============================
  // SEASONAL EVENT SYSTEM CLASS
  // ============================

  class SeasonalEventSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          autoCheck: true,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Array} Active events */
      this.activeEvents = [];

      /** @type {Map<string, number>} Player ID -> Event currency */
      this.playerCurrency = new Map();

      /** @type {Object} Player participation */
      this.playerProgress = new Map();

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      // Check for active events
      this.checkActiveEvents();

      // Set up auto-check
      if (this.options.autoCheck) {
        setInterval(() => this.checkActiveEvents(), 3600000); // Every hour
      }

      this.initialized = true;
      this._emit("seasonal:ready", {
        activeEvents: this.activeEvents.length,
      });

      return this;
    }

    /**
     * Check which events should be active
     * @returns {Array} Active events
     */
    checkActiveEvents() {
      const now = new Date();
      const newActive = [];

      EVENT_KEYS.forEach((key) => {
        const event = SEASONAL_EVENTS[key];

        if (this._isEventActive(event, now)) {
          if (!this.activeEvents.some((e) => e.id === event.id)) {
            // Start new event
            const activeEvent = {
              ...event,
              startedAt: Date.now(),
              endsAt: Date.now() + event.duration,
            };

            newActive.push(activeEvent);
            this._emit("event:started", { event: activeEvent });
          } else {
            // Event already active
            newActive.push(
              this.activeEvents.find((e) => e.id === event.id)
            );
          }
        }
      });

      // End events that are no longer active
      this.activeEvents.forEach((event) => {
        if (!newActive.some((e) => e.id === event.id)) {
          this._emit("event:ended", { event });
        }
      });

      this.activeEvents = newActive;

      return this.activeEvents;
    }

    /**
     * Get active events
     * @returns {Array} Active events
     */
    getActiveEvents() {
      return this.activeEvents;
    }

    /**
     * Get event bonuses
     * @returns {Object} Total bonuses from all active events
     */
    getEventBonuses() {
      const bonuses = {
        xp: 1.0,
        gold: 1.0,
        drop_rate: 1.0,
        boss_spawn: 1.0,
        chest_spawn: 1.0,
      };

      this.activeEvents.forEach((event) => {
        if (event.bonuses) {
          for (const [bonus, multiplier] of Object.entries(event.bonuses)) {
            if (bonus === "all_rewards") {
              bonuses.xp *= multiplier;
              bonuses.gold *= multiplier;
              bonuses.drop_rate *= multiplier;
            } else if (bonuses[bonus]) {
              bonuses[bonus] *= multiplier;
            }
          }
        }
      });

      return bonuses;
    }

    /**
     * Award event currency
     * @param {string} playerId - Player ID
     * @param {string} currency - Currency type
     * @param {number} amount - Amount
     */
    awardCurrency(playerId, currency, amount) {
      const key = `${playerId}_${currency}`;
      const current = this.playerCurrency.get(key) || 0;
      this.playerCurrency.set(key, current + amount);

      this._emit("event:currency_awarded", { playerId, currency, amount });
    }

    /**
     * Get player's event currency
     * @param {string} playerId - Player ID
     * @param {string} currency - Currency type
     * @returns {number} Amount
     */
    getCurrency(playerId, currency) {
      const key = `${playerId}_${currency}`;
      return this.playerCurrency.get(key) || 0;
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        activeEvents: this.activeEvents,
        playerCurrency: Array.from(this.playerCurrency.entries()),
        playerProgress: Array.from(this.playerProgress.entries()),
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.activeEvents = data.activeEvents || [];

      this.playerCurrency.clear();
      if (data.playerCurrency) {
        data.playerCurrency.forEach(([key, amount]) => {
          this.playerCurrency.set(key, amount);
        });
      }

      this.playerProgress.clear();
      if (data.playerProgress) {
        data.playerProgress.forEach(([key, progress]) => {
          this.playerProgress.set(key, progress);
        });
      }

      this._emit("seasonal:loaded");
    }

    // Private methods
    _isEventActive(event, now) {
      const schedule = event.schedule;

      if (schedule.month && schedule.day) {
        // Specific date event
        const eventStart = new Date(
          now.getFullYear(),
          schedule.month - 1,
          schedule.day
        );
        const eventEnd = new Date(eventStart.getTime() + event.duration);

        return now >= eventStart && now <= eventEnd;
      } else if (schedule.frequency) {
        // Recurring event
        // Simplified - would need more complex logic
        return Math.random() < 0.1; // 10% chance for demo
      }

      return false;
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[SeasonalEventSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  SeasonalEventSystem.SEASONAL_EVENTS = SEASONAL_EVENTS;
  SeasonalEventSystem.EVENT_KEYS = EVENT_KEYS;

  return SeasonalEventSystem;
});

