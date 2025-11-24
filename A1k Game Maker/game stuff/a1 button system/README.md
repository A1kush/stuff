# 🍬 A1 Button System - Candy Style

Production-ready, modular button system with candy/chibi/anime styling for game UIs.

## ✨ Features

- **Candy/Chibi/Anime Styling**: Glossy gradients, rounded shapes, pastel colors, soft shadows
- **Modular Architecture**: Easy to integrate into any game or web application
- **Event-Driven**: Clean event system for all interactions
- **Touch & Mouse Support**: Works seamlessly on desktop and mobile
- **AI Robot Integration**: Built-in overlay for AI bot control
- **Production Ready**: Optimized, documented, and battle-tested
- **Fully Responsive**: Adapts to all screen sizes

## 🎮 Components

### Core Modules
- **A1ButtonSystem**: Main controller class
- **JoystickController**: Virtual joystick with touch/mouse support
- **AIOverlay**: AI robot command interface

### Button Clusters
- **Joystick**: Touch/mouse virtual joystick with ready state
- **Skills (S1-S3)**: Skill buttons with candy glow ready animations
- **Utilities**: Pet, Vehicle, Action, Bag, AI, Switch buttons
- **Attack**: ATTACK, JUMP, RAGE, SHIELD buttons

## 🚀 Quick Start

### 1. Include Files

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="path/to/a1-buttons.css">
</head>
<body>
  <div id="game-ui"></div>
  
  <script type="module">
    import { A1ButtonSystem } from './path/to/a1-buttons.js';
    
    // Initialize
    const buttons = new A1ButtonSystem({
      theme: 'candy',
      enableAI: true,
      enableJoystick: true,
      enableSkills: true,
      enableUtilities: true,
      enableAttack: true
    });
    
    // Mount to your game UI container
    buttons.mount('#game-ui');
    
    // Listen to events
    buttons.on('joystick:move', (data) => {
      console.log('Joystick moved:', data.x, data.y);
    });
    
    buttons.on('skill:activate', (data) => {
      console.log('Skill activated:', data.skill);
    });
  </script>
</body>
</html>
```

### 2. Initialize and Configure

```javascript
const buttonSystem = new A1ButtonSystem({
  // Theme: 'candy' or 'default'
  theme: 'candy',
  
  // Enable/disable specific components
  enableAI: true,
  enableJoystick: true,
  enableSkills: true,
  enableUtilities: true,
  enableAttack: true,
  
  // Optional: pass robot system for AI integration
  robotSystem: myRobotSystem
});

// Mount to DOM
buttonSystem.mount('#game-container');
```

## 📡 Event System

### Listen to Events

```javascript
// Button press/release
buttonSystem.on('button:press', (data) => {
  console.log('Button pressed:', data.button);
});

buttonSystem.on('button:release', (data) => {
  console.log('Button released:', data.button);
});

// Joystick movement
buttonSystem.on('joystick:move', (data) => {
  // data.x: -1 to 1 (horizontal)
  // data.y: -1 to 1 (vertical)
  // data.distance: 0 to 1 (normalized distance from center)
  movePlayer(data.x, data.y);
});

buttonSystem.on('joystick:start', (data) => {
  console.log('Joystick touch started');
});

buttonSystem.on('joystick:end', (data) => {
  console.log('Joystick released');
});

// Skill activation
buttonSystem.on('skill:activate', (data) => {
  // data.skill: 'S1', 'S2', or 'S3'
  castSkill(data.skill);
});

// Utility buttons
buttonSystem.on('utility:press', (data) => {
  // data.utility: 'pet', 'veh', 'act', 'act2', 'bag', 'switch'
  handleUtility(data.utility);
});

// Attack buttons
buttonSystem.on('attack:press', (data) => {
  // data.attack: 'attack', 'jump', 'rage', 'shield'
  handleAttack(data.attack);
});

// AI events
buttonSystem.on('ai:command', (data) => {
  console.log('AI command:', data.command);
});

buttonSystem.on('ai:summon', (data) => {
  console.log('Summon robot:', data.robotType);
});

