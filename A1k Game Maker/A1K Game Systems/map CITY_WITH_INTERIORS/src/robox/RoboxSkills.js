(function () {
  const DEFAULT_SKILL_MULTIPLIER = 3;

  function gameState(world) {
    return world?.state || window.gameState || null;
  }

  function ensureShotBuffer(world) {
    const state = gameState(world);
    if (!state) return null;
    if (!state.projectiles) state.projectiles = [];
    return state.projectiles;
  }

  function skillMultiplier(bot) {
    return bot?.skillMultiplier || DEFAULT_SKILL_MULTIPLIER;
  }

  function spawnSwordSwing(bot, world, dmgOverride) {
    const shots = ensureShotBuffer(world);
    if (!shots || !bot) return;
    const facingLeft = !!bot.facingLeft;
    const damage = dmgOverride ?? bot.atk ?? 300;
    const shot = {
      kind: "robox_sword",
      owner: "ally",
      ownerId: bot.id,
      x: bot.x + (facingLeft ? -68 : 28),
      y: bot.y - 26,
      vx: 0,
      vy: 0,
      w: 112,
      h: 70,
      dmg: Math.round(damage),
      life: 160,
      pierce: 0,
      element: "physical",
      color: "#5bffaa",
      tags: ["ally", "slash"],
    };
    shots.push(shot);
    try {
      window.RoboxVFX?.emitDashTrail(bot.x, bot.y, facingLeft);
    } catch (_) {
      /* optional */
    }
  }

  function spawnEnergyBolt(bot, target, world, dmgOverride, speedOverride) {
    const shots = ensureShotBuffer(world);
    if (!shots || !bot) return;
    const damage = dmgOverride ?? bot.atk ?? 300;
    const tx = target?.x ?? bot.x + (bot.facingLeft ? -220 : 220);
    const ty = target?.y ?? bot.y;
    const dx = tx - bot.x;
    const dy = ty - bot.y;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = speedOverride ?? (bot.tuning?.ranged ?? 360);
    const shot = {
      kind: "robox_bolt",
      owner: "ally",
      ownerId: bot.id,
      x: bot.x + (dx / dist) * 28,
      y: bot.y - 22 + (dy / dist) * 10,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      speed,
      dmg: Math.round(damage),
      life: 1400,
      pierce: 0,
      r: 20,
      element: "energy",
      color: "#5ba3ff",
      tags: ["ally", "energy"],
    };
    shots.push(shot);
    try {
      window.RoboxVFX?.emitMuzzleFlash(shot.x, shot.y);
    } catch (_) {
      /* optional */
    }
  }

  function spawnLightningFan(bot, world, dmgOverride) {
    const shots = ensureShotBuffer(world);
    if (!shots || !bot) return;
    const damage = dmgOverride ?? bot.atk ?? 300;
    const count = 6;
    const spacing = Math.PI / 18;
    const speed = (bot.tuning?.ranged ?? 360) + 80;
    for (let i = 0; i < count; i++) {
      const angle = (i - (count - 1) / 2) * spacing;
      const facingLeft = bot.facingLeft ? Math.PI : 0;
      const theta = facingLeft + angle;
      shots.push({
        kind: "robox_laser",
        owner: "ally",
        ownerId: bot.id,
        x: bot.x,
        y: bot.y - 20,
        vx: Math.cos(theta) * speed,
        vy: Math.sin(theta) * speed,
        speed,
        dmg: Math.round(damage),
        life: 900,
        pierce: 1,
        r: 16,
        element: "shock",
        color: "#b57bff",
        tags: ["ally", "shock"],
      });
    }
    try {
      window.RoboxVFX?.emitLightningBurst(bot.x, bot.y - 20);
    } catch (_) {}
  }

  function spawnDomainPulse(bot, world, dmgOverride) {
    const shots = ensureShotBuffer(world);
    if (!shots || !bot) return;
    const damage = dmgOverride ?? bot.atk ?? 300;
    shots.push({
      kind: "robox_domain",
      owner: "ally",
      ownerId: bot.id,
      x: bot.x,
      y: bot.y - 12,
      aoe: 220,
      dmg: Math.round(damage),
      life: 900,
      pierce: 0,
      element: "arcane",
      color: "#5ba3ff",
      tags: ["ally", "zone"],
    });
    try {
      window.RoboxVFX?.emitDomainAura(bot.x, bot.y - 40);
    } catch (_) {}
  }

  function spawnSpiralVolley(bot, world, dmgOverride) {
    const shots = ensureShotBuffer(world);
    if (!shots || !bot) return;
    const damage = dmgOverride ?? bot.atk ?? 300;
    const speed = (bot.tuning?.ranged ?? 360) + 160;
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      shots.push({
        kind: "robox_spiral",
        owner: "ally",
        ownerId: bot.id,
        x: bot.x,
        y: bot.y - 18,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        speed,
        dmg: Math.round(damage),
        life: 1200,
        pierce: 1,
        r: 18,
        element: "arcane",
        color: "#8a2be2",
        tags: ["ally", "arcane"],
      });
    }
    try {
      window.RoboxVFX?.emitFlameRing(bot.x, bot.y - 36);
    } catch (_) {}
  }

  function rollRandomSkill(bot, world) {
    const stamp = performance.now?.() || Date.now();
    const cooldown = bot.skillRandomCooldown || 0;
    if (stamp < cooldown) return;
    const chance = bot.a1kRandomSkillChance ?? 0.18;
    if (Math.random() > chance) return;
    const key = `S${1 + Math.floor(Math.random() * 4)}`;
    if (castSkill(key, bot, world)) {
      bot.skillRandomCooldown = stamp + 2200;
    }
  }

  function primaryFire(bot, target, world) {
    const state = gameState(world);
    if (!bot || !state) return;
    const cycle = bot.attackCycle || (bot.attackCycle = { phase: "melee", count: 0 });
    if (cycle.phase === "melee") {
      spawnSwordSwing(bot, world);
      cycle.count += 1;
      if (cycle.count >= 3) {
        cycle.phase = "ranged";
        cycle.count = 0;
      }
    } else {
      spawnEnergyBolt(bot, target, world);
      cycle.count += 1;
      if (cycle.count >= 3) {
        cycle.phase = "melee";
        cycle.count = 0;
      }
    }
    rollRandomSkill(bot, world);
  }

  function castSkill(key, bot, world) {
    if (!bot) return false;
    const mult = skillMultiplier(bot);
    let handled = false;
    switch (String(key || "").toUpperCase()) {
      case "S1": {
        for (let i = 0; i < 3; i++) spawnSwordSwing(bot, world, bot.atk * mult);
        handled = true;
        break;
      }
      case "S2": {
        spawnLightningFan(bot, world, bot.atk * mult);
        handled = true;
        break;
      }
      case "S3": {
        spawnDomainPulse(bot, world, bot.atk * mult);
        handled = true;
        break;
      }
      case "S4": {
        spawnSpiralVolley(bot, world, bot.atk * mult);
        handled = true;
        break;
      }
      default:
        handled = false;
    }
    if (handled) reset(bot);
    return handled;
  }

  function cast(id, bot, world) {
    if (!bot) return false;
    const key =
      typeof id === "number"
        ? `S${id}`
        : String(id || "")
            .trim()
            .toUpperCase()
            .replace(/^SKILL/, "S");
    return castSkill(key, bot, world);
  }

  function reset(bot) {
    if (bot && bot.attackCycle) {
      bot.attackCycle.phase = "melee";
      bot.attackCycle.count = 0;
    }
  }

  const api = window.RoboxSkills || {};
  api.primaryFire = primaryFire;
  api.cast = cast;
  api.reset = reset;

  window.RoboxSkills = api;
})();
