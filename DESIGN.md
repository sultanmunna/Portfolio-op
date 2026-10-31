# DESIGN.md

Design contract, rebuild #2. Rebuild #1 (dark, route-spine, amber) was rejected
wholesale by the owner on 2026-10-31 and is scraped. This document replaces it.
Stack is plain HTML + CSS + JS + Three.js, no framework, no build step.
Direction "Gallery light" was chosen by the owner from three options with
previews; do not drift back toward dark ground, amber accents, or condensed
industrial display type.

## 1. Brief

- Subject: Sultan Mahmud, backend developer. FastAPI and applied AI.
- Audience: recruiters, hiring managers, engineering leads.
- Job of the site: get interviews. The four projects carry the page.
- Structure (owner requirement, unchanged): introduction, tech stack, four
  project boxes (GitHub and live icons on top, title, description, a beautiful
  scene below), then contact.
- Assets: none. Projects, email, and links are honest placeholders flagged in
  the README placeholder register.

## 2. Design read and dials

> Reading this as: single-page developer portfolio for recruiters and
> engineering leads, in a white-gallery language (invisible work made
> physical), dial ENERGY 2 / RHYTHM 3 / MOTION 2.

- ENERGY 2: calm, expensive, precise. The room is quiet; the exhibits move.
- RHYTHM 3: five sections, five different layout families (section 5).
- MOTION 2: entrance reveals, hover states, and the exhibits' idle life plus
  drag. No scroll choreography, no parallax, no smooth-scroll library.
  Everything honors `prefers-reduced-motion`.
- design-taste mapping: DESIGN_VARIANCE 7 / MOTION_INTENSITY 5 / VISUAL_DENSITY 3.

## 3. Concept

**The gallery of invisible work.** A backend cannot be photographed, so each
project is shown as a museum exhibit: a physical, draggable Three.js object
whose mechanism IS the project's mechanism. Museum labels carry the data
(materials = stack, year, placement). The visitor walks a white room; the work
is on plinths.

```
Idea:        the projects are exhibits in a small white gallery; each object
             moves the way the backend moves
Metaphor:    museum vitrine: glass case, label, plinth
Signature:   the four draggable GL exhibits, one per project
Emotion:     calm curiosity: "I can touch the invisible thing"
Motion verb: settles like a gallery piece; drifts, then rests
Screenshot:  a chrome-and-cobalt exhibit mid-drag inside a white vitrine,
             museum label beneath
```

Genericness test: a generic model lands at dark hero + gradient + tech chips +
screenshot cards. This is a white room with hairlines, museum labels, and
physically-based draggable objects. Passes.

## 4. Art direction

### Palette (5 roles, one accent)

| Role | Value | Reason |
|---|---|---|
| ground | `#F7F5F0` bone | gallery wall white; warm enough to feel printed, not sterile |
| panel | `#FFFFFF` | vitrine glass panels behind each exhibit, separated from the wall by hairlines |
| ink | `#141311` | near-black text; pure black is banned |
| muted | `#5D594F` | warm gray secondary text, 6.4:1 on bone |
| line | ink at 14% (hairlines), 40% (`line-strong`) for interactive boundaries | structure by line weight, no shadows |
| accent | `#002FA7` International Klein Blue | a museum-famous blue; links, focus rings, labels of live states, and tints inside the GL objects. The one deliberate color on a monochrome page |

No other hues. GL materials are chrome, glass, bone clay, and IKB tints only.

### Typography (2 families)

| Role | Face | Reason |
|---|---|---|
| display + text | Switzer 400/500/600 (Fontshare, self-hosted woff2) | neutral Swiss grotesk, closest free cut to the neo-grotesks that carry real galleries; one family, hierarchy by weight |
| labels | Fragment Mono 400 (Google, self-hosted) | museum label voice: numbers, years, materials, links. Mono only where real data lives |

- Scale: `--t-hero: clamp(3.1rem, 1rem + 8.5vw, 8rem)` (weight 600,
  tracking -0.035em, leading 1.02), `--t-xl: clamp(2.1rem, 1.2rem + 3.6vw,
  4.2rem)` (weight 500), `--t-l: clamp(1.35rem, 1.1rem + 1.2vw, 1.9rem)`
  (weight 400, statement), `--t-body: 1.0625rem`, labels 11 to 12px mono.
- Body measure 60ch max. No uppercase display; labels use normal case.

### Grid, room and vitrines

