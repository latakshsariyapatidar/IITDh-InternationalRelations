export default function Card({
  children,
  className = '',
  variant = 'default',
  hover = true,
  icon = null,
  title = null
}) {
  const variants = {
    default: 'bg-white border border-mist',
    light: 'bg-porcelain border border-mist',
    primary: 'bg-plum-deep text-white border border-plum',
    ink: 'bg-ink-deep text-white border border-ink',
    accent: 'bg-saffron-tint border border-saffron/40',
    outline: 'bg-transparent border border-plum/30'
  }

  const onDark = variant === 'primary' || variant === 'ink'
  const hoverClass = hover ? 'transition-colors duration-200 hover:border-plum/25' : ''

  return (
    <div className={`${variants[variant] || variants.default} rounded-2xl ${hoverClass} p-6 ${className}`}>
      {(icon || title) && (
        <div className="flex items-center gap-3 mb-4">
          {icon && <span className={`shrink-0 ${onDark ? 'text-saffron' : 'text-saffron-deep'}`}>{icon}</span>}
          {title && <h3 className={`text-xl font-medium leading-snug ${onDark ? 'text-white' : 'text-plum-deep'}`}>{title}</h3>}
        </div>
      )}
      {children}
    </div>
  )
}
