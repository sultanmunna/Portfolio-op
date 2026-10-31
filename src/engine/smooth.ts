import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initSmooth(reduce: boolean) {
  let lenis: Lenis | undefined;

  const onScrollTo = (event: Event) => {
    const id = (event as CustomEvent<string>).detail;
    const target = document.getElementById(id);
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target);
    } else {
      target.scrollIntoView({ block: "start" });
    }
  };
  window.addEventListener("site:scrollto", onScrollTo);

  if (!reduce) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis!.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("site:scrollto", onScrollTo);
      gsap.ticker.remove(raf);
      lenis!.destroy();
    };
  }

  return () => {
    window.removeEventListener("site:scrollto", onScrollTo);
  };
}