- 12 fluid columns, gutter `clamp(16px, 2.5vw, 32px)`, outer margin = gutter.
- Hang on three lines: col 1, col 5, col 9.
- Header: name top-left (link home), nav top-right (Work, Stack, Contact),
  mono. Footer doubles as contact. Corner-free; no fixed chrome.
- Vitrines: each project box is a white panel (`panel`), 1px hairline border,
  sharp corners, museum label row at the bottom edge (mono, hairline above).
- Radius: 0 everywhere. Elevation: none; separation is hairline + white panel.

### Motion language

- Entrance reveals: IntersectionObserver adds `.is-in`; CSS transitions
  (opacity, 24px rise, 0.7s cubic-bezier(0.16, 1, 0.3, 1), 60ms stagger).
- Hover: links draw an underline; buttons flood IKB; exhibit canvases show
  `cursor: grab` then `grabbing`.
- Exhibits: slow idle drift (rotation + float); pointer drag rotates with
  inertia. Idle motion is the concept breathing; reduced motion stops drift
  and float, drag stays (user-initiated).
- Page changes: same-origin navigation crossfades for 0.35s (CSS view
  transitions, Chromium); reduced motion and other browsers hard-cut.
- No smooth-scroll library: native scrolling. No scroll listeners; observers
  only.

### WebGL rules

- ONE `WebGLRenderer`, ONE fixed transparent canvas above the page
  (`pointer-events: none`; the header sits above it). Each visible vitrine
  reserves a rect; the renderer draws each exhibit into its rect with
  `setScissor`. Exhibits render only while on screen.
- Each `.vitrine-view` takes direct pointer and keyboard handlers with
  `touch-action: pan-y`, so vertical scroll passes through and the GL canvas
  never needs to catch events.
- Lighting: `RoomEnvironment` PMREM environment (vendored with three) plus one
  directional key. Tone mapping ACES, dpr capped at 2.
- Each exhibit is a self-contained module returning `{ scene, camera,
  update(dt, time) }` built on shared helpers (`gl/helpers.js`): renderer
  singleton, materials, drag controller. No per-exhibit render loops.
- WebGL failure: the canvas is skipped and each stage shows the `.no-gl` text
  message instead of a 3D scene.
- Reduced motion: no idle drift/float; a single frame renders per state change;
  drag still works.

## 5. Composition plan (five families)

### 5.1 Arrival (poster)

```
┌──────────────────────────────────────────────────────┐
│ sultan mahmud                       work stack contact│
│                                                      │
│ Sultan Mahmud builds                                 │   hero type, cols 1-10,
│ the systems you never see.                           │   ink on bone
│                                                      │
│ Backend engineer. FastAPI and applied AI.   (mono)   │   col 5
└──────────────────────────────────────────────────────┘
```

Focal: the type. Pure poster, no GL here (the exhibits are the one signature;
restraint is written down). Mobile: type re-tuned via clamp, nav collapses to
a simple row (three short mono links fit at 390px; no hamburger needed).

### 5.2 Introduction (statement)

```
│ The work I show below is invisible on purpose:      │   t-l statement,
│ servers, queues, retrievers. You cannot screenshot  │   cols 5-12,
│ a backend. So it is shown the only honest way: as    │   hung on col 5
│ machines that move the way the real ones move.       │
```

### 5.3 Materials (tech stack, data family)

```
│ MATERIALS          runtime     Python 3.12, Pydantic, uv
│ (mono heading)     web layer   FastAPI, ASGI, Uvicorn, OpenAPI
│                    data        PostgreSQL, pgvector, Redis, SQLAlchemy
│                    ai          embeddings, OpenAI-compatible APIs, Ollama
│                    ops         Docker, GitHub Actions, pytest, Prometheus
```

Left: mono heading "Materials" plus one line. Right: five rows, hairline
separated, group in ink, role in muted, tools in ink. Desktop two-column;
mobile stacked rows.

### 5.4 Exhibits (the four boxes, vitrine family, the centerpiece)

Each project, one per "wall":

```
┌──────────────────────────────────────────────────────┐
│ 01                                    [gh] [live ↗] │  icons top-right, 44px
│ ASK THE ARCHIVE                                      │  title, t-xl
│ Ask a document archive in plain language, get        │  one-sentence
│ answers with the sources attached.                   │  description
│ ┌──────────────────────────────────────────────────┐ │
│ │                                                  │ │
│ │      GL vitrine: glass lens + drifting shards,   │ │  white panel,
│ │      drag to orbit, shards align behind lens     │ │  16:9, the exhibit
│ │                                                  │ │
│ └──────────────────────────────────────────────────┘ │
│ no. 01 · materials: FastAPI, PostgreSQL, pgvector    │  museum label row
│        · 2026 · placement: personal project          │  (mono, hairline)
└──────────────────────────────────────────────────────┘
```

