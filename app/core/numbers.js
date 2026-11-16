import { NUM_EL, DIGIT_TONE, UNIVERSAL_GOOD, UNIVERSAL_BAD } from "../data/digits.js";
import { relations, relOf } from "./elements.js";

/** Repeated digit sum until one digit (0 stays 0). */
export function digitRoot(n) {
  while (n > 9) n = [...String(n)].reduce((a, c) => a + +c, 0);
  return n;
}

/** Lo Shu numbers 1-9 belonging to an element */
export const numsOf = (el) => [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => NUM_EL[n] === el);

/** Numbers of your supporting element and your own element (spec 5.7) */
export function luckyNumbers(el) {
  const r = relations(el);
  return [...numsOf(r.sup), ...numsOf(r.same)].sort((a, b) => a - b);
}

/** Numbers of the element that controls yours */
export const cautionNumbers = (el) => numsOf(relations(el).pow);

/**
 * Conflicts between personal and cultural meaning.
 * - "universal": a caution number everyone else calls lucky (6, 8, 9)
 * - "four": 4 is personally lucky (Wood/Fire people) but culturally avoided
 */
export function numberNotes(el) {
  const notes = [];
  const ug = cautionNumbers(el).filter((n) => UNIVERSAL_GOOD.includes(n));
  if (ug.length) notes.push({ type: "universal", nums: ug });
  if (luckyNumbers(el).includes(4)) notes.push({ type: "four" });
  return notes;
}

const REL_SCORE = { sup: 3, same: 2, wealth: 1, out: 0, pow: -2 };

/** Score -> verdict key: ≥4 great | ≥2 good | ≥0 fair | <0 poor */
export const verdictOf = (s) => (s >= 4 ? "great" : s >= 2 ? "good" : s >= 0 ? "fair" : "poor");

/**
 * Rate any number (phone, plate, house) for someone of element `userEl` (spec 5.8).
 * Only digits count; spaces, dashes and letters are ignored. Returns null when there are no digits.
 */
export function checkNumber(raw, userEl) {
  const ds = (String(raw ?? "").match(/\d/g) || []).map(Number);
  if (!ds.length) return null;
  const sum = ds.reduce((a, b) => a + b, 0);
  const root = sum === 0 ? 0 : sum % 9 === 0 ? 9 : sum % 9;
  const el = NUM_EL[root];
  const rel = relOf(userEl, el);
  const count = (d) => ds.filter((x) => x === d).length;
  const good = UNIVERSAL_GOOD.reduce((a, d) => a + count(d), 0);
  const bad = UNIVERSAL_BAD.reduce((a, d) => a + count(d), 0);
  const last = ds[ds.length - 1];
  const tone = DIGIT_TONE[last];
  const score =
    (rel ? REL_SCORE[rel] : 0) + Math.min(good, 3) - bad * 1.5 + (tone === "g" ? 1 : tone === "b" ? -1 : 0);
  return { digits: ds, sum, root, el, rel, good, bad, last, score, verdict: verdictOf(score) };
}
