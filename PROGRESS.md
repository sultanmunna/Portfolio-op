# PROGRESS.md — live status (auto-updated)

> Companion to `PLAN.md` (roadmap + commands + environment). This file tracks what is DONE right now.
> Last manual write: session start, before first build.

## Completed so far

- [x] Requirements gathered from user: name Md Sultan Mahmud Munna, backend/FastAPI, 4 invented projects w/ GitHub + live placeholder links (icons on links), stack section incl. AI + databases, contact with email/GitHub/LinkedIn/X, no experience section, unique premium design.
- [x] Choices: Next.js 16 + TS + GSAP + Lenis; "dark technical terminal" direction; concept locked (see DESIGN.md / PLAN.md).
- [x] Scaffold: files merged into repo root (create-next-app scaffold, node_modules + deps installed: gsap, lenis, playwright + chromium, axe-core).
- [x] Engine ported (no GL): `src/engine/{env,scroll,reveal,loader,interactions,transition,index,next}.tsx` — one clock, page lifecycle, reveals, loader, curtain transitions.
- [x] Content: `src/data/site.ts` — 4 projects (answerline, tidepool, cartline, cronmill) with case bodies, endpoint data, placeholder links; stack registry; socials/email placeholders.
- [x] Fonts: `src/app/fonts.ts` (Archivo variable wdth, JetBrains Mono via next/font/google).
- [x] Design system: `src/app/globals.css` (tokens + engine CSS + all site styles).
- [x] Global motion driver: `src/motion/setup.ts` (loader format/exit, L→R curtain, response-panel signature, status line idle loop, frame-away).
- [x] Components: `Header.tsx`, `Motion.tsx`, `Icons.tsx` (GitHub/LinkedIn/X/Arrow glyphs), `CopyEmail.tsx`.
- [x] Pages: `layout.tsx` (flags, loader, curtain, response panel, JSON-LD), home (`page.tsx`: hero/stack/projects/about/contact/footer), case `work/[slug]/page.tsx` (static params, metadata, next-project link), `not-found.tsx` (404 payload), `sitemap.ts`, `robots.ts`, `icon.svg`.
- [x] `DESIGN.md` (concept + art direction) and `PLAN.md` (roadmap) written.

## NOT done yet / next immediate action

- [ ] Nothing committed to git yet (everything untracked; branch `First`).
- [ ] **P1**: delete `src/app/page.module.css`, starter `src/app/favicon.ico`.
- [ ] **P2**: `npm run build` — first verification, fix whatever surfaces.
- [ ] Then continue with P3–P9 in `PLAN.md`.

## Session heartbeat

Last updated: 2026-10-24 13:25 (watchdog cycle 4/12)
Git: 3 commits, last "remove greeting from README" (no new commits) + all root items untracked (src/, public/, .shots/, .opencode/, configs/docs). Nothing staged/modified.
Newest files: src/motion/setup.ts (13:25:13), src/app/page.tsx (13:25:13), src/app/globals.css (13:25:01).
.shots: QA pass 1 artifacts resting — .shots/summary.json (13:22:00: home 0 errors, 7 small targets, mobileLcp 6444ms) + 404/report.json; nothing new since.
Stage guess: fix pass in progress — header/case-page/globals/motion edited 13:24–13:25 right after QA summary; expect rebuild + QA pass 2 next.
