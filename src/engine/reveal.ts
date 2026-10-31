import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initReveals(reduce: boolean) {
  if (reduce) return;

  const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
  const triggers: ScrollTrigger[] = [];

  els.forEach((el) => {
    gsap.set(el, { y: 28, opacity: 0 });
    triggers.push(
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () =>
          gsap.to(el, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }),
      }),
    );
  });

  return () => {
    triggers.forEach((trigger) => trigger.kill());
    gsap.set(els, { clearProps: "all" });
  };
}
