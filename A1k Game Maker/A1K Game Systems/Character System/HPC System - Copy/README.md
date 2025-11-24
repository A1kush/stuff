# HPC System - Hireable Playable Characters

## Overview
The HPC (Hireable Playable Characters) system allows players to hire NPCs with gold and add them to their party as playable characters. Hired characters can level up, gain XP, equip items, and participate in combat.

## Features

### Hiring System
- Browse 42 available characters (7 types × 6 ranks)
- Filter by type (Warrior, Mage, Archer, etc.) and rank (E-S)
- Search functionality
- Hire costs: E (500g), D (1000g), C (2500g), B (5000g), A (10000g), S (25000g)
- Gold payment integration

### Party Management
- Maximum party size: 4 members
- Add/remove hired characters from party
- View party member stats and levels
- Party members are playable in game

### Character Progression
- Level up system with XP
- Stat growth per level
- Skills unlock at levels 1, 3, 5, 10, 15, 20
- Equipment system (weapon, armor, accessories)
- Final stats = base + level + equipment

### UI Components
- **Hiring UI**: Modal with character grid, filters, and search
- **Party UI**: Side panel for managing active party
- **Character Cards**: Reusable display components

## Usage

### Keyboard Shortcuts
- **H**: Open/close Hiring Menu
- **P**: Open/close Party Management

### Hiring a Character
1. Press **H** to open Hiring Menu
2. Browse available characters
3. Use filters to find specific types/ranks
4. Click "Hire" button on desired character
5. Confirm payment (gold deducted automatically)

### Managing Party
1. Press **P** to open Party Management
2. View current party members (up to 4)
3. Click "Add" on available characters to add to party
4. Click "Remove" to remove from party
5. Party updates automatically in game

## File Structure

```
Character System/HPC System/
├── core/
│   ├── hpc-database.js          # Character database and templates
│   ├── hpc-manager.js           # Core hiring and party management
│   └── hpc-progression.js       # Leveling, XP, and equipment
├── ui/
│   ├── hpc-hiring-ui.js         # Hiring interface
│   ├── hpc-party-ui.js          # Party management UI
│   └── hpc-character-card.js     # Character display cards
├── integration/
│   ├── hpc-gold-integration.js  # Gold payment system
│   └── hpc-party-integration.js # Party system integration
├── hpc-styles.css               # UI styles
└── README.md                    # This file
```

## Integration

### Game State
HPC data is stored in `window.gameState.hpc`:
```javascript
{
  hired: [],           // Array of hired character IDs
  party: [],          // Array of active party member IDs
  characters: {}       // Character data cache
}
```

### Party System
HPCs are converted to party member format and added to `window.gameState.party` array. They participate in combat and can be controlled like regular party members.

### Save/Load
HPC data is automatically saved/loaded with game saves. All hired characters, party composition, levels, XP, and equipment persist across sessions.

## Character Types

- **Warrior**: High HP, ATK, balanced stats
- **Mage**: High ATK (magic), low DEF, medium HP
- **Archer**: High SPD, good ATK, ranged attacks
- **Healer**: Support role, healing abilities
- **Rogue**: High SPD, high ATK, low DEF
- **Tank**: Very high HP, DEF, low SPD
- **Crafter**: Balanced stats, crafting abilities

## Ranks

- **E-Rank**: 500g - Basic stats, 1 skill
- **D-Rank**: 1000g - Improved stats, 1 skill
- **C-Rank**: 2500g - Good stats, 2 skills
- **B-Rank**: 5000g - Strong stats, 2 skills
- **A-Rank**: 10000g - Elite stats, 3 skills
- **S-Rank**: 25000g - Legendary stats, 4 skills

## API Reference

### HPCManager
- `hireCharacter(hpcId)` - Hire character
- `addToParty(hpcId)` - Add to party
- `removeFromParty(hpcId)` - Remove from party
- `getHiredCharacters()` - Get all hired characters
- `getPartyMembers()` - Get party members
- `canAfford(hpcId)` - Check affordability

### HPCProgression
- `addXP(hpcId, amount)` - Add experience
- `levelUp(hpcId)` - Level up character
- `equipItem(hpcId, itemId, slot)` - Equip item
- `getStats(hpcId)` - Get final stats

### HPCHiringUI
- `open()` - Open hiring menu
- `close()` - Close hiring menu
- `toggle()` - Toggle menu
- `refresh()` - Refresh character list

### HPCPartyUI
- `open()` - Open party management
- `close()` - Close party management
- `toggle()` - Toggle panel
- `refresh()` - Refresh party display

## Example Usage

```javascript
// Hire a character
const result = window.hpcManager.hireCharacter('warrior_c');
if (result.success) {
  console.log('Hired:', result.character.name);
}

// Add to party
window.hpcManager.addToParty('warrior_c');

// Award XP after combat
window.hpcProgression.addXP('warrior_c', 50);

// Open hiring menu
window.hpcHiringUI.open();
```

## Notes

- Characters must be hired before adding to party
- Maximum party size is 4 members
- HPCs gain XP from combat (integrate with combat system)
- Equipment system is placeholder (integrate with item system)
- All data persists in save files

