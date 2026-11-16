// Date of birth wheel (Day / Month / Year, iOS-style). Each column snap-scrolls; the value commits
// once scrolling settles, into a hidden input (YYYY-MM-DD) that fires "change".
const ROW = 40;
const Y0 = 1901;
const DEFAULT_DOB = "1990-01-01";
const smoothScroll = !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

const daysIn = (y, m) => new Date(y, m, 0).getDate();
const pad = (n) => (n < 10 ? "0" : "") + n;
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => String(a + i));

function wheelCol(el, onSettle) {
  let items = [], cur = 0, live = 0, want = null, timer = 0;
  const clamp = (i) => Math.max(0, Math.min(items.length - 1, i));
  function mark(i) {
    const p = el.querySelector(".wi.on");
    if (p) {
      p.classList.remove("on");
      p.setAttribute("aria-selected", "false");
    }
    const n = el.children[i];
    if (n) {
      n.classList.add("on");
      n.setAttribute("aria-selected", "true");
      el.setAttribute("aria-activedescendant", n.id);
    }
    live = i;
  }
  function jump(i) {
    cur = clamp(i);
    el.scrollTop = cur * ROW;
    mark(cur);
  }
  function go(i) {
    want = clamp(i);
    el.scrollTo({ top: want * ROW, behavior: smoothScroll ? "smooth" : "auto" });
  }
  el.addEventListener(
    "scroll",
    () => {
      const i = clamp(Math.round(el.scrollTop / ROW));
      if (i !== live) mark(i);
      clearTimeout(timer);
      timer = setTimeout(() => {
        want = null;
        if (live !== cur) {
          cur = live;
          onSettle();
        }
      }, 140);
    },
    { passive: true },
  );
  el.addEventListener("click", (e) => {
    const n = e.target.closest(".wi");
    if (n && !n.classList.contains("off")) go(+n.dataset.i);
  });
  el.addEventListener("keydown", (e) => {
    const base = want != null ? want : live;
    const step = { ArrowUp: -1, ArrowDown: 1, PageUp: -5, PageDown: 5 }[e.key];
    if (step) go(base + step);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(items.length - 1);
    else return;
    e.preventDefault();
  });
  return {
    set(list, i, glide) {
      if (list.join() !== items.join()) {
        items = list.slice();
        el.innerHTML = items
          .map((txt, j) => `<div class="wi" role="option" aria-selected="false" id="${el.id}-${j}" data-i="${j}">${txt}</div>`)
          .join("");
      }
      if (glide && clamp(i) !== cur) go(i);
      else jump(i);
    },
    // rows after index `max` are in the future: grey them out
    limit(max) {
      [...el.children].forEach((n, j) => {
        n.classList.toggle("off", j > max);
        n.setAttribute("aria-disabled", j > max ? "true" : "false");
      });
    },
    index: () => cur,
    resync: () => jump(cur),
  };
}

/** @param {{input: HTMLInputElement, day: HTMLElement, month: HTMLElement, year: HTMLElement, months: string[]}} o */
export function createDobWheel({ input, day, month, year, months }) {
  const Y1 = new Date().getFullYear();
  const YEARS = range(Y0, Y1);
  const wD = wheelCol(day, commit), wM = wheelCol(month, commit), wY = wheelCol(year, commit);

  // birth date can't be after today: returns [y,m,d] pulled back to today if needed
  function notFuture(y, m, d) {
    const n = new Date(), ty = n.getFullYear(), tm = n.getMonth() + 1, td = n.getDate();
    if (y > ty) y = ty;
    if (y === ty && m > tm) m = tm;
    if (y === ty && m === tm && d > td) d = td;
    return [y, m, d];
  }
  function greyFuture(y, m) {
    const n = new Date(), ty = n.getFullYear(), tm = n.getMonth() + 1;
    wM.limit(y === ty ? tm - 1 : 11);
    wD.limit(y === ty && m === tm ? n.getDate() - 1 : 30);
  }
  function set(s) {
    let [y, m, d] = String(s || DEFAULT_DOB).split("-").map(Number);
    if (!(y >= Y0 && y <= Y1)) y = 1990;
    if (!(m >= 1 && m <= 12)) m = 1;
    d = Math.min(Math.max(d || 1, 1), daysIn(y, m));
    [y, m, d] = notFuture(y, m, d);
    wY.set(YEARS, y - Y0);
    wM.set(months, m - 1);
    wD.set(range(1, daysIn(y, m)), d - 1);
    greyFuture(y, m);
    input.value = `${y}-${pad(m)}-${pad(d)}`;
  }
  function commit() {
    const y = Y0 + wY.index(), m0 = wM.index() + 1;
    let [, m, d] = notFuture(y, m0, Math.min(wD.index() + 1, daysIn(y, m0)));
    if (m !== m0) wM.set(months, m - 1, true); // future month: spring back, like iOS
    wD.set(range(1, daysIn(y, m)), d - 1, true); // 31 -> 30/29/28, or back to today
    greyFuture(y, m);
    const v = `${y}-${pad(m)}-${pad(d)}`;
    if (v === input.value) return;
    input.value = v;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }
  return {
    set,
    resync() {
      wD.resync();
      wM.resync();
      wY.resync();
    },
  };
}
