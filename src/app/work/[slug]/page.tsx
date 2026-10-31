import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { projects } from "@/data/site";
import { Roll } from "@/components/Roll";
import { SceneStage } from "@/components/SceneStage";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
  };
}

export default async function CasePage({ params }: Params) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  return (
    <main id="main" className="case-page">
      <p className="case-back">
        <Link href="/#work">
          <ArrowLeft size={14} /> back to work
        </Link>
      </p>
      <h1 className="case-h1">{project.title}</h1>
      <p className="case-lede" data-reveal>
        {project.summary}
      </p>
      <dl className="case-meta">
        <div>
          <dt>role</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt>year</dt>
          <dd>{project.year}</dd>
        </div>
        <div>
          <dt>stack</dt>
          <dd>{project.stack.join(", ")}</dd>
        </div>
        <div>
          <dt>links</dt>
          <dd>
            <a href={project.github}>
              <GithubLogo size={12} style={{ display: "inline" }} /> github
            </a>
            {" · "}
            {project.live ? (
              <a href={project.live}>
                live <ArrowUpRight size={12} style={{ display: "inline" }} />
              </a>
            ) : (
              <span className="case-soon">demo soon</span>
            )}
          </dd>
        </div>
      </dl>
      <div className="case-scene">
        <SceneStage
          id={project.scene}
          label={project.sceneLabel}
          cta={project.cta}
          caption={project.caption}
        />
      </div>
      <div className="case-body">
        {project.body.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p data-reveal>{section.text}</p>
          </section>
        ))}
      </div>
      <nav className="next-case" aria-label="next project">
        <span className="next-label">next service</span>
        <Link href={`/work/${next.slug}`}>
          <Roll text={next.title} />
        </Link>
      </nav>
    </main>
  );
}
