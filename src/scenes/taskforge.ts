import { gsap } from "gsap";
import { buildStage, svgEl, wire } from "./kit";

const WORKERS = [
  { cx: 490, cy: 170 },
  { cx: 590, cy: 170 },
  { cx: 690, cy: 170 },
];

const TILE_W = 26;
const TILE_H = 14;
const RAIL_Y = 170;
const PICK_X = 430;

export function mountTaskforge(
  stage: HTMLDivElement,
  button: HTMLButtonElement,
  label: string,
  reduce: boolean,
) {
  const svg = buildStage(label);
  stage.appendChild(svg);

  svgEl("rect", { x: 40, y: 48, width: 88, height: 44, class: "s-frame" }, svg);
  svgEl("text", { x: 40, y: 40, class: "s-text" }, svg).textContent = "intake";
  svgEl("line", { x1: 84, y1: RAIL_Y, x2: PICK_X, y2: RAIL_Y, class: "s-rail" }, svg);
  const backlogText = svgEl("text", { x: 40, y: 340, class: "s-text" }, svg);
  backlogText.textContent = "backlog: 0";
  svgEl("text", { x: 706, y: 232, class: "s-text" }, svg).textContent = "done";

  const rings = WORKERS.map(({ cx, cy }) => {
    svgEl("rect", { x: cx - 28, y: cy - 28, width: 56, height: 56, class: "s-frame" }, svg);
    return svgEl(
      "circle",
      {
        cx,
        cy,
        r: 20,
        class: "s-ring",
        pathLength: 100,
        strokeDasharray: 100,
        strokeDashoffset: 100,
        transform: `rotate(-90 ${cx} ${cy})`,
      },
      svg,
    );
  });

  const ctx = gsap.context(() => {}, stage);
  const timers: gsap.core.Tween[] = [];
  const schedule = (fn: () => void, delay: number) => {
    const timer = gsap.delayedCall(delay, fn);
    timers.push(timer);
    return timer;
  };

  const zone: SVGRectElement[] = [];
  const pile: SVGRectElement[] = [];
  let doneCount = 0;
  let running = false;

  const setBacklog = () => {
    backlogText.textContent = `backlog: ${zone.length}`;
  };

  const slot = (index: number) => ({
    x: 712 + (index % 2) * 32,
    y: 306 - Math.floor(index / 2) * 18,
  });

  const spawn = (fast = false) =>
    ctx.add(() => {
      if (zone.length >= 4) return;
      const tile = svgEl("rect", { width: TILE_W, height: TILE_H, class: "s-tile" }, svg);
      gsap.set(tile, { x: 70, y: 62 });
      gsap
        .timeline()
        .to(tile, { x: 84, y: RAIL_Y - TILE_H / 2, duration: 0.45, ease: "power1.in" })
        .to(tile, { x: PICK_X - TILE_W, duration: fast ? 1.6 : 2.2, ease: "none" })
        .add(() => {
          zone.push(tile);
          setBacklog();
        });
    });

  const finishJob = (tile: SVGRectElement) => {
    tile.remove();
    ctx.add(() => {
      const spot = slot(doneCount);
      doneCount += 1;
      const stacked = svgEl(
        "rect",
        { x: spot.x, y: spot.y, width: TILE_W, height: TILE_H, class: "s-tile", opacity: 0 },
        svg,
      );
      gsap.to(stacked, { opacity: 1, duration: 0.3 });
      pile.push(stacked);
      if (pile.length >= 8) {
        const old = pile.splice(0, pile.length);
        gsap.to(old, {
          opacity: 0,
          duration: 0.4,
          delay: 0.6,
          onComplete: () => old.forEach((t) => t.remove()),
        });
      }
    });
  };

  const startWorker = (worker: (typeof WORKERS)[number], ring: SVGCircleElement) => {
    const tick = () => {
      if (!running) return;
      const job = zone.shift();
      setBacklog();
      if (!job) {
        schedule(tick, 0.4);
        return;
      }
      ctx.add(() => {
        gsap.to(job, {
          x: worker.cx - TILE_W / 2,
          y: worker.cy - TILE_H / 2,
          duration: 0.35,
          ease: "power1.inOut",
          onComplete: () => {
            gsap.fromTo(
              ring,
              { strokeDashoffset: 100 },
              {
                strokeDashoffset: 0,
                duration: 1.1,
                ease: "none",
                onComplete: () => {
                  gsap.set(ring, { strokeDashoffset: 100 });
                  if (Math.random() < 0.15) {
                    job.setAttribute("class", "s-tile-retry");
                    ctx.add(() => {
                      gsap.to(job, {
                        x: 84,
                        y: RAIL_Y - TILE_H / 2,
                        duration: 0.8,
                        delay: 0.35,
                        ease: "power1.inOut",
                        onComplete: () => {
                          job.setAttribute("class", "s-tile");
                          zone.push(job);
                          setBacklog();
                        },
                      });
                    });
                  } else {
                    ctx.add(() => {
                      gsap.to(job, {
                        x: 700,
                        y: 260,
                        duration: 0.55,
                        ease: "power1.in",
                        onComplete: () => {
                          finishJob(job);
                        },
                      });
                    });
                  }
                  schedule(tick, 0.35);
                },
              },
            );
          },
        });
      });
    };
    schedule(tick, 0.3 + Math.random() * 0.6);
  };

  const play = () => {
    if (running) return;
    running = true;
    ctx.add(() => {
      const loopSpawn = () => {
        if (!running) return;
        spawn();
        schedule(loopSpawn, 1.1);
      };
      loopSpawn();
      WORKERS.forEach((worker, i) => startWorker(worker, rings[i]));
    });
  };

  const stop = () => {
    running = false;
  };

  const stillState = () =>
    ctx.add(() => {
      [0, 1, 2].forEach((i) => {
        const tile = svgEl("rect", { width: TILE_W, height: TILE_H, class: "s-tile" }, svg);
        gsap.set(tile, { x: 200 + i * 70, y: RAIL_Y - TILE_H / 2 });
      });
      gsap.set(rings[0], { strokeDashoffset: 40 });
      [0, 1, 2, 3].forEach((i) => {
        const spot = slot(i);
        svgEl(
          "rect",
          { x: spot.x, y: spot.y, width: TILE_W, height: TILE_H, class: "s-tile" },
          svg,
        );
      });
      backlogText.textContent = "backlog: 3";
    });

  const unwire = wire(stage, button, reduce, {
    play,
    stop,
    action: () => spawn(true),
    still: stillState,
  });

  return () => {
    unwire();
    stop();
    timers.forEach((timer) => timer.kill());
    ctx.revert();
  };
}
