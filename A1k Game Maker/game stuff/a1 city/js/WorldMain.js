/* js/WorldMain.js */

// Shared state container allows legacy HUD widgets to keep referencing window.gameState
window.gameState = {
  player: { x: 300, y: 300, hp: 100, stats: { atk: 10, def: 2 }, id: 'hero' },
  enemies: [],
  flags: {},
  lastTime: 0,
};

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function startGame() {
  window.CombatSystem.init();
  window.SaveGame.startAutoSave();

  window.EnemyAI.register({ x: 400, y: 400, hp: 50, type: 'slime', color: 'green' });
  window.EnemyAI.register({ x: 600, y: 200, hp: 80, type: 'goblin', color: 'red' });
  window.gameState.enemies = window.EnemyAI.entities;

  requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
  const dt = (timestamp - window.gameState.lastTime) / 1000;
  window.gameState.lastTime = timestamp;

  update(dt);
  draw();

  if (window.EventBus) {
    // Emit hooks so other subsystems (quests, stats, etc.) can piggyback on this loop
    window.EventBus.emit('game:tick', dt);
    window.EventBus.emit('game:render', { ctx });
  }

  requestAnimationFrame(gameLoop);
}

function update(dt) {
  const player = window.gameState.player;

  const move = window.Input.getMovement();
  const speed = 200 * dt;
  player.x += move.x * speed;
  player.y += move.y * speed;

  if (window.Input.actions.attack) {
    window.gameState.enemies.forEach((enemy) => {
      const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
      if (dist < 60) {
        window.CombatSystem.applyDamage(player, enemy);
      }
    });
    window.Input.actions.attack = false;
  }

  window.EnemyAI.update(dt, player);
  window.CombatSystem.update(dt);
}

function draw() {
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();

  if (window.CombatSystem.screenShake > 0) {
    const shake = window.CombatSystem.screenShake;
    // Small random offset keeps the shake camera-agnostic
    ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  }

  ctx.fillStyle = '#38ef7d';
  ctx.fillRect(window.gameState.player.x - 16, window.gameState.player.y - 16, 32, 32);

  window.gameState.enemies.forEach((enemy) => {
    if (enemy.hp <= 0) return;
    ctx.fillStyle = enemy.color || 'red';
    ctx.fillRect(enemy.x - 16, enemy.y - 16, 32, 32);

    ctx.fillStyle = 'black';
    ctx.fillRect(enemy.x - 16, enemy.y - 24, 32, 4);
    ctx.fillStyle = 'red';
    ctx.fillRect(enemy.x - 16, enemy.y - 24, 32 * (enemy.hp / 50), 4);
  });

  window.CombatSystem.render(ctx);

  ctx.restore();
}

window.addEventListener('DOMContentLoaded', startGame);
