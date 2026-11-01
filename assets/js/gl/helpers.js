import * as THREE from "three";

export const materials = {
  chrome: () =>
    new THREE.MeshStandardMaterial({
      color: 0xd9d5cd,
      metalness: 1,
      roughness: 0.14,
      envMapIntensity: 1.3,
    }),
  glass: () =>
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.05,
      transmission: 1,
      thickness: 0.5,
      ior: 1.45,
    }),
  clay: () =>
    new THREE.MeshStandardMaterial({ color: 0xe9e4da, roughness: 0.55, metalness: 0 }),
  inked: () =>
    new THREE.MeshStandardMaterial({ color: 0x2a2824, roughness: 0.4, metalness: 0.2 }),
  cobalt: () =>
    new THREE.MeshStandardMaterial({ color: 0x002fa7, roughness: 0.35, metalness: 0.1 }),
};

export function baseScene(environment) {
  const scene = new THREE.Scene();
  scene.environment = environment;
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(2.5, 3, 2);
  scene.add(key);
  const fill = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(fill);
  return scene;
}

export function camera(z = 5) {
  const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  cam.position.set(0, 0.35, z);
  cam.lookAt(0, 0, 0);
  return cam;
}

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Drag-to-orbit with inertia, idle drift, and a click that is only a click
// when the pointer barely moved. Horizontal drag rotates; vertical drag
// tilts within a clamp; page scroll passes through (touch-action: pan-y).
// The view is keyboard-reachable: arrow keys orbit, Enter activates.
export function attachOrbit(view, group, { requestRender, reduce, ry = -0.45 }) {
  const state = {
    rx: 0.12,
    ry,
    vx: 0,
    dragging: false,
    moved: 0,
    lastX: 0,
    lastY: 0,
  };
  let onClick = null;
  view.tabIndex = 0;

  const activate = (event) => {
    if (onClick) onClick(event);
    if (reduce && requestRender) requestRender();
  };

  view.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") state.ry -= 0.25;
    else if (event.key === "ArrowRight") state.ry += 0.25;
    else if (event.key === "ArrowUp") state.rx = THREE.MathUtils.clamp(state.rx - 0.15, -0.45, 0.7);
    else if (event.key === "ArrowDown") state.rx = THREE.MathUtils.clamp(state.rx + 0.15, -0.45, 0.7);
    else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate(event);
      return;
    } else return;
    event.preventDefault();
    if (reduce && requestRender) requestRender();
  });

  view.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.moved = 0;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.vx = 0;
    view.setPointerCapture(event.pointerId);
    view.classList.add("is-grabbing");
  });

  view.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;
    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.moved += Math.abs(dx) + Math.abs(dy);
    state.ry += dx * 0.006;
    state.rx = THREE.MathUtils.clamp(state.rx + dy * 0.004, -0.45, 0.7);
    state.vx = dx * 0.006;
    if (reduce && requestRender) requestRender();
  });

  const release = (event) => {
    if (!state.dragging) return;
    state.dragging = false;
    view.classList.remove("is-grabbing");
    if (state.moved < 6 && onClick) onClick(event);
  };
  view.addEventListener("pointerup", release);
  view.addEventListener("pointercancel", release);

  return {
    set onClick(fn) {
      onClick = fn;
    },
    update(dt, t) {
      if (!state.dragging) {
        state.ry += state.vx;
        state.vx *= 0.94;
        if (!reduce) state.ry += dt * 0.1;
        state.rx += (0.12 - state.rx) * 0.04;
      }
      group.rotation.set(state.rx, state.ry, 0);
      if (!reduce) group.position.y = Math.sin(t * 0.7) * 0.05;
    },
  };
}
