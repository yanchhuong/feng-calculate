import { computeReading, validateInput, solarYear, VIEW_MIN, VIEW_MAX } from "./core/index.js";
import { loadLocale, t, tv, applyStatic } from "./ui/i18n.js";
import { compassSVG } from "./ui/compass.js";
import { icon } from "./ui/icons.js";
import { createDobWheel } from "./ui/dobWheel.js";
import { foldBar, syncFoldAll, initFolds } from "./ui/fold.js";
import { profileSection } from "./ui/sections/profile.js";
import { directionsSection } from "./ui/sections/directions.js";
import { placementSection } from "./ui/sections/placement.js";
import { annualSection } from "./ui/sections/annualStars.js";
import { houseSection } from "./ui/sections/house.js";
import { numbersSection, checkResult } from "./ui/sections/numbers.js";
import { coloursSection } from "./ui/sections/colours.js";
import { materialsSection } from "./ui/sections/materials.js";

await loadLocale("km");
applyStatic(document);

const $ = (id) => document.getElementById(id);
const form = $("f"), out = $("out"), err = $("err");
const KEY = "fs-compass-km-v1";
const smoothScroll = !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
let orient = "N"; // "N" or "S" at the top of the compass and grid
let calculated = false;
let current = null; // last reading, for the number checker
let num = ""; // number checker input

const dob = createDobWheel({ input: $("dob"), day: $("wd"), month: $("wm"), year: $("wy"), months: tv("months") });

function todaySolarYear() {
  const n = new Date();
  return solarYear(n.getFullYear(), n.getMonth() + 1, n.getDate());
}
const clampView = (y) => Math.min(VIEW_MAX, Math.max(VIEW_MIN, y));

// Saved shape stays v1-compatible: { v: {name, dob, g, facing, vy}, o, n }
function readForm() {
  const g = form.querySelector('input[name="g"]:checked');
  return { name: $("name").value.trim().slice(0, 60), dob: $("dob").value, g: g ? g.value : "", facing: $("facing").value, vy: $("vy").value };
}
const toInput = (v) => ({ dob: v.dob, gender: v.g, facing: v.facing, viewYear: v.vy });

function save(v) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v, o: orient, n: num }));
  } catch {}
}
function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}
function fill(v) {
  $("name").value = v.name || "";
  dob.set(v.dob);
  $("facing").value = v.facing || "";
  $("vy").value = v.vy || clampView(todaySolarYear());
  form.querySelectorAll('input[name="g"]').forEach((r) => (r.checked = r.value === v.g));
}

function render(v) {
  const r = computeReading(toInput(v));
  current = r;
  const ctx = { orient, num };
  out.innerHTML =
    foldBar() +
    profileSection(r, ctx) +
    directionsSection(r, ctx) +
    placementSection(r) +
    annualSection(r, ctx) +
    houseSection(r) +
    numbersSection(r, ctx) +
    coloursSection(r) +
    materialsSection(r);
  syncFoldAll(out);
}

function emptyState() {
  current = null;
  out.innerHTML =
    `<div class="empty"><div class="ill">${compassSVG(null, 0, t("ui.emptyAria"))}</div>` +
    `<h2>${t("ui.emptyH")}</h2><p>${t("ui.empty")}</p>` +
    `<button type="button" class="pill-w" data-demo>${t("form.demo")}</button></div>`;
  showTabs(false);
}

// header: greeting by time of day + the person's name (or the app name). textContent, so names stay inert.
function hello() {
  const hr = new Date().getHours();
  $("greet").textContent = t(hr < 12 ? "greet.morning" : hr < 17 ? "greet.afternoon" : "greet.evening");
  $("hname").textContent = $("name").value.trim() || t("app.title");
}

// ---------- light / dark switch (the pre-paint script in <head> applies the saved choice) ----------
const themeBtn = $("theme");
function paintThemeBtn() {
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  const label = t(dark ? "theme.toLight" : "theme.toDark");
  themeBtn.title = label;
  themeBtn.setAttribute("aria-label", label);
  themeBtn.innerHTML = icon(dark ? "sun" : "moon");
}
themeBtn.addEventListener("click", () => {
  const dark = document.documentElement.getAttribute("data-theme") !== "dark";
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  $("themecolor").content = dark ? "#0D1120" : "#F1F3F9";
  try {
    localStorage.setItem("fs-compass-theme", dark ? "dark" : "light");
  } catch {}
  paintThemeBtn();
});
paintThemeBtn();

