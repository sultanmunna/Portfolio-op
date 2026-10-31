# DESIGN.md

Design contract for the Sultan Mahmud portfolio. Built with the awwwards method
(concept first, art direction second) and filtered through antislop (during mode).
Every major decision carries a one-line reason (R-31). Implementation must obey
this document; changes to direction happen here first.

## 1. Brief

- Subject: Sultan Mahmud, backend developer. FastAPI and applied AI.
- Audience: recruiters, hiring managers, engineering leads, other developers.
- Job of the site: get interviews. With no professional experience yet, the four
  projects carry the page, so the projects section is the centerpiece.
- Structure (owner's requirement, fixed): introduction, tech stack, four project
  boxes (GitHub and live icons on top, title, description, a beautiful scene
  below), then contact.
- Assets provided: none. Copy and projects are honest placeholders (section 7).
- Language: English. Theme: dark, confirmed by owner ("Dark, living systems").

## 2. Design read and dials

> Reading this as: single-page developer portfolio for recruiters and
> engineering leads, in a dark living-systems language (infrastructure at
> night), dial ENERGY 3 / RHYTHM 3 / MOTION 3.

- ENERGY 3: poster-scale type, committed dark identity, one bold accent.
- RHYTHM 3: every section uses a different layout family (section 5).
- MOTION 3, scoped: the only scroll-choreographed system is the packet
  (section 3). Scenes are state machines that play when in view. No parallax,
  no pin-spam, no template reveals. Everything honors `prefers-reduced-motion`.
- design-taste mapping: DESIGN_VARIANCE 8 / MOTION_INTENSITY 7 / VISUAL_DENSITY 3.

## 3. Concept

Three candidates from three territories, scored O / F / Fe / P (originality,
fit, feasibility, portability; lower P is better):

| | A. The quiet court (name) | B. The site is its own API (material) | C. One round trip (process) |
|---|---|---|---|
| Idea | Sultan means authority: the site is a court at night, the visitor a petitioner, the work heard not shown | Sections are routes, meta is headers, the 404 is a real response | Your visit is one request: it arrives, passes through the machinery, visits four services, and returns to you as the reply |
| Layout | chambers along a corridor | documentation as page | a route spine with stations; projects as stacked service cases with live scenes |
| Motion | processions | resolves | flows like current, settles on arrival |
| Scores | 4 / 3 / 3 / 2 | 3 / 4 / 5 / 3 | 4 / 5 / 4 / 2 |

Pick: **C. One round trip**. Highest fit (it is literally how backend work
works) and the most generative: it dictates the spine layout, the packet
motion, per-project live scenes, the contact section as the returning reply,
and the 404 as a failed request. B lives mostly in labels; A drifts toward
ornament. Steals: from B, the designed 404 as an honest failed response and
request-state language in scene readouts; from A, nothing structural.

Concept card:

```
Idea:        you are the client: your visit is one request that leaves you,
             travels through Sultan's machinery, and returns as a reply
Metaphor:    the request lifecycle of a backend system
Signature:   the packet: one amber pulse that descends a persistent route
             spine as you scroll; every section is a station it passes and
             each project scene runs as it arrives
Emotion:     calm, ordered motion: "his systems run, and I can watch them run"
Motion verb: flows like current, settles on arrival
Screenshot:  the packet crossing a project scene mid-sequence, the spine lit
             behind it
```

Genericness test: a generic model lands at dark hero + gradient glow + tech
chips + screenshot cards + contact form. This design has none of those: no
glow washes, tech as labeled stations on a route, live SVG scenes instead of
screenshots, mailto plus copy instead of a dead form. Passes.

## 4. Art direction

### Palette (6 roles, one accent)

| Role | Value | Reason |
|---|---|---|
| ground | `#0C0E12` | deep blue-black: night machinery; cool so the accent and ivory read as lit |
| ground-2 | `#13161D` | scene stages and elevated surfaces, one step up |
| ink | `#ECE7DC` | warm ivory: the human voice, warm against the cool ground |
| muted | `#9AA2B1` | cool slate for secondary text, passes AA on ground |
| line | ivory at 14% | hairlines, structural; `line-strong` (ivory at 32%) borders interactive elements so boundaries pass 3:1 |
| accent | `#E8A33D` | signal amber: the packet, live states, focus ring. Amber reads as current and heat without the acid-green or purple tells; warm-on-cool is the page's one deliberate contrast |

No other colors exist. Scenes may dim the accent (alpha), never add hues.
Pure black and white are banned.

### Typography (3 roles, third one tiny and functional)

| Role | Face | Reason |
|---|---|---|
| display | Big Shoulders (Google, variable) | condensed industrial lettering: infrastructure plates and vessels; the machinery world in type form |
| text | Host Grotesk (Google) | clean, slightly humanist; quiet enough to let display lead, not Inter |
| mono | DM Mono (Google) | third voice for real data only: station labels, scene readouts, status language; never for headings or eyebrows |

- Fluid scale: `--t-mega: clamp(4rem, 1.2rem + 13vw, 15rem)`,
  `--t-xl: clamp(2.4rem, 1.4rem + 4.6vw, 5.5rem)`,
  `--t-l: clamp(1.6rem, 1.25rem + 1.8vw, 2.75rem)`,
  `--t-body: clamp(1rem, 0.95rem + 0.2vw, 1.125rem)`, `--t-s: 0.875rem`,
  `--t-xs: 0.75rem` (mono meta).
- Display: leading 0.85 to 0.9, tracking -0.02em, optical alignment via small
  negative indents, `text-wrap: balance`, descender room on split lines.
- Body: 16 to 18 px, measure max 60ch. Mono meta: 12 to 14 px, tabular numerals.
- Mono scope rule (R-06): mono appears only where real state or data is shown.

### Grid and frame

- 12 fluid columns, gutter `clamp(16px, 2.5vw, 32px)`, outer margin = gutter.
- Hang everything on three vertical lines: col 1, col 5, col 9.
- Four-corner frame: name top-left (link home), nav top-right (Work, Stack,
  Contact), packet station readout bottom-left (real state, section 3),
  "Email me" bottom-right (real mailto). Corner zones stay empty otherwise;
  the frame steps aside on scroll down and returns on scroll up.
- Radius rule: all sharp (0). Elevation is line weight, not shadow. Interactive
  elements are rectangular with `line-strong` borders.

### Motion language

- One clock: `gsap.ticker`. Lenis smooth scroll on pointer devices; native
  scroll on touch. No `requestAnimationFrame` loops, no scroll listeners.
- Eases: travel `none` or `power1.inOut`, arrivals `power3.out`, live breathing
  `sine.inOut`. Durations: micro 250 to 400 ms, reveals 0.6 to 0.9 s, stagger
  40 to 70 ms. Big things move slower than small things.
- Hover, one treatment per role: primary targets flood or roll (label slides
  inside a clipped line, fill floods); utility links change color only; the
  packet nudges toward hovered interactive elements.
- Idle: the packet breathes softly at rest; scenes loop quietly while in view
  and pause offscreen. The concept never fully freezes.
- Reduced motion: no smooth scroll, no scrub, no loader theatrics, scenes show
  their designed still frame, the packet sits as a static marker on the spine,
  all content fully visible.

### The packet (signature system)

One driver module owns it. Input: scroll progress. Outputs: packet position
along the spine, spine fill, the corner station readout, and scene activation
windows. Idle input: time (the breathing pulse). The spine is a real vertical
line on the col-1 axis, drawn per section; the packet travels it, dips into
each project scene while that case is in view, and completes the loop at the
contact section where the reply "returns" to the visitor.

## 5. Composition plan (five families, no repeats)

### 5.1 Hero (poster family)

```
┌──────────────────────────────────────────────────────┐
│ sultan mahmud                       work stack contact│
│                                                      │
│ SULTAN                                               │   mega display,
│ MAHMUD                                               │   two lines, col 1
│                                                      │
│ I build the part you never see.                      │   role line, col 5
│ Backend engineer. FastAPI and applied AI.            │
│                                                      │
│ ● station 00 / arrival              email me         │   corner readout + action
└──────────────────────────────────────────────────────┘
```

Focal: the name. Loader hands off here: the spine draws in, the packet is
born at the name. Mobile: name re-tuned via clamp, corners collapse to a top
bar plus full-screen menu overlay (focus-trapped, Escape closes).

### 5.2 Introduction (statement family)

```
┌──────────────────────────────────────────────────────┐
│ │ (spine)                                            │
│ │   I am Sultan Mahmud. I build backends: FastAPI    │   t-l paragraph,
│ │   services, data models, and the AI systems        │   cols 2 to 10,
│ │   behind them. No company has hired me for it      │   no eyebrow
│ │   yet: what I have instead are systems I           │
│ │   designed, built, broke, and fixed myself.        │
│ │                                                    │
│ ● station 01 / the engineer                          │
└──────────────────────────────────────────────────────┘
```

Focal: the statement. Honest about no experience; the voice carries it.
Mobile: full-width text, same rhythm.

### 5.3 Machinery, the tech stack (diagram family, asymmetric pair)

```
┌──────────────────────────────────────────────────────┐
│ │ Machinery        │  the route, top to bottom:      │
│ │ What I run the   │  ─ runtime     Python, Pydantic │
│ │ systems with.    │  ─ web layer   FastAPI, ASGI    │
│ │                  │  ─ data        PostgreSQL,      │
│ │                  │    pgvector, Redis, SQLAlchemy  │
│ │                  │  ─ ai          embeddings, LLM  │
│ │                  │    tooling, evaluation          │
│ │                  │  ─ ops         Docker, CI,      │
│ │                  │    pytest, observability        │
│ ● station 02 / the machinery                          │
└──────────────────────────────────────────────────────┘
```

Left (cols 1 to 4): title plus one line. Right (cols 5 to 12): the stack as
stations along the spine, each group a mono label and its tools in text with
a plain-language role ("FastAPI: the doors"). No chips, no logo wall, no
grid texture. The packet stops at each group as you scroll. Mobile: stacked,
spine on the left edge.

### 5.4 Work (stacked cases family, the centerpiece)

Four full-width cases, each:

```
┌──────────────────────────────────────────────────────┐
│ ASK THE ARCHIVE              [github] [live]         │  title left, icons right,
│ A RAG service: ask a document archive in plain       │  44px targets
│ language, get answers with sources.                  │
│ ┌──────────────────────────────────────────────────┐ │
│ │  scene: chunks fly into a vector field, three    │ │  live SVG stage,
│ │  neighbors light up, an answer assembles         │ │  ground-2, 16:7
│ │  ( send a query )                                │ │  real button
│ └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

- Icons: GitHub mark and external-link glyph (Phosphor set, relevance: the
  standard forge and outbound marks). Live link renders only if a URL exists;
  otherwise a muted "demo soon" label, never a dead control.
- The scene is the proof: no screenshots exist for backend work, so each case
  shows its system running (spec in section 6). The "send" button injects a
  real interaction into the scene.
- Hover: the title's inner label rolls; the scene brightens one step; the
  packet dips in. Whole case is keyboard-reachable; scenes are labeled.
- Mobile: case stacks (title, icons row, description, scene, button); scenes
  scale via SVG viewBox; spacing re-tuned.

### 5.5 Contact (finale family)

```
┌──────────────────────────────────────────────────────┐
│ │  YOUR REQUEST LEAVES.                              │  display line,
│ │  MY REPLY COMES BACK.                              │  cols 1 to 12
│ │                                                    │
│ │  email me        copy address      github          │  one email intent,
│ │                                                    │  three real actions
│ │  colophon: Big Shoulders, Host Grotesk, DM Mono.   │  small print,
│ │  No trackers. 2026.                                │  real only
└──────────────────────────────────────────────────────┘
```

Focal: the display line. The packet completes the loop here and settles into
the period of the last line. Actions: mailto (primary), copy-address button
with real "copied" feedback, GitHub link. No form (a form with no backend is
a dead control). Mobile: stacked actions, 44px targets.

### 5.6 Inner pages

- `/work/[slug]` case page per project: title, one-line summary, meta (role,
  year, stack, links), the scene at full width, then context, idea, craft,
  outcome from the placeholder content, next-project link with a shared
  element transition (the case title grows into the next title).
- 404: the round trip failing honestly: "404: no service at this route" in
  the system's voice, with the way back. Carries the concept.

## 6. Scene spec (four live systems)

All scenes: SVG on `ground-2`, one accent, mono readouts, driven by the one
GSAP clock, IntersectionObserver-gated (pause offscreen), `aria-label`
describing what happens, real button, and a designed reduced-motion still
frame (final state, captioned). Readouts print the visitor's own real elapsed
time, never invented metrics.

1. **Ask the Archive** (RAG service). Left: a source document splits into
   chunks; chunks fly into a scattered dot field (the vector space); a query
   pulse enters; the three nearest neighbors glow and draw lines to the query;
   an answer assembles on the right. Button: "send a query" replays the
   retrieval with a fresh query pulse.
2. **Taskforge** (async job queue). Jobs drop onto an intake rail; three
   worker bays pick tiles, fill a progress stroke, and release them to a done
   column; a backlog meter breathes; an occasional job retries (dashed amber,
   honest about failure). Button: "enqueue a job" adds one.
3. **Gatehouse** (API gateway, rate limiting). Request pulses stream through
   a gate; a token bucket above refills segment by segment; under-limit
   requests pass and exit "200"; over-limit ones deflect downward, outlined,
   "429". Button: "burst" sends a burst and sheds some, honestly.
4. **Agentbench** (AI agent orchestrator). A plan node emits three steps; the
   steps fan out to tool nodes (retriever, sql, http) that light in turn;
   results flow back and an answer assembles; a mono trace prints real
   elapsed milliseconds. Button: "run a task" re-runs the plan.

## 7. Content rules and placeholder register

Voice: plain, specific, first person, sentence case, a little dry confidence.
Under-20-word hero line. No em or en dashes anywhere visible. Banned:
elevate, seamless, unleash, cutting-edge, passionate, "where X meets Y".
One label per intent: "Email me" everywhere. Numbers appear only as real
visitor-session data; no stats, no testimonials, no client logos.

Every invented fact is `placeholder: true` in `src/data/site.ts` with a top
comment listing assumptions, mirrored in the final handoff message:

- Email `hello@sultanmahmud.dev` (derived from the name; owner must replace).
- GitHub URL `https://github.com/sultanmahmud` (owner must replace).
- Four projects, invented for the owner to replace with real work:
  Ask the Archive (FastAPI, pgvector, retrieval), Taskforge (queue, Redis,
  workers), Gatehouse (gateway, rate limiting), Agentbench (agent
  orchestration). Titles evocative but plausible; no real company names.
- Live links: omitted until the owner provides URLs ("demo soon" label shown).
- Stack groups (section 5.3) are the owner's presumed tools, marked
  placeholder in `site.ts` for easy editing.
- Location: omitted (unknown). Availability: omitted (unknown).

## 8. Anti-slop purpose register (R-31 one-liners)

- Dark theme: the subject is invisible machinery made visible; night is where
  systems run (owner-confirmed direction, R-21 developer reason).
- One amber accent: a single signal color means "live" stays unambiguous (R-29).
- Big Shoulders display: infrastructure lettering for a machinery concept (R-06).
- DM Mono scope: only real states and data; never headings (R-06).
- All-sharp radius with hairlines: engineering plates; hierarchy by line
  weight, not shadow (R-11, R-12).
- Spine and packet: the identity motif, repeated in hero, readout, scenes,
  contact, and 404 (Part 3 identity motif).
- Scenes instead of screenshots: no product UI exists to shoot; diagrams of
  real systems are the honest stand-in (R-22, C-5).
- mailto and copy instead of a form: every control does something real (R-26).
- Loader: a short handshake that reflects real loading, max 2.6 s, then the
  packet is born (continuity, not decoration).
- No scroll cues, no decorative dots, no eyebrow badges, no version labels.

## 9. Quality bar

- Throttled mobile LCP under 2.5 s, CLS under 0.05, JS under 300 KB gzipped
  (no WebGL keeps this easy), page under 3 MB, loader done in 2.6 s.
- Zero serious or critical axe violations; skip link first; every focus stop
  visible (2 px amber ring); keyboard closes the menu with Escape.
- No horizontal overflow at 390 px; tap targets 44 px; hover never required.
- `idleMotion` true (the packet breathes); reduced-motion pass complete.
- QA on the production build with shoot.mjs and audit.mjs, then a fresh
  critic subagent scores it evidence-only, two full passes, every score 8+.
- Final pass cuts the weakest accessory; hover, focus and press states survive.
