import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Home, UtensilsCrossed, Trees, Bike, BookOpen, Heart } from "lucide-react";
import campus from "@/assets/hero-campus.jpg";
import karnataka from "@/assets/karnataka.jpg";

export const Route = createFileRoute("/life")({
  head: () => ({
    meta: [
      { title: "Life @ IIT Dharwad — IRO" },
      { name: "description", content: "Campus life at IIT Dharwad — accommodation, dining, facilities, and exploring Karnataka and India." },
    ],
  }),
  component: LifePage,
});

const facets = [
  { icon: Home, title: "Accommodation", text: "Modern hostels with single/twin rooms, common lounges and laundry." },
  { icon: UtensilsCrossed, title: "Dining", text: "Multiple messes serving North Indian, South Indian and continental fare." },
  { icon: Trees, title: "Green Campus", text: "470 acres of biodiversity, walking trails and quiet study spots." },
  { icon: Bike, title: "Sports & Wellness", text: "Cricket, football, tennis, yoga, gym and a 24×7 medical centre." },
  { icon: BookOpen, title: "Library & Labs", text: "Round-the-clock library access, advanced research labs and maker spaces." },
  { icon: Heart, title: "Clubs & Culture", text: "30+ clubs — robotics, music, photography, debate, dance and more." },
];

function LifePage() {
  return (
    <>
      <PageHero
        eyebrow="Life @ IIT Dharwad"
        title={<>Where study meets <span className="italic text-saffron">soul.</span></>}
        description="A residential campus designed for deep work, easy friendships and unhurried weekends in one of India's most charming regions."
      />

      {/* About campus */}
      <section className="container-editorial py-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-editorial">
            <img src={campus} alt="IIT Dharwad campus" loading="lazy" width={1920} height={1280} className="w-full h-[520px] object-cover" />
          </div>
          <div className="lg:col-span-5">
            <div className="text-xs uppercase tracking-[0.3em] text-saffron-deep mb-4">About the Campus</div>
            <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">A 470-acre canvas for ideas.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              The permanent campus at Chikkamalligawad sits on rolling terrain
              with thoughtful architecture that frames courtyards, light wells
              and tree-lined avenues. Everything is walkable; nothing is rushed.
            </p>
          </div>
        </div>
      </section>

      {/* Facilities grid */}
      <section className="bg-card border-y border-border">
        <div className="container-editorial py-24">
          <h2 className="font-display text-4xl md:text-5xl mb-12">Everything within reach</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
            {facets.map((f) => (
              <div key={f.title} className="bg-card p-10 hover:bg-background transition-colors group">
                <div className="h-12 w-12 rounded-full bg-saffron/15 flex items-center justify-center mb-6 group-hover:bg-saffron transition-colors">
                  <f.icon className="h-5 w-5 text-saffron-deep group-hover:text-ink" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Karnataka */}
      <section className="container-editorial py-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="text-xs uppercase tracking-[0.3em] text-saffron-deep mb-4">Beyond the Campus</div>
            <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
              Explore India<br />& Karnataka.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Hampi's stone temples, the beaches of Gokarna, Coorg's coffee
              hills, Goa's coastline — all within a weekend's reach. Bengaluru
              and Mumbai are a short flight away.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Hampi", "Goa", "Badami", "Coorg", "Gokarna", "Bengaluru", "Mumbai"].map((p) => (
                <span key={p} className="px-4 py-1.5 rounded-full border border-border text-sm hover:border-saffron hover:text-saffron-deep transition-colors cursor-default">{p}</span>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2 rounded-2xl overflow-hidden shadow-editorial">
            <img src={karnataka} alt="Karnataka heritage at sunset" loading="lazy" width={1600} height={1200} className="w-full h-[520px] object-cover" />
          </div>
        </div>
      </section>
    </>
  );
}
