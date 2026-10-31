# Phase 1 — visible focus and hover feedback

Audit refs: A-01 (R-32 Hard Gate fail), A-03, A-04. Critic fixes 1–3.
This is the only Hard Gate fail in the audit; do this phase first.

## Problem

1. The four GitHub icon links (`.icon-link`) show no detectable visible focus
   (`report.json` home `keyboard.invisibleFocus` ×4; all other 12 stops are
   visible). The global IKB outline at `outline-offset: 3px` around a bordered
   44px box reads as no feedback at tab speed.
2. The primary CTA "email me" (`.btn-primary:hover`) goes `#002FA7 → #141311`,
   below the perception floor, while secondary buttons flood IKB.
3. The 404 page's only two links (`.site-name`, `.nf-back`) have no hover
   styles at all (404 `noHoverChange` ×2).

## Changes — assets/css/main.css only

1. After the `.icon-link:hover` rule (~line 345), add the same flood for
   focus, keeping the global outline:

   ```css
   .icon-link:focus-visible {
     background: var(--ikb);
     border-color: var(--ikb);
     color: var(--bone);
   }
   ```

2. Replace `.btn-primary:hover` (~line 456) with an unmistakable inversion in
   the page's own vocabulary (filled card flips to outlined IKB label):

   ```css
   .btn-primary:hover {
     background: transparent;
     color: var(--ikb);
   }
   ```

   Border stays IKB (inherited from `.btn-primary`). Keep `.btn:active`
   exactly as it is.

3. Give `.site-name` (~line 165) the nav's underline-grow pattern: add
   `background-image: linear-gradient(currentColor, currentColor)`,
   `background-size: 0% 1px`, `background-position: 0 100%`,
   `background-repeat: no-repeat`, and
   `transition: background-size 0.3s var(--ease-out)` to the base rule; add
   `.site-name:hover { background-size: 100% 1px; }`.
4. Add `.nf-back:hover { color: var(--ikb); }` and
   `transition: color 0.2s;` on `.nf-back` (~line 504).

## Don't

- Don't touch the exhibit files, the reveals, or any color token.
- Don't add outlines to elements that weren't flagged.

## Verify

1. Serve, open home. Tab order: skip link → logo → work/stack/contact → per
   vitrine GitHub link → exhibit. Each GitHub link must visibly flood IKB on
   focus (screenshot k-style frames if the rig is available).
2. Hover "email me": clear filled→outlined flip. Hover "github" secondary:
   unchanged flood. Hover nav + logo: underline grows.
3. 404: hover both links, see feedback.
4. Console clean at every step. Reduced-motion pass: transitions collapse to
   instant (the global reduce block handles this; confirm nothing moves).

## Commits

- `fix: flood IKB on focused source links` (change 1)
- `fix: give primary and 404 links perceptible hover states` (changes 2–4)

## Done when

`keyboard.invisibleFocus` is empty on a re-shoot, both 404 links react to
hover, and the primary CTA's hover is obvious in a static pair of crops.
