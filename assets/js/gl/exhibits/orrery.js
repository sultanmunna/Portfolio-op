import * as THREE from "three";
import { attachOrbit, baseScene, camera, materials } from "../helpers.js";

const RINGS = [
  { radius: 0.75, tilt: 0.35, speed: 0.5 },
  { radius: 1.05, tilt: -0.5, speed: -0.34 },
  { radius: 1.35, tilt: 1.0, speed: 0.24 },
];

export function createOrrery({ environment, reduce, view, requestRender }) {
  const scene = baseScene(environment);
  const cam = camera(5.4);
  const group = new THREE.Group();
  scene.add(group);

  const hub = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), materials.chrome());
  group.add(hub);

  const nodes = [];
  const pivots = [];
  RINGS.forEach((ring, index) => {
    const ringMesh = new THREE.Mesh(
      new THREE.TorusGeometry(ring.radius, 0.007, 8, 128),
      materials.inked(),
    );
    ringMesh.rotation.set(ring.tilt, index * 0.8, 0);
    group.add(ringMesh);

    const pivot = new THREE.Group();
    pivot.rotation.copy(ringMesh.rotation);
    group.add(pivot);

    const node = new THREE.Mesh(new THREE.SphereGeometry(0.085, 24, 24), materials.clay());
    node.position.set(ring.radius, 0, 0);
    pivot.add(node);
    pivots.push(pivot);
    nodes.push(node);
  });

  const pulseGeo = new THREE.SphereGeometry(0.045, 12, 12);
  const pulses = [];
  for (let i = 0; i < 3; i++) {
    const pulse = new THREE.Mesh(pulseGeo, materials.cobalt());
    pulse.visible = false;
    group.add(pulse);
    pulses.push({ mesh: pulse, active: false, t: 0, from: new THREE.Vector3() });
  }

  let emitClock = 0;

  function emitAll() {
    pulses.forEach((pulse, i) => {
      if (pulse.active) return;
      nodes[i].getWorldPosition(pulse.from);
      group.worldToLocal(pulse.from);
      pulse.active = true;
      pulse.t = 0;
      pulse.mesh.visible = true;
    });
  }

  const orbit = attachOrbit(view, group, { requestRender, reduce, ry: -0.4 });

  orbit.onClick = emitAll;

  return {
    scene,
    camera: cam,
    update(dt, time) {
      orbit.update(dt, time);
      pivots.forEach((pivot, i) => {
        pivot.rotation.z += RINGS[i].speed * dt;
      });
      if (!reduce) hub.scale.setScalar(1 + Math.sin(time * 1.4) * 0.03);

      if (!reduce) {
        emitClock += dt;
        if (emitClock > 2.2) {
          emitClock = 0;
          const free = pulses.find((p) => !p.active);
          if (free) {
            const i = Math.floor(Math.random() * nodes.length);
            nodes[i].getWorldPosition(free.from);
            group.worldToLocal(free.from);
            free.active = true;
            free.t = 0;
            free.mesh.visible = true;
          }
        }
      }

      for (const pulse of pulses) {
        if (!pulse.active) continue;
        pulse.t += dt / 0.8;
        if (pulse.t >= 1) {
          pulse.active = false;
          pulse.mesh.visible = false;
        } else {
          pulse.mesh.position.lerpVectors(pulse.from, new THREE.Vector3(0, 0, 0), pulse.t);
          pulse.mesh.scale.setScalar(Math.sin(pulse.t * Math.PI) + 0.3);
        }
      }
    },
  };
}
