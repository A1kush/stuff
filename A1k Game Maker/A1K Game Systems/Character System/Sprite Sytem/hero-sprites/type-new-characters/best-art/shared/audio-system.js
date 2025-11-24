// ============================================
// AUDIO SYSTEM FOR 3D CHARACTERS
// ============================================

class AudioSystem {
    constructor() {
        this.context = null;
        this.sounds = {};
        this.volume = {
            master: 0.7,
            sfx: 0.8,
            music: 0.5,
            ambient: 0.4
        };
        this.enabled = true;
        this.currentMusic = null;
        
        // Initialize Web Audio API
        this.initAudio();
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    initAudio() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }

    // ============================================
    // SYNTHESIZED SOUND GENERATION
    // ============================================

    // Sword swing sound
    createSwordSwing() {
        if (!this.enabled) return;
        
        const duration = 0.2;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.context.currentTime + duration);
        
        gain.gain.setValueAtTime(this.volume.sfx * this.volume.master * 0.3, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.context.destination);
        
        osc.start(this.context.currentTime);
        osc.stop(this.context.currentTime + duration);
    }

    // Sword impact sound
    createSwordImpact() {
        if (!this.enabled) return;
        
        const duration = 0.15;
        const noise = this.context.createBufferSource();
        const buffer = this.context.createBuffer(1, this.context.sampleRate * duration, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = buffer;
        
        const filter = this.context.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        filter.Q.value = 1;
        
        const gain = this.context.createGain();
        gain.gain.setValueAtTime(this.volume.sfx * this.volume.master * 0.4, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.context.destination);
        
        noise.start(this.context.currentTime);
        noise.stop(this.context.currentTime + duration);
    }

    // Gun shot sound
    createGunShot() {
        if (!this.enabled) return;
        
        const duration = 0.1;
        const noise = this.context.createBufferSource();
        const buffer = this.context.createBuffer(1, this.context.sampleRate * duration, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (buffer.length * 0.3));
        }
        
        noise.buffer = buffer;
        
        const gain = this.context.createGain();
        gain.gain.setValueAtTime(this.volume.sfx * this.volume.master * 0.5, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
        
        noise.connect(gain);
        gain.connect(this.context.destination);
        
        noise.start(this.context.currentTime);
        noise.stop(this.context.currentTime + duration);
    }

    // Energy charge sound
    createEnergyCharge() {
        if (!this.enabled) return;
        
        const duration = 1.0;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.context.currentTime + duration);
        
        gain.gain.setValueAtTime(0, this.context.currentTime);
        gain.gain.linearRampToValueAtTime(this.volume.sfx * this.volume.master * 0.2, this.context.currentTime + 0.1);
        gain.gain.setValueAtTime(this.volume.sfx * this.volume.master * 0.2, this.context.currentTime + duration - 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.context.destination);
        
        osc.start(this.context.currentTime);
        osc.stop(this.context.currentTime + duration);
    }

    // Footstep sound
    createFootstep() {
        if (!this.enabled) return;
        
        const duration = 0.05;
        const noise = this.context.createBufferSource();
        const buffer = this.context.createBuffer(1, this.context.sampleRate * duration, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = buffer;
        
        const filter = this.context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        
        const gain = this.context.createGain();
        gain.gain.setValueAtTime(this.volume.sfx * this.volume.master * 0.15, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.context.destination);
        
        noise.start(this.context.currentTime);
        noise.stop(this.context.currentTime + duration);
    }

    // Jump sound
    createJump() {
        if (!this.enabled) return;
        
        const duration = 0.3;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, this.context.currentTime + duration);
        
        gain.gain.setValueAtTime(this.volume.sfx * this.volume.master * 0.2, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.context.destination);
        
        osc.start(this.context.currentTime);
        osc.stop(this.context.currentTime + duration);
    }

    // Hit/damage sound
    createHitSound() {
        if (!this.enabled) return;
        
        const duration = 0.2;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.context.currentTime + duration);
        
        gain.gain.setValueAtTime(this.volume.sfx * this.volume.master * 0.3, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.context.destination);
        
        osc.start(this.context.currentTime);
        osc.stop(this.context.currentTime + duration);
    }

    // ============================================
    // AMBIENT MUSIC GENERATION
    // ============================================

    startAmbientMusic(theme = 'combat') {
        if (!this.enabled || this.currentMusic) return;
        
        const themes = {
            combat: { freq: 110, tempo: 2 },
            victory: { freq: 220, tempo: 1.5 },
            charge: { freq: 82.4, tempo: 3 }
        };
        
        const config = themes[theme] || themes.combat;
        
        // Create a simple ambient drone
        const osc1 = this.context.createOscillator();
        const osc2 = this.context.createOscillator();
        const gain = this.context.createGain();
        
        osc1.type = 'sine';
        osc1.frequency.value = config.freq;
        
        osc2.type = 'sine';
        osc2.frequency.value = config.freq * 1.5;
        
        gain.gain.value = this.volume.music * this.volume.master * 0.1;
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.context.destination);
        
        osc1.start();
        osc2.start();
        
        this.currentMusic = { osc1, osc2, gain };
    }

    stopAmbientMusic() {
        if (!this.currentMusic) return;
        
        const { osc1, osc2, gain } = this.currentMusic;
        
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 1);
        
        setTimeout(() => {
            osc1.stop();
            osc2.stop();
            this.currentMusic = null;
        }, 1100);
    }

    // ============================================
    // VOLUME CONTROLS
    // ============================================

    setMasterVolume(value) {
        this.volume.master = Math.max(0, Math.min(1, value));
        if (this.currentMusic) {
            this.currentMusic.gain.gain.value = this.volume.music * this.volume.master * 0.1;
        }
    }

    setSFXVolume(value) {
        this.volume.sfx = Math.max(0, Math.min(1, value));
    }

    setMusicVolume(value) {
        this.volume.music = Math.max(0, Math.min(1, value));
        if (this.currentMusic) {
            this.currentMusic.gain.gain.value = this.volume.music * this.volume.master * 0.1;
        }
    }

    // ============================================
    // CHARACTER-SPECIFIC SOUNDS
    // ============================================

    playAnimationSound(animState, character = 'generic') {
        if (!this.enabled) return;
        
        switch(animState) {
            case 'attack':
                if (character === 'a1' || character === 'missy') {
                    this.createSwordSwing();
                    setTimeout(() => this.createSwordImpact(), 200);
                } else if (character === 'unique') {
                    this.createGunShot();
                }
                break;
            case 'walk':
                this.createFootstep();
                break;
            case 'jump':
                this.createJump();
                break;
            case 'hit':
                this.createHitSound();
                break;
            case 'charge':
                this.createEnergyCharge();
                break;
            case 'special1':
            case 'special2':
                this.createSwordSwing();
                setTimeout(() => {
                    for (let i = 0; i < 3; i++) {
                        setTimeout(() => this.createSwordImpact(), i * 100);
                    }
                }, 300);
                break;
        }
    }

    // ============================================
    // ENABLE/DISABLE
    // ============================================

    enable() {
        this.enabled = true;
        if (!this.context) {
            this.initAudio();
        }
    }

    disable() {
        this.enabled = false;
        this.stopAmbientMusic();
    }

    toggle() {
        if (this.enabled) {
            this.disable();
        } else {
            this.enable();
        }
        return this.enabled;
    }
}

// Export for use in character files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioSystem };
}

