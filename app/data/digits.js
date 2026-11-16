// Lo Shu number -> element (spec 5.7). 0 has no element.
export const NUM_EL = [null, "Water", "Earth", "Wood", "Wood", "Earth", "Metal", "Metal", "Earth", "Fire"];

// Traditional tone of each digit 0-9 (spec 6.5): g good, n neutral, b bad. Meanings: i18n/km.json (digit).
export const DIGIT_TONE = ["n", "g", "g", "g", "b", "n", "g", "n", "g", "g"];

// Numbers seen as lucky by nearly everyone (Chinese culture), whatever your element
export const UNIVERSAL_GOOD = [6, 8, 9];
export const UNIVERSAL_BAD = [4];
