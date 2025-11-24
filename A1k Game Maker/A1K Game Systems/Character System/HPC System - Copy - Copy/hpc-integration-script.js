/**
 * HPC INTEGRATION SCRIPT
 * Integrates HPC System with existing NPCs in mixed-city-with-ultra-interiors.html
 * 
 * INSTRUCTIONS:
 * 1. Add this script AFTER all HPC system files are loaded
 * 2. Add before closing </body> tag in mixed-city-with-ultra-interiors.html
 * 3. This will connect HPC system to existing NPCs
 */

(function() {
  'use strict';
  
  console.log('🔧 Initializing HPC Integration...');
  
  // Wait for game to be ready
  function initHPCIntegration() {
    // Check if HPC system is loaded
    if (typeof HPCManager === 'undefined' || typeof HPCProgression === 'undefined') {
      console.warn('⚠️ HPC System not loaded. Make sure to include HPC files first.');
      return;
    }
    
    // Check if game state exists
    if (!window.gameState) {
      console.warn('⚠️ Game state not ready. Retrying in 1 second...');
      setTimeout(initHPCIntegration, 1000);
      return;
    }
    
    // Initialize HPC systems
    if (!window.hpcManager) {
      window.hpcManager = new HPCManager();
      console.log('✅ HPC Manager initialized');
    }
    
    if (!window.hpcProgression) {
      window.hpcProgression = new HPCProgression();
      console.log('✅ HPC Progression initialized');
    }
    
    if (!window.hpcHiringUI) {
      window.hpcHiringUI = new HPCHiringUI();
      console.log('✅ HPC Hiring UI initialized');
    }
    
    if (!window.hpcPartyUI) {
      window.hpcPartyUI = new HPCPartyUI();
      console.log('✅ HPC Party UI initialized');
    }
    
    // Make NPCs hireable
    makeNPCsHireable();
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
    
    // Override NPC dialogue hire handler to use HPC system
    overrideNPCHireHandler();
    
    console.log('✅ HPC Integration complete!');
    console.log('📝 Press H to open Hiring Menu, P to open Party Management');
  }
  
  /**
   * Make all existing NPCs hireable
   */
  function makeNPCsHireable() {
    if (!window.gameState.npcs) {
      window.gameState.npcs = [];
      return;
    }
    
    // Import hire costs from HPC system
    const HPC_HIRE_COSTS = {
      E: 500, D: 1000, C: 2500, B: 5000, A: 10000, S: 25000
    };
    
    window.gameState.npcs.forEach(npc => {
      // Mark NPC as hireable
      npc.canHire = true;
      npc.hired = false;
      
      // Set hire cost based on rank
      if (!npc.hireCost && npc.rank) {
        npc.hireCost = HPC_HIRE_COSTS[npc.rank] || 1000;
      }
      
      // Ensure NPC has dialogue for hiring
      if (!npc.dialogue) {
        npc.dialogue = {
          greet: [`Hello! I'm ${npc.name || npc.displayName}. Looking for work!`],
          hire: [`Thanks for hiring me! I'll join your party for {cost} gold.`],
          reject: [`Sorry, you don't have enough gold. I need {cost} gold to join.`]
        };
      }
    });
    
    console.log(`✅ Made ${window.gameState.npcs.length} NPCs hireable`);
  }
  
  /**
   * Add keyboard shortcuts for HPC system
   */
  function addKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // H key - Open Hiring Menu
      if (e.key === 'h' || e.key === 'H') {
        if (window.hpcHiringUI) {
          window.hpcHiringUI.toggle();
        }
      }
      
      // P key - Open Party Management
      if (e.key === 'p' || e.key === 'P') {
        if (window.hpcPartyUI) {
          window.hpcPartyUI.toggle();
        }
      }
    });
  }
  
  /**
   * Override NPC dialogue hire handler to use HPC system
   */
  function overrideNPCHireHandler() {
    if (!window.npcDialogueSystem) {
      console.warn('⚠️ NPC Dialogue System not found');
      return;
    }
    
    // Store original handler
    const originalHandleHire = window.npcDialogueSystem.handleHire;
    
    // Override with HPC integration
    window.npcDialogueSystem.handleHire = function(npc) {
      if (!window.hpcManager) {
        // Fallback to original if HPC not available
        return originalHandleHire.call(this, npc);
      }
      
      // Create HPC ID from NPC
      const hpcId = `${npc.type}_${npc.rank.toLowerCase()}_${npc.id || Date.now()}`;
      
      // Check if already hired via HPC system
      if (window.hpcManager.isHired(hpcId)) {
        document.getElementById('npcDialogueText').textContent = 
          'You already hired this character!';
        return;
      }
      
      // Get hire cost
      const cost = npc.hireCost || 1000;
      
      // Check gold
      if (window.gameState.gold < cost) {
        const responses = npc.dialogue?.reject || ['Not enough gold!'];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
          .replace('{cost}', cost);
        document.getElementById('npcDialogueText').textContent = randomResponse;
        if (typeof showToast === 'function') {
          showToast(`⚠️ Need ${cost} gold to hire!`);
        }
        return;
      }
      
      // Check party size
      if (window.hpcManager.getPartyMembers().length >= 4) {
        document.getElementById('npcDialogueText').textContent = 
          'Your party is full! Remove someone first.';
        if (typeof showToast === 'function') {
          showToast('⚠️ Party is full! (Max 4 members)');
        }
        return;
      }
      
      // Hire via HPC system
      const result = window.hpcManager.hireCharacter(hpcId);
      
      if (result.success) {
        // Deduct gold
        window.gameState.gold -= cost;
        
        // Mark NPC as hired
        npc.hired = true;
        npc.hpcId = hpcId;
        
        // Show success message
        const responses = npc.dialogue?.hire || ['Thanks for hiring me!'];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
          .replace('{cost}', cost);
        document.getElementById('npcDialogueText').textContent = 
          randomResponse + ' ✅ HIRED!';
        
        if (typeof showToast === 'function') {
          showToast(`✅ ${npc.name || npc.displayName} hired! (-${cost} gold)`);
        }
        
        // Rebuild options
        this.buildDialogueOptions(npc);
      } else {
        // Show error
        document.getElementById('npcDialogueText').textContent = result.message || 'Failed to hire!';
        if (typeof showToast === 'function') {
          showToast(`❌ ${result.message || 'Failed to hire!'}`);
        }
      }
    };
    
    console.log('✅ NPC hire handler integrated with HPC system');
  }
  
  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHPCIntegration);
  } else {
    initHPCIntegration();
  }
  
})();

