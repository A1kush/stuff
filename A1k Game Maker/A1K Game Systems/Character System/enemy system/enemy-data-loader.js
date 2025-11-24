/**
 * Enemy Data Loader
 * Loads all enemy databases and exposes them to window for bag system integration
 */

(function() {
  'use strict';

  console.log('[EnemyDataLoader] Loading enemy databases...');

  // Initialize enemy database object
  window.EnemyDatabase = {
    enemies: {},
    bosses: {},
    zombies: {},
    villains: {},
    
    // Helper functions
    getEnemy: function(id) {
      return this.enemies[id] || this.bosses[id] || this.zombies[id] || this.villains[id];
    },
    
    getAllEnemies: function() {
      return Object.values(this.enemies);
    },
    
    getAllBosses: function() {
      return Object.values(this.bosses);
    },
    
    getAllZombies: function() {
      return Object.values(this.zombies);
    },
    
    getAllVillains: function() {
      return Object.values(this.villains);
    },
    
    getEnemiesByTier: function(tier) {
      return this.getAllEnemies().filter(e => e.tier === tier);
    },
    
    getEnemiesByElement: function(element) {
      return this.getAllEnemies().filter(e => e.element === element);
    }
  };

  // Load enemy databases from external files
  // These will be populated when the actual database files are loaded
  // For now, we'll use a dynamic loading approach
  
  // Check if databases are already loaded (from ES6 modules)
  if (typeof window.ENEMIES_DATABASE !== 'undefined') {
    window.EnemyDatabase.enemies = window.ENEMIES_DATABASE;
  }
  
  if (typeof window.BOSSES_DATABASE !== 'undefined') {
    window.EnemyDatabase.bosses = window.BOSSES_DATABASE;
  }
  
  if (typeof window.ZOMBIES_DATABASE !== 'undefined') {
    window.EnemyDatabase.zombies = window.ZOMBIES_DATABASE;
  }
  
  if (typeof window.VILLAINS_DATABASE !== 'undefined') {
    window.EnemyDatabase.villains = window.VILLAINS_DATABASE;
  }

  // Function to manually populate databases (called after ES6 modules load)
  window.EnemyDatabase.populate = function(enemies, bosses, zombies, villains) {
    if (enemies) this.enemies = enemies;
    if (bosses) this.bosses = bosses;
    if (zombies) this.zombies = zombies;
    if (villains) this.villains = villains;
    
    console.log(`[EnemyDataLoader] Loaded ${Object.keys(this.enemies).length} enemies, ${Object.keys(this.bosses).length} bosses, ${Object.keys(this.zombies).length} zombies, ${Object.keys(this.villains).length} villains`);
  };

  // Try to load databases using dynamic import (if ES6 modules are available)
  // Note: Dynamic imports work in modern browsers, but may fail in file:// protocol
  (async function() {
    try {
      // Try to dynamically import the databases
      const enemiesModule = await import('../Character System/a2-enemy-npc-system/data/enemies_db.js');
      const bossesModule = await import('../Character System/a2-enemy-npc-system/data/bosses_db.js');
      const zombiesModule = await import('../Character System/a2-enemy-npc-system/data/zombies_db.js');
      const villainsModule = await import('../Character System/a2-enemy-npc-system/data/villains_db.js');
      
      if (enemiesModule.ENEMIES_DATABASE) {
        window.EnemyDatabase.enemies = enemiesModule.ENEMIES_DATABASE;
      }
      if (bossesModule.BOSSES_DATABASE) {
        window.EnemyDatabase.bosses = bossesModule.BOSSES_DATABASE;
      }
      if (zombiesModule.ZOMBIES_DATABASE) {
        window.EnemyDatabase.zombies = zombiesModule.ZOMBIES_DATABASE;
      }
      if (villainsModule.VILLAINS_DATABASE) {
        window.EnemyDatabase.villains = villainsModule.VILLAINS_DATABASE;
      }
      
      console.log('[EnemyDataLoader] Successfully loaded enemy databases via dynamic import');
    } catch (e) {
      console.warn('[EnemyDataLoader] Could not load databases via dynamic import:', e.message);
      console.log('[EnemyDataLoader] Databases will need to be loaded manually or converted to non-module format');
      console.log('[EnemyDataLoader] You can manually populate using: window.EnemyDatabase.populate(enemies, bosses, zombies, villains)');
    }
  })();

  // Also populate GameDatabase
  if (window.GameDatabase) {
    window.GameDatabase.enemies = window.EnemyDatabase.enemies;
    window.GameDatabase.bosses = window.EnemyDatabase.bosses;
    window.GameDatabase.zombies = window.EnemyDatabase.zombies;
    window.GameDatabase.villains = window.EnemyDatabase.villains;
  }

  console.log('[EnemyDataLoader] Enemy database loader ready');
})();

