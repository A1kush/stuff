function annotate(shot, tags) {
  try {
    if (typeof window.annotateProjectile === "function") {
      window.annotateProjectile(shot, tags);
    }
  } catch (_) {
    /* palette helper not critical */
  }
}

const RoboxProjectiles = {
  makePulseShot(bot, target) {
    if (!bot || !target) return null;
    const dx = target.x - bot.x;
    const dy = target.y - bot.y;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = bot.tuning?.ranged ?? 360;
    const shot = {
      kind: "robox_pulse",
      owner: "ally",
      ownerId: bot.id,
      x: bot.x + (dx / dist) * 22,
      y: bot.y - 22 + (dy / dist) * 8,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      speed,
      dmg: Math.round(bot.atk * 1.1),
      life: 1200,
      pierce: 0,
      r: 18,
      element: "shock",
      color: "#b57bff",
      tags: ["energy", "ally", "shock"],
    };
    annotate(shot, shot.tags);
    return shot;
  },

  makeDash(bot) {
    const shot = {
      kind: "robox_dash",
      owner: "ally",
      ownerId: bot.id,
      x: bot.x + (bot.facingLeft ? -20 : 20),
      y: bot.y - 10,
      vx: (bot.facingLeft ? -1 : 1) * 680,
      vy: 0,
      w: 120,
      h: 36,
      dmg: Math.round(bot.atk * 1.8),
      life: 220,
      pierce: 1,
      element: "physical",
      color: "#ff3344",
      tags: ["slash", "physical"],
    };
    annotate(shot, shot.tags);
    return shot;
  },

  makeLightningFan(bot, world) {
    const target = world?.state?.enemies?.find((e) => e.hp > 0) || null;
    const baseAngle = target
      ? Math.atan2(target.y - bot.y, target.x - bot.x)
      : bot.facingLeft
      ? Math.PI
      : 0;
    const count = 3;
    const spacing = Math.PI / 12;
    const speed = (bot.tuning?.ranged ?? 360) + 80;
    const shots = [];
    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (i - (count - 1) / 2) * spacing;
      const shot = {
        kind: "robox_lightning",
        owner: "ally",
        ownerId: bot.id,
        x: bot.x,
        y: bot.y - 24,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        speed,
        dmg: Math.round(bot.atk * 0.9),
        life: 900,
        pierce: 1,
        r: 16,
        element: "shock",
        color: "#ff8855",
        tags: ["shock", "chain"],
      };
      annotate(shot, shot.tags);
      shots.push(shot);
    }
    return shots;
  },

  makeFlameSpiral(bot) {
    const count = 8;
    const speed = 280;
    const shots = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const shot = {
        kind: "robox_fire",
        owner: "ally",
        ownerId: bot.id,
        x: bot.x,
        y: bot.y - 16,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        speed,
        dmg: Math.round(bot.atk * 0.75),
        life: 720,
        pierce: 0,
        r: 14,
        element: "fire",
        color: "#ff8855",
        tags: ["fire", "burn"],
      };
      annotate(shot, shot.tags);
      shots.push(shot);
    }
    return shots;
  },

  makeDomainField(bot) {
    const shot = {
      kind: "robox_domain",
      owner: "ally",
      ownerId: bot.id,
      x: bot.x,
      y: bot.y - 20,
      aoe: 180,
      dmg: Math.round(bot.atk * 1.2),
      life: 900,
      pierce: 0,
      element: "arcane",
      color: "#5ba3ff",
      tags: ["arcane", "zone"],
    };
    annotate(shot, shot.tags);
    return shot;
  },

  ensureRoboxProjectiles(scope = window) {
    scope.RoboxProjectiles = scope.RoboxProjectiles || RoboxProjectiles;
  },
};

if (typeof window !== "undefined") {
  window.RoboxProjectiles = RoboxProjectiles;
}
