;(() => {
  const DEFAULTS = {
    autoInit: true,
    debug: false
  };

  const state = {
    initialized: false,
    entitiesById: new Map(),
    overlayEnabled: false,
    options: { ...DEFAULTS },
    projection: null,
    diagnosticsEl: null,
    lastErrors: []
  };

  function log(...args) {
    if (state.options.debug || window.A1K_DEBUG_MODE) {
      console.log('[Transfer]', ...args);
    }
  }

  function warn(...args) {
    if (state.options.debug || window.A1K_DEBUG_MODE) {
      console.warn('[Transfer]', ...args);
    }
  }

  function error(...args) {
    console.error('[Transfer]', ...args);
    try {
      state.lastErrors.push(args.map(String).join(' '));
      if (state.lastErrors.length > 5) state.lastErrors.shift();
      renderDiagnostics();
    } catch (_) {}
  }

  // telemetry
  let telemetry = null;
  function setTelemetry(fn) { telemetry = typeof fn === 'function' ? fn : null; }
  function emitTelemetry(event, payload) {
    try { telemetry && telemetry(event, payload); } catch {}
  }

  function createEl(tag, className, styles = {}) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    Object.assign(el.style, styles);
    return el;
  }

  // i18n
  function t(key) {
    const dict = (window.TransferI18N && window.TransferI18N.dict) || {};
    return dict[key] || key;
  }
  function setLocale(url) {
    return fetch(url, { cache: 'no-cache' })
      .then(r => r.json())
      .then(json => {
        window.TransferI18N = { dict: json };
        // Update dynamic labels
        const closeBtn = document.querySelector('.transfer-interior-close');
        if (closeBtn) closeBtn.textContent = t('close');
        const diag = document.querySelector('.transfer-diagnostics h4');
        if (diag) diag.textContent = t('diagnosticsTitle');
      })
      .catch(e => warn('Failed to load locale', e));
  }

  function ensureDiagnostics() {
    if (state.diagnosticsEl) return state.diagnosticsEl;
    const el = createEl('div', 'transfer-diagnostics');
    const title = createEl('h4');
    title.textContent = t('diagnosticsTitle');
    const body = createEl('div', 'transfer-diagnostics-body');
    el.appendChild(title);
    el.appendChild(body);
    el.style.display = 'none';
    document.body.appendChild(el);
    state.diagnosticsEl = el;
    renderDiagnostics();
    return el;
  }

  function renderDiagnostics() {
    if (!state.diagnosticsEl) return;
    const body = state.diagnosticsEl.querySelector('.transfer-diagnostics-body');
    const info = [
      `entities: ${state.entitiesById.size}`,
      `errors: ${state.lastErrors.length ? state.lastErrors[state.lastErrors.length - 1] : 'none'}`
    ].join('\n');
    body.textContent = info;
  }

  function toggleDiagnostics(show) {
    const el = ensureDiagnostics();
    el.style.display = show ? 'block' : 'none';
  }

  function ensureRoot() {
    let root = document.querySelector('[data-transfer-root]');
    if (!root) {
      root = createEl('div', 'transfer-root', {
        position: 'absolute',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      });
      root.setAttribute('data-transfer-root', 'true');
      document.body.appendChild(root);
    }
    return root;
  }

  function ensureInteriorOverlay() {
    let overlay = document.querySelector('[data-transfer-interior-overlay]');
    if (!overlay) {
      overlay = createEl('div', 'transfer-interior-overlay', {
        position: 'fixed',
        left: '0',
        top: '0',
        width: '100vw',
        height: '100vh',
        background: 'rgba(6, 12, 18, 0.88)',
        backdropFilter: 'blur(2px)',
        zIndex: '4000',
        display: 'none'
      });
      overlay.setAttribute('data-transfer-interior-overlay', 'true');
      const inner = createEl('div', 'transfer-interior-root', {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80vw',
        height: '80vh',
        border: '1px solid rgba(94,234,212,0.3)',
        borderRadius: '8px',
        background: 'rgba(10, 16, 24, 0.9)',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
      });
      inner.setAttribute('data-transfer-interior-root', 'true');
      const closeBtn = createEl('button', 'transfer-interior-close', {
        position: 'absolute',
        right: '10px',
        top: '10px',
        padding: '6px 10px',
        cursor: 'pointer',
        borderRadius: '6px',
        border: '1px solid rgba(148,163,184,0.4)',
        background: 'rgba(17, 24, 39, 0.9)',
        color: '#e5e7eb',
        pointerEvents: 'auto'
      });
      closeBtn.textContent = t('close');
      closeBtn.addEventListener('click', () => closeInterior());
      overlay.appendChild(inner);
      overlay.appendChild(closeBtn);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeInterior();
      });
      // esc to close and simple focus trap
      overlay.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeInterior();
        } else if (e.key === 'Tab') {
          const focusables = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (focusables.length) {
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      });
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function getInteriorRoot() {
    let root = document.querySelector('[data-transfer-interior-root]');
    return root || ensureInteriorOverlay().querySelector('[data-transfer-interior-root]');
  }

  function projectToScreen(x, y) {
    // Pluggable projection; default is identity mapping to screen space.
    if (typeof state.projection === 'function') {
      try {
        const res = state.projection(x, y);
        if (res && Number.isFinite(res.sx) && Number.isFinite(res.sy)) return res;
      } catch (e) {
        warn('Projection function threw; falling back to identity.', e);
      }
    }
    return { sx: x, sy: y };
  }

  function setProjection(fn) {
    if (typeof fn === 'function') {
      state.projection = fn;
      log('Custom projection set.');
    } else {
      state.projection = null;
      log('Projection cleared (identity).');
    }
  }
  function setTheme(theme) {
    const root = document.documentElement;
    if (theme === 'light' || theme === 'dark') {
      root.setAttribute('data-transfer-theme', theme);
      try { localStorage.setItem('transfer.theme', theme); } catch {}
    } else {
      root.removeAttribute('data-transfer-theme');
    }
  }

  function addEntityBase(kind, def, targetRoot) {
    if (!def || !def.id) throw new Error('Entity must have an id');
    if (state.entitiesById.has(def.id)) {
      remove(def.id);
    }
    const root = targetRoot || ensureRoot();
    const container = createEl('div', `transfer-entity transfer-${kind}`, {
      position: 'absolute',
      pointerEvents: 'auto'
    });
    container.dataset.transferId = def.id;
    container.dataset.transferKind = kind;
    // layering and grouping
    if (def.layer !== undefined) container.style.zIndex = String(def.layer);
    if (def.group) container.dataset.transferGroup = String(def.group);
    // Hitbox sizing (optional)
    const hbw = Number(def.hitboxWidth);
    const hbh = Number(def.hitboxHeight);
    if (Number.isFinite(hbw) && hbw > 0) container.style.width = hbw + 'px';
    if (Number.isFinite(hbh) && hbh > 0) container.style.height = hbh + 'px';
    // Hover classes
    container.addEventListener('pointerenter', () => container.classList.add('is-hovered'));
    container.addEventListener('pointerleave', () => container.classList.remove('is-hovered'));
    root.appendChild(container);

    const entity = { id: def.id, kind, container, def: { ...def } };
    state.entitiesById.set(def.id, entity);
    updateEntityPosition(entity);
    if (state.overlayEnabled) applyOverlay(entity);
    return entity;
  }

  function updateEntityPosition(entity) {
    const { x = 0, y = 0 } = entity.def;
    const { sx, sy } = projectToScreen(x, y);
    entity.container.style.transform = `translate(${sx}px, ${sy}px)`;
  }
  // rAF batching
  const dirtyEntities = new Set();
  let rafScheduled = false;
  function markDirty(entity) {
    dirtyEntities.add(entity);
    if (!rafScheduled) {
      rafScheduled = true;
      requestAnimationFrame(flush);
    }
  }
  function flush() {
    dirtyEntities.forEach(e => updateEntityPosition(e));
    dirtyEntities.clear();
    rafScheduled = false;
  }
  function updateEntity(id, partialDef = {}) {
    const e = state.entitiesById.get(id);
    if (!e) return false;
    Object.assign(e.def, partialDef);
    markDirty(e);
    return true;
  }

  function applyOverlay(entity) {
    let label = entity.container.querySelector('.transfer-label');
    if (!label) {
      label = createEl('div', 'transfer-label');
      entity.container.appendChild(label);
    }
    label.textContent = `${entity.kind}:${entity.id}`;
  }

  function clearOverlay(entity) {
    const label = entity.container.querySelector('.transfer-label');
    if (label) label.remove();
  }

  function addPlayer(def, internal = {}) {
    const entity = addEntityBase('player', def, internal.targetRoot);
    const sprite = createEl('img', 'transfer-sprite', {
      width: '32px',
      height: '32px',
      imageRendering: 'pixelated'
    });
    sprite.alt = def.id;
    if (def.sprite) sprite.src = def.sprite;
    entity.container.appendChild(sprite);
    return entity.id;
  }

  function addNPC(def, internal = {}) {
    const entity = addEntityBase('npc', def, internal.targetRoot);
    const sprite = createEl('img', 'transfer-sprite', {
      width: '32px',
      height: '32px',
      imageRendering: 'pixelated'
    });
    sprite.alt = def.name || def.id;
    if (def.sprite) sprite.src = def.sprite;
    entity.container.appendChild(sprite);
    if (def.animation === 'bob') {
      sprite.classList.add('animate-bob');
    }
    // A11y
    entity.container.setAttribute('role', 'button');
    entity.container.setAttribute('tabindex', '0');
    entity.container.setAttribute('aria-label', def.name ? `NPC ${def.name}` : `NPC ${def.id}`);
    entity.container.addEventListener('focus', () => entity.container.classList.add('is-focused'));
    entity.container.addEventListener('blur', () => entity.container.classList.remove('is-focused'));
    entity.container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Placeholder for interaction hook
        log('NPC interaction', def.id);
        dispatchEvent(new CustomEvent('transfer:npcInteract', { detail: { id: def.id, def: { ...def } } }));
        emitTelemetry('npcInteract', { id: def.id });
      }
    });
    if (def.name || def.dialogue) {
      const meta = createEl('div', 'transfer-meta');
      if (def.name) {
        const nameEl = createEl('div', 'transfer-name');
        nameEl.textContent = def.name;
        meta.appendChild(nameEl);
      }
      if (def.dialogue) {
        const dlgEl = createEl('div', 'transfer-dialogue');
        dlgEl.textContent = def.dialogue;
        meta.appendChild(dlgEl);
      }
      entity.container.appendChild(meta);
    }
    return entity.id;
  }

  function addHouse(def, internal = {}) {
    const entity = addEntityBase('house', def, internal.targetRoot);
    const box = createEl('div', 'transfer-house', {
      width: (def.width || 64) + 'px',
      height: (def.height || 64) + 'px',
      background: 'rgba(200,200,255,0.08)',
      border: '1px solid rgba(180,180,255,0.3)',
      borderRadius: '6px'
    });
    if (def.label) {
      const label = createEl('div', 'transfer-house-label');
      label.textContent = def.label;
      box.appendChild(label);
    }
    entity.container.appendChild(box);
    // Interior support
    if (def.interiorManifest) {
      entity.container.style.cursor = 'pointer';
      entity.container.setAttribute('role', 'button');
      entity.container.setAttribute('tabindex', '0');
      entity.container.setAttribute('aria-label', def.label ? `Enter ${def.label}` : `Enter house ${def.id}`);
      entity.container.addEventListener('focus', () => entity.container.classList.add('is-focused'));
      entity.container.addEventListener('blur', () => entity.container.classList.remove('is-focused'));
      entity.container.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatchEvent(new CustomEvent('transfer:enterHouse', { detail: { id: def.id, label: def.label || null } }));
        emitTelemetry('enterHouse', { id: def.id });
        await openInterior(def.interiorManifest);
      });
      entity.container.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          await openInterior(def.interiorManifest);
        }
      });
    }
    return entity.id;
  }

  function remove(id) {
    const entity = state.entitiesById.get(id);
    if (!entity) return false;
    entity.container.remove();
    state.entitiesById.delete(id);
    return true;
  }

  function get(id) {
    return state.entitiesById.get(id) || null;
  }

  function list() {
    return Array.from(state.entitiesById.values()).map(e => ({
      id: e.id,
      kind: e.kind,
      def: { ...e.def }
    }));
  }
  function setGroupVisible(group, visible) {
    const nodes = document.querySelectorAll(`.transfer-entity[data-transfer-group="${group}"]`);
    nodes.forEach(n => n.style.display = visible ? '' : 'none');
  }

  // Collision & Nav hooks
  let collisionRects = [];
  function setCollisionRects(rects) {
    if (Array.isArray(rects)) collisionRects = rects.slice();
  }
  function getCollisionRects() { return collisionRects.slice(); }
  let navProject = null;
  function setNavProjector(fn) { navProject = typeof fn === 'function' ? fn : null; }
  function projectForNav(x, y) {
    if (navProject) return navProject(x, y);
    return { x, y };
  }

  function toggleOverlay(show) {
    state.overlayEnabled = !!show;
    state.entitiesById.forEach(entity => {
      if (state.overlayEnabled) applyOverlay(entity);
      else clearOverlay(entity);
    });
  }

  function parseNumber(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
    }

  function buildFromAttributes(root = document) {
    const nodes = root.querySelectorAll('[data-transfer]');
    nodes.forEach(node => {
      const kind = node.getAttribute('data-transfer');
      const id = node.getAttribute('data-id') || crypto.randomUUID();
      const x = parseNumber(node.getAttribute('data-x'), 0);
      const y = parseNumber(node.getAttribute('data-y'), 0);
      const sprite = node.getAttribute('data-sprite') || '';
      if (kind === 'player') {
        addPlayer({ id, x, y, sprite, speed: parseNumber(node.getAttribute('data-speed'), 2),
          hitboxWidth: parseNumber(node.getAttribute('data-hitbox-width'), undefined),
          hitboxHeight: parseNumber(node.getAttribute('data-hitbox-height'), undefined)
        });
      } else if (kind === 'npc') {
        addNPC({
          id, x, y, sprite,
          name: node.getAttribute('data-name') || '',
          dialogue: node.getAttribute('data-dialogue') || '',
          hitboxWidth: parseNumber(node.getAttribute('data-hitbox-width'), undefined),
          hitboxHeight: parseNumber(node.getAttribute('data-hitbox-height'), undefined)
        });
      } else if (kind === 'house') {
        const houseDef = {
          id, x, y,
          width: parseNumber(node.getAttribute('data-width'), 64),
          height: parseNumber(node.getAttribute('data-height'), 64),
          label: node.getAttribute('data-label') || '',
          hitboxWidth: parseNumber(node.getAttribute('data-hitbox-width'), undefined),
          hitboxHeight: parseNumber(node.getAttribute('data-hitbox-height'), undefined)
        };
        const interiorManifest = node.getAttribute('data-interior-manifest');
        if (interiorManifest) {
          houseDef.interiorManifest = interiorManifest;
        }
        addHouse(houseDef);
      }
    });
  }

  async function buildFromManifestHooks(root = document, targetRoot) {
    const hooks = root.querySelectorAll('[data-transfer-manifest]');
    for (const hook of hooks) {
      const url = hook.getAttribute('data-transfer-manifest');
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        const json = await res.json();
        if (validateManifest(json)) {
          ingestManifest(json, targetRoot);
        }
      } catch (e) {
        console.error('[Transfer] Failed to load manifest:', url, e);
      }
    }
  }

  function ingestManifest(manifest, targetRoot) {
    const basePath = manifest && manifest.basePath ? String(manifest.basePath).replace(/\/+$/, '') : '';
    const resolve = (p) => (p && !/^https?:\/\//i.test(p) && basePath ? `${basePath}/${p.replace(/^\/+/, '')}` : p);
    const { player, npcs = [], houses = [] } = manifest || {};
    if (player) addPlayer({ ...player, sprite: resolve(player.sprite) }, { targetRoot });
    for (const npc of npcs) addNPC({ ...npc, sprite: resolve(npc.sprite) }, { targetRoot });
    for (const house of houses) addHouse({ ...house, interiorManifest: resolve(house.interiorManifest) }, { targetRoot });
  // Collision rects
  if (Array.isArray(manifest.collisionRects)) {
    setCollisionRects(manifest.collisionRects);
  }
  }

  // Lightweight validator based on schema expectations (no external deps)
  function validateManifest(manifest) {
    if (!manifest || typeof manifest !== 'object') {
      error('Manifest is not an object.');
      return false;
    }
    const checkEntity = (e, required = ['id', 'x', 'y']) => {
      for (const k of required) {
        if (!(k in e)) {
          error(`Entity missing required "${k}"`, e);
          return false;
        }
      }
      return true;
    };
    if (manifest.player && manifest.player !== null) {
      if (!checkEntity(manifest.player)) return false;
    }
    if (manifest.npcs) {
      if (!Array.isArray(manifest.npcs)) {
        error('npcs must be an array.');
        return false;
      }
      for (const n of manifest.npcs) {
        if (!checkEntity(n)) return false;
      }
    }
    if (manifest.houses) {
      if (!Array.isArray(manifest.houses)) {
        error('houses must be an array.');
        return false;
      }
      for (const h of manifest.houses) {
        if (!checkEntity(h)) return false;
      }
    }
    return true;
  }

  async function init(options = {}) {
    if (state.initialized) return;
    state.options = { ...DEFAULTS, ...options };
  try {
    const savedTheme = localStorage.getItem('transfer.theme');
    if (savedTheme) setTheme(savedTheme);
  } catch {}
    state.initialized = true;
    log('Initializing with options', state.options);
    // Build entities from either manifest hooks or declarative attributes
    await buildFromManifestHooks(document);
    buildFromAttributes(document);
    // Auto overlay in debug/dev
    if (state.options.debug || window.A1K_DEBUG_MODE) toggleOverlay(true);
  }

  async function openInterior(manifestUrlOrObject) {
    const overlay = ensureInteriorOverlay();
    const root = getInteriorRoot();
    // Clear previous
    while (root.firstChild) root.removeChild(root.firstChild);
    overlay.style.display = 'block';
    let manifest = null;
    try {
      if (typeof manifestUrlOrObject === 'string') {
        const res = await fetch(manifestUrlOrObject, { cache: 'no-cache' });
        manifest = await res.json();
      } else {
        manifest = manifestUrlOrObject;
      }
      ingestManifest(manifest, root);
    } catch (e) {
      console.error('[Transfer] Failed to open interior:', e);
    }
  }

  function closeInterior() {
    const overlay = ensureInteriorOverlay();
    overlay.style.display = 'none';
    const root = getInteriorRoot();
    while (root.firstChild) root.removeChild(root.firstChild);
  }

  // Auto-init if data-autoinit present or default autoInit is true and DOM is ready
  function maybeAutoInitWhenReady() {
    const hasAutoInitHook = !!document.querySelector('[data-autoinit="true"]');
    if (state.options.autoInit || hasAutoInitHook) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => init().catch(console.error));
      } else {
        init().catch(console.error);
      }
    }
  }

  // Public API
  const api = {
    init,
    addPlayer,
    addNPC,
    addHouse,
    updateEntity,
    remove,
    get,
    list,
    setGroupVisible,
    setCollisionRects,
    getCollisionRects,
    setNavProjector,
    projectForNav,
    toggleOverlay,
    openInterior,
    closeInterior,
    setProjection,
    setTheme,
    setLocale,
    setTelemetry
  };

  // Expose
  window.Transfer = window.Transfer || api;
  window.Transfer.version = '1.0.0';
  // Read data attributes for default behavior and attempt auto init
  maybeAutoInitWhenReady();
})();


