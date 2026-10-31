import { gsap } from "gsap";

const SVG_NS = "http://www.w3.org/2000/svg";

export function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>,
  parent?: Element,
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, String(value));
  }
  parent?.appendChild(node);
  return node;
}

export function buildStage(label: string): SVGSVGElement {
  return svgEl("svg", {
    viewBox: "0 0 800 360",
    class: "scene-svg",
    role: "img",
    "aria-label": label,
  });
}

export type SceneApi = {
  play: () => void;
  stop: () => void;
  action: () => void;
  still: () => void;
};

export function wire(
  stage: HTMLDivElement,
  button: HTMLButtonElement,
  reduce: boolean,
  api: SceneApi,
) {
  if (reduce) {
    api.still();
    button.addEventListener("click", api.action);
    return () => button.removeEventListener("click", api.action);
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) api.play();
        else api.stop();
      }
    },
    { threshold: 0.2 },
  );
  io.observe(stage);
  button.addEventListener("click", api.action);

  return () => {
    io.disconnect();
    button.removeEventListener("click", api.action);
  };
}

export function drawLine(line: SVGLineElement) {
  const length = Math.hypot(
    Number(line.getAttribute("x2")) - Number(line.getAttribute("x1")),
    Number(line.getAttribute("y2")) - Number(line.getAttribute("y1")),
  );
  gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
  gsap.to(line, { strokeDashoffset: 0, duration: 0.45, ease: "power1.out" });
}

export function sceneLifecycle(stage: HTMLDivElement) {
  const ctx = gsap.context(() => {}, stage);
  const timers: gsap.core.Tween[] = [];
  const schedule = (fn: () => void, delay: number) => {
    const timer = gsap.delayedCall(delay, fn);
    timers.push(timer);
    return timer;
  };
  return {
    ctx,
    schedule,
    dispose: () => {
      timers.forEach((timer) => timer.kill());
      ctx.revert();
    },
  };
}