buttonSystem.on('ai:mode-change', (data) => {
  console.log('Robot mode changed:', data.mode);
});

buttonSystem.on('ai:target-change', (data) => {
  console.log('Target mode changed:', data.targetMode);
});
```

### Remove Event Listeners

```javascript
const handler = (data) => console.log(data);

// Add listener
buttonSystem.on('button:press', handler);

// Remove listener
buttonSystem.off('button:press', handler);
```

## 🎯 Public API

### State Control

```javascript
// Set skill ready state (enables candy glow animation)
buttonSystem.setSkillReady('S1', true);  // Enable
buttonSystem.setSkillReady('S1', false); // Disable

// Set skill cooldown (for custom cooldown displays)
buttonSystem.setSkillCooldown('S1', 5.0); // 5 seconds

// Set joystick ready state
buttonSystem.setJoystickReady(true);

// Toggle AI overlay
buttonSystem.toggleAIOverlay();
buttonSystem.showAI();
buttonSystem.hideAI();

// Update robot status in AI overlay
buttonSystem.setRobotStatus({
  type: 'combat',
  mode: 'aggro',
  targetMode: 'nearest'
});
```

### Method Chaining

```javascript
buttonSystem
  .setSkillReady('S1', true)
  .setSkillReady('S2', true)
  .setJoystickReady(true);
```

### Cleanup

```javascript
// Remove all DOM elements and event listeners
buttonSystem.destroy();
```

## 🎨 Candy Style Features

### Ready State Animations
- **Skills**: Pulsing candy glow with outer ring (pink, mint, sky colors)
- **Joystick**: Breathing pulse animation with dual-color glow
- **Duration**: 1.25s for skills, 1.6s for joystick

### Color Palette
- **Pink Candy**: `#FF7AD9`, `#FFB5E8`
- **Mint Candy**: `#7AF8C8`, `#A8FFE0`
- **Sky Candy**: `#7AD5FF`, `#A8E6FF`
- **Purple Magic**: `#BA55D3`, `#E9D7FF`
- **Rage Red**: `#FF6464`
- **Shield Blue**: `#64C8FF`

### Visual Effects
- Radial gradients with light reflections at 20-30% position
- Soft inset shadows with colored glows
- Bounce animation on click (0.3s cubic-bezier)
- Hover lift effect (-2px translateY)
- Press depression effect (+2px translateY, scale 0.97)

## 🤖 AI Robot Integration

### Setup
The AI overlay integrates with the robot system from `/A1 systems/ai robot system/`.

```javascript
import { A1ButtonSystem } from './a1-buttons.js';
import { setRobotMode, setRobotTargetMode } from '../ai robot system/src/robots/RobotController.js';

const buttonSystem = new A1ButtonSystem({
  enableAI: true
});

buttonSystem.mount('#game-ui');

// Handle AI events
buttonSystem.on('ai:mode-change', (data) => {
  setRobotMode(currentRobot, data.mode);
});

buttonSystem.on('ai:target-change', (data) => {
  setRobotTargetMode(currentRobot, data.targetMode);
});

buttonSystem.on('ai:summon', (data) => {
  // Summon robot logic
  summonRobot(data.robotType);
});
```

### Available Modes
- **follow**: Stay close to leader
- **aggro**: Attack enemies
- **guard**: Protect leader
- **assist**: Support attacks
- **patrol**: Circular patrol
- **defend**: Defensive stance
- **hunt**: Aggressive pursuit
- **flank**: Side attacks
- **snipe**: Long range
- **overwatch**: High ground

### Target Modes
- **nearest**: Closest enemy
- **lowest**: Lowest HP enemy
- **boss**: Focus bosses
- **highest_hp**: Tank targets
- **strongest**: High threat
- **grouped**: Dense clusters
- **lowest_ally**: Heal priority

## 📱 Responsive Design

The button system automatically adapts to different screen sizes:

- **Desktop**: Full-size buttons, optimal spacing
- **Tablet** (≤768px): Slightly smaller buttons, adjusted padding
- **Mobile** (≤480px): Compact joystick, optimized touch targets

## 🎮 Game Integration Examples

