/**
 * SKILL DEFINITIONS DATABASE
 * All 60+ skills for A1, Unique, and Missy
 * Extracted from mixed-city-with-ultra-interiors.html
 * 
 * @version 1.0.0
 */

const SKILL_DATABASE = [
  // === A1 (WARRIOR) - 30 skills total ===
  { id: 'A1_S1', name: 'Crimson Slash', characterId: 'A1', slot: 1, damage: 150, cooldown: 2.5, unlock: 1, element: 'PHYSICAL', description: '3-hit crimson X-wave slash', icon: '⚔️', tier: 'starter' },
  { id: 'A1_S2', name: 'Shadow Clone', characterId: 'A1', slot: 2, damage: 0, cooldown: 15, unlock: 20, element: 'SUMMON', description: 'Summon combat clone ally', icon: '👥', tier: 'common' },
  { id: 'A1_S3', name: 'Power Wave', characterId: 'A1', slot: 3, damage: 250, cooldown: 4, unlock: 1, element: 'PHYSICAL', description: '4-hit power wave combo', icon: '💨', tier: 'starter' },
  { id: 'A1_S4', name: 'Phantom Strike', characterId: 'A1', slot: 4, damage: 320, cooldown: 20, unlock: 30, element: 'SHADOW', description: 'Teleport & execute combo (6 slashes)', icon: '🌙', tier: 'rare' },
  { id: 'A1_S5', name: 'Crimson Cyclone', characterId: 'A1', slot: 5, damage: 300, cooldown: 24, unlock: 40, element: 'PHYSICAL', description: '3-blink aerial spin attack', icon: '🌪️', tier: 'rare' },
  { id: 'A1_X1', name: 'Rift Cutter', characterId: 'A1', slot: 'X', damage: 380, cooldown: 28, unlock: 50, element: 'ARCANE', description: 'Twin dimension rifts (chargeable)', icon: '🌌', tier: 'epic', chargeable: true },
  { id: 'A1_BLADE_DANCE', name: 'Blade Dance', characterId: 'A1', slot: null, damage: 600, cooldown: 6, unlock: 10, element: 'PHYSICAL', description: '5-hit spinning slash attack', icon: '🗡️', tier: 'uncommon' },
  { id: 'A1_CRIMSON_FURY', name: 'Crimson Fury', characterId: 'A1', slot: null, damage: 850, cooldown: 8, unlock: 20, element: 'FIRE', description: 'Rapid burning slashes + explosion', icon: '🔥', tier: 'rare', burn: true },
  { id: 'A1_SHADOW_STEP', name: 'Shadow Step', characterId: 'A1', slot: null, damage: 0, cooldown: 4, unlock: 5, element: 'SHADOW', description: 'Dash with invulnerability frames', icon: '👻', tier: 'common' },
  { id: 'A1_VOID_REAPER', name: 'Void Reaper', characterId: 'A1', slot: null, damage: 1800, cooldown: 16, unlock: 35, element: 'SHADOW', description: 'Death scythe AoE with lifesteal', icon: '💀', tier: 'epic', lifesteal: true },
  { id: 'A1_DIMENSION_BREAKER', name: 'Dimension Breaker', characterId: 'A1', slot: null, damage: 3200, cooldown: 25, unlock: 45, element: 'ARCANE', description: 'Reality-shattering rift explosion', icon: '🌠', tier: 'legendary', stun: true },
  { id: 'A1_BERSERKER_RAGE', name: 'Berserker Rage', characterId: 'A1', slot: null, damage: 1200, cooldown: 10, unlock: 15, element: 'FIRE', description: 'Unleash berserker fury with flaming slashes', icon: '💢', tier: 'rare', burn: true },
  { id: 'A1_WHIRLWIND', name: 'Whirlwind', characterId: 'A1', slot: null, damage: 900, cooldown: 8, unlock: 12, element: 'PHYSICAL', description: 'Spin attack hitting all nearby enemies', icon: '🌀', tier: 'uncommon' },
  { id: 'A1_EARTH_SHAKER', name: 'Earth Shaker', characterId: 'A1', slot: null, damage: 1500, cooldown: 15, unlock: 25, element: 'PHYSICAL', description: 'Slam ground causing shockwave', icon: '🌍', tier: 'epic', stun: true },
  { id: 'A1_BLOOD_STRIKE', name: 'Blood Strike', characterId: 'A1', slot: null, damage: 1100, cooldown: 12, unlock: 22, element: 'SHADOW', description: 'Drain enemy life force', icon: '🩸', tier: 'rare', lifesteal: true },
  { id: 'A1_DUAL_EXECUTION', name: 'Dual Execution', characterId: 'A1', slot: null, damage: 1600, cooldown: 16, unlock: 28, element: 'PHYSICAL', description: 'Twin-blade execution strike', icon: '⚔️', tier: 'epic', crit: true },
  { id: 'A1_THUNDER_STRIKE', name: 'Thunder Strike', characterId: 'A1', slot: null, damage: 1300, cooldown: 13, unlock: 26, element: 'LIGHTNING', description: 'Lightning-charged sword strike', icon: '⚡', tier: 'rare', chain: true },
  { id: 'A1_INFERNO_BLADE', name: 'Inferno Blade', characterId: 'A1', slot: null, damage: 1700, cooldown: 18, unlock: 32, element: 'FIRE', description: 'Summon flaming sword from sky', icon: '🔥', tier: 'epic', burn: true },
  { id: 'A1_SPECTRAL_SLASH', name: 'Spectral Slash', characterId: 'A1', slot: null, damage: 1400, cooldown: 14, unlock: 29, element: 'SHADOW', description: 'Phase through enemies dealing damage', icon: '👻', tier: 'rare', pierce: true },
  { id: 'A1_DRAGON_STRIKE', name: 'Dragon Strike', characterId: 'A1', slot: null, damage: 2200, cooldown: 20, unlock: 36, element: 'FIRE', description: 'Channel dragon spirit into blade', icon: '🐉', tier: 'legendary', burn: true },
  { id: 'A1_VOID_SLASH', name: 'Void Slash', characterId: 'A1', slot: null, damage: 1900, cooldown: 17, unlock: 34, element: 'ARCANE', description: 'Cut through reality itself', icon: '🌌', tier: 'epic', silence: true },
  { id: 'A1_STEEL_TEMPEST', name: 'Steel Tempest', characterId: 'A1', slot: null, damage: 1250, cooldown: 11, unlock: 21, element: 'PHYSICAL', description: 'Rapid multi-hit sword flurry', icon: '⚔️', tier: 'rare' },
  { id: 'A1_HELLFIRE_WAVE', name: 'Hellfire Wave', characterId: 'A1', slot: null, damage: 2100, cooldown: 19, unlock: 38, element: 'FIRE', description: 'Wave of hellfire engulfs enemies', icon: '🔥', tier: 'legendary', burn: true },
  { id: 'A1_FROZEN_BLADE', name: 'Frozen Blade', characterId: 'A1', slot: null, damage: 1350, cooldown: 13, unlock: 27, element: 'ICE', description: 'Ice-infused blade attack', icon: '❄️', tier: 'rare', freeze: true },
  { id: 'A1_PHANTOM_DANCE', name: 'Phantom Dance', characterId: 'A1', slot: null, damage: 1800, cooldown: 16, unlock: 31, element: 'SHADOW', description: 'Dance of death with shadow clones', icon: '💃', tier: 'epic' },
  { id: 'A1_TITAN_SLASH', name: 'Titan Slash', characterId: 'A1', slot: null, damage: 2400, cooldown: 22, unlock: 40, element: 'PHYSICAL', description: 'Massive overhead cleave', icon: '⚔️', tier: 'legendary' },
  { id: 'A1_CHAOS_STRIKE', name: 'Chaos Strike', characterId: 'A1', slot: null, damage: 2600, cooldown: 24, unlock: 42, element: 'ARCANE', description: 'Chaotic energy erupts from blade', icon: '🌠', tier: 'legendary', stun: true },
  { id: 'A1_NOVA_SLASH', name: 'Nova Slash', characterId: 'A1', slot: null, damage: 2000, cooldown: 18, unlock: 35, element: 'LIGHT', description: 'Explosive light-wave slash', icon: '💫', tier: 'epic' },
  { id: 'A1_METEOR_BLADE', name: 'Meteor Blade', characterId: 'A1', slot: null, damage: 2800, cooldown: 26, unlock: 44, element: 'FIRE', description: 'Summon meteor onto blade', icon: '☄️', tier: 'legendary', burn: true },
  { id: 'A1_OMEGA_STRIKE', name: 'Omega Strike', characterId: 'A1', slot: null, damage: 3500, cooldown: 30, unlock: 50, element: 'ARCANE', description: 'Ultimate finishing move', icon: '💥', tier: 'legendary', crit: true, pierce: true },

  // === UNIQUE (CYBORG) - 30 skills total ===
  { id: 'UNIQUE_S1', name: 'Plasma Blast', characterId: 'UNIQUE', slot: 1, damage: 120, cooldown: 2, unlock: 1, element: 'PLASMA', description: '3-hit plasma bolt barrage', icon: '⚡', tier: 'starter' },
  { id: 'UNIQUE_S2', name: 'Combat Drone', characterId: 'UNIQUE', slot: 2, damage: 0, cooldown: 15, unlock: 20, element: 'SUMMON', description: 'Summon combat drone ally', icon: '🤖', tier: 'common' },
  { id: 'UNIQUE_S3', name: 'Power Beam', characterId: 'UNIQUE', slot: 3, damage: 400, cooldown: 8, unlock: 1, element: 'ENERGY', description: 'Channeled energy beam', icon: '💥', tier: 'starter' },
  { id: 'UNIQUE_S4', name: 'Cryo Rail', characterId: 'UNIQUE', slot: 4, damage: 180, cooldown: 20, unlock: 30, element: 'ICE', description: 'Ice rail beam + 4 cryo rounds', icon: '❄️', tier: 'rare', freeze: true },
  { id: 'UNIQUE_S5', name: 'Ion Drill', characterId: 'UNIQUE', slot: 5, damage: 220, cooldown: 24, unlock: 40, element: 'LIGHTNING', description: 'Steerable ion drill beam', icon: '🌀', tier: 'rare' },
  { id: 'UNIQUE_X1', name: 'Hyper Beam', characterId: 'UNIQUE', slot: 'X', damage: 300, cooldown: 28, unlock: 50, element: 'LIGHTNING', description: 'Massive channeled beam (chargeable)', icon: '🌊', tier: 'epic', chargeable: true, freeze: true },
  { id: 'UNIQUE_ICE_BEAM', name: 'Freeze Ray', characterId: 'UNIQUE', slot: null, damage: 500, cooldown: 7, unlock: 10, element: 'ICE', description: 'Freeze enemies in beam path', icon: '🧊', tier: 'uncommon', freeze: true },
  { id: 'UNIQUE_LIGHTNING_BARRAGE', name: 'Thunder Volley', characterId: 'UNIQUE', slot: null, damage: 400, cooldown: 8, unlock: 12, element: 'LIGHTNING', description: '10-hit lightning chain bolts', icon: '⚡', tier: 'uncommon', chain: true },
  { id: 'UNIQUE_EMP_BLAST', name: 'EMP Blast', characterId: 'UNIQUE', slot: null, damage: 800, cooldown: 12, unlock: 22, element: 'LIGHTNING', description: 'AoE electromagnetic pulse', icon: '💥', tier: 'rare', silence: true, stun: true },
  { id: 'UNIQUE_PLASMA_STORM', name: 'Meteor Strike', characterId: 'UNIQUE', slot: null, damage: 280, cooldown: 18, unlock: 30, element: 'FIRE', description: '12 plasma meteors from orbit', icon: '☄️', tier: 'epic', burn: true },
  { id: 'UNIQUE_ABSOLUTE_ZERO_NOVA', name: 'Absolute Zero', characterId: 'UNIQUE', slot: null, damage: 2400, cooldown: 20, unlock: 38, element: 'ICE', description: 'Massive AoE freeze + shatter', icon: '❄️', tier: 'legendary', freeze: true },
  { id: 'UNIQUE_LASER_BARRAGE', name: 'Laser Barrage', characterId: 'UNIQUE', slot: null, damage: 850, cooldown: 9, unlock: 14, element: 'ENERGY', description: '20-hit laser beam barrage', icon: '💥', tier: 'uncommon' },
  { id: 'UNIQUE_QUANTUM_SHIFT', name: 'Quantum Shift', characterId: 'UNIQUE', slot: null, damage: 0, cooldown: 8, unlock: 16, element: 'ARCANE', description: 'Teleport with damage immunity', icon: '🌀', tier: 'rare' },
  { id: 'UNIQUE_NANO_SWARM', name: 'Nano Swarm', characterId: 'UNIQUE', slot: null, damage: 1100, cooldown: 12, unlock: 20, element: 'PLASMA', description: 'Deploy nano-bot swarm', icon: '🦠', tier: 'rare' },
  { id: 'UNIQUE_GRAVITON_BEAM', name: 'Graviton Beam', characterId: 'UNIQUE', slot: null, damage: 1400, cooldown: 15, unlock: 25, element: 'ARCANE', description: 'Gravity-crushing beam', icon: '🌌', tier: 'epic' },
  { id: 'UNIQUE_PULSE_CANNON', name: 'Pulse Cannon', characterId: 'UNIQUE', slot: null, damage: 1600, cooldown: 16, unlock: 28, element: 'ENERGY', description: 'Charged pulse explosion', icon: '💥', tier: 'epic' },
  { id: 'UNIQUE_TESLA_COIL', name: 'Tesla Coil', characterId: 'UNIQUE', slot: null, damage: 1200, cooldown: 13, unlock: 23, element: 'LIGHTNING', description: 'Electric field damages all nearby', icon: '⚡', tier: 'rare', chain: true },
  { id: 'UNIQUE_CRYO_MISSILE', name: 'Cryo Missile', characterId: 'UNIQUE', slot: null, damage: 1500, cooldown: 14, unlock: 26, element: 'ICE', description: 'Freezing missile barrage', icon: '❄️', tier: 'rare', freeze: true },
  { id: 'UNIQUE_PHOTON_LANCE', name: 'Photon Lance', characterId: 'UNIQUE', slot: null, damage: 1800, cooldown: 17, unlock: 32, element: 'LIGHT', description: 'Pierce all enemies with light beam', icon: '💫', tier: 'epic', pierce: true },
  { id: 'UNIQUE_DARK_MATTER', name: 'Dark Matter Bomb', characterId: 'UNIQUE', slot: null, damage: 2100, cooldown: 19, unlock: 36, element: 'ARCANE', description: 'Summon dark matter explosion', icon: '🌌', tier: 'legendary' },
  { id: 'UNIQUE_FUSION_CORE', name: 'Fusion Core', characterId: 'UNIQUE', slot: null, damage: 2400, cooldown: 21, unlock: 39, element: 'FIRE', description: 'Mini nuclear explosion', icon: '☢️', tier: 'legendary', burn: true },
  { id: 'UNIQUE_ORBITAL_STRIKE', name: 'Orbital Strike', characterId: 'UNIQUE', slot: null, damage: 2200, cooldown: 20, unlock: 37, element: 'ENERGY', description: 'Call down satellite beam', icon: '🛰️', tier: 'legendary' },
  { id: 'UNIQUE_ANTIMATTER', name: 'Antimatter Wave', characterId: 'UNIQUE', slot: null, damage: 2600, cooldown: 23, unlock: 41, element: 'ARCANE', description: 'Annihilate with antimatter', icon: '💥', tier: 'legendary', silence: true },
  { id: 'UNIQUE_CYBER_OVERDRIVE', name: 'Cyber Overdrive', characterId: 'UNIQUE', slot: null, damage: 1900, cooldown: 18, unlock: 34, element: 'LIGHTNING', description: 'Overclock all systems', icon: '⚡', tier: 'epic', chain: true },
  { id: 'UNIQUE_VOID_CANNON', name: 'Void Cannon', characterId: 'UNIQUE', slot: null, damage: 2300, cooldown: 20, unlock: 38, element: 'SHADOW', description: 'Fire void energy projectile', icon: '🌑', tier: 'legendary' },
  { id: 'UNIQUE_PLASMA_NOVA', name: 'Plasma Nova', characterId: 'UNIQUE', slot: null, damage: 2500, cooldown: 22, unlock: 40, element: 'PLASMA', description: 'Exploding plasma sphere', icon: '☀️', tier: 'legendary' },
  { id: 'UNIQUE_SINGULARITY', name: 'Singularity', characterId: 'UNIQUE', slot: null, damage: 2800, cooldown: 25, unlock: 43, element: 'ARCANE', description: 'Create black hole', icon: '🕳️', tier: 'legendary', stun: true },
  { id: 'UNIQUE_PHASE_BEAM', name: 'Phase Beam', characterId: 'UNIQUE', slot: null, damage: 2100, cooldown: 19, unlock: 35, element: 'ARCANE', description: 'Beam phases through obstacles', icon: '🌀', tier: 'epic', pierce: true },
  { id: 'UNIQUE_ION_STORM', name: 'Ion Storm', characterId: 'UNIQUE', slot: null, damage: 2700, cooldown: 24, unlock: 42, element: 'LIGHTNING', description: 'Massive ion storm', icon: '⛈️', tier: 'legendary', chain: true },
  { id: 'UNIQUE_OMEGA_BEAM', name: 'Omega Beam', characterId: 'UNIQUE', slot: null, damage: 3600, cooldown: 30, unlock: 50, element: 'ENERGY', description: 'Ultimate mega-beam', icon: '💥', tier: 'legendary', crit: true },

  // === MISSY (CAT ANGEL) - 30 skills total ===
  { id: 'MISSY_S1', name: 'Crescent Slash', characterId: 'MISSY', slot: 1, damage: 130, cooldown: 2.5, unlock: 1, element: 'PHYSICAL', description: '3-hit crescent wave attack', icon: '🌙', tier: 'starter' },
  { id: 'MISSY_S2', name: 'Spirit Pet', characterId: 'MISSY', slot: 2, damage: 0, cooldown: 15, unlock: 20, element: 'SUMMON', description: 'Summon loyal pet companion', icon: '🐾', tier: 'common' },
  { id: 'MISSY_S3', name: 'Rapid Fire', characterId: 'MISSY', slot: 3, damage: 200, cooldown: 4, unlock: 1, element: 'PHYSICAL', description: '4-hit rapid pistol shots', icon: '🔫', tier: 'starter' },
  { id: 'MISSY_S4', name: 'Starlight Rail', characterId: 'MISSY', slot: 4, damage: 180, cooldown: 6, unlock: 30, element: 'LIGHT', description: 'Rail beam + 8 boomerang comets', icon: '💫', tier: 'rare', magnet: true },
  { id: 'MISSY_S5', name: 'Storm Vortex', characterId: 'MISSY', slot: 5, damage: 720, cooldown: 8, unlock: 40, element: 'LIGHT', description: 'Spinning cyclone + shotgun volley', icon: '🌪️', tier: 'rare', magnet: true },
  { id: 'MISSY_X1', name: 'Fortune Cannon', characterId: 'MISSY', slot: 'X', damage: 2800, cooldown: 20, unlock: 50, element: 'LIGHT', description: 'Golden coin mega-beam (chargeable)', icon: '💰', tier: 'epic', chargeable: true, magnet: true },
  { id: 'MISSY_BLADE_STORM', name: 'Blade Tempest', characterId: 'MISSY', slot: null, damage: 550, cooldown: 7, unlock: 11, element: 'PHYSICAL', description: 'Spinning blade + 16 pistol shots', icon: '🗡️', tier: 'uncommon' },
  { id: 'MISSY_LUCKY_STRIKE', name: 'Lucky Strike', characterId: 'MISSY', slot: null, damage: 600, cooldown: 5, unlock: 5, element: 'LIGHT', description: 'High chance double damage + coin', icon: '🍀', tier: 'common', luck: true },
  { id: 'MISSY_JACKPOT_RAIN', name: 'Treasure Rain', characterId: 'MISSY', slot: null, damage: 150, cooldown: 12, unlock: 18, element: 'LIGHT', description: '20 golden exploding coins', icon: '💸', tier: 'rare', luck: true },
  { id: 'MISSY_DEADEYE', name: 'Deadeye Shot', characterId: 'MISSY', slot: null, damage: 2000, cooldown: 14, unlock: 24, element: 'PHYSICAL', description: 'Perfect precision shot (crit)', icon: '🎯', tier: 'rare', crit: true, pierce: true },
  { id: 'MISSY_ANGEL_WINGS', name: 'Angel Wings', characterId: 'MISSY', slot: null, damage: 0, cooldown: 10, unlock: 15, element: 'LIGHT', description: 'Summon angel wings for flight', icon: '🪽', tier: 'rare' },
  { id: 'MISSY_HOLY_NOVA', name: 'Holy Nova', characterId: 'MISSY', slot: null, damage: 950, cooldown: 9, unlock: 13, element: 'LIGHT', description: 'Burst of holy light', icon: '✨', tier: 'uncommon' },
  { id: 'MISSY_CAT_SCRATCH', name: 'Cat Scratch Fury', characterId: 'MISSY', slot: null, damage: 1100, cooldown: 11, unlock: 17, element: 'PHYSICAL', description: 'Rapid claw attacks', icon: '🐾', tier: 'rare' },
  { id: 'MISSY_DIVINE_SHIELD', name: 'Divine Shield', characterId: 'MISSY', slot: null, damage: 0, cooldown: 12, unlock: 19, element: 'LIGHT', description: 'Protective light barrier', icon: '🛡️', tier: 'rare' },
  { id: 'MISSY_GOLDEN_RAIN', name: 'Golden Rain', characterId: 'MISSY', slot: null, damage: 1300, cooldown: 14, unlock: 23, element: 'LIGHT', description: 'Rain of golden arrows', icon: '🏹', tier: 'rare', luck: true },
  { id: 'MISSY_ANGEL_BEAM', name: 'Angel Beam', characterId: 'MISSY', slot: null, damage: 1500, cooldown: 15, unlock: 27, element: 'LIGHT', description: 'Channeled holy beam', icon: '💫', tier: 'epic' },
  { id: 'MISSY_NINE_LIVES', name: 'Nine Lives', characterId: 'MISSY', slot: null, damage: 0, cooldown: 20, unlock: 30, element: 'LIGHT', description: 'Revive with full HP once', icon: '😸', tier: 'epic' },
  { id: 'MISSY_MOONLIGHT', name: 'Moonlight Slash', characterId: 'MISSY', slot: null, damage: 1600, cooldown: 16, unlock: 29, element: 'LIGHT', description: 'Crescent moon projectile', icon: '🌙', tier: 'epic' },
  { id: 'MISSY_STARDUST', name: 'Stardust Storm', characterId: 'MISSY', slot: null, damage: 1400, cooldown: 14, unlock: 25, element: 'LIGHT', description: 'Swirling stardust attack', icon: '⭐', tier: 'rare' },
  { id: 'MISSY_DUAL_SHOT', name: 'Dual Shot', characterId: 'MISSY', slot: null, damage: 1200, cooldown: 12, unlock: 21, element: 'PHYSICAL', description: 'Fire both weapons at once', icon: '🔫', tier: 'rare' },
  { id: 'MISSY_HEAVEN_STRIKE', name: 'Heaven Strike', characterId: 'MISSY', slot: null, damage: 2000, cooldown: 18, unlock: 33, element: 'LIGHT', description: 'Summon heavenly lightning', icon: '⚡', tier: 'epic' },
  { id: 'MISSY_LUCKY_SEVEN', name: 'Lucky Seven', characterId: 'MISSY', slot: null, damage: 1700, cooldown: 16, unlock: 31, element: 'LIGHT', description: '7 lucky shots guaranteed crits', icon: '🎰', tier: 'epic', luck: true, crit: true },
  { id: 'MISSY_ANGEL_JUDGMENT', name: 'Angel Judgment', characterId: 'MISSY', slot: null, damage: 2200, cooldown: 20, unlock: 37, element: 'LIGHT', description: 'Divine judgment from above', icon: '⚖️', tier: 'legendary' },
  { id: 'MISSY_CAT_POUNCE', name: 'Cat Pounce', characterId: 'MISSY', slot: null, damage: 1800, cooldown: 17, unlock: 32, element: 'PHYSICAL', description: 'Leap and strike from above', icon: '🐱', tier: 'epic' },
  { id: 'MISSY_HOLY_ARROW', name: 'Holy Arrow Barrage', characterId: 'MISSY', slot: null, damage: 1900, cooldown: 18, unlock: 34, element: 'LIGHT', description: '30 holy arrows rain down', icon: '🏹', tier: 'epic', pierce: true },
  { id: 'MISSY_CELESTIAL_BEAM', name: 'Celestial Beam', characterId: 'MISSY', slot: null, damage: 2400, cooldown: 21, unlock: 39, element: 'LIGHT', description: 'Beam from heaven', icon: '☀️', tier: 'legendary' },
  { id: 'MISSY_JACKPOT_777', name: 'Jackpot 777', characterId: 'MISSY', slot: null, damage: 2600, cooldown: 23, unlock: 41, element: 'LIGHT', description: 'Triple 7 mega win', icon: '🎰', tier: 'legendary', luck: true, crit: true },
  { id: 'MISSY_SERAPH_WINGS', name: 'Seraph Wings', characterId: 'MISSY', slot: null, damage: 2800, cooldown: 25, unlock: 43, element: 'LIGHT', description: 'Transform into seraph', icon: '👼', tier: 'legendary' },
  { id: 'MISSY_DIVINE_WRATH', name: 'Divine Wrath', characterId: 'MISSY', slot: null, damage: 3700, cooldown: 30, unlock: 50, element: 'LIGHT', description: 'Ultimate holy power', icon: '✨', tier: 'legendary', crit: true, pierce: true }
];

/**
 * Get skill by ID
 */
function getSkillById(skillId) {
  return SKILL_DATABASE.find(s => s.id === skillId);
}

/**
 * Get skills for a specific character
 */
function getSkillsByCharacter(characterId) {
  return SKILL_DATABASE.filter(s => s.characterId === characterId);
}

/**
 * Get equipped skills (slot 1-5, X) for a character
 */
function getEquippedSkills(characterId) {
  return SKILL_DATABASE.filter(s => 
    s.characterId === characterId && 
    s.slot !== null
  );
}
