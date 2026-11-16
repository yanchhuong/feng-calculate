import { ORDER, CLS } from "../../data/kua.js";
import { t } from "../i18n.js";
import { sec } from "../fold.js";
import { arrowTile } from "../icons.js";

/** 2. The 8 classes with direction, meaning and use. One card per direction; the meter shows strength. */
export function directionsSection(r, { orient }) {
  const rot = orient === "S" ? 180 : 0;
  let b = `<p class="sub">${t("dirs.sub")}</p><div class="dcards">`;
  for (const k of ORDER) {
    const c = CLS[k];
    const dir = r.dirs[k];
    const good = c.score > 0;
    const lvl = Math.abs(c.score);
    const cap = t(good ? "dirs.levelGood" : "dirs.levelBad", { n: lvl });
    b +=
      `<div class="dcard ${good ? "good" : "bad"}${k === "jm" ? " worst" : ""}">` +
      `<div class="dc-top">${arrowTile(dir, rot)}<div class="dc-t"><b>${t(`dir.${dir}`)}</b><small>${t(`cls.${k}.name`)}</small></div></div>` +
      `<p class="dc-m">${t(`cls.${k}.meaning`)}</p><p class="dc-u">${t(`cls.${k}.use`)}</p>` +
      `<small class="dc-c">${cap}</small><div class="meter" role="img" aria-label="${cap}"><i style="width:${Math.round((lvl / 3) * 100)}%"></i></div></div>`;
  }
  b += "</div>";
  return sec("dirs", t("sec.dirs"), b);
}
