(function(){
  function bootRoboxModule() {
    try {
      if (typeof window.registerRoboxRenderer === 'function') {
        window.registerRoboxRenderer(window);
      }
      if (window.RoboxProjectiles?.ensureRoboxProjectiles) {
        window.RoboxProjectiles.ensureRoboxProjectiles(window);
      }
      const controller = window.RoboxController;
      if (!controller) {
        console.warn('[Robox] controller missing');
        return;
      }
      const engine = {
        get state() {
          return window.gameState;
        },
        dispatch(event, detail) {
          try {
            window.dispatchEvent?.(new CustomEvent(event, { detail }));
          } catch (_) {
            /* noop */
          }
        }
      };
      controller.attach(engine);
    } catch (err) {
      console.error('[Robox] failed to boot module', err);
    }
  }

  window.bootRoboxModule = window.bootRoboxModule || bootRoboxModule;
})();
