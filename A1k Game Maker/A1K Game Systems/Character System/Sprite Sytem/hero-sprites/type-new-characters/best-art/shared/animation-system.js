// ============================================
// EXTENDED ANIMATION SYSTEM
// ============================================

class AnimationSystem {
    constructor() {
        this.animations = {
            idle: { duration: 2000, loop: true },
            walk: { duration: 1000, loop: true },
            attack: { duration: 800, loop: false },
            jump: { duration: 600, loop: false },
            dodge: { duration: 400, loop: false },
            special1: { duration: 1200, loop: false },
            special2: { duration: 1000, loop: false },
            hit: { duration: 300, loop: false },
            victory: { duration: 2000, loop: true },
            defeat: { duration: 1500, loop: false },
            charge: { duration: 1500, loop: true }
        };
        
        this.currentState = 'idle';
        this.previousState = 'idle';
        this.stateTime = 0;
        this.transitionTime = 0;
        this.transitionDuration = 300; // ms
        this.isTransitioning = false;
        
        // Combo tracking
        this.comboCount = 0;
        this.lastAttackTime = 0;
        this.comboWindow = 1000; // ms
    }

    // ============================================
    // STATE MANAGEMENT
    // ============================================

    setState(newState) {
        if (newState === this.currentState) return;
        
        this.previousState = this.currentState;
        this.currentState = newState;
        this.stateTime = 0;
        this.isTransitioning = true;
        this.transitionTime = 0;
        
        // Handle combo tracking for attacks
        if (newState === 'attack') {
            const now = Date.now();
            if (now - this.lastAttackTime < this.comboWindow) {
                this.comboCount++;
            } else {
                this.comboCount = 1;
            }
            this.lastAttackTime = now;
        } else if (!newState.includes('special')) {
            // Reset combo if switching to non-attack state
            this.comboCount = 0;
        }
    }

    getCurrentState() {
        return this.currentState;
    }

    getComboCount() {
        return this.comboCount;
    }

    // ============================================
    // UPDATE SYSTEM
    // ============================================

    update(deltaTime) {
        this.stateTime += deltaTime;
        
        // Update transition
        if (this.isTransitioning) {
            this.transitionTime += deltaTime;
            if (this.transitionTime >= this.transitionDuration) {
                this.isTransitioning = false;
            }
        }
        
        // Auto-return to idle after non-looping animations complete
        const anim = this.animations[this.currentState];
        if (anim && !anim.loop && this.stateTime >= anim.duration) {
            this.setState('idle');
        }
    }

    // ============================================
    // TRANSITION BLENDING
    // ============================================

    getTransitionProgress() {
        if (!this.isTransitioning) return 1.0;
        return Math.min(1.0, this.transitionTime / this.transitionDuration);
    }

    // Easing function for smooth transitions
    easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    getBlendedValue(oldValue, newValue) {
        const progress = this.easeInOutCubic(this.getTransitionProgress());
        return oldValue + (newValue - oldValue) * progress;
    }

    // ============================================
    // ANIMATION CURVES
    // ============================================

    getNormalizedTime() {
        const anim = this.animations[this.currentState];
        if (!anim) return 0;
        return (this.stateTime % anim.duration) / anim.duration;
    }

    // Jump curve (parabola)
    getJumpCurve() {
        const t = this.getNormalizedTime();
        return 4 * t * (1 - t); // Peaks at 0.5
    }

    // Attack curve (ease out)
    getAttackCurve() {
        const t = this.getNormalizedTime();
        return 1 - Math.pow(1 - t, 3);
    }

    // Charge curve (pulse)
    getChargeCurve() {
        const t = this.getNormalizedTime();
        return Math.sin(t * Math.PI * 4) * 0.5 + 0.5;
    }
}

// ============================================
// CHARACTER ANIMATION CONTROLLERS
// ============================================

class CharacterAnimationController {
    constructor(bodyParts) {
        this.bodyParts = bodyParts;
        this.basePositions = {};
        this.baseRotations = {};
        
        // Store base transforms
        this.storeBaseTransforms();
    }

    storeBaseTransforms() {
        Object.keys(this.bodyParts).forEach(key => {
            const part = this.bodyParts[key];
            if (part) {
                this.basePositions[key] = {
                    x: part.position.x,
                    y: part.position.y,
                    z: part.position.z
                };
                this.baseRotations[key] = {
                    x: part.rotation.x,
                    y: part.rotation.y,
                    z: part.rotation.z
                };
            }
        });
    }

