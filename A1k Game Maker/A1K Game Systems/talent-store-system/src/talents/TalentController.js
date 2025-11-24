/**
 * TalentController.js
 * Handles talent purchases, validation, and stats calculation
 */

import { TALENT_LANES, getTalent, getAllTalents } from './TalentRegistry.js';

class TalentController {
  constructor(gameState) {
    this.gameState = gameState;
  }

  /**
   * Check if talent can be purchased
   */
  canPurchase(talentId) {
    const talent = getTalent(talentId);
    if (!talent) {
      return { can: false, reason: 'Talent not found' };
    }

    const state = this.gameState.get();

    // Already purchased
    if (state.talents.purchased.has(talentId)) {
      return { can: false, reason: 'Already purchased' };
    }

    // === S-RANK TALENT REQUIREMENTS (SUPERNATURAL LANE) ===
    if (talent.srank && talent.lane === 'supernatural') {
      // Require level 50+
      const playerLevel = state.playerLevel || 1;
      if (playerLevel < 50) {
        return { can: false, reason: 'S-Rank: Requires Level 50+' };
      }

      // Require 1000+ essence spent (tracked in progression)
      const essenceSpent = state.progression?.essenceSpent || 0;
      if (essenceSpent < 1000) {
        return { can: false, reason: `S-Rank: Requires 1000 Essence spent (${essenceSpent}/1000)` };
      }

      // Require 50,000+ gold spent total
      const goldSpent = state.progression?.goldSpent || 0;
      if (goldSpent < 50000) {
        return { can: false, reason: `S-Rank: Requires 50k Gold spent (${goldSpent}/50000)` };
      }
    }

    // === CROSS-SYSTEM ULTIMATE REQUIREMENTS ===
    if (talent.crossSystem && talent.lane === 'ultimates') {
      // Require level 75+
      const playerLevel = state.playerLevel || 1;
      if (playerLevel < 75) {
        return { can: false, reason: 'Ultimate: Requires Level 75+' };
      }

      // Require 5000+ essence spent
      const essenceSpent = state.progression?.essenceSpent || 0;
      if (essenceSpent < 5000) {
        return { can: false, reason: `Ultimate: Requires 5000 Essence spent (${essenceSpent}/5000)` };
      }

      // Require 200,000+ gold spent
      const goldSpent = state.progression?.goldSpent || 0;
      if (goldSpent < 200000) {
        return { can: false, reason: `Ultimate: Requires 200k Gold spent (${goldSpent}/200000)` };
      }

      // DIVINE APOTHEOSIS requires ALL 3 lane ultimates
      if (talent.requiresAll && talent.id === 'ultimate_divine') {
        const requiredUltimates = ['atk_ultimate', 'def_ultimate', 'super_ultimate'];
        const missingUltimates = requiredUltimates.filter(reqId => !state.talents.purchased.has(reqId));
        if (missingUltimates.length > 0) {
          return { can: false, reason: `Requires all 3 ultimates: ${missingUltimates.join(', ')}` };
        }
      }
    }

    // Not enough AP
    const apNeeded = talent.cost || 1;
    const apAvailable = state.currencies.apTotal - state.currencies.apSpent;
    if (apAvailable < apNeeded) {
      return { can: false, reason: `Need ${apNeeded} AP (have ${apAvailable})` };
    }

    // Check prerequisites
    if (talent.req && talent.req.length > 0) {
      const missingReqs = talent.req.filter(reqId => !state.talents.purchased.has(reqId));
      if (missingReqs.length > 0) {
        return { can: false, reason: `Missing requirements: ${missingReqs.join(', ')}` };
      }
    }

    return { can: true };
  }

  /**
   * Purchase a talent
   */
  purchase(talentId) {
    const canBuy = this.canPurchase(talentId);
    if (!canBuy.can) {
      return { success: false, error: canBuy.reason };
    }

    const talent = getTalent(talentId);
    const cost = talent.cost || 1;

    // Purchase talent
    const result = this.gameState.purchaseTalent(talentId, cost);
    
    if (result.success) {
      // Recalculate stats
      this.calculateStats();
      console.log(`Purchased talent: ${talent.name}`);
    }

    return result;
  }

