import * as THREE from "three";
import { RoomEnvironment } from "../../vendor/RoomEnvironment.js";

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initStage(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch {
    document.documentElement.classList.add("no-gl");
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setScissorTest(true);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const exhibits = [];
  const clock = new THREE.Clock();

  function culled(exhibit) {
    const rect = exhibit.view.getBoundingClientRect();
    if (rect.bottom < -40 || rect.top > window.innerHeight + 40) return null;
    if (rect.width < 4 || rect.height < 4) return null;
    return rect;
  }

  function draw(exhibit, rect) {
    const { camera } = exhibit;
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    const y = window.innerHeight - rect.bottom;
    renderer.setViewport(rect.left, y, rect.width, rect.height);
    renderer.setScissor(rect.left, y, rect.width, rect.height);
    renderer.render(exhibit.scene, camera);
  }

  // Reduced motion renders on demand: dt=0 keeps drift and animations frozen
  // while drag, clicks, and static layouts still apply.
  function renderVisible() {
    for (const exhibit of exhibits) {
      const rect = culled(exhibit);
      if (!rect) continue;
      if (exhibit.update) exhibit.update(0, 0);
      draw(exhibit, rect);
    }
  }

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    for (const exhibit of exhibits) {
      const rect = culled(exhibit);
      if (!rect) continue;
      if (exhibit.update) exhibit.update(dt, t);
      draw(exhibit, rect);
    }
  }

  if (!reduce) renderer.setAnimationLoop(frame);
  if (reduce) {
    // the canvas is fixed, so painted pixels must follow scroll
    window.addEventListener("scroll", renderVisible, { passive: true });
  }

  window.addEventListener("resize", () => {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (reduce) renderVisible();
  });

  return {
    register(view, factory) {
      const exhibit = factory({
        environment,
        reduce,
        view,
        requestRender: renderVisible,
      });
      exhibit.view = view;
      exhibits.push(exhibit);
      if (reduce) requestAnimationFrame(renderVisible);
      return exhibit;
    },
  };
}
