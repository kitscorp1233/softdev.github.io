(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.querySelector(".nav-links");

  const setNavState = () => {
    if (!nav) return;
    if (window.scrollY > 10) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  setNavState();
  window.addEventListener("scroll", setNavState, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", navLinks.classList.contains("open") ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const navHeight = () => (nav ? nav.offsetHeight : 0);
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight() + 2;
      window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
      history.pushState(null, "", id);
    });
  });

  const revealEls = document.querySelectorAll(".reveal");
  if (!prefersReduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  const sectionIds = ["hero", "services", "why-me", "portfolio", "contact"];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  const navAnchors = Array.from(document.querySelectorAll(".nav-links a"))
    .filter((a) => (a.getAttribute("href") || "").startsWith("#"));

  const setActive = (id) => {
    navAnchors.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible && visible.target && visible.target.id) setActive(visible.target.id);
      },
      { threshold: [0.2, 0.35, 0.5, 0.65], rootMargin: "-20% 0px -55% 0px" }
    );

    sections.forEach((s) => activeObserver.observe(s));
  }

  const heroBg = document.querySelector(".hero-bg");
  if (!prefersReduced && heroBg) {
    let raf = null;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        const px = (x - 0.5) * 18;
        const py = (y - 0.5) * 18;
        heroBg.style.transform = `translate(${px}px, ${py}px)`;
        raf = null;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
  }

  const discordCard = document.querySelector('.contact-card[data-discord-id]');
  if (discordCard) {
    discordCard.addEventListener("click", () => {
      const id = discordCard.getAttribute("data-discord-id");
      if (!id || id === "1406388166805688495") return;
      navigator.clipboard?.writeText(id).catch(() => {});
    });
  }

  const yearEl = document.querySelector(".footer-bottom p");
  if (yearEl) {
    const year = new Date().getFullYear();
    yearEl.innerHTML = `&copy; ${year} Soft Dev Services. All rights reserved.`;
  }
})();
