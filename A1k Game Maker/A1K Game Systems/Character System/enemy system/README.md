# Enemy System Integration

This folder contains the enemy system integration for the A1K Bag Ultimate system.

## Files

- `enemy-data-loader.js` - Loads all enemy databases and exposes them to window
- `enemy-sprite-renderer.js` - Wrapper for sprite generation
- `bestiary-renderer.js` - Renders the Bestiary tab
- `mission-board-renderer.js` - Renders the Mission Board tab
- `mission-data.js` - Mission templates and configurations

## Important Note: ES6 Module Loading

The enemy databases (`enemies_db.js`, `bosses_db.js`, `zombies_db.js`, `villains_db.js`) and sprite renderer (`EnemySprites_v2.js`) use ES6 `export` syntax, which means they cannot be loaded as regular `<script>` tags.

### Solution Options:

1. **Use Dynamic Imports** (Recommended):
   ```javascript
   // In enemy-data-loader.js, use dynamic import:
   const enemiesModule = await import('../Character System/a2-enemy-npc-system/data/enemies_db.js');
   window.EnemyDatabase.enemies = enemiesModule.ENEMIES_DATABASE;
   ```

2. **Convert to Non-Module Versions**:
   Wrap the exports in IIFE and attach to window:
   ```javascript
   (function() {
     window.ENEMIES_DATABASE = { /* ... */ };
   })();
   ```

3. **Use type="module" Scripts**:
   ```html
   <script type="module" src="..."></script>
   ```
   Note: This requires all dependent scripts to also be modules.

## Integration

The enemy system is integrated into the bag system via:
- Two new tabs: "Bestiary" and "Mission Board"
- Event system for mission start/complete and bestiary updates
- External script loading pattern (same as drop system)

## Usage

1. Load enemy system scripts before bag initialization
2. Enemy databases will be populated automatically
3. Bestiary tab shows all enemies with sprites
4. Mission Board tab allows starting missions and teleporting to dungeons

## Events

- `mission:started` - Fired when a mission is started
- `dungeon:teleport` - Fired when teleporting to a dungeon/tower
- `bestiary:encountered` - Fired when an enemy is encountered
- `bestiary:defeated` - Fired when an enemy is defeated

