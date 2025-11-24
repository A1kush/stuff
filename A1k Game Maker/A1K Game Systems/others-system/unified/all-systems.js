/**
 * All Game Systems - Unified Library
 * @description Complete bundle of all game systems
 * @version 1.0.0
 * @license MIT
 */

// Load all systems as UMD modules
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.GameSystems = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  // Utility function to load external scripts
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Import note: In actual use, you would include the full system code here
  // For now, this serves as a loader that can dynamically load systems

  const GameSystems = {
    version: '1.0.0',
    
    // System references (populated when loaded)
    QuestSystem: null,
    SupernaturalSystem: null,
    SkinSystem: null,
    InventorySystem: null,
    SettingsSystem: null,
    
    // Utils
    EventBus: null,
    StorageHelper: null,
    GameUtils: null,
    
    /**
     * Load all systems
     * @param {Object} options - Loading options
     * @returns {Promise} Resolves when all systems are loaded
     */
    async loadAll(options = {}) {
      const basePath = options.basePath || '../';
      
      try {
        // Load utilities first
        await Promise.all([
          loadScript(`${basePath}utils/event-bus.js`),
          loadScript(`${basePath}utils/storage-helper.js`),
          loadScript(`${basePath}utils/common-utils.js`)
        ]);
        
        this.EventBus = window.EventBus;
        this.StorageHelper = window.StorageHelper;
        this.GameUtils = window.GameUtils;
        
        // Load systems
        await Promise.all([
          loadScript(`${basePath}systems/quests/quest-system.js`),
          loadScript(`${basePath}systems/supernatural/supernatural-system.js`),
          loadScript(`${basePath}systems/skins/skin-system.js`),
          loadScript(`${basePath}systems/items/inventory-system.js`),
          loadScript(`${basePath}systems/settings/settings-system.js`)
        ]);
        
        this.QuestSystem = window.QuestSystem;
        this.SupernaturalSystem = window.SupernaturalSystem;
        this.SkinSystem = window.SkinSystem;
        this.InventorySystem = window.InventorySystem;
        this.SettingsSystem = window.SettingsSystem;
        
        console.log('[GameSystems] All systems loaded successfully');
        return this;
      } catch (error) {
        console.error('[GameSystems] Error loading systems:', error);
        throw error;
      }
    },
    
    /**
     * Create instances of all systems with shared event bus
     * @param {Object} config - Configuration for each system
     * @returns {Object} Object containing all system instances
     */
    createAllSystems(config = {}) {
      const eventBus = this.EventBus?.default || null;
      
      const systems = {
        quests: new this.QuestSystem({
          ...config.quests,
          eventBus
        }),
        supernatural: new this.SupernaturalSystem({
          ...config.supernatural,
          eventBus
        }),
        skins: new this.SkinSystem({
          ...config.skins,
          eventBus
        }),
        inventory: new this.InventorySystem({
          ...config.inventory,
          eventBus
        }),
        settings: new this.SettingsSystem({
          ...config.settings,
          eventBus
        })
      };
      
      return systems;
    },
    
    /**
     * Initialize all systems
     * @param {Object} systems - System instances
     * @param {Object} data - Initial data for each system
     * @returns {Promise} Resolves when all systems are initialized
     */
    async initializeAll(systems, data = {}) {
      await Promise.all([
        systems.quests.initialize(data.quests || {}),
        systems.supernatural.initialize(data.supernatural || {}),
        systems.skins.initialize(data.skins || {}),
        systems.inventory.initialize(data.inventory || {}),
        systems.settings.initialize(data.settings || {})
      ]);
      
      console.log('[GameSystems] All systems initialized');
      return systems;
    },
    
    /**
     * Get stats from all systems
     * @param {Object} systems - System instances
     * @returns {Object} Combined stats from all systems
     */
    getAllStats(systems) {
      return {
        quests: systems.quests.getStats(),
        supernatural: systems.supernatural.getStats(),
        skins: systems.skins.getStats(),
        inventory: systems.inventory.getStats(),
        settings: {
          categories: systems.settings.getCategories().length
        }
      };
    },
    
    /**
     * Export all system data
     * @param {Object} systems - System instances
     * @returns {Object} Combined export data
     */
    exportAllData(systems) {
      return {
        version: this.version,
        exportDate: new Date().toISOString(),
        quests: systems.quests.exportData(),
        supernatural: systems.supernatural.exportData(),
        skins: systems.skins.exportData(),
        inventory: systems.inventory.exportData(),
        settings: systems.settings.exportData()
      };
    },
    
    /**
     * Import all system data
     * @param {Object} systems - System instances
     * @param {Object} data - Data to import
     */
    importAllData(systems, data) {
      if (data.quests) systems.quests.importData(data.quests);
      if (data.supernatural) systems.supernatural.importData(data.supernatural);
      if (data.skins) systems.skins.importData(data.skins);
      if (data.inventory) systems.inventory.importData(data.inventory);
      if (data.settings) systems.settings.importData(data.settings);
      
      console.log('[GameSystems] All data imported');
    }
  };
  
  return GameSystems;
}));

// Usage Example:
// const GameSystems = window.GameSystems;
// await GameSystems.loadAll();
// const systems = GameSystems.createAllSystems();
// await GameSystems.initializeAll(systems, dataConfig);

