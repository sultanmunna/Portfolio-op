# PLAN.md — Portfolio roadmap (read this first when continuing in a new session)

Project: portfolio for **Md Sultan Mahmud Munna**, backend developer (FastAPI).
Repo: `D:\Study\Coding\Portfolio` (branch `First`). Stack: Next.js 16 App Router + TS + GSAP + Lenis. No Tailwind, no WebGL (intentionally no GL).
Quality bar and workflow: the **awwwards** skill (`C:\Users\VICTUS\.agents\skills\awwwards\`) — read `references/quality.md` and `references/quality-bar.md` before QA. Design system: `DESIGN.md` in repo root.

## Concept (one line)

The portfolio behaves like a running FastAPI service: routes instead of pages, project index = endpoint registry, hovering a row resolves a floating "200 OK" response panel (signature moment), contact = `POST /contact`, 404 = a proper error payload.
Motion verb: **resolve** (left-to-right wipe, snap, settle). Accent: FastAPI teal `#14b8a6` on near-black `#0c0f12`. Type: Archivo (display, wdth/wght) + JetBrains Mono (data voice).

## Environment notes (Windows)

- Node 24, npm 12. PowerShell. Watch out: PowerShell `Move-Item a b c .` fails with 3+ sources.
- Installed: next 16.4.3, react 19.3, gsap, lenis, playwright (chromium headless installed), axe-core.
- QA commands (run from repo root):
  - `npm run build`
  - `npx next start -p 4400` (background, prod server)
  - `node C:\Users\VICTUS\.agents\skills\awwwards\scripts\shoot.mjs http://127.0.0.1:4400/ --crawl --nav`
  - `node C:\Users\VICTUS\.agents\skills\awwwards\scripts\audit.mjs http://127.0.0.1:4400/ > .shots/audit.txt`
- If shoot.mjs reports no Chromium: `npx playwright install chromium`.

## Remaining work (in order)

1. [ ] **P1 Clean scaffold leftovers**: delete `src/app/page.module.css` and starter `src/app/favicon.ico` (icon.svg convention replaces it); verify `src/app/page.tsx`/`globals.css` imports are clean.
2. [ ] **P2 Build**: `npm run build`. Watch for: typing of `LayoutProps<'/'>` (Next 16 generated types), gsap/SplitText import paths, JSX attribute issues (e.g. numeric `data-delay={j < 3 ? ... : undefined}` on case page — runtime value fine, but `calculate()` CSS typo already fixed), trailing-slash hrefs already normalized to no-slash.
3. [ ] **P3 QA pass 1**: build + `next start -p 4400` (background) + shoot.mjs `--crawl --nav` + audit.mjs. Read `.shots/summary.json`, every `report.json`, and LOOK AT every screenshot (desktop/mobile/reduced-motion/keyboard/hover). Zero console errors, no horizontal overflow, no text hidden under reduced motion, mobile LCP < 2.5s, CLS < 0.05.
4. [ ] **P4 Fix loop**: address shoot/audit findings. Likely suspects to inspect: response panel positioning on narrow desktop, `.ep::before` z-index over section borders, header backdrop-filter perf, hero `data-split="chars"` with `<br>` lines (SplitText), `aria-current` logic in Header, contact big-email hover fill contrast (accent bg + dark text), loader exit timing.
5. [ ] **P5 Critic pass**: launch a FRESH `critic` subagent with the brief from `references/quality-bar.md`, giving it only `.shots/` paths + audit output — never DESIGN.md, never code. Scores must be ≥ 8. Iterate fixes + new critic each pass (min 2 full QA passes).
6. [ ] **P6 Final trim**: "remove one accessory" — cut the weakest decorative effect. Hover/focus/press feedback are never cut.
7. [ ] **P7 Ship artifacts**: OG image via `node $SKILL\scripts\og.mjs <url>` after prod server runs → `public/og.png`, then rebuild. Check favicon/apple-icon, robots, sitemap already exist.
8. [ ] **P8 Commit pipeline (per AGENTS.md)**: `verifier` → `reviewer` → `committer` subagents (committer stages only repo files, Conventional Commits, no Co-Authored-By, no push; `push` subagent only if user explicitly asks). Current git state: **nothing committed yet**; all files untracked. Sensible first commit: `feat: portfolio site (concept, engine, pages, motion)` after P2 build passes, then later commits per QA round.
9. [ ] **P9 README**: `readme-writer` subagent — replace the empty README.md with run/replace-placeholder instructions. NO Contributing/Code of Conduct/License/Support sections.

## Things a new session must know

- Do not add a GL/WebGL layer; decision made (DESIGN.md). Do not add Tailwind.
- Do not remove the engine plumbing (`src/engine/*`, `src/motion/setup.ts`) — it is the framework-agnostic engine from the skill's `references/engine.md`, adapted (GL module stripped).
- The user has ~100k context: keep answers tight, point to files instead of pasting them.
- All project content/socials/email/URLs are placeholders in `src/data/site.ts` (flagged `placeholder: true`). Live links use `.example.com` domains deliberately.
- Name is real: Md Sultan Mahmud Munna ("Munna"). No experience section exists by design — projects carry the site.

## Success criteria

Zero FAILs/zero console errors; critic scores ≥ 8 across Design/Usability/Creativity/Content + dev areas; every placeholder list communicated to the user in the final message; commits clean.
