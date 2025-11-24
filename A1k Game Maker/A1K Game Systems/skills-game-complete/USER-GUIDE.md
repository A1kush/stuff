# 🎮 USER GUIDE - A1 Best Skills with CD Player Equipment System

## 🚀 Quick Start

### **Step 1: Launch the Game**
```bash
# Start local server
cd skills-game-complete
python -m http.server 8767

# Open in browser
http://localhost:8767/game.html
```

### **Step 2: Open the Bag**
- **Press `B`** key OR click **`BAG`** button
- Fullscreen equipment window appears

### **Step 3: Equip New Skills**
- Browse the **Skills Library** (right side)
- Click any skill card to equip
- Watch toast notification appear
- Skill button updates automatically

### **Step 4: Cast Skills with Combos!**
- Close bag (**`ESC`**)
- Press **`1`**, **`2`**, or **`3`**
- Watch **pre-cast bullets** fire first!
- Main skill fires after combo!

---

## 🎯 Controls Reference

### **Keyboard Shortcuts**
| Key | Action |
|-----|--------|
| `1`, `2`, `3` | Cast S1/S2/S3 skills |
| `B` | Toggle Bag (Equipment) |
| `ESC` | Close Bag |
| `C` | Switch Character |
| `R` | Toggle Rage Mode |
| `Space` | Basic Attack |

### **Mouse Controls**
| Action | Effect |
|--------|--------|
| Click skill card | Equip to first empty slot |
| Double-click equipped slot | Unequip skill |
| Click BAG button | Open equipment |
| Click ✕ Close | Close bag |

---

## 📋 Complete Skills List

### **A1 (Warrior) - 10 Skills**

#### **Original Skills**
1. **S1**: Crimson Slash ⚔️ (150 DMG, 2.5s CD)
2. **S2**: Summon Clone ⚔️ (0 DMG, 15s CD)
3. **S3**: Power Wave ⚔️ (250 DMG, 4s CD)
4. **S4**: Phantom Step (110 DMG, 20s CD)
5. **S5**: Crimson Cyclone (140 DMG, 24s CD)
6. **X1**: World Splitter (1800-3200 DMG, 28s CD)

#### **🆕 NEW Phantom Skills**
7. **S7**: Phantom Edge Combo ⚔️ - **3 pre-cast bullets** → Void/radiant combo slashes
8. **S8**: Phantom Void 🌀 - **2 pre-cast bullets** → Purple void X-slash
9. **S9**: Phantom Radiant ✨ - **4 pre-cast bullets** → Golden light burst
10. **X2**: Phantom ULTIMATE 💥 - **6 pre-cast bullets** → Triple-colored mega barrage

### **UNIQUE (Cyborg) - 17 Skills**

#### **Original Skills**
1. **S1**: Plasma Blast (200 DMG, 2s CD)
2. **S2**: Summon Drone (0 DMG, 15s CD)
3. **S3**: Kamehameha Beam (300 DMG, 8s CD)
4. **S4**: Absolute Zero Rail (180 DMG, 20s CD)
5. **S5**: Ion Helix Drill (160 DMG, 24s CD)
6. **X1**: Hyper Ion Wave (2200-3800 DMG, 28s CD)

#### **🆕 NEW Tech Skills**
7. **S7**: Voidlight Cannon 🌌 - **4 pre-cast bullets** → Cyan/purple beam
8. **S8**: Kinetic Sentry 🤖 - **2 pre-cast bullets** → Deploy auto-turret
9. **S9**: Gauss Driver ⚡ - **2 pre-cast bullets** → Heavy rail cannon
10. **S10**: Gauss Rail ⚡ - **3 pre-cast bullets** → Piercing lightning rail
11. **S11**: Gauss Pierce 💫 - **4 pre-cast bullets** → Armor-piercing shot
12. **S12**: Sentry Plasma 🔫 - **3 pre-cast bullets** → Plasma turret
13. **S13**: Voidlight Soul 👻 - **5 pre-cast bullets** → Soul-drain orb
14. **S14**: Voidlight Radiant ☀️ - **4 pre-cast bullets** → Fusion beam
15. **X2**: Gauss ULTIMATE ⚡ - **6 pre-cast bullets** → Mega electromagnetic blast
16. **X3**: Sentry ULTIMATE 🚀 - **4 pre-cast bullets** → Ultimate turret
17. **X4**: Voidlight ULTIMATE 🌌 - **6 pre-cast bullets** → 5-layer void cascade

### **MISSY (Royal) - 10 Skills**

#### **Original Skills**
1. **S1**: Blade Dance (180 DMG, 2.8s CD)
2. **S2**: Summon Pet (0 DMG, 16s CD)
3. **S3**: Gun Barrage (220 DMG, 5s CD)
4. **S4**: Golden Rail (160 DMG, 22s CD)
5. **S5**: Royal Typhoon (110 DMG, 8s CD)
6. **X1**: Royal Coin Cannon (1400-2800 DMG, 20s CD)

#### **🆕 NEW Riposte Skills**
7. **S7**: Opulent Riposte 💰 - **3 pre-cast bullets** → Counter with golden coins
8. **S8**: Riposte Fortune 🎰 - **4 pre-cast bullets** → Lucky counter + gold rain
9. **S9**: Riposte Counter ⚔️ - **3 pre-cast bullets** → Perfect counter-strike
10. **X2**: Riposte ULTIMATE 👑 - **6 pre-cast bullets** → 8-way royal barrage

**Total: 37 Skills Across All Characters**

---

## 💡 Pre-Cast Combo System Explained

### **What is it?**
An **anime-style charge-up** system! Before the main skill fires, your character shoots 2-6 rapid bullets.

