// Global motion for this site: runs once on the client, before the first page initializes.
// The concept driver lives here: everything resolves left to right, on one clock.
import { gsap } from 'gsap';
import { ease, onScroll, prefersReducedMotion, isTouch, setLoaderFormat, setLoaderExit, setTransition } from '@/engine';

type RowData = { method: string; path: string; year: string; lines: string; latency: number };

const glyphs = '!<>-_\\/[]{}=+*^?#0123456789abcdef';

/* Text scramble: small strings only (endpoint paths, status lines). Final text stays in the DOM. */
function scramble(el: HTMLElement | null, final: string, duration = 0.45) {
  if (!el) return;
  if (prefersReducedMotion()) { el.textContent = final; return; }
  el.setAttribute('data-final', final);
  const o = { p: 0 };
  gsap.killTweensOf(o);
  gsap.to(o, { p: 1, duration, ease: 'none', overwrite: true, onUpdate: () => {
    const n = Math.floor(o.p * final.length);
    el.textContent =
      final.slice(0, n) +
      [...final.slice(n)].map((c) => (c === ' ' ? ' ' : glyphs[(Math.random() * glyphs.length) | 0])).join('');
  }, onComplete: () => { el.textContent = final; } });
}

/* ── The response panel: the signature moment ───────────────────────── */

function initResponsePanel() {
  const panel = document.getElementById('response');
  if (!panel || isTouch() || prefersReducedMotion()) return;
  const gen = panel.querySelector<HTMLElement>('.response__gen');
  const chip = panel.querySelector<HTMLElement>('.response__method');
  const status = panel.querySelector<HTMLElement>('.response__status');
  const lat = panel.querySelector<HTMLElement>('.response__lat');
  const body = panel.querySelector<HTMLElement>('.response__body');

  const xTo = gsap.quickTo(panel, 'x', { duration: 0.45, ease: 'power3.out' });
  const yTo = gsap.quickTo(panel, 'y', { duration: 0.45, ease: 'power3.out' });

  let activeRow: HTMLElement | null = null;

  const render = (row: HTMLElement, atX: number, atY: number) => {
    const data: RowData = {
      method: row.dataset.method || 'GET',
      path: row.dataset.path || '/',
      year: row.dataset.year || '',
      lines: row.dataset.resp || '',
      latency: parseInt(row.dataset.lat || '12', 10),
    };
    if (chip) chip.textContent = data.method;
    if (gen) scramble(gen, data.path, 0.4);
    if (lat) {
      const o = { v: 1 };
      gsap.to(o, { v: data.latency, duration: 0.5, ease: 'expo.out', overwrite: true,
        onUpdate: () => { lat.textContent = `${Math.round(o.v)}ms`; } });
    }
    if (body) {
      body.innerHTML = '';
      data.lines.split('\n').forEach((line) => {
        const ln = document.createElement('div');
        ln.className = 'ln';
        ln.textContent = line;
        body.appendChild(ln);
      });
      gsap.fromTo(body.querySelectorAll('.ln'),
        { yPercent: 60, autoAlpha: 0, rotate: 0.001 },
        { yPercent: 0, autoAlpha: 1, duration: 0.4, stagger: 0.045, ease: 'expo.out', overwrite: true, clearProps: 'transform' });
    }
    if (status && !status.textContent?.includes('200')) status.textContent = '200 OK';

    const w = panel.offsetWidth || 320;
    const x = Math.min(atX + 28, innerWidth - w - 14);
    const y = atY;
    xTo(x); yTo(y);
  };

  const show = (row: HTMLElement, e?: PointerEvent) => {
    if (activeRow !== row) {
      if (activeRow) activeRow.classList.remove('is-active');
      activeRow = row;
      row.classList.add('is-active');
    }
    const pt = e
      ? { x: e.clientX, y: e.clientY }
      : (() => { const r = row.getBoundingClientRect(); return { x: r.left + r.width * 0.4, y: r.top + 24 }; })();
    render(row, pt.x, pt.y);
    if (!panel.classList.contains('is-on')) panel.classList.add('is-on');
  };

  const hide = () => {
    if (activeRow) { activeRow.classList.remove('is-active'); activeRow = null; }
    panel.classList.remove('is-on');
  };

  document.addEventListener('pointerover', (e) => {
    const row = (e.target as HTMLElement).closest<HTMLElement>('[data-ep]');
    if (row) { show(row, e); return; }
    const inside = (e.target as HTMLElement).closest('#response') || (e.target as HTMLElement).closest('[data-index]');
    if (!inside) hide();
  }, { passive: true });

  document.addEventListener('focusin', (e) => {
    const row = (e.target as HTMLElement).closest?.('[data-ep]') as HTMLElement | null;
    if (row) show(row);
  });
  document.addEventListener('focusout', () => hide());
}

/* ── Status line: the service is alive while nobody touches anything ── */

let statusTimer: gsap.core.Tween | null = null;

function initStatusLine() {
  if (prefersReducedMotion()) {
    const lat = document.querySelector('.status-line .lat');
    if (lat) lat.textContent = '12ms';
    return;
  }
  const lat = document.querySelector<HTMLElement>('.status-line .lat');
  const ok = document.querySelector<HTMLElement>('.status-line .ok');
  const run = () => {
    const target = 6 + ((Math.random() * 30) | 0);
    const o = { v: 1 };
    if (ok) { ok.style.opacity = '0.4'; gsap.to(ok, { opacity: 1, duration: 0.4, delay: (target / 24) * 0.9 }); }
    gsap.to(o, { v: target, duration: (target / 24) * 0.9, ease: 'none', overwrite: true,
      onUpdate: () => { if (lat) lat.textContent = `${Math.round(o.v)}ms`; },
      onComplete: () => { statusTimer = gsap.delayedCall(4 + Math.random() * 3, run); } });
  };
  run();
}

export function setupMotion() {
  setLoaderFormat((p) => String(Math.round(p)).padStart(3, '0'));
  setLoaderExit((root) => gsap.timeline()
    .to(root.querySelectorAll('[data-loader-out]'), { yPercent: -120, duration: 0.5, ease: ease.inOut, stagger: 0.05 })
    .to(root, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.75, ease: ease.inOut }, '-=0.25'));

  // Resolve: the curtain wipes left to right over the old page, retracts right to left.
  setTransition({
    leave: (c) => gsap.timeline()
      .set(c, { autoAlpha: 1 })
      .fromTo(c.querySelector('.curtain__panel'),
        { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: ease.inOut }),
    enter: (c) => gsap.timeline()
      .to(c.querySelector('.curtain__panel'),
        { clipPath: 'inset(0% 0% 0% 100%)', duration: 0.8, ease: ease.inOut })
      .set(c, { autoAlpha: 0 }),
  });

  initStatusLine();
  initResponsePanel();
}
