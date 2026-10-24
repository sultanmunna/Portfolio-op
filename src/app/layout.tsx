import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Motion } from '@/components/Motion';
import { site } from '@/data/site';
import { display, mono } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.role}`, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { canonical: './' },
  openGraph: { type: 'website', siteName: site.name, images: ['/og.png'] },
  twitter: { card: 'summary_large_image' },
};

// Runs before first paint: hidden-until-revealed styles only apply when JS and motion are on.
const flags = `document.documentElement.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: 'Backend developer',
  knowsAbout: ['FastAPI', 'Python', 'PostgreSQL', 'Redis', 'AI agents', 'RAG pipelines'],
  url: site.url,
  email: `mailto:${site.email}`,
  sameAs: site.socials.map((s) => s.href),
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: flags }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <div id="curtain" aria-hidden="true"><div className="curtain__panel" /></div>
        <div id="response" aria-hidden="true" className="response">
          <div className="response__head">
            <span className="response__method" />
            <span className="ok">200 OK</span>
            <span className="lat response__lat">12ms</span>
          </div>
          <div className="response__body">
            <span className="muted response__gen" />
          </div>
        </div>
        <div id="loader" role="status" aria-label="Loading">
          <div className="loader__inner">
            <span className="loader__name" data-loader-out>{site.name}</span>
            <span className="loader__count" data-loader-out data-loader-count>000</span>
          </div>
          <div className="loader__bar" data-loader-bar />
        </div>
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
        <Motion />
      </body>
    </html>
  );
}
