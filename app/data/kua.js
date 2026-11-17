// Eight Mansions (八宅 Ba Zhai) tables. Khmer text for each class / trigram lives in i18n/km.json (cls, kua).
// Chinese terms are kept here because they are the same in every UI language. Sources: data/refs.js.

// Kua -> direction for each of the 8 classes (spec 6.1). Checked against the 大遊年歌 (refs.youNian) in tests/core.test.js.
export const KUA = {
  1: { sq: "SE", ty: "E", yn: "S", fw: "N", hh: "W", wg: "NE", ls: "NW", jm: "SW" },
  2: { sq: "NE", ty: "W", yn: "NW", fw: "SW", hh: "E", wg: "SE", ls: "S", jm: "N" },
  3: { sq: "S", ty: "N", yn: "SE", fw: "E", hh: "SW", wg: "NW", ls: "NE", jm: "W" },
  4: { sq: "N", ty: "S", yn: "E", fw: "SE", hh: "NW", wg: "SW", ls: "W", jm: "NE" },
  6: { sq: "W", ty: "NE", yn: "SW", fw: "NW", hh: "SE", wg: "E", ls: "N", jm: "S" },
  7: { sq: "NW", ty: "SW", yn: "NE", fw: "W", hh: "N", wg: "S", ls: "SE", jm: "E" },
  8: { sq: "SW", ty: "NW", yn: "W", fw: "NE", hh: "S", wg: "N", ls: "E", jm: "SE" },
  9: { sq: "E", ty: "SE", yn: "N", fw: "S", hh: "NE", wg: "W", ls: "SW", jm: "NW" },
};

// Best to worst: 生氣 · 天醫 · 延年 · 伏位 · 禍害 · 六煞 · 五鬼 · 絕命 (refs.classes, refs.youNian: 絕命 worst, then 五鬼)
export const ORDER = ["sq", "ty", "yn", "fw", "hh", "ls", "wg", "jm"];

// tone = chip / compass colour; score = classScore (spec 5.5)
// zh = one-character name, as abbreviated in the 大遊年歌 (生 = 生氣 ... 絕 = 絕命) (refs.youNian)
// star / starEl = one-character 九星 (貪 = 貪狼 ...) and that star's element (refs.youNian, refs.fengshui)
export const CLS = {
  sq: { tone: "g1", score: 3, zh: "生", star: "貪", starEl: "Wood" },
  ty: { tone: "g2", score: 2, zh: "天", star: "巨", starEl: "Earth" },
  yn: { tone: "g2", score: 2, zh: "延", star: "武", starEl: "Metal" },
  fw: { tone: "g3", score: 1, zh: "伏", star: "輔", starEl: "Wood" },
  hh: { tone: "b3", score: -1, zh: "禍", star: "祿", starEl: "Earth" },
  ls: { tone: "b2", score: -2, zh: "六", star: "文", starEl: "Water" },
  wg: { tone: "b2", score: -2, zh: "五", star: "廉", starEl: "Fire" },
  jm: { tone: "b1", score: -3, zh: "絕", star: "破", starEl: "Metal" },
};

// the four good (吉) and four bad (凶) directions
export const LUCK_ZH = { good: "吉", bad: "凶" };

// tri = trigram symbol, zh = trigram name, nature = its image (坎水 坤地 震雷 巽風 乾天 兌澤 艮山 離火)
export const KUA_INFO = {
  1: { tri: "☵", zh: "坎", nature: "水", el: "Water" },
  2: { tri: "☷", zh: "坤", nature: "地", el: "Earth" },
  3: { tri: "☳", zh: "震", nature: "雷", el: "Wood" },
  4: { tri: "☴", zh: "巽", nature: "風", el: "Wood" },
  6: { tri: "☰", zh: "乾", nature: "天", el: "Metal" },
  7: { tri: "☱", zh: "兌", nature: "澤", el: "Metal" },
  8: { tri: "☶", zh: "艮", nature: "山", el: "Earth" },
  9: { tri: "☲", zh: "離", nature: "火", el: "Fire" },
};

export const EAST_KUA = [1, 3, 4, 9];
// A house is East group when it SITS in one of these (refs.skinner)
export const EAST_SITTING = ["N", "S", "E", "SE"];

// East / West group, for a person (東四命) and a house (東四宅) alike
export const GROUP_ZH = { east: "東", west: "西" };
