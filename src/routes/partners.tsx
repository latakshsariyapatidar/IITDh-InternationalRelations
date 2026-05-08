import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Globe2, Building2 } from "lucide-react";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Our Partners — IRO IIT Dharwad" },
      { name: "description", content: "Foreign universities and organisations partnered with IIT Dharwad." },
    ],
  }),
  component: PartnersPage,
});

const universities = [
  { name: "Université Paris-Saclay", country: "France" },
  { name: "TU Munich", country: "Germany" },
  { name: "ETH Zürich", country: "Switzerland" },
  { name: "Kyoto University", country: "Japan" },
  { name: "KAIST", country: "South Korea" },
  { name: "NUS", country: "Singapore" },
  { name: "Purdue University", country: "USA" },
  { name: "ANU", country: "Australia" },
  { name: "EPFL", country: "Switzerland" },
  { name: "Politecnico di Milano", country: "Italy" },
  { name: "University of Edinburgh", country: "UK" },
  { name: "Tohoku University", country: "Japan" },
];

const organisations = [
  { name: "DAAD", country: "Germany" },
  { name: "Campus France", country: "France" },
  { name: "British Council", country: "UK" },
  { name: "Fulbright (USIEF)", country: "USA" },
  { name: "JSPS", country: "Japan" },
  { name: "Korea Foundation", country: "South Korea" },
];

function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Partners"
        title={<>A network <span className="italic text-saffron">across continents.</span></>}
        description="Universities and organisations we collaborate with on research, exchange and capacity-building."
      />

      <section className="container-editorial py-24">
        <div className="flex items-center gap-3 mb-8">
          <Globe2 className="h-6 w-6 text-saffron-deep" />
          <h2 className="font-display text-3xl md:text-4xl">Foreign Universities</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {universities.map((u) => (
            <div key={u.name} className="bg-card p-6 hover:bg-background transition-colors">
              <div className="text-xs uppercase tracking-[0.2em] text-saffron-deep mb-2">{u.country}</div>
              <div className="font-display text-xl">{u.name}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-20 mb-8">
          <Building2 className="h-6 w-6 text-saffron-deep" />
          <h2 className="font-display text-3xl md:text-4xl">Foreign Organisations</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {organisations.map((o) => (
            <div key={o.name} className="bg-card p-6 hover:bg-background transition-colors">
              <div className="text-xs uppercase tracking-[0.2em] text-saffron-deep mb-2">{o.country}</div>
              <div className="font-display text-xl">{o.name}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
