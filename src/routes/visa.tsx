import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Stamp, Clock, FileCheck } from "lucide-react";

export const Route = createFileRoute("/visa")({
  head: () => ({
    meta: [
      { title: "Visa & Immigration — IRO IIT Dharwad" },
      { name: "description", content: "Visa types, extensions and e-FRRO process for international students and visitors at IIT Dharwad." },
    ],
  }),
  component: VisaPage,
});

const cards = [
  { icon: Stamp, title: "VISA Types", text: "Student, Research, Conference, Employment and Tourist visas — choose what matches your stay.", items: ["Student Visa", "Research Visa", "Conference Visa", "Employment Visa"] },
  { icon: Clock, title: "Extension", text: "Renew or extend your visa within India through the FRRO without travelling back home.", items: ["Documents required", "Timelines", "Fees & forms"] },
  { icon: FileCheck, title: "e-FRRO", text: "Online portal for registration, visa extension, exit permits and other immigration services.", items: ["Account creation", "Service requests", "Status tracking"] },
];

function VisaPage() {
  return (
    <>
      <PageHero
        eyebrow="Visa & Immigration"
        title={<>Your stay, <span className="italic text-saffron">sorted.</span></>}
        description="A clear, step-by-step guide to entering and staying in India as an IIT Dharwad student or visitor."
      />

      <section className="container-editorial py-24 grid md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <div key={c.title} className="bg-card border border-border rounded-2xl p-8 hover:shadow-editorial hover:border-saffron transition-all">
            <c.icon className="h-9 w-9 text-saffron-deep mb-6" strokeWidth={1.3} />
            <h3 className="font-display text-2xl mb-3">{c.title}</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">{c.text}</p>
            <ul className="space-y-2 text-sm">
              {c.items.map((i) => (
                <li key={i} className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-saffron" />{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}
