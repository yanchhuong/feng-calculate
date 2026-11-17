import { NUM_EL, DIGIT_TONE } from "../../data/digits.js";
import { checkNumber, relOf } from "../../core/index.js";
import { t, esc } from "../i18n.js";
import { sec } from "../fold.js";
import { tierChip } from "../swatch.js";
import { KUA_INFO } from "../../data/kua.js";
import { zh } from "../refs.js";
import { triLabel } from "./profile.js";

const TONE_CHIP = { g: "g3", n: "n", b: "b3" };
const VERDICT_CHIP = { great: "g1", good: "g2", fair: "ok", poor: "b1" };
const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

const numTile = (n, el, cls) => `<span class="ntile ${cls}"><b>${n}</b><small>${t(`el.${el}`)}</small></span>`;

/** Result card for the number checker. Re-rendered on its own as the user types. */
export function checkResult(raw, userEl) {
  if (!String(raw ?? "").trim()) return `<p class="hint">${t("nums.checkEmpty")}</p>`;
  const c = checkNumber(raw, userEl);
  if (!c) return `<p class="hint">${t("nums.checkNoDigits")}</p>`;
  let b = '<div class="chk-top">';
  b += `<span class="chip big t-${VERDICT_CHIP[c.verdict]}">${t(`nums.verdict.${c.verdict}`)}</span>`;
  b += `<span class="chk-score">${t("nums.score", { score: fmt(c.score) })}</span>`;
  b += "</div><ul class=\"chk-why\">";
  b += `<li>${t("nums.resultFor", { num: c.digits.join("") })}</li>`;
  b += `<li>${t("nums.sum", { sum: c.sum, root: c.root })}</li>`;
  b += `<li>${c.el ? t("nums.rootEl", { root: c.root, el: t(`el.${c.el}`), rel: t(`tier.${c.rel}.label`) }) : t("nums.rootNone")}</li>`;
  b += `<li>${t("nums.goodCount", { n: c.good })}</li>`;
  b += `<li>${t("nums.badCount", { n: c.bad })}</li>`;
  b += `<li>${t("nums.last", { d: c.last, mean: t(`digit.${c.last}`) })}</li>`;
  b += `</ul><p class="hint">${t("nums.scale")}</p>`;
  return b;
}

/** 6. Numbers: traits, lucky and caution numbers, conflict notes, 0-9 table, number checker */
export function numbersSection(r, { num }) {
  const rel = r.rel;
  const el = (k) => t(`el.${k}`);

  let b = `<p class="sub">${t("nums.sub", { el: el(r.el), kua: r.kua })}</p>`;

  b += `<div class="card trait"><h3>${t("nums.traitsH")}</h3>`;
  b += `<p class="trait-tri"><span aria-hidden="true">${r.trigram}</span> ${t("nums.traitsSub", { tri: triLabel(r.kua), nature: `${t(`kua.${r.kua}.nature`)} ${zh(KUA_INFO[r.kua].nature)}` })}</p>`;
  b += `<p>${t(`kua.${r.kua}.traits`)}</p></div>`;

  b += '<div class="twocol">';
  b += `<div class="card"><h3>${t("nums.luckyH")}</h3><p class="hint">${t("nums.luckySub", { sup: el(rel.sup), same: el(rel.same) })}</p>`;
  b += `<div class="ntiles">${r.lucky.map((n) => numTile(n, NUM_EL[n], "good")).join("")}</div></div>`;
  b += `<div class="card"><h3>${t("nums.cautionH")}</h3><p class="hint">${t("nums.cautionSub", { pow: el(rel.pow), el: el(r.el) })}</p>`;
  b += `<div class="ntiles">${r.caution.map((n) => numTile(n, NUM_EL[n], "bad")).join("")}</div></div>`;
  b += "</div>";

  if (r.numNotes.length) {
    b += '<div class="notes">';
    for (const n of r.numNotes) {
      if (n.type === "universal")
        b += `<div class="note">${t("nums.noteUniversal", { nums: n.nums.join(", "), pow: el(rel.pow), el: el(r.el), lucky: r.lucky.join(", ") })}</div>`;
      if (n.type === "four") b += `<div class="note warn">${t("nums.noteFour")}</div>`;
    }
    b += "</div>";
  }

  b += `<h3 class="subh">${t("nums.tableH")}</h3>`;
  b += `<div class="tablewrap"><table class="digits"><thead><tr><th class="num">${t("nums.thNum")}</th><th>${t("nums.thMeaning")}</th><th>${t("nums.thElement")}</th><th>${t("nums.thForYou")}</th></tr></thead><tbody>`;
  for (let d = 0; d <= 9; d++) {
    const e = NUM_EL[d];
    const tone = DIGIT_TONE[d];
    b += `<tr><td class="num"><b class="dg">${d}</b></td>`;
    b += `<td><span class="chip t-${TONE_CHIP[tone]}">${t(`tone.${tone}`)}</span> ${t(`digit.${d}`)}</td>`;
    b += `<td>${e ? el(e) : `<span class="muted">${t("nums.noElement")}</span>`}</td>`;
    b += `<td>${e ? tierChip(relOf(r.el, e)) : '<span class="muted">—</span>'}</td></tr>`;
  }
  b += "</tbody></table></div>";

  b += `<div class="card chk"><h3>${t("nums.checkH")}</h3>`;
  b += `<label class="lbl" for="numchk">${t("nums.checkLabel")}</label>`;
  b += `<input type="text" id="numchk" inputmode="tel" autocomplete="off" spellcheck="false" placeholder="${t("nums.checkPh")}" value="${esc(num || "")}" aria-describedby="numhint">`;
  b += `<p class="hint" id="numhint">${t("nums.checkHint")}</p>`;
  b += `<div id="numres" aria-live="polite">${checkResult(num, r.el)}</div></div>`;

  return sec("nums", t("sec.nums"), b);
}
