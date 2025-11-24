/**
 * Storage Helper - localStorage/sessionStorage wrapper
 * @description Safe wrapper for browser storage with fallback and error handling
 * @version 1.0.0
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
    root.StorageHelper = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  /**
   * StorageHelper class for safe localStorage/sessionStorage operations
   * @class
   */
  class StorageHelper {
    constructor(prefix = 'game_', storageType = 'local') {
      this.prefix = prefix;
      this.storageType = storageType;
      this.memoryFallback = {};
      this.storage = this.getStorage();
    }

    /**
     * Get storage object (localStorage or sessionStorage)
     * @returns {Storage|Object} Storage object or memory fallback
     */
    getStorage() {
      try {
        const storage = this.storageType === 'session' ? sessionStorage : localStorage;
        // Test if storage is available
        const testKey = '__storage_test__';
        storage.setItem(testKey, 'test');
        storage.removeItem(testKey);
        return storage;
      } catch (e) {
        console.warn('[StorageHelper] Storage not available, using memory fallback');
        return this.memoryFallback;
      }
    }

    /**
     * Generate prefixed key
     * @param {string} key - Original key
     * @returns {string} Prefixed key
     */
    getKey(key) {
      return this.prefix + key;
    }

    /**
     * Set item in storage
     * @param {string} key - Storage key
     * @param {*} value - Value to store (will be JSON stringified)
     * @returns {boolean} Success status
     */
    set(key, value) {
      try {
        const prefixedKey = this.getKey(key);
        const serialized = JSON.stringify(value);
        this.storage.setItem(prefixedKey, serialized);
        return true;
      } catch (e) {
        console.error('[StorageHelper] Error setting item:', e);
        return false;
      }
    }

    /**
     * Get item from storage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key not found
     * @returns {*} Retrieved value or default value
     */
    get(key, defaultValue = null) {
      try {
        const prefixedKey = this.getKey(key);
        const item = this.storage.getItem(prefixedKey);
        
        if (item === null) {
          return defaultValue;
        }
        
        return JSON.parse(item);
      } catch (e) {
        console.error('[StorageHelper] Error getting item:', e);
        return defaultValue;
      }
    }

    /**
     * Remove item from storage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    remove(key) {
      try {
        const prefixedKey = this.getKey(key);
        this.storage.removeItem(prefixedKey);
        return true;
      } catch (e) {
        console.error('[StorageHelper] Error removing item:', e);
        return false;
      }
    }

    /**
     * Clear all items with prefix
     * @returns {boolean} Success status
     */
    clear() {
      try {
        const keys = this.keys();
        keys.forEach(key => this.remove(key));
        return true;
      } catch (e) {
        console.error('[StorageHelper] Error clearing storage:', e);
        return false;
      }
    }

    /**
     * Get all keys with prefix
     * @returns {string[]} Array of keys (without prefix)
     */
    keys() {
      try {
        const allKeys = Object.keys(this.storage);
        return allKeys
          .filter(key => key.startsWith(this.prefix))
          .map(key => key.substring(this.prefix.length));
      } catch (e) {
        console.error('[StorageHelper] Error getting keys:', e);
        return [];
      }
    }

    /**
     * Check if key exists
     * @param {string} key - Storage key
     * @returns {boolean} True if key exists
     */
    has(key) {
      const prefixedKey = this.getKey(key);
      return this.storage.getItem(prefixedKey) !== null;
    }

    /**
     * Get storage size
     * @returns {number} Approximate size in bytes
     */
    getSize() {
      try {
        let total = 0;
        for (let key in this.storage) {
          if (key.startsWith(this.prefix)) {
            total += this.storage[key].length + key.length;
          }
        }
        return total;
      } catch (e) {
        return 0;
      }
    }

    /**
     * Export all data as JSON
     * @returns {Object} All stored data
     */
    exportData() {
      const data = {};
      const keys = this.keys();
      keys.forEach(key => {
        data[key] = this.get(key);
      });
      return data;
    }

    /**
     * Import data from JSON
     * @param {Object} data - Data to import
     * @param {boolean} clearFirst - Clear existing data first
     * @returns {boolean} Success status
     */
    importData(data, clearFirst = false) {
      try {
        if (clearFirst) {
          this.clear();
        }
        
        for (let key in data) {
          this.set(key, data[key]);
        }
        
        return true;
      } catch (e) {
        console.error('[StorageHelper] Error importing data:', e);
        return false;
      }
    }
  }

  // Create default instance
  const storage = new StorageHelper();

  // Export both class and default instance
  return {
    StorageHelper,
    default: storage,
    set: storage.set.bind(storage),
    get: storage.get.bind(storage),
    remove: storage.remove.bind(storage),
    clear: storage.clear.bind(storage),
    keys: storage.keys.bind(storage),
    has: storage.has.bind(storage),
    getSize: storage.getSize.bind(storage),
    exportData: storage.exportData.bind(storage),
    importData: storage.importData.bind(storage)
  };
}));

