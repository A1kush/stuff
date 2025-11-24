/**
 * ENEMY SPRITE DATA SYSTEM
 * Unified database linking all enemy sprites to game data
 * Compatible with a1k bag system and runner game
 */

(function() {
    'use strict';

    // Enemy Sprite Database - Maps enemy IDs to sprite information
    const ENEMY_SPRITE_DATABASE = {
        // C-RANK: BASIC ENEMIES
        enemy_slime: {
            id: 'enemy_slime',
            name: 'Candy Slime Villain',
            tier: 'C',
            type: 'basic',
            element: 'neutral',
            hp: 100, atk: 15, def: 5, speed: 80,
            sprites: {
                'type-7-chibi-kawaii': 'candy-slime-villain.html',
                'type-1-hd-pixel-art': 'slime-pixel.html',
                'type-5-hybrid-enhanced': 'slime-hybrid.html'
            },
            animations: ['idle', 'attack'],
            variants: ['pink', 'purple', 'blue', 'green', 'orange'],
            size: { width: 256, height: 256 },
            description: 'Gelatinous candy creature with whip weapon'
        },
        
        enemy_goblin: {
            id: 'enemy_goblin',
            name: 'Goblin Warrior',
            tier: 'C',
            type: 'basic',
            element: 'dark',
            hp: 120, atk: 20, def: 8, speed: 110,
            sprites: {
                'type-7-chibi-kawaii': 'goblin-warrior.html',
                'type-1-hd-pixel-art': 'goblin-pixel.html',
                'type-5-hybrid-enhanced': 'goblin-hybrid.html'
            },
            animations: ['idle', 'attack'],
            variants: ['green', 'red', 'brown'],
            size: { width: 256, height: 256 },
            description: 'Small aggressive creature with club weapon'
        },

        enemy_skeleton: {
            id: 'enemy_skeleton',
            name: 'Skeleton Fighter',
            tier: 'C',
            type: 'basic',
            element: 'dark',
            hp: 110, atk: 18, def: 10, speed: 100,
            sprites: {
                'type-7-chibi-kawaii': 'skeleton-fighter.html',
                'type-1-hd-pixel-art': 'skeleton-pixel.html',
                'type-5-hybrid-enhanced': 'skeleton-hybrid.html'
            },
            animations: ['idle', 'attack'],
            variants: ['bone', 'dark', 'cursed'],
            size: { width: 256, height: 256 },
            description: 'Undead warrior with sword weapon'
        },

        enemy_bat: {
            id: 'enemy_bat',
            name: 'Shadow Bat',
            tier: 'C',
            type: 'flying',
            element: 'wind',
            hp: 80, atk: 12, def: 3, speed: 150,
            sprites: {
                'type-7-chibi-kawaii': 'shadow-bat.html',
                'type-1-hd-pixel-art': 'bat-pixel.html',
                'type-5-hybrid-enhanced': 'bat-hybrid.html'
            },
            animations: ['idle', 'attack'],
            variants: ['shadow', 'fire', 'frost'],
            size: { width: 256, height: 256 },
            description: 'Flying creature with claw attacks'
        },

        // S-RANK: MINI-BOSS
        enemy_shadow_ninja: {
            id: 'enemy_shadow_ninja',
            name: 'Shadow Ninja Assassin',
            tier: 'S',
            type: 'elite',
            element: 'dark',
            hp: 800, atk: 120, def: 70, speed: 200,
            sprites: {
                'type-7-chibi-kawaii': 'shadow-ninja.html',
                'type-1-hd-pixel-art': 'shadow-ninja-assassin.html',
                'type-5-hybrid-enhanced': 'shadow-ninja-hybrid.html'
            },
            animations: ['idle', 'attack', 'teleport'],
            variants: ['purple', 'red', 'blue'],
            size: { width: 128, height: 128 },
            description: 'Elite ninja with dual kunai weapons'
        },

        // SS-RANK: STAGE BOSS
        boss_demon_lord: {
            id: 'boss_demon_lord',
            name: 'Demon Lord Boss',
            tier: 'SS',
            type: 'boss',
            element: 'fire',
            hp: 5000, atk: 110, def: 60, speed: 90,
            sprites: {
                'type-7-chibi-kawaii': 'demon-lord-chibi.html',
                'type-1-hd-pixel-art': 'demon-lord-pixel.html',
                'type-5-hybrid-enhanced': 'demon-lord-boss.html'
            },
            animations: ['idle', 'attack', 'special'],
            variants: ['crimson', 'shadow', 'inferno'],
            size: { width: 384, height: 384 },
            description: 'Massive demon lord with flame sword and wings'
        },

        boss_slime_king: {
            id: 'boss_slime_king',
            name: 'Slime King',
            tier: 'SS',
            type: 'boss',
            element: 'nature',
            hp: 2000, atk: 50, def: 15, speed: 70,
            sprites: {
                'type-7-chibi-kawaii': 'slime-king-chibi.html',
                'type-1-hd-pixel-art': 'slime-king-pixel.html',
                'type-5-hybrid-enhanced': 'slime-king-hybrid.html'
            },
            animations: ['idle', 'attack', 'split'],
            variants: ['green', 'toxic', 'crystal'],
            size: { width: 384, height: 384 },
            description: 'Giant slime king with crown and splitting ability'
        }
    };

    // Helper Functions
    const EnemySpriteAPI = {
        /**
         * Get enemy sprite data by ID
         */
        getEnemy: function(id) {
            return ENEMY_SPRITE_DATABASE[id] || null;
        },

        /**
         * Get all enemies of a specific tier
         */
        getEnemiesByTier: function(tier) {
            return Object.values(ENEMY_SPRITE_DATABASE).filter(e => e.tier === tier);
        },

        /**
         * Get all enemies of a specific type
         */
        getEnemiesByType: function(type) {
            return Object.values(ENEMY_SPRITE_DATABASE).filter(e => e.type === type);
        },

        /**
         * Get sprite path for enemy
         */
        getSpritePath: function(enemyId, artStyle) {
            const enemy = this.getEnemy(enemyId);
            if (!enemy || !enemy.sprites[artStyle]) return null;
            return `../enemy-sprites/${artStyle}/${enemy.sprites[artStyle]}`;
        },

        /**
         * Get all available art styles
         */
        getArtStyles: function() {
            return ['type-7-chibi-kawaii', 'type-1-hd-pixel-art', 'type-5-hybrid-enhanced'];
        },

        /**
         * Get all enemies
         */
        getAllEnemies: function() {
            return Object.values(ENEMY_SPRITE_DATABASE);
        },

        /**
         * Get enemy count by tier
         */
        getCountByTier: function() {
            const counts = { C: 0, B: 0, A: 0, S: 0, SS: 0 };
            Object.values(ENEMY_SPRITE_DATABASE).forEach(e => {
                if (counts[e.tier] !== undefined) counts[e.tier]++;
            });
            return counts;
        }
    };

    // Export to global scope
    if (typeof window !== 'undefined') {
        window.ENEMY_SPRITE_DATABASE = ENEMY_SPRITE_DATABASE;
        window.EnemySpriteAPI = EnemySpriteAPI;
    }

    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { ENEMY_SPRITE_DATABASE, EnemySpriteAPI };
    }

    console.log('[EnemySpriteData] Loaded', Object.keys(ENEMY_SPRITE_DATABASE).length, 'enemy sprites');
})();

