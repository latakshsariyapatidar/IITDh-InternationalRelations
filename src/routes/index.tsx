import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Globe2, GraduationCap, Users, Sparkles, Play, MapPin } from "lucide-react";
import heroImg from "@/assets/hero-campus.jpg";
import studentsImg from "@/assets/students.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "International Relations Office — IIT Dharwad" },
      { name: "description", content: "A global gateway to IIT Dharwad — international admissions, faculty mobility, partnerships and life on campus." },
    ],
  }),
  component: HomePage,
});

const facts = [
  { value: "30+", label: "Global Partner Universities" },
  { value: "12", label: "Active MoUs" },
  { value: "150+", label: "International Visitors / yr" },
  { value: "20+", label: "Countries Engaged" },
];

const partners = [
  "Université Paris-Saclay", "TU Munich", "Kyoto University", "ETH Zürich",
  "NUS Singapore", "Purdue", "ANU Australia", "EPFL", "KAIST", "Politecnico di Milano",
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden">
        <img
          src={heroImg}
          alt="Aerial view of IIT Dharwad campus at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />

        <div className="container-editorial relative pb-20 pt-32 text-cream">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-saffron mb-6">
              <Sparkles className="h-3.5 w-3.5" /> International Relations Office
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[0.95] text-balance">
              A global gateway<br />
              <span className="italic text-saffron">to IIT Dharwad.</span>
            </h1>
            <p className="mt-8 text-lg md:text-xl text-cream/80 max-w-2xl leading-relaxed">
              Where curious minds from across the world meet rigorous research,
              warm hospitality and the unhurried magic of Karnataka.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/admissions"
                className="group inline-flex items-center gap-2 bg-saffron text-ink px-6 py-3.5 rounded-full font-medium hover:bg-cream transition-colors"
              >
                Apply to study <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/collaboration"
                className="inline-flex items-center gap-2 border border-cream/30 px-6 py-3.5 rounded-full font-medium hover:bg-cream/10 transition-colors"
              >
                Partner with us
              </Link>
            </div>
          </div>
        </div>

        {/* Floating fact bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-cream/95 backdrop-blur-sm border-t border-border">
          <div className="container-editorial grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {facts.map((f) => (
              <div key={f.label} className="px-4 py-5">
                <div className="font-display text-3xl md:text-4xl text-ink">{f.value}</div>
                <div className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mt-1">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIRECTOR'S MESSAGE */}
      <section className="container-editorial py-24 md:py-32">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <div className="text-xs uppercase tracking-[0.3em] text-saffron-deep mb-4">A Word From</div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              The Director<br /><span className="italic text-muted-foreground">& Registrar</span>
            </h2>
          </div>
          <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
            {[
              { role: "Director's Message", name: "Prof. Venkappayya R. Desai", quote: "IIT Dharwad is committed to nurturing globally-minded engineers. Our doors are open — to students, scholars and partners who share our spirit of inquiry." },
              { role: "Registrar's Message", name: "Office of the Registrar", quote: "From admissions to mobility, our team works to make every international experience at IIT Dharwad seamless and enriching." },
            ].map((m) => (
              <article key={m.role} className="bg-card border border-border rounded-2xl p-8 shadow-soft hover:shadow-editorial transition-all">
                <div className="text-xs uppercase tracking-[0.2em] text-saffron-deep mb-3">{m.role}</div>
                <p className="font-display text-xl leading-relaxed text-balance">"{m.quote}"</p>
                <div className="mt-6 text-sm text-muted-foreground">— {m.name}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* OPPORTUNITIES split */}
      <section className="bg-ink text-cream">
        <div className="container-editorial py-24 md:py-32">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-saffron mb-4">Opportunities & Scholarships</div>
              <h2 className="font-display text-4xl md:text-6xl leading-[1] max-w-2xl">
                Pathways for the<br /><span className="italic">world's brightest.</span>
              </h2>
            </div>
            <Link to="/admissions" className="text-saffron hover:text-cream inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em]">
              All programs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: GraduationCap, title: "For Students", to: "/admissions", text: "Study in India, ICCR, exchange semesters, internships and immersion. UG, PG and PhD pathways tailored for international applicants.", tag: "Admissions" },
              { icon: Users, title: "For Faculty & Researchers", to: "/collaboration", text: "SPARC · VAJRA · GIAN · SERB. Joint research, sabbaticals, visiting professorships and short-term collaborations.", tag: "Collaboration" },
            ].map((c) => (
              <Link key={c.title} to={c.to} className="group relative overflow-hidden rounded-2xl border border-cream/15 p-10 hover:border-saffron transition-all">
                <div className="absolute inset-0 bg-gradient-warm opacity-0 group-hover:opacity-10 transition-opacity" />
                <c.icon className="h-10 w-10 text-saffron mb-8" strokeWidth={1.2} />
                <div className="text-xs uppercase tracking-[0.2em] text-cream/50 mb-3">{c.tag}</div>
                <h3 className="font-display text-3xl mb-4">{c.title}</h3>
                <p className="text-cream/70 leading-relaxed mb-6">{c.text}</p>
                <span className="inline-flex items-center gap-2 text-saffron group-hover:gap-3 transition-all">
                  Explore <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO VIDEO */}
      <section className="container-editorial py-24 md:py-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 relative group cursor-pointer rounded-2xl overflow-hidden shadow-editorial">
            <img src={studentsImg} alt="Students at IIT Dharwad" width={1600} height={1200} loading="lazy" className="w-full h-[480px] object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-ink/30 flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-saffron flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="h-7 w-7 text-ink ml-1" fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 text-cream text-sm uppercase tracking-[0.2em]">2 min · Campus Tour</div>
          </div>
          <div className="lg:col-span-5">
            <div className="text-xs uppercase tracking-[0.3em] text-saffron-deep mb-4">Watch</div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6">
              Step inside our<br />campus.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              From sun-drenched courtyards to state-of-the-art labs — get a feel
              of student life, research culture and the rhythm of Dharwad.
            </p>
            <Link to="/life" className="inline-flex items-center gap-2 text-ink border-b border-saffron pb-1 hover:gap-3 transition-all">
              Discover Life @ IITDh <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* PARTNERS MARQUEE */}
      <section className="border-y border-border bg-card overflow-hidden py-12">
        <div className="container-editorial mb-6">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3">
            <Globe2 className="h-4 w-4" /> Partners across the world
          </div>
        </div>
        <div className="flex animate-marquee whitespace-nowrap">
          {[...partners, ...partners].map((p, i) => (
            <div key={i} className="font-display text-2xl md:text-3xl text-muted-foreground/50 px-10">{p}</div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-editorial py-24 md:py-32">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-warm p-12 md:p-20 text-ink">
          <div className="relative z-10 max-w-3xl">
            <MapPin className="h-10 w-10 mb-6" strokeWidth={1.2} />
            <h2 className="font-display text-4xl md:text-6xl leading-[1] mb-6">
              Plan your visit,<br /><span className="italic">your way.</span>
            </h2>
            <p className="text-ink/80 text-lg leading-relaxed mb-8 max-w-xl">
              Whether you're a prospective student, a delegation, or a partner —
              we'll help you experience IIT Dharwad in person.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="bg-ink text-cream px-6 py-3.5 rounded-full font-medium hover:bg-ink/90 inline-flex items-center gap-2">
                Get in touch <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/visits" className="border border-ink/30 px-6 py-3.5 rounded-full font-medium hover:bg-ink/10">
                See past visits
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
