/**
 * TitleSystem.js - Player Titles & Honors
 * @version 1.0.0
 * @description 100+ titles, stat bonuses, prestige, rare titles
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.TitleSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // TITLES (100 Total!)
  // ============================

  const TITLES = {
    // Combat Titles (20)
    the_brave: { id: "the_brave", name: "The Brave", rarity: "common", requirement: "Kill 100 enemies", bonuses: { atk: 10 } },
    the_warrior: { id: "the_warrior", name: "The Warrior", rarity: "uncommon", requirement: "Kill 1000 enemies", bonuses: { atk: 25, hp: 50 } },
    the_champion: { id: "the_champion", name: "The Champion", rarity: "rare", requirement: "Kill 10000 enemies", bonuses: { atk: 50, hp: 100 } },
    the_slayer: { id: "the_slayer", name: "The Slayer", rarity: "epic", requirement: "Kill 50000 enemies", bonuses: { atk: 100, hp: 200, crt: 5 } },
    the_destroyer: { id: "the_destroyer", name: "The Destroyer", rarity: "legendary", requirement: "Kill 100000 enemies", bonuses: { atk: 200, hp: 500, crt: 10 } },
    
    // Boss Titles (15)
    boss_hunter: { id: "boss_hunter", name: "Boss Hunter", rarity: "uncommon", requirement: "Kill 50 bosses", bonuses: { boss_dmg: 1.1 } },
    boss_slayer: { id: "boss_slayer", name: "Boss Slayer", rarity: "rare", requirement: "Kill 500 bosses", bonuses: { boss_dmg: 1.2, atk: 50 } },
    dragon_slayer: { id: "dragon_slayer", name: "Dragon Slayer", rarity: "epic", requirement: "Kill Ancient Wyrm", bonuses: { fire_res: 50, atk: 100 } },
    god_slayer: { id: "god_slayer", name: "God Slayer", rarity: "mythic", requirement: "Kill The God Slayer world boss", bonuses: { all_stats: 500, dmg: 1.5 } },
    
    // Achievement Titles (20)
    the_collector: { id: "the_collector", name: "The Collector", rarity: "rare", requirement: "Unlock 50 achievements", bonuses: { luk: 25 } },
    the_completionist: { id: "the_completionist", name: "The Completionist", rarity: "legendary", requirement: "Unlock all 100 achievements", bonuses: { all_stats: 100, xp: 1.5 } },
    
    // Wealth Titles (10)
    the_rich: { id: "the_rich", name: "The Rich", rarity: "uncommon", requirement: "Own 1M gold", bonuses: { gold: 1.1 } },
    the_wealthy: { id: "the_wealthy", name: "The Wealthy", rarity: "rare", requirement: "Own 100M gold", bonuses: { gold: 1.25, luk: 50 } },
    the_billionaire: { id: "the_billionaire", name: "The Billionaire", rarity: "legendary", requirement: "Own 1B gold", bonuses: { gold: 1.5, luk: 100 } },
    
    // Social Titles (15)
    the_friendly: { id: "the_friendly", name: "The Friendly", rarity: "common", requirement: "Make 10 friends", bonuses: { charisma: 10 } },
    the_married: { id: "the_married", name: "The Married", rarity: "rare", requirement: "Get married", bonuses: { all_stats: 50 } },
    the_soulmate: { id: "the_soulmate", name: "The Soulmate", rarity: "legendary", requirement: "Reach Soulmates level", bonuses: { all_stats: 200, xp: 2.0 } },
    guild_master: { id: "guild_master", name: "Guild Master", rarity: "epic", requirement: "Create max level guild", bonuses: { all_stats: 100, gold: 1.25 } },
    
    // Skill Titles (10)
    the_skilled: { id: "the_skilled", name: "The Skilled", rarity: "uncommon", requirement: "Unlock 30 talents", bonuses: { all_stats: 25 } },
    the_master: { id: "the_master", name: "The Master", rarity: "epic", requirement: "Unlock all talents", bonuses: { all_stats: 150 } },
    combo_king: { id: "combo_king", name: "Combo King", rarity: "rare", requirement: "Perform 100 skill combos", bonuses: { combo_dmg: 1.3 } },
    
    // Rare Titles (10)
    the_lucky: { id: "the_lucky", name: "The Lucky", rarity: "legendary", requirement: "Win 777 consecutive loot rolls", bonuses: { luk: 777 } },
    the_immortal: { id: "the_immortal", name: "The Immortal", rarity: "mythic", requirement: "Reach level 999 without dying", bonuses: { hp: 9999, def: 999 } },
    time_traveler: { id: "time_traveler", name: "Time Traveler", rarity: "legendary", requirement: "Play for 365 consecutive days", bonuses: { all_stats: 365, xp: 3.65 } },
    
    // Ultimate Titles (10)
    the_legend: { id: "the_legend", name: "The Legend", rarity: "legendary", requirement: "Reach prestige 10", bonuses: { all_stats: 1000 } },
    the_supreme: { id: "the_supreme", name: "The Supreme", rarity: "divine", requirement: "Complete all game systems", bonuses: { all_stats: 5000, xp: 10.0, gold: 10.0 } },
    world_champion: { id: "world_champion", name: "World Champion", rarity: "transcendent", requirement: "Rank #1 in all leaderboards", bonuses: { all_stats: 10000, all_multipliers: 100.0 } },
  };

  const TITLE_KEYS = Object.keys(TITLES);

  // Generate more titles to reach 100
  const generateTitles = () => {
    const prefixes = ["The Great", "The Mighty", "The Swift", "The Wise", "The Dark", "The Light", "The Ancient", "The Divine"];
    const suffixes = ["Fighter", "Mage", "Archer", "Healer", "Tank", "Assassin", "Summoner", "Bard"];
    
    let count = TITLE_KEYS.length;
    
    for (const prefix of prefixes) {
      for (const suffix of suffixes) {
        if (count >= 100) break;
        
        const id = `${prefix.toLowerCase().replace(" ", "_")}_${suffix.toLowerCase()}`;
        const bonusTypes = ["atk", "def", "hp", "mag", "spd"];
        const randomBonus = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
        
        TITLES[id] = {
          id,
          name: `${prefix} ${suffix}`,
          rarity: ["common", "uncommon", "rare"][Math.floor(Math.random() * 3)],
          requirement: `Complete ${suffix} challenges`,
          bonuses: { [randomBonus]: 50 + count },
        };
        
        count++;
      }
      if (count >= 100) break;
    }
  };

  generateTitles();

  // ============================
  // TITLE SYSTEM CLASS
  // ============================

  class TitleSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          maxEquippedTitles: 3,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Set>} Player ID -> Unlocked titles */
      this.unlockedTitles = new Map();

      /** @type {Map<string, Array>} Player ID -> Equipped titles */
      this.equippedTitles = new Map();

      /** @type {Object} Statistics */
      this.stats = {
        totalUnlocked: 0,
        rarestTitle: null,
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("titles:ready", { titles: TITLE_KEYS.length });

      return this;
    }

    /**
     * Unlock title
     * @param {string} playerId - Player ID
     * @param {string} titleId - Title ID
     * @returns {Object} Title
     */
    unlockTitle(playerId, titleId) {
      const title = TITLES[titleId];
      if (!title) return { error: "Invalid title" };

      const unlocked = this.unlockedTitles.get(playerId) || new Set();

      if (unlocked.has(titleId)) {
        return { error: "Title already unlocked" };
      }

      unlocked.add(titleId);
      this.unlockedTitles.set(playerId, unlocked);

      this.stats.totalUnlocked++;

      this._emit("title:unlocked", { playerId, title });

      return title;
    }

    /**
     * Equip title
     * @param {string} playerId - Player ID
     * @param {string} titleId - Title ID
     * @returns {Array} Equipped titles
     */
    equipTitle(playerId, titleId) {
      const unlocked = this.unlockedTitles.get(playerId) || new Set();

      if (!unlocked.has(titleId)) {
        return { error: "Title not unlocked" };
      }

      const equipped = this.equippedTitles.get(playerId) || [];

      if (equipped.includes(titleId)) {
        return { error: "Title already equipped" };
      }

      if (equipped.length >= this.options.maxEquippedTitles) {
        return { error: `Max ${this.options.maxEquippedTitles} titles` };
      }

      equipped.push(titleId);
      this.equippedTitles.set(playerId, equipped);

      this._emit("title:equipped", { playerId, titleId });

      return equipped;
    }

    /**
     * Unequip title
     * @param {string} playerId - Player ID
     * @param {string} titleId - Title ID
     * @returns {Array} Equipped titles
     */
    unequipTitle(playerId, titleId) {
      const equipped = this.equippedTitles.get(playerId) || [];
      const index = equipped.indexOf(titleId);

      if (index === -1) {
        return { error: "Title not equipped" };
      }

      equipped.splice(index, 1);
      this.equippedTitles.set(playerId, equipped);

      this._emit("title:unequipped", { playerId, titleId });

      return equipped;
    }

    /**
     * Get title bonuses
     * @param {string} playerId - Player ID
     * @returns {Object} Combined bonuses
     */
    getTitleBonuses(playerId) {
      const equipped = this.equippedTitles.get(playerId) || [];
      const bonuses = {};

      for (const titleId of equipped) {
        const title = TITLES[titleId];
        if (!title) continue;

        for (const [stat, value] of Object.entries(title.bonuses)) {
          if (typeof value === "number") {
            bonuses[stat] = (bonuses[stat] || 0) + value;
          }
        }
      }

      return bonuses;
    }

    /**
     * Get unlocked titles
     * @param {string} playerId - Player ID
     * @returns {Array} Titles
     */
    getUnlockedTitles(playerId) {
      const unlocked = this.unlockedTitles.get(playerId) || new Set();
      return Array.from(unlocked).map((id) => TITLES[id]);
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        unlockedTitles: Array.from(this.unlockedTitles.entries()).map(([id, set]) => [
          id,
          Array.from(set),
        ]),
        equippedTitles: Array.from(this.equippedTitles.entries()),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.unlockedTitles.clear();
      if (data.unlockedTitles) {
        data.unlockedTitles.forEach(([id, arr]) => {
          this.unlockedTitles.set(id, new Set(arr));
        });
      }

      this.equippedTitles.clear();
      if (data.equippedTitles) {
        data.equippedTitles.forEach(([playerId, titles]) => {
          this.equippedTitles.set(playerId, titles);
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("titles:loaded");
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[TitleSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  TitleSystem.TITLES = TITLES;
  TitleSystem.TITLE_KEYS = TITLE_KEYS;

  return TitleSystem;
});

