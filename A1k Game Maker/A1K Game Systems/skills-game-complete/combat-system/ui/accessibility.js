/**
 * ACCESSIBILITY FEATURES
 * Colorblind-friendly indicators, keyboard navigation, etc.
 * 
 * @version 1.0.0
 */

class AccessibilitySystem {
  constructor() {
    this.settings = {
      colorblindMode: false,
      highContrast: false,
      largeText: false,
      keyboardOnly: false
    };
    this.loadSettings();
  }

  /**
   * Toggle colorblind mode
   */
  toggleColorblindMode() {
    this.settings.colorblindMode = !this.settings.colorblindMode;
    this.applySettings();
    this.saveSettings();
  }

  /**
   * Toggle high contrast
   */
  toggleHighContrast() {
    this.settings.highContrast = !this.settings.highContrast;
    this.applySettings();
    this.saveSettings();
  }

  /**
   * Apply accessibility settings
   */
  applySettings() {
    const root = document.documentElement;
    
    if (this.settings.colorblindMode) {
      root.style.setProperty('--skill-color-fire', '#ff8800');
      root.style.setProperty('--skill-color-ice', '#0088ff');
      root.style.setProperty('--skill-color-lightning', '#ffff00');
    }

    if (this.settings.highContrast) {
      root.style.setProperty('--bg-opacity', '0.95');
      root.style.setProperty('--text-color', '#ffffff');
    }

    if (this.settings.largeText) {
      root.style.setProperty('--font-size-base', '18px');
    }
  }

  /**
   * Save settings
   */
  saveSettings() {
    try {
      localStorage.setItem('accessibilitySettings', JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to save accessibility settings:', e);
    }
  }

  /**
   * Load settings
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem('accessibilitySettings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
        this.applySettings();
      }
    } catch (e) {
      console.warn('Failed to load accessibility settings:', e);
    }
  }
}

