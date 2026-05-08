import { Link } from "@tanstack/react-router";
import { Linkedin, Facebook, Twitter, Youtube, MapPin, Mail, Phone } from "lucide-react";

const quickLinks = [
  "FAQs", "Campus Map", "Faculty Research Profile", "Feedback",
  "Buy & Sell @ IITDh", "Campus Facilities", "Guest House",
  "Students Council", "Gallery", "Activities",
];

const explore = [
  { to: "/admissions", label: "International Admissions" },
  { to: "/collaboration", label: "Collaboration & Mobility" },
  { to: "/partners", label: "Our Partners" },
  { to: "/visits", label: "Visits & Events" },
  { to: "/visa", label: "Visa & Immigration" },
  { to: "/downloads", label: "Downloads" },
];

export function Footer() {
  return (
    <footer className="bg-gradient-ink text-cream mt-32">
      <div className="container-editorial py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-warm flex items-center justify-center font-display font-bold text-lg">
                IR
              </div>
              <div>
                <div className="font-display text-lg">IIT Dharwad</div>
                <div className="text-xs uppercase tracking-[0.18em] text-cream/60">
                  International Relations Office
                </div>
              </div>
            </div>
            <p className="text-cream/70 text-sm leading-relaxed mb-6 max-w-sm">
              Building bridges between IIT Dharwad and the world — through
              students, scholars, partnerships and shared discovery.
            </p>
            <div className="space-y-2 text-sm text-cream/80">
              <div className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-saffron" /> Permanent Campus, Chikkamalligawad, Dharwad — 580 011</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-saffron" /> ir-office@iitdh.ac.in</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-saffron" /> +91 836 2212 801</div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-saffron mb-5">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              {explore.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-cream/80 hover:text-saffron transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-saffron mb-5">Quick Links</h4>
            <ul className="grid grid-cols-1 gap-2.5 text-sm">
              {quickLinks.map((l) => (
                <li key={l}><a href="#" className="text-cream/80 hover:text-saffron transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.2em] text-saffron mb-5">Follow</h4>
            <div className="flex gap-3">
              {[Linkedin, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="h-10 w-10 rounded-full border border-cream/20 flex items-center justify-center hover:bg-saffron hover:border-saffron hover:text-ink transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div className="mt-8 text-xs uppercase tracking-[0.2em] text-cream/50">
              Newsletter
            </div>
            <form className="mt-3 flex" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="your@email" className="flex-1 bg-cream/10 border border-cream/20 px-3 py-2 text-sm rounded-l-md focus:outline-none focus:border-saffron" />
              <button className="bg-saffron text-ink px-3 text-sm font-medium rounded-r-md hover:bg-saffron-deep">→</button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-cream/50">
          <div>© {new Date().getFullYear()} Indian Institute of Technology Dharwad — International Relations Office</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-saffron">Privacy</a>
            <a href="#" className="hover:text-saffron">Accessibility</a>
            <a href="#" className="hover:text-saffron">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
