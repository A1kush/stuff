// ============================================
// POST-PROCESSING EFFECTS SYSTEM
// ============================================

class PostProcessing {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        
        // Effect settings
        this.bloom = {
            enabled: true,
            strength: 0.8,
            threshold: 0.5,
            radius: 0.4
        };
        
        this.colorGrading = {
            preset: 'default',
            brightness: 1.0,
            contrast: 1.0,
            saturation: 1.0,
            hue: 0
        };
        
        this.vignette = {
            enabled: false,
            intensity: 0.5,
            smoothness: 0.5
        };
        
        this.chromatic = {
            enabled: false,
            intensity: 0.002
        };
        
        this.filmGrain = {
            enabled: false,
            intensity: 0.15
        };
        
        this.scanlines = {
            enabled: false,
            density: 4,
            intensity: 0.3
        };
        
        // Create render targets
        this.createRenderTargets();
        
        // Create shader materials
        this.createShaders();
    }

    // ============================================
    // RENDER TARGET SETUP
    // ============================================

    createRenderTargets() {
        const width = this.renderer.domElement.width;
        const height = this.renderer.domElement.height;
        
        this.renderTarget1 = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat
        });
        
        this.renderTarget2 = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat
        });
    }

    // ============================================
    // SHADER CREATION
    // ============================================

    createShaders() {
        // Full-screen quad for post-processing
        this.quad = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            null // Material will be swapped for each pass
        );
        this.quadScene = new THREE.Scene();
        this.quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.quadScene.add(this.quad);

        // Create shader materials for each effect
        this.createBloomShader();
        this.createColorGradingShader();
        this.createVignetteShader();
        this.createChromaticShader();
        this.createFilmGrainShader();
        this.createScanlineShader();
        this.createCompositeShader();
    }

    // ============================================
    // BLOOM SHADER
    // ============================================

    createBloomShader() {
        this.bloomMaterial = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                strength: { value: this.bloom.strength },
                threshold: { value: this.bloom.threshold }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float strength;
                uniform float threshold;
                varying vec2 vUv;
                
                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);
                    float brightness = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
                    
                    if (brightness > threshold) {
                        vec3 bloom = color.rgb * strength;
                        color.rgb += bloom;
                    }
                    
                    gl_FragColor = color;
                }
            `
        });
    }

    // ============================================
    // COLOR GRADING SHADER
    // ============================================

    createColorGradingShader() {
        this.colorGradingMaterial = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                brightness: { value: this.colorGrading.brightness },
                contrast: { value: this.colorGrading.contrast },
                saturation: { value: this.colorGrading.saturation },
                hue: { value: this.colorGrading.hue }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float brightness;
                uniform float contrast;
                uniform float saturation;
                uniform float hue;
                varying vec2 vUv;
                
                vec3 rgb2hsv(vec3 c) {
                    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
                    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
                    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
                    float d = q.x - min(q.w, q.y);
                    float e = 1.0e-10;
                    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
                }
                
                vec3 hsv2rgb(vec3 c) {
                    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
                }
                
                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);
                    
                    // Brightness
                    color.rgb *= brightness;
                    
                    // Contrast
                    color.rgb = (color.rgb - 0.5) * contrast + 0.5;
                    
                    // Saturation & Hue
                    vec3 hsv = rgb2hsv(color.rgb);
                    hsv.x += hue;
                    hsv.y *= saturation;
                    color.rgb = hsv2rgb(hsv);
                    
                    gl_FragColor = color;
                }
            `
        });
    }

    // ============================================
    // VIGNETTE SHADER
    // ============================================

    createVignetteShader() {
        this.vignetteMaterial = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                intensity: { value: this.vignette.intensity },
                smoothness: { value: this.vignette.smoothness }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float intensity;
                uniform float smoothness;
                varying vec2 vUv;
                
                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);
                    vec2 center = vec2(0.5, 0.5);
                    float dist = distance(vUv, center);
                    float vignette = smoothstep(0.8 - smoothness, 0.8, dist) * intensity;
                    color.rgb *= 1.0 - vignette;
                    gl_FragColor = color;
                }
            `
        });
    }

    // ============================================
    // CHROMATIC ABERRATION SHADER
    // ============================================

    createChromaticShader() {
        this.chromaticMaterial = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                intensity: { value: this.chromatic.intensity }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float intensity;
                varying vec2 vUv;
                
                void main() {
                    vec2 direction = vUv - vec2(0.5);
                    vec2 offset = direction * intensity;
                    
                    float r = texture2D(tDiffuse, vUv + offset).r;
                    float g = texture2D(tDiffuse, vUv).g;
                    float b = texture2D(tDiffuse, vUv - offset).b;
                    float a = texture2D(tDiffuse, vUv).a;
                    
                    gl_FragColor = vec4(r, g, b, a);
                }
            `
        });
    }

    // ============================================
    // FILM GRAIN SHADER
    // ============================================

    createFilmGrainShader() {
        this.filmGrainMaterial = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                intensity: { value: this.filmGrain.intensity },
                time: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float intensity;
                uniform float time;
                varying vec2 vUv;
                
                float random(vec2 co) {
                    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
                }
                
                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);
                    float grain = random(vUv + time) * intensity;
                    color.rgb += grain;
                    gl_FragColor = color;
                }
            `
        });
    }

    // ============================================
    // SCANLINE SHADER
    // ============================================

    createScanlineShader() {
        this.scanlineMaterial = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                density: { value: this.scanlines.density },
                intensity: { value: this.scanlines.intensity },
                resolution: { value: new THREE.Vector2(512, 512) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float density;
                uniform float intensity;
                uniform vec2 resolution;
                varying vec2 vUv;
                
                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);
                    float scanline = sin(vUv.y * resolution.y * density) * 0.5 + 0.5;
                    color.rgb *= 1.0 - (1.0 - scanline) * intensity;
                    gl_FragColor = color;
                }
            `
        });
    }

    // ============================================
    // COMPOSITE SHADER (Copy)
    // ============================================

    createCompositeShader() {
        this.compositeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                varying vec2 vUv;
                
                void main() {
                    gl_FragColor = texture2D(tDiffuse, vUv);
                }
            `
        });
    }

    // ============================================
    // RENDER FUNCTION
    // ============================================

    render() {
        // Render scene to first render target
        this.renderer.setRenderTarget(this.renderTarget1);
        this.renderer.render(this.scene, this.camera);
        
        let readBuffer = this.renderTarget1;
        let writeBuffer = this.renderTarget2;
        
        // Apply effects in sequence
        if (this.bloom.enabled) {
            this.applyEffect(this.bloomMaterial, readBuffer, writeBuffer);
            [readBuffer, writeBuffer] = [writeBuffer, readBuffer];
        }
        
        if (this.colorGrading.preset !== 'default') {
            this.applyColorGradingPreset(this.colorGrading.preset);
        }
        this.applyEffect(this.colorGradingMaterial, readBuffer, writeBuffer);
        [readBuffer, writeBuffer] = [writeBuffer, readBuffer];
        
        if (this.vignette.enabled) {
            this.applyEffect(this.vignetteMaterial, readBuffer, writeBuffer);
            [readBuffer, writeBuffer] = [writeBuffer, readBuffer];
        }
        
        if (this.chromatic.enabled) {
            this.applyEffect(this.chromaticMaterial, readBuffer, writeBuffer);
            [readBuffer, writeBuffer] = [writeBuffer, readBuffer];
        }
        
        if (this.filmGrain.enabled) {
            this.filmGrainMaterial.uniforms.time.value = performance.now() * 0.001;
            this.applyEffect(this.filmGrainMaterial, readBuffer, writeBuffer);
            [readBuffer, writeBuffer] = [writeBuffer, readBuffer];
        }
        
        if (this.scanlines.enabled) {
            this.applyEffect(this.scanlineMaterial, readBuffer, writeBuffer);
            [readBuffer, writeBuffer] = [writeBuffer, readBuffer];
        }
        
        // Final composite to screen
        this.renderer.setRenderTarget(null);
        this.compositeMaterial.uniforms.tDiffuse.value = readBuffer.texture;
        this.quad.material = this.compositeMaterial;
        this.renderer.render(this.quadScene, this.quadCamera);
    }

    applyEffect(material, readBuffer, writeBuffer) {
        this.renderer.setRenderTarget(writeBuffer);
        material.uniforms.tDiffuse.value = readBuffer.texture;
        this.quad.material = material;
        this.renderer.render(this.quadScene, this.quadCamera);
    }

    // ============================================
    // COLOR GRADING PRESETS
    // ============================================

    applyColorGradingPreset(preset) {
        const presets = {
            default: { brightness: 1.0, contrast: 1.0, saturation: 1.0, hue: 0 },
            cinematic: { brightness: 0.9, contrast: 1.2, saturation: 0.9, hue: -0.02 },
            vibrant: { brightness: 1.1, contrast: 1.15, saturation: 1.3, hue: 0.01 },
            moody: { brightness: 0.8, contrast: 1.3, saturation: 0.7, hue: -0.05 },
            warm: { brightness: 1.05, contrast: 1.1, saturation: 1.1, hue: 0.05 },
            cool: { brightness: 0.95, contrast: 1.1, saturation: 1.05, hue: -0.1 },
            cyberpunk: { brightness: 1.2, contrast: 1.4, saturation: 1.5, hue: 0.15 }
        };
        
        const settings = presets[preset] || presets.default;
        this.colorGradingMaterial.uniforms.brightness.value = settings.brightness;
        this.colorGradingMaterial.uniforms.contrast.value = settings.contrast;
        this.colorGradingMaterial.uniforms.saturation.value = settings.saturation;
        this.colorGradingMaterial.uniforms.hue.value = settings.hue;
    }

    // ============================================
    // PUBLIC CONTROL METHODS
    // ============================================

    setBloom(enabled, strength, threshold) {
        this.bloom.enabled = enabled;
        if (strength !== undefined) {
            this.bloom.strength = strength;
            this.bloomMaterial.uniforms.strength.value = strength;
        }
        if (threshold !== undefined) {
            this.bloom.threshold = threshold;
            this.bloomMaterial.uniforms.threshold.value = threshold;
        }
    }

    setColorGrading(preset) {
        this.colorGrading.preset = preset;
    }

    setVignette(enabled, intensity, smoothness) {
        this.vignette.enabled = enabled;
        if (intensity !== undefined) {
            this.vignette.intensity = intensity;
            this.vignetteMaterial.uniforms.intensity.value = intensity;
        }
        if (smoothness !== undefined) {
            this.vignette.smoothness = smoothness;
            this.vignetteMaterial.uniforms.smoothness.value = smoothness;
        }
    }

    setChromaticAberration(enabled, intensity) {
        this.chromatic.enabled = enabled;
        if (intensity !== undefined) {
            this.chromatic.intensity = intensity;
            this.chromaticMaterial.uniforms.intensity.value = intensity;
        }
    }

    setFilmGrain(enabled, intensity) {
        this.filmGrain.enabled = enabled;
        if (intensity !== undefined) {
            this.filmGrain.intensity = intensity;
            this.filmGrainMaterial.uniforms.intensity.value = intensity;
        }
    }

    setScanlines(enabled, density, intensity) {
        this.scanlines.enabled = enabled;
        if (density !== undefined) {
            this.scanlines.density = density;
            this.scanlineMaterial.uniforms.density.value = density;
        }
        if (intensity !== undefined) {
            this.scanlines.intensity = intensity;
            this.scanlineMaterial.uniforms.intensity.value = intensity;
        }
    }

    // ============================================
    // RESIZE HANDLER
    // ============================================

    setSize(width, height) {
        this.renderTarget1.setSize(width, height);
        this.renderTarget2.setSize(width, height);
        this.scanlineMaterial.uniforms.resolution.value.set(width, height);
    }

    // ============================================
    // CLEANUP
    // ============================================

    dispose() {
        this.renderTarget1.dispose();
        this.renderTarget2.dispose();
        this.bloomMaterial.dispose();
        this.colorGradingMaterial.dispose();
        this.vignetteMaterial.dispose();
        this.chromaticMaterial.dispose();
        this.filmGrainMaterial.dispose();
        this.scanlineMaterial.dispose();
        this.compositeMaterial.dispose();
    }
}

// Export for use in character files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PostProcessing };
}

