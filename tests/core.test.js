// Spec section 9 (T1-T16) plus a few guards. Run: npm test  (node --test, no dependencies)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  lichunDay, solarYear, zodIdx, stemEl,
  kuaNumber, kuaGroup, kuaElement,
  centerStar, annualChart, afflictions, personalYear,
  relations, relOf,
  luckyNumbers, cautionNumbers, numberNotes, checkNumber,
  scoreSectors, bestWorst,
  computeReading, validateInput,
} from "../app/core/index.js";

const km = JSON.parse(readFileSync(new URL("../app/i18n/km.json", import.meta.url), "utf8"));
const kuaOf = (y, m, d, g) => kuaNumber(solarYear(y, m, d), g);

test("T1 14/02/1988 male: solar 1988, Kua 3, East, Wood, birth star 3, Dragon", () => {
  const r = computeReading({ dob: "1988-02-14", gender: "m", viewYear: 2026 });
  assert.equal(r.solarYear, 1988);
  assert.equal(r.kua, 3);
  assert.equal(r.group, "east");
  assert.equal(r.el, "Wood");
  assert.equal(r.birthStar, 3);
  assert.equal(r.zod, 4); // 0 Rat, 1 Ox, 2 Tiger, 3 Rabbit, 4 Dragon
  assert.equal(km.zod[r.zod], "រោង");
});

test("T2 14/02/1988 female: Kua 3", () => {
  assert.equal(kuaOf(1988, 2, 14, "f"), 3);
});

test("T3 1990 M/F: Kua 1 / 8", () => {
  assert.equal(kuaNumber(1990, "m"), 1);
  assert.equal(kuaNumber(1990, "f"), 8); // 5 -> 8 for women
});

test("T4 1985 M/F: Kua 6 / 9", () => {
  assert.equal(kuaNumber(1985, "m"), 6);
  assert.equal(kuaNumber(1985, "f"), 9);
});

test("T5 2000 M/F: Kua 9 / 6", () => {
  assert.equal(kuaNumber(2000, "m"), 9);
  assert.equal(kuaNumber(2000, "f"), 6);
});

test("T6 2001 M/F: Kua 8 / 7", () => {
  assert.equal(kuaNumber(2001, "m"), 8);
  assert.equal(kuaNumber(2001, "f"), 7);
});

test("T7 2009 M: Kua 9 (0 -> 9)", () => {
  assert.equal(kuaNumber(2009, "m"), 9);
});

test("T8 02/02/2021 is solar year 2020 (Lichun 2021 = Feb 3)", () => {
  assert.equal(lichunDay(2021), 3);
  assert.equal(solarYear(2021, 2, 2), 2020);
  assert.equal(solarYear(2021, 2, 3), 2021);
});

test("T9 lichunDay(1988) = 4, lichunDay(2026) = 4", () => {
  assert.equal(lichunDay(1988), 4);
  assert.equal(lichunDay(2026), 4);
});

test("T10 centerStar 2024..2027 = 3, 2, 1, 9", () => {
  assert.deepEqual([2024, 2025, 2026, 2027].map(centerStar), [3, 2, 1, 9]);
  assert.equal(centerStar(2043), 2); // end of Period 9 still wraps correctly
});

test("T11 annualChart(2026) = C1 NW2 W3 NE4 S5 N6 SW7 E8 SE9", () => {
  assert.deepEqual(annualChart(2026), { C: 1, NW: 2, W: 3, NE: 4, S: 5, N: 6, SW: 7, E: 8, SE: 9 });
});

test("T12 afflictions 2026 (Horse): Tai Sui S, Sui Po N, Three Killings N", () => {
  assert.equal(zodIdx(2026), 6);
  assert.deepEqual(afflictions(2026), { taiSui: "S", suiPo: "N", threeKillings: "N" });
});

test("T13 relations(Wood)", () => {
  assert.deepEqual(relations("Wood"), { sup: "Water", same: "Wood", wealth: "Earth", out: "Fire", pow: "Metal" });
});

