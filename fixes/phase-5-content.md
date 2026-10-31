# Phase 5 — content depth and the first live link

**BLOCKED: owner input required.** Audit refs: critic fix 8, Content 7→8.
Every project is currently one sentence and all four say "live soon" — all
honest placeholders. This phase must NOT fabricate outcomes, metrics, names,
or URLs (R-17/R-18/R-36/R-38). Do not start until the owner answers.

## Step 1 — ask the owner (stop and wait for answers)

For each project (Ask the Archive, Taskforge, Gatehouse, Agentbench):

1. Is the GitHub repo URL in index.html real? (Currently a placeholder.)
2. One sentence, plain language: what was the hardest problem in it, and what
   did you do about it? (This becomes the second sentence of the vitrine.)
3. Any honest, verifiable outcome (tests, load numbers, users)? If none, say
   "none" — the label row stays as is. Never invent a number.
4. Is any demo deployable now? If yes, its URL. One is enough for this phase.

Also confirm the real contact email and GitHub handle (currently
`hello@sultanmahmud.dev` / `sultanmahmud` placeholders).

## Step 2 — integrate the answers

### 5a. Second sentence per vitrine

Extend each `.vitrine-desc` (index.html ~lines 130, 165, 200, 235) with the
owner's problem sentence. Keep museum-label voice: plain, specific, first
person where the existing copy uses it, no em/en dashes, no buzzwords
(R-02, R-15, R-16). Copy pattern:

```html
<p class="vitrine-desc">
  Ask a document archive in plain language, get answers with the
  sources attached.
  <span class="vitrine-note">The hard part was ...</span>
</p>
```

Add `.vitrine-note` to main.css: `display: block; margin-top: 8px;
color: var(--muted); font-size: 0.9375rem;` — or fold the sentence into the
same `<p>` if the block reads better unwrapped. Pick by eye, keep one pattern
for all four.

### 5b. First live link

Wherever the owner supplied a URL (exactly one for this phase), replace that
vitrine's `<span class="live-soon">live soon</span>` with:

```html
<a class="live-soon live-link" href="URL" rel="noopener">visit live</a>
```

Add to main.css: `.live-link { color: var(--ikb); text-decoration: underline;
text-underline-offset: 4px; padding: 10px 0; }` and
`.live-link:hover { text-decoration-thickness: 2px; }`. The other three
vitrines keep "live soon" (R-26: honest label, not a dead control).

### 5c. Register

README "Placeholders to replace": remove the lines for whatever the owner
confirmed real; keep the rest.

## Verify

1. Copy self-audit: read every visible string aloud; flag anything that sounds
   written to impress instead of inform; rewrite flat.
2. Desktop + 390: descriptions don't overflow the 52ch measure, label rows
   still wrap cleanly, the live link is a ≥24px target and visible.
3. The live URL loads.
4. Contrast on `.vitrine-note` (muted on panel) with the phase-4 value.

## Commits

- `feat: second sentence per project from owner answers` (5a, 5c)
- `feat: first live project link` (5b)

## Done when

All four vitrines carry a real problem sentence sourced from the owner, one
live link works, and the register matches reality.
