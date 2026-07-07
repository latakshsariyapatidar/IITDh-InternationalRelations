export default function SectionHeader({ title, subtitle, centered = true, badge }) {
  return (
    <div className={`mb-12 flex flex-col ${centered ? 'items-center text-center' : 'items-start text-left'}`}>
      <div className="inline-flex items-center gap-3 mb-4 px-4 py-1.5 rounded-full bg-brand-purpleLight/35 border border-brand-purpleLight/80 shadow-sm">
        {badge && <span className="text-xl">{badge}</span>}
        <span className="text-xs font-semibold text-brand-purpleDark tracking-widest uppercase">
          {subtitle ? 'Featured' : 'Discover'}
        </span>
      </div>
      <h2 className="text-2xl md:text-3xl font-light text-brand-purpleDark mb-4 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base text-brand-purpleDark/80 max-w-2xl font-light leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
