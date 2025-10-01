// === Songlines background ===
(function () {
  const svg = document.getElementById("bg");

  function r(a, b) {
    return Math.random() * (b - a) + a;
  }

  function build(w, h, segs, y, amp, v) {
    const step = w / (segs - 1);
    const pts = Array.from({ length: segs }, (_, i) => [
      i * step + r(-8, 8),
      y + Math.sin(i * r(0.6, 0.95)) * amp + r(-v, v),
    ]);
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)],
        p1 = pts[i],
        p2 = pts[i + 1],
        p3 = pts[Math.min(pts.length - 1, i + 2)];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6],
        c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C ${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
    }
    return d;
  }

  function mk(stroke) {
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("class", "sl");
    p.setAttribute("stroke", stroke);
    p.style.strokeDasharray = `1 ${Math.round(r(11, 16))}`;
    p.style.animation = `sl-drift ${Math.round(r(25, 50))}s linear infinite`;
    return p;
  }

  function regen() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML =
      '<filter id="sl-glow"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
    svg.appendChild(defs);

    const w = 1440,
      h = 900,
      ys = [h * 0.3, h * 0.5, h * 0.7],
      amps = [80, 60, 40];
    const colors = ["#5a9cff", "#c55410", "rgba(0,0,0,.6)"];

    ys.forEach((y, i) => {
      const p = mk(colors[i]);
      p.setAttribute("d", build(w, h, 7, y, amps[i], h * 0.06));
      svg.appendChild(p);
    });
  }

  regen();
  window.addEventListener("resize", regen);
})();

// === Apply team photos ===
function applyPhotos() {
  document.querySelectorAll(".card").forEach((card) => {
    const url = card.dataset.photo || "";
    const ph = card.querySelector(".photo");
    if (url && ph) ph.style.backgroundImage = `url('${url}')`;
  });
}

// === Team bio modal ===
(function () {
  const popup = document.getElementById("popup");
  const avatar = document.getElementById("pop-ava");
  const nameEl = document.getElementById("popup-name");
  const roleEl = document.getElementById("popup-role");
  const bioEl = document.getElementById("popup-bio");
  const ulEl = document.getElementById("popup-points");
  const close = document.querySelector(".close");
  let lastFocus = null;

  function openCard(card) {
    lastFocus = document.activeElement;
    popup.style.display = "flex";
    nameEl.textContent = card.dataset.name || "";
    roleEl.textContent = card.dataset.role || "";
    bioEl.textContent = card.dataset.bio || "";
    avatar.style.backgroundImage = card.dataset.photo
      ? `url('${card.dataset.photo}')`
      : "";
    ulEl.innerHTML = "";
    (card.dataset.points || "")
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((p) => {
        const li = document.createElement("li");
        li.textContent = p;
        ulEl.appendChild(li);
      });
    close.focus();
  }

  function hide() {
    popup.style.display = "none";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  document.querySelectorAll(".card").forEach((c) => {
    c.addEventListener("click", () => openCard(c));
    c.setAttribute("tabindex", "0");
    c.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCard(c);
      }
    });
  });

  close.addEventListener("click", hide);
  window.addEventListener("click", (e) => {
    if (e.target === popup) hide();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hide();
  });
})();

// === Tabs ===
(function () {
  document.querySelectorAll("[data-tabs]").forEach((root) => {
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
    const panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));

    function setActive(idx) {
      tabs.forEach((t, i) => {
        const sel = i === idx;
        t.setAttribute("aria-selected", String(sel));
        t.tabIndex = sel ? 0 : -1;
      });
      panels.forEach((p, i) => {
        p.hidden = i !== idx;
      });
    }

    tabs.forEach((tab, idx) => {
      tab.addEventListener("click", () => setActive(idx));
      tab.addEventListener("keydown", (e) => {
        const key = e.key;
        let next = idx;
        if (key === "ArrowRight") next = (idx + 1) % tabs.length;
        if (key === "ArrowLeft") next = (idx - 1 + tabs.length) % tabs.length;
        if (key === "Home") next = 0;
        if (key === "End") next = tabs.length - 1;
        if (next !== idx) {
          e.preventDefault();
          tabs[next].focus();
          setActive(next);
        }
      });
    });

    setActive(0);
  });
})();

// === Theme toggle ===
(function () {
  const THEMES = ["darkblue", "skyblue", "ochre", "white"];
  const KEY = "yccc-theme";
  const root = document.body;

  function apply(theme) {
    if (!THEMES.includes(theme)) theme = "white";
    root.classList.remove(...THEMES.map((t) => "theme-" + t));
    root.classList.add("theme-" + theme);
    localStorage.setItem(KEY, theme);
    document
      .querySelectorAll(".theme-toggle [data-theme]")
      .forEach((btn) => {
        btn.setAttribute(
          "aria-pressed",
          String(btn.dataset.theme === theme)
        );
      });
  }

  function init() {
    document.querySelectorAll(".theme-toggle [data-theme]").forEach((btn) => {
      const set = () => apply(btn.dataset.theme);
      btn.addEventListener("click", set);
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          set();
        }
      });
    });
    apply(localStorage.getItem(KEY) || "white");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

// === Hero Animation + Logo Fade ===
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector("#top");
  const heroLogo = document.getElementById("hero-logo");
  const texts = document.querySelectorAll(".hero-headline, .hero-lead");

  if (!hero || !heroLogo) return;

  // Animate logo + text on load
  setTimeout(() => {
    heroLogo.style.opacity = 1;
    heroLogo.style.transform = "scale(1)";
    texts.forEach((el) => el.classList.add("reveal"));
  }, 300);

  // Scroll behavior
  window.addEventListener("scroll", () => {
    const heroHeight = hero.offsetHeight;
    const scrolled = window.scrollY;

    // Fade + scale Hero logo
    let fadeLogo = 1 - scrolled / (heroHeight * 0.7);
    fadeLogo = Math.max(fadeLogo, 0.6);

    let scale = 1 - (scrolled / heroHeight) * 0.15;
    scale = Math.max(scale, 0.85);

    heroLogo.style.opacity = fadeLogo;
    heroLogo.style.transform = `scale(${scale})`;

    // Fade text
    let fadeText = 1 - scrolled / (heroHeight * 0.7);
    fadeText = Math.max(fadeText, 0.6);
    texts.forEach((el) => (el.style.opacity = fadeText));
  });
});

// === Init team photos ===
applyPhotos();
window.addEventListener("scroll", () => {
  const heroHeight = document.querySelector("#top").offsetHeight;
  const scrolled = window.scrollY;

  // Shrink navbar logo when past hero
  const head = document.querySelector(".head");
  if (scrolled > heroHeight - 60) {
    head.classList.add("shrink");
  } else {
    head.classList.remove("shrink");
  }
});
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
const body = document.body;

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  nav.classList.toggle('show');
  body.classList.toggle('menu-open'); // ✅ lock/unlock scroll
});
