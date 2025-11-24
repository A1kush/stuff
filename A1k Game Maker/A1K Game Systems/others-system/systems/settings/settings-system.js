/**
 * Settings System - Standalone Module
 * @description Comprehensive game settings management
 * @version 1.0.0
 * @license MIT
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SettingsSystem = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class SettingsSystem {
    constructor(options = {}) {
      this.options = Object.assign({
        storageKey: 'game_settings',
        autoSave: true,
        eventBus: null
      }, options);

      // Default settings
      this.settings = {
        // Audio
        masterVolume: 0.7,
        sfxVolume: 0.8,
        musicVolume: 0.6,
        audioEnabled: true,

        // Graphics
        shadows: true,
        particles: true,
        antialiasing: true,
        cameraShake: true,
        quality: 'high', // low, medium, high, ultra

        // Gameplay
        autoSave: true,
        showTutorial: true,
        showDamageNumbers: true,
        showItemDrops: true,
        difficulty: 'normal', // easy, normal, hard, expert
        cameraSpeed: 1.0,

        // Controls
        invertY: false,
        mouseSensitivity: 1.0,
        keyBindings: {
          moveLeft: 'ArrowLeft',
          moveRight: 'ArrowRight',
          jump: 'Space',
          attack: 'KeyZ',
          skill1: 'KeyX',
          skill2: 'KeyC',
          inventory: 'KeyI',
          pause: 'Escape'
        },

        // UI
        showFPS: false,
        showMinimap: true,
        hudScale: 1.0,
        uiTheme: 'dark', // light, dark, auto
        language: 'en'
      };

      // Settings metadata (for UI generation)
      this.settingsMetadata = {
        masterVolume: { type: 'slider', min: 0, max: 1, step: 0.1, category: 'audio', label: 'Master Volume' },
        sfxVolume: { type: 'slider', min: 0, max: 1, step: 0.1, category: 'audio', label: 'SFX Volume' },
        musicVolume: { type: 'slider', min: 0, max: 1, step: 0.1, category: 'audio', label: 'Music Volume' },
        audioEnabled: { type: 'toggle', category: 'audio', label: 'Enable Audio' },
        
        shadows: { type: 'toggle', category: 'graphics', label: 'Shadows' },
        particles: { type: 'toggle', category: 'graphics', label: 'Particles' },
        antialiasing: { type: 'toggle', category: 'graphics', label: 'Anti-aliasing' },
        cameraShake: { type: 'toggle', category: 'graphics', label: 'Camera Shake' },
        quality: { type: 'select', options: ['low', 'medium', 'high', 'ultra'], category: 'graphics', label: 'Graphics Quality' },
        
        autoSave: { type: 'toggle', category: 'gameplay', label: 'Auto Save' },
        showTutorial: { type: 'toggle', category: 'gameplay', label: 'Show Tutorials' },
        showDamageNumbers: { type: 'toggle', category: 'gameplay', label: 'Damage Numbers' },
        showItemDrops: { type: 'toggle', category: 'gameplay', label: 'Show Item Drops' },
        difficulty: { type: 'select', options: ['easy', 'normal', 'hard', 'expert'], category: 'gameplay', label: 'Difficulty' },
        cameraSpeed: { type: 'slider', min: 0.5, max: 2, step: 0.1, category: 'gameplay', label: 'Camera Speed' },
        
        invertY: { type: 'toggle', category: 'controls', label: 'Invert Y Axis' },
        mouseSensitivity: { type: 'slider', min: 0.1, max: 3, step: 0.1, category: 'controls', label: 'Mouse Sensitivity' },
        
        showFPS: { type: 'toggle', category: 'ui', label: 'Show FPS' },
        showMinimap: { type: 'toggle', category: 'ui', label: 'Show Minimap' },
        hudScale: { type: 'slider', min: 0.5, max: 2, step: 0.1, category: 'ui', label: 'HUD Scale' },
        uiTheme: { type: 'select', options: ['light', 'dark', 'auto'], category: 'ui', label: 'UI Theme' },
        language: { type: 'select', options: ['en', 'es', 'fr', 'de', 'ja', 'zh'], category: 'ui', label: 'Language' }
      };

      this.initialized = false;
    }

    async initialize(defaultSettings = {}) {
      if (this.initialized) return;

      // Merge with provided defaults
      this.settings = Object.assign({}, this.settings, defaultSettings);

      // Load saved settings
      this.load();

      this.initialized = true;
      this.emit('settings:initialized');
      
      console.log('[SettingsSystem] Initialized');
    }

    // ===== GET/SET =====

    get(key) {
      return this.settings[key];
    }

    set(key, value) {
      if (!(key in this.settings)) {
        console.warn(`[SettingsSystem] Unknown setting: ${key}`);
        return false;
      }

      // Validate value
      const metadata = this.settingsMetadata[key];
      if (metadata) {
        if (metadata.type === 'slider') {
          value = Math.max(metadata.min, Math.min(metadata.max, value));
        } else if (metadata.type === 'select') {
          if (!metadata.options.includes(value)) {
            console.warn(`[SettingsSystem] Invalid value for ${key}: ${value}`);
            return false;
          }
        }
      }

      const oldValue = this.settings[key];
      this.settings[key] = value;

      this.applySetting(key, value, oldValue);
      this.emit('setting:changed', { key, value, oldValue });
      this.save();

      return true;
    }

    getAll() {
      return { ...this.settings };
    }

    setMultiple(settings) {
      Object.entries(settings).forEach(([key, value]) => {
        this.set(key, value);
      });
    }

    // ===== APPLY SETTINGS =====

    applySetting(key, value, oldValue) {
      // Apply setting changes immediately
      switch (key) {
        case 'masterVolume':
        case 'sfxVolume':
        case 'musicVolume':
          this.applyVolumeSettings();
          break;

        case 'audioEnabled':
          this.toggleAudio(value);
          break;

        case 'quality':
          this.applyGraphicsQuality(value);
          break;

        case 'uiTheme':
          this.applyTheme(value);
          break;

        case 'hudScale':
          this.applyHUDScale(value);
          break;

        case 'language':
          this.applyLanguage(value);
          break;

        // Add more specific handling as needed
      }

      this.emit(`setting:applied:${key}`, { value, oldValue });
    }

    applyVolumeSettings() {
      const master = this.settings.masterVolume;
      const sfx = this.settings.sfxVolume;
      const music = this.settings.musicVolume;

      this.emit('audio:volume_changed', { master, sfx, music });
    }

    toggleAudio(enabled) {
      this.emit('audio:toggled', { enabled });
    }

    applyGraphicsQuality(quality) {
      const qualitySettings = {
        low: { shadows: false, particles: false, antialiasing: false },
        medium: { shadows: true, particles: false, antialiasing: false },
        high: { shadows: true, particles: true, antialiasing: true },
        ultra: { shadows: true, particles: true, antialiasing: true }
      };

      const settings = qualitySettings[quality] || qualitySettings.high;
      Object.entries(settings).forEach(([key, value]) => {
        this.settings[key] = value;
      });

      this.emit('graphics:quality_changed', { quality, settings });
    }

    applyTheme(theme) {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
      }
      this.emit('ui:theme_changed', { theme });
    }

    applyHUDScale(scale) {
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--hud-scale', scale);
      }
      this.emit('ui:hud_scale_changed', { scale });
    }

    applyLanguage(language) {
      this.emit('ui:language_changed', { language });
    }

    // ===== KEY BINDINGS =====

    getKeyBinding(action) {
      return this.settings.keyBindings[action] || null;
    }

    setKeyBinding(action, key) {
      if (!this.settings.keyBindings.hasOwnProperty(action)) {
        console.warn(`[SettingsSystem] Unknown action: ${action}`);
        return false;
      }

      // Check for conflicts
      const conflicts = Object.entries(this.settings.keyBindings)
        .filter(([a, k]) => a !== action && k === key);

      if (conflicts.length > 0) {
        console.warn(`[SettingsSystem] Key ${key} already bound to ${conflicts[0][0]}`);
        return false;
      }

      this.settings.keyBindings[action] = key;
      this.emit('keybinding:changed', { action, key });
      this.save();

      return true;
    }

    getKeyBindings() {
      return { ...this.settings.keyBindings };
    }

    resetKeyBindings() {
      this.settings.keyBindings = {
        moveLeft: 'ArrowLeft',
        moveRight: 'ArrowRight',
        jump: 'Space',
        attack: 'KeyZ',
        skill1: 'KeyX',
        skill2: 'KeyC',
        inventory: 'KeyI',
        pause: 'Escape'
      };
      this.emit('keybindings:reset');
      this.save();
    }

    // ===== PRESETS =====

    applyPreset(preset) {
      const presets = {
        performance: {
          quality: 'low',
          shadows: false,
          particles: false,
          antialiasing: false
        },
        balanced: {
          quality: 'medium',
          shadows: true,
          particles: false,
          antialiasing: false
        },
        quality: {
          quality: 'high',
          shadows: true,
          particles: true,
          antialiasing: true
        },
        ultra: {
          quality: 'ultra',
          shadows: true,
          particles: true,
          antialiasing: true
        }
      };

      const settings = presets[preset];
      if (!settings) {
        console.warn(`[SettingsSystem] Unknown preset: ${preset}`);
        return false;
      }

      this.setMultiple(settings);
      this.emit('preset:applied', { preset });

      return true;
    }

    // ===== RESET =====

    reset() {
      const defaults = new SettingsSystem().settings;
      this.settings = { ...defaults };
      this.save();
      this.emit('settings:reset');
    }

    resetCategory(category) {
      const defaults = new SettingsSystem().settings;
      
      Object.keys(this.settingsMetadata).forEach(key => {
        if (this.settingsMetadata[key].category === category) {
          this.settings[key] = defaults[key];
        }
      });

      this.save();
      this.emit('settings:category_reset', { category });
    }

    // ===== DATA MANAGEMENT =====

    save() {
      if (!this.options.autoSave) return;

      const data = {
        settings: this.settings,
        version: '1.0.0',
        lastSaved: Date.now()
      };

      try {
        localStorage.setItem(this.options.storageKey, JSON.stringify(data));
      } catch (e) {
        console.error('[SettingsSystem] Save error:', e);
      }
    }

    load() {
      try {
        const saved = localStorage.getItem(this.options.storageKey);
        if (!saved) return;

        const data = JSON.parse(saved);
        
        if (data.settings) {
          this.settings = Object.assign({}, this.settings, data.settings);
        }

        // Apply all settings
        Object.entries(this.settings).forEach(([key, value]) => {
          this.applySetting(key, value, undefined);
        });

        this.emit('settings:loaded');
      } catch (e) {
        console.error('[SettingsSystem] Load error:', e);
      }
    }

    exportData() {
      return {
        settings: this.settings,
        version: '1.0.0',
        exportDate: new Date().toISOString()
      };
    }

    importData(data) {
      if (data.settings) {
        this.settings = Object.assign({}, this.settings, data.settings);
        
        // Apply all settings
        Object.entries(this.settings).forEach(([key, value]) => {
          this.applySetting(key, value, undefined);
        });

        this.save();
        this.emit('settings:imported');
        return true;
      }
      return false;
    }

    emit(event, data) {
      if (this.options.eventBus && typeof this.options.eventBus.emit === 'function') {
        this.options.eventBus.emit(event, data);
      }

      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent(event, { detail: data }));
      }
    }

    // ===== METADATA =====

    getSettingsByCategory(category) {
      return Object.entries(this.settingsMetadata)
        .filter(([key, meta]) => meta.category === category)
        .map(([key, meta]) => ({
          key,
          ...meta,
          value: this.settings[key]
        }));
    }

    getCategories() {
      const categories = new Set();
      Object.values(this.settingsMetadata).forEach(meta => {
        categories.add(meta.category);
      });
      return Array.from(categories);
    }
  }

  return SettingsSystem;
}));

