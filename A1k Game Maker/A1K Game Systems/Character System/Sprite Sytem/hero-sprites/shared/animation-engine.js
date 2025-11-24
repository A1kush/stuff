/**
 * Animation Engine for Hero Sprites System
 * Provides state machine, frame interpolation, and easing functions
 */

class AnimationEngine {
  constructor(animations, initialState = "idle") {
    this.animations = animations;
    this.currentState = initialState;
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.speed = 1.0;
    this.listeners = [];
  }

  /**
   * Update animation state
   * @param {number} deltaTime - Time since last update (ms)
   */
  update(deltaTime) {
    const anim = this.animations[this.currentState];
    if (!anim) return;

    this.frameTimer += deltaTime * this.speed;

    if (this.frameTimer >= anim.frameTime) {
      this.frameTimer = 0;
      const oldFrame = this.currentFrame;

      this.currentFrame++;

      if (this.currentFrame >= anim.frames) {
        if (anim.loop) {
          this.currentFrame = 0;
          this.notifyListeners("loop", { state: this.currentState });
        } else {
          this.currentFrame = anim.frames - 1;
          this.notifyListeners("complete", { state: this.currentState });
        }
      }

      this.notifyListeners("frameChange", {
        state: this.currentState,
        frame: this.currentFrame,
        previousFrame: oldFrame,
      });
    }
  }

  /**
   * Change animation state
   * @param {string} newState - New animation state
   * @param {boolean} reset - Reset to frame 0
   */
  setState(newState, reset = true) {
    if (!this.animations[newState]) {
      console.warn(`Animation state "${newState}" not found`);
      return false;
    }

    if (this.currentState !== newState) {
      const oldState = this.currentState;
      this.currentState = newState;

      if (reset) {
        this.currentFrame = 0;
        this.frameTimer = 0;
      }

      this.notifyListeners("stateChange", {
        oldState,
        newState,
        frame: this.currentFrame,
      });

      return true;
    }

    return false;
  }

  /**
   * Get current animation info
   */
  getCurrentInfo() {
    return {
      state: this.currentState,
      frame: this.currentFrame,
      totalFrames: this.animations[this.currentState]?.frames || 0,
      progress:
        this.currentFrame / (this.animations[this.currentState]?.frames || 1),
      isLooping: this.animations[this.currentState]?.loop || false,
    };
  }

  /**
   * Set animation speed multiplier
   * @param {number} speed - Speed multiplier (1.0 = normal)
   */
  setSpeed(speed) {
    this.speed = Math.max(0.1, speed);
  }

  /**
   * Add event listener
   * @param {Function} callback - Callback function (event, data)
   */
  addEventListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove event listener
   * @param {Function} callback - Callback to remove
   */
  removeEventListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Notify all listeners
   */
  notifyListeners(event, data) {
    this.listeners.forEach((callback) => {
      try {
        callback(event, data);
      } catch (error) {
        console.error("Animation listener error:", error);
      }
    });
  }

  /**
   * Reset to initial state
   */
  reset() {
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.speed = 1.0;
  }
}

/**
 * State Machine for complex animation transitions
 */
class AnimationStateMachine extends AnimationEngine {
  constructor(animations, transitions, initialState = "idle") {
    super(animations, initialState);
    this.transitions = transitions || {};
    this.transitionQueue = [];
  }

  /**
   * Transition to new state with rules
   * @param {string} newState - Target state
   * @param {boolean} force - Force transition ignoring rules
   */
  transition(newState, force = false) {
    if (force) {
      return this.setState(newState);
    }

    // Check if transition is allowed
    const allowedTransitions = this.transitions[this.currentState] || [];

    if (
      allowedTransitions.includes(newState) ||
      allowedTransitions.includes("*")
    ) {
      return this.setState(newState);
    }

    // Queue transition for later if current animation needs to finish
    const currentAnim = this.animations[this.currentState];
    if (!currentAnim.loop && this.currentFrame < currentAnim.frames - 1) {
      this.transitionQueue.push(newState);
      return false;
    }

    console.warn(
      `Transition from "${this.currentState}" to "${newState}" not allowed`
    );
    return false;
  }

  /**
   * Update with transition queue handling
   */
  update(deltaTime) {
    super.update(deltaTime);

    // Process transition queue
    const info = this.getCurrentInfo();
    if (
      info.frame === info.totalFrames - 1 &&
      this.transitionQueue.length > 0
    ) {
      const nextState = this.transitionQueue.shift();
      this.transition(nextState, true);
    }
  }
}

/**
 * Easing functions for smooth animations
 */
class Easing {
  static linear(t) {
    return t;
  }

  static easeInQuad(t) {
    return t * t;
  }

  static easeOutQuad(t) {
    return t * (2 - t);
  }

  static easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  static easeInCubic(t) {
    return t * t * t;
  }

  static easeOutCubic(t) {
    return --t * t * t + 1;
  }

  static easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  static easeInSine(t) {
    return 1 - Math.cos((t * Math.PI) / 2);
  }

  static easeOutSine(t) {
    return Math.sin((t * Math.PI) / 2);
  }

  static easeInOutSine(t) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  static easeInElastic(t) {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  }

  static easeOutElastic(t) {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }

  static easeOutBounce(t) {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  }
}

/**
 * Frame interpolator for smooth sub-frame animations
 */
class FrameInterpolator {
  /**
   * Interpolate between two frames
   * @param {Function} drawFrame1 - Function to draw first frame
   * @param {Function} drawFrame2 - Function to draw second frame
   * @param {number} t - Interpolation factor (0-1)
   * @param {string} easingType - Easing function name
   */
  static interpolate(drawFrame1, drawFrame2, t, easingType = "linear") {
    const easedT = Easing[easingType] ? Easing[easingType](t) : t;

    return (ctx, canvas) => {
      // Create temporary canvases
      const temp1 = document.createElement("canvas");
      const temp2 = document.createElement("canvas");
      temp1.width = temp2.width = canvas.width;
      temp1.height = temp2.height = canvas.height;

      const ctx1 = temp1.getContext("2d");
      const ctx2 = temp2.getContext("2d");

      // Draw both frames
      drawFrame1(ctx1, temp1);
      drawFrame2(ctx2, temp2);

      // Blend with alpha
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1 - easedT;
      ctx.drawImage(temp1, 0, 0);
      ctx.globalAlpha = easedT;
      ctx.drawImage(temp2, 0, 0);
      ctx.globalAlpha = 1;
    };
  }
}

/**
 * Example transition rules for common game scenarios
 */
const DefaultTransitions = {
  idle: ["walk", "attack", "hurt"],
  walk: ["idle", "attack", "hurt"],
  attack: ["idle", "walk", "hurt"],
  hurt: ["idle", "walk", "death"],
  death: [], // No transitions from death
};

// Export for use in modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    AnimationEngine,
    AnimationStateMachine,
    Easing,
    FrameInterpolator,
    DefaultTransitions,
  };
}
