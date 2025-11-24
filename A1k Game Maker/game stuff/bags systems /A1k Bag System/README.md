# A1K Bag System

A comprehensive, production-ready inventory and bag management system for web-based games. Features include gear management, pet/vehicle/robot systems, alchemy, arcade games, mission boards, and bestiary tracking.

## Overview

The A1K Bag System is a standalone, bundled inventory management solution designed for offline use. It provides a complete UI for managing items, equipment, pets, vehicles, skins, talents, and more.

### Key Features

- **Inventory Management**: Items, gear, pets, vehicles, robots, spirits, skins
- **Character System**: Multi-character support with equipment slots
- **Alchemy System**: Craft and evolve items
- **Arcade Games**: Built-in betting games (Slots, RPS, Dice, Wheel, High-Low)
- **Mission Board**: Quest and dungeon management
- **Bestiary**: Enemy tracking and defeat records
- **Talent System**: Character skill trees
- **Shop System**: In-game item purchasing
- **HUD Integration**: Mobile-friendly controls and joystick support

## File Structure

The project uses a **flat file structure** with bundled files:

```
nf1/
├── index.html                 # Main HTML file with inline game state
├── main-styles.css            # All CSS styles (bag, HUD, arcade, dungeon)
├── A1KBagSystem.js            # Main bag system bundle (core engine)
├── arcade-bundle.js           # Arcade games bundle
├── candy-dungeon-bundle.js    # Dungeon system bundle
├── game-data.js               # Game data definitions
└── all-manifests.json         # Unified manifest (assets, bag, skills, etc.)
```

### File Descriptions

- **index.html**: Standalone demo file with inline game state. Includes production notes and integration examples.
- **main-styles.css**: Complete stylesheet containing all UI styles (bag window, HUD, arcade, dungeon, bestiary, missions).
- **A1KBagSystem.js**: Core bag system engine with all inventory management logic, UI rendering, and state management.
- **arcade-bundle.js**: Arcade betting games (slots, rock-paper-scissors, dice, color wheel, high-low card).
- **candy-dungeon-bundle.js**: Dungeon exploration and mission system.
- **game-data.js**: Game data definitions and configurations.
- **all-manifests.json**: Unified manifest file containing asset paths, bag configuration, skill definitions, and character data.

## Integration Guide

### Quick Start

1. **Copy Required Files**: Copy all files from the `nf1/` directory to your project.

2. **Update Paths**: Ensure paths in `index.html` match your project structure:
   ```html
   <link rel="stylesheet" href="main-styles.css" />
   <script src="A1KBagSystem.js"></script>
   <script src="arcade-bundle.js"></script>
   <script src="candy-dungeon-bundle.js"></script>
   ```

3. **Configure Manifests**: Set manifest paths before loading scripts:
   ```javascript
   window.A1K_ALL_MANIFESTS_PATH = 'all-manifests.json';
   window.A1K_ASSET_MANIFEST_PATH = 'all-manifests.json';
   window.A1K_ARCADE_MANIFEST_PATH = 'all-manifests.json';
   ```

4. **Initialize Game State**: Set up your game state object:
   ```javascript
   window.gameState = {
     gold: 1000,
     gems: 100,
     keys: 5,
     tickets: 10,
     inventory: {
       items: [],
       gear: [],
       pets: [],
       vehicles: []
     },
     equipped: {
       // Equipment slots
     }
   };
   ```

5. **Initialize Bag System**: Call the init function after your game loads:
   ```javascript
   if (window.BagSystem && typeof window.BagSystem.init === 'function') {
     window.BagSystem.init().then(() => {
       console.log('Bag System initialized');
     });
   }
   ```

### Production Mode

Enable production mode to suppress debug logs:

```javascript
// Set before loading A1KBagSystem.js
window.A1K_DEBUG_MODE = false; // Production (no debug logs)
// OR
window.A1K_DEBUG_MODE = true;  // Development (all logs)
```

Or use URL parameter for development:
```
http://yoursite.com/?debug=true
```

### Manifest Configuration

The system uses `all-manifests.json` for configuration. Key sections:

- **assetManifest**: Asset paths and metadata
- **bagManifest**: Bag system configuration (tabs, shop, characters)
- **unifiedManifests**: Combined configuration (skills, characters, VFX settings)
- **arcadeManifest**: Arcade game definitions

### Game State Structure

The bag system expects a `window.gameState` object with:

```javascript
{
  gold: number,           // Currency
  gems: number,           // Premium currency
  keys: number,           // Special currency
  tickets: number,        // Arcade currency
  inventory: {
    items: Array,         // Consumable items
    gear: Array,          // Equipment items
    pets: Array,          // Pet items
    vehicles: Array,      // Vehicle items
    robots: Array,        // Robot items
    spirits: Array,       // Spirit items
    skins: Array          // Skin items
  },
  equipped: {
    // Equipment slots by character
  },
  characters: {
    // Character data
  }
}
```

