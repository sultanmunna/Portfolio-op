import { projects } from "@/data/site";
import { CaseBox } from "./CaseBox";

export function Work() {
  return (
    <section className="work" id="work" data-station="03 / services">
      <h2 className="sr-only">Work</h2>
      {projects.map((project) => (
        <CaseBox key={project.slug} project={project} />
      ))}
    </section>
  );
}