// ---------- bottom tab bar (phone / iPad portrait) ----------
const tabbar = $("tabbar");
const TAB_OF = { kua: "kua", dirs: "dirs", place: "dirs", year: "year", house: "year", nums: "nums", colors: "nums", mats: "nums" };
let spyFrame = 0;
function showTabs(on) {
  tabbar.hidden = !on;
  document.body.classList.toggle("tabs-on", on);
  if (on) spy();
}
function goSection(id) {
  const d = document.querySelector(`details.fold[data-id="${id}"]`);
  if (!d) return;
  if (!d.open) d.open = true;
  // scroll on the next frame, once the opened section has its real height
  requestAnimationFrame(() => (id === "form" ? form : d).scrollIntoView({ behavior: smoothScroll ? "smooth" : "auto", block: "start" }));
}
function spy() {
  spyFrame = 0;
  if (tabbar.hidden) return;
  let cur = "kua";
  const line = innerHeight * 0.4;
  out.querySelectorAll("details.fold").forEach((d) => {
    if (d.getBoundingClientRect().top < line) cur = TAB_OF[d.dataset.id] || cur;
  });
  tabbar.querySelectorAll("button:not(.fab)").forEach((b) => {
    const on = b.dataset.go === cur;
    b.classList.toggle("on", on);
    if (on) b.setAttribute("aria-current", "true");
    else b.removeAttribute("aria-current");
  });
}
tabbar.addEventListener("click", (e) => {
  const b = e.target.closest("[data-go]");
  if (b) goSection(b.dataset.go);
});
window.addEventListener("scroll", () => {
  if (!spyFrame) spyFrame = requestAnimationFrame(spy);
}, { passive: true });

function run(showErr) {
  const v = readForm();
  const e = validateInput(toInput(v));
  if (e) {
    if (showErr) err.textContent = t(`err.${e}`);
    return false;
  }
  err.textContent = "";
  calculated = true;
  save(v);
  render(v);
  hello();
  showTabs(true);
  return true;
}

form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  if (run(true) && window.innerWidth <= 880) out.scrollIntoView({ behavior: "smooth" });
});
form.addEventListener("input", () => {
  hello();
  if (calculated) run(false);
});
form.addEventListener("change", () => calculated && run(false));
$("demo").addEventListener("click", () => {
  fill({ name: "", dob: "1988-02-14", g: "m", facing: "N", vy: clampView(todaySolarYear()) });
  run(true);
});

out.addEventListener("click", (e) => {
  if (e.target.closest("[data-demo]")) return $("demo").click();
  if (!e.target.closest("#flip")) return;
  orient = orient === "N" ? "S" : "N";
  run(false);
});
// number checker: update only its own result, never the whole page
out.addEventListener("input", (e) => {
  if (e.target.id !== "numchk" || !current) return;
  num = e.target.value;
  $("numres").innerHTML = checkResult(num, current.el);
  save(readForm());
});

initFolds(out, form, () => dob.resync()); // wheel scroll positions don't stick while folded

// app: install button (Chrome/Android/desktop) + offline service worker
let installEvt = null;
const ib = $("install");
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installEvt = e;
  ib.hidden = false;
});
window.addEventListener("appinstalled", () => {
  installEvt = null;
  ib.hidden = true;
});
ib.addEventListener("click", () => {
  if (!installEvt) return;
  installEvt.prompt();
  installEvt.userChoice.then(() => {
    installEvt = null;
    ib.hidden = true;
  });
});
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

const saved = load();
if (saved && saved.v) {
  orient = saved.o === "S" ? "S" : "N";
  num = typeof saved.n === "string" ? saved.n : "";
  fill(saved.v);
  if (!validateInput(toInput(readForm()))) run(false);
  else emptyState();
} else {
  dob.set();
  $("vy").value = clampView(todaySolarYear());
  emptyState();
}
hello();
