/**
 * Enemy Sprite Renderer
 * Wrapper around EnemySprites_v2.js for bag system integration
 * Generates procedural sprites for enemies, bosses, zombies, and villains
 */

(function() {
  'use strict';

  console.log('[EnemySpriteRenderer] Initializing sprite renderer...');

  // Sprite cache to avoid regenerating sprites
  const spriteCache = new Map();

  window.EnemySpriteRenderer = {
    /**
     * Generate a sprite for an enemy entity
     * @param {Object} enemyData - Enemy data from database
     * @param {number} size - Size of sprite (default: 64)
     * @param {Object} options - Additional options
     * @returns {string} - Data URL of the sprite image
     */
    generateSprite: function(enemyData, size = 64, options = {}) {
      const cacheKey = `${enemyData.id}_${size}_${JSON.stringify(options)}`;
      
      // Check cache first
      if (spriteCache.has(cacheKey)) {
        return spriteCache.get(cacheKey);
      }

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = size * 2;
      canvas.height = size * 2;
      const ctx = canvas.getContext('2d');

      // Determine entity type
      let entityType = 'enemy';
      if (enemyData.id && enemyData.id.startsWith('boss_')) {
        entityType = 'boss';
      } else if (enemyData.id && enemyData.id.startsWith('zombie_')) {
        entityType = 'zombie';
      } else if (enemyData.id && enemyData.id.startsWith('villain_')) {
        entityType = 'villain';
      }

      // Prepare entity object for rendering
      const entity = {
        type: entityType,
        id: enemyData.id,
        element: enemyData.element || 'neutral',
        size: enemyData.size || size / 2,
        x: size,
        y: size,
        hp: enemyData.hp || 100,
        maxHp: enemyData.hp || 100,
        sprite: enemyData.sprite || {}
      };

      // Use EnemySprites class if available
      if (window.EnemySprites && typeof window.EnemySprites.render === 'function') {
        try {
          window.EnemySprites.render(ctx, entity, {
            animTime: Date.now(),
            glow: options.glow !== false
          });
        } catch (e) {
          console.warn('[EnemySpriteRenderer] Error rendering with EnemySprites:', e);
          this.renderFallback(ctx, entity, size);
        }
      } else {
        // Fallback rendering if EnemySprites not loaded
        this.renderFallback(ctx, entity, size);
      }

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      spriteCache.set(cacheKey, dataUrl);
      
      return dataUrl;
    },

    /**
     * Fallback sprite rendering (simple colored circle)
     */
    renderFallback: function(ctx, entity, size) {
      const colors = {
        fire: '#ff6b35',
        ice: '#00ffff',
        lightning: '#ffaa00',
        nature: '#4caf50',
        dark: '#9b59b6',
        light: '#ffd700',
        neutral: '#0088ff',
        tech: '#00ffff',
        fusion: '#ff00ff',
        earth: '#8b4513',
        wind: '#87ceeb'
      };

      const color = colors[entity.element] || colors.neutral;
      const centerX = size;
      const centerY = size;
      const radius = entity.size || size / 2;

      // Draw glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.5);
      gradient.addColorStop(0, color + '80');
      gradient.addColorStop(1, color + '00');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw main body
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw border
      ctx.strokeStyle = color + 'FF';
      ctx.lineWidth = 2;
      ctx.stroke();
    },

    /**
     * Clear sprite cache
     */
    clearCache: function() {
      spriteCache.clear();
    },

    /**
     * Generate sprite and return as img element
     */
    generateSpriteElement: function(enemyData, size = 64, options = {}) {
      const img = document.createElement('img');
      img.src = this.generateSprite(enemyData, size, options);
      img.style.width = size + 'px';
      img.style.height = size + 'px';
      img.style.imageRendering = 'pixelated';
      return img;
    }
  };

  console.log('[EnemySpriteRenderer] Sprite renderer ready');
})();

