import { gsap } from "gsap";
import { buildStage, svgEl, wire } from "./kit";

const TOOL_X = [190, 400, 610];
const TOOL_LABEL = ["retriever", "sql", "http"];
const TOOL_Y = 180;
const PLAN = { x: 400, y: 56 };
const ANS = { x: 400, y: 304 };

export function mountAgentbench(
  stage: HTMLDivElement,
  button: HTMLButtonElement,
  label: string,
  reduce: boolean,
) {
  const svg = buildStage(label);
  stage.appendChild(svg);

  svgEl("rect", { x: 356, y: 36, width: 88, height: 40, class: "s-frame" }, svg);
  const planText = svgEl(
    "text",
    { x: 400, y: 60, "text-anchor": "middle", class: "s-text s-text-ink" },
    svg,
  );
  planText.textContent = "plan";

  const toolRects = TOOL_X.map((tx, i) => {
    svgEl("line", { x1: 400, y1: 76, x2: tx, y2: TOOL_Y - 20, class: "s-rail" }, svg);
    svgEl("line", { x1: tx, y1: TOOL_Y + 20, x2: 400, y2: 284, class: "s-rail" }, svg);
    const rect = svgEl("rect", { x: tx - 48, y: TOOL_Y - 20, width: 96, height: 40, class: "s-frame" }, svg);
    const text = svgEl(
      "text",
      { x: tx, y: TOOL_Y + 4, "text-anchor": "middle", class: "s-text" },
      svg,
    );
    text.textContent = TOOL_LABEL[i];
    return rect;
  });

  svgEl("rect", { x: 356, y: 284, width: 88, height: 40, class: "s-frame" }, svg);
  const answerFill = svgEl("rect", { x: 358, y: 286, width: 84, height: 36, class: "s-accent", opacity: 0 }, svg);
  const answerText = svgEl(
    "text",
    { x: 400, y: 308, "text-anchor": "middle", class: "s-text s-text-ink" },
    svg,
  );
  answerText.textContent = "answer";

  svgEl("rect", { x: 664, y: 56, width: 120, height: 132, class: "s-frame" }, svg);
  svgEl("text", { x: 664, y: 48, class: "s-text" }, svg).textContent = "trace";
  const traceGroup = svgEl("g", {}, svg);

  const ctx = gsap.context(() => {}, stage);
  const timers: gsap.core.Tween[] = [];
  const schedule = (fn: () => void, delay: number) => {
    const timer = gsap.delayedCall(delay, fn);
    timers.push(timer);
    return timer;
  };

  let artifacts: SVGRectElement[] = [];
  let running = false;
  let t0 = 0;

  const stamp = () => Math.round(performance.now() - t0);

  const trace = (text: string) =>
    ctx.add(() => {
      const lines = traceGroup.querySelectorAll("text");
      if (lines.length >= 6) lines[0].remove();
      const entry = svgEl(
        "text",
        { x: 672, y: 80 + lines.length * 18, class: "s-trace", opacity: 0 },
        traceGroup,
      );
      entry.textContent = text;
      gsap.to(entry, { opacity: 1, duration: 0.25 });
    });

  const clearArtifacts = () => {
    artifacts.forEach((a) => a.remove());
    artifacts = [];
  };

  const run = () =>
    ctx.add(() => {
      clearArtifacts();
      t0 = performance.now();
      trace(`[${stamp()}ms] plan: 3 steps`);
      TOOL_X.forEach((tx, i) => {
        const out = svgEl("rect", { width: 6, height: 6, class: "s-accent", opacity: 0 }, svg);
        const back = svgEl("rect", { width: 6, height: 6, class: "s-accent", opacity: 0 }, svg);
        artifacts.push(out, back);
        gsap
          .timeline({ delay: i * 0.55 })
          .set(out, { opacity: 1, x: PLAN.x - 3, y: PLAN.y - 3 })
          .to(out, { x: tx - 3, y: TOOL_Y - 3, duration: 0.45, ease: "power1.in" })
          .add(() => {
            toolRects[i].classList.add("s-node-lit");
            trace(`[${stamp()}ms] tool: ${TOOL_LABEL[i]} ok`);
            gsap.set(back, { opacity: 1, x: tx - 3, y: TOOL_Y - 3 });
          })
          .to(back, { x: ANS.x - 3, y: ANS.y - 3, duration: 0.45, ease: "power1.out" }, "+=0.1")
          .add(() => {
            gsap.to(out, { opacity: 0, duration: 0.2 });
            gsap.to(back, { opacity: 0, duration: 0.2 });
            gsap.to(answerFill, { opacity: (i + 1) / TOOL_X.length, duration: 0.3 });
            if (i === TOOL_X.length - 1) trace(`[${stamp()}ms] answer ready`);
          });
      });
    });

  const play = () => {
    if (running) return;
    running = true;
    run();
    const loop = () => {
      if (!running) return;
      schedule(run, 4.5);
      schedule(loop, 9);
    };
    schedule(loop, 9);
  };

  const stop = () => {
    running = false;
  };

  const stillState = () =>
    ctx.add(() => {
      toolRects.forEach((rect) => rect.classList.add("s-node-lit"));
      gsap.set(answerFill, { opacity: 1 });
      ["plan: 3 steps", "tool: retriever ok", "tool: sql ok", "tool: http ok", "answer ready"].forEach(
        (line, i) => {
          const entry = svgEl(
            "text",
            { x: 672, y: 80 + i * 18, class: "s-trace" },
            traceGroup,
          );
          entry.textContent = line;
        },
      );
    });

  const unwire = wire(stage, button, reduce, {
    play,
    stop,
    action: run,
    still: stillState,
  });

  return () => {
    unwire();
    stop();
    timers.forEach((timer) => timer.kill());
    ctx.revert();
  };
}
