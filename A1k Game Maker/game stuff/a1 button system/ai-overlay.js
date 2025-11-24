/**
 * AI Overlay Interface Module
 * Provides chat/command interface for AI robot control
 * @version 1.0.0
 */

export class AIOverlay {
  constructor(options = {}) {
    this.visible = false;
    this.robotSystem = options.robotSystem || null;
    this.currentRobot = null;
    
    // Event listeners
    this.listeners = {
      'command': [],
      'summon': [],
      'mode-change': [],
      'target-change': [],
      'close': []
    };
    
    // DOM elements
    this.overlay = null;
    this.commandInput = null;
    this.modeSelector = null;
    this.targetSelector = null;
    
    this.handleCommand = this.handleCommand.bind(this);
    this.handleSummon = this.handleSummon.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  
  mount(containerElement) {
    // Create overlay HTML
    this.overlay = document.createElement('div');
    this.overlay.className = 'ai-overlay';
    this.overlay.innerHTML = `
      <div class="ai-overlay-backdrop"></div>
      <div class="ai-overlay-panel">
        <div class="ai-overlay-header">
          <h2>🤖 AI Robot Control</h2>
          <button class="ai-close-btn" aria-label="Close">✕</button>
        </div>
        
        <div class="ai-overlay-content">
          <div class="ai-section">
            <h3>Summon Robot</h3>
            <div class="ai-summon-grid">
              <button class="ai-summon-btn" data-robot="combat">⚔️ Combat</button>
              <button class="ai-summon-btn" data-robot="support">💚 Support</button>
              <button class="ai-summon-btn" data-robot="stealth">🥷 Stealth</button>
              <button class="ai-summon-btn" data-robot="tank">🛡️ Tank</button>
            </div>
          </div>
          
          <div class="ai-section">
            <h3>Behavior Mode</h3>
            <select class="ai-selector" id="ai-mode-select">
              <option value="follow">Follow - Stay close to leader</option>
              <option value="aggro">Aggro - Attack enemies</option>
              <option value="guard">Guard - Protect leader</option>
              <option value="assist">Assist - Support attacks</option>
              <option value="patrol">Patrol - Circular patrol</option>
              <option value="defend">Defend - Defensive stance</option>
              <option value="hunt">Hunt - Aggressive pursuit</option>
              <option value="flank">Flank - Side attacks</option>
              <option value="snipe">Snipe - Long range</option>
              <option value="overwatch">Overwatch - High ground</option>
            </select>
          </div>
          
          <div class="ai-section">
            <h3>Target Priority</h3>
            <select class="ai-selector" id="ai-target-select">
              <option value="nearest">Nearest - Closest enemy</option>
              <option value="lowest">Lowest HP - Finish weak enemies</option>
              <option value="boss">Boss - Focus bosses</option>
              <option value="highest_hp">Highest HP - Tank targets</option>
              <option value="strongest">Strongest - High threat</option>
              <option value="grouped">Grouped - Dense clusters</option>
              <option value="lowest_ally">Lowest Ally - Heal priority</option>
            </select>
          </div>
          
          <div class="ai-section">
            <h3>Command Input</h3>
            <div class="ai-command-box">
              <input 
                type="text" 
                class="ai-command-input" 
                placeholder="Type command... (e.g., 'attack boss', 'heal team')"
              />
              <button class="ai-send-btn">Send</button>
            </div>
          </div>
          
          <div class="ai-section ai-status-section">
            <h3>Robot Status</h3>
            <div class="ai-status">
              <div class="ai-status-item">
                <span class="ai-status-label">Active:</span>
                <span class="ai-status-value" id="ai-robot-active">None</span>
              </div>
              <div class="ai-status-item">
                <span class="ai-status-label">Mode:</span>
                <span class="ai-status-value" id="ai-robot-mode">-</span>
              </div>
              <div class="ai-status-item">
                <span class="ai-status-label">Target:</span>
                <span class="ai-status-value" id="ai-robot-target">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    containerElement.appendChild(this.overlay);
    
    // Get references
    this.commandInput = this.overlay.querySelector('.ai-command-input');
    this.modeSelector = this.overlay.querySelector('#ai-mode-select');
    this.targetSelector = this.overlay.querySelector('#ai-target-select');
    
    // Attach event listeners
    this.overlay.querySelector('.ai-close-btn').addEventListener('click', this.handleClose);
    this.overlay.querySelector('.ai-overlay-backdrop').addEventListener('click', this.handleClose);
    this.overlay.querySelector('.ai-send-btn').addEventListener('click', this.handleCommand);
    this.commandInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleCommand();
    });
    
    // Summon buttons
    this.overlay.querySelectorAll('.ai-summon-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const robotType = e.currentTarget.dataset.robot;
        this.handleSummon(robotType);
      });
    });
    
    // Mode and target changes
    this.modeSelector.addEventListener('change', (e) => {
      this.emit('mode-change', { mode: e.target.value });
      this.updateStatus();
    });
    
    this.targetSelector.addEventListener('change', (e) => {
      this.emit('target-change', { targetMode: e.target.value });
      this.updateStatus();
    });
    
    // Initially hidden
    this.overlay.style.display = 'none';
  }
  
  show() {
    if (!this.overlay) return;
    this.visible = true;
    this.overlay.style.display = 'flex';
    this.overlay.classList.add('ai-overlay-visible');
    this.commandInput?.focus();
    this.emit('show', {});
  }
  
  hide() {
    if (!this.overlay) return;
    this.visible = false;
    this.overlay.classList.remove('ai-overlay-visible');
    setTimeout(() => {
      if (!this.visible) {
        this.overlay.style.display = 'none';
      }
    }, 300);
    this.emit('close', {});
  }
  
  toggle() {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }
  
  handleClose() {
    this.hide();
  }
  
  handleCommand() {
    const command = this.commandInput.value.trim();
    if (!command) return;
    
    this.emit('command', { command });
    this.commandInput.value = '';
    
    // Simple command parsing (can be expanded)
    this.parseCommand(command);
  }
  
  parseCommand(command) {
    const lower = command.toLowerCase();
    
    // Mode commands
    if (lower.includes('follow')) this.modeSelector.value = 'follow';
    else if (lower.includes('attack') || lower.includes('aggro')) this.modeSelector.value = 'aggro';
    else if (lower.includes('guard') || lower.includes('protect')) this.modeSelector.value = 'guard';
    else if (lower.includes('patrol')) this.modeSelector.value = 'patrol';
    else if (lower.includes('hunt')) this.modeSelector.value = 'hunt';
    else if (lower.includes('snipe')) this.modeSelector.value = 'snipe';
    
    // Target commands
    if (lower.includes('boss')) this.targetSelector.value = 'boss';
    else if (lower.includes('weak') || lower.includes('low')) this.targetSelector.value = 'lowest';
    else if (lower.includes('near')) this.targetSelector.value = 'nearest';
    else if (lower.includes('strong')) this.targetSelector.value = 'strongest';
    
    this.updateStatus();
  }
  
  handleSummon(robotType) {
    this.emit('summon', { robotType });
    this.currentRobot = robotType;
    this.updateStatus();
  }
  
  updateStatus() {
    if (!this.overlay) return;
    
    const activeEl = this.overlay.querySelector('#ai-robot-active');
    const modeEl = this.overlay.querySelector('#ai-robot-mode');
    const targetEl = this.overlay.querySelector('#ai-robot-target');
    
    if (activeEl) {
      activeEl.textContent = this.currentRobot || 'None';
      activeEl.className = 'ai-status-value ' + (this.currentRobot ? 'active' : '');
    }
    
    if (modeEl) {
      modeEl.textContent = this.modeSelector?.value || '-';
    }
    
    if (targetEl) {
      targetEl.textContent = this.targetSelector?.value || '-';
    }
  }
  
  setRobotStatus(status) {
    this.currentRobot = status.type || this.currentRobot;
    if (status.mode) this.modeSelector.value = status.mode;
    if (status.targetMode) this.targetSelector.value = status.targetMode;
    this.updateStatus();
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
    if (this.overlay && this.overlay.parentElement) {
      this.overlay.parentElement.removeChild(this.overlay);
    }
    this.overlay = null;
    this.listeners = {
      'command': [],
      'summon': [],
      'mode-change': [],
      'target-change': [],
      'close': []
    };
  }
}