  /**
   * Calculate all talent stats
   */
  calculateStats() {
    const state = this.gameState.get();
    const stats = {
      atkMul: 0,
      defMul: 0,
      hpFlat: 0,
      ls: 0,
      haste: 0,
      luck: 0,
      crit: 0,
      damageReduction: 0,
      regen: 0,
      moveSpeed: 0,
      goldFind: 0,
      // Special flags
      berserker: false,
      killRage: false,
      guardian: false,
      fortress: false,
      vampiric: false,
      phoenix: false,
      cascade: false,
      timeMaster: false,
      fortune: false,
      jackpot: false,
      goldenTouch: false
    };

    // Apply all purchased talents
    for (const talentId of state.talents.purchased) {
      const talent = getTalent(talentId);
      if (talent && talent.fx) {
        talent.fx(stats);
      }
    }

    // Update state
    this.gameState.update('talents.stats', stats);

    return stats;
  }

  /**
   * Get current stats
   */
  getStats() {
    return this.gameState.get().talents.stats;
  }

  /**
   * Get display stats with multipliers applied
   */
  getDisplayStats() {
    const stats = this.getStats();
    
    return {
      attack: {
        multiplier: `${((1 + stats.atkMul) * 100).toFixed(0)}%`,
        bonus: `+${(stats.atkMul * 100).toFixed(0)}%`,
        raw: stats.atkMul
      },
      defense: {
        multiplier: `${((1 + stats.defMul) * 100).toFixed(0)}%`,
        bonus: `+${(stats.defMul * 100).toFixed(0)}%`,
        raw: stats.defMul
      },
      hp: {
        flat: stats.hpFlat,
        display: `+${stats.hpFlat} HP`
      },
      lifesteal: {
        percent: `${(stats.ls * 100).toFixed(0)}%`,
        raw: stats.ls
      },
      cooldown: {
        reduction: `${stats.haste}%`,
        multiplier: `${(100 - stats.haste).toFixed(0)}%`,
        raw: stats.haste
      },
      luck: {
        value: stats.luck,
        display: `${stats.luck} Luck`
      },
      crit: {
        chance: `${(stats.crit * 100).toFixed(0)}%`,
        raw: stats.crit
      },
      damageReduction: {
        percent: `${(stats.damageReduction * 100).toFixed(0)}%`,
        raw: stats.damageReduction
      },
      regen: {
        value: stats.regen,
        display: `${stats.regen} HP/sec`
      },
      moveSpeed: {
        bonus: `+${(stats.moveSpeed * 100).toFixed(0)}%`,
        raw: stats.moveSpeed
      },
      goldFind: {
        bonus: `+${(stats.goldFind * 100).toFixed(0)}%`,
        raw: stats.goldFind
      },
      special: {
        berserker: stats.berserker,
        killRage: stats.killRage,
        guardian: stats.guardian,
        fortress: stats.fortress,
        vampiric: stats.vampiric,
        phoenix: stats.phoenix,
        cascade: stats.cascade,
        timeMaster: stats.timeMaster,
        fortune: stats.fortune,
        jackpot: stats.jackpot,
        goldenTouch: stats.goldenTouch
      }
    };
  }

  /**
   * Reset all talents
   */
  reset() {
    this.gameState.resetTalents();
    console.log('Talents reset');
    return { success: true };
  }

  /**
   * Get talent info
   */
  getTalentInfo(talentId) {
    const talent = getTalent(talentId);
    if (!talent) {
      return null;
    }

    const state = this.gameState.get();
    const isPurchased = state.talents.purchased.has(talentId);
    const canBuy = this.canPurchase(talentId);

    return {
      ...talent,
      isPurchased,
      canPurchase: canBuy.can,
      purchaseError: canBuy.reason || null
    };
  }

