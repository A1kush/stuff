#!/usr/bin/env python3
"""Bundle all JS files into a standalone HTML file"""
import os
import re

# Read CSS
css_path = 'css/styles.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

# Read all JS files
js_files = [
    'js/VehicleRegistry.js',
    'js/sprites/HDPixelArtVehicles.js',
    'js/sprites/VectorCelShadedVehicles.js',
    'js/sprites/3DPrerenderedVehicles.js',
    'js/sprites/CharacterSprites.js',
    'js/VehicleController.js',
    'js/EffectsSystem.js',
    'js/GameState.js',
    'js/InputController.js'
]

js_content = []
for js_file in js_files:
    if os.path.exists(js_file):
        with open(js_file, 'r', encoding='utf-8') as f:
            content = f.read()
            # Remove export statements
            content = re.sub(r'export\s+', '', content)
            # Remove export default
            content = re.sub(r'export\s+default\s+', '', content)
            js_content.append(f'\n// === {js_file} ===\n{content}')

# Read main HTML
html_template = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>V2 Vehicle System - Complete Standalone</title>
  <style>
{css}
  </style>
</head>
<body>
  <div id="app">
    <div id="gallery-mode" class="mode active">
      <header>
        <h1>🚗 V2 Enhanced Vehicle System</h1>
        <p class="subtitle">17 Vehicles × 3 Art Styles × 3 Characters = Infinite Combinations</p>
        <div style="background: #00E5FF; color: #000; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-top: 12px; font-weight: 600;">
          ✅ 100% OFFLINE - Works with Double-Click!
        </div>
      </header>

      <div class="controls-panel">
        <div class="control-group">
          <label for="style-selector">Art Style:</label>
          <select id="style-selector">
            <option value="pixel" selected>HD Pixel Art</option>
            <option value="vector">Vector Cel-Shaded</option>
            <option value="3d">3D Pre-rendered</option>
          </select>
        </div>

        <div class="control-group">
          <label for="character-selector">Character:</label>
          <select id="character-selector">
            <option value="warrior" selected>⚔️ Warrior</option>
            <option value="cat_angel">😇 Cat Angel</option>
            <option value="cyborg">🤖 Cyborg</option>
          </select>
        </div>
      </div>

      <div id="vehicle-grid" class="vehicle-grid"></div>
    </div>

    <div id="testdrive-mode" class="mode">
      <div class="hud">
        <div class="hud-top">
          <div class="vehicle-info">
            <h2 id="vehicle-name">Vehicle Name</h2>
            <div class="stats">
              <span id="vehicle-speed">Speed: 0</span>
              <span id="vehicle-category">Category: ground</span>
              <span id="vehicle-seats">Seats: 1</span>
            </div>
          </div>
          <div class="fps-counter">FPS: <span id="fps-display">60</span></div>
        </div>

        <div class="controls-help">
          <h3>Controls:</h3>
          <p><kbd>←</kbd><kbd>→</kbd> Move &nbsp; <kbd>↑</kbd> Jump &nbsp; <kbd>E</kbd> Board/Unboard &nbsp; <kbd>ESC</kbd> Exit</p>
        </div>

        <div id="interaction-prompt" class="interaction-prompt hidden">
          Press <kbd>E</kbd> to Board
        </div>
      </div>

      <canvas id="game-canvas"></canvas>
    </div>
  </div>

  <script>
{js}

