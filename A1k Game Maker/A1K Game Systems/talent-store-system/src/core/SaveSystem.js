/**
 * SaveSystem.js
 * localStorage persistence with versioning and validation
 */

const SAVE_KEY = 'talent_store_system_save';
const SAVE_VERSION = '1.0.0';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

class SaveSystem {
  constructor(gameState) {
    this.gameState = gameState;
    this.autoSaveTimer = null;
    this.lastSaveTime = 0;
  }

  /**
   * Save game state to localStorage
   */
  save() {
    try {
      const state = this.gameState.export();
      const saveData = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        data: state
      };

      const serialized = JSON.stringify(saveData);
      localStorage.setItem(SAVE_KEY, serialized);
      this.lastSaveTime = Date.now();

      console.log('Game saved successfully');
      return { success: true, size: serialized.length };
    } catch (error) {
      console.error('Save failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Load game state from localStorage
   */
  load() {
    try {
      const serialized = localStorage.getItem(SAVE_KEY);
      
      if (!serialized) {
        console.log('No save data found');
        return { success: false, error: 'No save data found' };
      }

      const saveData = JSON.parse(serialized);

      // Validate save data
      const validation = this.validate(saveData);
      if (!validation.valid) {
        console.error('Save data validation failed:', validation.errors);
        return { success: false, error: 'Invalid save data', details: validation.errors };
      }

      // Handle version migration if needed
      const migrated = this.migrate(saveData);

      // Import state
      const result = this.gameState.import(migrated.data);
      
      if (result.success) {
        console.log('Game loaded successfully');
        return { success: true, version: migrated.version };
      } else {
        return result;
      }
    } catch (error) {
      console.error('Load failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Validate save data structure
   */
  validate(saveData) {
    const errors = [];

    if (!saveData) {
      errors.push('Save data is null or undefined');
      return { valid: false, errors };
    }

    if (!saveData.version) {
      errors.push('Missing version');
    }

    if (!saveData.timestamp) {
      errors.push('Missing timestamp');
    }

    if (!saveData.data) {
      errors.push('Missing data object');
      return { valid: false, errors };
    }

    // Validate required fields
    const requiredFields = ['currencies', 'talents', 'inventory', 'player'];
    for (const field of requiredFields) {
      if (!saveData.data[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Migrate old save data to current version
   */
  migrate(saveData) {
    if (saveData.version === SAVE_VERSION) {
      return saveData;
    }

    console.log(`Migrating save data from ${saveData.version} to ${SAVE_VERSION}`);

    // Migration logic for future versions
    const migrated = { ...saveData };

    // Example migration (if needed in future):
    // if (compareVersions(saveData.version, '1.1.0') < 0) {
    //   migrated.data.newField = defaultValue;
    // }

    migrated.version = SAVE_VERSION;
    return migrated;
  }

  /**
   * Delete save data
   */
  deleteSave() {
    try {
      localStorage.removeItem(SAVE_KEY);
      console.log('Save data deleted');
      return { success: true };
    } catch (error) {
      console.error('Delete failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if save exists
   */
  hasSave() {
    return localStorage.getItem(SAVE_KEY) !== null;
  }

  /**
   * Get save info without loading
   */
  getSaveInfo() {
    try {
      const serialized = localStorage.getItem(SAVE_KEY);
      
      if (!serialized) {
        return null;
      }

      const saveData = JSON.parse(serialized);
      
      return {
        version: saveData.version,
        timestamp: saveData.timestamp,
        date: new Date(saveData.timestamp).toLocaleString(),
        size: serialized.length,
        sizeKB: (serialized.length / 1024).toFixed(2)
      };
    } catch (error) {
      console.error('Failed to get save info:', error);
      return null;
    }
  }

  /**
   * Export save to file
   */
  exportToFile() {
    try {
      const state = this.gameState.export();
      const saveData = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        data: state
      };

      const serialized = JSON.stringify(saveData, null, 2);
      const blob = new Blob([serialized], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `talent-store-save-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('Save exported to file');
      return { success: true };
    } catch (error) {
      console.error('Export failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Import save from file
   */
  importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const saveData = JSON.parse(e.target.result);
          
          const validation = this.validate(saveData);
          if (!validation.valid) {
            reject(new Error('Invalid save file: ' + validation.errors.join(', ')));
            return;
          }

          const migrated = this.migrate(saveData);
          const result = this.gameState.import(migrated.data);
          
          if (result.success) {
            // Save to localStorage
            this.save();
            console.log('Save imported from file');
            resolve({ success: true });
          } else {
            reject(new Error(result.error));
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Enable auto-save
   */
  enableAutoSave(interval = AUTO_SAVE_INTERVAL) {
    if (this.autoSaveTimer) {
      this.disableAutoSave();
    }

    this.autoSaveTimer = setInterval(() => {
      this.save();
    }, interval);

    console.log(`Auto-save enabled (interval: ${interval}ms)`);
  }

  /**
   * Disable auto-save
   */
  disableAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
      console.log('Auto-save disabled');
    }
  }

  /**
   * Create backup
   */
  createBackup() {
    try {
      const serialized = localStorage.getItem(SAVE_KEY);
      
      if (!serialized) {
        return { success: false, error: 'No save data to backup' };
      }

      const backupKey = `${SAVE_KEY}_backup_${Date.now()}`;
      localStorage.setItem(backupKey, serialized);

      console.log('Backup created:', backupKey);
      return { success: true, key: backupKey };
    } catch (error) {
      console.error('Backup failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * List all backups
   */
  listBackups() {
    const backups = [];
    const prefix = `${SAVE_KEY}_backup_`;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          backups.push({
            key,
            timestamp: data.timestamp,
            date: new Date(data.timestamp).toLocaleString()
          });
        } catch (error) {
          console.error('Failed to parse backup:', key);
        }
      }
    }

    return backups.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Restore from backup
   */
  restoreBackup(backupKey) {
    try {
      const serialized = localStorage.getItem(backupKey);
      
      if (!serialized) {
        return { success: false, error: 'Backup not found' };
      }

      // Save current state as backup before restoring
      this.createBackup();

      // Restore backup
      localStorage.setItem(SAVE_KEY, serialized);
      
      // Load restored data
      const result = this.load();
      
      if (result.success) {
        console.log('Backup restored:', backupKey);
      }
      
      return result;
    } catch (error) {
      console.error('Restore failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete backup
   */
  deleteBackup(backupKey) {
    try {
      localStorage.removeItem(backupKey);
      console.log('Backup deleted:', backupKey);
      return { success: true };
    } catch (error) {
      console.error('Delete backup failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get storage usage
   */
  getStorageInfo() {
    let totalSize = 0;
    let itemCount = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(SAVE_KEY)) {
        const value = localStorage.getItem(key);
        totalSize += value ? value.length : 0;
        itemCount++;
      }
    }

    return {
      itemCount,
      totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2)
    };
  }
}

export function createSaveSystem(gameState) {
  return new SaveSystem(gameState);
}

export default {
  createSaveSystem,
  SAVE_KEY,
  SAVE_VERSION
};

