/**
 * A1K Dungeon Room Renderer
 * Renders dungeon rooms with complete scene transitions (MapleStory style)
 * Soul Knight vibes, side-scrolling platformer
 */

(function() {
  'use strict';

  console.log('[DungeonRoomRenderer] Loading room renderer...');

  window.DungeonRoomRenderer = {
    currentRoom: null,
    cameraX: 0,
    cameraY: 0,
    transitionState: 'none', // 'none', 'fading_out', 'fading_in', 'transitioning'
    transitionProgress: 0,
    oldSceneHidden: false,

    /**
     * Initialize renderer with canvas
     */
    init(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.canvas.width = canvas.width || 1200;
      this.canvas.height = canvas.height || 800;
      console.log('[DungeonRoomRenderer] Initialized with canvas:', this.canvas.width, 'x', this.canvas.height);
    },

    /**
     * Load and transition to a new room
     * Completely hides old scene before showing new one (MapleStory style)
     */
    loadRoom(roomData) {
      console.log('[DungeonRoomRenderer] Loading room:', roomData.id);
      
      // Start transition
      this.transitionState = 'fading_out';
      this.transitionProgress = 0;
      this.oldSceneHidden = false;
      
      // Hide old scene immediately
      this.hideOldScene();
      
      // After fade out, load new room
      setTimeout(() => {
        this.currentRoom = roomData;
        this.cameraX = 0;
        this.cameraY = 0;
        this.transitionState = 'fading_in';
        this.transitionProgress = 0;
        this.oldSceneHidden = true;
      }, 300); // Fade out duration
    },

    /**
     * Hide all old scene elements (enemies, houses, trains, etc.)
     */
    hideOldScene() {
      // Dispatch event to hide old game systems
      window.dispatchEvent(new CustomEvent('dungeon:transition_start', {
        detail: { hideOldScene: true }
      }));
      
      // Hide common game systems
      if (window.TrafficSystem) {
        if (typeof window.TrafficSystem.setVisible === 'function') {
          window.TrafficSystem.setVisible(false);
        }
      }
      if (window.CivilianSystem) {
        if (typeof window.CivilianSystem.setVisible === 'function') {
          window.CivilianSystem.setVisible(false);
        }
      }
      if (window.NPCHeroSystem) {
        if (typeof window.NPCHeroSystem.setVisible === 'function') {
          window.NPCHeroSystem.setVisible(false);
        }
      }
      if (window.CombatSystem && window.CombatSystem.enemies) {
        window.CombatSystem.enemies.forEach(enemy => {
          if (enemy.mesh) enemy.mesh.visible = false;
          if (enemy.sprite) enemy.sprite.visible = false;
        });
      }
      
      console.log('[DungeonRoomRenderer] Old scene hidden');
    },

    /**
     * Show old scene when exiting dungeon
     */
    showOldScene() {
      window.dispatchEvent(new CustomEvent('dungeon:transition_end', {
        detail: { showOldScene: true }
      }));
      
      if (window.TrafficSystem && typeof window.TrafficSystem.setVisible === 'function') {
        window.TrafficSystem.setVisible(true);
      }
      if (window.CivilianSystem && typeof window.CivilianSystem.setVisible === 'function') {
        window.CivilianSystem.setVisible(true);
      }
      if (window.NPCHeroSystem && typeof window.NPCHeroSystem.setVisible === 'function') {
        window.NPCHeroSystem.setVisible(true);
      }
    },

    /**
     * Update renderer (call each frame)
     */
    update(deltaTime, playerX, playerY) {
      if (!this.currentRoom) return;
      
      // Update camera to follow player
      this.cameraX = playerX - this.canvas.width / 2;
      this.cameraX = Math.max(0, Math.min(this.cameraX, this.currentRoom.width - this.canvas.width));
      
      // Update transition
      if (this.transitionState === 'fading_out') {
        this.transitionProgress += deltaTime / 300; // 300ms fade out
        if (this.transitionProgress >= 1) {
          this.transitionProgress = 1;
        }
      } else if (this.transitionState === 'fading_in') {
        this.transitionProgress -= deltaTime / 300; // 300ms fade in
        if (this.transitionProgress <= 0) {
          this.transitionProgress = 0;
          this.transitionState = 'none';
        }
      }
    },

    /**
     * Render the current room
     */
    render() {
      if (!this.currentRoom || !this.ctx) return;
      
      const ctx = this.ctx;
      const room = this.currentRoom;
      
      // Clear canvas
      ctx.fillStyle = room.backgroundColor;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Apply camera transform
      ctx.save();
      ctx.translate(-this.cameraX, -this.cameraY);
      
      // Draw background elements based on room type
      this.drawBackground(ctx, room);
      
      // Draw platforms
      this.drawPlatforms(ctx, room);
      
      // Draw room features (torches, crystals, etc.)
      this.drawFeatures(ctx, room);
      
      // Draw chests
      this.drawChests(ctx, room);
      
      // Draw NPCs
      this.drawNPCs(ctx, room);
      
      // Draw transition points
      this.drawTransitions(ctx, room);
      
      // Draw hidden room entrance (if exists)
      if (room.hiddenRoom) {
        this.drawHiddenRoomEntrance(ctx, room);
      }
      
      ctx.restore();
      
      // Draw transition overlay
      if (this.transitionState !== 'none') {
        this.drawTransitionOverlay(ctx);
      }
    },

    /**
     * Draw background elements
     */
    drawBackground(ctx, room) {
      // Draw background based on room theme
      switch(room.theme) {
        case 'dark':
          // Draw cave walls
          ctx.fillStyle = room.foregroundColor;
          ctx.fillRect(0, 0, room.width, 100); // Top wall
          ctx.fillRect(0, room.height - 100, room.width, 100); // Bottom wall
          break;
        case 'nature':
          // Draw forest background
          ctx.fillStyle = room.foregroundColor;
          for (let i = 0; i < room.width; i += 200) {
            this.drawTree(ctx, i, room.height - 100, room.accentColor);
          }
          break;
        case 'magical':
          // Draw magical background
          ctx.fillStyle = room.foregroundColor;
          ctx.fillRect(0, 0, room.width, room.height);
          // Add magical particles
          this.drawMagicalParticles(ctx, room);
          break;
        default:
          // Default background
          ctx.fillStyle = room.foregroundColor;
          ctx.fillRect(0, room.height - 100, room.width, 100);
      }
    },

    /**
     * Draw platforms
     */
    drawPlatforms(ctx, room) {
      room.platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        
        // Add glow effect for glowing platforms
        if (platform.glowing) {
          const gradient = ctx.createLinearGradient(
            platform.x, platform.y,
            platform.x, platform.y + platform.height
          );
          gradient.addColorStop(0, room.accentColor + '80');
          gradient.addColorStop(1, platform.color);
          ctx.fillStyle = gradient;
        }
        
        // Draw platform
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Draw platform border
        ctx.strokeStyle = room.accentColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        
        // Draw floating effect
        if (platform.floating) {
          ctx.fillStyle = room.accentColor + '40';
          ctx.fillRect(platform.x - 5, platform.y + platform.height, platform.width + 10, 5);
        }
      });
    },

    /**
     * Draw room features (torches, crystals, etc.)
     */
    drawFeatures(ctx, room) {
      room.features.forEach((feature, index) => {
        const x = 200 + (index * 400) + Math.sin(index) * 100;
        const y = room.height - 150;
        
        switch(feature) {
          case 'torches':
            this.drawTorch(ctx, x, y, room.accentColor);
            break;
          case 'glowing_crystals':
            this.drawCrystal(ctx, x, y, room.accentColor);
            break;
          case 'spell_circles':
            this.drawSpellCircle(ctx, x, y, room.accentColor);
            break;
          // Add more feature types as needed
        }
      });
    },

    /**
     * Draw chests
     */
    drawChests(ctx, room) {
      room.chestSpawns.forEach(chest => {
        const x = chest.x - this.cameraX;
        const y = chest.y - this.cameraY;
        
        if (x < -50 || x > this.canvas.width + 50) return; // Cull off-screen
        
        // Draw chest based on rarity
        ctx.fillStyle = this.getChestColor(chest.rarity);
        ctx.fillRect(x - 15, y - 10, 30, 20);
        
        // Draw chest lid
        ctx.fillRect(x - 15, y - 10, 30, 5);
        
        // Draw glow for rare+ chests
        if (chest.rarity !== 'uncommon') {
          ctx.shadowBlur = 10;
          ctx.shadowColor = this.getChestColor(chest.rarity);
          ctx.fillRect(x - 15, y - 10, 30, 20);
          ctx.shadowBlur = 0;
        }
        
        // Draw hidden indicator
        if (chest.isHidden) {
          ctx.fillStyle = '#ffff00';
          ctx.font = '12px Arial';
          ctx.fillText('?', x - 5, y - 15);
        }
      });
    },

    /**
     * Draw NPCs
     */
    drawNPCs(ctx, room) {
      room.npcSpawns.forEach(npc => {
        const x = npc.x - this.cameraX;
        const y = npc.y - this.cameraY;
        
        if (x < -50 || x > this.canvas.width + 50) return;
        
        // Draw NPC icon
        ctx.font = '32px Arial';
        ctx.fillText(npc.icon, x - 16, y);
        
        // Draw interaction indicator
        ctx.fillStyle = '#ffff00';
        ctx.font = '12px Arial';
        ctx.fillText('E', x - 5, y - 20);
      });
    },

    /**
     * Draw transition points
     */
    drawTransitions(ctx, room) {
      if (room.transitions.entrance) {
        const entrance = room.transitions.entrance;
        ctx.fillStyle = '#00ff00' + '80';
        ctx.fillRect(entrance.x, entrance.y, entrance.width, entrance.height);
      }
      
      if (room.transitions.exit) {
        const exit = room.transitions.exit;
        ctx.fillStyle = '#ff0000' + '80';
        ctx.fillRect(exit.x, exit.y, exit.width, exit.height);
      }
    },

    /**
     * Draw hidden room entrance
     */
    drawHiddenRoomEntrance(ctx, room) {
      const hidden = room.hiddenRoom;
      const x = hidden.entranceX - this.cameraX;
      const y = hidden.entranceY - this.cameraY;
      
      if (x < -50 || x > this.canvas.width + 50) return;
      
      // Draw secret passage indicator
      ctx.fillStyle = '#ffff00' + '60';
      ctx.fillRect(x - 20, y - 20, 40, 40);
      ctx.fillStyle = '#ffff00';
      ctx.font = '20px Arial';
      ctx.fillText('?', x - 8, y + 8);
    },

    /**
     * Draw transition overlay (fade effect)
     */
    drawTransitionOverlay(ctx) {
      const alpha = this.transitionState === 'fading_out' ? 
        this.transitionProgress : 
        (1 - this.transitionProgress);
      
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },

    // Helper drawing functions
    drawTorch(ctx, x, y, color) {
      // Torch pole
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x - 2, y, 4, 40);
      // Flame
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y - 5, 8, 0, Math.PI * 2);
      ctx.fill();
      // Glow
      const gradient = ctx.createRadialGradient(x, y - 5, 0, x, y - 5, 30);
      gradient.addColorStop(0, color + '80');
      gradient.addColorStop(1, color + '00');
      ctx.fillStyle = gradient;
      ctx.fillRect(x - 30, y - 35, 60, 60);
    },

    drawCrystal(ctx, x, y, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y - 20);
      ctx.lineTo(x - 10, y);
      ctx.lineTo(x + 10, y);
      ctx.closePath();
      ctx.fill();
      // Glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      ctx.fill();
      ctx.shadowBlur = 0;
    },

    drawSpellCircle(ctx, x, y, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.stroke();
    },

    drawTree(ctx, x, y, color) {
      // Trunk
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x - 10, y - 40, 20, 40);
      // Leaves
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y - 40, 30, 0, Math.PI * 2);
      ctx.fill();
    },

    drawMagicalParticles(ctx, room) {
      // Simple particle effect
      for (let i = 0; i < 20; i++) {
        const x = (i * 100 + Date.now() * 0.1) % room.width;
        const y = 100 + Math.sin(i + Date.now() * 0.01) * 50;
        ctx.fillStyle = room.accentColor + '60';
        ctx.fillRect(x, y, 4, 4);
      }
    },

    getChestColor(rarity) {
      const colors = {
        uncommon: '#60a5fa', // Blue
        rare: '#34d399', // Green
        epic: '#fbbf24', // Gold
        legendary: '#ef4444' // Red
      };
      return colors[rarity] || colors.uncommon;
    }
  };

  console.log('✅ [DungeonRoomRenderer] Room renderer loaded');

})();

