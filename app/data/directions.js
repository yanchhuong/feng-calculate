// Compass directions. Language-neutral: labels live in i18n/km.json (dir, dirShort, area).
export const DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
export const ANGLE = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };
export const OPP = { N: "S", S: "N", E: "W", W: "E", NE: "SW", SW: "NE", SE: "NW", NW: "SE" };

// The Later Heaven (後天) trigram that rules each direction (refs.bagua)
export const DIR_TRI = { N: "坎", NE: "艮", E: "震", SE: "巽", S: "離", SW: "坤", W: "兌", NW: "乾" };