### Basic Movement

```javascript
buttonSystem.on('joystick:move', (data) => {
  player.velocityX = data.x * player.speed;
  player.velocityY = data.y * player.speed;
});

buttonSystem.on('joystick:end', () => {
  player.velocityX = 0;
  player.velocityY = 0;
});
```

### Skill Cooldowns

```javascript
buttonSystem.on('skill:activate', (data) => {
  if (!canCastSkill(data.skill)) return;
  
  castSkill(data.skill);
  
  // Disable ready state
  buttonSystem.setSkillReady(data.skill, false);
  
  // Re-enable after cooldown
  setTimeout(() => {
    buttonSystem.setSkillReady(data.skill, true);
  }, skillCooldown * 1000);
});
```

### AI Robot Control

```javascript
let currentRobot = null;

buttonSystem.on('ai:summon', (data) => {
  currentRobot = spawnRobot(data.robotType);
  buttonSystem.setRobotStatus({
    type: data.robotType,
    mode: 'follow',
    targetMode: 'nearest'
  });
});

buttonSystem.on('ai:mode-change', (data) => {
  if (currentRobot) {
    setRobotMode(currentRobot, data.mode);
  }
});

// In game loop
function update(dt) {
  if (currentRobot) {
    updateRobot(currentRobot, dt, player, enemies);
  }
}
```

### Attack Actions

```javascript
buttonSystem.on('attack:press', (data) => {
  switch (data.attack) {
    case 'attack':
      player.performAttack();
      break;
    case 'jump':
      player.jump();
      break;
    case 'rage':
      player.activateRageMode();
      break;
    case 'shield':
      player.activateShield();
      break;
  }
});
```

## 🔧 Customization

### CSS Variables
Override these in your own CSS to customize colors:

```css
.a1-button-system {
  /* Base colors can be overridden */
}

/* Custom skill colors */
.skill-pill.s1 {
  border-color: rgba(255, 0, 0, 0.75) !important;
  /* ... */
}
```

### Disable Components

```javascript
// Only show joystick and attack buttons
const buttonSystem = new A1ButtonSystem({
  enableJoystick: true,
  enableAttack: true,
  enableSkills: false,
  enableUtilities: false,
  enableAI: false
});
```

## 📦 File Structure

```
a1 button system/
├── index.html              # Demo page
├── a1-buttons.js           # Main button system class
├── a1-buttons.css          # Candy styling
├── joystick-controller.js  # Joystick input module
├── ai-overlay.js           # AI overlay interface
└── README.md               # This file
```

## 🎯 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

Part of the A1 Systems collection. Free to use in your projects.

## 🤝 Integration with Other A1 Systems

This button system is designed to work seamlessly with:
- **A1 Skills System** (`/a1 skills system/`)
- **AI Robot System** (`/A1 systems/ai robot system/`)
- **Pet System** (`/A1 systems/pet system/`)
- **Vehicle System** (`/A1 systems/vehicle-pet-system-demo/`)
- **Bag System** (`/A1 systems/bag-system-demo/`)

## 🚀 Demo

Open `index.html` in a browser to see the full interactive demo with:
- Live event logging
- Joystick position visualization
- Ready state controls
- AI overlay demonstration

## 💡 Tips

1. **Mobile Testing**: Use Chrome DevTools device emulation for touch testing
2. **Performance**: The system is optimized for 60fps on modern devices
3. **Styling**: All candy effects use CSS animations for GPU acceleration
4. **Events**: Use event delegation for better performance with many buttons
5. **Cleanup**: Always call `destroy()` when removing the button system

## 🐛 Troubleshooting

### Buttons not appearing?
- Check that CSS file is loaded
- Verify mount container exists in DOM
- Check browser console for errors

### Touch not working?
- Ensure `touch-action: none` is set (handled by CSS)
- Check for pointer-events conflicts
- Test on actual mobile device (desktop touch emulation can differ)

### AI overlay not showing?
- Verify `enableAI: true` in config
- Check that AI button is being clicked
- Look for JavaScript errors in console

---

Made with 🍬 for game developers by the A1K Team

