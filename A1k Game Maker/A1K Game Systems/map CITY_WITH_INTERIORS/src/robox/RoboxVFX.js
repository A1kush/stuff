const RoboxVFX = (() => {
  const noop = () => {};
  return {
    emitMuzzleFlash: noop,
    emitDashTrail: noop,
    emitLightningBurst: noop,
    emitFlameRing: noop,
    emitDomainAura: noop,
  };
})();

if (typeof window !== "undefined") {
  window.RoboxVFX = window.RoboxVFX || RoboxVFX;
}
