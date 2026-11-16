import { KUA, ORDER, KUA_INFO, EAST_KUA } from "../data/kua.js";
import { digitRoot } from "./numbers.js";

/** Kua (Gua) number from the SOLAR birth year (spec 5.2). Never returns 5. */
export function kuaNumber(solarY, g) {
  const n = digitRoot(solarY % 100);
  let k = solarY < 2000 ? (g === "m" ? 10 - n : 5 + n) : g === "m" ? 9 - n : 6 + n;
  if (k === 0) k = 9;
  k = digitRoot(k);
  if (k === 5) k = g === "m" ? 2 : 8;
  return k;
}

/** "east" for 1, 3, 4, 9 · "west" for 2, 6, 7, 8 */
export const kuaGroup = (k) => (EAST_KUA.includes(k) ? "east" : "west");

export const kuaElement = (k) => KUA_INFO[k].el;

/** direction -> class key (sq, ty, ... jm) for a Kua */
export function directionClasses(k) {
  const m = {};
  for (const c of ORDER) m[KUA[k][c]] = c;
  return m;
}
