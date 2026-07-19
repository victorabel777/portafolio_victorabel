document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuButton = document.querySelector(".menu-toggle");
  const menuLabel = menuButton?.querySelector(".sr-only");
  const nav = document.querySelector(".main-nav");
  const year = document.querySelector("#currentYear");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const setMenuState = (isOpen) => {
    body.classList.toggle("menu-open", isOpen);
    menuButton?.setAttribute("aria-expanded", String(isOpen));

    if (menuLabel) {
      menuLabel.textContent = isOpen ? "Cerrar menú" : "Abrir menú";
    }
  };

  menuButton?.addEventListener("click", () => {
    setMenuState(!body.classList.contains("menu-open"));
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 840) {
      setMenuState(false);
    }
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reducedMotion && "IntersectionObserver" in window) {
    body.classList.add("animations");

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px" }
    );

    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
  }

  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const sectionLinks = navLinks
    .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter((item) => item.section);

  if (sectionLinks.length && "IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        navLinks.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${visible.target.id}`;
          link.classList.toggle("active", isCurrent);

          if (isCurrent) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      { rootMargin: "-35% 0px -55%", threshold: [0, 0.2, 0.5] }
    );

    sectionLinks.forEach(({ section }) => activeObserver.observe(section));
  }
});
