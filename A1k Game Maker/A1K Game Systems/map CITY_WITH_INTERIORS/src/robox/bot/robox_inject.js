/* Robox HUD bridge – retro comm-link panel without neon VFX. */
(function () {
  if (window.__ROBOX_PANEL__) return;
  window.__ROBOX_PANEL__ = true;

  const doc = document;
  const $ = (sel, root = doc) => root.querySelector(sel);

  // ---------- Styles ----------
  const style = doc.createElement("style");
  style.textContent = `
  #btnAISummon{
    position:fixed;
    left:16px;
    bottom:186px;
    width:32px;
    height:32px;
    border:2px solid #6b5a43;
    border-radius:6px;
    background:#efe5cb;
    color:#2f291e;
    font-size:14px;
    font-weight:700;
    line-height:28px;
    text-align:center;
    cursor:pointer;
    z-index:12002;
    user-select:none;
  }
  #btnAISummon:active{ transform:translateY(1px); }
  #roboxPanel{
    position:fixed;
    left:12px;
    bottom:262px;
    width:680px;
    max-width:92vw;
    background:#e8dec4;
    border:2px solid #6b5a43;
    border-radius:8px;
    box-shadow:0 6px 16px rgba(0,0,0,.35);
    color:#2f291e;
    font:13px/1.25 "ui-monospace", monospace;
    padding:44px 12px 12px 12px;
    display:none;
    z-index:12000;
  }
  #roboxPanel .rbx-row{display:flex;gap:10px;}
  #roboxPanel .rbx-col{background:#f1e7cd;border:2px solid #6b5a43;border-radius:6px;padding:10px;display:flex;flex-direction:column;gap:10px;}
  #roboxPanel .rbx-col h3{margin:0;background:#cdbb95;border:2px solid #6b5a43;border-radius:4px;padding:4px 8px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;text-align:center;}
  #roboxPanel .rbx-meter{display:flex;justify-content:space-between;gap:12px;}
  #roboxPanel .rbx-btn,#roboxPanel .rbx-chip{cursor:pointer;border:2px solid #6b5a43;background:#dfd2af;color:#2f291e;border-radius:6px;padding:6px 10px;user-select:none;text-align:center;}
  #roboxPanel .rbx-btn:active,#roboxPanel .rbx-chip:active{transform:translateY(1px);}
  #roboxPanel .rbx-chip.active{background:#cbb992;}
  #roboxPanel .rbx-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;}
  #roboxPanel .rbx-skills{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;}
  #roboxPanel .rbx-log{min-height:160px;max-height:200px;background:#d6c7a3;border:2px solid #6b5a43;border-radius:6px;overflow:auto;padding:8px;white-space:pre-wrap;}
  #roboxPanel .rbx-footer{display:flex;gap:8px;}
  #roboxPanel input.rbx-cmd{flex:1;min-width:0;padding:8px;border:2px solid #6b5a43;background:#efe5cb;color:#2f291e;border-radius:6px;}
  #roboxPanel .rbx-close{
    position:absolute;
    top:10px;
    right:12px;
    width:26px;
    height:26px;
    border:2px solid #6b5a43;
    border-radius:4px;
    background:#cdbb95;
    color:#2f291e;
    font-weight:700;
    line-height:20px;
    cursor:pointer;
  }
  #roboxPanel .rbx-close:active{transform:translateY(1px);}
  `;
  doc.head.appendChild(style);

  function createCloneSprite() {
    const canvas = doc.createElement("canvas");
    canvas.width = 28;
    canvas.height = 28;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#efe5cb";
    ctx.fillRect(6, 6, 16, 16);
    ctx.strokeStyle = "#6b5a43";
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, 16, 16);
    ctx.fillStyle = "#2f291e";
    ctx.fillRect(9, 10, 4, 4);
    ctx.fillRect(15, 10, 4, 4);
    ctx.beginPath();
    ctx.moveTo(10, 18);
    ctx.lineTo(18, 18);
    ctx.stroke();
    return canvas.toDataURL("image/png");
  }

  const cloneSpriteURL = createCloneSprite();

  // ---------- Boot strap ----------
  function ensureBoot() {
    if (typeof window.bootRoboxModule === "function") {
      try {
        window.bootRoboxModule();
      } catch (err) {
        console.error(err);
      }
      return;
    }
    setTimeout(ensureBoot, 60);
  }
  ensureBoot();

  const topButton = $("#btnAISummonTop");
  let floatingBtn = $("#btnAISummon");
  if (!topButton && !floatingBtn) {
    floatingBtn = doc.createElement("button");
    floatingBtn.id = "btnAISummon";
    floatingBtn.title = "Companion Panel";
    floatingBtn.textContent = "AI";
    doc.body.appendChild(floatingBtn);
  }

  const toggleButtons = [];
  if (topButton) toggleButtons.push(topButton);
  if (floatingBtn) toggleButtons.push(floatingBtn);

  let panel = doc.getElementById("roboxPanel");
  if (!panel) {
    panel = doc.createElement("div");
    panel.id = "roboxPanel";
    panel.innerHTML = `
      <button class="rbx-close" id="rbxClose" aria-label="Close panel">X</button>
      <div class="rbx-row">
        <div class="rbx-col" style="flex:0 0 190px">
          <h3>Companion</h3>
          <div class="rbx-meter">
            <div>Lvl <span id="rbxLvl">1.0</span></div>
            <div>Mode <span id="rbxMode">Follow</span></div>
          </div>
          <div class="rbx-grid">
            <div class="rbx-btn" id="rbxSummon">Summon</div>
            <div class="rbx-btn" id="rbxDespawn">Despawn</div>
          </div>
        </div>
        <div class="rbx-col" style="flex:0 0 220px">
          <h3>Tactics</h3>
          <div class="rbx-grid">
            <div class="rbx-chip active" data-mode="follow" id="rbxFollow">Follow</div>
            <div class="rbx-chip" data-mode="hunt" id="rbxHunt">Hunt</div>
            <div class="rbx-chip" data-mode="assist" id="rbxAssist">Assist</div>
            <div class="rbx-chip" data-action="return" id="rbxReturn">Return</div>
          </div>
          <h3>Skills</h3>
          <div class="rbx-skills">
            <div class="rbx-btn" id="rbxS1">S1</div>
            <div class="rbx-btn" id="rbxS2">S2</div>
            <div class="rbx-btn" id="rbxS3">S3</div>
            <div class="rbx-btn" id="rbxS4">S4</div>
          </div>
        </div>
        <div class="rbx-col">
          <h3>Comm-Link</h3>
          <div class="rbx-log" id="rbxLog">Tip: Press Summon to deploy the companion.</div>
          <div class="rbx-footer">
            <input id="rbxCmd" class="rbx-cmd" placeholder="Give a command..." maxlength="120">
            <div class="rbx-btn" id="rbxSend">Send</div>
          </div>
        </div>
      </div>
    `;
    doc.body.appendChild(panel);
  }

  const logBox = $("#rbxLog", panel);
  const lvlLabel = $("#rbxLvl", panel);
  const modeLabel = $("#rbxMode", panel);
  const cmdInput = $("#rbxCmd", panel);
  const sendButton = $("#rbxSend", panel);
  const modeButtons = {
    follow: $("#rbxFollow", panel),
    hunt: $("#rbxHunt", panel),
    assist: $("#rbxAssist", panel),
  };
  const returnButton = $("#rbxReturn", panel);
  const skillButtons = {
    S1: $("#rbxS1", panel),
    S2: $("#rbxS2", panel),
    S3: $("#rbxS3", panel),
    S4: $("#rbxS4", panel),
  };

  const assistState = {
    active: false,
    saved: new Map(),
    targetY: null,
    raf: 0,
    platform: null,
    hoverY: null,
    phase: null,
    direction: 1,
    waitUntil: 0,
    xTarget: null,
    boarded: new Set(),
  };

  function log(message) {
    if (!logBox) return;
    const prefix = logBox.textContent ? `${logBox.textContent}\n` : "";
    logBox.textContent = `${prefix}AI: ${message}`;
    logBox.scrollTop = logBox.scrollHeight;
  }

  function roboxAPI() {
    return window.RoboxAI && window.RoboxAI.spawn ? window.RoboxAI : null;
  }

  function ensureRobox(cb) {
    const api = roboxAPI();
    if (api) {
      cb(api);
    } else {
      log("Robox core not ready yet.");
    }
  }

  function updateLevel() {
    const api = roboxAPI();
    if (!api) return;
    const bot = api.get?.();
    if (bot && typeof bot.level === "number") {
      lvlLabel.textContent = bot.level.toFixed(1);
    }
  }

  function setActiveMode(mode) {
    Object.values(modeButtons).forEach((btn) => btn?.classList.remove("active"));
    const btn = modeButtons[mode];
    if (btn) btn.classList.add("active");
    if (modeLabel) {
      modeLabel.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
    }
  }

  const modeMap = {
    follow: "follow",
    hunt: "aggro",
    assist: "assist",
  };

  const modeAlias = {
    aggro: "hunt",
    guard: "follow",
  };

  function findLandingY(x, y) {
    const solids = (window.Platform?.layers?.solids) || [];
    let best = null;
    for (const solid of solids) {
      if (!solid) continue;
      const sx = solid.x || 0;
      const sw = solid.w || 0;
      const sy = solid.y || 0;
      const within = x >= sx - 24 && x <= sx + sw + 24;
      if (within && sy > y) {
        if (best === null || sy < best) best = sy;
      }
    }
  if (best === null) {
    return y + 160;
  }
  return best - 40;
}

  function locatePlatform(x, y) {
    const solids = (window.Platform?.layers?.solids) || [];
    let best = null;
    let bestScore = Infinity;
    for (const solid of solids) {
      if (!solid) continue;
      const top = solid.y ?? 0;
      const width = solid.w ?? 160;
      const left = solid.x ?? 0;
      const right = left + width;
      const vertical = top >= y ? top - y : Infinity;
      if (vertical === Infinity) continue;
      const horiz = x < left ? left - x : x > right ? x - right : 0;
      const score = vertical * 1.5 + horiz;
      if (score < bestScore) {
        bestScore = score;
        best = { left, right, width, y: top };
      }
    }
    if (!best) {
      return { left: x - 80, right: x + 80, width: 160, y: y + 160 };
    }
    return best;
  }

  function computePlatformRoute(base) {
    if (!base) return { startX: base?.left ?? 0, endX: base?.right ?? 0 };
    const solids = (window.Platform?.layers?.solids) || [];
    const strip = solids.filter((solid) => {
      if (!solid) return false;
      const top = solid.y ?? 0;
      return Math.abs(top - base.y) < 6;
    });
    if (!strip.length) {
      return { startX: base.left, endX: base.right };
    }
    let min = base.left;
    let max = base.right;
    strip.forEach((solid) => {
      const left = solid.x ?? min;
      const right = (solid.x ?? min) + (solid.w ?? 0);
      if (left < min) min = left;
      if (right > max) max = right;
    });
    const pad = Math.min(96, (max - min) * 0.08);
    const startX = min + pad;
    const endX = max - pad;
    return { startX, endX };
  }

  function stopAssistCarry(message) {
    if (assistState.raf) {
      cancelAnimationFrame(assistState.raf);
      assistState.raf = 0;
    }
    if (!assistState.active) {
      if (message) log(message);
      return;
    }
    assistState.active = false;
    const st = window.gameState;
    if (st?.party) {
      st.party.forEach((player) => {
        const saved = assistState.saved.get(player);
        if (saved) {
          player.invulnerable = saved.invulnerable || false;
        }
      });
    }
    assistState.saved.clear();
    assistState.boarded.clear();
    assistState.targetY = null;
    assistState.platform = null;
    assistState.phase = null;
    assistState.hoverY = null;
    assistState.direction = 1;
    assistState.waitUntil = 0;
    assistState.xTarget = null;
    if (message) log(message);
  }

  function assistStep() {
    if (!assistState.active) {
      assistState.raf = 0;
      return;
    }
    const api = roboxAPI();
    const st = window.gameState;
    const bot = api?.get?.();
    const players = (st?.party || []).filter((p) => p && p.hp > 0);
    if (!api || !st || !bot || !players.length) {
      stopAssistCarry("Assist aborted.");
      return;
    }
    if (!assistState.platform) {
      stopAssistCarry("Assist platform lost.");
      return;
    }
    if (!assistState.boarded.size) {
      stopAssistCarry("Assist complete.");
      return;
    }

    const platform = assistState.platform;
    const now = performance.now?.() || Date.now();

    if (assistState.phase === "carry") {
      const hoverY = assistState.hoverY ?? platform.y - 40;
      assistState.hoverY = hoverY;
      const targetX = assistState.direction > 0 ? platform.endX : platform.startX;
      assistState.xTarget = targetX;

      const missing = [];
      assistState.boarded.forEach((player) => {
        if (!players.includes(player)) {
          missing.push(player);
          return;
        }
        if (!assistState.saved.has(player)) {
          assistState.saved.set(player, { invulnerable: !!player.invulnerable });
        }
        player.invulnerable = true;
        if (typeof player.vx === "number") player.vx = 0;
        if (typeof player.vy === "number") player.vy = 0;
        player.x += (bot.x - player.x) * 0.25;
        player.y += ((hoverY - 14) - player.y) * 0.25;
      });
      if (missing.length) {
        missing.forEach((player) => assistState.boarded.delete(player));
      }

      bot.y += (hoverY - bot.y) * 0.18;
      const deltaX = targetX - bot.x;
      const step = Math.max(-6, Math.min(6, deltaX));
      bot.x += step * 0.12;

      if (Math.abs(deltaX) < 6) {
        assistState.boarded.forEach((player) => {
          player.y = platform.y - 36;
        });
        assistState.phase = "wait";
        assistState.waitUntil = now + 10000;
        assistState.saved.forEach((saved, player) => {
          if (assistState.boarded.has(player)) {
            player.invulnerable = saved ? saved.invulnerable : false;
          }
        });
        assistState.saved.clear();
      }
    } else if (assistState.phase === "wait") {
      const anchorY = platform.y - 4;
      bot.y += (anchorY - bot.y) * 0.3;
      if (assistState.xTarget != null) {
        bot.x += (assistState.xTarget - bot.x) * 0.2;
      }
      if (now >= (assistState.waitUntil || now)) {
        const missing = [];
        assistState.boarded.forEach((player) => {
          if (!players.includes(player)) missing.push(player);
        });
        if (missing.length) {
          missing.forEach((player) => assistState.boarded.delete(player));
        }
        const stillOnboard = [];
        assistState.boarded.forEach((player) => {
          const dx = Math.abs((player.x ?? 0) - bot.x);
          const dy = Math.abs((player.y ?? 0) - (platform.y - 36));
          if (dx < 48 && dy < 36) {
            stillOnboard.push(player);
          }
        });
        if (!stillOnboard.length) {
          stopAssistCarry("Assist complete.");
          return;
        }
        assistState.boarded = new Set(stillOnboard);
        assistState.direction *= -1;
        assistState.phase = "carry";
        assistState.waitUntil = 0;
      }
    }

    assistState.raf = requestAnimationFrame(assistStep);
  }

  function startAssistCarry(api) {
    if (assistState.active) return;
    let bot = api.get?.();
    if (!bot) {
      bot = api.spawn?.({ mode: "assist" });
    }
    if (!bot) {
      log("Assist unavailable (cannot locate companion).");
      return;
    }
    const st = window.gameState;
    const players = (st?.party || []).filter((p) => p && p.hp > 0);
    if (!players.length) {
      log("Assist unavailable (no active players).");
      return;
    }
    const plat = locatePlatform(bot.x ?? 0, bot.y ?? 0);
    const route = computePlatformRoute(plat);
    let startX = route.startX ?? plat.left;
    let endX = route.endX ?? plat.right;
    if (startX >= endX) {
      const mid = (plat.left + plat.right) / 2;
      startX = mid - 40;
      endX = mid + 40;
    }
    assistState.platform = {
      startX,
      endX,
      y: plat.y,
      left: plat.left,
      right: plat.right,
    };
    assistState.hoverY = plat.y - 48;
    assistState.direction = 1;
    assistState.xTarget = assistState.platform.endX;
    bot.x = assistState.platform.startX;
    bot.y = assistState.hoverY;
    assistState.phase = "carry";
    assistState.waitUntil = 0;
    assistState.active = true;
    assistState.saved.clear();
    assistState.boarded = new Set(players);
    assistState.targetY = null;
    assistState.raf = requestAnimationFrame(assistStep);
    log("Assist formation engaged.");
  }

  function applyMode(mode) {
    const normalized = modeAlias[mode] || mode;
    const next = modeMap[normalized] || "follow";
    ensureRobox((api) => {
      api.setMode?.(next);
      setActiveMode(normalized);
      if (normalized === "assist") {
        startAssistCarry(api);
      } else {
        stopAssistCarry();
      }
      log(`Mode set to ${normalized}.`);
    });
  }

  function handleReturn() {
    ensureRobox((api) => {
      stopAssistCarry();
      const bot = api.get?.();
      if (!bot) {
        log("No active companion to recall.");
        return;
      }
      bot.a1k = bot.a1k || {};
      bot.a1k.hunt = bot.a1k.hunt || {};
      bot.a1k.hunt.returning = true;
      log("Return order acknowledged.");
    });
  }

  function playSummonClones() {
    ensureRobox((api) => {
      const bot = api.get?.();
      const canvas = doc.getElementById("cv");
      const st = window.gameState;
      if (!bot || !canvas || !st) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = rect.width / (canvas.width || rect.width || 1);
      const scaleY = rect.height / (canvas.height || rect.height || 1);
      const camX = st.camX || st.cameraX || 0;
      const camY = st.camY || st.cameraY || 0;
      const baseX = rect.left + (bot.x - camX) * scaleX;
      const baseY = rect.top + (bot.y - camY) * scaleY;

      const ghosts = Array.from({ length: 3 }, () => {
        const img = doc.createElement("img");
        img.src = cloneSpriteURL;
        img.width = 24;
        img.height = 24;
        img.style.position = "fixed";
        img.style.pointerEvents = "none";
        img.style.opacity = "0.75";
        doc.body.appendChild(img);
        return img;
      });

      const start = performance.now();
      (function step() {
        const t = (performance.now() - start) / 800;
        ghosts.forEach((g, idx) => {
          const angle = t * 6 + idx * 2.094;
          const x = baseX + Math.cos(angle) * 18;
          const y = baseY + Math.sin(angle) * 12 - 24;
          g.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
          g.style.opacity = String(Math.max(0, 0.7 * (1 - t)));
        });
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          ghosts.forEach((g) => g.remove());
        }
      })();
    });
  }

  function processCommand(raw) {
    const text = String(raw || "").trim();
    if (!text) return;
    const parts = text.split(/\s+/);
    const root = parts[0].toLowerCase();

    switch (root) {
      case "/summon":
        ensureRobox((api) => {
          const bot = api.spawn();
          if (bot) {
            log("Companion online.");
            playSummonClones();
            updateLevel();
          } else {
            log("Unable to deploy companion.");
          }
        });
        break;
      case "/despawn":
        stopAssistCarry();
        ensureRobox((api) => {
          api.despawn?.();
          log("Companion dismissed.");
        });
        break;
      case "/mode":
        applyMode((parts[1] || "follow").toLowerCase());
        break;
      case "/return":
        handleReturn();
        break;
      case "/create":
        ensureRobox((api) => {
          let bot = api.get?.();
          if (!bot) {
            bot = api.spawn?.();
            log(bot ? "Companion created." : "Unable to create companion.");
          } else {
            log("Companion already active.");
          }
          if (bot) playSummonClones();
        });
        break;
      case "/s1":
      case "/s2":
      case "/s3":
      case "/s4":
        ensureRobox((api) => {
          api.cast?.(root.slice(1).toUpperCase());
          log(`Skill ${root.slice(1).toUpperCase()} queued.`);
        });
        break;
      default:
        log(`Unknown command: ${text}`);
    }
  }

  modeButtons.follow?.addEventListener("click", () => applyMode("follow"));
  modeButtons.hunt?.addEventListener("click", () => applyMode("hunt"));
  modeButtons.assist?.addEventListener("click", () => applyMode("assist"));
  returnButton?.addEventListener("click", handleReturn);
  doc.getElementById("rbxClose")?.addEventListener("click", () => {
    panel.style.display = "none";
  });

  $("#rbxSummon", panel)?.addEventListener("click", () => processCommand("/summon"));
  $("#rbxDespawn", panel)?.addEventListener("click", () => processCommand("/despawn"));
  Object.entries(skillButtons).forEach(([key, btn]) => {
    btn?.addEventListener("click", () => processCommand(`/${key.toLowerCase()}`));
  });

  sendButton?.addEventListener("click", () => {
    const value = (cmdInput?.value || "").trim();
    if (!value) return;
    log(">> " + value);
    processCommand(value);
    cmdInput.value = "";
  });
  cmdInput?.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      sendButton?.click();
    }
  });

  function placeFloatingButton() {
    if (!floatingBtn || floatingBtn === topButton) return;
    const bag = $("#btnBag") || $("#btnBagQuick");
    if (bag) {
      const rect = bag.getBoundingClientRect();
      floatingBtn.style.position = "fixed";
      floatingBtn.style.left = `${Math.round(rect.right + 8)}px`;
      floatingBtn.style.top = `${Math.round(rect.top)}px`;
      floatingBtn.style.bottom = "";
    } else {
      floatingBtn.style.left = "16px";
      floatingBtn.style.bottom = "186px";
      floatingBtn.style.top = "";
    }
  }

  if (floatingBtn && floatingBtn !== topButton) {
    if (typeof ResizeObserver === "function") {
      const observer = new ResizeObserver(placeFloatingButton);
      observer.observe(doc.documentElement);
    }
    window.addEventListener("orientationchange", placeFloatingButton);
    window.addEventListener("resize", placeFloatingButton);
    window.addEventListener("load", placeFloatingButton);
    placeFloatingButton();
  }

  function togglePanel() {
    panel.style.display = panel.style.display === "block" ? "none" : "block";
    if (panel.style.display === "block") {
      log("Comm-link online.");
      updateLevel();
      placeFloatingButton();
    }
  }
  toggleButtons.forEach((button) => button?.addEventListener("click", togglePanel));

  setActiveMode("follow");
  log("Comm-link initialized.");

  // ---------- External helpers ----------
  window.AI_SUMMON = () => processCommand("/summon");
  window.AI_CMD = processCommand;
  window.AI_SET_MODE = (mode) => applyMode((mode || "follow").toLowerCase());
})();

