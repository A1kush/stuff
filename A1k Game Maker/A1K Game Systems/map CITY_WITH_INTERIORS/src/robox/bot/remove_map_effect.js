/* remove_map_effect.js
 * Hides the Candy minimap marker (and any associated glow) that appears on the minimap.
 * Some builds show a glowing disc or marker near the minimap. To prevent confusion, this
 * script removes that element from the DOM once the page is ready.
 */
(function(){
  function hideMarker(){
    try {
      // Hide and remove the Candy minimap marker if it exists
      const marker = document.getElementById('candyMapMarker');
      if (marker) {
        marker.style.display = 'none';
        marker.remove();
      }
      // If other minimap glow elements are present under miniMapWrap, hide them
      const wrap = document.getElementById('miniMapWrap');
      if (wrap) {
        const glows = wrap.querySelectorAll('[style*="box-shadow"], [style*="background"]');
        glows.forEach(el => {
          // Only hide if the element is small and circular
          const w = parseFloat(el.style.width) || 0;
          const h = parseFloat(el.style.height) || 0;
          if (w <= 20 && h <= 20) {
            el.style.display = 'none';
          }
        });
      }
    } catch(_){}
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideMarker);
  } else {
    hideMarker();
  }
  // Expose for manual calls if needed
  window.A1K_REMOVE_MAP_EFFECT = hideMarker;
})();