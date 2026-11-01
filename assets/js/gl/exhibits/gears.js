import * as THREE from "three";
import { attachOrbit, baseScene, camera, materials } from "../helpers.js";

function makeGear(radius, teeth, depth, material) {
  const gear = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, depth, 48), material);
  body.rotation.x = Math.PI / 2;
  gear.add(body);
  const toothGeo = new THREE.BoxGeometry(radius * 0.22, depth * 1.05, radius * 0.3);
  for (let i = 0; i < teeth; i++) {
    const angle = (i / teeth) * Math.PI * 2;
    const tooth = new THREE.Mesh(toothGeo, material);
    tooth.position.set(Math.cos(angle) * (radius + radius * 0.12), 0, Math.sin(angle) * (radius + radius * 0.12));
    tooth.rotation.y = -angle;
    gear.add(tooth);
  }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.22, radius * 0.22, depth * 1.6, 24), material);
  hub.rotation.x = Math.PI / 2;
  gear.add(hub);
  return gear;
}

export function createGears({ environment, reduce, view, requestRender }) {
  const scene = baseScene(environment);
  const cam = camera(7.0);
  const group = new THREE.Group();
  scene.add(group);

  const gearA = makeGear(0.95, 12, 0.22, materials.chrome());
  gearA.position.set(-0.85, -0.35, 0);
  const gearB = makeGear(0.62, 9, 0.22, materials.inked());
  gearB.position.set(1.22, -0.66, 0);
  const gearC = makeGear(0.48, 7, 0.22, materials.inked());
  gearC.position.set(0.22, 1.3, 0);
  group.add(gearA, gearB, gearC);

  const base = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.08, 1.4), materials.clay());
  base.position.set(0.1, -1.82, 0);
  group.add(base);
  for (const [x, axle] of [[-0.85, -0.35], [1.22, -0.66], [0.22, 1.3]]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, axle + 1.78, 16), materials.inked());
    post.position.set(x, (axle - 1.78) / 2, -0.24);
    group.add(post);
  }
  for (const z of [-0.19, 0.19]) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.34, 0.04), materials.inked());
    wall.position.set(-0.85, -1.6, z);
    group.add(wall);
  }
  const chuteFloor = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.38), materials.inked());
  chuteFloor.position.set(-0.85, -1.76, 0);
  group.add(chuteFloor);

  const blocks = [];
  const blockGeo = new THREE.BoxGeometry(0.16, 0.12, 0.12);
  for (let i = 0; i < 4; i++) {
    const block = new THREE.Mesh(blockGeo, materials.cobalt());
    group.add(block);
    blocks.push({ mesh: block, angle: (i / 4) * Math.PI * 2 + Math.PI / 12, dropping: 0 });
  }

  let angle = 0;
  let speed = 0.55;
  let burst = 0;

  const orbit = attachOrbit(view, group, { requestRender, reduce, ry: -0.35 });

  orbit.onClick = () => {
    burst = 2.2;
  };

  return {
    scene,
    camera: cam,
    update(dt, time) {
      orbit.update(dt, time);
      if (burst > 0) burst -= dt;
      const target = burst > 0 ? 2.4 : 0.55;
      speed += (target - speed) * Math.min(1, dt * 3);
      angle += speed * dt;
      gearA.rotation.z = angle;
      gearB.rotation.z = -angle * (0.95 / 0.62) * 0.92;
      gearC.rotation.z = angle * (0.95 / 0.48) * 0.92;

      for (const block of blocks) {
        if (block.dropping > 0) {
          block.dropping += dt;
          const p = block.dropping / 0.7;
          block.mesh.position.x += (-0.85 - block.mesh.position.x) * Math.min(1, dt * 10);
          block.mesh.position.y = Math.max(-1.68, block.mesh.position.y - dt * 2.2);
          block.mesh.scale.setScalar(Math.max(0.001, 1 - p));
          if (p >= 1) {
            block.dropping = 0;
            const gap = Math.round((-Math.PI / 2 - Math.PI / 12 - angle) / (Math.PI / 6));
            block.angle = Math.PI / 12 + gap * (Math.PI / 6);
            block.mesh.scale.setScalar(1);
          }
        } else {
          const a = block.angle + angle;
          block.mesh.position.set(
            -0.85 + Math.cos(a) * 1.19,
            -0.35 + Math.sin(a) * 1.19,
            0,
          );
          block.mesh.rotation.set(0, 0, a + Math.PI / 2);
          if (!reduce && Math.random() < dt * 0.25 && Math.sin(a) < -0.7) block.dropping = 0.001;
        }
      }
    },
  };
}