// Main app code (from index.html)
(function() {{
  // Initialize systems
  const gameState = new GameState();
  const inputController = new InputController();
  const vehicleController = new VehicleController();
  const effectsSystem = new EffectsSystem();
  const characterSprites = new CharacterSprites();
  
  // Sprite renderers
  const pixelRenderer = new HDPixelArtVehicles();
  const vectorRenderer = new VectorCelShadedVehicles();
  const threeDRenderer = new ThreeDPrerenderedVehicles();

  function getCurrentVehicleRenderer() {{
    switch (gameState.currentStyle) {{
      case 'pixel': return pixelRenderer;
      case 'vector': return vectorRenderer;
      case '3d': return threeDRenderer;
      default: return pixelRenderer;
    }}
  }}

  function initGallery() {{
    const grid = document.getElementById('vehicle-grid');
    const vehicles = getAllVehicles();

    vehicles.forEach(vehicle => {{
      const card = document.createElement('div');
      card.className = 'vehicle-card';
      card.innerHTML = `
        <canvas width="200" height="150"></canvas>
        <div class="card-content">
          <h3>${{vehicle.name}}</h3>
          <p class="card-desc">${{vehicle.description}}</p>
          <div class="card-stats">
            <span>Speed: ${{vehicle.maxSpeed}}</span>
            <span>Seats: ${{vehicle.seats}}</span>
            <span>${{vehicle.category.toUpperCase()}}</span>
          </div>
        </div>
      `;

      const canvas = card.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      renderVehiclePreview(ctx, vehicle);

      card.addEventListener('click', () => {{
        startTestDrive(vehicle);
      }});

      grid.appendChild(card);
    }});
  }}

  function renderVehiclePreview(ctx, vehicle) {{
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, 200, 150);
    const renderer = getCurrentVehicleRenderer();
    const state = {{ animTime: Date.now(), facingLeft: false }};
    renderer.renderVehicle(ctx, vehicle.id, 100, 100, state);
  }}

  function updateGalleryPreviews() {{
    const cards = document.querySelectorAll('.vehicle-card');
    const vehicles = getAllVehicles();
    cards.forEach((card, index) => {{
      const canvas = card.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      renderVehiclePreview(ctx, vehicles[index]);
    }});
  }}

  let lastTime = 0;
  let animationFrameId = null;

  function startTestDrive(vehicleData) {{
    gameState.enterTestDrive(vehicleData);
    document.getElementById('gallery-mode').classList.remove('active');
    document.getElementById('testdrive-mode').classList.add('active');
    document.getElementById('vehicle-name').textContent = vehicleData.name;
    updateHUD();
    const canvas = document.getElementById('game-canvas');
    canvas.width = 1400;
    canvas.height = 800;
    lastTime = performance.now();
    gameLoop(lastTime);
  }}

  function exitTestDrive() {{
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    gameState.exitTestDrive();
    effectsSystem.clear();
    document.getElementById('testdrive-mode').classList.remove('active');
    document.getElementById('gallery-mode').classList.add('active');
  }}

  function gameLoop(timestamp) {{
    const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;
    gameState.animTime = timestamp;
    gameState.updateFPS(timestamp);
    document.getElementById('fps-display').textContent = gameState.fps;
    if (inputController.wasJustPressed('Escape')) {{
      exitTestDrive();
      return;
    }}
    updateGame(dt);
    renderGame();
    animationFrameId = requestAnimationFrame(gameLoop);
  }}

  function updateGame(dt) {{
    const {{ player, currentVehicle }} = gameState;
    if (player.boardingVehicle) vehicleController.updateBoarding(player, gameState.animTime, dt);
    if (player.unboardingVehicle) vehicleController.updateUnboarding(player, gameState.animTime, dt);
    if (currentVehicle && vehicleController.canInteract(player, currentVehicle)) {{
      const prompt = document.getElementById('interaction-prompt');
      prompt.classList.remove('hidden');
      prompt.innerHTML = player.isRiding ? 'Press <kbd>E</kbd> to Unboard' : 'Press <kbd>E</kbd> to Board';
      if (inputController.wasJustPressed('KeyE')) {{
        if (player.isRiding) vehicleController.unboardVehicle(player, currentVehicle, gameState.animTime);
        else vehicleController.boardVehicle(player, currentVehicle, gameState.animTime);
      }}
    }} else {{
      document.getElementById('interaction-prompt').classList.add('hidden');
    }}
    if (currentVehicle) {{
      vehicleController.updateVehicle(currentVehicle, inputController.keys, dt, gameState.groundY);
      effectsSystem.updateVehicleEffects(currentVehicle, dt);
    }}
    if (!player.isRiding && !player.boardingVehicle && !player.unboardingVehicle) {{
      updatePlayerPhysics(player, dt);
    }}
    gameState.updateCamera(1400);
    effectsSystem.update(dt);
    updateHUD();
  }}

  function updatePlayerPhysics(player, dt) {{
    const targetVx = (inputController.isPressed('ArrowRight') ? 1 : 0) - (inputController.isPressed('ArrowLeft') ? 1 : 0);
    player.vx += targetVx * player.acceleration * dt;
    if (targetVx === 0) player.vx *= Math.pow(1 - player.friction, dt * 60);
    player.vx = Math.max(-player.maxSpeed, Math.min(player.maxSpeed, player.vx));
    player.x += player.vx * dt;
    if (targetVx !== 0) player.facingLeft = targetVx < 0;
    player.vy += player.gravity * dt;
    player.y += player.vy * dt;
    if (player.y >= gameState.groundY) {{
      player.y = gameState.groundY;
      player.vy = 0;
      player.grounded = true;
      player.jumpCount = 0;
    }} else {{
      player.grounded = false;
    }}
    if (inputController.wasJustPressed('ArrowUp') && player.jumpCount < 2) {{
      player.vy = -player.jumpForce;
      player.grounded = false;
      player.jumpCount++;
    }}
    player.x = Math.max(50, Math.min(gameState.worldWidth - 50, player.x));
  }}

  function renderGame() {{
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const {{ player, currentVehicle, cameraX, groundY }} = gameState;
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(-cameraX, 0);
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, groundY, gameState.worldWidth, 300);
    ctx.strokeStyle = '#2a2a3e';
    ctx.lineWidth = 1;
    for (let x = 0; x < gameState.worldWidth; x += 50) {{
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x, groundY + 300);
      ctx.stroke();
    }}
    const renderer = getCurrentVehicleRenderer();
    const renderState = {{ animTime: gameState.animTime, facingLeft: false }};
    if (currentVehicle) {{
      renderState.facingLeft = currentVehicle.facingLeft;
      effectsSystem.renderVehicleEffects(ctx, currentVehicle);
      renderer.renderVehicle(ctx, currentVehicle.id, currentVehicle.x, currentVehicle.y, renderState);
      if (player.isRiding && currentVehicle.rider) {{
        characterSprites.setStyle(gameState.currentStyle);
        characterSprites.renderCharacterOnVehicle(ctx, gameState.currentCharacter, currentVehicle.id, currentVehicle.x, currentVehicle.y, renderState);
      }}
    }}
    if (!player.isRiding && !player.boardingVehicle) {{
      renderState.facingLeft = player.facingLeft;
      characterSprites.setStyle(gameState.currentStyle);
      characterSprites.renderCharacterWalking(ctx, gameState.currentCharacter, player.x, player.y, renderState);
    }}
    effectsSystem.render(ctx);
    ctx.restore();
  }}

  function updateHUD() {{
    const {{ currentVehicle }} = gameState;
    if (!currentVehicle) return;
    document.getElementById('vehicle-speed').textContent = `Speed: ${{Math.abs(currentVehicle.vx).toFixed(0)}}`;
    document.getElementById('vehicle-category').textContent = `Category: ${{currentVehicle.data.category.toUpperCase()}}`;
    document.getElementById('vehicle-seats').textContent = `Seats: ${{currentVehicle.data.seats}}`;
  }}

  document.getElementById('style-selector').addEventListener('change', (e) => {{
    gameState.setStyle(e.target.value);
    updateGalleryPreviews();
  }});

  document.getElementById('character-selector').addEventListener('change', (e) => {{
    gameState.setCharacter(e.target.value);
  }});

  initGallery();
  console.log('✅ V2 Vehicle System - Standalone Version Loaded!');
}})();
  </script>
</body>
</html>
'''

# Write standalone file
output = html_template.format(
    css=css_content,
    js='\n'.join(js_content)
)

with open('STANDALONE-FULL.html', 'w', encoding='utf-8') as f:
    f.write(output)

print(f'✅ Created STANDALONE-FULL.html ({len(output)} bytes)')
print('📦 All code bundled - works 100% offline!')

