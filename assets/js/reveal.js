export function initReveals() {
  const els = Array.from(document.querySelectorAll("[data-reveal]"));
  if (!els.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }

  els.forEach((el) => {
    const siblings = Array.from(
      el.parentElement.querySelectorAll(":scope > [data-reveal]"),
    );
    const index = siblings.indexOf(el);
    el.style.transitionDelay = `${Math.min(index, 5) * 70}ms`;
  });

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  els.forEach((el) => io.observe(el));
}
