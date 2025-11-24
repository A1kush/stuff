# Vehicle System Demo

![Offline Support](https://img.shields.io/badge/offline-supported-brightgreen) ![Build Size](https://img.shields.io/badge/bundle-~40KB-blue)

Production-ready vehicle system with integrated bag system, pet system, and physics-based vehicle controller.

## Quick Start

### Option 1: Using Node.js (Recommended)

```bash
npm start
```

Then open http://localhost:3000 in your browser.

### Option 2: Using Python

```bash
python -m http.server 3000
```

Then open http://localhost:3000 in your browser.

### Option 3: Using the Batch Script (Windows)

Double-click `start-server.bat` or run:
```bash
start-server.bat
```

### Option 4: Using VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 5: Offline Bundle (No Server Required) 🚀
1. Install dependencies if you have not already:
   ```bash
   npm install
   ```
2. Run the offline build:
   ```bash
   npm run build:offline
   ```
3. Open `offline/index.html` directly in your browser (double-click or drag-and-drop).

This generates a single bundled script (`offline/app.js`) so modern browsers can load the demo over `file://` without triggering module-based CORS restrictions.

**Build Size Snapshot:**
- `app.js`: ~38.1 KB (minified)
- `index.html`: ~1.0 KB
- **Total**: ~39.1 KB

*Last verified: 2025-11-13*

## Project Structure

```
src/
├── art/              # Sprite definitions (consolidated)
├── bag/              # Bag system (inventory management)
├── game/             # Core game logic (main loop, input, state)
├── pet/              # Pet system (followers)
└── vehicle/          # Vehicle system (manager, controller, registry)
```

## Controls

- **Arrow Keys**: Move and jump
- **V**: Toggle vehicle spawn
- **E**: Board/unboard vehicle
- **B**: Open bag (if integrated)

## Features

- ✅ Unified vehicle registry (single source of truth)
- ✅ Vehicle manager (central state controller)
- ✅ Physics-based vehicle controller
- ✅ Pet following system
- ✅ Modular architecture
- ✅ Production-ready structure

## Troubleshooting

### CORS Errors

Opening `index.html` directly from the file system with ES modules will be blocked by modern browsers. Use one of the server options above **or** generate the offline bundle via `npm run build:offline` and open the output inside the `offline/` folder.

### Module Not Found Errors

Ensure all import paths are correct. The project uses ES modules with relative paths.

## Development

The project uses ES modules (no build step required). Simply serve the files through a local HTTP server, or work against the offline bundle when validating file protocol use.
