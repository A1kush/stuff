/**
 * DEMO BRIDGE
 * Main coordinator that initializes all systems and connects them together
 * 
 * @version 1.0.0
 */

class CombatDemoBridge {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.isRunning = false;
    this.lastTime = 0;

    // Systems
    this.spriteRenderer = null;
    this.combatEngine = null;
    this.enemySystem = null;
    this.bagIntegration = null;
    this.combatHUD = null;
    this.skillButtons = null;
    this.damageNumbers = null;

    // Input
    this.keys = {};
    this.mouseX = 0;
    this.mouseY = 0;
  }

  /**
   * Initialize all systems
   */
  async initialize(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    console.log('🎮 Initializing Combat Demo...');

    // Initialize sprite renderer
    this.spriteRenderer = new SpriteRenderer();
    this.spriteRenderer.initialize();

    // Initialize combat engine
    this.combatEngine = new CombatEngine();
    this.combatEngine.spriteRenderer = this.spriteRenderer;
    this.spriteRenderer.setActiveCharacter(this.combatEngine.activeCharacter);
    this.spriteRenderer.setPosition(this.combatEngine.x, this.combatEngine.y);

    // Initialize enemy system
    this.enemySystem = new EnemySystem();
    
    // Spawn initial enemies
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.enemySystem.spawnRandomEnemy(canvas.width, canvas.height);
      }, i * 1000);
    }

    // Initialize UI systems
    this.combatHUD = new CombatHUD(this.combatEngine);
    this.skillButtons = new SkillButtonHandler(this.combatEngine);
    this.damageNumbers = new DamageNumberManager();

    // Setup damage number spawning
    this.setupDamageNumbers();

    // Initialize bag integration (always create, even without full bag system)
    this.bagIntegration = new BagCombatIntegration(this.combatEngine, window.BagSystem || null);
    this.bagIntegration.initialize();

    // Setup input handlers
    this.setupInputHandlers();

    // Setup event listeners
    this.setupEventListeners();

    console.log('✅ Combat Demo Ready!');
    return true;
  }

  /**
   * Setup damage number spawning
   */
  setupDamageNumbers() {
    if (!window.combatEvents) return;

    window.combatEvents.addEventListener('damageDealt', (e) => {
      const { enemy, damage, element } = e.detail;
      if (enemy && enemy.alive !== false) {
        this.damageNumbers.spawn(enemy.x, enemy.y - 30, damage, {
          element: element || 'PHYSICAL',
          isCrit: false
        });
      }
    });

    window.combatEvents.addEventListener('playerHealed', (e) => {
      const { amount } = e.detail;
      this.damageNumbers.spawn(
        this.combatEngine.x,
        this.combatEngine.y - 50,
        amount,
        { isHeal: true }
      );
    });
  }

  /**
   * Setup input handlers
   */
  setupInputHandlers() {
    // Keyboard
    document.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      this.handleKeyPress(e.key.toLowerCase());
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    // Mouse
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.handleMouseClick(x, y);
    });
  }

  /**
   * Handle key press
   */
  handleKeyPress(key) {
    switch (key) {
      case '1':
        this.combatEngine.activateSkill(this.bagIntegration?.getEquippedSkill(1)?.id || 'A1_S1', this.mouseX, this.mouseY);
        break;
      case '2':
        this.combatEngine.activateSkill(this.bagIntegration?.getEquippedSkill(2)?.id || 'A1_S2', this.mouseX, this.mouseY);
        break;
      case '3':
        this.combatEngine.activateSkill(this.bagIntegration?.getEquippedSkill(3)?.id || 'A1_S3', this.mouseX, this.mouseY);
        break;
      case '4':
        this.combatEngine.activateSkill(this.bagIntegration?.getEquippedSkill(4)?.id || 'A1_S4', this.mouseX, this.mouseY);
        break;
      case '5':
        this.combatEngine.activateSkill(this.bagIntegration?.getEquippedSkill(5)?.id || 'A1_S5', this.mouseX, this.mouseY);
        break;
      case 'x':
        this.combatEngine.activateSkill(this.bagIntegration?.getEquippedSkill('X')?.id || 'A1_X1', this.mouseX, this.mouseY);
        break;
      case ' ':
        this.combatEngine.basicAttack(this.mouseX, this.mouseY);
        break;
      case 'c':
        this.switchCharacter();
        break;
      case 'r':
        this.combatEngine.activateRage();
        break;
      case 'b':
        if (this.bagIntegration) {
          this.bagIntegration.openBag();
        }
        break;
    }
  }

  /**
   * Handle mouse click
   */
  handleMouseClick(x, y) {
    // Basic attack on click
    this.combatEngine.basicAttack(x, y);
  }

  /**
   * Switch character
   */
  switchCharacter() {
    const characters = ['A1', 'UNIQUE', 'MISSY'];
    const currentIndex = characters.indexOf(this.combatEngine.activeCharacter);
    const nextIndex = (currentIndex + 1) % characters.length;
    this.combatEngine.switchCharacter(characters[nextIndex]);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    if (!window.combatEvents) {
      window.combatEvents = new EventTarget();
    }

    // Character switch
    window.combatEvents.addEventListener('characterSwitched', (e) => {
      console.log(`🔄 Switched to ${e.detail.characterId}`);
    });

    // Rage activated
    window.combatEvents.addEventListener('rageActivated', (e) => {
      console.log('🔥 RAGE MODE ACTIVATED - 2x ATK for 10 seconds!');
    });

    // Enemy attack
    window.combatEvents.addEventListener('enemyAttack', (e) => {
      this.combatEngine.takeDamage(e.detail.damage);
    });
  }

  /**
   * Update all systems
   */
  update(deltaTime) {
    // Update input-based movement
    let moving = false;
    const moveSpeed = 150 * deltaTime; // pixels per second

    if (this.keys['w'] || this.keys['arrowup']) {
      this.combatEngine.y -= moveSpeed;
      moving = true;
    }
    if (this.keys['s'] || this.keys['arrowdown']) {
      this.combatEngine.y += moveSpeed;
      moving = true;
    }
    if (this.keys['a'] || this.keys['arrowleft']) {
      this.combatEngine.x -= moveSpeed;
      moving = true;
    }
    if (this.keys['d'] || this.keys['arrowright']) {
      this.combatEngine.x += moveSpeed;
      moving = true;
    }

    this.combatEngine.setMoving(moving);

    // Clamp position to canvas
    this.combatEngine.x = Math.max(64, Math.min(this.canvas.width - 64, this.combatEngine.x));
    this.combatEngine.y = Math.max(64, Math.min(this.canvas.height - 64, this.combatEngine.y));

    // Update combat engine
    const aliveEnemies = this.enemySystem.getAliveEnemies();
    this.combatEngine.update(deltaTime, aliveEnemies);

    // Update enemy system
    this.enemySystem.update(deltaTime, this.combatEngine.x, this.combatEngine.y);

    // Update damage numbers
    this.damageNumbers.update(deltaTime);
  }

  /**
   * Render all systems
   */
  render() {
    // Clear canvas
    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render enemies
    this.enemySystem.render(this.ctx);

    // Render combat (sprites + projectiles)
    this.combatEngine.render(this.ctx);

    // Render damage numbers
    this.damageNumbers.render(this.ctx);

    // Render HUD
    this.combatHUD.render(this.ctx);
  }

  /**
   * Game loop
   */
  gameLoop(timestamp) {
    if (!this.isRunning) return;

    if (!this.lastTime) this.lastTime = timestamp;
    const deltaTime = (timestamp - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = timestamp;

    // Update
    this.update(deltaTime);

    // Render
    this.render();

    // Continue loop
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  /**
   * Start game
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = 0;
    this.gameLoop(0);
    console.log('🎮 Game started!');
  }

  /**
   * Stop game
   */
  stop() {
    this.isRunning = false;
    console.log('⏸️ Game stopped');
  }
}