test("T14 Kua 3 numbers: lucky [1,3,4], caution [6,7], with a 4-conflict note", () => {
  const el = kuaElement(3);
  assert.deepEqual(luckyNumbers(el), [1, 3, 4]);
  assert.deepEqual(cautionNumbers(el), [6, 7]);
  const notes = numberNotes(el);
  assert.ok(notes.some((n) => n.type === "four"));
  assert.ok(notes.some((n) => n.type === "universal" && n.nums.includes(6)));
});

test('T15 checkNumber("012 888 369", Wood) -> score 4, great', () => {
  const r = checkNumber("012 888 369", "Wood");
  assert.equal(r.sum, 45);
  assert.equal(r.root, 9);
  assert.equal(r.el, "Fire");
  assert.equal(r.rel, "out");
  assert.equal(r.good, 5);
  assert.equal(r.bad, 0);
  assert.equal(r.last, 9);
  assert.equal(r.score, 4);
  assert.equal(r.verdict, "great");
  assert.equal(km.nums.verdict[r.verdict], "ល្អណាស់");
});

test("T16 stemEl(2026) = Fire (ភ្លើង)", () => {
  assert.equal(stemEl(2026), "Fire");
  assert.equal(km.el[stemEl(2026)], "ភ្លើង");
});

// ---- guards beyond the spec table ----

test("kuaNumber never returns 5, groups split 4/4", () => {
  for (let y = 1901; y <= 2099; y++) {
    for (const g of ["m", "f"]) {
      const k = kuaNumber(y, g);
      assert.ok(k >= 1 && k <= 9 && k !== 5, `${y} ${g} -> ${k}`);
    }
  }
  assert.deepEqual([1, 3, 4, 9].map(kuaGroup), ["east", "east", "east", "east"]);
  assert.deepEqual([2, 6, 7, 8].map(kuaGroup), ["west", "west", "west", "west"]);
});

test("checkNumber edge cases: no digits, sum 0, separators, a 4 penalty", () => {
  assert.equal(checkNumber("", "Wood"), null);
  assert.equal(checkNumber("abc - ", "Wood"), null);
  const zero = checkNumber("0-00", "Wood");
  assert.equal(zero.root, 0);
  assert.equal(zero.el, null);
  assert.equal(zero.rel, null);
  assert.equal(checkNumber("1A-2 3", "Wood").sum, 6);
  const four = checkNumber("44", "Wood"); // root 8 Earth = wealth (+1), two 4s (-3), last 4 (-1)
  assert.equal(four.score, -3);
  assert.equal(four.verdict, "poor");
});

test("relOf maps every element pair to one tier", () => {
  assert.equal(relOf("Wood", "Fire"), "out");
  assert.equal(relOf("Metal", "Fire"), "pow");
  assert.equal(relOf("Water", "Metal"), "sup");
  assert.equal(relOf("Wood", null), null);
});

test("personal year: own and clash", () => {
  assert.equal(personalYear(6, 6), "own");
  assert.equal(personalYear(0, 6), "clash"); // Rat vs Horse
  assert.equal(personalYear(1, 6), null);
});

test("sector scoring: Kua 3 in 2026", () => {
  const rows = scoreSectors(3, 2026);
  const score = Object.fromEntries(rows.map((r) => [r.dir, r.score]));
  // SE: yn(+2) + star 9(+3) = 5 · S: sq(+3) + star 5(-3) - Tai Sui = -1 · N: ty(+2) + 6(+2) - Sui Po - Three Killings = 2
  assert.deepEqual(score, { N: 2, NE: -1, E: 2, SE: 5, S: -1, SW: -3, W: -5, NW: -4 });
  const { best, worst } = bestWorst(rows);
  assert.deepEqual(best.map((r) => r.dir), ["SE"]);
  assert.deepEqual(worst.map((r) => r.dir), ["W", "NW", "SW"]);
});

test("validateInput error keys match km.err", () => {
  assert.equal(validateInput({ dob: "", gender: "m", viewYear: 2026 }), "dob");
  assert.equal(validateInput({ dob: "1899-01-01", gender: "m", viewYear: 2026 }), "dobRange");
  assert.equal(validateInput({ dob: "1990-01-01", gender: "", viewYear: 2026 }), "gender");
  assert.equal(validateInput({ dob: "1990-01-01", gender: "f", viewYear: 2044 }), "viewYear");
  assert.equal(validateInput({ dob: "1990-01-01", gender: "f", viewYear: 2026 }), null);
  for (const k of ["dob", "dobRange", "gender", "viewYear"]) assert.ok(km.err[k], k);
});

