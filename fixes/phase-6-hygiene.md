# Phase 6 — repo hygiene (ponytail cuts)

Run this AFTER phases 1–4 so DESIGN.md is edited once, against the final
state of the build. Net effect: about −144 lines, −0 deps, zero behavior
change. ponytail-audit refs.

## Changes

### 6a. .gitignore — rewrite

The current file is the scraped Next.js template (node_modules, .next,
vercel, *.tsbuildinfo rules) in a repo with no package.json. Replace the
whole file with:

```
# audit artifacts
/.shots
/.jury
/anti-slop
```

### 6b. Delete PLAN.md

Every phase in it is executed and verified; it now describes a build that
has moved on, and duplicates the placeholder register. Git history keeps it.
If the owner wants the phased work tracked, FIXES.md is that file now.

### 6c. Inline data.js (assets/js/data.js, assets/js/contact.js)

data.js has one consumer. In contact.js, drop the import and declare:

```js
const email = "hello@sultanmahmud.dev"; // placeholder, owner must replace
```

and use `email` in the copy handler. Delete assets/js/data.js. index.html
stays the single source for the mailto/github hrefs (they can't be injected
without JS; the register documents both locations — that is intentional, say
so in the register line if it isn't already).

### 6d. DESIGN.md — remove dead specs, fix the score demand

- §4 WebGL rules: delete the `dispose()` contract sentence (nothing tears
  down; the contract was never implemented); delete the "vitrine pointer
  events are captured by each vitrine's overlay div" sentence — the shipped
  implementation is direct pointer handlers on `.vitrine-view` with
  `touch-action: pan-y`; describe that instead; delete "dpr capped at 2
  (1.5 on small screens)" → "dpr capped at 2"; the WebGL-failure fallback is
  a text message via the `.no-gl` class, not a static SVG still — say that.
- §4 typography scale: the hero clamp in CSS is
  `clamp(3.1rem, 1rem + 8.5vw, 8rem)` with leading 1.02 — the doc says
  `3.4rem / 9.5vw / 10.5rem` and leading 0.98. Make the doc match the CSS.
- §7: keep the content rules; replace the duplicated placeholder register
  with a pointer: "The live placeholder register is in README.md."
- §9: replace "every score 8+" with "the critic scores evidence-only and
  starts each category at 6; the target is no category below 7 on a fresh
  pass." Demanding scores is score-shopping; the honest number from the
  2026-10-31 pass was 7.0.

### 6e. README — structure section

Remove the `assets/js/data.js` bullet (6c). Everything else stays.

## Don't

- Don't delete `.jury/` or `anti-slop/` — they're now ignored, not removed.
- Don't "clean up" any other doc or add a Contributing/License section
  (AGENTS.md forbids it).

## Verify

1. `python -m http.server 8000` still serves; the contact "copy address"
   button copies and the fallback prints the email (contact.js change).
2. `grep -r "data.js" --include="*.html" --include="*.js" --include="*.md" .`
   returns only historical/handoff mentions you decided to keep, none
   functional.
3. `git status` clean after commits; `git check-ignore .jury anti-slop` both
   ignored.
4. Serve + quick visual pass: nothing changed visually.

## Commits

- `chore: replace stale next.js gitignore` (6a)
- `chore: remove the executed implementation plan` (6b)
- `refactor: inline the contact email and drop data.js` (6c)
- `docs: align design contract with the shipped build` (6d–6e)

## Done when

Repo has no files or rules it doesn't use, docs describe the build that
exists, and git status is clean.
