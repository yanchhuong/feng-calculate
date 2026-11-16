import { ANGLE } from "../data/directions.js";
import { CLS } from "../data/kua.js";
import { t } from "./i18n.js";

const FILL = { g1: "var(--good)", g2: "var(--good-2)", g3: "var(--good-3)", b1: "var(--bad)", b2: "var(--bad-2)", b3: "var(--bad-3)" };
const TXT = { g1: "var(--on-strong)", g2: "var(--on-mid)", g3: "var(--ink)", b1: "var(--on-strong)", b2: "var(--on-mid)", b3: "var(--ink)" };

const pt = (cx, cy, r, a) => {
  const rad = (a * Math.PI) / 180;
  return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)];
};
const f = (n) => n.toFixed(2);

function wedge(cx, cy, r1, r2, a0, a1) {
  const p1 = pt(cx, cy, r2, a0), p2 = pt(cx, cy, r2, a1), p3 = pt(cx, cy, r1, a1), p4 = pt(cx, cy, r1, a0);
  return `M${f(p1[0])} ${f(p1[1])} A${r2} ${r2} 0 0 1 ${f(p2[0])} ${f(p2[1])} L${f(p3[0])} ${f(p3[1])} A${r1} ${r1} 0 0 0 ${f(p4[0])} ${f(p4[1])} Z`;
}

/**
 * Eight Mansions compass. `r` is a reading (or null for the empty state).
 * `rot` = 0 for North up, 180 for South up.
 */
export function compassSVG(r, rot, label) {
  const cx = 180, cy = 180;
  let s = `<svg viewBox="0 0 360 360" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">`;
  s += '<circle cx="180" cy="180" r="140" fill="none" stroke="var(--line)" stroke-width="1"/>';
  for (let i = 0; i < 24; i++) {
    const a = i * 15 + 7.5 + rot, q1 = pt(cx, cy, 134, a), q2 = pt(cx, cy, 140, a);
    s += `<line x1="${q1[0].toFixed(1)}" y1="${q1[1].toFixed(1)}" x2="${q2[0].toFixed(1)}" y2="${q2[1].toFixed(1)}" stroke="var(--muted)" stroke-width="1"/>`;
  }
  for (const d of Object.keys(ANGLE)) {
    const a = ANGLE[d] + rot;
    const k = r ? r.classes[d] : null;
    const tone = k ? CLS[k].tone : null;
    s += `<path d="${wedge(cx, cy, 58, 130, a - 22.2, a + 22.2)}" fill="${tone ? FILL[tone] : "var(--surface-2)"}" stroke="var(--surface)" stroke-width="3" stroke-linejoin="round"/>`;
    if (k) {
      const lp = pt(cx, cy, 95, a);
      s += `<text x="${lp[0].toFixed(1)}" y="${(lp[1] + 4).toFixed(1)}" text-anchor="middle" font-size="12.5" font-weight="600" fill="${TXT[tone]}">${t(`cls.${k}.short`)}</text>`;
    }
    const dp = pt(cx, cy, 156, a);
    const strong = d === "N" || d === "S";
    s += `<text x="${dp[0].toFixed(1)}" y="${(dp[1] + 5).toFixed(1)}" text-anchor="middle" font-size="13" font-weight="${strong ? 700 : 500}" fill="${d === "N" ? "var(--bad)" : "var(--ink)"}">${t(`dirShort.${d}`)}</text>`;
  }
  s += '<circle cx="180" cy="180" r="54" fill="var(--surface)" stroke="var(--line)" stroke-width="3"/>';
  if (r) {
    s += `<text x="180" y="174" text-anchor="middle" font-size="30" fill="var(--ink)">${r.trigram}</text>`;
    s += `<text x="180" y="206" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)">${t("profile.kuaCenter", { kua: r.kua })}</text>`;
  } else {
    s += '<text x="180" y="186" text-anchor="middle" font-size="22" fill="var(--muted)">☯</text>';
  }
  return s + "</svg>";
}
