import { machinery } from "@/data/site";

export function Machinery() {
  return (
    <section
      className="machinery"
      id="stack"
      data-station="02 / the machinery"
    >
      <div className="machinery-head">
        <h2>Machinery</h2>
        <p data-reveal>What I run the systems with.</p>
      </div>
      <ol className="machinery-route">
        {machinery.map((group) => (
          <li className="route-stop" key={group.group} data-reveal>
            <span className="route-group">{group.group}</span>
            <div className="route-body">
              <p>{group.role}</p>
              <strong>{group.tools.join(", ")}</strong>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
