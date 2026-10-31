import * as THREE from "three";
import { attachOrbit, baseScene, camera, materials } from "../helpers.js";

const BEADS = 64;

export function createValve({ environment, reduce, view, requestRender }) {
  const scene = baseScene(environment);
  const cam = camera(5.4);
  const group = new THREE.Group();
  scene.add(group);

  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3.6, 32), materials.clay());
  pipe.rotation.z = Math.PI / 2;
  group.add(pipe);
  for (const x of [-1.8, 1.8]) {
    const flange = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.05, 16, 48), materials.chrome());
    flange.rotation.y = Math.PI / 2;
    flange.position.x = x;
    group.add(flange);
  }
  for (const x of [-1.8, 1.8]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.78, 16), materials.inked());
    leg.position.set(x, -0.72, 0);
    group.add(leg);
  }

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 16), materials.inked());
  stem.position.set(0, 0.5, 0);
  group.add(stem);

  const wheel = new THREE.Group();
  wheel.add(new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.055, 16, 64), materials.chrome()));
  for (let i = 0; i < 4; i++) {
    const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.98, 12), materials.chrome());
    spoke.rotation.z = (i / 4) * Math.PI;
    wheel.add(spoke);
  }
  wheel.add(new THREE.Mesh(new THREE.SphereGeometry(0.09, 24, 24), materials.chrome()));
  wheel.position.set(0, 0.85, 0);
  wheel.rotation.x = 0.5;
  group.add(wheel);

  const gauge = new THREE.Group();
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.07, 24), materials.chrome());
  dial.rotation.x = Math.PI / 2;
  const face = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.02, 24), materials.clay());
  face.rotation.x = Math.PI / 2;
  face.position.z = 0.035;
  const needleGeo = new THREE.BoxGeometry(0.02, 0.11, 0.015);
  needleGeo.translate(0, 0.05, 0);
  const needle = new THREE.Mesh(needleGeo, materials.inked());
  needle.position.z = 0.05;
  gauge.add(dial, face, needle);
  gauge.position.set(1.0, 0.42, 0);
  group.add(gauge);

  const beadMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.055, 12, 12), materials.clay(), BEADS);
  const beads = [];
  for (let i = 0; i < BEADS; i++) {
    beads.push({
      x: -2.4 + Math.random() * 4.6,
      y: (Math.random() - 0.5) * 0.18,
      speed: 0.7 + Math.random() * 0.5,
      deflect: 0,
      vy: 0,
    });
  }
  group.add(beadMesh);

  let flow = 1;
  let throttle = 0;
  let wheelSpin = 0;
  const dummy = new THREE.Object3D();
  const cobalt = new THREE.Color(0x002fa7);
  const clay = new THREE.Color(0xe9e4da);
  for (let i = 0; i < BEADS; i++) beadMesh.setColorAt(i, clay);
  beadMesh.instanceColor.needsUpdate = true;

  const orbit = attachOrbit(view, group, { requestRender, reduce, ry: -0.3 });

  orbit.onClick = () => {
    if (throttle <= 0) {
      throttle = 3.2;
      wheelSpin = 2.1;
    }
  };

  return {
    scene,
    camera: cam,
    update(dt, time) {
      orbit.update(dt, time);
      if (throttle > 0) throttle -= dt;
      const targetFlow = throttle > 0 ? 0.12 : 1;
      flow += (targetFlow - flow) * Math.min(1, dt * 4);
      needle.rotation.z = -0.9 - (1 - flow) * 1.6;
      if (wheelSpin > 0) {
        const step = Math.min(wheelSpin, dt * 2.6);
        wheel.rotation.z += step;
        wheelSpin -= step;
      }

      for (let i = 0; i < BEADS; i++) {
        const bead = beads[i];
        if (bead.deflect > 0) {
          bead.vy -= dt * 3.2;
          bead.x += dt * 0.4;
          bead.y += bead.vy * dt;
          if (bead.y < -2.2) {
            bead.deflect = 0;
            bead.x = -2.4;
            bead.y = (Math.random() - 0.5) * 0.18;
            beadMesh.setColorAt(i, clay);
            beadMesh.instanceColor.needsUpdate = true;
          }
        } else {
          bead.x += bead.speed * flow * dt * 1.6;
          if (throttle > 0 && bead.x > -0.05 && bead.x < 0.05 && Math.random() < 0.35) {
            bead.deflect = 1;
            bead.vy = 0.6;
            beadMesh.setColorAt(i, cobalt);
            beadMesh.instanceColor.needsUpdate = true;
          } else if (bead.x > 2.4) {
            bead.x = -2.4;
            bead.y = (Math.random() - 0.5) * 0.18;
          }
        }
        dummy.position.set(bead.x, bead.y, bead.deflect > 0 ? 0.12 : 0);
        dummy.updateMatrix();
        beadMesh.setMatrixAt(i, dummy.matrix);
      }
      beadMesh.instanceMatrix.needsUpdate = true;
    },
  };
}
