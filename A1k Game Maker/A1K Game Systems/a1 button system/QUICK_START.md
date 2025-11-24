# 🍬 A1 Button System - Quick Start

## 🚀 Get Started in 30 Seconds

### 1. Copy These 3 Files to Your Project
```
a1-buttons.js
a1-buttons.css  
joystick-controller.js
```

### 2. Add to Your HTML
```html
<link rel="stylesheet" href="a1-buttons.css">
<div id="game-ui"></div>
```

### 3. Initialize
```javascript
import { A1ButtonSystem } from './a1-buttons.js';

const buttons = new A1ButtonSystem();
buttons.mount('#game-ui');

// Listen to joystick
buttons.on('joystick:move', (data) => {
  player.x += data.x * speed;
  player.y += data.y * speed;
});

// Listen to skills
buttons.on('skill:activate', (data) => {
  castSkill(data.skill); // 'S1', 'S2', or 'S3'
});
```

### 4. Set Ready States
```javascript
// Enable candy glow on skills
buttons.setSkillReady('S1', true);
buttons.setSkillReady('S2', true);
buttons.setSkillReady('S3', true);

// Enable joystick glow
buttons.setJoystickReady(true);
```

---

## 📋 Event Quick Reference

| Event | Data | Use Case |
|-------|------|----------|
| `joystick:move` | `{x, y, distance}` | Player movement |
| `skill:activate` | `{skill}` | Cast skills (S1-S3) |
| `attack:press` | `{attack}` | Attack actions |
| `utility:press` | `{utility}` | Utility buttons |
| `ai:summon` | `{robotType}` | Summon AI robot |

---

## 🎨 Candy Colors

- 🌸 **Pink**: S1 skill, Attack button
- 🌿 **Mint**: S2 skill  
- 🌊 **Sky**: S3 skill, Jump button, Joystick
- 💜 **Purple**: AI button and overlay
- 🟡 **Yellow**: Bag, Switch buttons
- 🔴 **Red**: Rage button
- 🔵 **Blue**: Shield button

---

## 🎮 Test It Out

1. Open **index.html** - Interactive demo with event logger
2. Open **integration-example.html** - Full game integration
3. Read **README.md** - Complete documentation

---

## ⚡ Most Common Setup

```javascript
import { A1ButtonSystem } from './a1-buttons.js';

const btn = new A1ButtonSystem({
  theme: 'candy',
  enableAI: true // Set false if no AI needed
});

btn.mount('#game');

// Movement
btn.on('joystick:move', ({x, y}) => {
  player.vx = x;
  player.vy = y;
});

// Skills with cooldowns
btn.on('skill:activate', ({skill}) => {
  if (skillOnCooldown(skill)) return;
  
  castSkill(skill);
  btn.setSkillReady(skill, false);
  
  setTimeout(() => {
    btn.setSkillReady(skill, true);
  }, cooldownTime);
});

// AI button opens overlay automatically!
```

---

## 🔧 Configuration Options

```javascript
new A1ButtonSystem({
  theme: 'candy',           // Style theme
  enableAI: true,           // AI overlay
  enableJoystick: true,     // Virtual joystick
  enableSkills: true,       // S1-S3 buttons
  enableUtilities: true,    // Pet, Bag, etc.
  enableAttack: true        // Attack, Jump, etc.
})
```

---

## 💡 Pro Tips

1. **Performance**: Animations are GPU-accelerated CSS
2. **Mobile**: Touch targets are 44x44px minimum
3. **Cleanup**: Call `buttons.destroy()` when done
4. **Method Chaining**: `btn.setSkillReady('S1', true).setSkillReady('S2', true)`
5. **AI Optional**: Set `enableAI: false` if not using robots

---

## 📱 Mobile Ready

Works out of the box on:
- ✅ iOS Safari
- ✅ Chrome Mobile  
- ✅ Desktop browsers
- ✅ Touch and mouse
- ✅ All screen sizes

---

## 🐛 Troubleshooting

**Buttons not showing?**
- Check CSS file is loaded
- Verify mount container exists

**Touch not working?**
- Test on real device (desktop emulation differs)
- Check for pointer-events conflicts

**AI overlay won't open?**
- Click the "AI" button (dashed purple border)
- Check console for errors
- Verify `enableAI: true`

---

## 📚 Need More?

- **Full API**: See README.md
- **Integration Example**: See integration-example.html
- **Demo**: See index.html

---

Made with 🍬 by A1K Team • Ready for Production • v1.0.0

