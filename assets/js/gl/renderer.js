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

  // Attention: a pointer resting on or dragging one exhibit eases the other
  // visible machines toward stillness; the rate limiter throttles the visitor.
  const attention = { focus: null, scale: 1 };
  const STILL = 0.15;

  function watchAttention(view, exhibit) {
    view.addEventListener("pointerenter", () => {
      attention.focus = exhibit;
    });
    view.addEventListener("pointerleave", () => {
      if (attention.focus === exhibit) attention.focus = null;
    });
  }
  if (!reduce) {
    document.addEventListener("pointerleave", () => {
      attention.focus = null;
    });
    window.addEventListener("blur", () => {
      attention.focus = null;
    });
  }

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
    attention.scale += ((attention.focus ? STILL : 1) - attention.scale) * Math.min(1, dt * 3.5);
    for (const exhibit of exhibits) {
      const rect = culled(exhibit);
      if (!rect) continue;
      if (exhibit.update) exhibit.update(exhibit === attention.focus ? dt : dt * attention.scale, t);
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
      if (!reduce) watchAttention(view, exhibit);
      if (reduce) requestAnimationFrame(renderVisible);
      return exhibit;

    },
  };
}
