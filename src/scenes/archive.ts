import { gsap } from "gsap";
import { buildStage, drawLine, sceneLifecycle, svgEl, wire } from "./kit";

const ACCENT = "#e8a33d";
const BASE = "rgba(236, 231, 220, 0.55)";

const FIELD: Array<[number, number]> = [
  [268, 84], [300, 130], [330, 72], [356, 168], [382, 110], [402, 214],
  [418, 148], [252, 196], [286, 236], [318, 186], [342, 262], [374, 232],
  [438, 96], [460, 180], [488, 128], [506, 238], [522, 158], [542, 210],
  [560, 96], [578, 252], [596, 172], [610, 122], [626, 216], [648, 140],
  [662, 268], [676, 190], [692, 108], [706, 232], [722, 164], [738, 262],
  [276, 292], [360, 300], [452, 296], [540, 300],
];

const CHUNK_SPOTS: Array<[number, number]> = [
  [186, 96], [206, 148], [178, 208], [216, 118], [196, 244], [224, 186],
];

const ANSWER = [
  { x: 660, y: 158, w: 96 },
  { x: 660, y: 176, w: 72 },
  { x: 660, y: 194, w: 84 },
];

export function mountArchive(
  stage: HTMLDivElement,
  button: HTMLButtonElement,
  label: string,
  reduce: boolean,
) {
  const svg = buildStage(label);
  stage.appendChild(svg);

  svgEl("rect", { x: 48, y: 96, width: 104, height: 148, class: "s-frame" }, svg);
  const docLines = [0, 1, 2, 3].map((i) =>
    svgEl("line", { x1: 62, y1: 124 + i * 26, x2: 138, y2: 124 + i * 26, class: "s-dim" }, svg),
  );
  const chunks = CHUNK_SPOTS.map(() =>
    svgEl("rect", { width: 24, height: 16, class: "s-tile" }, svg),
  );
  const dots = FIELD.map(([x, y]) =>
    svgEl("circle", { cx: x, cy: y, r: 2.5, class: "s-dim" }, svg),
  );
  const query = svgEl("rect", { width: 8, height: 8, class: "s-accent" }, svg);
  const rings = [0, 1, 2].map(() =>
    svgEl("rect", { width: 15, height: 15, class: "s-accent-ring" }, svg),
  );
  const links = [0, 1, 2].map(() => svgEl("line", { class: "s-accent-line" }, svg));
  svgEl("text", { x: 660, y: 140, class: "s-text" }, svg).textContent = "answer";
  const bars = ANSWER.map(({ x, y, w }) =>
    svgEl("rect", { x, y, width: w, height: 6, class: "s-tile" }, svg),
  );

  const HOME = { x: 84, y: 316 };
  const END = { x: 428, y: 172 };
  let near = [6, 13, 16];

  const placeFocus = (indices: number[]) => {
    indices.forEach((dotIndex, i) => {
      const [x, y] = FIELD[dotIndex];
      gsap.set(rings[i], { x: x - 7.5, y: y - 7.5 });
      gsap.set(links[i], {
        attr: { x1: END.x + 4, y1: END.y + 4, x2: x, y2: y },
      });
    });
  };

  const life = sceneLifecycle(stage);
  const ctx = life.ctx;
  ctx.add(() => {
    gsap.set(query, { x: HOME.x, y: HOME.y, opacity: 0 });
    gsap.set(rings, { opacity: 0 });
    gsap.set(links, { opacity: 0 });
    gsap.set(chunks, { opacity: 0 });
    gsap.set(dots, { opacity: 0.22 });
    gsap.set(bars, { scaleX: 0, transformOrigin: "left center" });
  });

  let drift: gsap.core.Tween;
  let idle: gsap.core.Timeline;

  ctx.add(() => {
    drift = gsap.to(dots, {
      y: 3,
      duration: 2.4,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      stagger: { each: 0.06, from: "random" },
      paused: true,
    });

    idle = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.2 });
    idle
      .call(() =>
        ctx.add(() => {
          gsap.set(dots, { attr: { r: 2.5 }, fill: BASE, opacity: 0.22 });
          gsap.set(chunks, { opacity: 0, x: 0, y: 0 });
          gsap.set([rings, links], { opacity: 0 });
          gsap.set(query, { opacity: 0, x: HOME.x, y: HOME.y });
          gsap.set(bars, { scaleX: 0 });
        }),
      )
      .to(docLines, { opacity: 0.25, duration: 0.4 }, 0.2)
      .to(chunks, {
        opacity: 1,
        x: (i: number) => CHUNK_SPOTS[i][0] - 100,
        y: (i: number) => CHUNK_SPOTS[i][1] - 170,
        duration: 0.7,
        stagger: 0.07,
        ease: "power2.out",
      }, 0.4)
      .to(chunks, { opacity: 0.15, x: 300, y: 80, duration: 0.9, ease: "power1.in" }, 1.5)
      .to(dots, { opacity: 0.55, duration: 0.6 }, 1.6)
      .set(query, { opacity: 1 })
      .to(query, { x: END.x, y: END.y, duration: 1.2, ease: "power1.inOut" }, 1.7)
      .call(
        () =>
          ctx.add(() => {
            placeFocus(near);
            near.forEach((i, k) =>
              gsap.to(dots[i], { attr: { r: 4.5 }, fill: ACCENT, duration: 0.35, delay: k * 0.1 }),
            );
            rings.forEach((r, k) =>
              gsap.to(r, { opacity: 1, duration: 0.25, delay: k * 0.1 }),
            );
          }),
        undefined,
        2.9,
      )
      .call(
        () =>
          ctx.add(() => {
            links.forEach((line) => drawLine(line));
            gsap.set(links, { opacity: 1 });
          }),
        undefined,
        3.15,
      )
      .to(bars, { scaleX: 1, duration: 0.45, stagger: 0.1, ease: "power2.out" }, 3.4)
      .to({}, { duration: 1.2 })
      .call(() =>
        ctx.add(() => {
          gsap.to(query, { opacity: 0, duration: 0.4 });
          gsap.to([rings, links], { opacity: 0, duration: 0.4 });
          gsap.to(dots, { attr: { r: 2.5 }, fill: BASE, opacity: 0.22, duration: 0.5 });
          gsap.set(chunks, { opacity: 0, x: 0, y: 0 });
        }),
      );
  });

  const runInteraction = () =>
    ctx.add(() => {
      gsap
        .timeline()
        .set(query, { opacity: 1, x: HOME.x, y: HOME.y })
        .to(query, { x: END.x, y: END.y, duration: 1, ease: "power1.inOut" })
        .add(() => {
          const pool = FIELD.map((_, i) => i).filter((i) => !near.includes(i));
          near = [0, 1, 2].map(
            () => pool.splice(Math.floor(Math.random() * pool.length), 1)[0],
          );
          placeFocus(near);
          near.forEach((i, k) =>
            gsap.to(dots[i], { attr: { r: 4.5 }, fill: ACCENT, duration: 0.3, delay: k * 0.08 }),
          );
          rings.forEach((r, k) => gsap.to(r, { opacity: 1, duration: 0.2, delay: k * 0.08 }));
        })
        .add(() => {
          links.forEach((line) => drawLine(line));
          gsap.set(links, { opacity: 1 });
        }, "+=0.15")
        .fromTo(
          bars,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.4, stagger: 0.08, ease: "power2.out" },
          "+=0.05",
        )
        .to(query, { opacity: 0, duration: 0.4 }, "+=1.4")
        .to([rings, links], { opacity: 0, duration: 0.4 })
        .add(() => gsap.to(dots, { attr: { r: 2.5 }, fill: BASE, duration: 0.4 }));
    });

  const stillState = () =>
    ctx.add(() => {
      gsap.set(chunks, {
        opacity: 1,
        x: (i: number) => CHUNK_SPOTS[i][0] - 100,
        y: (i: number) => CHUNK_SPOTS[i][1] - 170,
      });
      gsap.set(dots, { opacity: 0.55, attr: { r: 2.5 }, fill: BASE });
      placeFocus(near);
      near.forEach((i) => gsap.set(dots[i], { attr: { r: 4.5 }, fill: ACCENT }));
      gsap.set(query, { opacity: 1, x: END.x, y: END.y });
      gsap.set(rings, { opacity: 1 });
      gsap.set(links, { opacity: 1, strokeDasharray: "none", strokeDashoffset: 0 });
      gsap.set(bars, { scaleX: 1 });
    });

  const unwire = wire(stage, button, reduce, {
    play: () => {
      idle.play();
      drift.play();
    },
    stop: () => {
      idle.pause();
      drift.pause();
    },
    action: runInteraction,
    still: stillState,
  });

  return () => {
    unwire();
    life.dispose();
  };
}
