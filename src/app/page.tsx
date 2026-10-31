import { site } from "@/data/site";
import { Hero } from "@/components/Hero";
import { Intro } from "@/components/Intro";
import { Machinery } from "@/components/Machinery";
import { Work } from "@/components/Work";
import { Contact } from "@/components/Contact";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    jobTitle: "Backend engineer",
    description: site.description,
    sameAs: [site.github],
  };

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Intro />
      <Machinery />
      <Work />
      <Contact />
    </main>
  );
}
