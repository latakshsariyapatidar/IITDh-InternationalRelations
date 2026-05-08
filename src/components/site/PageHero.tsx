import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-ink text-cream">
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: "radial-gradient(circle at 20% 50%, var(--saffron) 0, transparent 40%), radial-gradient(circle at 80% 20%, var(--teal) 0, transparent 40%)",
      }} />
      <div className="container-editorial relative py-24 md:py-32">
        {eyebrow && (
          <div className="text-xs uppercase tracking-[0.3em] text-saffron mb-6 animate-fade-up">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-5xl md:text-7xl font-light text-balance leading-[1.05] max-w-4xl animate-fade-up">
          {title}
        </h1>
        {description && (
          <p className="mt-8 text-lg md:text-xl text-cream/75 max-w-2xl leading-relaxed animate-fade-up">
            {description}
          </p>
        )}
        {children && <div className="mt-10 animate-fade-up">{children}</div>}
      </div>
    </section>
  );
}
