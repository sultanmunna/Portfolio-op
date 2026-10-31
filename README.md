# Portfolio

Single-page portfolio for Md Sultan Mahmud Munna (backend / FastAPI), built with Next.js 15 (App Router, TypeScript) and React 19. Per-project case pages live under `/work/[slug]`. Motion is GSAP with Lenis smooth scrolling; project scenes are hand-built SVG animations. All content is data-driven from `src/data/site.ts`.

## Prerequisites

- Node.js 20+

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build & start

```bash
npm run build
npm run start
```

## Placeholders to replace

Edit `src/data/site.ts`. Name is real; replace the rest:

- `site.url` — production URL (canonical, OG, sitemap, robots)
- `site.email`
- `site.github`
- Each project's `github` field, and add its `live` URL when a demo exists (omitted `live` renders "demo soon")
- Each project is flagged `placeholder: true` until replaced with real work
