# Phase 4 — copy and layout polish

Audit refs: A-07, A-08, A-09. Critic fixes 6, 7, 9. All LOW priority, all
small; three tiny commits.

## Changes

### 4a. Orphan "of." (index.html ~line 81)

`What the machines are made of.` → bind the last two words:
`What the machines are made&nbsp;of.` No CSS change; the orphan disappears at
both the 24ch desktop measure and the mobile stack (d-03, m-02).

### 4b. Dead band before the contact section (assets/css/main.css ~line 411)

`.contact` top padding `var(--sp-a)` (150–260px) stacks on `.exhibits`
bottom `var(--sp-n)` (110–200px): up to ~460px of empty cream before
"Take a card." (d-07). Change `.contact` padding to
`var(--sp-t) var(--gutter) var(--sp-n)`. Screenshot d-07's viewport after:
the gap should read as intentional breathing, roughly matching the
intro → materials rhythm. If it still reads dead at 1440, `var(--sp-n)` is
the ceiling; do not go tighter than `--sp-t`.

### 4c. Muted contrast headroom (assets/css/main.css, token ~line 41)

`--muted: #6b675f` passes AA at ~4.96:1 on bone, but it carries the 11px mono
museum labels, so there is zero headroom (audit `contrastNeedsReview` ×4).
Change to `--muted: #5d594f` — ≈6.3:1 on bone, ≈6.9:1 on white panels.
This darkens nav links, roles, vitrine labels, colophon and the no-gl message
one step; check the page still reads as two text weights (ink vs muted), not
one. Do not touch `--ink` or `--line`.

## Don't

- Don't re-wrap any other copy, don't touch section spacing other than 4b.
- Don't bump font sizes to "fix" contrast.

## Verify

1. Desktop + 390 screenshots of Materials (no orphan), the gap above
   "Take a card.", and the vitrine labels at their new value.
2. Contrast check on the new muted over bone and over a white panel.
3. Full-page scroll pass: rhythm still cascades (hero → intro → materials →
   exhibits → contact) with no section feeling glued or floating.
4. Console clean.

## Commits

- `fix: bind the materials tagline against an orphan word` (4a)
- `fix: tighten the gap before the contact section` (4b)
- `fix: darken muted text for contrast headroom` (4c)

## Done when

No orphan at either breakpoint, the contact gap reads intentional, muted
labels clear 6:1, and nothing else moved.
