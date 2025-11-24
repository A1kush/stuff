## A1K Transfer Module

Production-ready, framework-agnostic embedding to add player, NPCs, and houses to any HTML page with one script tag or a simple data-manifest attribute.

### Goals
- Zero-build, zero-dependency, vanilla JS.
- Works from file:// and http(s)://.
- Two ways to use:
  - Declarative HTML via data attributes.
  - JSON manifest-driven via a single data-transfer-manifest attribute.
  - Optional Interiors: clickable houses can open an interior overlay driven by another manifest.

### Quick Start (Declarative)

```html
<link rel="stylesheet" href="./transfer/transfer-styles.css" />
<script src="./transfer/transfer-loader.js"></script>

<!-- Player -->
<div
  data-transfer="player"
  data-id="main"
  data-x="128"
  data-y="96"
  data-sprite="assets/player/hero.png"
></div>

<!-- NPC -->
<div
  data-transfer="npc"
  data-id="npc_bob"
  data-x="256"
  data-y="96"
  data-sprite="assets/npcs/bob.png"
  data-name="Bob"
  data-dialogue="Welcome to the city!"
></div>

<!-- House -->
<div
  data-transfer="house"
  data-id="house_1"
  data-x="320"
  data-y="80"
  data-width="64"
  data-height="64"
  data-label="Starter Home"
  data-interior-manifest="./transfer/sample-interior.json"
></div>
```

Initialize after DOM is ready (optional if you use autoInit):
```html
<script>
  window.Transfer && window.Transfer.init();
  // Example: open dev overlay
  // window.Transfer.toggleOverlay(true);
</script>
```

### Quick Start (Manifest)
```html
<link rel="stylesheet" href="./transfer/transfer-styles.css" />
<script src="./transfer/transfer-loader.js" defer></script>

<!-- Single hook, loader fetches JSON and builds everything -->
<div
  data-transfer-manifest="./transfer/manifest.sample.json"
  data-autoinit="true"
></div>
```

### API
```js
await Transfer.init(options?);
Transfer.addPlayer({ id, x, y, sprite, speed? });
Transfer.addNPC({ id, x, y, sprite, name?, dialogue? });
Transfer.addHouse({ id, x, y, width, height, label?, interiorManifest? });
Transfer.remove(id);
Transfer.get(id);
Transfer.list(); // all entities
Transfer.toggleOverlay(showBoolean); // dev markers/labels
Transfer.openInterior(urlOrManifestObject);
Transfer.closeInterior();
```

### Integration Notes
- If your page has a canvas-based world (like `mixed-city-with-ultra-interiors.html`), these elements render as DOM overlays positioned absolutely; you can adapt the `projectToScreen` function in `transfer-loader.js` to align with your camera/viewport if needed.
- For production, set `data-autoinit="true"` on the manifest hook or call `Transfer.init({ autoInit: true })`.
- This module is self-contained and does not require bundling.
 - Interiors render into a modal overlay and use the same entity schema; you can include furniture as `houses` with small widths/heights and labels, or extend as needed.

### Security Notes
- All user-provided strings (name, dialogue, labels) are applied via `textContent` to prevent HTML injection.
- Prefer a strict CSP and consider adding SRI (integrity) attributes when serving scripts from CDNs.


