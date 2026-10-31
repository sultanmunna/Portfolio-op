# PLAN.md

Implementation plan for the portfolio described in `DESIGN.md`. `DESIGN.md` is
the contract; if build reality forces a change, the change lands there first.

## Stack (one-line reason)

Next.js (App Router, TypeScript), plain CSS with custom-property tokens,
GSAP + ScrollTrigger + Lenis, no WebGL. Reason: the repo already ran Next.js,
`next/font` and its metadata tooling fit the brief, and SVG/DOM scenes need no
GL to hold 60 fps on phones.

Dependencies: `next`, `react`, `react-dom`, `gsap`, `lenis`; dev:
`@playwright/test` (for the awwwards shoot script), `axe-core`, eslint config.

## Starting state

The working tree holds unstaged deletions of the previous portfolio (owner
wiped it for this rebuild). Phase 0 commits that reset so every later commit
is revertible on a clean base.

## Pipeline (per AGENTS.md)

Implementation stays with the main agent. After each phase: `verifier` (runs
build/lint), then `reviewer` (diff vs AGENTS.md), then `committer` (one
logical change per commit, never pushes). Small self-contained phases commit
immediately; the QA phases run the full chain. `critic` and `a11y-perf`
subagents are read-only QA instruments. `push` runs only if asked.

## Phases

| # | Phase | Tasks | Verification | Commit |
|---|---|---|---|---|
| 0 | Reset | stage the deletions of the old site | tree clean, `git status` empty | `chore: remove previous portfolio build` |
| 1 | Scaffold | package.json, tsconfig, next.config, eslint, gitignore, app shell (layout, page, not-found), fonts via `next/font` (Big Shoulders, Host Grotesk, DM Mono), install deps | `npm run build` passes; dev server boots with no console errors | `chore: scaffold next.js app shell` |
| 2 | Tokens and content | globals.css tokens (palette, type scale, spacing moods, focus ring), `src/data/site.ts` with the typed content file and `placeholder: true` register from DESIGN.md section 7 | build passes; tokens lint against DESIGN.md hex values | `feat: design tokens and content model` |
| 3 | Engine | gsap setup, Lenis adapter, reveal module, loader (handshake, max 2.6 s, reflects real load), route transition, the packet driver module (one input: scroll; outputs: position, spine fill, station readout, scene gates); reduced-motion gates everywhere | build passes; manual smoke: loader handoff, scroll drives packet, reduced motion shows static marker | `feat: motion engine and packet driver` |
| 4 | Frame, hero, intro | four-corner frame (name, nav, station readout, Email me), mobile menu overlay (focus trap, Escape), poster hero, statement intro | build + browser pass: keyboard nav, focus ring, no overflow at 390 px | `feat: frame, hero and intro` |
| 5 | Machinery | stack section as route stations (5.3), asymmetric pair layout, packet stop-points | build + visual pass | `feat: machinery section` |
| 6 | Work shell | four case boxes: title, description, GitHub/live controls (live renders only with a URL, else "demo soon"), scene stage placeholder, send buttons wired to no-op-safe stubs removed later | build; tab through all controls; 44px targets | `feat: work section shell` |
| 7 | Scenes (4 commits) | scene modules per DESIGN.md section 6: archive, taskforge, gatehouse, agentbench; each with IntersectionObserver gating, real button behavior, reduced-motion still, aria-label | per scene: build + visual pass + reduced-motion check | `feat: scene: <name>` x4 |
| 8 | Contact, 404, cases, SEO | finale contact (mailto, copy-address with feedback, GitHub), designed 404, `/work/[slug]` case template with next-project transition, metadata: titles, descriptions, canonical, OG image, sitemap, robots, JSON-LD Person, favicon (packet mark) | build; 404 returns real 404; OG image loads; forms of every control clicked | `feat: contact, case pages, 404 and seo` (split if needed) |
| 9 | QA pass 1 | `npm run build && npx next start`, awwwards `shoot.mjs --crawl` and `audit.mjs`; read every screenshot and report.json; fresh `critic` subagent scores evidence-only | zero audit FAILs, zero console errors, no overflow, axe clean, LCP/CLS within budget; critic fix list produced | fixes as individual commits |
| 10 | QA pass 2 | re-shoot, fresh critic again, `a11y-perf` subagent for numbers; "remove one accessory" pass | all scores 8+ with evidence; idle motion confirmed; reduced motion complete | fixes as individual commits |
| 11 | Close | full chain on final state: `verifier` then `reviewer` then `committer`; `readme-writer` updates run/replace instructions; handoff message lists every placeholder | clean gate: antislop Delivery Gate and design-taste pre-flight both PASS | final commits, no push |

## Budgets and gates

- LCP < 2.5 s (throttled phone), CLS < 0.05, JS < 300 KB gz, page < 3 MB,
  loader <= 2.6 s, 60 fps scroll on mid-range phone.
- Every interactive element does something real; every focus stop visible;
  Escape closes the menu; no horizontal overflow anywhere.
- Delivery gate (antislop) and pre-flight (design-taste) run before declaring
  done; a FAIL blocks delivery.

## Risks and mitigations

- Packet choreography across sections is the hardest build: keep the driver
  one module, positions computed from section anchor elements (not hardcoded
  pixels), so it survives responsive changes.
- Big Shoulders is caps-oriented: check descenders and tracking per size.
- Dark contrast: muted text on ground and line-strong borders verified with
  measured ratios, not by eye alone.
- Scenes must pause offscreen and stop on route change (no leaked loops).

## Owner replaces after build (placeholder register)

Email address, GitHub URL, live demo URLs, the four projects with real work
and case-study copy, stack groups if they drift from reality. All live in
`src/data/site.ts` and nowhere else.
