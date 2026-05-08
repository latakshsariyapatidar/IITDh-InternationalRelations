import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Quote, Users, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — International Relations Office, IIT Dharwad" },
      { name: "description", content: "Meet the team driving IIT Dharwad's international engagement — Dean, Chairperson, faculty advisors and student ambassadors." },
    ],
  }),
  component: AboutPage,
});

const advisors = [
  { name: "Prof. A. Sharma", dept: "Computer Science & Engineering" },
  { name: "Prof. R. Iyer", dept: "Mechanical, Materials & Aerospace" },
  { name: "Prof. S. Bhatt", dept: "Electrical, Electronics & Comm." },
  { name: "Prof. M. Kulkarni", dept: "Chemistry" },
  { name: "Prof. P. Rao", dept: "Mathematics" },
  { name: "Prof. N. Verma", dept: "Physics" },
  { name: "Prof. K. Patil", dept: "Civil & Infrastructure Engg." },
  { name: "Prof. V. Joshi", dept: "Humanities & Social Sciences" },
];

const studentTeam = [
  { name: "Aarav M.", role: "Student Coordinator" },
  { name: "Sana R.", role: "Outreach Lead" },
  { name: "Devika P.", role: "Mobility Liaison" },
  { name: "Karan B.", role: "Events" },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About the Office"
        title={<>The people who make <span className="italic text-saffron">IITDh global.</span></>}
        description="A small, dedicated team that connects IIT Dharwad with universities, governments and organisations around the world."
      />

      {/* Leadership messages */}
      <section className="container-editorial py-24">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { role: "Dean — International Outreach", name: "Prof. Dean's Name", body: "International outreach at IIT Dharwad is built on academic excellence and human warmth. Our partnerships are not transactional — they are long-term friendships that move ideas, people and possibilities." },
            { role: "Chairperson — IRO", name: "Prof. Chairperson's Name", body: "We strive to make the journey from interest to arrival as seamless as possible. Reach out — we read every email." },
          ].map((m) => (
            <article key={m.role} className="relative bg-card border border-border rounded-2xl p-10 shadow-soft">
              <Quote className="h-10 w-10 text-saffron mb-6" strokeWidth={1.2} />
              <p className="font-display text-2xl leading-relaxed text-balance">{m.body}</p>
              <div className="mt-8 pt-6 border-t border-border">
                <div className="text-xs uppercase tracking-[0.2em] text-saffron-deep mb-1">{m.role}</div>
                <div className="font-medium">{m.name}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Faculty advisors */}
      <section className="bg-card border-y border-border">
        <div className="container-editorial py-24">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-saffron-deep mb-4">Faculty Advisors</div>
              <h2 className="font-display text-4xl md:text-5xl">Department-wise champions</h2>
            </div>
            <p className="text-muted-foreground max-w-md">
              Each department nominates a faculty advisor to support international students and visiting researchers.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {advisors.map((a) => (
              <div key={a.name} className="group p-6 rounded-xl border border-border bg-background hover:border-saffron hover:-translate-y-1 transition-all">
                <Users className="h-6 w-6 text-saffron-deep mb-4" strokeWidth={1.5} />
                <div className="font-display text-lg">{a.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{a.dept}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student team */}
      <section className="container-editorial py-24">
        <div className="text-xs uppercase tracking-[0.3em] text-saffron-deep mb-4">Student Ambassadors</div>
        <h2 className="font-display text-4xl md:text-5xl mb-12">IR Students Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentTeam.map((s) => (
            <div key={s.name} className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-ink to-ink/80 text-cream p-6 flex flex-col justify-end relative overflow-hidden group">
              <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-saffron flex items-center justify-center text-ink">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="font-display text-2xl">{s.name}</div>
              <div className="text-sm text-cream/60 mt-1">{s.role}</div>
              <div className="absolute inset-0 bg-gradient-warm opacity-0 group-hover:opacity-30 transition-opacity" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
