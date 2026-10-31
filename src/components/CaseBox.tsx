import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import type { Project } from "@/data/site";
import { Roll } from "./Roll";
import { SceneStage } from "./SceneStage";

export function CaseBox({ project: p }: { project: Project }) {
  return (
    <article className="case">
      <header className="case-head">
        <h3 className="case-title">
          <a href={`/work/${p.slug}`}>
            <Roll text={p.title} />
          </a>
        </h3>
        <div className="case-links">
          <a
            className="icon-link"
            href={p.github}
            aria-label={`${p.title} source on GitHub`}
          >
            <GithubLogo size={18} weight="bold" />
          </a>
          {p.live ? (
            <a
              className="icon-link"
              href={p.live}
              aria-label={`${p.title} live demo`}
            >
              <ArrowUpRight size={18} weight="bold" />
            </a>
          ) : (
            <span className="case-soon">demo soon</span>
          )}
        </div>
      </header>
      <p className="case-summary" data-reveal>
        {p.summary}
      </p>
      <SceneStage id={p.scene} label={p.sceneLabel} cta={p.cta} caption={p.caption} />
    </article>
  );
}
