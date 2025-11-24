/**
 * HPC MANAGER - Core hiring and party management system
 * Handles hiring characters, managing party, and state management
 */

class HPCManager {
  constructor() {
    this.initializeState();
    this.maxPartySize = 4;
  }

  /**
   * Initialize HPC state
   */
  initializeState() {
    if (!window.hpcState) {
      window.hpcState = {
        hired: [],           // Array of hired character IDs
        party: [],          // Array of active party member IDs
        maxPartySize: 4,
        characters: {}       // Character data cache (id -> character data)
      };
    }

    // Ensure arrays exist
    if (!Array.isArray(window.hpcState.hired)) {
      window.hpcState.hired = [];
    }
    if (!Array.isArray(window.hpcState.party)) {
      window.hpcState.party = [];
    }
    if (!window.hpcState.characters) {
      window.hpcState.characters = {};
    }
  }

  /**
   * Hire a character
   * @param {string} hpcId - HPC ID to hire
   * @returns {Object} Result object with success status
   */
  hireCharacter(hpcId) {
    // Check if already hired
    if (this.isHired(hpcId)) {
      return {
        success: false,
        error: 'Character already hired',
        message: 'This character is already in your roster.'
      };
    }

    // Get HPC data
    const hpcData = window.HPCDatabase?.getHPCById(hpcId);
    if (!hpcData) {
      return {
        success: false,
        error: 'Character not found',
        message: 'Character data not found.'
      };
    }

    // Check if player can afford
    if (window.hpcGoldIntegration) {
      if (!window.hpcGoldIntegration.canAfford(hpcData.hireCost)) {
        return {
          success: false,
          error: 'Insufficient funds',
          message: `You need ${hpcData.hireCost.toLocaleString()} gold to hire this character.`
        };
      }

      // Deduct gold
      if (!window.hpcGoldIntegration.deductGold(hpcData.hireCost)) {
        return {
          success: false,
          error: 'Payment failed',
          message: 'Failed to process payment.'
        };
      }
    } else {
      // Fallback: check gameState.gold directly
      const currentGold = window.gameState?.gold || 0;
      if (currentGold < hpcData.hireCost) {
        return {
          success: false,
          error: 'Insufficient funds',
          message: `You need ${hpcData.hireCost.toLocaleString()} gold to hire this character.`
        };
      }
      window.gameState.gold -= hpcData.hireCost;
    }

    // Create character instance
    const character = this.createCharacterInstance(hpcData);

    // Add to hired list
    window.hpcState.hired.push(hpcId);
    window.hpcState.characters[hpcId] = character;

    console.log(`✅ Hired ${hpcData.name} for ${hpcData.hireCost} gold`);

    return {
      success: true,
      character: character,
      message: `Successfully hired ${hpcData.name}!`
    };
  }

  /**
   * Create character instance from HPC data
   * @param {Object} hpcData - HPC data from database
   * @returns {Object} Character instance
   */
  createCharacterInstance(hpcData) {
    return {
      id: hpcData.id,
      name: hpcData.name,
      displayName: hpcData.displayName,
      type: hpcData.type,
      rank: hpcData.rank,
      level: 1,
      xp: 0,
      xpToNext: 100,
      baseStats: { ...hpcData.baseStats },
      currentStats: { ...hpcData.baseStats },
      equipment: {
        weapon: null,
        armor: null,
        accessory1: null,
        accessory2: null
      },
      skills: [...hpcData.skills],
      unlockedSkills: hpcData.skills.slice(0, 1), // Start with first skill
      hiredAt: Date.now(),
      icon: hpcData.icon,
      color: hpcData.color
    };
  }

  /**
   * Check if character is hired
   * @param {string} hpcId - HPC ID
   * @returns {boolean} True if hired
   */
  isHired(hpcId) {
    return window.hpcState.hired.includes(hpcId);
  }

  /**
   * Check if character is in party
   * @param {string} hpcId - HPC ID
   * @returns {boolean} True if in party
   */
  isInParty(hpcId) {
    return window.hpcState.party.includes(hpcId);
  }

