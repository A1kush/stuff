(function(){
  const BASE_STATS = {
    id: 'Robox',
    kind: 'robox',
    hpMax: 2000,
    atk: 300,
    speed: 140
  };

  function createRoboxEntity(options = {}) {
    const spawnTime = performance.now?.() || Date.now();
    const bot = {
      ...BASE_STATS,
      x: options.x ?? 320,
      y: options.y ?? 400,
      vx: 0,
      vy: 0,
      hp: options.hp ?? BASE_STATS.hpMax,
      mode: options.mode || 'follow',
      targetMode: options.targetMode || 'nearest',
      leaderId: options.leaderId ?? null,
      facingLeft: false,
      animState: 'idle',
      animTime: 0,
      alive: true,
      createdAt: spawnTime,
      nextFireAt: spawnTime + 320,
      fireRate: options.fireRate || 420,
      skillMultiplier: options.skillMultiplier || 3,
      attackCycle: {
        phase: 'melee',
        count: 0
      },
      tuning: options.tuning || {
        speed: BASE_STATS.speed,
        ranged: 320,
        melee: 90,
        fireCd: 420
      },
      pendingSkill: null,
      update(dt, world) {
        updateRobox(this, dt, world);
      }
    };
    return bot;
  }

  function updateRobox(bot, dt, world) {
    if (!bot.alive) return;
    const st = world?.state || window.gameState;
    if (!st) return;

    bot.animTime += dt * 1000;

    const leader = pickLeader(st, bot);
    if (!leader) return;

    const goal = getGoal(bot, leader, st);
    const dx = goal.x - bot.x;
    const dy = goal.y - bot.y;
    const dist = Math.hypot(dx, dy);
    const maxSpeed = (bot.tuning?.speed ?? BASE_STATS.speed);

    if (dist > 4) {
      const step = Math.min(maxSpeed * dt, dist);
      const nx = dx / (dist || 1);
      const ny = dy / (dist || 1);
      bot.vx = nx * maxSpeed;
      bot.vy = ny * maxSpeed * 0.6;
      bot.x += nx * step;
      bot.y += ny * step * 0.8;
      bot.animState = 'run';
    } else {
      bot.vx *= 0.8;
      bot.vy *= 0.8;
      bot.animState = 'idle';
    }

    bot.facingLeft = dx < 0;

    const minX = 40;
    const maxX = (window.WORLD?.width || window.WORLD_WIDTH || window.DESIGN_W || 1280) - 40;
    const floor = leader.y || 400;
    bot.x = Math.max(minX, Math.min(maxX, bot.x));
    bot.y = Math.min(floor, bot.y);

    const now = performance.now?.() || Date.now();
    const skills = window.RoboxSkills;
    if (skills && now >= bot.nextFireAt) {
      const target = findTarget(bot, st);
      if (target) {
        skills.primaryFire(bot, target, world);
        bot.nextFireAt = now + (bot.tuning?.fireCd ?? bot.fireRate);
        bot.animState = 'attack';
      }
    }

    if (bot.pendingSkill && skills) {
      skills.cast(bot.pendingSkill, bot, world);
      bot.pendingSkill = null;
    }
  }

  function pickLeader(st, bot) {
    if (bot.leaderId) {
      const match = st.party?.find(p => p.id === bot.leaderId);
      if (match) return match;
    }
    if (st.party?.length) {
      return st.party[0];
    }
    return null;
  }

  function getGoal(bot, leader, st) {
    switch (bot.mode) {
      case 'aggro': {
        const target = findTarget(bot, st);
        if (target) {
          return { x: target.x - 80, y: target.y };
        }
        break;
      }
      case 'guard':
        return { x: leader.x + (bot.tuning?.melee ?? 90), y: leader.y };
      case 'assist':
        return { x: leader.x, y: leader.y - 80 };
      case 'follow':
      default:
        return { x: leader.x - (bot.tuning?.melee ?? 90), y: leader.y };
    }
  }

  function findTarget(bot, st) {
    const enemies = st.enemies || [];
    if (!enemies || enemies.length === 0) return null;

    let best = null;
    if (bot.targetMode === 'lowest') {
      let lowestHp = Infinity;
      for (const e of enemies) {
        if (e.hp > 0 && e.hp < lowestHp) {
          lowestHp = e.hp;
          best = e;
        }
      }
    } else if (bot.targetMode === 'boss') {
      best = enemies.find(e => e.isBoss && e.hp > 0) || null;
    }

    if (!best) {
      let bestDist = Infinity;
      for (const e of enemies) {
        if (e.hp <= 0) continue;
        const dx = e.x - bot.x;
        const dy = e.y - bot.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < bestDist) {
          bestDist = d2;
          best = e;
        }
      }
    }

    return best;
  }

  function laneY(lane) {
    const lanes = {
      1: (window.DESIGN_H || 720) - 220,
      2: (window.DESIGN_H || 720) - 180,
      3: (window.DESIGN_H || 720) - 140
    };
    return lanes[lane] ?? lanes[2];
  }

  window.RoboxCreateEntity = createRoboxEntity;
})();
