  // === Hero Animation + Scroll ===
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector("#top");
  const heroLogo = document.getElementById("hero-logo");
  const navbarLogo = document.getElementById("navbar-logo");
  const texts = document.querySelectorAll(".hero-headline, .hero-lead");

  if (!hero || !heroLogo || !navbarLogo) return;

  // Reveal on load
  setTimeout(() => {
    heroLogo.classList.add("reveal");
    texts.forEach(el => el.classList.add("reveal"));
  }, 300);

  // Scroll effect
  window.addEventListener("scroll", () => {
    const heroHeight = hero.offsetHeight;
    const scrolled = window.scrollY;

    // Fade + scale Hero logo
    let fadeLogo = Math.max(1 - scrolled / (heroHeight * 0.7), 0.666);
    let scale = Math.max(1 - (scrolled / heroHeight) * 0.15, 0.85);

    heroLogo.style.opacity = fadeLogo;
    heroLogo.style.transform = `scale(${scale})`;

    // Text fade
    let fadeText = Math.max(1 - scrolled / (heroHeight * 0.7), 0.666);
    texts.forEach(el => el.style.opacity = fadeText);

    // Navbar logo visibility
    if (scrolled >= heroHeight) {
      navbarLogo.classList.add("visible");
    } else {
      navbarLogo.classList.remove("visible");
    }
  });
});

// === Theme Toggle + Logo Switching ===
(function(){
  const THEMES = ["darkblue","skyblue","ochre","white"];
  const KEY = "yccc-theme";
  const root = document.body;
  const navbarLogo = document.getElementById("navbar-logo");
  const heroLogo = document.getElementById("hero-logo");

  function updateLogos(theme){
    if (theme === "darkblue") {
      navbarLogo.src = "CCC_Logo_Light.png";
      heroLogo.src = "CCC_Logo_Dark.png"; // keep hero dark for contrast
    } else {
      navbarLogo.src = "CCC_Logo_Dark.png";
      heroLogo.src = "CCC_Logo_Dark.png";
    }
  }

  function apply(theme){
    if(!THEMES.includes(theme)) theme="white";
    root.classList.remove(...THEMES.map(t=>"theme-"+t));
    root.classList.add("theme-"+theme);
    localStorage.setItem(KEY, theme);
    document.querySelectorAll(".theme-toggle [data-theme]").forEach(btn=>{
      btn.setAttribute("aria-pressed", String(btn.dataset.theme===theme));
    });
    updateLogos(theme);
  }

  function init(){
    document.querySelectorAll(".theme-toggle [data-theme]").forEach(btn=>{
      btn.addEventListener("click", ()=>apply(btn.dataset.theme));
    });
    apply(localStorage.getItem(KEY) || "white");
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
