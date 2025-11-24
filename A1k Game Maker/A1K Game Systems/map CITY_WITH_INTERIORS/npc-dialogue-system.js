/**
 * NPC DIALOGUE & INTERACTION SYSTEM
 * Handles: Hire, Fight, Mission, Talk interactions
 * GTA-style wanted level system
 */

class NPCDialogueSystem {
  constructor() {
    this.dialogueBox = null;
    this.currentNPC = null;
    this.wantedLevel = 0; // 0-5 stars (like GTA)
    this.wantedDecayRate = 0.01; // Stars decay per second
    this.lastWantedUpdate = Date.now();
    this.createDialogueUI();
  }

  /**
   * Create dialogue box UI
   */
  createDialogueUI() {
    const dialogueBox = document.createElement('div');
    dialogueBox.id = 'npcDialogueBox';
    dialogueBox.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      width: 500px;
      background: linear-gradient(135deg, rgba(20, 20, 40, 0.95), rgba(40, 40, 80, 0.95));
      border: 3px solid #FFD700;
      border-radius: 15px;
      padding: 20px;
      display: none;
      z-index: 9999;
      box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
      font-family: 'Arial', sans-serif;
    `;

    dialogueBox.innerHTML = `
      <div id="npcDialogueHeader" style="margin-bottom: 15px; border-bottom: 2px solid #FFD700; padding-bottom: 10px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center;">
            <span id="npcDialogueIcon" style="font-size: 24px; margin-right: 10px;"></span>
            <div>
              <div id="npcDialogueName" style="font-size: 18px; font-weight: bold; color: #FFD700;"></div>
              <div id="npcDialogueRank" style="font-size: 12px; color: #AAA;"></div>
            </div>
          </div>
          <button id="npcDialogueClose" style="background: #DC2626; border: none; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-weight: bold;">✕</button>
        </div>
      </div>
      
      <div id="npcDialogueText" style="color: #FFF; font-size: 14px; margin-bottom: 15px; min-height: 60px; line-height: 1.5;"></div>
      
      <div id="npcDialogueOptions" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <!-- Options will be dynamically added -->
      </div>
    `;

    document.body.appendChild(dialogueBox);
    this.dialogueBox = dialogueBox;

    // Close button
    document.getElementById('npcDialogueClose').addEventListener('click', () => {
      this.hideDialogue();
    });

    // Create wanted level display
    this.createWantedDisplay();
  }

  /**
   * Create GTA-style wanted level display
   */
  createWantedDisplay() {
    const wantedDisplay = document.createElement('div');
    wantedDisplay.id = 'wantedLevelDisplay';
    wantedDisplay.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid #DC2626;
      border-radius: 10px;
      padding: 10px 15px;
      display: none;
      z-index: 9998;
      font-family: 'Arial', sans-serif;
    `;

    wantedDisplay.innerHTML = `
      <div style="color: #DC2626; font-weight: bold; font-size: 14px; margin-bottom: 5px;">⚠ WANTED ⚠</div>
      <div id="wantedStars" style="font-size: 24px; color: #FFD700;"></div>
    `;

    document.body.appendChild(wantedDisplay);
  }

  /**
   * Show dialogue box for NPC
   */
  showDialogue(npc) {
    this.currentNPC = npc;
    this.dialogueBox.style.display = 'block';

    // Update header
    document.getElementById('npcDialogueIcon').textContent = npc.icon;
    document.getElementById('npcDialogueName').textContent = npc.name;
    document.getElementById('npcDialogueRank').textContent = `${npc.rank}-Rank ${npc.displayName}`;

    // Random greeting
    const greetings = npc.dialogue.greet;
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    document.getElementById('npcDialogueText').textContent = randomGreeting;

    // Build options
    this.buildDialogueOptions(npc);
  }

  /**
   * Hide dialogue box
   */
  hideDialogue() {
    this.dialogueBox.style.display = 'none';
    this.currentNPC = null;
  }

