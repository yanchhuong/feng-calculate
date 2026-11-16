import { TAISUI, THREE_KILLINGS } from "../data/zodiac.js";
import { OPP } from "../data/directions.js";
import { zodIdx } from "./calendar.js";

/** Flight path of the annual stars through the Lo Shu grid */
export const PATH = ["C", "NW", "W", "NE", "S", "N", "SW", "E", "SE"];

/** Star in the centre for a solar year (2024 = 3, counting down) */
export const centerStar = (y) => ((((3 - (y - 2024)) % 9) + 9 - 1) % 9) + 1;

/** { C, NW, W, NE, S, N, SW, E, SE } -> star number */
export function annualChart(y) {
  const c = centerStar(y);
  return Object.fromEntries(PATH.map((s, i) => [s, ((c - 1 + i) % 9) + 1]));
}

/** Tai Sui, Sui Po (its opposite) and Three Killings directions for a year */
export function afflictions(y) {
  const z = zodIdx(y);
  const taiSui = TAISUI[z];
  return { taiSui, suiPo: OPP[taiSui], threeKillings: THREE_KILLINGS[z] };
}

/** "own" in your own zodiac year, "clash" in the opposite one, else null */
export function personalYear(personZod, yearZod) {
  if (personZod === yearZod) return "own";
  if ((personZod - yearZod + 12) % 12 === 6) return "clash";
  return null;
}
