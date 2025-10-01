//// === Hero Animation + Logo Fade ===
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector("#top");
  const heroLogo = document.getElementById("hero-logo");
  const navbarLogo = document.getElementById("navbar-logo");
  const texts = document.querySelectorAll(".hero-headline, .hero-lead");

  if (!hero || !heroLogo || !navbarLogo) return;

  // Animate logo + text on load
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        heroLogo.classList.add("reveal");
        texts.forEach(el => el.classList.add("reveal"));
      }
    });
    if (heroLogo.classList.contains("reveal")) obs.disconnect();
  }, { threshold: 0.6 });

  observer.observe(heroLogo);

  // Scroll behavior
  window.addEventListener("scroll", () => {
    const heroHeight = hero.offsetHeight;
    const scrolled = window.scrollY;

    // Fade + scale Hero logo
    let fadeLogo = 1 - scrolled / (heroHeight * 0.7);
    fadeLogo = Math.max(fadeLogo, 0.666);

    let scale = 1 - (scrolled / heroHeight) * 0.15;
    scale = Math.max(scale, 0.85);

    if (scrolled >= heroHeight) {
      fadeLogo = 0.666;
      scale = 0.85;
    }
    heroLogo.style.opacity = fadeLogo;
    heroLogo.style.transform = `scale(${scale})`;

    // Text fade only
    let fadeText = 1 - scrolled / (heroHeight * 0.7);
    fadeText = Math.max(fadeText, 0.666);
    if (scrolled >= heroHeight) fadeText = 0.666;
    texts.forEach(el => el.style.opacity = fadeText);

    // Navbar logo appears once Hero is scrolled past
    if (scrolled >= heroHeight) {
      navbarLogo.classList.add("visible");
    } else {
      navbarLogo.classList.remove("visible");
    }
  });

  // === THEME LOGO SWITCHER ===
  const THEMES = ["darkblue", "skyblue", "ochre", "white"];
  const KEY = "yccc-theme";

  function updateNavbarLogo(theme) {
    if (theme === "darkblue") {
      navbarLogo.src = "CCC_Logo_Light.png"; // Light logo for dark background
    } else {
      navbarLogo.src = "CCC_Logo_Dark.png"; // Dark logo for light backgrounds
    }
  }

  function applyTheme(theme) {
    if (!THEMES.includes(theme)) theme = "white";
    document.body.classList.remove(...THEMES.map(t => "theme-" + t));
    document.body.classList.add("theme-" + theme);
    localStorage.setItem(KEY, theme);
    updateNavbarLogo(theme);
  }

  // Init theme on page load
  const savedTheme = localStorage.getItem(KEY) || "white";
  applyTheme(savedTheme);

  // Hook into theme toggle buttons
  document.querySelectorAll(".theme-toggle [data-theme]").forEach(btn => {
    btn.addEventListener("click", () => {
      applyTheme(btn.dataset.theme);
    });
  });
});
