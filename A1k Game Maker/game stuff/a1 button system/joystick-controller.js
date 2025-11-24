/**
 * Joystick Controller Module
 * Handles touch and mouse input for virtual joystick
 * @version 1.0.0
 */

export class JoystickController {
  constructor(options = {}) {
    this.radius = options.radius || 59; // Half of base size
    this.knobRadius = options.knobRadius || 26; // Half of knob size
    this.isActive = false;
    this.ready = false;
    
    // Current position (-1 to 1 range)
    this.x = 0;
    this.y = 0;
    
    // Event listeners
    this.listeners = {
      'move': [],
      'start': [],
      'end': []
    };
    
    // DOM elements (set on mount)
    this.root = null;
    this.knob = null;
    
    this.handleStart = this.handleStart.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
  }
  
  mount(rootElement) {
    this.root = rootElement;
    this.knob = rootElement.querySelector('.vj-knob');
    
    if (!this.knob) {
      console.error('Joystick knob element not found');
      return;
    }
    
    // Touch events
    this.root.addEventListener('touchstart', this.handleStart, { passive: false });
    this.root.addEventListener('touchmove', this.handleMove, { passive: false });
    this.root.addEventListener('touchend', this.handleEnd);
    this.root.addEventListener('touchcancel', this.handleEnd);
    
    // Mouse events
    this.root.addEventListener('mousedown', this.handleStart);
    document.addEventListener('mousemove', this.handleMove);
    document.addEventListener('mouseup', this.handleEnd);
  }
  
  unmount() {
    if (!this.root) return;
    
    this.root.removeEventListener('touchstart', this.handleStart);
    this.root.removeEventListener('touchmove', this.handleMove);
    this.root.removeEventListener('touchend', this.handleEnd);
    this.root.removeEventListener('touchcancel', this.handleEnd);
    
    this.root.removeEventListener('mousedown', this.handleStart);
    document.removeEventListener('mousemove', this.handleMove);
    document.removeEventListener('mouseup', this.handleEnd);
    
    this.root = null;
    this.knob = null;
  }
  
  handleStart(e) {
    if (e.type === 'mousedown' && e.button !== 0) return;
    
    this.isActive = true;
    this.emit('start', { x: this.x, y: this.y });
    
    if (e.type === 'touchstart') {
      e.preventDefault();
    }
    
    this.handleMove(e);
  }
  
  handleMove(e) {
    if (!this.isActive) return;
    
    const touch = e.touches ? e.touches[0] : e;
    const rect = this.root.getBoundingClientRect();
    
    // Get center of joystick
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate offset from center
    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;
    
    // Calculate distance and clamp to radius
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = this.radius;
    
    if (distance > maxDistance) {
      const ratio = maxDistance / distance;
      dx *= ratio;
      dy *= ratio;
    }
    
    // Normalize to -1 to 1 range
    this.x = dx / maxDistance;
    this.y = dy / maxDistance;
    
    // Update knob visual position
    if (this.knob) {
      this.knob.style.transform = `translate(${dx}px, ${dy}px)`;
    }
    
    this.emit('move', { x: this.x, y: this.y, distance: distance / maxDistance });
    
    if (e.type === 'touchmove') {
      e.preventDefault();
    }
  }
  
  handleEnd(e) {
    if (!this.isActive) return;
    
    this.isActive = false;
    this.x = 0;
    this.y = 0;
    
    // Reset knob position
    if (this.knob) {
      this.knob.style.transform = 'translate(0, 0)';
    }
    
    this.emit('end', { x: 0, y: 0 });
  }
  
  setReady(ready = true) {
    this.ready = ready;
    if (this.root) {
      this.root.classList.toggle('ready', ready);
    }
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
    this.unmount();
    this.listeners = { 'move': [], 'start': [], 'end': [] };
  }
}

