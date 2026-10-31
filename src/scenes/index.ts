import type { SceneId } from "@/data/site";
import { mountArchive } from "./archive";
import { mountTaskforge } from "./taskforge";
import { mountGatehouse } from "./gatehouse";
import { mountAgentbench } from "./agentbench";

export type { SceneId };

export function mountScene(
  stage: HTMLDivElement,
  button: HTMLButtonElement,
  id: SceneId,
  label: string,
) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mounters = {
    archive: mountArchive,
    taskforge: mountTaskforge,
    gatehouse: mountGatehouse,
    agentbench: mountAgentbench,
  };
  return mounters[id](stage, button, label, reduce);
}
