/*
 * Deterministic RNG helper so QA can replay rare spawns offline. Based on the
 * mulberry32/xmur3 combo (public domain) but wrapped for clarity.
 */
function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRNG(seed = "sgc-default") {
  const seedFn = xmur3(seed);
  const rng = mulberry32(seedFn());
  return {
    next: () => rng(),
    range(min = 0, max = 1) {
      return min + (max - min) * rng();
    },
    pick(array) {
      if (!array.length) return undefined;
      const idx = Math.floor(rng() * array.length);
      return array[idx];
    }
  };
}
