import { CLS, GROUP_ZH } from "../../data/kua.js";
import { DIR_TRI } from "../../data/directions.js";
import { t } from "../i18n.js";
import { sec } from "../fold.js";
import { zh, clsLabel } from "../refs.js";

/**
 * 5. House: sitting, house trigram (離 = sits South), house group (東 / 西), compatibility,
 * star at the door this year (only when facing is given)
 */
export function houseSection(r) {
  const h = r.house;
  if (!h) return "";
  const st = h.doorStar;
  const name = zh(DIR_TRI[h.sitting]); // the house takes the trigram of its sitting side
  const group = `${t(`house.${h.group}`)} ${zh(GROUP_ZH[h.group])}`;
  let b = '<div class="house">';
  b += `<p>${t("house.facing", { facing: t(`dir.${h.facing}`), sit: t(`dir.${h.sitting}`), zh: name, group })}</p>`;
  b += `<p>${t(h.compatible ? "house.match" : "house.mismatch")}</p>`;
  b += `<p>${t("house.door", { facing: t(`dir.${h.facing}`), year: r.view.year, st, name: t(`star.${st}.name`), mean: t(`star.${st}.mean`), adv: t(`star.${st}.adv`) })}</p>`;
  b += `<p>${t("house.doorClass")} <span class="chip t-${CLS[h.doorClass].tone}">${clsLabel(h.doorClass)}</span></p>`;
  b += "</div>";
  return sec("house", t("sec.house"), b);
}
