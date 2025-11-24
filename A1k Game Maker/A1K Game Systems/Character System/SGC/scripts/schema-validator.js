/*
 * Lightweight hero validator so designers can sanity-check JSON offline
 * without pulling in bulky schema libraries. We validate the essentials the
 * Action Ribbon and economy systems depend on; skipping optional checks keeps
 * bundle size tiny for vanilla canvas deployments.
 */
const HERO_SCHEMA = Object.freeze({
  ranks: ["E", "C", "A", "S", "SS", "SSS", "SSSS"],
  roles: ["support", "striker", "tank", "pet", "hybrid"],
  skillTypes: ["feed", "heal", "attack", "buff", "utility"],
  statKeys: ["attack", "defense", "luck", "support", "speed"]
});

/**
 * Validates a hero entry read from JSON. Returns an array of human-friendly
 * issues so writers can fix mistakes before running canvas demos.
 */
export function validateHero(hero) {
  const issues = [];
  if (!hero || typeof hero !== "object") {
    return ["Hero entry is not an object"];
  }

  if (!/^[a-z0-9-]+$/.test(hero.id || "")) {
    issues.push(`Invalid id for hero '${hero.name || "unknown"}'`);
  }

  if (!HERO_SCHEMA.ranks.includes(hero.rank)) {
    issues.push(`${hero.name} rank must be one of ${HERO_SCHEMA.ranks.join(", ")}`);
  }

  if (!HERO_SCHEMA.roles.includes(hero.role)) {
    issues.push(`${hero.name} role must be one of ${HERO_SCHEMA.roles.join(", ")}`);
  }

  HERO_SCHEMA.statKeys.forEach((key) => {
    const val = hero?.stats?.[key];
    if (typeof val !== "number" || val < 0 || val > 100) {
      issues.push(`${hero.name} stat '${key}' must be 0-100 to keep UI meters predictable.`);
    }
  });

  if (!Array.isArray(hero.skills) || hero.skills.length === 0) {
    issues.push(`${hero.name} needs at least one skill for the Action Ribbon.`);
  } else {
    hero.skills.forEach((skill, idx) => {
      if (!HERO_SCHEMA.skillTypes.includes(skill.type)) {
        issues.push(`${hero.name} skill[${idx}] type '${skill.type}' is invalid.`);
      }
      if (typeof skill.cooldown !== "number" || skill.cooldown < 0) {
        issues.push(`${hero.name} skill '${skill.name}' cooldown must be >= 0.`);
      }
      if (!skill.rationale || skill.rationale.length < 8) {
        issues.push(`${hero.name} skill '${skill.name}' is missing rationale text so future devs know the intent.`);
      }
    });
  }

  if (!hero?.acquisition?.method) {
    issues.push(`${hero.name} acquisition method missing; players need clarity on how they appear.`);
  }

  if (!hero?.visuals?.animation_notes) {
    issues.push(`${hero.name} visuals need animation notes for sprite artists.`);
  }

  return issues;
}

/**
 * Convenience helper for batch validation; useful in build scripts or unit
 * tests. Keeps the API tiny so we can run it directly in the browser console
 * during QA reviews.
 */
export function validateRoster(roster) {
  if (!Array.isArray(roster)) {
    throw new Error("validateRoster expects an array of hero objects");
  }
  return roster.reduce((acc, hero) => {
    const issues = validateHero(hero);
    if (issues.length) {
      acc[hero.id || "unknown"] = issues;
    }
    return acc;
  }, {});
}
