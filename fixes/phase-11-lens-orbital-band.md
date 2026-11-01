# Phase 11 — machine 01: recompose the shard scatter into an orbital band

Pass-5 refs: scorecard fix 4 (adjudication 4: REAL, PROPOSE/PLAN), design-critic
#1 (math verified against source; three corrections baked in, see inline).
Evidence: `.jury/127.0.0.1-4400-pass5/` shots d-03/d-04/m-03 — ~90 tetrahedra
spread uniformly over the full frame, no direction; second consecutive card
naming exhibit 01 the weakest composition. Category: Design 7.5 → 8.0–8.5
(+0.2–0.4 weighted).

## Problem

`assets/js/gl/exhibits/lens.js` seeds shards in a flat random box (lines
34–41: x ±1.9, y ±1.4, z −1.8..0.2) and the only idle life is a per-axis sine
wobble (lines 63–66, amplitude ±0.05) with no read direction. The pass-5
critic's cap sentence: "ring dead-center in ~40 uniformly scattered tetrahedra
reading as static noise." The fix keeps every contract promise in DESIGN.md
§6.1 ("~90 shards scattered in a cloud / drift slowly / click aligns into a
neat lattice behind it, then relax") and changes only the cloud's
distribution and its drift.

## Changes

All in `assets/js/gl/exhibits/lens.js`. One InstancedMesh stays, 90 matrix
writes per frame stay, one extra Group, no new materials — 60 fps budget
unchanged.

### 11a. Tilted cloud holder + orbital band + exact lattice transform

- After the `shardMesh` creation (line 24–28), add a holder matching the lens
  plane and parent the mesh to it (replaces `group.add(shardMesh)` at line 54):

  ```js
  const cloud = new THREE.Group();
  cloud.rotation.x = 0.35;
  cloud.position.set(0, 0.10, 0.10);
  group.add(cloud);
  cloud.add(shardMesh);
  ```

  The band plane is parallel to the lens plane and sits 0.17 behind it along
  the lens axis — the halo reads recessed; the lens roll and sway are
  untouched.

- Replace the scatter init inside the loop (lines 35–41) with per-shard band
  state. Keep `lattice.push(...)` (lines 42–48) and the color seeds
  (lines 49–51) exactly as they are:

  ```js
  const inBand = i < 63;
  let r = inBand ? 1.28 + Math.random() * 0.2 : 0.55 + Math.random() * 1.05;
  let h = inBand ? (Math.random() - 0.5) * 0.5 : (Math.random() - 0.5) * 1.1;
  while (r + 0.11 * Math.abs(h) > 1.38) {
    r = inBand ? 1.28 + Math.random() * 0.2 : 0.55 + Math.random() * 1.05;
    h = inBand ? (Math.random() - 0.5) * 0.5 : (Math.random() - 0.5) * 1.1;
  }
  scatter.push({ r, h, a0: Math.random() * Math.PI * 2, w: 0.10 + Math.random() * 0.08 });
  ```

  (`scatter` becomes `const scatter = [];` of objects.) 70% of shards form a
  dense annulus just outside the chrome rim (rim outer edge 1.05 + 0.125 =
  1.175; band clears it by ≥ 0.10), 30% are loose stragglers for depth, all
  `w > 0` — one direction. The acceptance rule is the exact top-hairline bound
  (camera pitch 3.7° from `camera()` y 0.35 in helpers.js:41, shard
  circumradius 0.085, orbit bob ±0.05 included): worst-case shard top ≈ 1.51
  vs frustum top ≈ 1.53 at that depth. Correction to design-critic #1, whose
  `r*0.94 + |h|*0.35 > 1.38` lets the worst corner graze the hairline.

- After the loop, move the lattice into cloud space with the exact inverse of
  the cloud transform, so the click payoff stays where it is today
  pixel-for-pixel. Correction to design-critic #1: its constant
  "z = −1.4 in cloud space" tilts and lifts the lattice (top row at group y
  ≈ +1.71 vs visible half-height 1.70 — cropped):

  ```js
  const xAxis = new THREE.Vector3(1, 0, 0);
  for (const p of lattice) p.sub(cloud.position).applyAxisAngle(xAxis, -0.35);
  ```

- Rewrite `layout()` (line 60): delete the sine wobble (lines 63–66) and its
  `alpha < 0.05` gate — the orbit is the drift. Band position in cloud space,
  lerp mechanics unchanged:

  ```js
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
  ```

  (`const bandPos = new THREE.Vector3();` hoisted next to `dummy` at line 58.
  Tumble and the `shardMesh.rotation.y` sway from line 71 are kept.)

- Drive `time` for the band by an accumulated dt, not the raw clock.
  Correction to design-critic #1: with absolute clock time the band orbits at
  full speed on attention-throttled exhibits, contradicting DESIGN.md's
  attention rule ("eases the other visible machines toward stillness"); the
  old wobble hid this at ±0.05. In the returned `update()` (line 87) add
  `let spin = 0;` at module scope next to `phase`/`t`, then:

  ```js
  update(dt, time) {
    orbit.update(dt, time);
    spin += dt; // dt is 0 under reduced motion; attention-scaled by the renderer
    ...
  ```

  and pass `spin` everywhere `layout` is called (lines 95, 108, 110, 113).
  At full attention scale `spin` equals elapsed time, so idle motion is
  unchanged from today; reduced motion freezes it by construction
  (renderer.js:79 calls `update(0, 0)`).

## Don't

- Don't rebalance the shard palette (design-critic #1's optional ~50/40/10) —
  it is self-labeled judgment, not evidence, and phase 9a set ink-majority on
  purpose.
- Don't touch SHARDS, COLS, the lattice dimensions, materials, the orbit
  controller, or the click/hold/relax timers.
- Don't add trails, new meshes, or a second InstancedMesh — the fix is
  distribution and drift, not new geometry.
- Don't edit DESIGN.md — §6.1's "~90 shards scattered in a cloud / drift
  slowly / align into a neat lattice" are all still true verbatim.

## Verify

1. Serve (`node C:\Users\VICTUS\.agents\skills\jury\scripts\serve.mjs
   "D:\Study\Coding\Portfolio" --port 4400`), re-run shoot + audit into a new
   `.jury` dir (`--crawl --nav`, same as pass 5). Console clean, audit
   0 FAIL / 0 WARN.
2. d-03/d-04 and m-03: a visible band hugging the rim, circulating one way
   across idle frames, all shards inside the hairline on 16:9 and 4:3; no
   shard crosses the top hairline in any frame.
3. Click/Enter still snaps the 90 shards to the 10×9 lattice and relaxes; the
   lattice lands exactly where it does on HEAD (no jump at relax).
4. Rest on a different exhibit: machine 01's band slows toward stillness
   (attention honored); r-01/r-02 static; `reduced.moving` false.
5. `mobile.vitals` LCP/CLS unchanged, `mobile.scrollFps` 60, `summary.json`
   errors 0.

## Commits

- `fix: recompose the archive shards into an orbiting band` (11a)

## Done when

Reshoot shows the directional band inside the hairline at both breakpoints,
the click payoff unchanged, reduced motion and attention behavior intact, and
no regression in vitals or fps.
