/**
 * SKILL EXECUTOR
 * Executes skills and triggers VFX/projectiles
 * 
 * @version 1.0.0
 */

class SkillExecutor {
  constructor(projectileManager) {
    this.projectileManager = projectileManager;
    this.cooldowns = {}; // Track cooldowns by skillId
    this.audioContext = null; // Web Audio API context
    this.initAudio();
  }

  /**
   * Initialize Web Audio API for sound effects
   */
  initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  /**
   * Play sound effect for skill
   */
  playSkillSound(skillType, element) {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // Different frequencies for different skill types
      let frequency = 440; // Default A4
      if (skillType === 'xwave' || skillType === 'slash') frequency = 330; // Lower for melee
      else if (skillType === 'plasma' || skillType === 'beam') frequency = 550; // Higher for energy
      else if (skillType === 'explosion') frequency = 220; // Very low for explosions

      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.2);
    } catch (e) {
      // Silently fail if audio context is suspended
    }
  }

  /**
   * Execute a skill
   * Enhanced to support charge level and modified skill stats
   * Infinite Horizon: Added Public Mode restrictions for A1
   */
  executeSkill(skillId, sourceX, sourceY, targetX, targetY, characterState, chargeLevel = 1.0, modifiedSkill = null) {
    // Use modified skill if provided, otherwise get from database
    const skill = modifiedSkill || getSkillById(skillId);
    if (!skill) {
      console.warn(`Skill ${skillId} not found`);
      return false;
    }

    // Infinite Horizon: Public Mode Combat Restrictions for A1
    const heroId = characterState?.activeCharacter || characterState?.id || 'A1';
    if (heroId === 'A1' && window.gameState && !window.gameState.isShadowMode) {
      // Public Mode: Only allow basic attack and skills with damage <= 50
      if (skill.damage > 50) {
        // Suspicion spike!
        window.gameState.suspicionMeter += 30;
        window.gameState.suspicionMeter = Math.min(100, window.gameState.suspicionMeter);
        
        // Show warning notification
        if (window.A1KBagSystem && typeof window.A1KBagSystem.notify === 'function') {
          window.A1KBagSystem.notify('WARNING: Suspicion Spike!', 'Cover blown! High-damage skill used in Public Mode!');
        } else {
          console.warn('⚠️ WARNING: Suspicion Spike! Cover blown! High-damage skill used in Public Mode!');
        }
        
        // Still allow the skill, but increase suspicion
        // Optionally: return false to block the skill entirely
        // return false;
      }
    }

    // Check cooldown
    if (this.isOnCooldown(skillId)) {
      console.log(`Skill ${skill.name} is on cooldown`);
      return false;
    }

    // Execute based on skill pattern
    this.executeSkillPattern(skill, sourceX, sourceY, targetX, targetY, characterState);

    // Play sound effect
    this.playSkillSound(skill.shape || skill.type || 'plasma', skill.element);

    // Start cooldown
    this.startCooldown(skillId, skill.cooldown * 1000);

    // Dispatch skill use event
    if (window.combatEvents) {
      window.combatEvents.dispatchEvent(new CustomEvent('skillUsed', {
        detail: { skill, sourceX, sourceY, targetX, targetY }
      }));
    }

    // Infinite Horizon: Domain Expansion (A1 Ultimate) - Phase 4
    if (skillId === 'S90_VOID_DOMAIN' || skillId === 'A1_DIMENSION_BREAKER') {
      // Apply screen shatter filter
      if (window.EffectsSystem) {
        window.EffectsSystem.applyScreenFilter('SHATTER_RED');
      }
      
      // Pause combat for 1 second (set all enemies to invulnerable)
      if (window.combatEngine) {
        window.combatEngine.isPaused = true;
        setTimeout(() => {
          window.combatEngine.isPaused = false;
          
          // Deal massive damage to locked-on target
          if (characterState && characterState.x !== undefined && characterState.y !== undefined) {
            const targetDamage = (characterState.characters?.A1?.attackPower || 1.0) * 1000;
            // Will be handled by targeting system in Phase 4
            if (window.combatEngine && window.combatEngine.target) {
              // Damage target after pause
              console.log(`💥 Domain Expansion: ${targetDamage} damage to target!`);
            }
          }
        }, 1000);
      }
    }

    // Spawn damage number even if no enemy hit (show skill damage at target)
    if (window.damageNumberManager) {
      window.damageNumberManager.spawnSkillDamage(skill, targetX, targetY);
    }

    return true;
  }

  /**
   * Execute skill based on its pattern
   * Enhanced to be character-aware for proper visual effects
   */
  executeSkillPattern(skill, sourceX, sourceY, targetX, targetY, characterState) {
    const characterId = skill.characterId || characterState?.characterId || 'A1';
    const desc = skill.description.toLowerCase();
    const skillName = skill.name.toLowerCase();
    
    // Character-specific skill routing
    if (characterId === 'MISSY') {
      // MISSY skills with "slash" or "crescent" should use sword slashes
      if (desc.includes('crescent') || desc.includes('slash') || skillName.includes('blade')) {
        // Use sword slashes for MISSY's blade skills
        const hitCount = desc.includes('3-hit') ? 3 : (desc.includes('5-hit') ? 5 : 3);
        const colors = ['#FFD700', '#00FFFF']; // Gold, Cyan
        const radius = 70;
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const baseAngle = Math.atan2(dy, dx);
        
        for (let i = 0; i < hitCount; i++) {
          const angle = baseAngle + ((i % 2 === 0) ? -0.4 : 0.4);
          const color = colors[i % 2];
          const damage = (skill.damage || skill.baseDamage || 130) / hitCount;
          
          this.projectileManager.spawnSwordSlash(
            'MISSY',
            sourceX + 35,
            sourceY,
            angle,
            color,
            radius,
            damage,
            i * 0.10
          );
        }
        return;
      }
      // MISSY skills with "pistol" or "rapid fire" should use pistol shots
      else if (desc.includes('pistol') || desc.includes('rapid fire') || desc.includes('gun')) {
        const hitCount = desc.includes('4-hit') ? 4 : (desc.includes('16') ? 16 : 4);
        const damage = (skill.damage || skill.baseDamage || 200) / hitCount;
        
        for (let i = 0; i < hitCount; i++) {
          const homing = 8 + (i % 5);
          this.projectileManager.spawnPistolShot(
            sourceX + 45,
            sourceY - 5,
            targetX,
            targetY,
            damage,
            homing,
            720,
            i * 0.12
          );
        }
        return;
      }
    }
    else if (characterId === 'UNIQUE') {
      // UNIQUE skills with "plasma" or "blast" should use burst shots
      if (desc.includes('plasma') || desc.includes('blast') || skillName.includes('plasma')) {
        const hitCount = desc.includes('3-hit') ? 3 : 1;
        const damage = skill.damage || skill.baseDamage || 120;
        const pierce = skill.pierce || 4;
        const speed = 875;
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const baseAngle = Math.atan2(dy, dx);
        
        // Calculate spread pattern
        const totalSpread = hitCount > 1 ? Math.PI / 12 : 0;
        const spreadStep = hitCount > 1 ? totalSpread / (hitCount - 1) : 0;
        const startSpread = -totalSpread / 2;
        
        for (let i = 0; i < hitCount; i++) {
          const spread = startSpread + (i * spreadStep);
          const angle = baseAngle + spread;
          const distance = Math.sqrt(dx * dx + dy * dy) || 500;
          const spreadTargetX = sourceX + Math.cos(angle) * distance;
          const spreadTargetY = sourceY + Math.sin(angle) * distance;
          
          this.projectileManager.spawnBurstShot(
            sourceX + 45,
            sourceY,
            spreadTargetX,
            spreadTargetY,
            damage / hitCount,
            pierce,
            speed,
            spread,
            i * 0.08
          );
        }
        return;
      }
    }
    else if (characterId === 'A1') {
      // A1 skills with "slash" should use sword swings
      if (desc.includes('slash') || desc.includes('crimson') || skillName.includes('slash')) {
        const hitCount = desc.includes('3-hit') ? 3 : (desc.includes('6-hit') ? 6 : 3);
        const colors = ['#ff0000', '#ffffff']; // Red, White
        const radius = 72;
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const baseAngle = Math.atan2(dy, dx);
        
        for (let i = 0; i < hitCount; i++) {
          const angle = baseAngle + ((i % 2 === 0) ? -0.5 : 0.5);
          const color = colors[i % 2];
          const damage = (skill.damage || skill.baseDamage || 130) / hitCount;
          
          this.projectileManager.spawnSwordSlash(
            'A1',
            sourceX + 40,
            sourceY,
            angle,
            color,
            radius,
            damage,
            i * 0.10
          );
        }
        return;
      }
    }
    
    // Default pattern matching (for non-character-specific skills)
    if (desc.includes('3-hit') || desc.includes('triple')) {
      // 3-hit combo (Crimson Slash, Crescent Slash, Plasma Blast)
      this.projectileManager.spawnMultiHit(skill, sourceX, sourceY, targetX, targetY, 3);
    }
    else if (desc.includes('4-hit')) {
      // 4-hit combo (Power Wave, Rapid Fire)
      this.projectileManager.spawnMultiHit(skill, sourceX, sourceY, targetX, targetY, 4);
    }
    else if (desc.includes('5-hit')) {
      // 5-hit combo (Blade Dance)
      this.projectileManager.spawnMultiHit(skill, sourceX, sourceY, targetX, targetY, 5);
    }
    else if (desc.includes('6-hit') || desc.includes('6 slashes')) {
      // 6-hit combo (Phantom Strike)
      this.projectileManager.spawnMultiHit(skill, sourceX, sourceY, targetX, targetY, 6);
    }
    else if (desc.includes('10-hit')) {
      // 10-hit combo (Thunder Volley)
      this.projectileManager.spawnMultiHit(skill, sourceX, sourceY, targetX, targetY, 10);
    }
    else if (desc.includes('16 pistol shots')) {
      // 16-hit combo (Blade Tempest)
      this.projectileManager.spawnMultiHit(skill, sourceX, sourceY, targetX, targetY, 16);
    }
    else if (desc.includes('20-hit') || desc.includes('20 ')) {
      // 20-hit combo (Laser Barrage, Treasure Rain)
      this.projectileManager.spawnMultiHit(skill, sourceX, sourceY, targetX, targetY, 20);
    }
    else if (desc.includes('30 ')) {
      // 30-hit combo (Holy Arrow Barrage)
      this.projectileManager.spawnMultiHit(skill, sourceX, sourceY, targetX, targetY, 30);
    }
    else if (desc.includes('beam') || desc.includes('channeled') || desc.includes('rail')) {
      // Beam skills (Power Beam, Hyper Beam, Angel Beam, etc.)
      const duration = skill.chargeable ? 2000 : 1000;
      this.projectileManager.spawnBeam(skill, sourceX, sourceY, targetX, targetY, duration);
    }
    else if (desc.includes('explosion') || desc.includes('nova') || desc.includes('blast') || 
             desc.includes('aoe') || desc.includes('shockwave') || desc.includes('wave')) {
      // Explosion/AoE skills
      const radius = skill.tier === 'legendary' ? 150 : (skill.tier === 'epic' ? 120 : 100);
      this.projectileManager.spawnExplosion(skill, targetX, targetY, radius);
    }
    else if (desc.includes('summon') || desc.includes('clone') || desc.includes('drone') || 
             desc.includes('pet') || desc.includes('companion')) {
      // Summon skills - spawn at target location
      this.spawnSummon(skill, targetX, targetY, characterState);
    }
    else if (desc.includes('teleport') || desc.includes('dash') || desc.includes('shift')) {
      // Teleport/dash skills - move character
      this.executeTeleport(skill, sourceX, sourceY, targetX, targetY, characterState);
    }
    else if (desc.includes('shield') || desc.includes('barrier')) {
      // Shield skills
      this.activateShield(skill, characterState);
    }
    else if (desc.includes('revive') || desc.includes('lives')) {
      // Revive skills
      this.activateRevive(skill, characterState);
    }
    else {
      // Default: single projectile
      this.projectileManager.spawnProjectile(skill, sourceX, sourceY, targetX, targetY);
    }
  }

  /**
   * Spawn summon ally
   */
  spawnSummon(skill, x, y, characterState) {
    if (window.combatEvents) {
      window.combatEvents.dispatchEvent(new CustomEvent('summonSpawned', {
        detail: { skill, x, y, characterState }
      }));
    }
    
    // Visual effect
    this.projectileManager.spawnExplosion(
      { ...skill, damage: 0 },
      x,
      y,
      60
    );
  }

  /**
   * Execute teleport
   */
  executeTeleport(skill, sourceX, sourceY, targetX, targetY, characterState) {
    if (window.combatEvents) {
      window.combatEvents.dispatchEvent(new CustomEvent('teleport', {
        detail: { skill, fromX: sourceX, fromY: sourceY, toX: targetX, toY: targetY }
      }));
    }

    // Spawn VFX at source and destination
    this.projectileManager.spawnExplosion(
      { ...skill, damage: 0 },
      sourceX,
      sourceY,
      40
    );
    
    setTimeout(() => {
      this.projectileManager.spawnExplosion(
        { ...skill, damage: 0 },
        targetX,
        targetY,
        40
      );
    }, 200);
  }

  /**
   * Activate shield
   */
  activateShield(skill, characterState) {
    if (characterState) {
      characterState.shieldActive = true;
      characterState.shieldDuration = 5000; // 5 seconds
      characterState.shieldAmount = skill.tier === 'epic' ? 500 : 300;
    }

    if (window.combatEvents) {
      window.combatEvents.dispatchEvent(new CustomEvent('shieldActivated', {
        detail: { skill }
      }));
    }
  }

  /**
   * Activate revive
   */
  activateRevive(skill, characterState) {
    if (characterState) {
      characterState.reviveActive = true;
      characterState.reviveCount = 1;
    }

    if (window.combatEvents) {
      window.combatEvents.dispatchEvent(new CustomEvent('reviveActivated', {
        detail: { skill }
      }));
    }
  }

  /**
   * Basic attack (ATK button) - Character-specific attack patterns
   * Routes to character-specific handlers
   */
  executeBasicAttack(characterId, sourceX, sourceY, targetX, targetY, rageActive = false) {
    // Check cooldown
    const basicAttackId = `${characterId}_BASIC_ATK`;
    if (this.isOnCooldown(basicAttackId)) {
      return false;
    }

    // Route to character-specific handler
    switch (characterId) {
      case 'A1':
        this.executeA1BasicAttack(sourceX, sourceY, targetX, targetY, rageActive);
        break;
      case 'MISSY':
        this.executeMissyBasicAttack(sourceX, sourceY, targetX, targetY, rageActive);
        break;
      case 'UNIQUE':
        this.executeUniqueBasicAttack(sourceX, sourceY, targetX, targetY, rageActive);
        break;
      default:
        console.warn(`Unknown character for basic attack: ${characterId}`);
        return false;
    }

    // Play basic attack sound
    this.playSkillSound('xwave', 'PHYSICAL');

    // Start cooldown
    this.startCooldown(basicAttackId, 500);

    // Dispatch basic attack event
    if (window.combatEvents) {
      window.combatEvents.dispatchEvent(new CustomEvent('basicAttack', {
        detail: { characterId, sourceX, sourceY, targetX, targetY }
      }));
    }

    return true;
  }

  /**
   * A1 Basic Attack: 5-hit sword combo (10-hit in rage)
   * Progressive damage: [100, 130, 160, 190, 220]
   * Colors: Red/White alternating
   * Angles: Alternating -0.5 and 0.5 radians
   */
  executeA1BasicAttack(sourceX, sourceY, targetX, targetY, rageActive) {
    const hitCount = rageActive ? 10 : 5;
    const colors = ['#ff0000', '#ffffff']; // Red, White
    const damages = [100, 130, 160, 190, 220];
    const radius = 72;
    const timing = 0.10; // 0.10s between hits
    
    // Calculate base angle toward target
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const baseAngle = Math.atan2(dy, dx);
    
    for (let i = 0; i < hitCount; i++) {
      const hitNum = (i % 5) + 1; // Cycle through 1-5
      const color = colors[i % 2]; // Alternate red/white
      const angle = baseAngle + ((i % 2 === 0) ? -0.5 : 0.5); // Alternating angles
      const damage = damages[hitNum - 1] * (rageActive ? 1.35 : 1.0); // Rage multiplier
      
      this.projectileManager.spawnSwordSlash(
        'A1',
        sourceX + 40, // Offset for character position
        sourceY,
        angle,
        color,
        radius,
        damage,
        i * timing
      );
    }
    
    // 5% chance X-wave finisher (300 damage)
    if (Math.random() < 0.05) {
      // Spawn X-wave explosion at target
      this.projectileManager.spawnExplosion(
        { id: 'A1_BASIC_XWAVE', damage: 300, element: 'PHYSICAL' },
        targetX,
        targetY,
        100
      );
    }
  }

  /**
   * MISSY Basic Attack: 2 sword slashes + 2-4 pistol shots (3-4 in rage)
   * Sword: 65 damage, gold/cyan, angles -0.4/0.4
   * Pistol: 85 damage, speed 720, homing 8-12
   */
  executeMissyBasicAttack(sourceX, sourceY, targetX, targetY, rageActive) {
    const pistolCount = rageActive ? 4 : 2;
    const radius = 70;
    
    // Calculate base angle toward target
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const baseAngle = Math.atan2(dy, dx);
    
    // Sword hits (2)
    const swordColors = ['#FFD700', '#00FFFF']; // Gold, Cyan
    for (let i = 0; i < 2; i++) {
      const angle = baseAngle + ((i % 2 === 0) ? -0.4 : 0.4);
      const color = swordColors[i];
      
      this.projectileManager.spawnSwordSlash(
        'MISSY',
        sourceX + 35,
        sourceY,
        angle,
        color,
        radius,
        65,
        i * 0.10 // 0.10s between sword hits
      );
    }
    
    // Pistol shots (2-4)
    for (let i = 0; i < pistolCount; i++) {
      const homing = 8 + (i * 1); // 8-12 homing strength
      
      this.projectileManager.spawnPistolShot(
        sourceX + 45,
        sourceY - 5,
        targetX,
        targetY,
        85,
        homing,
        720,
        0.12 + (i * 0.12) // Stagger pistol shots
      );
    }
  }

  /**
   * UNIQUE Basic Attack: 2-3 burst shots (3 in rage)
   * Damage: 115 per shot
   * Speed: 875, Pierce: 4 (normal), 6 (rage)
   * Spread: Even spread pattern
   */
  executeUniqueBasicAttack(sourceX, sourceY, targetX, targetY, rageActive) {
    const shotCount = rageActive ? 3 : 2;
    const pierce = rageActive ? 6 : 4;
    const damage = 115;
    const speed = 875;
    const timing = 0.08; // 0.08s between shots
    
    // Calculate base angle toward target
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const baseAngle = Math.atan2(dy, dx);
    
    // Calculate spread pattern
    const totalSpread = Math.PI / 12; // 15 degrees total spread
    const spreadStep = shotCount > 1 ? totalSpread / (shotCount - 1) : 0;
    const startSpread = -totalSpread / 2;
    
    for (let i = 0; i < shotCount; i++) {
      const spread = startSpread + (i * spreadStep);
      const angle = baseAngle + spread;
      
      // Calculate target position with spread
      const distance = Math.sqrt(dx * dx + dy * dy) || 500;
      const spreadTargetX = sourceX + Math.cos(angle) * distance;
      const spreadTargetY = sourceY + Math.sin(angle) * distance;
      
      this.projectileManager.spawnBurstShot(
        sourceX + 45,
        sourceY,
        spreadTargetX,
        spreadTargetY,
        damage,
        pierce,
        speed,
        spread,
        i * timing
      );
    }
  }

  /**
   * Check if skill is on cooldown
   */
  isOnCooldown(skillId) {
    const cd = this.cooldowns[skillId];
    if (!cd) return false;
    return Date.now() < cd.endTime;
  }

  /**
   * Get cooldown remaining (seconds)
   */
  getCooldownRemaining(skillId) {
    const cd = this.cooldowns[skillId];
    if (!cd) return 0;
    
    const remaining = cd.endTime - Date.now();
    return Math.max(0, remaining / 1000);
  }

  /**
   * Get cooldown progress (0-1)
   */
  getCooldownProgress(skillId) {
    const cd = this.cooldowns[skillId];
    if (!cd) return 1.0;
    
    const elapsed = Date.now() - cd.startTime;
    const duration = cd.endTime - cd.startTime;
    return Math.min(1.0, elapsed / duration);
  }

  /**
   * Start cooldown
   */
  startCooldown(skillId, durationMs) {
    this.cooldowns[skillId] = {
      startTime: Date.now(),
      endTime: Date.now() + durationMs
    };
  }

  /**
   * Reset all cooldowns
   */
  resetCooldowns() {
    this.cooldowns = {};
  }

  /**
   * Update (clean up expired cooldowns)
   */
  update() {
    const now = Date.now();
    for (const skillId in this.cooldowns) {
      if (this.cooldowns[skillId].endTime < now) {
        delete this.cooldowns[skillId];
      }
    }
  }
}
