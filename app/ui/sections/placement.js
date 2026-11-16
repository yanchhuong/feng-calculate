import { t } from "../i18n.js";
import { sec } from "../fold.js";
import { icon } from "../icons.js";

/** 3. Desk (sq), bed head (ty), couple's bedroom (yn), avoid (jm) */
export function placementSection(r) {
  const tiles = [
    ["desk", "", "desk", r.dirs.sq],
    ["bed", "lav", "bed", r.dirs.ty],
    ["heart", "peach", "couple", r.dirs.yn],
    ["ban", "rose", "avoid", r.dirs.jm],
  ];
  let b = `<p class="sub">${t("place.sub")}</p><div class="tiles">`;
  for (const [ic, tint, k, dir] of tiles) {
    b += `<div class="tile"><span class="tico ${tint}">${icon(ic)}</span><small>${t(`place.${k}`)}</small><b>${t(`dir.${dir}`)}</b><small>${t(`place.${k}Why`)}</small></div>`;
  }
  b += "</div>";
  return sec("place", t("sec.place"), b);
}
