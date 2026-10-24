import Link from 'next/link';
import { CopyEmail } from '@/components/CopyEmail';
import { GitHubIcon, LinkedInIcon, XIcon } from '@/components/Icons';
import { projects, site, stack } from '@/data/site';

export default function Home() {
  return (
    <>
      <section className="hero">
        <p className="hero__route" data-reveal="fade" data-intro>
          <span className="ok">● 200 OK</span>
          <span className="muted"> · </span>
          <span className="mono">GET / </span>
          <span className="lat mono muted">· 09ms</span>
        </p>
        <h1 className="hero__name" data-split="chars" data-intro data-delay="0.1">
          Md Sultan
          <br />
          Mahmud
          <br />
          Munna
        </h1>
        <div className="hero__foot">
          <div className="hero__role" data-reveal="up" data-intro data-delay="0.55">
            <p className="lead">
              I build the parts of the product that never appear on screen, and I make sure they answer fast.
            </p>
            <p className="sub">
              Backend developer working in FastAPI: typed APIs over PostgreSQL, Redis in the middle,
              RAG pipelines when the client is an AI. Everything I ship is measured, tested, and boring on purpose.
            </p>
          </div>
          <div className="hero__meta" data-reveal="up" data-intro data-delay="0.7">
            <p className="mono"><strong>4</strong> routes registered</p>
            <p className="mono"><strong>FastAPI</strong> first language</p>
            <p className="mono"><strong>2025/26</strong> build years</p>
          </div>
        </div>
      </section>

      <section id="stack" className="section" aria-labelledby="stack-h">
        <div className="section-head">
          <h2 id="stack-h" data-split="lines">Stack</h2>
          <p className="mono muted" data-reveal="fade">service registry · v1.0</p>
        </div>
        <div className="registry">
          {stack.map((g) => (
            <div className="registry__row" key={g.group}>
              <p className="registry__group"><strong>{g.group}</strong>group</p>
              <div className="registry__items" data-reveal="up">
                {g.items.map((chip) => <span className="chip" key={chip}>{chip}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="work" className="section" data-index aria-labelledby="work-h">
        <div className="section-head">
          <h2 id="work-h" data-split="lines">Projects</h2>
          <p className="mono muted" data-reveal="fade">{projects.length} endpoints · hover to inspect</p>
        </div>
        <div className="index">
          {projects.map((p) => (
            <Link
              href={`/work/${p.slug}`}
              className="ep"
              key={p.slug}
              data-ep
              data-method={p.method}
              data-path={p.path}
              data-year={String(p.year)}
              data-resp={p.response.join('\n')}
              data-lat={String(9 + Math.round((projects.indexOf(p) * 7 + p.slug.length * 3) % 29))}
            >
              <span className="ep__method">{p.method}</span>
              <span className="ep__path">{p.path}</span>
              <span className="ep__title">{p.title}</span>
              <span className="ep__year">{p.year}</span>
              <span className="ep__tagline">{p.tagline}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="about-h">
        <div className="section-head">
          <h2 id="about-h" data-split="lines">About</h2>
          <p className="mono muted" data-reveal="fade">who am i</p>
        </div>
        <div className="about">
          <div className="about__bio" data-reveal="up">
            <p>
              I&rsquo;m Mahmud Munna, most people call me Munna. I&rsquo;m a backend developer, and my home
              base is Python with FastAPI on top. I got here by building real services instead of collecting
              certificates: an answering API, a chat backend, a checkout system, a job scheduler. Each one
              exists because I wanted the honest version of a thing everyone does badly.
            </p>
            <p>
              My taste: typed edges, decimal money, idempotent writes, logs you can actually read. No
              experience section yet: the Projects section is my proof of work, and it&rsquo;s written to
              be read like one.
            </p>
          </div>
          <div className="about__next" data-reveal="up" data-delay="0.15">
            <h3>what I&rsquo;m steering toward</h3>
            <ul>
              <li><span className="n">01</span><span>product teams that need a FastAPI backend from zero</span></li>
              <li><span className="n">02</span><span>AI products where the backend, not the prompt, is the work</span></li>
              <li><span className="n">03</span><span>codebases where tests are part of the design</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section id="contact" className="section contact" aria-labelledby="contact-h">
        <div className="section-head">
          <h2 id="contact-h" data-split="lines">Contact</h2>
          <p className="mono muted" data-reveal="fade">application/json accepted</p>
        </div>
        <p className="route" data-split="chars">
          POST <span className="accent">/</span>contact
        </p>
        <div className="contact__row" data-reveal="up">
          <a className="contact__mail" href={`mailto:${site.email}`}>
            {site.email}
            <span className="btn__fill" aria-hidden="true" />
          </a>
          <CopyEmail email={site.email} />
        </div>
        <p className="contact__note" data-reveal="up">
          Send your request body: a role, a scope, a repo. I read everything and reply within a day.
          If the mailto link feels heavy, the copy button is one tap.
        </p>
      </section>

      <footer className="footer">
        <p className="mono">&copy; {new Date().getFullYear()} {site.name}</p>
        <div className="socials">
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label.toLowerCase() === 'github' && <GitHubIcon />}
              {s.label.toLowerCase() === 'linkedin' && <LinkedInIcon />}
              {s.label.toLowerCase() === 'x / twitter' && <XIcon />}
              {s.label}
            </a>
          ))}
        </div>
        <p className="mono">set in archivo + jetbrains mono</p>
      </footer>
    </>
  );
}
