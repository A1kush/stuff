# HPC System - Hireable Playable Characters

## Overview
Create a comprehensive system for hiring NPCs with gold to join the player's party as playable characters. Players can recruit NPCs, manage their party, equip characters, and level them up.

## System Architecture

### Folder Structure
```
Character System/HPC System/
├── core/
│   ├── hpc-database.js          # Database of hireable characters
│   ├── hpc-manager.js           # Core hiring and party management
│   └── hpc-progression.js       # Leveling and stat progression
├── ui/
│   ├── hpc-hiring-ui.js         # Hiring interface
│   ├── hpc-party-ui.js          # Party management UI
│   └── hpc-character-card.js    # Character display cards
├── integration/
│   ├── hpc-gold-integration.js  # Gold payment system
│   └── hpc-party-integration.js # Party system integration
└── README.md
```

## Core Components

### 1. HPC Database (`hpc-database.js`)
**Lines: ~400-500**

**Purpose**: Define all hireable characters with stats, costs, and abilities

**Key Features**:
- Character templates for each NPC type and rank
- Hire costs based on rank (E: 500g, D: 1000g, C: 2500g, B: 5000g, A: 10000g, S: 25000g)
- Base stats for each character type
- Skills and abilities per character
- Character descriptions and lore
- Unlock requirements (some characters require quests/achievements)

**Data Structure**:
```javascript
const HPC_DATABASE = {
  'warrior_e': {
    id: 'warrior_e',
    name: 'Rookie Warrior',
    type: 'warrior',
    rank: 'E',
    hireCost: 500,
    baseStats: { hp: 100, atk: 15, def: 10, speed: 8 },
    skills: ['basic_attack', 'shield_bash'],
    description: 'A young warrior seeking adventure...',
    unlockRequirement: null
  },
  // ... more characters
};
```

### 2. HPC Manager (`hpc-manager.js`)
**Lines: ~500-600**

**Purpose**: Core logic for hiring, managing, and party operations

**Key Features**:
- `hireCharacter(hpcId, playerId)` - Hire character for gold
- `addToParty(hpcId)` - Add hired character to active party
- `removeFromParty(hpcId)` - Remove from party (but keep hired)
- `getHiredCharacters()` - List all hired characters
- `getPartyMembers()` - Get current party members
- `canAfford(hpcId, gold)` - Check if player can afford
- `isHired(hpcId)` - Check if already hired
- `getHPCInfo(hpcId)` - Get character information

**State Management**:
```javascript
window.hpcState = {
  hired: [],           // Array of hired character IDs
  party: [],          // Array of active party member IDs
  maxPartySize: 4,    // Maximum party size
  characters: {}       // Character data cache
};
```

### 3. HPC Progression (`hpc-progression.js`)
**Lines: ~300-400**

**Purpose**: Handle character leveling, stat growth, and equipment

**Key Features**:
- `levelUp(hpcId)` - Level up character
- `addXP(hpcId, amount)` - Add experience
- `equipItem(hpcId, itemId, slot)` - Equip items
- `getStats(hpcId)` - Calculate final stats (base + level + equipment)
- `getLevel(hpcId)` - Get character level
- `getXP(hpcId)` - Get current XP

**Progression System**:
- Characters gain XP from combat
- Level up increases stats
- Equipment provides stat bonuses
- Skills unlock at certain levels

### 4. HPC Hiring UI (`hpc-hiring-ui.js`)
**Lines: ~400-500**

**Purpose**: User interface for browsing and hiring characters

**Key Features**:
- Character browser with filters (type, rank, cost)
- Character detail view (stats, skills, description)
- Hire button with cost display
- Confirmation dialog
- "Already Hired" indicator
- "Cannot Afford" indicator
- Unlock requirement display

**UI Elements**:
- Character grid/list view
- Filter buttons (All, Warriors, Mages, etc.)
- Sort options (Cost, Rank, Type)
- Search functionality
- Gold display

### 5. HPC Party UI (`hpc-party-ui.js`)
**Lines: ~350-450**

**Purpose**: Manage active party members

**Key Features**:
- Party roster display
- Add/remove from party buttons
- Character stats display
- Equipment slots
- Level and XP display
- Party formation (front/back positions)
- Switch active character

**UI Elements**:
- Party slots (4 slots)
- Character cards with stats
- Drag-and-drop for party order
- Equipment display
- Quick stats comparison

### 6. HPC Character Card (`hpc-character-card.js`)
**Lines: ~200-300**

**Purpose**: Reusable character display component

**Key Features**:
- Character portrait/sprite
- Name and rank display
- Stats display (HP, ATK, DEF, SPD)
- Level and XP bar
- Equipment preview
- Hire status indicator
- Quick actions (Hire, Add to Party, Remove)

### 7. Gold Integration (`hpc-gold-integration.js`)
**Lines: ~150-200**

