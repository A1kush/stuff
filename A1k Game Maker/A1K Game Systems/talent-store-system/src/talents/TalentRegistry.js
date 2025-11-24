/**
 * TalentRegistry.js
 * Complete registry of all 31 talent nodes across 6 lanes
 * Extracted from A1K Runner game
 */

export const TALENT_LANES = {
  // Attack Lane: 6 nodes focused on damage output
  atk: [
    {
      id: 'atk_1',
      name: '+5% ATK',
      cost: 1,
      text: '+5% ATK',
      description: 'Increase attack damage by 5%',
      lane: 'atk',
      tier: 1,
      req: null,
      fx: (stats) => {
        stats.atkMul = (stats.atkMul || 0) + 0.05;
      }
    },
    {
      id: 'atk_2',
      name: '+8% ATK',
      cost: 2,
      text: '+8% ATK',
      description: 'Increase attack damage by 8%',
      lane: 'atk',
      tier: 2,
      req: ['atk_1'],
      fx: (stats) => {
        stats.atkMul = (stats.atkMul || 0) + 0.08;
      }
    },
    {
      id: 'atk_3',
      name: '+12% ATK',
      cost: 3,
      text: '+12% ATK',
      description: 'Increase attack damage by 12%',
      lane: 'atk',
      tier: 3,
      req: ['atk_2'],
      fx: (stats) => {
        stats.atkMul = (stats.atkMul || 0) + 0.12;
      }
    },
    {
      id: 'atk_4',
      name: '+15% ATK + Crit Chance',
      cost: 4,
      text: '+15% ATK + Crit Chance',
      description: 'Increase attack damage by 15% and gain 10% critical chance',
      lane: 'atk',
      tier: 4,
      req: ['atk_3'],
      fx: (stats) => {
        stats.atkMul = (stats.atkMul || 0) + 0.15;
        stats.crit = (stats.crit || 0) + 0.10;
      }
    },
    {
      id: 'atk_5',
      name: 'Berserker',
      cost: 5,
      text: 'Berserker: ATK scales with missing HP',
      description: 'Your attack power increases as your health decreases',
      lane: 'atk',
      tier: 5,
      req: ['atk_4'],
      fx: (stats) => {
        stats.berserker = true;
      }
    },
    {
      id: 'atk_ultimate',
      name: 'APEX HUNTER',
      cost: 8,
      text: 'APEX HUNTER: +50% ATK, kills grant rage',
      description: 'Massive attack boost and killing enemies generates rage',
      lane: 'atk',
      tier: 6,
      ultimate: true,
      req: ['atk_5'],
      fx: (stats) => {
        stats.atkMul = (stats.atkMul || 0) + 0.50;
        stats.killRage = true;
      }
    }
  ],

  // Defense Lane: 6 nodes focused on survivability
  def: [
    {
      id: 'def_1',
      name: '+80 HP',
      cost: 1,
      text: '+80 HP',
      description: 'Increase maximum health by 80',
      lane: 'def',
      tier: 1,
      req: null,
      fx: (stats) => {
        stats.hpFlat = (stats.hpFlat || 0) + 80;
      }
    },
    {
      id: 'def_2',
      name: '+120 HP',
      cost: 2,
      text: '+120 HP',
      description: 'Increase maximum health by 120',
      lane: 'def',
      tier: 2,
      req: ['def_1'],
      fx: (stats) => {
        stats.hpFlat = (stats.hpFlat || 0) + 120;
      }
    },
    {
      id: 'def_3',
      name: '+160 HP',
      cost: 3,
      text: '+160 HP',
      description: 'Increase maximum health by 160',
      lane: 'def',
      tier: 3,
      req: ['def_2'],
      fx: (stats) => {
        stats.hpFlat = (stats.hpFlat || 0) + 160;
      }
    },
    {
      id: 'def_4',
      name: '+200 HP + 10% Damage Reduction',
      cost: 4,
      text: '+200 HP + 10% Damage Reduction',
      description: 'Increase maximum health by 200 and reduce damage taken by 10%',
      lane: 'def',
      tier: 4,
      req: ['def_3'],
      fx: (stats) => {
        stats.hpFlat = (stats.hpFlat || 0) + 200;
        stats.damageReduction = (stats.damageReduction || 0) + 0.10;
      }
    },
    {
      id: 'def_5',
      name: 'Guardian',
      cost: 5,
      text: 'Guardian: Nearby allies take 20% less damage',
      description: 'Protect nearby allies with a defensive aura',
      lane: 'def',
      tier: 5,
      req: ['def_4'],
      fx: (stats) => {
        stats.guardian = true;
      }
    },
    {
      id: 'def_ultimate',
      name: 'FORTRESS',
      cost: 8,
      text: 'FORTRESS: Team immunity when at low HP',
      description: 'When health is low, grant immunity to your entire team',
      lane: 'def',
      tier: 6,
      ultimate: true,
      req: ['def_5'],
      fx: (stats) => {
        stats.fortress = true;
      }
    }
  ],

  // Recovery Lane: 5 nodes focused on healing and sustain
  recovery: [
    {
      id: 'rec_1',
      name: '+6% Lifesteal',
      cost: 1,
      text: '+6% Lifesteal',
      description: 'Heal for 6% of damage dealt',
      lane: 'recovery',
      tier: 1,
      req: null,
      fx: (stats) => {
        stats.ls = (stats.ls || 0) + 0.06;
      }
    },
    {
      id: 'rec_2',
      name: '+10% Lifesteal',
      cost: 2,
      text: '+10% Lifesteal',
      description: 'Heal for 10% of damage dealt',
      lane: 'recovery',
      tier: 2,
      req: ['rec_1'],
      fx: (stats) => {
        stats.ls = (stats.ls || 0) + 0.10;
      }
    },
    {
      id: 'rec_3',
      name: '+15% Lifesteal + HP Regen',
      cost: 3,
      text: '+15% Lifesteal + HP Regen',
      description: 'Heal for 15% of damage dealt and gain passive HP regeneration',
      lane: 'recovery',
      tier: 3,
      req: ['rec_2'],
      fx: (stats) => {
        stats.ls = (stats.ls || 0) + 0.15;
        stats.regen = (stats.regen || 0) + 2;
      }
    },
    {
      id: 'rec_4',
      name: 'Vampiric',
      cost: 4,
      text: 'Vampiric: Killing blows fully heal',
      description: 'Restore all health when defeating an enemy',
      lane: 'recovery',
      tier: 4,
      req: ['rec_3'],
      fx: (stats) => {
        stats.vampiric = true;
      }
    },
    {
      id: 'rec_ultimate',
      name: 'PHOENIX',
      cost: 7,
      text: 'PHOENIX: Auto-revive on death (once per stage)',
      description: 'Automatically revive with full health once per stage',
      lane: 'recovery',
      tier: 5,
      ultimate: true,
      req: ['rec_4'],
      fx: (stats) => {
        stats.phoenix = true;
      }
    }
  ],

  // Cooldown Lane: 5 nodes focused on ability usage
  cooldown: [
    {
      id: 'cd_1',
      name: '-8% Skill CD',
      cost: 1,
      text: '-8% Skill CD',
      description: 'Reduce skill cooldowns by 8%',
      lane: 'cooldown',
      tier: 1,
      req: null,
      fx: (stats) => {
        stats.haste = (stats.haste || 0) + 8;
      }
    },
    {
      id: 'cd_2',
      name: '-12% Skill CD',
      cost: 2,
      text: '-12% Skill CD',
      description: 'Reduce skill cooldowns by 12%',
      lane: 'cooldown',
      tier: 2,
      req: ['cd_1'],
      fx: (stats) => {
        stats.haste = (stats.haste || 0) + 12;
      }
    },
    {
      id: 'cd_3',
      name: '-15% Skill CD + Movement Speed',
      cost: 3,
      text: '-15% Skill CD + Movement Speed',
      description: 'Reduce skill cooldowns by 15% and increase movement speed by 20%',
      lane: 'cooldown',
      tier: 3,
      req: ['cd_2'],
      fx: (stats) => {
        stats.haste = (stats.haste || 0) + 15;
        stats.moveSpeed = (stats.moveSpeed || 0) + 0.20;
      }
    },
    {
      id: 'cd_4',
      name: 'Cascade',
      cost: 4,
      text: 'Cascade: Skills have 25% chance to reset CD',
      description: 'Each skill use has a 25% chance to instantly reset its cooldown',
      lane: 'cooldown',
      tier: 4,
      req: ['cd_3'],
      fx: (stats) => {
        stats.cascade = true;
      }
    },
    {
      id: 'cd_ultimate',
      name: 'TIME MASTER',
      cost: 7,
      text: 'TIME MASTER: All abilities cost 50% less CD',
      description: 'Halve all skill cooldowns for rapid ability usage',
      lane: 'cooldown',
      tier: 5,
      ultimate: true,
      req: ['cd_4'],
      fx: (stats) => {
        stats.timeMaster = true;
      }
    }
  ],

  // Luck Lane: 6 nodes focused on rewards and drops
  luck: [
    {
      id: 'luck_1',
      name: '+8 Luck',
      cost: 1,
      text: '+8 Luck',
      description: 'Increase luck stat by 8',
      lane: 'luck',
      tier: 1,
      req: null,
      fx: (stats) => {
        stats.luck = (stats.luck || 0) + 8;
      }
    },
    {
      id: 'luck_2',
      name: '+15 Luck',
      cost: 2,
      text: '+15 Luck',
      description: 'Increase luck stat by 15',
      lane: 'luck',
      tier: 2,
      req: ['luck_1'],
      fx: (stats) => {
        stats.luck = (stats.luck || 0) + 15;
      }
    },
    {
      id: 'luck_3',
      name: '+25 Luck + Gold Find',
      cost: 3,
      text: '+25 Luck + Gold Find',
      description: 'Increase luck stat by 25 and gain 30% bonus gold drops',
      lane: 'luck',
      tier: 3,
      req: ['luck_2'],
      fx: (stats) => {
        stats.luck = (stats.luck || 0) + 25;
        stats.goldFind = (stats.goldFind || 0) + 0.30;
      }
    },
    {
      id: 'luck_4',
      name: 'Fortune',
      cost: 4,
      text: 'Fortune: 10% chance for double loot',
      description: 'Items have a 10% chance to drop twice',
      lane: 'luck',
      tier: 4,
      req: ['luck_3'],
      fx: (stats) => {
        stats.fortune = true;
      }
    },
    {
      id: 'luck_5',
      name: 'Jackpot',
      cost: 5,
      text: 'Jackpot: Rare items can upgrade quality',
      description: 'Rare drops have a chance to upgrade to higher rarity',
      lane: 'luck',
      tier: 5,
      req: ['luck_4'],
      fx: (stats) => {
        stats.jackpot = true;
      }
    },
    {
      id: 'luck_ultimate',
      name: 'GOLDEN TOUCH',
      cost: 8,
      text: 'GOLDEN TOUCH: Everything drops gold, permanent luck aura',
      description: 'All enemies drop gold and gain a permanent luck multiplier',
      lane: 'luck',
      tier: 6,
      ultimate: true,
      req: ['luck_5'],
      fx: (stats) => {
        stats.goldenTouch = true;
      }
    }
  ],

  // Supernatural Lane: 5 S-Rank nodes for spirit/ability mastery
  supernatural: [
    {
      id: 'super_1',
      name: 'Spirit Bond',
      cost: 10,
      text: 'Spirit Bond: Equipped spirits gain +20% effectiveness',
      description: 'All equipped spirit companions become 20% more powerful',
      lane: 'supernatural',
      tier: 1,
      srank: true,
      req: null,
      fx: (stats) => {
        stats.spiritEffectiveness = (stats.spiritEffectiveness || 0) + 0.20;
      }
    },
    {
      id: 'super_2',
      name: 'Essence Mastery',
      cost: 15,
      text: 'Essence Mastery: Gain 2x essence from all sources',
      description: 'Double all essence gains from combat, drops, and rewards',
      lane: 'supernatural',
      tier: 2,
      srank: true,
      req: ['super_1'],
      fx: (stats) => {
        stats.essenceMultiplier = (stats.essenceMultiplier || 1) * 2;
      }
    },
    {
      id: 'super_3',
      name: 'Ability Fusion',
      cost: 20,
      text: 'Ability Fusion: Supernatural abilities can combine effects',
      description: 'Cast two abilities simultaneously for combined power',
      lane: 'supernatural',
      tier: 3,
      srank: true,
      req: ['super_2'],
      fx: (stats) => {
        stats.abilityFusion = true;
      }
    },
    {
      id: 'super_4',
      name: 'Transcendence',
      cost: 25,
      text: 'Transcendence: -50% cooldown on all supernatural abilities',
      description: 'Halve the cooldown of Divine Barrier, Dash Nova, and all supernatural powers',
      lane: 'supernatural',
      tier: 4,
      srank: true,
      req: ['super_3'],
      fx: (stats) => {
        stats.supernaturalCDReduction = (stats.supernaturalCDReduction || 0) + 0.50;
      }
    },
    {
      id: 'super_ultimate',
      name: 'ETHEREAL ASCENSION',
      cost: 50,
      text: 'ETHEREAL ASCENSION: Immunity + all spirits attack simultaneously',
      description: 'Become immune to damage for 10s and all spirits fire coordinated attacks',
      lane: 'supernatural',
      tier: 5,
      ultimate: true,
      srank: true,
      req: ['super_4'],
      fx: (stats) => {
        stats.etherealAscension = true;
      }
    }
  ],

  // Cross-System Ultimate Talents (Require multiple lane completion)
  ultimates: [
    {
      id: 'ultimate_omega',
      name: 'OMEGA FORCE',
      cost: 100,
      text: 'OMEGA FORCE: +100% ATK, +100% DEF, immunity to CC',
      description: 'Transcend mortal limits with doubled offense and defense plus crowd control immunity',
      lane: 'ultimates',
      tier: 7,
      ultimate: true,
      srank: true,
      crossSystem: true,
      req: ['atk_ultimate', 'def_ultimate'],
      fx: (stats) => {
        stats.atkMul = (stats.atkMul || 0) + 1.00;
        stats.defenseBonus = (stats.defenseBonus || 0) + 1.00;
        stats.ccImmune = true;
      }
    },
    {
      id: 'ultimate_infinity',
      name: 'INFINITY STRIKE',
      cost: 120,
      text: 'INFINITY STRIKE: Deal 9999 true damage, costs all resources',
      description: 'Unleash ultimate power for guaranteed kill but consumes all rage, energy, and cooldowns',
      lane: 'ultimates',
      tier: 7,
      ultimate: true,
      srank: true,
      crossSystem: true,
      req: ['atk_ultimate', 'super_ultimate'],
      fx: (stats) => {
        stats.infinityStrike = true;
      }
    },
    {
      id: 'ultimate_eternal',
      name: 'ETERNAL GUARDIAN',
      cost: 150,
      text: 'ETERNAL GUARDIAN: Revive entire party at full HP, create protective dome',
      description: 'Resurrect all fallen allies and shield your team from all damage for 8 seconds',
      lane: 'ultimates',
      tier: 7,
      ultimate: true,
      srank: true,
      crossSystem: true,
      req: ['def_ultimate', 'super_ultimate'],
      fx: (stats) => {
        stats.eternalGuardian = true;
      }
    },
    {
      id: 'ultimate_divine',
      name: 'DIVINE APOTHEOSIS',
      cost: 200,
      text: 'DIVINE APOTHEOSIS: Become a god for 30s - unlimited power',
      description: 'Ascend to godhood: infinite damage, invincibility, instant cooldowns, all abilities active',
      lane: 'ultimates',
      tier: 8,
      ultimate: true,
      srank: true,
      crossSystem: true,
      requiresAll: true,
      req: ['atk_ultimate', 'def_ultimate', 'super_ultimate'],
      fx: (stats) => {
        stats.divineApotheosis = true;
      }
    }
  ]
};

