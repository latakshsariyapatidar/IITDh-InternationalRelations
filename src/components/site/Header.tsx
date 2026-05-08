import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";

const primary = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/life", label: "Life @ IITDh" },
  { to: "/contact", label: "Contact" },
];

const secondary = [
  { to: "/admissions", label: "Admissions" },
  { to: "/collaboration", label: "Collaboration & Mobility" },
  { to: "/partners", label: "Partners" },
  { to: "/visits", label: "Visits" },
  { to: "/visa", label: "Visa & Immigration" },
  { to: "/downloads", label: "Downloads" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 bg-background/90 backdrop-blur-md ${
        scrolled ? "border-b border-border shadow-soft" : ""
      }`}
    >
      <div className="container-editorial">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-full bg-gradient-warm flex items-center justify-center text-primary-foreground font-display font-bold text-lg shadow-soft">
              IR
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="font-display text-base font-semibold">IIT Dharwad</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                International Relations
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {primary.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="px-3 py-2 text-sm font-medium rounded-md hover:text-accent transition-colors"
                activeProps={{ className: "text-accent" }}
              >
                {l.label}
              </Link>
            ))}
            <button className="ml-2 p-2 rounded-full hover:bg-muted transition-colors" aria-label="Search">
              <Search className="h-4 w-4" />
            </button>
          </nav>

          <button
            className="lg:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Secondary nav strip */}
        <div className="hidden lg:block border-t border-border/50">
          <div className="flex items-center gap-6 overflow-x-auto py-2.5 text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {secondary.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="whitespace-nowrap hover:text-foreground transition-colors"
                activeProps={{ className: "text-accent" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-up">
          <div className="container-editorial py-4 flex flex-col gap-1">
            {[...primary, ...secondary].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm rounded-md hover:bg-muted"
                activeProps={{ className: "text-accent font-semibold" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
