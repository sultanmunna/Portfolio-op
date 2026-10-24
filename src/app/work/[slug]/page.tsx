import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GitHubIcon, ArrowUpRight } from '@/components/Icons';
import { projects } from '@/data/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: p.title, description: `${p.title} (${p.year}): ${p.tagline}` } : {};
}

export default async function Work({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  return (
    <article className="case">
      <header className="case__head" style={{ display: 'grid', gap: 'calc(var(--u) * 2)' }}>
        <p className="case__route">
          <span className="ep__head-chip mono">{p.method}</span>
          <span className="mono">{p.path}</span>
          <span className="mono muted">&rarr; 200 OK</span>
        </p>
        <h1 style={{ fontSize: 'var(--t-xl)', fontFamily: 'var(--f-display)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 0.92, letterSpacing: '-0.02em', fontVariationSettings: 'wdth 114' }} data-split="lines" data-intro>
          {p.title}
        </h1>
        <p className="muted" style={{ maxWidth: '30em' }} data-reveal="up" data-delay="0.5">{p.tagline}</p>
      </header>

      <div style={{ margin: 'calc(var(--u) * 3) var(--gutter) 0' }} data-reveal="up" data-delay="0.3">
        <div className="case__banner">
          <div>
            <p className="mono">{p.method} {p.path}</p>
            <p className="t">{p.title}</p>
          </div>
          <p className="mono" style={{ textAlign: 'right' }}>
            served by<br /><span className="accent">fastapi</span>
          </p>
        </div>
      </div>

      <div className="case__grid">
        <div className="case__meta" data-reveal="up">
          <dl>
            <div><dt>year</dt><dd>{p.year}</dd></div>
            <div><dt>role</dt><dd>{p.role.join(' · ')}</dd></div>
            <div><dt>stack</dt><dd>{p.stack.join(' · ')}</dd></div>
          </dl>
          <div className="links">
            <a className="case-link" href={p.links.github} target="_blank" rel="noopener noreferrer">
              <GitHubIcon /> source on github
            </a>
            <a className="case-link" href={p.links.live} target="_blank" rel="noopener noreferrer">
              <ArrowUpRight /> live demo
            </a>
          </div>
        </div>
        <div className="case__content">
          {p.body.map((sec, j) => (
            <section className="case__chapter" key={sec.heading} data-reveal="up" data-delay={j < 3 ? String(0.2 + j * 0.12) : undefined}>
              <h2>{sec.heading.toLowerCase()}</h2>
              <p>{sec.text}</p>
            </section>
          ))}
        </div>
      </div>

      <div style={{ margin: 'calc(var(--u) * 6) var(--gutter)', paddingTop: 'calc(var(--u) * 2)', borderTop: '1px solid var(--c-line)' }}>
        <Link href={`/work/${next.slug}`} className="next-link" style={{ display: 'grid', gap: '0.4em' }}>
          <span className="mono muted">next project · {next.method} {next.path}</span>
          <span style={{ fontSize: 'var(--t-l)', fontFamily: 'var(--f-display)', fontWeight: 800, textTransform: 'uppercase', fontVariationSettings: 'wdth 114', lineHeight: 1 }}>
            {next.title} <span className="arr" aria-hidden="true">&rarr;</span>
          </span>
        </Link>
      </div>
    </article>
  );
}
