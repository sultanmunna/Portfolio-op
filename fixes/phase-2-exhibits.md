# Phase 2 — valve color bug and exhibit materiality

Audit refs: A-02 (correctness, HIGH), critic fix 4 (Design 7→8 lever).

## Problem

1. **Valve beads bleach themselves (A-02).** three.js `setColorAt` initializes
   the whole `instanceColor` buffer to white (`fill(1)`), overriding the clay
   material. The first deflected bead (valve.js ~line 98) triggers that, so
   all 64 beads permanently swap from bone clay to `#ffffff`; the reset path
   (~line 91) writes white too. White beads on a white panel nearly vanish.
2. **Gears and valve read as primitives** (critic, d-04/d-05): flat discs and
   a floating pipe. The metaphor is carried by the captions, not the models.

## Changes

### 2a. valve.js color fix (assets/js/gl/exhibits/valve.js)

- Next to `const cobalt = new THREE.Color(0x002fa7);` (~line 55) add
  `const clay = new THREE.Color(0xe9e4da);`
- After `group.add(beadMesh);` (~line 49), seed every instance so the
  buffer starts as clay instead of being created white on first deflect:

  ```js
  for (let i = 0; i < BEADS; i++) beadMesh.setColorAt(i, clay);
  beadMesh.instanceColor.needsUpdate = true;
  ```

- Reset path (~line 91): write `clay`, not `new THREE.Color(0xffffff)`.
- Cobalt deflection stays as is.

### 2b. gears.js materiality (assets/js/gl/exhibits/gears.js)

Goal: the machine stands on something and dropped blocks have a destination.
Materials locked to the existing five helpers (chrome/glass/clay/inked/cobalt).

- Add a clay base plate under the train (e.g. `BoxGeometry(2.6, 0.08, 1.4)`
  at y ≈ −1.05) and two inked frame posts rising to the gear axles so the
  train reads as mounted, not floating.
- Blocks currently drop at whatever orbit x they were on. Make a drop always
  happen at gearA's bottom (fix x to −0.85 when `dropping` starts) and add an
  inked slot/chute there (two short walls + floor) so "jobs picked up, worked,
  completed" is visible end to end.
- Blocks must still respawn on the ring (existing respawn logic stays).

### 2c. valve.js materiality

Goal: the pipe is installed on the wall/floor, not suspended.

- Two inked mounting brackets or legs under the flanges (x ≈ ±1.8) reaching a
  floor line, so the assembly is grounded.
- Optional, only if it stays simple: a small chrome pressure gauge on the pipe
  whose needle rotates with `flow` (the variable already exists). Skip it if
  it needs new animation state.

### 2d. DESIGN.md one-line sync

DESIGN.md §6 says gears are "one chrome, two bone clay" but the shipped code
uses `materials.inked()` for gearB/gearC. Update the §6 wording to match
whatever ships after this phase (keep the code's choice unless it looks wrong).

## Don't

- Don't touch lens.js or orrery.js (critic flagged only d-04/d-05).
- Don't add materials, lights, or post-processing outside the five helpers.
- Don't change the orbit controller or the render loop.

## Verify

1. Before/after screenshots of gears + valve at desktop 1440 and 390.
2. Click valve, watch a deflect cycle: beads stay clay, deflected bead turns
   IKB, falls, respawns clay. Repeat 3× — colors must never drift to white.
3. Drag both exhibits (orbit still smooth, new geometry is inside `group`).
4. Reduced motion: `update(0, 0)` still renders a correct static frame with
   the new geometry; no-gl fallback message unaffected.
5. Console clean.

## Commits

- `fix: seed valve bead colors so deflects restore clay` (2a)
- `feat: ground the gear train with base, posts and chute` (2b)
- `feat: mount the valve pipe on legs` (2c)
- `docs: sync exhibit materials with the shipped build` (2d)

## Done when

Bead colors survive any amount of clicking; gears and valve read as
machines in a still frame without needing their captions.
