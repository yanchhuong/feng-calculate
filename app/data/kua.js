// Eight Mansions (Ba Zhai) tables. Text for each class / trigram lives in i18n/km.json (cls, kua).

// Kua -> direction for each of the 8 classes (spec 6.1)
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

// Best to worst
export const ORDER = ["sq", "ty", "yn", "fw", "hh", "wg", "ls", "jm"];

// tone = chip / compass colour; score = classScore (spec 5.5)
export const CLS = {
  sq: { tone: "g1", score: 3 },
  ty: { tone: "g2", score: 2 },
  yn: { tone: "g2", score: 2 },
  fw: { tone: "g3", score: 1 },
  hh: { tone: "b3", score: -1 },
  wg: { tone: "b2", score: -2 },
  ls: { tone: "b2", score: -2 },
  jm: { tone: "b1", score: -3 },
};

export const KUA_INFO = {
  1: { tri: "☵", el: "Water" },
  2: { tri: "☷", el: "Earth" },
  3: { tri: "☳", el: "Wood" },
  4: { tri: "☴", el: "Wood" },
  6: { tri: "☰", el: "Metal" },
  7: { tri: "☱", el: "Metal" },
  8: { tri: "☶", el: "Earth" },
  9: { tri: "☲", el: "Fire" },
};

export const EAST_KUA = [1, 3, 4, 9];
// A house is East group when it SITS in one of these
export const EAST_SITTING = ["N", "S", "E", "SE"];
