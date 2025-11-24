# Enemy Sprites Demo - Setup Instructions

## ⚠️ Important: ES6 Modules Require HTTP Server

This demo uses ES6 modules which **cannot be loaded from `file://` protocol** due to browser security restrictions (CORS). You **must** use a local web server.

## Quick Start Options

### Option 1: Python (Recommended)
```bash
cd "Character System/enemy system"
python -m http.server 8000
```
Then open: `http://localhost:8000/enemy-sprites-demo.html`

### Option 2: Node.js
```bash
cd "Character System/enemy system"
npx http-server -p 8000
```
Then open: `http://localhost:8000/enemy-sprites-demo.html`

### Option 3: VS Code Live Server
1. Install the "Live Server" extension in VS Code
2. Right-click `enemy-sprites-demo.html`
3. Select "Open with Live Server"

### Option 4: PHP
```bash
cd "Character System/enemy system"
php -S localhost:8000
```
Then open: `http://localhost:8000/enemy-sprites-demo.html`

## Features

### Quick Features
- ✅ PNG Export - Export individual sprites
- ✅ Comparison View - Compare up to 4 sprites side-by-side
- ✅ Animation Speed Control - Adjust animation speed (0.25x - 4x)
- ✅ Sprite Info Panel - Detailed stats on click
- ✅ Dark/Light Theme - Theme switcher with persistence

### Phase 1: Enhanced Filtering
- Multi-select filters (tier, element)
- Filter presets (save/load custom presets)
- Sort options (name, tier, HP, ATK, element)

### Phase 2: Sprite Customization
- Live sprite editor with real-time preview
- Element changer
- Size presets

### Phase 3: Export & Sharing
- Batch export (ZIP file)
- Sprite sheet generator
- JSON export
- Share links (URL parameters)

### Phase 4: Animation Controls
- Frame-by-frame playback
- Pause/Play controls
- Frame counter

### Phase 5: Advanced Features
- Stats overlay (hover)
- Enhanced comparison tool

## Troubleshooting

### CORS Errors
If you see CORS errors, you're opening the file directly. Use one of the web server options above.

### Modules Not Loading
Make sure:
1. You're using a web server (not file://)
2. All paths are correct relative to the HTML file
3. The enemy database files exist in the expected location

### Sprites Not Showing
1. Check browser console for errors
2. Verify EnemySprites_v2.js is loading
3. Check that databases are populated (check console logs)

## File Structure
```
Character System/
├── enemy system/
│   ├── enemy-sprites-demo.html (this file)
│   ├── enemy-data-loader.js
│   └── enemy-sprite-renderer.js
└── a2-enemy-npc-system/
    ├── visuals/
    │   └── EnemySprites_v2.js
    └── data/
        ├── enemies_db.js
        ├── bosses_db.js
        ├── zombies_db.js
        └── villains_db.js
```

