import { t, tv, orList } from "../i18n.js";
import { sec } from "../fold.js";
import { tierChip, tags } from "../swatch.js";

const MAT_TIERS = ["sup", "same", "wealth", "pow"];

/** 8. Home and office materials: use a lot / use / use a little / reduce, linked to your sq and ty directions */
export function materialsSection(r) {
  const rel = r.rel;
  const el = (k) => t(`el.${k}`);

  let b = `<p class="sub">${t("mats.sub", { el: el(r.el) })}</p><div class="mats">`;
  for (const k of MAT_TIERS) {
    const e = rel[k];
    b += `<div class="card mat mat-${k}"><h3>${t(`mats.tier.${k}`)}</h3>`;
    b += `<p class="mat-el">${tierChip(k)} ${t("mats.elOf", { el: el(e) })}</p>`;
    b += tags(tv(`elem.${e}.home`));
    b += `<p class="mat-sh">${t("mats.shapes", { shapes: tv(`elem.${e}.shapes`).join(" ") })}</p></div>`;
  }
  b += "</div>";

  b += '<div class="notes">';
  b += `<div class="note">${t("mats.link", { mats: orList(tv(`elem.${rel.sup}.home`)), sq: t(`dir.${r.dirs.sq}`), ty: t(`dir.${r.dirs.ty}`) })}`;
  b += ` ${t("mats.linkReduce", { mats: orList(tv(`elem.${rel.pow}.home`)) })}</div>`;
  b += "</div>";

  return sec("mats", t("sec.mats"), b);
}
