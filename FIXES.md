# FIXES.md

Phased fix plan from the 2026-10-31 jury + antislop audit of the gallery-light
build (branch `First`). Evidence lives in `.jury/127.0.0.1-4400/` (scorecard,
55 screenshots, shoot + axe reports) and `anti-slop/audit-001-2026-10-31.md`.

## How to use

Point an AI session at this file and name one phase, e.g. "Read FIXES.md and
execute fixes/phase-1-a11y-hover.md only." Each phase file is self-contained:
it lists the exact changes, the files, the verification, and the commits.
Fix one phase, verify, commit, stop. Do not start the next phase unless asked.

## Ground rules for any agent working a phase

- **DESIGN.md is the visual contract.** Palette (bone/white/ink/muted/IAB),
  type (Switzer + Fragment Mono), radius 0, hairlines, no shadows. No new
  colors, fonts, or motion vocabulary.
- **Follow AGENTS.md.** One logical change per commit, Conventional Commits,
  imperative subject under 72 chars, no Co-Authored-By, never push, never
  touch anything outside the change scope.
- ** antislop rules apply to all UI edits** (the session resolves its mode per
  its own core rules; no saved settings file exists).
- **No fabricated content** (R-17/R-18/R-38). Phase 5 is owner-input-gated;
  do not invent outcomes, metrics, or URLs.
- **Verify before done.** Serve with `python -m http.server 8000` (from the
  repo root). Check: console clean, desktop 1440 and phone 390 screenshots,
  keyboard Tab/Enter where focus changed, reduced-motion pass when motion is
  touched. Jury capture tooling is already installed:
  `node ~/.cache/jury/../node_modules` is set up; the scripts live at
  `C:\Users\VICTUS\.agents\skills\jury\scripts\` (`shoot.mjs`, `audit.mjs`,
  `serve.mjs`). Phase 7 has the exact commands.
- **Known capture gotchas** (don't misread them as regressions): the page
  clock pauses when the tab is not foreground, so idle reveals can look stuck
  in captures; `desktopFps` on home reads low in headless runs while throttled
  mobile holds 60; a hover crop can land off-target (h-02 did).
- `.jury/` and `anti-slop/` are untracked audit artifacts. Don't commit them,
  don't delete them. Phase 6 adds ignore rules.
- When a phase is done: tick its row in the status table, note the commit sha.

## Status

| # | Phase file | Scope | Status |
|---|---|---|---|
| 1 | [phase-1-a11y-hover.md](fixes/phase-1-a11y-hover.md) | Visible focus + hover feedback (A-01, A-03, A-04) | done b246ed7 (deviation: the 4 flags were focus landing on unrevealed vitrines mid smooth-scroll, not missing styles, so 6d4543a also adds instant keyboard scroll + focus force-reveal) |
| 2 | [phase-2-exhibits.md](fixes/phase-2-exhibits.md) | Valve color bug + exhibit materiality (A-02, critic d-04/d-05) | done 9bf6871 (deviation: block drops are gated to the ring's bottom arc and funnel x to −0.85 instead of snapping, which would drop them through the gear disc; base plate sits below the ring sweep, not the file's example y) |
| 3 | [phase-3-seo.md](fixes/phase-3-seo.md) | Canonical, twitter card, robots, sitemap, 404 h1 (A-05) | done 91d2889 |
| 4 | [phase-4-polish.md](fixes/phase-4-polish.md) | Orphan "of.", contact gap, muted contrast (A-07, A-08, A-09) | done 40328c9 |
| 5 | [phase-5-content.md](fixes/phase-5-content.md) | Project depth + first live link — OWNER INPUT REQUIRED | blocked — owner confirmed 2026-10-31 that repos, problem sentences, outcomes, live URLs and contact details are all placeholders; nothing real to integrate (R-17/R-38), so 5a–5c reopen when content exists |
| 6 | [phase-6-hygiene.md](fixes/phase-6-hygiene.md) | .gitignore, PLAN.md, data.js, DESIGN.md dead specs | done e81c70a (deviation: the doc's muted hex, t-xl 4.6 and §6 "dispose on teardown" also drifted from phases 1–4/2, so the sync covered them; the "SVG still" fallback sentence never existed, the truthful .no-gl line was added instead; README had no data.js bullet to remove) |
| 7 | [phase-7-rescore.md](fixes/phase-7-rescore.md) | Fresh jury re-score + close-out | done (new blind card 7.2 vs 7.0, no category dropped; evidence in .jury/127.0.0.1-4400-rescore/; the home h-01/h-03 noHoverChange flags are off-target rig crops — both controls' hovers verified directly in the phase 1 evidence) |
| 8 | [phase-8-settle-tail.md](fixes/phase-8-settle-tail.md) | First-screen settle tail: arm reveals/contact before the GL graph + preload two first-paint faces | done c4e16c0 + b183cb2 (reveals armed before the gl graph; both first-paint faces preloaded) |
| 9 | [phase-9-exhibit-stills.md](fixes/phase-9-exhibit-stills.md) | Exhibit stills: lens reframe + ink shard cloud, seat Taskforge blocks, ink Gatehouse pipe, touch hints in label rows | done 2ff42af + 1c9c128 + bdf8c9d + bdabd6b + 49d82eb (lens reframed + ink cloud, blocks seated + train centered, pipe inked, keyboard contract in label rows, contract palette synced) |
| 10 | [phase-10-composition-polish.md](fixes/phase-10-composition-polish.md) | Hero cue to #work + 404 plinth poster scale | planned (pass-4 critique loop) |

Run order 1 → 10. Phase 5 stays blocked until the owner answers its question
register; everything else is unblocked. Pass-4 evidence:
`.jury/127.0.0.1-4400-pass4/` (card 7.35, best so far; adjudicated artifacts
and the owner-gated register — content, email placeholder, contested 404
motion — are listed at the bottom of that card).
