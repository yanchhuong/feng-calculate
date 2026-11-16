// Indexed by heavenly stem ((y - 4) % 10)
export const STEM_EL = ["Wood", "Wood", "Fire", "Fire", "Earth", "Earth", "Metal", "Metal", "Water", "Water"];

// Indexed by zodiac ((y - 4) % 12): 0 Rat ... 11 Pig. Animal names live in i18n/km.json (zod).
export const TAISUI = ["N", "NE", "NE", "E", "SE", "SE", "S", "SW", "SW", "W", "NW", "NW"];

// Pig/Rabbit/Goat -> W | Tiger/Horse/Dog -> N | Snake/Rooster/Ox -> E | Monkey/Rat/Dragon -> S
export const THREE_KILLINGS = ["S", "E", "N", "W", "S", "E", "N", "W", "S", "E", "N", "W"];
