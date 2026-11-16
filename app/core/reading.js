import { KUA, KUA_INFO, EAST_SITTING } from "../data/kua.js";
import { OPP } from "../data/directions.js";
import { lichunDay, solarYear, zodIdx, stemEl } from "./calendar.js";
import { kuaNumber, kuaGroup, kuaElement, directionClasses } from "./kua.js";
import { centerStar, annualChart, afflictions, personalYear } from "./flyingStars.js";
import { scoreSectors, bestWorst } from "./scoring.js";
import { relations, relOf } from "./elements.js";
import { luckyNumbers, cautionNumbers, numberNotes } from "./numbers.js";

export const VIEW_MIN = 2024;
export const VIEW_MAX = 2043; // Period 9: star qualities are only valid inside it

/**
 * @typedef {{ dob: string, gender: "m"|"f"|"", facing?: string, viewYear: number|string }} ReadingInput
 * @returns {null | "dob" | "dobRange" | "gender" | "viewYear"} error key (i18n: err.*)
 */
export function validateInput(v) {
  if (!v.dob) return "dob";
  const p = String(v.dob).split("-").map(Number);
  if (p.length !== 3 || !p[0] || p[0] < 1901 || p[0] > 2099) return "dobRange";
  if (v.gender !== "m" && v.gender !== "f") return "gender";
  const vy = +v.viewYear;
  if (!vy || vy < VIEW_MIN || vy > VIEW_MAX) return "viewYear";
  return null;
}

/** Everything the UI shows, as plain data (no text). Input must pass validateInput. */
export function computeReading({ dob, gender, facing, viewYear }) {
  const [y, m, d] = dob.split("-").map(Number);
  const sy = solarYear(y, m, d);
  const lc = lichunDay(y);
  const kua = kuaNumber(sy, gender);
  const el = kuaElement(kua);
  const group = kuaGroup(kua);
  const classes = directionClasses(kua);
  const pz = zodIdx(sy);

  const vy = +viewYear;
  const chart = annualChart(vy);
  const yz = zodIdx(vy);
  const yel = stemEl(vy);
  const sectors = scoreSectors(kua, vy);

  let house = null;
  if (facing) {
    const sitting = OPP[facing];
    const hGroup = EAST_SITTING.includes(sitting) ? "east" : "west";
    house = {
      facing,
      sitting,
      group: hGroup,
      compatible: hGroup === group,
      doorStar: chart[facing],
      doorClass: classes[facing],
    };
  }

  return {
    birth: { y, m, d },
    solarYear: sy,
    lichun: lc,
    kua,
    trigram: KUA_INFO[kua].tri,
    el,
    group,
    zod: pz,
    zodEl: stemEl(sy),
    birthStar: centerStar(sy),
    dirs: KUA[kua], // class -> direction
    classes, // direction -> class
    flags: {
      beforeLichun: sy !== y,
      onLichun: m === 2 && d === lc,
      lunarCusp: (m === 1 && d >= 21) || (m === 2 && d <= 20),
    },
    view: {
      year: vy,
      lichun: lichunDay(vy),
      center: centerStar(vy),
      chart,
      zod: yz,
      el: yel,
      rel: relOf(el, yel),
      personal: personalYear(pz, yz),
      ...afflictions(vy),
    },
    sectors,
    ...bestWorst(sectors),
    house,
    rel: relations(el),
    lucky: luckyNumbers(el),
    caution: cautionNumbers(el),
    numNotes: numberNotes(el),
  };
}
