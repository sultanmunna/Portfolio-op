# DESIGN.md — Md Sultan Mahmud Munna, backend developer portfolio

## Phase 0: Brief

- Subject: Md Sultan Mahmud Munna, backend developer. FastAPI is the anchor tool.
- Audience: recruiters and engineering teams evaluating a junior/backend hire.
- Job of the site: prove capability through projects (no experience section exists by design), and make contact effortless.
- Language: English. Placeholder socials + email must be obvious to replace.

## Phase 1: Concept

Three candidates (territories: formal system, profession's material, name):

| | A. The running service (material) | B. One route per breath (formal) | C. Sultan (name) |
|---|---|---|---|
| Idea | The portfolio IS a live FastAPI service: routes instead of pages, a project index of endpoints, skills as a dependency registry, contact as a POST endpoint | The whole home page is one infinite request log; each request resolves into a project | "Sultan" commands; everything sits on a throne-line grid with the name carrying the court |
| Signature | Hovering/resolving an endpoint row streams a 200 OK response panel | A pinned request log scroller | Letterforms as architecture |
| O/F/Fe/P | 4 / 5 / 4 / 2 | 3 / 3 / 3 / 4 | 2 / 3 / 3 / 5 |

**Pick A.** It is anchored in the subject's actual daily material (FastAPI request/response cycle), generates every layout, motion, copy and 404 decision, and scores best on fit and portability-to-others (nobody else can claim FastAPI's exact visual language).

### Concept Card

```
Idea:        The portfolio behaves like a running FastAPI service: you navigate it the way you call it.
Metaphor:    Live service. Routes, endpoints, requests, responses, a health line that never sleeps.
Signature:   The project index is an endpoint registry. Hovering a row resolves a "200 OK" preview
             panel: method + path, latency ticking, a JSON-shaped summary of the project. Clicking
             enters the case page like calling the endpoint (panel keeps resolving during transition).
Emotion:     Opening beautifully typeset API docs that suddenly came alive.
Motion verb: resolve. Small shapes snap (0.25-0.5s expo.inOut snaps), lines stream left-to-right,
             panels settle with a 1px rise. Nothing drifts; everything is resolved, on the clock.
Screenshot:  The endpoint index mid-hover: one row resolved, a floating response panel with
             GET /projects/rag… 200 OK · 12ms and a two-line JSON of the project.
```

Anchor: the actual FastAPI request/response material (docs UI patterns, method chips, status codes, error shapes). FastAPI's teal informs the accent because it comes from the subject's world.

## Phase 2: Art direction system

### Palette (roles; sampled from developer-tool consoles, not AI defaults)

| Role | Hex | Notes |
|---|---|---|
| `--c-bg` | `#0c0f12` | near-black console ground, slightly blue |
| `--c-fg` | `#e3e7ea` | primary ink |
| `--c-muted` | `#8b949e` | secondary text; AA on bg (7.0:1) |
| `--c-line` | `rgb(227 231 234 / 0.14)` | hairlines, borders |
| `--c-surface` | `#121619` | panels, response cards, header |
| `--c-accent` | `#14b8a6` | ONE signal teal, sampled from FastAPI's docs; used for status chips, active states, focus, selection |
| `--c-curtain` | `#121619` | page transition panel |

Error/404 uses a restrained warm signal `#f87171` locally (status code semantics: 4xx is red in every API console).

### Type

- **Archivo** (Google, variable wght+wdth): one family, two personalities. Display = wdth ~110-125, wght 800, uppercase for the mega name. Text = wdth 100, 400/500.
- **JetBrains Mono** (Google): the data voice. Endpoint paths, method chips, status lines, meta labels, coordinates, the loader counter. Never for body copy.
- Roles: display (name, section titles), body (paragraphs, case text), data (everything request-shaped).
- Scale: `--t-mega: clamp(3.2rem, 1rem + 11vw, 11rem)` (long name, must fit), xl, l, m per engine defaults. Display tracking -0.02em (negative weight per size), mono meta +0.08em.

### Grid & rhythm

- 12 columns, fluid gutter. Text blocks hang from col 1, col 5, col 9. Four-corner frame: name top-left, nav top-right, status line bottom-left, "available" chip bottom-right (empty on mobile).
- Section rhythm: tight (8u) and airy (24u+) alternating. The endpoint index rows are full-width.
- Shape: radius 0 everywhere (console). 1px lines are the structural device.

### Composition plan (one family per section, no repeats)

```
HERO        poster + statement hybrid: STATUS line (mono), name at mega size split across
            3 lines ("MD SULTAN / MAHMUD / MUNNA"), role statement below, corners active.
STACK       statement + registry table: "The stack" heading, then a ruled registry:
            rows = group (CORE / DATA / AI / OPS), items in mono chips, one line each.
PROJECTS    index list: each project is an endpoint row
            [METHOD chip] /projects/<slug>   <title>   <year> → hover resolves response panel.
            Signature moment lives here. Touch: inline summary, no floating panel.
ABOUT       asymmetric pair: short bio text col 1-5, "what I'm steering toward" col 7-11.
CONTACT     poster finale: "POST /contact" mega line, email as a big mailto link that
            copies on click (accessibility: real link, copy is progressive), socials as rules.
CASE PAGE   split frame: meta rail (mono: method, year, role, stack) on 3 cols; content on
            8. Media = typographic/procedural cover. Sequence: context, build, outcome.
404         `404 Not Found` set as an error-response payload with a GET / link back.
```

### Motion language

- Family: expo only (`out`, `inOut`, soft for UI).
- Verb "resolve": entering things appear left to right (clip), like output printing. Panels translate 6px up while fading. Never drifts; never floats.
- Signature implementation: GSAP quickTo panel follows pointer across rows; row content sets panel text (streamed with a short position-scramble); latency ticks from a 6-24ms random per row, frozen on settle.
- Idle state: the status line ("GET /healthz 200 · 12ms") re-resolves on a slow clock (every 6-9s), a blinking block cursor on the contact line. One clock via gsap.ticker. Paused under reduced motion.
- Hovers: nav links = underline draw; endpoint rows = the signature resolve; social links = underline rise (utility); CTA (email) = fill from pointer side, in the verb.

### Genericness test

A generic model would produce: centered hero + blob → no (four-corner console frame); Inter + purple gradient → no (Archivo + teal from FastAPI); "3 equal project cards" → no (endpoint index rows); "passionate about backend development" → no (request-log voice: "Istio-free, proxy lethal knitwear" — no. Voice: "I build the parts of the product that never appears on screen, and make sure they respond in under 20ms"). Icon library needed for GitHub/Live link icons → use inline SVGs (real glyph icons), not emoji.

## Phase 3 notes

- No WebGL. The concept's life comes from the response panels, the status line and typography; GL would be decoration here. Keeps mobile fast (no loaded shader at all).
- Loader: mono counter + name, exits in the verb (lines collapse upward). ≤2.6s.
- Images: none of the person (placeholder-owner). Project covers are typographic compositions (hone: title + method chip on surface), honest procedural, no fake screenshots.
- Content file: `src/data/site.ts` with `placeholder: true` on all projects and socials.

## Phase 4 log

- QA passes recorded in `.shots/`. Critic scores appended below.
