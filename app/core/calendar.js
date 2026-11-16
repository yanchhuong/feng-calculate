import { STEM_EL } from "../data/zodiac.js";

/**
 * Day in February of Lichun (start of spring, the feng shui new year).
 * Approximate formula, day-accurate for 1901-2099.
 * TODO (spec backlog): replace with a solar-term table with times for hour precision.
 * @param {number} y
 */
export function lichunDay(y) {
  const Y = y % 100;
  const C = y >= 2000 ? 3.87 : 4.6295;
  return Math.floor(Y * 0.2422 + C) - Math.floor((Y - 1) / 4);
}

/** Feng shui (solar) year of a Gregorian date: before Lichun counts as the previous year. */
export function solarYear(y, m, d) {
  const lc = lichunDay(y);
  return m < 2 || (m === 2 && d < lc) ? y - 1 : y;
}

/** 0 = Rat ... 11 = Pig */
export const zodIdx = (y) => (((y - 4) % 12) + 12) % 12;

/** Element of the year's heavenly stem: "Wood" | "Fire" | "Earth" | "Metal" | "Water" */
export const stemEl = (y) => STEM_EL[(((y - 4) % 10) + 10) % 10];
