import { CLS } from "../data/kua.js";
import { STARS } from "../data/stars.js";
import { DIRS } from "../data/directions.js";
import { directionClasses } from "./kua.js";
import { annualChart, afflictions } from "./flyingStars.js";

/** Personal class × annual star for each of the 8 sectors (spec 5.5) */
export function scoreSectors(kua, year) {
  const cls = directionClasses(kua);
  const chart = annualChart(year);
  const a = afflictions(year);
  return DIRS.map((dir) => {
    const k = cls[dir];
    const st = chart[dir];
    const score =
      CLS[k].score +
      STARS[st].s -
      (dir === a.taiSui ? 1 : 0) -
      (dir === a.suiPo ? 1 : 0) -
      (dir === a.threeKillings ? 1 : 0);
    return { dir, k, st, score };
  });
}

/** best: top 3 with score ≥ 3 (fallback top 2) · worst: bottom 3 with score ≤ −3 (fallback bottom 2) */
export function bestWorst(rows) {
  const sorted = rows.slice().sort((a, b) => b.score - a.score);
  let best = sorted.filter((r) => r.score >= 3).slice(0, 3);
  if (!best.length) best = sorted.slice(0, 2);
  const asc = sorted.slice().reverse();
  let worst = asc.filter((r) => r.score <= -3).slice(0, 3);
  if (!worst.length) worst = asc.slice(0, 2);
  return { best, worst };
}
