/**
 * HPC PARTY INTEGRATION - Integrate HPCs with existing party system
 * Converts HPCs to party member format and syncs with gameState.party
 */

class HPCPartyIntegration {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize party integration
   */
  init() {
    if (this.initialized) return;

    // Ensure gameState.party exists
    if (!window.gameState) {
      window.gameState = {};
    }
    if (!Array.isArray(window.gameState.party)) {
      window.gameState.party = [];
    }

    // Sync HPC party to gameState.party on initialization
    this.updatePartyFromHPC();

    this.initialized = true;
    console.log('✅ HPC Party Integration initialized');
  }

  /**
   * Update gameState.party from HPC party
   */
  updatePartyFromHPC() {
    if (!window.hpcManager || !window.gameState) return;

    const hpcPartyMembers = window.hpcManager.getPartyMembers();
    
    // Convert HPC characters to party member format
    const partyMembers = hpcPartyMembers.map(hpcChar => {
      return this.convertHPCToPartyMember(hpcChar);
    });

    // Keep existing non-HPC party members (player characters)
    const existingParty = window.gameState.party || [];
    const nonHPCMembers = existingParty.filter(member => {
      // Check if member is not an HPC (doesn't have hpcId property)
      return !member.hpcId;
    });

    // Combine non-HPC members with HPC members
    window.gameState.party = [...nonHPCMembers, ...partyMembers];

    console.log(`✅ Party updated: ${partyMembers.length} HPC members, ${nonHPCMembers.length} player members`);
  }

  /**
   * Convert HPC character to party member format
   * @param {Object} hpcChar - HPC character data
   * @returns {Object} Party member format
   */
  convertHPCToPartyMember(hpcChar) {
    // Get final stats with equipment
    const finalStats = window.hpcProgression?.getStats(hpcChar.id) || hpcChar.currentStats;

    return {
      id: hpcChar.id,
      name: hpcChar.displayName || hpcChar.name,
      hpcId: hpcChar.id, // Mark as HPC
      isHPC: true,
      
      // Stats
      hp: finalStats.hp,
      maxHp: finalStats.hp,
      atk: finalStats.atk,
      def: finalStats.def,
      speed: finalStats.speed,
      
      // Character properties
      type: hpcChar.type,
      rank: hpcChar.rank,
      level: hpcChar.level,
      
      // Visual
      icon: hpcChar.icon,
      color: hpcChar.color,
      bodyType: this.getBodyTypeForHPC(hpcChar.type),
      headType: this.getHeadTypeForHPC(hpcChar.type),
      primaryColor: hpcChar.color || '#DC2626',
      secondaryColor: this.getSecondaryColor(hpcChar.color),
      
      // Skills
      skills: hpcChar.unlockedSkills || hpcChar.skills,
      
      // Position (will be set by game)
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      direction: 'down',
      state: 'idle',
      
      // Combat
      target: null,
      lastAttackTime: 0,
      attackCooldown: 2000
    };
  }

  /**
   * Get body type for HPC type
   */
  getBodyTypeForHPC(type) {
    const bodyTypes = {
      warrior: 'muscular',
      mage: 'slim',
      archer: 'athletic',
      healer: 'slim',
      rogue: 'slim',
      tank: 'bulky',
      crafter: 'stocky'
    };
    return bodyTypes[type] || 'average';
  }

  /**
   * Get head type for HPC type
   */
  getHeadTypeForHPC(type) {
    const headTypes = {
      warrior: 'human',
      mage: 'elf',
      archer: 'human',
      healer: 'angelic',
      rogue: 'human',
      tank: 'orc',
      crafter: 'dwarf'
    };
    return headTypes[type] || 'human';
  }

  /**
   * Get secondary color from primary color
   */
  getSecondaryColor(primaryColor) {
    // Simple darkening of primary color
    if (!primaryColor) return '#991B1B';
    
    // Convert hex to RGB, darken, convert back
    const hex = primaryColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const darkR = Math.max(0, Math.floor(r * 0.6));
    const darkG = Math.max(0, Math.floor(g * 0.6));
    const darkB = Math.max(0, Math.floor(b * 0.6));
    
    return `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`;
  }

  /**
   * Add HPC to party (wrapper for manager)
   * @param {string} hpcId - HPC ID
   */
  addToParty(hpcId) {
    const result = window.hpcManager?.addToParty(hpcId);
    if (result.success) {
      this.updatePartyFromHPC();
    }
    return result;
  }

  /**
   * Remove HPC from party (wrapper for manager)
   * @param {string} hpcId - HPC ID
   */
  removeFromParty(hpcId) {
    const result = window.hpcManager?.removeFromParty(hpcId);
    if (result.success) {
      this.updatePartyFromHPC();
    }
    return result;
  }

  /**
   * Get HPC party members from gameState.party
   * @returns {Array} Array of HPC party members
   */
  getHPCPartyMembers() {
    if (!window.gameState || !Array.isArray(window.gameState.party)) {
      return [];
    }
    return window.gameState.party.filter(member => member.isHPC === true);
  }

  /**
   * Update HPC stats in party (call after level up, equipment change, etc.)
   * @param {string} hpcId - HPC ID
   */
  updateHPCInParty(hpcId) {
    const hpcChar = window.hpcManager?.getCharacter(hpcId);
    if (!hpcChar) return;

    // Find in party
    const partyIndex = window.gameState.party.findIndex(m => m.hpcId === hpcId);
    if (partyIndex === -1) return;

    // Update stats
    const finalStats = window.hpcProgression?.getStats(hpcId) || hpcChar.currentStats;
    window.gameState.party[partyIndex].hp = finalStats.hp;
    window.gameState.party[partyIndex].maxHp = finalStats.hp;
    window.gameState.party[partyIndex].atk = finalStats.atk;
    window.gameState.party[partyIndex].def = finalStats.def;
    window.gameState.party[partyIndex].speed = finalStats.speed;
    window.gameState.party[partyIndex].level = hpcChar.level;
    window.gameState.party[partyIndex].skills = hpcChar.unlockedSkills || hpcChar.skills;
  }

  /**
   * Award XP to all HPC party members
   * @param {number} xpAmount - XP amount to award
   */
  awardXPToParty(xpAmount) {
    const hpcMembers = this.getHPCPartyMembers();
    hpcMembers.forEach(member => {
      if (member.hpcId && window.hpcProgression) {
        const result = window.hpcProgression.addXP(member.hpcId, xpAmount);
        if (result.levelsGained > 0) {
          // Update in party if leveled up
          this.updateHPCInParty(member.hpcId);
        }
      }
    });
  }
}

// Create singleton instance
if (typeof window !== 'undefined') {
  window.hpcPartyIntegration = new HPCPartyIntegration();
}

