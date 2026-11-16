// Five Element cycles (spec 5.6)
export const PRODUCE = { Wood: "Fire", Fire: "Earth", Earth: "Metal", Metal: "Water", Water: "Wood" };
export const CONTROL = { Wood: "Earth", Earth: "Water", Water: "Fire", Fire: "Metal", Metal: "Wood" };

/** Best to worst, as shown in the colour tiers */
export const TIERS = ["sup", "same", "wealth", "out", "pow"];

const keyOf = (map, v) => Object.keys(map).find((k) => map[k] === v);

/**
 * How each element relates to element E.
 * sup: produces E (best) · same: E (good) · wealth: E controls it (use a little)
 * out: E produces it (draining) · pow: controls E (avoid)
 */
export function relations(E) {
  return {
    sup: keyOf(PRODUCE, E),
    same: E,
    wealth: CONTROL[E],
    out: PRODUCE[E],
    pow: keyOf(CONTROL, E),
  };
}

/** Which tier `other` is for someone of element `userEl`; null when `other` has no element. */
export function relOf(userEl, other) {
  if (!other) return null;
  const r = relations(userEl);
  return TIERS.find((k) => r[k] === other) || null;
}
