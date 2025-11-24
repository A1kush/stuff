import { WORLD } from './buildings-data.js';
import { WorldRenderer } from './world-renderer.js';
import { HouseInterior } from './house-interior.js';
import { PlayerController } from './player-controller.js';
import { MiniMap } from './minimap.js';
import { UISystem } from './ui-system.js';

(function start() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const world = new WorldRenderer(canvas);
  const interior = new HouseInterior(canvas);
  const player = new PlayerController(world, interior);
  const minimap = new MiniMap(canvas);
  const ui = new UISystem(canvas);

  let last = performance.now();

  function loop(now) {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;

    player.update(dt);
    if (!player.interiorMode) {
      world.render();
      minimap.set(player.x, world.cameraX);
      minimap.draw();
      ui.drawTopLeft([
        'Arrow Keys: Move | E: Enter/Exit',
        'Explore all 11 zones and enter buildings',
      ]);
    }
    player.draw();
    ui.drawInfoPanel();
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
