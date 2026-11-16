// Five Element attributes (spec 6.4). Colour names, fabrics, shapes, patterns, accessories and
// home materials are text, so they live in i18n/km.json (colour, elem). Numbers come from
// data/digits.js NUM_EL so there is one source of truth.
export const ELEMENTS = ["Wood", "Fire", "Earth", "Metal", "Water"];

// `grad` paints metallic swatches so they read as metal rather than mustard or grey.
export const ELEM = {
  Wood: {
    colours: [
      { key: "green", hex: "#2f7a4a" },
      { key: "lightGreen", hex: "#8cbf6a" },
      { key: "teal", hex: "#2f8f86" },
    ],
  },
  Fire: {
    colours: [
      { key: "red", hex: "#b8322a" },
      { key: "orange", hex: "#d9772b" },
      { key: "purple", hex: "#6e3d8f" },
      { key: "pink", hex: "#d97a9c" },
    ],
  },
  Earth: {
    colours: [
      { key: "yellow", hex: "#d9b13b" },
      { key: "brown", hex: "#8a5a33" },
      { key: "sand", hex: "#d8c7a3" },
      { key: "brick", hex: "#b5643b" },
    ],
  },
  Metal: {
    colours: [
      { key: "white", hex: "#f4f4f0", grad: "linear-gradient(135deg,#ffffff 0%,#fbfbf8 45%,#e9e9e2 100%)" },
      { key: "gold", hex: "#c9a23f", grad: "linear-gradient(135deg,#f6e3a0 0%,#dcb755 28%,#bd922f 52%,#d4ac48 74%,#f1da8f 100%)" },
      { key: "silver", hex: "#b9bec4", grad: "linear-gradient(135deg,#f6f7f9 0%,#d9dde1 28%,#b4bac1 52%,#cdd1d6 74%,#f0f2f4 100%)" },
      { key: "grey", hex: "#7d8288" },
    ],
  },
  Water: {
    colours: [
      { key: "black", hex: "#1d1d1d" },
      { key: "navy", hex: "#1f3f73" },
      { key: "blue", hex: "#2d5f9e" },
    ],
  },
};
