import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initPacket(reduce: boolean) {
  const layer = document.querySelector<HTMLElement>(".packet-layer");
  if (!layer) return;

  const spine = layer.querySelector<HTMLElement>(".packet-spine");
  const fill = layer.querySelector<HTMLElement>(".packet-fill");
  const node = layer.querySelector<HTMLElement>(".packet-node");
  const readout = document.querySelector<HTMLElement>(".frame-readout");
  const rows = Array.from(document.querySelectorAll<HTMLElement>("[data-frame-row]"));
  const stations = Array.from(document.querySelectorAll<HTMLElement>("[data-station]"));

  const breathe =
    !reduce && node
      ? gsap.to(node, {
          scale: 1.45,
          opacity: 0.7,
          duration: 1.6,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        })
      : undefined;

  let lastLabel = "";

  if (!stations.length && readout) {
    readout.textContent = "in transit";
  }

  const trigger = ScrollTrigger.create({
    start: 0,
    end: () => document.documentElement.scrollHeight - window.innerHeight,
    onUpdate: (self) => {
      if (fill) gsap.set(fill, { scaleY: self.progress });
      if (node && spine) {
        const travel = spine.offsetHeight - 9;
        gsap.set(node, { y: self.progress * travel });
      }

      if (stations.length && readout) {
        const mid = window.innerHeight * 0.5;
        let current = stations[0];
        for (const station of stations) {
          if (station.getBoundingClientRect().top <= mid) current = station;
        }
        const label = `station ${current.dataset.station}`;
        if (label !== lastLabel) {
          lastLabel = label;
          readout.textContent = label;
        }
      }

      const away = self.direction === 1 && self.scroll() > 140;
      rows.forEach((row) => row.classList.toggle("is-away", away));
    },
  });

  return () => {
    breathe?.kill();
    trigger.kill();
    rows.forEach((row) => row.classList.remove("is-away"));
  };
}
