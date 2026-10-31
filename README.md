# Portfolio

Single-page portfolio for Sultan Mahmud (backend / FastAPI), built as a small
white gallery: plain HTML, CSS, and JavaScript with vendored Three.js. Each
project sits in a vitrine as a draggable Three.js exhibit with a museum label,
all rendered by one shared WebGL stage. A static 404 page is included. There is
no framework, no `package.json`, and no build step.

## Serve

ES modules need HTTP, so serve the folder instead of opening the file:

```bash
python -m http.server 8000
```

Open http://localhost:8000. Any static server works.

## Structure

- `index.html` — all copy: hero, materials list, the four vitrines, contact
- `404.html` — static 404 page
- `assets/css/main.css` — design tokens at the top, then the styles
- `assets/js/main.js` — entry point; wires scroll reveals, contact, and the GL stage
- `assets/js/gl/` — `renderer.js` is the shared stage (one renderer, scissor
  viewports per exhibit); `exhibits/` holds `lens`, `gears`, `valve`, `orrery`
- `assets/vendor/` — Three.js, loaded via the import map in `index.html`
- `assets/fonts/` — Switzer and Fragment Mono

## Placeholders to replace

- Copy in `index.html`: name, projects, museum labels
- Email and GitHub in `assets/js/data.js` (used by the contact section)
- Live URLs: each vitrine's links block in `index.html` shows "live soon"
  until a link is added there
- Domain: canonical, og:url, twitter:image in `index.html`, plus `robots.txt`
  and `sitemap.xml`, point at `https://sultanmahmud.dev` until it resolves
