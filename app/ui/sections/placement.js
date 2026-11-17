import { CLS } from "../../data/kua.js";
import { t } from "../i18n.js";
import { sec } from "../fold.js";
import { icon } from "../icons.js";
import { zh } from "../refs.js";

/** 3. Desk (sq 生氣), bed head (ty 天醫), couple's bedroom (yn 延年), avoid (jm 絕命) */
export function placementSection(r) {
  const tiles = [
    ["desk", "", "desk", "sq"],
    ["bed", "lav", "bed", "ty"],
    ["heart", "peach", "couple", "yn"],
    ["ban", "rose", "avoid", "jm"],
  ];
  let b = `<p class="sub">${t("place.sub")}</p><div class="tiles">`;
  for (const [ic, tint, k, cls] of tiles) {
    b +=
      `<div class="tile"><span class="tico ${tint}">${icon(ic)}</span><small>${t(`place.${k}`)}</small>` +
      `<b>${t(`dir.${r.dirs[cls]}`)}</b><small>${zh(CLS[cls].zh)} · ${t(`place.${k}Why`)}</small></div>`;
  }
  b += "</div>";
  return sec("place", t("sec.place"), b);
}
