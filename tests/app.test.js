// Static guards for the acceptance criteria that unit tests on core/ can't see.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const APP = fileURLToPath(new URL("../app/", import.meta.url));
const read = (p) => readFileSync(join(APP, p), "utf8");
const walk = (dir) =>
  readdirSync(join(APP, dir)).flatMap((f) => {
    const p = join(dir, f);
    return statSync(join(APP, p)).isDirectory() ? walk(p) : [p];
  });
const js = (dir) => walk(dir).filter((f) => f.endsWith(".js"));

const km = JSON.parse(read("i18n/km.json"));
const paths = [];
(function flatten(o, pre) {
  for (const [k, v] of Object.entries(o)) {
    const p = pre ? `${pre}.${k}` : k;
    paths.push(p);
    if (v && typeof v === "object") flatten(v, p);
  }
})(km, "");
const exists = (key) => {
  // `cls.${k}.name` -> any key at cls.<anything>.name
  const re = new RegExp("^" + key.split(/\$\{[^}]+\}/).map((s) => s.replace(/[.*+?^()|[\]\\]/g, "\\$&")).join("[^.]+") + "$");
  return paths.some((p) => re.test(p));
};

const uiFiles = [...js("ui"), "main.js"];

test("every t()/tv() key used by the UI exists in km.json", () => {
  const missing = [];
  for (const f of uiFiles) {
    const src = read(f);
    for (const m of src.matchAll(/\bt[v]?\(\s*(["'`])([^"'`]+)\1/g)) {
      if (!exists(m[2])) missing.push(`${f}: ${m[2]}`);
    }
  }
  assert.deepEqual(missing, []);
});

test("every data-i18n attribute in index.html exists in km.json", () => {
  const html = read("index.html");
  const keys = [...html.matchAll(/data-i18n(?:-ph|-aria|-title)?="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(keys.length > 20);
  assert.deepEqual(keys.filter((k) => typeof k !== "string" || !exists(k)), []);
});

test("no hard-coded Khmer in components, core or data (all UI text comes from km.json)", () => {
  const files = [...uiFiles, ...js("core"), ...js("data")];
  const offenders = files.filter((f) => /[ក-៿]/.test(read(f)));
  assert.deepEqual(offenders, []);
  const body = read("index.html").split("<body>")[1];
  assert.ok(!/[ក-៿]/.test(body), "Khmer text in the <body> of index.html");
});

test("core/ is pure: no DOM, storage or network", () => {
  const offenders = js("core").filter((f) => /\b(document|window|localStorage|fetch|navigator)\b/.test(read(f)));
  assert.deepEqual(offenders, []);
});

test("service worker precaches every module and the locale", () => {
  const sw = read("sw.js");
  const shell = [...sw.matchAll(/"\.\/([^"]+)"/g)].map((m) => m[1]);
  const need = ["main.js", "i18n/km.json", ...js("core"), ...js("data"), ...js("ui")].map((f) => relative(".", f));
  assert.deepEqual(need.filter((f) => !shell.includes(f)), []);
});
