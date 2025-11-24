// ============================================
// ADVANCED PARTICLE SYSTEM FOR 3D CHARACTERS
// ============================================

class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.trails = [];
        this.maxParticles = 500;
        this.particlePool = [];
        this.trailPool = [];
        
        // Initialize particle pools for performance
        this.initializePools();
    }

    // ============================================
    // PARTICLE POOL INITIALIZATION
    // ============================================

    initializePools() {
        // Pre-create particle objects for reuse
        for (let i = 0; i < this.maxParticles; i++) {
            const geometry = new THREE.SphereGeometry(0.02, 4, 4);
            const material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 1,
                blending: THREE.AdditiveBlending
            });
            const particle = new THREE.Mesh(geometry, material);
            particle.visible = false;
            this.scene.add(particle);
            this.particlePool.push({
                mesh: particle,
                velocity: new THREE.Vector3(),
                life: 0,
                maxLife: 1,
                startSize: 0.02,
                endSize: 0,
                startOpacity: 1,
                endOpacity: 0,
                gravity: 0,
                active: false
            });
        }
    }

    // ============================================
    // WEAPON TRAIL SYSTEM
    // ============================================

    createWeaponTrail(startPos, endPos, color, intensity = 1.0) {
        const trailSegments = 8;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        
        // Create trail geometry
        for (let i = 0; i <= trailSegments; i++) {
            const t = i / trailSegments;
            const pos = new THREE.Vector3().lerpVectors(startPos, endPos, t);
            positions.push(pos.x, pos.y, pos.z);
            
            // Color with fade
            const colorObj = new THREE.Color(color);
            const alpha = (1 - t) * intensity;
            colors.push(colorObj.r * alpha, colorObj.g * alpha, colorObj.b * alpha);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            linewidth: 2
        });
        
        const trail = new THREE.Line(geometry, material);
        trail.userData.life = 0;
        trail.userData.maxLife = 0.3; // seconds
        this.scene.add(trail);
        this.trails.push(trail);
        
        return trail;
    }

    // ============================================
    // PARTICLE EMITTERS
    // ============================================

    emitParticles(config) {
        const {
            position,
            count = 10,
            color = 0xffffff,
            velocity = { x: 0, y: 0.5, z: 0 },
            spread = 0.5,
            life = 1.0,
            size = 0.02,
            gravity = -0.5,
            fade = true
        } = config;

        let emitted = 0;
        for (let i = 0; i < this.particlePool.length && emitted < count; i++) {
            const p = this.particlePool[i];
            if (!p.active) {
                // Activate particle
                p.active = true;
                p.mesh.visible = true;
                p.mesh.position.copy(position);
                p.mesh.scale.set(size, size, size);
                
                // Set velocity with spread
                p.velocity.set(
                    velocity.x + (Math.random() - 0.5) * spread,
                    velocity.y + (Math.random() - 0.5) * spread,
                    velocity.z + (Math.random() - 0.5) * spread
                );
                
                p.life = 0;
                p.maxLife = life * (0.8 + Math.random() * 0.4);
                p.startSize = size;
                p.endSize = fade ? 0 : size * 0.5;
                p.startOpacity = 1;
                p.endOpacity = 0;
                p.gravity = gravity;
                p.mesh.material.color.setHex(color);
                p.mesh.material.opacity = 1;
                
                emitted++;
            }
        }
    }

    // Sword slash impact particles
    emitSwordImpact(position, color, intensity = 1.0) {
        this.emitParticles({
            position: position,
            count: Math.floor(15 * intensity),
            color: color,
            velocity: { x: 0, y: 1, z: 0 },
            spread: 1.5,
            life: 0.5,
            size: 0.03,
            gravity: -1.5
        });
        
        // Add energy burst
        this.emitParticles({
            position: position,
            count: Math.floor(8 * intensity),
            color: color,
            velocity: { x: 0, y: 0.5, z: 0 },
            spread: 2.0,
            life: 0.3,
            size: 0.05,
            gravity: 0
        });
    }

    // Pistol muzzle flash
    emitMuzzleFlash(position, direction, color) {
        // Forward burst
        const dir = direction.clone().normalize();
        this.emitParticles({
            position: position,
            count: 5,
            color: color,
            velocity: { x: dir.x * 2, y: dir.y * 2, z: dir.z * 2 },
            spread: 0.3,
            life: 0.15,
            size: 0.04,
            gravity: 0
        });
        
        // Flash ring
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const offset = new THREE.Vector3(
                Math.cos(angle) * 0.1,
                Math.sin(angle) * 0.1,
                0
            );
            this.emitParticles({
                position: position.clone().add(offset),
                count: 1,
                color: color,
                velocity: { x: 0, y: 0, z: 0 },
                spread: 0,
                life: 0.1,
                size: 0.02,
                gravity: 0
            });
        }
    }

    // Ambient energy particles (idle aura)
    emitAmbientAura(position, color, radius = 0.5) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * radius;
        const height = (Math.random() - 0.5) * 1.0;
        
        const particlePos = position.clone().add(new THREE.Vector3(
            Math.cos(angle) * r,
            height,
            Math.sin(angle) * r
        ));
        
        this.emitParticles({
            position: particlePos,
            count: 1,
            color: color,
            velocity: { x: 0, y: 0.2, z: 0 },
            spread: 0.1,
            life: 2.0,
            size: 0.015,
            gravity: 0,
            fade: true
        });
    }

    // Walking dust particles
    emitWalkDust(position) {
        this.emitParticles({
            position: position,
            count: 2,
            color: 0x888888,
            velocity: { x: 0, y: 0.1, z: 0 },
            spread: 0.3,
            life: 0.5,
            size: 0.025,
            gravity: -0.2
        });
    }

    // Bullet tracer
    emitBulletTracer(startPos, endPos, color) {
        // Create a thin line from gun to target
        const geometry = new THREE.BufferGeometry();
        const positions = [
            startPos.x, startPos.y, startPos.z,
            endPos.x, endPos.y, endPos.z
        ];
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        
        const material = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending,
            linewidth: 3
        });
        
        const tracer = new THREE.Line(geometry, material);
        tracer.userData.life = 0;
        tracer.userData.maxLife = 0.1; // Very short lived
        this.scene.add(tracer);
        this.trails.push(tracer);
        
        // Add particles along the tracer
        for (let i = 0; i < 3; i++) {
            const t = i / 3;
            const pos = new THREE.Vector3().lerpVectors(startPos, endPos, t);
            this.emitParticles({
                position: pos,
                count: 1,
                color: color,
                velocity: { x: 0, y: 0, z: 0 },
                spread: 0.1,
                life: 0.2,
                size: 0.02,
                gravity: 0
            });
        }
    }

    // Energy orb (floating particles)
    emitEnergyOrb(position, color, count = 3) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
            const radius = 0.3 + Math.random() * 0.2;
            const height = Math.sin(Date.now() * 0.001 + i) * 0.3;
            
            const orbPos = position.clone().add(new THREE.Vector3(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            ));
            
            this.emitParticles({
                position: orbPos,
                count: 1,
                color: color,
                velocity: { x: 0, y: 0, z: 0 },
                spread: 0,
                life: 0.5,
                size: 0.03,
                gravity: 0,
                fade: true
            });
        }
    }

    // ============================================
    // UPDATE SYSTEM
    // ============================================

    update(deltaTime) {
        deltaTime = deltaTime * 0.001; // Convert to seconds

        // Update particles
        for (let i = 0; i < this.particlePool.length; i++) {
            const p = this.particlePool[i];
            if (p.active) {
                p.life += deltaTime;
                
                if (p.life >= p.maxLife) {
                    // Deactivate particle
                    p.active = false;
                    p.mesh.visible = false;
                } else {
                    // Update position
                    p.mesh.position.x += p.velocity.x * deltaTime;
                    p.mesh.position.y += p.velocity.y * deltaTime;
                    p.mesh.position.z += p.velocity.z * deltaTime;
                    
                    // Apply gravity
                    p.velocity.y += p.gravity * deltaTime;
                    
                    // Update size and opacity
                    const t = p.life / p.maxLife;
                    const size = THREE.MathUtils.lerp(p.startSize, p.endSize, t);
                    const opacity = THREE.MathUtils.lerp(p.startOpacity, p.endOpacity, t);
                    
                    p.mesh.scale.set(size, size, size);
                    p.mesh.material.opacity = opacity;
                }
            }
        }

        // Update trails
        for (let i = this.trails.length - 1; i >= 0; i--) {
            const trail = this.trails[i];
            trail.userData.life += deltaTime;
            
            if (trail.userData.life >= trail.userData.maxLife) {
                this.scene.remove(trail);
                trail.geometry.dispose();
                trail.material.dispose();
                this.trails.splice(i, 1);
            } else {
                // Fade out
                const t = trail.userData.life / trail.userData.maxLife;
                trail.material.opacity = 1 - t;
            }
        }
    }

    // ============================================
    // CLEANUP
    // ============================================

    dispose() {
        // Clean up all particles
        for (const p of this.particlePool) {
            this.scene.remove(p.mesh);
            p.mesh.geometry.dispose();
            p.mesh.material.dispose();
        }
        
        // Clean up all trails
        for (const trail of this.trails) {
            this.scene.remove(trail);
            trail.geometry.dispose();
            trail.material.dispose();
        }
        
        this.particlePool = [];
        this.trails = [];
    }
}

