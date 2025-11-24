/**
 * A1 Button System - Production Ready Button Controller
 * Modular, event-driven button system with candy/chibi/anime styling
 * @version 1.0.0
 */

import { JoystickController } from './joystick-controller.js';
import { AIOverlay } from './ai-overlay.js';

export class A1ButtonSystem {
  constructor(options = {}) {
    this.config = {
      theme: options.theme || 'candy',
      enableAI: options.enableAI !== false,
      enableJoystick: options.enableJoystick !== false,
      enableSkills: options.enableSkills !== false,
      enableUtilities: options.enableUtilities !== false,
      enableAttack: options.enableAttack !== false,
      ...options
    };
    
    // Event listeners
    this.listeners = {
      'button:press': [],
      'button:release': [],
      'skill:activate': [],
      'joystick:move': [],
      'joystick:start': [],
      'joystick:end': [],
      'ai:command': [],
      'ai:summon': [],
      'utility:press': [],
      'attack:press': []
    };
    
    // State
    this.skillStates = {
      S1: { ready: false, cooldown: 0 },
      S2: { ready: false, cooldown: 0 },
      S3: { ready: false, cooldown: 0 }
    };
    
    this.joystickReady = false;
    
    // Modules
    this.joystick = null;
    this.aiOverlay = null;
    
    // DOM
    this.container = null;
    this.root = null;
  }
  
  mount(containerSelector) {
    const container = typeof containerSelector === 'string' 
      ? document.querySelector(containerSelector)
      : containerSelector;
      
    if (!container) {
      console.error('A1ButtonSystem: Container not found');
      return;
    }
    
    this.container = container;
    
    // Create main structure
    this.root = document.createElement('div');
    this.root.className = `a1-button-system theme-${this.config.theme}`;
    this.root.innerHTML = this.generateHTML();
    
    container.appendChild(this.root);
    
    // Mount modules
    if (this.config.enableJoystick) {
      this.mountJoystick();
    }
    
    if (this.config.enableAI) {
      this.mountAI();
    }
    
    // Attach button listeners
    this.attachButtonListeners();
    
    return this;
  }
  
  generateHTML() {
    return `
      <div class="a1-button-wrap">
        ${this.config.enableJoystick || this.config.enableUtilities ? `
        <div class="a1-left-cluster">
          ${this.config.enableUtilities ? this.generateUtilitiesHTML() : ''}
          ${this.config.enableJoystick ? this.generateJoystickHTML() : ''}
        </div>
        ` : ''}
        
        ${this.config.enableSkills || this.config.enableAttack ? `
        <div class="a1-right-cluster">
          ${this.config.enableSkills ? this.generateSkillsHTML() : ''}
          ${this.config.enableAttack ? this.generateAttackHTML() : ''}
        </div>
        ` : ''}
      </div>
    `;
  }
  
  generateUtilitiesHTML() {
    return `
      <div class="utility-stack">
        <div class="utility-row top">
          <button class="utility-btn" data-btn="pet" aria-label="Pet">Pet</button>
          <button class="utility-btn" data-btn="veh" aria-label="Vehicle">Veh</button>
          <button class="utility-btn" data-btn="act" aria-label="Action">Act</button>
          <button class="utility-btn" data-btn="act2" aria-label="Action 2">Act2</button>
        </div>
        <div class="utility-row bot">
          <button class="utility-btn" data-btn="bag" aria-label="Bag">Bag</button>
          <button class="utility-btn ai-btn" data-btn="ai" aria-label="AI">AI</button>
          <button class="utility-btn" data-btn="switch" aria-label="Switch">Switch</button>
        </div>
      </div>
    `;
  }
  
  generateJoystickHTML() {
    return `
      <div class="vj-root" id="vj-joystick">
        <div class="vj-base"></div>
        <div class="vj-knob"></div>
      </div>
    `;
  }
  
  generateSkillsHTML() {
    return `
      <div class="skill-row">
        <button class="skill-pill s1" data-skill="S1" data-btn="s1" aria-label="Skill 1">
          <span class="skill-label">S1</span>
        </button>
        <button class="skill-pill s2" data-skill="S2" data-btn="s2" aria-label="Skill 2">
          <span class="skill-label">S2</span>
        </button>
        <button class="skill-pill s3" data-skill="S3" data-btn="s3" aria-label="Skill 3">
          <span class="skill-label">S3</span>
        </button>
      </div>
    `;
  }
  
  generateAttackHTML() {
    return `
      <div class="attack-container">
        <div class="main-attacks">
          <button class="big-btn attack" data-btn="attack" aria-label="Attack">ATTACK</button>
          <button class="big-btn jump" data-btn="jump" aria-label="Jump">JUMP</button>
        </div>
        <div class="rage-shield-cluster">
          <button class="rage-shield-btn rage" data-btn="rage" aria-label="Rage">RAGE</button>
          <button class="rage-shield-btn shield" data-btn="shield" aria-label="Shield">SHIELD</button>
        </div>
      </div>
    `;
  }
  
