# Pixel Chibi Bag System - Production Edition

A production-ready pixel art and chibi themed bag system with retro game aesthetic, cute chibi vibes, vibrant colors, and pixelated UI elements. All features working, lighter data, and optimized for performance.

## Features

### ✅ All Tabs Implemented
- **Items** 📦 - Consumable items management with sorting and filtering
- **Gear** ⚔️ - Equipment system with character slots and auto-equip
- **Player** 👤 - Character stats, team management, companions, and cosmetics
- **Abilities** 🔰 - Skills for each character (A1, UNIQUE, MISSY), supernatural powers, and talent tree
- **Companions** 🐾 - Pets, AI robots, vehicles, and spirits
- **Quest & Collection** 📜 - Quest tracking, missions, bestiary, drop tables, and world map
- **Shop** 🏪 - In-game shop with currency support

### Key Features
- ✅ **Skills System** - Full skills for A1, UNIQUE, and MISSY characters with direct click-to-equip
- ✅ **All Companions** - Pets, Vehicles, AI robots, and Spirits
- ✅ **Pixel Chibi Theme** - Retro pixel art aesthetic with cute chibi vibes
- ✅ **Enhanced Visual Design** - Pixelated borders, chibi animations, vibrant colors, retro fonts
- ✅ **Auto-Equip** - Automatically equips best available gear, companions, and skills
- ✅ **All Button Actions** - Equip, use, sell, upgrade, enhance, lock, sort, filter
- ✅ **Lighter Data** - Streamlined game data (much smaller file sizes)
- ✅ **Auto-Open** - Opens automatically on page load
- ✅ **Keyboard Shortcuts** - Press 'B' to toggle, 'ESC' to close
- ✅ **Fully Offline** - Works without a server (with HTTP server for ES6 modules)

## File Structure

```
pixel-chibi-bag/
├── index.html              # Demo HTML file
├── styles/
│   └── pixel-chibi.css    # Pixel chibi theme styles
├── scripts/
│   ├── bag-system.js      # Core bag system logic
│   └── game-data.js       # Game data (skills, items, gear, etc.)
└── README.md              # This file
```

## Usage

### Offline Use (with HTTP Server - Recommended)
ES6 modules require an HTTP server to run. Use one of these methods:

**Python:**
```bash
cd pixel-chibi-bag
python3 -m http.server 8080
```
Then open: `http://localhost:8080/index.html`

**Node.js (http-server):**
```bash
cd pixel-chibi-bag
npx http-server -p 8080
```
Then open: `http://localhost:8080/index.html`

**VS Code Live Server:**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

### Keyboard Shortcuts
- **B** - Toggle bag system open/closed
- **ESC** - Close bag system

## Characters & Skills

### A1 (Boss Slayer)
- Crimson Slash (S1)
- Summon Clone (S2)
- Power Wave (S3)
- Phantom Step: Backstab Waltz (S4)
- Crimson Cyclone: Blink Chain (S5)
- World Splitter (X1)
- Plus upgraded skills (S7-S9, X2)

### UNIQUE (Tech Support)
- Plasma Blast (S1)
- Summon Drone (S2)
- Aether Wave Beam (S3)
- Absolute Zero Rail + Cryo Barrage (S4)
- Ion Helix Drill (S5)
- Hyper Ion Wave (X1)
- Plus upgraded skills (S7-S14, X2)

### MISSY (Cat Angel)
- Blade Dance (S1)
- Summon Pet (S2)
- Gun Barrage (S3)
- Golden Rail & Comets (S4)
- Royal Typhoon (S5)
- Royal Coin Cannon (X1)
- Plus upgraded skills (S7-S9, X2)

## Theme Design

### Color Palette
- **Bright Pastels**: #ff6b9d (pink), #c44569 (rose), #f8b500 (yellow), #4ecdc4 (cyan), #95e1d3 (mint)
- **Retro Game Colors**: #2d3436 (dark), #636e72 (gray), #00b894 (green), #0984e3 (blue), #6c5ce7 (purple)
- **Chibi Accents**: #ffd93d (gold), #ff6b6b (coral), #a29bfe (lavender)

### Typography
- **Primary Font**: Press Start 2P (Google Fonts) - for headings and buttons
- **Secondary Font**: VT323 (Google Fonts) - for body text
- **Fallback**: Courier New, monospace

### Visual Effects
- Pixelated borders (sharp, no rounded corners)
- Chibi animations (bounce, wiggle, pulse)
- Retro game UI elements (NES/SNES style)
- Pixel-perfect shadows and effects
- Vibrant, saturated colors
- 8-bit/16-bit game aesthetic

## Features in Detail

### Auto-Equip System
- Calculates item power based on stats and rarity
- Automatically equips best available gear for each slot
- Auto-equips best companions (pets, vehicles, robots, spirits)
- Auto-equips skills to available slots

### Item Management
- **Use Items**: Consumable items restore HP/MP or apply effects
- **Sell Items**: Sell items for gold (with confirmation)
- **Upgrade Gear**: Upgrade gear with gold (increases stats)
- **Enhance Gear**: Add enhancements (attack, defense, crit, etc.)
- **Lock Items**: Lock items to prevent selling/upgrading
- **Sort & Filter**: Sort by name, rarity, power, type, quantity

### Skill System
- Direct click-to-equip (no modal)
- Click equipped skill to unequip
- Auto-equip to next available slot
- Visual indicators for equipped skills
- Character-specific skill filtering

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Performance

- Optimized rendering with efficient DOM updates
- Lazy loading of tab content
- Minimal re-renders on state changes
- Smooth 60fps animations with chibi bounce effects

## License

Free to use in any project.

## Credits

Created with pixel art and chibi theme, production-ready code structure, and retro game aesthetic.

