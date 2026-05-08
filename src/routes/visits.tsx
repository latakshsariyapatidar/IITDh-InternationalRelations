import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Calendar, MapPin, Users } from "lucide-react";

export const Route = createFileRoute("/visits")({
  head: () => ({
    meta: [
      { title: "Visits & Delegations — IRO IIT Dharwad" },
      { name: "description", content: "Visiting delegations, events and partner visits to IIT Dharwad." },
    ],
  }),
  component: VisitsPage,
});

const visits = [
  { date: "Mar 2026", title: "TU Munich Delegation", country: "Germany", purpose: "Joint research workshop on sustainable materials.", people: 8 },
  { date: "Feb 2026", title: "Kyoto University Faculty Visit", country: "Japan", purpose: "Exploration of joint PhD programs in computing.", people: 4 },
  { date: "Jan 2026", title: "Campus France Roadshow", country: "France", purpose: "Student mobility and scholarships information session.", people: 3 },
  { date: "Nov 2025", title: "ANU Research Symposium", country: "Australia", purpose: "Three-day symposium on climate and infrastructure.", people: 12 },
];

function VisitsPage() {
  return (
    <>
      <PageHero
        eyebrow="Visits & Delegations"
        title={<>Conversations that <span className="italic text-saffron">become collaborations.</span></>}
        description="A record of partner visits, delegations and signing ceremonies hosted at IIT Dharwad."
      />

      <section className="container-editorial py-24">
        <div className="space-y-4">
          {visits.map((v) => (
            <article key={v.title} className="group grid md:grid-cols-12 gap-6 items-start bg-card border border-border rounded-2xl p-8 hover:border-saffron hover:shadow-editorial transition-all">
              <div className="md:col-span-2">
                <div className="inline-flex items-center gap-2 text-saffron-deep">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm uppercase tracking-[0.18em]">{v.date}</span>
                </div>
              </div>
              <div className="md:col-span-7">
                <h3 className="font-display text-2xl md:text-3xl mb-2">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.purpose}</p>
              </div>
              <div className="md:col-span-3 flex md:flex-col gap-4 md:gap-2 md:items-end text-sm">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-saffron-deep" /> {v.country}</div>
                <div className="flex items-center gap-2"><Users className="h-4 w-4 text-saffron-deep" /> {v.people} delegates</div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
