import { REFS, SECTION_REFS } from "../data/refs.js";
import { CLS } from "../data/kua.js";
import { t, esc } from "./i18n.js";

/** Chinese text, marked so screen readers and fonts treat it as Traditional Chinese. */
export const zh = (s) => `<span class="zh" lang="zh-Hant">${s}</span>`;

/** `html` as a link to source `id` (data/refs.js), opening in a new tab. */
export const refLink = (id, html) =>
  `<a class="ref" href="${REFS[id].url}" target="_blank" rel="noopener noreferrer" title="${esc(REFS[id].title)}">${html}</a>`;

/** Class label: 生氣 + Khmer name, e.g. for chips. */
export const clsLabel = (k) => `${zh(CLS[k].zh)} ${t(`cls.${k}.name`)}`;

/** Numbered source list shown at the end of a result section. Empty when the section has none. */
export function refList(secId) {
  const ids = SECTION_REFS[secId];
  if (!ids || !ids.length) return "";
  const items = ids.map((id) => `<li>${refLink(id, esc(REFS[id].title))}</li>`).join("");
  return `<div class="refs"><b>${t("ref.label")}</b><ol>${items}</ol></div>`;
}