/**
 * Get all talents as a flat array
 */
export function getAllTalents() {
  const talents = [];
  for (const lane of Object.values(TALENT_LANES)) {
    talents.push(...lane);
  }
  return talents;
}

/**
 * Get talent by ID
 */
export function getTalent(talentId) {
  for (const lane of Object.values(TALENT_LANES)) {
    const talent = lane.find(t => t.id === talentId);
    if (talent) return talent;
  }
  return null;
}

/**
 * Get talents by lane
 */
export function getTalentsByLane(laneName) {
  return TALENT_LANES[laneName] || [];
}

/**
 * Get lane names
 */
export function getLaneNames() {
  return Object.keys(TALENT_LANES);
}

/**
 * Talent statistics
 */
export const TALENT_STATS = {
  totalTalents: 40, // 31 + 5 supernatural + 4 ultimates
  totalLanes: 8, // 6 original + supernatural + ultimates
  ultimateTalents: 11, // 6 lane ultimates + 1 supernatural ultimate + 4 cross-system
  maxAPCost: 661, // Total AP needed for all talents
  lanes: {
    atk: { count: 6, maxCost: 23 },
    def: { count: 6, maxCost: 23 },
    recovery: { count: 5, maxCost: 17 },
    cooldown: { count: 5, maxCost: 17 },
    luck: { count: 6, maxCost: 23 },
    supernatural: { count: 5, maxCost: 120, srank: true }, // All S-rank!
    ultimates: { count: 4, maxCost: 570, crossSystem: true } // God-tier!
  }
};

export default {
  TALENT_LANES,
  getAllTalents,
  getTalent,
  getTalentsByLane,
  getLaneNames,
  TALENT_STATS
};

