export default function Card({
  children,
  className = '',
  variant = 'default',
  hover = true,
  icon = null,
  title = null
}) {
  const variants = {
    default: 'bg-white border border-brand-purpleLight/60',
    light: 'bg-brand-purpleLight/30 border border-brand-purpleLight/70',
    primary: 'bg-brand-purpleDark text-white border border-brand-marigold/20',
    accent: 'bg-brand-cream text-white border border-brand-purple',
    outline: 'bg-transparent border border-brand-purpleDark'
  }

  const hoverClass = hover
    ? 'hover:shadow-lg hover:-translate-y-1 hover:border-brand-purple transition-all duration-300'
    : ''

  return (
    <div className={`${variants[variant] || variants.default} rounded-xl shadow-sm ${hoverClass} p-6 mix-blend-normal ${className}`}>
      {(icon || title) && (
        <div className="flex items-center gap-3 mb-4">
          {icon && <span className="text-3xl drop-shadow-sm">{icon}</span>}
          {title && <h3 className={`text-lg font-medium tracking-tight ${variant === 'primary' ? 'text-white' : 'text-brand-purpleDark'}`}>{title}</h3>}
        </div>
      )}
      {children}
    </div>
  )
}
