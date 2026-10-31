"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function Loader() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const fill = fillRef.current;
    const count = countRef.current;
    if (!root || !fill || !count) return;

    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () => {
      html.classList.remove("is-loading");
      html.classList.add("is-ready");
      window.dispatchEvent(new Event("site:ready"));
      setDone(true);
    };

    if (reduce) {
      finish();
      return;
    }

    html.classList.add("is-loading");
    const state = { n: 0 };
    const counter = gsap.to(state, {
      n: 92,
      duration: 1.4,
      ease: "power1.inOut",
      onUpdate: () => {
        count.textContent = String(Math.round(state.n));
      },
    });

    const loaded = Promise.all([
      document.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, 900)),
    ]);
    const cap = new Promise((resolve) => setTimeout(resolve, 1500));

    let exit: gsap.core.Timeline | undefined;
    Promise.race([loaded, cap]).then(() => {
      exit = gsap
        .timeline({ onComplete: finish })
        .to(state, {
          n: 100,
          duration: 0.3,
          ease: "power1.out",
          onUpdate: () => {
            count.textContent = String(Math.round(state.n));
          },
        })
        .to(fill, { scaleX: 1, duration: 0.3, ease: "power2.out" }, "<")
        .to(root, { yPercent: -100, duration: 0.8, ease: "power3.inOut" }, "+=0.1");
    });

    return () => {
      counter.kill();
      exit?.kill();
      html.classList.remove("is-loading");
    };
  }, []);

  if (done) return null;

  return (
    <div className="loader" ref={rootRef} aria-hidden="true">
      <div className="loader-inner">
        <p className="loader-label">
          <span>sultan mahmud</span>
          <span ref={countRef}>0</span>
        </p>
        <div className="loader-line">
          <div className="loader-line-fill" ref={fillRef} />
        </div>
      </div>
    </div>
  );
}