    resetToBase() {
        Object.keys(this.bodyParts).forEach(key => {
            const part = this.bodyParts[key];
            if (part && this.basePositions[key]) {
                part.position.set(
                    this.basePositions[key].x,
                    this.basePositions[key].y,
                    this.basePositions[key].z
                );
                part.rotation.set(
                    this.baseRotations[key].x,
                    this.baseRotations[key].y,
                    this.baseRotations[key].z
                );
                part.scale.set(1, 1, 1);
            }
        });
    }

    // ============================================
    // JUMP ANIMATION
    // ============================================

    animateJump(progress) {
        const jumpHeight = 0.8;
        const jumpCurve = 4 * progress * (1 - progress);
        
        if (this.bodyParts.body) {
            this.bodyParts.body.position.y = this.basePositions.body.y + jumpHeight * jumpCurve;
            this.bodyParts.body.rotation.x = progress * 0.2;
        }
        
        if (this.bodyParts.head) {
            this.bodyParts.head.position.y = this.basePositions.head.y + jumpHeight * jumpCurve;
        }
        
        // Legs tuck during jump
        if (this.bodyParts.leftLeg) {
            this.bodyParts.leftLeg.rotation.x = progress < 0.5 ? progress * 1.2 : (1 - progress) * 1.2;
        }
        if (this.bodyParts.rightLeg) {
            this.bodyParts.rightLeg.rotation.x = progress < 0.5 ? progress * 1.2 : (1 - progress) * 1.2;
        }
        
        // Arms extend
        if (this.bodyParts.leftArm) {
            this.bodyParts.leftArm.rotation.x = -progress * 0.5;
        }
        if (this.bodyParts.rightArm) {
            this.bodyParts.rightArm.rotation.x = -progress * 0.5;
        }
    }

    // ============================================
    // DODGE ANIMATION
    // ============================================

    animateDodge(progress) {
        const dodgeDistance = 0.5;
        const dodgeCurve = Math.sin(progress * Math.PI);
        
        if (this.bodyParts.body) {
            this.bodyParts.body.position.z = dodgeDistance * dodgeCurve;
            this.bodyParts.body.rotation.y = progress * Math.PI * 0.5;
            this.bodyParts.body.rotation.z = dodgeCurve * 0.3;
        }
        
        if (this.bodyParts.head) {
            this.bodyParts.head.rotation.y = progress * Math.PI * 0.5;
        }
        
        // Dynamic leg movement
        if (this.bodyParts.leftLeg) {
            this.bodyParts.leftLeg.rotation.x = dodgeCurve * 0.8;
        }
        if (this.bodyParts.rightLeg) {
            this.bodyParts.rightLeg.rotation.x = -dodgeCurve * 0.8;
        }
    }

    // ============================================
    // HIT/STAGGER ANIMATION
    // ============================================

    animateHit(progress) {
        const recoil = 1 - progress;
        
        if (this.bodyParts.body) {
            this.bodyParts.body.position.z = -recoil * 0.2;
            this.bodyParts.body.rotation.x = recoil * 0.3;
            this.bodyParts.body.scale.set(
                1 - recoil * 0.1,
                1 + recoil * 0.1,
                1 - recoil * 0.1
            );
        }
        
        if (this.bodyParts.head) {
            this.bodyParts.head.rotation.z = recoil * 0.2 * (Math.random() > 0.5 ? 1 : -1);
        }
        
        // Arms flail back
        if (this.bodyParts.leftArm) {
            this.bodyParts.leftArm.rotation.z = recoil * 0.5;
        }
        if (this.bodyParts.rightArm) {
            this.bodyParts.rightArm.rotation.z = -recoil * 0.5;
        }
    }

    // ============================================
    // VICTORY ANIMATION
    // ============================================

    animateVictory(time) {
        const t = time * 0.001;
        const bob = Math.sin(t * 3) * 0.05;
        
        if (this.bodyParts.body) {
            this.bodyParts.body.position.y = this.basePositions.body.y + bob;
            this.bodyParts.body.rotation.y = Math.sin(t * 2) * 0.1;
        }
        
        if (this.bodyParts.head) {
            this.bodyParts.head.position.y = this.basePositions.head.y + bob;
            this.bodyParts.head.rotation.z = Math.sin(t * 2.5) * 0.1;
        }
        
        // Celebratory arm raise
        if (this.bodyParts.leftArm) {
            this.bodyParts.leftArm.rotation.z = 0.8 + Math.sin(t * 3) * 0.2;
            this.bodyParts.leftArm.rotation.x = Math.sin(t * 2) * 0.1;
        }
        if (this.bodyParts.rightArm) {
            this.bodyParts.rightArm.rotation.z = -0.8 - Math.sin(t * 3 + 1) * 0.2;
            this.bodyParts.rightArm.rotation.x = Math.sin(t * 2 + 1) * 0.1;
        }
        
        // Happy feet
        if (this.bodyParts.leftLeg) {
            this.bodyParts.leftLeg.rotation.x = Math.sin(t * 4) * 0.1;
        }
        if (this.bodyParts.rightLeg) {
            this.bodyParts.rightLeg.rotation.x = Math.sin(t * 4 + Math.PI) * 0.1;
        }
    }

