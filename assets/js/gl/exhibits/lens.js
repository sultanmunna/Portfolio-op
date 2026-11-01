import * as THREE from "three";
import { attachOrbit, baseScene, camera, easeOutCubic, materials } from "../helpers.js";

const SHARDS = 90;
const COLS = 10;

export function createLens({ environment, reduce, view, requestRender }) {
  const scene = baseScene(environment);
  const cam = camera(5.4);
  const group = new THREE.Group();
  scene.add(group);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.125, 24, 96), materials.chrome());
  const seat = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.02, 12, 96), materials.inked());
  seat.position.z = 0.09;
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.07, 64), materials.glass());
  disc.rotation.x = Math.PI / 2;
  const lens = new THREE.Group();
  lens.add(rim, disc, seat);
  lens.rotation.x = 0.35;
  lens.position.set(0, 0.15, 0.3);
  group.add(lens);

  const shardMesh = new THREE.InstancedMesh(
    new THREE.TetrahedronGeometry(0.085),
    materials.clay(),
    SHARDS,
  );
  const scatter = [];
  const lattice = [];
  const clay = new THREE.Color(0xe9e4da);
  const ink = new THREE.Color(0x2a2824);
  const cobalt = new THREE.Color(0x002fa7);
  for (let i = 0; i < SHARDS; i++) {
    const inBand = i < 63;
    let r = inBand ? 1.28 + Math.random() * 0.2 : 0.55 + Math.random() * 1.05;
    let h = inBand ? (Math.random() - 0.5) * 0.5 : (Math.random() - 0.5) * 1.1;
    while (r + 0.11 * Math.abs(h) > 1.38) {
      r = inBand ? 1.28 + Math.random() * 0.2 : 0.55 + Math.random() * 1.05;
      h = inBand ? (Math.random() - 0.5) * 0.5 : (Math.random() - 0.5) * 1.1;
    }
    scatter.push({ r, h, a0: Math.random() * Math.PI * 2, w: 0.1 + Math.random() * 0.08 });
    lattice.push(
      new THREE.Vector3(
        ((i % COLS) - (COLS - 1) / 2) * 0.34,
        (Math.floor(i / COLS) - 4) * 0.3,
        -1.1,
      ),
    );
    if (i % 11 === 3) shardMesh.setColorAt(i, cobalt);
    else if (i % 4 === 2) shardMesh.setColorAt(i, clay);
    else shardMesh.setColorAt(i, ink);
  }
  shardMesh.instanceColor.needsUpdate = true;
  const cloud = new THREE.Group();
  cloud.rotation.x = 0.35;
  cloud.position.set(0, 0.1, 0.1);
  group.add(cloud);
  cloud.add(shardMesh);
  const xAxis = new THREE.Vector3(1, 0, 0);
  for (const p of lattice) p.sub(cloud.position).applyAxisAngle(xAxis, -0.35);

  let phase = "idle";
  let t = 0;
  let spin = 0;
  const dummy = new THREE.Object3D();
  const bandPos = new THREE.Vector3();

  function layout(alpha, time) {
    for (let i = 0; i < SHARDS; i++) {
      const s = scatter[i];
      const a = s.a0 + s.w * time;
      bandPos.set(Math.cos(a) * s.r, Math.sin(a) * s.r, s.h);
      dummy.position.lerpVectors(bandPos, lattice[i], alpha);
      dummy.rotation.set(time * 0.25 + i, i * 0.7, 0);
      dummy.updateMatrix();
      shardMesh.setMatrixAt(i, dummy.matrix);
    }
    shardMesh.rotation.y = reduce ? 0 : Math.sin(time * 0.15) * 0.25 * (1 - alpha);
    shardMesh.instanceMatrix.needsUpdate = true;
  }

  const orbit = attachOrbit(view, group, { requestRender, reduce, ry: -0.5 });

  orbit.onClick = () => {
    if (phase === "idle") {
      phase = "align";
      t = 0;
    }
  };

  return {
    scene,
    camera: cam,
    update(dt, time) {
      orbit.update(dt, time);
      spin += dt;
      if (phase === "align") {
        t += dt / 1.1;
        if (t >= 1) {
          t = 0;
          phase = "hold";
        } else {
          layout(easeOutCubic(t), spin);
        }
      } else if (phase === "hold") {
        t += dt;
        if (t > 1.2) {
          t = 0;
          phase = "relax";
        }
      } else if (phase === "relax") {
        t += dt / 1.5;
        if (t >= 1) {
          t = 0;
          phase = "idle";
          layout(0, spin);
        } else {
          layout(1 - easeOutCubic(t), spin);
        }
      } else {
        layout(0, spin);
      }
      lens.rotation.z += reduce ? 0 : dt * 0.1;
    },
  };
}
