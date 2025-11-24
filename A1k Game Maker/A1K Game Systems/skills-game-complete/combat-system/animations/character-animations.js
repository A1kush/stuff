/**
 * CHARACTER ANIMATIONS
 * Sprite-based animations for each skill
 * 
 * @version 1.0.0
 */

class CharacterAnimations {
  constructor() {
    this.animations = {
      A1: {
        idle: { frames: 4, speed: 0.2 },
        attack: { frames: 6, speed: 0.1 },
        cast: { frames: 8, speed: 0.15 },
        dodge: { frames: 4, speed: 0.1 }
      },
      UNIQUE: {
        idle: { frames: 4, speed: 0.2 },
        attack: { frames: 5, speed: 0.12 },
        cast: { frames: 7, speed: 0.15 },
        dodge: { frames: 3, speed: 0.1 }
      },
      MISSY: {
        idle: { frames: 4, speed: 0.2 },
        attack: { frames: 6, speed: 0.1 },
        cast: { frames: 8, speed: 0.15 },
        dodge: { frames: 5, speed: 0.1 }
      }
    };
  }

  /**
   * Get animation config for character and state
   */
  getAnimation(characterId, state) {
    const charAnims = this.animations[characterId];
    if (!charAnims) return { frames: 1, speed: 0.2 };

    return charAnims[state] || charAnims.idle;
  }

  /**
   * Get skill-specific animation
   */
  getSkillAnimation(characterId, skillId) {
    // Map skills to animation types
    const skillName = skillId.toLowerCase();
    
    if (skillName.includes('slash') || skillName.includes('strike')) {
      return this.getAnimation(characterId, 'attack');
    } else if (skillName.includes('beam') || skillName.includes('blast')) {
      return this.getAnimation(characterId, 'cast');
    } else if (skillName.includes('step') || skillName.includes('dash')) {
      return this.getAnimation(characterId, 'dodge');
    }

    return this.getAnimation(characterId, 'cast');
  }
}

