import { gsap } from "gsap";
import { buildStage, svgEl, wire } from "./kit";

const CELLS = 5;

export function mountGatehouse(
  stage: HTMLDivElement,
  button: HTMLButtonElement,
  label: string,
  reduce: boolean,
) {
  const svg = buildStage(label);
  stage.appendChild(svg);

  svgEl("line", { x1: 320, y1: 110, x2: 400, y2: 180, class: "s-rail" }, svg);
  svgEl("line", { x1: 320, y1: 250, x2: 400, y2: 180, class: "s-rail" }, svg);
  svgEl("line", { x1: 400, y1: 180, x2: 620, y2: 180, class: "s-rail" }, svg);
  svgEl("text", { x: 348, y: 52, class: "s-text" }, svg).textContent = "tokens";
  const ok = svgEl("text", { x: 600, y: 172, class: "s-text s-text-ink", opacity: 0 }, svg);
  ok.textContent = "200";
  const no = svgEl("text", { x: 428, y: 340, class: "s-text s-text-ink", opacity: 0 }, svg);
  no.textContent = "429";

  const cells: SVGRectElement[] = [];
  for (let i = 0; i < CELLS; i++) {
    cells.push(
      svgEl("rect", { x: 404 + i * 22, y: 66, width: 16, height: 16, class: "s-cell" }, svg),
    );
  }

  const ctx = gsap.context(() => {}, stage);
  const timers: gsap.core.Tween[] = [];
  const schedule = (fn: () => void, delay: number) => {
    const timer = gsap.delayedCall(delay, fn);
    timers.push(timer);
    return timer;
  };

  let tokens = 3;
  let running = false;
  let active = 0;

  const paint = () =>
    cells.forEach((cell, i) =>
      cell.setAttribute("class", i < tokens ? "s-cell-full" : "s-cell"),
    );
  paint();

  const flash = (target: SVGTextElement) =>
    ctx.add(() => gsap.fromTo(target, { opacity: 1 }, { opacity: 0, duration: 0.7, delay: 0.2 }));

  const spawnPulse = () =>
    ctx.add(() => {
      if (active > 10) return;
      active += 1;
      const y0 = 130 + Math.random() * 100;
      const pulse = svgEl("rect", { width: 7, height: 7, class: "s-dim" }, svg);
      gsap.set(pulse, { x: 36, y: y0 });
      gsap
        .timeline({ onComplete: () => (pulse.remove(), (active -= 1)) })
        .to(pulse, { x: 320, duration: 1.5, ease: "none" })
        .to(pulse, { x: 396, y: 176, duration: 0.45, ease: "power1.in" })
        .call(() => {
          if (tokens > 0) {
            tokens -= 1;
            paint();
            ctx.add(() =>
              gsap
                .timeline()
                .to(pulse, { x: 620, y: 176, duration: 0.9, ease: "none" })
                .add(() => flash(ok)),
            );
          } else {
            pulse.setAttribute("class", "s-accent-ring");
            gsap.set(pulse, { width: 9, height: 9 });
            ctx.add(() =>
              gsap
                .timeline()
                .to(pulse, { x: 436, y: 300, duration: 0.7, ease: "power1.in" })
                .to(pulse, { y: 336, opacity: 0, duration: 0.4 })
                .add(() => flash(no)),
            );
          }
        });
    });

  const play = () => {
    if (running) return;
    running = true;
    const loopSpawn = () => {
      if (!running) return;
      spawnPulse();
      schedule(loopSpawn, 1.6);
    };
    const loopRefill = () => {
      if (!running) return;
      if (tokens < CELLS) {
        tokens += 1;
        paint();
      }
      schedule(loopRefill, 1.5);
    };
    loopSpawn();
    loopRefill();
  };

  const stop = () => {
    running = false;
  };

  const stillState = () =>
    ctx.add(() => {
      tokens = 2;
      paint();
      const pass = svgEl("rect", { width: 7, height: 7, class: "s-dim" }, svg);
      gsap.set(pass, { x: 520, y: 176 });
      const shed = svgEl("rect", { width: 9, height: 9, class: "s-accent-ring" }, svg);
      gsap.set(shed, { x: 436, y: 300 });
      gsap.set([ok, no], { opacity: 1 });
    });

  const unwire = wire(stage, button, reduce, {
    play,
    stop,
    action: () => {
      for (let i = 0; i < 8; i++) schedule(spawnPulse, i * 0.14);
    },
    still: stillState,
  });

  return () => {
    unwire();
    stop();
    timers.forEach((timer) => timer.kill());
    ctx.revert();
  };
}
