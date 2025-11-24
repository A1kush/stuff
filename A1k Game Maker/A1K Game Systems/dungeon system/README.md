# A1K Dungeon System - Soul Knight Style Side-Scrolling Dungeons

## Overview

A complete dungeon system with 15 room types, C-Rank to SSS-Rank progression, and MapleStory-style scene transitions. Features procedural generation, hidden rooms, NPCs, treasure chests, and platform-based exploration.

## Features

- **15 Unique Room Types**: Each with distinct themes, platforms, and features
- **C-SSS Rank Progression**: 6 difficulty tiers with unlock requirements
- **Complete Scene Transitions**: Old scene completely hidden (MapleStory style)
- **Procedural Generation**: Rooms generated based on rank and floor
- **Hidden Rooms**: Secret areas with bonus loot
- **NPCs**: Shop and quest NPCs spawn in rooms
- **Platform System**: Multiple platform layers for vertical exploration
- **Daily/Weekly Limits**: Entry restrictions based on rank

## Room Types

1. **Dungeon Depths** 🕳️ - Dark caverns with torches
2. **Elf Forest** 🌲 - Magical forest with floating platforms
3. **Goblin Mines** ⛏️ - Mining tunnels with ore carts
4. **Magic Academy** 🏰 - Floating platforms and spell circles
5. **Space Station** 🚀 - Zero-gravity platforms
6. **Samurai Dojo** ⚔️ - Traditional Japanese architecture
7. **Pirate Cove** 🏴‍☠️ - Ship decks and treasure caves
8. **Zombie Apocalypse** 🧟 - Urban ruins and safe houses
9. **Carnival Circus** 🎪 - Colorful tents and tightropes
10. **Moon Walk** 🌙 - Low-gravity lunar bases
11. **Crystal Caverns** 💎 - Glowing crystal platforms
12. **Volcanic Forge** 🌋 - Lava platforms and floating rocks
13. **Sky Temple** ☁️ - Floating temple platforms
14. **Underwater Ruins** 🌊 - Bubble platforms and sunken structures
15. **Desert Oasis** 🏜️ - Sand platforms and mirage portals

## Rank System

| Rank | Unlock Level | Floors | Rooms/Floor | Daily Entries | Description |
|------|--------------|--------|-------------|---------------|-------------|
| **C** | 1 | 5 | 3 | Unlimited | Entry level |
| **B** | 10 | 8 | 4 | 10 | Moderate difficulty |
| **A** | 25 | 12 | 5 | 5 | High difficulty |
| **S** | 50 | 15 | 6 | 3 | Extreme difficulty |
| **SS** | 75 | 18 | 7 | 1 | Legendary difficulty |
| **SSS** | 100 | 20 | 8 | 1/week | Ultimate challenge |

## File Structure

```
a1 systems 3/dungeon system/
├── dungeon-data.js              # Room configurations and rank data
├── dungeon-room-generator.js    # Procedural room generation
├── dungeon-room-renderer.js     # Room rendering with transitions
├── dungeon-progression.js       # C-SSS rank progression logic
├── transition-rooms/            # Individual room HTML files (optional)
└── README.md                    # This file
```

## Usage

### Initialize Dungeon System

```javascript
// Load dungeon data first
<script src="a1 systems 3/dungeon system/dungeon-data.js"></script>
<script src="a1 systems 3/dungeon system/dungeon-room-generator.js"></script>
<script src="a1 systems 3/dungeon system/dungeon-room-renderer.js"></script>
<script src="a1 systems 3/dungeon system/dungeon-progression.js"></script>
```

### Generate a Room

```javascript
// Generate a C-rank dungeon depths room, floor 1, room 0
const room = window.DungeonRoomGenerator.generateRoom(
  'dungeon_depths',  // Room type
  'C',               // Rank
  1,                 // Floor
  0,                 // Room index
  false              // Is boss room?
);
```

### Render a Room

```javascript
// Initialize renderer
const canvas = document.getElementById('gameCanvas');
window.DungeonRoomRenderer.init(canvas);

// Load room (hides old scene automatically)
window.DungeonRoomRenderer.loadRoom(room);

// Update and render each frame
function gameLoop(deltaTime) {
  const playerX = player.x;
  const playerY = player.y;
  
  window.DungeonRoomRenderer.update(deltaTime, playerX, playerY);
  window.DungeonRoomRenderer.render();
}
```

### Check Dungeon Access

```javascript
// Check if player can enter a dungeon
const canEnter = window.DungeonProgression.canEnterDungeon('B', playerLevel);
if (canEnter.allowed) {
  // Enter dungeon
  const result = window.DungeonProgression.enterDungeon('B');
  if (result.success) {
    // Start dungeon
  }
} else {
  console.log('Cannot enter:', canEnter.reason);
}
```

### Get Available Dungeons

```javascript
// Get all dungeons available for current player level
const dungeons = window.DungeonProgression.getAvailableDungeons(playerLevel);
dungeons.forEach(dungeon => {
  console.log(`${dungeon.name}: ${dungeon.floorsCleared}/${dungeon.floors} floors cleared`);
});
```

## Integration with Mission Board

Dungeon raids can be added as mission types:

```javascript
// In mission-data.js
dungeon_raid_c_rank: {
  id: "dungeon_raid_c_rank",
  type: "dungeon_raid",
  name: "C-Rank Dungeon Clear",
  description: "Clear floor 3 of any C-Rank dungeon",
  difficulty: 2,
  rank: "C",
  targetFloor: 3,
  rewards: { gold: 500, xp: 100, items: [...] }
}
```

## Events

The system dispatches custom events:

- `dungeon:transition_start` - When transitioning to dungeon (old scene hidden)
- `dungeon:transition_end` - When exiting dungeon (old scene shown)
- `dungeon:floor_cleared` - When a floor is cleared
- `dungeon:rank_cleared` - When a rank is fully cleared
- `dungeon:rank_unlocked` - When a new rank is unlocked

## Room Features

Each room includes:

- **Platforms**: Ground, mid, and high level platforms
- **Enemy Spawns**: Strategically placed enemies
- **Treasure Chests**: Regular and hidden chests with varying rarities
- **NPCs**: Shop and quest NPCs (spawn chance based on rank)
- **Hidden Rooms**: Secret areas accessible via hidden passages
- **Transition Points**: Entrance and exit points
- **Theme Elements**: Torches, crystals, spell circles, etc.

## Boss Rooms

The last room of each floor is a boss room with:

- Special arena layout
- Boss spawn point
- Multiple treasure chests
- No NPCs
- Larger platform for boss battle

## Daily Reset

Daily entries reset at midnight. SSS-rank has weekly reset (7 days). Call `resetDailyEntries()` daily or on game start.

## Notes

- All rooms are procedurally generated - no pre-made layouts
- Scene transitions completely hide old game elements
- Platform system supports vertical exploration
- Hidden rooms provide bonus rewards
- Rank progression requires clearing previous rank