### **How it Works:**
1. You press `1`, `2`, or `3` to cast
2. Character fires **small combo bullets** (e.g., 4 bullets)
3. **0.2 seconds** between each bullet
4. **THEN** the main skill effect fires!

### **Example:**
**Phantom Radiant** (4 pre-cast bullets):
```
Time 0.0s: Bullet 1 fires →
Time 0.2s: Bullet 2 fires →
Time 0.4s: Bullet 3 fires →
Time 0.6s: Bullet 4 fires →
Time 0.8s: MAIN SKILL (Golden X-slash) fires!
```

### **Visual Effect:**
- Small glowing orbs with trails
- Spread pattern (fan-shaped)
- Colored by skill (gold, cyan, purple, etc.)
- Creates **dynamic** combat feeling!

---

## 🎨 Skill VFX Preview

### **Phantom Skills** (A1)
- **Edge Combo**: Cyan & pink dual slashes
- **Void**: Purple void X with dark aura
- **Radiant**: Golden light burst with white core
- **ULTIMATE**: Triple-colored (magenta/cyan/yellow) mega X-pattern

### **Voidlight Skills** (UNIQUE)
- **Cannon**: Cyan-to-purple beam gradient
- **Soul**: Purple soul orb with drain effect
- **Radiant**: Yellow fusion orb with pulse
- **ULTIMATE**: 5-layer alternating cyan/purple cascade with rotating X-patterns

### **Gauss Skills** (UNIQUE)
- **Driver/Rail/Pierce**: Orange electromagnetic rail with muzzle flash
- **ULTIMATE**: 4-layer energy discharge with massive width

### **Sentry Skills** (UNIQUE)
- **Kinetic/Plasma**: Blue tech bullets with trails
- **ULTIMATE**: Cyan mega blast with 3-layer aura

### **Riposte Skills** (MISSY)
- **Opulent/Fortune/Counter**: Golden spinning slashes with coin particles
- **ULTIMATE**: 8-way radial slash pattern with royal aura

---

## 🔧 Advanced Features

### **Character Switching**
- Press `C` to cycle: A1 → UNIQUE → MISSY → A1
- Bag auto-loads character-specific skills
- Default skills auto-equipped

### **Skill Loadouts**
- Each character has **independent equipment**
- S1/S2/S3 slots are **universal**
- Can equip ANY skill to any slot!

### **Visual Feedback**
- **Toast Notifications**: "✅ Equipped..." / "⚠️ Replacing..."
- **Button Labels**: Show equipped skill name + icon
- **Skill Badges**: "✓ EQUIPPED" (green) / "EQUIPPABLE" (yellow)
- **Glow Effects**: Equipped slots have animated glow

---

## 💎 Tips & Tricks

### **Best Combos**
1. **Fast Combo**: Phantom Radiant (4 bullets, 0.2s) = 0.8s charge
2. **Heavy Hitter**: Gauss ULTIMATE (600 DMG + 6 bullets)
3. **Spam Build**: Gauss Rail (9s CD, 3 bullets) for constant pressure
4. **Max Damage**: Voidlight ULTIMATE (550 DMG + 6 bullets + cascade)

### **Skill Synergies**
- **S1 slot**: Fast skills (low CD) for spam
- **S2 slot**: Utility (summons, sentries)
- **S3 slot**: High damage ultimates

### **Pre-Cast Bullets**
- Deal **15% of main skill damage**
- Can hit enemies before main skill
- Build combo counter faster
- Look AMAZING! ✨

---

## 📊 Performance

- **FPS**: 25-60 FPS (depends on active effects)
- **Skills loaded**: 37 total
- **Bag window**: Smooth 98vh fullscreen
- **Cards visible**: 7-8 per row
- **Scroll**: Smooth with all skills

---

## 🐛 Known Issues

- Character sprites: Using placeholder (working on HD sprites)
- Some skill descriptions show "undefined" (missing icon property in old skills)
- FPS drops during ultimate skills (expected - lots of VFX!)

---

## 🎊 What's NEW in This Version

✅ **Smaller skill cards** (140px - fits 7-8 per row!)  
✅ **20 new upgraded skills** with unique VFX  
✅ **Pre-cast combo system** (2-6 bullets before main skill!)  
✅ **14 new VFX renderers** (Phantom, Voidlight, Gauss, Sentry, Riposte)  
✅ **Anime-style combat** feeling  
✅ **All characters get new skills**  
✅ **Fullscreen bag interface**  
✅ **Dynamic skill equipping**  

---

## 🎮 Try These!

### **Must-Try Skills:**
1. **Phantom Radiant** ✨ - Beautiful golden X-slash
2. **Voidlight ULTIMATE** 🌌 - 5-layer cascade is INSANE
3. **Gauss ULTIMATE** ⚡ - Screen-filling electromagnetic death
4. **Riposte ULTIMATE** 👑 - 8-way royal barrage
5. **Phantom ULTIMATE** 💥 - Triple-colored mega combo

### **Quick Demo Route:**
1. Open game → Press `B`
2. Equip "Phantom Radiant" ✨
3. Press `ESC` → Press `1`
4. Watch 4 bullets fire → Golden X-slash!
5. Switch character (`C`) to UNIQUE
6. Press `B` → Equip "Gauss ULTIMATE" ⚡
7. Press `ESC` → Press `1`
8. Watch 6 bullets → MASSIVE rail cannon!

---

**Enjoy the 37 skills with anime-style combos!** 🎮⚡✨

---

_Game File: `skills-game-complete/game.html`_  
_Server: `http://localhost:8767/game.html`_

