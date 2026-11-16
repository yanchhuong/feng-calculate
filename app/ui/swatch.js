import { ELEM } from "../data/elements.js";
import { t } from "./i18n.js";

const TIER_TONE = { sup: "g1", same: "g2", wealth: "ok", out: "n", pow: "b1" };

/** Chip naming a tier (best, good, wealth, draining, avoid), text from tier.<k>.label */
export const tierChip = (tier) => (tier ? `<span class="chip t-${TIER_TONE[tier]}">${t(`tier.${tier}.label`)}</span>` : "");

const fill = (c) => c.grad || c.hex;

// red "no" badge on avoid chips: the colour stays fully visible, the badge says don't
const BAN = '<b class="ban" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="m6.5 6.5 11 11"/></svg></b>';

/** Paint-chip cards for every colour of an element, all on one row. variant: "lead" | "small" | "avoid" */
export function swatches(el, variant) {
  const badge = variant === "avoid" ? BAN : "";
  const tiles = ELEM[el].colours
    .map((c) => `<span class="sw${c.grad ? " metal" : ""}"><i style="--c:${fill(c)}">${badge}</i><span>${t(`colour.${c.key}`)}</span></span>`)
    .join("");
  return `<div class="swatches${variant ? " " + variant : ""}">${tiles}</div>`;
}

/** Compact dot + name list for one or more elements' colours */
export function dots(els) {
  return (
    '<span class="dots">' +
    els
      .flatMap((el) => ELEM[el].colours)
      .map((c) => `<span class="dot"><i style="--c:${fill(c)}"></i>${t(`colour.${c.key}`)}</span>`)
      .join("") +
    "</span>"
  );
}

/** Outfit bar: base colours wide, accent colours narrow */
export function outfitBar(baseEl, accentEl) {
  const seg = (c, w) => `<i style="flex:${w};--c:${fill(c)}"></i>`;
  let s = ELEM[baseEl].colours.map((c) => seg(c, 3)).join("");
  if (accentEl) s += ELEM[accentEl].colours.map((c) => seg(c, 1)).join("");
  return `<div class="outfit" aria-hidden="true">${s}</div>`;
}

export const tags = (items) => `<span class="tagl">${items.map((x) => `<span class="tag">${x}</span>`).join("")}</span>`;
