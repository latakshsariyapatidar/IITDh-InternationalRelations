export default function SectionHeader({
  title,
  subtitle,
  centered = true,
  badge,
  badgeText,
  className = '',
}) {
  const showBadge = Boolean(badge || badgeText)

  return (
    <div className={`mb-8 flex flex-col ${centered ? 'items-center text-center' : 'items-start text-left'} ${className}`}>
      {showBadge && (
        <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1 rounded-full bg-brand-purpleLight/40 border border-brand-purpleLight/80 text-brand-purpleDark shadow-2xs">
          {badge && <span className="text-base text-brand-purple">{badge}</span>}
          {badgeText && (
            <span className="text-xs font-semibold tracking-wider uppercase">
              {badgeText}
            </span>
          )}
        </div>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-brand-purpleDark mb-2 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm md:text-base text-brand-purpleDark/75 max-w-2xl font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
