/**
 * SPRITE PALETTES
 * Shared color palette definitions for all HD pixel art sprites
 * 
 * @version 1.0.0
 */

// Shared color palettes (hair/fur always black #000000)
const SPRITE_PALETTES = {
  fire: {
    skin: ['#4a3428', '#5c4033', '#6d4c3d'],
    clothes: ['#1a1a1a', '#2a2a2a', '#3a3a3a', '#4a4a4a'],
    weapon: ['#ff0000', '#ff3333', '#ff6666', '#ff9999'],
    eyes: ['#ff0000', '#ff4444'],
    aura: 'rgba(255,80,0,',
    glow: '#ff5500',
    // Cyborg-specific
    armor: ['#2a1a2a', '#3a2a3a', '#4a3a4a'],
    armorAccent: ['#ff3333', '#ff6666', '#ff9999'],
    rifle: ['#1a1a1a', '#2a2a2a'],
    rifleGlow: ['#ff0000', '#ff3333', '#ff6666'],
    // Cat Angel-specific
    suit: ['#2a1a2a', '#3a2a3a', '#4a3a4a', '#5a4a5a'],
    halo: ['#ff6600', '#ff8833', '#ffaa66'],
    wing: ['#ffb3cc', '#ffd9e6', '#fff0f5'],
    chestBadge: ['#ff6600', '#ff8833']
  },
  ice: {
    skin: ['#4a3428', '#5c4033', '#6d4c3d'],
    clothes: ['#0a1a2a', '#1a2a3a', '#2a3a4a', '#3a4a5a'],
    weapon: ['#00ffff', '#33ffff', '#66ffff', '#99ffff'],
    eyes: ['#00ffff', '#44ffff'],
    aura: 'rgba(0,200,255,',
    glow: '#00ccff',
    // Cyborg-specific
    armor: ['#0a1a2a', '#1a2a3a', '#2a3a4a'],
    armorAccent: ['#00ccff', '#33ddff', '#66eeff'],
    rifle: ['#1a1a1a', '#2a2a2a'],
    rifleGlow: ['#00ffff', '#33ffff', '#66ffff'],
    // Cat Angel-specific
    suit: ['#0a1a2a', '#1a2a3a', '#2a3a4a', '#3a4a5a'],
    halo: ['#00ccff', '#33ddff', '#66eeff'],
    wing: ['#b3e6ff', '#d9f2ff', '#f0f9ff'],
    chestBadge: ['#00ccff', '#33ddff']
  },
  shadow: {
    skin: ['#4a3428', '#5c4033', '#6d4c3d'],
    clothes: ['#1a0a2a', '#2a1a3a', '#3a2a4a', '#4a3a5a'],
    weapon: ['#aa00ff', '#cc33ff', '#dd66ff', '#ee99ff'],
    eyes: ['#aa00ff', '#cc44ff'],
    aura: 'rgba(150,0,255,',
    glow: '#9900ff',
    // Cyborg-specific
    armor: ['#1a0a2a', '#2a1a3a', '#3a2a4a'],
    armorAccent: ['#aa00ff', '#cc33ff', '#dd66ff'],
    rifle: ['#1a1a1a', '#2a2a2a'],
    rifleGlow: ['#aa00ff', '#cc33ff', '#dd66ff'],
    // Cat Angel-specific
    suit: ['#1a0a2a', '#2a1a3a', '#3a2a4a', '#4a3a5a'],
    halo: ['#aa00ff', '#cc33ff', '#dd66ff'],
    wing: ['#d9b3ff', '#ebd9ff', '#f5f0ff'],
    chestBadge: ['#aa00ff', '#cc33ff']
  },
  light: {
    skin: ['#4a3428', '#5c4033', '#6d4c3d'],
    clothes: ['#2a2a1a', '#3a3a2a', '#4a4a3a', '#5a5a4a'],
    weapon: ['#ffff00', '#ffff33', '#ffff66', '#ffff99'],
    eyes: ['#ffff00', '#ffff44'],
    aura: 'rgba(255,220,0,',
    glow: '#ffdd00',
    // Cyborg-specific
    armor: ['#2a2a1a', '#3a3a2a', '#4a4a3a'],
    armorAccent: ['#ffcc00', '#ffdd33', '#ffee66'],
    rifle: ['#1a1a1a', '#2a2a2a'],
    rifleGlow: ['#ffff00', '#ffff33', '#ffff66'],
    // Cat Angel-specific
    suit: ['#2a2a1a', '#3a3a2a', '#4a4a3a', '#5a5a4a'],
    halo: ['#ffcc00', '#ffdd33', '#ffee66'],
    wing: ['#ffffcc', '#ffffe6', '#fffff0'],
    chestBadge: ['#ffcc00', '#ffdd33']
  },
  nature: {
    skin: ['#4a3428', '#5c4033', '#6d4c3d'],
    clothes: ['#0a2a1a', '#1a3a2a', '#2a4a3a', '#3a5a4a'],
    weapon: ['#00ff00', '#33ff33', '#66ff66', '#99ff99'],
    eyes: ['#00ff00', '#44ff44'],
    aura: 'rgba(0,255,100,',
    glow: '#00ff66',
    // Cyborg-specific
    armor: ['#0a2a1a', '#1a3a2a', '#2a4a3a'],
    armorAccent: ['#00ff66', '#33ff88', '#66ffaa'],
    rifle: ['#1a1a1a', '#2a2a2a'],
    rifleGlow: ['#00ff00', '#33ff33', '#66ff66'],
    // Cat Angel-specific
    suit: ['#0a2a1a', '#1a3a2a', '#2a4a3a', '#3a5a4a'],
    halo: ['#00ff66', '#33ff88', '#66ffaa'],
    wing: ['#ccffdd', '#e6fff0', '#f0fff5'],
    chestBadge: ['#00ff66', '#33ff88']
  }
};

// Animation data (shared across all sprites)
const SPRITE_ANIMATIONS = {
  idle: {
    frames: 8,
    frameTime: 250, // ms per frame
    loop: true
  },
  walk: {
    frames: 8,
    frameTime: 125,
    loop: true
  },
  attack: {
    frames: 6,
    frameTime: 83,
    loop: false
  }
};


