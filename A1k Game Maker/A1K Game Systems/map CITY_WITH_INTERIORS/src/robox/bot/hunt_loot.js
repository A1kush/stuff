/*
 * A1K AI Hunt and Loot Behaviour
 *
 * This script extends AIBotSystem with two additional modes: `hunt`
 * and `loot`. When set to `hunt`, the bot aggressively moves
 * towards the closest enemy within a reasonable range. In `loot` mode
 * the bot seeks out the nearest pickup (coins, chests, etc.) and
 * navigates to it, or idles near the player when nothing is nearby.
 *
 * It also installs shortcut commands `/hunt` and `/loot` into the
 * global AI_CMD parser, automatically enabling leader mode when
 * invoked. The patch is idempotent and will retry if AIBotSystem is
 * not yet available.
 */
(function(){
  function patch(){
    const B = window.AIBotSystem;
    if (!B || B.__huntLootPatched) return !B ? setTimeout(patch, 60) : undefined;
    B.__huntLootPatched = true;

    // Capture original update to layer behaviours
    const originalUpdate = (typeof B.update === 'function') ? B.update.bind(B) : null;

    // Distance helper
    const dist = (a, b) => Math.hypot((a.x || 0) - (b.x || 0), (a.y || 0) - (b.y || 0));

    // Returns the nearest living enemy within maxRadius or null
    function nearestEnemy(maxRadius = 800){
      const st = window.st;
      const enemies = (st?.enemies || []).filter(e => e && !e.dead);
      let best = null; let bestD = Infinity;
      for (const e of enemies){
        const d = dist(e, B);
        if (d < bestD && d <= maxRadius){ best = e; bestD = d; }
      }
      return best;
    }

    // Returns the nearest pickup (doors, chests, etc.) within maxRadius or null
    function nearestPickup(maxRadius = 900){
      const st = window.st;
      const ps = (st?.pickups || []).filter(p => p && !p.dead);
      let best = null; let bestD = Infinity;
      for (const p of ps){
        const d = dist(p, B);
        if (d < bestD && d <= maxRadius){ best = p; bestD = d; }
      }
      return best;
    }

    // Simple seek function: move toward target (tx, ty) at a given speed
    function seek(dt, tx, ty, speed = B.speed * 0.95){
      const dx = tx - B.x;
      const dy = ty - B.y;
      const d = Math.hypot(dx, dy) || 1;
      if (d > 4){
        B.x += (dx/d) * speed * (dt/1000);
        B.y += (dy/d) * speed * (dt/1000);
      }
    }

    // Override update to inject hunt/loot logic
    B.update = function(dt){
      if (typeof originalUpdate === 'function') originalUpdate(dt);
      // Only operate if active
      if (!B.active) return;
      const mode = String(B.mode || '').toLowerCase();
      if (mode === 'hunt'){
        const target = nearestEnemy(1200);
        if (target){ seek(dt, target.x, target.y); }
        return;
      }
      if (mode === 'loot'){
        const item = nearestPickup(1600);
        if (item){ seek(dt, item.x, item.y, B.speed * 1.05); }
        else {
          // drift near the player when no loot; stay slightly behind
          const leader = window.st?.players?.[window.st?.leader || 0];
          if (leader) seek(dt, leader.x - 60, leader.y);
        }
        return;
      }
      // fallback: no extra behaviour for other modes
    };

    // Extend AI_CMD for quick /hunt and /loot commands
    const oldAI_CMD = window.AI_CMD;
    window.AI_CMD = function(line = ''){
      const s = String(line || '').trim().toLowerCase();
      if (s === '/hunt' || s === '/mode hunt'){
        B.mode = 'hunt';
        B.setLeaderMode?.(true);
        try { notify('Mode hunt', '#9fd7ff'); } catch(_){}
        return;
      }
      if (s === '/loot' || s === '/mode loot'){
        B.mode = 'loot';
        B.setLeaderMode?.(true);
        try { notify('Mode loot', '#9fd7ff'); } catch(_){}
        return;
      }
      return oldAI_CMD ? oldAI_CMD(line) : undefined;
    };
  }
  patch();
})();