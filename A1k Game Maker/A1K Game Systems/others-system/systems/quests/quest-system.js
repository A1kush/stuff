/**
 * Quest/Mission System - Standalone Module
 * @description Complete quest and mission tracking system with progression, rewards, and multiple quest types
 * @version 1.0.0
 * @license MIT
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = factory();
  } else {
    // Browser global
    root.QuestSystem = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  /**
   * QuestSystem class - Manages all quest types
   * @class
   */
  class QuestSystem {
    constructor(options = {}) {
      this.options = Object.assign({
        storageKey: 'quest_system_data',
        autoSave: true,
        eventBus: null
      }, options);

      // Quest data
      this.quests = [];
      this.missions = [];
      this.adventures = [];
      this.dailyQuests = [];
      this.weeklyQuests = [];

      // Progress tracking
      this.activeQuests = [];
      this.activeMissions = [];
      this.activeAdventures = [];
      this.completedQuests = [];

      // Templates
      this.questTemplates = [];
      this.missionTemplates = [];
      this.adventureTemplates = [];

      this.initialized = false;
    }

    /**
     * Initialize the quest system
     * @param {Object} data - Initial quest data
     */
    async initialize(data = {}) {
      if (this.initialized) return;

      // Load templates
      if (data.questTemplates) this.questTemplates = data.questTemplates;
      if (data.missionTemplates) this.missionTemplates = data.missionTemplates;
      if (data.adventureTemplates) this.adventureTemplates = data.adventureTemplates;
      if (data.dailyQuests) this.dailyQuests = data.dailyQuests;
      if (data.weeklyQuests) this.weeklyQuests = data.weeklyQuests;

      // Load saved progress
      this.load();

      this.initialized = true;
      this.emit('quest:initialized');
      
      console.log('[QuestSystem] Initialized');
    }

    /**
     * Get all available quests
     * @returns {Array} Available quests
     */
    getAvailableQuests() {
      return this.questTemplates.filter(quest => {
        // Check if already completed
        if (this.completedQuests.includes(quest.id)) return false;
        
        // Check if already active
        if (this.activeQuests.find(q => q.id === quest.id)) return false;
        
        // Check requirements
        if (quest.requires && quest.requires.length) {
          return quest.requires.every(reqId => 
            this.completedQuests.includes(reqId)
          );
        }
        
        return true;
      });
    }

    /**
     * Start a quest
     * @param {string} questId - Quest ID to start
     * @returns {boolean} Success status
     */
    startQuest(questId) {
      const template = this.questTemplates.find(q => q.id === questId);
      if (!template) {
        console.warn(`[QuestSystem] Quest ${questId} not found`);
        return false;
      }

      // Check if already active
      if (this.activeQuests.find(q => q.id === questId)) {
        console.warn(`[QuestSystem] Quest ${questId} already active`);
        return false;
      }

      // Create quest instance
      const quest = {
        ...template,
        objectives: template.objectives.map(obj => ({
          ...obj,
          progress: 0,
          completed: false
        })),
        startedAt: Date.now()
      };

      this.activeQuests.push(quest);
      this.emit('quest:started', quest);
      this.save();

      return true;
    }

    /**
     * Update quest progress
     * @param {string} questId - Quest ID
     * @param {string} objectiveType - Objective type (e.g., 'kill', 'collect')
     * @param {string} target - Target identifier
     * @param {number} amount - Amount to add
     */
    updateProgress(questId, objectiveType, target, amount = 1) {
      const quest = this.activeQuests.find(q => q.id === questId);
      if (!quest) return;

      let updated = false;

      quest.objectives.forEach(objective => {
        if (objective.completed) return;
        
        if (objective.type === objectiveType) {
          // Check if target matches (if specified)
          if (objective.target && objective.target !== target) return;
          
          objective.progress = Math.min(
            objective.progress + amount,
            objective.count || 1
          );

          if (objective.progress >= (objective.count || 1)) {
            objective.completed = true;
            this.emit('quest:objective_completed', { quest, objective });
          }

          updated = true;
        }
      });

      if (updated) {
        this.checkQuestCompletion(quest);
        this.emit('quest:progress', quest);
        this.save();
      }
    }

    /**
     * Check if quest is complete
     * @param {Object} quest - Quest to check
     */
    checkQuestCompletion(quest) {
      const allCompleted = quest.objectives.every(obj => obj.completed);
      
      if (allCompleted && !this.completedQuests.includes(quest.id)) {
        this.completeQuest(quest.id);
      }
    }

    /**
     * Complete a quest
     * @param {string} questId - Quest ID to complete
     * @returns {Object|null} Rewards or null
     */
    completeQuest(questId) {
      const questIndex = this.activeQuests.findIndex(q => q.id === questId);
      if (questIndex === -1) return null;

      const quest = this.activeQuests[questIndex];
      this.activeQuests.splice(questIndex, 1);
      this.completedQuests.push(questId);

      const rewards = quest.rewards || {};
      this.emit('quest:completed', { quest, rewards });
      this.save();

      return rewards;
    }

    /**
     * Start a mission
     * @param {string} missionId - Mission ID
     * @returns {boolean} Success status
     */
    startMission(missionId) {
      const template = this.missionTemplates.find(m => m.id === missionId);
      if (!template) return false;

      const mission = {
        ...template,
        progress: 0,
        completed: false,
        startedAt: Date.now()
      };

      this.activeMissions.push(mission);
      this.emit('mission:started', mission);
      this.save();

      return true;
    }

    /**
     * Update mission progress
     * @param {string} missionId - Mission ID
     * @param {string} target - Target type
     * @param {number} amount - Amount to add
     */
    updateMissionProgress(missionId, target, amount = 1) {
      const mission = this.activeMissions.find(m => m.id === missionId);
      if (!mission || mission.completed) return;

      // Check if target matches mission requirements
      if (mission.target !== 'any' && mission.target !== target) return;

      mission.progress = Math.min(mission.progress + amount, mission.count);

      if (mission.progress >= mission.count) {
        this.completeMission(missionId);
      } else {
        this.emit('mission:progress', mission);
        this.save();
      }
    }

    /**
     * Complete a mission
     * @param {string} missionId - Mission ID
     * @returns {Object|null} Rewards
     */
    completeMission(missionId) {
      const missionIndex = this.activeMissions.findIndex(m => m.id === missionId);
      if (missionIndex === -1) return null;

      const mission = this.activeMissions[missionIndex];
      mission.completed = true;

      const rewards = mission.reward || {};
      this.emit('mission:completed', { mission, rewards });
      this.save();

      // Remove after a delay
      setTimeout(() => {
        const idx = this.activeMissions.findIndex(m => m.id === missionId);
        if (idx !== -1) this.activeMissions.splice(idx, 1);
      }, 5000);

      return rewards;
    }

    /**
     * Get daily quests
     * @returns {Array} Daily quests
     */
    getDailyQuests() {
      return this.dailyQuests.map(quest => ({
        ...quest,
        progress: quest.progress || 0,
        completed: quest.completed || false
      }));
    }

    /**
     * Update daily quest progress
     * @param {string} questId - Quest ID
     * @param {number} amount - Progress amount
     */
    updateDailyQuest(questId, amount = 1) {
      const quest = this.dailyQuests.find(q => q.id === questId);
      if (!quest || quest.completed) return;

      quest.progress = Math.min((quest.progress || 0) + amount, quest.required);

      if (quest.progress >= quest.required) {
        quest.completed = true;
        this.emit('daily_quest:completed', { quest, rewards: quest.reward });
      } else {
        this.emit('daily_quest:progress', quest);
      }

      this.save();
    }

    /**
     * Reset daily quests
     */
    resetDailyQuests() {
      this.dailyQuests.forEach(quest => {
        quest.progress = 0;
        quest.completed = false;
      });
      this.emit('daily_quests:reset');
      this.save();
    }

    /**
     * Get weekly quests
     * @returns {Array} Weekly quests
     */
    getWeeklyQuests() {
      return this.weeklyQuests.map(quest => ({
        ...quest,
        progress: quest.progress || 0,
        completed: quest.completed || false
      }));
    }

    /**
     * Save quest data to storage
     */
    save() {
      if (!this.options.autoSave) return;

      const data = {
        activeQuests: this.activeQuests,
        activeMissions: this.activeMissions,
        completedQuests: this.completedQuests,
        dailyQuests: this.dailyQuests,
        weeklyQuests: this.weeklyQuests,
        lastSaved: Date.now()
      };

      try {
        localStorage.setItem(this.options.storageKey, JSON.stringify(data));
      } catch (e) {
        console.error('[QuestSystem] Save error:', e);
      }
    }

    /**
     * Load quest data from storage
     */
    load() {
      try {
        const saved = localStorage.getItem(this.options.storageKey);
        if (!saved) return;

        const data = JSON.parse(saved);
        
        if (data.activeQuests) this.activeQuests = data.activeQuests;
        if (data.activeMissions) this.activeMissions = data.activeMissions;
        if (data.completedQuests) this.completedQuests = data.completedQuests;
        if (data.dailyQuests) this.dailyQuests = data.dailyQuests;
        if (data.weeklyQuests) this.weeklyQuests = data.weeklyQuests;

        this.emit('quest:loaded');
      } catch (e) {
        console.error('[QuestSystem] Load error:', e);
      }
    }

    /**
     * Export all quest data
     * @returns {Object} Quest data
     */
    exportData() {
      return {
        activeQuests: this.activeQuests,
        activeMissions: this.activeMissions,
        activeAdventures: this.activeAdventures,
        completedQuests: this.completedQuests,
        dailyQuests: this.dailyQuests,
        weeklyQuests: this.weeklyQuests
      };
    }

    /**
     * Import quest data
     * @param {Object} data - Quest data to import
     */
    importData(data) {
      if (data.activeQuests) this.activeQuests = data.activeQuests;
      if (data.activeMissions) this.activeMissions = data.activeMissions;
      if (data.activeAdventures) this.activeAdventures = data.activeAdventures;
      if (data.completedQuests) this.completedQuests = data.completedQuests;
      if (data.dailyQuests) this.dailyQuests = data.dailyQuests;
      if (data.weeklyQuests) this.weeklyQuests = data.weeklyQuests;

      this.save();
      this.emit('quest:imported');
    }

    /**
     * Emit event
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data) {
      if (this.options.eventBus && typeof this.options.eventBus.emit === 'function') {
        this.options.eventBus.emit(event, data);
      }

      // Also dispatch as DOM event
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent(event, { detail: data }));
      }
    }

    /**
     * Get statistics
     * @returns {Object} Quest statistics
     */
    getStats() {
      return {
        totalQuestsCompleted: this.completedQuests.length,
        activeQuests: this.activeQuests.length,
        activeMissions: this.activeMissions.length,
        dailyQuestsCompleted: this.dailyQuests.filter(q => q.completed).length,
        dailyQuestsTotal: this.dailyQuests.length
      };
    }
  }

  return QuestSystem;
}));

