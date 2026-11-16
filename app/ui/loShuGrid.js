import { CLS } from "../data/kua.js";
import { STARS } from "../data/stars.js";
import { t } from "./i18n.js";

const N_UP = [["NW", "N", "NE"], ["W", "C", "E"], ["SW", "S", "SE"]];
const S_UP = [["SE", "S", "SW"], ["E", "C", "W"], ["NE", "N", "NW"]];

/** 3×3 annual chart: star, Bagua area, your personal class, affliction tags. Respects N-up / S-up. */
export function loShuGrid(r, orient) {
  const v = r.view;
  let b = '<div class="lo">';
  for (const row of orient === "S" ? S_UP : N_UP) {
    for (const dir of row) {
      const st = v.chart[dir];
      const qc = dir === "C" ? "q-center" : `q-${STARS[st].q}`;
      b += `<div class="cell ${qc}">`;
      b += `<span class="d">${t(`dir.${dir}`)}</span><span class="area">${t(`area.${dir}`)}</span>`;
      b += `<span class="n">${st}</span><span class="sn">${t(`star.${st}.name`)}</span>`;
      b += '<span class="tags">';
      if (dir !== "C") {
        const k = r.classes[dir];
        b += `<span class="chip t-${CLS[k].tone}">${t(`cls.${k}.short`)}</span>`;
      }
      if (dir === v.taiSui) b += `<span class="chip aff">${t("year.taiSui")}</span>`;
      if (dir === v.suiPo) b += `<span class="chip aff">${t("year.suiPo")}</span>`;
      if (dir === v.threeKillings) b += `<span class="chip aff">${t("year.threeKillings")}</span>`;
      b += "</span></div>";
    }
  }
  return b + "</div>";
}
