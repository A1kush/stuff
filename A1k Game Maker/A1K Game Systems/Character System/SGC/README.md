# SGC Offline Module

Special Game Characters (SGC) is a drop-in offline kit that bundles narrative-rich hero data, a hero compendium UI, an action ribbon prototype, and economy/RNG tools. Everything runs from plain HTML/JS/CSS so you can drag the folder into any vanilla canvas project.

## Quick Start
1. Open `SGC/ui/index.html` directly in a browser (double-click works on macOS/Windows).
2. Use the rank/role filters to browse the roster. Each card loads JSON from `data/heroes/` and validates schema rules.
3. Scroll to the Action Ribbon section to see how feed/heal beats interleave with DPS skills.
4. Use the Economy sandbox to roll deterministic events, export/import RNG seeds, and inspect currency impacts—all offline.

## Key Features
- **Data Modeling**: `data/schema/hero.schema.json` defines every field. Individual hero files explain the *why* behind each ability for future balancing.
- **Hero Compendium UI**: Pure CSS grid with rank-specific aura animations, validation warnings (console), and affordability hints powered by the economy sim.
- **Action Ribbon Prototype**: `sim/ribbon.js` renders a looping timeline so designers can preview how skills layer before wiring a combat engine.
- **Economy + RNG**: `scripts/rng.js` + `scripts/economy.js` provide seedable PRNG, Bond Spark/Reputation accounting, auction logic, and QA-friendly snapshots.
- **Accessibility & QA Toggles**:
  - Colorblind palette + auto-feed assist toggles.
  - Cinematic intensity slider adjusts glow/particle exaggeration without editing CSS.
  - Seed input plus snapshot export/import lets QA replay rare spawns exactly.

## Folder Map
```
SGC/
├── README.md               # This guide
├── SGC-character-system-pitch.txt
├── data/
│   ├── events.json         # Weighted event table
│   ├── heroes/             # One JSON per hero + roster index
│   └── schema/hero.schema.json
├── scripts/
│   ├── economy.js          # Bond Sparks, auctions, seed snapshots
│   ├── rng.js              # Deterministic PRNG helper
│   └── schema-validator.js # Lightweight JSON validator
├── sim/ribbon.js           # Canvas action ribbon renderer
└── ui/
    ├── index.html          # Compendium + simulator UI
    ├── ui.css              # Rank glows, accessibility styles
    └── ui.js               # Data loading, filters, ribbon+economy wiring
```

## Workflow Tips
- **Adding Heroes**: Duplicate any file under `data/heroes/`, follow the schema, and rerun the UI—validation errors show in the browser console.
- **Tweaking Events**: Edit `data/events.json` to rebalance weights or rewards. No build step required; reload the page to test.
- **Testing Seeds**: Set the seed input, roll events, then export a snapshot to freeze currencies + RNG state. Share the JSON blob to reproduce runs elsewhere.
- **Integrating into Other Games**: Copy `/SGC` into your project, reference `ui/ui.js` logic to pull hero data, and reuse the ribbon/economy modules inside your own canvases.

Everything ships offline-ready, so it is safe to bundle with any HTML game meant to run from disk, Itch, or kiosk environments.
