// Offline support. Bump VERSION when you change any file below so phones pick up the update.
var VERSION = "fs-compass-v9";
var SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  // app modules (no build step): keep in sync, tests/core.test.js checks this list
  "./main.js",
  "./i18n/km.json",
  "./core/calendar.js",
  "./core/elements.js",
  "./core/flyingStars.js",
  "./core/index.js",
  "./core/kua.js",
  "./core/numbers.js",
  "./core/reading.js",
  "./core/scoring.js",
  "./data/digits.js",
  "./data/directions.js",
  "./data/elements.js",
  "./data/kua.js",
  "./data/refs.js",
  "./data/stars.js",
  "./data/zodiac.js",
  "./ui/compass.js",
  "./ui/dobWheel.js",
  "./ui/fold.js",
  "./ui/i18n.js",
  "./ui/icons.js",
  "./ui/loShuGrid.js",
  "./ui/refs.js",
  "./ui/sections/annualStars.js",
  "./ui/sections/colours.js",
  "./ui/sections/directions.js",
  "./ui/sections/house.js",
  "./ui/sections/materials.js",
  "./ui/sections/numbers.js",
  "./ui/sections/placement.js",
  "./ui/sections/profile.js",
  "./ui/swatch.js"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function put(req, res) {
  if (res && (res.ok || res.type === "opaque")) {
    var copy = res.clone();
    caches.open(VERSION).then(function (c) { c.put(req, copy); });
  }
  return res;
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);

  // The page itself: network first so updates show up, cached copy when offline.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req, { cache: "no-cache" }).then(function (res) { return put("./index.html", res); })
        .catch(function () { return caches.match("./index.html"); })
    );
    return;
  }

  // Own files and Google Fonts: cache first, fill the cache on first use.
  if (url.origin === self.location.origin || url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(
      caches.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) { return put(req, res); });
      })
    );
  }
});
