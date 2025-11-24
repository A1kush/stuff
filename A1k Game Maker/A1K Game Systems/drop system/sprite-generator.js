/**
 * A1K Monster Sprite Generator
 * Procedurally generates monster sprites for the drop system
 * 7 Types x 5 Rarities = 35 unique sprites
 */

(function() {
  'use strict';

  console.log('[SpriteGen] Monster Sprite Generator initialized');

  window.MonsterSpriteGenerator = {
    
    // Rarity color palettes
    rarityColors: {
      common: {
        primary: '#6b7280',
        secondary: '#9ca3af',
        accent: '#4b5563',
        glow: 'rgba(107, 114, 128, 0.3)'
      },
      uncommon: {
        primary: '#22c55e',
        secondary: '#16a34a',
        accent: '#15803d',
        glow: 'rgba(34, 197, 94, 0.5)'
      },
      rare: {
        primary: '#3b82f6',
        secondary: '#2563eb',
        accent: '#1d4ed8',
        glow: 'rgba(59, 130, 246, 0.6)'
      },
      epic: {
        primary: '#9333ea',
        secondary: '#7c3aed',
        accent: '#6b21a8',
        glow: 'rgba(147, 51, 234, 0.7)'
      },
      legendary: {
        primary: '#ffd700',
        secondary: '#ffa500',
        accent: '#ff8c00',
        glow: 'rgba(255, 215, 0, 0.8)'
      }
    },

    // Draw a beast-type monster
    drawBeast(ctx, colors) {
      ctx.fillStyle = colors.primary;
      
      // Body (oval)
      ctx.beginPath();
      ctx.ellipse(32, 40, 20, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Head (circle)
      ctx.beginPath();
      ctx.arc(32, 20, 12, 0, Math.PI * 2);
      ctx.fill();
      
      // Ears
      ctx.fillStyle = colors.secondary;
      ctx.beginPath();
      ctx.moveTo(25, 12);
      ctx.lineTo(22, 5);
      ctx.lineTo(28, 10);
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(39, 12);
      ctx.lineTo(42, 5);
      ctx.lineTo(36, 10);
      ctx.fill();
      
      // Eyes (fierce)
      ctx.fillStyle = colors.accent;
      ctx.fillRect(27, 18, 3, 4);
      ctx.fillRect(34, 18, 3, 4);
      
      // Fangs
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(28, 24);
      ctx.lineTo(26, 28);
      ctx.lineTo(30, 26);
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(36, 24);
      ctx.lineTo(38, 28);
      ctx.lineTo(34, 26);
      ctx.fill();
      
      // Legs
      ctx.fillStyle = colors.primary;
      ctx.fillRect(20, 50, 6, 12);
      ctx.fillRect(38, 50, 6, 12);
      
      // Tail
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(50, 42);
      ctx.quadraticCurveTo(58, 38, 60, 30);
      ctx.stroke();
    },

    // Draw an elemental-type monster
    drawElemental(ctx, colors) {
      // Swirling energy form
      ctx.fillStyle = colors.primary;
      
      // Core orb
      ctx.beginPath();
      ctx.arc(32, 32, 18, 0, Math.PI * 2);
      ctx.fill();
      
      // Energy tendrils
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = 3;
      
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 / 6) * i;
        const x1 = 32 + Math.cos(angle) * 18;
        const y1 = 32 + Math.sin(angle) * 18;
        const x2 = 32 + Math.cos(angle) * 28;
        const y2 = 32 + Math.sin(angle) * 28;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        // Energy burst at tip
        ctx.fillStyle = colors.accent;
        ctx.beginPath();
        ctx.arc(x2, y2, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Inner glow
      const gradient = ctx.createRadialGradient(32, 32, 5, 32, 32, 15);
      gradient.addColorStop(0, colors.accent);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    },

    // Draw an armored-type monster
    drawArmored(ctx, colors) {
      // Blocky humanoid with armor
      ctx.fillStyle = colors.primary;
      
      // Body (rectangle)
      ctx.fillRect(22, 30, 20, 25);
      
      // Helmet
      ctx.fillStyle = colors.secondary;
      ctx.fillRect(20, 15, 24, 18);
      
      // Helmet visor
      ctx.fillStyle = colors.accent;
      ctx.fillRect(24, 20, 16, 6);
      
      // Shoulders (armor plates)
      ctx.fillStyle = colors.secondary;
      ctx.fillRect(15, 30, 10, 8);
      ctx.fillRect(39, 30, 10, 8);
      
      // Arms
      ctx.fillStyle = colors.primary;
      ctx.fillRect(18, 38, 6, 15);
      ctx.fillRect(40, 38, 6, 15);
      
      // Legs
      ctx.fillRect(24, 55, 7, 9);
      ctx.fillRect(33, 55, 7, 9);
      
      // Shield (accent)
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(12, 42, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Metallic shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(22, 32, 4, 8);
    },

    // Draw a mechanical-type monster
    drawMechanical(ctx, colors) {
      // Geometric robot shape
      ctx.fillStyle = colors.primary;
      
      // Main body (hexagon)
      ctx.beginPath();
      ctx.moveTo(32, 20);
      ctx.lineTo(44, 28);
      ctx.lineTo(44, 44);
      ctx.lineTo(32, 52);
      ctx.lineTo(20, 44);
      ctx.lineTo(20, 28);
      ctx.closePath();
      ctx.fill();
      
      // Head (square)
      ctx.fillStyle = colors.secondary;
      ctx.fillRect(26, 8, 12, 12);
      
      // Eyes (glowing)
      ctx.fillStyle = colors.accent;
      ctx.fillRect(28, 12, 3, 4);
      ctx.fillRect(33, 12, 3, 4);
      
      // Arms (pistons)
      ctx.fillStyle = colors.secondary;
      ctx.fillRect(14, 28, 5, 16);
      ctx.fillRect(45, 28, 5, 16);
      
      // Legs (blocky)
      ctx.fillStyle = colors.primary;
      ctx.fillRect(24, 52, 6, 10);
      ctx.fillRect(34, 52, 6, 10);
      
      // Tech details
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 2;
      ctx.strokeRect(28, 32, 8, 8);
      
      // Antenna
      ctx.fillStyle = colors.accent;
      ctx.fillRect(31, 4, 2, 4);
      ctx.beginPath();
      ctx.arc(32, 2, 2, 0, Math.PI * 2);
      ctx.fill();
    },

    // Draw a flying-type monster
    drawFlying(ctx, colors) {
      // Winged creature
      ctx.fillStyle = colors.primary;
      
      // Body (small oval)
      ctx.beginPath();
      ctx.ellipse(32, 32, 10, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Head (circle with beak)
      ctx.beginPath();
      ctx.arc(32, 20, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Beak
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.moveTo(32, 22);
      ctx.lineTo(28, 26);
      ctx.lineTo(36, 26);
      ctx.closePath();
      ctx.fill();
      
      // Left wing
      ctx.fillStyle = colors.secondary;
      ctx.beginPath();
      ctx.moveTo(22, 32);
      ctx.quadraticCurveTo(8, 28, 10, 40);
      ctx.quadraticCurveTo(12, 36, 22, 38);
      ctx.closePath();
      ctx.fill();
      
      // Right wing
      ctx.beginPath();
      ctx.moveTo(42, 32);
      ctx.quadraticCurveTo(56, 28, 54, 40);
      ctx.quadraticCurveTo(52, 36, 42, 38);
      ctx.closePath();
      ctx.fill();
      
      // Tail feathers
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(32 + (i - 1) * 3, 46);
        ctx.lineTo(32 + (i - 1) * 5, 56);
        ctx.stroke();
      }
      
      // Eyes
      ctx.fillStyle = '#000000';
      ctx.fillRect(28, 18, 2, 2);
      ctx.fillRect(34, 18, 2, 2);
    },

    // Draw an aquatic-type monster
    drawAquatic(ctx, colors) {
      // Fish/serpent shape
      ctx.fillStyle = colors.primary;
      
      // Body (elongated oval)
      ctx.beginPath();
      ctx.ellipse(32, 32, 24, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Head (pointed)
      ctx.beginPath();
      ctx.moveTo(10, 32);
      ctx.lineTo(4, 28);
      ctx.lineTo(4, 36);
      ctx.closePath();
      ctx.fill();
      
      // Eye
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(12, 30, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Fins (top and bottom)
      ctx.fillStyle = colors.secondary;
      ctx.beginPath();
      ctx.moveTo(32, 20);
      ctx.lineTo(28, 12);
      ctx.lineTo(36, 12);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(32, 44);
      ctx.lineTo(28, 52);
      ctx.lineTo(36, 52);
      ctx.closePath();
      ctx.fill();
      
      // Tail fin
      ctx.fillStyle = colors.secondary;
      ctx.beginPath();
      ctx.moveTo(56, 32);
      ctx.lineTo(62, 24);
      ctx.lineTo(62, 40);
      ctx.closePath();
      ctx.fill();
      
      // Scales (texture)
      ctx.fillStyle = colors.accent;
      for (let x = 18; x < 50; x += 6) {
        for (let y = 26; y < 38; y += 6) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },

    // Draw a warrior-type monster
    drawWarrior(ctx, colors) {
      // Humanoid with weapon
      ctx.fillStyle = colors.primary;
      
      // Body
      ctx.fillRect(26, 28, 12, 20);
      
      // Head
      ctx.fillStyle = colors.secondary;
      ctx.beginPath();
      ctx.arc(32, 20, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Helmet
      ctx.fillStyle = colors.accent;
      ctx.fillRect(26, 12, 12, 8);
      
      // Visor
      ctx.fillStyle = '#000000';
      ctx.fillRect(28, 16, 8, 3);
      
      // Arms
      ctx.fillStyle = colors.primary;
      ctx.fillRect(18, 28, 6, 18);
      ctx.fillRect(40, 28, 6, 18);
      
      // Legs
      ctx.fillRect(26, 48, 5, 14);
      ctx.fillRect(33, 48, 5, 14);
      
      // Sword (in right hand)
      ctx.fillStyle = colors.accent;
      ctx.fillRect(47, 24, 3, 20);
      
      // Sword hilt
      ctx.fillStyle = colors.secondary;
      ctx.fillRect(44, 24, 9, 4);
      
      // Sword blade shine
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(48, 26, 1, 16);
      
      // Shield (in left hand)
      ctx.fillStyle = colors.secondary;
      ctx.beginPath();
      ctx.arc(14, 36, 6, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = colors.accent;
      ctx.fillRect(12, 34, 4, 1);
      ctx.fillRect(13, 32, 2, 5);
    },

    // Generate sprite for any type/rarity combination
    generateSprite(type, rarity) {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, 64, 64);
      
      // Get colors for this rarity
      const colors = this.rarityColors[rarity] || this.rarityColors.common;
      
      // Add glow effect background
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = 10;
      
      // Draw the monster based on type
      switch(type) {
        case 'beast':
          this.drawBeast(ctx, colors);
          break;
        case 'elemental':
          this.drawElemental(ctx, colors);
          break;
        case 'armored':
          this.drawArmored(ctx, colors);
          break;
        case 'mechanical':
          this.drawMechanical(ctx, colors);
          break;
        case 'flying':
          this.drawFlying(ctx, colors);
          break;
        case 'aquatic':
          this.drawAquatic(ctx, colors);
          break;
        case 'warrior':
          this.drawWarrior(ctx, colors);
          break;
        default:
          // Generic monster
          ctx.fillStyle = colors.primary;
          ctx.fillRect(20, 20, 24, 24);
          break;
      }
      
      // Remove shadow for final image
      ctx.shadowBlur = 0;
      
      return canvas.toDataURL();
    },

    // Generate all 35 sprites (7 types x 5 rarities)
    generateAllSprites() {
      const types = ['beast', 'elemental', 'armored', 'mechanical', 'flying', 'aquatic', 'warrior'];
      const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
      const sprites = {};
      
      types.forEach(type => {
        sprites[type] = {};
        rarities.forEach(rarity => {
          sprites[type][rarity] = this.generateSprite(type, rarity);
        });
      });
      
      console.log('[SpriteGen] Generated 35 monster sprites (7 types x 5 rarities)');
      return sprites;
    },

    // Get emoji fallback for quick prototyping
    getEmojiForType(type, rarity) {
      const emojiMap = {
        beast: { common: '🐕', uncommon: '🐺', rare: '🐅', epic: '🐲', legendary: '🐉👑' },
        elemental: { common: '🔥', uncommon: '💥', rare: '⚡', epic: '🌟', legendary: '✨👑' },
        armored: { common: '🛡️', uncommon: '⚔️', rare: '👑', epic: '🏰', legendary: '🦾👑' },
        mechanical: { common: '🤖', uncommon: '💀🤖', rare: '⚡🤖', epic: '⚔️🤖', legendary: '👑🤖' },
        flying: { common: '🐦', uncommon: '🦅', rare: '⚡🦅', epic: '🔥🦅', legendary: '👑🦅' },
        aquatic: { common: '🐟', uncommon: '🐠', rare: '🦈', epic: '🐙', legendary: '🐋👑' },
        warrior: { common: '⚔️', uncommon: '🗡️', rare: '👑⚔️', epic: '⚔️✨', legendary: '👑⚔️💫' }
      };
      
      return emojiMap[type]?.[rarity] || '👾';
    }
  };

  console.log('✅ [SpriteGen] Monster Sprite Generator ready');

})();

