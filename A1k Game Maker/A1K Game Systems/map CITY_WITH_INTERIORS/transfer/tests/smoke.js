// Simple sanity checks
(function () {
  function assert(name, cond) {
    if (!cond) console.error('[SMOKE FAIL]', name);
    else console.log('[SMOKE OK]', name);
  }
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      assert('Transfer API present', !!window.Transfer);
      const list = window.Transfer.list ? window.Transfer.list() : [];
      assert('Entities exist after init', Array.isArray(list) && list.length >= 1);
      window.Transfer.toggleOverlay(true);
      window.Transfer.setTheme('dark');
      window.Transfer.setLocale && window.Transfer.setLocale('../i18n/en.json');
    }, 200);
  });
})(); 