- GitHub/live icons top-right as the owner specified. Live renders only with a
  URL; otherwise mono text "live soon", never a dead control.
- The exhibit IS the "extra beautiful scene" below: draggable, idle-drifting,
  project-specific mechanism (section 6).
- Mobile: same order; canvas 4:3; drag works with touch (single-pointer
  rotate); label row wraps.

### 5.5 The reply (contact, finale family)

```
│ Take a card.                                        │  t-xl display line
│                                                     │
│ email me (IKB button)   copy address   github       │  one email intent
│                                                     │
│ colophon: Switzer, Fragment Mono, three.js.         │  mono small print
│ No trackers. 2026.                                  │
```

The packet of build #1 is gone; the closing gesture is "take a card" (copy
address), executed plainly. mailto is primary.

### 5.6 404

"Empty plinth": a lone hairline plinth drawing with "404: nothing on this
plinth." plus the way back. Static SVG, carries the concept.

## 6. Exhibit spec (four mechanisms)

All exhibits: white vitrine panel, studio lighting, chrome/glass/bone-clay/IKB
materials only, idle drift, drag-to-orbit with inertia.

1. **Ask the Archive**: a glass lens (transmission disc with chrome rim and
   an inked seat ring) floating over ~90 small tetrahedral shards scattered
   in a cloud. Idle:
   shards drift slowly. Interaction: dragging orbits the whole piece; a click
   pulses the lens: shards briefly align into a neat lattice behind it, then
   relax. Reads as: retrieval focusing scattered documents.
2. **Taskforge**: three interlocking gears (one chrome, two inked) turning at
   different speeds; small IKB blocks ride the ring around the chrome gear and
   drop into an inked chute on the clay base plate. Reads as: jobs picked up,
   worked, completed.
3. **Gatehouse**: a chrome valve wheel atop a short pipe; a stream of small
   bone beads flows through. Idle: steady flow. Click: the valve turns and
   throttles the stream: beads back up and a few deflect (IKB) and fall away.
   Reads as: rate limiting, honestly.
4. **Agentbench**: a small orrery: a chrome hub, three bone nodes orbiting on
   inked rings (retriever, sql, http), IKB pulses traveling node to
   hub. Reads as: tools orchestrated around a plan.

## 7. Content rules and placeholder register

Voice: plain, specific, first person, museum-label dryness. No em or en
dashes in visible text. No stats, no testimonials, no invented credentials.
One label per intent ("email me" everywhere). Copy lives in index.html (the
single page is the single source). The live placeholder register is in
README.md.

## 8. Anti-slop purpose register (R-31 one-liners)

- White gallery: total contrast to the rejected dark build; galleries are
  where invisible work gets made visible (owner-chosen direction).
- IKB accent: one museum-grade blue on a monochrome page; "live" and links
  stay unambiguous (R-29).
- Switzer: neutral Swiss grotesk carries gallery authority without the
  rejected condensed-industrial voice (R-06).
- Fragment Mono scope: museum labels only, real data only (R-06).
- No GL in the hero: the exhibits are the single signature moment; a second
  GL stage would dilute them (one focal point per screen).
- Vitrine boxes instead of cards: the owner's box structure restated in the
  concept's own language (C-3).
- "live soon" text instead of a dead link icon (R-26, R-23).
- No scroll-jacking, no smooth-scroll library: the room is calm; motion
  belongs to the objects (R-19, MOTION 2).

## 9. Quality bar

- LCP under 2.5s on throttled mobile (three.js is lazy: the GL canvas boots
  after first paint; exhibits boot when scrolled near), CLS under 0.05, no
  layout property animations, total page under 3MB with vendored three.
- Zero serious/critical axe violations; skip link; visible IKB focus ring;
  keyboard-operable everything; Escape not required (no overlay).
- No horizontal overflow at 390px; 44px tap targets; drag never traps scroll
  (touch-action pan-y on canvases; drag is horizontal-rotate only... rotated
  via pointer with `touch-action: none` inside the vitrine only).
- Idle motion true (exhibits drift) unless reduced motion; reduced-motion pass
  complete (static exhibits, all content visible).
- QA on the served static build: screenshots desktop + mobile + reduced
  motion, console clean, then a fresh critic subagent scores evidence-only
  and starts each category at 6; the target is no category below 7 on a
  fresh pass.
