/**
 * SKILL PRESETS SYSTEM
 * Save and load skill loadouts
 * 
 * @version 1.0.0
 */

class SkillPresetSystem {
  constructor() {
    this.presets = {};
    this.loadFromStorage();
  }

  /**
   * Save current skill loadout as preset
   */
  savePreset(name, characterId) {
    if (!window.gameState || !window.gameState.equippedSkills) {
      console.warn('Cannot save preset: gameState not available');
      return false;
    }

    const preset = {
      name: name,
      characterId: characterId,
      skills: { ...window.gameState.equippedSkills },
      timestamp: Date.now()
    };

    this.presets[name] = preset;
    this.saveToStorage();
    return true;
  }

  /**
   * Load preset
   */
  loadPreset(name) {
    const preset = this.presets[name];
    if (!preset) {
      console.warn(`Preset ${name} not found`);
      return false;
    }

    if (!window.gameState) {
      window.gameState = { equippedSkills: {} };
    }

    // Restore equipped skills
    window.gameState.equippedSkills = { ...preset.skills };

    // Dispatch preset loaded event
    if (window.combatEvents) {
      window.combatEvents.dispatchEvent(new CustomEvent('presetLoaded', {
        detail: { preset }
      }));
    }

    return true;
  }

  /**
   * Delete preset
   */
  deletePreset(name) {
    if (this.presets[name]) {
      delete this.presets[name];
      this.saveToStorage();
      return true;
    }
    return false;
  }

  /**
   * Get all presets
   */
  getAllPresets() {
    return Object.values(this.presets);
  }

  /**
   * Save to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem('skillPresets', JSON.stringify(this.presets));
    } catch (e) {
      console.warn('Failed to save presets:', e);
    }
  }

  /**
   * Load from localStorage
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('skillPresets');
      if (saved) {
        this.presets = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load presets:', e);
    }
  }
}

