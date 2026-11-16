import { TIERS } from "../../core/index.js";
import { t, tv } from "../i18n.js";
import { sec } from "../fold.js";
import { swatches, dots, outfitBar, tierChip, tags } from "../swatch.js";

const VARIANT = { sup: "lead", same: "", wealth: "small", out: "small", pow: "avoid" };

// base / accent tier per occasion (spec 7, occasion rules)
const OCCASIONS = [
  { key: "work", base: "sup", accent: "same" },
  { key: "deal", base: "sup", accent: "wealth", small: true },
  { key: "rest", base: "sup", accent: null },
  { key: "date", base: "same", accent: "out" },
];

const ATTRS = ["fabrics", "shapes", "patterns", "accessories"];
const ATTR_TIERS = ["sup", "same", "pow"];

/** 7. Colours and clothing: year note, 5 tiers, occasions, fabrics/shapes/patterns/accessories, wallet & phone */
export function coloursSection(r) {
  const rel = r.rel;
  const el = (k) => t(`el.${k}`);
  const elVars = { el: el(r.el), sup: el(rel.sup), same: el(rel.same), wealth: el(rel.wealth), out: el(rel.out), pow: el(rel.pow) };

  let b = `<p class="sub">${t("colors.sub", elVars)}</p>`;
  b += `<div class="note${r.view.rel === "pow" || r.view.rel === "out" ? " warn" : ""}">${t(`colors.yearNote.${r.view.rel}`, { ...elVars, year: r.view.year, yel: el(r.view.el) })}</div>`;

  // five tiers
  b += `<h3 class="subh">${t("colors.paletteH")}</h3><div class="palette">`;
  for (const k of TIERS) {
    b += `<div><p class="pal-h">${tierChip(k)}<b>${el(rel[k])}</b><small>${t(`tier.${k}.why`, { x: el(rel[k]), el: el(r.el) })}</small></p>`;
    b += swatches(rel[k], VARIANT[k]) + "</div>";
  }
  b += "</div>";

  // occasions
  b += `<h3 class="subh">${t("colors.occH")}</h3><div class="occs">`;
  for (const o of OCCASIONS) {
    const accentEl = o.accent ? rel[o.accent] : null;
    b += `<div class="card occ"><h4>${t(`colors.occ.${o.key}.name`)}</h4>`;
    b += outfitBar(rel[o.base], accentEl);
    b += `<dl><dt>${t("colors.base")} ${tierChip(o.base)}</dt><dd>${dots([rel[o.base]])}</dd>`;
    b += `<dt>${t(o.small ? "colors.accentSmall" : "colors.accent")} ${o.accent ? tierChip(o.accent) : ""}</dt>`;
    b += `<dd>${accentEl ? dots([accentEl]) : `<span class="muted">${t("colors.noAccent")}</span>`}</dd></dl>`;
    b += `<p class="tip">${t(`colors.occ.${o.key}.tip`, elVars)}</p></div>`;
  }
  b += "</div>";

  // fabrics, shapes, patterns, accessories
  b += `<h3 class="subh">${t("colors.attrH")}</h3>`;
  b += '<div class="tablewrap"><table class="attrs"><thead><tr><th></th>';
  for (const k of ATTR_TIERS) b += `<th>${t("colors.thTier", { tier: t(`tier.${k}.label`), el: el(rel[k]) })}</th>`;
  b += "</tr></thead><tbody>";
  for (const a of ATTRS) {
    b += `<tr><th scope="row">${t(`colors.attr.${a}`)}</th>`;
    for (const k of ATTR_TIERS) b += `<td class="${k === "pow" ? "dim" : ""}">${tags(tv(`elem.${rel[k]}.${a}`))}</td>`;
    b += "</tr>";
  }
  b += "</tbody></table></div>";

  // wallet and phone
  b += `<h3 class="subh">${t("colors.carryH")}</h3><div class="twocol carry">`;
  b += `<div class="card"><h4>${t("colors.wallet")}</h4>${dots([rel.wealth, rel.sup])}<p class="tip">${t("colors.walletTip", elVars)}</p></div>`;
  b += `<div class="card"><h4>${t("colors.phone")}</h4>${dots([rel.sup, rel.same])}<p class="tip">${t("colors.phoneTip", elVars)}</p></div>`;
  b += "</div>";

  return sec("colors", t("sec.colors"), b);
}