test("house: facing N sits S (East group); door star from the year chart", () => {
  const r = computeReading({ dob: "1988-02-14", gender: "m", facing: "N", viewYear: 2026 });
  assert.equal(r.house.sitting, "S");
  assert.equal(r.house.group, "east");
  assert.equal(r.house.compatible, true);
  assert.equal(r.house.doorStar, 6);
  assert.equal(r.house.doorClass, "ty");
});

// ---- Eight Mansions (八宅) tables against the cited sources (app/data/refs.js) ----
import { KUA, ORDER, CLS, KUA_INFO, LUCK_ZH, GROUP_ZH } from "../app/data/kua.js";
import { DIR_TRI } from "../app/data/directions.js";

// refs.youNian: the 大遊年歌 of 八宅明鏡. Each line is a trigram, then its class with the next 7 trigrams in
// 後天 order 乾坎艮震巽離坤兌 (wrapping). Its one-character class names are the ones the app shows (CLS.zh):
// 生=生氣 天=天醫 延=延年 禍=禍害 六=六煞 五=五鬼 絕=絕命, and the trigram itself = 伏位.
// (refs.classes lists the same 64 pairings, but 8 of its entries contradict their own mirror pair, e.g. 艮門巽主 六煞 vs
// 巽門艮主 絕命, so the song is the check.)
const SONG = ["乾六天五禍絕延生", "坎五天生延絕禍六", "艮六絕禍生延天五", "震延生禍絕五天六", "巽天五六禍生絕延", "離六五絕延禍生天", "坤天延絕生禍五六", "兌生禍延絕六五天"];
const SEQ = "乾坎艮震巽離坤兌";
const ABBR = Object.fromEntries(Object.entries(CLS).map(([k, c]) => [c.zh, k]));

test("KUA table matches the 大遊年歌 for all 8 trigrams × 8 directions", () => {
  const kuaOfTri = Object.fromEntries(Object.entries(KUA_INFO).map(([k, v]) => [v.zh, +k]));
  const dirOfTri = Object.fromEntries(Object.entries(DIR_TRI).map(([d, tri]) => [tri, d]));
  let n = 0;
  for (const line of SONG) {
    const own = line[0];
    const kua = kuaOfTri[own];
    assert.equal(KUA[kua].fw, dirOfTri[own], `${own} 伏位`);
    const i = SEQ.indexOf(own);
    for (let j = 1; j <= 7; j++) {
      const other = SEQ[(i + j) % 8];
      const c = ABBR[line[j]];
      assert.equal(KUA[kua][c], dirOfTri[other], `${own}→${other} should be ${CLS[c].zh}`);
    }
    n += 8;
  }
  assert.equal(n, 64);
});

test("each Kua's trigram rules its own 伏位 direction (Later Heaven bagua)", () => {
  for (const k of Object.keys(KUA)) assert.equal(DIR_TRI[KUA[k].fw], KUA_INFO[k].zh, `Kua ${k}`);
});

test("8 classes: one-character names, 九星, ordered best to worst", () => {
  assert.deepEqual(ORDER.map((k) => CLS[k].zh), ["生", "天", "延", "伏", "禍", "六", "五", "絕"]);
  assert.deepEqual(ORDER.map((k) => CLS[k].star), ["貪", "巨", "武", "輔", "祿", "文", "廉", "破"]);
  for (let i = 1; i < ORDER.length; i++) assert.ok(CLS[ORDER[i]].score <= CLS[ORDER[i - 1]].score, ORDER[i]);
  for (const k of ORDER) assert.ok(km.cls[k].name && km.el[CLS[k].starEl], k);
});

test("Chinese labels are one character each (short form, not full names)", () => {
  const labels = [
    ...Object.values(CLS).flatMap((c) => [c.zh, c.star]),
    ...Object.values(KUA_INFO).flatMap((k) => [k.zh, k.nature]),
    ...Object.values(LUCK_ZH),
    ...Object.values(GROUP_ZH),
    ...Object.values(DIR_TRI),
  ];
  for (const s of labels) assert.equal([...s].length, 1, s);
});
