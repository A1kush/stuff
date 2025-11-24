/**
 * BESTIARY SYSTEM
 * Enemy collection and tracking system
 * Tracks discovered enemies, defeats, and provides bestiary UI
 */

(function() {
    'use strict';

    class BestiarySystem {
        constructor() {
            this.discoveredEnemies = new Set();
            this.enemyDefeats = new Map();
            this.isOpen = false;
            this.selectedTier = 'all';
            this.uiElement = null;
        }

        /**
         * Discover an enemy (first encounter)
         */
        discoverEnemy(enemyId) {
            if (!this.discoveredEnemies.has(enemyId)) {
                this.discoveredEnemies.add(enemyId);
                this.saveProgress();
                return true; // New discovery
            }
            return false; // Already discovered
        }

        /**
         * Record enemy defeat
         */
        recordDefeat(enemyId) {
            const currentDefeats = this.enemyDefeats.get(enemyId) || 0;
            this.enemyDefeats.set(enemyId, currentDefeats + 1);
            this.discoverEnemy(enemyId);
            this.saveProgress();
        }

        /**
         * Get defeat count for enemy
         */
        getDefeatCount(enemyId) {
            return this.enemyDefeats.get(enemyId) || 0;
        }

        /**
         * Check if enemy is discovered
         */
        isDiscovered(enemyId) {
            return this.discoveredEnemies.has(enemyId);
        }

        /**
         * Get all discovered enemies
         */
        getDiscoveredEnemies() {
            return Array.from(this.discoveredEnemies);
        }

        /**
         * Get completion percentage
         */
        getCompletionPercentage() {
            const totalEnemies = window.EnemySpriteAPI?.getAllEnemies().length || 0;
            if (totalEnemies === 0) return 0;
            return Math.floor((this.discoveredEnemies.size / totalEnemies) * 100);
        }

        /**
         * Get completion by tier
         */
        getCompletionByTier() {
            const result = {};
            ['C', 'B', 'A', 'S', 'SS'].forEach(tier => {
                const tierEnemies = window.EnemySpriteAPI?.getEnemiesByTier(tier) || [];
                const discovered = tierEnemies.filter(e => this.isDiscovered(e.id)).length;
                result[tier] = {
                    total: tierEnemies.length,
                    discovered: discovered,
                    percentage: tierEnemies.length > 0 ? Math.floor((discovered / tierEnemies.length) * 100) : 0
                };
            });
            return result;
        }

        /**
         * Save progress to localStorage
         */
        saveProgress() {
            try {
                const data = {
                    discovered: Array.from(this.discoveredEnemies),
                    defeats: Array.from(this.enemyDefeats.entries())
                };
                localStorage.setItem('a1k_bestiary_progress', JSON.stringify(data));
            } catch (e) {
                console.warn('[Bestiary] Could not save progress:', e);
            }
        }

        /**
         * Load progress from localStorage
         */
        loadProgress() {
            try {
                const saved = localStorage.getItem('a1k_bestiary_progress');
                if (saved) {
                    const data = JSON.parse(saved);
                    this.discoveredEnemies = new Set(data.discovered || []);
                    this.enemyDefeats = new Map(data.defeats || []);
                }
            } catch (e) {
                console.warn('[Bestiary] Could not load progress:', e);
            }
        }

        /**
         * Reset all progress
         */
        resetProgress() {
            this.discoveredEnemies.clear();
            this.enemyDefeats.clear();
            this.saveProgress();
        }

        /**
         * Create and show bestiary UI
         */
        show() {
            if (this.isOpen) return;
            
            this.isOpen = true;
            this.createUI();
            this.updateUI();
        }

        /**
         * Hide bestiary UI
         */
        hide() {
            this.isOpen = false;
            if (this.uiElement) {
                this.uiElement.remove();
                this.uiElement = null;
            }
        }

        /**
         * Toggle bestiary UI
         */
        toggle() {
            if (this.isOpen) {
                this.hide();
            } else {
                this.show();
            }
        }

        /**
         * Create bestiary UI
         */
        createUI() {
            const ui = document.createElement('div');
            ui.id = 'bestiary-ui';
            ui.innerHTML = `
                <style>
                    #bestiary-ui {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 90%;
                        max-width: 1000px;
                        height: 80%;
                        background: rgba(10, 18, 32, 0.98);
                        border: 3px solid #00ffff;
                        border-radius: 20px;
                        box-shadow: 0 0 50px rgba(0,255,255,0.5);
                        z-index: 10000;
                        display: flex;
                        flex-direction: column;
                        padding: 20px;
                        color: #fff;
                        font-family: Arial, sans-serif;
                    }
                    .bestiary-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 15px;
                        border-bottom: 2px solid #00ffff;
                    }
                    .bestiary-title {
                        font-size: 28px;
                        color: #00ffff;
                        text-shadow: 0 0 10px #00ffff;
                    }
                    .bestiary-close {
                        background: #ff0000;
                        border: none;
                        color: #fff;
                        padding: 10px 20px;
                        border-radius: 10px;
                        cursor: pointer;
                        font-size: 16px;
                    }
                    .bestiary-stats {
                        display: flex;
                        gap: 20px;
                        margin-bottom: 20px;
                    }
                    .stat-box {
                        flex: 1;
                        background: rgba(0,255,255,0.1);
                        padding: 15px;
                        border-radius: 10px;
                        border: 2px solid #00ffff;
                        text-align: center;
                    }
                    .stat-label {
                        font-size: 12px;
                        color: #00ffff;
                        margin-bottom: 5px;
                    }
                    .stat-value {
                        font-size: 24px;
                        font-weight: bold;
                        color: #fff;
                    }
                    .bestiary-filters {
                        display: flex;
                        gap: 10px;
                        margin-bottom: 20px;
                    }
                    .filter-btn {
                        padding: 10px 15px;
                        background: rgba(0,255,255,0.2);
                        border: 2px solid #00ffff;
                        color: #00ffff;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.3s;
                    }
                    .filter-btn.active {
                        background: #00ffff;
                        color: #000;
                    }
                    .bestiary-content {
                        flex: 1;
                        overflow-y: auto;
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                        gap: 15px;
                        padding-right: 10px;
                    }
                    .enemy-card {
                        background: rgba(0,0,0,0.5);
                        border: 2px solid;
                        border-radius: 10px;
                        padding: 15px;
                        cursor: pointer;
                        transition: all 0.3s;
                        text-align: center;
                    }
                    .enemy-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 5px 20px rgba(0,255,255,0.5);
                    }
                    .enemy-card.discovered {
                        border-color: #00ffff;
                    }
                    .enemy-card.undiscovered {
                        border-color: #333;
                        opacity: 0.5;
                    }
                    .enemy-icon {
                        font-size: 48px;
                        margin-bottom: 10px;
                    }
                    .enemy-name {
                        font-size: 14px;
                        margin-bottom: 5px;
                        color: #00ffff;
                    }
                    .enemy-tier {
                        font-size: 12px;
                        padding: 4px 8px;
                        border-radius: 5px;
                        display: inline-block;
                        margin-bottom: 5px;
                    }
                    .tier-C { background: #666; }
                    .tier-B { background: #4caf50; }
                    .tier-A { background: #2196f3; }
                    .tier-S { background: #9c27b0; }
                    .tier-SS { background: #ff9800; color: #000; }
                    .enemy-defeats {
                        font-size: 11px;
                        color: #999;
                    }
                </style>
                
                <div class="bestiary-header">
                    <div class="bestiary-title">📖 ENEMY BESTIARY</div>
                    <button class="bestiary-close" onclick="window.bestiarySystem.hide()">✕ CLOSE</button>
                </div>
                
                <div class="bestiary-stats" id="bestiary-stats"></div>
                
                <div class="bestiary-filters" id="bestiary-filters"></div>
                
                <div class="bestiary-content" id="bestiary-content"></div>
            `;
            
            document.body.appendChild(ui);
            this.uiElement = ui;
        }

        /**
         * Update bestiary UI
         */
        updateUI() {
            if (!this.uiElement) return;
            
            // Update stats
            const statsEl = this.uiElement.querySelector('#bestiary-stats');
            const completion = this.getCompletionByTier();
            const totalCompletion = this.getCompletionPercentage();
            
            statsEl.innerHTML = `
                <div class="stat-box">
                    <div class="stat-label">TOTAL DISCOVERED</div>
                    <div class="stat-value">${this.discoveredEnemies.size}/${window.EnemySpriteAPI?.getAllEnemies().length || 0}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">COMPLETION</div>
                    <div class="stat-value">${totalCompletion}%</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">TOTAL DEFEATS</div>
                    <div class="stat-value">${Array.from(this.enemyDefeats.values()).reduce((a,b) => a+b, 0)}</div>
                </div>
            `;
            
            // Update filters
            const filtersEl = this.uiElement.querySelector('#bestiary-filters');
            filtersEl.innerHTML = `
                <button class="filter-btn ${this.selectedTier === 'all' ? 'active' : ''}" onclick="window.bestiarySystem.setFilter('all')">ALL</button>
                <button class="filter-btn ${this.selectedTier === 'C' ? 'active' : ''}" onclick="window.bestiarySystem.setFilter('C')">C-RANK</button>
                <button class="filter-btn ${this.selectedTier === 'B' ? 'active' : ''}" onclick="window.bestiarySystem.setFilter('B')">B-RANK</button>
                <button class="filter-btn ${this.selectedTier === 'A' ? 'active' : ''}" onclick="window.bestiarySystem.setFilter('A')">A-RANK</button>
                <button class="filter-btn ${this.selectedTier === 'S' ? 'active' : ''}" onclick="window.bestiarySystem.setFilter('S')">S-RANK</button>
                <button class="filter-btn ${this.selectedTier === 'SS' ? 'active' : ''}" onclick="window.bestiarySystem.setFilter('SS')">BOSSES</button>
            `;
            
            // Update enemy list
            const contentEl = this.uiElement.querySelector('#bestiary-content');
            const enemies = this.selectedTier === 'all' 
                ? window.EnemySpriteAPI?.getAllEnemies() || []
                : window.EnemySpriteAPI?.getEnemiesByTier(this.selectedTier) || [];
            
            contentEl.innerHTML = enemies.map(enemy => {
                const discovered = this.isDiscovered(enemy.id);
                const defeats = this.getDefeatCount(enemy.id);
                
                return `
                    <div class="enemy-card ${discovered ? 'discovered' : 'undiscovered'}">
                        <div class="enemy-icon">${discovered ? (enemy.icon || '👹') : '❓'}</div>
                        <div class="enemy-name">${discovered ? enemy.name : '???'}</div>
                        <div class="enemy-tier tier-${enemy.tier}">${enemy.tier}-RANK</div>
                        ${discovered ? `<div class="enemy-defeats">Defeated: ${defeats}</div>` : ''}
                        ${discovered ? `<div class="enemy-defeats">HP: ${enemy.hp} | ATK: ${enemy.atk}</div>` : ''}
                    </div>
                `;
            }).join('');
        }

        /**
         * Set filter
         */
        setFilter(tier) {
            this.selectedTier = tier;
            this.updateUI();
        }
    }

    // Export to global scope
    if (typeof window !== 'undefined') {
        window.BestiarySystem = BestiarySystem;
        window.bestiarySystem = new BestiarySystem();
        window.bestiarySystem.loadProgress();
    }

    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = BestiarySystem;
    }

    console.log('[BestiarySystem] Initialized');
})();