  /**
   * Add character to party
   * @param {string} hpcId - HPC ID to add
   * @returns {Object} Result object
   */
  addToParty(hpcId) {
    // Check if hired
    if (!this.isHired(hpcId)) {
      return {
        success: false,
        error: 'Not hired',
        message: 'You must hire this character first.'
      };
    }

    // Check if already in party
    if (this.isInParty(hpcId)) {
      return {
        success: false,
        error: 'Already in party',
        message: 'Character is already in your party.'
      };
    }

    // Check party size
    if (window.hpcState.party.length >= this.maxPartySize) {
      return {
        success: false,
        error: 'Party full',
        message: `Party is full (max ${this.maxPartySize} members). Remove someone first.`
      };
    }

    // Add to party
    window.hpcState.party.push(hpcId);
    console.log(`✅ Added ${hpcId} to party`);

    // Trigger party integration update
    if (window.hpcPartyIntegration) {
      window.hpcPartyIntegration.updatePartyFromHPC();
    }

    return {
      success: true,
      message: `${this.getCharacterName(hpcId)} added to party.`
    };
  }

  /**
   * Remove character from party
   * @param {string} hpcId - HPC ID to remove
   * @returns {Object} Result object
   */
  removeFromParty(hpcId) {
    const index = window.hpcState.party.indexOf(hpcId);
    if (index === -1) {
      return {
        success: false,
        error: 'Not in party',
        message: 'Character is not in your party.'
      };
    }

    window.hpcState.party.splice(index, 1);
    console.log(`✅ Removed ${hpcId} from party`);

    // Trigger party integration update
    if (window.hpcPartyIntegration) {
      window.hpcPartyIntegration.updatePartyFromHPC();
    }

    return {
      success: true,
      message: `${this.getCharacterName(hpcId)} removed from party.`
    };
  }

  /**
   * Get all hired characters
   * @returns {Array} Array of character data
   */
  getHiredCharacters() {
    return window.hpcState.hired.map(hpcId => {
      return window.hpcState.characters[hpcId] || null;
    }).filter(char => char !== null);
  }

  /**
   * Get party members
   * @returns {Array} Array of party member data
   */
  getPartyMembers() {
    return window.hpcState.party.map(hpcId => {
      return window.hpcState.characters[hpcId] || null;
    }).filter(char => char !== null);
  }

  /**
   * Get character by ID
   * @param {string} hpcId - HPC ID
   * @returns {Object|null} Character data or null
   */
  getCharacter(hpcId) {
    return window.hpcState.characters[hpcId] || null;
  }

  /**
   * Get character name
   * @param {string} hpcId - HPC ID
   * @returns {string} Character name
   */
  getCharacterName(hpcId) {
    const char = this.getCharacter(hpcId);
    return char ? char.name : hpcId;
  }

  /**
   * Check if player can afford character
   * @param {string} hpcId - HPC ID
   * @returns {boolean} True if can afford
   */
  canAfford(hpcId) {
    const hpcData = window.HPCDatabase?.getHPCById(hpcId);
    if (!hpcData) return false;

    if (window.hpcGoldIntegration) {
      return window.hpcGoldIntegration.canAfford(hpcData.hireCost);
    }

    const currentGold = window.gameState?.gold || 0;
    return currentGold >= hpcData.hireCost;
  }

  /**
   * Get HPC info (for display)
   * @param {string} hpcId - HPC ID
   * @returns {Object} HPC info
   */
  getHPCInfo(hpcId) {
    const hpcData = window.HPCDatabase?.getHPCById(hpcId);
    if (!hpcData) return null;

    const isHired = this.isHired(hpcId);
    const isInParty = this.isInParty(hpcId);
    const canAfford = this.canAfford(hpcId);

    return {
      ...hpcData,
      isHired,
      isInParty,
      canAfford,
      character: isHired ? this.getCharacter(hpcId) : null
    };
  }

  /**
   * Get available party slots
   * @returns {number} Number of available slots
   */
  getAvailablePartySlots() {
    return this.maxPartySize - window.hpcState.party.length;
  }

  /**
   * Clear all data (for testing/reset)
   */
  reset() {
    window.hpcState.hired = [];
    window.hpcState.party = [];
    window.hpcState.characters = {};
    console.log('HPC state reset');
  }
}

// Create singleton instance
if (typeof window !== 'undefined') {
  window.hpcManager = new HPCManager();
}

