import { intro } from "@/data/site";

export function Intro() {
  return (
    <section className="intro" data-station="01 / the engineer">
      <h2 className="sr-only">Introduction</h2>
      <p className="intro-text" data-reveal>
        {intro.text}
      </p>
    </section>
  );
}