  /**
   * Build dialogue option buttons
   */
  buildDialogueOptions(npc) {
    const optionsContainer = document.getElementById('npcDialogueOptions');
    optionsContainer.innerHTML = '';

    // HIRE option (if NPC can be hired)
    if (npc.canHire && !npc.hired) {
      const hireBtn = this.createOptionButton('💰 Hire', '#10B981', () => {
        this.handleHire(npc);
      });
      optionsContainer.appendChild(hireBtn);
    }

    // DISMISS option (if NPC is already hired)
    if (npc.hired) {
      const dismissBtn = this.createOptionButton('👋 Dismiss', '#F59E0B', () => {
        this.handleDismiss(npc);
      });
      optionsContainer.appendChild(dismissBtn);
    }

    // FIGHT option
    const fightBtn = this.createOptionButton('⚔️ Fight', '#DC2626', () => {
      this.handleFight(npc);
    });
    optionsContainer.appendChild(fightBtn);

    // MISSION option
    const missionBtn = this.createOptionButton('📜 Mission', '#8B5CF6', () => {
      this.handleMission(npc);
    });
    optionsContainer.appendChild(missionBtn);

    // TALK option
    const talkBtn = this.createOptionButton('💬 Talk', '#3B82F6', () => {
      this.handleTalk(npc);
    });
    optionsContainer.appendChild(talkBtn);

    // LEAVE option
    const leaveBtn = this.createOptionButton('🚪 Leave', '#6B7280', () => {
      this.hideDialogue();
    });
    optionsContainer.appendChild(leaveBtn);
  }