  mountJoystick() {
    const joystickRoot = this.root.querySelector('#vj-joystick');
    if (!joystickRoot) return;
    
    this.joystick = new JoystickController({
      radius: 59,
      knobRadius: 26
    });
    
    this.joystick.mount(joystickRoot);
    
    // Forward joystick events
    this.joystick.on('move', (data) => this.emit('joystick:move', data));
    this.joystick.on('start', (data) => this.emit('joystick:start', data));
    this.joystick.on('end', (data) => this.emit('joystick:end', data));
  }
  
  mountAI() {
    this.aiOverlay = new AIOverlay({
      robotSystem: this.config.robotSystem
    });
    
    this.aiOverlay.mount(document.body);
    
    // Forward AI events
    this.aiOverlay.on('command', (data) => this.emit('ai:command', data));
    this.aiOverlay.on('summon', (data) => this.emit('ai:summon', data));
    this.aiOverlay.on('mode-change', (data) => this.emit('ai:mode-change', data));
    this.aiOverlay.on('target-change', (data) => this.emit('ai:target-change', data));
  }
  
  attachButtonListeners() {
    // All buttons
    const buttons = this.root.querySelectorAll('[data-btn]');
    
    buttons.forEach(btn => {
      const btnType = btn.dataset.btn;
      
      // Touch events
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.handleButtonPress(btnType, btn);
      });
      
      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.handleButtonRelease(btnType, btn);
      });
      
      // Mouse events
      btn.addEventListener('mousedown', (e) => {
        this.handleButtonPress(btnType, btn);
      });
      
      btn.addEventListener('mouseup', (e) => {
        this.handleButtonRelease(btnType, btn);
      });
      
      // Click for specific actions
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleButtonClick(btnType, btn);
      });
    });
  }
  
  handleButtonPress(btnType, element) {
    element.classList.add('pressed');
    this.emit('button:press', { button: btnType, element });
    
    // Specific button types
    if (btnType.startsWith('s')) {
      this.emit('skill:activate', { skill: btnType.toUpperCase(), element });
    } else if (['pet', 'veh', 'act', 'act2', 'bag', 'switch'].includes(btnType)) {
      this.emit('utility:press', { utility: btnType, element });
    } else if (['attack', 'jump', 'rage', 'shield'].includes(btnType)) {
      this.emit('attack:press', { attack: btnType, element });
    }
  }
  
  handleButtonRelease(btnType, element) {
    element.classList.remove('pressed');
    this.emit('button:release', { button: btnType, element });
  }
  
  handleButtonClick(btnType, element) {
    // Special handling for AI button
    if (btnType === 'ai' && this.aiOverlay) {
      this.aiOverlay.toggle();
    }
    
    // Add bounce animation
    element.classList.add('bounce');
    setTimeout(() => element.classList.remove('bounce'), 300);
  }
  
  // Public API
  setSkillReady(skillId, ready = true) {
    const skillUpper = skillId.toUpperCase();
    if (this.skillStates[skillUpper]) {
      this.skillStates[skillUpper].ready = ready;
    }
    
    const skillEl = this.root?.querySelector(`[data-skill="${skillUpper}"]`);
    if (skillEl) {
      skillEl.classList.toggle('ready', ready);
    }
    
    return this;
  }
  
  setSkillCooldown(skillId, cooldown) {
    const skillUpper = skillId.toUpperCase();
    if (this.skillStates[skillUpper]) {
      this.skillStates[skillUpper].cooldown = cooldown;
    }
    return this;
  }
  
  setJoystickReady(ready = true) {
    this.joystickReady = ready;
    if (this.joystick) {
      this.joystick.setReady(ready);
    }
    return this;
  }
  
  toggleAIOverlay() {
    if (this.aiOverlay) {
      this.aiOverlay.toggle();
    }
    return this;
  }
  
  showAI() {
    if (this.aiOverlay) {
      this.aiOverlay.show();
    }
    return this;
  }
  
  hideAI() {
    if (this.aiOverlay) {
      this.aiOverlay.hide();
    }
    return this;
  }
  
  setRobotStatus(status) {
    if (this.aiOverlay) {
      this.aiOverlay.setRobotStatus(status);
    }
    return this;
  }
  
  // Event system
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
    return this;
  }
  
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
    return this;
  }
  
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
  
  destroy() {
    // Destroy modules
    if (this.joystick) {
      this.joystick.destroy();
      this.joystick = null;
    }
    
    if (this.aiOverlay) {
      this.aiOverlay.destroy();
      this.aiOverlay = null;
    }
    
    // Remove DOM
    if (this.root && this.root.parentElement) {
      this.root.parentElement.removeChild(this.root);
    }
    
    // Clear listeners
    Object.keys(this.listeners).forEach(key => {
      this.listeners[key] = [];
    });
    
    this.container = null;
    this.root = null;
  }
}

// Export for non-module usage
if (typeof window !== 'undefined') {
  window.A1ButtonSystem = A1ButtonSystem;
}