  /**
   * Get all talents with purchase info
   */
  getAllTalentsInfo() {
    const talents = getAllTalents();
    return talents.map(talent => this.getTalentInfo(talent.id));
  }

  /**
   * Get talents by lane with purchase info
   */
  getTalentsByLane(laneName) {
    const lane = TALENT_LANES[laneName];
    if (!lane) {
      return [];
    }

    return lane.map(talent => this.getTalentInfo(talent.id));
  }

  /**
   * Get purchase summary
   */
  getPurchaseSummary() {
    const state = this.gameState.get();
    const allTalents = getAllTalents();
    const purchasedCount = state.talents.purchased.size;
    const totalCount = allTalents.length;

    const byLane = {};
    for (const [laneName, talents] of Object.entries(TALENT_LANES)) {
      const purchased = talents.filter(t => state.talents.purchased.has(t.id)).length;
      byLane[laneName] = {
        purchased,
        total: talents.length,
        percent: ((purchased / talents.length) * 100).toFixed(0)
      };
    }

    const ultimates = allTalents.filter(t => t.ultimate);
    const purchasedUltimates = ultimates.filter(t => state.talents.purchased.has(t.id)).length;

    return {
      purchased: purchasedCount,
      total: totalCount,
      percent: ((purchasedCount / totalCount) * 100).toFixed(0),
      ap: {
        spent: state.currencies.apSpent,
        total: state.currencies.apTotal,
        available: state.currencies.apTotal - state.currencies.apSpent
      },
      ultimates: {
        purchased: purchasedUltimates,
        total: ultimates.length
      },
      byLane
    };
  }

  /**
   * Get next available talent in each lane
   */
  getNextAvailableTalents() {
    const available = [];
    
    for (const [laneName, talents] of Object.entries(TALENT_LANES)) {
      for (const talent of talents) {
        const canBuy = this.canPurchase(talent.id);
        if (canBuy.can) {
          available.push({
            ...talent,
            lane: laneName
          });
          break; // Only first available in each lane
        }
      }
    }

    return available;
  }

  /**
   * Validate talent tree integrity
   */
  validateTree() {
    const state = this.gameState.get();
    const errors = [];

    for (const talentId of state.talents.purchased) {
      const talent = getTalent(talentId);
      if (!talent) {
        errors.push(`Invalid talent ID: ${talentId}`);
        continue;
      }

      // Check prerequisites
      if (talent.req && talent.req.length > 0) {
        for (const reqId of talent.req) {
          if (!state.talents.purchased.has(reqId)) {
            errors.push(`Talent ${talentId} missing prerequisite ${reqId}`);
          }
        }
      }
    }

    // Check AP total
    const expectedAP = Array.from(state.talents.purchased)
      .map(id => getTalent(id))
      .filter(Boolean)
      .reduce((sum, talent) => sum + (talent.cost || 1), 0);

    if (expectedAP !== state.currencies.apSpent) {
      errors.push(`AP mismatch: expected ${expectedAP}, got ${state.currencies.apSpent}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get recommended talents based on playstyle
   */
  getRecommendations(playstyle = 'balanced') {
    const recommendations = {
      aggressive: ['atk_1', 'atk_2', 'atk_3', 'cd_1', 'cd_2'],
      defensive: ['def_1', 'def_2', 'def_3', 'rec_1', 'rec_2'],
      balanced: ['atk_1', 'def_1', 'rec_1', 'cd_1', 'luck_1'],
      greedy: ['luck_1', 'luck_2', 'luck_3', 'luck_4', 'luck_5']
    };

    const recommended = recommendations[playstyle] || recommendations.balanced;
    return recommended.map(id => this.getTalentInfo(id)).filter(Boolean);
  }
}

export function createTalentController(gameState) {
  return new TalentController(gameState);
}

export default {
  createTalentController
};

