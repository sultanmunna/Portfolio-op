# Phase 3 — SEO plumbing

Audit refs: A-05 (R-38), critic fix 5, audit WARNs 1–5 (0 FAIL).
Semantics/SEO 6 → 8 and Markup 7 → 8 on the scorecard.

## Problem

No canonical, no twitter:card, no robots.txt, no sitemap, and the 404 page's
"404" is a `<p>`. og:url/og:image point at the placeholder domain
`sultanmahmud.dev` — flagged in data.js, but the tags wear final clothes.

## Changes

### 3a. index.html head (after the existing og block, ~line 18)

```html
<link rel="canonical" href="https://sultanmahmud.dev/" />
<meta property="og:url" content="https://sultanmahmud.dev/" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Sultan Mahmud, backend engineer" />
<meta
  name="twitter:description"
  content="Four backend projects shown as machines you can touch."
/>
<meta name="twitter:image" content="https://sultanmahmud.dev/og.png" />
```

Keep `https://sultanmahmud.dev` as the canonical host — it is the intended
domain. It stays a flagged placeholder until it resolves (register update
below).

### 3b. New file robots.txt (repo root)

```
User-agent: *
Allow: /

Sitemap: https://sultanmahmud.dev/sitemap.xml
```

### 3c. New file sitemap.xml (repo root)

Single `<url>` for `https://sultanmahmud.dev/` with `lastmod` = the date you
ship this phase. 404 is never listed.

### 3d. 404.html (~line 28)

`<p class="nf-code">404</p>` → `<h1 class="nf-code">404</h1>`. The universal
reset kills the default h1 margin; `.nf-code` already sets the type. No CSS
change needed.

### 3e. Register updates

- README "Placeholders to replace": add one line — the domain in canonical,
  og:url, twitter:image, robots.txt, and sitemap.xml is
  `https://sultanmahmud.dev` until it resolves.

## Don't

- Don't add analytics, verification meta tags, or a meta keywords tag.
- Don't touch og:image content or generate a new image.

## Verify

1. Re-run the audit:
   `node C:\Users\VICTUS\.agents\skills\jury\scripts\audit.mjs http://127.0.0.1:4400`
   (serve first). Expect the canonical, twitter, robots, sitemap and 404-h1
   WARNs gone: 0 FAIL, 0 WARN.
2. `curl` robots.txt and sitemap.xml return 200; the 404 page shows the h1.
3. Home still renders identically (meta-only change).

## Commits

- `feat: canonical, twitter card, robots.txt and sitemap` (3a–3c)
- `fix: 404 page heading is a real h1` (3d)
- `docs: register the placeholder domain in readme` (3e)

## Done when

Audit is 0 FAIL / 0 WARN and the register names every file holding the
placeholder domain.
