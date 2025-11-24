/**
 * NPC SYSTEM INTEGRATION GUIDE
 * Complete implementation for mixed-city-with-ultra-interiors.html
 */

// ========== STEP 1: ADD SCRIPT TAGS TO HTML ==========
// Add these <script> tags before the closing </body> tag:

/*
<script src="npc-database.js"></script>
<script src="npc-sprite-renderer.js"></script>
<script src="npc-dialogue-system.js"></script>
<script src="npc-ai-system.js"></script>
*/

// ========== STEP 2: INITIALIZE SYSTEMS IN GAME ==========
// Add this code after window.gameState initialization:

function initializeNPCSystem() {
  // Create NPC systems
  window.npcSpriteRenderer = new NPCSpriteRenderer();
  window.npcDialogueSystem = new NPCDialogueSystem();
  window.npcAISystem = new NPCAISystem();

  // Initialize NPC array
  if (!window.gameState.npcs) {
    window.gameState.npcs = [];
  }

  // Initialize hired NPCs array
  if (!window.gameState.hiredNPCs) {
    window.gameState.hiredNPCs = [];
  }

  console.log('✅ NPC System initialized');
}

// ========== STEP 3: SPAWN NPCs IN CITY ==========
function spawnCityNPCs() {
  const npcs = window.gameState.npcs;

  // Spawn preset NPCs at various locations
  const spawnData = [
    // Marketplace area (around 1500, 1500)
    { preset: 'shop_merchant', x: 1500, y: 1500 },
    { preset: 'shop_merchant', x: 1600, y: 1500 },
    { preset: 'rookie_warrior', x: 1450, y: 1550 },
    { preset: 'trainee_archer', x: 1550, y: 1550 },
    
    // Town square (around 2000, 2000)
    { preset: 'guard', x: 2000, y: 2000 },
    { preset: 'guard', x: 2100, y: 2000 },
    { preset: 'knight', x: 2050, y: 2050 },
    { preset: 'cleric', x: 1950, y: 2050 },
    
    // Training grounds (around 2500, 1500)
    { preset: 'champion', x: 2500, y: 1500 },
    { preset: 'hunter', x: 2550, y: 1550 },
    { preset: 'thief', x: 2450, y: 1550 },
    
    // Magic district (around 1500, 2500)
    { preset: 'wizard', x: 1500, y: 2500 },
    { preset: 'apprentice_mage', x: 1550, y: 2550 },
    { preset: 'sage', x: 1450, y: 2450 },
    
    // Elite area (around 2500, 2500)
    { preset: 'hero', x: 2500, y: 2500 },
    { preset: 'archmage', x: 2600, y: 2500 },
    { preset: 'high_priest', x: 2500, y: 2600 },
    
    // Legendary NPCs (rare spawns)
    { preset: 'legend', x: 3000, y: 3000 },
    { preset: 'grand_wizard', x: 3100, y: 3000 },
    { preset: 'saint', x: 3000, y: 3100 },
    
    // Blacksmith area
    { preset: 'blacksmith', x: 1800, y: 1800 },
    
    // Random low-level NPCs scattered around
    { preset: 'rookie_warrior', x: 1700, y: 1700 },
    { preset: 'novice_mage', x: 1900, y: 1900 },
    { preset: 'trainee_archer', x: 2200, y: 2200 }
  ];

  spawnData.forEach(data => {
    const npc = PRESET_NPCS[data.preset]();
    npc.x = data.x;
    npc.y = data.y;
    npcs.push(npc);
  });

  console.log(`✅ Spawned ${npcs.length} NPCs in the city`);
}

// ========== STEP 4: UPDATE GAME LOOP ==========
// Add to your main game loop (gameLoop function):

function updateNPCSystem(deltaTime) {
  // Update NPC AI
  if (window.npcAISystem) {
    window.npcAISystem.update(deltaTime);
  }

  // Update wanted level decay
  if (window.npcDialogueSystem) {
    window.npcDialogueSystem.updateWantedLevel(deltaTime);
  }
}

// ========== STEP 5: RENDER NPCs ==========
// Add to your render function (drawEverything or similar):

function renderNPCs(ctx) {
  if (!window.gameState.npcs || !window.npcSpriteRenderer) return;

  const camera = window.gameState.camera;

  window.gameState.npcs.forEach(npc => {
    window.npcSpriteRenderer.render(ctx, npc, camera);
  });
}

// ========== STEP 6: HANDLE NPC INTERACTION (E/ACT KEY) ==========
// Add to your keydown event handler:

function handleNPCInteraction() {
  if (!window.npcDialogueSystem) return;

  const nearbyNPC = window.npcDialogueSystem.checkNearbyNPC();
  
  if (nearbyNPC) {
    window.npcDialogueSystem.showDialogue(nearbyNPC);
  } else {
    if (typeof showToast === 'function') {
      showToast('⚠️ No NPC nearby');
    }
  }
}

// In your existing keydown handler, add:
/*
case 'e':
case 'E':
  handleNPCInteraction();
  break;
*/

// ========== STEP 7: COMPLETE INTEGRATION CODE ==========

// Add this to your game initialization:
window.addEventListener('load', () => {
  initializeNPCSystem();
  spawnCityNPCs();
});

// Modify your gameLoop to include:
/*
function gameLoop() {
  const now = Date.now();
  const deltaTime = now - lastFrameTime;
  lastFrameTime = now;

  // ... existing code ...

  // Add NPC updates
  updateNPCSystem(deltaTime);

  // ... existing code ...

  // Render NPCs (after rendering enemies, before UI)
  renderNPCs(ctx);

  // ... existing code ...

  requestAnimationFrame(gameLoop);
}
*/

// ========== FEATURES SUMMARY ==========
/*
✅ E-S Rank NPCs with different types (Warrior, Mage, Archer, Healer, Rogue, Tank, Merchant, Crafter)
✅ Procedural sprite rendering (head, body, arms, legs, weapon)
✅ Hire NPCs for gold (cost based on rank)
✅ NPC AI: Follow player, attack enemies, flee when low HP
✅ Dialogue system: Hire, Fight, Mission, Talk
✅ GTA-style wanted level (★★★★★)
✅ Attacking non-hostile NPCs increases wanted level
✅ Wanted level decays over time
✅ High wanted level makes NPCs hunt the player
✅ Max 4 party members (player + 3 hired NPCs)
✅ Hired NPCs help in combat
✅ Rank-based stats and visual effects (auras for A/S rank)
✅ Personality-based dialogue and behavior
*/

// ========== QUICK TEST COMMANDS ==========
/*
// Spawn a specific NPC near player:
const npc = PRESET_NPCS.legend();
const leader = window.gameState.party[window.gameState.currentLeader || 0];
npc.x = leader.x + 100;
npc.y = leader.y;
window.gameState.npcs.push(npc);

// Add wanted stars:
window.npcDialogueSystem.addWantedLevel(3);

// Give player gold for testing:
window.gameState.gold += 10000;

// Show all NPCs:
console.log(window.gameState.npcs);

// Show hired NPCs:
console.log(window.gameState.hiredNPCs);
*/

console.log('📋 NPC System Integration Guide loaded');
console.log('👉 Copy the code from this file into your main HTML file');
console.log('👉 Follow steps 1-6 to complete integration');
