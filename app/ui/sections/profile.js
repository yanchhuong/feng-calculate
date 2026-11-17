import { t } from "../i18n.js";
import { sec } from "../fold.js";
import { compassSVG } from "../compass.js";
import { KUA_INFO, GROUP_ZH } from "../../data/kua.js";
import { zh } from "../refs.js";

/** Trigram as: 坎 + Khmer name */
export const triLabel = (kua) => `${zh(KUA_INFO[kua].zh)} ${t(`kua.${kua}.tri`)}`;

/** 1. Profile hero: Kua card (number, group, element, trigram), compass (N/S toggle), facts, edge-case notes */
export function profileSection(r, { orient }) {
  const notes = [];
  if (r.flags.beforeLichun) notes.push({ w: true, t: t("notes.beforeLichun", { day: r.lichun, year: r.birth.y, sy: r.solarYear }) });
  if (r.flags.onLichun) notes.push({ w: true, t: t("notes.onLichun") });
  if (r.flags.lunarCusp) notes.push({ w: false, t: t("notes.lunarCusp") });
  if (r.view.personal === "own") notes.push({ w: true, t: t("notes.own", { year: r.view.year }) });
  if (r.view.personal === "clash")
    notes.push({ w: true, t: t("notes.clash", { year: r.view.year, yz: t(`zod.${r.view.zod}`), pz: t(`zod.${r.zod}`) }) });

  const fact = (dt, dd) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`;
  let b = '<div class="hero">';
  b +=
    `<div class="kcard"><div class="kc-top"><div><p class="kc-l">${t("profile.kcLabel")}</p><p class="kc-n">${r.kua}</p></div>` +
    `<span class="kc-tri" aria-hidden="true">${r.trigram}</span></div>` +
    `<p class="kc-g">${t("profile.kcGroup", { group: `${t(`group.${r.group}`)} ${zh(GROUP_ZH[r.group])}`, el: t(`el.${r.el}`) })}</p>` +
    `<p class="kc-s">${t("profile.kcTri", { tri: triLabel(r.kua) })}</p></div>`;
  b += `<div class="ccard"><div class="compass reveal">${compassSVG(r, orient === "S" ? 180 : 0, t("profile.compassAria", { kua: r.kua }))}</div>`;
  b += `<div class="orient"><span>${t("profile.top")}</span><button type="button" class="ghost" id="flip">${t(orient === "N" ? "profile.topN" : "profile.topS")}</button></div></div>`;
  b += '<dl class="facts">';
  b += fact(t("profile.zodiac"), t("profile.zodiacVal", { zod: t(`zod.${r.zod}`), el: t(`el.${r.zodEl}`) }));
  b += fact(t("profile.birthStar"), `${r.birthStar} ${t(`star.${r.birthStar}.name`)}`);
  b += fact(t("profile.solarYear"), r.solarYear);
  b += fact(t("profile.lichunOf", { year: r.birth.y }), t("profile.lichunVal", { day: r.lichun }));
  b += "</dl></div>";
  if (notes.length) b += `<div class="notes">${notes.map((n) => `<div class="note${n.w ? " warn" : ""}">${n.t}</div>`).join("")}</div>`;
  return sec("kua", t("sec.kua"), b);
}
