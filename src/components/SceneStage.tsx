"use client";

import { useEffect, useRef } from "react";
import { mountScene, type SceneId } from "@/scenes";

export function SceneStage({
  id,
  label,
  cta,
  caption,
}: {
  id: SceneId;
  label: string;
  cta: string;
  caption: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const button = btnRef.current;
    if (!stage || !button) return;
    return mountScene(stage, button, id, label);
  }, [id, label]);

  return (
    <figure className="scene">
      <div className="scene-stage" ref={stageRef} />
      <figcaption className="scene-bar">
        <span className="scene-cap">{caption}</span>
        <button className="btn btn-s" ref={btnRef} type="button">
          {cta}
        </button>
      </figcaption>
    </figure>
  );
}
