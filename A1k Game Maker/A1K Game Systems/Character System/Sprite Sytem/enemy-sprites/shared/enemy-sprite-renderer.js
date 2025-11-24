/**
 * ENEMY SPRITE RENDERER
 * Dynamic sprite rendering and animation control for enemy sprites
 * Renders enemies directly on game canvas using sprite data
 */

(function() {
    'use strict';

    class EnemySpriteRenderer {
        constructor() {
            this.spriteCache = new Map();
            this.animationStates = new Map();
            this.defaultArtStyle = 'type-7-chibi-kawaii';
            this.renderMode = 'procedural'; // 'procedural' or 'image'
        }

        /**
         * Render enemy sprite on canvas
         */
        renderEnemy(ctx, enemy, x, y, scale = 1) {
            const enemyData = window.EnemySpriteAPI?.getEnemy(enemy.id) || null;
            
            if (!enemyData) {
                // Fallback to simple rendering
                this.renderFallback(ctx, enemy, x, y, scale);
                return;
            }

            // Get animation state
            const animState = this.animationStates.get(enemy.id) || 'idle';
            const time = performance.now() / 1000;

            // Render based on enemy tier and type
            if (enemyData.tier === 'C') {
                this.renderBasicEnemy(ctx, enemy, enemyData, x, y, scale, time);
            } else if (enemyData.tier === 'S' || enemyData.tier === 'SS') {
                this.renderBossEnemy(ctx, enemy, enemyData, x, y, scale, time);
            } else {
                this.renderEliteEnemy(ctx, enemy, enemyData, x, y, scale, time);
            }
        }

        /**
         * Render basic C-rank enemy
         */
        renderBasicEnemy(ctx, enemy, data, x, y, scale, time) {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(scale, scale);

            // Simple sprite rendering based on type
            if (data.id === 'enemy_slime') {
                this.renderSlimeSprite(ctx, time);
            } else if (data.id === 'enemy_goblin') {
                this.renderGoblinSprite(ctx, time);
            } else if (data.id === 'enemy_skeleton') {
                this.renderSkeletonSprite(ctx, time);
            } else {
                this.renderGenericEnemy(ctx, data, time);
            }

            ctx.restore();
        }

        /**
         * Render elite enemy
         */
        renderEliteEnemy(ctx, enemy, data, x, y, scale, time) {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(scale * 1.2, scale * 1.2);
            
            this.renderGenericEnemy(ctx, data, time);
            
            // Add elite glow effect
            ctx.globalAlpha = 0.3;
            ctx.strokeStyle = '#ff00ff';
            ctx.lineWidth = 2;
            ctx.strokeRect(-20, -30, 40, 50);
            
            ctx.restore();
        }

        /**
         * Render boss enemy
         */
        renderBossEnemy(ctx, enemy, data, x, y, scale, time) {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(scale * 1.5, scale * 1.5);
            
            // Boss aura
            ctx.fillStyle = `rgba(255,0,0,${0.1 + Math.sin(time * 2) * 0.1})`;
            ctx.beginPath();
            ctx.arc(0, 0, 60, 0, Math.PI * 2);
            ctx.fill();
            
            this.renderGenericEnemy(ctx, data, time);
            
            ctx.restore();
        }

        /**
         * Render slime sprite
         */
        renderSlimeSprite(ctx, time) {
            const bounce = Math.sin(time * 2) * 4;
            const squish = 1 + Math.sin(time * 2) * 0.1;
            
            ctx.save();
            ctx.translate(0, bounce);
            ctx.scale(1, squish);
            
            // Body
            ctx.fillStyle = '#ff69b4';
            ctx.beginPath();
            ctx.ellipse(0, 0, 20, 18, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Eyes
            ctx.fillStyle = '#000';
            ctx.fillRect(-8, -5, 4, 4);
            ctx.fillRect(4, -5, 4, 4);
            
            ctx.restore();
        }

        /**
         * Render goblin sprite
         */
        renderGoblinSprite(ctx, time) {
            const bounce = Math.sin(time * 3) * 2;
            
            ctx.save();
            ctx.translate(0, bounce);
            
            // Body
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(-8, 0, 16, 20);
            
            // Head
            ctx.fillStyle = '#a0522d';
            ctx.beginPath();
            ctx.arc(0, -8, 10, 0, Math.PI * 2);
            ctx.fill();
            
            // Eyes
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(-6, -10, 4, 4);
            ctx.fillRect(2, -10, 4, 4);
            
            // Weapon (club)
            ctx.save();
            ctx.translate(12, 8);
            ctx.rotate(Math.sin(time * 3) * 0.3);
            ctx.fillStyle = '#654321';
            ctx.fillRect(-2, 0, 4, 15);
            ctx.fillRect(-4, 15, 8, 6);
            ctx.restore();
            
            ctx.restore();
        }

        /**
         * Render skeleton sprite
         */
        renderSkeletonSprite(ctx, time) {
            const rattle = Math.sin(time * 4) * 1;
            
            ctx.save();
            
            // Body
            ctx.fillStyle = '#e0e0e0';
            ctx.fillRect(-6, 0, 12, 18);
            
            // Head
            ctx.beginPath();
            ctx.arc(0, -8, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Eyes
            ctx.fillStyle = '#000';
            ctx.fillRect(-5, -10, 3, 4);
            ctx.fillRect(2, -10, 3, 4);
            
            // Arms
            ctx.save();
            ctx.translate(-10 + rattle, 5);
            ctx.rotate(Math.sin(time * 4) * 0.3);
            ctx.fillRect(-2, 0, 4, 12);
            ctx.restore();
            
            ctx.save();
            ctx.translate(10 - rattle, 5);
            ctx.rotate(-Math.sin(time * 4) * 0.3);
            ctx.fillRect(-2, 0, 4, 12);
            ctx.restore();
            
            ctx.restore();
        }

        /**
         * Render generic enemy
         */
        renderGenericEnemy(ctx, data, time) {
            const bounce = Math.sin(time * 2) * 3;
            
            ctx.save();
            ctx.translate(0, bounce);
            
            // Get color based on element
            const elementColors = {
                fire: '#ff4500',
                ice: '#00bfff',
                dark: '#8b00ff',
                nature: '#00ff00',
                neutral: '#888888'
            };
            
            const color = elementColors[data.element] || '#888888';
            
            // Simple body
            ctx.fillStyle = color;
            ctx.fillRect(-10, -10, 20, 30);
            
            // Head
            ctx.beginPath();
            ctx.arc(0, -20, 12, 0, Math.PI * 2);
            ctx.fill();
            
            // Eyes
            ctx.fillStyle = '#fff';
            ctx.fillRect(-6, -22, 4, 4);
            ctx.fillRect(2, -22, 4, 4);
            
            ctx.restore();
        }

        /**
         * Fallback rendering for unknown enemies
         */
        renderFallback(ctx, enemy, x, y, scale) {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(scale, scale);
            
            // Simple rectangle with tier indicator
            const tierColors = {
                C: '#888',
                B: '#4caf50',
                A: '#2196f3',
                S: '#9c27b0',
                SS: '#ff9800'
            };
            
            const color = tierColors[enemy.tier] || '#888';
            
            ctx.fillStyle = color;
            ctx.fillRect(-10, -10, 20, 30);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(-10, -10, 20, 30);
            
            ctx.restore();
        }

        /**
         * Set animation state for enemy
         */
        setAnimationState(enemyId, state) {
            this.animationStates.set(enemyId, state);
        }

        /**
         * Get animation state
         */
        getAnimationState(enemyId) {
            return this.animationStates.get(enemyId) || 'idle';
        }

        /**
         * Clear sprite cache
         */
        clearCache() {
            this.spriteCache.clear();
        }
    }

    // Export to global scope
    if (typeof window !== 'undefined') {
        window.EnemySpriteRenderer = EnemySpriteRenderer;
        window.enemySpriteRenderer = new EnemySpriteRenderer();
    }

    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = EnemySpriteRenderer;
    }

    console.log('[EnemySpriteRenderer] Initialized');
})();

