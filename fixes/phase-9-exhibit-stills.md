# Phase 9 — exhibit stills: lens reframe, block docking, inked pipe, touch hint

Pass-4 refs: scorecard fix 2 (adjudication 2: REAL, PROPOSE),
design-critic #1 + #3 + #6, design-critic #2 + ux-critic #4 (merged into
one hint). Evidence: shots d-03..d-06, m-03..m-05; standing pass-3 taste
finding "washed-out exhibits"; pass-4 Creativity "look-don't-interact".
Category: Design 7.5 → 8, Creativity 7.5 → 8.

## Problem

1. **Exhibit 01 reads as confetti and its lens is cropped.** Geometric, not
   taste: in `assets/js/gl/exhibits/lens.js` the camera is `camera(5.4)`
   (fov 35, line 9) and the lens sits at `lens.position.set(0, 0.3, 0.7)`
   (line 21). Half-frustum height at the lens plane is
   tan(17.5°)·(5.4−0.7) ≈ 1.48 while the tilted ring + idle bob reaches
   ≈ 1.45–1.52 — zero headroom, the ring clips the vitrine top. Second:
   seeds at lines 49–51 give ~61/90 shards clay `0xe9e4da` on the white
   panel — two thirds of the cloud is bone-on-white. Third: idle drift is a
   ±0.05 per-shard wobble, invisible at gallery distance, so the piece says
   nothing about retrieval until clicked.
2. **Taskforge's blocks ride ~0.11 units off the teeth.** `gears.js:100-101`
   orbits blocks at radius 1.32 while gearA's teeth end at ≈ 1.21
   (0.95 + 0.95·0.12 + 0.285/2) — visibly airborne (d-04, m-04). The train
   also spans x ≈ −2.05…+1.52 (center −0.27), leaving the vitrine's right
   half empty. Correction to the source report: the straying cubes are
   cobalt, not clay (`gears.js:57`); the radius diagnosis stands, and the
   smaller radius also lifts the bottom arc off the chute walls.
3. **Gatehouse's pipe is bone-on-white.** `valve.js:12` builds the pipe —
   the machine's entire body — in `materials.clay()`; only chrome flanges,
   wheel and inked legs define it (d-05, m-05). Last surviving instance of
   the standing "washed-out exhibits" finding.
4. **The interaction contract is invisible in a still.** Drag/arrows/Enter
   exist (`helpers.js:72-116`), `cursor: grab` (`main.css:396`) and long
   aria-labels (`index.html:148` et al.) leave no visible trace; touch
   users see no cursor at all.

## Changes

### 9a. lens.js — framing, palette, shared sway

- Line 21: `lens.position.set(0, 0.3, 0.7)` → `lens.position.set(0, 0.15, 0.3)`
  (new headroom: 0.3153·5.1 ≈ 1.61 vs ring top ≈ 1.35).
- Lines 49–51: invert the palette to ink-majority —

  ```js
  if (i % 11 === 3) shardMesh.setColorAt(i, cobalt);
  else if (i % 4 === 2) shardMesh.setColorAt(i, clay);
  else shardMesh.setColorAt(i, ink);
  ```

  (ink ≈ 61, clay ≈ 21, cobalt ≈ 8; ink `0x2a2824` is already the seed
  color at line 32.)
- Line 25: `TetrahedronGeometry(0.07)` → `TetrahedronGeometry(0.085)`;
  line 37: `(Math.random() - 0.5) * 4.6` → `(Math.random() - 0.5) * 3.8`
  (±1.9 clears the 4:3 mobile frustum that currently clips shards in m-03).
- In `layout()`, replace the whole-cloud idle life with one continuous line
  placed just before `shardMesh.instanceMatrix.needsUpdate = true;`:

  ```js
  shardMesh.rotation.y = reduce ? 0 : Math.sin(time * 0.15) * 0.25 * (1 - alpha);
  ```

  Correction to design-critic #1: its version kept the `alpha < 0.05` gate,
  which jumps the cloud by up to ±14° the instant a click cycle relaxes
  across the threshold. The `(1 - alpha)` fade *replaces* the gate: full
  sway at rest, square lattice at click, smooth both ways. ±0.25 rad sway
  never sweeps shards toward the camera (max x-displacement ≈ |z|·0.25).
  Under reduced motion `update(0, 0)` makes the term exactly 0 and the
  `reduce` guard pins it.

