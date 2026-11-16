// UI text comes only from i18n/<lang>.json. Components look strings up by dotted key, with {vars}.
let dict = {};

export async function loadLocale(lang) {
  const res = await fetch(new URL(`../i18n/${lang}.json`, import.meta.url));
  if (!res.ok) throw new Error(`i18n: ${lang}.json ${res.status}`);
  dict = await res.json();
  document.documentElement.lang = lang;
}

/** Raw value (string, array or object) at a dotted key. */
export function tv(key) {
  return key.split(".").reduce((o, k) => (o == null ? undefined : o[k]), dict);
}

/** String at a dotted key with {placeholders} filled. Values are inserted as-is: escape user input first. */
export function t(key, vars) {
  const s = tv(key);
  if (typeof s !== "string") {
    console.warn("i18n: missing", key);
    return key;
  }
  return vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : s;
}

/** Khmer "or" list: "a b <or>c", using ui.or */
export function orList(items) {
  if (items.length < 2) return items.join("");
  return items.slice(0, -1).join(" ") + " " + t("ui.or") + items[items.length - 1];
}

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

/** Fill the static HTML shell: data-i18n (text), -ph (placeholder), -aria (aria-label), -title (title). */
export function applyStatic(root) {
  root.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  root.querySelectorAll("[data-i18n-ph]").forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
  root.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
  root.querySelectorAll("[data-i18n-title]").forEach((el) => (el.title = t(el.dataset.i18nTitle)));
}
