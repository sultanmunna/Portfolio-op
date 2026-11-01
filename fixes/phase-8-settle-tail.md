# Phase 8 — close the first-screen settle tail

Pass-4 refs: scorecard fix 4 (adjudication 4: REAL), design-critic #4,
ux-critic #1 + #2 (merged) + #5 (mechanism correction). Evidence:
`.jury/127.0.0.1-4400-pass4/` report fields `mobile.settledMs 7922` vs
desktop 3554, `mobile.loadMs 4952`, `mobileLcpMs 824`, shots d-00 == d-01.
Category: Usability 7 → 7.5, hardens WPO 8.

## Problem

`mobile.settledMs` is 7922 vs 3554 desktop: the first screen keeps changing
for ~8 s on throttled 4G even though LCP is 824 ms and the hero paints
complete at first paint (d-00 == d-01). Two independent mechanisms, two
independent fixes:

1. **Below-fold content is hostage to the three.js download.**
   `assets/js/main.js:6-10` calls `initReveals()`/`initContact()`, but the
   same module statically imports `./gl/renderer.js` and all four exhibits,
   which pull the vendored three. ES module semantics hold those calls until
   the whole GL graph is fetched and parsed (loadMs 4952 on the rig). Until
   then every `[data-reveal]` element (intro, materials, four vitrines,
   contact) sits at `opacity: 0` (`assets/css/main.css:530-534`). A visitor
   tapping "work" at t=2 s lands on blank vitrines until ~6 s. The
   `:focus-within` force-reveal (`main.css:542-546`) protects keyboard
   users only.
2. **Two first-paint faces are discovered late.** `index.html:28-41`
   preloads only switzer-400 and switzer-600, but first paint also renders
   Switzer 500 (`.site-name`, `main.css:171`) and Fragment Mono (the whole
   nav, `main.css:190`; `.hero-sub`, `main.css:235`). Both swap after the
   load event on slow 4G. (Merged from design-critic #4, which adds the
   500 face, and ux-critic #2, which found the mono face.)

## Changes

### 8a. Arm reveals and contact before the GL graph (assets/js/main.js, index.html)

- `index.html`, immediately before the `main.js` tag (line 280), add an
  inline module matching the file's existing inline-script pattern:

  ```html
  <script type="module">
    import { initReveals } from "./assets/js/reveal.js";
    import { initContact } from "./assets/js/contact.js";

    initReveals();
    initContact();
  </script>
  ```

- `assets/js/main.js`: delete the two imports (lines 6–7) and the two calls
  (lines 9–10). The GL imports and the stage boot stay exactly as they are,
  so the three.js fetch chain keeps starting at the same moment as today.
- Rejected alternative (do not do): converting main.js's GL imports to
  dynamic imports would delay dependency discovery by a tick and churn five
  import lines for the same result.

### 8b. Preload the two missing first-paint faces (index.html)

After the switzer-600 preload (line 41), before the stylesheet link:

```html
<link
  rel="preload"
  href="./assets/fonts/switzer-500-normal.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
<link
  rel="preload"
  href="./assets/fonts/fragment-mono-400-normal.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

Both filenames confirmed against the `@font-face` sources in
`main.css:13` and `main.css:29`. Adds two small requests ahead of
CSS discovery; the critical path stays ~85 KB since the CSS already loads
both files.

## Don't

- Don't touch `--muted` or any contrast value (adjudicated artifact).
- Don't raise the idle-motion viewport threshold: `renderer.js:56-61`
  (`culled()`, ±40px margin) already skips update+draw off-screen;
  `idleAt "35%"` is just where the first vitrine crosses that line. Freezing
  a visible machine would trade a metric for the product (ux-critic #5).
- Don't compress any "hero intro" — there is none; the hero is complete at
  first paint.
- Don't add modulepreload hints or restructure main.js beyond 8a.

## Verify

1. Serve (`node C:\Users\VICTUS\.agents\skills\jury\scripts\serve.mjs
   "D:\Study\Coding\Portfolio" --port 4400`), re-run shoot + audit into a
   new `.jury` dir. Expect: `mobile.settledMs` drops toward the ~3.5 s
   fixed-wait floor; `mobileLcpMs` stays ≈ 824; d-00 == d-01 still holds;
   audit 0 FAIL / 0 WARN.
2. Manual throttled check: scroll to `#work` within 2 s of load — sections
   reveal, no blank vitrines.
3. Copy button still works (click "copy address", note prints "copied").
4. Reduced motion: reveals show instantly (`reveal.js` reduce branch),
   `reduced.moving` false, nothing else changed.
5. Console clean; both font requests start at ~0 s in the network log.

## Commits

- `fix: arm reveals and contact before the gl graph loads` (8a)
- `fix: preload the first-paint font faces` (8b)

## Done when

Throttled `mobile.settledMs` sits near the desktop floor with LCP and CLS
unchanged, and no `[data-reveal]` section is blank while three.js is still
downloading.
