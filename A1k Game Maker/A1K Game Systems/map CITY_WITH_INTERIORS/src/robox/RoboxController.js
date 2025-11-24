(function () {
  const DEFAULT_TUNING = {
    speed: 140,
    ranged: 300,
    melee: 90,
    fireCd: 420,
  };

  const RoboxController = (() => {
    let engine = null;

    function state() {
      return engine?.state || window.gameState;
    }

    function ensureArray() {
      const st = state();
      if (!st) return null;
      if (!Array.isArray(st.aiCompanions)) {
        st.aiCompanions = [];
      }
      return st.aiCompanions;
    }

    function list() {
      const st = state();
      return Array.isArray(st?.aiCompanions) ? st.aiCompanions : [];
    }

    function get() {
      return list().find((bot) => bot.kind === "robox") || null;
    }

    function spawn(options = {}) {
      const st = state();
      if (!st) return null;
      const store = ensureArray();
      if (!store) return null;
      const existing = get();
      if (existing) {
        if (options.mode) existing.mode = options.mode;
        if (options.targetMode) existing.targetMode = options.targetMode;
        return existing;
      }

      const create = window.RoboxCreateEntity;
      if (typeof create !== "function") {
        console.warn("[Robox] createRoboxEntity missing");
        return null;
      }

      const leader = st.party?.[0] || null;
      const spawnX = options.x ?? (leader ? leader.x - 70 : 320);
      const spawnY = options.y ?? (leader ? leader.y : 400);

      const bot = create({
        x: spawnX,
        y: spawnY,
        leaderId: leader?.id ?? null,
        tuning: { ...DEFAULT_TUNING },
        mode: options.mode || "follow",
        targetMode: options.targetMode || "nearest",
      });

      store.push(bot);
      engine?.dispatch?.("robox/spawned", bot);
      window.notify?.("Robox AI online", "#5ba3ff");
      return bot;
    }

    function despawn() {
      const st = state();
      if (!st?.aiCompanions) return;
      const idx = st.aiCompanions.findIndex((bot) => bot.kind === "robox");
      if (idx >= 0) {
        const removed = st.aiCompanions.splice(idx, 1)[0];
        if (removed) removed.alive = false;
        engine?.dispatch?.("robox/despawned", removed);
        window.notify?.("Robox offline", "#ff6666");
      }
    }

    function setMode(mode) {
      const bot = get();
      if (!bot) return;
      bot.mode = mode;
      bot.lastModeChange = performance.now?.() || Date.now();
    }

    function setTargetMode(mode) {
      const bot = get();
      if (!bot) return;
      bot.targetMode = mode;
    }

    function cast(id) {
      const bot = get();
      if (!bot) return;
      bot.pendingSkill = id;
    }

    function applyTuning(values = {}) {
      const bot = get();
      if (!bot) return;
      bot.tuning = bot.tuning || { ...DEFAULT_TUNING };
      if (typeof values.speed === "number") bot.tuning.speed = values.speed;
      if (typeof values.ranged === "number") bot.tuning.ranged = values.ranged;
      if (typeof values.melee === "number") bot.tuning.melee = values.melee;
      if (typeof values.fireCd === "number") {
        bot.tuning.fireCd = Math.max(160, values.fireCd);
        bot.fireRate = bot.tuning.fireCd;
      }
    }

    function attach(gameEngine) {
      engine = gameEngine;
      const api = (window.RoboxAI = window.RoboxAI || {});
      Object.assign(api, {
        __installed: true,
        spawn,
        despawn,
        get,
        list,
        setMode,
        setTargetMode,
        cast,
        applyTuning,
      });
      window.AI_SUMMON =
        window.AI_SUMMON ||
        function () {
          spawn();
        };
      return api;
    }

    return {
      attach,
      spawn,
      despawn,
      get,
      list,
      setMode,
      setTargetMode,
      cast,
      applyTuning,
    };
  })();

  window.RoboxController = RoboxController;
})();
