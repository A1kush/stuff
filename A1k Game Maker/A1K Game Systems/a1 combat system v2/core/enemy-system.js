/**
 * ENEMY SYSTEM
 * Simple enemy class with AI, movement, and collision detection
 * 
 * @version 1.0.0
 */

class Enemy {
  constructor(x, y, type = 'basic') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.alive = true;
    this.size = 20; // Collision radius
    
    // Stats based on type
    switch (type) {
      case 'basic':
        this.maxHP = 200;
        this.hp = 200;
        this.speed = 50; // pixels per second
        this.damage = 10;
        this.color = '#ff4444';
        break;
      case 'fast':
        this.maxHP = 150;
        this.hp = 150;
        this.speed = 80;
        this.damage = 8;
        this.color = '#ff8844';
        break;
      case 'tank':
        this.maxHP = 500;
        this.hp = 500;
        this.speed = 30;
        this.damage = 20;
        this.color = '#8844ff';
        break;
      default:
        this.maxHP = 200;
        this.hp = 200;
        this.speed = 50;
        this.damage = 10;
        this.color = '#ff4444';
    }

    // AI state
    this.state = 'chase'; // 'chase', 'patrol', 'attack'
    this.patrolTargetX = x;
    this.patrolTargetY = y;
    this.patrolRadius = 100;
    this.lastAttackTime = 0;
    this.attackCooldown = 2000; // 2 seconds

    // Status effects
    this.burning = 0;
    this.frozen = 0;
    this.stunned = 0;
  }

  /**
   * Update enemy AI and movement
   */
  update(deltaTime, playerX, playerY) {
    if (!this.alive) return;

    // Update status effects
    if (this.burning > 0) {
      this.burning -= deltaTime * 1000;
      if (this.burning > 0) {
        this.takeDamage(5 * deltaTime); // 5 DPS
      } else {
        this.burning = 0;
      }
    }

    if (this.frozen > 0) {
      this.frozen -= deltaTime * 1000;
      if (this.frozen <= 0) {
        this.frozen = 0;
      }
    }

    if (this.stunned > 0) {
      this.stunned -= deltaTime * 1000;
      if (this.stunned <= 0) {
        this.stunned = 0;
      }
    }

    // Don't move if frozen or stunned
    if (this.frozen > 0 || this.stunned > 0) {
      return;
    }

    // Calculate distance to player
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // AI behavior
    if (this.state === 'chase') {
      // Move toward player
      if (dist > 30) { // Don't get too close
        const moveSpeed = this.speed * deltaTime;
        const angle = Math.atan2(dy, dx);
        this.x += Math.cos(angle) * moveSpeed;
        this.y += Math.sin(angle) * moveSpeed;
      } else {
        // Attack player if close enough
        if (Date.now() - this.lastAttackTime > this.attackCooldown) {
          this.attackPlayer();
          this.lastAttackTime = Date.now();
        }
      }
    } else if (this.state === 'patrol') {
      // Simple patrol behavior
      const patrolDx = this.patrolTargetX - this.x;
      const patrolDy = this.patrolTargetY - this.y;
      const patrolDist = Math.sqrt(patrolDx * patrolDx + patrolDy * patrolDy);

      if (patrolDist < 10) {
        // Pick new patrol target
        const angle = Math.random() * Math.PI * 2;
        this.patrolTargetX = this.x + Math.cos(angle) * this.patrolRadius;
        this.patrolTargetY = this.y + Math.sin(angle) * this.patrolRadius;
      } else {
        const moveSpeed = this.speed * deltaTime * 0.5; // Slower patrol
        const angle = Math.atan2(patrolDy, patrolDx);
        this.x += Math.cos(angle) * moveSpeed;
        this.y += Math.sin(angle) * moveSpeed;
      }

      // Switch to chase if player is nearby
      if (dist < 200) {
        this.state = 'chase';
      }
    }
  }

  /**
   * Attack player
   */
  attackPlayer() {
    if (window.combatEvents) {
      window.combatEvents.dispatchEvent(new CustomEvent('enemyAttack', {
        detail: { enemy: this, damage: this.damage }
      }));
    }
  }

  /**
   * Take damage
   */
  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      this.deathTime = Date.now();
    }
  }

  /**
   * Render enemy
   */
  render(ctx) {
    if (!this.alive) return;

    ctx.save();

    // Draw enemy body
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // Draw HP bar
    const barWidth = this.size * 2;
    const barHeight = 4;
    const barX = this.x - barWidth / 2;
    const barY = this.y - this.size - 10;

    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // HP fill
    const hpPercent = this.hp / this.maxHP;
    ctx.fillStyle = hpPercent > 0.5 ? '#0f0' : (hpPercent > 0.25 ? '#ff0' : '#f00');
    ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);

    // Status effect indicators
    if (this.burning > 0) {
      ctx.fillStyle = '#ff4400';
      ctx.fillRect(this.x - 5, this.y - this.size - 15, 10, 2);
    }
    if (this.frozen > 0) {
      ctx.fillStyle = '#00ddff';
      ctx.fillRect(this.x - 5, this.y - this.size - 12, 10, 2);
    }
    if (this.stunned > 0) {
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(this.x - 5, this.y - this.size - 9, 10, 2);
    }

    ctx.restore();
  }
}

class EnemySystem {
  constructor() {
    this.enemies = [];
    this.spawnTimer = 0;
    this.spawnInterval = 3000; // Spawn every 3 seconds
    this.maxEnemies = 10;
  }

  /**
   * Spawn enemy
   */
  spawnEnemy(x, y, type = 'basic') {
    if (this.enemies.length >= this.maxEnemies) return null;

    const enemy = new Enemy(x, y, type);
    this.enemies.push(enemy);
    return enemy;
  }

  /**
   * Spawn enemy at random position
   */
  spawnRandomEnemy(canvasWidth, canvasHeight) {
    const margin = 100;
    const x = margin + Math.random() * (canvasWidth - margin * 2);
    const y = margin + Math.random() * (canvasHeight - margin * 2);
    
    // Random type
    const types = ['basic', 'basic', 'basic', 'fast', 'tank']; // Weighted
    const type = types[Math.floor(Math.random() * types.length)];
    
    return this.spawnEnemy(x, y, type);
  }

  /**
   * Update all enemies
   */
  update(deltaTime, playerX, playerY) {
    // Spawn new enemies
    this.spawnTimer += deltaTime * 1000;
    if (this.spawnTimer >= this.spawnInterval && this.enemies.length < this.maxEnemies) {
      this.spawnRandomEnemy(800, 600); // Default canvas size
      this.spawnTimer = 0;
    }

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(deltaTime, playerX, playerY);

      // Remove dead enemies after 2 seconds
      if (!enemy.alive && enemy.deathTime && Date.now() - enemy.deathTime > 2000) {
        this.enemies.splice(i, 1);
      }
    }
  }

  /**
   * Render all enemies
   */
  render(ctx) {
    for (const enemy of this.enemies) {
      enemy.render(ctx);
    }
  }

  /**
   * Get alive enemies
   */
  getAliveEnemies() {
    return this.enemies.filter(e => e.alive);
  }

  /**
   * Clear all enemies
   */
  clear() {
    this.enemies = [];
    this.spawnTimer = 0;
  }
}

