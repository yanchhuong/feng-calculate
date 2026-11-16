import { t } from "../i18n.js";
import { sec } from "../fold.js";
import { loShuGrid } from "../loShuGrid.js";
import { arrowTile } from "../icons.js";

/** 4. Annual Flying Stars: Lo Shu grid, best/worst sectors, Tai Sui / Sui Po / Three Killings */
export function annualSection(r, { orient }) {
  const v = r.view;
  const rot = orient === "S" ? 180 : 0;
  const row = (key, s, bad) =>
    `<div class="lrow">${arrowTile(s.dir, rot, bad)}<div class="lr-t"><b>${t(`dir.${s.dir}`)}</b><small>${t(key, {
      st: s.st,
      mean: t(`star.${s.st}.mean`),
      cls: t(`cls.${s.k}.short`),
      adv: t(`star.${s.st}.adv`),
    })}</small></div></div>`;

  let b = `<p class="sub">${t("year.sub", { center: v.center, day: v.lichun, year: v.year })}</p>`;
  b += loShuGrid(r, orient);
  b += '<div class="twocol">';
  b += `<div class="lcard"><h3>${t("year.bestH")}</h3>${r.best.map((s) => row("year.bestItem", s, false)).join("")}</div>`;
  b += `<div class="lcard"><h3>${t("year.worstH")}</h3>${r.worst.map((s) => row("year.worstItem", s, true)).join("")}</div>`;
  b += "</div>";
  b += '<div class="notes">';
  b += `<div class="note warn">${t("year.taiSuiNote", { ts: t(`dir.${v.taiSui}`), sp: t(`dir.${v.suiPo}`) })}</div>`;
  b += `<div class="note warn">${t("year.tkNote", { tk: t(`dir.${v.threeKillings}`) })}</div>`;
  b += "</div>";
  return sec("year", t("sec.year", { year: v.year, zod: t(`zod.${v.zod}`), el: t(`el.${v.el}`) }), b);
}