### 9b. gears.js — seat the blocks, center the machine

- Line 100 and line 101: `* 1.32` → `* 1.19` (blocks straddle the tooth
  tops at ≈ 1.21, and the orbit's bottom rises clear of the chute).
- After `const group = new THREE.Group();` (line 26) add
  `group.position.x = 0.22;` — safe: `attachOrbit.update` writes only
  `rotation` and `position.y` (`helpers.js:129-130`), so x survives the
  idle bob, and the drag pivot lands on the train's optical center.

### 9c. valve.js — ink the pipe, size the beads

- Line 12: `materials.clay()` → `materials.inked()` — inked is already the
  GL vocabulary for structure (gears, legs, orrery rings); clay beads then
  read against a dark body. Line 57: `SphereGeometry(0.055, 12, 12)` →
  `(0.07, 12, 12)` so the stream reads at both flanges.
- Rejected alternative: `materials.glass()` on the pipe would show beads
  throttling through the wall but adds a transmission pass — off-budget
  while throttled mobile holds 60 fps.

### 9d. index.html — one touch hint per vitrine label

In each `.vitrine-label`, directly after the `no. 0X` span, add one span
(inherits the 0.6875rem mono muted row style, `main.css:404-414`):

```html
<span>drag · arrow keys · enter to focus</span>
<span>drag · arrow keys · enter to speed the line</span>
<span>drag · arrow keys · enter to close the valve</span>
<span>drag · arrow keys · enter to pulse the hub</span>
```

Merged placement decision — caption row (ux-critic #4), not an absolutely
positioned stage overlay (design-critic #2): the GL canvas is a fixed layer
*above* the DOM (`#gl` z-index 2), so a stage-bottom overlay can be
overpainted by machine pixels inside the scissor rect, while the label row
sits outside every painted rect and needs zero new CSS. The label row is
also where DESIGN.md §4 confines Fragment Mono ("only where real data
lives") — an interaction contract is label data, same as materials. Verbs
mirror the aria-labels at `index.html:148/183/218/253`. Longest line
(43 chars ≈ 284 px) fits the ~322 px row at 390 px; the flex row already
wraps.

### 9e. DESIGN.md — one-line palette sync

§4 says "GL materials are chrome, glass, bone clay, and IKB tints only" —
stale since phase 2 shipped `materials.inked()` for gears and rings. Change
to "chrome, inked, glass, bone clay, and IKB tints only". §6's mechanism
wording stays true as written.

## Don't

- Don't touch orrery.js, the orbit controller, materials helpers, lighting,
  or the render loop.
- Don't add a full orbit, new materials, or any overlay element inside
  `.vitrine-stage`.
- Don't reword aria-labels; the hints document what they already promise.

## Verify

1. Reshoot d-03..d-06 and m-03..m-05 at 1440 and 390: lens ring fully
   inside the top hairline, dark-majority shard cloud, sway visible across
   idle frames; every Taskforge cube touching teeth or chute at all times
   with the train optically centered; Gatehouse pipe silhouette unambiguous
   at a glance; hint legible in each label row.
2. Click each exhibit once: lens lattice still forms square (sway fades to
   0 at alpha 1), gears burst still works, valve beads stay clay through a
   full deflect cycle.
3. Drag each exhibit; check throttled mobile `scrollFps` stays 60.
4. Reduced-motion pass: static first frame correct for all four exhibits,
   sway term 0, no-gl fallback unaffected.
5. Console clean; axe stays 0 violations (hint spans are plain text).

## Commits

- `fix: pull the lens inside the vitrine and ink the shard cloud` (9a)
- `fix: seat taskforge blocks on the teeth and center the train` (9b)
- `fix: ink the gatehouse pipe and enlarge its beads` (9c)
- `feat: document the exhibit keyboard contract in the label rows` (9d)
- `docs: add inked to the gl palette in the design contract` (9e)

## Done when

Reshoot shows all four compositions named in the pass-4 deductions cleared,
the touch hint visible at both breakpoints, 60 fps and reduced-motion
behavior unchanged.
