# Phase 13 — touch vocabulary, clipboard failure, sticky hover

Pass-5 refs: scorecard fix 6 (adjudication 6: REAL — hint swap, deduped to
ux-critic #1's markup over design-critic #3's), ux-critic #2 (mailto
fallback, verified against contact.js:8–18), ux-critic #3 (LOW, 3-line hover
guard). Category: Responsive 8.5 → 9 (unweighted row); 13b/13c are
conversion/a11y polish with no metric moves — cheap enough to ride along.

## Problem

1. All four caption rows teach "drag · arrow keys · enter to …" on touch
   screens where only drag/tap exist (m-03/m-05, index.html:168/204/240/276).
   The site's own meta description promises "machines you can touch"; the
   real touch gestures are drag-orbit and tap (helpers.js:86–116, tap on
   release with `moved < 6` at :113). main.css has no `(pointer: coarse)`
   query anywhere.
2. `assets/js/contact.js:8–18`: on `writeText` rejection the note shows the
   raw email as plain text, then the shared `setTimeout(…, 2200)` wipes it —
   a recruiter in an in-app browser that blocks clipboard writes gets 2.2 s
   to memorize the address. The note is `role="status"` (index.html:290) —
   announced, not keepable.
3. main.css:491–495 applies `.btn:hover` unqualified; iOS sticky hover leaves
   the only non-navigating button, `#copy-email`, permanently inverted after
   a tap. Code-level inference, ranked LOW.

Dedup decision (hint swap): ux-critic #1's two-full-string variant wins over
design-critic #3's split clause — it keeps the complete keyboard vocabulary
for fine pointers, gives touch a real instruction ("drag to orbit") instead
of a truncated one, and is the better-argued case on `display: none` safety
(the keyboard clause is dead instruction on a phone; the full contract stays
in the div's aria-label).

## Changes

### 13a. Coarse-pointer hint swap (index.html, main.css)

In each `.vitrine-label` (lines 168, 204, 240, 276), class the existing hint
span and add one sibling (per-machine verb preserved):

```html
<span class="hint-keys">drag · arrow keys · enter to focus</span>
<span class="hint-touch">drag to orbit · tap to focus</span>
```

Touch strings: 02 "drag to orbit · tap to speed the line", 03 "drag to
orbit · tap to close the valve", 04 "drag to orbit · tap to pulse the hub".

In main.css, after the 560px block (ends line 656), before the reduced-motion
block:

```css
.hint-touch {
  display: none;
}

@media (pointer: coarse) {
  .hint-keys {
    display: none;
  }

  .hint-touch {
    display: inline;
  }
}
```

Both spans are flex items of the existing `.vitrine-label` (main.css:424–434);
the media query resolves before first layout, so `mobileCls` stays 0. Aria
labels (index.html:163/199/235/271) are untouched — keyboard users and screen
readers keep the full vocabulary everywhere.

### 13b. Clipboard failure becomes a persistent mailto link (contact.js, main.css)

`assets/js/contact.js` — move the 2.2 s clear inside the success branch and
render a link on failure:

```js
button.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(email);
    note.textContent = "copied";
    setTimeout(() => {
      note.textContent = "";
    }, 2200);
  } catch {
    const link = document.createElement("a");
    link.href = `mailto:${email}`;
    link.textContent = email;
    note.replaceChildren(link);
  }
});
```

In main.css, directly after `.copy-note` (lines 512–516):

```css
.copy-note a {
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

The link inherits Fragment Mono in IKB on bone (~10:1, AA); the underline
satisfies WCAG 1.4.1. A later successful copy sets `textContent`, which
clears the link. The email in contact.js:1 stays the owner's placeholder.

### 13c. Guard the button hover inversion (main.css)

Wrap lines 491–495:

```css
@media (hover: hover) {
  .btn:hover {
    background: var(--ikb);
    border-color: var(--ikb);
    color: var(--bone);
  }
}
```

`.btn:active` (497–499) stays global so touch press feedback is untouched.

## Don't

- Don't reword the aria-labels or use a width-based media query (an iPad in
  landscape is touch with no keyboard; a narrow desktop window is the
  reverse).
- Don't put `hidden` attributes on the spans — CSS owns the swap.
- Don't clear the failure link on a timer or add a dismiss button.
- Don't wrap `.btn-primary:hover`, `.icon-link:hover`, or `.hero-cue:hover` —
  those targets navigate away; keep the diff on the one control that can
  stick.

## Verify

1. Chrome DevTools device toolbar (forces `pointer: coarse`) at 390×844: all
   four cards read "drag to orbit · tap to …"; toggle emulation off and the
   keyboard clause returns; longest touch string fits one line; rerun the
   mobile pass — m-03..m-05 show the new strings, `mobileCls` 0,
   `axeSerious` 0.
2. Deny clipboard for the site (Site settings → Clipboard → Block), click
   "copy address": the note shows an underlined mailto link that persists;
   activate it → mail client opens. Allow it again: "copied" clears on its
   2.2 s timer as today.
3. Desktop hover unchanged (button inversion still fires, h-02-class pair);
   in touch emulation, tapping "copy address" leaves the button bone/ink.
4. Reduced-motion pass untouched (no motion in this phase); console clean.

## Commits

- `feat: teach touch gestures in the vitrine hints on coarse pointers` (13a)
- `fix: keep a persistent mailto link when the clipboard fails` (13b)
- `fix: apply the button hover inversion only on hover-capable pointers` (13c)

## Done when

Touch users read gestures that exist on their device, the clipboard failure
rescues instead of punishes, sticky hover is scoped to real pointers, and no
vital, fps, or axe number moved.