// ============================================
// WEAPON TRAIL TRACKER
// ============================================

class WeaponTrailTracker {
    constructor(particleSystem, weaponMesh, color) {
        this.particleSystem = particleSystem;
        this.weaponMesh = weaponMesh;
        this.color = color;
        this.previousPosition = new THREE.Vector3();
        this.trailEnabled = false;
        this.intensity = 1.0;
        
        // Initialize previous position
        this.weaponMesh.getWorldPosition(this.previousPosition);
    }

    enable() {
        this.trailEnabled = true;
    }

    disable() {
        this.trailEnabled = false;
    }

    setIntensity(value) {
        this.intensity = value;
    }

    setColor(color) {
        this.color = color;
    }

    update() {
        if (!this.trailEnabled) return;
        
        const currentPos = new THREE.Vector3();
        this.weaponMesh.getWorldPosition(currentPos);
        
        const distance = currentPos.distanceTo(this.previousPosition);
        
        // Only create trail if weapon moved significantly
        if (distance > 0.1) {
            this.particleSystem.createWeaponTrail(
                this.previousPosition.clone(),
                currentPos.clone(),
                this.color,
                this.intensity
            );
        }
        
        this.previousPosition.copy(currentPos);
    }
}

// Export for use in character files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticleSystem, WeaponTrailTracker };
}

