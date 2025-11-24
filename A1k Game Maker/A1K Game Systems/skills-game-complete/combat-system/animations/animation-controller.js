/**
 * ANIMATION CONTROLLER
 * Manages character animations for skills
 * 
 * @version 1.0.0
 */

class AnimationController {
  constructor() {
    this.activeAnimations = [];
    this.animationStates = {}; // characterId -> current state
  }

  /**
   * Play animation for character
   */
  playAnimation(characterId, animationType, duration = 500) {
    this.animationStates[characterId] = {
      type: animationType,
      startTime: Date.now(),
      duration: duration,
      active: true
    };

    // Dispatch animation event
    if (window.combatEvents) {
      window.combatEvents.dispatchEvent(new CustomEvent('animationPlayed', {
        detail: { characterId, animationType, duration }
      }));
    }
  }

  /**
   * Get current animation state
   */
  getAnimationState(characterId) {
    const state = this.animationStates[characterId];
    if (!state || !state.active) return 'idle';

    const elapsed = Date.now() - state.startTime;
    if (elapsed >= state.duration) {
      state.active = false;
      return 'idle';
    }

    return state.type;
  }

  /**
   * Cancel animation
   */
  cancelAnimation(characterId) {
    if (this.animationStates[characterId]) {
      this.animationStates[characterId].active = false;
    }
  }
}

