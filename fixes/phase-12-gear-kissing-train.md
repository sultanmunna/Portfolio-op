# Phase 12 — machine 02: the kissing gear train

Pass-5 refs: scorecard fix 8 (adjudication 8: REAL), design-critic #2 with the
owner decision baked in: the corrected gear geometry is authoritative; the
train resolves as a KISSING TRAIN — tooth rings touch with a hairline gap —
and the DESIGN.md §6.2 plus aria-label wording sync lands in the same commit
as the geometry. Evidence: `.jury/127.0.0.1-4400-pass5/` r-02-mid, d-04 top —
discs and tooth boxes interpenetrate. Category: Design (shares the cap
sentence with phase 11; alone +0.1–0.25 weighted) and removes the one finding
a jury would call outright broken.

## Problem

`assets/js/gl/exhibits/gears.js` seats A(−0.85,−0.35) / B(0.72,−0.62) /
C(0.32,0.62) (lines 31/33/35): center distances A–B 1.59, A–C 1.52, B–C 1.30
against required tip clearances ~2.00 / ~1.80 / ~1.38 (tips reach 1.21 / 0.79
/ 0.59 from center) — all three pairs clip; gearC also floats with no post.
The riding blocks (orbit radius 1.19, lines 101–102; radial half-extent 0.06,
so the sweep corridor is exactly radius 1.25 around A) re-board at
`angle + π/2` (line 95), which pins neither position nor phase against the
tooth pitch. The pass-4 fix seated the blocks; the gears themselves still
clip.

## Changes

All in `assets/js/gl/exhibits/gears.js`, plus the two wording syncs. Radii,
teeth, materials and the ratio-driven speeds (lines 83–84) are untouched;
gearA, chute, walls and the drop target (−0.85) are untouched.

### 12a. Tangent train, framing, support, contract sync (one commit)

- Line 33: `gearB.position.set(0.72, -0.62, 0)` → `gearB.position.set(1.22, -0.66, 0)`
  — A–B = 2.093 ≥ 1.25 + 0.79 + 0.05 (B's teeth stay outside the blocks'
  sweep corridor by 0.05; tooth-ring gap ≈ 0.09 over the 1.21/0.79 envelopes).
- Line 35: `gearC.position.set(0.32, 0.62, 0)` → `gearC.position.set(0.22, 1.30, 0)`
  — A–C = 1.967 ≥ 1.25 + 0.59 + 0.05 (C clear of the corridor by 0.06);
  B–C = 2.20, daylight.
- Line 25: `camera(6.2)` → `camera(7.0)`. The train grows to ~4.1 × 3.75 world
  units (extent −2.06…+2.01 × −1.86…+1.89); half-height 2.21 at fov 35 leaves
  ~0.32/0.35 top/bottom margins (today ~0.1, r-02-mid shows the plate nearly
  touching the hairline — this also fixes that). Mobile 4:3 half-width 2.94
  vs needed 2.06.
- Line 27: `group.position.x = 0.22` → `group.position.x = 0` (optical center
  −0.03). Safe: `attachOrbit.update` writes only `rotation` and `position.y`
  (helpers.js:129–130), so x survives the idle bob and the drag pivot lands
  on the train's center.
- Line 38: `BoxGeometry(2.6, 0.08, 1.4)` → `BoxGeometry(2.9, 0.08, 1.4)` and
  add `base.position.x = 0.1;` (line 39 area) — gearB's post (new x 1.22)
  sits with margin; plate spans −1.35…+1.55.
- Line 41: posts loop array → `[[-0.85, -0.35], [1.22, -0.66], [0.22, 1.30]]`
  — the existing height formula (`axle + 1.78`) auto-fits each post to the
  plate at y −1.78, and the third post removes gearC's unsupported float at
  z −0.24, behind the disc plane, as today.
- DESIGN.md §6 item 2: "three interlocking gears (one chrome, two inked)
  turning at different speeds" → "three gears in a coupled, touching train
  (one chrome, two inked) turning at different speeds". Rest of the item
  unchanged.
- index.html line 199 aria-label: "three interlocking gears carrying small
  blocks" → "three coupled gears carrying small blocks". Rest of the label
  unchanged.

### 12b. Blocks gap-centered permanently (one commit)

- Init (line 60): `angle: (i / 4) * Math.PI * 2` →
  `angle: (i / 4) * Math.PI * 2 + Math.PI / 12` — 15° off the 30° tooth
  pitch, so all four IKB blocks ride gap-centered from the first frame.
- Reset (line 95): replace `block.angle = angle + Math.PI * 0.5;` with the
  snapped re-board:

  ```js
  const gap = Math.round((-Math.PI / 2 - Math.PI / 12 - angle) / (Math.PI / 6));
  block.angle = Math.PI / 12 + gap * (Math.PI / 6);
  ```

  Correction to design-critic #2, whose literal
  `block.angle = -Math.PI / 2 + Math.PI / 12 - angle` pins the re-board
  position but leaves the riding phase at (−75° − spin) mod 30° — arbitrary,
  so blocks re-embed after a few drops and its own verify gate fails. A
  block's riding phase is `block.angle` mod 30° (time-independent: world
  angle minus tooth angle = `block.angle − k·30°`), and its re-board world
  angle is `block.angle + angle`; the snapped version pins the world angle to
  −90° ± 15° (bottom, in the drop window near the chute) AND the phase to
  exactly 15°. Both goals of the owner decision, one formula.

## Don't

- Don't model real tooth profiles or interleave the teeth — the hairline kiss
  is the owner-resolved register; interleaving is out of budget at this
  geometry.
- Don't change radii, teeth counts, materials, or the speed ratios (lines
  83–84 stay valid).
- Don't move gearA, the chute, walls, or the drop target; don't touch
  valve.js/orrery.js.
- Don't re-open the "interlocking" wording — the owner decided it.

## Verify

1. Reshoot machine 02 (desktop scroll frames covering it, r-02-mid, m-04):
   clear daylight between all three tooth rings; four blue blocks riding the
   gaps, none embedded — watch a full minute of idle plus at least one
   re-board per block. If any block still shows tooth contact at rest,
   report back; do not improvise new offsets.
2. Plate under all three posts; machine fully inside the vitrine on 16:9 and
   4:3, plate clear of the bottom hairline.
3. Click burst still speeds the train; ratios still read (B and C
   counter-rotating at their relative speeds).
4. Reduced-motion first frame correct; drag + keyboard orbit unchanged;
   console clean; axe stays 0 (aria text change only).

## Commits

- `fix: separate the taskforge gears into a touching train` (12a, incl.
  DESIGN.md §6.2 + aria-label sync)
- `fix: center taskforge blocks in the tooth gaps` (12b)

## Done when

Reshoot shows the kissing train with daylight between all rings, four blocks
permanently visible in the gaps on 16:9 and 4:3, three posts on the widened
plate, and the contract and aria wording matching the geometry in the same
commit.