## Bundling Strategy

### Current Structure

The project uses a **flat, bundled structure** where:

- All CSS is in `main-styles.css` (4000+ lines)
- Core bag system is in `A1KBagSystem.js` (24000+ lines)
- Arcade games are in `arcade-bundle.js`
- Dungeon system is in `candy-dungeon-bundle.js`
- Game data is in `game-data.js`

### Benefits

- **Single File Loading**: Fewer HTTP requests
- **Offline Support**: Works from a folder (file://)
- **Easy Deployment**: Copy all files to server
- **No Build Step**: Direct browser execution

### Migration from Old Structure

**Old Structure** (deprecated):
```
bag-system/
├── js/
│   ├── bag-core.js
│   ├── bag-ui.js
│   └── ...
├── css/
│   ├── bag-styles.css
│   └── ...
├── data/
│   ├── items.json
│   └── ...
└── ...
```

**New Structure** (current):
```
nf1/
├── A1KBagSystem.js    # All JS bundled
├── main-styles.css    # All CSS bundled
├── game-data.js       # All data bundled
└── all-manifests.json # Configuration
```

## API Reference

### BagSystem Object

The main API is exposed via `window.BagSystem`:

```javascript
// Initialize the bag system
await window.BagSystem.init();

// Open bag window
window.BagSystem.openBag();

// Close bag window
window.BagSystem.closeBag();

// Update game state
window.BagSystem.updateGameState(newGameState);

// Get current inventory
const inventory = window.BagSystem.getInventory();

// Equip item
window.BagSystem.equipItem(itemId, slotId);

// Use item
window.BagSystem.useItem(itemId, quantity);
```

### Events

The bag system emits events that can be listened to:

```javascript
// Listen for bag open/close
document.addEventListener('bagOpened', (e) => {
  console.log('Bag opened');
});

document.addEventListener('bagClosed', (e) => {
  console.log('Bag closed');
});

// Listen for item changes
document.addEventListener('itemUsed', (e) => {
  console.log('Item used:', e.detail);
});

document.addEventListener('itemEquipped', (e) => {
  console.log('Item equipped:', e.detail);
});
```

## Development

### Debug Mode

Enable debug mode to see all console logs:

```javascript
// In index.html, before loading scripts
window.A1K_DEBUG_MODE = true;

// Or use URL parameter
// http://yoursite.com/?debug=true
```

### Testing

The system includes diagnostic tools:

- **Diagnostics Panel**: Shows system status and data counts
- **Debug Functions**: Available in debug mode (e.g., `window.debugSummonCompanion`)
- **Console Logging**: Detailed logs when debug mode is enabled

### Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support (22+)
- **Safari**: Full support
- **Mobile**: Responsive design with touch controls

## Configuration

### Manifest Paths

Configure manifest file paths:

```javascript
window.A1K_ALL_MANIFESTS_PATH = 'all-manifests.json';
window.A1K_ASSET_MANIFEST_PATH = 'all-manifests.json';
window.A1K_ARCADE_MANIFEST_PATH = 'all-manifests.json';
```

### Theme Configuration

The system supports multiple themes:

- **Default**: Candy theme with pink/purple gradients
- **Sunset**: Warmer orange/pink tones
- **Sugar Mint**: Cool mint/green tones

Set theme via HTML:

```html
<body data-candy-theme="sunset">
```

### HUD Configuration

Configure HUD colors and controls:

```javascript
// In bag system settings tab
// Or via CSS variables
:root {
  --candy-pink: #ffb6d9;
  --candy-purple: #fecfef;
  /* ... */
}
```

## Troubleshooting

### Common Issues

1. **Bag won't open**: Check that `window.BagSystem.init()` was called
2. **Items not showing**: Verify `window.gameState.inventory` is set correctly
3. **Manifest errors**: Ensure `all-manifests.json` is accessible
4. **Styles not loading**: Check that `main-styles.css` path is correct

### Debug Checklist

- [ ] `window.gameState` is defined
- [ ] `window.BagSystem.init()` was called
- [ ] Manifest files are accessible
- [ ] CSS file is loaded
- [ ] No console errors
- [ ] Debug mode is enabled for troubleshooting

## License

This project is part of the A1K game system. See your project license for details.

## Support

For issues or questions, check the diagnostics panel in the bag system or enable debug mode for detailed logs.

## Changelog

### Version 1.1.0
- Flat file structure implementation
- Bundled CSS and JS files
- Production mode support
- Debug mode flag
- Unified manifest system

### Version 1.0.0
- Initial release
- Core bag system
- Arcade games
- Dungeon system
- Bestiary tracking



