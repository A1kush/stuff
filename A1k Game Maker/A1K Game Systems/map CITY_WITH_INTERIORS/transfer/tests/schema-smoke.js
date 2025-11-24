// Basic schema smoke tests (no external libs)
(function () {
  function assert(name, cond) {
    if (!cond) console.error('[SCHEMA FAIL]', name);
    else console.log('[SCHEMA OK]', name);
  }
  fetch('../manifest.sample.json', { cache: 'no-cache' })
    .then(r => r.json())
    .then(m => {
      assert('manifest is object', typeof m === 'object' && m !== null);
      if (m.player) {
        assert('player has id/x/y', !!m.player.id && Number.isFinite(m.player.x) && Number.isFinite(m.player.y));
      }
      assert('npcs is array', Array.isArray(m.npcs));
      assert('houses is array', Array.isArray(m.houses));
      console.log('[SCHEMA] Completed smoke checks');
    })
    .catch(e => console.error('[SCHEMA ERROR]', e));
})();