**Purpose**: Handle gold transactions

**Key Features**:
- `deductGold(amount)` - Deduct gold from player
- `checkGold()` - Get current gold amount
- `canAfford(amount)` - Check affordability
- Gold update callbacks
- Transaction logging

### 8. Party Integration (`hpc-party-integration.js`)
**Lines: ~200-300**

**Purpose**: Integrate with existing party system

**Key Features**:
- Convert HPC to party member format
- Sync with `window.gameState.party`
- Handle party switching
- Update party rendering
- Combat integration

## Integration Points

### 1. Game State Integration
```javascript
// Add to window.gameState
if (!window.gameState.hpc) {
  window.gameState.hpc = {
    hired: [],
    party: [],
    characters: {}
  };
}
```

### 2. Gold System Integration
```javascript
// Use existing gold system
const currentGold = window.gameState.gold || 0;
window.gameState.gold -= hireCost;
```

### 3. Party System Integration
```javascript
// Add HPC to party array
if (!window.gameState.party) {
  window.gameState.party = [];
}
window.gameState.party.push(hpcCharacter);
```

### 4. NPC System Integration
```javascript
// Convert NPC to HPC format
function convertNPCToHPC(npc) {
  return {
    id: npc.id,
    name: npc.name,
    type: npc.type,
    rank: npc.rank,
    stats: { hp: npc.hp, atk: npc.atk, def: npc.def, speed: npc.speed },
    skills: npc.skills,
    level: 1,
    xp: 0
  };
}
```

## User Flow

### Hiring Flow
1. Player opens HPC hiring menu (keyboard shortcut or UI button)
2. Browse available characters
3. Click on character to see details
4. Click "Hire" button
5. Confirm purchase
6. Gold deducted, character added to hired list
7. Option to add to party immediately

### Party Management Flow
1. Player opens party management UI
2. View current party members
3. View available hired characters
4. Drag/drop or click to add/remove from party
5. Party updates in real-time
6. Changes saved to game state

## Data Persistence

### Save Format
```javascript
{
  hpc: {
    hired: ['warrior_e', 'mage_d', 'archer_c'],
    party: ['warrior_e', 'mage_d'],
    characters: {
      'warrior_e': {
        level: 5,
        xp: 250,
        equipment: { weapon: 'sword_1', armor: 'leather_1' },
        stats: { hp: 150, atk: 25, def: 15, speed: 10 }
      }
    }
  }
}
```

### Load on Game Start
- Load hired characters from save
- Restore party composition
- Restore character progression
- Restore equipment

## UI/UX Design

### Hiring Menu
- Modal overlay with character grid
- Filter sidebar (Type, Rank, Cost)
- Character detail panel
- Gold display in header
- Close button

### Party Menu
- Side panel or modal
- Party slots at top
- Available characters below
- Character stats on hover
- Drag-and-drop support

### Character Cards
- Portrait/sprite (64x64px)
- Name and rank badge
- Stat bars (HP, ATK, DEF, SPD)
- Level indicator
- Equipment icons
- Action buttons

## Implementation Phases

### Phase 1: Core System (400-500 lines)
- HPC Database
- HPC Manager (basic hiring)
- Gold Integration
- Basic state management

### Phase 2: UI System (750-950 lines)
- Hiring UI
- Party UI
- Character Cards
- Integration with game

### Phase 3: Progression System (300-400 lines)
- Leveling system
- XP system
- Equipment system
- Stat calculations

### Phase 4: Polish & Integration (200-300 lines)
- Save/load system
- Party rendering integration
- Combat integration
- UI polish

## Success Criteria

1. ✅ Players can hire NPCs with gold
2. ✅ Hired characters can be added to party
3. ✅ Party members are playable in game
4. ✅ Characters can level up and gain XP
5. ✅ Equipment can be equipped on HPCs
6. ✅ UI is intuitive and responsive
7. ✅ Data persists across game sessions
8. ✅ Integration with existing systems works

## Estimated Totals

- **Total Lines**: 1500-2000
- **Total Tokens**: 80k-120k
- **Files**: 8 files
- **Time**: 45-60 minutes

## Quick Implementation Options

### Option 1: Minimal Viable (500 lines, 25k tokens)
- Basic hiring system
- Simple UI
- Party integration
- No progression system

### Option 2: Full Featured (1500-2000 lines, 80k-120k tokens)
- Complete system as described
- Full UI
- Progression system
- Equipment system

### Option 3: Extended (2500-3000 lines, 150k-200k tokens)
- Everything in Option 2
- Advanced features (formations, tactics)
- Character relationships
- Advanced progression (talents, specializations)

## Next Steps

1. Create folder structure
2. Implement core database
3. Build hiring system
4. Create UI components
5. Integrate with game
6. Add progression system
7. Polish and test

