import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Mail, Phone, MapPin, Building2, Handshake, GraduationCap, Plane } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — International Relations Office, IIT Dharwad" },
      { name: "description", content: "Contact the IRO at IIT Dharwad for admissions, collaborations, mobility and visit coordination." },
    ],
  }),
  component: ContactPage,
});

const desks = [
  { icon: Building2, title: "Chairperson, IRO", scope: "Office of International Relations", email: "chair-iro@iitdh.ac.in", phone: "+91 836 2212 800" },
  { icon: Handshake, title: "International Collaboration", scope: "Collaborations, MoUs, visit coordination", email: "collab-iro@iitdh.ac.in", phone: "+91 836 2212 802" },
  { icon: GraduationCap, title: "International Admission", scope: "ICCR, SII, Embassy, Direct admissions", email: "admissions-iro@iitdh.ac.in", phone: "+91 836 2212 803" },
  { icon: Plane, title: "International Mobility", scope: "Inbound & outbound student mobility", email: "mobility-iro@iitdh.ac.in", phone: "+91 836 2212 804" },
];

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Talk to the <span className="italic text-saffron">right desk.</span></>}
        description="Our team is small and responsive. Pick the desk that matches your need — we'll come back to you quickly."
      />

      <section className="container-editorial py-24">
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {desks.map((d) => (
            <div key={d.title} className="group p-8 rounded-2xl border border-border bg-card hover:shadow-editorial hover:border-saffron transition-all">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-saffron/15 flex items-center justify-center shrink-0 group-hover:bg-saffron transition-colors">
                  <d.icon className="h-5 w-5 text-saffron-deep group-hover:text-ink" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl">{d.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-5">{d.scope}</p>
                  <div className="space-y-2 text-sm">
                    <a href={`mailto:${d.email}`} className="flex items-center gap-2 hover:text-saffron-deep">
                      <Mail className="h-4 w-4" /> {d.email}
                    </a>
                    <a href={`tel:${d.phone}`} className="flex items-center gap-2 hover:text-saffron-deep">
                      <Phone className="h-4 w-4" /> {d.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact form + map */}
        <div className="grid lg:grid-cols-2 gap-8">
          <form onSubmit={(e) => e.preventDefault()} className="bg-ink text-cream rounded-2xl p-10">
            <h3 className="font-display text-3xl mb-6">Send a message</h3>
            <div className="space-y-4">
              <input className="w-full bg-cream/10 border border-cream/20 px-4 py-3 rounded-md focus:outline-none focus:border-saffron" placeholder="Full name" />
              <input type="email" className="w-full bg-cream/10 border border-cream/20 px-4 py-3 rounded-md focus:outline-none focus:border-saffron" placeholder="Email" />
              <select className="w-full bg-cream/10 border border-cream/20 px-4 py-3 rounded-md focus:outline-none focus:border-saffron">
                <option className="text-ink">Subject — Admissions</option>
                <option className="text-ink">Subject — Collaboration</option>
                <option className="text-ink">Subject — Mobility</option>
                <option className="text-ink">Subject — Visit</option>
              </select>
              <textarea rows={5} className="w-full bg-cream/10 border border-cream/20 px-4 py-3 rounded-md focus:outline-none focus:border-saffron" placeholder="Your message" />
              <button className="bg-saffron text-ink px-6 py-3 rounded-full font-medium hover:bg-cream transition-colors">Send message</button>
            </div>
          </form>

          <div className="rounded-2xl overflow-hidden border border-border bg-card flex flex-col">
            <iframe
              title="IIT Dharwad map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=75.0%2C15.45%2C75.1%2C15.5&layer=mapnik"
              className="w-full h-72 border-0"
              loading="lazy"
            />
            <div className="p-8 flex-1">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-saffron-deep mt-1" />
                <div>
                  <h4 className="font-display text-xl mb-1">Visit us</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Indian Institute of Technology Dharwad<br />
                    Permanent Campus, Chikkamalligawad<br />
                    Dharwad — 580 011, Karnataka, India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
