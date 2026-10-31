import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initSmooth } from "./smooth";
import { initReveals } from "./reveal";
import { initPacket } from "./packet";

gsap.registerPlugin(ScrollTrigger);

export function initEngine() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cleanups = [initSmooth(reduce), initReveals(reduce), initPacket(reduce)];

  const playIntro = () => {
    const targets = document.querySelectorAll("[data-intro]");
    if (targets.length) {
      gsap.to(targets, {
        yPercent: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.09,
        delay: 0.15,
      });
    }
  };

  if (!reduce) {
    gsap.set("[data-intro]", { yPercent: 112 });
    if (document.documentElement.classList.contains("is-ready")) {
      playIntro();
    } else {
      window.addEventListener("site:ready", playIntro, { once: true });
    }
  }

  document.fonts.ready.then(() => ScrollTrigger.refresh());

  return () => {
    cleanups.forEach((dispose) => dispose?.());
  };
}
