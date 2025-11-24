# HPC System Integration Guide

## ✅ What's Been Done

1. **HPC Demo File Created** (`HPC_DEMO_WITH_NPCS.html`)
   - Beautiful demo page explaining how to use HPC system
   - Instructions for finding and hiring NPCs
   - Feature overview

2. **Integration Script Created** (`hpc-integration-script.js`)
   - Connects HPC system to existing NPCs
   - Makes all NPCs hireable
   - Adds keyboard shortcuts (H for Hiring Menu, P for Party Management)
   - Overrides NPC dialogue hire handler to use HPC system

3. **NPC System Analysis**
   - Found that NPCs are stored in `window.gameState.npcs`
   - NPC dialogue system already has a basic hire function
   - NPCs spawn in zones (Beginner Hub, Market Square, Training Arena, etc.)
   - NPCs are rendered with sprites and overhead UI

## 📋 Next Steps to Complete Integration

### Step 1: Add HPC System Files to Main Game

Add these script tags to `mixed-city-with-ultra-interiors.html` (before closing `</body>` tag):

```html
<!-- HPC System Core -->
<script src="Character System/HPC System - Copy/core/hpc-database.js"></script>
<script src="Character System/HPC System - Copy/core/hpc-manager.js"></script>
<script src="Character System/HPC System - Copy/core/hpc-progression.js"></script>

<!-- HPC System UI -->
<script src="Character System/HPC System - Copy/ui/hpc-hiring-ui.js"></script>
<script src="Character System/HPC System - Copy/ui/hpc-party-ui.js"></script>
<script src="Character System/HPC System - Copy/ui/hpc-character-card.js"></script>

<!-- HPC System Integration -->
<script src="Character System/HPC System - Copy/integration/hpc-gold-integration.js"></script>
<script src="Character System/HPC System - Copy/integration/hpc-party-integration.js"></script>

<!-- HPC Styles -->
<link rel="stylesheet" href="Character System/HPC System - Copy/hpc-styles.css">

<!-- HPC Integration Script (LAST) -->
<script src="Character System/HPC System - Copy/hpc-integration-script.js"></script>
```

### Step 2: Update NPC Spawning

In `spawnCityNPCs()` function (around line 22360), ensure NPCs have:
- `canHire: true` property
- `hireCost` based on rank
- Dialogue with hire/reject messages

The integration script will handle this automatically, but you can also add it manually:

```javascript
npc.canHire = true;
npc.hireCost = HPC_HIRE_COSTS[npc.rank] || 1000;
```

### Step 3: Test in Browser

1. Open `mixed-city-with-ultra-interiors.html` in browser
2. Walk around city to find NPCs
3. Press **E** near an NPC to interact
4. Click **💰 Hire** option
5. Press **H** to open Hiring Menu
6. Press **P** to open Party Management

## 🎮 How It Works

### Finding NPCs
- NPCs spawn in 10 different zones across the city
- Zones include: Beginner Hub, Market Square, Training Arena, Arcane Tower, etc.
- Each zone has different NPC types and ranks
- NPCs are visible with sprites, names, ranks, and HP bars

### Hiring NPCs
1. **Walk near NPC** - NPCs are rendered on the game canvas
2. **Press E** - Opens dialogue box with options
3. **Click "💰 Hire"** - Hires the NPC (if you have enough gold)
4. **NPC joins roster** - Can be added to party later

### Managing Party
1. **Press H** - Opens Hiring Menu to browse all characters
2. **Press P** - Opens Party Management
3. **Add to Party** - Click "Add" on hired characters (max 4)
4. **Remove from Party** - Click "Remove" to free up space

## 💰 Hire Costs

- **E-Rank**: 500 gold
- **D-Rank**: 1,000 gold
- **C-Rank**: 2,500 gold
- **B-Rank**: 5,000 gold
- **A-Rank**: 10,000 gold
- **S-Rank**: 25,000 gold

## 🐛 Troubleshooting

### NPCs Not Visible
- Check console for errors
- Verify `npcSpriteRenderer` is initialized
- Check NPC positions are valid numbers
- Ensure NPCs have `dead: false` and `visible: true`

### Can't Hire NPCs
- Check if HPC system files are loaded
- Verify `window.hpcManager` exists
- Check gold amount in `window.gameState.gold`
- Ensure NPC has `canHire: true` property

### HPC UI Not Opening
- Check if HPC UI files are loaded
- Press **H** for Hiring Menu
- Press **P** for Party Management
- Check browser console for errors

## 📝 Quick Implementation Checklist

- [ ] Add HPC system script includes to main game file
- [ ] Add HPC stylesheet link
- [ ] Add integration script (last)
- [ ] Test NPC visibility in browser
- [ ] Test hiring NPCs via E key interaction
- [ ] Test H key (Hiring Menu)
- [ ] Test P key (Party Management)
- [ ] Verify gold deduction works
- [ ] Verify hired NPCs appear in party
- [ ] Test save/load functionality

## 🚀 Quick Fixes (1-5 minutes each)

1. **Add HPC Script Includes** - Copy script tags above into main game file
2. **Test NPC Visibility** - Open browser, check if NPCs render
3. **Add Hire Option** - Integration script handles this automatically
4. **Test Keyboard Shortcuts** - Press H and P keys
5. **Verify Gold System** - Check if gold deducts when hiring

## 📊 File Structure

```
Character System/HPC System - Copy/
├── core/
│   ├── hpc-database.js          ✅ Ready
│   ├── hpc-manager.js           ✅ Ready
│   └── hpc-progression.js       ✅ Ready
├── ui/
│   ├── hpc-hiring-ui.js         ✅ Ready
│   ├── hpc-party-ui.js          ✅ Ready
│   └── hpc-character-card.js    ✅ Ready
├── integration/
│   ├── hpc-gold-integration.js  ✅ Ready
│   └── hpc-party-integration.js ✅ Ready
├── hpc-styles.css               ✅ Ready
├── hpc-integration-script.js    ✅ NEW - Integration script
├── HPC_DEMO_WITH_NPCS.html     ✅ NEW - Demo page
└── INTEGRATION_GUIDE.md        ✅ This file
```

## 🎯 Current Status

**NPC System**: ✅ Working (NPCs spawn and render)
**HPC System**: ✅ Ready (all files created)
**Integration**: ⚠️ Needs to be added to main game file
**Testing**: ⏳ Waiting for integration

## 💡 Next 5 Phases

1. **Phase 1**: Add HPC scripts to main game file (5 min)
2. **Phase 2**: Test NPC hiring via E key (5 min)
3. **Phase 3**: Test HPC UI (H and P keys) (5 min)
4. **Phase 4**: Add HPC characters to party system (10 min)
5. **Phase 5**: Test save/load with hired NPCs (5 min)

---

**Total Estimated Time**: ~30 minutes
**Token Cost**: ~5k-10k tokens
**Lines of Code**: ~200-500 lines (mostly integration)