  /**
   * Create dialogue option button
   */
  createOptionButton(text, color, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.cssText = `
      background: ${color};
      color: white;
      border: none;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      font-size: 14px;
      transition: all 0.2s;
    `;
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.05)';
      btn.style.boxShadow = `0 0 15px ${color}`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = 'none';
    });
    btn.addEventListener('click', onClick);
    return btn;
  }

  /**
   * Handle HIRE option
   */
  handleHire(npc) {
    const player = window.gameState;
    const cost = npc.hireCost;

    // Check if player has enough gold
    if (player.gold < cost) {
      const responses = npc.dialogue.reject;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      document.getElementById('npcDialogueText').textContent = randomResponse;
      if (typeof showToast === 'function') {
        showToast(`⚠️ Not enough gold! Need ${cost} gold.`);
      }
      return;
    }

    // Check party limit (max 4)
    if (player.party && player.party.length >= 4) {
      document.getElementById('npcDialogueText').textContent = "Your party is full! Dismiss someone first.";
      if (typeof showToast === 'function') {
        showToast('⚠️ Party is full! (Max 4 members)');
      }
      return;
    }

    // Hire NPC
    player.gold -= cost;
    npc.hired = true;
    npc.hostile = false;

    const responses = npc.dialogue.hire;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)].replace('{cost}', cost);
    document.getElementById('npcDialogueText').textContent = randomResponse + " ✅ HIRED!";

    if (typeof showToast === 'function') {
      showToast(`✅ ${npc.displayName} joined your party! (-${cost} gold)`);
    }

    // Add to party
    this.addToParty(npc);

    // Rebuild options
    this.buildDialogueOptions(npc);
  }

  /**
   * Handle DISMISS option
   */
  handleDismiss(npc) {
    npc.hired = false;
    document.getElementById('npcDialogueText').textContent = `${npc.displayName} left the party.`;
    
    if (typeof showToast === 'function') {
      showToast(`👋 ${npc.displayName} dismissed from party.`);
    }

    // Remove from party
    this.removeFromParty(npc);

    // Rebuild options
    this.buildDialogueOptions(npc);
  }

  /**
   * Handle FIGHT option
   */
  handleFight(npc) {
    const responses = npc.dialogue.fight;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    document.getElementById('npcDialogueText').textContent = randomResponse;

    // Make NPC hostile
    npc.hostile = true;
    npc.aiMode = 'attack';
    npc.target = window.gameState.party[window.gameState.currentLeader || 0];

    // Increase wanted level if attacking non-hostile NPC
    if (!npc.hired) {
      this.addWantedLevel(1);
    }

    if (typeof showToast === 'function') {
      showToast(`⚔️ ${npc.displayName} is now hostile!`);
    }

    // Close dialogue after 1 second
    setTimeout(() => this.hideDialogue(), 1000);
  }

  /**
   * Handle MISSION option
   */
  handleMission(npc) {
    const missions = npc.dialogue.mission;
    const randomMission = missions[Math.floor(Math.random() * missions.length)];
    document.getElementById('npcDialogueText').textContent = `"${randomMission}"\n\n[Mission system coming soon!]`;
  }

  /**
   * Handle TALK option
   */
  handleTalk(npc) {
    const talkResponses = {
      brave: ["I fight for honor and glory!", "Strength comes from the heart.", "Let's train together sometime."],
      wise: ["Knowledge is the greatest power.", "Patience yields wisdom.", "The arcane arts require dedication."],
      calm: ["Stay focused on your target.", "Precision over power.", "The hunt teaches patience."],
      kind: ["May light guide your path.", "Helping others is its own reward.", "I sense good in you."],
      sly: ["Trust no one completely.", "There's always an angle.", "Information is currency."],
      stoic: ["...", "Duty before self.", "I guard, I protect."],
      greedy: ["Everything has a price!", "Gold makes the world turn.", "You buying or selling?"],
      proud: ["My crafts are unmatched!", "I take pride in my work.", "Quality over quantity."]
    };

    const responses = talkResponses[npc.personality] || ["...", "Interesting.", "Indeed."];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    document.getElementById('npcDialogueText').textContent = randomResponse;
  }

  /**
   * Add NPC to player's party
   */
  addToParty(npc) {
    if (!window.gameState.hiredNPCs) {
      window.gameState.hiredNPCs = [];
    }
    window.gameState.hiredNPCs.push(npc);
    
    // Position hired NPC near player
    const leader = window.gameState.party[window.gameState.currentLeader || 0];
    npc.x = leader.x + Math.random() * 100 - 50;
    npc.y = leader.y + Math.random() * 100 - 50;
    npc.aiMode = 'follow';
    npc.target = leader;
  }

  /**
   * Remove NPC from party
   */
  removeFromParty(npc) {
    if (window.gameState.hiredNPCs) {
      window.gameState.hiredNPCs = window.gameState.hiredNPCs.filter(n => n.id !== npc.id);
    }
    npc.aiMode = 'idle';
    npc.target = null;
  }

  /**
   * Add wanted stars (GTA style)
   */
  addWantedLevel(amount) {
    this.wantedLevel = Math.min(5, this.wantedLevel + amount);
    this.updateWantedDisplay();

    if (typeof showToast === 'function') {
      showToast(`⚠️ Wanted Level: ${this.getWantedStars()}`);
    }

    // Make NPCs hostile based on wanted level
    this.updateNPCHostility();
  }

  /**
   * Update wanted level display
   */
  updateWantedDisplay() {
    const display = document.getElementById('wantedLevelDisplay');
    const stars = document.getElementById('wantedStars');

    if (this.wantedLevel > 0) {
      display.style.display = 'block';
      stars.textContent = this.getWantedStars();
    } else {
      display.style.display = 'none';
    }
  }

  /**
   * Get star string (★★★☆☆)
   */
  getWantedStars() {
    const fullStars = Math.floor(this.wantedLevel);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
  }

  /**
   * Update wanted level (decay over time)
   */
  updateWantedLevel(deltaTime) {
    if (this.wantedLevel > 0) {
      this.wantedLevel -= this.wantedDecayRate * (deltaTime / 1000);
      this.wantedLevel = Math.max(0, this.wantedLevel);
      this.updateWantedDisplay();
    }
  }

  /**
   * Make NPCs hostile based on wanted level
   */
  updateNPCHostility() {
    if (!window.gameState.npcs) return;

    const hostileChance = this.wantedLevel / 5; // 0% at 0 stars, 100% at 5 stars

    window.gameState.npcs.forEach(npc => {
      if (npc.hired) return; // Don't turn hired NPCs hostile

      if (Math.random() < hostileChance) {
        npc.hostile = true;
        npc.aiMode = 'attack';
        npc.target = window.gameState.party[window.gameState.currentLeader || 0];
      }
    });
  }

  /**
   * Check if player is near an NPC
   */
  checkNearbyNPC() {
    if (!window.gameState.npcs || window.gameState.npcs.length === 0) return null;

    const leader = window.gameState.party[window.gameState.currentLeader || 0];
    if (!leader) return null;

    // Find closest NPC within 80px
    let closestNPC = null;
    let closestDist = 80;

    window.gameState.npcs.forEach(npc => {
      if (npc.hp <= 0) return;

      const dx = npc.x - leader.x;
      const dy = npc.y - leader.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < closestDist) {
        closestNPC = npc;
        closestDist = dist;
      }
    });

    return closestNPC;
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NPCDialogueSystem;
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
  window.NPCDialogueSystem = NPCDialogueSystem;
}

