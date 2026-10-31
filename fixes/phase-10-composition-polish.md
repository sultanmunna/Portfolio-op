# Phase 10 — hero cue and 404 plinth scale

Pass-4 refs: ux-critic #3 (hero cue, unadjudicated funnel proposal) and the
static half of design-critic #5 (plinth scale — the motion half is blocked,
see the blocked register in the pass-4 plan). Category: small
Usability/Design polish, ~+0.25 weighted, low risk.

## Problem

1. **The first screen ends in "now what?"** The hero (`index.html:73-76`)
   is a complete poster whose only controls are 12px mono nav links top
   right; the keyboard walk confirms the next in-page stop after "contact"
   is a GitHub icon far down the page. With `mobile height 5141`, everything
   interactive is a long scroll away with no cue at the fold.
2. **The 404's concept object reads as an icon.** The empty-plinth drawing
   renders 180 px wide with an 8 px cube on a 1440 px screen
   (`404.html:19-20`) — it does not carry the page. Static scale only; the
   contested motion proposal is owner-gated and not planned here.

## Changes

### 10a. Hero cue (index.html, main.css, DESIGN.md)

- `index.html`, inside `.hero` after `.hero-sub` (line 75):

  ```html
  <a class="hero-cue" href="#work">four machines, below ↓</a>
  ```

- `main.css`, after the `.hero-sub` rule (~line 238) — the nav's own
  underline-grow vocabulary, not a color-only hover:

  ```css
  .hero-cue {
    grid-column: 1 / -1;
    justify-self: start;
    margin-top: 48px;
    padding: 16px 0;
    font-family: "Fragment Mono", monospace;
    font-size: 0.75rem;
    color: var(--muted);
    background-image: linear-gradient(currentColor, currentColor);
    background-size: 0% 1px;
    background-position: 0 100%;
    background-repeat: no-repeat;
    transition: color 0.25s, background-size 0.3s var(--ease-out);
  }

  .hero-cue:hover {
    color: var(--ink);
    background-size: 100% 1px;
  }
  ```

  Correction to ux-critic #3: its `padding: 14px 0` yields a ~40 px target;
  16 px holds DESIGN.md §9's 44 px rule. Smooth scroll is native
  (`main.css:71`) and collapses to auto under reduced motion
  (`main.css:616-619`).
- DESIGN.md §5.1: add the cue to the arrival drawing and one line — a mono
  secondary cue under the subtitle, focal stays the type. The doc edit
  lands in the same commit as the behavior.
- If the ↓ glyph renders in a fallback face (Fragment Mono coverage is not
  guaranteed), drop the glyph and keep the words.

### 10b. 404 plinth scale (404.html)

Line 19–20: `width="180" height="90"` → `width="300" height="150"`.
ViewBox unchanged; strokes are vector hairlines. Fits 390 px viewports
(300 < 358 available). `.nf-plinth` margin stays.

## Don't

- Don't add any motion to the 404 (owner-gated, blocked register).
- Don't style the cue as a button or give it IKB fill — it is a label-class
  link in the nav's pattern.
- Don't touch hero type, spacing tokens, or the 404 copy.

## Verify

1. Desktop 1440 and 390: cue visible under the subtitle, hover draws the
   underline; tapping it at the m-01 scroll position lands on `#work`.
2. Keyboard: one new visible-focus stop between the "contact" nav link and
   the first GitHub icon; Enter jumps to work.
3. 404 at 1440 and 390: plinth ≈ 300 px, hairlines still hairline, nothing
   else moved; 404 r-01 still static.
4. Console clean; axe 0 violations; CLS unchanged (both additions are
   initial-HTML, no late shift).

## Commits

- `feat: add a hero cue to the work section` (10a, incl. DESIGN.md §5.1)
- `fix: scale the 404 plinth to poster size` (10b)

## Done when

The hero's fold has one in-voice, keyboard-reachable affordance, the 404
plinth carries its page, and the contract drawing matches the build.

Deviation (2026-11-01): the owner approved the blocked motion half (one-shot cube drop, 9377b58); ux-critic #6's no-js fallback landed as c9c5cd8 (planner gap); the review caught the scaled strokes rendering ~1.67px, corrected by non-scaling-stroke in f530b3e.