    // ============================================
    // DEFEAT ANIMATION
    // ============================================

    animateDefeat(progress) {
        const fallCurve = Math.pow(progress, 2);
        
        if (this.bodyParts.body) {
            this.bodyParts.body.position.y = this.basePositions.body.y * (1 - fallCurve * 0.8);
            this.bodyParts.body.rotation.x = fallCurve * 1.5;
            this.bodyParts.body.rotation.z = fallCurve * 0.3;
        }
        
        if (this.bodyParts.head) {
            this.bodyParts.head.position.y = this.basePositions.head.y * (1 - fallCurve * 0.8);
            this.bodyParts.head.rotation.x = fallCurve * 0.5;
        }
        
        // Collapse
        if (this.bodyParts.leftLeg) {
            this.bodyParts.leftLeg.rotation.x = fallCurve * 1.2;
        }
        if (this.bodyParts.rightLeg) {
            this.bodyParts.rightLeg.rotation.x = fallCurve * 1.2;
        }
        
        if (this.bodyParts.leftArm) {
            this.bodyParts.leftArm.rotation.z = fallCurve * 0.5;
        }
        if (this.bodyParts.rightArm) {
            this.bodyParts.rightArm.rotation.z = -fallCurve * 0.5;
        }
    }

    // ============================================
    // CHARGE/POWER-UP ANIMATION
    // ============================================

    animateCharge(time) {
        const t = time * 0.001;
        const intensity = Math.sin(t * 8) * 0.5 + 0.5;
        const pulse = Math.sin(t * 4) * 0.1;
        
        if (this.bodyParts.body) {
            this.bodyParts.body.scale.set(
                1 + pulse * 0.5,
                1 - pulse * 0.3,
                1 + pulse * 0.5
            );
            this.bodyParts.body.position.y = this.basePositions.body.y + Math.abs(pulse) * 0.1;
        }
        
        if (this.bodyParts.head) {
            this.bodyParts.head.rotation.z = Math.sin(t * 6) * 0.15;
        }
        
        // Power stance
        if (this.bodyParts.leftArm) {
            this.bodyParts.leftArm.rotation.z = 0.3 + intensity * 0.2;
            this.bodyParts.leftArm.rotation.x = -0.2;
        }
        if (this.bodyParts.rightArm) {
            this.bodyParts.rightArm.rotation.z = -0.3 - intensity * 0.2;
            this.bodyParts.rightArm.rotation.x = -0.2;
        }
        
        // Grounded stance
        if (this.bodyParts.leftLeg) {
            this.bodyParts.leftLeg.rotation.x = 0.2;
        }
        if (this.bodyParts.rightLeg) {
            this.bodyParts.rightLeg.rotation.x = 0.2;
        }
    }

    // ============================================
    // SPECIAL ATTACK 1 (Character-specific)
    // ============================================

    animateSpecial1(progress) {
        // Spinning attack
        if (this.bodyParts.body) {
            this.bodyParts.body.rotation.y = progress * Math.PI * 4;
            this.bodyParts.body.position.y = this.basePositions.body.y + Math.sin(progress * Math.PI * 2) * 0.3;
        }
        
        // Arms extended
        if (this.bodyParts.leftArm) {
            this.bodyParts.leftArm.rotation.z = Math.PI * 0.5;
        }
        if (this.bodyParts.rightArm) {
            this.bodyParts.rightArm.rotation.z = -Math.PI * 0.5;
        }
    }

    // ============================================
    // SPECIAL ATTACK 2 (Character-specific)
    // ============================================

    animateSpecial2(progress) {
        // Ground pound/slam
        const slamCurve = progress < 0.3 ? progress / 0.3 : 1 - ((progress - 0.3) / 0.7);
        
        if (this.bodyParts.body) {
            this.bodyParts.body.position.y = this.basePositions.body.y + slamCurve * 0.8;
            this.bodyParts.body.scale.y = 1 + (1 - slamCurve) * 0.3;
        }
        
        // Arms overhead then slam
        if (this.bodyParts.leftArm && this.bodyParts.rightArm) {
            const armAngle = slamCurve * -Math.PI * 0.3;
            this.bodyParts.leftArm.rotation.x = armAngle;
            this.bodyParts.rightArm.rotation.x = armAngle;
        }
    }
}

// Export for use in character files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationSystem, CharacterAnimationController };
}

