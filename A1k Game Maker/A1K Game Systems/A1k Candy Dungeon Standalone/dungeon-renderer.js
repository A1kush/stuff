/**
 * Production-Ready Dungeon Interior Renderer
 * Generic, configurable dungeon rendering system for any game
 * 
 * @module DungeonRenderer
 * @version 1.0.0
 */

(function() {
  'use strict';

  /**
   * Dungeon Interior Renderer Class
   * Handles all rendering, physics, and gameplay logic
   */
  class DungeonInteriorRenderer {
    /**
     * @param {Object} config - Configuration object (uses DungeonConfig if not provided)
     */
    constructor(config = null) {
      this.config = config || window.DungeonConfig || {};
      this.canvas = null;
      this.ctx = null;
      this.player = null;
      this.enemies = [];
      this.platforms = [];
      this.chests = [];
      this.particles = [];
      this.currentRoom = null;
      this.camera = { x: 0, y: 0 };
      this.keys = {};
      this.animationFrame = null;
      this.isActive = false;
      this.lastFrameTime = 0;
      this.frameCount = 0;
      this.stats = {
        enemiesKilled: 0,
        chestsOpened: 0,
        damageDealt: 0,
        damageTaken: 0,
        roomsCleared: 0
      };

      // Initialize player stats from config
      this.playerStats = this._createPlayerStats();
      
      // Error handling
      this.errorHandler = this.config.hooks?.onError || this._defaultErrorHandler;
    }

    /**
     * Create player stats object from config
     * @private
     */
    _createPlayerStats() {
      const cfg = this.config.player || {};
      return {
        x: 100,
        y: 400,
        width: cfg.width || 50,
        height: cfg.height || 70,
        speed: cfg.speed || 6,
        jumpPower: cfg.jumpPower || 16,
        velocityY: 0,
        onGround: false,
        health: cfg.maxHealth || 100,
        maxHealth: cfg.maxHealth || 100,
        facing: 1,
        attackCooldown: 0,
        invincibilityFrames: 0
      };
    }

    /**
     * Default error handler
     * @private
     */
    _defaultErrorHandler(error, context) {
      console.error(`[DungeonRenderer] Error in ${context}:`, error);
      if (this.config.advanced?.enableErrorReporting) {
        // Could send to error reporting service
        console.error('Error details:', { error, context, stack: error.stack });
      }
    }

    /**
     * Initialize the renderer
     * @param {string} canvasId - ID of canvas element
     */
    init(canvasId = 'dungeonCanvas') {
      try {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
          throw new Error(`Canvas element with id "${canvasId}" not found`);
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
          throw new Error('Could not get 2D rendering context');
        }
        
        // Set initial dimensions
        this.resizeCanvas();
        
        // Resize on window resize
        const resizeHandler = () => this.resizeCanvas();
        window.addEventListener('resize', resizeHandler);
        this._resizeHandler = resizeHandler;
        
        // Input handlers
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Listen for dungeon events
        window.addEventListener('dungeon:raid_started', (e) => this.startDungeon(e.detail));
        window.addEventListener('dungeon:next_room', (e) => this.loadRoom(e.detail.room));
        
        // Validate configuration
        if (window.DungeonConfig?.validate) {
          const errors = window.DungeonConfig.validate();
          if (errors.length > 0) {
            console.warn('[DungeonRenderer] Configuration validation errors:', errors);
          }
        }
        
        console.log('[DungeonRenderer] Initialized successfully');
        return true;
      } catch (error) {
        this.errorHandler(error, 'init');
        return false;
      }
    }

    /**
     * Resize canvas to fit container
     */
    resizeCanvas() {
      if (!this.canvas) return;
      
      try {
        const wrapper = this.canvas.parentElement;
        let width = wrapper?.clientWidth || window.innerWidth;
        let height = wrapper?.clientHeight || window.innerHeight;
        
        // Fallback to window dimensions
        if (width === 0) width = window.innerWidth;
        if (height === 0) height = window.innerHeight - 100;
        
        // Set canvas dimensions
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        
        if (this.config.performance?.enableDebug) {
          console.log(`[DungeonRenderer] Canvas resized to ${width}x${height}`);
        }
      } catch (error) {
        this.errorHandler(error, 'resizeCanvas');
      }
    }

    /**
     * Handle key down events
     */
    handleKeyDown(e) {
      if (!this.isActive) return;
      
      const key = e.key.toLowerCase();
      const code = e.code.toLowerCase();
      
      this.keys[key] = true;
      this.keys[code] = true;
      
      const input = this.config.input || {};
      
      // Attack
      if (input.attack?.includes(key) || input.attack?.includes(code)) {
        e.preventDefault();
        this.playerAttack();
      }
      
      // Interact
      if (input.interact?.includes(key)) {
        this.tryInteract();
      }
    }

    /**
     * Handle key up events
     */
    handleKeyUp(e) {
      const key = e.key.toLowerCase();
      const code = e.code.toLowerCase();
      this.keys[key] = false;
      this.keys[code] = false;
    }

    /**
     * Start dungeon
     */
    startDungeon(detail) {
      try {
        const { rankId, room } = detail;
        this.isActive = true;
        
        const container = document.getElementById('dungeonInterior');
        if (container) {
          container.classList.add('active');
        }
        
        // Ensure canvas is properly sized
        setTimeout(() => {
          this.resizeCanvas();
        }, 100);
        
        // Update UI
        if (window.DungeonRoomData?.ranks?.[rankId]) {
          const rank = window.DungeonRoomData.ranks[rankId];
          const titleEl = document.getElementById('dungeonTitle');
          if (titleEl) {
            titleEl.textContent = `${rank.icon || ''} ${rank.name || 'Dungeon'}`;
            if (rank.color) titleEl.style.color = rank.color;
          }
        }
        
        this.loadRoom(room);
        this.gameLoop();
      } catch (error) {
        this.errorHandler(error, 'startDungeon');
      }
    }

    /**
     * Load a room
     */
    loadRoom(room) {
      if (!room) {
        console.warn('[DungeonRenderer] No room provided to loadRoom');
        return;
      }
      
      try {
        this.currentRoom = room;
        this.enemies = [];
        this.chests = [];
        this.platforms = [];
        this.particles = [];
        this.exitPortal = null;
        this.roomStartTime = Date.now();
        
        // Reset player position
        const roomHeight = room.height || this.config.room?.defaultHeight || 800;
        const groundY = roomHeight - (this.config.room?.groundHeight || 100);
        this.playerStats.x = 100;
        this.playerStats.y = groundY - this.playerStats.height;
        this.playerStats.velocityY = 0;
        this.playerStats.health = this.playerStats.maxHealth;
        this.camera.x = 0;
        this.camera.y = 0;
        
        // Enhance room data if needed
        this._enhanceRoomData(room);
        
        // Generate room layout
        this.generateRoomLayout(room);
        
        // Update floor display
        if (room.floorNumber) {
          const floorEl = document.getElementById('dungeonFloor');
          if (floorEl) {
            floorEl.textContent = `Floor ${room.floorNumber}`;
          }
        }
        
        // Call hook
        if (this.config.hooks?.onRoomLoad) {
          this.config.hooks.onRoomLoad(room);
        }
      } catch (error) {
        this.errorHandler(error, 'loadRoom');
      }
    }

    /**
     * Enhance room data with defaults
     * @private
     */
    _enhanceRoomData(room) {
      const cfg = this.config.room || {};
      const theme = this.config.theme || {};
      
      if (!room.width) room.width = cfg.defaultWidth || 2400;
      if (!room.height) room.height = cfg.defaultHeight || 800;
      if (!room.backgroundColor) room.backgroundColor = theme.backgroundColor || '#0a0a0a';
      if (!room.foregroundColor) room.foregroundColor = theme.foregroundColor || '#1a1a1a';
    }

    /**
     * Generate room layout
     */
    generateRoomLayout(room) {
      const cfg = this.config.room || {};
      const roomWidth = room.width || cfg.defaultWidth || 2400;
      const roomHeight = room.height || cfg.defaultHeight || 800;
      const groundY = roomHeight - (cfg.groundHeight || 100);
      
      // Ground platform
      this.platforms.push({
        x: 0,
        y: groundY,
        width: roomWidth,
        height: cfg.groundHeight || 100,
        color: cfg.groundColor || '#4a4a4a',
        type: 'ground'
      });
      
      // Generate platforms from room data
      if (room.platforms && Array.isArray(room.platforms)) {
        room.platforms.forEach(plat => {
          this.platforms.push({
            x: plat.x || 0,
            y: plat.y || groundY,
            width: plat.width || 200,
            height: plat.height || cfg.platformHeight || 20,
            color: plat.color || cfg.platformColor || '#3a3a3a',
            type: plat.type || 'platform'
          });
        });
      } else {
        // Generate default platforms
        const platformCount = Math.min(5, this.config.performance?.maxPlatforms || 100);
        for (let i = 0; i < platformCount; i++) {
          this.platforms.push({
            x: 300 + i * 400,
            y: groundY - 150 - (i % 2) * 100,
            width: 200,
            height: cfg.platformHeight || 20,
            color: cfg.platformColor || '#3a3a3a',
            type: 'platform'
          });
        }
      }
      
      // Generate enemies
      this._generateEnemies(room, groundY, roomWidth);
      
      // Generate chests
      this._generateChests(room, groundY, roomWidth);
      
      // Add exit portal
      this.exitPortal = {
        x: roomWidth - 150,
        y: groundY - 100,
        width: 60,
        height: 100,
        active: false
      };
    }

    /**
     * Generate enemies for room
     * @private
     */
    _generateEnemies(room, groundY, roomWidth) {
      const maxEnemies = this.config.performance?.maxEnemies || 50;
      
      if (room.encounters && Array.isArray(room.encounters)) {
        room.encounters.forEach(encounter => {
          const count = Math.min(encounter.count || 1, maxEnemies - this.enemies.length);
          for (let i = 0; i < count && this.enemies.length < maxEnemies; i++) {
            this.spawnEnemy({
              x: 500 + Math.random() * (roomWidth - 1000),
              y: groundY - 60,
              type: encounter.id || 'enemy_default'
            });
          }
        });
      } else {
        // Default enemies
        const defaultCount = Math.min(3, maxEnemies);
        for (let i = 0; i < defaultCount; i++) {
          this.spawnEnemy({
            x: 400 + i * 300,
            y: groundY - 60,
            type: 'enemy_default'
          });
        }
      }
    }

    /**
     * Generate chests for room
     * @private
     */
    _generateChests(room, groundY, roomWidth) {
      const maxChests = this.config.performance?.maxChests || 20;
      
      if (room.chestSpawns && Array.isArray(room.chestSpawns)) {
        room.chestSpawns.forEach((chest, index) => {
          if (index < maxChests) {
            this.chests.push({
              x: chest.x || 0,
              y: chest.y || groundY - 60,
              width: 40,
              height: 40,
              opened: false,
              color: chest.color || '#ffd700',
              rewards: chest.rewards || {}
            });
          }
        });
      } else {
        // Default chest
        this.chests.push({
          x: roomWidth - 200,
          y: groundY - 60,
          width: 40,
          height: 40,
          opened: false,
          color: '#ffd700',
          rewards: {}
        });
      }
    }

    /**
     * Spawn an enemy
     */
    spawnEnemy(data) {
      try {
        const cfg = this.config.enemy || {};
        const colors = cfg.colors || {};
        
        const enemy = {
          x: data.x,
          y: data.y,
          width: cfg.defaultWidth || 50,
          height: cfg.defaultHeight || 60,
          speed: (cfg.defaultSpeed || 2) + Math.random() * (cfg.speedVariation || 2),
          health: (cfg.defaultHealth || 50) + Math.random() * (cfg.healthVariation || 50),
          maxHealth: 0, // Will be set after
          direction: Math.random() > 0.5 ? 1 : -1,
          type: data.type || 'enemy_default',
          attackCooldown: 0,
          color: this._getEnemyColor(data.type, colors)
        };
        enemy.maxHealth = enemy.health;
        
        this.enemies.push(enemy);
        
        // Call hook
        if (this.config.hooks?.onEnemySpawn) {
          this.config.hooks.onEnemySpawn(enemy, this.currentRoom);
        }
      } catch (error) {
        this.errorHandler(error, 'spawnEnemy');
      }
    }

    /**
     * Get enemy color based on type
     * @private
     */
    _getEnemyColor(type, colors) {
      if (type.includes('boss')) return colors.boss || '#ff6bff';
      if (type.includes('elite')) return colors.elite || '#a78bfa';
      if (type.includes('guard')) return colors.guard || '#ff9a9e';
      if (type.includes('timed')) return colors.timed || '#7af8c8';
      return colors.default || '#ff6b6b';
    }

    /**
     * Update game state
     */
    update() {
      if (!this.isActive) return;
      
      try {
        this.updatePlayer();
        this.updateEnemies();
        this.updateCamera();
        this.updateParticles();
        this.updateUI();
      } catch (error) {
        this.errorHandler(error, 'update');
      }
    }

    /**
     * Update player
     */
    updatePlayer() {
      const p = this.playerStats;
      const input = this.config.input || {};
      const physics = this.config.physics || {};
      
      // Horizontal movement
      let moveX = 0;
      const leftKeys = input.moveLeft || ['a', 'arrowleft'];
      const rightKeys = input.moveRight || ['d', 'arrowright'];
      
      if (leftKeys.some(k => this.keys[k])) {
        moveX = -p.speed;
        p.facing = -1;
      }
      if (rightKeys.some(k => this.keys[k])) {
        moveX = p.speed;
        p.facing = 1;
      }
      
      // Jump
      const jumpKeys = input.jump || ['w', 'arrowup', ' '];
      if (jumpKeys.some(k => this.keys[k]) && p.onGround) {
        p.velocityY = -p.jumpPower;
        p.onGround = false;
      }
      
      // Apply gravity
      p.velocityY += physics.gravity || 0.8;
      if (physics.terminalVelocity && p.velocityY > physics.terminalVelocity) {
        p.velocityY = physics.terminalVelocity;
      }
      
      // Update position
      p.x += moveX;
      p.y += p.velocityY;
      
      // Collision with platforms
      p.onGround = false;
      for (const plat of this.platforms) {
        if (this.checkCollision(p, plat)) {
          if (p.velocityY > 0 && p.y - p.height < plat.y) {
            p.y = plat.y - p.height;
            p.velocityY = 0;
            p.onGround = true;
          } else if (moveX !== 0) {
            if (p.x < plat.x) {
              p.x = plat.x - p.width;
            } else {
              p.x = plat.x + plat.width;
            }
          }
        }
      }
      
      // Boundary check
      const roomWidth = this.currentRoom?.width || 2400;
      p.x = Math.max(0, Math.min(roomWidth - p.width, p.x));
      
      // Update cooldowns
      if (p.attackCooldown > 0) p.attackCooldown--;
      if (p.invincibilityFrames > 0) p.invincibilityFrames--;
    }

    /**
     * Update enemies
     */
    updateEnemies() {
      const combat = this.config.combat || {};
      
      this.enemies.forEach((enemy, index) => {
        // Simple AI: move back and forth
        enemy.x += enemy.speed * enemy.direction;
        
        // Boundary check and turn around
        const roomWidth = this.currentRoom?.width || 2400;
        if (enemy.x <= 0 || enemy.x >= roomWidth - enemy.width) {
          enemy.direction *= -1;
        }
        
        // Check collision with player
        if (this.checkCollision(this.playerStats, enemy)) {
          if (this.playerStats.invincibilityFrames === 0) {
            this.playerTakeDamage(combat.enemyDamage || 10);
          }
        }
        
        // Update attack cooldown
        if (enemy.attackCooldown > 0) {
          enemy.attackCooldown--;
        }
      });
      
      // Remove dead enemies
      const deadCount = this.enemies.length;
      this.enemies = this.enemies.filter(e => e.health > 0);
      if (this.enemies.length < deadCount) {
        this.stats.enemiesKilled += (deadCount - this.enemies.length);
      }
      
      // Check if room is cleared
      if (this.enemies.length === 0 && this.exitPortal && !this.exitPortal.active) {
        this.exitPortal.active = true;
        this.stats.roomsCleared++;
        
        if (window.BagSystem?.showToast) {
          window.BagSystem.showToast('Room cleared! Approach the portal to continue.', '#4ade80');
        }
        
        // Call hook
        if (this.config.hooks?.onRoomComplete) {
          this.config.hooks.onRoomComplete(this.currentRoom, this.stats);
        }
      }
    }

    /**
     * Update camera
     */
    updateCamera() {
      const cfg = this.config.camera || {};
      const p = this.playerStats;
      
      if (cfg.followX !== false) {
        const targetX = p.x - this.canvas.width / 2;
        const followSpeed = cfg.followSpeed || 0.15;
        this.camera.x += (targetX - this.camera.x) * followSpeed;
      }
      
      if (cfg.followY !== false) {
        const targetY = p.y - this.canvas.height / 2;
        const followSpeed = cfg.followSpeed || 0.15;
        this.camera.y += (targetY - this.camera.y) * followSpeed;
      }
      
      // Clamp camera to room bounds
      if (cfg.boundsCheck !== false) {
        const roomWidth = this.currentRoom?.width || 2400;
        const roomHeight = this.currentRoom?.height || 800;
        this.camera.x = Math.max(0, Math.min(roomWidth - this.canvas.width, this.camera.x));
        this.camera.y = Math.max(0, Math.min(roomHeight - this.canvas.height, this.camera.y));
      }
    }

    /**
     * Update particles
     */
    updateParticles() {
      if (!this.config.performance?.enableParticles) return;
      
      const maxParticles = this.config.performance.particleLimit || 100;
      this.particles = this.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        return p.life > 0;
      }).slice(0, maxParticles);
    }

    /**
     * Update UI
     */
    updateUI() {
      const p = this.playerStats;
      const healthPercent = (p.health / p.maxHealth) * 100;
      
      const healthBar = document.getElementById('playerHealthBar');
      if (healthBar) {
        healthBar.style.width = healthPercent + '%';
      }
      
      const enemyCount = document.getElementById('enemyCount');
      if (enemyCount) {
        enemyCount.textContent = this.enemies.length;
      }
    }

    /**
     * Player attack
     */
    playerAttack() {
      const combat = this.config.combat || {};
      
      if (this.playerStats.attackCooldown > 0) return;
      
      this.playerStats.attackCooldown = combat.attackCooldown || 20;
      const attackRange = combat.attackRange || 80;
      const damage = combat.attackDamage || 25;
      const p = this.playerStats;
      
      this.enemies.forEach(enemy => {
        const dist = Math.abs(enemy.x - p.x);
        if (dist < attackRange) {
          enemy.health -= damage;
          this.stats.damageDealt += damage;
          
          // Call hook
          if (this.config.hooks?.onPlayerAttack) {
            this.config.hooks.onPlayerAttack(p, enemy);
          }
          
          if (enemy.health <= 0) {
            // Drop gold
            const interaction = this.config.interaction || {};
            const gold = (interaction.enemyGoldMin || 50) + 
                        Math.random() * ((interaction.enemyGoldMax || 150) - (interaction.enemyGoldMin || 50));
            
            if (window.gameState) {
              window.gameState.gold = (window.gameState.gold || 0) + Math.floor(gold);
            }
            
            this.updateGoldDisplay();
            
            // Call hook
            if (this.config.hooks?.onEnemyKilled) {
              this.config.hooks.onEnemyKilled(enemy, { gold: Math.floor(gold) });
            }
          }
        }
      });
    }

    /**
     * Player take damage
     */
    playerTakeDamage(amount) {
      const cfg = this.config.player || {};
      
      this.playerStats.health -= amount;
      this.playerStats.invincibilityFrames = cfg.invincibilityFrames || 30;
      this.stats.damageTaken += amount;
      
      // Call hook
      if (this.config.hooks?.onPlayerDamage) {
        this.config.hooks.onPlayerDamage(this.playerStats, amount);
      }
      
      if (this.playerStats.health <= 0) {
        this.playerStats.health = 0;
        setTimeout(() => {
          this.exitDungeon();
          if (window.BagSystem?.showToast) {
            window.BagSystem.showToast('You were defeated!', '#ff6b6b');
          }
        }, 1000);
      }
    }

    /**
     * Try to interact
     */
    tryInteract() {
      const interaction = this.config.interaction || {};
      const p = this.playerStats;
      const interactRange = interaction.chestInteractRange || 60;
      
      // Check chests
      this.chests.forEach(chest => {
        if (chest.opened) return;
        
        const dist = Math.sqrt(
          Math.pow(chest.x - p.x, 2) + Math.pow(chest.y - p.y, 2)
        );
        
        if (dist < interactRange) {
          chest.opened = true;
          this.stats.chestsOpened++;
          
          const gold = (interaction.chestGoldMin || 200) + 
                      Math.random() * ((interaction.chestGoldMax || 500) - (interaction.chestGoldMin || 200));
          
          if (window.gameState) {
            window.gameState.gold = (window.gameState.gold || 0) + Math.floor(gold);
          }
          
          this.updateGoldDisplay();
          
          if (window.BagSystem?.showToast) {
            window.BagSystem.showToast(`Found ${Math.floor(gold)} gold!`, '#ffd700');
          }
          
          // Call hook
          if (this.config.hooks?.onChestOpened) {
            this.config.hooks.onChestOpened(chest, { gold: Math.floor(gold) });
          }
        }
      });
    }

    /**
     * Update gold display
     */
    updateGoldDisplay() {
      const goldEl = document.getElementById('dungeonGold');
      if (goldEl && window.gameState) {
        goldEl.textContent = Math.floor(window.gameState.gold || 0).toLocaleString();
      }
    }

    /**
     * Check collision between two rectangles
     */
    checkCollision(rect1, rect2) {
      return rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y;
    }

    /**
     * Render everything
     */
    render() {
      if (!this.ctx || !this.isActive) return;
      
      try {
        const ctx = this.ctx;
        const cam = this.camera;
        const theme = this.config.theme || {};
        
        // Clear canvas
        ctx.fillStyle = this.currentRoom?.backgroundColor || theme.backgroundColor || '#0a0a0a';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        ctx.save();
        ctx.translate(-cam.x, -cam.y);
        
        // Draw background
        this.drawBackground();
        
        // Draw platforms
        this.platforms.forEach(plat => {
          ctx.fillStyle = plat.color;
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          
          // Platform highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fillRect(plat.x, plat.y, plat.width, 4);
        });
        
        // Draw chests
        this.chests.forEach(chest => {
          if (chest.opened) {
            ctx.fillStyle = '#666';
            ctx.fillRect(chest.x, chest.y, chest.width, chest.height);
          } else {
            ctx.fillStyle = chest.color;
            ctx.fillRect(chest.x, chest.y, chest.width, chest.height);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(chest.x, chest.y, chest.width, chest.height);
          }
        });
        
        // Draw enemies
        this.enemies.forEach(enemy => {
          this._drawEnemy(ctx, enemy);
        });
        
        // Draw exit portal
        if (this.exitPortal) {
          this._drawPortal(ctx, this.exitPortal);
          
          // Check if player is at portal
          const p = this.playerStats;
          const interaction = this.config.interaction || {};
          const portalRange = interaction.portalInteractRange || 50;
          
          if (this.exitPortal.active && 
              Math.abs(p.x - (this.exitPortal.x + this.exitPortal.width / 2)) < portalRange &&
              Math.abs(p.y - this.exitPortal.y) < 100) {
            this.advanceToNextRoom();
          }
        }
        
        // Draw player
        this._drawPlayer(ctx);
        
        // Draw particles
        if (this.config.performance?.enableParticles) {
          this.particles.forEach(particle => {
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
          });
        }
        
        ctx.restore();
      } catch (error) {
        this.errorHandler(error, 'render');
      }
    }

    /**
     * Draw player
     * @private
     */
    _drawPlayer(ctx) {
      const p = this.playerStats;
      const cfg = this.config.player || {};
      const theme = this.config.theme || {};
      
      // Player body
      ctx.fillStyle = cfg.color || theme.accentColor || '#4ecdc4';
      ctx.fillRect(p.x, p.y, p.width, p.height);
      
      // Player outline
      ctx.strokeStyle = cfg.outlineColor || '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x, p.y, p.width, p.height);
      
      // Player face
      ctx.fillStyle = '#fff';
      ctx.fillRect(
        p.facing > 0 ? p.x + p.width - 18 : p.x + 8,
        p.y + 12,
        12,
        12
      );
      
      // Player weapon/arm
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(
        p.facing > 0 ? p.x + p.width : p.x - 8,
        p.y + 20,
        8,
        20
      );
      
      // Health bar
      if (cfg.showHealthBar !== false) {
        const barWidth = p.width + 10;
        const barHeight = cfg.healthBarHeight || 8;
        const offset = cfg.healthBarOffset || 15;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(p.x - 5, p.y - offset, barWidth, barHeight);
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(p.x - 5, p.y - offset, barWidth * (p.health / p.maxHealth), barHeight);
      }
      
      // Player name
      if (cfg.showName !== false) {
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(cfg.name || 'Player', p.x + p.width / 2, p.y - 20);
      }
    }

    /**
     * Draw enemy
     * @private
     */
    _drawEnemy(ctx, enemy) {
      const cfg = this.config.enemy || {};
      
      // Enemy body
      ctx.fillStyle = enemy.color;
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      
      // Enemy outline
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
      
      // Enemy eyes
      ctx.fillStyle = '#fff';
      ctx.fillRect(enemy.x + 12, enemy.y + 12, 10, 10);
      ctx.fillRect(enemy.x + 28, enemy.y + 12, 10, 10);
      
      // Enemy pupils
      ctx.fillStyle = '#000';
      ctx.fillRect(enemy.x + 15, enemy.y + 15, 4, 4);
      ctx.fillRect(enemy.x + 31, enemy.y + 15, 4, 4);
      
      // Health bar
      if (cfg.showHealthBar !== false) {
        const barWidth = enemy.width + 10;
        const barHeight = 6;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(enemy.x - 5, enemy.y - 12, barWidth, barHeight);
        ctx.fillStyle = enemy.health < enemy.maxHealth * 0.3 ? '#ff0000' : '#ff6b6b';
        ctx.fillRect(enemy.x - 5, enemy.y - 12, barWidth * (enemy.health / enemy.maxHealth), barHeight);
      }
      
      // Enemy name
      if (cfg.showName !== false) {
        ctx.fillStyle = '#fff';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Enemy', enemy.x + enemy.width / 2, enemy.y - 18);
      }
    }

    /**
     * Draw portal
     * @private
     */
    _drawPortal(ctx, portal) {
      if (portal.active) {
        ctx.fillStyle = 'rgba(79, 195, 247, 0.6)';
        ctx.fillRect(portal.x, portal.y, portal.width, portal.height);
        ctx.strokeStyle = '#4fc3f7';
        ctx.lineWidth = 3;
        ctx.strokeRect(portal.x, portal.y, portal.width, portal.height);
        
        // Portal particles
        for (let i = 0; i < 5; i++) {
          const px = portal.x + portal.width / 2;
          const py = portal.y + Math.sin(Date.now() / 200 + i) * 20;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
        ctx.fillRect(portal.x, portal.y, portal.width, portal.height);
      }
    }

    /**
     * Draw background
     */
    drawBackground() {
      const ctx = this.ctx;
      const roomWidth = this.currentRoom?.width || 2400;
      const roomHeight = this.currentRoom?.height || 800;
      const theme = this.config.theme || {};
      
      ctx.fillStyle = this.currentRoom?.foregroundColor || theme.foregroundColor || '#1a1a1a';
      
      // Draw pattern
      for (let i = 0; i < roomWidth; i += 100) {
        for (let j = 0; j < roomHeight; j += 100) {
          if ((i + j) % 200 === 0) {
            ctx.fillStyle = 'rgba(255, 154, 158, 0.05)';
            ctx.beginPath();
            ctx.arc(i, j, 20, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    /**
     * Advance to next room
     */
    advanceToNextRoom() {
      if (window.DungeonProgression) {
        const result = window.DungeonProgression.advanceCurrentFloor({
          clearTimeMs: Date.now() - (this.roomStartTime || Date.now())
        });
        
        if (result.success) {
          if (result.finished) {
            // Dungeon completed
            if (window.BagSystem?.showToast) {
              window.BagSystem.showToast('Dungeon completed!', '#4ade80');
            }
            
            // Call hook
            if (this.config.hooks?.onDungeonComplete) {
              this.config.hooks.onDungeonComplete(this.currentRoom, this.stats);
            }
            
            setTimeout(() => {
              this.exitDungeon();
            }, 2000);
          } else if (result.room) {
            // Load next room
            this.loadRoom(result.room);
            this.roomStartTime = Date.now();
            
            if (window.BagSystem?.showToast) {
              window.BagSystem.showToast(`Entering Floor ${result.room.floorNumber}...`, '#4ade80');
            }
          }
        }
      }
    }

    /**
     * Game loop
     */
    gameLoop() {
      if (!this.isActive) return;
      
      const now = performance.now();
      const delta = now - this.lastFrameTime;
      this.lastFrameTime = now;
      
      // Frame skip for performance
      const frameSkip = this.config.performance?.frameSkip || 0;
      if (frameSkip > 0 && this.frameCount % (frameSkip + 1) !== 0) {
        this.animationFrame = requestAnimationFrame(() => this.gameLoop());
        return;
      }
      
      this.update();
      this.render();
      this.frameCount++;
      
      this.animationFrame = requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Exit dungeon
     */
    exitDungeon() {
      this.isActive = false;
      
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
      
      const container = document.getElementById('dungeonInterior');
      if (container) {
        container.classList.remove('active');
      }
      
      // Reset player
      this.playerStats.health = this.playerStats.maxHealth;
      
      // Cleanup
      if (this._resizeHandler) {
        window.removeEventListener('resize', this._resizeHandler);
      }
    }
  }

  // Export
  window.DungeonInteriorRenderer = DungeonInteriorRenderer;
  
  console.log('[DungeonRenderer] Module loaded');
})();

