/*
 * A1K AI Skills Rework and Stats Tracker
 *
 * This script augments the built‑in AIBotSystem with new skill behaviours
 * (Clone, Black Hole Glitch, Storm Rail and Chrono Overdrive) and
 * tracks basic combat statistics. It does not alter the underlying
 * entity model, but hooks into existing methods via closures. It is
 * safe to include multiple times; it guards against re‑applying the
 * patches by checking for the presence of a sentinel property on
 * AIBotSystem.
 */
(function(){
  function patch(){
    const B = window.AIBotSystem;
    if (!B || B.__skillsReworked) return !B ? setTimeout(patch, 60) : undefined;
    B.__skillsReworked = true;

    // Helper for random floats
    const rnd = (a, b) => a + Math.random() * (b - a);

    // Initialize stats container if missing
    B.__stats = B.__stats || { dmg: 0, kills: 0, shots: 0, casts: [0,0,0,0], uptime: 0 };

    /*
     * Override updateShots to support per‑shot damage, piercing and
     * statistics accumulation. This wrapper iterates over the bot's
     * current projectile list, advances them by dt, applies damage to
     * enemies, and collects totals. It preserves any existing shot
     * properties such as r (radius), life and pierce. When a shot's
     * pierce count reaches zero it is discarded on the next frame.
     */
    const originalUpdateShots = B.updateShots?.bind(B);
    B.updateShots = function(dt){
      // Fallback to original logic if defined
      if (!Array.isArray(this.shots)) this.shots = [];
      const st = window.st;
      const keep = [];
      const now = performance.now();
      for (const s of this.shots){
        // Integrate velocity
        s.x += s.vx * (dt/1000);
        s.y += s.vy * (dt/1000);
        // Expire shots past their life
        if (now - (s.born || now) > (s.life || 1200)) continue;
        let hit = false;
        const enemies = (st?.enemies || []);
        for (const e of enemies){
          if (!e || e.dead) continue;
          // Simple circle vs AABB collision
          const w = e.w || 24;
          const h = e.h || 24;
          const ax = (e.x || 0) - w/2;
          const ay = (e.y || 0) - h/2;
          const cx = Math.max(ax, Math.min(s.x, ax + w));
          const cy = Math.max(ay, Math.min(s.y, ay + h));
          const dx = s.x - cx;
          const dy = s.y - cy;
          const r = s.r || 4;
          if (dx*dx + dy*dy <= r*r){
            hit = !(s.pierce && --s.pierce > 0);
            const dmg = s.dmg || 22;
            // Apply damage
            e.hp = Math.max(0, (e.hp || 50) - dmg);
            // Kill tracking
            if (e.hp === 0 && !e.dead) { e.dead = true; B.__stats.kills++; }
            // Damage totals
            B.__stats.dmg += dmg;
            // Visual feedback if available
            try {
              
              if (window.VFX && window.VFX.play) VFX.play('spark',{x:s.x, y:s.y, size:1.0});
            } catch(_) {}
            if(!hit) break;
          }
        }
        if (!hit) keep.push(s);
      }
      this.shots = keep;
      // Call original logic if it exists (e.g. for additional effects)
      if (typeof originalUpdateShots === 'function') originalUpdateShots(dt);
    };

    // Helper to fire a new projectile with optional overrides
    function fire(x, y, vx, vy, opt = {}){
      const shot = Object.assign({ x, y, vx, vy, r: 4, life: 1200, born: performance.now() }, opt);
      B.shots.push(shot);
      B.__stats.shots++;
    }

    // Helper to find nearest N enemies within a radius
    function nearestEnemies(n = 1, radius = 220){
      const st = window.st;
      const enemies = (st?.enemies || []).filter(e => e && !e.dead);
      const out = [];
      for (const e of enemies){
        const d = Math.hypot((e.x || 0) - B.x, (e.y || 0) - B.y);
        if (d <= radius) out.push({ e, d });
      }
      out.sort((a,b) => a.d - b.d);
      return out.slice(0,n).map(o => o.e);
    }

    // Clone management for S1
    const clones = [];
    const originalDraw = B.draw?.bind(B);
    const originalUpdate = B.update?.bind(B);
    // Draw clones with a translucent ghost
    function drawGhost(ctx, x, y, t){
      ctx.save();
      ctx.globalAlpha = 0.55 + 0.35 * Math.sin(t * 0.01);
      ctx.fillStyle = '#0a0b10';
      ctx.strokeStyle = '#9fd7ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 10, y - 14);
      ctx.quadraticCurveTo(x, y - 22, x + 10, y - 14);
      ctx.lineTo(x + 10, y + 10);
      ctx.quadraticCurveTo(x, y + 18, x - 10, y + 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    B.draw = function(ctx, t){
      if (typeof originalDraw === 'function') originalDraw(ctx, t);
      for (const c of clones) drawGhost(ctx, c.x, c.y, t);
    };

    // Override update to handle clones and uptime tracking
    B.update = function(dt){
      if (typeof originalUpdate === 'function') originalUpdate(dt);
      B.__stats.uptime += dt / 1000;
      // Update clones (follow and fire)
      for (let i = clones.length - 1; i >= 0; i--){
        const c = clones[i];
        c.t -= dt;
        if (c.t <= 0){ clones.splice(i,1); continue; }
        // Follow behind the bot with a slight offset
        c.x += ((B.x + (i ? -20 : 20)) - c.x) * 0.18;
        c.y += (B.y - c.y) * 0.18;
        c.cool -= dt;
        if (c.cool <= 0){
          c.cool = 180;
          const target = nearestEnemies(1, 260)[0];
          const tx = target ? target.x : c.x + 1;
          const ty = target ? target.y : c.y;
          const dx = tx - c.x;
          const dy = ty - c.y;
          const len = Math.hypot(dx, dy) || 1;
          fire(c.x, c.y, (dx/len) * 520, (dy/len) * 520, { dmg: 28 });
        }
      }
    };

    // S2: Black Hole Glitch — pulls up to two normal enemies and deletes them
    function blackHole(){
      const victims = nearestEnemies(2, 180).filter(e => !(e.boss || e.elite));
      if (!victims.length){ try{ notify('Black Hole: no valid victims', '#a8b7ce'); }catch(_){} return; }
      const cx = B.x + 16;
      const cy = B.y - 8;
      // Trigger an optional VFX if available
      try{ if (window.VFX && VFX.play) VFX.play('blackhole', { x: cx, y: cy, size: 1.2 }); } catch(_){}
      // Attach a private animation state to each victim
      for (const e of victims){ e._blackHole = { t: 700 }; }
      function step(){
        let done = true;
        for (const e of victims){
          const state = e._blackHole;
          if (!state || e.dead) continue;
          done = false;
          state.t -= 16;
          // Pull enemy toward the singularity
          e.x += (cx - e.x) * 0.22;
          e.y += (cy - e.y) * 0.22;
          if (state.t <= 0){
            e.hp = 0;
            e.dead = true;
            B.__stats.kills++;
            delete e._blackHole;
          }
        }
        if (!done) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    // S3: Storm Rail — piercing railgun shot plus radial arcs
    function stormRail(){
      const base = { dmg: 90, r: 5, life: 260, pierce: 6 };
      for (let i = 0; i < 5; i++){
        fire(B.x + 10, B.y - 6, 900, rnd(-40, 40), Object.assign({}, base));
      }
      try{ if (window.VFX && VFX.play) VFX.play('laser', { x: B.x + 12, y: B.y - 6, size: 1.2 }); }catch(_){ }
      // Emit side arcs
      for (let k = 0; k < 6; k++){
        const a = (k / 6) * Math.PI * 2;
        fire(B.x, B.y, Math.cos(a) * 520, Math.sin(a) * 520, { dmg: 35, life: 300 });
      }
    }

    // S4: Chrono Overdrive — time dilation and orbiting blades
    function overdrive(){
      B.overdriveT = 5000;
      try{ if (window.VFX && VFX.play) VFX.play('shock', { x: B.x, y: B.y, size: 1.3 }); }catch(_){ }
      let t = 0;
      function emit(){
        if (B.overdriveT <= 0) return;
        t += 1/60;
        for (let i = 0; i < 3; i++){
          const angle = t * 6 + i * 2.094;
          const vx = Math.cos(angle) * 700;
          const vy = Math.sin(angle) * 700;
          fire(B.x, B.y, vx, vy, { dmg: 48, life: 300 });
        }
        requestAnimationFrame(emit);
      }
      emit();
    }

    // Throttle base fire rate during overdrive
    const originalTryFire = B.tryFire?.bind(B);
    B.tryFire = function(dt){
      if (B.overdriveT > 0) this.fireCD -= dt * 1.5;
      if (typeof originalTryFire === 'function') originalTryFire(dt);
      if (B.overdriveT > 0) B.overdriveT -= dt;
    };

    // Hook cast() to our new skills
    const originalCast = B.cast?.bind(B);
    B.cast = function(i){
      switch (i){
        case 0: clones.push({ x: B.x - 18, y: B.y - 4, t: 8000, cool: 120 }); B.__stats.casts[0]++; return;
        case 1: blackHole(); B.__stats.casts[1]++; return;
        case 2: stormRail(); B.__stats.casts[2]++; return;
        case 3: overdrive(); B.__stats.casts[3]++; return;
        default: break;
      }
      if (typeof originalCast === 'function') originalCast(i);
    };

    // Periodically update DPS and stats panel
    (function(){
      const hist = [];
      setInterval(() => {
        hist.push(B.__stats.dmg);
        if (hist.length > 10) hist.shift();
        const dps = hist.length ? (hist[hist.length - 1] - hist[0]) / 10 : 0;
        const el = document.getElementById('aiStats');
        if (el){
          el.textContent =
            `DPS: ${dps.toFixed(1)} | DMG: ${Math.floor(B.__stats.dmg)} | Kills: ${Math.floor(B.__stats.kills)} | ` +
            `Shots: ${Math.floor(B.__stats.shots)} | Uptime: ${B.__stats.uptime.toFixed(1)}s`;
        }
      }, 300);
    })();
  }
  patch();
})();