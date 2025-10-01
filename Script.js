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
    texts.forEach(el => el.classList.add("reveal"));
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
    texts.forEach(el => el.style.opacity = fadeText);
  });
});
