# 🚀 Quick Start - Testing Your Combat System

## Step 1: Launch the Game

Open `mixed-city-with-ultra-interiors.html` in your browser.

## Step 2: Check Console

Press **F12** to open Developer Tools, then click the **Console** tab.

You should see:
```
🎮 Starting combat system initialization...
✅ Combat System Ready!
Active Character: A1
Equipped Skills: 6
✅ Combat hooked into game loop
✅ Combat hooked into render
🎉 Combat System Integration Complete!
Press S1-S5 to use skills, ATK for basic attack, SWITCH to change character
```

## Step 3: Test Skills

### **Basic Attack (ATK)**
1. Click the **ATK** button
2. You should see 5 projectiles spawn (5-hit combo)
3. Rage meter should increase by 2% per hit

### **S1 Skill (Crimson Slash)**
1. Click the **S1** button
2. Should see 3 projectiles (3-hit combo) with FIRE element (orange-red)
3. Damage: 150 per hit
4. Cooldown: 2.5 seconds (button dims, then brightens)

### **S2 Skill (Shadow Clone)**
1. Click the **S2** button
2. Should see summon VFX (explosion effect)
3. Event: "summonSpawned" in console

### **S3 Skill (Power Wave)**
1. Click the **S3** button
2. Should see 4 projectiles (4-hit combo) with ARCANE element (magenta)
3. Damage: 250 per hit

### **S4 Skill (Phantom Strike)**
1. Click the **S4** button
2. Should see 6 projectiles (6-hit combo) with SHADOW element (purple)
3. Damage: 320 per hit

### **S5 Skill (Crimson Cyclone)**
1. Click the **S5** button
2. Should see explosion VFX at target location
3. Damage: 300 AoE
4. Element: FIRE

### **X1 Ultimate (Rift Cutter)**
1. Click the **X1** button
2. Should see single powerful projectile
3. Damage: 380
4. Cooldown: 8 seconds

## Step 4: Test Character Switching

1. Click the **SWITCH** button
2. Character should change: A1 → UNIQUE → MISSY → A1
3. HP bar resets to new character's max HP
4. Skill buttons update with new character's skills
5. Console shows: "🔄 Switched to UNIQUE" (or MISSY)

### **Test Unique's Skills**
- **S1**: Plasma Blast (120 dmg, PLASMA element - cyan-green)
- **S2**: Combat Drone (summon)
- **S3**: Power Beam (400 dmg, channeled beam)
- **S4**: Cryo Rail (180 dmg, ICE element - cyan, freeze)
- **S5**: Ion Drill (220 dmg)
- **X1**: Hyper Beam (300 dmg, chargeable + freeze)

### **Test Missy's Skills**
- **S1**: Crescent Slash (130 dmg)
- **S2**: Spirit Pet (summon)
- **S3**: Rapid Fire (200 dmg, 4-hit)
- **S4**: Starlight Rail (180 dmg, LIGHT element)
- **S5**: Storm Vortex (720 dmg, massive AoE)
- **X1**: Fortune Cannon (2800 dmg, chargeable ultimate!)

## Step 5: Test Rage Mode

1. Spam **ATK** or skills until rage reaches 100
2. Rage gauge should pulse red when full
3. Click the **RAGE** button
4. Console shows: "🔥 RAGE MODE ACTIVATED - 2x ATK for 10 seconds!"
5. All damage doubled for 10 seconds
6. RAGE button shows "🔥 2x ATK MODE ACTIVE 🔥" text

## Step 6: Test Combo System

1. Keep hitting enemies (spam ATK or S1-S5)
2. Combo counter should appear in top-right
3. Combo increments with every hit
4. At 10 hits: Console shows "🏆 COMBO STARTER - 10 hit combo!"
5. At 50 hits: "🏆 COMBO MASTER - 50 hit combo!"
6. At 100 hits: "🏆 COMBO GOD - 100 hit combo!"
7. Stop attacking for 2 seconds → Combo resets

## Step 7: Visual Checks

### **HUD Display**
- Top-left should show:
  - Character name (A1, Unique, or Missy)
  - HP bar (green → orange → red as HP drops)
  - Rage gauge (yellow-red gradient, pulses when full)
- Top-right should show:
  - Combo counter (changes color based on count)
  - Combo achievement text

### **Damage Numbers**
- Should appear when projectiles hit enemies
- Color-coded by element (fire = orange, ice = cyan, etc.)
- Float upward then fall with gravity
- Fade out over 1.5 seconds

### **Projectiles**
- Should have glow effects matching element color
- Multi-hit skills: projectiles spread in arc
- Beams: continuous line from character to target
- Explosions: circular blast with particles

## Troubleshooting

### **No console messages?**
- Check if scripts loaded: Look for 404 errors in console
- Check file paths: Make sure `combat-system/` folder exists

### **Buttons don't work?**
- Check if button IDs match: S1, S2, S3, S4, S5, ATK, X1, SWITCH, RAGE
- Open console, click button, look for errors

### **No projectiles spawn?**
- Check if canvas exists: `window.ctx` should be defined
- Check if enemies exist: `window.enemySystem.enemies` should have objects

### **Skills have wrong data?**
- Check browser console for skill info
- Run: `getSkillById('A1_S1')` in console
- Should return skill object with all properties

## Expected Console Output

```javascript
// Check if combat system loaded
window.combatSystem  // Should return CityCombatBridge instance
window.combatEngine  // Should return CombatEngine instance

// Check skills
getSkillById('A1_S1')
// Returns: { id: 'A1_S1', name: 'Crimson Slash', damage: 150, ... }

getSkillsByCharacter('A1')
// Returns: Array of 30 A1 skills

getEquippedSkills('A1')
// Returns: Array of 6 equipped skills (S1-S5, X1)
```

## Success Indicators ✅

- [x] Console shows initialization messages
- [x] HUD displays HP, rage, combo
- [x] S1-S5 buttons trigger skills
- [x] Projectiles spawn and move
- [x] Damage numbers appear
- [x] SWITCH changes character
- [x] RAGE activates 2x ATK mode
- [x] Combo counter increments
- [x] Cooldowns work (buttons dim/brighten)

---

**If all checks pass: YOUR COMBAT SYSTEM IS WORKING! 🎉**

Your 90 skills are live, modular, and production-ready!
