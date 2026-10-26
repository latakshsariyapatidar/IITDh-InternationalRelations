export default function SectionHeader({
  title,
  subtitle,
  centered = false,
  badge,
  className = '',
  tone = 'light',
  // Kept for existing callers; the site no longer shows an all-caps label
  // above headings.
  // eslint-disable-next-line no-unused-vars
  badgeText,
}) {
  const onDark = tone === 'dark'

  return (
    <div className={`mb-10 flex flex-col ${centered ? 'items-center text-center' : 'items-start text-left'} ${className}`}>
      <h2 className={`flex items-center gap-3 text-3xl md:text-[2.5rem] leading-[1.1] font-medium tracking-[-0.01em] ${onDark ? 'text-white' : 'text-plum-deep'}`}>
        {badge && <span aria-hidden="true" className={`shrink-0 ${onDark ? 'text-saffron' : 'text-saffron-deep'}`}>{badge}</span>}
        <span>{title}</span>
      </h2>
      {subtitle && (
        <p className={`mt-3 max-w-2xl text-base md:text-lg leading-relaxed ${onDark ? 'text-white/75' : 'text-quiet'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
