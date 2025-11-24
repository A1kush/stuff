/**
 * quick-start.js - One-Line Setup for Level System
 * @description Include this file in index.html for instant integration
 *
 * Usage in index.html:
 * <script src="level-system/integration/quick-start.js"></script>
 * <script>
 *   LevelSystemQuickStart.init();
 * </script>
 */

(function (root) {
  "use strict";

  const LevelSystemQuickStart = {
    /**
     * One-line initialization
     * @param {Object} options - Initialization options
     * @returns {Promise<Object>} Initialized systems
     */
    async init(options = {}) {
      const opts = Object.assign(
        {
          autoLoadCharacters: true,
          autoConnectTalents: true,
          debug: true,
        },
        options
      );

      console.log("[LevelSystem] Quick Start initialization...");

      try {
        // Create UnifiedBridge
        const bridge = new root.UnifiedBridge({ debug: opts.debug });
        await bridge.init();

        // Auto-load characters from GameData if available
        if (opts.autoLoadCharacters && root.GameData?.characters?.characters) {
          const characters = root.GameData.characters.characters;
          characters.forEach((char) => {
            bridge.statsSystem.createCharacter(char);
            bridge.levelSystem.createLevel(char);
          });
          console.log(`[LevelSystem] Loaded ${characters.length} characters`);
        }

        // Auto-connect to talent system
        if (opts.autoConnectTalents && root.TalentController) {
          characters.forEach((char) => {
            bridge.talentIntegration.importTalentStore(char.id);
          });
          console.log("[LevelSystem] Connected to Talent System");
        }

        // Expose globally for easy access
        root.LevelBridge = bridge;

        console.log("[LevelSystem] ✅ Quick Start Complete!");
        console.log("[LevelSystem] Access via window.LevelBridge");

        // Log usage instructions
        if (opts.debug) {
          console.log(
            `
%c🎮 Level System Ready! 

Usage:
  LevelBridge.gainXP('player1', 500)
  LevelBridge.getCharacterSheet('player1')
  LevelBridge.applyDamage('enemy1', 150, 'fire')
  LevelBridge.applyStatusEffect('player1', 'haste')
  
Systems Available:
  ✅ EventBus
  ✅ StatsSystem (12 stats)
  ✅ LevelSystem (XP & prestige)
  ✅ EnemyScaling (15 ranks, 9.5 logic)
  ✅ DamageTypes (6 types)
  ✅ StatusEffects (20 effects)
  ✅ TalentIntegration (59 talents)
  ✅ AutoSkillExpansion (3 new lanes)
          `,
            "color: #4caf50; font-weight: bold;"
          );
        }

        return bridge;
      } catch (err) {
        console.error("[LevelSystem] Quick Start failed:", err);
        throw err;
      }
    },

    /**
     * Get status of level system
     */
    getStatus() {
      if (!root.LevelBridge) {
        return { initialized: false };
      }

      return {
        initialized: true,
        systems: root.LevelBridge._getSystemStatus(),
        characters: root.LevelBridge.statsSystem.listCharacters().length,
      };
    },
  };

  root.LevelSystemQuickStart = LevelSystemQuickStart;
})(typeof window !== "undefined" ? window : this);
