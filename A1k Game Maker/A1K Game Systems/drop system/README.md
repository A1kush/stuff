# 🎁 A1K Drop Systems

Complete loot and reward visualization system for the A1K Bag System.

## 📦 What's Included

### Files
- `drop-tables.js` - Complete drop data (enemies, bosses, quests, missions)
- `drop-renderer.js` - Tab rendering logic for all 4 sections
- `sprite-generator.js` - Procedural monster sprite generator
- `demo/drop-systems-demo.html` - Standalone demo (open in browser)

### Features
1. **Enemy Type Drops** - 7 enemy types with themed loot tables
2. **Boss-Specific Loot** - 12 unique bosses with guaranteed/rare/epic/legendary drops
3. **Quest Rewards** - 11 quests with specific item rewards
4. **Daily Missions** - 7 daily/weekly missions with bonus rewards

## 🎮 How to Use

### Standalone Demo
```bash
# Open in browser
a1 systems 3/drop system/demo/drop-systems-demo.html
```

### Integration into Game
Add to `index.html`:
```html
<script src="a1 systems 3/drop system/sprite-generator.js"></script>
<script src="a1 systems 3/drop system/drop-tables.js"></script>
<script src="a1 systems 3/drop system/drop-renderer.js"></script>
```

## 📊 Drop System Stats

### Enemy Types
- **Beast** - 50 pets across 5 rarities
- **Elemental** - 30+ spirits and essences
- **Armored** - 30 armor pieces
- **Mechanical** - 30 robots
- **Flying** - Flying pets and air vehicles
- **Aquatic** - Water pets and boats
- **Warrior** - 30 weapons

### Boss Loot
- 12 unique bosses
- Guaranteed drops for each boss
- Rare drops (50% chance)
- Epic drops (20% chance)
- Legendary drops (5% chance)
- Gold bonuses: 500 - 25,000

### Quest Rewards
- 11 total quests
- Level requirements: 1-80
- Rewards: Gold, Gems, Essence, Items
- Special rewards: Alchemy tier unlocks

### Daily Missions
- 4 daily missions (24h reset)
- 3 weekly missions (7 day reset)
- Auto-progress tracking
- Bonus rewards for completion

## 🎨 Features

### Visual
- Procedurally generated monster sprites (64x64)
- Rarity-based color coding
- Animated hover effects
- Drop rate visualizations

### Interactive
- Click items to see drop sources
- Expand/collapse enemy cards
- Section tab switching
- Search and filter (coming soon)

### Functional
- Reverse lookup (where to find item X)
- Drop rate calculations
- Level-based drop adjustments
- Boss-specific themed drops

## 🔧 Technical Details

### Drop Rate Formula
```
baseRate * levelMultiplier
- Levels 1-9: 1.0x
- Levels 10-19: 1.1x
- Levels 20-29: 1.2x
- Levels 30-49: 1.3x
- Levels 50+: 1.5x
```

### Rarity Distribution
- Common: 60%
- Uncommon: 25%
- Rare: 10%
- Epic: 4%
- Legendary: 1%

## 💫 Integration with Bag System

This drop system is designed to work seamlessly with the A1K Bag Ultimate system:

1. All item IDs reference AVAILABLE_PETS, AVAILABLE_SPIRITS, etc.
2. Uses window.GameDatabase for item lookups
3. Integrates with window.addItemToInventory()
4. Connects to quest/mission tracking
5. Syncs with bag UI for notifications

## 🚀 Future Enhancements

- [ ] Real-time drop statistics
- [ ] Player drop history
- [ ] Drop rate boosters/modifiers
- [ ] Season-specific drops
- [ ] Event-exclusive items
- [ ] Achievement rewards

## 📝 Notes

- All 300+ items from the bag system are included
- Drop tables are balanced for progression
- Boss loot is thematically appropriate
- Quest rewards scale with difficulty
- Daily missions encourage regular play

Created with ❤️ for the A1K Runner Game

