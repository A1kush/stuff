/**
 * Dungeon System Configuration
 * Production-ready configuration system for any game
 * 
 * @module DungeonConfig
 */

(function() {
  'use strict';

  /**
   * Default configuration for the dungeon system
   * Override these values to customize for your game
   */
  window.DungeonConfig = {
    // ============================================
    // THEME & VISUAL CONFIGURATION
    // ============================================
    theme: {
      name: 'Dungeon', // Game name/theme
      backgroundColor: '#0a0a0a',
      foregroundColor: '#1a1a1a',
      accentColor: '#4ecdc4',
      textColor: '#ffffff',
      uiBackground: 'rgba(15, 24, 38, 0.95)',
      uiBorder: 'rgba(255, 255, 255, 0.2)'
    },

    // ============================================
    // ROOM CONFIGURATION
    // ============================================
    room: {
      defaultWidth: 2400,
      defaultHeight: 800,
      groundHeight: 100,
      groundColor: '#4a4a4a',
      platformColor: '#3a3a3a',
      platformHeight: 20
    },

    // ============================================
    // PLAYER CONFIGURATION
    // ============================================
    player: {
      width: 50,
      height: 70,
      speed: 6,
      jumpPower: 16,
      maxHealth: 100,
      color: '#4ecdc4',
      outlineColor: '#ffffff',
      showName: true,
      name: 'Player',
      showHealthBar: true,
      invincibilityFrames: 30
    },

    // ============================================
    // ENEMY CONFIGURATION
    // ============================================
    enemy: {
      defaultWidth: 50,
      defaultHeight: 60,
      defaultSpeed: 2,
      speedVariation: 2,
      defaultHealth: 50,
      healthVariation: 50,
      showName: true,
      showHealthBar: true,
      colors: {
        default: '#ff6b6b',
        elite: '#a78bfa',
        boss: '#ff6bff',
        guard: '#ff9a9e',
        timed: '#7af8c8'
      }
    },

    // ============================================
    // PHYSICS CONFIGURATION
    // ============================================
    physics: {
      gravity: 0.8,
      friction: 0.85,
      terminalVelocity: 20
    },

    // ============================================
    // CAMERA CONFIGURATION
    // ============================================
    camera: {
      followSpeed: 0.15,
      smoothFollow: true,
      followX: true,
      followY: true,
      boundsCheck: true
    },

    // ============================================
    // COMBAT CONFIGURATION
    // ============================================
    combat: {
      attackRange: 80,
      attackDamage: 25,
      attackCooldown: 20,
      enemyDamage: 10,
      enemyAttackCooldown: 60
    },

    // ============================================
    // INTERACTION CONFIGURATION
    // ============================================
    interaction: {
      chestInteractRange: 60,
      portalInteractRange: 50,
      chestGoldMin: 200,
      chestGoldMax: 500,
      enemyGoldMin: 50,
      enemyGoldMax: 150
    },

    // ============================================
    // UI CONFIGURATION
    // ============================================
    ui: {
      overlayWidth: 280,
      overlayMaxHeight: 400,
      overlayPosition: {
        right: 20,
        bottom: 20
      },
      healthBarHeight: 8,
      healthBarOffset: 15,
      showControlsHint: true,
      showStats: true
    },

    // ============================================
    // INPUT CONFIGURATION
    // ============================================
    input: {
      moveLeft: ['a', 'arrowleft'],
      moveRight: ['d', 'arrowright'],
      jump: ['w', 'arrowup', ' '],
      attack: [' ', 'space'],
      interact: ['e', 'E']
    },

    // ============================================
    // PERFORMANCE CONFIGURATION
    // ============================================
    performance: {
      maxEnemies: 50,
      maxPlatforms: 100,
      maxChests: 20,
      enableParticles: true,
      particleLimit: 100,
      frameSkip: 0, // 0 = no skip, 1 = skip every other frame
      enableDebug: false
    },

    // ============================================
    // AUDIO CONFIGURATION
    // ============================================
    audio: {
      enabled: true,
      volume: 0.7,
      musicVolume: 0.5,
      sfxVolume: 0.8
    },

    // ============================================
    // ADVANCED CONFIGURATION
    // ============================================
    advanced: {
      enableRoomTransitions: true,
      transitionDuration: 500,
      enableAutoSave: false,
      autoSaveInterval: 30000, // 30 seconds
      enableTelemetry: false,
      enableErrorReporting: true
    },

    // ============================================
    // CUSTOMIZATION HOOKS
    // ============================================
    hooks: {
      onPlayerSpawn: null,      // (player, room) => void
      onEnemySpawn: null,        // (enemy, room) => void
      onRoomLoad: null,          // (room) => void
      onRoomComplete: null,       // (room, stats) => void
      onPlayerAttack: null,       // (player, target) => void
      onPlayerDamage: null,       // (player, amount) => void
      onEnemyKilled: null,       // (enemy, rewards) => void
      onChestOpened: null,       // (chest, rewards) => void
      onDungeonComplete: null,   // (dungeon, stats) => void
      onError: null              // (error, context) => void
    }
  };

  /**
   * Merge custom configuration with defaults
   * @param {Object} customConfig - Custom configuration to merge
   * @returns {Object} Merged configuration
   */
  window.DungeonConfig.merge = function(customConfig) {
    function deepMerge(target, source) {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          target[key] = deepMerge(target[key] || {}, source[key]);
        } else {
          target[key] = source[key];
        }
      }
      return target;
    }
    return deepMerge(JSON.parse(JSON.stringify(window.DungeonConfig)), customConfig);
  };

  /**
   * Validate configuration
   * @returns {Array} Array of validation errors (empty if valid)
   */
  window.DungeonConfig.validate = function() {
    const errors = [];
    const config = window.DungeonConfig;

    // Validate required fields
    if (!config.theme || !config.theme.name) {
      errors.push('Theme name is required');
    }

    if (config.player.maxHealth <= 0) {
      errors.push('Player max health must be greater than 0');
    }

    if (config.room.defaultWidth <= 0 || config.room.defaultHeight <= 0) {
      errors.push('Room dimensions must be greater than 0');
    }

    if (config.physics.gravity <= 0) {
      errors.push('Gravity must be greater than 0');
    }

    return errors;
  };

  console.log('[DungeonConfig] Configuration system loaded');
})();

