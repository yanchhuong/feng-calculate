import { CLS } from "../../data/kua.js";
import { t } from "../i18n.js";
import { sec } from "../fold.js";

/** 5. House: sitting, house group, compatibility, star at the door this year (only when facing is given) */
export function houseSection(r) {
  const h = r.house;
  if (!h) return "";
  const st = h.doorStar;
  let b = '<div class="house">';
  b += `<p>${t("house.facing", { facing: t(`dir.${h.facing}`), sit: t(`dir.${h.sitting}`), group: t(`house.${h.group}`) })}</p>`;
  b += `<p>${t(h.compatible ? "house.match" : "house.mismatch")}</p>`;
  b += `<p>${t("house.door", { facing: t(`dir.${h.facing}`), year: r.view.year, st, name: t(`star.${st}.name`), mean: t(`star.${st}.mean`), adv: t(`star.${st}.adv`) })}</p>`;
  b += `<p>${t("house.doorClass")} <span class="chip t-${CLS[h.doorClass].tone}">${t(`cls.${h.doorClass}.name`)}</span></p>`;
  b += "</div>";
  return sec("house", t("sec.house"), b);
}
