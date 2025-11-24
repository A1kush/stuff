# 🏙️ City Explorer - Buildings & Interiors Demo

**Explore 11 zones and enter 14 buildings in the A1K floating city!**

---

## 🚀 Quick Start

### Modular Version (Requires Server)
```bash
cd "city explorer"
python3 -m http.server 8890
# Open: http://localhost:8890/index.html
```

### Standalone Version (Offline - Just Double-Click!)
```bash
# Just double-click: STANDALONE.html
# OR use command line:
open "city explorer/STANDALONE.html"
```

---

## ⌨️ Controls

| Key | Action |
|-----|--------|
| **← →** | Move Left/Right |
| **↑ ↓** | Move Up/Down (inside buildings) |
| **E** | Enter building / Exit building |

---

## 🗺️ The Floating City (6400px World)

### 11 Zones

1. **ENTRY** (0-600) - Spawn area, tutorial
   - Photo Booth (x:260)

2. **TRAIN** (600-1200) - Training grounds
   - Arena (x:1180)

3. **PLAZA** (1200-1800) - Safe hub
   - Quest Board (x:1500)
   - Archives (x:1650)

4. **HOME ROW** (1800-2400) - Residential
   - Home (x:1880) - NPC: Roomie
   - Mail (x:2100)

5. **MARKET** (2400-3000) - Shopping district
   - Shop (x:2460) - NPC: Mints
   - Forge (x:2580)
   - Apothecary (x:2720)

6. **ARCADE** (3000-3600) - Minigames
   - Black Market (x:3380)

7. **TOWER GATE** (3600-4200) - Tower entrance
   - Tower Gate (x:3900)

8. **PET YARD** (4200-4800) - Pet spawns

9. **SKY RAIL** (4800-5400) - Floating tram
   - Workshop (x:5020)

10. **GARDEN** (5400-6000) - Healing garden
    - Shrine (x:5600)

11. **BOSS TOWER** (6000-6400) - Final area
    - Boss Tower (x:6200)

---

## 🏠 All 14 Buildings

| # | Name | Zone | Position | Type |
|---|------|------|----------|------|
| 1 | Photo Booth | ENTRY | 260 | Photo |
| 2 | Arena | TRAIN | 1180 | Combat |
| 3 | Quest Board | PLAZA | 1500 | Quests |
| 4 | Archives | PLAZA | 1650 | Lore |
| 5 | Home | HOME ROW | 1880 | House |
| 6 | Mail | HOME ROW | 2100 | Mail |
| 7 | Shop | MARKET | 2460 | Shop |
| 8 | Forge | MARKET | 2580 | Weapons |
| 9 | Apothecary | MARKET | 2720 | Potions |
| 10 | Black Market | ARCADE | 3380 | Rare Items |
| 11 | Tower Gate | TOWER GATE | 3900 | Gate |
| 12 | Workshop | SKY RAIL | 5020 | Gear |
| 13 | Shrine | GARDEN | 5600 | Healing |
| 14 | Boss Tower | BOSS TOWER | 6200 | Boss |

---

## 🎮 How to Use

### Exploring the World
1. Use **Arrow Keys** to move left/right through zones
2. Watch the zone name change at the top
3. See buildings appear on purple platforms
4. Check minimap (top-right) to see your position

### Entering Buildings
1. Walk near any building (purple/colored house)
2. See prompt: "Press E to enter [Building Name]"
3. Press **E** key
4. You're inside! See furniture, NPCs, chest

### Exiting Buildings
1. Walk to the bottom center (dark door)
2. Press **E** key
3. You're back outside!

---

## 📦 File Structure

### Modular Version (7 files)
```
city explorer/
├── index.html           # Entry point
├── buildings-data.js    # 11 zones + 14 buildings data
├── world-renderer.js    # Zone/platform/building rendering
├── house-interior.js    # Interior room system
├── player-controller.js # Movement + interaction
├── minimap.js           # World map display
├── ui-system.js         # Prompts & info panels
├── main.js              # Game loop
├── styles.css           # UI styling
└── README.md            # This file
```

### Standalone Version (1 file)
```
STANDALONE.html  (12 KB)
- All code bundled inline
- No server needed
- Double-click to run!
```

---

## 🎨 Visual Features

- **Zone Backgrounds** - Gradient colors per zone
- **Zone Labels** - Large text banners showing zone name
- **Floating Platforms** - Purple strips under all buildings
- **Buildings** - Procedural houses with roofs, doors, windows
- **Minimap** - Real-time tracking with viewport box
- **Interiors** - Simple rooms with furniture, NPC, chest
- **Prompts** - "Press E" messages when near buildings

---

## 🔧 Technical Details

### World Specs
- Width: 6400px
- Height: 540px
- Zones: 11
- Buildings: 14
- Camera: Follows player with smooth scrolling

### Building System
- Each building has: position, size, colors, type
- Proximity detection: 80px radius
- Enter/exit transitions
- Interior templates per building type

### Interior System
- Generic room layout
- Furniture: Counter, shelves, chest, NPC
- Movement within room bounds
- Exit door at bottom center

---

## 📊 Version Comparison

| Feature | Modular | Standalone |
|---------|---------|------------|
| **Files** | 7 | 1 |
| **Size** | ~15 KB | ~12 KB |
| **Offline** | ❌ No | ✅ Yes |
| **Modify** | ✅ Easy | ⚠️ Hard |
| **Server** | Required | Not needed |

---

## 🎯 Use Cases

### For Development:
Use **modular version** - Clean files, easy to modify

### For Demo/Sharing:
Use **STANDALONE.html** - Double-click and go!

### For Integration:
Import individual modules into your game:
```javascript
import { BUILDINGS, ZONES } from './buildings-data.js';
import { WorldRenderer } from './world-renderer.js';
```

---

## ✅ Production Ready

- ✅ Standalone offline version (no server)
- ✅ Modular development version
- ✅ All 11 zones implemented
- ✅ All 14 buildings placed
- ✅ Enter/exit system working
- ✅ Minimap functional
- ✅ Clean, maintainable code

---

**Version**: 1.0.0  
**Status**: ✅ Complete  
**Created**: October 30, 2025

