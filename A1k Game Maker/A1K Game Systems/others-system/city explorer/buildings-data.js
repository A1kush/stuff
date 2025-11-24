// Zones and Buildings Data for City Explorer Demo
// Future-proof constants to power both modular and standalone demos

export const WORLD = {
  width: 6400,
  height: 540,
};

export const ZONES = [
  { id: 'ENTRY', name: 'Entry', x: 0, end: 600, color: '#1f2937', safe: true },
  { id: 'TRAIN', name: 'Training Grounds', x: 600, end: 1200, color: '#334155' },
  { id: 'PLAZA', name: 'Plaza', x: 1200, end: 1800, color: '#2b2c40', safe: true },
  { id: 'HOME_ROW', name: 'Home Row', x: 1800, end: 2400, color: '#1f2937' },
  { id: 'MARKET', name: 'Market', x: 2400, end: 3000, color: '#2b2c40' },
  { id: 'ARCADE', name: 'Arcade', x: 3000, end: 3600, color: '#221a2e' },
  { id: 'TOWER_GATE', name: 'Tower Gate', x: 3600, end: 4200, color: '#312e2e' },
  { id: 'PET_YARD', name: 'Pet Yard', x: 4200, end: 4800, color: '#173a2e' },
  { id: 'SKY_RAIL', name: 'Sky Rail', x: 4800, end: 5400, color: '#1e293b' },
  { id: 'GARDEN', name: 'Garden', x: 5400, end: 6000, color: '#0f3e2e', safe: true },
  { id: 'BOSS_TOWER', name: 'Boss Tower', x: 6000, end: 6400, color: '#3b1f1f' },
];

// Helper to place on a floating strip
const stripY = 460; // baseline for platforms

export const BUILDINGS = [
  { id: 'photo', name: 'Photo Booth', type: 'photo', zone: 'ENTRY', x: 260, y: stripY, width: 80, height: 60, color: '#9A6BFF', roof: '#7e5bef' },
  { id: 'arena', name: 'Arena', type: 'arena', zone: 'TRAIN', x: 1180, y: stripY, width: 140, height: 80, color: '#ef4444', roof: '#b91c1c' },
  { id: 'quest', name: 'Quest Board', type: 'quest', zone: 'PLAZA', x: 1500, y: stripY, width: 100, height: 60, color: '#22d3ee', roof: '#06b6d4' },
  { id: 'archives', name: 'Archives', type: 'archives', zone: 'PLAZA', x: 1650, y: stripY, width: 140, height: 80, color: '#94a3b8', roof: '#64748b' },
  { id: 'home', name: 'Home', type: 'house', zone: 'HOME_ROW', x: 1880, y: stripY, width: 120, height: 70, color: '#ff93d3', roof: '#d15aa8', npc: { name: 'Roomie', role: 'House Keeper' } },
  { id: 'mail', name: 'Mail', type: 'mail', zone: 'HOME_ROW', x: 2100, y: stripY, width: 100, height: 60, color: '#60a5fa', roof: '#2563eb' },
  { id: 'shop', name: 'Shop', type: 'shop', zone: 'MARKET', x: 2460, y: stripY, width: 130, height: 70, color: '#9fd7ff', roof: '#60a5fa', npc: { name: 'Mints', role: 'Merchant' } },
  { id: 'forge', name: 'Forge', type: 'forge', zone: 'MARKET', x: 2580, y: stripY, width: 120, height: 70, color: '#f97316', roof: '#c2410c' },
  { id: 'apothecary', name: 'Apothecary', type: 'apothecary', zone: 'MARKET', x: 2720, y: stripY, width: 140, height: 70, color: '#84cc16', roof: '#4d7c0f' },
  { id: 'black_market', name: 'Black Market', type: 'black_market', zone: 'ARCADE', x: 3380, y: stripY, width: 140, height: 70, color: '#0ea5e9', roof: '#0369a1' },
  { id: 'workshop', name: 'Workshop', type: 'workshop', zone: 'SKY_RAIL', x: 5020, y: stripY, width: 140, height: 70, color: '#eab308', roof: '#a16207' },
  { id: 'shrine', name: 'Shrine', type: 'shrine', zone: 'GARDEN', x: 5600, y: stripY, width: 140, height: 70, color: '#22c55e', roof: '#15803d' },
  { id: 'tower_gate', name: 'Tower Gate', type: 'gate', zone: 'TOWER_GATE', x: 3900, y: stripY, width: 160, height: 110, color: '#9ca3af', roof: '#6b7280' },
  { id: 'boss_tower', name: 'Boss Tower', type: 'boss', zone: 'BOSS_TOWER', x: 6200, y: stripY, width: 180, height: 140, color: '#ef4444', roof: '#7f1d1d' }
];

export const INTERIOR_TEMPLATES = {
  house: { w: 420, h: 300, floor: '#1f2937', wall: '#111827', chest: true, npc: true, door: true, furniture: ['bed', 'table'] },
  shop: { w: 520, h: 340, floor: '#111827', wall: '#0b1020', counter: true, shelves: 2, npc: true },
  forge: { w: 520, h: 340, floor: '#1f1f1f', wall: '#2a130c', anvil: true, furnace: true, npc: true },
  apothecary: { w: 520, h: 340, floor: '#0f1f12', wall: '#0f2f1a', herbs: true, shelves: 3, npc: true },
  archives: { w: 560, h: 360, floor: '#0e1726', wall: '#0b1320', shelves: 6, npc: true },
  black_market: { w: 540, h: 340, floor: '#0f0f1a', wall: '#161622', counter: true, crates: 4, npc: true },
  arena: { w: 600, h: 380, floor: '#1f1a1a', wall: '#2b1f1f', ring: true },
  mail: { w: 480, h: 320, floor: '#0b1320', wall: '#0b1a2a', counter: true, boxes: 12 },
  workshop: { w: 560, h: 360, floor: '#161827', wall: '#0e1627', benches: 3, npc: true },
  shrine: { w: 560, h: 360, floor: '#0a1f14', wall: '#0b2f1a', altar: true },
  photo: { w: 420, h: 300, floor: '#111827', wall: '#0f1626', booth: true },
  gate: { w: 580, h: 360, floor: '#111827', wall: '#2b2b2b', gate: true },
  boss: { w: 660, h: 400, floor: '#1a0f0f', wall: '#2b0f0f', throne: true }
};
