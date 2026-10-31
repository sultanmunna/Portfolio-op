import { initStage } from "./gl/renderer.js";
import { createLens } from "./gl/exhibits/lens.js";
import { createGears } from "./gl/exhibits/gears.js";
import { createValve } from "./gl/exhibits/valve.js";
import { createOrrery } from "./gl/exhibits/orrery.js";
import { initReveals } from "./reveal.js";
import { initContact } from "./contact.js";

initReveals();
initContact();

const canvas = document.getElementById("gl");
const stage = initStage(canvas);
if (stage) {
  const factories = {
    lens: createLens,
    gears: createGears,
    valve: createValve,
    orrery: createOrrery,
  };
  document.querySelectorAll("[data-exhibit]").forEach((view) => {
    const factory = factories[view.dataset.exhibit];
    if (factory) stage.register(view, factory);
  });
}
