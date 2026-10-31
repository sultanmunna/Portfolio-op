# PLAN.md

Implementation plan for rebuild #2, per `DESIGN.md` (gallery light, vanilla
HTML + CSS + JS + Three.js). No framework, no build step, no package.json.

## Stack (one-line reason)

Static files served as-is: `index.html`, `assets/css`, `assets/js` (ES
modules), three.js vendored locally and mapped via an import map. Reason: the
owner mandated HTML/CSS/JS + three.js; a build step would be ceremony. Serve
with any static server (`python -m http.server` is enough; the owner is a
Python developer).

## Starting state

Branch `First` holds the rejected Next.js build (14 commits). Phase 0 commits
its removal; history stays revertible.

## Pipeline (per AGENTS.md)

Main agent implements. `verifier` (no package.json: static checks only, so it
reports "no checks defined" unless the build gains scripts), `reviewer`,
`committer` at milestones. `critic` for the QA score. `push` only on request.

## Phases

| # | Phase | Tasks | Verification | Commit |
|---|---|---|---|---|
| 0 | Scrape | remove the Next.js app: src/, public/, package.json, package-lock.json, next.config.ts, eslint.config.mjs, tsconfig.json; rewrite DESIGN.md + PLAN.md | tree clean; docs match this plan | `chore: scrape next.js build for gallery rebuild` + `docs: rewrite design contract for gallery rebuild` |
| 1 | Assets | vendor `three.module.min.js` (+ `RoomEnvironment.js`) into `assets/vendor/`; download Switzer + Fragment Mono woff2 via the awwwards font script into `assets/fonts/` with an `@font-face` css | files exist; import map resolves; fonts load with `font-display: swap` | `chore: vendor three.js and fonts` |
| 2 | Shell | `index.html` (all sections, semantic), `assets/css/main.css` (tokens, layout families, vitrines, footer, 404), `assets/js/data.js` (typed content + placeholder flags), `assets/js/reveal.js` (IO reveals), header/footer, hero, intro, materials | served page matches DESIGN.md wireframes; keyboard tab order; 390px pass | `feat: gallery shell, content and reveals` |
| 3 | GL core | `assets/js/gl/renderer.js` (renderer singleton, fixed canvas, scissor viewports per vitrine, env + lights, render loop with visibility gating), `assets/js/gl/helpers.js` (materials, drag controller with inertia, vitrine pointer bridge) | one canvas, one context; exhibits area renders; text selectable; no console errors | `feat: shared three.js stage` |
| 4 | Exhibits (4 commits) | `gl/exhibits/lens.js`, `gears.js`, `valve.js`, `orrery.js` per DESIGN.md section 6; each: idle drift, drag, one interaction, reduced-motion still | per exhibit: visual pass + reduced-motion check + dispose check | `feat: exhibit: <name>` x4 |
| 5 | Close-out | `404.html` (empty plinth), favicon (IKB square on bone), og.png (composed in-browser, 1200x630), README via readme-writer (serve instructions: `python -m http.server`), meta tags | 404 works on static hosting; og image loads; readme matches | `feat: 404, favicon and og image` + `docs: readme` |
| 6 | QA | serve build; browser pass: desktop 1440, mobile 390, reduced-motion; console, overflow, tap targets, keyboard walk, drag on touch emulation; fresh `critic` subagent scores evidence-only; fixes as commits | critic 8+ with evidence; zero console errors; no overflow | fixes as individual commits |

## Budgets and gates

- Page weight: vendored three ~700KB is the bulk; fonts subset; total under
  3MB; LCP is the HTML/type (fonts swap), GL boots after.
- Every interactive element does something real; every focus stop visible;
  no horizontal overflow; 44px targets on all controls.
- antislop Delivery Gate + design-taste pre-flight before presenting.

## Risks

- WebGL contexts: one renderer, scissor viewports; never one context per
  exhibit. Fallback: if WebGL fails, vitrines show a static SVG still (write
  the fallback into renderer.js).
- Text selection vs drag: vitrine pointer bridge only intercepts inside the
  canvas rect; labels/description stay selectable.
- Touch: drag on the vitrine must not lock page scroll; rotate on horizontal
  pointer moves, let vertical pass through (`touch-action: pan-y` on the
  vitrine overlay).

## Owner replaces after build (placeholder register)

All in `assets/js/data.js`: site url, email, github, the four projects with
real work, `live` URLs when demos exist, stack groups if they drifted.
