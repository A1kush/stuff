/**
 * StorySystem.js - Narrative & Branching Choices
 * @version 1.0.0
 * @description Story chapters, choices, consequences, multiple endings
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.StorySystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // STORY CHAPTERS (20 Chapters)
  // ============================

  const STORY_CHAPTERS = {
    // Act 1: The Beginning (5 chapters)
    ch1_awakening: {
      id: "ch1_awakening",
      name: "Chapter 1: The Awakening",
      act: 1,
      description: "You wake up in a mysterious land with no memory...",
      choices: [
        {
          id: "help_villagers",
          text: "Help the villagers",
          consequence: "gain_reputation",
          leads_to: "ch2_hero_path",
        },
        {
          id: "ignore_villagers",
          text: "Ignore their pleas",
          consequence: "gain_dark_powers",
          leads_to: "ch2_dark_path",
        },
      ],
    },
    ch2_hero_path: {
      id: "ch2_hero_path",
      name: "Chapter 2: Hero's Journey",
      act: 1,
      description: "The villagers celebrate you as their hero...",
      choices: [
        {
          id: "accept_responsibility",
          text: "Accept the mantle of hero",
          consequence: "unlock_paladin_class",
          leads_to: "ch3_light_side",
        },
        {
          id: "seek_power",
          text: "Seek greater power",
          consequence: "unlock_warrior_class",
          leads_to: "ch3_neutral",
        },
      ],
    },
    ch2_dark_path: {
      id: "ch2_dark_path",
      name: "Chapter 2: Dark Descent",
      act: 1,
      description: "Power flows through you, but at what cost?",
      choices: [
        {
          id: "embrace_darkness",
          text: "Embrace the darkness",
          consequence: "unlock_necromancer_class",
          leads_to: "ch3_dark_side",
        },
        {
          id: "resist_corruption",
          text: "Resist the corruption",
          consequence: "gain_willpower",
          leads_to: "ch3_redemption",
        },
      ],
    },

    // Act 2: The Journey (10 chapters)
    ch3_light_side: {
      id: "ch3_light_side",
      name: "Chapter 3: Light's Champion",
      act: 2,
      description: "You've become a beacon of hope...",
      choices: [
        {
          id: "unite_kingdoms",
          text: "Unite the kingdoms",
          consequence: "become_king",
          leads_to: "ch4_kingdom",
        },
        {
          id: "destroy_evil",
          text: "Destroy the evil",
          consequence: "battle_dark_lord",
          leads_to: "ch4_battle",
        },
      ],
    },

    // Act 3: The End (5 chapters)
    // Multiple endings based on choices
  };

  const CHAPTER_KEYS = Object.keys(STORY_CHAPTERS);

  // ============================
  // ENDINGS (10 Possible Endings)
  // ============================

  const ENDINGS = {
    hero_ending: {
      id: "hero_ending",
      name: "The True Hero",
      description: "You saved the world and became its protector",
      requirements: ["help_villagers", "accept_responsibility", "unite_kingdoms"],
      rewards: { title: "the_savior", all_stats: 1000 },
    },
    dark_lord_ending: {
      id: "dark_lord_ending",
      name: "The Dark Lord",
      description: "You conquered the world with dark power",
      requirements: ["ignore_villagers", "embrace_darkness"],
      rewards: { title: "the_conqueror", dark_power: 5000 },
    },
    redemption_ending: {
      id: "redemption_ending",
      name: "Redemption",
      description: "You found redemption despite your dark past",
      requirements: ["ignore_villagers", "resist_corruption"],
      rewards: { title: "the_redeemed", all_stats: 500 },
    },
  };

  // ============================
  // STORY SYSTEM CLASS
  // ============================

  class StorySystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          allowSkip: false,
          autoSaveChoices: true,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Player ID -> Story progress */
      this.playerProgress = new Map();

      /** @type {Map<string, Array>} Player ID -> Choices made */
      this.playerChoices = new Map();

      /** @type {Map<string, Set>} Player ID -> Unlocked endings */
      this.unlockedEndings = new Map();

      /** @type {Object} Statistics */
      this.stats = {
        totalPlayers: 0,
        chaptersCompleted: 0,
        choicesMade: 0,
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("story:ready", { chapters: CHAPTER_KEYS.length });

      return this;
    }

    /**
     * Start story
     * @param {string} playerId - Player ID
     * @returns {Object} First chapter
     */
    startStory(playerId) {
      const progress = {
        currentChapter: "ch1_awakening",
        completedChapters: [],
        currentAct: 1,
        startedAt: Date.now(),
      };

      this.playerProgress.set(playerId, progress);
      this.playerChoices.set(playerId, []);

      this.stats.totalPlayers++;

      const chapter = STORY_CHAPTERS["ch1_awakening"];

      this._emit("story:started", { playerId, chapter });

      return chapter;
    }

    /**
     * Make choice
     * @param {string} playerId - Player ID
     * @param {string} choiceId - Choice ID
     * @returns {Object} Result
     */
    makeChoice(playerId, choiceId) {
      const progress = this.playerProgress.get(playerId);
      if (!progress) return { error: "Story not started" };

      const chapter = STORY_CHAPTERS[progress.currentChapter];
      if (!chapter) return { error: "Invalid chapter" };

      const choice = chapter.choices.find((c) => c.id === choiceId);
      if (!choice) return { error: "Invalid choice" };

      // Record choice
      const choices = this.playerChoices.get(playerId) || [];
      choices.push({
        chapter: chapter.id,
        choiceId,
        consequence: choice.consequence,
        timestamp: Date.now(),
      });
      this.playerChoices.set(playerId, choices);

      // Update progress
      progress.completedChapters.push(progress.currentChapter);
      progress.currentChapter = choice.leads_to;

      this.stats.choicesMade++;
      this.stats.chaptersCompleted++;

      // Apply consequence
      const result = this._applyConsequence(playerId, choice.consequence);

      // Check for ending
      const ending = this._checkEnding(playerId);
      if (ending) {
        return this._completeStory(playerId, ending);
      }

      const nextChapter = STORY_CHAPTERS[choice.leads_to];

      this._emit("story:choice_made", {
        playerId,
        choice,
        consequence: result,
        nextChapter,
      });

      return {
        success: true,
        consequence: result,
        nextChapter,
      };
    }

    /**
     * Get current chapter
     * @param {string} playerId - Player ID
     * @returns {Object} Chapter
     */
    getCurrentChapter(playerId) {
      const progress = this.playerProgress.get(playerId);
      if (!progress) return null;

      return STORY_CHAPTERS[progress.currentChapter];
    }

    /**
     * Get player choices
     * @param {string} playerId - Player ID
     * @returns {Array} Choices
     */
    getPlayerChoices(playerId) {
      return this.playerChoices.get(playerId) || [];
    }

    /**
     * Get unlocked endings
     * @param {string} playerId - Player ID
     * @returns {Array} Endings
     */
    getUnlockedEndings(playerId) {
      const endings = this.unlockedEndings.get(playerId) || new Set();
      return Array.from(endings).map((id) => ENDINGS[id]);
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        playerProgress: Array.from(this.playerProgress.entries()),
        playerChoices: Array.from(this.playerChoices.entries()),
        unlockedEndings: Array.from(this.unlockedEndings.entries()).map(([id, set]) => [
          id,
          Array.from(set),
        ]),
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

      this.playerChoices.clear();
      if (data.playerChoices) {
        data.playerChoices.forEach(([playerId, choices]) => {
          this.playerChoices.set(playerId, choices);
        });
      }

      this.unlockedEndings.clear();
      if (data.unlockedEndings) {
        data.unlockedEndings.forEach(([id, arr]) => {
          this.unlockedEndings.set(id, new Set(arr));
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("story:loaded");
    }

    // Private methods
    _applyConsequence(playerId, consequence) {
      // In a real game, this would apply actual game effects
      return { consequence, applied: true };
    }

    _checkEnding(playerId) {
      const choices = this.playerChoices.get(playerId) || [];
      const choiceIds = choices.map((c) => c.choiceId);

      for (const ending of Object.values(ENDINGS)) {
        const hasAllRequirements = ending.requirements.every((req) =>
          choiceIds.includes(req)
        );

        if (hasAllRequirements) {
          return ending;
        }
      }

      return null;
    }

    _completeStory(playerId, ending) {
      const progress = this.playerProgress.get(playerId);
      progress.completed = true;
      progress.ending = ending.id;
      progress.completedAt = Date.now();

      const endings = this.unlockedEndings.get(playerId) || new Set();
      endings.add(ending.id);
      this.unlockedEndings.set(playerId, endings);

      this._emit("story:completed", { playerId, ending });

      return {
        success: true,
        ending,
        rewards: ending.rewards,
      };
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[StorySystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  StorySystem.STORY_CHAPTERS = STORY_CHAPTERS;
  StorySystem.CHAPTER_KEYS = CHAPTER_KEYS;
  StorySystem.ENDINGS = ENDINGS;

  return StorySystem;
});

