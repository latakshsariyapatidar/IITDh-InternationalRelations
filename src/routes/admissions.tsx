import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ArrowRight, FileText, Globe, Building2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admissions")({
  head: () => ({
    meta: [
      { title: "International Admissions — IIT Dharwad" },
      { name: "description", content: "Pathways for international students: Study in India, Self-Financed, Embassy and ICCR routes to IIT Dharwad." },
    ],
  }),
  component: AdmissionsPage,
});

const tracks = [
  { icon: Globe, name: "Study in India (SII)", tag: "Govt. of India scheme", text: "A Government of India initiative offering admission and scholarships to international students from partner countries." },
  { icon: FileText, name: "Self-Financed", tag: "Direct admission", text: "Direct application route for self-funded international students across UG, PG and PhD programs." },
  { icon: Building2, name: "Embassy Route", tag: "Bilateral", text: "Nominations through your home country's embassy or high commission for select programs." },
  { icon: Sparkles, name: "ICCR & Others", tag: "Scholarships", text: "Indian Council for Cultural Relations scholarships and other bilateral schemes." },
];

const programSteps = [
  "About the program", "Background & facts", "Video introduction",
  "How to apply", "Contact person", "Testimonials", "FAQs",
];

function AdmissionsPage() {
  return (
    <>
      <PageHero
        eyebrow="International Admissions"
        title={<>Find your <span className="italic text-saffron">pathway in.</span></>}
        description="Four clear routes — pick the one that matches your background, funding and program of choice."
      />

      <section className="container-editorial py-24">
        <div className="grid md:grid-cols-2 gap-6">
          {tracks.map((t, i) => (
            <article key={t.name} className="group relative bg-card border border-border rounded-2xl p-10 hover:border-saffron hover:shadow-editorial transition-all">
              <div className="absolute top-8 right-8 font-display text-6xl text-saffron/10 group-hover:text-saffron/30 transition-colors">
                0{i + 1}
              </div>
              <t.icon className="h-9 w-9 text-saffron-deep mb-6" strokeWidth={1.3} />
              <div className="text-xs uppercase tracking-[0.2em] text-saffron-deep mb-2">{t.tag}</div>
              <h3 className="font-display text-3xl mb-3">{t.name}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{t.text}</p>
              <button className="inline-flex items-center gap-2 text-ink font-medium border-b border-saffron pb-1 group-hover:gap-3 transition-all">
                Learn more <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Program landing template preview */}
      <section className="bg-ink text-cream">
        <div className="container-editorial py-24">
          <div className="text-xs uppercase tracking-[0.3em] text-saffron mb-4">Program Page Template</div>
          <h2 className="font-display text-4xl md:text-5xl mb-12 max-w-2xl">Every program tells its own story.</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {programSteps.map((s, i) => (
              <div key={s} className="border border-cream/15 rounded-xl p-6 hover:border-saffron transition-colors">
                <div className="text-saffron font-display text-2xl mb-2">{String(i + 1).padStart(2, "0")}</div>
                <div className="font-medium">{s}</div>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-saffron text-ink px-6 py-3.5 rounded-full font-medium hover:bg-cream transition-colors">
              Talk to admissions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
