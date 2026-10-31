import { site } from "@/data/site";

export function Hero() {
  return (
    <section className="hero" data-station="00 / arrival">
      <h1 className="hero-name">
        <span className="line">
          <span className="line-inner" data-intro>
            Sultan
          </span>
        </span>
        <span className="line">
          <span className="line-inner" data-intro>
            Mahmud
          </span>
        </span>
      </h1>
      <p className="hero-tag">
        <span className="line">
          <span className="line-inner" data-intro>
            {site.tagline}
          </span>
        </span>
      </p>
      <p className="hero-role">
        <span className="line">
          <span className="line-inner" data-intro>
            {site.role}
          </span>
        </span>
      </p>
    </section>
  );
}
