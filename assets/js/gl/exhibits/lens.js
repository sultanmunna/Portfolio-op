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
    scatter.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * 3.8,
        (Math.random() - 0.5) * 2.8,
        (Math.random() - 0.5) * 2.0 - 0.8,
      ),
    );
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
  group.add(shardMesh);

  let phase = "idle";
  let t = 0;
  const dummy = new THREE.Object3D();

  function layout(alpha, time) {
    for (let i = 0; i < SHARDS; i++) {
      dummy.position.lerpVectors(scatter[i], lattice[i], alpha);
      if (alpha < 0.05 && !reduce) {
        dummy.position.y += Math.sin(time * 0.6 + i) * 0.05;
        dummy.position.x += Math.cos(time * 0.4 + i * 1.7) * 0.04;
      }
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
      if (phase === "align") {
        t += dt / 1.1;
        if (t >= 1) {
          t = 0;
          phase = "hold";
        } else {
          layout(easeOutCubic(t), time);
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
          layout(0, time);
        } else {
          layout(1 - easeOutCubic(t), time);
        }
      } else {
        layout(0, time);
      }
      lens.rotation.z += reduce ? 0 : dt * 0.1;
    },
  };
}
