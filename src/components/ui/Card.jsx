export default function Card({
  children,
  className = '',
  border = false,
  variant = 'default',
  hover = true,
  icon = null,
  title = null
}) {
  const variants = {
    default: 'bg-white border border-[#A6D1E6]/20',
    light: 'bg-[#FEFBF6] border border-[#A6D1E6]/30',
    primary: 'bg-[#7F5283] text-[#FEFBF6] border border-[#A6D1E6]/20',
    accent: 'bg-[#A6D1E6] text-[#3D3C42] border border-[#A6D1E6]',
    outline: 'bg-transparent border border-[#7F5283]'
  }

  const hoverClass = hover
    ? 'hover:shadow-lg hover:-translate-y-1 hover:border-[#7F5283]/40 transition-all duration-300'
    : ''

  return (
    <div className={`${variants[variant] || variants.default} rounded-xl shadow-sm ${hoverClass} p-6 mix-blend-normal ${className}`}>
      {(icon || title) && (
        <div className="flex items-center gap-3 mb-4">
          {icon && <span className="text-3xl drop-shadow-sm">{icon}</span>}
          {title && <h3 className={`text-lg font-medium tracking-tight ${variant === 'primary' ? 'text-[#FEFBF6]' : 'text-[#3D3C42]'}`}>{title}</h3>}
        </div>
      )}
      {children}
    </div>
  )
}
