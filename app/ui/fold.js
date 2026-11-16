import { t } from "./i18n.js";

// Foldable result sections. Each section's open/closed state is remembered per id.
const FKEY = "fs-compass-km-folds";
export const folds = (() => {
  try {
    return JSON.parse(localStorage.getItem(FKEY)) || {};
  } catch {
    return {};
  }
})();
function saveFolds() {
  try {
    localStorage.setItem(FKEY, JSON.stringify(folds));
  } catch {}
}

const CHEV =
  '<span class="chev" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

export function sec(id, title, body, cls) {
  return (
    `<details class="block fold" data-id="${id}"${folds[id] === false ? "" : " open"}>` +
    `<summary><h2>${title}</h2>${CHEV}</summary>` +
    `<div class="fold-body${cls ? " " + cls : ""}">${body}</div></details>`
  );
}

export const foldBar = () => '<div class="foldbar"><button type="button" class="linkbtn" id="foldall"></button></div>';

export function syncFoldAll(out) {
  const b = document.getElementById("foldall");
  if (!b) return;
  const all = [...out.querySelectorAll("details.fold")].every((d) => d.open);
  b.dataset.open = all ? "1" : "0";
  b.innerHTML =
    `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${all ? "M4 9l4-4 4 4" : "M4 7l4 4 4-4"}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>` +
    t(all ? "ui.foldClose" : "ui.foldOpen");
}

/** Wire fold events once. `onFormOpen` runs when the form panel is unfolded. */
export function initFolds(out, form, onFormOpen) {
  // "toggle" doesn't bubble, so listen in capture
  document.addEventListener(
    "toggle",
    (e) => {
      const d = e.target;
      if (!d.classList || !d.classList.contains("fold")) return;
      folds[d.dataset.id] = d.open;
      saveFolds();
      syncFoldAll(out);
      if (d.dataset.id === "form" && d.open) onFormOpen();
    },
    true,
  );
  document.addEventListener("click", (e) => {
    const all = e.target.closest("#foldall");
    if (all) {
      const open = all.dataset.open !== "1";
      out.querySelectorAll("details.fold").forEach((d) => {
        d.open = open;
        folds[d.dataset.id] = open;
      });
      saveFolds();
      syncFoldAll(out);
      return;
    }
    const s = e.target.closest("details.fold>summary");
    if (s) s.parentNode.classList.add("anim");
  });
  document.addEventListener("animationend", (e) => {
    if (e.target.classList.contains("fold-body")) e.target.parentNode.classList.remove("anim");
  });
  // print every section, then put the folds back
  let prePrint = null;
  window.addEventListener("beforeprint", () => {
    prePrint = {};
    document.querySelectorAll("details.fold").forEach((d) => {
      prePrint[d.dataset.id] = d.open;
      d.open = true;
    });
  });
  window.addEventListener("afterprint", () => {
    if (!prePrint) return;
    document.querySelectorAll("details.fold").forEach((d) => {
      if (d.dataset.id in prePrint) d.open = prePrint[d.dataset.id];
    });
    prePrint = null;
  });
  if (folds.form === false) form.querySelector("details.fold").open = false;
}
