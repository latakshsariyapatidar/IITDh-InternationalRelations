import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { useState } from "react";

export const Route = createFileRoute("/collaboration")({
  head: () => ({
    meta: [
      { title: "Collaboration & Mobility — IRO IIT Dharwad" },
      { name: "description", content: "Exchange, internships, immersion and joint programs for international students, faculty and NITC partners." },
    ],
  }),
  component: CollabPage,
});

const tabs = {
  "International Students": {
    headline: "Inbound exchange & internships",
    items: [
      { name: "Course Work Exchange", text: "Take credited courses across departments for a semester or year." },
      { name: "Research Exchange", text: "Work alongside our faculty on cutting-edge problems." },
      { name: "Project Work", text: "Final-year or thesis projects co-supervised at IITDh." },
      { name: "Internship", text: "Summer / winter research internships (typically 8–12 weeks)." },
      { name: "Study Tour", text: "Short curated visits combining academics, culture and travel." },
    ],
  },
  "International Faculty": {
    headline: "SPARC · VAJRA · GIAN · SERB",
    items: [
      { name: "SPARC", text: "Scheme for Promotion of Academic and Research Collaboration." },
      { name: "VAJRA", text: "Visiting Advanced Joint Research faculty scheme." },
      { name: "GIAN", text: "Global Initiative of Academic Networks — short courses." },
      { name: "SERB", text: "Science & Engineering Research Board collaborative grants." },
    ],
  },
  "NITC Students": {
    headline: "Exchange programs",
    items: [
      { name: "UG / DD / PG Exchange", text: "Semester abroad opportunities for our undergraduates and Masters." },
      { name: "MS / PhD Exchange", text: "Joint research stays and dual-supervision arrangements." },
      { name: "Internship", text: "Summer placements at partner labs and companies abroad." },
      { name: "Immersion Program", text: "Short immersive cultural and academic visits." },
    ],
  },
  "NITC Faculty": {
    headline: "Funding & partnerships",
    items: [
      { name: "Bilateral Funding", text: "Joint grants with partner universities and govt. bodies." },
      { name: "Visiting Positions", text: "Sabbaticals and short visiting professorships abroad." },
      { name: "Joint Workshops", text: "Co-organised symposia, schools and special issues." },
    ],
  },
} as const;

function CollabPage() {
  const keys = Object.keys(tabs) as Array<keyof typeof tabs>;
  const [active, setActive] = useState<keyof typeof tabs>(keys[0]);
  const data = tabs[active];

  return (
    <>
      <PageHero
        eyebrow="Collaboration & Mobility"
        title={<>Move people. <span className="italic text-saffron">Move ideas.</span></>}
        description="Exchange, internships, joint research and immersion — for inbound visitors and outbound IITDh community alike."
      />

      <section className="container-editorial py-24">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-border">
          {keys.map((k) => (
            <button
              key={k}
              onClick={() => setActive(k)}
              className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                active === k
                  ? "border-saffron text-ink"
                  : "border-transparent text-muted-foreground hover:text-ink"
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="text-xs uppercase tracking-[0.3em] text-saffron-deep mb-4">{active}</div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">{data.headline}</h2>
          </div>
          <div className="lg:col-span-8 space-y-3">
            {data.items.map((it) => (
              <details key={it.name} className="group bg-card border border-border rounded-xl p-6 hover:border-saffron transition-colors">
                <summary className="cursor-pointer flex justify-between items-center font-display text-xl">
                  {it.name}
                  <span className="text-saffron text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">{it.text}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
